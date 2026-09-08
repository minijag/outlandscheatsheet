"""Scan ClassicUO journals using the boss roster in src/data.js (stdlib only)."""
import argparse
import csv
import html
import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LOGS = Path(r"C:\UO Outlands\ClassicUO\Data\Client\JournalLogs")
ENTRY = re.compile(r"^\[(?P<time>[^\]]+)\]\s*(?P<speaker>[^:]*):\s?(?P<phrase>.*)$")
DAMAGE_NUMBER = re.compile(r"[+\-−]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?")
EXCLUDED_PHRASES = {
    "*potion stuck*": "potion_stuck",
    "*increases in size*": "increases_in_size",
    "*looks calmed*": "looks_calmed",
    "*looks furious*": "looks_furious",
    "*chilled*": "chilled",
    "*looks violently ill*": "looks_violently_ill",
    "*dreamlull*": "dreamlull",
    "*taunted*": "taunted",
    "[lethal poison]": "lethal_poison",
    "[deadly poison]": "deadly_poison",
    "[lesser poison]": "lesser_poison",
    "[boss]": "boss_label",
    "[omni boss]": "omni_boss_label",
    "[mini boss]": "mini_boss_label",
    "[contested boss]": "contested_boss_label",
    "[greater poison]": "greater_poison",
}
EXCLUDED_PREFIXES = {
    "[summoned by": "summoned_by",
    "*barding break": "barding_break",
    "*discord": "discord",
}


def exclusion_reason(phrase):
    reason = EXCLUDED_PHRASES.get(phrase.strip().casefold())
    if reason:
        return reason
    for prefix, reason in EXCLUDED_PREFIXES.items():
        if phrase.strip().casefold().startswith(prefix):
            return reason
    if DAMAGE_NUMBER.fullmatch(phrase.strip()):
        return "damage_number"
    return None


def load_bosses(source):
    # Read data, never execute JavaScript. Require the project's name/type pair.
    pattern = r'''name:\s*(['"])(.*?)\1\s*,\s*type:\s*(['"])(.*?)\3'''
    bosses = [{"name": m[1], "type": m[3]} for m in re.findall(pattern, source.read_text(encoding="utf-8"))]
    if not bosses or len({b["name"] for b in bosses}) != len(bosses):
        raise ValueError("Boss roster is empty or contains duplicate names; check the source format")
    return bosses


def normalize(value):
    return " ".join(value.replace("’", "'").casefold().split())


def aliases_for(name):
    base = re.sub(r"^the\s+", "", normalize(name))
    names = {base}
    if base in {"aegis high priest", "aegis high priestess"}:
        names.update({"aegis high priest", "aegis high priestess"})
    if base == "kraul hivemother":
        for variant in ("siltsifter", "corrosive", "foulglow", "spelltouched"):
            names.update({f"{variant} hivemother", f"{variant} kraul hivemother"})
    return names | {"the " + alias for alias in names}


def open_log(path):
    with path.open("rb") as stream:
        prefix = stream.read(4)
    encoding = "utf-16" if prefix.startswith((b"\xff\xfe", b"\xfe\xff")) else "utf-8-sig"
    # Surrogate escapes preserve undecodable bytes and make them reportable.
    return path.open(encoding=encoding, errors="surrogateescape")


def scan(logs, source, output):
    bosses = load_bosses(source)
    aliases = {alias: b["name"] for b in bosses for alias in aliases_for(b["name"])}
    matcher = re.compile(r"(?<!\w)(?:" + "|".join(re.escape(a) for a in sorted(aliases, key=len, reverse=True)) + r")(?!\w)", re.I)
    files = sorted(p for p in logs.rglob("*") if p.is_file() and p.suffix.lower() in {".txt", ".log"})
    if not files:
        raise ValueError(f"No .txt or .log files found in {logs}")
    output.mkdir(parents=True, exist_ok=True)
    (output / "boss_names.txt").write_text("\n".join(b["name"] for b in bosses) + "\n", encoding="utf-8")
    counts = Counter()
    samples = {}
    stats = {"files_found": len(files), "files_scanned": 0, "lines": 0, "decoding_issue_lines": 0, "filtered_lines": dict.fromkeys([*EXCLUDED_PHRASES.values(), *EXCLUDED_PREFIXES.values(), "damage_number", "own_name"], 0), "errors": []}
    with (output / "occurrences.csv").open("w", newline="", encoding="utf-8-sig") as dest:
        writer = csv.writer(dest)
        writer.writerow(["boss", "category", "phrase", "timestamp", "speaker", "file", "line", "raw_line"])
        for index, path in enumerate(files, 1):
            try:
                with open_log(path) as stream:
                    for number, raw in enumerate(stream, 1):
                        stats["lines"] += 1
                        if not raw.isascii() and any(0xDC80 <= ord(c) <= 0xDCFF for c in raw):
                            stats["decoding_issue_lines"] += 1
                            raw = raw.encode("utf-8", "backslashreplace").decode("utf-8")
                        raw = raw.rstrip("\r\n")
                        hits = {aliases[normalize(m.group())] for m in matcher.finditer(raw.replace("’", "'"))}
                        if not hits:
                            continue
                        entry = ENTRY.match(raw)
                        speaker = entry["speaker"].strip() if entry else ""
                        phrase = entry["phrase"].strip() if entry else raw
                        reason = exclusion_reason(phrase)
                        if reason:
                            stats["filtered_lines"][reason] += 1
                            continue
                        timestamp = entry["time"] if entry else ""
                        spoken_by = aliases.get(normalize(speaker))
                        if spoken_by and aliases.get(normalize(phrase)) == spoken_by:
                            stats["filtered_lines"]["own_name"] += 1
                            continue
                        for boss in sorted(hits):
                            category = "boss speech" if boss == spoken_by else "other mention"
                            key = (boss, category, phrase)
                            counts[key] += 1
                            samples.setdefault(key, (str(path), number, timestamp))
                            writer.writerow([boss, category, phrase, timestamp, speaker, str(path), number, raw])
                stats["files_scanned"] += 1
            except (OSError, UnicodeError) as exc:
                stats["errors"].append({"file": str(path), "error": str(exc)})
            if index % 100 == 0:
                print(f"Scanned {index}/{len(files)} files", flush=True)
    rows = []
    for key, count in sorted(counts.items(), key=lambda item: (item[0][0], item[0][1], -item[1], item[0][2])):
        file, line, timestamp = samples[key]
        rows.append(dict(zip(["boss", "category", "phrase", "count", "example_file", "example_line", "example_timestamp"], [*key, count, file, line, timestamp])))
    fields = ["boss", "category", "phrase", "count", "example_file", "example_line", "example_timestamp"]
    with (output / "phrases.csv").open("w", newline="", encoding="utf-8-sig") as dest:
        writer = csv.DictWriter(dest, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    for boss in bosses:
        speech = [r for r in rows if r["boss"] == boss["name"] and r["category"] == "boss speech"]
        boss.update(unique_phrases=len(speech), occurrences=sum(r["count"] for r in speech))
    report = {"generated_at": datetime.now().astimezone().isoformat(), "logs": str(logs), "source": str(source), "stats": stats, "bosses": bosses, "phrases": rows}
    (output / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    write_html(output / "report.html", report)
    print(json.dumps({**stats, "bosses": len(bosses), "speech_phrases": sum(b["unique_phrases"] for b in bosses), "speech_occurrences": sum(b["occurrences"] for b in bosses), "report": str(output / "report.html")}, indent=2))
    return 1 if stats["errors"] or stats["decoding_issue_lines"] else 0


def write_html(path, report):
    esc = lambda value: html.escape(str(value), quote=True)
    roster = "".join(f'<tr><td>{esc(b["name"])}</td><td>{esc(b["type"])}</td><td>{b["unique_phrases"]}</td><td>{b["occurrences"]}</td></tr>' for b in report["bosses"])
    rows = "".join(f'<tr data-category="{esc(r["category"])}"><td>{esc(r["boss"])}</td><td>{esc(r["category"])}</td><td>{esc(r["phrase"])}</td><td>{r["count"]}</td><td>{esc(r["example_file"])}:{r["example_line"]}<br>{esc(r["example_timestamp"])}</td></tr>' for r in report["phrases"])
    path.write_text('''<!doctype html><html lang="en"><meta charset="utf-8"><title>Boss journal phrases</title>
<style>body{font:16px system-ui;margin:32px;background:#111820;color:#e4ebf2}table{border-collapse:collapse;width:100%;margin:20px 0}th,td{padding:9px;border-bottom:1px solid #354250;text-align:left;vertical-align:top}th{background:#233141;position:sticky;top:0}td:last-child{overflow-wrap:anywhere}input,select{font:inherit;padding:9px}a{color:#9bd2ff}small{color:#b4c1ce}</style>
<h1>Boss journal phrases</h1><p>''' + esc(report["generated_at"]) + " — " + esc(report["logs"]) + '''</p>
<p>Filters exclude ''' + esc(", ".join(EXCLUDED_PHRASES)) + '''; messages starting with ''' + esc(", ".join(EXCLUDED_PREFIXES)) + ''' (all case-insensitive); and numeric-only damage messages from all outputs. Other labels, spell words and emotes are retained. Other mentions may be player chat or system messages. Counts are journal occurrences, including repeated/overlapping logs; phrase case and punctuation remain distinct. Only phrases present in these logs can be found.</p>
<p><a href="phrases.csv">Phrase counts (CSV)</a> · <a href="occurrences.csv">Every occurrence and source (CSV)</a> · <a href="boss_names.txt">Boss names</a> · <a href="report.json">JSON</a></p>
<pre>''' + esc(json.dumps(report["stats"], indent=2)) + '''</pre><h2>Boss coverage</h2>
<table><thead><tr><th>Boss</th><th>Type</th><th>Unique speech phrases</th><th>Speech occurrences</th></tr></thead><tbody>''' + roster + '''</tbody></table>
<h2>Phrase review</h2><input id="search" aria-label="Search boss or phrase" placeholder="Search boss or phrase…"><select id="category" aria-label="Category"><option>boss speech</option><option>other mention</option><option>all</option></select><p id="visible"></p>
<table><thead><tr><th>Boss</th><th>Category</th><th>Exact phrase</th><th>Count</th><th>Example source</th></tr></thead><tbody id="phrases">''' + rows + '''</tbody></table>
<script>const search=document.getElementById('search'),category=document.getElementById('category');function filter(){let n=0;for(const row of document.querySelectorAll('#phrases tr')){row.hidden=!(row.textContent.toLowerCase().includes(search.value.toLowerCase())&&(category.value==='all'||row.dataset.category===category.value));if(!row.hidden)n++}document.getElementById('visible').textContent=n+' distinct phrases shown'}search.oninput=filter;category.onchange=filter;filter();</script></html>''', encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--logs", type=Path, default=DEFAULT_LOGS)
    parser.add_argument("--boss-source", type=Path, default=ROOT / "src" / "data.js")
    parser.add_argument("--output", type=Path, default=ROOT / "reports" / "boss-callouts")
    args = parser.parse_args()
    if not args.logs.is_dir():
        parser.error(f"Log directory does not exist: {args.logs}")
    # Generated reports must never become input files on subsequent scans.
    if args.output.resolve().is_relative_to(args.logs.resolve()):
        parser.error("Output must be outside the journal directory")
    try:
        return scan(args.logs.resolve(), args.boss_source.resolve(), args.output.resolve())
    except (ValueError, OSError) as exc:
        parser.exit(1, f"Error: {exc}\n")


if __name__ == "__main__":
    raise SystemExit(main())

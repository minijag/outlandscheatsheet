import contextlib
import io
import json
from pathlib import Path
import tempfile
import unittest

from scan_boss_callouts import scan


class ScannerTests(unittest.TestCase):
    def test_priestess_and_all_hivemother_variants(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            logs = root / "logs"
            logs.mkdir()
            source = root / "data.js"
            source.write_text("name: 'Aegis High Priest', type: 'Main Boss',\nname: 'Kraul Hivemother', type: 'Mini-Boss',", encoding="utf-8")
            speakers = ["Aegis High Priestess"] + [
                f"{variant} {prefix}Hivemother"
                for variant in ("Siltsifter", "Corrosive", "Foulglow", "Spelltouched")
                for prefix in ("", "Kraul ")
            ]
            lines = []
            for speaker in speakers:
                lines += [f"[09/08/2026 10:00] {speaker}: *test callout*\n",
                          f"[09/08/2026 10:00] {speaker}: {speaker}\n"]
            lines.append("[09/08/2026 10:00] Player: Aegis High Priestess is here\n")
            (logs / "test.txt").write_text("".join(lines), encoding="utf-8")
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(scan(logs, source, root / "out"), 0)
            report = json.loads((root / "out/report.json").read_text(encoding="utf-8"))
            speech = {r["boss"]: r["count"] for r in report["phrases"] if r["category"] == "boss speech"}
            self.assertEqual(speech, {"Aegis High Priest": 1, "Kraul Hivemother": 8})
            self.assertEqual(report["stats"]["filtered_lines"]["own_name"], 9)
            self.assertEqual(sum(r["count"] for r in report["phrases"] if r["category"] == "other mention"), 1)

    def test_counts_aliases_mentions_and_utf16(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            logs = root / "logs"
            logs.mkdir()
            source = root / "data.js"
            source.write_text("name: 'Forgotten King', type: 'Main Boss',\nname: 'Infernus', type: 'Main Boss',", encoding="utf-8")
            line = "[09/08/2026 10:00] The Forgotten King: Kneel: <mortal>!\n"
            (logs / "one.txt").write_text(line * 2 + "[09/08/2026 10:01] Player: Forgotten King is here\n[09/08/2026 10:02] Forgotten Kingsman: Ignore\n", encoding="utf-8")
            excluded = ["*potion stuck*", "*POTION STUCK*", "-169", "42", "-1,234", "*Increases in Size*", "*looks calmed*", "*looks furious*", "*chilled*"]
            excluded += ["*taunted*", "[Lethal Poison]", "[Deadly Poison]", "[Lesser Poison]", "[Boss]", "[Summoned by CtS]", "*barding break 1m 14s discord 1m 36s*", "*discord 2m 22s*"]
            excluded += ["[Contested Boss]", "[Greater Poison]"]
            excluded += ["Forgotten King", "the FORGOTTEN king"]
            excluded += ["[Omni Boss]", "[Mini Boss]"]
            excluded += ["*looks violently ill*", "*dreamlull*"]
            (logs / "two.log").write_text(line + "".join(f"[09/08/2026 10:00] The Forgotten King: {phrase}\n" for phrase in excluded), encoding="utf-16")
            with contextlib.redirect_stdout(io.StringIO()):
                result = scan(logs, source, root / "out")
            self.assertEqual(result, 0)
            report = json.loads((root / "out/report.json").read_text(encoding="utf-8"))
            self.assertEqual(report["stats"]["lines"], 30)
            self.assertEqual(report["stats"]["filtered_lines"].pop("looks_violently_ill"), 1)
            self.assertEqual(report["stats"]["filtered_lines"].pop("dreamlull"), 1)
            self.assertEqual(report["stats"]["filtered_lines"].pop("omni_boss_label"), 1)
            self.assertEqual(report["stats"]["filtered_lines"].pop("mini_boss_label"), 1)
            self.assertEqual(report["stats"]["filtered_lines"].pop("own_name"), 2)
            self.assertEqual(report["stats"]["filtered_lines"], {"potion_stuck": 2, "damage_number": 3, "increases_in_size": 1, "looks_calmed": 1, "looks_furious": 1, "chilled": 1, "taunted": 1, "lethal_poison": 1, "deadly_poison": 1, "lesser_poison": 1, "boss_label": 1, "summoned_by": 1, "barding_break": 1, "discord": 1, "contested_boss_label": 1, "greater_poison": 1})
            self.assertEqual(len(report["phrases"]), 2)
            speech = next(r for r in report["phrases"] if r["category"] == "boss speech")
            self.assertEqual(speech["count"], 3)
            self.assertEqual(speech["phrase"], "Kneel: <mortal>!")
            self.assertEqual(report["bosses"][1]["occurrences"], 0)
            self.assertIn("&lt;mortal&gt;", (root / "out/report.html").read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()

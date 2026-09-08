# outlandscheatsheet
UO Outlands boss and miniboss mechanics cheat sheet

## Journal phrase scanner

Run `python scripts/scan_boss_callouts.py` with Python 3.9+ (no dependencies).
It reads all `.txt` and `.log` files recursively from
`C:\UO Outlands\ClassicUO\Data\Client\JournalLogs`, using the current boss and
miniboss names in `src/data.js`. Name matching ignores case and accepts a leading
"The". Journals are read only.

`Aegis High Priestess` is the project's canonical name; the older `Aegis High Priest`
name remains a scanner alias and is accepted when importing older reports.
Siltsifter, Corrosive, Foulglow, and Spelltouched Hivemothers are grouped
under `Kraul Hivemother`, accepting names with or without `Kraul`. The original
speaker (including variant) is preserved in `occurrences.csv`. These aliases also
work with the own-name exclusion. Insatiable Maw has no known speech in this archive.

Open `reports/boss-callouts/report.html` to search phrases, see counts, and check
coverage for every boss, including bosses with no speech found. The output also
includes `boss_names.txt`, `phrases.csv`, `occurrences.csv` (every matching line
with its file, line number, and timestamp), and `report.json`.

The scanner excludes `*potion stuck*`, `*Increases in Size*`, `*looks calmed*`,
`*looks furious*`, `*chilled*`, `*looks violently ill*`, `*dreamlull*`,
`*taunted*`, `[Lethal Poison]`, `[Deadly Poison]`,
`[Lesser Poison]`, `[Greater Poison]`, `[Boss]`, `[Contested Boss]`,
`[Omni Boss]`, and `[Mini Boss]`.
It also excludes messages starting with
`[Summoned by`, `*barding break`, or `*discord` (including names and timers).
All phrase filters are case-insensitive. It also excludes numeric-only damage
messages and messages containing only the speaking boss's own name (including
an optional leading "The"). Longer callouts mentioning its name are retained. Damage
messages such as `-169`, `42`, and `-1,234` from every output. Filtered line counts
appear in the report. Callouts containing numbers are retained. Other callouts,
emotes, name labels, and spell words remain. Other name mentions are listed separately for review.
Counts preserve phrase case/punctuation and count every occurrence across files;
overlapping or copied journals are not deduplicated. This finds recorded phrases,
not abilities absent from the journals. UTF-8 and BOM-marked UTF-16 are supported;
read/decode issues are reported and produce a nonzero exit status.

Optional paths: `python scripts/scan_boss_callouts.py --logs "D:\Logs" --output "D:\BossReview" --boss-source "src/data.js"`.
Rerunning refreshes the output. Generated reports are ignored by Git because they
contain local journal content.

## Journal-backed encounter mechanics

`src/journal-callouts.json` contains reviewed boss-to-mechanic assignments, exact
phrases, counts, and example journal filenames/line numbers. The UI marks a
mechanic VERIFIED when it has recorded callouts, and UNVERIFIED otherwise.
Verification applies to the callout's presence; matching it to a mechanic and
describing its effects may involve inference. New mechanics describe the wording
without inventing damage, timing, targeting, or counterplay.

`python scripts/attach_boss_callouts.py` is a one-time initializer. If
`src/journal-callouts.json` exists, it exits without writing any files, preserving
all existing abilities and manual edits. Edit descriptions directly in that JSON
(or `src/data.js` for original abilities). It does not regenerate the scanner
report or edit HTML. During initial creation, new phrases that have no unique
mapping stop the import for review. Player/system mentions are not imported as
boss speech. Run `node --test scripts/test_journal_callouts.mjs` and `npm run build`
to validate the integration. The evidence includes journal filenames, but omits
absolute local paths and unrelated journal lines.

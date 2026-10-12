## Trilogy Revision 1.1.0

Offline AQA GCSE Combined Science: Trilogy (8464) revision.

- **641 original cards** across six papers and 24 topics; all 225 subject-content sections and 21 required practicals mapped.
- **Space twice:** reveal, then rate Good and advance. Keys 1–4 and Undo remain available.
- **Application questions in Settings:** off by default; enable scenarios/calculations for study and search.
- **Custom study decks:** save named card selections across subjects/papers/topics; edit, delete and back up them. Progress stays shared with the subject decks.
- Added 24 original application scenarios after reviewing every PDF in `Application questions`.
- Existing card IDs and legacy progress backups remain compatible.

### Reference review

The folder contains **25 PDFs**, not 19: 24 separate-science papers/mark schemes plus the Combined specification. All 952 pages were extracted with two agreeing extractors and rendered before flashcard changes. Tracked batch findings, source hashes and exclusions are in `docs/PDF-ANALYSIS.md` and `docs/pdf-analysis.json`.

Separate-only content was excluded using qualification 8464. Biology 2024 Paper 1 page 16 omits Figure 3 in the supplied original for copyright reasons; photograph-dependent content was not used. Answers are independently authored marking points, not official mark schemes or guaranteed marks. PDFs are not included in the app download.

### Windows download and checks

Run `Trilogy-Revision-1.1.0-Windows-x64.exe` on Windows 10 or later (x64); no Node.js installation needed. Portable, unsigned executable; checksum in `SHA256SUMS.txt`.

20 unit/content checks and browser interaction checks pass, including keyboard scheduling, application filtering, custom deck creation/editing/deletion, persistence and backup round-trip. The release workflow builds and smoke-tests the packaged app on Windows before uploading it.

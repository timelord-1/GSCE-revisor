## Trilogy Revision 1.5.0

Adds a **native Linux Mint download**, so the app can run directly without Wine.

- **Linux:** `Trilogy-Revision-1.5.0-Linux-x64.deb` for 64-bit Intel/AMD Debian/Ubuntu-based desktops, including Linux Mint. Install by double-clicking the file in Mint, or run `sudo apt install ./Trilogy-Revision-1.5.0-Linux-x64.deb`. Launch Trilogy Revision from the applications menu.
- **Windows:** `Trilogy-Revision-1.5.0-Windows-x64.exe` remains available.
- Linux respects desktop scaling and selects the native X11/Wayland backend. Explicit command-line backend choices are retained. No fixed scale factor or global sandbox bypass is added.
- All 689 cards, 91 application questions, custom cards/plans and 72 offline PDFs are retained.

**Moving from Wine:** export a JSON backup from Settings in the old app, then import it in the Linux app. Native Linux and Wine store progress separately; there is no automatic migration.

Linux packages are installed and exercised on Ubuntu 24.04, including fractional (125%) and HiDPI (200%) rendering-scale checks, flashcard review, card editing/plans and opening a bundled PDF. Windows also has a packaged-app smoke test. Unit/content, PDF and browser checks must pass before either download is published. `SHA256SUMS.txt` covers both packages.

Running natively removes Wine’s rendering layer, but it cannot guarantee sharper text on every Mint display configuration. X11 fractional desktop scaling can still introduce blur. The release has not been tested on the user’s laptop or a Linux Mint desktop. See README.md for display and backup instructions.

# 3D Parallax 2.3.0

Resizing a widget now scales its actual content. Fonts, shortcut icons and search controls follow the usable space inside the card, excluding the edit header and small padding. Long names, dates and clocks with seconds fit inside the available width. A Content size control lets you fine-tune each widget.

The default search and shortcut widgets use eight columns. Edit headers are smaller, and Tidy up removes empty rows without changing your widget widths. Undo restores the previous arrangement. Elements uses clear on/off switches alongside each widget's settings button.

Weather is off until enabled and uses a city you choose, without device location permission. It can be disabled in General. Ambient sound has working controls, and the popup opens the sound, backup and reset screens. Reset asks for confirmation and removes preferences, wallpaper files and restore copies, notes, tasks, AI keys and the selected weather city. Other open homepage tabs reload after a reset.

Fresh installs start with Minimal Dark and a Welcome heading. Saved themes and layouts are preserved. Static headlines render correctly in widget view, optional effects hide their related decorations, and feedback stays available without an automatic startup prompt.

## Install and check

Reload this folder at chrome://extensions, then open a new tab. In widget mode, drag a corner to resize; the content should grow immediately. Use the settings icon for content scale and exact dimensions. Tidy up and Undo help adjust older layouts with empty rows.

`npm test` checks UI navigation, persistence, forms, backups, link synchronization, real pointer resizing for eight visual widgets, long clock formats, content scale, tidy/undo, city selection/disable, reset cancellation and data deletion. A separate check loads the actual Manifest V3 extension to verify native storage, popup behavior, local assets and CSP. Backend tests use a mock email sender. No paid AI requests or feedback emails are sent by these tests.

## Store package

`python scripts/package-extension.py` creates a checked upload ZIP in dist. The [store kit](../store-kit/README.md) contains listing copy, privacy disclosures, store screenshots and promotional images. The privacy policy is available in the extension and as [public source](../PRIVACY.md). The backend also serves the same policy at /privacy.

Store submission and Google's review are completed through the publisher's Chrome Web Store account.

# 3D Parallax 2.6.0

The Chrome toolbar popup now reflects your saved homepage name, shortcuts, theme, active photo or video wallpaper, wallpaper count, ambient sound and layout. It refreshes when another homepage tab changes preferences, uses the shared theme catalog and reads the actual installed version. A compact, keyboard-accessible interface keeps homepage, settings, backup and reset actions within reach. Matrix rain changes apply to open homepage tabs.

Feedback opens the published extension's Chrome Web Store reviews page. Settings → Backup & help → Report a problem keeps private bug reports and feature suggestions connected to the existing publisher inbox. Public reviews remain available when the private feedback service is disabled. The Settings → AI features provider controls include Get Groq API, which opens Groq's official API key page.

The layered-P brand mark replaces the old cube in the installed toolbar icons, extension management icons, popup and homepage loading screen. New tab pages use the same bundled favicon. No new permissions, remotely executable code or analytics are added. Existing settings, provider keys and saved wallpapers are retained; no reset is needed.

Run `npm test` for the UI, resizing, native MV3, wallpapers and new popup regression suite. Run `npm run build:website` and `npm run test:website` for the public website and browser demo. `python scripts/package-extension.py` creates `dist/3D-Parallax-2.6.0.zip`. Follow [the existing-listing update guide](../store-kit/UPDATE-2.6.0.md) to upload it to the live store item. The Chrome Web Store listing icon must also be replaced with `store-kit/assets/icon128.png`.

## Previous release: 2.5.0

Feedback now reaches a private, persistent Supabase inbox in the publisher dashboard. Publishers can search/filter messages, assign priorities, keep private notes, track New/In progress/Resolved/Archived, resolve or archive a selection, and permanently delete a message. Optional email notification failures do not lose saved feedback. Earlier email-only submissions remain in the developer's email inbox.

The feedback dialog has readable colors, compact controls, clear privacy/support links and an optional rating that can be cleared. An unsent draft survives a reload in the same tab. Retrying after a connection failure reuses a random submission ID to prevent duplicates. A successful submission shows a reference and a Done button. Reset clears drafts; keyboard focus stays in the open dialog.

Centered alignment, resizing widget content together with its container, natural system fonts and concise settings are retained. The background picker offers Built-in themes, My wallpapers and a dynamic Library. Up to five local images/videos stay saved when switching themes. Library downloads can be saved and used offline.

The production backend is connected to Supabase. The catalog and private inbox schemas and production variables are configured, and a confirmed publisher account exists. Sign in to the publisher dashboard to publish your own licensed artwork and review new feedback. The catalog starts empty. Remote configuration contains validated data only; executable extension code stays bundled.

The public HTTPS API supports Chrome extension origins without binding access to an unpacked extension ID. Existing 2.4 feedback payloads remain compatible. The release adds no Chrome permissions. Privacy disclosures cover feedback storage, optional notifications and drafts retained in the current tab.

## Verify and package

Run `npm test` from the frontend root for UI, pointer resizing, native MV3, backgrounds, offline behavior and centered alignment. Run `npm test` and `npm run test:ui` in the backend for API/PostgreSQL and dashboard checks. Set `EXTENSION_REPO` to the frontend path and run `npm run test:extension` there for packaged MV3 ? HTTP feedback ? inbox ? publisher triage, including a lost-response retry. Fixtures do not send live email or publish artwork.

`python scripts/package-extension.py` builds the Chrome upload ZIP with the manifest at its root. The store kit contains listing images, copy and disclosures. Upload the package and complete the certifications in the Chrome Web Store dashboard; Google performs the store review.

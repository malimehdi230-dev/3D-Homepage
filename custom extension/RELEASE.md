# 3D Parallax 2.5.0

Feedback now reaches a private, persistent Supabase inbox in the publisher dashboard. Publishers can search/filter messages, assign priorities, keep private notes, track New/In progress/Resolved/Archived, resolve or archive a selection, and permanently delete a message. Optional email notification failures do not lose saved feedback. Earlier email-only submissions remain in the developer's email inbox.

The feedback dialog has readable colors, compact controls, clear privacy/support links and an optional rating that can be cleared. An unsent draft survives a reload in the same tab. Retrying after a connection failure reuses a random submission ID to prevent duplicates. A successful submission shows a reference and a Done button. Reset clears drafts; keyboard focus stays in the open dialog.

Centered alignment, resizing widget content together with its container, natural system fonts and concise settings are retained. The background picker offers Built-in themes, My wallpapers and a dynamic Library. Up to five local images/videos stay saved when switching themes. Library downloads can be saved and used offline.

The production backend is connected to Supabase. The catalog and private inbox schemas and production variables are configured, and a confirmed publisher account exists. Sign in to the publisher dashboard to publish your own licensed artwork and review new feedback. The catalog starts empty. Remote configuration contains validated data only; executable extension code stays bundled.

The public HTTPS API supports Chrome extension origins without binding access to an unpacked extension ID. Existing 2.4 feedback payloads remain compatible. The release adds no Chrome permissions. Privacy disclosures cover feedback storage, optional notifications and drafts retained in the current tab.

## Verify and package

Run `npm test` from the frontend root for UI, pointer resizing, native MV3, backgrounds, offline behavior and centered alignment. Run `npm test` and `npm run test:ui` in the backend for API/PostgreSQL and dashboard checks. Set `EXTENSION_REPO` to the frontend path and run `npm run test:extension` there for packaged MV3 ? HTTP feedback ? inbox ? publisher triage, including a lost-response retry. Fixtures do not send live email or publish artwork.

`python scripts/package-extension.py` builds the Chrome upload ZIP with the manifest at its root. The store kit contains listing images, copy and disclosures. Upload the package and complete the certifications in the Chrome Web Store dashboard; Google performs the store review.

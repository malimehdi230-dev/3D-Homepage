# Changelog — 3D Parallax New Tab

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.6.0] — 2026-10-14

- Reflect canonical homepage preferences in the toolbar popup, including active wallpapers, saved collection size, links, effects, ambient choice and layout.
- Share the theme catalog and derive version labels from the manifest; refresh the popup when another extension page changes preferences.
- Add compact popup controls that open the relevant settings section or background picker.
- Open Chrome Web Store reviews from Feedback buttons and the F shortcut; retain private reports in Backup & help.
- Add Get Groq API in provider settings and keep the controls usable on narrow screens.
- Adopt the layered-P logo in all installed icon sizes, the popup, loading screen and favicon.
- Add native MV3 popup regression coverage and refreshed listing assets. No permission changes.

## [2.5.0] — 2026-10-13

- Connect submitted feedback to the publisher's private inbox with systematic triage.
- Keep unsent drafts, allow optional ratings to be cleared, prevent duplicate retries and show submission references.

## [2.4.0] — 2026-10-13

- Fix centered shortcuts by removing inherited bottom-dock positioning; keep content centered on desktop and mobile.
- Add a compact background picker with built-in themes, five saved wallpapers and a live library.
- Preserve uploaded files when changing themes; migrate the previous single wallpaper and retain selection across reloads.
- Validate photos/videos before saving, reject a sixth file safely under concurrent imports, and clear the whole collection on reset.
- Add searchable, categorized, paginated backend wallpaper discovery with download and one-click offline save/use.
- Consume validated data-only feature settings, first-install defaults, support links and dismissible announcements.
- Add native MV3 wallpaper tests, updated privacy disclosures and the 2.4.0 store package.

## [2.3.0] — 2026-10-13

- Scale actual widget text, shortcut icons and search controls during resizing; fit long content and add per-widget content scale.
- Tighten headers and padding, narrow default search/links widgets, and add Tidy up with Undo.
- Use consistent element visibility switches and fix static widget headlines.
- Make weather opt-in with a city chooser and a disable control, without device location access.
- Repair popup backup, reset and ambient actions; add complete local reset with confirmation.
- Add calm first-install defaults, accessible feedback focus, support/privacy links, and remove automatic feedback prompts.
- Add store listing copy, disclosures, screenshots, promotional images, a public policy and reproducible packaging.

## [2.2.0] — 2026-10-12

### Changed
- Use system fonts, compact shortcuts, and a small inline Add link tile.
- Organize Settings into General, Background, Layout, AI features, and Backup & help.
- Simplify Customize into Elements, Effects, and Sizes with automatic saving.
- Bundle icon assets locally and restore visual preferences with an external MV3-compatible script.
- Exclude API keys from backups unless explicitly selected.

### Added
- Layout undo, keyboard movement, precise size/position controls, and overlap handling.
- Weather request caching, timeouts, and retry controls.
- Automated browser checks for the homepage and the loaded extension.

### Fixed
- Opening Settings, switching to the centered layout, restoring hidden widgets, and syncing shortcuts between layouts.
- Shortcut URL validation, unlimited shortcut rendering, popup name/theme counts, and native provider storage on import.
- Send feedback to `/api/feedback` and show a readable error if the service is unavailable.

## [2.1.0] — 2026-06-27

### Added
- **Toast notification system** (`window.toast()`) — replaces all `alert()` / `confirm()` calls with non-blocking success / error / info / warning toasts with animated progress bars
- **Loading screen** — full-screen fade-out splash rendered before the main UI to prevent layout flash on first load
- **Keyboard shortcuts overlay** — press `?` for a modal listing all 7 shortcuts (T, S, A, C, ?, Ctrl+K, Escape)
- **Customization panel** — slide-up panel (Ctrl+K) with live color pickers and toggles for matrix rain, particle depth, and parallax
- **Search engine selector** — Google, Bing, DuckDuckGo, YouTube toggle stored per session
- **Search history dropdown** — saves last 10 queries; click to re-run, individual delete, one-click clear all
- **Quick-links drag-to-reorder** — hold and drag any link card to a new position; order persists to `localStorage`
- **Template picker redesign** — gradient color-bar, active badge, keyboard navigation, toast on apply
- **Popup mini-dashboard** (v2.1.0) — stats row, template card preview, quick-launch chips, feature toggles, Export / Reset buttons
- **AI provider snippet importer** — paste a Groq JS / Python / curl snippet; key + model auto-detected and pre-filled
- **AI provider test toast** — pass / fail feedback surfaced via toast instead of console
- **Weather 30-minute cache** — avoids redundant Open-Meteo fetches; geo retry button on error
- **Fluid type scale (T02)** — CSS `clamp()` responsive sizing for name title, clock, date, search bar, and link labels; short-viewport overrides via `@media (max-height: 700px)`
- **Performance** — `requestAnimationFrame` for matrix rain, `requestIdleCallback` for deferred module init, scroll/resize throttle at 16 ms
- **Import/Export filename** — settings file now saved as `3d-parallax-settings.json`
- **Install-date tracking** — first-launch date stored in `localStorage` for popup stats
- **models.json datalist** — AI model input autocompletes from the bundled Groq models list

### Changed
- Manifest bumped to **v2.1.0**; `minimum_chrome_version` set to **109**
- CSP updated to `script-src 'self'; object-src 'self'` (no unsafe-inline / eval)
- `popup.js` migrated from `chrome.storage.sync` → `chrome.storage.local` for consistency with the main page
- `ai-providers.js` failover engine hardened with per-provider error isolation
- `wallpaper.js` wrapped in `try/catch` to prevent unhandled promise rejections crashing the page
- Settings footer version label updated to **v2.1.0**
- All remaining `alert()` calls removed; replaced with `window.toast()`

### Fixed
- Duplicate `initSearch()` definition removed from `script.js`
- XSS: all dynamic HTML rendered via `_esc()` throughout `renderLinks()`, `renderAIProviders()`, template grid, search history
- Dead files (`resume.txt`, `zipFile.zip`) deleted from repository
- `dev/` test-artifact folder added to `.gitignore`
- Wallpaper drag-and-drop no longer swallows the `dragover` event on the whole page

### Security
- No external JS loaded via CDN — all scripts are local (`'self'` CSP)
- API keys stored only in `localStorage` on the user's device; never transmitted to any first-party server
- `host_permissions` array left empty — outbound API calls are initiated by the user's own key

---

## [2.0.1] — 2025-xx-xx

- Initial public release on Chrome Web Store
- 18 3D parallax templates
- AI chat powered by Groq
- Custom wallpaper (image + video), weather widget, quick links

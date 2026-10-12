# 3D Parallax 2.2.0

The new interface uses native system fonts, compact shortcuts, and a consistent dark surface for controls. Your saved wallpaper, theme, links, and layout remain available.

## What changed

- Quick links use smaller cards and an inline plus tile. The full-width add-link header is gone.
- Settings has five sections: General, Background, Layout, AI features, and Backup & help. Advanced provider options are collapsed.
- Customize has Elements, Effects, and Sizes tabs. Controls update the page immediately and save on this device.
- Layout editing supports undo, keyboard movement, precise size and position controls, and automatic overlap handling. Hidden widgets can be restored from Elements.
- Shortcuts update immediately in both layouts, support reordering, and accept addresses such as `example.com`. Only HTTP and HTTPS addresses are accepted.
- The weather widget caches requests, times out unavailable requests, and offers a retry button.
- Startup preferences use an external script compatible with the extension's CSP. Icons are bundled locally, and remote font requests have been removed.
- Backups exclude API keys by default. Restoring included provider keys updates the extension's native storage too.
- Feedback uses the backend API route and shows readable service errors.
- The toolbar popup shows the correct theme count, saved shortcuts, and name. The privacy page now describes the optional network features and backups.

## Try the update

1. Open `chrome://extensions` and enable Developer mode.
2. Click **Load unpacked** and select this `custom extension` folder, or click **Reload** if it is already loaded.
3. Open a new tab. Use Settings for preferences, Customize for element visibility/effects/sizes, and the grid button to arrange widgets.

## Validation

Automated browser checks covered settings navigation, form validation, live effects and sizes, adding/removing/reordering shortcuts, more than twelve shortcuts, undo, overlap handling, widget visibility, persistence after reload, and narrow screens. Backup checks cover excluding keys by default, explicit key inclusion, and rejecting malformed imports.

The extension was also loaded directly in Chromium with Manifest V3: the new-tab override, native provider storage, restored startup preferences, popup, local asset loading, and CSP passed. Weather responses were mocked for repeatable interaction tests. Paid/live AI requests and feedback submissions were not sent.

The locally prepared ZIP contains the runtime files and licenses, with the manifest at its root. Development fixtures and browser profiles are excluded. The package has not been submitted to or approved by the Chrome Web Store. Store listing details and public hosting for the privacy policy are handled in the publisher's dashboard.

Browser checks can be rerun from the repository root with `npm install`, `npx playwright install chromium`, and `npm test`. Set `BROWSER_PATH` to use an existing Chromium executable. Tests store screenshots and isolated browser profiles in `.test-artifacts/`. Feedback tests use mocked responses and never send an email.

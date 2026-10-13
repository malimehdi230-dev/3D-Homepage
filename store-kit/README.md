# Chrome Web Store submission kit

The extension upload ZIP is generated separately from these listing assets. Screenshots show the running extension with example data; no external anime artwork is used.

| File | Use |
| --- | --- |
| `LISTING.md` | Listing copy, purpose, permission explanations and privacy practices |
| `assets/icon128.png` | Store icon |
| `assets/promo-small.png` | Required 440 × 280 promotional tile |
| `assets/promo-marquee.png` | Optional 1400 × 560 promotional image |
| `assets/01-homepage.png` | 1280 × 800 screenshot of the homepage |
| `assets/02-layout-editor.png` | 1280 × 800 screenshot of layout editing |
| `assets/03-settings.png` | 1280 × 800 screenshot of settings |
| `assets/04-elements.png` | 1280 × 800 screenshot of element controls |
| `assets/05-backgrounds.png` | 1280 × 800 screenshot of the saved wallpaper collection |

## Build and submit

1. From the repo root, run `npm install`, `npx playwright install chromium`, and `npm test`.
2. Run `python scripts/package-extension.py` to build `dist/3D-Parallax-2.4.0.zip`. The manifest is at the ZIP root. The script checks bundled assets and archive integrity.
3. `npm run store-assets` recreates the listing images from the actual loaded extension using an isolated test profile. An existing Chromium can be selected with `BROWSER_PATH`.
4. In your Chrome Web Store Developer Dashboard, create or update the item and upload the ZIP. Add the listing text and images above, verify the public privacy URL, fill the privacy fields, and provide your publisher support contact and any required account verification.
5. Preview the listing and submit for Chrome review. These files prepare the submission; only Google can approve it.

The publisher account, account verification, dashboard certifications, distribution settings and final submission must be completed in the publisher's account. No store credentials are stored in this repository.

The extension runs without weather or an AI key. Reviewers can load it, add a shortcut, switch to Widgets, resize the clock, use Tidy up and Undo, hide an element, add Notes, switch back to Centered, and inspect Privacy & support. Optional AI features need a compatible provider key supplied by the person testing them.

The backend status endpoint checks whether feedback sender environment variables exist. A configured status does not verify delivery or the sender domain. API tests mock email delivery and do not send messages.

Before submitting version 2.4.0, configure the Supabase project and production backend variables, publish your initial wallpaper collection in `/admin`, and verify Library → Save & use → offline reload in the production extension. The catalog is dynamic and begins empty; the ZIP contains no stock wallpaper catalog. The backend README provides the migration and setup steps. Developer controls contain data only, with no remotely executable code.

Image specifications are based on [Chrome's image requirements](https://developer.chrome.com/docs/webstore/images). Submission steps follow [the publishing documentation](https://developer.chrome.com/docs/webstore/publish).

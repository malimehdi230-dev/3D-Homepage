# Chrome Web Store submission kit

The extension upload ZIP is generated separately from these listing assets. Screenshots show the running extension with example data; no external anime artwork is used.

| File | Use |
| --- | --- |
| `LISTING.md` | Listing copy, purpose, permission explanations and privacy practices |
| `DESCRIPTION.md` | Ready-to-paste short and full Chrome Web Store descriptions |
| `brand-v2/` | New layered-P logo, transparent PNG exports and generation prompt |
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
2. Run `python scripts/package-extension.py` to build `dist/3D-Parallax-2.5.0.zip`. The manifest is at the ZIP root. The script checks bundled assets and archive integrity.
3. `npm run store-assets` recreates the listing images from the actual loaded extension using an isolated test profile. An existing Chromium can be selected with `BROWSER_PATH`.
4. In your Chrome Web Store Developer Dashboard, create or update the item and upload the ZIP. Add the listing text and images above, verify the public privacy URL, fill the privacy fields, and provide your publisher support contact and any required account verification.
5. Preview the listing and submit for Chrome review. These files prepare the submission; only Google can approve it.

The publisher account, account verification, dashboard certifications, distribution settings and final submission must be completed in the publisher's account. No store credentials are stored in this repository.

The extension runs without weather or an AI key. Reviewers can load it, add a shortcut, switch to Widgets, resize the clock, use Tidy up and Undo, hide an element, add Notes, switch back to Centered, and inspect Privacy & support. Optional AI features need a compatible provider key supplied by the person testing them.

The backend reports private inbox and optional email-notification configuration. Feedback is acknowledged after database storage; email failure does not lose it. The dashboard's Feedback section supports search, filters, priority, private notes, bulk triage and deletion. Earlier email-only feedback remains in the developer's email inbox. Tests do not send messages.

The Supabase schema and production backend variables are configured, and the live library/configuration endpoints are working. Before submitting version 2.5.0, sign in with your confirmed publisher account, publish your initial wallpaper collection in [the publisher dashboard](https://3-d-parallax-backend.vercel.app/admin), and check Library → Save & use with your artwork. The catalog is dynamic and begins empty; the ZIP contains no stock wallpaper catalog. The backend README provides the account and deployment steps. The public API works with a Web Store extension origin without an unpacked ID allowlist. Developer controls contain data only, with no remotely executable code.

Image specifications are based on [Chrome's image requirements](https://developer.chrome.com/docs/webstore/images). Submission steps follow [the publishing documentation](https://developer.chrome.com/docs/webstore/publish).

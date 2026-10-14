# Update the live 3D Parallax extension to 2.6.0

The existing store item is [3D Parallax](https://chromewebstore.google.com/detail/3d-parallax/cgodhedchgcogoicfmdpgfopbfkcafkn), ID `cgodhedchgcogoicfmdpgfopbfkcafkn`. Use that same item to preserve its users, ratings and URL.

## Files to use

- **Extension package:** `3D-Parallax-2.6.0.zip`, with `manifest.json` at the ZIP root. It contains the complete extension. Do not upload the repository, website, backend, store kit or brand kit as the extension package.
- **Listing icon:** `store-kit/assets/icon128.png`, the new layered-P logo. Uploading the package updates installed icons; the store listing artwork is managed separately.
- **Updated listing images:** five 1280 × 800 screenshots in `store-kit/assets/01-homepage.png` through `05-backgrounds.png`, plus `promo-small.png` and optional `promo-marquee.png`.
- **Privacy answers:** `store-kit/PRIVACY-ANSWERS.md`. Public policy: https://3dparallax.app/privacy.html. Permissions remain `storage` and `unlimitedStorage`; remote code remains **No**.

## Upload this update

1. Sign in to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) with the publisher account that owns the live item.
2. Open **3D Parallax**. In **Package**, select **Upload New Package** and upload `3D-Parallax-2.6.0.zip`.
3. Confirm the dashboard reads version **2.6.0**. The live version is 2.5.0, so this version is higher. Replace the listing icon and any outdated screenshots. Review the privacy practices and publisher certifications; the new release adds no permissions.
4. Preview the changes, then **Submit for Review**. Choose automatic publication after approval or the dashboard's manual publication option. If choosing manual publication, publish the approved update when ready.
5. During review, the existing live release remains available. Once the new release is published, Chrome delivers it to existing users automatically. Verify version 2.6.0 in `chrome://extensions` and check the new toolbar icon and live popup. A pending review or approval alone does not update installed copies.

These steps follow [Chrome's official update instructions](https://developer.chrome.com/docs/webstore/update). The files are prepared for upload; they have not been submitted to Google automatically.

Suggested reviewer note:

> The toolbar popup now reflects the user's saved homepage preferences, including their selected theme or wallpaper, shortcuts and layout. Feedback opens this extension's Chrome Web Store reviews page. Private bug reports remain under Settings → Backup & help → Report a problem. This release adopts the new layered-P icon and adds a link to Groq's API key console. No permissions were added. The homepage works without an AI key or weather setup.

## Future updates

1. Change source code in `custom extension`, then increase the numeric `version` in its `manifest.json` above the published version, for example 2.6.1 for a later fix. Version labels read the manifest automatically.
2. Run `npm test`. For website/demo changes, also run `npm run build:website` and `npm run test:website`. Use a fresh test profile for installation checks and an existing profile to verify settings survive the update.
3. Build the full ZIP with `python scripts/package-extension.py`. Update release notes, privacy disclosures and listing images whenever the behavior changes.
4. Upload the new ZIP through **Package → Upload New Package** on the same store item, then submit it for review. A GitHub push or website deployment alone does not update Chrome Web Store users.
5. Publisher wallpaper uploads and validated backend configuration changes appear without a new extension package. Changes to executable extension code need a versioned store release. Keep existing API behavior compatible while older installed versions remain in use.

The 2.6.0 update does not migrate or clear user preferences, saved provider keys or wallpapers. Users should not reset or uninstall to receive it. Removing an installed extension can erase its local data.

# Chrome Web Store privacy form — 3D Parallax 2.5.0

Checked against the bundled extension's manifest, storage, wallpaper, network and interaction code on October 14, 2026. Each paste-ready justification is below the form's 1,000-character limit.

## Single purpose description

3D Parallax replaces Chrome's New Tab page with a customizable personal homepage. Users can personalize that homepage with wallpapers, themes, website shortcuts, web search and resizable widgets. Optional notes, tasks, city weather, ambient sound and AI assistance support the same personal-homepage purpose.

## storage justification

The storage permission saves the user's personal homepage settings and optional AI provider configuration on their device. This includes the display name, selected theme, layout, widget preferences, shortcuts, notes, tasks and weather city. The toolbar popup reads and updates the same saved preferences. This lets the personalized New Tab page retain the user's choices across browser sessions. It does not grant access to Chrome's browsing history or other tabs.

## unlimitedStorage justification

Users can save up to five image or video wallpapers on their device for their personal New Tab background. These media files are stored locally in IndexedDB for reuse and offline access, and can exceed ordinary storage quotas. unlimitedStorage keeps these user-selected wallpaper files available locally. Personal wallpaper uploads are not automatically sent to the developer.

## Are you using remote code?

Select **No, I am not using remote code**. Change the Yes selection shown in your screenshot. With No selected, the remote-code justification should no longer be required.

If a reviewer asks for an explanation:

All executable JavaScript is bundled inside the extension. Online requests retrieve data such as weather, wallpaper metadata and media, public feature settings, search results and AI responses. Returned JavaScript is not executed. The extension does not load external scripts, download executable modules or evaluate remote code.

A backend, a remote wallpaper or an AI API response is not, by itself, remotely executed code. Google's definition distinguishes executable JavaScript/WASM from data.

## Data usage selections

Disclose local handling as well as transmission. Do not select a blanket no-user-data statement: the extension stores user-entered data and offers optional online features.

| Category | Selection | Actual handling |
| --- | --- | --- |
| Personally identifiable information | Select | A user-entered display name is stored locally. Feedback or AI prompts can include personal information the user chooses to submit. |
| Authentication information | Select | Optional AI provider API keys are stored on the device and sent to the configured provider for requested AI features and connection tests. |
| Location | Select | The user's chosen weather city and its coordinates are stored locally and used with Open-Meteo. No device geolocation permission is requested. Network services also receive ordinary connection information. |
| Web history | Select | Searches entered in the homepage search box and manually saved shortcut URLs are handled locally. The extension does not read Chrome's browsing history. |
| Personal communications | Select | Optional AI messages go to the user's selected provider. Submitted feedback goes to the developer's private support inbox, with an optional email notification. |
| Website content | Select | User-entered notes, tasks and headlines, chosen wallpaper files, links and optional search-result content are handled for homepage features. Other visited pages are not read. |
| User activity | Select for conservative disclosure | Pointer positions and drag/resize interactions are processed locally for parallax effects and layout controls. There is no interaction analytics, persistent cursor log or keystroke log. This selection describes local interface handling, not tracking across websites. |
| Financial and payment information | Leave unselected | No payment, bank or financial-data collection feature is implemented. Optional AI usage charges are handled by the user's provider. |
| Health information | Leave unselected | No health-data collection feature is implemented. |

The local mouse-position interpretation is deliberately conservative because Google's user-data guidance includes local processing. It does not mean that the extension collects behavioral analytics.

## Data-use certifications

The current code and published policy support the following statements. Read and tick the certifications only if they also match how you actually operate the extension and its backend:

- User data is not sold; transfers are limited to the allowed user-facing features and disclosed support purposes.
- User data is used only for the personal homepage, its chosen optional features and support/improvement of that product.
- User data is not used for creditworthiness or lending decisions.

Do not describe the extension as sending no data anywhere. Optional AI, weather, search, wallpaper discovery/downloads, public configuration and submitted feedback make network requests.

## URLs

Privacy policy: https://3dparallax.app/privacy.html

Website: https://3dparallax.app

Help: https://3dparallax.app/help

Publisher support email, where requested: use the email address you want publicly listed for support.

Store category: Productivity. Language: English.

## Sources and code evidence

- [Chrome privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Google's local-data disclosure requirements](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Remote hosted code definition](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)
- `custom extension/manifest.json`: storage and unlimitedStorage only; no host, tabs, history or location permissions.
- `wallpaper.js`: wallpaper files in IndexedDB.
- `ai-providers.js`: local provider keys and data-only API requests.
- `script.js`, `interactions.js`: local pointer positions for visual effects and drag controls; homepage searches and preferences.
- `feedback.js`, `weather.js`, `widgets.js`, `backgrounds.js`: explicit network features described above.

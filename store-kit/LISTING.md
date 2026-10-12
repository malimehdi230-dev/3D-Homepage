# Chrome Web Store listing — 2.3.0

Name: **3D Parallax**

Short description (matches the manifest):

Make each new tab yours with resizable widgets, quick links, 18 themes, custom wallpapers, optional weather and AI tools.

Category: **Productivity**. Language: **English**.

## Full description

Make your new tab a place you enjoy coming back to.

3D Parallax gives you a personal homepage with useful widgets, your favorite links and a background that feels like you. Keep a simple centered layout, or arrange everything yourself.

- Resize widgets and their content together. Move them with drag and drop, fine-tune their size, or remove empty rows with Tidy up.
- Keep favorite websites close with compact shortcuts you can add, remove and reorder.
- Choose from 18 themes, including Minimal Dark, or use your own image or video wallpaper.
- Add a clock, date, greeting, search, weather, notes, tasks, countdown and ambient sound.
- Use clear settings to show or hide elements and adjust sizes and visual effects.
- Undo layout changes and export a backup of your setup.
- Turn on local weather when you want it. Choose a city for the forecast; device location is never accessed.
- Connect your own compatible AI provider for optional chat, headlines and styling. AI features require your own API key and may incur provider charges.

Your saved preferences stay on this device. There are no ads or analytics SDKs. Optional weather, AI, wallpaper search and submitted feedback contact the services described in the privacy policy. API keys are excluded from backups unless you explicitly choose to include them.

This extension replaces Chrome's New Tab page. It does not access your other tabs or Chrome browsing history. No account is needed for the ordinary homepage features.

## URLs

Homepage: https://3dparallax.app

Support: https://github.com/malimehdi230-dev/3D-Homepage/issues

Privacy policy: https://3dparallax.app/privacy.html

Public policy source/fallback: https://github.com/malimehdi230-dev/3D-Homepage/blob/main/PRIVACY.md

## Permission explanations

**storage:** Saves your personal homepage settings, shortcuts and optional AI provider keys on your device. The toolbar popup reads the same preferences.

**unlimitedStorage:** Stores user-uploaded image and video wallpaper files in IndexedDB without the normal extension storage quota. Wallpaper files remain on this device unless explicitly included in an exported backup.

**Location permission:** None. Weather uses a city explicitly chosen by the user; it does not read device location.

**Remote code:** No. JavaScript, styles and icons are bundled. AI responses, search results, weather and wallpaper images are data; returned JavaScript is not executed. No remote libraries or eval are used.

## Single purpose

Provide a customizable personal Chrome New Tab homepage with shortcuts, search and widgets. Themes, uploaded wallpapers, local weather, notes, tasks, ambient sound and optional AI assistance personalize that homepage.

## Privacy practices to declare

Chrome requires disclosure of local processing as well as transmission. Describe the following handling accurately in the dashboard:

| Data category | Handling |
| --- | --- |
| Personally identifiable information | A user-entered display name is stored on device. Feedback or AI prompts may contain information the user chooses to submit. |
| Authentication information | Optional AI provider API keys are stored on device and sent only to the configured provider for the requested AI feature or test. |
| Location | The user-selected city is stored locally; that city’s coordinates are sent directly to Open-Meteo for a forecast. City searches are sent to its geocoding service. Device location is not accessed. |
| Web history | Searches made in the centered homepage search box are saved locally; manually saved shortcut URLs are stored locally. Chrome browsing history is not read. |
| Personal communications | User-entered AI messages go to the chosen provider; submitted feedback goes to the developer. |
| Website content | User-entered notes/tasks/headlines, uploaded wallpaper files and requested web-search results are handled for homepage features. |

No dedicated collection of financial/payment data, health data or browsing interaction telemetry is implemented. Do not select “no user data” because the app stores some data locally and offers optional network features. Confirm the dashboard's final category wording against these actual behaviors, and certify the Limited Use statements only after reading them.

Official references: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [local data disclosure](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

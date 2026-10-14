# Chrome Web Store listing — 2.6.0

Name: **3D Parallax**

Short description (matches the manifest):

Make each new tab yours with resizable widgets, quick links, 18 themes, custom wallpapers, optional weather and AI tools.

Category: **Productivity**. Language: **English**.

## Full description

Your new tab, arranged around you.

3D Parallax turns Chrome's New Tab page into a personal homepage with your favorite websites, useful widgets and a background you enjoy. Start with a clean centered layout, or move and resize the elements to fit the way you work.

MAKE IT YOUR OWN

• Choose from 18 built-in themes with customizable visual effects.
• Save up to five photo or video wallpapers on your device and switch between them and built-in themes.
• Discover new backgrounds in the wallpaper library. Search by category, download a file, or save and apply it for offline use.
• Arrange widgets with drag and drop. Resizing changes the content size along with the widget, and Undo helps you recover a previous layout.

KEEP EVERYDAY TOOLS CLOSE

• Add and reorder quick links to your favorite websites.
• Search the web straight from your new tab.
• Add a clock, date, greeting, notes, tasks or countdown.
• Choose a city for optional weather, or add ambient sound while you work.
• Show, hide and adjust elements through simple settings.
• Export a backup of your setup when you want to keep a copy.

OPTIONAL AI, ON YOUR TERMS

Connect a compatible AI provider for chat, headline ideas and homepage styling. AI features require your own API key; your provider may charge for usage. Everyday homepage features work without an AI key.

YOUR SETUP STAYS PERSONAL

No account is needed for ordinary homepage features. Your saved settings, shortcuts, notes and personal wallpapers stay on your device. There are no ads or analytics SDKs, and the extension does not read Chrome's browsing history or your other tabs.

Optional online features, wallpaper discovery and submitted feedback use the services explained in our privacy policy. Weather uses a city you choose, without accessing your device location.

3D Parallax replaces Chrome's default New Tab page.

## URLs

Homepage: https://3dparallax.app

Support: https://github.com/malimehdi230-dev/3D-Homepage/issues

Privacy policy: https://3dparallax.app/privacy.html

Public policy source/fallback: https://github.com/malimehdi230-dev/3D-Homepage/blob/main/PRIVACY.md

## Permission explanations

**storage:** Saves your personal homepage settings, shortcuts and optional AI provider keys on your device. The toolbar popup reads the same preferences.

**unlimitedStorage:** Stores user-uploaded image and video wallpaper files in IndexedDB without the normal extension storage quota. Wallpaper files remain on this device unless explicitly included in an exported backup.

**Location permission:** None. Weather uses a city explicitly chosen by the user; it does not read device location.

**Remote code:** No. JavaScript, styles and icons are bundled. Public feature settings, announcements, catalog metadata, AI responses, search results, weather and wallpaper images are data; returned JavaScript is not executed. No remote libraries or eval are used.

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
| Personal communications | AI messages go to the chosen provider. Submitted feedback is saved in a private Supabase inbox for the developer, with optional Resend email notifications. Unsent drafts stay in the current tab until submission, reset or the tab session ends. |
| Website content | User-entered notes/tasks/headlines, uploaded wallpaper files and requested web-search results are handled for homepage features. |
| User activity | Pointer positions and drag/resize interactions are processed locally for visual effects and layout controls. No interaction analytics or persistent cursor/keystroke logs are implemented. The privacy-answer guide recommends conservative disclosure of this local handling. |

No dedicated collection of financial/payment data, health data or browsing interaction telemetry is implemented. Do not select “no user data” because the app stores some data locally and offers optional network features. Confirm the dashboard's final category wording against these actual behaviors, and certify the Limited Use statements only after reading them.

Official references: [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy), [local data disclosure](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq).

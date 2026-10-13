# 3D Parallax privacy policy

Last updated: October 13, 2026. Extension version: 2.5.0. Publisher: Muhammad Ali Mehdi.

## What the extension does

3D Parallax replaces your new tab page with a personal homepage. Settings, shortcuts, widgets, wallpapers and optional weather and AI features serve that purpose. It has no advertising, tracking pixels or analytics SDKs and does not read your other tabs or Chrome browsing history.

## Data kept on your device

Your display name, theme, shortcuts, layout, headlines, tasks, notes, sound preferences, your selected weather city and its coordinates, searches made in the centered homepage search box, and configured AI provider keys are saved locally. Settings use localStorage and chrome.storage.local; up to five saved wallpaper files and a setup restore copy use IndexedDB. These are not automatically uploaded to the developer. AI chat messages are held in the current page session and sent to your chosen provider when you use chat.

An unsent feedback draft is kept in sessionStorage for the current tab so closing the form or reloading does not lose your message. It is removed after successful submission or a local reset. It is not sent until you choose Send feedback.

The storage permission saves preferences and provider keys. unlimitedStorage allows large image and video wallpapers to remain on your device. The extension does not request access to your browser history, other tabs, or the content of pages you browse.

## Optional network features

- The homepage fetches public extension settings from the developer’s Vercel backend at startup. The settings contain feature availability, recommended first-install themes, support links and dismissible announcements. No personal settings, notes, wallpaper files or provider keys are sent in that request. The last valid response is used offline for up to one day.
- Opening the wallpaper library sends your wallpaper search text, category and page selection to the developer’s backend. Supabase stores the developer-published catalog and artwork. Loading previews, downloading, or saving a library wallpaper contacts its Supabase file host. Saving a wallpaper retains a local copy for offline use; your personal uploads remain local. End users do not need a Supabase account. The publisher dashboard uses Supabase Auth, and publisher uploads and metadata are stored in Supabase.
- Weather is off until you choose a city and enable it. City search sends the city name you enter to Open-Meteo’s geocoding service. Selecting a result saves that city and its coordinates on this device; the city coordinates go directly to Open-Meteo for a forecast. The extension does not access your device location. Weather results are cached for up to 30 minutes. Disable weather in Settings → General to stop forecast requests.
- AI features use a provider you configure. Chat, headline generation, AI styling, provider tests and model discovery send your API key and the relevant request to that provider. Chat includes recent messages; styling includes your prompt. Provider usage charges and privacy terms apply. Ordinary homepage features do not require an API key.
- If you enable AI web search, DuckDuckGo and Wikipedia receive the search query, and returned information can be included in the request to your AI provider.
- Wallpaper searches requested through AI styling use Wallhaven. Wallpaper queries and requests for remote images are sent to Wallhaven and the selected image host. Importing a setup with a remote wallpaper also contacts that image host.
- Searching or opening a shortcut navigates to the selected search engine or website in the normal way.
- Submitting feedback sends your message, category, optional rating, selected theme, extension version, timestamp and a random submission reference to the developer's feedback service at 3-d-parallax-backend.vercel.app. Vercel hosts the API and Supabase stores the private feedback inbox. Only authorized publishers can read submissions, track their status and keep private follow-up notes. Resend may deliver an email notification to the developer when configured; an email failure does not discard your saved message. Repeated retries of one submission reuse its reference to avoid duplicate records. The backend uses daily-salted IP hashes for short-lived spam limits; it does not store raw IP addresses in the feedback database. Expired limit records are removed on subsequent submissions. Feedback is used for support and to improve the extension.
- Network services receive ordinary connection information, such as your IP address, and may keep operational logs under their own policies. Configured provider keys are sent only to the provider endpoint you choose, not to the developer's feedback server.

## Your choices, backups and deletion

You can edit or remove saved shortcuts, tasks, notes and provider keys in the extension. Settings → Backup & help → Reset extension removes saved preferences, search history, tasks, notes, wallpapers including the setup restore copy, and AI keys from this device. Your selected weather city is also removed. Uninstalling removes the extension's local storage. Copies you exported or sent to another service are not deleted by a local reset or uninstall.

Backup files are saved to your device. API keys are excluded by default and included only if you explicitly choose that option. Wallpaper files can also be included when selected. A backup containing keys contains sensitive authentication data; keep it private.

Local data remains until you delete it, reset, or uninstall. Feedback messages and private follow-up notes remain in the developer's support inbox until the developer removes them when they are no longer needed. There is no automatic expiry. You can request deletion through the feedback form or support link, quoting the reference shown after submission when available. Removing a database entry does not automatically delete a separate email notification; the developer must remove that copy too. Third-party AI, weather, search and image services control retention of data you send to them under their own terms. A local reset cannot delete those services' records.

## Limited use

3D Parallax uses data only to provide or improve the personal homepage and the optional features described here. It does not sell user data, use it for advertising, or transfer it for creditworthiness or lending decisions. Data is shared only as necessary for the features you choose, with your consent, or when legally required. Human review is limited to feedback you explicitly submit or other access you explicitly authorize. Its use of user data follows the Chrome Web Store User Data Policy, including the Limited Use requirements.

## Contact and changes

For support or privacy requests, use Settings → Backup & help → Send Feedback. You can also open an issue at [the public project support page](https://github.com/malimehdi230-dev/3D-Homepage/issues); do not post private information or API keys in a public issue. The publisher's support contact is available in the Chrome Web Store listing when published.

The extension is not directed at children under 13. Material changes to data handling will be described in this policy and the release notes. The updated date above identifies the current policy.

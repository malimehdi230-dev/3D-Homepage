# 3D Parallax 2.4.0

The centered layout now aligns the shortcut row with the clock, name and search. Old bottom-dock offsets are removed, and the row scrolls within the viewport when more links are added. The main interface stays readable when 3D animations are paused.

Themes opens a compact background picker with **Built-in themes**, **My wallpapers**, and **Library**. Keep up to five images or videos locally, switch among them, or use a built-in theme without deleting the collection. The previous single wallpaper migrates automatically. Each saved card has Use and Remove controls; the active source and collection count are visible in Background settings. Blur, dimming and depth live under Wallpaper adjustments.

The online catalog is published through the backend admin dashboard and stored in Supabase PostgreSQL and Storage. Users can search, filter by category, page through the collection, download a file, or Save & use it offline. The developer can manage drafts/publication, featured entries, categories, announcements, support links, default themes for new installations and optional feature availability. Remote configuration contains validated data only; all executable extension code remains bundled.

The **Mehdi IT Sol** Supabase project still needs its migration and production environment variables before the online library can serve content. The extension displays a setup message while the catalog is unavailable; built-in themes and personal files keep working. See the backend README for setup. No developer credentials or wallpaper seed data are embedded in this package.

## Verify and package

Run npm test from the repo root. Checks include real pointer resizing, navigation/forms/backups, native Chrome extension loading, old wallpaper migration, non-destructive switching, concurrent five-file enforcement, offline downloaded wallpaper restore, centered desktop/mobile alignment and public feature controls. Backend API/dashboard checks mock storage and Auth; no live files, paid AI calls or feedback emails are sent by tests.

python scripts/package-extension.py builds the checked Chrome upload ZIP. The store kit contains refreshed screenshots, listing copy, disclosures and promotional assets. Google review and publisher account setup are completed in the Chrome Web Store dashboard.

**3D Parallax public website**

The public site has seven crawlable pages: the landing page, install, wallpapers, widgets, help, release notes and privacy. Its content is generated as static HTML. The Chrome extension remains in `custom extension`; packaging uses that directory, independently of the website. See [Search Console and website-only SEO changes](SEO-SETUP.md).

Run `npm run build:website` to generate `website-dist`. Vercel builds from the repository root and publishes this output. The tracked `vercel.json` contains the static-page routes, public backend configuration proxy, redirects and headers. Run `node scripts/build-website.cjs --configure` after changing the structured-data source or deployment settings, and review the resulting configuration.

The public domain is https://3dparallax.app. The same existing Vercel project hosts it: `3d-homepage`. Its Root Directory is the repository root. No frontend secret keys are required. `npm run test:website` exercises the website with the backend's real handler factories and an isolated database/Auth fixture. The backend checkout defaults to a sibling `3D-Parallax-backend`; set `BACKEND_REPO` if needed. `BROWSER_PATH` selects an existing Chromium.

**Install buttons**

Sign in at https://3-d-parallax-backend.vercel.app/admin → Extension controls → Website installation. Paste the official `https://chromewebstore.google.com/detail/...` listing URL after approval and save. Leave the field empty while under review. Only official HTTPS Chrome Web Store item URLs are accepted; search links and arbitrary download domains are rejected. The website obtains this setting through `/api/site-config`, which proxies the backend's public `/api/config`. Support links use the same public settings. The website safely falls back to its install-information page when the link is absent or configuration cannot be reached.

The library, feedback and publisher settings stay in the existing Supabase project. The new setting uses the existing settings JSON and does not require a new schema migration. Adding it does not change installed extension permissions or require replacing the 2.5.0 upload ZIP.

**Search and sharing**

- Each public page has a distinct title, description, canonical URL and crawlable content without JavaScript.
- Open Graph and Twitter metadata use a prepared promotional image with the new layered-P logo and an actual extension screenshot.
- The header, footer, favicon and software structured-data image use the new logo. The three wallpaper cards contain a theme preview, personal photo collection and an example library gallery. Scenic preview images are optimized local WebP files and do not change the publisher's catalog; their generation prompts are in `assets/wallpapers/README.md`.
- The home page includes WebSite and SoftwareApplication structured data with verified product facts. It includes no invented ratings/reviews and makes no promise of rich-result eligibility.
- `pages.json` is the page/metadata registry; `site.json` declares the canonical origin and known redirect hosts. `/sitemap.xml` lists the seven canonical public pages. `/robots.txt` allows crawling so Google can read the demo/API/manifest `noindex` headers; these URLs stay outside the sitemap.
- `search-verification.json` keeps the owner's Google Search Console verification tokens. Builds place their meta tags directly in each page's HTML head, without JavaScript or an extra request. Keep verified owners' tokens when updating this file.
- The optional `/demo/index.html` retains the working new-tab app. It has noindex metadata and headers and is separate from the marketing home page, so it does not canonicalize to that unrelated content.
- Screenshots have descriptive alternatives, fixed dimensions, high-priority loading for the hero and lazy loading below the fold. Fonts and assets are local.
- `/privacy.html` preserves the extension policy and explains the public website and optional browser demo.

The website does not include analytics SDKs, fake testimonials or signup collection. Keep copy, release status and screenshots aligned with real functionality. Remote install/support settings are validated data only.

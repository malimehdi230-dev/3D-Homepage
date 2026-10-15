**Google Search Console setup for 3dparallax.app**

**Canonical repair — October 15, 2026**

The affected homepage was `https://3dparallax.app/`. Search Console declared that URL as canonical but selected `https://www.3dparallax.app/`, based on its October 14 crawl. The intended canonical remains the HTTPS address without `www`.

The repository includes permanent redirects from `www.3dparallax.app` and the production `3dparallax.vercel.app` alias to the corresponding path on `3dparallax.app`. Both hostnames are also attached to the existing Vercel project as verified 308 domain redirects. The explicit `www` CNAME uses Vercel's project-specific recommended target. The expired `www` HTTPS certificate has been replaced with a valid managed certificate. A hostname must be attached and have valid DNS/TLS before repository redirects can receive its traffic; copying a redirect rule alone cannot repair missing DNS.

Public page variants such as `/index.html`, `/install.html`, `/privacy` and trailing slashes redirect to their canonical destinations. The sitemap contains only final, public HTTP 200 URLs. Each public page has one absolute self-canonical and matching Open Graph URL. The demo and 404 page no longer declare the unrelated marketing homepage as their canonical; they remain excluded from indexing.

**Complete the DNS delegation at Name.com**

Live checks on October 15 found six authoritative nameservers: Vercel's two nameservers mixed with four Name.com nameservers. Vercel serves the corrected `www` record, while Name.com sometimes returns NXDOMAIN (hostname not found). This inconsistent delegation must be corrected before treating the public hostname repair as complete. The owner confirmed that this domain is used only for this website.

1. Sign in to Name.com, open **My Domains**, choose `3dparallax.app`, then open **Manage Nameservers**.
2. Keep exactly `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
3. Remove `ns1kwy.name.com`, `ns2gtx.name.com`, `ns3fhx.name.com` and `ns4fqz.name.com`, then save. These are nameserver settings at the registrar, not new NS records to add inside Vercel's DNS zone.
4. Vercel already has the root ALIAS, explicit `www` CNAME and certificate-authority records. Keep them. There is no need to transfer registration, buy the domain again, or change the extension.
5. Allow DNS caches to expire; nameserver propagation can take up to 48 hours. Check the public NS answers and that `https://www.3dparallax.app/` consistently redirects to `https://3dparallax.app/` over valid HTTPS before requesting another crawl.

The connected Vercel account controls the website project and Vercel DNS zone; it cannot change delegation for a domain registered externally at Name.com. That last registrar action requires the owner's Name.com account. See [Name.com's nameserver instructions](https://www.name.com/de-de/support/articles/205934547-changing-nameservers-for-dns-management) and [Vercel's DNS migration instructions](https://vercel.com/docs/domains/managing-dns-records).

**After deployment, use your signed-in Search Console account**

1. Open `https://www.3dparallax.app/` and confirm it ends at `https://3dparallax.app/`. Also check that `https://3dparallax.app/` itself loads normally.
2. In URL Inspection, inspect `https://3dparallax.app/`. Choose **Test live URL**, then **Request indexing** if eligible. A live test checks current accessibility, but only Google's indexed results show the Google-selected canonical.
3. Submit or resubmit `https://3dparallax.app/sitemap.xml` under Sitemaps. It lists the homepage, install, wallpapers, widgets, help, release notes and privacy pages.
4. In Page indexing → **Duplicate, Google chose different canonical than user**, use **Validate fix** when offered. Google needs to recrawl and process the changes; a successful live test does not immediately replace the historical report or guarantee indexing.
5. Inspect the homepage again after Google recrawls it. The desired Google-selected canonical is `https://3dparallax.app/`.
6. A **Page with redirect** result for `www`, HTTP or old `.html` aliases is expected: those URLs direct Google and visitors to the final page. Check the destination's indexing rather than trying to index every alias separately.

**Website-only SEO updates**

- Edit `website/pages.json` for public page paths, titles, descriptions and breadcrumb labels.
- Edit `website/pages/*.html` for visible content, headings, help text and links. The wallpaper and widget guides provide separate useful information rather than duplicate landing pages.
- `website/site.json` holds the canonical origin, known production redirect hosts and published Chrome Web Store URL used in crawlable HTML. Keep its store URL aligned with the publisher dashboard's install setting. Interactive availability can still be overridden by the existing public backend config; no new endpoint or database migration is needed.
- `website/schema.json` describes the real extension, website and official store installation URL. The build adds per-page WebPage and breadcrumb data. It intentionally includes no invented ratings or reviews.
- Run `node scripts/build-website.cjs --configure` after metadata/route changes, then `npm run test:seo` and `npm run test:website`. Review generated `vercel.json`, commit the website/build/test files and push to `main`; the linked Vercel project builds and deploys the website.
- These changes do not alter `custom extension`, its manifest version or existing ZIPs. A website SEO/content change does not require a Chrome Web Store package update. Changing executable extension behavior still requires a separately versioned extension release.

References: [canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [URL Inspection and its limits](https://support.google.com/webmasters/answer/9012289).

The website already provides static public content, unique page titles and descriptions, canonical URLs, social previews, factual structured data, a sitemap and indexing rules. Google's crawling, indexing and rankings remain Google's decisions.

**Finish the HTML-tag verification you selected**

1. In Search Console, use the URL-prefix property `https://3dparallax.app/`. This matches the property in your verification dialog. HTML-tag verification applies to a URL-prefix property; a Domain property needs DNS verification instead.
2. Your exact Google token is stored in `website/search-verification.json`. The website build includes it as a `google-site-verification` meta tag directly in the HTML head. It works without JavaScript and remains present after future deployments.
3. Open `view-source:https://3dparallax.app/`, find `google-site-verification`, and confirm the complete `content` value matches the tag Google supplied. The homepage must be public and return HTTP 200.
4. Return to the Google verification dialog and click **Verify**. Only claim ownership is verified after Google confirms success. Keep the tag after verification: Google periodically checks it again.
5. The verification file supports multiple owners' tokens. Add another complete token to the array if needed; preserve existing owners' tokens. Verification tokens are public ownership markers, not Google account passwords.

**Submit the sitemap and request indexing**

1. Open **Sitemaps** in the verified property. In **Add a new sitemap**, enter `sitemap.xml` and click **Submit**. The full URL is `https://3dparallax.app/sitemap.xml`.
2. Check the submission status. If it fails, open the full URL in an incognito window and confirm it returns the XML sitemap, then read Google's reported error.
3. Open **URL Inspection** and enter `https://3dparallax.app/`. Run **Test live URL**. If Google reports the page is eligible and the option is available, click **Request indexing**.
4. Inspect `/install`, `/wallpapers`, `/widgets`, `/help` and `/changelog` as needed. The sitemap also includes `/privacy.html`. These are the seven canonical public pages.
5. Leave the browser demo, API and manifest out of the sitemap. These resources have `noindex` headers; the demo also has a `noindex` meta tag. `robots.txt` allows Google to reach them and read those directives. Blocking them in robots.txt would prevent Google from seeing `noindex`.

**Keep the listing and search presence accurate**

When the Chrome Web Store release is approved, add its official URL in the publisher dashboard: Extension controls → Website installation. The website's install buttons update automatically. Use `https://3dparallax.app` as the store listing's website, `https://3dparallax.app/help` for help and `https://3dparallax.app/privacy.html` as the privacy URL.

Monitor **Page indexing** and **Search performance** after verification. Check impressions, clicks, queries and page results before deciding which content needs improvement. Keep release notes and help pages aligned with the real extension. Do not fabricate ratings, install counts or rich-result eligibility.

Search Console's Verify, sitemap submission and indexing request require the owner's signed-in Google account. Publishing the tag alone does not complete those actions. No Google account credentials are stored in this repository.

References: [ownership verification](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [noindex and crawl access](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [SEO fundamentals](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

**Google Search Console setup for 3dparallax.app**

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
4. Inspect `/install`, `/help` and `/changelog` as needed. The sitemap also includes `/privacy.html`. These are the five canonical public pages.
5. Leave the browser demo, API and manifest out of the sitemap. These resources have `noindex` headers; the demo also has a `noindex` meta tag. `robots.txt` allows Google to reach them and read those directives. Blocking them in robots.txt would prevent Google from seeing `noindex`.

**Keep the listing and search presence accurate**

When the Chrome Web Store release is approved, add its official URL in the publisher dashboard: Extension controls → Website installation. The website's install buttons update automatically. Use `https://3dparallax.app` as the store listing's website, `https://3dparallax.app/help` for help and `https://3dparallax.app/privacy.html` as the privacy URL.

Monitor **Page indexing** and **Search performance** after verification. Check impressions, clicks, queries and page results before deciding which content needs improvement. Keep release notes and help pages aligned with the real extension. Do not fabricate ratings, install counts or rich-result eligibility.

Search Console's Verify, sitemap submission and indexing request require the owner's signed-in Google account. Publishing the tag alone does not complete those actions. No Google account credentials are stored in this repository.

References: [ownership verification](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [noindex and crawl access](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [SEO fundamentals](https://developers.google.com/search/docs/fundamentals/seo-starter-guide).

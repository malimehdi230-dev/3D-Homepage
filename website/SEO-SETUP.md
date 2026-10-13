**Search setup after publication**

Technical SEO is implemented in the website source. Google indexing and rankings depend on Google's crawl/index systems and are not guaranteed by metadata or a sitemap.

1. Open [Google Search Console](https://search.google.com/search-console) using the Google account that will own the property.
2. Add a Domain property for `3dparallax.app`. Copy Google's supplied DNS TXT verification value and add it through the domain's DNS provider. Complete Verify in Search Console. A URL-prefix property can instead use one of Google's offered verification methods.
3. Open Sitemaps and submit `https://3dparallax.app/sitemap.xml`.
4. Use URL Inspection for `https://3dparallax.app/`, run the live test and request indexing if available.
5. Inspect `/install`, `/help`, `/changelog` and `/privacy.html`. Check that the canonical domain is `3dparallax.app` and that the public pages are accessible without signing in.
6. Keep `/demo/` and `/api/` outside the sitemap; the demo has noindex rules so the product landing page is the search entry point.
7. When the Chrome Web Store release is approved, add its official URL in the publisher dashboard. Also use `https://3dparallax.app` as the store listing's website and its public privacy URL.
8. Monitor Page indexing and Search performance. Fix reported crawling, canonical or page errors before drawing conclusions about rankings. Keep help and release notes accurate when shipping updates.

Search Console ownership verification and sitemap submission need access to your Google property and DNS provider. This repository contains no verification token or Google account credentials.

References: [Search Console verification](https://support.google.com/webmasters/answer/9008080), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [SEO fundamentals](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [software structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app).

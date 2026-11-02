# Satya Prasad | Personal Portfolio

Live website: https://satyaprasad.com

A static portfolio and publication space covering professional experience, ten books, independent projects and practical product-management essays.

## Structure

- `index.html`: portfolio homepage, career timeline, books and carousel
- `assets/css/site.css`: existing visual design, animations and responsive layout
- `assets/css/pages.css`: accessible layouts for supporting pages
- `assets/js/site.js`: homepage interaction logic
- `assets/js/pages.js`: supporting-page theme toggle
- `assets/js/consent.js`: optional analytics/advertising opt-in controls
- `about.html`, `projects.html`, `insights.html`: informational pages
- `insights/*.html`: original articles, with illustrative scenarios clearly marked
- `privacy.html`, `terms.html`: data-use disclosures and site terms
- `sitemap.xml`, `robots.txt`, `ads.txt`: discovery and publisher declarations
- `assets/images/`: carousel imagery; HEIC files require conversion to JPEG/WebP for broad browser support

## Optional tracking and privacy

Optional Google Analytics (`G-K44B9PCZ16`), Microsoft Clarity (`yz9non0rsk`) and Google AdSense (`ca-pub-7937216909291905`) are loaded only after a visitor accepts optional tools. The preference is stored in browser local storage. The website uses external Google Fonts and Amazon book-cover images independently of this choice; these are disclosed in the privacy policy.

**Important compliance limitation:** the local preference panel is **not** a Google-certified IAB TCF consent-management platform. To serve personalised ads in EEA/UK/Switzerland, configure a Google-certified CMP through AdSense Privacy & Messaging or an approved provider and verify the integration. Approval, monetisation and legal compliance cannot be guaranteed by repository code alone. Review hosting access logs and privacy claims against the actual hosting configuration.

## Deployment and QA

Publish the `main` branch through the configured host. Verify https://satyaprasad.com/ and all sitemap URLs, including images, after each deploy. The GitHub Actions quality workflow performs static validation. The image-conversion workflow converts HEIC carousel assets to JPEG on a macOS runner and commits resulting paths, subject to workflow permissions.

For local testing, use `python3 -m http.server 8000` and open `http://localhost:8000` (opening local files directly may not behave like production).

Checklist: responsive widths, dark/light mode, carousel arrows/pause/keyboard, privacy accept/reject, external link checks, structured-data validation, mobile speed, Search Console indexing, Bing verification, ads.txt status and CMP account setup.

## Contact

satyaprasadwork@gmail.com

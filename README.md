# Noma Market

![CI](https://github.com/hamzehabbass/performed-optimised-storefront/actions/workflows/pages.yml/badge.svg)

A fast, responsive demo shop for thoughtfully chosen everyday finds. Built with Next.js App Router, TypeScript, Tailwind CSS, Zustand and the `hamzehabbass-accessible-ui` component library.

> **Demo store only. No real orders or payments.** Checkout does not ask for card details. Cart, wishlist and the last demo order are saved only in the current browser.

**Repository:** [hamzehabbass/performed-optimised-storefront](https://github.com/hamzehabbass/performed-optimised-storefront).  
**Live site:** https://hamzehabbass.github.io/performed-optimised-storefront/ (GitHub Pages deployment is pending the first successful Actions run).

## What’s here

- Home page with featured collections, top-rated picks and deals.
- Searchable catalogue with category, price, rating, stock and sort controls; state is shareable in the URL.
- Statically generated product pages with keyboard/swipe gallery, stock status, reviews, wishlist and related finds.
- Persistent cart and wishlist, quantity controls, discount savings and shipping totals.
- Validated demo checkout, shipping choice and browser-saved order confirmation.
- Light/dark themes, responsive layouts, skip link, accessible labels, focus indicators, live announcements and reduced-motion support.
- Real DummyJSON product and category snapshots; the site does not depend on DummyJSON at runtime.

## Screenshots

Captured from the optimized local production export. Replace these with fresh captures after checking the deployed site.

| Desktop home | Mobile home (375px) |
| --- | --- |
| ![Noma Market desktop home](docs/screenshots/home-desktop.jpg) | ![Noma Market mobile home](docs/screenshots/home-mobile.jpg) |

| Dark theme | Cart |
| --- | --- |
| ![Noma Market dark theme](docs/screenshots/home-dark.jpg) | ![Noma Market cart](docs/screenshots/cart.jpg) |

![Noma Market demo checkout](docs/screenshots/checkout.jpg)

## Performance and accessibility

No Lighthouse result is claimed yet: the site has not been deployed or measured. Record three runs for mobile and desktop on the deployed home, catalogue and product pages, then report the median below.

The production build generates 204 static routes. The local export is 24 MB on disk, including HTML, route data and assets; emitted JavaScript chunks total 1.0 MB before transfer compression. These build sizes are not Lighthouse or network-transfer measurements.

| Page | Device | Performance | Accessibility | LCP | CLS | INP / TBT |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | Not measured | Not measured | Not measured | Not measured | Not measured |
| Home | Desktop | Not measured | Not measured | Not measured | Not measured | Not measured |
| Catalogue | Mobile | Not measured | Not measured | Not measured | Not measured | Not measured |
| Product | Mobile | Not measured | Not measured | Not measured | Not measured | Not measured |

The export uses `next/image` with `unoptimized: true`, because GitHub Pages has no Next.js image-optimisation server. Images include intrinsic layout sizing, responsive `sizes`, lazy loading below the fold and priority hints for the hero and product lead image. The Inter font is self-hosted by `next/font` at build time.

The current suite has 18 unit/component tests and 15 Playwright scenarios. Automated axe checks cover the home, catalogue, product, cart (including its drawer) and checkout pages in light and dark themes. The post-deploy smoke test is configured but cannot be run until Pages is live. These checks complement — they do not replace — manual keyboard, screen-reader and real-phone testing.

## Data and architecture

- `data/products.json` is the lean 194-product catalogue snapshot; `data/products-full.json` holds product detail, images and reviews. Both were saved from the actual DummyJSON responses (including the verified string-array `/products/category-list` response).
- Pure filtering, URL parsing, discount and order-total logic lives in `lib/`.
- Next.js statically exports every product route from the committed snapshot. GitHub Pages uses the repository name as `basePath` and `assetPrefix`.
- Static Pages cannot create arbitrary order URLs after build, so checkout uses the generated static `/order/confirmation/` route and keeps the unique demo order id in the query string and browser-saved receipt.
- Zustand stores use explicit client-side rehydration to keep server and first-client markup consistent.
- The cart, wishlist and latest demo order use browser storage only; there are no accounts, server endpoints or payment integrations.
- `hamzehabbass-accessible-ui` supplies the accessible drawer, buttons, inputs and form field primitives.

## Run locally

Requires Node.js 20.9 or newer and npm (CI uses Node.js 24).

```bash
npm ci
npm run dev
```

Useful checks:

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run build
npm run test:e2e
```

`npm run test:e2e` serves the static `out/` export locally. The purchase-flow test uses the committed product snapshot and exercises category filtering, product detail, cart persistence after reload and demo checkout. The deployed smoke test checks that the live home page and product cards render.

Refresh the committed data (requires network access):

```bash
npm run data:update
```

The update script checks the live response shapes before writing snapshots and removes reviewer email addresses. If DummyJSON changes shape or the download fails, the script exits with an explicit error. The snapshot was taken **2026-11-05**.

## GitHub Pages

Push this repository to the `main` branch and allow GitHub Actions to publish Pages. The workflow runs lint, type-checking, unit/component tests, the production build, end-to-end purchase flow and light/dark axe checks. On `main`, it rebuilds with the repository-specific base path, deploys to Pages and runs a smoke test against the deployment URL.

For a differently named repository, the workflow uses that repository’s name automatically. Set the repository description, topics (for example `nextjs`, `typescript`, `ecommerce`, `accessibility`, `performance`, `zustand`, `github-pages`) and profile pin in GitHub after creating it.

## Remaining release checks

- Confirm the GitHub Actions build and Pages deployment succeed.
- Re-capture the screenshots from the deployed site.
- Measure Lighthouse and PageSpeed Insights on the deployed URL; replace the unmeasured entries above with repeatable results.
- Test with a screen reader and a real phone; automated axe is not a substitute for either.

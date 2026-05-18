# Crystal Ball Windows & Doors — Website

Multi-page static site built with React 18 + Tailwind + Babel-standalone, all loaded via CDN. No build step required.

**Live reference site:** https://crystal-ball-3.oneapp.dev/

## Running locally

No install needed — just serve the folder over HTTP (browsers block ES module loading from `file://`):

```bash
npx --yes http-server . -p 8765 -c-1
```

Then open http://localhost:8765/

## Architecture

- **`shared.js`** — All shared chrome and data:
  - `Header` (with mega menu: Systems / Portfolio / Markets)
  - `Footer`
  - `BottomCTA` (reusable CTA band)
  - `TextReveal` / `GlassReveal` (scroll-triggered animations)
  - `products` (catalog data) and `showcaseProjects` (portfolio data)
  - Exposed on `window` so each page's Babel script can consume them
- **`styles.css`** — Noise texture, glass card, product-card hover, keyframe animations
- **`*.html`** — One HTML file per page. Each loads `shared.js` first, then has its own inline `<script type="text/babel">` for page-specific components

## Pages

| File | Status (visual fidelity vs. original) |
|---|---|
| `index.html` | Matches original — Hero "VISION IN EVERY DETAIL" + ProductSystems slider + Projects scroll showcase + Instagram carousel, with v2 content sections (HomeIntro, HomeCapabilities, HomeMarketsSummary, HomeLifecycle, HomeContact) woven in |
| `about.html` | Matches original — Big-tracked headline, GlassReveal image, foundation pillars |
| `portfolio.html` | Matches original — Filterable project grid (All / Commercial / Custom Residential / Restoration & Retrofit / Curtain Wall) |
| `contact.html` | Matches original — Full-height image card overlay + single combined inquiry form |
| `products.html` | **Inconsistent** — Built to v2 copy deck before matching original visual; needs restyling |
| `commercial-developers.html` | **Inconsistent** — New v2 pillar; needs the SYSTEMS/portfolio-page treatment |
| `architects-custom-builders.html` | **Inconsistent** — Same as above |
| `dealer-partnerships.html` | **Inconsistent** — Same as above |
| `project-support.html` | **Inconsistent** — Same as above |

## TODO before launch

- [ ] Restyle the 5 inconsistent pages above to match the original aesthetic
- [ ] Replace the contact form `alert()` stub with a real handler (Formspree / Netlify Forms / Zapier webhook)
- [ ] Confirm real email + phone (currently placeholders: `Ilan@crystal-ball.ca` / `647-622-3226`)
- [ ] Add favicon, OG/Twitter card images, `robots.txt`, `sitemap.xml`
- [ ] Replace hot-linked `crystal-ball.ca/wp-content/...` image URLs with self-hosted assets
- [ ] Add GA4 + Microsoft Clarity tracking
- [ ] Populate real portfolio data: `location`, `type`, `year`, `scope`, `criteria` per project in `shared.js`
- [ ] Add per-project detail pages (currently linked from portfolio menu via `#anchor` only)

## Copy source of truth

`CB_Website_Copy_Master_v2.md` (May 2026 deck, Talkerstein Consulting Group). v2 IA: Home · About · Commercial · Architects · Dealers · Products · Project Support · Contact.

## Voice rules (locked)

- No em dashes — use hyphens
- No filler words, no passive voice in external copy
- Lead every section with a value statement or capability — not a soft intro
- Technical vocabulary stays — audience is professional
- No fabricated stats, no fabricated project references

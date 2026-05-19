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

All 10 pages now use the same visual treatment — tracked-letter hero `h1`, GlassReveal image animations, alternating `bg-ink`/`bg-obsidian` section bands, bordered white cards on `hover:border-glass`, BottomCTA before footer.

| File | Page |
|---|---|
| `index.html` | Home — Hero "VISION IN EVERY DETAIL" + ProductSystems slider + Projects scroll showcase + Instagram carousel, with v2 content sections woven in |
| `about.html` | About — "BUILT ON CONSTRUCTION EXPERIENCE." |
| `products.html` | Systems — "ENGINEERED FOR THE ENVELOPE." with Material Intelligence, Engineered to Move, and filterable System Collection |
| `portfolio.html` | Portfolio — "Project Experience." filterable grid (All / Commercial / Custom Residential / Restoration & Retrofit / Curtain Wall) |
| `commercial-developers.html` | Market pillar — "FACADE SYSTEMS FOR THE PROJECTS YOU BUILD." |
| `architects-custom-builders.html` | Market pillar — "THE SYSTEM MAKES THE ARCHITECTURE." |
| `dealer-partnerships.html` | Market pillar — "PREMIUM SYSTEMS. PROJECT-LEVEL SUPPORT." |
| `project-support.html` | Service — "SUPPORTING THE PROJECT, NOT JUST THE ORDER." three delivery models |
| `contact.html` | Contact — Full-height image card overlay + single combined inquiry form |

## TODO before launch

- [ ] Replace the contact form `alert()` stub with a real handler (Formspree / Netlify Forms / Zapier webhook)
- [ ] Confirm real email + phone (currently placeholders: `ilmuskal@gmail.com` / `647-622-3226`)
- [ ] Add favicon, OG/Twitter card images, `robots.txt`, `sitemap.xml`
- [x] ~~Replace hot-linked `crystal-ball.ca/wp-content/...` image URLs with self-hosted assets~~ — done, all 31 images now in `/img/`
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

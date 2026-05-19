# Crystal Ball — Developer Handoff

You're picking up the Crystal Ball Windows & Doors website. This doc gets you running locally, oriented on the codebase, and clear on what's left to ship before launch.

**Live site:** https://curious-concha-f11e49.netlify.app/
**Repo:** https://github.com/talkerstein/Crystalball
**Future production domain:** crystal-ball.ca (currently WordPress — DNS flip is the final step)

---

## 1. Access you should have

Ask Rish to confirm you have:

- [ ] **GitHub** — collaborator access on `talkerstein/Crystalball` (push to `main`, open PRs)
- [ ] **Netlify** — team member on the site that deploys from this repo (so you can see build logs, env vars, Forms settings if needed)
- [ ] **Google Workspace** — `Ilan@crystal-ball.ca` (or equivalent) login, needed to deploy the Apps Script form handler
- [ ] **Domain registrar** — only needed when we flip DNS from WordPress to Netlify

If any are missing, ping Rish before starting.

---

## 2. Run locally

No build step. No `npm install`. Just clone and serve as static files.

```bash
git clone https://github.com/talkerstein/Crystalball.git
cd Crystalball
npx --yes http-server . -p 8765 -c-1
# Open http://localhost:8765/
```

Edit any `.html` or `.js` file → refresh the browser → see changes. That's it.

> **Don't open the files via `file://`** — browsers block module loading and the React babel transform from `file://` paths. Always serve over HTTP.

---

## 3. Architecture in two minutes

| File | What it does |
|---|---|
| `shared.js` | All shared chrome and data on `window`: `Header` (with mega menu), `Footer`, `BottomCTA`, `TextReveal` / `GlassReveal` animation components, `products` catalog data, `showcaseProjects` portfolio data, and the JSON-LD schema injector |
| `styles.css` | Global styles: noise texture, glass card, product-card hover, keyframe animations |
| `index.html`, `about.html`, … | One HTML file per page. Each loads `shared.js` first, then has its own inline `<script type="text/babel">` for that page's components. Page-specific data stays in the HTML; reusable stuff goes in `shared.js` |
| `img/` | All self-hosted images. ~5MB total, 31 files |
| `contact-thanks.html` | Post-submit landing page for the contact form |
| `404.html` | Custom not-found page (Netlify serves it automatically) |
| `privacy.html`, `terms.html` | Legal stubs — placeholder copy, replace before launch |
| `robots.txt`, `sitemap.xml` | SEO infrastructure |

### Tech choices

- **React 18** via CDN (no build)
- **Tailwind CDN** for styling (`cdn.tailwindcss.com`) — Tailwind config is duplicated in each page's `<head>`, intentional
- **Babel standalone** transpiles JSX in the browser
- **Google Fonts** for Montserrat

**Known tradeoff:** Babel-standalone transpiles every page navigation, adding ~2-3 seconds. Fine for v1. If we ever care about perceived speed, migrate to Vite/esbuild as a real build step. Not a blocker.

---

## 4. How to edit common things

**Add a new page**
1. Copy `about.html` as a starting template
2. Update `<title>` and meta tags
3. Replace the page-specific component
4. Add a link in `shared.js` Header + Footer
5. Add the page to `sitemap.xml`

**Edit the top nav or footer**
- Both live in `shared.js`. One source of truth, all pages get the update.

**Add a project to the portfolio**
- Edit `showcaseProjects` array in `shared.js`. Add fields: `id`, `title`, `image`, `description`, `location`, `type`, `year`, `scope`, `criteria`
- `type` must match one of the portfolio filter buttons (`Commercial`, `Custom Residential`, `Restoration & Retrofit`, `Curtain Wall`)
- The home page scroll-showcase, portfolio page, and the Portfolio mega menu all consume this array

**Add a product**
- Edit `products` array in `shared.js`. Append: `id`, `name`, `tag`, `category`, `image`, `specs[]`
- Shows up in the home `ProductSystems` slider and on `products.html`

**Update brand contact info**
- `Ilan@crystal-ball.ca` and `647-622-3226` are referenced in `shared.js` (Footer + JSON-LD schema), `privacy.html`, and `terms.html`. Search and replace.

---

## 5. Deploy workflow

Netlify auto-deploys on push to `main`. ~30-60 second deploy.

```bash
git checkout -b some-feature-branch
# edit files
git add -A
git commit -m "Clear description of what changed and why"
git push origin some-feature-branch
gh pr create --base main --title "..." --body "..."
# merge to main → Netlify deploys
```

For tiny safe changes, you can push directly to `main`. For anything that touches the form, the schema, or the shared chrome, open a PR.

---

## 6. Outstanding tasks before launch

In rough priority order:

### Functional plumbing (blockers)
1. **Wire the contact form to a real handler.** Currently fires a demo alert if `window.CB_FORM_ENDPOINT` is empty.
   - Plan: deploy the Google Apps Script form handler (script provided to Rish in chat — ask him for it)
   - Once deployed, paste the Web App URL into the `<script>window.CB_FORM_ENDPOINT = ''</script>` block in `contact.html`'s `<head>`
   - Form already has proper `name=""` attributes, honeypot, and a fetch-with-redirect onSubmit handler — just needs the URL
2. **Replace placeholder phone if needed.** Footer shows `647-622-3226`. Confirm with Eital.
3. **Replace social URLs** — LinkedIn/Instagram/Facebook in the footer currently point to `#`.

### Polish (recommended pre-launch)
4. **Lighthouse audit + fixes.** Run mobile + desktop, fix top 5 issues (likely: image alt text, color contrast on the glass nav, lazy-loading below-the-fold images).
5. **Real Privacy / Terms language.** Current versions are clearly marked placeholder. Get Eital to sign off on real legal copy (or paste in templates).
6. **Real portfolio data.** `showcaseProjects` in `shared.js` has placeholder `location` / `year` / `scope` / `criteria` for each project. Update with the real values from Eital.

### SEO ramp-up (post-launch)
7. **Google Search Console.** Verify the production domain (after DNS flip). Submit `sitemap.xml`.
8. **Google Analytics.** Add GA4 tracking. Likely place: a script tag in `shared.js` or a `<script>` block in each page's `<head>`.

### Future improvements
9. **Migrate to a real build step.** Replace Babel-standalone + CDN React with Vite or esbuild. Big perceived-speed win.
10. **Move duplicate `tailwind.config = {...}` blocks into a single shared file.** Right now each HTML page duplicates it.

---

## 7. Brand / copy source of truth

- **Copy deck:** `CB_Website_Copy_Master_v2.md` (May 2026, Talkerstein Consulting Group). Ask Rish — it lives in his project folder, not in this repo.
- **Voice rules** (locked):
  - No em dashes — use hyphens
  - No filler words, no passive voice in external copy
  - Lead every section with a value statement or capability
  - Technical vocabulary stays — audience is professional (developers, architects, GCs)
  - No fabricated stats, no fabricated project references

---

## 8. If you get stuck

- **Site won't render content:** Check the browser console. The likely culprit is a JSX syntax error in the inline `<script type="text/babel">` block. Babel-standalone is unforgiving — one bad bracket and the whole page is blank.
- **`window.X is undefined`:** `shared.js` script tag must load before the inline page script. Check order in `<body>`.
- **Deploy doesn't appear:** Check Netlify build logs. Most "weird" deploy failures are missing files or invalid HTML.
- **Anything else:** Ping Rish.

---

## 9. Commit message style

```
Short summary in imperative form

Optional body explaining the why, gotchas, or follow-up items.
Reference issues if relevant.

Co-Authored-By: <if pairing>
```

Look at `git log` for examples. Keep messages descriptive — they're documentation for whoever next touches this code (which is probably future you).

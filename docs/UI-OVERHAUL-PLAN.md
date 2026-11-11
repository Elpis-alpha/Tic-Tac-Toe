# UI Overhaul Plan (light–mid scope)

Stack: static vanilla HTML/CSS/JS (no build step), hosted on GitHub Pages at tic-tac-toe.elpis.cc.
Constraint: keep it simple. No frameworks, no bundlers. Do not rewrite game logic (`app.js` BoardCtrl AI etc.) beyond fixing real bugs.

## 1. Visual design
- Modern dark-first theme with light mode via `prefers-color-scheme`; CSS custom properties for colors, radius, shadows.
- Replace the three decorative fonts (Harrington, Old English, Foot Light) with one modern sans (system font stack or self-hosted Inter via Google Fonts `display=swap`). Remove unused font files from `assets/`.
- Glassy/soft cards, rounded corners, subtle gradients, accent color (indigo/violet) and distinct X / O colors.
- Board: rounded cells with hover states, animated mark drawing, highlighted winning line, clear current-turn indicator.
- Header: clean sticky bar, settings button as an accessible `<button>`.
- Settings panel and stats: restyle (segmented controls for radio groups, tidy table), welcome modal and message toasts restyled with backdrop blur and smooth transitions.
- Responsive from 320px up; respects `prefers-reduced-motion`.

## 2. UX / accessibility
- Real `<button>`s for undo/redo/restart/settings/close with `aria-label`s; visible `:focus-visible` rings.
- Board cells keyboard-operable (tabindex, Enter/Space) with `aria-label`s; live region announcing turn/result.
- Modals: Escape closes, focus handling, `role="dialog"`.
- Labels linked to inputs; min 44px touch targets; no layout overflow on mobile.
- Fix any functional bugs found while testing (undo/redo, AI turn, stats, settings save, mobile).

## 3. SEO / meta
- Proper `<title>`, meta description, canonical (`https://tic-tac-toe.elpis.cc/`), `theme-color`, Open Graph + Twitter tags, `robots.txt`, `sitemap.xml`, JSON-LD `VideoGame`/`WebApplication`, `<noscript>` fallback text, semantic `<header>/<main>/<h1>`.
- Favicon: add SVG favicon + keep ico; `site.webmanifest`.
- OG image (simple generated SVG→PNG or static PNG in `assets/`).

## 4. Repo hygiene
- Real README (what, features, run locally, structure, deploy note, license).
- `.gitignore` (incl. `.playwright-mcp/`), `LICENSE` (MIT), `.editorconfig`.
- Tidy `index.html` (inline SVG icons stay, remove huge blank-line spacing, consistent indentation).
- Move/keep `test.html` + `app-test.js` but document them (or dedupe if trivially possible); keep Google verification files (needed).
- `docs/` holds this plan.

## 5. Verification
- Serve with `python3 -m http.server`, drive with Playwright: screenshots at 375px, 768px, 1280px, dark and light; play a full game vs AI, two-player, undo/redo, settings save, stats; check console for errors.
- Fix anything found, re-screenshot.

## 6. Delivery
- Small, logical commits (design, a11y/UX, SEO, repo hygiene), pushed to `main`.

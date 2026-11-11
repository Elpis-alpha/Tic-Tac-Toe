# Tic Tac Toe

A free browser game of Tic Tac Toe (noughts and crosses), live at <https://tic-tac-toe.elpis.cc/>.

Plain HTML, CSS and JavaScript. No framework, no build step.

## Features

- One player against the computer (easy, medium, hard) or two players on one device
- Choose your letter, who moves first, and player names
- Undo, redo and restart
- Win, loss and draw statistics per difficulty, saved in your browser's local storage
- Dark theme by default, light theme via `prefers-color-scheme`
- Responsive from 320px up, keyboard operable, screen reader friendly, respects reduced motion

## Run locally

Any static file server works:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

| Path | Purpose |
| --- | --- |
| `index.html`, `style.css`, `app.js` | The game |
| `test.html`, `app-test.js` | Test copy. Same code as the game, but uses a separate `user-test` local storage key, shows the move order in `#board-place`, and is `noindex`. Keep it in sync with `app.js` and `index.html` when you change them. |
| `assets/` | Favicons, app icons, the social share image and the self-hosted Recursive font (`fonts/`, SIL OFL) |
| `site.webmanifest`, `robots.txt`, `sitemap.xml` | SEO and install metadata |
| `google*.html` | Google Search Console verification files. Keep them. |
| `docs/` | Planning notes, and `og-image.html`, the source of the share image (the regenerate command is in its header comment) |
| `CNAME` | Custom domain for GitHub Pages |

## Deploy

Pushing to `main` publishes the site with GitHub Pages. The custom domain comes from `CNAME`.

## License

MIT, see [LICENSE](LICENSE). Feel free to use and edit any part of this application.
Contact: <http://elpis-alpha.github.io/Elpis-Portfolio/10c10>

# Tic Tac Toe

A free browser game of Tic Tac Toe (noughts and crosses), live at <https://tic-tac-toe.elpis.cc/>.

Plain HTML, CSS and JavaScript. No framework, no build step.

## Features

- Opens straight onto a board you can play: no sign-up, no names to fill in first
- One player against the computer (easy, medium, hard) or two players on one device, chosen under the board
- Two surfaces: a chalkboard and a sheet of graph paper. It follows your system's light or dark setting, and the button in the header switches by hand
- Marks, the grid and the score are drawn stroke by stroke on canvas, with matching sound (the speaker button turns it off)
- The score of this visit is kept in tally marks. Lifetime win, loss and draw statistics per opponent are in Settings, saved in your browser's local storage
- Choose your letter, who moves first, and player names
- Undo, redo and new game. A finished game stays on the board until you start the next one
- Responsive from 320px up, keyboard operable (arrow keys move around the board, Ctrl+Z and Ctrl+Shift+Z undo and redo), screen reader friendly, respects reduced motion

## Run locally

Any static file server works:

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

| Path | Purpose |
| --- | --- |
| `index.html`, `style.css` | The page and how it looks |
| `app.js` | The game: rules, flow, settings, and what gets drawn when |
| `draw.js` | The drawing kit. `Sketch` lays chalk and pencil strokes on a canvas and rubs them out; `Sound` makes the matching noises with Web Audio. It knows nothing about the game |
| `ai.js` | The computer opponent. The three original choosing functions, plus `choose()`, which makes Easy slip now and then and stops Hard from ever losing |
| `test.html` | Sends you to `index.html?test`: the same game on a separate save (the `user-test` local storage key), with the move order shown under the board. `noindex` |
| `assets/` | Favicons, app icons, the social share image and the self-hosted Shantell Sans font (`fonts/`, SIL OFL) |
| `site.webmanifest`, `robots.txt`, `sitemap.xml` | SEO and install metadata |
| `google*.html` | Google Search Console verification files. Keep them. |
| `docs/` | Planning notes, and `og-image.html`, the source of the share image (the regenerate command is in its header comment) |
| `CNAME` | Custom domain for GitHub Pages |

## Deploy

Pushing to `main` publishes the site with GitHub Pages. The custom domain comes from `CNAME`.

## License

MIT, see [LICENSE](LICENSE). Feel free to use and edit any part of this application.
Contact: <http://elpis-alpha.github.io/Elpis-Portfolio/10c10>

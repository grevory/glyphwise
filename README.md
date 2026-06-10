# Glyphcheck

A client-side font accessibility comparator. Pick up to five typefaces, adjust size and spacing, and get side-by-side contrast and legibility scores — all without uploading anything.

**Live site:** https://grevory.github.io/glyphcheck/

---

## Monorepo structure

| Package | Description |
|---|---|
| [`packages/app`](packages/app) | React app — the Glyphcheck web UI |
| [`packages/score`](packages/score) | [`@glyphcheck/score`](packages/score/README.md) — standalone scoring library, publishable to npm |

---

## What it does

### Five test panels

| Panel | What it reveals |
|---|---|
| **Disambiguation** | Renders confusable character pairs (Il1, O0, rn/m, etc.) across all fonts at once so you can spot which glyphs blend together |
| **Confusable strings** | Full sentences built from look-alike characters — stress-tests real reading conditions |
| **Font vs font** | Direct side-by-side of your primary font against each other in the set |
| **Stacked** | All fonts at a range of sizes (10–18px) so you can judge a full type scale |
| **Numbers & figures** | Right-aligned number columns with tabular/oldstyle/slashed-zero toggles |

### Scores rail (right sidebar)

**Contrast** — WCAG 2.2 AA/AAA pass/fail for body text, large text, and non-text, plus APCA Lc (labeled as a non-official draft). Updates live as you change the foreground/background color pickers.

**Legibility** — Heuristic 0–100 score, weighted across five metrics:

| Metric | Weight | What's measured |
|---|---|---|
| Disambiguation | 30% | Shape difference across confusable pairs |
| Counter openness | 22% | Aperture size — open counters resist clogging at small sizes |
| x-height ratio | 20% | Taller lowercase improves recognition at small sizes |
| Stroke evenness | 16% | Low stroke modulation stays visible under low contrast |
| Width & spacing | 12% | Generous sidebearings reduce crowding |

These are heuristics, not a standard. The scores are clearly labeled as such in the UI.

### Controls bar

Sliders for size, weight, tracking, word-spacing, and line-height — mapped to the WCAG 1.4.12 Text Spacing parameters. Italic, bold, and size-ramp toggles. Foreground/background color pickers with a one-click swap button.

### Font catalog

- 12 built-in fonts with hand-tuned metrics (Noto Sans, Atkinson Hyperlegible, Lexend, Inter, and others)
- Full Google Fonts catalog (~1,500 families) available via the autocomplete — metrics are computed on demand by downloading the font binary and running it through `opentype.js` + `@glyphcheck/score`
- Upload your own `.woff2`, `.woff`, `.ttf`, or `.otf` — nothing leaves your device

### Shareable links

The Share button encodes the full comparison state (active fonts, colors, spacing, tab) into a URL parameter. Paste it anywhere.

---

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite + TypeScript |
| UI | React 19 + MUI v6 |
| Font serving | Bunny Fonts CDN (privacy-first Google Fonts drop-in, same family names) |
| Font parsing | opentype.js |
| Scoring | [`@glyphcheck/score`](packages/score) (workspace package) |
| Contrast | WCAG 2.2 via custom implementation + APCA via `apca-w3` |
| Analytics | Mixpanel (autocapture) |
| Hosting | GitHub Pages, deployed via GitHub Actions on push to `main` |

---

## Local development

### Prerequisites

- Node 20+

### Setup

```bash
git clone git@github.com:grevory/glyphcheck.git
cd glyphcheck
cp packages/app/.env.example packages/app/.env.local   # add your Google Fonts API key
npm install
npm run dev
```

The app runs at `http://localhost:5173/glyphcheck/`.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_GOOGLE_FONTS_API_KEY` | Yes | Google Fonts API key — used to fetch the font catalog. Get one at [console.cloud.google.com](https://console.cloud.google.com). |

### Scripts

```bash
npm run dev          # dev server with HMR (app only)
npm run build        # build score then app → packages/app/dist/
npm run preview      # serve packages/app/dist/ locally
npm test             # run all workspace tests
npm run lint         # lint all workspaces
```

---

## Project structure

```
packages/
  score/              # @glyphcheck/score — standalone npm-publishable scoring library
    src/
      contrast.ts     # WCAG / APCA contrast helpers
      score.ts        # scoreFont, composeScore, grade
      types.ts        # shared TypeScript types
      metrics/        # x-height, disambiguation, numerals, stroke contrast
      browser/        # canvasRasterizer, checkTabularFigures
  app/                # Glyphcheck web app
    src/
      data/
        fonts.ts      # Built-in font catalog (12 entries with hand-tuned metrics)
        specimens.ts  # Confusable sets, number rows, specimen presets
      lib/
        contrast.ts   # wcagRatio, wcagReport, apcaLc, apcaGuide
        legibility.ts # legibilityScore, legibilityBand, METRIC_META
        measureFont.ts# Fetch + parse + score a Google Font on demand
        googleFonts.ts# Fetch + cache the Google Fonts catalog, load fonts via CDN
        strings.ts    # Confusable string generator (mulberry32 PRNG)
        urlState.ts   # AppState type, URL encode/decode
      components/     # Logo, ScoreDonut, MetricBars, FontCard, ColorField, Overline, Mono
      panels/         # Five test panels
      rail/           # ControlsBar, ContrastCard, LegibilityRail, ScoresRail
      FontDrawer.tsx  # Left sidebar — comparison set management
      Header.tsx      # App bar — logo, share, dark mode toggle
      App.tsx         # Root layout and state
      theme.ts        # MUI theme (light + dark)
      analytics.ts    # Mixpanel wrapper
```

---

## Publishing `@glyphcheck/score`

```bash
# first time
npm login
cd packages/score
npm publish --dry-run   # verify file list before going live
npm publish             # access:public comes from publishConfig
```

For subsequent releases: `npm version patch|minor|major` then `npm publish`.

---

## Contributing

### Adding a built-in font

Edit [packages/app/src/data/fonts.ts](packages/app/src/data/fonts.ts). Add an entry to `FONTS` with:

- `id` — URL-safe kebab-case, unique
- `css` — the CSS `font-family` value (must match a family available on Bunny Fonts)
- `metrics` — five scores 0–100 (see existing entries for calibration; `null` is valid if unknown)
- `feat` — which OpenType figure features the font ships (`tnum`, `zero`, `onum`)

Then add the family to the Bunny Fonts `<link>` in [packages/app/index.html](packages/app/index.html).

### Caveats to keep in mind

- Legibility scores are heuristics with no official backing. The UI says so explicitly — keep it that way.
- APCA is a draft spec, not yet part of WCAG. It's labeled "non-official" in the UI — don't remove that label.
- The Google Fonts API key has a 10,000 requests/day quota. The catalog is cached in `sessionStorage` to use one request per browser session.
- Fonts are served via Bunny Fonts CDN, not Google Fonts directly, for privacy.

---

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that builds and deploys to GitHub Pages automatically. The `VITE_GOOGLE_FONTS_API_KEY` secret must be set in the repository settings under **Settings → Secrets and variables → Actions**.

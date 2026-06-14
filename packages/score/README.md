# @glyphcheck/score

Heuristic accessibility and legibility scoring for fonts. A framework-free
TypeScript package that combines standards-based color contrast checks with
font-shape heuristics such as x-height, numeral behavior, and character
disambiguation.

Designed for font tools, design systems, and UI audits that need a structured,
explainable score for a parsed `opentype.js` font.

## Important caveat

This package does not certify that a font is accessible. WCAG 2.x color
contrast is standards-based; the glyph metrics are heuristic estimates. Use the
score as a decision aid, and pair it with real user testing and assistive
technology testing for high-stakes work.

## Install

```bash
npm install @glyphcheck/score opentype.js
```

`opentype.js` is a peer dependency. The package also uses `apca-w3` for a
secondary, non-official APCA lightness contrast signal.

## Quick Start

```ts
import opentype from 'opentype.js';
import { scoreFont } from '@glyphcheck/score';
import { canvasRasterizer } from '@glyphcheck/score/browser';

const response = await fetch('/fonts/Inter-Regular.woff');
const font = opentype.parse(await response.arrayBuffer());

const result = scoreFont(font, {
  foreground: '#222222',
  background: '#ffffff',
  fontSizePx: 14,
  rasterize: canvasRasterizer,
});

console.log(result.typeface.overall); // 0..100 (typeface-only)
console.log(result.typeface.grade);   // A, B, C, D, or F
console.log(result.typeface.metrics); // MetricResult[]

// scenario is set when colors are provided
console.log(result.scenario?.overall); // 0..100 (typeface + contrast)
console.log(result.scenario?.grade);

console.log(result.caveats); // string[]
```

## Browser Helpers

The root package is pure scoring logic. Browser-only helpers are exported from
`@glyphcheck/score/browser`.

```ts
import { checkTabularFigures } from '@glyphcheck/score/browser';

await document.fonts.ready;
const tabular = checkTabularFigures('Inter');
console.log(tabular.verdict);
```

`canvasRasterizer` enables the character disambiguation metric by rendering
glyphs to a normalized coverage bitmap. `checkTabularFigures` verifies whether
digits actually render with equal widths in the browser, complementing the font
file's OpenType feature metadata.

## API

### `scoreFont(font, ctx?)`

Scores a parsed `opentype.js` font and returns:

```ts
interface TypefaceScore {
  overall: number;        // 0..100, typeface heuristics only
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  metrics: MetricResult[];
}

interface ScenarioScore {
  overall: number;        // 0..100, typeface + contrast combined
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  contrast: MetricResult;
}

interface FontAccessibilityScore {
  typeface: TypefaceScore;
  scenario: ScenarioScore | null; // null when no colors provided
  caveats: string[];
}
```

`ctx` may include:

```ts
interface ScoreContext {
  fontSizePx?: number;
  bold?: boolean;
  foreground?: string;
  background?: string;
  rasterize?: GlyphRasterizer;
}
```

### `composeScore(metrics)`

Combines custom metric results into the same weighted overall score and grade.

### Contrast Helpers

- `parseHex`, `relativeLuminance`, `contrastRatio`
- `isLargeText`, `wcag`, `apcaLc`, `contrastMetric`

### Metric Helpers

- `xHeightRatio`, `xHeightMetric`
- `gsubFeatureTags`, `digitAdvanceWidths`, `numeralsInfo`, `numeralsMetric`
- `CONFUSABLE_GROUPS`, `glyphDifference`, `scoreDisambiguation`
- `strokeContrastMetric` (placeholder, returns `na` until implemented)

## Scoring Model

**Typeface score** — weighted average of typeface metrics. Metrics with
`status: 'na'` are excluded instead of penalized.

| Metric                   | Weight | Basis                                    |
| ------------------------ | -----: | ---------------------------------------- |
| Character disambiguation |    1.5 | Rasterized glyph difference              |
| x-height ratio           |    1.0 | x-height relative to cap height          |
| Numeral scanning         |    1.0 | OpenType features + digit advance widths |
| Stroke contrast          |    1.0 | Placeholder — returns `na` until implemented |

**Scenario score** — blends typeface score (70%) with color contrast (30%).
Only computed when `foreground` and `background` colors are provided.

Color contrast is scored using WCAG 2.x ratio plus an APCA lightness-contrast note.

Grade bands: A (85–100) · B (70–84) · C (55–69) · D (40–54) · F (0–39)

## Metric Results

```ts
interface MetricResult {
  id: string;
  label: string;
  value: number | null;
  score: number | null;
  weight: number;
  status: 'good' | 'fair' | 'poor' | 'na';
  detail: string;
}
```

## Development

```bash
npm install
npm test
npm run build
```

Output goes to `dist/`. Published files are limited to compiled JS + `.d.ts`.

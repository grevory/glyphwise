// TODO: Populate dynamically from Google Fonts API (requires API key)
// For now, hardcoded catalog of 12 fonts loaded via Bunny Fonts CDN

export interface FontMetrics {
  xh: number;
  ctr: number;
  wd: number;
  even: number;
  dis: number;
}

export interface FontFeatures {
  tnum: boolean;
  zero: boolean;
  onum: boolean;
  slashDefault: boolean;
}

export interface FontEntry {
  id: string;
  name: string;
  css: string;
  cat: string;
  bench: boolean;
  primaryDefault?: boolean;
  blurb: string;
  metrics: FontMetrics | null;
  feat: FontFeatures;
}

export const FONTS: FontEntry[] = [
  {
    id: 'noto-sans',
    name: 'Noto Sans',
    css: "'Noto Sans', sans-serif",
    cat: 'Humanist sans',
    bench: false,
    primaryDefault: true,
    blurb: "Google's pan-script workhorse. Even, neutral, dependable.",
    metrics: { xh: 76, ctr: 78, wd: 66, even: 82, dis: 80 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'atkinson',
    name: 'Atkinson Hyperlegible',
    css: "'Atkinson Hyperlegible', sans-serif",
    cat: 'Legibility',
    bench: true,
    blurb: "Braille Institute font engineered to disambiguate look-alikes for low vision.",
    metrics: { xh: 78, ctr: 88, wd: 70, even: 92, dis: 95 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: true },
  },
  {
    id: 'lexend',
    name: 'Lexend',
    css: "'Lexend', sans-serif",
    cat: 'Legibility',
    bench: true,
    blurb: "Tuned for reading proficiency; generous spacing and width.",
    metrics: { xh: 80, ctr: 84, wd: 74, even: 88, dis: 86 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'inter',
    name: 'Inter',
    css: "'Inter', sans-serif",
    cat: 'Grotesque',
    bench: true,
    blurb: "UI-grade grotesque with rich numeric feature set.",
    metrics: { xh: 82, ctr: 80, wd: 68, even: 84, dis: 82 },
    feat: { tnum: true, zero: true, onum: true, slashDefault: false },
  },
  {
    id: 'plex-sans',
    name: 'IBM Plex Sans',
    css: "'IBM Plex Sans', sans-serif",
    cat: 'Grotesque',
    bench: false,
    blurb: "IBM's corporate grotesque; crisp, slightly mechanical.",
    metrics: { xh: 72, ctr: 80, wd: 64, even: 80, dis: 84 },
    feat: { tnum: true, zero: true, onum: false, slashDefault: false },
  },
  {
    id: 'source-3',
    name: 'Source Sans 3',
    css: "'Source Sans 3', sans-serif",
    cat: 'Humanist sans',
    bench: false,
    blurb: "Adobe's open humanist sans; calm and readable.",
    metrics: { xh: 70, ctr: 76, wd: 62, even: 78, dis: 74 },
    feat: { tnum: true, zero: true, onum: true, slashDefault: false },
  },
  {
    id: 'open-sans',
    name: 'Open Sans',
    css: "'Open Sans', sans-serif",
    cat: 'Humanist sans',
    bench: false,
    blurb: "Ubiquitous, friendly, wide apertures.",
    metrics: { xh: 72, ctr: 78, wd: 66, even: 80, dis: 72 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'roboto',
    name: 'Roboto',
    css: "'Roboto', sans-serif",
    cat: 'Grotesque',
    bench: false,
    blurb: "Android's default; mechanical skeleton, humanist curves.",
    metrics: { xh: 74, ctr: 72, wd: 64, even: 70, dis: 66 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    css: "'Work Sans', sans-serif",
    cat: 'Grotesque',
    bench: false,
    blurb: "Optimised for screen at mid sizes; slightly condensed.",
    metrics: { xh: 68, ctr: 70, wd: 60, even: 72, dis: 64 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    css: "'DM Sans', sans-serif",
    cat: 'Geometric',
    bench: false,
    blurb: "Low-contrast geometric; tidy but tighter apertures.",
    metrics: { xh: 70, ctr: 68, wd: 58, even: 70, dis: 60 },
    feat: { tnum: true, zero: false, onum: false, slashDefault: false },
  },
  {
    id: 'plex-mono',
    name: 'IBM Plex Mono',
    css: "'IBM Plex Mono', monospace",
    cat: 'Monospace',
    bench: false,
    blurb: "Fixed-width; columns align by design -- strong for codes.",
    metrics: { xh: 70, ctr: 78, wd: 50, even: 82, dis: 90 },
    feat: { tnum: true, zero: true, onum: false, slashDefault: false },
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    css: "'JetBrains Mono', monospace",
    cat: 'Monospace',
    bench: false,
    blurb: 'Coding monospace with tall x-height and clear glyphs.',
    metrics: { xh: 72, ctr: 80, wd: 50, even: 84, dis: 92 },
    feat: { tnum: true, zero: true, onum: false, slashDefault: false },
  },
];

export const FONT_BY_ID: Record<string, FontEntry> = Object.fromEntries(
  FONTS.map((f) => [f.id, f])
);

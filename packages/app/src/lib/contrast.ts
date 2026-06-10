function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function clampHex(hex: string): string | null {
  if (!/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hex || '')) return null;
  return hex[0] === '#' ? hex : '#' + hex;
}

function relLuminance(hex: string): number {
  const c = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

export function wcagRatio(fg: string, bg: string): number {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

export interface WcagReport {
  ratio: number;
  ratioStr: string;
  aaBody: boolean;
  aaaBody: boolean;
  aaLarge: boolean;
  aaaLarge: boolean;
  nonText: boolean;
}

export function wcagReport(fg: string, bg: string): WcagReport {
  const r = wcagRatio(fg, bg);
  return {
    ratio: r,
    ratioStr: r.toFixed(2) + ':1',
    aaBody: r >= 4.5,
    aaaBody: r >= 7,
    aaLarge: r >= 3,
    aaaLarge: r >= 4.5,
    nonText: r >= 3,
  };
}

const APCA_S = [0.2126729, 0.7151522, 0.072175];

function apcaY(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => Math.pow(v / 255, 2.4));
  return APCA_S[0] * r + APCA_S[1] * g + APCA_S[2] * b;
}

export function apcaLc(txtHex: string, bgHex: string): number {
  let Ytxt = apcaY(txtHex);
  let Ybg = apcaY(bgHex);
  const blkThrs = 0.022;
  const blkClmp = 1.414;
  const deltaYmin = 0.0005;
  if (Ytxt <= blkThrs) Ytxt += Math.pow(blkThrs - Ytxt, blkClmp);
  if (Ybg <= blkThrs) Ybg += Math.pow(blkThrs - Ybg, blkClmp);
  if (Math.abs(Ybg - Ytxt) < deltaYmin) return 0;
  let SAPC: number;
  let out: number;
  if (Ybg > Ytxt) {
    SAPC = (Math.pow(Ybg, 0.56) - Math.pow(Ytxt, 0.57)) * 1.14;
    out = SAPC < 0.001 ? 0 : (SAPC - 0.027) * 100;
  } else {
    SAPC = (Math.pow(Ybg, 0.65) - Math.pow(Ytxt, 0.62)) * 1.14;
    out = SAPC > -0.001 ? 0 : (SAPC + 0.027) * 100;
  }
  return out;
}

export interface ApcaGuide {
  tier: string;
  use: string;
}

export function apcaGuide(lc: number): ApcaGuide {
  const a = Math.abs(lc);
  if (a >= 90) return { tier: 'Lc 90+', use: 'Any body text, incl. thin weights' };
  if (a >= 75) return { tier: 'Lc 75+', use: 'Body text ≥ ~16px' };
  if (a >= 60) return { tier: 'Lc 60+', use: 'Larger / medium body, ≥ ~18px' };
  if (a >= 45) return { tier: 'Lc 45+', use: 'Large headings only' };
  if (a >= 30) return { tier: 'Lc 30+', use: 'Non-text / large display' };
  if (a >= 15) return { tier: 'Lc 15+', use: 'Minimum perceivable, decorative' };
  return { tier: 'Lc < 15', use: 'Insufficient' };
}

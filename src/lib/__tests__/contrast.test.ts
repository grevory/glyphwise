import { describe, it, expect } from 'vitest';
import { wcagRatio, wcagReport, apcaLc, apcaGuide } from '../contrast';

describe('wcagRatio', () => {
  it('black on white = 21:1', () => {
    expect(wcagRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('white on white = 1:1', () => {
    expect(wcagRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1);
  });

  it('is symmetric (fg/bg order doesnt change ratio)', () => {
    const a = wcagRatio('#333333', '#ffffff');
    const b = wcagRatio('#ffffff', '#333333');
    expect(a).toBeCloseTo(b, 5);
  });
});

describe('wcagReport', () => {
  it('black on white passes all thresholds', () => {
    const r = wcagReport('#000000', '#ffffff');
    expect(r.aaBody).toBe(true);
    expect(r.aaaBody).toBe(true);
    expect(r.aaLarge).toBe(true);
    expect(r.aaaLarge).toBe(true);
    expect(r.nonText).toBe(true);
  });

  it('light gray on white fails AA body', () => {
    const r = wcagReport('#cccccc', '#ffffff');
    expect(r.aaBody).toBe(false);
    expect(r.aaLarge).toBe(false);
  });

  it('ratioStr is formatted correctly', () => {
    const r = wcagReport('#000000', '#ffffff');
    expect(r.ratioStr).toMatch(/^\d+\.\d{2}:1$/);
  });
});

describe('apcaLc', () => {
  it('black text on white bg gives positive Lc near -107', () => {
    const lc = apcaLc('#000000', '#ffffff');
    expect(Math.abs(lc)).toBeGreaterThan(100);
  });

  it('same color returns ~0', () => {
    const lc = apcaLc('#888888', '#888888');
    expect(Math.abs(lc)).toBeLessThan(5);
  });
});

describe('apcaGuide', () => {
  it('Lc > 90 → any body text', () => {
    expect(apcaGuide(107).tier).toBe('Lc 90+');
  });

  it('Lc < 15 → insufficient', () => {
    expect(apcaGuide(5).tier).toBe('Lc < 15');
  });
});

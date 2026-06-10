import { describe, it, expect } from 'vitest';
import { legibilityScore, legibilityBand, LEGIBILITY_WEIGHTS } from '../legibility';
import type { FontEntry } from '../../data/fonts';

const mockFont = (metrics: FontEntry['metrics']): FontEntry => ({
  id: 'test',
  name: 'Test Font',
  css: "'Test', sans-serif",
  cat: 'Test',
  bench: false,
  blurb: '',
  metrics,
  feat: { tnum: false, zero: false, onum: false, slashDefault: false },
});

describe('legibilityScore', () => {
  it('returns null when metrics is null', () => {
    expect(legibilityScore(mockFont(null))).toBeNull();
  });

  it('returns null for null/undefined font', () => {
    expect(legibilityScore(null)).toBeNull();
    expect(legibilityScore(undefined)).toBeNull();
  });

  it('computes weighted score correctly for known values', () => {
    // all metrics = 100 → score should be 100
    const font = mockFont({ xh: 100, ctr: 100, wd: 100, even: 100, dis: 100 });
    expect(legibilityScore(font, LEGIBILITY_WEIGHTS)).toBe(100);
  });

  it('computes weighted score for all zeros', () => {
    const font = mockFont({ xh: 0, ctr: 0, wd: 0, even: 0, dis: 0 });
    expect(legibilityScore(font, LEGIBILITY_WEIGHTS)).toBe(0);
  });

  it('matches manual calculation for a known set', () => {
    // dis=80, ctr=88, xh=78, even=92, wd=70 (Atkinson-like)
    const font = mockFont({ dis: 80, ctr: 88, xh: 78, even: 92, wd: 70 });
    const w = LEGIBILITY_WEIGHTS;
    const expected = Math.round(
      (80 * w.dis + 88 * w.ctr + 78 * w.xh + 92 * w.even + 70 * w.wd) /
      (w.dis + w.ctr + w.xh + w.even + w.wd)
    );
    expect(legibilityScore(font, w)).toBe(expected);
  });
});

describe('legibilityBand', () => {
  it('null score → Pending', () => {
    expect(legibilityBand(null).label).toBe('Pending');
  });

  it('score ≥ 82 → Excellent', () => {
    expect(legibilityBand(85).label).toBe('Excellent');
    expect(legibilityBand(82).label).toBe('Excellent');
  });

  it('score 74–81 → Strong', () => {
    expect(legibilityBand(78).label).toBe('Strong');
  });

  it('score 66–73 → Adequate', () => {
    expect(legibilityBand(70).label).toBe('Adequate');
  });

  it('score < 66 → Caution', () => {
    expect(legibilityBand(50).label).toBe('Caution');
  });
});

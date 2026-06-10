import type { FontEntry } from '../data/fonts';

export interface MetricMeta {
  key: string;
  label: string;
  hint: string;
}

export const LEGIBILITY_WEIGHTS: Record<string, number> = {
  dis:  0.30,
  ctr:  0.22,
  xh:   0.20,
  even: 0.16,
  wd:   0.12,
};

export const METRIC_META: MetricMeta[] = [
  { key: 'dis',  label: 'Disambiguation',   hint: 'Shape difference across confusable pairs (Il1, O0, rn/m).' },
  { key: 'ctr',  label: 'Counter openness', hint: 'Aperture size -- open counters resist clogging at small sizes.' },
  { key: 'xh',   label: 'x-height ratio',   hint: 'Taller lowercase improves recognition at small sizes.' },
  { key: 'even', label: 'Stroke evenness',  hint: 'Low stroke modulation stays steady under low contrast / blur.' },
  { key: 'wd',   label: 'Width & spacing',  hint: 'Generous width and sidebearings reduce crowding.' },
];

export function legibilityScore(
  font: FontEntry | null | undefined,
  weights?: Record<string, number>
): number | null {
  if (!font?.metrics) return null;
  const w = weights ?? LEGIBILITY_WEIGHTS;
  const m = font.metrics as unknown as Record<string, number>;
  let sum = 0;
  let wsum = 0;
  for (const k in w) {
    sum += (m[k] ?? 0) * w[k];
    wsum += w[k];
  }
  return Math.round(sum / (wsum || 1));
}

export interface LegibilityBand {
  label: string;
  color: 'success' | 'warning' | 'error' | 'primary';
}

export function legibilityBand(score: number | null): LegibilityBand {
  if (score == null) return { label: 'Pending', color: 'primary' };
  if (score >= 82) return { label: 'Excellent', color: 'success' };
  if (score >= 74) return { label: 'Strong', color: 'success' };
  if (score >= 66) return { label: 'Adequate', color: 'warning' };
  return { label: 'Caution', color: 'error' };
}

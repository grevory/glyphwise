import React from 'react';
import type { AppState } from '../lib/urlState';
import type { FontEntry } from '../data/fonts';
import { FONT_BY_ID } from '../data/fonts';

export interface SpecimenStyle {
  fontFamily: string;
  fontSize: number | string;
  fontWeight: number;
  fontStyle: string;
  letterSpacing: string;
  wordSpacing: string;
  lineHeight: number;
  color: string;
}

export function specimenStyle(s: AppState, fontCss: string, extra?: Partial<SpecimenStyle>): SpecimenStyle {
  return {
    fontFamily: fontCss,
    fontSize: s.size,
    fontWeight: s.bold ? 700 : s.weight,
    fontStyle: s.italic ? 'italic' : 'normal',
    letterSpacing: s.letterSpacing + 'em',
    wordSpacing: s.wordSpacing + 'em',
    lineHeight: s.lineHeight,
    color: s.fg,
    ...extra,
  };
}

export function fontList(s: AppState, registry: Record<string, FontEntry> = FONT_BY_ID): FontEntry[] {
  return s.activeFonts.map((id) => registry[id]).filter(Boolean) as FontEntry[];
}

export function gridCols(n: number): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
    gap: 0,
  } as React.CSSProperties;
}

export const RAMP_SIZES = [10, 12, 14, 16, 18];

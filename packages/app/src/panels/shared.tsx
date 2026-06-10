import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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

export function fontList(s: AppState): FontEntry[] {
  return s.activeFonts.map((id) => FONT_BY_ID[id]).filter(Boolean) as FontEntry[];
}

export function gridCols(n: number): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
    gap: 0,
  } as React.CSSProperties;
}

interface SurfaceProps {
  s: AppState;
  children: React.ReactNode;
  sx?: object;
}

export function Surface({ s, children, sx }: SurfaceProps) {
  return (
    <Paper variant="outlined" sx={{
      bgcolor: s.bg, color: s.fg, borderRadius: 3, p: { xs: 2, md: 3 },
      borderColor: 'divider', transition: 'background-color .2s', ...sx,
    }}>
      {children}
    </Paper>
  );
}

interface FgLabelProps {
  s: AppState;
  children: React.ReactNode;
  sx?: object;
}

export function FgLabel({ s, children, sx }: FgLabelProps) {
  return (
    <Box sx={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
      letterSpacing: '.08em', textTransform: 'uppercase', color: s.fg, opacity: 0.55,
      ...sx,
    }}>
      {children}
    </Box>
  );
}

export const RAMP_SIZES = [10, 12, 14, 16, 18];

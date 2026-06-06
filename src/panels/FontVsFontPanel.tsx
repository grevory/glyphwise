import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useTheme, alpha } from '@mui/material/styles';
import { legibilityScore, legibilityBand, LEGIBILITY_WEIGHTS } from '../lib/legibility';
import { SPECIMEN_PRESETS } from '../data/specimens';
import type { AppState } from '../lib/urlState';
import { Surface, FgLabel, specimenStyle, fontList, gridCols, RAMP_SIZES } from './shared';

interface Props { s: AppState; weights?: Record<string, number> }

export function FontVsFontPanel({ s, weights }: Props) {
  const theme = useTheme();
  const fonts = fontList(s);
  const text = s.text || SPECIMEN_PRESETS.paragraph;
  const w = weights ?? LEGIBILITY_WEIGHTS;

  return (
    <Surface s={s}>
      <FgLabel s={s} sx={{ mb: 2 }}>Font vs font -- same text, parallel columns</FgLabel>
      <Box sx={{ ...gridCols(fonts.length), gap: 0 }}>
        {fonts.map((f, i) => {
          const score = legibilityScore(f, w);
          const band = legibilityBand(score);
          return (
            <Box key={f.id} sx={{
              px: { xs: 1.5, md: 2.5 }, py: 0.5,
              borderLeft: i === 0 ? 'none' : `1px solid ${alpha(s.fg, 0.1)}`,
            }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: s.fg }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: 10.5, color: s.fg, opacity: 0.5 }}>
                    {f.cat}{i === 0 ? ' · primary' : ''}
                  </Typography>
                </Box>
                <Chip size="small" label={score == null ? '--' : score}
                  sx={{
                    fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, height: 24,
                    bgcolor: alpha(theme.palette[band.color].main, 0.18),
                    color: theme.palette[band.color].main,
                  }} />
              </Stack>
              {s.ramp ? (
                <Stack spacing={1.25}>
                  {RAMP_SIZES.map((sz) => (
                    <Box key={sz}>
                      <FgLabel s={s} sx={{ fontSize: 8.5, opacity: 0.4 }}>{sz}px</FgLabel>
                      <Box style={specimenStyle(s, f.css, { fontSize: sz }) as React.CSSProperties}>{text}</Box>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box style={specimenStyle(s, f.css) as React.CSSProperties}>{text}</Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Surface>
  );
}

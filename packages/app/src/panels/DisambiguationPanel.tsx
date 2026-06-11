import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { CONFUSABLES } from '../data/specimens';
import type { AppState } from '../lib/urlState';
import type { FontEntry } from '../data/fonts';
import { Surface, FgLabel } from './shared';
import { specimenStyle, fontList, gridCols } from './shared-utils';

interface Props { s: AppState; registry: Record<string, FontEntry> }

export function DisambiguationPanel({ s, registry }: Props) {
  const fonts = fontList(s, registry);

  return (
    <Surface s={s}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <FgLabel s={s}>Character disambiguation</FgLabel>
          <Typography sx={{ fontSize: 13, color: s.fg, opacity: 0.6, mt: 0.5, maxWidth: 520 }}>
            Commonly confused glyphs, spaced for inspection. Drop the size slider toward 10px to find where a typeface stops disambiguating.
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ ...gridCols(fonts.length + 1), borderBottom: `1px solid ${alpha(s.fg, 0.12)}`, pb: 1, mb: 1 }}>
        <FgLabel s={s} sx={{ fontSize: 10 }}>Pair</FgLabel>
        {fonts.map((f, i) => (
          <FgLabel key={f.id} s={s} sx={{ fontSize: 10, pl: 1 }}>
            {f.name}{i === 0 ? ' · primary' : ''}
          </FgLabel>
        ))}
      </Box>

      <Stack divider={<Divider sx={{ borderColor: alpha(s.fg, 0.08) }} />}>
        {CONFUSABLES.map((set) => (
          <Box key={set.key} sx={{ ...gridCols(fonts.length + 1), alignItems: 'center', py: 1.1 }}>
            <Box sx={{ pr: 1 }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: s.fg }}>
                {set.chars.replace(/ /g, ' / ')}
              </Typography>
              <Typography sx={{ fontSize: 10.5, color: s.fg, opacity: 0.5 }}>{set.label}</Typography>
            </Box>
            {fonts.map((f) => (
              <Box key={f.id} sx={{ pl: 1, display: 'inline-flex', gap: '0.3em', flexWrap: 'wrap' }}>
                {[...set.chars].map((ch, i) =>
                  ch === ' '
                    ? <Box key={i} sx={{ width: '0.5em' }} />
                    : <span key={i} style={specimenStyle(s, f.css, { fontSize: Math.max(s.size, 14) * 1.35 }) as React.CSSProperties}>{ch}</span>
                )}
              </Box>
            ))}
          </Box>
        ))}
      </Stack>
    </Surface>
  );
}

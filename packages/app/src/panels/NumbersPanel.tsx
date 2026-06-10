import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import { NUMBER_ROWS } from '../data/specimens';
import type { AppState } from '../lib/urlState';
import { Surface, FgLabel, specimenStyle, fontList, gridCols } from './shared';

interface FeatToggleProps {
  s: AppState;
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}

function FeatToggle({ s, on, onClick, children, title }: FeatToggleProps) {
  return (
    <Tooltip arrow title={title}>
      <ToggleButton value="x" selected={on} onClick={onClick} size="small"
        sx={{
          textTransform: 'none', px: 1.5, color: s.fg, borderColor: alpha(s.fg, 0.25),
          fontSize: 12.5,
          '&.Mui-selected': {
            color: s.bg, bgcolor: s.fg,
            '&:hover': { bgcolor: alpha(s.fg, 0.85) },
          },
        }}>
        {children}
      </ToggleButton>
    </Tooltip>
  );
}

interface Props { s: AppState }

export function NumbersPanel({ s }: Props) {
  const fonts = fontList(s);
  const [tnum, setTnum] = useState(true);
  const [lining, setLining] = useState(true);
  const [slash, setSlash] = useState(false);

  const fvn = [
    tnum ? 'tabular-nums' : 'proportional-nums',
    lining ? 'lining-nums' : 'oldstyle-nums',
    slash ? 'slashed-zero' : '',
  ].filter(Boolean).join(' ');

  return (
    <Surface s={s}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2, gap: 1.5 }}>
        <Box>
          <FgLabel s={s}>Numbers &amp; figures · alignment</FgLabel>
          <Typography sx={{ fontSize: 13, color: s.fg, opacity: 0.6, mt: 0.5, maxWidth: 520 }}>
            Right-aligned columns of varied numbers. Toggle the figure features and watch whether digits line up for grid scanning.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <FeatToggle s={s} on={tnum} onClick={() => setTnum((v) => !v)}
            title="tabular-nums: every digit shares one fixed width so columns align. Off = proportional-nums.">
            Tabular
          </FeatToggle>
          <FeatToggle s={s} on={!lining} onClick={() => setLining((v) => !v)}
            title="oldstyle-nums: figures with ascenders/descenders that sit in text. On here = oldstyle, off = lining.">
            Oldstyle
          </FeatToggle>
          <FeatToggle s={s} on={slash} onClick={() => setSlash((v) => !v)}
            title="slashed-zero: disambiguates 0 from O. Only fonts that ship the feature respond.">
            Slashed&nbsp;0
          </FeatToggle>
        </Stack>
      </Stack>

      <Box sx={{ ...gridCols(fonts.length), gap: 0 }}>
        {fonts.map((f, i) => {
          const support: string[] = [];
          if (f.feat.tnum) support.push('tnum');
          if (f.feat.zero || f.feat.slashDefault) support.push('zero');
          if (f.feat.onum) support.push('onum');

          return (
            <Box key={f.id} sx={{
              px: { xs: 1.5, md: 2.5 }, py: 0.5,
              borderLeft: i === 0 ? 'none' : `1px solid ${alpha(s.fg, 0.1)}`,
            }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1.25 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: s.fg }}>
                  {f.name}{i === 0 ? ' ·' : ''}
                </Typography>
              </Stack>
              <Box sx={{ textAlign: 'right' }}>
                {NUMBER_ROWS.map((n, j) => (
                  <Box key={j}
                    style={{
                      ...(specimenStyle(s, f.css, { fontSize: Math.max(s.size, 15) }) as React.CSSProperties),
                      fontVariantNumeric: fvn,
                      fontFeatureSettings: slash ? '"zero" 1' : 'normal',
                    }}
                    sx={{ py: 0.35, borderBottom: `1px solid ${alpha(s.fg, 0.07)}` }}>
                    {n}
                  </Box>
                ))}
              </Box>
              <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {support.length > 0 ? support.map((t) => (
                  <Chip key={t} size="small" label={t} variant="outlined"
                    sx={{
                      height: 18, fontSize: 9.5, fontFamily: "'IBM Plex Mono', monospace",
                      color: s.fg, opacity: 0.55, borderColor: alpha(s.fg, 0.25),
                    }} />
                )) : (
                  <Typography sx={{
                    fontSize: 9.5, color: s.fg, opacity: 0.4,
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    no opt. figures
                  </Typography>
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Surface>
  );
}

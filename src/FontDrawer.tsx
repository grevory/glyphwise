import React, { useRef } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { FONTS, FONT_BY_ID, type FontEntry } from './data/fonts';
import { FontCard } from './components/FontCard';
import { Overline } from './components/Overline';
import { Mono } from './components/Mono';
import { IconAdd, IconUpload, IconStar } from './icons';
import type { AppState } from './lib/urlState';

const MAX_FONTS = 5;

interface FontDrawerProps {
  s: AppState;
  set: (patch: Partial<AppState>) => void;
  onUpload: (file: File) => void;
}

export function FontDrawer({ s, set, onUpload }: FontDrawerProps) {
  const active = s.activeFonts;
  const options = FONTS.filter((f) => !active.includes(f.id));
  const benches = FONTS.filter((f) => f.bench && !active.includes(f.id));
  const fileRef = useRef<HTMLInputElement>(null);

  const addFont = (id: string) => {
    if (id && !active.includes(id) && active.length < MAX_FONTS) {
      set({ activeFonts: [...active, id] });
    }
  };
  const removeFont = (id: string) => {
    if (active.length > 1) set({ activeFonts: active.filter((x) => x !== id) });
  };
  const makePrimary = (id: string) => {
    set({ activeFonts: [id, ...active.filter((x) => x !== id)] });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}>
        <Overline>Comparison set</Overline>
        <Mono sx={{ fontSize: 11, color: 'text.secondary' }}>{active.length}/{MAX_FONTS}</Mono>
      </Stack>

      <Stack spacing={1.25}>
        {active.map((id) => {
          const f = FONT_BY_ID[id] as FontEntry | undefined;
          if (!f) return null;
          return (
            <FontCard key={id} font={f} isPrimary={id === active[0]}
              onPrimary={() => makePrimary(id)} onRemove={() => removeFont(id)} />
          );
        })}
      </Stack>

      <Box sx={{ mt: 2 }}>
        <Autocomplete
          size="small" options={options} value={null} blurOnSelect clearOnBlur
          disabled={active.length >= MAX_FONTS}
          getOptionLabel={(f) => f.name}
          onChange={(_, v) => v && addFont(v.id)}
          renderOption={(props, f) => (
            <li {...props} key={f.id}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontFamily: f.css }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: 10.5, color: 'text.secondary' }}>{f.cat}</Typography>
                </Box>
                {f.bench && (
                  <Box sx={{ color: 'primary.main', display: 'flex' }}><IconStar size={13} /></Box>
                )}
              </Box>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={active.length >= MAX_FONTS ? 'Limit reached' : 'Add a font...'}
              slotProps={{
                input: {
                  startAdornment: (
                    <Box sx={{ color: 'text.disabled', display: 'flex', pl: 0.5 }}><IconAdd size={16} /></Box>
                  ),
                },
              }}
            />
          )}
        />
      </Box>

      <Button fullWidth variant="outlined" startIcon={<IconUpload size={16} />}
        onClick={() => fileRef.current?.click()}
        sx={{
          mt: 1.25, textTransform: 'none', justifyContent: 'flex-start',
          color: 'text.secondary', borderColor: 'divider',
          '&:hover': { borderColor: 'text.secondary' },
        }}>
        Upload .woff2 / .ttf / .otf
      </Button>
      <input ref={fileRef} type="file" accept=".woff2,.woff,.ttf,.otf,font/*" hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = '';
        }} />

      {benches.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Overline sx={{ mb: 1, display: 'block' }}>Benchmarks · always available</Overline>
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap' }}>
            {benches.map((f) => (
              <Chip key={f.id} label={f.name} size="small" onClick={() => addFont(f.id)}
                icon={<IconAdd size={13} />} variant="outlined"
                sx={{ borderColor: 'divider', '& .MuiChip-icon': { ml: '6px' } }} />
            ))}
          </Stack>
          <Typography sx={{ fontSize: 10.5, color: 'text.disabled', mt: 1, lineHeight: 1.5 }}>
            Designed-for-legibility references to compare your candidates against.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

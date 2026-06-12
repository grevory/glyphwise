import mixpanel from 'mixpanel-browser';

mixpanel.init('d24c783c9ccd699ea8a3d66b78bbc50b', {
  autocapture: true,
  record_sessions_percent: 100,
  persistence: 'localStorage',
});

export function track(event: string, props?: Record<string, unknown>): void {
  mixpanel.track(event, props);
}

const TAB_NAMES = ['disambiguation', 'confusable_strings', 'font_vs_font', 'stacked', 'numerals'] as const;
export type TabName = typeof TAB_NAMES[number];

export function tabName(index: number): TabName {
  return TAB_NAMES[index] ?? 'disambiguation';
}

export function trackFontSelected(slot: string, fontName: string, fontSource: 'system' | 'google' | 'custom'): void {
  track('Font Selected', { slot, font_name: fontName, font_source: fontSource });
}

export function trackCustomFontUploaded(slot: string, fileName: string, fileSizeKb: number): void {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'unknown';
  track('Custom Font Uploaded', { slot, file_format: ext, file_size_kb: fileSizeKb });
}

export function trackTabChanged(tabIndex: number, fontA: string, fontB: string): void {
  track('Tab Changed', { tab_name: tabName(tabIndex), font_a: fontA, font_b: fontB });
}

export function trackTextSettingChanged(setting: string, value: string | number): void {
  track('Text Setting Changed', { setting, value });
}

export function trackResultShared(fontA: string, fontB: string, tabIndex: number): void {
  track('Result Shared', { method: 'link', font_a: fontA, font_b: fontB, tab_name: tabName(tabIndex) });
}

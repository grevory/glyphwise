import mixpanel from 'mixpanel-browser';

mixpanel.init('d24c783c9ccd699ea8a3d66b78bbc50b', {
  autocapture: true,
  record_sessions_percent: 100,
  persistence: 'localStorage',
});

export function track(event: string, props?: Record<string, unknown>): void {
  mixpanel.track(event, props);
}

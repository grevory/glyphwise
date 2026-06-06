// TODO: Initialize Mixpanel with project token
// Consider a cookieless alternative (Plausible, PostHog) to avoid consent banner
// on a privacy-themed tool. Swap by replacing this module's implementation.

export function track(_event: string, _props?: Record<string, unknown>): void {
  // no-op until analytics token is configured
}

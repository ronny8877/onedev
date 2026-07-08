// Ad configuration
// ---------------------------------------------------------------------------
// Provider-agnostic setup so we can switch ad networks (or turn ads off) from a
// single place. Components never hardcode a provider — they render whatever
// `AD_PROVIDER` points at, using the per-provider slot maps below.
//
// To switch providers:
//   1. Set AD_PROVIDER to the new provider.
//   2. Fill in that provider's slot map (ids/formats from its dashboard).
//   3. Add a render branch for it in AdSlot.svelte if it isn't there yet.
//
// SAFETY: only standard, sandboxed ad tags belong here (script/iframe/<ins>).
// Never wire up a remote service-worker ("importScripts") monetization script —
// that executes unaudited third-party code on every visitor and gets sites
// flagged as adware (and violates Google AdSense policy).

export type AdProvider = 'google' | 'none';

// Master switches.
export const ADS_ENABLED = true;
export const AD_PROVIDER: AdProvider = 'google';

// Named placements used across the app. Add a name here, then map it for each
// provider below, and drop <AdSlot name="..." /> wherever you want it.
export type AdSlotName = 'tool-top' | 'tool-bottom';

// --- Google AdSense ---------------------------------------------------------
export const GOOGLE_AD_CLIENT = 'ca-pub-6428755652534745';

export interface GoogleSlot {
	slot: string; // data-ad-slot id from the AdSense dashboard
	format?: string; // data-ad-format (default 'auto')
	responsive?: boolean; // data-full-width-responsive
}

// Placeholder ids (prefixed with REPLACE_) render an empty reserved space
// instead of a live unit, so the layout is preserved before real ids exist.
const googleSlots: Record<AdSlotName, GoogleSlot> = {
	// Responsive display unit at the top of each tool page.
	'tool-top': { slot: '7556459335', format: 'auto', responsive: true },
	// Multiplex / "autorelaxed" unit — a content-grid ad suited to the end of a page.
	'tool-bottom': { slot: '2572937418', format: 'autorelaxed' }
};

export function getGoogleSlot(name: AdSlotName): GoogleSlot {
	return googleSlots[name];
}

// True when the active provider doesn't have a real slot id for this placement
// yet — the component shows a placeholder instead of an (empty) live unit.
export function isPlaceholderSlot(name: AdSlotName): boolean {
	if (AD_PROVIDER === 'google') return getGoogleSlot(name).slot.startsWith('REPLACE_');
	return true;
}

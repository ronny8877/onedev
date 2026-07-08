<script lang="ts">
	import { onMount } from 'svelte';
	import { browser, dev } from '$app/environment';
	import {
		ADS_ENABLED,
		AD_PROVIDER,
		GOOGLE_AD_CLIENT,
		getGoogleSlot,
		isPlaceholderSlot,
		type AdSlotName
	} from '$lib/config/ads';

	interface Props {
		name: AdSlotName;
		/** Reserved height (px) to avoid layout shift while the ad loads. */
		minHeight?: number;
		class?: string;
	}

	let { name, minHeight = 90, class: className = '' }: Props = $props();

	// Show a labeled placeholder (not a live unit) during local dev, when ads are
	// off, when there's no provider, or when the slot id isn't configured yet.
	const showPlaceholder = $derived(
		!ADS_ENABLED || dev || AD_PROVIDER === 'none' || isPlaceholderSlot(name)
	);

	const google = $derived(AD_PROVIDER === 'google' ? getGoogleSlot(name) : null);

	onMount(() => {
		if (!browser || showPlaceholder) return;
		if (AD_PROVIDER === 'google') {
			try {
				// adsbygoogle is injected by the loader in app.html
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
			} catch {
				// Ignore duplicate pushes that can happen during client-side navigation
			}
		}
	});
</script>

{#if ADS_ENABLED && AD_PROVIDER !== 'none'}
	<aside class="ad-slot my-4 w-full {className}" aria-label="Advertisement">
		{#if showPlaceholder}
			<!-- Reserved, intentionally empty space until a live unit is configured -->
			<div style="min-height: {minHeight}px" aria-hidden="true"></div>
		{:else if AD_PROVIDER === 'google' && google}
			<ins
				class="adsbygoogle block"
				style="display: block; min-height: {minHeight}px"
				data-ad-client={GOOGLE_AD_CLIENT}
				data-ad-slot={google.slot}
				data-ad-format={google.format ?? 'auto'}
				data-full-width-responsive={google.responsive ? 'true' : undefined}
			></ins>
		{/if}
		<!--
			To add another provider, map its slots in $lib/config/ads.ts and add a
			branch above (e.g. a standard banner <script>/iframe tag). Do NOT inject
			remote service-worker scripts (importScripts) — unaudited third-party
			code on every request, flagged as adware and against AdSense policy.
		-->
	</aside>
{/if}

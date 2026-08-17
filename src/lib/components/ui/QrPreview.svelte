<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import type QRCodeStyling from 'qr-code-styling';
	import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel, FileExtension } from 'qr-code-styling';

	interface Props {
		data: string;
		size?: number;
		margin?: number;
		dotsType?: DotType;
		dotsColor?: string;
		backgroundColor?: string;
		cornersSquareType?: CornerSquareType;
		cornersDotType?: CornerDotType;
		errorCorrection?: ErrorCorrectionLevel;
		image?: string;
		imageSize?: number;
		hideBackgroundDots?: boolean;
		filename?: string;
	}

	let {
		data,
		size = 280,
		margin = 8,
		dotsType = 'rounded',
		dotsColor = '#111827',
		backgroundColor = '#ffffff',
		cornersSquareType = 'extra-rounded',
		cornersDotType = 'dot',
		errorCorrection = 'M',
		image = '',
		imageSize = 0.35,
		hideBackgroundDots = true,
		filename = 'qr-code'
	}: Props = $props();

	let host = $state<HTMLDivElement | undefined>();
	let qr: QRCodeStyling | null = null;
	let ready = $state(false);
	let error = $state('');

	function options() {
		const level = image ? (errorCorrection === 'L' || errorCorrection === 'M' ? 'H' : errorCorrection) : errorCorrection;
		return {
			width: size,
			height: size,
			type: 'svg' as const,
			data: data || ' ',
			margin,
			qrOptions: {
				errorCorrectionLevel: level
			},
			image: image || undefined,
			imageOptions: {
				hideBackgroundDots,
				imageSize,
				margin: 4,
				crossOrigin: 'anonymous'
			},
			dotsOptions: {
				type: dotsType,
				color: dotsColor
			},
			backgroundOptions: {
				color: backgroundColor
			},
			cornersSquareOptions: {
				type: cornersSquareType,
				color: dotsColor
			},
			cornersDotOptions: {
				type: cornersDotType,
				color: dotsColor
			}
		};
	}

	onMount(() => {
		if (!browser || !host) return;
		let cancelled = false;

		import('qr-code-styling').then((mod) => {
			if (cancelled || !host) return;
			const Ctor = mod.default;
			qr = new Ctor(options());
			qr.append(host);
			ready = true;
		}).catch((err) => {
			error = err instanceof Error ? err.message : 'Could not render QR code.';
		});

		return () => {
			cancelled = true;
			qr = null;
			if (host) host.innerHTML = '';
		};
	});

	$effect(() => {
		const next = options();
		if (!qr || !data) return;
		try {
			qr.update(next);
			error = '';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Could not update QR code.';
		}
	});

	async function handleDownload(extension: FileExtension) {
		if (!qr || !data) return;
		await qr.download({ name: filename, extension });
	}
</script>

<div class="flex flex-col items-center gap-4">
	<div
		class="relative flex items-center justify-center rounded-2xl border border-base-300 bg-base-200 p-4"
		style="min-height: {size + 32}px; min-width: {Math.min(size + 32, 320)}px"
	>
		{#if !data}
			<p class="absolute inset-0 z-10 flex items-center justify-center text-sm text-base-content/50 px-6 text-center">
				Enter content to generate a QR code.
			</p>
		{/if}
		<div bind:this={host} class="qr-host overflow-hidden rounded-xl bg-white {data ? '' : 'invisible'}"></div>
	</div>

	{#if error}
		<p class="text-sm text-error">{error}</p>
	{/if}

	{#if data && ready}
		<div class="flex flex-wrap justify-center gap-2">
			<button type="button" class="btn btn-primary btn-sm" onclick={() => handleDownload('png')}>Download PNG</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={() => handleDownload('svg')}>SVG</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={() => handleDownload('jpeg')}>JPEG</button>
		</div>
	{/if}
</div>

<style>
	.qr-host :global(svg),
	.qr-host :global(canvas) {
		display: block;
		max-width: 100%;
		height: auto;
	}
</style>

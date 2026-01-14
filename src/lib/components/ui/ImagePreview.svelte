<script lang="ts">
	import { formatFileSize } from '$lib/utils/image';

	interface Props {
		originalSrc: string;
		processedSrc: string;
		originalSize?: number;
		processedSize?: number;
		mode?: 'slider' | 'sideBySide';
	}

	let {
		originalSrc,
		processedSrc,
		originalSize,
		processedSize,
		mode = 'slider'
	}: Props = $props();

	let sliderPosition = $state(50);
	let containerRef: HTMLDivElement;

	function handleMouseMove(e: MouseEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		const x = e.clientX - rect.left;
		sliderPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
	}

	function handleTouchMove(e: TouchEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		const x = e.touches[0].clientX - rect.left;
		sliderPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
	}

	let savings = $derived(
		originalSize && processedSize
			? Math.round(((originalSize - processedSize) / originalSize) * 100)
			: 0
	);
</script>

{#if mode === 'slider'}
	<div
		bind:this={containerRef}
		class="relative aspect-video w-full overflow-hidden rounded-2xl bg-base-300 cursor-col-resize select-none"
		role="slider"
		aria-valuenow={sliderPosition}
		aria-valuemin={0}
		aria-valuemax={100}
		tabindex="0"
		onmousemove={handleMouseMove}
		ontouchmove={handleTouchMove}
	>
		<!-- Processed image (bottom layer) -->
		<img
			src={processedSrc}
			alt="Processed"
			class="absolute inset-0 h-full w-full object-contain"
		/>

		<!-- Original image (clipped) -->
		<div
			class="absolute inset-0 overflow-hidden"
			style="width: {sliderPosition}%"
		>
			<img
				src={originalSrc}
				alt="Original"
				class="h-full w-full object-contain"
				style="width: {100 / (sliderPosition / 100)}%"
			/>
		</div>

		<!-- Slider line -->
		<div
			class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
			style="left: {sliderPosition}%"
		>
			<div
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
			>
				<svg class="h-5 w-5 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
				</svg>
			</div>
		</div>

		<!-- Labels -->
		<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
			Original
		</div>
		<div class="absolute top-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
			Processed
		</div>
	</div>
{:else}
	<!-- Side by side mode -->
	<div class="grid grid-cols-2 gap-4">
		<div class="relative">
			<img src={originalSrc} alt="Original" class="w-full rounded-2xl bg-base-300 object-contain" />
			<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
				Original
			</div>
		</div>
		<div class="relative">
			<img src={processedSrc} alt="Processed" class="w-full rounded-2xl bg-base-300 object-contain" />
			<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
				Processed
			</div>
		</div>
	</div>
{/if}

<!-- Size comparison -->
{#if originalSize && processedSize}
	<div class="mt-4 flex items-center justify-center gap-6 text-sm">
		<div class="text-center">
			<div class="text-base-content/50">Original</div>
			<div class="font-mono font-semibold">{formatFileSize(originalSize)}</div>
		</div>
		<div class="text-center">
			<svg class="mx-auto h-5 w-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
			</svg>
		</div>
		<div class="text-center">
			<div class="text-base-content/50">Processed</div>
			<div class="font-mono font-semibold">{formatFileSize(processedSize)}</div>
		</div>
		{#if savings > 0}
			<div class="badge badge-success gap-1">
				<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				{savings}% smaller
			</div>
		{:else if savings < 0}
			<div class="badge badge-warning gap-1">
				{Math.abs(savings)}% larger
			</div>
		{/if}
	</div>
{/if}

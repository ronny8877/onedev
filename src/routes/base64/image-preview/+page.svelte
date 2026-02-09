<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import { validateBase64, detectMimeType } from '$lib/utils/base64';
	import { base64ToolsContent } from '$lib/config/content/base64-tools-content';

	const content = base64ToolsContent['image-preview'];

	let input = $state('');
	let imageUrl = $state<string | null>(null);
	let imageInfo = $state<{ width: number; height: number; mimeType: string } | null>(null);
	let error = $state<string | null>(null);
	let previewTimeout: ReturnType<typeof setTimeout> | null = null;

	// Red pixel 1x1 base64
	const sampleInput = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwMIQAAAABJRU5ErkJggg==';

	// Auto-preview with debounce
	$effect(() => {
		const _input = input;

		if (previewTimeout) {
			clearTimeout(previewTimeout);
		}

		if (!_input.trim()) {
			imageUrl = null;
			imageInfo = null;
			error = null;
			return;
		}

		previewTimeout = setTimeout(() => {
			processInput();
		}, 300);

		return () => {
			if (previewTimeout) {
				clearTimeout(previewTimeout);
			}
		};
	});

	function processInput() {
		error = null;
		imageUrl = null;
		imageInfo = null;

		const trimmed = input.trim();
		
		// Check if it's already a data URL
		if (trimmed.startsWith('data:')) {
			imageUrl = trimmed;
			loadImageInfo(trimmed);
			return;
		}

		// Validate as Base64
		const validation = validateBase64(trimmed);
		if (!validation.valid) {
			error = `${validation.error}: ${validation.details}`;
			return;
		}

		// Detect MIME type
		const detected = detectMimeType(trimmed);
		if (detected && detected.mimeType.startsWith('image/')) {
			imageUrl = `data:${detected.mimeType};base64,${trimmed}`;
		} else {
			// Try common image types
			imageUrl = `data:image/png;base64,${trimmed}`;
		}
		
		loadImageInfo(imageUrl);
	}

	function loadImageInfo(url: string) {
		const img = new Image();
		img.onload = () => {
			const mimeMatch = url.match(/^data:([^;,]+)/);
			imageInfo = {
				width: img.naturalWidth,
				height: img.naturalHeight,
				mimeType: mimeMatch ? mimeMatch[1] : 'unknown'
			};
		};
		img.onerror = () => {
			error = 'Failed to load image. The Base64 data may not be a valid image.';
			imageUrl = null;
		};
		img.src = url;
	}

	function downloadImage() {
		if (!imageUrl) return;

		const detected = detectMimeType(input.trim()) || { extension: 'png', mimeType: 'image/png' };
		const link = document.createElement('a');
		link.href = imageUrl;
		link.download = `image.${detected.extension}`;
		link.click();
	}

	function loadSample() {
		input = sampleInput;
	}

	function clearInput() {
		input = '';
		imageUrl = null;
		imageInfo = null;
		error = null;
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearInput} {stats} />
		
		{#if imageUrl}
			<div class="flex justify-end">
				<button type="button" class="btn btn-primary btn-sm" onclick={downloadImage}>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
					Download Image
				</button>
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Vertical layout for more space -->
		<div class="flex flex-col gap-6">
			<!-- Input -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Base64 Image Data</h3>
				<textarea
					bind:value={input}
					placeholder="Paste Base64 string or data URL here..."
					class="textarea textarea-bordered w-full min-h-[200px] font-mono text-xs rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<!-- Preview -->
			<div>
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-sm font-medium text-base-content/70">Preview</h3>
					{#if imageInfo}
						<span class="text-xs text-base-content/50">
							{imageInfo.width}×{imageInfo.height} • {imageInfo.mimeType}
						</span>
					{/if}
				</div>
				<div class="min-h-[300px] rounded-xl border border-base-300 bg-base-200 flex items-center justify-center overflow-hidden">
					{#if imageUrl}
						<img src={imageUrl} alt="Preview" class="max-w-full max-h-[500px] object-contain" />
					{:else}
						<p class="text-base-content/50 text-center px-4">
							Paste Base64 image data to see preview
						</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Supported Formats -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Supported Formats</h4>
				<div class="mt-2 flex flex-wrap gap-2">
					<span class="badge badge-outline">PNG</span>
					<span class="badge badge-outline">JPEG</span>
					<span class="badge badge-outline">GIF</span>
					<span class="badge badge-outline">WebP</span>
					<span class="badge badge-outline">SVG</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Content Sections -->
	<div class="mt-12 space-y-6">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
	</div>
</ToolWrapper>

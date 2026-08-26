<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import { formatFileSize } from '$lib/utils/base64';
	import { base64ToolsContent } from '$lib/config/content/base64-tools-content';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	const content = base64ToolsContent['image-encoder'];

	let fileInput: HTMLInputElement;
	let isDragging = $state(false);
	let file = $state<File | null>(null);
	let result = $state<{ base64: string; dataUrl: string; originalSize: number; encodedSize: number; previewUrl: string; width: number; height: number; } | null>(null);
	let error = $state<string | null>(null);
	let isProcessing = $state(false);

	const MAX_SIZE = 10 * 1024 * 1024; // 10MB limit

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		
		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			processFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			processFile(input.files[0]);
		}
	}

	async function processFile(f: File) {
		error = null;
		result = null;
		
		if (!f.type.startsWith('image/')) {
			error = 'Please upload a valid image file (PNG, JPG, WebP, GIF, SVG, etc.).';
			return;
		}

		if (f.size > MAX_SIZE) {
			error = `File too large (${formatFileSize(f.size)}). Maximum size is ${formatFileSize(MAX_SIZE)} to prevent browser freezing.`;
			return;
		}

		isProcessing = true;
		file = f;

		try {
			const dataUrl = await fileToDataUrl(f);
			// Data URI format: data:image/png;base64,.....
			const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';
			
			// Get image dimensions for preview stats
			const img = new Image();
			img.onload = () => {
				result = {
					base64,
					dataUrl,
					previewUrl: dataUrl,
					originalSize: f.size,
					encodedSize: base64.length,
					width: img.naturalWidth,
					height: img.naturalHeight
				};
				isProcessing = false;
			};
			img.onerror = () => {
				error = 'Failed to load image preview. The file might be corrupted.';
				isProcessing = false;
			};
			img.src = dataUrl;
		} catch (err) {
			error = 'Failed to read file: ' + (err as Error).message;
			isProcessing = false;
		}
	}

	function fileToDataUrl(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error('Failed to read file'));
			reader.readAsDataURL(file);
		});
	}

	async function copyBase64() {
		if (result) {
			await navigator.clipboard.writeText(result.base64);
		}
	}

	async function copyDataUrl() {
		if (result) {
			await navigator.clipboard.writeText(result.dataUrl);
		}
	}

	function clearFile() {
		file = null;
		result = null;
		error = null;
		if (fileInput) fileInput.value = '';
	}
</script>

<ToolWrapper title="Image to Base64 | Convert Images to Data URI Online">
	<div class="flex flex-col gap-6">
		<ToolActions onClear={clearFile} />

		<!-- Drop Zone -->
		<div
			class="relative rounded-xl border-2 border-dashed transition-colors {isDragging ? 'border-primary bg-primary/5' : 'border-base-300'}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
		>
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				class="absolute inset-0 opacity-0 cursor-pointer"
				onchange={handleFileSelect}
			/>
			<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/30 mb-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
				<p class="text-base-content/70 font-medium">
					Drag & drop an image here, or click to browse
				</p>
				<p class="text-xs text-base-content/50 mt-2">
					Supports PNG, JPG, WebP, GIF, SVG (Max: {formatFileSize(MAX_SIZE)})
				</p>
			</div>
		</div>

		<!-- Loading State -->
		{#if isProcessing}
			<div class="flex items-center justify-center gap-2 py-4">
				<span class="loading loading-spinner loading-md"></span>
				<span>Processing image...</span>
			</div>
		{/if}

		<!-- Error Message -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Results Display -->
		{#if result && file}
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
					<!-- Image Preview Sidebar -->
					<div>
						<div class="card bg-base-200 border border-base-300 rounded-xl overflow-hidden sticky top-4">
							<div class="relative w-full aspect-square bg-base-300 checkerboard flex items-center justify-center overflow-hidden p-4">
								<img 
									src={result.previewUrl} 
									alt="Uploaded preview" 
									class="max-w-full max-h-full object-contain shadow-sm"
								/>
							</div>
							<div class="p-3 text-xs space-y-2 border-t border-base-300 bg-base-100">
								<div class="flex justify-between items-center break-all">
									<span class="text-base-content/50">File:</span>
									<span class="font-medium truncate max-w-[150px]" title={file.name}>{file.name}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-base-content/50">Dimen:</span>
									<span class="font-mono">{result.width} × {result.height}px</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="text-base-content/50">Type:</span>
									<span class="font-mono">{file.type || 'Unknown'}</span>
								</div>
								<div class="divider my-1"></div>
								<div class="flex justify-between items-center text-error">
									<span class="text-base-content/50">Base64 Size:</span>
									<span class="font-mono">{formatFileSize(result.encodedSize)}</span>
								</div>
								<div class="flex justify-between items-center text-success">
									<span class="text-base-content/50">Original Size:</span>
									<span class="font-mono">{formatFileSize(result.originalSize)}</span>
								</div>
								<div class="text-[10px] text-center text-base-content/50 pt-1">
									Size increased by +{Math.round((result.encodedSize / result.originalSize - 1) * 100)}%
								</div>
							</div>
						</div>
					</div>

					<!-- Content Right Side -->
					<div class="space-y-4">
						<!-- Actions -->
						<div class="flex flex-wrap gap-2">
							<button type="button" class="btn btn-primary h-8 min-h-8 rounded-lg gap-1.5" onclick={copyDataUrl}>
								<AppIcon name="copy" class="size-4" />
								Copy Data URL
							</button>
							<button type="button" class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5" onclick={copyBase64}>
								<AppIcon name="copy" class="size-4" />
								Copy Raw Base64
							</button>
						</div>

						<!-- Output Data URL -->
						<div class="space-y-1">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-medium text-base-content/70">Data URL (For HTML/CSS)</h3>
							</div>
							<textarea
								value={result.dataUrl}
								readonly
								class="textarea textarea-bordered w-full h-[150px] font-mono text-xs rounded-xl resize-none bg-base-200"
							></textarea>
						</div>

						<!-- Output Base64 -->
						<div class="space-y-1">
							<div class="flex items-center justify-between">
								<h3 class="text-sm font-medium text-base-content/70">Raw Base64 Data</h3>
							</div>
							<textarea
								value={result.base64}
								readonly
								class="textarea textarea-bordered w-full h-[150px] font-mono text-xs rounded-xl resize-none bg-base-200"
							></textarea>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Usage Tips -->
		<div class="card bg-base-200 rounded-xl border-t-2 border-primary">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2 text-primary">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
					Quick Integration Guides
				</h4>
				<div class="mt-2 text-sm text-base-content/70">
					<p class="font-medium mb-1">CSS Background Image:</p>
					<code>background-image: url("...paste Data URL here...");</code>
				</div>
				<div class="mt-4 text-sm text-base-content/70">
					<p class="font-medium mb-1">HTML Image Tag:</p>
					<code>&lt;img src="...paste Data URL here..." alt="Embedded Image" /&gt;</code>
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
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>

<style>
	.checkerboard {
		background-image: 
			linear-gradient(45deg, rgba(128, 128, 128, 0.1) 25%, transparent 25%), 
			linear-gradient(-45deg, rgba(128, 128, 128, 0.1) 25%, transparent 25%), 
			linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.1) 75%), 
			linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.1) 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
</style>

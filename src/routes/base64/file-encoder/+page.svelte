<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { formatFileSize } from '$lib/utils/base64';

	let fileInput: HTMLInputElement;
	let isDragging = $state(false);
	let file = $state<File | null>(null);
	let result = $state<{ base64: string; dataUrl: string; originalSize: number; encodedSize: number } | null>(null);
	let error = $state<string | null>(null);
	let isProcessing = $state(false);

	const MAX_SIZE = 10 * 1024 * 1024; // 10MB

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
		
		if (f.size > MAX_SIZE) {
			error = `File too large (${formatFileSize(f.size)}). Maximum size is ${formatFileSize(MAX_SIZE)} to prevent browser freezing.`;
			return;
		}

		isProcessing = true;
		file = f;

		try {
			const base64 = await fileToBase64(f);
			const dataUrl = `data:${f.type || 'application/octet-stream'};base64,${base64}`;
			
			result = {
				base64,
				dataUrl,
				originalSize: f.size,
				encodedSize: base64.length
			};
		} catch (err) {
			error = 'Failed to read file: ' + (err as Error).message;
		} finally {
			isProcessing = false;
		}
	}

	function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = reader.result as string;
				const base64 = dataUrl.split(',')[1];
				resolve(base64);
			};
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

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions (Clear only, no Sample) -->
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
				class="absolute inset-0 opacity-0 cursor-pointer"
				onchange={handleFileSelect}
			/>
			<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/30 mb-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
				<p class="text-base-content/70 font-medium">
					Drag & drop a file here, or click to browse
				</p>
				<p class="text-xs text-base-content/50 mt-2">
					Maximum file size: {formatFileSize(MAX_SIZE)}
				</p>
			</div>
		</div>

		<!-- Loading -->
		{#if isProcessing}
			<div class="flex items-center justify-center gap-2 py-4">
				<span class="loading loading-spinner loading-md"></span>
				<span>Processing file...</span>
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Result -->
		{#if result && file}
			<div class="space-y-4">
				<!-- File Info -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4">
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-semibold">{file.name}</h4>
								<p class="text-sm text-base-content/60">{file.type || 'Unknown type'}</p>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
							<div>
								<span class="text-base-content/60">Original Size:</span>
								<span class="ml-2 font-mono">{formatFileSize(result.originalSize)}</span>
							</div>
							<div>
								<span class="text-base-content/60">Encoded Size:</span>
								<span class="ml-2 font-mono">{formatFileSize(result.encodedSize)}</span>
								<span class="text-xs text-base-content/50 ml-1">
									(+{Math.round((result.encodedSize / result.originalSize - 1) * 100)}%)
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex gap-2">
					<button type="button" class="btn btn-primary" onclick={copyBase64}>
						Copy Raw Base64
					</button>
					<button type="button" class="btn btn-secondary" onclick={copyDataUrl}>
						Copy Data URL
					</button>
				</div>

				<!-- Output -->
				<div>
					<h3 class="mb-2 text-sm font-medium text-base-content/70">Base64 Output</h3>
					<textarea
						value={result.base64}
						readonly
						class="textarea textarea-bordered w-full min-h-[200px] font-mono text-xs rounded-xl resize-none bg-base-200"
					></textarea>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Use Cases</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Embed images directly in HTML/CSS</li>
					<li>• Send binary data through JSON APIs</li>
					<li>• Store files in databases as text</li>
					<li>• Email attachments (MIME encoding)</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

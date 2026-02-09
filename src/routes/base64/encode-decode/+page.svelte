<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import { encodeBase64, decodeBase64, decodeBase64ToBytes, isLikelyBase64, validateBase64, detectMimeType, formatFileSize } from '$lib/utils/base64';
	import { base64ToolsContent } from '$lib/config/content/base64-tools-content';

	const content = base64ToolsContent['encode-decode'];

	let input = $state('');
	let output = $state('');
	let mode = $state<'auto' | 'encode' | 'decode'>('auto');
	let detectedMode = $state<'encode' | 'decode'>('encode');
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;
	
	// File state
	let decodeFile = $state<{
		names: string;
		size: string;
		url: string;
		mime: string;
		isBinary: boolean;
	} | null>(null);

	const sampleText = 'Hello World! 👋';

	// Auto-convert with debounce
	$effect(() => {
		const _input = input;
		const _mode = mode;

		if (convertTimeout) {
			clearTimeout(convertTimeout);
		}

		if (!_input.trim()) {
			output = '';
			error = null;
			decodeFile = null;
			detectedMode = 'encode';
			return;
		}

		convertTimeout = setTimeout(() => {
			handleConvert();
		}, 200);

		return () => {
			if (convertTimeout) {
				clearTimeout(convertTimeout);
			}
		};
	});

	function handleConvert() {
		error = null;
		output = '';
		
		// Revoke previous URL to avoid memory leaks
		if (decodeFile?.url) {
			URL.revokeObjectURL(decodeFile.url);
		}
		decodeFile = null;

		if (!input.trim()) {
			return;
		}

		const trimmed = input.trim();
		
		// Determine mode
		let actualMode: 'encode' | 'decode';
		if (mode === 'auto') {
			// Auto-detect: if it looks like Base64, decode it, otherwise encode
			actualMode = isLikelyBase64(trimmed) ? 'decode' : 'encode';
			detectedMode = actualMode;
		} else {
			actualMode = mode;
			detectedMode = mode;
		}

		try {
			if (actualMode === 'encode') {
				output = encodeBase64(trimmed);
			} else {
				// Validate before decoding
				const validation = validateBase64(trimmed);
				if (!validation.valid) {
					error = `${validation.error}: ${validation.details}`;
					return;
				}

				// 1. Check for MIME type pattern or magic bytes
				const mimeInfo = detectMimeType(trimmed);
				
				// 2. Decode bytes
				const bytes = decodeBase64ToBytes(trimmed);
				
				// 3. Check for binary content (null bytes or replacement chars) if no specific MIME detected
				// We also check if it decodes cleanly to string
				let decodedText = '';
				let looksLikeBinary = false;
				
				try {
					decodedText = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
				} catch {
					looksLikeBinary = true;
					// Fallback loose decode for display if not strictly binary
					decodedText = new TextDecoder('utf-8').decode(bytes);
				}

				// Heuristic: If it has many null bytes or replacement chars, it's likely binary
				// Or if we detected a specific binary mime type (image, incorrect text)
				if (!looksLikeBinary) {
					// Check for high density of control characters (excluding newline/tab)
					let controlChars = 0;
					for (let i = 0; i < Math.min(decodedText.length, 1000); i++) {
						const code = decodedText.charCodeAt(i);
						if (code < 9 && code !== 0) controlChars++; // < 9 (BS, etc)
						else if (code > 13 && code < 32) controlChars++; // other controls
					}
					if (controlChars > 5) looksLikeBinary = true;
				}

				if (mimeInfo || looksLikeBinary) {
					// It's a file!
					const mime = mimeInfo?.mimeType || 'application/octet-stream';
					const ext = mimeInfo?.extension || 'bin';
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const blob = new Blob([bytes as any], { type: mime });
					const url = URL.createObjectURL(blob);
					
					decodeFile = {
						names: `decoded.${ext}`,
						size: formatFileSize(bytes.length),
						url,
						mime: mime,
						isBinary: true
					};
					
					// If it's binary, don't show garbage text
					if (looksLikeBinary && !mime.startsWith('text/')) {
						output = ''; 
					} else {
						output = decodedText;
					}
				} else {
					// Just text
					output = decodedText;
				}
			}
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function loadSample() {
		input = sampleText;
		mode = 'auto';
	}

	function clearAll() {
		input = '';
		output = '';
		error = null;
		if (decodeFile?.url) URL.revokeObjectURL(decodeFile.url);
		decodeFile = null;
	}

	function swapInputOutput() {
		if (output) {
			input = output;
			output = '';
			// If we just decoded, now we probably want to encode the result (which was the input)
			// But if auto mode is on, it handles it.
		}
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={output || (decodeFile ? 'Binary file' : '')} {stats} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-5">
			<div class="flex gap-5">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'auto'}
					onclick={() => (mode = 'auto')}
				>
					Auto
				</button>
				<div class="flex gap-1">
					<button
						type="button"
						class="btn join-item"
						class:btn-primary={mode === 'encode'}
						onclick={() => (mode = 'encode')}
				>
					Encode
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'decode'}
					onclick={() => (mode = 'decode')}
				>
					Decode
				</button>
				</div>
			</div>

			{#if mode === 'auto' && input.trim()}
				<span class="badge badge-outline">
					Detected: {detectedMode === 'encode' ? 'Text → Base64' : 'Base64 → File/Text'}
				</span>
			{/if}

			{#if output && !decodeFile}
				<button type="button" class="btn btn-ghost btn-sm ml-auto" onclick={swapInputOutput}>
					Swap Inputs
				</button>
			{/if}
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Input/Output -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{detectedMode === 'encode' ? 'Plain Text' : 'Base64 String'}
				</h3>
				<textarea
					bind:value={input}
					placeholder={detectedMode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
					class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<!-- Output -->
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{detectedMode === 'encode' ? 'Base64 Output' : 'Decoded Result'}
				</h3>
				
				{#if decodeFile}
					<div class="bg-base-200 rounded-xl min-h-[300px] flex flex-col items-center justify-center p-6 text-center border border-base-content/10">
						<div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 text-3xl">
							{#if decodeFile.mime.startsWith('image/')}
								🖼️
							{:else}
								📄
							{/if}
						</div>
						
						<h3 class="text-lg font-bold mb-1">Binary File Detected</h3>
						<p class="text-sm text-base-content/60 mb-6">
							{decodeFile.mime} • {decodeFile.size}
						</p>

						<a 
							href={decodeFile.url} 
							download={decodeFile.names}
							class="btn btn-primary btn-wide"
						>
							<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download File
						</a>

						{#if decodeFile.mime.startsWith('image/')}
							<div class="mt-6 border border-base-content/10 rounded-lg overflow-hidden max-w-[200px] shadow-sm">
								<img src={decodeFile.url} alt="Preview" class="w-full h-auto" />
							</div>
						{/if}
					</div>
				{:else}
					<textarea
						value={output}
						readonly
						placeholder="Result will appear here..."
						class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none bg-base-200"
						spellcheck="false"
					></textarea>
				{/if}
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Auto-detect</strong>: Automatically determines if input should be encoded or decoded</li>
					<li>• <strong>Binary Support</strong>: Detects file data (Images, PDF, ZIP) and offers download</li>
					<li>• <strong>UTF-8 Safe</strong>: Properly handles unicode characters including emoji 🎉</li>
					<li>• <strong>Validation</strong>: Shows detailed errors for invalid Base64 strings</li>
				</ul>
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

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { htmlToText } from '$lib/utils/html';

	let input = $state('');
	let preserveLineBreaks = $state(true);
	let keepLinkUrls = $state(false);
	let collapseWhitespace = $state(true);

	const output = $derived.by(() => {
		if (!input.trim()) return '';
		return htmlToText(input, {
			preserveLineBreaks,
			keepLinkUrls,
			collapseWhitespace
		});
	});

	const stats = $derived.by(() => {
		if (!output) return undefined;
		return {
			chars: output.length,
			words: output.trim().split(/\s+/).filter(Boolean).length,
			lines: output.split('\n').length
		};
	});

	function handleClear() {
		input = '';
	}

	function loadExample() {
		input = `<div class="content">
  <h1>Welcome</h1>
  <p>This is a <strong>sample</strong> text.</p>
  <p>Visit <a href="https://example.com">Example</a> for more.</p>
</div>`;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={output} stats={stats} />

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={preserveLineBreaks} />
				<span class="text-sm">Preserve line breaks</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={keepLinkUrls} />
				<span class="text-sm">Keep link URLs</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={collapseWhitespace} />
				<span class="text-sm">Collapse whitespace</span>
			</label>
		</div>

		<!-- Input -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
			<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
		</div>

		<!-- Output -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Extracted Text</h3>
			</div>
			<textarea
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48 bg-base-200"
				readonly
				value={output}
				placeholder="Extracted text will appear here..."
			></textarea>
		</div>

		<!-- Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Preserve line breaks</strong> adds new lines for block elements (p, div, h1-h6, li)</li>
					<li>• <strong>Keep link URLs</strong> shows links as "text (url)"</li>
					<li>• Script and style content is automatically removed</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

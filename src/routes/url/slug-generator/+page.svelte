<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateSlug } from '$lib/utils/url';

	let input = $state('');
	let baseURL = $state('https://example.com/blog');
	let separator = $state<'-' | '_'>('-');
	let lowercase = $state(true);
	let maxLength = $state(100);
	let output = $state('');

	$effect(() => {
		if (!input.trim()) {
			output = '';
			return;
		}

		output = generateSlug(input, {
			separator,
			lowercase,
			maxLength: maxLength || 100
		});
	});

	let fullURL = $derived(output ? `${baseURL.replace(/\/$/, '')}/${output}` : '');

	function clearAll() {
		input = '';
		output = '';
	}

	function loadExamples() {
		input = 'How to Build a REST API with Node.js — A Complete Guide! 🚀';
	}
</script>

<ToolWrapper
	title="URL Slug Generator"
	description="Convert text into URL-friendly slugs. Perfect for blog posts and page URLs."
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-ghost btn-sm" onclick={loadExamples}>
				Load Example
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={clearAll}>
				Clear
			</button>
		</div>

		<!-- Input -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Text to Convert</h3>
			</div>
			<textarea
				bind:value={input}
				placeholder="Enter your title or text here..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Base URL -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Base URL (for preview)</h3>
			</div>
			<input
				type="text"
				bind:value={baseURL}
				placeholder="https://example.com/blog"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<span class="label-text">Separator:</span>
					<select class="select select-bordered select-sm" bind:value={separator}>
						<option value="-">Hyphens (-)</option>
						<option value="_">Underscores (_)</option>
					</select>
				</label>
			</div>

			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={lowercase} />
					<span class="label-text">Lowercase</span>
				</label>
			</div>

			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<span class="label-text">Max length:</span>
					<input
						type="number"
						class="input input-bordered input-sm w-20"
						bind:value={maxLength}
						min="10"
						max="200"
					/>
				</label>
			</div>
		</div>

		<!-- Output -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">Generated Slug</h3>
				<span class="text-xs text-base-content/50">
					{output.length} chars
				</span>
			</div>
			<div class="bg-base-200 p-4 rounded-xl font-mono text-sm min-h-[60px] break-all">
				{#if output}
					{output}
				{:else}
					<span class="text-base-content/40">Slug will appear here...</span>
				{/if}
			</div>
		</div>

		<!-- Full URL Preview -->
		{#if output}
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Full URL Preview</h3>
				<div class="bg-base-200 p-4 rounded-xl font-mono text-sm break-all">
					{fullURL}
				</div>
			</div>

			<!-- Copy Options -->
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy full URL as:</span>
				<CopyButton url={fullURL} size="sm" />
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Unicode-safe</strong>: Handles accented characters (café → cafe)</li>
					<li>• <strong>Emoji removal</strong>: Strips emoji and special characters</li>
					<li>• <strong>Custom base URL</strong>: Enter your own domain</li>
					<li>• <strong>Quick copy</strong>: Copy as URL, cURL, fetch, axios, and more</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

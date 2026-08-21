<script lang="ts">
	import { highlight } from '$lib/utils/shiki';
	import { onMount } from 'svelte';

	interface Props {
		code: string;
		language?: 'json' | 'typescript' | 'go' | 'javascript' | 'xml' | 'html';
		class?: string;
	}

	let { code, language = 'json', class: className = '' }: Props = $props();

	let highlightedHtml = $state('');
	let isLoading = $state(true);

	// Re-highlight when code or language changes
	$effect(() => {
		if (!code) {
			highlightedHtml = '';
			isLoading = false;
			return;
		}

		isLoading = true;
		highlight(code, language).then((html) => {
			highlightedHtml = html;
			isLoading = false;
		});
	});
</script>

<div class="syntax-highlighter {className}">
	{#if isLoading}
		<div class="loading-placeholder">
			<pre class="font-mono text-sm opacity-50">{code}</pre>
		</div>
	{:else}
		<div class="highlighted-code">
			{@html highlightedHtml}
		</div>
	{/if}
</div>

<style>
	.syntax-highlighter {
		overflow: auto;
	}

	.syntax-highlighter :global(pre) {
		margin: 0;
		padding: 1rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		line-height: 1.5;
		overflow-x: auto;
	}

	.syntax-highlighter :global(code) {
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
	}

	.loading-placeholder pre {
		padding: 1rem;
	}
</style>

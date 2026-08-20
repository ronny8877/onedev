<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseInstant, relativeFrom, formatBundle } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['relative'];
	let input = $state('');
	let now = $state(Date.now());
	let parsed = $derived(input.trim() ? parseInstant(input, now) : null);
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = String(Math.floor(Date.now() / 1000) - 3600))} onClear={() => (input = '')} />
		<input bind:value={input} class="input input-bordered font-mono" placeholder="Unix or ISO" />
		{#if parsed && 'error' in parsed}
			<div class="alert alert-error">{parsed.error}</div>
		{:else if parsed && 'date' in parsed}
			<div class="text-4xl font-bold text-center py-8">{relativeFrom(parsed.date, now)}</div>
			<p class="text-center font-mono text-sm text-base-content/60">{formatBundle(parsed.date).iso}</p>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>

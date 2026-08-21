<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseInstant, durationBetween } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['duration'];
	let start = $state('');
	let end = $state('');
	let a = $derived(start.trim() ? parseInstant(start) : null);
	let b = $derived(end.trim() ? parseInstant(end) : null);
	let span = $derived(a && b && 'date' in a && 'date' in b ? durationBetween(a.date, b.date) : null);
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => {
				start = '2026-01-01T00:00:00Z';
				end = '2026-01-02T03:04:05Z';
			}}
			onClear={() => {
				start = '';
				end = '';
			}}
		/>
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="form-control">Start<input bind:value={start} class="input input-bordered font-mono" placeholder="ISO or Unix" /></label>
			<label class="form-control">End<input bind:value={end} class="input input-bordered font-mono" placeholder="ISO or Unix" /></label>
		</div>
		{#if (a && 'error' in a) || (b && 'error' in b)}
			<div class="alert alert-error">{(a && 'error' in a && a.error) || (b && 'error' in b && b.error)}</div>
		{:else if span && a && b && 'date' in a && 'date' in b}
			<div class="card bg-base-200 rounded-2xl"><div class="card-body">
				<p class="text-2xl font-bold">{span.human}</p>
				<p class="font-mono text-sm">{span.iso}</p>
				<p class="text-sm text-base-content/60">{span.ms.toLocaleString()} ms · {a.date <= b.date ? 'end is later' : 'start is later'}</p>
			</div></div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>

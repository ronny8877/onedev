<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseInstant, parseIsoDuration, formatBundle } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['iso'];
	let input = $state('');
	let asDuration = $derived(parseIsoDuration(input));
	let asInstant = $derived(parseInstant(input));
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = 'P3DT4H5M')} onClear={() => (input = '')} />
		<input bind:value={input} class="input input-bordered font-mono" placeholder="2026-08-20T12:00:00Z or P3DT4H" />
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body">
				<h3 class="font-bold">As duration</h3>
				{#if asDuration.ok}
					<p class="font-mono">{asDuration.ms.toLocaleString()} ms</p>
					<p class="text-sm text-base-content/70">{(asDuration.ms / 86400000).toFixed(3)} days</p>
				{:else}
					<p class="text-sm text-base-content/50">{asDuration.error}</p>
				{/if}
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body">
				<h3 class="font-bold">As instant</h3>
				{#if asInstant && 'date' in asInstant}
					{@const b = formatBundle(asInstant.date, 'UTC')}
					<p class="font-mono text-sm">{b.iso}</p>
					<p class="font-mono text-sm">Unix {b.unix}</p>
				{:else if asInstant && 'error' in asInstant}
					<p class="text-sm text-base-content/50">{asInstant.error}</p>
				{/if}
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseInstant, formatInZone, zoneOffset, listTimeZones } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['timezone'];
	const zones = listTimeZones();

	let input = $state('now');
	let filter = $state('');
	let selected = $state(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']);
	let filtered = $derived(zones.filter((z) => z.toLowerCase().includes(filter.toLowerCase())).slice(0, 80));
	let parsed = $derived(parseInstant(input));
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = new Date().toISOString())} onClear={() => (input = 'now')} />
		<input bind:value={input} class="input input-bordered font-mono" placeholder="Instant (now, Unix, ISO)" />
		{#if parsed && 'error' in parsed}
			<div class="alert alert-error">{parsed.error}</div>
		{:else if parsed && 'date' in parsed}
			<div class="overflow-x-auto">
				<table class="table table-sm">
					<thead><tr><th>Zone</th><th>Local time</th><th>Offset</th></tr></thead>
					<tbody>
						{#each selected as tz}
							<tr>
								<td class="font-mono text-xs">{tz}</td>
								<td class="font-mono">{formatInZone(parsed.date, tz, true)}</td>
								<td>{zoneOffset(parsed.date, tz)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
		<div>
			<input bind:value={filter} class="input input-bordered input-sm w-full mb-2" placeholder="Filter IANA zones..." />
			<div class="flex flex-wrap gap-2 max-h-48 overflow-auto">
				{#each filtered as z}
					<button
						class="btn btn-xs {selected.includes(z) ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => {
							selected = selected.includes(z) ? selected.filter((s) => s !== z) : [...selected, z];
						}}
					>{z}</button>
				{/each}
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>

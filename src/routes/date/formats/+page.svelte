<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import SelectMenu from '$lib/components/ui/SelectMenu.svelte';
	import { parseInstant, formatBundle, listTimeZones } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['formats'];
	const zones = listTimeZones();
	let input = $state('now');
	let timeZone = $state('UTC');
	let parsed = $derived(parseInstant(input));
	let bundle = $derived(parsed && 'date' in parsed ? formatBundle(parsed.date, timeZone) : null);

	function copy(v: string) {
		navigator.clipboard.writeText(v);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = 'now')} onClear={() => (input = 'now')} />
		<div class="grid gap-3 sm:grid-cols-[1fr_auto]">
			<input bind:value={input} class="input input-bordered font-mono" />
			<SelectMenu
				bind:value={timeZone}
				class="w-64"
				options={zones.map((z) => ({ value: z, label: z }))}
			/>
		</div>
		{#if parsed && 'error' in parsed}
			<div class="alert alert-error">{parsed.error}</div>
		{:else if bundle}
			<div class="overflow-x-auto">
				<table class="table">
					<tbody>
						{#each Object.entries(bundle) as [k, v]}
							<tr>
								<th class="w-32">{k}</th>
								<td class="font-mono text-sm break-all">{v}</td>
								<td><button class="btn btn-xs" onclick={() => copy(v)}>Copy</button></td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>

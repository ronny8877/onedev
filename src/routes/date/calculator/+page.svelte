<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import SelectMenu from '$lib/components/ui/SelectMenu.svelte';
	import { parseInstant, addToDate, formatBundle } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['calculator'];
	type Unit = 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds';

	let input = $state('now');
	let amount = $state(7);
	let unit = $state<Unit>('days');
	let parsed = $derived(parseInstant(input));
	let result = $derived(parsed && 'date' in parsed ? addToDate(parsed.date, amount, unit) : null);
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => { input = 'now'; amount = 14; unit = 'days'; }} onClear={() => (input = 'now')} />
		<input bind:value={input} class="input input-bordered font-mono" placeholder="Start instant" />
		<div class="flex flex-wrap gap-3 items-center">
			<input type="number" bind:value={amount} class="input input-bordered w-28" />
			<SelectMenu
				bind:value={unit}
				options={[
					{ value: 'years', label: 'years' },
					{ value: 'months', label: 'months' },
					{ value: 'weeks', label: 'weeks' },
					{ value: 'days', label: 'days' },
					{ value: 'hours', label: 'hours' },
					{ value: 'minutes', label: 'minutes' },
					{ value: 'seconds', label: 'seconds' }
				]}
			/>
			<span class="text-sm text-base-content/60">UTC calendar add</span>
		</div>
		{#if parsed && 'error' in parsed}
			<div class="alert alert-error">{parsed.error}</div>
		{:else if result}
			{@const b = formatBundle(result, 'UTC')}
			<div class="card bg-base-200 rounded-2xl"><div class="card-body">
				<div class="font-mono">{b.iso}</div>
				<div class="text-sm text-base-content/60">Unix {b.unix} · {b.rfc2822}</div>
			</div></div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>

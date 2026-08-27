<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import SelectMenu from '$lib/components/ui/SelectMenu.svelte';
	import { parseInstant, formatBundle, listTimeZones, toUnix } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = dateToolsContent['timestamp'];
	const zones = listTimeZones();

	let input = $state('');
	let timeZone = $state(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
	let now = $state(Date.now());

	let parsed = $derived(input.trim() ? parseInstant(input, now) : null);
	let bundle = $derived(parsed && 'date' in parsed ? formatBundle(parsed.date, timeZone) : null);

	function copy(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<ToolActions
			onSample={() => (input = String(Math.floor(Date.now() / 1000)))}
			onClear={() => (input = '')}
		/>
		<div class="grid gap-3 sm:grid-cols-[1fr_auto]">
			<input bind:value={input} class="input input-bordered font-mono" placeholder="Unix, ISO, RFC 2822, or now" />
			<SelectMenu
				bind:value={timeZone}
				class="max-w-xs w-full"
				options={zones.map((z) => ({ value: z, label: z }))}
			/>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-sm" onclick={() => (input = 'now')}>now</button>
			<button class="btn btn-sm" onclick={() => (input = new Date().toISOString())}>ISO now</button>
			<button class="btn btn-sm" onclick={() => (input = String(Date.now()))}>Unix ms</button>
		</div>
		{#if parsed && 'error' in parsed}
			<div class="alert alert-error">{parsed.error}</div>
		{:else if bundle && parsed && 'date' in parsed}
			<p class="text-sm text-base-content/60">
				Detected as {parsed.inputKind}{parsed.unit ? ` (${parsed.unit})` : ''} · Unix {toUnix(parsed.date, 's')}
			</p>
			<div class="grid gap-3 sm:grid-cols-2">
				{#each Object.entries(bundle) as [k, v]}
					<button class="card bg-base-200 text-left hover:border-primary border border-transparent" onclick={() => copy(v)}>
						<div class="card-body p-4">
							<div class="text-xs uppercase tracking-wide text-base-content/50">{k}</div>
							<div class="font-mono text-sm break-all">{v}</div>
						</div>
					</button>
				{/each}
			</div>
			<p class="text-xs text-base-content/40">Click a card to copy.</p>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>

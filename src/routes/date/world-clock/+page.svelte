<script lang="ts">
	import { onMount } from 'svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { WORLD_CLOCK_ZONES, formatInZone, zoneOffset } from '$lib/utils/datetime';
	import { dateToolsContent } from '$lib/config/content/date-tools-content';

	const content = dateToolsContent['world-clock'];
	let now = $state(new Date());

	onMount(() => {
		const id = setInterval(() => {
			now = new Date();
		}, 1000);
		return () => clearInterval(id);
	});
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each WORLD_CLOCK_ZONES as city}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="text-sm text-base-content/60">{city.label}</div>
					<div class="font-mono text-xl">{formatInZone(now, city.tz)}</div>
					<div class="text-xs text-base-content/50">{city.tz} · {zoneOffset(now, city.tz)}</div>
				</div>
			</div>
		{/each}
	</div>
	<ToolContent {content} />
</ToolWrapper>

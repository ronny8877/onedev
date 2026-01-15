<script lang="ts">
	import CopyButton from './CopyButton.svelte';

	interface Props {
		onSample?: () => void;
		onClear?: () => void;
		copyText?: string;
		copyLabel?: string;
		stats?: {
			chars?: number;
			bytes?: number;
			lines?: number;
			words?: number;
		};
		class?: string;
	}

	let {
		onSample,
		onClear,
		copyText = '',
		copyLabel = 'Copy',
		stats,
		class: className = ''
	}: Props = $props();

	// Calculate if we have any stats to show
	let hasStats = $derived(stats && (stats.chars !== undefined || stats.bytes !== undefined || stats.lines !== undefined || stats.words !== undefined));
</script>

<div class="flex flex-wrap items-center justify-between gap-3 {className}">
	<div class="flex flex-wrap items-center gap-2">
		{#if onSample}
			<button type="button" class="btn btn-ghost btn-sm gap-1.5" onclick={onSample}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
				Sample
			</button>
		{/if}

		{#if onClear}
			<button type="button" class="btn btn-ghost btn-sm gap-1.5" onclick={onClear}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
				</svg>
				Clear
			</button>
		{/if}

		{#if copyText}
			<CopyButton text={copyText} label={copyLabel} size="sm" />
		{/if}
	</div>

	{#if hasStats}
		<div class="flex items-center gap-3 text-xs text-base-content/50 font-mono">
			{#if stats?.chars !== undefined}
				<span>{stats.chars.toLocaleString()} chars</span>
			{/if}
			{#if stats?.bytes !== undefined}
				<span>{stats.bytes.toLocaleString()} bytes</span>
			{/if}
			{#if stats?.lines !== undefined}
				<span>{stats.lines.toLocaleString()} lines</span>
			{/if}
			{#if stats?.words !== undefined}
				<span>{stats.words.toLocaleString()} words</span>
			{/if}
		</div>
	{/if}
</div>

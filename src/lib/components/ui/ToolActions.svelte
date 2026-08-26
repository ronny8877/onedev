<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import AppIcon from './AppIcon.svelte';

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

	let hasStats = $derived(stats && (stats.chars !== undefined || stats.bytes !== undefined || stats.lines !== undefined || stats.words !== undefined));
</script>

<div class="flex flex-wrap items-center justify-between gap-3 {className}">
	<div class="flex flex-wrap items-center gap-2">
		{#if onSample}
			<button type="button" class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5" onclick={onSample}>
				<AppIcon name="zap" class="size-4" />
				Sample
			</button>
		{/if}

		{#if onClear}
			<button type="button" class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5" onclick={onClear}>
				<AppIcon name="trash-2" class="size-4" />
				Clear
			</button>
		{/if}

		{#if copyText}
			<CopyButton text={copyText} label={copyLabel} size="sm" />
		{/if}
	</div>

	{#if hasStats}
		<div class="flex items-center gap-3 text-xs text-muted font-mono">
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

<script lang="ts">
	import type { Snippet } from 'svelte';
	import CopyButton from './CopyButton.svelte';
	import AppIcon from './AppIcon.svelte';

	interface Props {
		onSample?: () => void;
		onClear?: () => void;
		copyText?: string;
		copyLabel?: string;
		children?: Snippet;
		extraActions?: Snippet;
		stats?: {
			chars?: number;
			bytes?: number;
			lines?: number;
			words?: number;
			docs?: number;
		};
		class?: string;
	}

	let {
		onSample,
		onClear,
		copyText = '',
		copyLabel = 'Copy',
		children,
		extraActions,
		stats,
		class: className = ''
	}: Props = $props();

	let hasStats = $derived(
		stats &&
			(stats.chars !== undefined ||
				stats.bytes !== undefined ||
				stats.lines !== undefined ||
				stats.words !== undefined ||
				stats.docs !== undefined)
	);
</script>

<div class="flex flex-wrap items-center justify-between gap-3 {className}">
	<div class="flex flex-wrap items-center gap-2">
		{#if onSample}
			<button type="button" class="btn h-8 min-h-8 gap-1.5 rounded-lg btn-ghost" onclick={onSample}>
				<AppIcon name="zap" class="size-4" />
				Sample
			</button>
		{/if}

		{#if onClear}
			<button type="button" class="btn h-8 min-h-8 gap-1.5 rounded-lg btn-ghost" onclick={onClear}>
				<AppIcon name="trash-2" class="size-4" />
				Clear
			</button>
		{/if}

		{#if copyText}
			<CopyButton text={copyText} label={copyLabel} size="sm" />
		{/if}
		{#if extraActions}
			{@render extraActions()}
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if hasStats}
		<div class="text-muted flex items-center gap-3 font-mono text-xs">
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
			{#if stats?.docs !== undefined}
				<span>{stats.docs.toLocaleString()} documents</span>
			{/if}
		</div>
	{/if}
</div>

<script lang="ts">
	import CopyButton from './CopyButton.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		value: string | number;
		unit?: string;
		description?: string;
		highlight?: boolean;
		children?: Snippet;
	}

	let { 
		label, 
		value, 
		unit = '', 
		description = '',
		highlight = false,
		children 
	}: Props = $props();

	let displayValue = $derived(
		typeof value === 'number' 
			? (Number.isInteger(value) ? value.toString() : value.toFixed(6).replace(/\.?0+$/, ''))
			: value
	);

	let copyValue = $derived(`${displayValue}${unit}`);
</script>

<div 
	class="group relative flex items-center justify-between gap-4 p-3 rounded-xl transition-all duration-200 {highlight ? 'bg-primary/10 hover:bg-primary/15' : 'hover:bg-base-300/50'}"
>
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-2 mb-0.5">
			<span class="text-xs font-medium text-base-content/60 uppercase tracking-wide">{label}</span>
			{#if unit}
				<span class="text-xs px-1.5 py-0.5 rounded bg-base-300 text-base-content/50 font-mono">{unit}</span>
			{/if}
		</div>
		<div class="flex items-baseline gap-1">
			<code class="text-lg font-mono font-semibold text-base-content truncate" title={displayValue}>
				{displayValue}
			</code>
		</div>
		{#if description}
			<p class="text-xs text-base-content/50 mt-1">{description}</p>
		{/if}
	</div>

	<div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
		{#if children}
			{@render children()}
		{/if}
		<CopyButton text={copyValue} label="" size="xs" />
	</div>
</div>

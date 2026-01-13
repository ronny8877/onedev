<script lang="ts" module>
	import type { Component } from 'svelte';
</script>

<script lang="ts">
	import Self from './JsonTree.svelte';

	interface Props {
		data: unknown;
		expandAll?: boolean;
		depth?: number;
		maxDepth?: number;
	}

	let { data, expandAll = false, depth = 0, maxDepth = 10 }: Props = $props();

	let expanded = $state(expandAll || depth < 2);

	// React to expandAll prop changes - sync expanded state
	$effect(() => {
		expanded = expandAll || (depth < 2 && !expandAll);
	});

	function getType(value: unknown): string {
		if (value === null) return 'null';
		if (Array.isArray(value)) return 'array';
		return typeof value;
	}

	function getPreview(value: unknown): string {
		const type = getType(value);
		if (type === 'array') return `Array(${(value as unknown[]).length})`;
		if (type === 'object') return `Object(${Object.keys(value as object).length})`;
		if (type === 'string') return `"${(value as string).slice(0, 50)}${(value as string).length > 50 ? '...' : ''}"`;
		return String(value);
	}

	function toggle() {
		expanded = !expanded;
	}

	const entries = $derived(
		data !== null && typeof data === 'object'
			? Object.entries(data as Record<string, unknown>)
			: []
	);

	const isExpandable = $derived(
		data !== null && typeof data === 'object' && entries.length > 0
	);
</script>

<div class="tree-node-wrapper" style="--depth: {depth}">
	{#if isExpandable}
		<div class="flex items-start gap-1">
			<button
				type="button"
				class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded hover:bg-base-300"
				onclick={toggle}
				aria-label={expanded ? 'Collapse' : 'Expand'}
			>
				<svg
					class="h-3 w-3 transition-transform"
					class:rotate-90={expanded}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					></path>
				</svg>
			</button>

			<span class="json-bracket">{Array.isArray(data) ? '[' : '{'}</span>

			{#if !expanded}
				<button
					type="button"
					class="text-xs text-base-content/50 hover:text-base-content"
					onclick={toggle}
					aria-label="Expand preview"
				>
					{getPreview(data)}
				</button>
				<span class="json-bracket">{Array.isArray(data) ? ']' : '}'}</span>
			{/if}
		</div>

		{#if expanded && depth < maxDepth}
			<div class="ml-6 border-l border-base-content/10 pl-2">
				{#each entries as [key, value], i}
					<div class="flex items-start py-0.5">
						<span class="json-key mr-1">
							{Array.isArray(data) ? i : `"${key}"`}:
						</span>
						{#if value !== null && typeof value === 'object'}
							<Self data={value} {expandAll} depth={depth + 1} {maxDepth} />
						{:else}
							<span class="json-{getType(value)}">{getPreview(value)}</span>
						{/if}
					</div>
				{/each}
			</div>
			<div class="ml-6">
				<span class="json-bracket">{Array.isArray(data) ? ']' : '}'}</span>
			</div>
		{/if}
	{:else}
		<span class="json-{getType(data)}">{getPreview(data)}</span>
	{/if}
</div>

<style>
	.tree-node-wrapper {
		font-family: ui-monospace, monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>

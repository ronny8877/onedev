<script lang="ts" module>
	import type { Component } from 'svelte';
</script>

<script lang="ts">
	import Self from './HtmlTree.svelte';

	interface HtmlNodeData {
		tag: string;
		id?: string;
		className?: string;
		attributes: Record<string, string>;
		children: HtmlNodeData[];
		text?: string;
		path: string;
		element?: Element;
	}

	interface Props {
		node: HtmlNodeData;
		expandAll?: boolean;
		depth?: number;
		maxDepth?: number;
		searchQuery?: string;
		selectedPath?: string;
		onSelect?: (node: HtmlNodeData) => void;
	}

	let { 
		node, 
		expandAll = false, 
		depth = 0, 
		maxDepth = 20,
		searchQuery = '',
		selectedPath = '',
		onSelect
	}: Props = $props();

	let expanded = $state(expandAll || depth < 2);

	// React to expandAll prop changes
	$effect(() => {
		expanded = expandAll || (depth < 2 && !expandAll);
	});

	// Check if this node matches search
	const matchesSearch = $derived.by(() => {
		if (!searchQuery.trim()) return false;
		const q = searchQuery.toLowerCase().trim();
		
		// Match tag
		if (node.tag.toLowerCase().includes(q)) return true;
		// Match #id
		if (q.startsWith('#') && node.id?.toLowerCase().includes(q.slice(1))) return true;
		// Match .class
		if (q.startsWith('.') && node.className?.toLowerCase().includes(q.slice(1))) return true;
		// Match id or class without prefix
		if (node.id?.toLowerCase().includes(q)) return true;
		if (node.className?.toLowerCase().includes(q)) return true;
		
		return false;
	});

	// Check if any child matches (to auto-expand)
	const hasMatchingChild = $derived.by(() => {
		if (!searchQuery.trim()) return false;
		
		function checkChildren(children: HtmlNodeData[]): boolean {
			for (const child of children) {
				const q = searchQuery.toLowerCase().trim();
				if (child.tag.toLowerCase().includes(q)) return true;
				if (q.startsWith('#') && child.id?.toLowerCase().includes(q.slice(1))) return true;
				if (q.startsWith('.') && child.className?.toLowerCase().includes(q.slice(1))) return true;
				if (child.id?.toLowerCase().includes(q)) return true;
				if (child.className?.toLowerCase().includes(q)) return true;
				if (checkChildren(child.children)) return true;
			}
			return false;
		}
		
		return checkChildren(node.children);
	});

	// Auto-expand if has matching child
	$effect(() => {
		if (hasMatchingChild && !expanded) {
			expanded = true;
		}
	});

	const isSelected = $derived(selectedPath === node.path);
	const hasChildren = $derived(node.children.length > 0);

	function toggle() {
		expanded = !expanded;
	}

	function handleSelect() {
		onSelect?.(node);
	}

	function getDisplayClass(): string {
		if (!node.className) return '';
		const classes = node.className.split(' ').slice(0, 2);
		if (classes.length === 0) return '';
		return '.' + classes.join('.');
	}
</script>

<div class="html-tree-node" style="--depth: {depth}">
	<div 
		class="flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer transition-colors
			{isSelected ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-base-300'}
			{matchesSearch ? 'bg-warning/20' : ''}"
		onclick={handleSelect}
		onkeydown={(e) => e.key === 'Enter' && handleSelect()}
		role="button"
		tabindex="0"
	>
		<!-- Expand/Collapse toggle -->
		{#if hasChildren}
			<button
				type="button"
				class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded hover:bg-base-300"
				onclick={(e) => { e.stopPropagation(); toggle(); }}
				aria-label={expanded ? 'Collapse' : 'Expand'}
			>
				<svg
					class="h-3 w-3 transition-transform text-base-content/50"
					class:rotate-90={expanded}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
				</svg>
			</button>
		{:else}
			<span class="w-5"></span>
		{/if}

		<!-- Tag name -->
		<span class="text-info font-mono text-sm">&lt;{node.tag}</span>

		<!-- ID -->
		{#if node.id}
			<span class="text-warning font-mono text-xs">#{node.id}</span>
		{/if}

		<!-- Classes (truncated) -->
		{#if node.className}
			<span class="text-success font-mono text-xs truncate max-w-[120px]" title={node.className}>
				{getDisplayClass()}
			</span>
		{/if}

		<!-- Close bracket -->
		<span class="text-info font-mono text-sm">&gt;</span>

		<!-- Child count badge -->
		{#if hasChildren && !expanded}
			<span class="badge badge-ghost badge-xs ml-1">{node.children.length}</span>
		{/if}

		<!-- Text preview -->
		{#if node.text && !hasChildren}
			<span class="text-base-content/50 text-xs truncate max-w-[100px]" title={node.text}>
				{node.text}
			</span>
		{/if}
	</div>

	<!-- Children -->
	{#if expanded && hasChildren && depth < maxDepth}
		<div class="ml-4 border-l border-base-content/10 pl-1">
			{#each node.children as child}
				<Self 
					node={child} 
					{expandAll}
					depth={depth + 1} 
					{maxDepth}
					{searchQuery}
					{selectedPath}
					{onSelect}
				/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.html-tree-node {
		font-family: ui-monospace, monospace;
		font-size: 0.875rem;
		line-height: 1.5;
	}
</style>

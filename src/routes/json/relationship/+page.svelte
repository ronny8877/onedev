<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { untrack } from 'svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import { parseJSONSafe, type ParseError } from '$lib/utils/json';
	import { jsonToolsContent } from '$lib/config/content/json-tools-content';

	const content = jsonToolsContent.relationship;

	// --- Constants ---
	const NODE_W = 250;
	const HEADER_H = 40;
	const ROW_H = 26;
	const PAD_BOTTOM = 14;
	const H_GAP = 50;
	const V_GAP = 90;
	const MAX_ARRAY_ITEMS = 6;
	const MAX_PROPS = 14;

	// --- Types ---
	interface GraphNode {
		id: string;
		key: string;
		type: 'object' | 'array';
		properties: { key: string; value: string; valueType: string }[];
		childLinks: { key: string; childId: string }[];
		data: unknown;
		x: number;
		y: number;
		height: number;
		subtreeWidth: number;
		truncatedProps: number;
		truncatedChildren: number;
	}

	interface Connection {
		fromX: number;
		fromY: number;
		toX: number;
		toY: number;
		label: string;
	}

	// --- State ---
	let input = $state('');
	let error = $state<ParseError | null>(null);
	let editorCollapsed = $state(false);
	let zoom = $state(1);
	let panX = $state(0);
	let panY = $state(0);
	let isPanning = $state(false);
	let lastMouseX = 0;
	let lastMouseY = 0;
	let copiedNodeId = $state<string | null>(null);
	let selectedNodeId = $state<string | null>(null);
	let graphNodes = $state<GraphNode[]>([]);
	let graphConnections = $state<Connection[]>([]);
	let containerEl: HTMLDivElement | undefined = $state();

	let nodeIdCounter = 0;

	const sampleJSON = `{
  "company": "TechCorp",
  "founded": 2020,
  "active": true,
  "website": "https://techcorp.io",
  "address": {
    "street": "123 Innovation Way",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105"
  },
  "departments": [
    {
      "name": "Engineering",
      "head": "Jane Smith",
      "employees": 45,
      "projects": [
        { "name": "API Gateway", "status": "active", "priority": "high" },
        { "name": "Dashboard v2", "status": "completed", "priority": "medium" }
      ]
    },
    {
      "name": "Marketing",
      "head": "John Doe",
      "employees": 20,
      "budget": 150000
    }
  ],
  "metadata": {
    "lastUpdated": "2024-01-15",
    "version": "2.1.0",
    "tags": ["startup", "saas", "b2b"]
  }
}`;

	let stats = $derived(input ? { chars: input.length, lines: input.split('\n').length } : undefined);

	// --- Graph dimensions ---
	let graphWidth = $derived.by(() => {
		if (graphNodes.length === 0) return 0;
		let max = 0;
		for (const n of graphNodes) max = Math.max(max, n.x + NODE_W);
		return max + 80;
	});

	let graphHeight = $derived.by(() => {
		if (graphNodes.length === 0) return 0;
		let max = 0;
		for (const n of graphNodes) max = Math.max(max, n.y + n.height);
		return max + 80;
	});

	// --- Helpers ---
	function fmtVal(v: unknown): string {
		if (v === null) return 'null';
		if (v === undefined) return 'undefined';
		if (typeof v === 'string') {
			return v.length > 28 ? `"${v.slice(0, 25)}…"` : `"${v}"`;
		}
		return String(v);
	}

	function valType(v: unknown): string {
		if (v === null) return 'null';
		return typeof v;
	}

	function valColor(t: string): string {
		switch (t) {
			case 'string': return '#22c55e';
			case 'number': return '#f59e0b';
			case 'boolean': return '#3b82f6';
			case 'null': return '#8b5cf6';
			default: return 'inherit';
		}
	}

	function pathD(c: Connection): string {
		const dy = c.toY - c.fromY;
		const cp = Math.min(dy * 0.5, 60);
		return `M ${c.fromX} ${c.fromY} C ${c.fromX} ${c.fromY + cp}, ${c.toX} ${c.toY - cp}, ${c.toX} ${c.toY}`;
	}

	// --- Build Graph ---
	function buildGraph(data: unknown): { nodes: GraphNode[]; connections: Connection[] } {
		nodeIdCounter = 0;
		const nodes: GraphNode[] = [];
		const nodeMap = new Map<string, GraphNode>();

		function createNode(key: string, value: unknown): string | null {
			if (value === null || value === undefined || typeof value !== 'object') return null;

			const id = `n${nodeIdCounter++}`;
			const isArr = Array.isArray(value);
			const node: GraphNode = {
				id, key, type: isArr ? 'array' : 'object',
				properties: [], childLinks: [], data: value,
				x: 0, y: 0, height: 0, subtreeWidth: 0,
				truncatedProps: 0, truncatedChildren: 0
			};

			if (isArr) {
				const arr = value as unknown[];
				let childCount = 0;
				for (let i = 0; i < arr.length; i++) {
					const item = arr[i];
					if (item !== null && typeof item === 'object') {
						if (childCount >= MAX_ARRAY_ITEMS) {
							node.truncatedChildren = arr.length - childCount;
							break;
						}
						const cid = createNode(`[${i}]`, item);
						if (cid) { node.childLinks.push({ key: `[${i}]`, childId: cid }); childCount++; }
					} else {
						node.properties.push({ key: `[${i}]`, value: fmtVal(item), valueType: valType(item) });
					}
				}
			} else {
				const obj = value as Record<string, unknown>;
				let pCount = 0;
				for (const [k, v] of Object.entries(obj)) {
					if (v !== null && typeof v === 'object') {
						const cid = createNode(k, v);
						if (cid) node.childLinks.push({ key: k, childId: cid });
					} else {
						if (pCount >= MAX_PROPS) {
							node.truncatedProps = Object.keys(obj).filter(key => obj[key] === null || typeof obj[key] !== 'object').length - pCount;
							break;
						}
						node.properties.push({ key: k, value: fmtVal(v), valueType: valType(v) });
						pCount++;
					}
				}
			}

			const rows = node.properties.length + (node.truncatedProps > 0 ? 1 : 0) + (node.truncatedChildren > 0 ? 1 : 0);
			node.height = HEADER_H + Math.max(rows, 0) * ROW_H + PAD_BOTTOM;
			if (rows === 0) node.height = HEADER_H + PAD_BOTTOM;

			nodes.push(node);
			nodeMap.set(id, node);
			return id;
		}

		if (data !== null && typeof data === 'object') {
			createNode('root', data);
		} else {
			const n: GraphNode = {
				id: 'n0', key: 'root', type: 'object',
				properties: [{ key: 'value', value: fmtVal(data), valueType: valType(data) }],
				childLinks: [], data, x: 0, y: 0,
				height: HEADER_H + ROW_H + PAD_BOTTOM, subtreeWidth: NODE_W,
				truncatedProps: 0, truncatedChildren: 0
			};
			nodes.push(n);
			nodeMap.set('n0', n);
		}

		// Calculate subtree widths
		function calcWidth(id: string): number {
			const n = nodeMap.get(id);
			if (!n || n.childLinks.length === 0) {
				if (n) n.subtreeWidth = NODE_W;
				return NODE_W;
			}
			let total = 0;
			for (const l of n.childLinks) total += calcWidth(l.childId);
			total += (n.childLinks.length - 1) * H_GAP;
			const w = Math.max(NODE_W, total);
			n.subtreeWidth = w;
			return w;
		}

		// Position nodes
		function posNode(id: string, startX: number, y: number) {
			const n = nodeMap.get(id);
			if (!n) return;
			n.x = startX + n.subtreeWidth / 2 - NODE_W / 2;
			n.y = y;
			if (n.childLinks.length === 0) return;
			let cx = startX;
			for (const l of n.childLinks) {
				const child = nodeMap.get(l.childId);
				if (!child) continue;
				posNode(l.childId, cx, y + n.height + V_GAP);
				cx += child.subtreeWidth + H_GAP;
			}
		}

		if (nodes.length > 0) {
			const root = nodes[nodes.length - 1];
			calcWidth(root.id);
			posNode(root.id, 0, 0);
		}

		// Build connections
		const connections: Connection[] = [];
		for (const n of nodes) {
			for (const l of n.childLinks) {
				const child = nodeMap.get(l.childId);
				if (!child) continue;
				connections.push({
					fromX: n.x + NODE_W / 2, fromY: n.y + n.height,
					toX: child.x + NODE_W / 2, toY: child.y,
					label: l.key
				});
			}
		}

		return { nodes, connections };
	}

	// --- Effect: parse + build ---
	$effect(() => {
		const cur = input;
		untrack(() => {
			if (!cur.trim()) {
				graphNodes = [];
				graphConnections = [];
				error = null;
				return;
			}
			const result = parseJSONSafe(cur);
			if (result.valid) {
				error = null;
				const g = buildGraph(result.data);
				graphNodes = g.nodes;
				graphConnections = g.connections;
				requestAnimationFrame(() => fitToScreen());
			} else {
				graphNodes = [];
				graphConnections = [];
				error = result.error || null;
			}
		});
	});

	// --- Actions ---
	function loadSample() { input = sampleJSON; }
	function clearAll() {
		input = '';
		graphNodes = [];
		graphConnections = [];
		error = null;
		selectedNodeId = null;
		panX = 30; panY = 30; zoom = 1;
	}

	function zoomIn() { zoom = Math.min(zoom + 0.15, 3); }
	function zoomOut() { zoom = Math.max(zoom - 0.15, 0.15); }

	function fitToScreen() {
		if (graphNodes.length === 0 || !containerEl) { panX = 30; panY = 30; zoom = 1; return; }
		let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
		for (const n of graphNodes) {
			minX = Math.min(minX, n.x);
			minY = Math.min(minY, n.y);
			maxX = Math.max(maxX, n.x + NODE_W);
			maxY = Math.max(maxY, n.y + n.height);
		}
		const gw = maxX - minX + 60;
		const gh = maxY - minY + 60;
		const cw = containerEl.clientWidth;
		const ch = containerEl.clientHeight;
		zoom = Math.min(cw / gw, ch / gh, 1.2);
		panX = (cw - gw * zoom) / 2 - minX * zoom + 30;
		panY = (ch - gh * zoom) / 2 - minY * zoom + 30;
	}

	// --- Pan/Zoom ---
	function onMouseDown(e: MouseEvent) {
		if (e.button !== 0) return;
		isPanning = true; lastMouseX = e.clientX; lastMouseY = e.clientY;
	}
	function onMouseMove(e: MouseEvent) {
		if (!isPanning) return;
		panX += e.clientX - lastMouseX;
		panY += e.clientY - lastMouseY;
		lastMouseX = e.clientX; lastMouseY = e.clientY;
	}
	function onMouseUp() { isPanning = false; }
	function onWheel(e: WheelEvent) {
		e.preventDefault();
		const d = e.deltaY > 0 ? -0.08 : 0.08;
		const nz = Math.max(0.1, Math.min(3, zoom + d));
		if (containerEl) {
			const r = containerEl.getBoundingClientRect();
			const mx = e.clientX - r.left;
			const my = e.clientY - r.top;
			panX = mx - (mx - panX) * (nz / zoom);
			panY = my - (my - panY) * (nz / zoom);
		}
		zoom = nz;
	}

	// --- Copy node ---
	async function copyNode(node: GraphNode, e: MouseEvent) {
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(JSON.stringify(node.data, null, 2));
			copiedNodeId = node.id;
			setTimeout(() => { copiedNodeId = null; }, 1500);
		} catch { /* ignore */ }
	}

	function selectNode(id: string, e: MouseEvent) {
		e.stopPropagation();
		selectedNodeId = selectedNodeId === id ? null : id;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-4">
		<!-- Toolbar -->
		<div class="flex flex-wrap items-center justify-between gap-3">
			<ToolActions onSample={loadSample} onClear={clearAll} stats={stats} />
			<button
				type="button"
				class="btn btn-sm btn-ghost gap-1.5"
				onclick={() => (editorCollapsed = !editorCollapsed)}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if editorCollapsed}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
					{/if}
				</svg>
				{editorCollapsed ? 'Show Editor' : 'Hide Editor'}
			</button>
		</div>

		<ErrorDisplay {error} />

		<!-- Main Split Layout -->
		<div class="viz-layout">
			<!-- Left: Editor -->
			{#if !editorCollapsed}
				<div class="editor-panel">
					<div class="flex items-center gap-2 px-3 py-2 border-b border-base-300/50 bg-base-300/30">
						<svg class="h-4 w-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
						</svg>
						<span class="text-xs font-semibold text-base-content/60 uppercase tracking-wider">JSON Editor</span>
					</div>
					<div class="editor-inner">
						<CodeMirrorEditor bind:value={input} placeholder="Paste your JSON here to visualize relationships..." />
					</div>
				</div>
				<div class="divider-drag"></div>
			{/if}

			<!-- Right: Visualization -->
			<div class="viz-panel">
				<!-- Viz toolbar -->
				<div class="flex items-center justify-between px-3 py-2 border-b border-base-300/50 bg-base-300/30">
					<div class="flex items-center gap-2">
						<svg class="h-4 w-4 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
						</svg>
						<span class="text-xs font-semibold text-base-content/60 uppercase tracking-wider">Visualization</span>
						{#if graphNodes.length > 0}
							<span class="badge badge-sm badge-ghost">{graphNodes.length} nodes</span>
						{/if}
					</div>
					<div class="flex items-center gap-1">
						<button type="button" class="btn btn-ghost btn-xs" onclick={zoomOut} title="Zoom Out">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
						</button>
						<span class="text-xs font-mono text-base-content/50 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
						<button type="button" class="btn btn-ghost btn-xs" onclick={zoomIn} title="Zoom In">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
						</button>
						<button type="button" class="btn btn-ghost btn-xs" onclick={fitToScreen} title="Fit to Screen">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>
						</button>
					</div>
				</div>

				<!-- Canvas -->
				<div
					class="viz-canvas"
					bind:this={containerEl}
					role="application"
					aria-label="JSON relationship visualization"
					onmousedown={onMouseDown}
					onmousemove={onMouseMove}
					onmouseup={onMouseUp}
					onmouseleave={onMouseUp}
					onwheel={onWheel}
					style="cursor: {isPanning ? 'grabbing' : 'grab'}"
				>
					{#if graphNodes.length > 0}
						<div
							class="viz-content"
							style="transform: translate({panX}px, {panY}px) scale({zoom}); width: {graphWidth}px; height: {graphHeight}px;"
						>
							<!-- SVG connections -->
							<svg class="connections-layer" width={graphWidth} height={graphHeight}>
								{#each graphConnections as conn}
									<path
										d={pathD(conn)}
										fill="none"
										stroke="rgba(148, 163, 184, 0.35)"
										stroke-width="2"
									/>
									<!-- Connection label -->
									<text
										x={(conn.fromX + conn.toX) / 2}
										y={(conn.fromY + conn.toY) / 2 - 6}
										text-anchor="middle"
										class="conn-label"
									>{conn.label}</text>
								{/each}
							</svg>

							<!-- Nodes -->
							{#each graphNodes as node (node.id)}
								<div
									class="graph-node animate-scale-in"
									class:node-selected={selectedNodeId === node.id}
									style="left: {node.x}px; top: {node.y}px; width: {NODE_W}px;"
									onclick={(e) => selectNode(node.id, e)}
									role="button"
									tabindex="0"
								>
									<!-- Header -->
									<div class="node-header" class:node-obj={node.type === 'object'} class:node-arr={node.type === 'array'}>
										<div class="flex items-center gap-1.5 min-w-0">
											<span class="node-type-badge">{node.type === 'array' ? 'ARR' : 'OBJ'}</span>
											<span class="node-key" title={node.key}>{node.key}</span>
											{#if node.type === 'array'}
												<span class="node-count">({(node.data as unknown[]).length})</span>
											{:else}
												<span class="node-count">({Object.keys(node.data as Record<string, unknown>).length})</span>
											{/if}
										</div>
										<button
											type="button"
											class="copy-btn"
											onclick={(e) => copyNode(node, e)}
											title="Copy node JSON"
											aria-label="Copy node JSON"
										>
											{#if copiedNodeId === node.id}
												<svg class="h-3.5 w-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
											{:else}
												<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="13" height="13" x="9" y="9" rx="2" ry="2" stroke-width="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-width="2" /></svg>
											{/if}
										</button>
									</div>

									<!-- Properties -->
									{#if node.properties.length > 0 || node.truncatedProps > 0 || node.truncatedChildren > 0}
										<div class="node-body">
											{#each node.properties as prop}
												<div class="node-prop">
													<span class="prop-key">{prop.key}</span>
													<span class="prop-sep">:</span>
													<span class="prop-val" style="color: {valColor(prop.valueType)}">{prop.value}</span>
												</div>
											{/each}
											{#if node.truncatedProps > 0}
												<div class="node-prop truncated">… {node.truncatedProps} more properties</div>
											{/if}
											{#if node.truncatedChildren > 0}
												<div class="node-prop truncated">… {node.truncatedChildren} more items</div>
											{/if}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else if !error}
						<!-- Empty state -->
						<div class="empty-state">
							<AppIcon name="link" size={16} />
							<h3 class="text-lg font-semibold text-base-content/70 mb-1">No JSON Data</h3>
							<p class="text-sm text-base-content/40 max-w-xs text-center">Paste JSON in the editor or load sample data to visualize relationships</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Content Sections -->
	<div class="mt-12 space-y-6">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>

<style>
	.viz-layout {
		display: flex;
		height: calc(100vh - 240px);
		min-height: 500px;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid oklch(var(--b3));
		background: oklch(var(--b2));
	}

	.editor-panel {
		width: 38%;
		min-width: 280px;
		display: flex;
		flex-direction: column;
		border-right: 1px solid oklch(var(--b3) / 0.5);
	}

	.editor-inner {
		flex: 1;
		overflow: auto;
	}

	.editor-inner :global(.codemirror-wrapper) {
		border: none !important;
		border-radius: 0 !important;
		height: 100%;
	}

	.editor-inner :global(.editor-container) {
		min-height: 100% !important;
		max-height: none !important;
	}

	.editor-inner :global(.cm-editor) {
		min-height: 100% !important;
	}

	.divider-drag {
		width: 4px;
		background: oklch(var(--b3));
		cursor: col-resize;
		transition: background 0.15s;
	}

	.divider-drag:hover {
		background: oklch(var(--p));
	}

	.viz-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.viz-canvas {
		flex: 1;
		overflow: hidden;
		position: relative;
		background:
			radial-gradient(circle at 50% 50%, oklch(var(--b2)) 0%, oklch(var(--b1)) 100%),
			repeating-linear-gradient(0deg, transparent, transparent 39px, oklch(var(--bc) / 0.03) 39px, oklch(var(--bc) / 0.03) 40px),
			repeating-linear-gradient(90deg, transparent, transparent 39px, oklch(var(--bc) / 0.03) 39px, oklch(var(--bc) / 0.03) 40px);
	}

	.viz-content {
		position: absolute;
		top: 0;
		left: 0;
		transform-origin: 0 0;
	}

	.connections-layer {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		overflow: visible;
	}

	.conn-label {
		fill: oklch(var(--bc) / 0.35);
		font-size: 10px;
		font-family: ui-monospace, monospace;
	}

	/* --- Node Styles --- */
	.graph-node {
		position: absolute;
		border-radius: 10px;
		overflow: hidden;
		border: 1px solid oklch(var(--bc) / 0.1);
		background: oklch(var(--b2));
		box-shadow: 0 2px 12px oklch(var(--bc) / 0.06), 0 0 0 1px oklch(var(--bc) / 0.04);
		transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
		cursor: pointer;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
	}

	.graph-node:hover {
		box-shadow: 0 4px 20px oklch(var(--bc) / 0.12), 0 0 0 1px oklch(var(--bc) / 0.08);
		border-color: oklch(var(--bc) / 0.18);
		transform: translateY(-1px);
	}

	.graph-node.node-selected {
		border-color: oklch(var(--p));
		box-shadow: 0 0 0 2px oklch(var(--p) / 0.3), 0 4px 20px oklch(var(--p) / 0.15);
	}

	.node-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 10px;
		height: 40px;
		gap: 6px;
	}

	.node-header.node-obj {
		background: linear-gradient(135deg, #6366f1, #4f46e5);
	}

	.node-header.node-arr {
		background: linear-gradient(135deg, #10b981, #059669);
	}

	.node-type-badge {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.05em;
		padding: 2px 5px;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.18);
		color: #fff;
		flex-shrink: 0;
	}

	.node-key {
		font-size: 12px;
		font-weight: 600;
		color: #fff;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	.node-count {
		font-size: 10px;
		color: rgba(255, 255, 255, 0.6);
		flex-shrink: 0;
	}

	.copy-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 6px;
		border: none;
		background: rgba(255, 255, 255, 0.12);
		color: #fff;
		cursor: pointer;
		transition: background 0.15s;
	}

	.copy-btn:hover {
		background: rgba(255, 255, 255, 0.25);
	}

	.node-body {
		padding: 4px 0;
	}

	.node-prop {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 3px 10px;
		font-size: 11px;
		line-height: 1.6;
		overflow: hidden;
	}

	.node-prop:hover {
		background: oklch(var(--bc) / 0.04);
	}

	.node-prop.truncated {
		color: oklch(var(--bc) / 0.4);
		font-style: italic;
		font-size: 10px;
	}

	.prop-key {
		color: #ec4899;
		flex-shrink: 0;
		max-width: 80px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.prop-sep {
		color: oklch(var(--bc) / 0.3);
		flex-shrink: 0;
	}

	.prop-val {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		min-width: 0;
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 0.5rem;
	}

	.empty-icon {
		font-size: 3rem;
		opacity: 0.4;
		margin-bottom: 0.5rem;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.viz-layout {
			flex-direction: column;
			height: calc(100vh - 200px);
		}

		.editor-panel {
			width: 100% !important;
			min-width: 0;
			max-height: 40%;
			border-right: none;
			border-bottom: 1px solid oklch(var(--b3) / 0.5);
		}

		.divider-drag {
			width: 100%;
			height: 4px;
			cursor: row-resize;
		}
	}
</style>

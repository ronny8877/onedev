<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import HtmlTree from '$lib/components/ui/HtmlTree.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { parseHTMLSafe, countTags, generateSelector, generateXPath } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';

	const content = htmlToolsContent['dom-visualizer'];

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

	let input = $state('');
	let searchQuery = $state('');
	let expandAll = $state(false);
	let selectedNode = $state<HtmlNodeData | null>(null);

	// Parse HTML into tree structure
	const treeData = $derived.by((): HtmlNodeData | null => {
		if (!input.trim()) return null;

		const { doc } = parseHTMLSafe(input);
		
		function parseNode(el: Element, parentPath: string): HtmlNodeData {
			const path = parentPath ? `${parentPath} > ${el.tagName.toLowerCase()}` : el.tagName.toLowerCase();
			
			const attrs: Record<string, string> = {};
			for (const attr of Array.from(el.attributes)) {
				attrs[attr.name] = attr.value;
			}

			const children: HtmlNodeData[] = [];
			let textContent = '';

			for (const child of Array.from(el.childNodes)) {
				if (child.nodeType === Node.ELEMENT_NODE) {
					children.push(parseNode(child as Element, path));
				} else if (child.nodeType === Node.TEXT_NODE) {
					const t = child.textContent?.trim();
					if (t) textContent += t;
				}
			}

			return {
				tag: el.tagName.toLowerCase(),
				id: el.id || undefined,
				className: el.className ? (typeof el.className === 'string' ? el.className : String(el.className)) : undefined,
				attributes: attrs,
				children,
				text: textContent || undefined,
				path,
				element: el
			};
		}

		const root = doc.documentElement;
		return root ? parseNode(root, '') : null;
	});

	// Tag statistics
	const tagStats = $derived.by(() => {
		if (!input.trim()) return [];
		return countTags(input).slice(0, 10);
	});

	const totalNodes = $derived(tagStats.reduce((sum, t) => sum + t.count, 0));

	// Selected node details
	const selectedDetails = $derived.by(() => {
		if (!selectedNode) return null;
		
		let cssSelector = selectedNode.path;
		let xpath = '';
		
		if (selectedNode.element) {
			try {
				cssSelector = generateSelector(selectedNode.element);
				xpath = generateXPath(selectedNode.element);
			} catch {
				// Fallback to path
			}
		}

		return {
			tag: selectedNode.tag,
			id: selectedNode.id,
			className: selectedNode.className,
			attributes: selectedNode.attributes,
			text: selectedNode.text,
			childCount: selectedNode.children.length,
			cssSelector,
			xpath,
			outerHTML: selectedNode.element?.outerHTML || '',
			innerHTML: selectedNode.element?.innerHTML || ''
		};
	});

	// Breadcrumb path
	const breadcrumb = $derived(selectedNode?.path.split(' > ').filter(Boolean) || []);

	function handleNodeSelect(node: HtmlNodeData) {
		selectedNode = node;
	}

	function handleExpandAll() {
		expandAll = true;
	}

	function handleCollapseAll() {
		expandAll = false;
	}

	function clearSearch() {
		searchQuery = '';
	}

	function handleClear() {
		input = '';
		selectedNode = null;
		searchQuery = '';
	}

	function loadExample() {
		input = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Page</title>
</head>
<body>
    <header class="main-header">
        <nav>
            <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
            </ul>
        </nav>
    </header>
    <main id="content">
        <article class="post">
            <h1>Hello World</h1>
            <p>This is a <strong>sample</strong> paragraph.</p>
            <img src="image.jpg" alt="Sample Image" />
        </article>
    </main>
</body>
</html>`;
	}

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} {stats} />

		<!-- Input Section -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">HTML Input</h3>
			</div>
			<CodeMirrorEditor bind:value={input} language="html" placeholder="Paste your HTML here..." />
		</div>

		<!-- Stats Summary -->
		{#if treeData}
			<div class="flex flex-wrap items-center gap-3 p-4 bg-gradient-to-r from-base-200 to-base-200/50 rounded-2xl border border-base-300/50">
				<div class="flex items-center gap-2">
					<div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
						<AppIcon name="tree-deciduous" size={18} />
					</div>
					<div>
						<div class="text-xl font-bold text-primary">{totalNodes}</div>
						<div class="text-xs text-base-content/50">nodes</div>
					</div>
				</div>
				<div class="w-px h-8 bg-base-300 hidden sm:block"></div>
				<div class="flex items-center gap-2">
					<div class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
						<AppIcon name="tag" size={18} />
					</div>
					<div>
						<div class="text-xl font-bold text-secondary">{tagStats.length}</div>
						<div class="text-xs text-base-content/50">unique tags</div>
					</div>
				</div>
				<div class="w-px h-8 bg-base-300 hidden sm:block"></div>
				<div class="flex flex-wrap gap-1.5 flex-1">
					{#each tagStats.slice(0, 6) as { tag, count }}
						<span class="badge badge-sm font-mono bg-base-300/50 border-base-300">{tag} <span class="text-base-content/50 ml-1">×{count}</span></span>
					{/each}
					{#if tagStats.length > 6}
						<span class="badge badge-sm badge-ghost">+{tagStats.length - 6}</span>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Tree View Section -->
		{#if treeData}
			<div class="space-y-3">
				<!-- Controls -->
				<div class="flex flex-wrap items-center gap-3">
					<div class="join flex-1 max-w-sm">
						<div class="join-item flex items-center px-3 bg-base-200 border border-base-300">
							<svg class="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
						</div>
						<input
							type="text"
							class="input input-bordered join-item flex-1 focus:outline-none"
							placeholder="Search: tag, #id, .class"
							bind:value={searchQuery}
						/>
						{#if searchQuery}
							<button type="button" class="btn btn-ghost join-item px-3" onclick={clearSearch} aria-label="Clear search">
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>
						{/if}
					</div>

					<div class="btn-group">
						<button type="button" class="btn btn-sm btn-ghost gap-1" onclick={handleExpandAll}>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
							</svg>
							Expand
						</button>
						<button type="button" class="btn btn-sm btn-ghost gap-1" onclick={handleCollapseAll}>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
							</svg>
							Collapse
						</button>
					</div>
				</div>

				<!-- Tree Container -->
				<div class="min-h-[200px] max-h-[400px] overflow-auto rounded-2xl border border-base-300 bg-base-200/50 p-4 transition-all">
					{#key expandAll}
						<HtmlTree 
							node={treeData}
							{expandAll}
							{searchQuery}
							selectedPath={selectedNode?.path || ''}
							onSelect={handleNodeSelect}
						/>
					{/key}
				</div>
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-12 px-4 bg-base-200/30 rounded-2xl border border-dashed border-base-300">
				<div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
					<AppIcon name="tree-deciduous" size={16} />
				</div>
				<p class="text-base-content/50 text-center">
					Paste HTML above to visualize the DOM tree
				</p>
			</div>
		{/if}

		<!-- Selected Node Details -->
		{#if selectedDetails}
			<div class="card bg-gradient-to-br from-base-200 to-base-200/50 border border-base-300/50 rounded-2xl shadow-sm">
				<div class="card-body p-5">
					<!-- Breadcrumb -->
					{#if breadcrumb.length > 0}
						<div class="flex flex-wrap items-center gap-1.5 text-xs font-mono mb-3 pb-3 border-b border-base-300/50">
							{#each breadcrumb as part, i}
								<span class="px-2 py-0.5 rounded-md bg-base-300/50 text-info">{part}</span>
								{#if i < breadcrumb.length - 1}
									<svg class="w-3 h-3 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
									</svg>
								{/if}
							{/each}
						</div>
					{/if}

					<!-- Header -->
					<div class="flex items-start justify-between gap-4 mb-4">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
								<span class="text-info font-mono text-lg">&lt;/&gt;</span>
							</div>
							<div>
								<h4 class="font-bold text-lg flex items-center gap-2">
									<span class="text-info font-mono">&lt;{selectedDetails.tag}&gt;</span>
								</h4>
								<div class="flex flex-wrap gap-1 mt-1">
									{#if selectedDetails.id}
										<span class="badge badge-warning badge-sm font-mono">#{selectedDetails.id}</span>
									{/if}
									{#if selectedDetails.className}
										<span class="badge badge-success badge-sm font-mono">.{(selectedDetails.className || '').split(' ')[0]}</span>
									{/if}
								</div>
							</div>
						</div>
						<div class="text-right">
							<div class="text-2xl font-bold">{selectedDetails.childCount}</div>
							<div class="text-xs text-base-content/50">children</div>
						</div>
					</div>

					<!-- Attributes Grid -->
					{#if Object.keys(selectedDetails.attributes).length > 0}
						<div class="mb-4">
							<h5 class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Attributes</h5>
							<div class="grid gap-2 sm:grid-cols-2">
								{#each Object.entries(selectedDetails.attributes) as [key, value]}
									<div class="flex items-center gap-2 px-3 py-2 bg-base-300/30 rounded-lg">
										<span class="text-warning font-mono text-sm">{key}</span>
										<span class="text-base-content/30">=</span>
										<span class="text-success font-mono text-sm truncate flex-1" title={value}>"{value}"</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Text Content -->
					{#if selectedDetails.text}
						<div class="mb-4">
							<h5 class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Text Content</h5>
							<p class="text-sm bg-base-300/30 p-3 rounded-lg line-clamp-2">{selectedDetails.text}</p>
						</div>
					{/if}

					<!-- Copy Utilities -->
					<div class="pt-3 border-t border-base-300/50">
						<h5 class="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-2">Quick Copy</h5>
						<div class="flex flex-wrap gap-2">
							<div class="flex items-center gap-1 px-2 py-1 bg-base-300/30 rounded-lg">
								<span class="text-xs text-base-content/50">CSS</span>
								<CopyButton text={selectedDetails.cssSelector} label="" size="xs" />
							</div>
							{#if selectedDetails.xpath}
								<div class="flex items-center gap-1 px-2 py-1 bg-base-300/30 rounded-lg">
									<span class="text-xs text-base-content/50">XPath</span>
									<CopyButton text={selectedDetails.xpath} label="" size="xs" />
								</div>
							{/if}
							{#if selectedDetails.outerHTML}
								<div class="flex items-center gap-1 px-2 py-1 bg-base-300/30 rounded-lg">
									<span class="text-xs text-base-content/50">outerHTML</span>
									<CopyButton text={selectedDetails.outerHTML} label="" size="xs" />
								</div>
							{/if}
							{#if selectedDetails.innerHTML}
								<div class="flex items-center gap-1 px-2 py-1 bg-base-300/30 rounded-lg">
									<span class="text-xs text-base-content/50">innerHTML</span>
									<CopyButton text={selectedDetails.innerHTML} label="" size="xs" />
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Legend -->
		<div class="flex flex-wrap items-center gap-4 px-4 py-3 bg-base-200/50 rounded-xl text-sm">
			<span class="flex items-center gap-1.5">
				<span class="w-3 h-3 rounded bg-info/20"></span>
				<code class="text-info">&lt;tag&gt;</code>
			</span>
			<span class="flex items-center gap-1.5">
				<span class="w-3 h-3 rounded bg-warning/20"></span>
				<code class="text-warning">#id</code>
			</span>
			<span class="flex items-center gap-1.5">
				<span class="w-3 h-3 rounded bg-success/20"></span>
				<code class="text-success">.class</code>
			</span>
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
	</div>
</ToolWrapper>

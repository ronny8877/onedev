<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { extractElements, type ExtractedElement } from '$lib/utils/html';

	let input = $state('');
	let elementType = $state('a');
	let customSelector = $state('');
	let viewMode = $state<'table' | 'cards' | 'list'>('table');
	let showAdvanced = $state(false);

	const selector = $derived(elementType === 'custom' ? customSelector : elementType);

	const elements = $derived.by(() => {
		if (!input.trim() || !selector.trim()) return [];
		return extractElements(input, selector);
	});

	const presets = [
		{ value: 'a', label: 'Links', icon: '🔗', description: 'All <a> tags with href' },
		{ value: 'img', label: 'Images', icon: '🖼️', description: 'All <img> tags' },
		{ value: 'script[src]', label: 'Scripts', icon: '📜', description: 'External script files' },
		{ value: 'link[rel="stylesheet"], style', label: 'Styles', icon: '🎨', description: 'CSS files and inline styles' },
		{ value: 'meta', label: 'Meta', icon: '📋', description: 'Meta tags' },
		{ value: 'input, textarea, select, button', label: 'Forms', icon: '📝', description: 'Form elements' },
		{ value: 'h1, h2, h3, h4, h5, h6', label: 'Headings', icon: '📰', description: 'All heading levels' },
		{ value: '[id]', label: 'With ID', icon: '#️⃣', description: 'Elements with ID attribute' },
		{ value: '[class]', label: 'With Class', icon: '🏷️', description: 'Elements with class attribute' },
		{ value: 'custom', label: 'Custom', icon: '🔍', description: 'Write your own CSS selector' }
	];

	// Advanced common selectors
	const advancedSelectors = [
		{ selector: 'a[href^="http"]', label: 'External links' },
		{ selector: 'a[href^="/"]', label: 'Internal links' },
		{ selector: 'img:not([alt])', label: 'Images without alt' },
		{ selector: '[style]', label: 'Inline styles' },
		{ selector: '[onclick], [onload], [onerror]', label: 'Event handlers' },
		{ selector: 'iframe', label: 'Iframes' },
		{ selector: '[data-*]', label: 'Data attributes' },
		{ selector: 'script:not([src])', label: 'Inline scripts' }
	];

	function getMainAttribute(el: ExtractedElement): { label: string; value: string } {
		if (el.tag === 'a') return { label: 'href', value: el.attributes.href || '' };
		if (el.tag === 'img') return { label: 'src', value: el.attributes.src || '' };
		if (el.tag === 'script') return { label: 'src', value: el.attributes.src || '(inline)' };
		if (el.tag === 'link') return { label: 'href', value: el.attributes.href || '' };
		if (el.tag === 'meta') {
			if (el.attributes.name) return { label: el.attributes.name, value: el.attributes.content || '' };
			if (el.attributes.property) return { label: el.attributes.property, value: el.attributes.content || '' };
			return { label: 'charset', value: el.attributes.charset || '' };
		}
		if (el.tag === 'input') return { label: 'type', value: el.attributes.type || 'text' };
		const firstAttr = Object.entries(el.attributes)[0];
		return firstAttr ? { label: firstAttr[0], value: firstAttr[1] } : { label: '-', value: '-' };
	}

	function exportJSON() {
		const data = elements.map(el => ({
			tag: el.tag,
			...el.attributes,
			text: el.text
		}));
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'extracted-elements.json';
		a.click();
		URL.revokeObjectURL(url);
	}

	function exportCSV() {
		if (elements.length === 0) return;
		
		const allKeys = new Set<string>();
		elements.forEach(el => {
			allKeys.add('tag');
			Object.keys(el.attributes).forEach(k => allKeys.add(k));
			if (el.text) allKeys.add('text');
		});
		
		const headers = Array.from(allKeys);
		const rows = elements.map(el => {
			return headers.map(h => {
				if (h === 'tag') return el.tag;
				if (h === 'text') return el.text || '';
				return el.attributes[h] || '';
			}).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
		});
		
		const csv = [headers.join(','), ...rows].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'extracted-elements.csv';
		a.click();
		URL.revokeObjectURL(url);
	}

	function copyAllValues() {
		const values = elements.map(el => getMainAttribute(el).value).filter(Boolean);
		navigator.clipboard.writeText(values.join('\n'));
	}

	function applyAdvancedSelector(sel: string) {
		elementType = 'custom';
		customSelector = sel;
	}
</script>

<ToolWrapper
	title="Element Extractor"
	description="Extract links, images, meta tags, and more from HTML"
>
	<div class="flex flex-col gap-6">
		<!-- Quick Presets -->
		<div>
			<div class="flex items-center justify-between mb-3">
				<h3 class="text-sm font-medium text-base-content/70">Extract Elements</h3>
				<button 
					type="button" 
					class="btn btn-ghost btn-xs gap-1"
					onclick={() => showAdvanced = !showAdvanced}
				>
					{showAdvanced ? 'Simple' : 'Advanced'}
					<svg class="w-3 h-3 transition-transform" class:rotate-180={showAdvanced} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
			</div>
			
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
				{#each presets as preset}
					<button
						type="button"
						class="flex flex-col items-center gap-1 p-3 rounded-xl border transition-all
							{elementType === preset.value 
								? 'bg-primary/10 border-primary/30 text-primary' 
								: 'bg-base-200/50 border-base-300/50 hover:bg-base-200 hover:border-base-300'}"
						onclick={() => elementType = preset.value}
						title={preset.description}
					>
						<span class="text-xl">{preset.icon}</span>
						<span class="text-xs font-medium">{preset.label}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Advanced Selectors -->
		{#if showAdvanced}
			<div class="p-4 bg-base-200/50 rounded-xl border border-base-300/50 space-y-3">
				<h4 class="text-sm font-medium text-base-content/70">Quick Advanced Selectors</h4>
				<div class="flex flex-wrap gap-2">
					{#each advancedSelectors as { selector: sel, label }}
						<button
							type="button"
							class="badge badge-lg cursor-pointer hover:badge-primary transition-colors"
							onclick={() => applyAdvancedSelector(sel)}
						>
							{label}
						</button>
					{/each}
				</div>
				<div class="pt-2">
					<p class="text-xs text-base-content/50 mb-2">Or write your own CSS selector:</p>
					<input
						type="text"
						class="input input-bordered w-full font-mono text-sm"
						placeholder="e.g., div.container > a[href], img[src*='cdn']"
						bind:value={customSelector}
						onfocus={() => elementType = 'custom'}
					/>
				</div>
			</div>
		{/if}

		<!-- Custom Selector (simple mode) -->
		{#if elementType === 'custom' && !showAdvanced}
			<div class="flex items-center gap-2">
				<input
					type="text"
					class="input input-bordered flex-1 font-mono"
					placeholder="CSS selector (e.g., div.container, #main a)"
					bind:value={customSelector}
				/>
			</div>
		{/if}

		<!-- Input -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
			<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
		</div>

		<!-- Results -->
		{#if elements.length > 0}
			<div class="space-y-3">
				<!-- Results Header -->
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<h3 class="font-semibold">
							<span class="text-primary">{elements.length}</span> 
							element{elements.length !== 1 ? 's' : ''} found
						</h3>
						<span class="badge badge-ghost font-mono text-xs">{selector}</span>
					</div>
					
					<div class="flex items-center gap-2">
						<!-- View Mode -->
						<div class="join">
							<button 
								type="button" 
								class="btn btn-xs join-item {viewMode === 'table' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => viewMode = 'table'}
								title="Table view"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
								</svg>
							</button>
							<button 
								type="button" 
								class="btn btn-xs join-item {viewMode === 'cards' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => viewMode = 'cards'}
								title="Cards view"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
								</svg>
							</button>
							<button 
								type="button" 
								class="btn btn-xs join-item {viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => viewMode = 'list'}
								title="List view"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
								</svg>
							</button>
						</div>
						
						<!-- Export -->
						<div class="dropdown dropdown-end">
							<button tabindex="0" type="button" class="btn btn-sm btn-ghost gap-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
								</svg>
								Export
							</button>
							<ul tabindex="-1" class="dropdown-content menu bg-base-200 rounded-box w-40 p-2 shadow-lg z-50">
								<li><button onclick={exportJSON}>JSON</button></li>
								<li><button onclick={exportCSV}>CSV</button></li>
								<li><button onclick={copyAllValues}>Copy all values</button></li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Table View -->
				{#if viewMode === 'table'}
					<div class="overflow-x-auto rounded-xl border border-base-300">
						<table class="table table-sm">
							<thead class="bg-base-200">
								<tr>
									<th class="w-20">Tag</th>
									<th>Attribute</th>
									<th>Value</th>
									<th class="w-24">Text</th>
									<th class="w-16"></th>
								</tr>
							</thead>
							<tbody>
								{#each elements.slice(0, 100) as el}
									{@const attr = getMainAttribute(el)}
									<tr class="hover">
										<td><code class="badge badge-ghost badge-sm">{el.tag}</code></td>
										<td class="text-warning text-xs font-mono">{attr.label}</td>
										<td class="max-w-xs font-mono text-xs">
											<span class="truncate block" title={attr.value}>{attr.value || '-'}</span>
										</td>
										<td class="max-w-[100px] text-xs truncate" title={el.text}>{el.text || '-'}</td>
										<td>
											<CopyButton text={attr.value || el.html || ''} label="" size="xs" />
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
						{#if elements.length > 100}
							<div class="p-3 bg-base-200 text-center text-sm text-base-content/70">
								Showing first 100 of {elements.length} elements
							</div>
						{/if}
					</div>
				{/if}

				<!-- Cards View -->
				{#if viewMode === 'cards'}
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{#each elements.slice(0, 50) as el}
							{@const attr = getMainAttribute(el)}
							<div class="p-3 bg-base-200/50 rounded-xl border border-base-300/50 space-y-2">
								<div class="flex items-center justify-between">
									<code class="badge badge-primary">&lt;{el.tag}&gt;</code>
									<CopyButton text={el.html || ''} label="" size="xs" />
								</div>
								<div class="text-xs">
									<span class="text-warning font-mono">{attr.label}:</span>
									<span class="font-mono text-base-content/70 break-all">{attr.value || '-'}</span>
								</div>
								{#if el.text}
									<p class="text-xs text-base-content/50 line-clamp-2">{el.text}</p>
								{/if}
							</div>
						{/each}
					</div>
					{#if elements.length > 50}
						<p class="text-center text-sm text-base-content/50">
							Showing first 50 of {elements.length} elements
						</p>
					{/if}
				{/if}

				<!-- List View -->
				{#if viewMode === 'list'}
					<div class="space-y-1 max-h-[400px] overflow-y-auto">
						{#each elements.slice(0, 200) as el}
							{@const attr = getMainAttribute(el)}
							<div class="flex items-center gap-3 px-3 py-2 bg-base-200/30 rounded-lg hover:bg-base-200/50 transition-colors">
								<code class="badge badge-ghost badge-sm min-w-[60px]">{el.tag}</code>
								<span class="flex-1 font-mono text-sm truncate" title={attr.value}>{attr.value || el.text || '-'}</span>
								<CopyButton text={attr.value || el.html || ''} label="" size="xs" />
							</div>
						{/each}
					</div>
					{#if elements.length > 200}
						<p class="text-center text-sm text-base-content/50">
							Showing first 200 of {elements.length} elements
						</p>
					{/if}
				{/if}
			</div>
		{:else if input.trim() && selector.trim()}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
					<span class="text-3xl">🔍</span>
				</div>
				<p class="text-base-content/50 mb-2">No elements found</p>
				<code class="text-sm font-mono text-base-content/30">{selector}</code>
			</div>
		{/if}
	</div>
</ToolWrapper>

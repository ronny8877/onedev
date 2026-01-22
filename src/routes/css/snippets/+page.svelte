<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { cssSnippets } from '$lib/utils/css-utils';

	let activeTab = $state<'centering' | 'truncate' | 'aspect' | 'sticky' | 'a11y' | 'effects' | 'modern'>('centering');

	const tabs = [
		{ id: 'centering', label: 'Centering', icon: '⊕' },
		{ id: 'truncate', label: 'Truncate', icon: '...' },
		{ id: 'aspect', label: 'Aspect Ratio', icon: '▭' },
		{ id: 'sticky', label: 'Sticky Footer', icon: '📌' },
		{ id: 'a11y', label: 'Accessibility', icon: '♿' },
		{ id: 'effects', label: 'Effects', icon: '✨' },
		{ id: 'modern', label: 'Modern CSS', icon: '🆕' },
	] as const;
</script>

<ToolWrapper
	keywords={['css snippets', 'css utilities', 'centering css', 'text overflow', 'glass effect', 'gradient text']}
>
	<div class="flex flex-col gap-6">
		<!-- Tabs -->
		<div class="flex flex-wrap gap-2">
			{#each tabs as tab}
				<button
					class="btn btn-sm"
					class:btn-primary={activeTab === tab.id}
					onclick={() => activeTab = tab.id}
				>
					<span>{tab.icon}</span>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Centering -->
		{#if activeTab === 'centering'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Flexbox Centering</h3>
							<CopyButton text={cssSnippets.centerFlex} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.centerFlex}</pre>
							<div class="flex items-center justify-center h-32 bg-base-300 rounded-xl">
								<div class="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white text-xs">Centered</div>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Grid Centering (Shortest)</h3>
							<CopyButton text={cssSnippets.centerGrid} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.centerGrid}</pre>
							<div class="grid place-items-center h-32 bg-base-300 rounded-xl">
								<div class="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-white text-xs">Centered</div>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Absolute Centering</h3>
							<CopyButton text={cssSnippets.centerAbsolute} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.centerAbsolute}</pre>
							<div class="relative h-32 bg-base-300 rounded-xl">
								<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-accent rounded-lg flex items-center justify-center text-white text-xs">Centered</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Truncate -->
		{#if activeTab === 'truncate'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Single Line Ellipsis</h3>
							<CopyButton text={cssSnippets.truncateSingle} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.truncateSingle}</pre>
							<div class="bg-base-300 rounded-xl p-4">
								<p class="whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-full" style="text-overflow: ellipsis;">
									This is a very long text that will be truncated with an ellipsis when it overflows.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Multi-Line Clamp (3 lines)</h3>
							<CopyButton text={cssSnippets.truncateMulti} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.truncateMulti}</pre>
							<div class="bg-base-300 rounded-xl p-4">
								<p class="line-clamp-3">
									This is a longer paragraph that spans multiple lines. The text will be clamped to 3 lines maximum and will show an ellipsis at the end. This is very useful for card descriptions, previews, and any content that needs to fit in a specific height.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Balanced Text</h3>
							<CopyButton text={cssSnippets.textBalance} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.textBalance}</pre>
							<div class="bg-base-300 rounded-xl p-4">
								<h2 class="text-lg font-bold" style="text-wrap: balance; max-inline-size: 30ch;">
									This Headline Is Balanced Across Lines for Better Readability
								</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Aspect Ratio -->
		{#if activeTab === 'aspect'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Modern (aspect-ratio)</h3>
							<CopyButton text={cssSnippets.aspectRatio} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.aspectRatio}</pre>
							<div class="bg-base-300 rounded-xl overflow-hidden" style="aspect-ratio: 16/9; max-width: 200px;">
								<div class="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">16:9</div>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Padding Trick (Legacy)</h3>
							<CopyButton text={cssSnippets.aspectRatioFallback} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto max-h-48 whitespace-pre-wrap">{cssSnippets.aspectRatioFallback}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Sticky Footer -->
		{#if activeTab === 'sticky'}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Sticky Footer (Flexbox)</h3>
						<CopyButton text={cssSnippets.stickyFooter} label="Copy" size="sm" />
					</div>
					<div class="grid lg:grid-cols-2 gap-4">
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.stickyFooter}</pre>
						<div class="bg-base-300 rounded-xl overflow-hidden h-48 flex flex-col">
							<div class="bg-primary/30 p-2 text-center text-xs shrink-0">Header</div>
							<div class="flex-1 p-4 flex items-center justify-center text-sm text-base-content/60">Main content (flex: 1)</div>
							<div class="bg-secondary/30 p-2 text-center text-xs shrink-0">Footer (sticks to bottom)</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- A11y -->
		{#if activeTab === 'a11y'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Visually Hidden (Screen Reader Only)</h3>
							<CopyButton text={cssSnippets.visuallyHidden} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.visuallyHidden}</pre>
						<p class="text-sm text-base-content/60 mt-3">For content accessible to screen readers but hidden visually.</p>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Smooth Scroll (Motion Safe)</h3>
							<CopyButton text={cssSnippets.smoothScroll} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.smoothScroll}</pre>
						<p class="text-sm text-base-content/60 mt-3">Respects user's "reduced motion" preference.</p>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Focus Visible Ring</h3>
							<CopyButton text={cssSnippets.focusVisible} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.focusVisible}</pre>
						<p class="text-sm text-base-content/60 mt-3">Shows focus ring only for keyboard navigation.</p>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Disabled State</h3>
							<CopyButton text={cssSnippets.disabledState} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.disabledState}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Effects -->
		{#if activeTab === 'effects'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Gradient Text</h3>
							<CopyButton text={cssSnippets.gradientText} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.gradientText}</pre>
							<div class="bg-base-300 rounded-xl p-6 flex items-center justify-center">
								<span 
									class="text-3xl font-bold"
									style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
								>
									Gradient Text
								</span>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Glass Effect (Glassmorphism)</h3>
							<CopyButton text={cssSnippets.glassEffect} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.glassEffect}</pre>
							<div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 flex items-center justify-center">
								<div 
									class="p-4 rounded-2xl text-white text-sm"
									style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2);"
								>
									Glass Card
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Skeleton Loading</h3>
							<CopyButton text={cssSnippets.skeleton} label="Copy" size="sm" />
						</div>
						<div class="grid lg:grid-cols-2 gap-4">
							<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto max-h-48 whitespace-pre-wrap">{cssSnippets.skeleton}</pre>
							<div class="bg-base-300 rounded-xl p-4 space-y-3">
								<div class="h-4 bg-base-content/10 rounded animate-pulse"></div>
								<div class="h-4 bg-base-content/10 rounded animate-pulse w-3/4"></div>
								<div class="h-4 bg-base-content/10 rounded animate-pulse w-1/2"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Custom Scrollbar</h3>
							<CopyButton text={cssSnippets.customScrollbar} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto max-h-48 whitespace-pre-wrap">{cssSnippets.customScrollbar}</pre>
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Reset Button Styles</h3>
							<CopyButton text={cssSnippets.resetButton} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.resetButton}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Modern CSS -->
		{#if activeTab === 'modern'}
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Container Queries</h3>
							<CopyButton text={cssSnippets.containerQuery} label="Copy" size="sm" />
						</div>
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto whitespace-pre-wrap">{cssSnippets.containerQuery}</pre>
						<p class="text-sm text-base-content/60 mt-3">Style based on container size instead of viewport. Modern browsers only.</p>
					</div>
				</div>

				<div class="card bg-info/10 rounded-xl">
					<div class="card-body py-4">
						<h4 class="text-sm font-semibold flex items-center gap-2">
							<span>💡</span> Modern CSS Tips
						</h4>
						<ul class="mt-2 text-sm text-base-content/70 list-disc list-inside space-y-1">
							<li>Use <code>aspect-ratio</code> instead of padding hacks</li>
							<li>Use <code>gap</code> in flexbox instead of margins</li>
							<li>Use <code>:is()</code> and <code>:where()</code> for selector grouping</li>
							<li>Use <code>clamp()</code> for responsive values</li>
							<li>Use <code>text-wrap: balance</code> for headings</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}
	</div>
</ToolWrapper>

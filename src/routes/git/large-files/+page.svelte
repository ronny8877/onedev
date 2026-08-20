<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['large-files'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	interface FileEntry {
		name: string;
		size: number;
		unit: 'B' | 'KB' | 'MB' | 'GB';
		sizeBytes: number;
	}

	let input = $state('');
	let threshold = $state(100);
	let thresholdUnit = $state<'B' | 'KB' | 'MB'>('KB');

	const sampleInput = `node_modules/
src/app.ts                          2.5 KB
public/fonts/inter.woff2            145 KB
public/videos/demo.mp4              125 MB
public/images/hero.png              3.2 MB
dist/bundle.js                      450 KB
data/training-dataset.csv           2.1 GB
assets/design-files.psd             890 MB
backup/database-dump.sql            1.5 GB
logs/app.log                        15 MB
.git/objects/                       
package.json                        1.2 KB`;

	function parseSize(sizeStr: string): number {
		const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB|K|M|G)?/i);
		if (!match) return 0;
		
		const num = parseFloat(match[1]);
		let unit = (match[2] || 'B').toUpperCase();
		
		// Normalize short units (K -> KB, M -> MB, G -> GB)
		if (unit === 'K') unit = 'KB';
		if (unit === 'M') unit = 'MB';
		if (unit === 'G') unit = 'GB';
		
		const multipliers: Record<string, number> = {
			'B': 1,
			'KB': 1024,
			'MB': 1024 * 1024,
			'GB': 1024 * 1024 * 1024
		};
		
		return num * (multipliers[unit] || 1);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
		return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
	}

	function parseInput(): FileEntry[] {
		const lines = input.split('\n').filter(l => l.trim());
		const files: FileEntry[] = [];
		
		for (const line of lines) {
			// Pattern 1: filename    size (original format)
			let match = line.match(/^(.+?)\s+([\d.]+\s*(?:B|KB|MB|GB|K|M|G))\s*$/i);
			
			// Pattern 2: size    filename (du format: "4.0K    ./file.txt" or "100M    ./dir")
			if (!match) {
				match = line.match(/^\s*([\d.]+\s*(?:B|KB|MB|GB|K|M|G)?)\s+(.+?)\s*$/i);
				if (match) {
					// Swap to normalize: [full, size, name]
					const temp = match[1];
					match[1] = match[2];
					match[2] = temp;
				}
			}
			
			if (match) {
				const sizeBytes = parseSize(match[2]);
				const sizeMatch = match[2].match(/([\d.]+)\s*(B|KB|MB|GB|K|M|G)?/i);
				let unit = (sizeMatch?.[2] || 'B').toUpperCase();
				if (unit === 'K') unit = 'KB';
				if (unit === 'M') unit = 'MB';
				if (unit === 'G') unit = 'GB';
				
				files.push({
					name: match[1].trim().replace(/^\.\//, ''), // Remove ./ prefix
					size: parseFloat(sizeMatch?.[1] || '0'),
					unit: unit as FileEntry['unit'],
					sizeBytes
				});
			}
		}
		
		return files.sort((a, b) => b.sizeBytes - a.sizeBytes);
	}

	let files = $derived(parseInput());
	let thresholdBytes = $derived.by(() => {
		const multipliers: Record<string, number> = {
			'B': 1,
			'KB': 1024,
			'MB': 1024 * 1024
		};
		return threshold * (multipliers[thresholdUnit] || 1);
	});
	let largeFiles = $derived(files.filter(f => f.sizeBytes >= thresholdBytes));
	let totalLargeSize = $derived(largeFiles.reduce((acc, f) => acc + f.sizeBytes, 0));

	// Commands based on threshold
	let commands = $derived.by(() => {
		let sizeArg = '';
		if (thresholdUnit === 'B') {
			sizeArg = `+${threshold}c`;
		} else if (thresholdUnit === 'KB') {
			sizeArg = `+${threshold}k`;
		} else {
			sizeArg = `+${threshold}M`;
		}
		
		return {
			// Find command with human-readable output
			find: `find . -type f -size ${sizeArg} -exec ls -lh {} \\;`,
			// du command for Mac/Linux - shows size then path
			du: `du -ah . | awk '$1 ~ /[0-9]+[MGK]/ {print}'`,
			// du with sort for finding largest
			duSort: `du -ah . 2>/dev/null | sort -rh | head -20`,
			};
	});

	// Generate .gitattributes for LFS
	let gitattributes = $derived(
		largeFiles.length > 0
			? largeFiles.map(f => {
					const ext = f.name.split('.').pop();
					return `*.${ext} filter=lfs diff=lfs merge=lfs -text`;
				}).filter((v, i, a) => a.indexOf(v) === i).join('\n')
			: ''
	);

	function loadSample() {
		input = sampleInput;
	}

	function clearAll() {
		input = '';
	}

	function loadDuSample() {
		input = `4.0K	./README.md
16K	./package.json
256K	./src/app.ts
2.5M	./public/hero.png
45M	./assets/video.mp4
120M	./data/backup.sql
1.2G	./archive/old-data.tar.gz
890M	./design/mockups.psd
15M	./logs/combined.log
450K	./dist/bundle.js`;
	}

	function getBarWidth(bytes: number): number {
		const maxBytes = Math.max(...files.map(f => f.sizeBytes), thresholdBytes);
		return (bytes / maxBytes) * 100;
	}

	// Quick threshold presets
	const presets = [
		{ label: '50 KB', value: 50, unit: 'KB' as const },
		{ label: '100 KB', value: 100, unit: 'KB' as const },
		{ label: '500 KB', value: 500, unit: 'KB' as const },
		{ label: '1 MB', value: 1, unit: 'MB' as const },
		{ label: '10 MB', value: 10, unit: 'MB' as const },
		{ label: '100 MB', value: 100, unit: 'MB' as const }
	];

	function setPreset(value: number, unit: 'KB' | 'MB') {
		threshold = value;
		thresholdUnit = unit;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Commands to Generate Output -->
		<div class="card bg-info/10 border border-info/30 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold text-info flex items-center gap-2 mb-3">
					<AppIcon name={'📋'} size={16} />
					Copy a Command, Run It, Paste the Output Below
				</h4>
				<div class="space-y-2">
					<div>
						<p class="text-xs text-base-content/50 mb-1">Find large files (shows size + path)</p>
						<div class="flex items-center justify-between gap-2 p-2 bg-base-200 rounded-lg">
							<code class="font-mono text-xs flex-1 overflow-x-auto">{commands.duSort}</code>
							<CopyButton text={commands.duSort} size="xs" />
						</div>
					</div>
					<details class="text-sm">
						<summary class="text-xs text-base-content/50 cursor-pointer hover:text-base-content/70">
							More commands...
						</summary>
						<div class="space-y-2 mt-2">
							<div>
								<p class="text-xs text-base-content/50 mb-1">All files with sizes</p>
								<div class="flex items-center justify-between gap-2 p-2 bg-base-200 rounded-lg">
									<code class="font-mono text-xs flex-1 overflow-x-auto">{commands.du}</code>
									<CopyButton text={commands.du} size="xs" />
								</div>
							</div>
							<div>
								<p class="text-xs text-base-content/50 mb-1">Find files over threshold</p>
								<div class="flex items-center justify-between gap-2 p-2 bg-base-200 rounded-lg">
									<code class="font-mono text-xs flex-1 overflow-x-auto">{commands.find}</code>
									<CopyButton text={commands.find} size="xs" />
								</div>
							</div>
						</div>
					</details>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2 flex-wrap">
			<button class="btn btn-sm btn-primary" onclick={loadSample}>📄 Sample (ls format)</button>
			<button class="btn btn-sm btn-secondary" onclick={loadDuSample}>📄 Sample (du format)</button>
			<button class="btn btn-sm btn-ghost" onclick={clearAll}>Clear</button>
		</div>

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Paste Output</h3>
			<p class="text-xs text-base-content/50 mb-2">
				Supports both formats: <code class="px-1 bg-base-300 rounded">filename 2.5M</code> or <code class="px-1 bg-base-300 rounded">2.5M filename</code>
			</p>
			<textarea
				bind:value={input}
				placeholder="4.0K    ./README.md&#10;2.5M    ./public/hero.png&#10;45M     ./assets/video.mp4&#10;&#10;OR&#10;&#10;hero.png    2.5 MB&#10;video.mp4   45 MB"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Threshold -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<AppIcon name={'⚙️'} size={16} />
					Size Threshold
				</h3>
				
				<!-- Quick Presets -->
				<div class="flex flex-wrap gap-2 mb-4">
					{#each presets as preset}
						<button
							type="button"
							class="btn btn-xs {threshold === preset.value && thresholdUnit === preset.unit ? 'btn-primary' : 'btn-ghost'}"
							onclick={() => setPreset(preset.value, preset.unit)}
						>
							{preset.label}
						</button>
					{/each}
				</div>
				
				<div class="flex items-center gap-4">
					<input
						type="number"
						bind:value={threshold}
						class="input input-bordered input-sm w-24 rounded-lg"
						min="1"
					/>
					<select bind:value={thresholdUnit} class="select select-bordered select-sm rounded-lg">
						<option value="B">Bytes</option>
						<option value="KB">KB</option>
						<option value="MB">MB</option>
					</select>
					<span class="text-sm text-base-content/50">= {formatSize(thresholdBytes)}</span>
				</div>
			</div>
		</div>

		<!-- Summary -->
		{#if files.length > 0}
			{#if largeFiles.length > 0}
				<div class="card bg-warning/10 border-2 border-warning/30 rounded-2xl">
					<div class="card-body py-4">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
								<AppIcon name={'📦'} size={24} />
							</div>
							<div>
								<h3 class="font-semibold text-warning text-lg">
									{largeFiles.length} Large File{largeFiles.length > 1 ? 's' : ''} Detected
								</h3>
								<p class="text-sm text-base-content/70">
									Total: {formatSize(totalLargeSize)} — Consider using Git LFS
								</p>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="card bg-success/10 border-2 border-success/30 rounded-2xl">
					<div class="card-body py-4">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center shrink-0">
								<svg class="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-success text-lg">All Files Within Limit</h3>
								<p class="text-sm text-base-content/70">No files exceed {formatSize(thresholdBytes)}.</p>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- File List Visualization -->
		{#if files.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4">File Sizes ({files.length} files)</h3>
					<div class="space-y-3 max-h-[400px] overflow-y-auto">
						{#each files as file}
							{@const isLarge = file.sizeBytes >= thresholdBytes}
							<div class="flex items-center gap-3">
								<div class="w-8 shrink-0 text-center">
									{#if isLarge}
										<span class="text-warning">⚠️</span>
									{:else}
										<AppIcon name={'✓'} size={16} />
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-center justify-between gap-2 mb-1">
										<span class="font-mono text-sm truncate">{file.name}</span>
										<span class="text-sm font-semibold shrink-0 {isLarge ? 'text-warning' : ''}">{formatSize(file.sizeBytes)}</span>
									</div>
									<div class="h-2 bg-base-300 rounded-full overflow-hidden">
										<div 
											class="h-full rounded-full transition-all {isLarge ? 'bg-warning' : 'bg-success'}"
											style="width: {getBarWidth(file.sizeBytes)}%"
										></div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Git LFS Recommendation -->
		{#if largeFiles.length > 0}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold flex items-center gap-2">
						<span>💡</span>
						Git LFS Setup
					</h4>
					<div class="space-y-3 mt-3">
						<div>
							<p class="text-xs text-base-content/50 mb-1">1. Install Git LFS</p>
							<div class="flex items-center justify-between gap-2 p-2 bg-base-300/50 rounded-lg">
								<code class="font-mono text-sm">git lfs install</code>
								<CopyButton text="git lfs install" size="xs" />
							</div>
						</div>
						<div>
							<p class="text-xs text-base-content/50 mb-1">2. Add to .gitattributes</p>
							<div class="flex items-center justify-between gap-2 p-2 bg-base-300/50 rounded-lg">
								<pre class="font-mono text-sm flex-1 whitespace-pre-wrap">{gitattributes}</pre>
								<CopyButton text={gitattributes} size="xs" />
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
	</div>
</ToolWrapper>

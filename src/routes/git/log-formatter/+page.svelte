<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['log-formatter'];

	const formatPlaceholders = [
		{ code: '%H', name: 'Full commit hash', example: 'a1b2c3d4e5...', category: 'hash' },
		{ code: '%h', name: 'Abbreviated hash', example: 'a1b2c3d', category: 'hash' },
		{ code: '%an', name: 'Author name', example: 'John Doe', category: 'author' },
		{ code: '%ae', name: 'Author email', example: 'john@example.com', category: 'author' },
		{ code: '%ad', name: 'Author date', example: 'Mon Jan 1 12:00', category: 'date' },
		{ code: '%ar', name: 'Author date (relative)', example: '2 days ago', category: 'date' },
		{ code: '%cn', name: 'Committer name', example: 'Jane Doe', category: 'committer' },
		{ code: '%ce', name: 'Committer email', example: 'jane@example.com', category: 'committer' },
		{ code: '%cd', name: 'Committer date', example: 'Mon Jan 1 12:00', category: 'date' },
		{ code: '%cr', name: 'Committer date (relative)', example: '2 days ago', category: 'date' },
		{ code: '%d', name: 'Ref names (decorated)', example: '(HEAD -> main)', category: 'ref' },
		{ code: '%D', name: 'Ref names (plain)', example: 'HEAD -> main', category: 'ref' },
		{ code: '%s', name: 'Subject (first line)', example: 'feat: add login', category: 'message' },
		{ code: '%b', name: 'Body', example: 'Full commit body...', category: 'message' },
		{ code: '%n', name: 'Newline', example: '\\n', category: 'format' },
		{ code: '%C()', name: 'Color', example: '%C(red)...%C(reset)', category: 'format' }
	];

	const presets = [
		{ name: 'Oneline', icon: '📜', format: '%h %s', description: 'Compact single line' },
		{ name: 'Short', icon: '📝', format: '%h - %s (%ar)', description: 'Hash, subject, date' },
		{ name: 'Medium', icon: '📋', format: '%h - %an, %ar : %s', description: 'With author' },
		{ name: 'Full', icon: '📄', format: 'commit %H%nAuthor: %an <%ae>%nDate:   %ad%n%n    %s%n', description: 'Standard format' },
		{ name: 'Graph', icon: '🌳', format: '%C(bold blue)%h%C(reset) - %C(green)(%ar)%C(reset) %s %C(dim)- %an%C(reset)%C(auto)%d%C(reset)', description: 'Colorful graph' },
		{ name: 'Changelog', icon: '📰', format: '- %s (%h) by %an', description: 'Release notes style' }
	];

	const dateFormats = [
		{ id: 'default', name: 'Default', flag: '' },
		{ id: 'relative', name: 'Relative', flag: '--date=relative' },
		{ id: 'short', name: 'Short', flag: '--date=short' },
		{ id: 'iso', name: 'ISO 8601', flag: '--date=iso' },
		{ id: 'human', name: 'Human', flag: '--date=human' }
	];

	const additionalOptions = [
		{ id: 'all', flag: '--all', name: 'All branches' },
		{ id: 'no-merges', flag: '--no-merges', name: 'No merges' },
		{ id: 'first-parent', flag: '--first-parent', name: 'First parent only' },
		{ id: 'reverse', flag: '--reverse', name: 'Reverse order' }
	];

	let customFormat = $state('%h - %s (%ar)');
	let selectedPreset = $state<string | null>(null);
	let dateFormat = $state('default');
	let limit = $state(10);
	let showGraph = $state(false);
	let oneline = $state(false);
	let selectedOptions = $state<Set<string>>(new Set());
	let authorFilter = $state('');
	let sinceDate = $state('');

	const activeFormat = $derived(selectedPreset 
		? presets.find(p => p.name === selectedPreset)?.format || customFormat
		: customFormat);

	let command = $derived.by(() => {
		let cmd = 'git log';
		
		if (showGraph) cmd += ' --graph';
		if (oneline) cmd += ' --oneline';
		
		const dateFmt = dateFormats.find(d => d.id === dateFormat);
		if (dateFmt?.flag) cmd += ' ' + dateFmt.flag;
		
		selectedOptions.forEach(opt => {
			const option = additionalOptions.find(o => o.id === opt);
			if (option) cmd += ' ' + option.flag;
		});
		
		if (authorFilter.trim()) cmd += ` --author="${authorFilter.trim()}"`;
		if (sinceDate.trim()) cmd += ` --since="${sinceDate.trim()}"`;
		if (limit > 0) cmd += ` -n ${limit}`;
		
		if (!oneline) {
			cmd += ` --pretty=format:"${activeFormat}"`;
		}
		
		return cmd;
	});

	// Example output simulation
	let exampleOutput = $derived.by(() => {
		const examples = [
			{ h: 'a1b2c3d', H: 'a1b2c3d4e5f6g7h8i9j0', an: 'John Doe', ae: 'john@example.com', ar: '2 hours ago', ad: 'Mon Jan 20 14:30:00 2025 +0530', s: 'feat: add OAuth2 login', d: '(HEAD -> main)', D: 'HEAD -> main' },
			{ h: 'b2c3d4e', H: 'b2c3d4e5f6g7h8i9j0k1', an: 'Jane Smith', ae: 'jane@example.com', ar: '1 day ago', ad: 'Sun Jan 19 10:15:00 2025 +0530', s: 'fix: auth token expiry', d: '', D: '' },
			{ h: 'c3d4e5f', H: 'c3d4e5f6g7h8i9j0k1l2', an: 'Bob Wilson', ae: 'bob@example.com', ar: '3 days ago', ad: 'Fri Jan 17 16:45:00 2025 +0530', s: 'docs: update README', d: '', D: '' }
		];
		
		return examples.slice(0, Math.min(limit, 3)).map(ex => {
			let line = activeFormat;
			line = line.replace(/%H/g, ex.H);
			line = line.replace(/%h/g, ex.h);
			line = line.replace(/%an/g, ex.an);
			line = line.replace(/%ae/g, ex.ae);
			line = line.replace(/%ar/g, ex.ar);
			line = line.replace(/%ad/g, ex.ad);
			line = line.replace(/%s/g, ex.s);
			line = line.replace(/%d/g, ex.d);
			line = line.replace(/%D/g, ex.D);
			line = line.replace(/%n/g, '\n');
			line = line.replace(/%C\([^)]+\)/g, '');
			return line;
		}).join('\n');
	});

	function selectPreset(name: string) {
		selectedPreset = name;
		const preset = presets.find(p => p.name === name);
		if (preset) customFormat = preset.format;
	}

	function insertPlaceholder(code: string) {
		// Insert at cursor position or replace current format (not append)
		customFormat = code;
		selectedPreset = null;
	}

	function appendPlaceholder(code: string) {
		customFormat += code;
		selectedPreset = null;
	}

	function loadSample() {
		selectPreset('Graph');
		showGraph = true;
	}

	function clearAll() {
		customFormat = '%h - %s (%ar)';
		selectedPreset = null;
		dateFormat = 'default';
		limit = 10;
		showGraph = false;
		oneline = false;
		selectedOptions = new Set();
		authorFilter = '';
		sinceDate = '';
	}

	function toggleOption(id: string) {
		const newSet = new Set(selectedOptions);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedOptions = newSet;
	}

	const categories = [
		{ id: 'hash', name: 'Hash' },
		{ id: 'author', name: 'Author' },
		{ id: 'date', name: 'Date' },
		{ id: 'message', name: 'Message' },
		{ id: 'ref', name: 'Refs' },
		{ id: 'format', name: 'Formatting' }
	];
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={command} />

		<!-- Presets -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-3 flex items-center gap-2">
				<span>⚡</span>
				Quick Presets
			</h3>
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
				{#each presets as preset}
					<button
						type="button"
						class="flex flex-col items-center p-3 rounded-xl border-2 transition-all {selectedPreset === preset.name ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'}"
						onclick={() => selectPreset(preset.name)}
					>
						<span class="text-xl mb-1">{preset.icon}</span>
						<span class="text-xs font-semibold">{preset.name}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Custom Format Builder -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Format Builder (click to SET, double-click to APPEND)</h4>
				
				{#each categories as cat}
					<div class="mb-3">
						<span class="text-xs text-base-content/50 mb-1 block">{cat.name}</span>
						<div class="flex flex-wrap gap-1">
							{#each formatPlaceholders.filter(p => p.category === cat.id) as ph}
								<button
									type="button"
									class="btn btn-xs gap-1 font-mono {customFormat.includes(ph.code) ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => insertPlaceholder(ph.code)}
									ondblclick={() => appendPlaceholder(ph.code)}
									title={`${ph.name}: ${ph.example}\nClick to replace, double-click to append`}
								>
									{ph.code}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Current Format -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Current Format String</h3>
				<button type="button" class="btn btn-xs btn-ghost" onclick={() => customFormat = ''}>Clear</button>
			</div>
			<textarea
				bind:value={customFormat}
				oninput={() => selectedPreset = null}
				placeholder="Enter format string..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-16"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Options -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Options</h4>
				<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label class="text-xs text-base-content/70 mb-1 block">Date Format</label>
						<select bind:value={dateFormat} class="select select-bordered w-full rounded-lg select-sm">
							{#each dateFormats as df}
								<option value={df.id}>{df.name}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="text-xs text-base-content/70 mb-1 block">Limit</label>
						<input type="number" bind:value={limit} min="0" max="1000" class="input input-bordered w-full rounded-lg input-sm" />
					</div>
					<div>
						<label class="text-xs text-base-content/70 mb-1 block">Author Filter</label>
						<input type="text" bind:value={authorFilter} placeholder="name or email" class="input input-bordered w-full rounded-lg input-sm" />
					</div>
					<div>
						<label class="text-xs text-base-content/70 mb-1 block">Since Date</label>
						<input type="text" bind:value={sinceDate} placeholder="2024-01-01" class="input input-bordered w-full rounded-lg input-sm" />
					</div>
				</div>
				
				<div class="flex flex-wrap gap-3 mt-4 pt-3 border-t border-base-300">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={showGraph} class="checkbox checkbox-sm checkbox-primary" />
						<span class="text-sm">--graph</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={oneline} class="checkbox checkbox-sm checkbox-primary" />
						<span class="text-sm">--oneline</span>
					</label>
					{#each additionalOptions as opt}
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" checked={selectedOptions.has(opt.id)} onchange={() => toggleOption(opt.id)} class="checkbox checkbox-sm" />
							<span class="text-sm">{opt.flag}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Command Output -->
		<div class="card bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl border-2 border-success/30">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<span>⌨️</span>
						Git Command
					</h3>
					<CopyButton text={command} label="Copy" size="sm" />
				</div>
				<code class="block font-mono text-sm p-4 bg-base-300/50 rounded-xl break-all whitespace-pre-wrap">
					{command}
				</code>
			</div>
		</div>

		<!-- Example Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<span>👁️</span>
					Example Output
				</h3>
				<pre class="font-mono text-sm p-4 bg-base-300/50 rounded-xl whitespace-pre-wrap">{exampleOutput}</pre>
			</div>
		</div>
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

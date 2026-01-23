<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let searchQuery = $state('');
	let activeCategory = $state<string | null>(null);

	// Favorites stored in localStorage
	let favorites = $state<Set<string>>(new Set());

	// Load favorites on mount
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('regex-cheatsheet-favorites');
			if (saved) {
				favorites = new Set(JSON.parse(saved));
			}
		}
	});

	function toggleFavorite(pattern: string) {
		const newFavorites = new Set(favorites);
		if (newFavorites.has(pattern)) {
			newFavorites.delete(pattern);
		} else {
			newFavorites.add(pattern);
		}
		favorites = newFavorites;
		if (browser) {
			localStorage.setItem('regex-cheatsheet-favorites', JSON.stringify([...newFavorites]));
		}
	}

	// Cheat sheet data
	const characterClasses = [
		{ pattern: '.', description: 'Any character except newline', example: 'a.c → abc, aXc' },
		{ pattern: '\\d', description: 'Any digit (0-9)', example: '\\d+ → 123, 4567' },
		{ pattern: '\\D', description: 'Any non-digit', example: '\\D+ → abc, $#!' },
		{ pattern: '\\w', description: 'Word character (a-z, A-Z, 0-9, _)', example: '\\w+ → hello_123' },
		{ pattern: '\\W', description: 'Non-word character', example: '\\W+ → @#$, -!?' },
		{ pattern: '\\s', description: 'Whitespace (space, tab, newline)', example: 'a\\sb → a b, a\\tb' },
		{ pattern: '\\S', description: 'Non-whitespace character', example: '\\S+ → hello, 123' },
		{ pattern: '[abc]', description: 'Any character in the set', example: '[aeiou] → a, e, i' },
		{ pattern: '[^abc]', description: 'Any character NOT in the set', example: '[^0-9] → a, b, c' },
		{ pattern: '[a-z]', description: 'Character range', example: '[A-Za-z] → a, B, z' }
	];

	const quantifiers = [
		{ pattern: '*', description: 'Match 0 or more times', example: 'ab*c → ac, abc, abbc' },
		{ pattern: '+', description: 'Match 1 or more times', example: 'ab+c → abc, abbc' },
		{ pattern: '?', description: 'Match 0 or 1 time (optional)', example: 'colou?r → color, colour' },
		{ pattern: '{n}', description: 'Match exactly n times', example: '\\d{4} → 2024, 1999' },
		{ pattern: '{n,}', description: 'Match n or more times', example: '\\w{3,} → abc, hello' },
		{ pattern: '{n,m}', description: 'Match between n and m times', example: '\\d{2,4} → 12, 123, 1234' },
		{ pattern: '*?', description: 'Lazy * (match as few as possible)', example: '".*?" → "a", "b"' },
		{ pattern: '+?', description: 'Lazy + (match as few as possible)', example: '<.+?> → <a>, <br>' }
	];

	const anchors = [
		{ pattern: '^', description: 'Start of string (or line with m flag)', example: '^Hello → "Hello World"' },
		{ pattern: '$', description: 'End of string (or line with m flag)', example: 'end$ → "the end"' },
		{ pattern: '\\b', description: 'Word boundary', example: '\\bcat\\b → "cat", not "cats"' },
		{ pattern: '\\B', description: 'Non-word boundary', example: '\\Bcat → "cats", not "cat"' }
	];

	const groups = [
		{ pattern: '(...)', description: 'Capturing group', example: '(\\d{3})-(\\d{4}) → $1-$2' },
		{ pattern: '(?:...)', description: 'Non-capturing group', example: '(?:http|https):// → groups without capturing' },
		{ pattern: '(?<name>...)', description: 'Named capturing group', example: '(?<year>\\d{4}) → $<year>' },
		{ pattern: '\\1, \\2', description: 'Back-reference to group 1, 2', example: '(\\w)\\1 → aa, bb' },
		{ pattern: '(?=...)', description: 'Positive lookahead', example: '\\d(?=px) → 5 in "5px"' },
		{ pattern: '(?!...)', description: 'Negative lookahead', example: '\\d(?!px) → 5 in "5em"' },
		{ pattern: '(?<=...)', description: 'Positive lookbehind', example: '(?<=\\$)\\d+ → 100 in "$100"' },
		{ pattern: '(?<!...)', description: 'Negative lookbehind', example: '(?<!\\$)\\d+ → 100 in "€100"' },
		{ pattern: '|', description: 'Alternation (OR)', example: 'cat|dog → cat, dog' }
	];

	const flags = [
		{ flag: 'g', name: 'Global', description: 'Find all matches, not just the first', icon: '🌐' },
		{ flag: 'i', name: 'Case Insensitive', description: 'Match both upper and lowercase', icon: '🔤' },
		{ flag: 'm', name: 'Multiline', description: '^ and $ match line start/end, not just string start/end', icon: '📝' },
		{ flag: 's', name: 'Dotall', description: '. matches newline characters too', icon: '⏎' },
		{ flag: 'u', name: 'Unicode', description: 'Enable full Unicode support', icon: '🌍' },
		{ flag: 'y', name: 'Sticky', description: 'Match only at lastIndex position', icon: '📍' }
	];

	const commonPatterns = [
		{ name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Basic email validation', icon: '📧' },
		{ name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./-]*)?', description: 'HTTP/HTTPS URLs', icon: '🔗' },
		{ name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', description: 'US phone numbers', icon: '📱' },
		{ name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', description: 'ISO date format', icon: '📅' },
		{ name: 'Date (MM/DD/YYYY)', pattern: '(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])/\\d{4}', description: 'US date format', icon: '📆' },
		{ name: 'Time (24h)', pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?', description: '24-hour time', icon: '🕐' },
		{ name: 'IP Address', pattern: '(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)', description: 'IPv4 address', icon: '🌐' },
		{ name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}', description: 'Hex color codes (#fff, #ffffff)', icon: '🎨' },
		{ name: 'Username', pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,19}$', description: 'Username: 3-20 chars, starts with letter', icon: '👤' },
		{ name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, upper, lower, digit, special', icon: '🔒' },
		{ name: 'Credit Card', pattern: '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}', description: 'Credit card number format', icon: '💳' },
		{ name: 'Zip Code (US)', pattern: '\\d{5}(?:-\\d{4})?', description: 'US zip code (12345 or 12345-6789)', icon: '📮' }
	];

	// Categories for navigation
	const categories = [
		{ id: 'classes', name: 'Character Classes', icon: '🔤', color: 'from-success/20 to-success/10' },
		{ id: 'quantifiers', name: 'Quantifiers', icon: '🔢', color: 'from-warning/20 to-warning/10' },
		{ id: 'anchors', name: 'Anchors', icon: '⚓', color: 'from-info/20 to-info/10' },
		{ id: 'groups', name: 'Groups', icon: '📦', color: 'from-primary/20 to-primary/10' },
		{ id: 'flags', name: 'Flags', icon: '🚩', color: 'from-accent/20 to-accent/10' },
		{ id: 'common', name: 'Common Patterns', icon: '⭐', color: 'from-secondary/20 to-secondary/10' }
	];

	function tryInTester(pattern: string) {
		goto(`/regex/tester?p=${encodeURIComponent(pattern)}`);
	}

	function explainPattern(pattern: string) {
		goto(`/regex/explainer?p=${encodeURIComponent(pattern)}`);
	}

	// Filter all items based on search
	let filteredCharacterClasses = $derived(
		characterClasses.filter(item => 
			searchQuery === '' || 
			item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredQuantifiers = $derived(
		quantifiers.filter(item => 
			searchQuery === '' || 
			item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredAnchors = $derived(
		anchors.filter(item => 
			searchQuery === '' || 
			item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredGroups = $derived(
		groups.filter(item => 
			searchQuery === '' || 
			item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredFlags = $derived(
		flags.filter(item => 
			searchQuery === '' || 
			item.flag.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let filteredCommonPatterns = $derived(
		commonPatterns.filter(item => 
			searchQuery === '' || 
			item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
			item.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	let totalResults = $derived(
		filteredCharacterClasses.length + 
		filteredQuantifiers.length + 
		filteredAnchors.length + 
		filteredGroups.length + 
		filteredFlags.length + 
		filteredCommonPatterns.length
	);

	function scrollToCategory(id: string) {
		activeCategory = id;
		const element = document.getElementById(`category-${id}`);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	function shouldShowCategory(id: string): boolean {
		if (activeCategory && activeCategory !== id) return false;
		if (searchQuery) {
			switch (id) {
				case 'classes': return filteredCharacterClasses.length > 0;
				case 'quantifiers': return filteredQuantifiers.length > 0;
				case 'anchors': return filteredAnchors.length > 0;
				case 'groups': return filteredGroups.length > 0;
				case 'flags': return filteredFlags.length > 0;
				case 'common': return filteredCommonPatterns.length > 0;
			}
		}
		return true;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Search & Filters -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
			<div class="card-body py-4">
				<div class="flex flex-col sm:flex-row gap-4">
					<!-- Search -->
					<div class="flex-1">
						<div class="relative">
							<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							<input
								type="text"
								bind:value={searchQuery}
								placeholder="Search patterns, descriptions..."
								class="input input-bordered w-full pl-10 rounded-xl"
							/>
							{#if searchQuery}
								<button 
									class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
									onclick={() => searchQuery = ''}
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							{/if}
						</div>
						{#if searchQuery}
							<p class="text-xs text-base-content/50 mt-1">{totalResults} results found</p>
						{/if}
					</div>
					
					<!-- Category Filter -->
					<div class="flex items-center gap-2">
						<button 
							class="btn btn-sm"
							class:btn-primary={!activeCategory}
							onclick={() => activeCategory = null}
						>
							All
						</button>
						{#if activeCategory}
							<button 
								class="btn btn-sm btn-ghost gap-1"
								onclick={() => activeCategory = null}
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
								Clear filter
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Category Navigation -->
		<div class="flex flex-wrap gap-2">
			{#each categories as cat}
				<button 
					class="btn btn-sm gap-1 transition-all"
					class:btn-primary={activeCategory === cat.id}
					class:btn-outline={activeCategory !== cat.id}
					onclick={() => scrollToCategory(cat.id)}
				>
					<span>{cat.icon}</span>
					{cat.name}
				</button>
			{/each}
		</div>

		<!-- Character Classes -->
		{#if shouldShowCategory('classes')}
			<section id="category-classes">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-success/20 to-success/10 flex items-center justify-center text-xl">🔤</span>
					Character Classes
				</h2>
				<div class="overflow-x-auto">
					<table class="table table-sm bg-base-200 rounded-xl">
						<thead>
							<tr>
								<th class="w-24">Pattern</th>
								<th>Description</th>
								<th class="hidden sm:table-cell">Example</th>
								<th class="w-24"></th>
							</tr>
						</thead>
						<tbody>
							{#each filteredCharacterClasses as item}
								<tr class="hover group">
									<td class="font-mono">
										<code class="bg-success/20 px-2 py-0.5 rounded text-success font-bold">{item.pattern}</code>
									</td>
									<td class="text-sm">{item.description}</td>
									<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
									<td>
										<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button 
												class="btn btn-ghost btn-xs"
												title="Try in Tester"
												onclick={() => tryInTester(item.pattern)}
											>
												🧪
											</button>
											<CopyButton text={item.pattern} size="xs" />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<!-- Quantifiers -->
		{#if shouldShowCategory('quantifiers')}
			<section id="category-quantifiers">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center text-xl">🔢</span>
					Quantifiers
				</h2>
				<div class="overflow-x-auto">
					<table class="table table-sm bg-base-200 rounded-xl">
						<thead>
							<tr>
								<th class="w-24">Pattern</th>
								<th>Description</th>
								<th class="hidden sm:table-cell">Example</th>
								<th class="w-24"></th>
							</tr>
						</thead>
						<tbody>
							{#each filteredQuantifiers as item}
								<tr class="hover group">
									<td class="font-mono">
										<code class="bg-warning/20 px-2 py-0.5 rounded text-warning font-bold">{item.pattern}</code>
									</td>
									<td class="text-sm">{item.description}</td>
									<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
									<td>
										<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<CopyButton text={item.pattern} size="xs" />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<!-- Anchors -->
		{#if shouldShowCategory('anchors')}
			<section id="category-anchors">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-info/20 to-info/10 flex items-center justify-center text-xl">⚓</span>
					Anchors
				</h2>
				<div class="overflow-x-auto">
					<table class="table table-sm bg-base-200 rounded-xl">
						<thead>
							<tr>
								<th class="w-24">Pattern</th>
								<th>Description</th>
								<th class="hidden sm:table-cell">Example</th>
								<th class="w-24"></th>
							</tr>
						</thead>
						<tbody>
							{#each filteredAnchors as item}
								<tr class="hover group">
									<td class="font-mono">
										<code class="bg-info/20 px-2 py-0.5 rounded text-info font-bold">{item.pattern}</code>
									</td>
									<td class="text-sm">{item.description}</td>
									<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
									<td>
										<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<button 
												class="btn btn-ghost btn-xs"
												title="Try in Tester"
												onclick={() => tryInTester(item.pattern)}
											>
												🧪
											</button>
											<CopyButton text={item.pattern} size="xs" />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<!-- Groups & Lookarounds -->
		{#if shouldShowCategory('groups')}
			<section id="category-groups">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-xl">📦</span>
					Groups & Lookarounds
				</h2>
				<div class="overflow-x-auto">
					<table class="table table-sm bg-base-200 rounded-xl">
						<thead>
							<tr>
								<th class="w-32">Pattern</th>
								<th>Description</th>
								<th class="hidden sm:table-cell">Example</th>
								<th class="w-24"></th>
							</tr>
						</thead>
						<tbody>
							{#each filteredGroups as item}
								<tr class="hover group">
									<td class="font-mono">
										<code class="bg-primary/20 px-2 py-0.5 rounded text-primary font-bold">{item.pattern}</code>
									</td>
									<td class="text-sm">{item.description}</td>
									<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
									<td>
										<div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
											<CopyButton text={item.pattern} size="xs" />
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</section>
		{/if}

		<!-- Flags -->
		{#if shouldShowCategory('flags')}
			<section id="category-flags">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center text-xl">🚩</span>
					Flags
				</h2>
				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
					{#each filteredFlags as item}
						<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-4 hover:shadow-lg transition-all group">
							<div class="flex items-center gap-3 mb-2">
								<span class="text-2xl">{item.icon}</span>
								<div class="flex items-center gap-2">
									<code class="text-xl font-mono font-bold text-accent">{item.flag}</code>
									<span class="font-semibold">{item.name}</span>
								</div>
							</div>
							<p class="text-sm text-base-content/70">{item.description}</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Common Patterns -->
		{#if shouldShowCategory('common')}
			<section id="category-common">
				<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center text-xl">⭐</span>
					Common Patterns
				</h2>
				<div class="grid gap-3">
					{#each filteredCommonPatterns as item}
						<div class="card bg-gradient-to-r from-base-200 via-base-200 to-base-300 rounded-xl p-4 hover:shadow-lg transition-all group">
							<div class="flex flex-wrap items-start justify-between gap-3">
								<div class="flex-1 min-w-0">
									<div class="flex items-center gap-2 mb-2">
										<span class="text-xl">{item.icon}</span>
										<span class="font-semibold">{item.name}</span>
										<span class="text-xs text-base-content/50">{item.description}</span>
										<button 
											class="btn btn-ghost btn-xs"
											class:text-warning={favorites.has(item.pattern)}
											onclick={() => toggleFavorite(item.pattern)}
											title={favorites.has(item.pattern) ? 'Remove from favorites' : 'Add to favorites'}
										>
											{favorites.has(item.pattern) ? '⭐' : '☆'}
										</button>
									</div>
									<code class="block font-mono text-sm bg-base-100 p-3 rounded-lg break-all border border-base-300">
										{item.pattern}
									</code>
								</div>
								<div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
									<button 
										class="btn btn-sm btn-outline gap-1"
										onclick={() => tryInTester(item.pattern)}
									>
										🧪 Try
									</button>
									<button 
										class="btn btn-sm btn-outline gap-1"
										onclick={() => explainPattern(item.pattern)}
									>
										📖 Explain
									</button>
									<CopyButton text={item.pattern} size="sm" />
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Quick Tips -->
		<section class="card bg-gradient-to-r from-primary/10 via-base-200 to-secondary/10 rounded-xl border border-primary/20">
			<div class="card-body py-4">
				<h2 class="text-lg font-bold flex items-center gap-2">
					<span>💡</span> Quick Tips
				</h2>
				<ul class="mt-2 space-y-3 text-sm text-base-content/80">
					<li class="flex items-start gap-3 p-2 bg-base-100 rounded-lg">
						<span class="text-primary text-lg">1</span>
						<span>Always escape special characters with <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">\\</code> when matching literals: <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">\\.</code> <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">\\*</code> <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">\\?</code></span>
					</li>
					<li class="flex items-start gap-3 p-2 bg-base-100 rounded-lg">
						<span class="text-primary text-lg">2</span>
						<span>Use non-capturing groups <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">(?:...)</code> for grouping without capturing</span>
					</li>
					<li class="flex items-start gap-3 p-2 bg-base-100 rounded-lg">
						<span class="text-primary text-lg">3</span>
						<span>Prefer lazy quantifiers <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">*?</code> <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">+?</code> when matching content between delimiters</span>
					</li>
					<li class="flex items-start gap-3 p-2 bg-base-100 rounded-lg">
						<span class="text-primary text-lg">4</span>
						<span>Test your regex with a variety of inputs including edge cases</span>
					</li>
					<li class="flex items-start gap-3 p-2 bg-base-100 rounded-lg">
						<span class="text-primary text-lg">5</span>
						<span>Use <code class="bg-base-300 px-1.5 py-0.5 rounded font-mono">\\b</code> word boundaries to match whole words only</span>
					</li>
				</ul>
			</div>
		</section>
	</div>
</ToolWrapper>

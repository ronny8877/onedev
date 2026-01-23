<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

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
		{ flag: 'g', name: 'Global', description: 'Find all matches, not just the first' },
		{ flag: 'i', name: 'Case Insensitive', description: 'Match both upper and lowercase' },
		{ flag: 'm', name: 'Multiline', description: '^ and $ match line start/end, not just string start/end' },
		{ flag: 's', name: 'Dotall', description: '. matches newline characters too' },
		{ flag: 'u', name: 'Unicode', description: 'Enable full Unicode support' },
		{ flag: 'y', name: 'Sticky', description: 'Match only at lastIndex position' }
	];

	const commonPatterns = [
		{ name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', description: 'Basic email validation' },
		{ name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./-]*)?', description: 'HTTP/HTTPS URLs' },
		{ name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}', description: 'US phone numbers' },
		{ name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', description: 'ISO date format' },
		{ name: 'Date (MM/DD/YYYY)', pattern: '(?:0[1-9]|1[0-2])/(?:0[1-9]|[12]\\d|3[01])/\\d{4}', description: 'US date format' },
		{ name: 'Time (24h)', pattern: '(?:[01]\\d|2[0-3]):[0-5]\\d(?::[0-5]\\d)?', description: '24-hour time' },
		{ name: 'IP Address', pattern: '(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)', description: 'IPv4 address' },
		{ name: 'Hex Color', pattern: '#(?:[0-9a-fA-F]{3}){1,2}', description: 'Hex color codes (#fff, #ffffff)' },
		{ name: 'Username', pattern: '^[a-zA-Z][a-zA-Z0-9_]{2,19}$', description: 'Username: 3-20 chars, starts with letter' },
		{ name: 'Strong Password', pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', description: 'Min 8 chars, upper, lower, digit, special' },
		{ name: 'Credit Card', pattern: '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}', description: 'Credit card number format' },
		{ name: 'Zip Code (US)', pattern: '\\d{5}(?:-\\d{4})?', description: 'US zip code (12345 or 12345-6789)' }
	];

	let copiedPattern = $state<string | null>(null);
	
	function handleCopy(pattern: string) {
		copiedPattern = pattern;
		setTimeout(() => copiedPattern = null, 2000);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-8">
		<!-- Character Classes -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">🔤</span>
				Character Classes
			</h2>
			<div class="overflow-x-auto">
				<table class="table table-sm bg-base-200 rounded-xl">
					<thead>
						<tr>
							<th class="w-24">Pattern</th>
							<th>Description</th>
							<th class="hidden sm:table-cell">Example</th>
							<th class="w-12"></th>
						</tr>
					</thead>
					<tbody>
						{#each characterClasses as item}
							<tr class="hover">
								<td class="font-mono">
									<code class="bg-base-300 px-2 py-0.5 rounded text-success">{item.pattern}</code>
								</td>
								<td class="text-sm">{item.description}</td>
								<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
								<td>
									<CopyButton text={item.pattern} size="xs" onclick={() => handleCopy(item.pattern)} />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Quantifiers -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">🔢</span>
				Quantifiers
			</h2>
			<div class="overflow-x-auto">
				<table class="table table-sm bg-base-200 rounded-xl">
					<thead>
						<tr>
							<th class="w-24">Pattern</th>
							<th>Description</th>
							<th class="hidden sm:table-cell">Example</th>
							<th class="w-12"></th>
						</tr>
					</thead>
					<tbody>
						{#each quantifiers as item}
							<tr class="hover">
								<td class="font-mono">
									<code class="bg-base-300 px-2 py-0.5 rounded text-warning">{item.pattern}</code>
								</td>
								<td class="text-sm">{item.description}</td>
								<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
								<td>
									<CopyButton text={item.pattern} size="xs" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Anchors -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">⚓</span>
				Anchors
			</h2>
			<div class="overflow-x-auto">
				<table class="table table-sm bg-base-200 rounded-xl">
					<thead>
						<tr>
							<th class="w-24">Pattern</th>
							<th>Description</th>
							<th class="hidden sm:table-cell">Example</th>
							<th class="w-12"></th>
						</tr>
					</thead>
					<tbody>
						{#each anchors as item}
							<tr class="hover">
								<td class="font-mono">
									<code class="bg-base-300 px-2 py-0.5 rounded text-info">{item.pattern}</code>
								</td>
								<td class="text-sm">{item.description}</td>
								<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
								<td>
									<CopyButton text={item.pattern} size="xs" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Groups & Lookarounds -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">📦</span>
				Groups & Lookarounds
			</h2>
			<div class="overflow-x-auto">
				<table class="table table-sm bg-base-200 rounded-xl">
					<thead>
						<tr>
							<th class="w-32">Pattern</th>
							<th>Description</th>
							<th class="hidden sm:table-cell">Example</th>
							<th class="w-12"></th>
						</tr>
					</thead>
					<tbody>
						{#each groups as item}
							<tr class="hover">
								<td class="font-mono">
									<code class="bg-base-300 px-2 py-0.5 rounded text-primary">{item.pattern}</code>
								</td>
								<td class="text-sm">{item.description}</td>
								<td class="font-mono text-xs text-base-content/60 hidden sm:table-cell">{item.example}</td>
								<td>
									<CopyButton text={item.pattern} size="xs" />
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		<!-- Flags -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">🚩</span>
				Flags
			</h2>
			<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
				{#each flags as item}
					<div class="card bg-base-200 rounded-xl p-4">
						<div class="flex items-center gap-3 mb-2">
							<code class="text-xl font-mono font-bold text-accent">{item.flag}</code>
							<span class="font-semibold">{item.name}</span>
						</div>
						<p class="text-sm text-base-content/70">{item.description}</p>
					</div>
				{/each}
			</div>
		</section>

		<!-- Common Patterns -->
		<section>
			<h2 class="text-xl font-bold mb-4 flex items-center gap-2">
				<span class="text-2xl">⭐</span>
				Common Patterns
			</h2>
			<div class="grid gap-3">
				{#each commonPatterns as item}
					<div class="card bg-base-200 rounded-xl p-4">
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2 mb-2">
									<span class="font-semibold">{item.name}</span>
									<span class="text-xs text-base-content/50">{item.description}</span>
								</div>
								<code class="block font-mono text-sm bg-base-300 p-2 rounded-lg break-all">
									{item.pattern}
								</code>
							</div>
							<CopyButton text={item.pattern} size="sm" />
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Quick Tips -->
		<section class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h2 class="text-lg font-bold">💡 Quick Tips</h2>
				<ul class="mt-2 space-y-2 text-sm text-base-content/80">
					<li>• Always escape special characters with <code class="bg-base-300 px-1 rounded">\\</code> when matching literals: <code class="bg-base-300 px-1 rounded">\\.</code> <code class="bg-base-300 px-1 rounded">\\*</code> <code class="bg-base-300 px-1 rounded">\\?</code></li>
					<li>• Use non-capturing groups <code class="bg-base-300 px-1 rounded">(?:...)</code> for grouping without capturing</li>
					<li>• Prefer lazy quantifiers <code class="bg-base-300 px-1 rounded">*?</code> <code class="bg-base-300 px-1 rounded">+?</code> when matching content between delimiters</li>
					<li>• Test your regex with a variety of inputs including edge cases</li>
					<li>• Use <code class="bg-base-300 px-1 rounded">\\b</code> word boundaries to match whole words only</li>
				</ul>
			</div>
		</section>
	</div>
</ToolWrapper>

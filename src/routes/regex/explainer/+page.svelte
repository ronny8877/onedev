<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	let pattern = $state('');
	let hoveredToken = $state<number | null>(null);

	const samplePattern = '^\\d{3}-\\d{4}$';

	interface Token {
		text: string;
		type: string;
		explanation: string;
		start: number;
		end: number;
	}

	// Token type colors
	const tokenColors: Record<string, string> = {
		literal: 'bg-base-300 text-base-content',
		anchor: 'bg-info/30 text-info-content',
		quantifier: 'bg-warning/30 text-warning-content',
		class: 'bg-success/30 text-success-content',
		group: 'bg-primary/30 text-primary-content',
		escape: 'bg-secondary/30 text-secondary-content',
		alternation: 'bg-accent/30 text-accent-content',
		lookaround: 'bg-error/30 text-error-content'
	};

	let tokens = $derived.by(() => {
		if (!pattern) return [];
		
		const result: Token[] = [];
		let i = 0;
		
		while (i < pattern.length) {
			const char = pattern[i];
			const start = i;
			
			// Check for escape sequences
			if (char === '\\' && i + 1 < pattern.length) {
				const nextChar = pattern[i + 1];
				const escapeMap: Record<string, { type: string; explanation: string }> = {
					'd': { type: 'class', explanation: 'Matches any digit (0-9)' },
					'D': { type: 'class', explanation: 'Matches any non-digit' },
					'w': { type: 'class', explanation: 'Matches any word character (a-z, A-Z, 0-9, _)' },
					'W': { type: 'class', explanation: 'Matches any non-word character' },
					's': { type: 'class', explanation: 'Matches any whitespace (space, tab, newline)' },
					'S': { type: 'class', explanation: 'Matches any non-whitespace' },
					'b': { type: 'anchor', explanation: 'Matches a word boundary' },
					'B': { type: 'anchor', explanation: 'Matches a non-word boundary' },
					'n': { type: 'escape', explanation: 'Matches a newline character' },
					't': { type: 'escape', explanation: 'Matches a tab character' },
					'r': { type: 'escape', explanation: 'Matches a carriage return' },
					'.': { type: 'escape', explanation: 'Matches a literal dot (.)' },
					'*': { type: 'escape', explanation: 'Matches a literal asterisk (*)' },
					'+': { type: 'escape', explanation: 'Matches a literal plus (+)' },
					'?': { type: 'escape', explanation: 'Matches a literal question mark (?)' },
					'^': { type: 'escape', explanation: 'Matches a literal caret (^)' },
					'$': { type: 'escape', explanation: 'Matches a literal dollar sign ($)' },
					'\\': { type: 'escape', explanation: 'Matches a literal backslash (\\)' },
					'[': { type: 'escape', explanation: 'Matches a literal opening bracket ([)' },
					']': { type: 'escape', explanation: 'Matches a literal closing bracket (])' },
					'(': { type: 'escape', explanation: 'Matches a literal opening parenthesis (()' },
					')': { type: 'escape', explanation: 'Matches a literal closing parenthesis ())' },
					'{': { type: 'escape', explanation: 'Matches a literal opening brace ({)' },
					'}': { type: 'escape', explanation: 'Matches a literal closing brace (})' },
					'|': { type: 'escape', explanation: 'Matches a literal pipe (|)' }
				};
				
				if (escapeMap[nextChar]) {
					result.push({
						text: `\\${nextChar}`,
						...escapeMap[nextChar],
						start,
						end: i + 2
					});
					i += 2;
					continue;
				} else if (/\d/.test(nextChar)) {
					result.push({
						text: `\\${nextChar}`,
						type: 'group',
						explanation: `Back-reference to capture group ${nextChar}`,
						start,
						end: i + 2
					});
					i += 2;
					continue;
				}
			}
			
			// Anchors
			if (char === '^') {
				result.push({ text: '^', type: 'anchor', explanation: 'Matches the start of the string (or line in multiline mode)', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '$') {
				result.push({ text: '$', type: 'anchor', explanation: 'Matches the end of the string (or line in multiline mode)', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Quantifiers
			if (char === '*') {
				result.push({ text: '*', type: 'quantifier', explanation: 'Matches 0 or more of the preceding token', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '+') {
				result.push({ text: '+', type: 'quantifier', explanation: 'Matches 1 or more of the preceding token', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '?') {
				result.push({ text: '?', type: 'quantifier', explanation: 'Matches 0 or 1 of the preceding token (optional)', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Quantifier range {n,m}
			if (char === '{') {
				const rangeMatch = pattern.slice(i).match(/^\{(\d+)(,(\d+)?)?\}/);
				if (rangeMatch) {
					const [full, min, comma, max] = rangeMatch;
					let explanation = '';
					if (comma === undefined) {
						explanation = `Matches exactly ${min} of the preceding token`;
					} else if (max === undefined) {
						explanation = `Matches ${min} or more of the preceding token`;
					} else {
						explanation = `Matches between ${min} and ${max} of the preceding token`;
					}
					result.push({ text: full, type: 'quantifier', explanation, start, end: i + full.length });
					i += full.length;
					continue;
				}
			}
			
			// Character class [...]
			if (char === '[') {
				let j = i + 1;
				let negated = false;
				if (pattern[j] === '^') {
					negated = true;
					j++;
				}
				while (j < pattern.length && pattern[j] !== ']') {
					if (pattern[j] === '\\') j++; // Skip escaped chars
					j++;
				}
				const classText = pattern.slice(i, j + 1);
				result.push({
					text: classText,
					type: 'class',
					explanation: negated 
						? `Matches any character NOT in: ${classText.slice(2, -1)}`
						: `Matches any character in: ${classText.slice(1, -1)}`,
					start,
					end: j + 1
				});
				i = j + 1;
				continue;
			}
			
			// Groups
			if (char === '(') {
				// Check for special groups
				if (pattern.slice(i, i + 3) === '(?:') {
					result.push({ text: '(?:', type: 'group', explanation: 'Non-capturing group - groups without capturing for back-reference', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 3) === '(?=') {
					result.push({ text: '(?=', type: 'lookaround', explanation: 'Positive lookahead - asserts that what follows matches the pattern', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 3) === '(?!') {
					result.push({ text: '(?!', type: 'lookaround', explanation: 'Negative lookahead - asserts that what follows does NOT match', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 4) === '(?<=') {
					result.push({ text: '(?<=', type: 'lookaround', explanation: 'Positive lookbehind - asserts that what precedes matches the pattern', start, end: i + 4 });
					i += 4;
					continue;
				}
				if (pattern.slice(i, i + 4) === '(?<!') {
					result.push({ text: '(?<!', type: 'lookaround', explanation: 'Negative lookbehind - asserts that what precedes does NOT match', start, end: i + 4 });
					i += 4;
					continue;
				}
				// Named group (?<name>...)
				const namedMatch = pattern.slice(i).match(/^\(\?<(\w+)>/);
				if (namedMatch) {
					result.push({ text: namedMatch[0], type: 'group', explanation: `Named capturing group "${namedMatch[1]}"`, start, end: i + namedMatch[0].length });
					i += namedMatch[0].length;
					continue;
				}
				result.push({ text: '(', type: 'group', explanation: 'Capturing group - captures matched text for back-reference', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === ')') {
				result.push({ text: ')', type: 'group', explanation: 'End of group', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Alternation
			if (char === '|') {
				result.push({ text: '|', type: 'alternation', explanation: 'Alternative - matches either the expression before OR after', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Dot
			if (char === '.') {
				result.push({ text: '.', type: 'class', explanation: 'Matches any character except newline (unless dotall/s flag is set)', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Literal character
			result.push({ text: char, type: 'literal', explanation: `Matches the literal character "${char}"`, start, end: i + 1 });
			i++;
		}
		
		return result;
	});

	let regexError = $derived.by(() => {
		if (!pattern) return null;
		try {
			new RegExp(pattern);
			return null;
		} catch (e) {
			return (e as Error).message;
		}
	});

	function loadSample() {
		pattern = samplePattern;
	}

	function clearAll() {
		pattern = '';
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Pattern Input -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Regular Expression</label>
			<div class="flex items-center gap-2">
				<span class="text-lg text-base-content/50 font-mono">/</span>
				<input
					type="text"
					bind:value={pattern}
					placeholder="Enter a regex pattern to explain..."
					class="input input-bordered flex-1 font-mono text-sm rounded-xl"
					class:input-error={regexError}
					spellcheck="false"
				/>
				<span class="text-lg text-base-content/50 font-mono">/</span>
			</div>
			{#if regexError}
				<p class="text-error text-xs mt-2">{regexError}</p>
			{/if}
		</div>

		<!-- Visual Pattern -->
		{#if tokens.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Pattern Tokens</h3>
					<div class="flex flex-wrap gap-1 font-mono text-lg">
						{#each tokens as token, i}
							<button
								class="px-2 py-1 rounded transition-all cursor-pointer border-2 {tokenColors[token.type]} {hoveredToken === i ? 'border-primary scale-110' : 'border-transparent'}"
								onmouseenter={() => hoveredToken = i}
								onmouseleave={() => hoveredToken = null}
								onfocus={() => hoveredToken = i}
								onblur={() => hoveredToken = null}
							>
								{token.text}
							</button>
						{/each}
					</div>
					
					<!-- Explanation on hover -->
					<div class="mt-4 min-h-[60px] p-3 rounded-lg bg-base-300/50 transition-all">
						{#if hoveredToken !== null && tokens[hoveredToken]}
							{@const token = tokens[hoveredToken]}
							<div class="flex items-start gap-3">
								<span class="badge capitalize {tokenColors[token.type]}">{token.type}</span>
								<div>
									<code class="font-mono text-lg">{token.text}</code>
									<p class="text-sm text-base-content/70 mt-1">{token.explanation}</p>
								</div>
							</div>
						{:else}
							<p class="text-base-content/50 text-sm">Hover over a token to see its explanation</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Full Breakdown -->
		{#if tokens.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Full Breakdown</h3>
					<div class="overflow-x-auto">
						<table class="table table-sm">
							<thead>
								<tr>
									<th class="w-24">Token</th>
									<th class="w-24">Type</th>
									<th>Explanation</th>
								</tr>
							</thead>
							<tbody>
								{#each tokens as token, i}
									<tr 
										class="transition-colors {hoveredToken === i ? 'bg-primary/10' : ''}"
										onmouseenter={() => hoveredToken = i}
										onmouseleave={() => hoveredToken = null}
									>
										<td class="font-mono">
											<code class="px-2 py-0.5 rounded {tokenColors[token.type]}">{token.text}</code>
										</td>
										<td>
											<span class="badge badge-sm capitalize {tokenColors[token.type]}">{token.type}</span>
										</td>
										<td class="text-sm text-base-content/80">{token.explanation}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Summary -->
		{#if tokens.length > 0 && !regexError}
			{@const typeCounts = tokens.reduce((acc, t) => { acc[t.type] = (acc[t.type] || 0) + 1; return acc; }, {} as Record<string, number>)}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold">Pattern Summary</h4>
					<p class="mt-2 text-sm text-base-content/80">
						This pattern contains <strong>{tokens.length}</strong> tokens:
						{#each Object.entries(typeCounts) as [type, count]}
							<span class="badge badge-sm mx-1 {tokenColors[type]}">{count} {type}{count > 1 ? 's' : ''}</span>
						{/each}
					</p>
				</div>
			</div>
		{/if}

		<!-- Legend -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Token Types</h4>
				<div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
					{#each Object.entries(tokenColors) as [type, colorClass]}
						<span class="flex items-center gap-2">
							<span class="w-3 h-3 rounded {colorClass}"></span>
							<span class="capitalize">{type}</span>
						</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

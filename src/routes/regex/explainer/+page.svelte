<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { goto } from '$app/navigation';

	let pattern = $state('');
	let hoveredToken = $state<number | null>(null);
	let selectedToken = $state<number | null>(null);

	const samplePatterns = [
		{ name: 'Email', pattern: '^[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$' },
		{ name: 'URL', pattern: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-._~:/?#@!$&\'()*+,;=%]*' },
		{ name: 'Phone', pattern: '^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$' },
		{ name: 'Date', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
		{ name: 'IP Address', pattern: '^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$' }
	];

	interface Token {
		text: string;
		type: string;
		explanation: string;
		start: number;
		end: number;
		icon: string;
	}

	// Token type configuration with icons and colors
	const tokenConfig: Record<string, { color: string; icon: string; bgClass: string }> = {
		literal: { color: 'text-base-content', icon: '📝', bgClass: 'bg-base-300' },
		anchor: { color: 'text-info', icon: '⚓', bgClass: 'bg-info/20' },
		quantifier: { color: 'text-warning', icon: '🔢', bgClass: 'bg-warning/20' },
		class: { color: 'text-success', icon: '📦', bgClass: 'bg-success/20' },
		group: { color: 'text-primary', icon: '🔗', bgClass: 'bg-primary/20' },
		escape: { color: 'text-secondary', icon: '🔐', bgClass: 'bg-secondary/20' },
		alternation: { color: 'text-accent', icon: '🔀', bgClass: 'bg-accent/20' },
		lookaround: { color: 'text-error', icon: '👀', bgClass: 'bg-error/20' }
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
					'|': { type: 'escape', explanation: 'Matches a literal pipe (|)' },
					'/': { type: 'escape', explanation: 'Matches a literal forward slash (/)' }
				};
				
				if (escapeMap[nextChar]) {
					const config = tokenConfig[escapeMap[nextChar].type];
					result.push({
						text: `\\${nextChar}`,
						...escapeMap[nextChar],
						icon: config.icon,
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
						icon: tokenConfig.group.icon,
						start,
						end: i + 2
					});
					i += 2;
					continue;
				}
			}
			
			// Anchors
			if (char === '^') {
				result.push({ text: '^', type: 'anchor', explanation: 'Matches the start of the string (or line in multiline mode)', icon: '⚓', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '$') {
				result.push({ text: '$', type: 'anchor', explanation: 'Matches the end of the string (or line in multiline mode)', icon: '⚓', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Quantifiers
			if (char === '*') {
				result.push({ text: '*', type: 'quantifier', explanation: 'Matches 0 or more of the preceding token (greedy)', icon: '🔢', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '+') {
				result.push({ text: '+', type: 'quantifier', explanation: 'Matches 1 or more of the preceding token (greedy)', icon: '🔢', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === '?') {
				result.push({ text: '?', type: 'quantifier', explanation: 'Matches 0 or 1 of the preceding token (optional)', icon: '🔢', start, end: i + 1 });
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
					result.push({ text: full, type: 'quantifier', explanation, icon: '🔢', start, end: i + full.length });
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
				const content = classText.slice(negated ? 2 : 1, -1);
				result.push({
					text: classText,
					type: 'class',
					explanation: negated 
						? `Matches any character NOT in: ${content}`
						: `Matches any character in: ${content}`,
					icon: '📦',
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
					result.push({ text: '(?:', type: 'group', explanation: 'Non-capturing group - groups without capturing for back-reference', icon: '🔗', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 3) === '(?=') {
					result.push({ text: '(?=', type: 'lookaround', explanation: 'Positive lookahead - asserts that what follows matches the pattern', icon: '👀', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 3) === '(?!') {
					result.push({ text: '(?!', type: 'lookaround', explanation: 'Negative lookahead - asserts that what follows does NOT match', icon: '👀', start, end: i + 3 });
					i += 3;
					continue;
				}
				if (pattern.slice(i, i + 4) === '(?<=') {
					result.push({ text: '(?<=', type: 'lookaround', explanation: 'Positive lookbehind - asserts that what precedes matches the pattern', icon: '👀', start, end: i + 4 });
					i += 4;
					continue;
				}
				if (pattern.slice(i, i + 4) === '(?<!') {
					result.push({ text: '(?<!', type: 'lookaround', explanation: 'Negative lookbehind - asserts that what precedes does NOT match', icon: '👀', start, end: i + 4 });
					i += 4;
					continue;
				}
				// Named group (?<name>...)
				const namedMatch = pattern.slice(i).match(/^\(\?<(\w+)>/);
				if (namedMatch) {
					result.push({ text: namedMatch[0], type: 'group', explanation: `Named capturing group "${namedMatch[1]}"`, icon: '🔗', start, end: i + namedMatch[0].length });
					i += namedMatch[0].length;
					continue;
				}
				result.push({ text: '(', type: 'group', explanation: 'Capturing group - captures matched text for back-reference', icon: '🔗', start, end: i + 1 });
				i++;
				continue;
			}
			if (char === ')') {
				result.push({ text: ')', type: 'group', explanation: 'End of group', icon: '🔗', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Alternation
			if (char === '|') {
				result.push({ text: '|', type: 'alternation', explanation: 'Alternative - matches either the expression before OR after', icon: '🔀', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Dot
			if (char === '.') {
				result.push({ text: '.', type: 'class', explanation: 'Matches any character except newline (unless dotall/s flag is set)', icon: '📦', start, end: i + 1 });
				i++;
				continue;
			}
			
			// Literal character
			result.push({ text: char, type: 'literal', explanation: `Matches the literal character "${char}"`, icon: '📝', start, end: i + 1 });
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

	// Complexity score
	let complexity = $derived.by(() => {
		if (tokens.length === 0) return { score: 0, level: 'None', color: 'text-base-content/50' };
		
		let score = 0;
		for (const token of tokens) {
			switch (token.type) {
				case 'literal': score += 1; break;
				case 'class': score += 3; break;
				case 'quantifier': score += 2; break;
				case 'anchor': score += 1; break;
				case 'group': score += 4; break;
				case 'lookaround': score += 5; break;
				case 'alternation': score += 3; break;
				case 'escape': score += 2; break;
			}
		}
		
		if (score < 10) return { score, level: 'Simple', color: 'text-success' };
		if (score < 25) return { score, level: 'Moderate', color: 'text-warning' };
		if (score < 50) return { score, level: 'Complex', color: 'text-orange-500' };
		return { score, level: 'Very Complex', color: 'text-error' };
	});

	// Natural language summary
	let summary = $derived.by(() => {
		if (tokens.length === 0) return '';
		
		const parts: string[] = [];
		let hasStart = false;
		let hasEnd = false;
		
		for (const token of tokens) {
			if (token.text === '^') hasStart = true;
			if (token.text === '$') hasEnd = true;
		}
		
		if (hasStart && hasEnd) {
			parts.push('Matches the entire string that');
		} else if (hasStart) {
			parts.push('Matches text at the start that');
		} else if (hasEnd) {
			parts.push('Matches text at the end that');
		} else {
			parts.push('Matches any text containing');
		}
		
		const mainTokens = tokens.filter(t => t.type !== 'anchor' && t.text !== '(' && t.text !== ')');
		if (mainTokens.length <= 5) {
			parts.push(mainTokens.map(t => t.explanation.toLowerCase()).join(', then '));
		} else {
			parts.push(`${mainTokens.length} pattern elements`);
		}
		
		return parts.join(' ');
	});

	function loadSample() {
		pattern = samplePatterns[0].pattern;
	}

	function loadPattern(p: string) {
		pattern = p;
	}

	function clearAll() {
		pattern = '';
		hoveredToken = null;
		selectedToken = null;
	}

	function tryInTester() {
		goto(`/regex/tester?p=${encodeURIComponent(pattern)}`);
	}

	// Group tokens by type for summary
	let typeCounts = $derived.by(() => {
		return tokens.reduce((acc, t) => { 
			acc[t.type] = (acc[t.type] || 0) + 1; 
			return acc; 
		}, {} as Record<string, number>);
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Pattern Input Section -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
							<span class="text-xl">📖</span>
						</div>
						<div>
							<h3 class="font-bold">Pattern to Explain</h3>
							<p class="text-xs text-base-content/50">Enter any regex to understand what it does</p>
						</div>
					</div>
					{#if pattern && !regexError}
						<button 
							class="btn btn-sm btn-outline gap-1"
							onclick={tryInTester}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
							Try in Tester
						</button>
					{/if}
				</div>

				<div class="flex items-center gap-2 bg-base-100 rounded-xl p-2">
					<span class="text-2xl text-secondary/70 font-mono font-bold pl-2">/</span>
					<input
						type="text"
						bind:value={pattern}
						placeholder="Enter a regex pattern to explain..."
						class="input input-ghost flex-1 font-mono text-sm focus:outline-none bg-transparent"
						class:text-error={regexError}
						spellcheck="false"
					/>
					<span class="text-2xl text-secondary/70 font-mono font-bold">/</span>
					<CopyButton text={pattern} size="sm" />
				</div>

				{#if regexError}
					<div class="mt-2 p-3 rounded-lg bg-error/10 border border-error/20">
						<p class="text-error text-sm">{regexError}</p>
					</div>
				{/if}

				<!-- Quick Pattern Buttons -->
				<div class="flex flex-wrap gap-2 mt-3">
					{#each samplePatterns as p}
						<button 
							class="btn btn-xs btn-outline"
							onclick={() => loadPattern(p.pattern)}
						>
							{p.name}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Complexity & Summary -->
		{#if tokens.length > 0 && !regexError}
			<div class="grid sm:grid-cols-2 gap-4">
				<!-- Complexity Score -->
				<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-4">
					<div class="flex items-center justify-between">
						<div>
							<h4 class="text-sm font-semibold text-base-content/70">Complexity</h4>
							<div class="flex items-center gap-2 mt-1">
								<span class="text-2xl font-bold {complexity.color}">{complexity.level}</span>
								<span class="badge badge-outline">{complexity.score} pts</span>
							</div>
						</div>
						<div class="radial-progress {complexity.color}" style="--value:{Math.min(complexity.score, 100)}; --size:4rem;" role="progressbar">
							{complexity.score}
						</div>
					</div>
				</div>

				<!-- Token Count -->
				<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-4">
					<h4 class="text-sm font-semibold text-base-content/70">Token Breakdown</h4>
					<div class="flex flex-wrap gap-1 mt-2">
						{#each Object.entries(typeCounts) as [type, count]}
							<span class="badge gap-1 {tokenConfig[type]?.bgClass || 'bg-base-300'}">
								<span>{tokenConfig[type]?.icon || '📝'}</span>
								{count} {type}
							</span>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Natural Language Summary -->
		{#if summary && !regexError}
			<div class="card bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
				<div class="flex items-start gap-3">
					<span class="text-2xl">💬</span>
					<div>
						<h4 class="text-sm font-semibold text-primary mb-1">In Plain English</h4>
						<p class="text-sm text-base-content/80">{summary}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Visual Token Display -->
		{#if tokens.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4 flex items-center gap-2">
						<span>🧩</span> Pattern Breakdown
					</h3>
					
					<!-- Interactive Token Display -->
					<div class="flex flex-wrap gap-1 font-mono text-lg p-4 bg-base-100 rounded-xl">
						{#each tokens as token, i}
							{@const config = tokenConfig[token.type]}
							<button
								class="px-2 py-1 rounded-lg transition-all duration-200 cursor-pointer border-2 {config.bgClass} {hoveredToken === i || selectedToken === i ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:border-base-300'}"
								onmouseenter={() => hoveredToken = i}
								onmouseleave={() => hoveredToken = null}
								onclick={() => selectedToken = selectedToken === i ? null : i}
								onfocus={() => hoveredToken = i}
								onblur={() => hoveredToken = null}
							>
								<span class={config.color}>{token.text}</span>
							</button>
						{/each}
					</div>
					
					<!-- Token Detail Panel -->
					<div class="mt-4 min-h-[100px] p-4 rounded-xl bg-gradient-to-r from-base-300/50 to-base-200 transition-all border border-base-300">
						{#if (hoveredToken !== null || selectedToken !== null) && tokens[hoveredToken ?? selectedToken ?? 0]}
							{@const idx = hoveredToken ?? selectedToken ?? 0}
							{@const token = tokens[idx]}
							{@const config = tokenConfig[token.type]}
							<div class="flex items-start gap-4">
								<div class="text-4xl">{token.icon}</div>
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<code class="text-xl font-mono font-bold {config.color} {config.bgClass} px-3 py-1 rounded-lg">{token.text}</code>
										<span class="badge badge-lg capitalize {config.bgClass}">{token.type}</span>
									</div>
									<p class="text-base-content/80">{token.explanation}</p>
									<p class="text-xs text-base-content/50 mt-2">
										Position: character {token.start} to {token.end}
									</p>
								</div>
							</div>
						{:else}
							<div class="text-center py-4">
								<div class="text-4xl mb-2">👆</div>
								<p class="text-base-content/50">Hover or click a token to see its explanation</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Full Token Table -->
		{#if tokens.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3 flex items-center gap-2">
						<span>📋</span> Complete Token List
					</h3>
					<div class="overflow-x-auto">
						<table class="table table-sm table-zebra">
							<thead>
								<tr>
									<th class="w-12">#</th>
									<th class="w-20">Token</th>
									<th class="w-28">Type</th>
									<th>Explanation</th>
								</tr>
							</thead>
							<tbody>
								{#each tokens as token, i}
									{@const config = tokenConfig[token.type]}
									<tr 
										class="transition-colors cursor-pointer {hoveredToken === i || selectedToken === i ? 'bg-primary/10' : ''}"
										onmouseenter={() => hoveredToken = i}
										onmouseleave={() => hoveredToken = null}
										onclick={() => selectedToken = selectedToken === i ? null : i}
									>
										<td class="font-mono text-base-content/50">{i + 1}</td>
										<td class="font-mono">
											<code class="px-2 py-1 rounded-lg text-lg {config.bgClass} {config.color}">{token.text}</code>
										</td>
										<td>
											<span class="badge badge-sm capitalize gap-1 {config.bgClass}">
												<span>{token.icon}</span>
												{token.type}
											</span>
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

		<!-- Token Type Legend -->
		<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>🎨</span> Token Types Legend
				</h4>
				<div class="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
					{#each Object.entries(tokenConfig) as [type, config]}
						<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
							<span class="text-xl">{config.icon}</span>
							<div>
								<div class="font-semibold capitalize text-sm {config.color}">{type}</div>
								<div class="w-full h-1 rounded {config.bgClass}"></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	let paragraphs = $state(3);
	let wordsPerParagraph = $state(50);
	let output = $state('');
	let copied = $state(false);

	const loremWords = [
		'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
		'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
		'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
		'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
		'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
		'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
		'mollit', 'anim', 'id', 'est', 'laborum', 'cras', 'justo', 'odio', 'dapibus', 'ac', 'facilisis',
		'mauris', 'blandit', 'turpis', 'egestas', 'integer', 'vitae', 'sapien', 'faucibus', 'ornare',
		'suspendisse', 'potenti', 'nullam', 'porttitor', 'lacus', 'luctus', 'accumsan', 'tortor',
		'posuere', 'morbi', 'leo', 'risus', 'feugiat', 'viverra', 'nec', 'pharetra', 'nisl', 'rhoncus',
		'mattis', 'pellentesque', 'pulvinar', 'elementum', 'nunc', 'vel', 'pretium', 'lectus', 'quam',
		'placerat', 'dui', 'vivamus', 'arcu', 'cursus', 'euismod', 'dictum', 'massa', 'ante', 'metus',
		'porta', 'semper', 'semperque', 'tellus', 'rutrum', 'proin', 'gravida', 'hendrerit', 'neque'
	];

	function generateParagraph(wordCount: number, startWithLorem: boolean): string {
		const words: string[] = [];

		if (startWithLorem) {
			words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet,');
			wordCount -= 5;
		}

		for (let i = 0; i < wordCount; i++) {
			let word = loremWords[Math.floor(Math.random() * loremWords.length)];

			// Capitalize first word of sentence
			if (words.length === 0 || words[words.length - 1].endsWith('.')) {
				word = word.charAt(0).toUpperCase() + word.slice(1);
			}

			// Add punctuation occasionally
			if (i > 0 && Math.random() < 0.1) {
				word += ',';
			}

			words.push(word);
		}

		// Ensure ends with period
		let result = words.join(' ');
		if (!result.endsWith('.') && !result.endsWith('!') && !result.endsWith('?')) {
			result = result.replace(/,?$/, '.');
		}

		return result;
	}

	function generate() {
		const paras: string[] = [];
		for (let i = 0; i < paragraphs; i++) {
			paras.push(generateParagraph(wordsPerParagraph, i === 0));
		}
		output = paras.join('\n\n');
	}

	function copyOutput() {
		navigator.clipboard.writeText(output);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	function copyHtml() {
		const html = output.split('\n\n').map(p => `<p>${p}</p>`).join('\n');
		navigator.clipboard.writeText(html);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	// Generate on mount
	$effect(() => {
		generate();
	});
</script>

<ToolWrapper
	title="Lorem Ipsum Generator"
	description="Generate placeholder text for design mockups and prototypes."
>
	<div class="flex flex-col gap-6">
		<!-- Options -->
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Paragraphs</label>
				<input
					type="range"
					min="1"
					max="10"
					bind:value={paragraphs}
					class="range range-primary"
				/>
				<div class="text-center font-mono text-sm mt-1">{paragraphs}</div>
			</div>
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Words per paragraph</label>
				<input
					type="range"
					min="20"
					max="150"
					step="10"
					bind:value={wordsPerParagraph}
					class="range range-primary"
				/>
				<div class="text-center font-mono text-sm mt-1">{wordsPerParagraph}</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary" onclick={generate}>
				🎲 Generate
			</button>
			<button class="btn btn-ghost" onclick={copyOutput} disabled={!output}>
				{copied ? '✓ Copied' : '📋 Copy Text'}
			</button>
			<button class="btn btn-ghost" onclick={copyHtml} disabled={!output}>
				Copy as HTML
			</button>
		</div>

				<!-- Quick Presets -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Quick Presets</h4>
				<div class="flex flex-wrap gap-2">
					<button class="btn btn-sm btn-ghost" onclick={() => { paragraphs = 1; wordsPerParagraph = 30; generate(); }}>
						Short
					</button>
					<button class="btn btn-sm btn-ghost" onclick={() => { paragraphs = 3; wordsPerParagraph = 50; generate(); }}>
						Medium
					</button>
					<button class="btn btn-sm btn-ghost" onclick={() => { paragraphs = 5; wordsPerParagraph = 80; generate(); }}>
						Long
					</button>
					<button class="btn btn-sm btn-ghost" onclick={() => { paragraphs = 10; wordsPerParagraph = 100; generate(); }}>
						Article
					</button>
				</div>
			</div>
		</div>

		<!-- Output -->
		{#if output}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Generated Text</h3>
					<div class="prose prose-sm max-w-none">
						{#each output.split('\n\n') as para}
							<p class="text-base-content/80">{para}</p>
						{/each}
					</div>
				</div>
			</div>

			<div class="text-sm text-base-content/60">
				{paragraphs} paragraphs • ~{paragraphs * wordsPerParagraph} words
			</div>
		{/if}
	</div>
</ToolWrapper>

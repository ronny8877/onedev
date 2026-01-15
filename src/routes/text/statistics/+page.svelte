<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	let input = $state('');

	const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`;

	let stats = $derived.by(() => {
		const text = input;
		if (!text.trim()) return null;

		const chars = text.length;
		const charsNoSpaces = text.replace(/\s/g, '').length;
		const words = text.trim().split(/\s+/).filter(Boolean).length;
		const lines = text.split('\n').length;
		const nonEmptyLines = text.split('\n').filter(l => l.trim()).length;
		const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
		const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || 1;

		// Average word length
		const allWords = text.trim().split(/\s+/).filter(Boolean);
		const avgWordLength = allWords.length > 0
			? (allWords.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, '').length, 0) / allWords.length).toFixed(1)
			: '0';

		// Reading time (avg 200 words/min)
		const readingMinutes = Math.ceil(words / 200);
		const speakingMinutes = Math.ceil(words / 150);

		// Longest word
		const longestWord = allWords.reduce((longest, word) => word.length > longest.length ? word : longest, '');

		return {
			chars,
			charsNoSpaces,
			words,
			lines,
			nonEmptyLines,
			sentences,
			paragraphs,
			avgWordLength,
			readingMinutes,
			speakingMinutes,
			longestWord
		};
	});

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Text Statistics"
	description="Analyze text counts: characters, words, sentences, reading time, and more."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={input} />

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Enter Text</h3>
			<textarea
				bind:value={input}
				placeholder="Paste or type your text here to analyze..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Stats -->
		{#if stats}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4">Statistics</h3>
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Characters</span>
							<span class="font-mono font-bold text-lg">{stats.chars.toLocaleString()}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Without spaces</span>
							<span class="font-mono font-bold text-lg">{stats.charsNoSpaces.toLocaleString()}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Words</span>
							<span class="font-mono font-bold text-lg">{stats.words.toLocaleString()}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Lines</span>
							<span class="font-mono font-bold text-lg">{stats.lines}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Sentences</span>
							<span class="font-mono font-bold text-lg">{stats.sentences}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
							<span class="text-base-content/70">Paragraphs</span>
							<span class="font-mono font-bold text-lg">{stats.paragraphs}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Additional Stats -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Analysis</h3>
					<div class="grid gap-2 sm:grid-cols-2">
						<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm">
							<span class="text-base-content/70">Avg word length</span>
							<span class="font-mono font-medium">{stats.avgWordLength} chars</span>
						</div>
						<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm">
							<span class="text-base-content/70">Reading time</span>
							<span class="font-mono font-medium">~{stats.readingMinutes} min</span>
						</div>
						<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm">
							<span class="text-base-content/70">Speaking time</span>
							<span class="font-mono font-medium">~{stats.speakingMinutes} min</span>
						</div>
						<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm">
							<span class="text-base-content/70">Longest word</span>
							<span class="font-mono font-medium truncate max-w-[50%]" title={stats.longestWord}>{stats.longestWord}</span>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="text-center py-8 text-base-content/50">
				Enter text above to see statistics
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Reading time based on 200 words/minute</li>
					<li>• Speaking time based on 150 words/minute</li>
					<li>• Sentences counted by . ! ? endings</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

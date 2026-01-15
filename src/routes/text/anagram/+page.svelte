<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	let input = $state('');

	const sampleWord = 'listen';

	function sortString(str: string): string {
		return str.toLowerCase().split('').sort().join('');
	}

	// Common English words for anagram finding
	const commonWords = [
		'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
		'act', 'add', 'age', 'ago', 'air', 'all', 'also', 'am', 'any', 'are', 'arm', 'art', 'as',
		'ate', 'bad', 'bag', 'bar', 'bat', 'be', 'bed', 'been', 'best', 'big', 'bit', 'both', 'box',
		'boy', 'but', 'buy', 'by', 'can', 'car', 'care', 'case', 'cat', 'come', 'could', 'cup', 'cut',
		'day', 'dear', 'did', 'do', 'dog', 'done', 'door', 'down', 'draw', 'each', 'ear', 'eat',
		'end', 'even', 'ever', 'eye', 'face', 'fact', 'fall', 'far', 'fast', 'fear', 'feel', 'few',
		'find', 'fire', 'first', 'fish', 'five', 'for', 'form', 'four', 'free', 'from', 'full', 'game',
		'gave', 'get', 'girl', 'give', 'go', 'god', 'gold', 'gone', 'good', 'got', 'great', 'green',
		'had', 'half', 'hand', 'has', 'have', 'he', 'head', 'hear', 'heart', 'heat', 'help', 'her',
		'here', 'high', 'him', 'his', 'hold', 'home', 'hope', 'hot', 'house', 'how', 'i', 'idea', 'if',
		'in', 'into', 'is', 'it', 'its', 'just', 'keep', 'kept', 'kind', 'king', 'know', 'land', 'large',
		'last', 'late', 'lay', 'lead', 'learn', 'least', 'leave', 'left', 'less', 'let', 'life', 'light',
		'like', 'line', 'list', 'listen', 'live', 'long', 'look', 'lost', 'lot', 'love', 'low', 'made',
		'make', 'man', 'many', 'may', 'me', 'mean', 'men', 'might', 'mind', 'miss', 'more', 'most',
		'mother', 'move', 'much', 'must', 'my', 'name', 'near', 'need', 'never', 'new', 'next', 'night',
		'no', 'not', 'nothing', 'now', 'of', 'off', 'often', 'oh', 'old', 'on', 'once', 'one', 'only',
		'open', 'or', 'other', 'our', 'out', 'over', 'own', 'part', 'pass', 'past', 'people', 'place',
		'plan', 'play', 'point', 'post', 'put', 'race', 'rain', 'ran', 'read', 'real', 'rest', 'right',
		'road', 'room', 'run', 'said', 'same', 'sat', 'saw', 'say', 'sea', 'see', 'seem', 'self', 'set',
		'she', 'short', 'should', 'show', 'side', 'since', 'sit', 'six', 'small', 'so', 'some', 'soon',
		'stand', 'start', 'state', 'stay', 'still', 'stop', 'store', 'story', 'such', 'sun', 'sure',
		'table', 'take', 'talk', 'team', 'tell', 'ten', 'than', 'that', 'the', 'their', 'them', 'then',
		'there', 'these', 'they', 'thing', 'think', 'this', 'those', 'though', 'thought', 'three',
		'time', 'to', 'today', 'together', 'told', 'too', 'took', 'top', 'toward', 'tree', 'true', 'try',
		'turn', 'two', 'under', 'until', 'up', 'upon', 'us', 'use', 'very', 'wait', 'walk', 'want', 'war',
		'was', 'watch', 'water', 'way', 'we', 'week', 'well', 'went', 'were', 'what', 'when', 'where',
		'which', 'while', 'white', 'who', 'whole', 'why', 'will', 'with', 'without', 'word', 'work',
		'world', 'would', 'write', 'year', 'yes', 'yet', 'you', 'young', 'your',
		'silent', 'listen', 'earth', 'heart', 'state', 'taste', 'night', 'thing', 'canoe', 'ocean',
		'notes', 'stone', 'tones', 'onset', 'teams', 'steam', 'meats', 'mates', 'actor', 'trace',
		'crate', 'react', 'cater', 'acres', 'scare', 'cares', 'races', 'artic', 'trail', 'trial',
		'angel', 'angle', 'glean', 'alert', 'alter', 'later', 'arise', 'raise', 'baker', 'brake',
		'break', 'bare', 'bear', 'beat', 'beta', 'bin', 'nib', 'bleat', 'table', 'blow', 'bowl',
		'brag', 'grab', 'brush', 'shrub', 'cafe', 'face', 'care', 'race', 'cars', 'scar',
		'cat', 'act', 'center', 'recent', 'chin', 'inch', 'chop', 'shop', 'cinema', 'iceman',
		'cloud', 'could', 'code', 'coed', 'cork', 'rock', 'dairy', 'diary', 'dale', 'deal',
		'lead', 'dare', 'read', 'dear', 'diet', 'edit', 'tide', 'tied', 'dog', 'god',
		'draw', 'ward', 'dusty', 'study', 'ear', 'are', 'era', 'east', 'seat', 'eats',
		'elbow', 'below', 'evil', 'live', 'vile', 'veil', 'flow', 'wolf', 'fowl', 'form',
		'from', 'garden', 'danger', 'gate', 'geta', 'gene', 'nege', 'glean', 'angle', 'angel'
	];

	let anagrams = $derived.by(() => {
		if (!input.trim()) return [];
		const sorted = sortString(input.trim().replace(/\s/g, ''));
		return commonWords
			.filter(word => sortString(word) === sorted && word.toLowerCase() !== input.trim().toLowerCase())
			.sort();
	});

	function generatePermutations(str: string): string[] {
		if (str.length <= 1) return [str];
		const perms: string[] = [];
		for (let i = 0; i < str.length; i++) {
			const char = str[i];
			const remaining = str.slice(0, i) + str.slice(i + 1);
			for (const perm of generatePermutations(remaining)) {
				perms.push(char + perm);
			}
		}
		return [...new Set(perms)];
	}

	let allPermutations = $derived.by(() => {
		if (!input.trim() || input.trim().length > 7) return [];
		return generatePermutations(input.trim().toLowerCase()).filter(p => p !== input.trim().toLowerCase()).slice(0, 100);
	});

	function loadSample() {
		input = sampleWord;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Anagram Finder"
	description="Find anagrams of a word using a built-in dictionary. Also shows permutations."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Enter a word</h3>
			<input
				type="text"
				bind:value={input}
				placeholder="e.g., listen, heart, stone"
				class="input input-bordered w-full font-mono text-lg rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Dictionary Matches -->
		{#if input.trim()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">
						Dictionary Anagrams
						{#if anagrams.length > 0}
							<span class="badge badge-success ml-2">{anagrams.length} found</span>
						{/if}
					</h3>
					{#if anagrams.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each anagrams as word}
								<span class="badge badge-lg badge-primary font-mono">{word}</span>
							{/each}
						</div>
					{:else}
						<p class="text-base-content/60 text-sm">No dictionary anagrams found for "{input}"</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- All Permutations (for short words) -->
		{#if input.trim() && input.trim().length <= 7}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="text-sm font-semibold mb-3">
						All Permutations
						{#if allPermutations.length > 0}
							<span class="badge badge-ghost ml-2">{allPermutations.length}</span>
						{/if}
					</h3>
					{#if allPermutations.length > 0}
						<div class="flex flex-wrap gap-1 max-h-40 overflow-y-auto">
							{#each allPermutations as perm}
								<span class="badge badge-sm badge-ghost font-mono">{perm}</span>
							{/each}
						</div>
					{:else}
						<p class="text-base-content/60 text-sm">No permutations available</p>
					{/if}
				</div>
			</div>
		{:else if input.trim().length > 7}
			<div class="alert alert-info rounded-xl text-sm">
				Permutations disabled for words longer than 7 characters (too many combinations)
			</div>
		{/if}

		<!-- Examples -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Try These</h4>
				<div class="flex flex-wrap gap-2 mt-2">
					{#each ['listen', 'heart', 'stone', 'teams', 'actor', 'night'] as example}
						<button class="btn btn-xs btn-ghost" onclick={() => input = example}>{example}</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

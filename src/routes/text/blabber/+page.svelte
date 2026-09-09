<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { textToolsContent } from '$lib/config/content/text-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';

	const content = textToolsContent['blabber'];

	let paragraphs = $state(2);
	let sentencesPerParagraph = $state(5);
	let output = $state('');

	// Word lists for generating pseudo-readable text
	const subjects = [
		'The cat', 'A dog', 'My friend', 'The teacher', 'A scientist', 'The artist', 'Someone',
		'Everyone', 'Nobody', 'The robot', 'A bird', 'The child', 'An explorer', 'The chef',
		'A musician', 'The manager', 'Our team', 'The system', 'A stranger', 'The player'
	];

	const verbs = [
		'runs', 'jumps', 'thinks', 'believes', 'creates', 'discovers', 'explains', 'finds',
		'generates', 'helps', 'imagines', 'joins', 'knows', 'learns', 'makes', 'notices',
		'opens', 'plays', 'questions', 'reads', 'says', 'teaches', 'understands', 'writes',
		'wants', 'needs', 'feels', 'sees', 'hears', 'loves'
	];

	const adverbs = [
		'quickly', 'slowly', 'carefully', 'happily', 'sadly', 'loudly', 'quietly', 'eagerly',
		'lazily', 'nervously', 'patiently', 'politely', 'rudely', 'shyly', 'wisely', 'foolishly',
		'gracefully', 'awkwardly', 'bravely', 'calmly'
	];

	const adjectives = [
		'big', 'small', 'beautiful', 'ugly', 'fast', 'slow', 'smart', 'silly', 'happy', 'sad',
		'new', 'old', 'bright', 'dark', 'hot', 'cold', 'soft', 'hard', 'strange', 'normal',
		'amazing', 'terrible', 'wonderful', 'mysterious', 'colorful'
	];

	const objects = [
		'the book', 'a ball', 'the computer', 'some food', 'the music', 'a painting', 'the game',
		'a story', 'the problem', 'a solution', 'the message', 'a gift', 'the secret', 'a journey',
		'the answer', 'a question', 'the weather', 'a dream', 'the future', 'a memory'
	];

	const transitions = [
		'However,', 'Therefore,', 'Meanwhile,', 'Furthermore,', 'In contrast,', 'Similarly,',
		'As a result,', 'On the other hand,', 'In addition,', 'Consequently,', 'Nevertheless,',
		'For example,', 'In fact,', 'Surprisingly,', 'Interestingly,', ''
	];

	function random<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function generateSentence(useTransition: boolean = false): string {
		const patterns = [
			() => `${random(subjects)} ${random(adverbs)} ${random(verbs)} ${random(objects)}.`,
			() => `${random(subjects)} ${random(verbs)} ${random(adjectives)} ${random(objects)}.`,
			() => `${random(subjects)} ${random(verbs)} and ${random(verbs)} ${random(objects)}.`,
			() => `${random(subjects)} ${random(verbs)} ${random(adverbs)}.`,
			() => `A ${random(adjectives)} ${random(['person', 'thing', 'idea', 'moment', 'day'])} ${random(verbs)} ${random(objects)}.`
		];

		let sentence = random(patterns)();

		if (useTransition && Math.random() > 0.4) {
			const transition = random(transitions);
			if (transition) {
				sentence = transition + ' ' + sentence.charAt(0).toLowerCase() + sentence.slice(1);
			}
		}

		return sentence;
	}

	function generateParagraph(sentenceCount: number): string {
		const sentences: string[] = [];
		for (let i = 0; i < sentenceCount; i++) {
			sentences.push(generateSentence(i > 0));
		}
		return sentences.join(' ');
	}

	function generate() {
		const paras: string[] = [];
		for (let i = 0; i < paragraphs; i++) {
			paras.push(generateParagraph(sentencesPerParagraph));
		}
		output = paras.join('\n\n');
	}

	function sample() {
		paragraphs = 2;
		sentencesPerParagraph = 5;
		generate();
	}

	function clearAll() {
		output = '';
	}

	$effect(() => {
		generate();
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={sample} onClear={clearAll} copyText={output} />

		<!-- Options -->
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<div class="text-sm font-medium text-base-content/70 mb-2 block">Paragraphs</div>
				<input
					type="range"
					min="1"
					max="10"
					bind:value={paragraphs}
					class="range range-secondary"
					oninput={generate}
				/>
				<div class="text-center font-mono text-sm mt-1">{paragraphs}</div>
			</div>
			<div>
				<div class="text-sm font-medium text-base-content/70 mb-2 block">Sentences per paragraph</div>
				<input
					type="range"
					min="2"
					max="10"
					bind:value={sentencesPerParagraph}
					class="range range-secondary"
					oninput={generate}
				/>
				<div class="text-center font-mono text-sm mt-1">{sentencesPerParagraph}</div>
			</div>
		</div>

		<!-- Main Action -->
		<div>
			<button class="btn btn-primary" onclick={generate}>
				🎲 Generate New
			</button>
		</div>

		<!-- Output -->
		{#if output}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold">Generated Text</h3>
						<CopyButton text={output} size="sm" />
					</div>
					<div class="prose prose-sm max-w-none">
						{#each output.split('\n\n') as para}
							<p class="text-base-content/80">{para}</p>
						{/each}
					</div>
				</div>
			</div>

			<div class="text-sm text-base-content/60">
				{paragraphs} paragraphs • {paragraphs * sentencesPerParagraph} sentences
			</div>
		{/if}

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import cronstrue from 'cronstrue';
	import { Cron } from 'croner';

	import { cronToolsContent } from '$lib/config/content/cron-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = cronToolsContent['explainer'];

	// State
	let input = $state('0 9 * * 1-5');

	// Field info
	const fieldInfo = [
		{ name: 'Minute', color: 'bg-blue-500', textColor: 'text-blue-400' },
		{ name: 'Hour', color: 'bg-green-500', textColor: 'text-green-400' },
		{ name: 'Day of Month', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
		{ name: 'Month', color: 'bg-orange-500', textColor: 'text-orange-400' },
		{ name: 'Day of Week', color: 'bg-purple-500', textColor: 'text-purple-400' }
	];

	// Sample expressions
	const examples = [
		{ expr: '* * * * *', label: 'Every minute' },
		{ expr: '0 9 * * 1-5', label: 'Weekdays 9am' },
		{ expr: '*/15 * * * *', label: 'Every 15 min' },
		{ expr: '0 0 1 * *', label: 'Monthly' },
		{ expr: '0 */2 * * *', label: 'Every 2 hours' }
	];

	// Parse and explain
	let explanation = $derived(() => {
		if (!input.trim()) return null;
		try {
			return cronstrue.toString(input.trim(), { verbose: true });
		} catch {
			return null;
		}
	});

	let isValid = $derived(() => {
		try {
			new Cron(input.trim());
			return true;
		} catch {
			return false;
		}
	});

	// Parse fields
	let parsedFields = $derived(() => {
		const parts = input.trim().split(/\s+/);
		if (parts.length < 5) return null;
		
		const hasSeconds = parts.length >= 6;
		const offset = hasSeconds ? 1 : 0;
		
		return fieldInfo.map((field, i) => ({
			...field,
			value: parts[i + offset] || '*'
		}));
	});

	// Explain field
	function explainValue(value: string, fieldName: string): string {
		if (value === '*') return `every ${fieldName.toLowerCase()}`;
		if (value.startsWith('*/')) return `every ${value.slice(2)}`;
		if (value.includes('-')) {
			const [start, end] = value.split('-');
			return `${start} through ${end}`;
		}
		if (value.includes(',')) return value.split(',').join(', ');
		
		if (fieldName === 'Day of Week') {
			const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			const nums = value.split(',').map(n => parseInt(n));
			if (nums.every(n => !isNaN(n) && n >= 0 && n <= 6)) {
				return nums.map(n => days[n]).join(', ');
			}
		}
		
		if (fieldName === 'Month') {
			const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			const num = parseInt(value);
			if (!isNaN(num) && num >= 1 && num <= 12) return months[num];
		}
		
		return value;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<!-- Input -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-5">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-info/30 to-info/10 flex items-center justify-center">
						<AppIcon name="book-open" size={20} />
					</div>
					<div>
						<h3 class="font-bold">Explain Cron Expression</h3>
						<p class="text-xs text-base-content/60">Paste expression to understand</p>
					</div>
				</div>

				<input
					type="text"
					bind:value={input}
					placeholder="e.g., 0 9 * * 1-5"
					class="input input-bordered input-lg w-full font-mono text-center text-xl tracking-wider"
					spellcheck="false"
				/>

				<!-- Quick Examples -->
				<div class="flex flex-wrap justify-center gap-2 mt-4">
					{#each examples as ex}
						<button
							type="button"
							class="badge badge-lg badge-ghost hover:badge-primary cursor-pointer font-mono"
							onclick={() => input = ex.expr}
						>
							{ex.expr}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Explanation -->
		{#if explanation()}
			<div class="card bg-success/10 border border-success/20 rounded-2xl">
				<div class="card-body p-5 text-center">
					<p class="text-xs text-success/70 mb-2">This cron expression means:</p>
					<p class="text-xl font-semibold text-success">{explanation()}</p>
				</div>
			</div>
		{:else if input.trim()}
			<div class="alert alert-error rounded-xl">
				<span>❌ Invalid cron expression</span>
			</div>
		{/if}

		<!-- Visual Breakdown -->
		{#if parsedFields() && isValid()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-5">
					<h3 class="font-bold text-sm text-center mb-4">Field Breakdown</h3>

					<!-- Visual Expression -->
					<div class="flex justify-center gap-2 mb-6">
						{#each parsedFields() || [] as field}
							<div class="flex flex-col items-center">
								<span class="text-xs text-base-content/50 mb-1">{field.name.split(' ')[0]}</span>
								<span class="px-4 py-2 rounded-lg {field.color} text-white font-mono font-bold text-lg">
									{field.value}
								</span>
							</div>
						{/each}
					</div>

					<!-- Explanation List -->
					<div class="space-y-2">
						{#each parsedFields() || [] as field}
							<div class="flex items-center gap-3 p-2 bg-base-300/50 rounded-lg">
								<span class="w-3 h-3 rounded-full {field.color}"></span>
								<span class="font-medium text-sm w-28">{field.name}</span>
								<code class="text-sm bg-base-300 px-2 py-0.5 rounded">{field.value}</code>
								<span class="text-sm text-base-content/70 flex-1">{explainValue(field.value, field.name)}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Syntax Quick Reference -->
		<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-sm">
			<div class="bg-base-200 rounded-lg p-2">
				<code class="text-primary">*</code>
				<p class="text-xs text-base-content/60">any value</p>
			</div>
			<div class="bg-base-200 rounded-lg p-2">
				<code class="text-primary">,</code>
				<p class="text-xs text-base-content/60">value list</p>
			</div>
			<div class="bg-base-200 rounded-lg p-2">
				<code class="text-primary">-</code>
				<p class="text-xs text-base-content/60">range</p>
			</div>
			<div class="bg-base-200 rounded-lg p-2">
				<code class="text-primary">/</code>
				<p class="text-xs text-base-content/60">step</p>
		</div>

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

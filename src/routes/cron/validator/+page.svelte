<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { Cron } from 'croner';
	import cronstrue from 'cronstrue';

	import { cronToolsContent } from '$lib/config/content/cron-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cronToolsContent['validator'];

	// State
	let input = $state('');
	
	// Field definitions
	const fieldDefs = [
		{ name: 'Minute', min: 0, max: 59 },
		{ name: 'Hour', min: 0, max: 23 },
		{ name: 'Day', min: 1, max: 31 },
		{ name: 'Month', min: 1, max: 12 },
		{ name: 'Weekday', min: 0, max: 6 }
	];

	// Validation
	let result = $derived(() => {
		const trimmed = input.trim();
		if (!trimmed) return null;

		const errors: string[] = [];
		const parts = trimmed.split(/\s+/);
		
		// Field count
		if (parts.length < 5) {
			errors.push(`Too few fields (got ${parts.length}, need 5)`);
		} else if (parts.length > 7) {
			errors.push(`Too many fields (got ${parts.length}, max 7)`);
		}

		// Validate each field
		const offset = parts.length >= 6 ? 1 : 0;
		fieldDefs.forEach((field, i) => {
			const val = parts[i + offset];
			if (!val) return;

			// Invalid chars
			if (!/^[\d\*\/\-\,]+$/.test(val)) {
				errors.push(`${field.name}: Invalid characters`);
				return;
			}

			// Range check
			const nums = val.match(/\d+/g);
			if (nums) {
				nums.forEach(n => {
					const num = parseInt(n);
					if (num < field.min || num > field.max) {
						errors.push(`${field.name}: ${num} out of range (${field.min}-${field.max})`);
					}
				});
			}
		});

		// Try parsing
		try {
			new Cron(trimmed);
		} catch (e) {
			if (errors.length === 0) {
				errors.push((e as Error).message);
			}
		}

		// Get description if valid
		let description = '';
		if (errors.length === 0) {
			try {
				description = cronstrue.toString(trimmed);
			} catch {}
		}

		return {
			isValid: errors.length === 0,
			errors,
			description,
			fieldCount: parts.length,
			hasSeconds: parts.length >= 6
		};
	});

	// Examples for testing
	const testExamples = [
		{ expr: '0 9 * * 1-5', label: '✓ Valid' },
		{ expr: '60 9 * * *', label: '✗ Min > 59' },
		{ expr: '0 25 * * *', label: '✗ Hour > 23' },
		{ expr: '* *', label: '✗ Too few' }
	];
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Input -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-5">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/30 to-warning/10 flex items-center justify-center">
						<AppIcon name={'✓'} size={20} />
					</div>
					<div>
						<h3 class="font-bold">Validate Cron Expression</h3>
						<p class="text-xs text-base-content/60">Check syntax and field ranges</p>
					</div>
				</div>

				<input
					type="text"
					bind:value={input}
					placeholder="Paste cron expression to validate..."
					class="input input-bordered input-lg w-full font-mono text-center"
					spellcheck="false"
				/>

				<!-- Test Examples -->
				<div class="flex flex-wrap justify-center gap-2 mt-4">
					{#each testExamples as ex}
						<button
							type="button"
							class="badge badge-lg badge-ghost hover:badge-primary cursor-pointer font-mono"
							onclick={() => input = ex.expr}
						>
							{ex.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Result -->
		{#if result()}
			{@const r = result()}
			{#if r?.isValid}
				<div class="card bg-success/10 border border-success/20 rounded-2xl">
					<div class="card-body p-5">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
								<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-bold text-success">Valid Expression</h3>
								<p class="text-base-content/70">{r?.description}</p>
								<div class="flex gap-2 mt-2">
									<span class="badge badge-sm badge-success">{r?.fieldCount} fields</span>
									{#if r?.hasSeconds}
										<span class="badge badge-sm badge-info">Quartz</span>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="card bg-error/10 border border-error/20 rounded-2xl">
					<div class="card-body p-5">
						<div class="flex items-start gap-4">
							<div class="w-14 h-14 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0">
								<svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-bold text-error">Invalid Expression</h3>
								<div class="mt-3 space-y-2">
									{#each r?.errors || [] as error}
										<div class="flex items-center gap-2 bg-base-100/50 rounded-lg p-2">
											<span class="text-error">•</span>
											<span class="text-sm">{error}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Reference -->
		<div class="overflow-x-auto">
			<table class="table table-sm bg-base-200 rounded-xl">
				<thead>
					<tr>
						<th>Field</th>
						<th>Range</th>
						<th>Examples</th>
					</tr>
				</thead>
				<tbody>
					<tr><td>Minute</td><td>0-59</td><td class="font-mono text-xs">0, 30, */5</td></tr>
					<tr><td>Hour</td><td>0-23</td><td class="font-mono text-xs">9, 0-17, */2</td></tr>
					<tr><td>Day</td><td>1-31</td><td class="font-mono text-xs">1, 15, 1,15</td></tr>
					<tr><td>Month</td><td>1-12</td><td class="font-mono text-xs">1, 1-6, */3</td></tr>
					<tr><td>Weekday</td><td>0-6</td><td class="font-mono text-xs">0=Sun, 1-5</td></tr>
				</tbody>
			</table>
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

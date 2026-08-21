<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	import { cronToolsContent } from '$lib/config/content/cron-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cronToolsContent['presets'];

	// Preset categories
	const presetCategories = [
		{
			name: 'Every X Minutes',
			icon: '⏱️',
			presets: [
				{ expression: '* * * * *', description: 'Every minute' },
				{ expression: '*/5 * * * *', description: 'Every 5 minutes' },
				{ expression: '*/10 * * * *', description: 'Every 10 minutes' },
				{ expression: '*/15 * * * *', description: 'Every 15 minutes' },
				{ expression: '*/30 * * * *', description: 'Every 30 minutes' }
			]
		},
		{
			name: 'Hourly',
			icon: '🕐',
			presets: [
				{ expression: '0 * * * *', description: 'Every hour (at :00)' },
				{ expression: '30 * * * *', description: 'Every hour (at :30)' },
				{ expression: '0 */2 * * *', description: 'Every 2 hours' },
				{ expression: '0 */4 * * *', description: 'Every 4 hours' },
				{ expression: '0 */6 * * *', description: 'Every 6 hours' }
			]
		},
		{
			name: 'Daily',
			icon: '📅',
			presets: [
				{ expression: '0 0 * * *', description: 'Daily at midnight' },
				{ expression: '0 6 * * *', description: 'Daily at 6:00 AM' },
				{ expression: '0 9 * * *', description: 'Daily at 9:00 AM' },
				{ expression: '0 12 * * *', description: 'Daily at noon' },
				{ expression: '0 18 * * *', description: 'Daily at 6:00 PM' },
				{ expression: '0 23 * * *', description: 'Daily at 11:00 PM' }
			]
		},
		{
			name: 'Weekdays',
			icon: '💼',
			presets: [
				{ expression: '0 9 * * 1-5', description: 'Weekdays at 9:00 AM' },
				{ expression: '0 8 * * 1-5', description: 'Weekdays at 8:00 AM' },
				{ expression: '0 17 * * 1-5', description: 'Weekdays at 5:00 PM' },
				{ expression: '0 9,17 * * 1-5', description: 'Weekdays at 9 AM and 5 PM' },
				{ expression: '0 0 * * 1-5', description: 'Weekdays at midnight' }
			]
		},
		{
			name: 'Weekend',
			icon: '🌴',
			presets: [
				{ expression: '0 9 * * 0,6', description: 'Weekends at 9:00 AM' },
				{ expression: '0 10 * * 0,6', description: 'Weekends at 10:00 AM' },
				{ expression: '0 0 * * 0', description: 'Sunday at midnight' },
				{ expression: '0 0 * * 6', description: 'Saturday at midnight' }
			]
		},
		{
			name: 'Weekly',
			icon: '📆',
			presets: [
				{ expression: '0 0 * * 0', description: 'Weekly on Sunday at midnight' },
				{ expression: '0 0 * * 1', description: 'Weekly on Monday at midnight' },
				{ expression: '0 9 * * 1', description: 'Weekly on Monday at 9:00 AM' },
				{ expression: '0 17 * * 5', description: 'Weekly on Friday at 5:00 PM' }
			]
		},
		{
			name: 'Monthly',
			icon: '🗓️',
			presets: [
				{ expression: '0 0 1 * *', description: '1st day of month at midnight' },
				{ expression: '0 9 1 * *', description: '1st day of month at 9:00 AM' },
				{ expression: '0 0 15 * *', description: '15th day of month at midnight' },
				{ expression: '0 0 1,15 * *', description: '1st and 15th at midnight' },
				{ expression: '0 0 L * *', description: 'Last day of month (if supported)' }
			]
		},
		{
			name: 'Yearly',
			icon: '🎆',
			presets: [
				{ expression: '0 0 1 1 *', description: 'January 1st at midnight' },
				{ expression: '0 0 1 1,7 *', description: 'Jan 1 and Jul 1 at midnight' },
				{ expression: '0 9 1 1 *', description: 'January 1st at 9:00 AM' },
				{ expression: '0 0 25 12 *', description: 'Christmas Day at midnight' }
			]
		}
	];

	let searchQuery = $state('');
	let activeCategory = $state<string | null>(null);

	// Filter presets by search
	let filteredCategories = $derived(() => {
		if (!searchQuery.trim()) return presetCategories;
		
		const query = searchQuery.toLowerCase();
		return presetCategories
			.map(cat => ({
				...cat,
				presets: cat.presets.filter(p => 
					p.description.toLowerCase().includes(query) ||
					p.expression.includes(query)
				)
			}))
			.filter(cat => cat.presets.length > 0);
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Search -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="relative">
					<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search presets... (e.g., 'daily', 'weekday', '9am')"
						class="input input-bordered w-full pl-10"
					/>
				</div>
			</div>
		</div>

		<!-- Category Tabs -->
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				class="btn btn-sm {activeCategory === null ? 'btn-primary' : 'btn-ghost'}"
				onclick={() => activeCategory = null}
			>
				All
			</button>
			{#each presetCategories as cat}
				<button
					type="button"
					class="btn btn-sm {activeCategory === cat.name ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => activeCategory = activeCategory === cat.name ? null : cat.name}
				>
					<AppIcon name={cat.icon} size={16} /> {cat.name}
				</button>
			{/each}
		</div>

		<!-- Presets Grid -->
		<div class="space-y-6">
			{#each filteredCategories() as category}
				{#if activeCategory === null || activeCategory === category.name}
					<div class="card bg-base-200 rounded-2xl">
						<div class="card-body p-4">
							<div class="flex items-center gap-2 mb-4">
								<span class="text-2xl"><AppIcon name={category.icon} size={24} /></span>
								<h3 class="font-bold text-lg">{category.name}</h3>
								<span class="badge badge-sm badge-ghost">{category.presets.length}</span>
							</div>

							<div class="grid gap-2">
								{#each category.presets as preset}
									<div class="flex items-center gap-3 bg-base-300/50 rounded-lg p-3 hover:bg-base-300 transition-colors group">
										<code class="font-mono font-bold text-primary bg-base-100 px-3 py-1.5 rounded whitespace-nowrap">
											{preset.expression}
										</code>
										<span class="flex-1 text-sm text-base-content/70">
											{preset.description}
										</span>
										<CopyButton text={preset.expression} size="sm" />
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{/each}
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">Cron Format</h4>
				<code class="block font-mono text-sm bg-base-300 p-3 rounded-lg">
					┌───────────── minute (0-59)<br/>
					│ ┌───────────── hour (0-23)<br/>
					│ │ ┌───────────── day of month (1-31)<br/>
					│ │ │ ┌───────────── month (1-12)<br/>
					│ │ │ │ ┌───────────── day of week (0-6, Sun=0)<br/>
					│ │ │ │ │<br/>
					* * * * *
				</code>
			</div>
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

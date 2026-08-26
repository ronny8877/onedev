<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { Cron } from 'croner';
	import cronstrue from 'cronstrue';
	import { onMount } from 'svelte';

	import { cronToolsContent } from '$lib/config/content/cron-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cronToolsContent['next-run'];

	// State
	let input = $state('0 9 * * 1-5');
	let timezone = $state('');
	let runCount = $state(10);
	let allTimezones = $state<string[]>([]);

	// Get all available timezones on mount
	onMount(() => {
		const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		timezone = userTz;

		const priorityZones = [
			'UTC',
			'America/New_York',
			'America/Los_Angeles',
			'Europe/London',
			'Europe/Paris',
			'Asia/Tokyo',
			'Asia/Shanghai',
			'Asia/Kolkata',
			'Australia/Sydney'
		];

		if (!priorityZones.includes(userTz)) {
			priorityZones.unshift(userTz);
		}
		allTimezones = priorityZones;
	});

	// Use regular function for calculation to avoid state mutation in derived
	function calculateNextRuns(): { runs: { date: Date; relative: string }[]; error: string | null; description: string | null } {
		if (!input.trim() || !timezone) {
			return { runs: [], error: null, description: null };
		}
		
		try {
			const cron = new Cron(input.trim(), { timezone });
			const runs: { date: Date; relative: string }[] = [];
			let next = cron.nextRun();
			
			for (let i = 0; i < runCount && next; i++) {
				runs.push({
					date: next,
					relative: getRelativeTime(next)
				});
				next = cron.nextRun(new Date(next.getTime() + 1000));
			}
			
			let description: string | null = null;
			try {
				description = cronstrue.toString(input.trim());
			} catch {}
			
			return { runs, error: null, description };
		} catch (e) {
			return { runs: [], error: (e as Error).message, description: null };
		}
	}

	// Derived without state mutation
	let result = $derived(calculateNextRuns());

	// Get relative time string
	function getRelativeTime(date: Date): string {
		const now = new Date();
		const diffMs = date.getTime() - now.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return `${Math.floor(diffDays / 7)}w`;
	}

	// Format for display
	function formatDateTime(date: Date): { day: string; date: string; time: string } {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		
		return {
			day: days[date.getDay()],
			date: `${months[date.getMonth()]} ${date.getDate()}`,
			time: date.toLocaleTimeString('en-US', { 
				hour: '2-digit', 
				minute: '2-digit',
				hour12: true,
				timeZone: timezone 
			})
		};
	}

	// Sample expressions  
	const quickExamples = [
		{ expr: '* * * * *', label: 'Every minute' },
		{ expr: '*/5 * * * *', label: 'Every 5 min' },
		{ expr: '0 * * * *', label: 'Hourly' },
		{ expr: '0 9 * * 1-5', label: 'Weekdays 9am' },
		{ expr: '0 0 1 * *', label: 'Monthly' }
	];
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Input Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-5">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
						<AppIcon name="calendar" size={20} />
					</div>
					<div>
						<h3 class="font-bold">Cron Expression</h3>
						<p class="text-xs text-base-content/60">Enter expression to see schedule</p>
					</div>
				</div>

				<input
					type="text"
					bind:value={input}
					placeholder="e.g., 0 9 * * 1-5"
					class="input input-bordered input-lg w-full font-mono text-center text-xl tracking-wider"
					spellcheck="false"
				/>

				{#if result.description}
					<div class="mt-3 p-3 bg-success/10 rounded-xl border border-success/20">
						<p class="text-center text-success font-medium">{result.description}</p>
					</div>
				{/if}

				<!-- Quick Examples -->
				<div class="flex flex-wrap justify-center gap-2 mt-4">
					{#each quickExamples as ex}
						<button
							type="button"
							class="badge badge-lg badge-ghost hover:badge-primary cursor-pointer transition-colors"
							onclick={() => input = ex.expr}
						>
							{ex.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Settings Row -->
		<div class="flex flex-wrap gap-4 items-center justify-center">
			<label class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<AppIcon name="globe" size={16} />
				<select bind:value={timezone} class="select select-sm select-bordered bg-base-100 font-medium min-w-44">
					{#each allTimezones as tz}
						<option value={tz}>{tz.replace(/_/g, ' ')}</option>
					{/each}
				</select>
			</label>
			<div class="flex items-center gap-3 bg-base-200 rounded-xl px-4 py-2 min-w-64 flex-1 max-w-md">
				<AppIcon name="chart-column" size={16} />
				<span class="text-sm font-medium whitespace-nowrap">Show</span>
				<input
					type="range"
					bind:value={runCount}
					min="5"
					max="20"
					class="range range-sm range-primary min-w-0 flex-1"
				/>
				<input
					type="number"
					bind:value={runCount}
					min="5"
					max="20"
					class="input input-bordered input-sm w-16 shrink-0 text-center tabular-nums bg-base-100"
				/>
			</div>
		</div>

		<!-- Error -->
		{#if result.error}
			<div class="alert alert-error rounded-xl">
				<span>❌ {result.error}</span>
			</div>
		{/if}

		<!-- Visual Timeline -->
		{#if result.runs.length > 0}
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body p-5">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold flex items-center gap-2">
							<AppIcon name="calendar" size={16} /> Next {result.runs.length} Runs
						</h3>
						<span class="badge badge-primary badge-sm">{timezone.replace(/_/g, ' ')}</span>
					</div>

					<!-- Timeline View -->
					<div class="space-y-2">
						{#each result.runs as run, i}
							{@const fmt = formatDateTime(run.date)}
							<div class="flex items-center gap-3 p-3 bg-base-300/50 rounded-xl hover:bg-base-300 transition-colors group">
								<!-- Number -->
								<div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
									{i + 1}
								</div>
								
								<!-- Day badge -->
								<div class="w-12 text-center">
									<span class="badge badge-sm {fmt.day === 'Sat' || fmt.day === 'Sun' ? 'badge-warning' : 'badge-ghost'}">
										{fmt.day}
									</span>
								</div>

								<!-- Date -->
								<div class="flex-1">
									<span class="font-medium">{fmt.date}</span>
								</div>

								<!-- Time - prominent -->
								<div class="font-mono font-bold text-lg text-primary">
									{fmt.time}
								</div>

								<!-- Relative -->
								<div class="w-12 text-right">
									<span class="text-xs text-base-content/50">{run.relative}</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Cron Format Reference - Compact -->
		<div class="card bg-base-200/50 rounded-xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-center gap-1 font-mono text-sm text-base-content/70">
					<span class="px-2 py-1 bg-blue-500/20 rounded">MIN</span>
					<span class="px-2 py-1 bg-green-500/20 rounded">HOUR</span>
					<span class="px-2 py-1 bg-yellow-500/20 rounded">DAY</span>
					<span class="px-2 py-1 bg-orange-500/20 rounded">MON</span>
					<span class="px-2 py-1 bg-purple-500/20 rounded">DOW</span>
				</div>
				<p class="text-center text-xs text-base-content/50 mt-2">
					* = any • , = list • - = range • / = step
				</p>
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

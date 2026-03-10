<script lang="ts">
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

	const content = cronToolsContent['human'];

	// State - more flexible options
	let frequency = $state<'every-x-minutes' | 'every-x-hours' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('weekly');
	
	// Time settings
	let minuteInterval = $state(5);
	let hourInterval = $state(2);
	let atHour = $state(9);
	let atMinute = $state(0);
	
	// Day settings
	let selectedWeekdays = $state([1, 2, 3, 4, 5]); // Mon-Fri
	let selectedMonthDay = $state(1);
	let selectedMonth = $state(1); // For yearly

	// Custom expression for advanced users
	let customExpression = $state('0 9 * * 1-5');

	const weekdays = [
		{ val: 0, short: 'S', name: 'Sunday' },
		{ val: 1, short: 'M', name: 'Monday' },
		{ val: 2, short: 'T', name: 'Tuesday' },
		{ val: 3, short: 'W', name: 'Wednesday' },
		{ val: 4, short: 'T', name: 'Thursday' },
		{ val: 5, short: 'F', name: 'Friday' },
		{ val: 6, short: 'S', name: 'Saturday' }
	];

	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// Generate expression - no state mutation
	function buildCronExpression(): string {
		switch (frequency) {
			case 'every-x-minutes':
				return `*/${minuteInterval} * * * *`;
			case 'every-x-hours':
				return `${atMinute} */${hourInterval} * * *`;
			case 'daily':
				return `${atMinute} ${atHour} * * *`;
			case 'weekly': {
				const sortedDays = [...selectedWeekdays].sort((a, b) => a - b);
				const dayStr = sortedDays.length === 0 ? '*' : sortedDays.length === 7 ? '*' : sortedDays.join(',');
				return `${atMinute} ${atHour} * * ${dayStr}`;
			}
			case 'monthly':
				return `${atMinute} ${atHour} ${selectedMonthDay} * *`;
			case 'yearly':
				return `${atMinute} ${atHour} ${selectedMonthDay} ${selectedMonth} *`;
			case 'custom':
				return customExpression;
			default:
				return '* * * * *';
		}
	}

	let cronExpression = $derived(buildCronExpression());

	let description = $derived(() => {
		try {
			return cronstrue.toString(cronExpression);
		} catch {
			return 'Invalid expression';
		}
	});

	let nextRuns = $derived(() => {
		try {
			const cron = new Cron(cronExpression);
			const runs: Date[] = [];
			let next = cron.nextRun();
			for (let i = 0; i < 3 && next; i++) {
				runs.push(next);
				next = cron.nextRun(new Date(next.getTime() + 1000));
			}
			return runs;
		} catch {
			return [];
		}
	});

	function toggleWeekday(day: number) {
		if (selectedWeekdays.includes(day)) {
			selectedWeekdays = selectedWeekdays.filter(d => d !== day);
		} else {
			selectedWeekdays = [...selectedWeekdays, day];
		}
	}

	function selectWeekdays() { selectedWeekdays = [1, 2, 3, 4, 5]; }
	function selectWeekend() { selectedWeekdays = [0, 6]; }
	function selectAllDays() { selectedWeekdays = [0, 1, 2, 3, 4, 5, 6]; }

	function formatHour(h: number): string {
		if (h === 0) return '12:00 AM';
		if (h < 12) return `${h}:00 AM`;
		if (h === 12) return '12:00 PM';
		return `${h - 12}:00 PM`;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Result at Top -->
		<div class="card bg-success/10 border border-success/20 rounded-2xl">
			<div class="card-body p-5">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<p class="text-xs text-base-content/60 mb-1">Your Cron Schedule</p>
						<code class="text-2xl font-mono font-bold">{cronExpression}</code>
						<p class="text-base-content/70 mt-2">{description()}</p>
					</div>
					<CopyButton text={cronExpression} size="sm" />
				</div>

				{#if nextRuns().length > 0}
					<div class="mt-4 pt-3 border-t border-base-content/10">
						<div class="flex flex-wrap gap-2">
							{#each nextRuns() as run}
								<span class="badge badge-sm font-mono">{run.toLocaleString()}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Frequency Selection -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-5">
				<h3 class="font-bold text-center mb-4">How often should it run?</h3>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
					{#each [
						{ val: 'every-x-minutes', icon: '⚡', label: 'Every X min' },
						{ val: 'every-x-hours', icon: '🕐', label: 'Every X hours' },
						{ val: 'daily', icon: '☀️', label: 'Daily' },
						{ val: 'weekly', icon: '📅', label: 'Weekly' },
						{ val: 'monthly', icon: '🗓️', label: 'Monthly' },
						{ val: 'yearly', icon: '🎆', label: 'Yearly' },
						{ val: 'custom', icon: '✏️', label: 'Custom' }
					] as opt}
						<button
							type="button"
							class="btn {frequency === opt.val ? 'btn-primary' : 'btn-ghost'} flex-col h-auto py-3"
							onclick={() => frequency = opt.val as typeof frequency}
						>
							<span class="text-xl">{opt.icon}</span>
							<span class="text-xs">{opt.label}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Interval for Minutes -->
		{#if frequency === 'every-x-minutes'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">Run every {minuteInterval} minute(s)</h4>
					<input type="range" bind:value={minuteInterval} min="1" max="30" class="range range-primary" />
					<div class="flex justify-between text-xs text-base-content/50 mt-1">
						<span>1</span>
						<span>5</span>
						<span>10</span>
						<span>15</span>
						<span>30</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Interval for Hours -->
		{#if frequency === 'every-x-hours'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">Run every {hourInterval} hour(s)</h4>
					<input type="range" bind:value={hourInterval} min="1" max="12" class="range range-primary" />
					<div class="flex justify-between text-xs text-base-content/50 mt-1">
						<span>1</span>
						<span>2</span>
						<span>4</span>
						<span>6</span>
						<span>12</span>
					</div>
					<div class="mt-4">
						<label class="text-sm font-medium">At minute:</label>
						<select bind:value={atMinute} class="select select-sm select-bordered ml-2">
							{#each [0, 15, 30, 45] as m}
								<option value={m}>:{m.toString().padStart(2, '0')}</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		{/if}

		<!-- Time Selection for daily/weekly/monthly/yearly -->
		{#if ['daily', 'weekly', 'monthly', 'yearly'].includes(frequency)}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">At what time?</h4>
					<div class="flex justify-center gap-4">
						<div class="text-center">
							<p class="text-xs text-base-content/60 mb-1">Hour</p>
							<select bind:value={atHour} class="select select-bordered">
								{#each Array.from({length: 24}, (_, i) => i) as h}
									<option value={h}>{formatHour(h)}</option>
								{/each}
							</select>
						</div>
						<div class="text-center">
							<p class="text-xs text-base-content/60 mb-1">Minute</p>
							<select bind:value={atMinute} class="select select-bordered">
								{#each Array.from({length: 60}, (_, i) => i) as m}
									<option value={m}>:{m.toString().padStart(2, '0')}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Weekday Selection -->
		{#if frequency === 'weekly'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">On which days?</h4>
					
					<!-- Day circles -->
					<div class="flex justify-center gap-2 mb-3">
						{#each weekdays as day}
							<button
								type="button"
								class="w-12 h-12 rounded-full font-bold text-lg transition-all {selectedWeekdays.includes(day.val) 
									? 'bg-primary text-primary-content shadow-lg scale-110' 
									: 'bg-base-300 text-base-content/50 hover:bg-base-content/10'}"
								onclick={() => toggleWeekday(day.val)}
								title={day.name}
							>
								{day.short}
							</button>
						{/each}
					</div>

					<!-- Quick selects -->
					<div class="flex justify-center gap-2">
						<button type="button" class="btn btn-xs btn-ghost" onclick={selectWeekdays}>Weekdays</button>
						<button type="button" class="btn btn-xs btn-ghost" onclick={selectWeekend}>Weekend</button>
						<button type="button" class="btn btn-xs btn-ghost" onclick={selectAllDays}>Every day</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Month Day Selection -->
		{#if frequency === 'monthly' || frequency === 'yearly'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">On which day of the month?</h4>
					<div class="flex justify-center flex-wrap gap-1">
						{#each Array.from({length: 28}, (_, i) => i + 1) as d}
							<button
								type="button"
								class="btn btn-sm w-10 {selectedMonthDay === d ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => selectedMonthDay = d}
							>
								{d}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Month Selection for Yearly -->
		{#if frequency === 'yearly'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">In which month?</h4>
					<div class="flex justify-center flex-wrap gap-2">
						{#each months as month, i}
							<button
								type="button"
								class="btn btn-sm {selectedMonth === i + 1 ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => selectedMonth = i + 1}
							>
								{month}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Custom Expression -->
		{#if frequency === 'custom'}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-medium text-center mb-3">Enter custom cron expression</h4>
					<input
						type="text"
						bind:value={customExpression}
						class="input input-bordered w-full font-mono text-center text-lg"
						placeholder="* * * * *"
					/>
					<p class="text-xs text-center text-base-content/50 mt-2">
						Format: minute hour day month weekday
					</p>
				</div>
			</div>
		{/if}

		<!-- Format Reference -->
		<div class="flex justify-center">
			<div class="inline-flex items-center gap-1 text-xs font-mono bg-base-200 rounded-lg p-2">
				<span class="px-2 py-1 bg-blue-500/20 rounded">MIN</span>
				<span class="px-2 py-1 bg-green-500/20 rounded">HR</span>
				<span class="px-2 py-1 bg-yellow-500/20 rounded">DAY</span>
				<span class="px-2 py-1 bg-orange-500/20 rounded">MON</span>
				<span class="px-2 py-1 bg-purple-500/20 rounded">DOW</span>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

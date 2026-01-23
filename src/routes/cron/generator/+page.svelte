<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { Cron } from 'croner';
	import cronstrue from 'cronstrue';
	import { onMount } from 'svelte';

	// Field definitions
	const fields = [
		{ name: 'minute', label: 'Minute', short: 'MIN', min: 0, max: 59, color: 'bg-blue-500' },
		{ name: 'hour', label: 'Hour', short: 'HR', min: 0, max: 23, color: 'bg-green-500' },
		{ name: 'dayOfMonth', label: 'Day of Month', short: 'DAY', min: 1, max: 31, color: 'bg-yellow-500' },
		{ name: 'month', label: 'Month', short: 'MON', min: 1, max: 12, color: 'bg-orange-500' },
		{ name: 'dayOfWeek', label: 'Day of Week', short: 'DOW', min: 0, max: 6, color: 'bg-purple-500' }
	];

	const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	// State - direct field values
	let fieldValues = $state<Record<string, string>>({
		minute: '0',
		hour: '9',
		dayOfMonth: '*',
		month: '*',
		dayOfWeek: '1-5'
	});

	let includeSeconds = $state(false);
	let secondsValue = $state('0');

	// Presets
	const presets = [
		{ label: '⚡ Every minute', expr: '* * * * *' },
		{ label: '⏱️ Every 5 min', expr: '*/5 * * * *' },
		{ label: '🕐 Hourly', expr: '0 * * * *' },
		{ label: '☀️ Daily 9am', expr: '0 9 * * *' },
		{ label: '💼 Weekdays 9am', expr: '0 9 * * 1-5' },
		{ label: '📅 Weekly Sun', expr: '0 0 * * 0' },
		{ label: '🗓️ Monthly 1st', expr: '0 0 1 * *' }
	];

	// Generate expression from field values
	function getCronExpression(): string {
		const base = `${fieldValues.minute} ${fieldValues.hour} ${fieldValues.dayOfMonth} ${fieldValues.month} ${fieldValues.dayOfWeek}`;
		if (includeSeconds) {
			return `${secondsValue} ${base}`;
		}
		return base;
	}

	// Compute derived values without state mutation
	let cronExpression = $derived(getCronExpression());

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

	// Apply preset
	function applyPreset(expr: string) {
		const parts = expr.split(' ');
		if (parts.length >= 5) {
			fieldValues.minute = parts[0];
			fieldValues.hour = parts[1];
			fieldValues.dayOfMonth = parts[2];
			fieldValues.month = parts[3];
			fieldValues.dayOfWeek = parts[4];
		}
	}

	// Field mode helpers
	type FieldMode = 'every' | 'specific' | 'range' | 'step';
	
	function getFieldMode(value: string): FieldMode {
		if (value === '*') return 'every';
		if (value.startsWith('*/')) return 'step';
		if (value.includes('-') && !value.includes(',')) return 'range';
		return 'specific';
	}

	function setFieldMode(fieldName: string, mode: FieldMode) {
		const field = fields.find(f => f.name === fieldName)!;
		switch (mode) {
			case 'every':
				fieldValues[fieldName] = '*';
				break;
			case 'specific':
				fieldValues[fieldName] = String(field.min);
				break;
			case 'range':
				fieldValues[fieldName] = `${field.min}-${field.max}`;
				break;
			case 'step':
				fieldValues[fieldName] = '*/5';
				break;
		}
	}

	// Generate options for specific values
	function getValueOptions(field: typeof fields[0]): { value: number; label: string }[] {
		const options: { value: number; label: string }[] = [];
		for (let i = field.min; i <= field.max; i++) {
			let label = String(i);
			if (field.name === 'month' && i >= 1 && i <= 12) label = monthNames[i - 1];
			if (field.name === 'dayOfWeek' && i >= 0 && i <= 6) label = dayNames[i];
			if (field.name === 'hour') label = `${i.toString().padStart(2, '0')}:00`;
			options.push({ value: i, label });
		}
		return options;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Generated Expression - Top -->
		<div class="card bg-success/10 border border-success/20 rounded-2xl">
			<div class="card-body p-5">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<p class="text-xs text-base-content/60 mb-1">Generated Expression</p>
						<code class="text-2xl font-mono font-bold tracking-wider">{cronExpression}</code>
						<p class="text-sm text-base-content/70 mt-2">{description()}</p>
					</div>
					<CopyButton text={cronExpression} size="sm" />
				</div>

				{#if nextRuns().length > 0}
					<div class="mt-4 pt-3 border-t border-base-content/10">
						<p class="text-xs text-base-content/50 mb-2">Next runs:</p>
						<div class="flex flex-wrap gap-2">
							{#each nextRuns() as run}
								<span class="badge badge-sm font-mono">{run.toLocaleString()}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Presets -->
		<div class="flex flex-wrap gap-2 justify-center">
			{#each presets as preset}
				<button
					type="button"
					class="btn btn-sm btn-ghost"
					onclick={() => applyPreset(preset.expr)}
				>
					{preset.label}
				</button>
			{/each}
		</div>

		<!-- Quartz Toggle -->
		<label class="flex items-center justify-center gap-3 cursor-pointer">
			<input type="checkbox" bind:checked={includeSeconds} class="toggle toggle-sm toggle-primary" />
			<span class="text-sm">Include seconds (Quartz format)</span>
		</label>

		{#if includeSeconds}
			<div class="flex items-center justify-center gap-2">
				<span class="text-sm font-medium">Seconds:</span>
				<input
					type="text"
					bind:value={secondsValue}
					class="input input-sm input-bordered w-20 font-mono text-center"
					placeholder="0"
				/>
			</div>
		{/if}

		<!-- Field Editors -->
		<div class="space-y-4">
			{#each fields as field}
				{@const mode = getFieldMode(fieldValues[field.name])}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<!-- Header -->
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<span class="w-3 h-3 rounded-full {field.color}"></span>
								<span class="font-bold">{field.label}</span>
							</div>
							<code class="text-sm bg-base-300 px-2 py-1 rounded font-mono">{fieldValues[field.name]}</code>
						</div>

						<!-- Mode Selector -->
						<div class="flex flex-wrap gap-1 mb-3">
							{#each [
								{ mode: 'every', label: 'Every (*)' },
								{ mode: 'specific', label: 'Specific' },
								{ mode: 'range', label: 'Range (-)' },
								{ mode: 'step', label: 'Step (/)' }
							] as opt}
								<button
									type="button"
									class="btn btn-xs {mode === opt.mode ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => setFieldMode(field.name, opt.mode as FieldMode)}
								>
									{opt.label}
								</button>
							{/each}
						</div>

						<!-- Value Editor based on mode -->
						{#if mode === 'specific'}
							<div class="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
								{#each getValueOptions(field) as opt}
									{@const isSelected = fieldValues[field.name].split(',').includes(String(opt.value))}
									<button
										type="button"
										class="btn btn-xs {isSelected ? 'btn-primary' : 'btn-ghost'}"
										onclick={() => {
											const current = fieldValues[field.name].split(',').filter(v => v);
											if (isSelected) {
												if (current.length > 1) {
													fieldValues[field.name] = current.filter(v => v !== String(opt.value)).join(',');
												}
											} else {
												fieldValues[field.name] = [...current, String(opt.value)].sort((a,b) => Number(a) - Number(b)).join(',');
											}
										}}
									>
										{opt.label}
									</button>
								{/each}
							</div>
						{:else if mode === 'range'}
							{@const rangeParts = fieldValues[field.name].split('-')}
							{@const rangeStart = rangeParts[0] || String(field.min)}
							{@const rangeEnd = rangeParts[1] || String(field.max)}
							<div class="flex items-center gap-2 bg-base-300/50 p-3 rounded-lg">
								<span class="text-sm font-medium">From</span>
								<select
									class="select select-sm select-bordered bg-base-100"
									onchange={(e) => {
										fieldValues[field.name] = `${e.currentTarget.value}-${rangeEnd}`;
									}}
								>
									{#each getValueOptions(field) as opt}
										<option value={opt.value} selected={String(opt.value) === rangeStart}>{opt.label}</option>
									{/each}
								</select>
								<span class="text-sm font-medium">to</span>
								<select
									class="select select-sm select-bordered bg-base-100"
									onchange={(e) => {
										fieldValues[field.name] = `${rangeStart}-${e.currentTarget.value}`;
									}}
								>
									{#each getValueOptions(field) as opt}
										<option value={opt.value} selected={String(opt.value) === rangeEnd}>{opt.label}</option>
									{/each}
								</select>
							</div>
						{:else if mode === 'step'}
							<div class="flex items-center gap-2">
								<span class="text-sm">Every</span>
								<input
									type="number"
									class="input input-sm input-bordered w-16 text-center"
									min="1"
									max={field.max}
									value={fieldValues[field.name].replace('*/', '') || '5'}
									oninput={(e) => fieldValues[field.name] = `*/${e.currentTarget.value}`}
								/>
								<span class="text-sm">{field.label.toLowerCase()}(s)</span>
							</div>
						{/if}

						<!-- Direct input -->
						<div class="mt-2 pt-2 border-t border-base-300">
							<div class="flex items-center gap-2">
								<span class="text-xs text-base-content/50">Custom:</span>
								<input
									type="text"
									class="input input-xs input-bordered flex-1 font-mono"
									value={fieldValues[field.name]}
									oninput={(e) => fieldValues[field.name] = e.currentTarget.value}
								/>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">Cron Syntax</h4>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
					<div><code class="bg-base-300 px-1 rounded">*</code> any</div>
					<div><code class="bg-base-300 px-1 rounded">,</code> list (1,3,5)</div>
					<div><code class="bg-base-300 px-1 rounded">-</code> range (1-5)</div>
					<div><code class="bg-base-300 px-1 rounded">/</code> step (*/5)</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

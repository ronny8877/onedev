<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';
	
	const cycles = [
		{ name: '1 min', duration: 60 },
		{ name: '2 min', duration: 120 },
		{ name: '3 min', duration: 180 }
	];

	// Breathing pattern: inhale 4s, hold 4s, exhale 6s = 14s per breath
	const INHALE_DURATION = 4;
	const HOLD_DURATION = 4;
	const EXHALE_DURATION = 6;
	const BREATH_CYCLE = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION;

	let selectedCycle = $state(0);
	let isRunning = $state(false);
	let phase = $state<Phase>('idle');
	let phaseProgress = $state(0); // 0 to 1
	let totalElapsed = $state(0);
	let breathCount = $state(0);
	
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function getPhaseText(): string {
		switch (phase) {
			case 'inhale': return 'Breathe In';
			case 'hold': return 'Hold';
			case 'exhale': return 'Breathe Out';
			default: return 'Ready';
		}
	}

	function getCircleScale(): number {
		switch (phase) {
			case 'inhale': return 0.6 + (phaseProgress * 0.4);
			case 'hold': return 1;
			case 'exhale': return 1 - (phaseProgress * 0.4);
			default: return 0.6;
		}
	}

	function tick() {
		totalElapsed += 0.05; // 50ms intervals

		// Check if complete
		if (totalElapsed >= cycles[selectedCycle].duration) {
			stop();
			return;
		}

		// Calculate current position in breath cycle
		const cyclePosition = totalElapsed % BREATH_CYCLE;

		if (cyclePosition < INHALE_DURATION) {
			if (phase !== 'inhale') {
				phase = 'inhale';
				breathCount++;
			}
			phaseProgress = cyclePosition / INHALE_DURATION;
		} else if (cyclePosition < INHALE_DURATION + HOLD_DURATION) {
			phase = 'hold';
			phaseProgress = (cyclePosition - INHALE_DURATION) / HOLD_DURATION;
		} else {
			phase = 'exhale';
			phaseProgress = (cyclePosition - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION;
		}
	}

	function start() {
		if (isRunning) return;
		isRunning = true;
		totalElapsed = 0;
		breathCount = 0;
		phase = 'inhale';
		phaseProgress = 0;
		intervalId = setInterval(tick, 50);
	}

	function stop() {
		isRunning = false;
		phase = 'idle';
		phaseProgress = 0;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<ToolWrapper
	title="Breathing Timer"
	description="Guided breathing exercise. Inhale, hold, exhale. Visual only, no audio."
>
	<div class="flex flex-col items-center gap-8 py-8">
		<!-- Cycle Selector -->
		<div class="flex gap-2">
			{#each cycles as cycle, i}
				<button
					class="btn {selectedCycle === i ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => { selectedCycle = i; if (!isRunning) totalElapsed = 0; }}
					disabled={isRunning}
				>
					{cycle.name}
				</button>
			{/each}
		</div>

		<!-- Breathing Circle -->
		<div class="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80">
			<!-- Outer ring -->
			<div class="absolute inset-0 rounded-full border-4 border-base-300/30"></div>
			
			<!-- Animated breathing circle -->
			<div 
				class="rounded-full transition-all duration-100 ease-out flex items-center justify-center
					   {phase === 'inhale' ? 'bg-success/20' : phase === 'hold' ? 'bg-warning/20' : phase === 'exhale' ? 'bg-info/20' : 'bg-base-300/20'}"
				style="width: {getCircleScale() * 100}%; height: {getCircleScale() * 100}%;"
			>
				<!-- Inner glow ring -->
				<div 
					class="absolute rounded-full opacity-50 blur-sm
						   {phase === 'inhale' ? 'bg-success' : phase === 'hold' ? 'bg-warning' : phase === 'exhale' ? 'bg-info' : 'bg-base-300'}"
					style="width: {getCircleScale() * 90}%; height: {getCircleScale() * 90}%;"
				></div>
				
				<!-- Phase text -->
				<div class="relative z-10 text-center">
					<div class="text-2xl sm:text-3xl font-semibold">
						{getPhaseText()}
					</div>
					{#if isRunning}
						<div class="text-lg text-base-content/60 mt-2">
							{formatTime(cycles[selectedCycle].duration - totalElapsed)}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="flex gap-3">
			{#if !isRunning}
				<button class="btn btn-primary btn-lg px-8 gap-2" onclick={start}>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z"/>
					</svg>
					Start
				</button>
			{:else}
				<button class="btn btn-error btn-lg px-8 gap-2" onclick={stop}>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M6 6h12v12H6z"/>
					</svg>
					Stop
				</button>
			{/if}
		</div>

		<!-- Breath Counter -->
		{#if breathCount > 0 || isRunning}
			<div class="badge badge-lg badge-ghost gap-2">
				<span class="text-lg">🌬️</span>
				{breathCount} breath{breathCount !== 1 ? 's' : ''}
			</div>
		{/if}

		<!-- Pattern Info -->
		<div class="card bg-base-200 max-w-md">
			<div class="card-body py-4 text-sm text-base-content/70">
				<p><strong>4-4-6 Pattern:</strong> Inhale for 4 seconds, hold for 4 seconds, exhale for 6 seconds.</p>
			</div>
		</div>
	</div>
</ToolWrapper>

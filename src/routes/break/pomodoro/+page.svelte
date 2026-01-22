<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	// Timer state
	let minutes = $state(25);
	let seconds = $state(0);
	let isRunning = $state(false);
	let intervalId: ReturnType<typeof setInterval> | null = null;

	// Presets: [work minutes, break minutes]
	type Preset = { name: string; work: number; break: number };
	const presets: Preset[] = [
		{ name: '25 / 5', work: 25, break: 5 },
		{ name: '50 / 10', work: 50, break: 10 }
	];
	let currentPreset = $state(0);
	let isBreak = $state(false);
	let sessions = $state(0);

	function setPreset(index: number) {
		currentPreset = index;
		reset();
	}

	function tick() {
		if (seconds === 0) {
			if (minutes === 0) {
				// Timer complete
				playSound();
				if (isBreak) {
					// Break over, back to work
					isBreak = false;
					sessions++;
					minutes = presets[currentPreset].work;
				} else {
					// Work session complete, start break
					isBreak = true;
					minutes = presets[currentPreset].break;
				}
				seconds = 0;
				pause();
				return;
			}
			minutes--;
			seconds = 59;
		} else {
			seconds--;
		}
	}

	function start() {
		if (!isRunning) {
			isRunning = true;
			intervalId = setInterval(tick, 1000);
		}
	}

	function pause() {
		isRunning = false;
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	function reset() {
		pause();
		isBreak = false;
		minutes = presets[currentPreset].work;
		seconds = 0;
	}

	function playSound() {
		// Simple beep using Web Audio API
		try {
			const ctx = new AudioContext();
			const oscillator = ctx.createOscillator();
			const gain = ctx.createGain();
			oscillator.connect(gain);
			gain.connect(ctx.destination);
			oscillator.frequency.value = 800;
			oscillator.type = 'sine';
			gain.gain.setValueAtTime(0.3, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
			oscillator.start(ctx.currentTime);
			oscillator.stop(ctx.currentTime + 0.5);
		} catch {
			// Audio not available
		}
	}

	function formatTime(m: number, s: number): string {
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<ToolWrapper>
	<div class="flex flex-col items-center gap-8 py-8">
		<!-- Preset Selector -->
		<div class="flex gap-2">
			{#each presets as preset, i}
				<button
					class="btn {currentPreset === i ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => setPreset(i)}
					disabled={isRunning}
				>
					{preset.name}
				</button>
			{/each}
		</div>

		<!-- Timer Display -->
		<div class="relative">
			<div 
				class="flex items-center justify-center rounded-full w-72 h-72 sm:w-80 sm:h-80 
					   border-8 transition-colors duration-500
					   {isBreak ? 'border-success/30 bg-success/5' : 'border-primary/30 bg-primary/5'}"
			>
				<div class="text-center">
					<div class="text-6xl sm:text-7xl font-bold font-mono tracking-tight">
						{formatTime(minutes, seconds)}
					</div>
					<div class="text-lg text-base-content/60 mt-2 font-medium">
						{isBreak ? '☕ Break Time' : '🎯 Focus Time'}
					</div>
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
				<button class="btn btn-warning btn-lg px-8 gap-2" onclick={pause}>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
					</svg>
					Pause
				</button>
			{/if}
			<button class="btn btn-ghost btn-lg" onclick={reset} disabled={minutes === presets[currentPreset].work && seconds === 0 && !isBreak}>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
				</svg>
				Reset
			</button>
		</div>

		<!-- Session Counter -->
		{#if sessions > 0}
			<div class="badge badge-lg badge-ghost gap-2">
				<span class="text-lg">🍅</span>
				{sessions} session{sessions > 1 ? 's' : ''} completed
			</div>
		{/if}

		<!-- Tips -->
		<div class="card bg-base-200 max-w-md mt-4">
			<div class="card-body py-4 text-sm text-base-content/70">
				<p><strong>Tip:</strong> Work in focused bursts, then take a short break. After 4 sessions, take a longer break.</p>
			</div>
		</div>
	</div>
</ToolWrapper>

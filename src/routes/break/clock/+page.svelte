<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

	type ClockMode = 'digital' | 'analog';

	let showSeconds = $state(true);
	let use24Hour = $state(true);
	let isDark = $state(true);
	let clockMode = $state<ClockMode>('digital');
	let isFullscreen = $state(false);
	
	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);
	let ampm = $state('AM');

	function updateTime() {
		const now = new Date();
		hours = now.getHours();
		minutes = now.getMinutes();
		seconds = now.getSeconds();
		ampm = hours >= 12 ? 'PM' : 'AM';
	}

	function formatHours(h: number): string {
		if (use24Hour) {
			return h.toString().padStart(2, '0');
		}
		const h12 = h % 12 || 12;
		return h12.toString().padStart(2, '0');
	}

	function formatTime(): string {
		const h = formatHours(hours);
		const m = minutes.toString().padStart(2, '0');
		const s = seconds.toString().padStart(2, '0');
		let time = `${h}:${m}`;
		if (showSeconds) time += `:${s}`;
		if (!use24Hour) time += ` ${ampm}`;
		return time;
	}

	function enterFullscreen() {
		isFullscreen = true;
	}

	function exitFullscreen() {
		isFullscreen = false;
	}

	// Update clock every second
	$effect(() => {
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	});
</script>

<ToolWrapper>
	<div 
		class="flex flex-col items-center justify-center min-h-[60vh] rounded-3xl transition-colors duration-500 relative
			   {isDark ? 'bg-neutral text-neutral-content' : 'bg-base-200'}"
	>
		<!-- Controls (top right) -->
		<div class="absolute top-4 right-4 flex gap-2">
			<!-- Clock Mode Toggle -->
			<div class="btn-group">
				<button 
					class="btn btn-sm {clockMode === 'digital' ? 'btn-active' : ''}"
					onclick={() => clockMode = 'digital'}
				>
					Digital
				</button>
				<button 
					class="btn btn-sm {clockMode === 'analog' ? 'btn-active' : ''}"
					onclick={() => clockMode = 'analog'}
				>
					Analog
				</button>
			</div>

			<!-- Dark/Light Toggle -->
			<label class="swap swap-rotate btn btn-sm btn-ghost">
				<input type="checkbox" bind:checked={isDark} />
				<svg class="swap-off w-5 h-5 fill-current" viewBox="0 0 24 24">
					<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Z"/>
				</svg>
				<svg class="swap-on w-5 h-5 fill-current" viewBox="0 0 24 24">
					<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
				</svg>
			</label>
			
			<button class="btn btn-sm btn-ghost" onclick={enterFullscreen} aria-label="Enter Fullscreen">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
				</svg>
			</button>
		</div>

		<!-- Clock Display -->
		<div class="text-center select-none">
			{#if clockMode === 'digital'}
				<div class="font-mono font-bold tracking-tight leading-none"
					 style="font-size: clamp(4rem, 20vw, 12rem);">
					{formatTime()}
				</div>
			{:else}
				<!-- Analog Clock -->
				<svg class="w-64 h-64 sm:w-80 sm:h-80" viewBox="0 0 200 200">
					<!-- Clock face -->
					<circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="3" opacity="0.3"/>
					
					<!-- Hour markers -->
					{#each Array(12) as _, i}
						<line 
							x1="100" y1="15" x2="100" y2="25"
							stroke="currentColor" 
							stroke-width="3"
							transform="rotate({i * 30}, 100, 100)"
							opacity="0.6"
						/>
					{/each}
					
					<!-- Minute markers -->
					{#each Array(60) as _, i}
						{#if i % 5 !== 0}
							<line 
								x1="100" y1="15" x2="100" y2="20"
								stroke="currentColor" 
								stroke-width="1"
								transform="rotate({i * 6}, 100, 100)"
								opacity="0.3"
							/>
						{/if}
					{/each}
					
					<!-- Hour hand -->
					<line 
						x1="100" y1="100" x2="100" y2="50"
						stroke="currentColor" 
						stroke-width="6"
						stroke-linecap="round"
						transform="rotate({(hours % 12) * 30 + minutes * 0.5}, 100, 100)"
					/>
					
					<!-- Minute hand -->
					<line 
						x1="100" y1="100" x2="100" y2="30"
						stroke="currentColor" 
						stroke-width="4"
						stroke-linecap="round"
						transform="rotate({minutes * 6}, 100, 100)"
					/>
					
					<!-- Second hand (toggleable) -->
					{#if showSeconds}
						<line 
							x1="100" y1="110" x2="100" y2="25"
							stroke="#ef4444" 
							stroke-width="2"
							stroke-linecap="round"
							transform="rotate({seconds * 6}, 100, 100)"
						/>
					{/if}
					
					<!-- Center dot -->
					<circle cx="100" cy="100" r="6" fill="currentColor"/>
				</svg>
			{/if}
		</div>

		<!-- Bottom Controls -->
		<div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
			<label class="label cursor-pointer gap-2">
				<span class="label-text text-sm {isDark ? 'text-neutral-content/70' : 'text-base-content/70'}">Seconds</span>
				<input type="checkbox" class="toggle toggle-sm" bind:checked={showSeconds} />
			</label>
			<label class="label cursor-pointer gap-2">
				<span class="label-text text-sm {isDark ? 'text-neutral-content/70' : 'text-base-content/70'}">24h</span>
				<input type="checkbox" class="toggle toggle-sm" bind:checked={use24Hour} />
			</label>
		</div>
	</div>
</ToolWrapper>

<!-- Fullscreen Mode -->
<FullscreenOverlay isFullscreen={isFullscreen} onExit={exitFullscreen}>
	{#snippet children()}
		<div class="w-full h-full flex items-center justify-center {isDark ? 'bg-neutral text-neutral-content' : 'bg-base-100 text-base-content'}">
			{#if clockMode === 'digital'}
				<div class="font-mono font-bold tracking-tight leading-none"
					 style="font-size: clamp(6rem, 25vw, 20rem);">
					{formatTime()}
				</div>
			{:else}
				<!-- Analog Clock Fullscreen -->
				<svg class="w-[70vh] h-[70vh] max-w-[90vw] max-h-[90vw]" viewBox="0 0 200 200">
					<circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
					{#each Array(12) as _, i}
						<line x1="100" y1="12" x2="100" y2="22" stroke="currentColor" stroke-width="3" transform="rotate({i * 30}, 100, 100)" opacity="0.6"/>
					{/each}
					{#each Array(60) as _, i}
						{#if i % 5 !== 0}
							<line x1="100" y1="12" x2="100" y2="17" stroke="currentColor" stroke-width="1" transform="rotate({i * 6}, 100, 100)" opacity="0.3"/>
						{/if}
					{/each}
					<line x1="100" y1="100" x2="100" y2="50" stroke="currentColor" stroke-width="6" stroke-linecap="round" transform="rotate({(hours % 12) * 30 + minutes * 0.5}, 100, 100)"/>
					<line x1="100" y1="100" x2="100" y2="30" stroke="currentColor" stroke-width="4" stroke-linecap="round" transform="rotate({minutes * 6}, 100, 100)"/>
					{#if showSeconds}
						<line x1="100" y1="110" x2="100" y2="25" stroke="#ef4444" stroke-width="2" stroke-linecap="round" transform="rotate({seconds * 6}, 100, 100)"/>
					{/if}
					<circle cx="100" cy="100" r="5" fill="currentColor"/>
				</svg>
			{/if}
		</div>
	{/snippet}

	{#snippet controls()}
		<button 
			class="btn btn-sm {clockMode === 'digital' ? 'btn-primary' : 'btn-ghost bg-black/50 text-white'}"
			onclick={() => clockMode = 'digital'}
		>
			Digital
		</button>
		<button 
			class="btn btn-sm {clockMode === 'analog' ? 'btn-primary' : 'btn-ghost bg-black/50 text-white'}"
			onclick={() => clockMode = 'analog'}
		>
			Analog
		</button>
		<label class="flex items-center gap-1 text-white text-sm">
			<input type="checkbox" class="toggle toggle-xs" bind:checked={showSeconds} />
			Sec
		</label>
		<label class="flex items-center gap-1 text-white text-sm">
			<input type="checkbox" class="toggle toggle-xs" bind:checked={use24Hour} />
			24h
		</label>
	{/snippet}
</FullscreenOverlay>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import FullscreenOverlay from '$lib/components/ui/FullscreenOverlay.svelte';

	type AmbientScene = 'rain' | 'cafe';
	
	let isPlaying = $state(false);
	let volume = $state(0.5);
	let currentScene = $state<AmbientScene>('rain');
	let isFullscreen = $state(false);
	
	let audioElement: HTMLAudioElement | null = null;
	let videoRef: HTMLVideoElement | null = $state(null);
	let fullscreenVideoRef: HTMLVideoElement | null = $state(null);

	const scenes: { id: AmbientScene; name: string; icon: string; audio: string; video: string }[] = [
		{ id: 'rain', name: 'Rain', icon: 'cloud-rain', audio: '/rain-ambiance.mp3', video: '/rain-ambiance.mp4' },
		{ id: 'cafe', name: 'Café', icon: 'coffee', audio: '/cafe-ambiance.mp3', video: '/cafe-ambiance.mp4' }
	];

	function getCurrentScene() {
		return scenes.find(s => s.id === currentScene)!;
	}

	function togglePlay() {
		if (isPlaying) {
			audioElement?.pause();
			videoRef?.pause();
			fullscreenVideoRef?.pause();
			isPlaying = false;
		} else {
			if (!audioElement) {
				audioElement = new Audio(getCurrentScene().audio);
				audioElement.loop = true;
				audioElement.volume = volume;
			}
			audioElement.play();
			videoRef?.play();
			fullscreenVideoRef?.play();
			isPlaying = true;
		}
	}

	function selectScene(scene: AmbientScene) {
		const wasPlaying = isPlaying;
		if (audioElement) {
			audioElement.pause();
			audioElement = null;
		}
		currentScene = scene;
		isPlaying = false;
		
		if (wasPlaying) {
			setTimeout(() => togglePlay(), 100);
		}
	}

	function enterFullscreen() {
		isFullscreen = true;
		if (!isPlaying) togglePlay();
	}

	function exitFullscreen() {
		isFullscreen = false;
	}

	// Update volume when slider changes
	$effect(() => {
		const currentVolume = volume;
		if (audioElement) {
			audioElement.volume = currentVolume;
		}
	});

	// Sync video playback with audio state
	$effect(() => {
		if (videoRef) {
			videoRef.muted = true;
			if (isPlaying) {
				videoRef.play().catch(() => {});
			} else {
				videoRef.pause();
			}
		}
		if (fullscreenVideoRef) {
			fullscreenVideoRef.muted = true;
			if (isPlaying) {
				fullscreenVideoRef.play().catch(() => {});
			} else {
				fullscreenVideoRef.pause();
			}
		}
	});

	$effect(() => {
		return () => {
			if (audioElement) {
				audioElement.pause();
				audioElement = null;
			}
		};
	});
</script>

<style>
	.video-container {
		position: relative;
		overflow: hidden;
	}
	.video-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>

<ToolWrapper noindex>
	<div class="flex flex-col gap-6">
		<!-- Preview Card with Video Background -->
		<div 
			class="video-container relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group bg-neutral"
			onclick={enterFullscreen}
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && enterFullscreen()}
		>
			<!-- Video Background -->
			<video 
				bind:this={videoRef}
				class="video-bg"
				src={getCurrentScene().video}
				loop
				muted
				playsinline
				poster=""
			></video>
			
			<!-- Gradient overlay for better visibility -->
			<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
			

			
			<!-- Hover overlay -->
			<div class="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
				<div class="btn btn-lg btn-circle bg-white/20 border-none text-white backdrop-blur-sm">
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex gap-2">
				{#each scenes as scene}
					<button
						class="btn gap-2 {currentScene === scene.id ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => selectScene(scene.id)}
					>
						<span class="text-lg"><AppIcon name={scene.icon} size={18} /></span>
						{scene.name}
					</button>
				{/each}
			</div>

			<div class="flex gap-2">
				<button
					class="btn btn-lg gap-2 {isPlaying ? 'btn-error' : 'btn-success'}"
					onclick={togglePlay}
				>
					{#if isPlaying}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
						</svg>
						Pause
					{:else}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z"/>
						</svg>
						Play
					{/if}
				</button>

				<button class="btn btn-lg btn-ghost" onclick={enterFullscreen} aria-label="Enter fullscreen">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
					</svg>
				</button>
			</div>
		</div>

		<!-- Volume Control -->
		<div class="flex items-center gap-4 max-w-sm">
			<svg class="w-5 h-5 text-base-content/50 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
			</svg>
			<input type="range" min="0" max="1" step="0.05" bind:value={volume} class="range range-sm range-primary flex-1" />
			<svg class="w-6 h-6 text-base-content/50 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
			</svg>
		</div>

		<p class="text-xs text-base-content/40">
			Sounds from <a href="https://pixabay.com" target="_blank" rel="noopener" class="link">Pixabay</a>
		</p>
	</div>
</ToolWrapper>

<FullscreenOverlay isFullscreen={isFullscreen} onExit={exitFullscreen}>
	{#snippet children()}
		<div class="video-container w-full h-full bg-black">
			<!-- Fullscreen Video Background -->
			<video 
				bind:this={fullscreenVideoRef}
				class="video-bg"
				src={getCurrentScene().video}
				loop
				muted
				playsinline
			></video>
			

		</div>
	{/snippet}

	{#snippet controls()}
		{#each scenes as scene}
			<button
				class="btn btn-sm {currentScene === scene.id ? 'btn-primary' : 'btn-ghost bg-black/50 text-white hover:bg-black/70'}"
				onclick={() => selectScene(scene.id)}
			>
				<AppIcon name={scene.icon} size={16} />
			</button>
		{/each}
		<input type="range" min="0" max="1" step="0.05" bind:value={volume} class="range range-xs range-primary w-24" />
		<button
			class="btn btn-sm {isPlaying ? 'btn-error' : 'btn-success'}"
			onclick={togglePlay}
		>
			{isPlaying ? '⏸' : '▶'}
		</button>
	{/snippet}
</FullscreenOverlay>

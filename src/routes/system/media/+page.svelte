<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { fade, slide, scale } from 'svelte/transition';

	// Device state
	interface DeviceInfo {
		kind: 'audioinput' | 'audiooutput' | 'videoinput';
		label: string;
		deviceId: string;
	}

	let cameras = $state<DeviceInfo[]>([]);
	let microphones = $state<DeviceInfo[]>([]);
	let speakers = $state<DeviceInfo[]>([]);

	let cameraLoading = $state(false);
	let micLoading = $state(false);
	let speakerLoading = $state(false);

	let cameraError = $state<string | null>(null);
	let micError = $state<string | null>(null);
	let speakerError = $state<string | null>(null);

	let cameraChecked = $state(false);
	let micChecked = $state(false);
	let speakerChecked = $state(false);

	// Preview state
	let videoPreviewStream = $state<MediaStream | null>(null);
	let audioPreviewStream = $state<MediaStream | null>(null);
	let videoRef: HTMLVideoElement;
	let selectedCameraId = $state<string | null>(null);
	let selectedMicId = $state<string | null>(null);

	// Audio visualization
	let audioContext = $state<AudioContext | null>(null);
	let analyser = $state<AnalyserNode | null>(null);
	let audioLevel = $state(0);
	let animationFrameId = $state<number | null>(null);
	let loopbackEnabled = $state(false);
	let gainNode = $state<GainNode | null>(null);

	async function checkCameras() {
		cameraLoading = true;
		cameraError = null;
		cameras = [];

		try {
			// Request permission first
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			stream.getTracks().forEach(track => track.stop());

			// Now enumerate devices
			const devices = await navigator.mediaDevices.enumerateDevices();
			cameras = devices
				.filter(d => d.kind === 'videoinput')
				.map((d, idx) => ({
					kind: d.kind as 'videoinput',
					label: d.label || `Camera ${idx + 1}`,
					deviceId: d.deviceId
				}));

			cameraChecked = true;
		} catch (err) {
			cameraError = err instanceof Error ? err.message : 'Failed to access cameras';
		} finally {
			cameraLoading = false;
		}
	}

	async function checkMicrophones() {
		micLoading = true;
		micError = null;
		microphones = [];

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			stream.getTracks().forEach(track => track.stop());

			const devices = await navigator.mediaDevices.enumerateDevices();
			microphones = devices
				.filter(d => d.kind === 'audioinput')
				.map((d, idx) => ({
					kind: d.kind as 'audioinput',
					label: d.label || `Microphone ${idx + 1}`,
					deviceId: d.deviceId
				}));

			micChecked = true;
		} catch (err) {
			micError = err instanceof Error ? err.message : 'Failed to access microphones';
		} finally {
			micLoading = false;
		}
	}

	async function checkSpeakers() {
		speakerLoading = true;
		speakerError = null;
		speakers = [];

		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			speakers = devices
				.filter(d => d.kind === 'audiooutput')
				.map((d, idx) => ({
					kind: d.kind as 'audiooutput',
					label: d.label || `Speaker ${idx + 1}`,
					deviceId: d.deviceId
				}));

			if (speakers.length === 0) {
				speakerError = 'No speakers found or browser does not support speaker enumeration';
			}

			speakerChecked = true;
		} catch (err) {
			speakerError = err instanceof Error ? err.message : 'Failed to enumerate speakers';
		} finally {
			speakerLoading = false;
		}
	}

	function checkAll() {
		checkCameras();
		checkMicrophones();
		checkSpeakers();
	}

	async function previewCamera(deviceId: string) {
		stopVideoPreview();
		selectedCameraId = deviceId;

		try {
			videoPreviewStream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } }
			});
			
			// Wait for next tick to ensure videoRef is available
			await new Promise(resolve => setTimeout(resolve, 50));
			
			if (videoRef) {
				videoRef.srcObject = videoPreviewStream;
				// Explicitly play the video
				try {
					await videoRef.play();
				} catch (playErr) {
					console.error('Video play failed:', playErr);
				}
			}
		} catch (err) {
			console.error('Failed to start camera preview:', err);
			cameraError = err instanceof Error ? err.message : 'Failed to start camera preview';
		}
	}

	function stopVideoPreview() {
		if (videoPreviewStream) {
			videoPreviewStream.getTracks().forEach(track => track.stop());
			videoPreviewStream = null;
		}
		selectedCameraId = null;
	}

	async function testMic(deviceId: string) {
		// If already testing this mic, stop it
		if (audioPreviewStream && selectedMicId === deviceId) {
			stopMicTest();
			return;
		}

		// Stop any existing test first
		stopMicTest();
		selectedMicId = deviceId;

		try {
			// Request audio with echo cancellation disabled for better testing if desired, or default
			audioPreviewStream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: { exact: deviceId } }
			});

			// Set up Web Audio API for visualization
			audioContext = new AudioContext();
			analyser = audioContext.createAnalyser();
			analyser.fftSize = 256;
			
			const source = audioContext.createMediaStreamSource(audioPreviewStream);
			source.connect(analyser);

			// Optional loopback - connect to destination to hear yourself
			gainNode = audioContext.createGain();
			gainNode.gain.value = loopbackEnabled ? 0.8 : 0;
			source.connect(gainNode);
			gainNode.connect(audioContext.destination);

			// Start visualization loop
			visualizeAudio();
		} catch (err) {
			console.error('Failed to test microphone:', err);
			micError = err instanceof Error ? err.message : 'Failed to test microphone';
			selectedMicId = null;
		}
	}

	function visualizeAudio() {
		if (!analyser) return;

		const dataArray = new Uint8Array(analyser.frequencyBinCount);
		
		function updateLevel() {
			if (!analyser) return;
			
			analyser.getByteFrequencyData(dataArray);
			const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
			audioLevel = Math.min(100, (average / 128) * 100);
			
			animationFrameId = requestAnimationFrame(updateLevel);
		}
		
		updateLevel();
	}

	function stopMicTest() {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
		if (audioContext) {
			audioContext.close();
			audioContext = null;
		}
		if (audioPreviewStream) {
			audioPreviewStream.getTracks().forEach(track => track.stop());
			audioPreviewStream = null;
		}
		analyser = null;
		gainNode = null;
		audioLevel = 0;
		selectedMicId = null;
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			stopVideoPreview();
			stopMicTest();
		};
	});

	let statsText = $derived.by(() => {
		const lines = [];
		if (cameraChecked) lines.push(`Cameras: ${cameras.length} found`);
		if (micChecked) lines.push(`Microphones: ${microphones.length} found`);
		if (speakerChecked) lines.push(`Speakers: ${speakers.length} found`);
		
		if (cameras.length > 0) {
			lines.push('\n--- Cameras ---');
			cameras.forEach(c => lines.push(`- ${c.label}`));
		}
		if (microphones.length > 0) {
			lines.push('\n--- Microphones ---');
			microphones.forEach(m => lines.push(`- ${m.label}`));
		}
		if (speakers.length > 0) {
			lines.push('\n--- Speakers ---');
			speakers.forEach(s => lines.push(`- ${s.label}`));
		}
		return lines.join('\n');
	});
</script>

<ToolWrapper
	title="Media Device Checker"
	description="Check available cameras, microphones, and speakers. Permission is requested only when you click."
>
	<div class="flex flex-col gap-6">
		<ToolActions copyText={statsText} copyLabel="Copy Device List">
			<button class="btn btn-sm btn-ghost" onclick={checkAll}>
				🔄 Check All
			</button>
		</ToolActions>

		<!-- Warning Banner -->
		<div class="alert alert-info rounded-xl" transition:fade={{ duration: 200 }}>
			<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
			<span>Permission will be requested when you click a "Check" button. Nothing is recorded or sent.</span>
		</div>

		<!-- Cameras -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-lg flex items-center gap-2">
						<span>📷</span>
						Cameras
					</h3>
					{#if !cameraChecked}
						<button class="btn btn-primary btn-sm" onclick={checkCameras} disabled={cameraLoading}>
							{#if cameraLoading}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							Check Cameras
						</button>
					{/if}
				</div>

				{#if cameraError}
					<div class="alert alert-error mt-3 rounded-xl text-sm" transition:slide={{ duration: 200 }}>
						<span>{cameraError}</span>
					</div>
				{/if}

				{#if cameras.length > 0}
					<div class="mt-4 grid gap-3" transition:slide={{ duration: 200 }}>
						{#each cameras as camera, i}
							<div class="flex items-center justify-between p-4 rounded-xl bg-base-300/50 transition-all hover:bg-base-300" transition:fade={{ delay: i * 50 }}>
								<div class="flex items-center gap-3">
									<span class="badge badge-primary badge-sm">{i + 1}</span>
									<span class="text-sm font-medium">{camera.label}</span>
								</div>
								<button 
									class="btn btn-sm gap-2"
									class:btn-primary={selectedCameraId !== camera.deviceId}
									class:btn-error={selectedCameraId === camera.deviceId}
									onclick={() => selectedCameraId === camera.deviceId ? stopVideoPreview() : previewCamera(camera.deviceId)}
								>
									{selectedCameraId === camera.deviceId ? 'Stop' : 'Preview'}
								</button>
							</div>
						{/each}
					</div>

					{#if videoPreviewStream}
						<div class="mt-4" transition:scale={{ duration: 200, start: 0.95 }}>
							<div class="flex items-center justify-between mb-3">
								<span class="text-sm font-semibold flex items-center gap-2">
									<span class="inline-block w-2 h-2 bg-error rounded-full animate-pulse"></span>
									Live Camera Preview
								</span>
								<button class="btn btn-ghost btn-xs" onclick={stopVideoPreview}>Close</button>
							</div>
							<div class="relative rounded-2xl overflow-hidden bg-black">
								<video 
									bind:this={videoRef} 
									autoplay 
									playsinline 
									muted 
									class="w-full max-h-72 object-cover"
								></video>
							</div>
						</div>
					{/if}
				{:else if cameraChecked && !cameraError}
					<p class="text-sm text-base-content/60 mt-2">No cameras found.</p>
				{/if}
			</div>
		</div>

		<!-- Microphones -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-lg flex items-center gap-2">
						<span>🎤</span>
						Microphones
					</h3>
					{#if !micChecked}
						<button class="btn btn-primary btn-sm" onclick={checkMicrophones} disabled={micLoading}>
							{#if micLoading}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							Check Mics
						</button>
					{/if}
				</div>

				{#if micError}
					<div class="alert alert-error mt-3 rounded-xl text-sm" transition:slide={{ duration: 200 }}>
						<span>{micError}</span>
					</div>
				{/if}

				{#if microphones.length > 0}
					<div class="mt-4 grid gap-3" transition:slide={{ duration: 200 }}>
						{#each microphones as mic, i}
							<div class="flex items-center justify-between p-4 rounded-xl bg-base-300/50 transition-all hover:bg-base-300" transition:fade={{ delay: i * 50 }}>
								<div class="flex items-center gap-3">
									<span class="badge badge-secondary badge-sm">{i + 1}</span>
									<span class="text-sm font-medium">{mic.label}</span>
								</div>
								<button 
									class="btn btn-sm gap-2"
									class:btn-secondary={selectedMicId !== mic.deviceId}
									class:btn-error={selectedMicId === mic.deviceId}
									onclick={() => testMic(mic.deviceId)}
								>
									{selectedMicId === mic.deviceId ? 'Stop Test' : 'Test'}
								</button>
							</div>
						{/each}
					</div>

					<!-- Audio Level Meter -->
					{#if audioPreviewStream}
						<div class="mt-4 p-4 rounded-xl bg-base-300/50" transition:scale={{ duration: 200, start: 0.95 }}>
							<div class="flex items-center justify-between mb-3">
								<span class="text-sm font-semibold flex items-center gap-2">
									<span class="inline-block w-2 h-2 bg-success rounded-full animate-pulse"></span>
									Microphone Level
								</span>
								<label class="label cursor-pointer gap-2">
								<span class="label-text text-xs">Loopback (hear yourself)</span>
								<input 
									type="checkbox" 
									class="toggle toggle-success toggle-sm" 
									checked={loopbackEnabled}
									onchange={(e) => {
										loopbackEnabled = (e.target as HTMLInputElement).checked;
										if (gainNode) {
											gainNode.gain.value = loopbackEnabled ? 0.8 : 0;
										}
									}}
								/>
							</label>
							</div>
							<div class="w-full bg-base-100 rounded-full h-4 overflow-hidden">
								<div 
									class="h-full rounded-full transition-all duration-75"
									class:bg-success={audioLevel < 70}
									class:bg-warning={audioLevel >= 70 && audioLevel < 90}
									class:bg-error={audioLevel >= 90}
									style="width: {audioLevel}%"
								></div>
							</div>
							<div class="flex justify-between mt-2 text-xs text-base-content/60">
								<span>Quiet</span>
								<span>Level: {Math.round(audioLevel)}%</span>
								<span>Loud</span>
							</div>
						</div>
					{/if}
				{:else if micChecked && !micError}
					<p class="text-sm text-base-content/60 mt-2">No microphones found.</p>
				{/if}
			</div>
		</div>

		<!-- Speakers -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold text-lg flex items-center gap-2">
						<span>🔊</span>
						Speakers
					</h3>
					{#if !speakerChecked}
						<button class="btn btn-primary btn-sm" onclick={checkSpeakers} disabled={speakerLoading}>
							{#if speakerLoading}
								<span class="loading loading-spinner loading-xs"></span>
							{/if}
							Check Speakers
						</button>
					{/if}
				</div>

				{#if speakerError}
					<div class="alert alert-warning mt-3 rounded-xl text-sm" transition:slide={{ duration: 200 }}>
						<span>{speakerError}</span>
					</div>
				{/if}

				{#if speakers.length > 0}
					<div class="mt-4 grid gap-3" transition:slide={{ duration: 200 }}>
						{#each speakers as speaker, i}
							<div class="flex items-center justify-between p-4 rounded-xl bg-base-300/50" transition:fade={{ delay: i * 50 }}>
								<div class="flex items-center gap-3">
									<span class="badge badge-accent badge-sm">{i + 1}</span>
									<span class="text-sm font-medium">{speaker.label}</span>
								</div>
							</div>
						{/each}
					</div>
				{:else if speakerChecked && !speakerError}
					<p class="text-sm text-base-content/60 mt-2">No speakers found.</p>
				{/if}
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About This Tool</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Permission is only requested when you click a button</li>
					<li>• Nothing is recorded or sent anywhere</li>
					<li>• Enable <strong>Loopback</strong> to hear yourself through speakers</li>
					<li>• Speaker enumeration may not work in all browsers</li>
					<li>• Camera/mic tests stop automatically when you leave</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

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
				.map(d => ({
					kind: d.kind as 'videoinput',
					label: d.label || `Camera ${cameras.length + 1}`,
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
				.map(d => ({
					kind: d.kind as 'audioinput',
					label: d.label || `Microphone ${microphones.length + 1}`,
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
				.map(d => ({
					kind: d.kind as 'audiooutput',
					label: d.label || `Speaker ${speakers.length + 1}`,
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

	async function previewCamera(deviceId: string) {
		stopVideoPreview();

		try {
			videoPreviewStream = await navigator.mediaDevices.getUserMedia({
				video: { deviceId: { exact: deviceId } }
			});
			if (videoRef) {
				videoRef.srcObject = videoPreviewStream;
			}
		} catch (err) {
			console.error('Failed to start camera preview:', err);
		}
	}

	function stopVideoPreview() {
		if (videoPreviewStream) {
			videoPreviewStream.getTracks().forEach(track => track.stop());
			videoPreviewStream = null;
		}
	}

	async function testMic(deviceId: string) {
		if (audioPreviewStream) {
			audioPreviewStream.getTracks().forEach(track => track.stop());
			audioPreviewStream = null;
			return;
		}

		try {
			audioPreviewStream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: { exact: deviceId } }
			});
			// Just testing if it works - could add audio visualization here
			setTimeout(() => {
				if (audioPreviewStream) {
					audioPreviewStream.getTracks().forEach(track => track.stop());
					audioPreviewStream = null;
				}
			}, 2000);
		} catch (err) {
			console.error('Failed to test microphone:', err);
		}
	}

	// Cleanup on unmount
	$effect(() => {
		return () => {
			stopVideoPreview();
			if (audioPreviewStream) {
				audioPreviewStream.getTracks().forEach(track => track.stop());
			}
		};
	});
</script>

<ToolWrapper
	title="Media Device Checker"
	description="Check available cameras, microphones, and speakers. Permission is requested only when you click."
>
	<div class="flex flex-col gap-6">
		<!-- Warning Banner -->
		<div class="alert alert-info rounded-xl">
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
					<div class="alert alert-error mt-3 rounded-xl text-sm">
						<span>{cameraError}</span>
					</div>
				{/if}

				{#if cameras.length > 0}
					<div class="mt-4 grid gap-2">
						{#each cameras as camera, i}
							<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
								<div class="flex items-center gap-2">
									<span class="badge badge-sm">{i + 1}</span>
									<span class="text-sm">{camera.label}</span>
								</div>
								<button class="btn btn-ghost btn-xs" onclick={() => previewCamera(camera.deviceId)}>
									Preview
								</button>
							</div>
						{/each}
					</div>

					{#if videoPreviewStream}
						<div class="mt-4">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium">Camera Preview</span>
								<button class="btn btn-ghost btn-xs" onclick={stopVideoPreview}>Stop</button>
							</div>
							<video bind:this={videoRef} autoplay playsinline muted class="w-full max-h-64 rounded-xl bg-black"></video>
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
					<div class="alert alert-error mt-3 rounded-xl text-sm">
						<span>{micError}</span>
					</div>
				{/if}

				{#if microphones.length > 0}
					<div class="mt-4 grid gap-2">
						{#each microphones as mic, i}
							<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
								<div class="flex items-center gap-2">
									<span class="badge badge-sm">{i + 1}</span>
									<span class="text-sm">{mic.label}</span>
								</div>
								<button class="btn btn-ghost btn-xs" onclick={() => testMic(mic.deviceId)}>
									Test
								</button>
							</div>
						{/each}
					</div>
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
					<div class="alert alert-warning mt-3 rounded-xl text-sm">
						<span>{speakerError}</span>
					</div>
				{/if}

				{#if speakers.length > 0}
					<div class="mt-4 grid gap-2">
						{#each speakers as speaker, i}
							<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
								<div class="flex items-center gap-2">
									<span class="badge badge-sm">{i + 1}</span>
									<span class="text-sm">{speaker.label}</span>
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
					<li>• Speaker enumeration may not work in all browsers</li>
					<li>• Camera/mic tests stop automatically after use</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

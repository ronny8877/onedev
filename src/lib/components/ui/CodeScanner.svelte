<script lang="ts">
	import { onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import type { IScannerControls } from '@zxing/browser';

	interface Props {
		mode?: 'qr' | 'barcode' | 'all';
		onResult: (text: string, format: string) => void;
	}

	let { mode = 'all', onResult }: Props = $props();

	let previewUrl = $state('');
	let scanning = $state(false);
	let cameraOn = $state(false);
	let error = $state('');
	let videoEl = $state<HTMLVideoElement | undefined>();
	let controls: IScannerControls | null = null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let reader: any = null;

	async function getReader() {
		if (reader) return reader;
		const [{ BrowserMultiFormatReader, BarcodeFormat }, { DecodeHintType }] = await Promise.all([
			import('@zxing/browser'),
			import('@zxing/library')
		]);

		const qrFormats = [BarcodeFormat.QR_CODE, BarcodeFormat.DATA_MATRIX, BarcodeFormat.AZTEC, BarcodeFormat.PDF_417];
		const barcodeFormats = [
			BarcodeFormat.CODE_128,
			BarcodeFormat.CODE_39,
			BarcodeFormat.CODE_93,
			BarcodeFormat.EAN_13,
			BarcodeFormat.EAN_8,
			BarcodeFormat.UPC_A,
			BarcodeFormat.UPC_E,
			BarcodeFormat.ITF,
			BarcodeFormat.CODABAR,
			BarcodeFormat.RSS_14
		];
		const formats = mode === 'qr' ? qrFormats : mode === 'barcode' ? barcodeFormats : [...qrFormats, ...barcodeFormats];

		const hints = new Map();
		hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
		hints.set(DecodeHintType.TRY_HARDER, true);
		reader = new BrowserMultiFormatReader(hints);
		return reader;
	}

	function formatName(result: { getBarcodeFormat: () => number }): string {
		const names: Record<number, string> = {
			0: 'AZTEC',
			1: 'CODABAR',
			2: 'CODE_39',
			3: 'CODE_93',
			4: 'CODE_128',
			5: 'DATA_MATRIX',
			6: 'EAN_8',
			7: 'EAN_13',
			8: 'ITF',
			10: 'PDF_417',
			11: 'QR_CODE',
			14: 'UPC_A',
			15: 'UPC_E'
		};
		return names[result.getBarcodeFormat()] ?? String(result.getBarcodeFormat());
	}

	async function decodeFromDataUrl(dataURL: string) {
		scanning = true;
		error = '';
		try {
			const r = await getReader();
			const result = await r.decodeFromImageUrl(dataURL);
			onResult(result.getText(), formatName(result));
		} catch {
			error = mode === 'qr'
				? 'No QR code found in that image. Try a sharper crop or better lighting.'
				: 'No barcode found in that image. Try a sharper crop or better lighting.';
		} finally {
			scanning = false;
		}
	}

	function handleImageLoad(_file: File, dataURL: string) {
		previewUrl = dataURL;
		stopCamera();
		decodeFromDataUrl(dataURL);
	}

	async function startCamera() {
		if (!browser || !videoEl) return;
		error = '';
		stopCamera();
		try {
			const r = await getReader();
			cameraOn = true;
			controls = await r.decodeFromVideoDevice(undefined, videoEl, (result: { getText: () => string; getBarcodeFormat: () => number } | undefined) => {
				if (!result) return;
				onResult(result.getText(), formatName(result));
				stopCamera();
			});
		} catch (err) {
			cameraOn = false;
			error = err instanceof Error && /permission|notallowed|denied/i.test(err.message)
				? 'Camera access was blocked. You can still upload an image.'
				: 'Could not start the camera. You can still upload an image.';
		}
	}

	function stopCamera() {
		controls?.stop();
		controls = null;
		cameraOn = false;
		if (videoEl) {
			const stream = videoEl.srcObject;
			if (stream instanceof MediaStream) {
				for (const track of stream.getTracks()) track.stop();
			}
			videoEl.srcObject = null;
		}
	}

	onDestroy(() => {
		stopCamera();
	});
</script>

<div class="space-y-4">
	<ImageUploader onImageLoad={handleImageLoad} accept="image/*" maxSizeMB={20} />

	<div class="flex flex-wrap gap-2">
		{#if cameraOn}
			<button type="button" class="btn btn-error btn-sm" onclick={stopCamera}>Stop camera</button>
		{:else}
			<button type="button" class="btn btn-outline btn-sm" onclick={startCamera}>Scan with camera</button>
		{/if}
	</div>

	<video
		bind:this={videoEl}
		class="w-full max-w-md rounded-2xl bg-black {cameraOn ? 'block' : 'hidden'}"
		autoplay
		muted
		playsinline
	></video>

	{#if previewUrl && !cameraOn}
		<div class="overflow-hidden rounded-2xl border border-base-300 bg-base-200">
			<img src={previewUrl} alt="Uploaded code" class="mx-auto max-h-64 object-contain" />
		</div>
	{/if}

	{#if scanning}
		<div class="flex items-center gap-2 text-sm text-base-content/60">
			<span class="loading loading-spinner loading-sm"></span>
			Reading code…
		</div>
	{/if}

	{#if error}
		<div class="alert alert-warning rounded-xl text-sm">{error}</div>
	{/if}
</div>

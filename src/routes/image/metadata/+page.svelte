<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { readFileAsArrayBuffer, loadImage, loadImageAsCanvas, canvasToBlob, downloadBlob, formatFileSize } from '$lib/utils/image';
	import exifr from 'exifr';

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let strippedBlob = $state<Blob | null>(null);

	// Basic file info
	let basicInfo = $state<{ key: string; value: string; icon?: string }[]>([]);

	// EXIF metadata groups
	let exifGroups = $state<{ name: string; icon: string; data: { key: string; value: string }[] }[]>([]);
	let hasExif = $state(false);
	let exifError = $state('');

	async function handleImageLoad(file: File, dataURL: string) {
		console.log('Handling image load:', file.name, file.type, file.size);
		originalFile = file;
		originalDataURL = dataURL;
		basicInfo = [];
		exifGroups = [];
		hasExif = false;
		exifError = '';

		// Set initial basic info (robust to load failures)
		const initialInfo = [
			{ key: 'File Name', value: file.name },
			{ key: 'File Size', value: formatFileSize(file.size) },
			{ key: 'File Type', value: file.type || 'Unknown' },
			{ key: 'Last Modified', value: file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown' }
		];
		basicInfo = initialInfo;

		// Get image dimensions (optional)
		try {
			const img = await loadImage(dataURL);
			basicInfo = [
				...initialInfo.slice(0, 3), // Insert dimensions after Type
				{ key: 'Dimensions', value: `${img.width} × ${img.height} pixels` },
				{ key: 'Aspect Ratio', value: formatAspectRatio(img.width, img.height) },
				{ key: 'Total Pixels', value: `${(img.width * img.height / 1000000).toFixed(2)} MP` },
				...initialInfo.slice(3)
			];
		} catch (e) {
			console.error('Failed to load image preview:', e);
		}

		// Try to read Metadata using exifr
		try {
			console.log('Reading file as ArrayBuffer for exifr...');
			const buffer = await readFileAsArrayBuffer(file);
			
			console.log('Starting exifr parse...');
			// Parse with grouping enabled - try to be as permissive as possible
			const options = {
				tiff: true,
				ifd0: true,
				exif: true,
				gps: true,
				interop: true,
				xmp: true,
				jfif: true, 
				icc: true,
				iptc: true,
				mergeOutput: false, // Keep structure
				sanitize: true,
				reviveValues: true
			};
			
			let output = await exifr.parse(buffer, options);
			console.log('exifr structured output:', output);

			if (!output || Object.keys(output).length === 0) {
				console.log('Structured output empty, trying flat parse...');
				// Fallback to simple parse
				output = await exifr.parse(buffer);
				console.log('exifr flat output:', output);
				
				if (output) {
					// Wrap flat output in a 'General' group
					output = { 'General': output };
				}
			}

			if (output && Object.keys(output).length > 0) {
				hasExif = true;
				exifGroups = organizeExifData(output);
				console.log('Organized groups:', exifGroups);
			} else {
				console.warn('No metadata found by exifr');
				exifError = 'No standard metadata found';
			}
		} catch (err) {
			console.error('Metadata parsing error:', err);
			exifError = err instanceof Error ? err.message : 'Failed to parse metadata';
		}

		// Prepare stripped version
		await prepareStripped();
	}

	// ... formatAspectRatio ...

	function organizeExifData(data: any): { name: string; icon: string; data: { key: string; value: string }[] }[] {
		const groups: { name: string; icon: string; data: { key: string; value: string }[] }[] = [];

		const formatValue = (v: any): string => {
			if (v instanceof Date) return v.toLocaleString();
			if (v instanceof Uint8Array || v instanceof Uint16Array || (v && v.type === 'Buffer')) return `[Binary Data: ${v.length || v.byteLength} bytes]`;
			if (Array.isArray(v)) return v.map(formatValue).join(', ');
			if (typeof v === 'object' && v !== null) return JSON.stringify(v);
			if (typeof v === 'number') return Number.isInteger(v) ? v.toString() : v.toFixed(4).replace(/\.?0+$/, '');
			return String(v);
		};

		const processGroup = (groupName: string, icon: string, groupData: any) => {
			if (!groupData) return;
			const items = Object.entries(groupData).map(([k, v]) => {
				return { key: k, value: formatValue(v) };
			});
			if (items.length > 0) {
				groups.push({ name: groupName, icon, data: items });
			}
		};

		// Map exifr groups to UI
		if (data.ifd0) processGroup('Image Info (IFD0)', '🖼️', data.ifd0);
		if (data.exif) processGroup('EXIF Parameters', '📸', data.exif);
		if (data.gps) processGroup('GPS Location', '📍', data.gps);
		if (data.interop) processGroup('Interoperability', '🔌', data.interop);
		if (data.thumbnail) processGroup('Thumbnail Specs', '🖼️', data.thumbnail);
		if (data.ifd1) processGroup('IFD1 (Thumbnail)', '🖼️', data.ifd1);
		if (data.xmp) processGroup('XMP Metadata', '📝', data.xmp);
		if (data.iptc) processGroup('IPTC Metadata', '�', data.iptc);
		if (data.icc) processGroup('ICC Profile', '🎨', data.icc);
		if (data.jfif) processGroup('JFIF', 'ℹ️', data.jfif);
		
		// Fallback for flat data or unknown groups
		Object.keys(data).forEach(key => {
			if (!['ifd0', 'exif', 'gps', 'interop', 'ifd1', 'xmp', 'jfif', 'thumbnail', 'iptc', 'icc'].includes(key)) {
				processGroup(key.charAt(0).toUpperCase() + key.slice(1), '📁', data[key]);
			}
		});

		return groups;
	}

	async function prepareStripped() {
		// ... existing code ...
		if (!originalDataURL) return;

		try {
			const canvas = await loadImageAsCanvas(originalDataURL);
			strippedBlob = await canvasToBlob(canvas, originalFile?.type || 'image/jpeg', 0.95);
		} catch (err) {
			console.error('Failed to strip metadata:', err);
		}
	}

	function downloadStripped() {
		// ... existing code ...
		if (!strippedBlob || !originalFile) return;
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		const ext = originalFile.name.split('.').pop() || 'jpg';
		downloadBlob(strippedBlob, `${name}-no-metadata.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		basicInfo = [];
		exifGroups = [];
		hasExif = false;
		exifError = '';
		strippedBlob = null;
	}

	async function loadSample() {
		try {
			console.log('Loading sample image...');
			const res = await fetch('https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80');
			if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
			const blob = await res.blob();
			const file = new File([blob], 'laptop.jpg', { type: 'image/jpeg' });
			const reader = new FileReader();
			reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
			reader.onerror = (e) => {
				console.error('FileReader error:', e);
				exifError = 'Failed to read sample file';
			};
			reader.readAsDataURL(file);
		} catch (e) {
			console.error('Sample load failed:', e);
			exifError = 'Failed to load sample image (check network)';
		}
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Image Preview & Actions -->
			<div class="flex flex-col sm:flex-row gap-6">
				<div class="shrink-0">
					<img
						src={originalDataURL}
						alt="Preview"
						class="max-h-48 rounded-xl bg-base-300 object-contain"
					/>
				</div>

				<div class="flex flex-col gap-3">
					<button class="btn btn-primary gap-2" onclick={downloadStripped} disabled={!strippedBlob}>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
						Download Without Metadata
					</button>
					<button class="btn btn-ghost" onclick={reset}>
						Upload New Image
					</button>
					{#if hasExif}
						<div class="badge badge-warning gap-1">
							<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
							</svg>
							Contains EXIF data
						</div>
					{/if}
				</div>
			</div>

			<!-- Basic File Info -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="flex items-center gap-2 text-sm font-semibold">
						<span>📁</span>
						File Information
					</h4>
					<div class="mt-2 grid gap-2">
						{#each basicInfo as item}
							<div class="flex justify-between text-sm">
								<span class="text-base-content/60">{item.key}</span>
								<span class="font-mono text-right">{item.value}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- EXIF Data -->
			{#if exifGroups.length > 0}
				<div class="space-y-4">
					{#each exifGroups as group}
						<div class="card bg-base-200 rounded-xl">
							<div class="card-body py-4">
								<h4 class="flex items-center gap-2 text-sm font-semibold">
									<span>{group.icon}</span>
									{group.name}
								</h4>
								<div class="mt-2 grid gap-2 overflow-y-auto">
									{#each group.data as item}
										<div class="flex justify-between text-sm gap-4">
											<span class="text-base-content/60 shrink-0">{item.key}</span>
											<span class="font-mono text-right truncate" title={item.value}>
												{item.value}
											</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if exifError}
				<div class="alert alert-warning rounded-xl">
					<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
					</svg>
					<span>EXIF parsing error: {exifError}</span>
				</div>
			{:else if originalFile?.type === 'image/jpeg' || originalFile?.type === 'image/jpg'}
				<div class="alert alert-info rounded-xl">
					<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>No EXIF metadata found in this JPEG image.</span>
				</div>
			{:else}
				<div class="alert alert-info rounded-xl">
					<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<span>EXIF metadata is typically only found in JPEG images from cameras and phones.</span>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About Image Metadata</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Basic info</strong>: File size, dimensions, type, and modification date</li>
					<li>• <strong>EXIF data</strong>: Camera model, settings, date taken, GPS location</li>
					<li>• <strong>Privacy concern</strong>: Photos may reveal your location and device</li>
					<li>• <strong>Strip metadata</strong>: Download a clean version without embedded data</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

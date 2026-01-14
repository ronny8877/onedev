<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import { readFileAsArrayBuffer, loadImage, loadImageAsCanvas, canvasToBlob, downloadBlob, formatFileSize } from '$lib/utils/image';

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
		originalFile = file;
		originalDataURL = dataURL;
		basicInfo = [];
		exifGroups = [];
		hasExif = false;
		exifError = '';

		// Get image dimensions
		const img = await loadImage(dataURL);

		// Basic file info (always available)
		basicInfo = [
			{ key: 'File Name', value: file.name },
			{ key: 'File Size', value: formatFileSize(file.size) },
			{ key: 'File Type', value: file.type || 'Unknown' },
			{ key: 'Dimensions', value: `${img.width} × ${img.height} pixels` },
			{ key: 'Aspect Ratio', value: formatAspectRatio(img.width, img.height) },
			{ key: 'Total Pixels', value: `${(img.width * img.height / 1000000).toFixed(2)} MP` },
			{ key: 'Last Modified', value: file.lastModified ? new Date(file.lastModified).toLocaleString() : 'Unknown' }
		];

		// Try to read EXIF data
		if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
			try {
				const buffer = await readFileAsArrayBuffer(file);
				const exifData = await parseExifManually(buffer);

				if (exifData && Object.keys(exifData).length > 0) {
					hasExif = true;
					exifGroups = organizeExifData(exifData);
				}
			} catch (err) {
				console.error('EXIF parsing error:', err);
				exifError = err instanceof Error ? err.message : 'Failed to parse EXIF';
			}
		}

		// Prepare stripped version
		await prepareStripped();
	}

	function formatAspectRatio(w: number, h: number): string {
		const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
		const divisor = gcd(w, h);
		const rw = w / divisor;
		const rh = h / divisor;
		// Simplify common ratios
		if (rw === 16 && rh === 9) return '16:9';
		if (rw === 4 && rh === 3) return '4:3';
		if (rw === 3 && rh === 2) return '3:2';
		if (rw === 1 && rh === 1) return '1:1';
		if (rw > 20 || rh > 20) {
			// Return decimal ratio for unusual aspect ratios
			return (w / h).toFixed(2) + ':1';
		}
		return `${rw}:${rh}`;
	}

	async function parseExifManually(buffer: ArrayBuffer): Promise<Record<string, string>> {
		const view = new DataView(buffer);
		const result: Record<string, string> = {};

		// Check for JPEG marker
		if (view.getUint16(0) !== 0xFFD8) {
			return result;
		}

		let offset = 2;

		while (offset < view.byteLength - 4) {
			const marker = view.getUint16(offset);

			// APP1 marker (EXIF)
			if (marker === 0xFFE1) {
				const segmentLength = view.getUint16(offset + 2);

				// Check for "Exif\0\0" header
				const exifHeader = String.fromCharCode(
					view.getUint8(offset + 4),
					view.getUint8(offset + 5),
					view.getUint8(offset + 6),
					view.getUint8(offset + 7)
				);

				if (exifHeader === 'Exif') {
					const tiffOffset = offset + 10;

					// Check byte order
					const byteOrder = view.getUint16(tiffOffset);
					const littleEndian = byteOrder === 0x4949;

					// Parse IFD0
					const ifd0Offset = tiffOffset + view.getUint32(tiffOffset + 4, littleEndian);
					parseIFD(view, ifd0Offset, tiffOffset, littleEndian, result, 'Image');

					// Look for EXIF SubIFD
					const exifPointer = result['_ExifOffset'];
					if (exifPointer) {
						const exifOffset = tiffOffset + parseInt(exifPointer);
						parseIFD(view, exifOffset, tiffOffset, littleEndian, result, 'Camera');
						delete result['_ExifOffset'];
					}

					// Look for GPS IFD
					const gpsPointer = result['_GPSInfo'];
					if (gpsPointer) {
						const gpsOffset = tiffOffset + parseInt(gpsPointer);
						parseIFD(view, gpsOffset, tiffOffset, littleEndian, result, 'GPS');
						delete result['_GPSInfo'];
					}
				}
				break;
			}

			// Move to next segment
			if ((marker & 0xFF00) !== 0xFF00) break;
			offset += 2 + view.getUint16(offset + 2);
		}

		return result;
	}

	function parseIFD(view: DataView, offset: number, tiffOffset: number, littleEndian: boolean, result: Record<string, string>, prefix: string) {
		try {
			const entryCount = view.getUint16(offset, littleEndian);

			for (let i = 0; i < entryCount; i++) {
				const entryOffset = offset + 2 + (i * 12);

				if (entryOffset + 12 > view.byteLength) break;

				const tag = view.getUint16(entryOffset, littleEndian);
				const type = view.getUint16(entryOffset + 2, littleEndian);
				const count = view.getUint32(entryOffset + 4, littleEndian);
				const valueOffset = entryOffset + 8;

				const tagName = getTagName(tag, prefix);
				if (!tagName) continue;

				// Special pointers
				if (tag === 0x8769) { // ExifOffset
					result['_ExifOffset'] = view.getUint32(valueOffset, littleEndian).toString();
					continue;
				}
				if (tag === 0x8825) { // GPSInfo
					result['_GPSInfo'] = view.getUint32(valueOffset, littleEndian).toString();
					continue;
				}

				const value = readTagValue(view, type, count, valueOffset, tiffOffset, littleEndian);
				if (value !== null) {
					result[`${prefix}: ${tagName}`] = formatTagValue(tag, value);
				}
			}
		} catch (e) {
			// Silently fail on parse errors
		}
	}

	function getTagName(tag: number, prefix: string): string | null {
		const tags: Record<number, string> = {
			// IFD0 tags
			0x010F: 'Make',
			0x0110: 'Model',
			0x0112: 'Orientation',
			0x011A: 'X Resolution',
			0x011B: 'Y Resolution',
			0x0128: 'Resolution Unit',
			0x0131: 'Software',
			0x0132: 'Date/Time',
			// EXIF tags
			0x829A: 'Exposure Time',
			0x829D: 'F-Number',
			0x8822: 'Exposure Program',
			0x8827: 'ISO Speed',
			0x9000: 'EXIF Version',
			0x9003: 'Date/Time Original',
			0x9004: 'Date/Time Digitized',
			0x9201: 'Shutter Speed',
			0x9202: 'Aperture',
			0x9204: 'Exposure Bias',
			0x9207: 'Metering Mode',
			0x9209: 'Flash',
			0x920A: 'Focal Length',
			0xA001: 'Color Space',
			0xA002: 'Pixel X Dimension',
			0xA003: 'Pixel Y Dimension',
			0xA402: 'Exposure Mode',
			0xA403: 'White Balance',
			0xA406: 'Scene Type',
			// GPS tags
			0x0000: 'GPS Version',
			0x0001: 'GPS Latitude Ref',
			0x0002: 'GPS Latitude',
			0x0003: 'GPS Longitude Ref',
			0x0004: 'GPS Longitude',
			0x0005: 'GPS Altitude Ref',
			0x0006: 'GPS Altitude'
		};
		return tags[tag] || null;
	}

	function readTagValue(view: DataView, type: number, count: number, valueOffset: number, tiffOffset: number, littleEndian: boolean): unknown {
		try {
			const typeSize = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8][type] || 0;
			const totalSize = typeSize * count;
			let dataOffset = valueOffset;

			if (totalSize > 4) {
				dataOffset = tiffOffset + view.getUint32(valueOffset, littleEndian);
				if (dataOffset + totalSize > view.byteLength) return null;
			}

			switch (type) {
				case 1: // BYTE
				case 7: // UNDEFINED
					return view.getUint8(dataOffset);
				case 2: // ASCII
					let str = '';
					for (let i = 0; i < count - 1 && dataOffset + i < view.byteLength; i++) {
						const char = view.getUint8(dataOffset + i);
						if (char === 0) break;
						str += String.fromCharCode(char);
					}
					return str.trim();
				case 3: // SHORT
					return view.getUint16(dataOffset, littleEndian);
				case 4: // LONG
					return view.getUint32(dataOffset, littleEndian);
				case 5: // RATIONAL
					const num = view.getUint32(dataOffset, littleEndian);
					const den = view.getUint32(dataOffset + 4, littleEndian);
					return den !== 0 ? num / den : 0;
				case 10: // SRATIONAL
					const snum = view.getInt32(dataOffset, littleEndian);
					const sden = view.getInt32(dataOffset + 4, littleEndian);
					return sden !== 0 ? snum / sden : 0;
				default:
					return null;
			}
		} catch {
			return null;
		}
	}

	function formatTagValue(tag: number, value: unknown): string {
		if (value === null || value === undefined) return 'N/A';

		// Format specific tags
		if (tag === 0x829A && typeof value === 'number') {
			// Exposure time
			if (value < 1) return `1/${Math.round(1 / value)}s`;
			return `${value}s`;
		}
		if (tag === 0x829D && typeof value === 'number') {
			// F-number
			return `f/${value.toFixed(1)}`;
		}
		if (tag === 0x920A && typeof value === 'number') {
			// Focal length
			return `${value.toFixed(1)}mm`;
		}
		if (tag === 0x9209 && typeof value === 'number') {
			// Flash
			return value & 1 ? 'Fired' : 'Did not fire';
		}

		if (typeof value === 'number') {
			return Number.isInteger(value) ? value.toString() : value.toFixed(2);
		}

		return String(value);
	}

	function organizeExifData(data: Record<string, string>): { name: string; icon: string; data: { key: string; value: string }[] }[] {
		const groups: { name: string; icon: string; data: { key: string; value: string }[] }[] = [];

		const imageData = Object.entries(data)
			.filter(([k]) => k.startsWith('Image:'))
			.map(([k, v]) => ({ key: k.replace('Image: ', ''), value: v }));

		const cameraData = Object.entries(data)
			.filter(([k]) => k.startsWith('Camera:'))
			.map(([k, v]) => ({ key: k.replace('Camera: ', ''), value: v }));

		const gpsData = Object.entries(data)
			.filter(([k]) => k.startsWith('GPS:'))
			.map(([k, v]) => ({ key: k.replace('GPS: ', ''), value: v }));

		if (imageData.length > 0) {
			groups.push({ name: 'Image', icon: '🖼️', data: imageData });
		}
		if (cameraData.length > 0) {
			groups.push({ name: 'Camera Settings', icon: '📷', data: cameraData });
		}
		if (gpsData.length > 0) {
			groups.push({ name: 'Location', icon: '📍', data: gpsData });
		}

		return groups;
	}

	async function prepareStripped() {
		if (!originalDataURL) return;

		try {
			const canvas = await loadImageAsCanvas(originalDataURL);
			strippedBlob = await canvasToBlob(canvas, originalFile?.type || 'image/jpeg', 0.95);
		} catch (err) {
			console.error('Failed to strip metadata:', err);
		}
	}

	function downloadStripped() {
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
</script>

<ToolWrapper
	title="Image Metadata Viewer"
	description="View all image information including dimensions, file details, and EXIF data. Strip metadata for privacy."
>
	<div class="flex flex-col gap-6">
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
								<div class="mt-2 grid gap-2 max-h-64 overflow-y-auto">
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

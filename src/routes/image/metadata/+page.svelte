<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
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
		// Comprehensive EXIF tag database
		const ifd0Tags: Record<number, string> = {
			// Primary tags (IFD0)
			0x0100: 'Image Width',
			0x0101: 'Image Height',
			0x0102: 'Bits Per Sample',
			0x0103: 'Compression',
			0x0106: 'Photometric Interpretation',
			0x010E: 'Image Description',
			0x010F: 'Make',
			0x0110: 'Model',
			0x0111: 'Strip Offsets',
			0x0112: 'Orientation',
			0x0115: 'Samples Per Pixel',
			0x0116: 'Rows Per Strip',
			0x0117: 'Strip Byte Counts',
			0x011A: 'X Resolution',
			0x011B: 'Y Resolution',
			0x011C: 'Planar Configuration',
			0x0128: 'Resolution Unit',
			0x012D: 'Transfer Function',
			0x0131: 'Software',
			0x0132: 'Date/Time',
			0x013B: 'Artist',
			0x013E: 'White Point',
			0x013F: 'Primary Chromaticities',
			0x0201: 'Thumbnail Offset',
			0x0202: 'Thumbnail Length',
			0x0211: 'YCbCr Coefficients',
			0x0212: 'YCbCr Sub Sampling',
			0x0213: 'YCbCr Positioning',
			0x0214: 'Reference Black White',
			0x8298: 'Copyright',
			0x8769: 'EXIF Offset',
			0x8825: 'GPS Info Offset',
			0xA005: 'Interoperability Offset',
		};

		const exifTags: Record<number, string> = {
			// EXIF SubIFD tags
			0x829A: 'Exposure Time',
			0x829D: 'F-Number',
			0x8822: 'Exposure Program',
			0x8824: 'Spectral Sensitivity',
			0x8827: 'ISO Speed',
			0x8828: 'OECF',
			0x8830: 'Sensitivity Type',
			0x8831: 'Standard Output Sensitivity',
			0x8832: 'Recommended Exposure Index',
			0x8833: 'ISO Speed',
			0x8834: 'ISO Speed Latitude yyy',
			0x8835: 'ISO Speed Latitude zzz',
			0x9000: 'EXIF Version',
			0x9003: 'Date/Time Original',
			0x9004: 'Date/Time Digitized',
			0x9010: 'Offset Time',
			0x9011: 'Offset Time Original',
			0x9012: 'Offset Time Digitized',
			0x9101: 'Components Configuration',
			0x9102: 'Compressed Bits Per Pixel',
			0x9201: 'Shutter Speed Value',
			0x9202: 'Aperture Value',
			0x9203: 'Brightness Value',
			0x9204: 'Exposure Bias Value',
			0x9205: 'Max Aperture Value',
			0x9206: 'Subject Distance',
			0x9207: 'Metering Mode',
			0x9208: 'Light Source',
			0x9209: 'Flash',
			0x920A: 'Focal Length',
			0x9214: 'Subject Area',
			0x927C: 'Maker Note',
			0x9286: 'User Comment',
			0x9290: 'Sub Sec Time',
			0x9291: 'Sub Sec Time Original',
			0x9292: 'Sub Sec Time Digitized',
			0xA000: 'Flashpix Version',
			0xA001: 'Color Space',
			0xA002: 'Pixel X Dimension',
			0xA003: 'Pixel Y Dimension',
			0xA004: 'Related Sound File',
			0xA20B: 'Flash Energy',
			0xA20C: 'Spatial Frequency Response',
			0xA20E: 'Focal Plane X Resolution',
			0xA20F: 'Focal Plane Y Resolution',
			0xA210: 'Focal Plane Resolution Unit',
			0xA214: 'Subject Location',
			0xA215: 'Exposure Index',
			0xA217: 'Sensing Method',
			0xA300: 'File Source',
			0xA301: 'Scene Type',
			0xA302: 'CFA Pattern',
			0xA401: 'Custom Rendered',
			0xA402: 'Exposure Mode',
			0xA403: 'White Balance',
			0xA404: 'Digital Zoom Ratio',
			0xA405: 'Focal Length In 35mm Film',
			0xA406: 'Scene Capture Type',
			0xA407: 'Gain Control',
			0xA408: 'Contrast',
			0xA409: 'Saturation',
			0xA40A: 'Sharpness',
			0xA40B: 'Device Setting Description',
			0xA40C: 'Subject Distance Range',
			0xA420: 'Image Unique ID',
			0xA430: 'Camera Owner Name',
			0xA431: 'Body Serial Number',
			0xA432: 'Lens Specification',
			0xA433: 'Lens Make',
			0xA434: 'Lens Model',
			0xA435: 'Lens Serial Number',
			0xA460: 'Composite Image',
			0xA461: 'Source Image Number Of Composite Image',
			0xA462: 'Source Exposure Times Of Composite Image',
			0xA500: 'Gamma',
		};

		const gpsTags: Record<number, string> = {
			// GPS tags
			0x0000: 'GPS Version ID',
			0x0001: 'GPS Latitude Ref',
			0x0002: 'GPS Latitude',
			0x0003: 'GPS Longitude Ref',
			0x0004: 'GPS Longitude',
			0x0005: 'GPS Altitude Ref',
			0x0006: 'GPS Altitude',
			0x0007: 'GPS Time Stamp',
			0x0008: 'GPS Satellites',
			0x0009: 'GPS Status',
			0x000A: 'GPS Measure Mode',
			0x000B: 'GPS DOP',
			0x000C: 'GPS Speed Ref',
			0x000D: 'GPS Speed',
			0x000E: 'GPS Track Ref',
			0x000F: 'GPS Track',
			0x0010: 'GPS Img Direction Ref',
			0x0011: 'GPS Img Direction',
			0x0012: 'GPS Map Datum',
			0x0013: 'GPS Dest Latitude Ref',
			0x0014: 'GPS Dest Latitude',
			0x0015: 'GPS Dest Longitude Ref',
			0x0016: 'GPS Dest Longitude',
			0x0017: 'GPS Dest Bearing Ref',
			0x0018: 'GPS Dest Bearing',
			0x0019: 'GPS Dest Distance Ref',
			0x001A: 'GPS Dest Distance',
			0x001B: 'GPS Processing Method',
			0x001C: 'GPS Area Information',
			0x001D: 'GPS Date Stamp',
			0x001E: 'GPS Differential',
			0x001F: 'GPS H Positioning Error',
		};

		// Select appropriate tag set based on prefix
		if (prefix === 'GPS') {
			return gpsTags[tag] || `Unknown GPS Tag (0x${tag.toString(16).toUpperCase()})`;
		} else if (prefix === 'Camera') {
			return exifTags[tag] || `Unknown EXIF Tag (0x${tag.toString(16).toUpperCase()})`;
		} else {
			return ifd0Tags[tag] || exifTags[tag] || `Unknown Tag (0x${tag.toString(16).toUpperCase()})`;
		}
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

		// Exposure related camera data
		const exposureData = Object.entries(data)
			.filter(([k]) => k.startsWith('Camera:') && 
				(k.includes('Exposure') || k.includes('ISO') || k.includes('Shutter') || 
				 k.includes('Aperture') || k.includes('F-Number') || k.includes('Flash') ||
				 k.includes('Metering') || k.includes('White Balance')))
			.map(([k, v]) => ({ key: k.replace('Camera: ', ''), value: v }));

		// Lens and focus data
		const lensData = Object.entries(data)
			.filter(([k]) => k.startsWith('Camera:') && 
				(k.includes('Focal') || k.includes('Lens') || k.includes('Subject') || k.includes('Focus')))
			.map(([k, v]) => ({ key: k.replace('Camera: ', ''), value: v }));

		// Other camera data
		const otherCameraData = Object.entries(data)
			.filter(([k]) => k.startsWith('Camera:') && 
				!exposureData.some(e => k.includes(e.key)) &&
				!lensData.some(l => k.includes(l.key)))
			.map(([k, v]) => ({ key: k.replace('Camera: ', ''), value: v }));

		const gpsData = Object.entries(data)
			.filter(([k]) => k.startsWith('GPS:'))
			.map(([k, v]) => ({ key: k.replace('GPS: ', ''), value: v }));

		// Unknown/Other tags
		const unknownData = Object.entries(data)
			.filter(([k]) => k.includes('Unknown'))
			.map(([k, v]) => ({ key: k.replace(/^[^:]+: /, ''), value: v }));

		if (imageData.length > 0) {
			groups.push({ name: 'Image Info', icon: '🖼️', data: imageData });
		}
		if (exposureData.length > 0) {
			groups.push({ name: 'Exposure Settings', icon: '📸', data: exposureData });
		}
		if (lensData.length > 0) {
			groups.push({ name: 'Lens & Focus', icon: '🔍', data: lensData });
		}
		if (otherCameraData.length > 0) {
			groups.push({ name: 'Camera Details', icon: '📷', data: otherCameraData });
		}
		if (gpsData.length > 0) {
			groups.push({ name: 'Location (GPS)', icon: '📍', data: gpsData });
		}
		if (unknownData.length > 0) {
			groups.push({ name: 'Additional Data', icon: '📋', data: unknownData });
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

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'laptop.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
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

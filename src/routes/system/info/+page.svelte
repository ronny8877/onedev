<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	interface InfoItem {
		label: string;
		value: string;
		raw?: string | number | boolean | null;
		note?: string; // For disclaimers
	}

	interface InfoGroup {
		name: string;
		icon: string;
		items: InfoItem[];
	}

	let groups = $state<InfoGroup[]>([]);
	let isLoading = $state(true);
	let copied = $state(false);

	function getOS(): { name: string; version: string; architecture: string } {
		const ua = navigator.userAgent;
		const platform = navigator.platform;
		let name = 'Unknown';
		let version = '';
		let architecture = 'Unknown';

		// Detect architecture
		if (ua.includes('arm64') || ua.includes('aarch64')) {
			architecture = 'ARM64';
		} else if (ua.includes('x86_64') || ua.includes('x64') || ua.includes('Win64') || ua.includes('WOW64')) {
			architecture = 'x86_64';
		} else if (ua.includes('x86') || ua.includes('i686') || ua.includes('i386')) {
			architecture = 'x86';
		} else if (platform === 'MacIntel') {
			// Modern Macs report MacIntel even on Apple Silicon due to Rosetta/browser behavior
			architecture = 'Intel/Apple Silicon (indeterminate)';
		}

		if (ua.includes('Windows NT 10')) { name = 'Windows'; version = '10/11'; }
		else if (ua.includes('Windows NT 6.3')) { name = 'Windows'; version = '8.1'; }
		else if (ua.includes('Windows NT 6.2')) { name = 'Windows'; version = '8'; }
		else if (ua.includes('Windows NT 6.1')) { name = 'Windows'; version = '7'; }
		else if (ua.includes('Mac OS X')) {
			name = 'macOS';
			const match = ua.match(/Mac OS X (\d+[._]\d+[._]?\d*)/);
			version = match ? match[1].replace(/_/g, '.') : '';
		}
		else if (ua.includes('Android')) {
			name = 'Android';
			const match = ua.match(/Android (\d+(\.\d+)?)/);
			version = match ? match[1] : '';
			architecture = 'ARM';
		}
		else if (ua.includes('iPhone') || ua.includes('iPad')) {
			name = 'iOS/iPadOS';
			const match = ua.match(/OS (\d+[_]\d+)/);
			version = match ? match[1].replace('_', '.') : '';
			architecture = 'ARM64';
		}
		else if (ua.includes('Linux')) { name = 'Linux'; }
		else if (ua.includes('CrOS')) { name = 'Chrome OS'; }

		return { name, version, architecture };
	}

	function getDeviceType(): string {
		const ua = navigator.userAgent;
		if (/iPad|Tablet|PlayBook/i.test(ua)) return 'Tablet';
		if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'Mobile';
		return 'Desktop';
	}

	async function getBattery(): Promise<InfoItem[]> {
		try {
			const nav = navigator as Navigator & { getBattery?: () => Promise<{
				level: number;
				charging: boolean;
				chargingTime: number;
				dischargingTime: number
			}> };
			if (!nav.getBattery) {
				return [{ label: 'Battery API', value: 'Not supported', raw: null }];
			}
			const battery = await nav.getBattery();
			const items: InfoItem[] = [
				{ label: 'Battery Level', value: `${Math.round(battery.level * 100)}%`, raw: battery.level * 100 },
				{ label: 'Charging', value: battery.charging ? 'Yes' : 'No', raw: battery.charging }
			];
			if (battery.charging && battery.chargingTime !== Infinity) {
				items.push({ label: 'Time to Full', value: `${Math.round(battery.chargingTime / 60)} min`, raw: battery.chargingTime });
			}
			if (!battery.charging && battery.dischargingTime !== Infinity) {
				items.push({ label: 'Time Remaining', value: `${Math.round(battery.dischargingTime / 60)} min`, raw: battery.dischargingTime });
			}
			return items;
		} catch {
			return [{ label: 'Battery API', value: 'Error', raw: null }];
		}
	}

	function getGPUInfo(): InfoItem[] {
		try {
			const canvas = document.createElement('canvas');
			const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
			if (!gl) return [{ label: 'WebGL', value: 'Not supported', raw: false }];

			const glContext = gl as WebGLRenderingContext;
			const debugInfo = glContext.getExtension('WEBGL_debug_renderer_info');

			const items: InfoItem[] = [];

			if (debugInfo) {
				const vendor = glContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
				const renderer = glContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
				items.push({ label: 'GPU Vendor', value: vendor || 'Unknown', raw: vendor });
				items.push({ label: 'GPU Renderer', value: renderer || 'Unknown', raw: renderer });
			} else {
				items.push({ label: 'GPU Info', value: 'Hidden by browser', raw: null });
			}

			// WebGL version and capabilities
			const version = glContext.getParameter(glContext.VERSION);
			const glslVersion = glContext.getParameter(glContext.SHADING_LANGUAGE_VERSION);
			const maxTextureSize = glContext.getParameter(glContext.MAX_TEXTURE_SIZE);
			const maxViewportDims = glContext.getParameter(glContext.MAX_VIEWPORT_DIMS);

			items.push({ label: 'WebGL Version', value: version, raw: version });
			items.push({ label: 'GLSL Version', value: glslVersion, raw: glslVersion });
			items.push({ label: 'Max Texture Size', value: `${maxTextureSize}px`, raw: maxTextureSize });
			items.push({ label: 'Max Viewport', value: `${maxViewportDims[0]} × ${maxViewportDims[1]}`, raw: `${maxViewportDims[0]}x${maxViewportDims[1]}` });

			return items;
		} catch {
			return [{ label: 'WebGL', value: 'Error', raw: null }];
		}
	}

	function getScreenInfo(): InfoItem[] {
		const s = screen;
		const dpr = window.devicePixelRatio || 1;
		const items: InfoItem[] = [
			{ label: 'Screen Resolution', value: `${s.width} × ${s.height}`, raw: `${s.width}x${s.height}` },
			{ label: 'Actual Pixels', value: `${Math.round(s.width * dpr)} × ${Math.round(s.height * dpr)}`, raw: `${s.width * dpr}x${s.height * dpr}`, note: 'Physical pixels' },
			{ label: 'Available Area', value: `${s.availWidth} × ${s.availHeight}`, raw: `${s.availWidth}x${s.availHeight}` },
			{ label: 'Viewport Size', value: `${window.innerWidth} × ${window.innerHeight}`, raw: `${window.innerWidth}x${window.innerHeight}` },
			{ label: 'Device Pixel Ratio', value: `${dpr}x`, raw: dpr },
			{ label: 'Color Depth', value: `${s.colorDepth}-bit`, raw: s.colorDepth },
			{ label: 'Orientation', value: s.orientation?.type?.replace('-primary', '') || 'Unknown', raw: s.orientation?.type }
		];

		// Check for HDR support
		if (window.matchMedia) {
			const hdr = window.matchMedia('(dynamic-range: high)').matches;
			items.push({ label: 'HDR Display', value: hdr ? 'Yes' : 'No', raw: hdr });

			const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';
			items.push({ label: 'Preferred Theme', value: prefersColorScheme, raw: prefersColorScheme });

			const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			items.push({ label: 'Reduced Motion', value: reducedMotion ? 'Enabled' : 'Disabled', raw: reducedMotion });
		}

		return items;
	}

	function getHardwareInfo(): InfoItem[] {
		const nav = navigator as Navigator & { deviceMemory?: number };
		const items: InfoItem[] = [
			{ label: 'Logical CPU Cores', value: navigator.hardwareConcurrency?.toString() || 'Unknown', raw: navigator.hardwareConcurrency },
		];

		if (nav.deviceMemory) {
			items.push({
				label: 'Device Memory',
				value: `≥${nav.deviceMemory} GB`,
				raw: nav.deviceMemory,
				note: 'Browser caps at 8GB for privacy'
			});
		} else {
			items.push({ label: 'Device Memory', value: 'Not available', raw: null });
		}

		items.push(
			{ label: 'Max Touch Points', value: navigator.maxTouchPoints?.toString() || '0', raw: navigator.maxTouchPoints },
			{ label: 'Platform', value: navigator.platform || 'Unknown', raw: navigator.platform, note: 'May not reflect actual hardware' }
		);

		// Pointer capabilities
		if (window.matchMedia) {
			const pointer = window.matchMedia('(pointer: fine)').matches ? 'Fine (mouse)' :
				window.matchMedia('(pointer: coarse)').matches ? 'Coarse (touch)' : 'None';
			items.push({ label: 'Pointer Type', value: pointer, raw: pointer });

			const hover = window.matchMedia('(hover: hover)').matches ? 'Supported' : 'Not supported';
			items.push({ label: 'Hover Capability', value: hover, raw: hover });
		}

		return items;
	}

	function getBrowserInfo(): InfoItem[] {
		const ua = navigator.userAgent;

		// Parse browser
		let browser = 'Unknown';
		let version = '';
		if (ua.includes('Firefox/')) {
			browser = 'Firefox';
			version = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || '';
		} else if (ua.includes('Edg/')) {
			browser = 'Edge';
			version = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || '';
		} else if (ua.includes('OPR/')) {
			browser = 'Opera';
			version = ua.match(/OPR\/(\d+(\.\d+)?)/)?.[1] || '';
		} else if (ua.includes('Chrome/')) {
			browser = 'Chrome';
			version = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || '';
		} else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
			browser = 'Safari';
			version = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || '';
		}

		return [
			{ label: 'Browser', value: `${browser} ${version}`, raw: browser },
			{ label: 'Language', value: navigator.language, raw: navigator.language },
			{ label: 'Languages', value: navigator.languages?.slice(0, 3).join(', ') || navigator.language, raw: navigator.languages?.join(',') },
			{ label: 'Timezone', value: Intl.DateTimeFormat().resolvedOptions().timeZone, raw: Intl.DateTimeFormat().resolvedOptions().timeZone },
			{ label: 'Timezone Offset', value: `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`, raw: new Date().getTimezoneOffset() },
			{ label: 'Do Not Track', value: navigator.doNotTrack === '1' ? 'Enabled' : navigator.doNotTrack === '0' ? 'Disabled' : 'Not set', raw: navigator.doNotTrack }
		];
	}

	function getFeatureSupport(): InfoItem[] {
		return [
			{ label: 'Cookies', value: navigator.cookieEnabled ? 'Enabled' : 'Disabled', raw: navigator.cookieEnabled },
			{ label: 'Service Worker', value: 'serviceWorker' in navigator ? 'Yes' : 'No', raw: 'serviceWorker' in navigator },
			{ label: 'Web Workers', value: typeof Worker !== 'undefined' ? 'Yes' : 'No', raw: typeof Worker !== 'undefined' },
			{ label: 'SharedArrayBuffer', value: typeof SharedArrayBuffer !== 'undefined' ? 'Yes' : 'No', raw: typeof SharedArrayBuffer !== 'undefined' },
			{ label: 'WebAssembly', value: typeof WebAssembly !== 'undefined' ? 'Yes' : 'No', raw: typeof WebAssembly !== 'undefined' },
			{ label: 'WebGL 2', value: !!document.createElement('canvas').getContext('webgl2') ? 'Yes' : 'No', raw: !!document.createElement('canvas').getContext('webgl2') },
			{ label: 'WebGPU', value: 'gpu' in navigator ? 'Yes' : 'No', raw: 'gpu' in navigator },
			{ label: 'WebRTC', value: 'RTCPeerConnection' in window ? 'Yes' : 'No', raw: 'RTCPeerConnection' in window },
			{ label: 'Geolocation', value: 'geolocation' in navigator ? 'Yes' : 'No', raw: 'geolocation' in navigator },
			{ label: 'Notifications', value: 'Notification' in window ? 'Yes' : 'No', raw: 'Notification' in window },
			{ label: 'Web Bluetooth', value: 'bluetooth' in navigator ? 'Yes' : 'No', raw: 'bluetooth' in navigator },
			{ label: 'Web USB', value: 'usb' in navigator ? 'Yes' : 'No', raw: 'usb' in navigator },
			{ label: 'Web Serial', value: 'serial' in navigator ? 'Yes' : 'No', raw: 'serial' in navigator },
			{ label: 'Local Storage', value: typeof localStorage !== 'undefined' ? 'Yes' : 'No', raw: typeof localStorage !== 'undefined' },
			{ label: 'IndexedDB', value: 'indexedDB' in window ? 'Yes' : 'No', raw: 'indexedDB' in window }
		];
	}

	function getStorageInfo(): InfoItem[] {
		const items: InfoItem[] = [];

		// Try to get storage estimate
		if (navigator.storage?.estimate) {
			navigator.storage.estimate().then(estimate => {
				if (estimate.quota) {
					const quotaGB = (estimate.quota / (1024 * 1024 * 1024)).toFixed(2);
					const usageGB = estimate.usage ? (estimate.usage / (1024 * 1024 * 1024)).toFixed(4) : '0';
					const storageGroup = groups.find(g => g.name === 'Storage');
					if (storageGroup) {
						storageGroup.items = [
							{ label: 'Storage Quota', value: `${quotaGB} GB`, raw: estimate.quota },
							{ label: 'Storage Used', value: `${usageGB} GB`, raw: estimate.usage }
						];
						groups = [...groups];
					}
				}
			});
		}

		return [
			{ label: 'Storage Quota', value: 'Loading...', raw: null },
			{ label: 'Storage Used', value: 'Loading...', raw: null }
		];
	}

	async function loadInfo() {
		const os = getOS();
		const batteryInfo = await getBattery();

		groups = [
			{
				name: 'Device',
				icon: '💻',
				items: [
					{ label: 'Operating System', value: os.name + (os.version ? ` ${os.version}` : ''), raw: os.name },
					{ label: 'Architecture', value: os.architecture, raw: os.architecture, note: 'May not be accurate on all browsers' },
					{ label: 'Device Type', value: getDeviceType(), raw: getDeviceType() },
					...getHardwareInfo()
				]
			},
			{
				name: 'Battery',
				icon: '🔋',
				items: batteryInfo
			},
			{
				name: 'Browser',
				icon: '🌐',
				items: getBrowserInfo()
			},
			{
				name: 'Display',
				icon: '🖥️',
				items: getScreenInfo()
			},
			{
				name: 'Graphics (WebGL)',
				icon: '🎮',
				items: getGPUInfo()
			},
			{
				name: 'Storage',
				icon: '💾',
				items: getStorageInfo()
			},
			{
				name: 'Feature Support',
				icon: '⚡',
				items: getFeatureSupport()
			}
		];

		isLoading = false;
	}

	function getJSONData(): object {
		const data: Record<string, Record<string, string | number | boolean | null | undefined>> = {};
		for (const group of groups) {
			data[group.name] = {};
			for (const item of group.items) {
				data[group.name][item.label] = item.raw ?? item.value;
			}
		}
		data['userAgent'] = { full: navigator.userAgent } as Record<string, string | number | boolean | null>;
		return data;
	}

	function copyAsJSON() {
		const json = JSON.stringify(getJSONData(), null, 2);
		navigator.clipboard.writeText(json);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	$effect(() => {
		loadInfo();
	});
</script>

<ToolWrapper
	title="System Info"
	description="Comprehensive device, browser, and hardware information gathered from browser APIs."
>
	<div class="flex flex-col gap-5">
		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else}
			<!-- Warning about limitations -->
			<div class="alert alert-warning rounded-xl text-sm">
				<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<span>Browser APIs have privacy limits. Memory caps at 8GB, architecture may be indeterminate, and some values are approximations.</span>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-2 flex-wrap">
				<button class="btn btn-primary btn-sm gap-1" onclick={copyAsJSON}>
					{#if copied}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
						Copied!
					{:else}
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
						Copy as JSON
					{/if}
				</button>
				<button class="btn btn-ghost btn-sm" onclick={loadInfo}>
					🔄 Refresh
				</button>
			</div>

			<!-- Info Groups -->
			{#each groups as group}
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body py-4">
						<h3 class="font-semibold text-base flex items-center gap-2 mb-2">
							<span>{group.icon}</span>
							{group.name}
						</h3>
						<div class="grid gap-1.5 sm:grid-cols-2">
							{#each group.items as item}
								<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm gap-2 min-w-0">
									<div class="flex items-center gap-1 min-w-0 shrink-0 max-w-[40%]">
										<span class="text-base-content/70 truncate">{item.label}</span>
										{#if item.note}
											<div class="tooltip tooltip-top" data-tip={item.note}>
												<span class="text-warning text-xs">⚠️</span>
											</div>
										{/if}
									</div>
									<span class="font-mono font-medium text-xs truncate min-w-0" title={item.value}>
										{item.value}
									</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/each}

			<!-- User Agent -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-3">
					<h4 class="text-sm font-semibold mb-2">User Agent</h4>
					<code class="text-xs break-all text-base-content/70 bg-base-300/50 p-2 rounded-lg block">{navigator.userAgent}</code>
				</div>
			</div>
		{/if}
	</div>
</ToolWrapper>

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { 
		hexToRgb, rgbToHex, rgbToHsl, hslToRgb, 
		formatRgb, formatRgba, formatHsl, formatHsla,
		getAllColorFormats
	} from '$lib/utils/conversions';

	let inputValue = $state('#FF5733');
	let inputType = $state<'hex' | 'rgb' | 'hsl'>('hex');

	// Parse based on input type
	let parsedColor = $derived(() => {
		const cleaned = inputValue.trim();
		if (!cleaned) return null;

		try {
			if (inputType === 'hex') {
				const rgb = hexToRgb(cleaned);
				if (!rgb) return null;
				return { ...rgb, a: 1 };
			} else if (inputType === 'rgb') {
				const match = cleaned.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
				if (!match) return null;
				return {
					r: Math.min(255, Math.max(0, parseInt(match[1]))),
					g: Math.min(255, Math.max(0, parseInt(match[2]))),
					b: Math.min(255, Math.max(0, parseInt(match[3]))),
					a: match[4] ? parseFloat(match[4]) : 1
				};
			} else if (inputType === 'hsl') {
				const match = cleaned.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)/i);
				if (!match) return null;
				const h = parseFloat(match[1]) % 360;
				const s = Math.min(100, Math.max(0, parseFloat(match[2])));
				const l = Math.min(100, Math.max(0, parseFloat(match[3])));
				const rgb = hslToRgb(h, s, l);
				return { ...rgb, a: match[4] ? parseFloat(match[4]) : 1 };
			}
		} catch {
			return null;
		}
		return null;
	});

	let isValid = $derived(parsedColor() !== null);

	// Get all formats from parsed color
	let colorFormats = $derived(() => {
		const color = parsedColor();
		if (!color) return null;

		const hex = rgbToHex(color.r, color.g, color.b);
		const hsl = rgbToHsl(color.r, color.g, color.b);
		
		return {
			hex,
			hexLower: hex.toLowerCase(),
			rgb: formatRgb(color.r, color.g, color.b),
			rgba: formatRgba(color.r, color.g, color.b, color.a),
			hsl: formatHsl(hsl.h, hsl.s, hsl.l),
			hsla: formatHsla(hsl.h, hsl.s, hsl.l, color.a),
			values: {
				r: color.r,
				g: color.g,
				b: color.b,
				a: color.a,
				h: hsl.h,
				s: hsl.s,
				l: hsl.l
			}
		};
	});

	function loadSample() {
		inputValue = '#3B82F6';
		inputType = 'hex';
	}

	function clearAll() {
		inputValue = '';
	}

	// Color presets
	const colorPresets = [
		{ name: 'Red', hex: '#EF4444' },
		{ name: 'Orange', hex: '#F97316' },
		{ name: 'Yellow', hex: '#EAB308' },
		{ name: 'Green', hex: '#22C55E' },
		{ name: 'Blue', hex: '#3B82F6' },
		{ name: 'Purple', hex: '#A855F7' },
		{ name: 'Pink', hex: '#EC4899' },
		{ name: 'White', hex: '#FFFFFF' },
		{ name: 'Black', hex: '#000000' },
	];

	function setPreset(hex: string) {
		inputValue = hex;
		inputType = 'hex';
	}

	// Input placeholder based on type
	let placeholder = $derived(() => {
		switch (inputType) {
			case 'hex': return '#FF5733 or FF5733';
			case 'rgb': return 'rgb(255, 87, 51) or rgba(...)';
			case 'hsl': return 'hsl(9, 100%, 60%) or hsla(...)';
			default: return 'Enter color...';
		}
	});
</script>

<ToolWrapper
	title="Color Converter"
	description="Convert between color formats: HEX, RGB, RGBA, HSL, HSLA. Live color preview as you type."
	keywords={['color converter', 'hex to rgb', 'rgb to hsl', 'color picker', 'color format converter']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Color Input</h3>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={inputValue}
						placeholder={placeholder()}
						class="input input-bordered flex-1 font-mono"
						class:input-error={inputValue.trim() && !isValid}
					/>
					<select bind:value={inputType} class="select select-bordered w-24">
						<option value="hex">HEX</option>
						<option value="rgb">RGB</option>
						<option value="hsl">HSL</option>
					</select>
				</div>
				{#if inputValue.trim() && !isValid}
					<p class="text-error text-sm mt-2">Invalid color format</p>
				{/if}
				<div class="mt-3 flex flex-wrap gap-1">
					{#each colorPresets as preset}
						<button
							class="w-6 h-6 rounded-full border border-base-content/20 transition-transform hover:scale-110"
							style="background-color: {preset.hex};"
							onclick={() => setPreset(preset.hex)}
							title={preset.name}
						></button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if isValid && colorFormats()}
			{@const formats = colorFormats()!}
			
			<!-- Color Preview -->
			<div class="card rounded-2xl overflow-hidden" style="background: linear-gradient(135deg, {formats.hex}, {formats.hex}80);">
				<div class="card-body p-6">
					<div class="flex items-center justify-between">
						<div>
							<div class="text-white/80 text-sm mb-1">Preview</div>
							<div class="text-white text-2xl font-mono font-bold drop-shadow">{formats.hex}</div>
						</div>
						<div 
							class="w-20 h-20 rounded-2xl shadow-lg border-4 border-white/30"
							style="background-color: {formats.hex};"
						></div>
					</div>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="HEX Format" icon="🎨">
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">Uppercase</div>
							<code class="text-lg font-mono font-bold">{formats.hex}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.hex} label="" size="xs" />
						</div>
					</div>
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">Lowercase</div>
							<code class="text-lg font-mono font-bold">{formats.hexLower}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.hexLower} label="" size="xs" />
						</div>
					</div>
				</ConversionGroup>

				<ConversionGroup title="RGB Format" icon="🔴🟢🔵">
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">RGB</div>
							<code class="text-lg font-mono font-bold">{formats.rgb}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.rgb} label="" size="xs" />
						</div>
					</div>
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">RGBA</div>
							<code class="text-lg font-mono font-bold">{formats.rgba}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.rgba} label="" size="xs" />
						</div>
					</div>
				</ConversionGroup>

				<ConversionGroup title="HSL Format" icon="🌈">
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">HSL</div>
							<code class="text-lg font-mono font-bold">{formats.hsl}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.hsl} label="" size="xs" />
						</div>
					</div>
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">HSLA</div>
							<code class="text-lg font-mono font-bold">{formats.hsla}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.hsla} label="" size="xs" />
						</div>
					</div>
				</ConversionGroup>

				<ConversionGroup title="Individual Values" icon="📊">
					<div class="grid grid-cols-3 gap-2">
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">R</div>
							<div class="font-mono font-bold text-red-500">{formats.values.r}</div>
						</div>
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">G</div>
							<div class="font-mono font-bold text-green-500">{formats.values.g}</div>
						</div>
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">B</div>
							<div class="font-mono font-bold text-blue-500">{formats.values.b}</div>
						</div>
					</div>
					<div class="grid grid-cols-3 gap-2 mt-2">
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">H</div>
							<div class="font-mono font-bold">{Math.round(formats.values.h)}°</div>
						</div>
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">S</div>
							<div class="font-mono font-bold">{Math.round(formats.values.s)}%</div>
						</div>
						<div class="p-2 rounded-lg bg-base-300/50 text-center">
							<div class="text-xs text-base-content/60">L</div>
							<div class="font-mono font-bold">{Math.round(formats.values.l)}%</div>
						</div>
					</div>
				</ConversionGroup>
			</div>

			<!-- Color Components Visualization -->
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Component Breakdown</h3>
					
					<!-- RGB Bars -->
					<div class="space-y-2 mb-4">
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm text-red-500">R</span>
							<div class="flex-1 h-4 bg-base-300 rounded-full overflow-hidden">
								<div 
									class="h-full bg-red-500 transition-all"
									style="width: {(formats.values.r / 255) * 100}%;"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{formats.values.r}</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm text-green-500">G</span>
							<div class="flex-1 h-4 bg-base-300 rounded-full overflow-hidden">
								<div 
									class="h-full bg-green-500 transition-all"
									style="width: {(formats.values.g / 255) * 100}%;"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{formats.values.g}</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm text-blue-500">B</span>
							<div class="flex-1 h-4 bg-base-300 rounded-full overflow-hidden">
								<div 
									class="h-full bg-blue-500 transition-all"
									style="width: {(formats.values.b / 255) * 100}%;"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{formats.values.b}</span>
						</div>
					</div>

					<!-- HSL Bars -->
					<div class="space-y-2">
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm">H</span>
							<div class="flex-1 h-4 rounded-full overflow-hidden" style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);">
								<div 
									class="h-full w-1 bg-white border border-black/20 rounded transition-all"
									style="margin-left: {(formats.values.h / 360) * 100}%;"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{Math.round(formats.values.h)}°</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm">S</span>
							<div class="flex-1 h-4 bg-base-300 rounded-full overflow-hidden">
								<div 
									class="h-full transition-all"
									style="width: {formats.values.s}%; background-color: {formats.hex};"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{Math.round(formats.values.s)}%</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-8 text-sm">L</span>
							<div class="flex-1 h-4 rounded-full overflow-hidden" style="background: linear-gradient(to right, #000, #888, #fff);">
								<div 
									class="h-full w-1 bg-white border border-black/20 rounded transition-all"
									style="margin-left: {formats.values.l}%;"
								></div>
							</div>
							<span class="w-10 text-sm font-mono text-right">{Math.round(formats.values.l)}%</span>
						</div>
					</div>
				</div>
			</div>
		{:else if inputValue.trim()}
			<div class="card bg-error/10 rounded-2xl">
				<div class="card-body items-center text-center py-8">
					<span class="text-3xl mb-2">⚠️</span>
					<p class="text-error">Invalid color format</p>
					<p class="text-sm text-base-content/60 mt-2">
						Try: #FF5733, rgb(255, 87, 51), or hsl(9, 100%, 60%)
					</p>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">🎨</span>
					<p class="text-base-content/60">Enter a color above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Color Formats</h4>
				<div class="mt-2 text-sm text-base-content/70 space-y-1">
					<p><strong>HEX:</strong> #RRGGBB or #RGB (3-digit shorthand)</p>
					<p><strong>RGB:</strong> rgb(red, green, blue) — values 0-255</p>
					<p><strong>HSL:</strong> hsl(hue, saturation%, lightness%)</p>
					<p class="text-xs mt-2">Add 'a' for alpha: rgba(..., 0.5) or hsla(..., 0.5)</p>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

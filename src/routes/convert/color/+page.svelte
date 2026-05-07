<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { 
		hexToRgb, rgbToHex, rgbToHsl, hslToRgb, 
		formatRgb, formatRgba, formatHsl, formatHsla,
		rgbToCmyk, cmykToRgb, formatCmyk,
		getAllColorFormats
	} from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = convertToolsContent['color'];

	let inputValue = $state('#FF5733');
	let inputType = $state<'auto' | 'hex' | 'rgb' | 'hsl' | 'cmyk'>('auto');

	// Parse based on input type
	let parsedColor = $derived(() => {
		const cleaned = inputValue.trim();
		if (!cleaned) return null;

		try {
			// Auto-detection logic
			let type = inputType;
			if (inputType === 'auto') {
				if (cleaned.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/.test(cleaned)) type = 'hex';
				else if (cleaned.toLowerCase().startsWith('rgb')) type = 'rgb';
				else if (cleaned.toLowerCase().startsWith('hsl')) type = 'hsl';
				else if (cleaned.toLowerCase().startsWith('cmyk')) type = 'cmyk';
				// Default to hex if 3/6 chars of hex chars
				else if (/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(cleaned)) type = 'hex';
				else return null;
			}

			if (type === 'hex') {
				const rgb = hexToRgb(cleaned);
				if (!rgb) return null;
				return { ...rgb, a: 1 };
			} else if (type === 'rgb') {
				const match = cleaned.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
				if (!match) return null;
				return {
					r: Math.min(255, Math.max(0, parseInt(match[1]))),
					g: Math.min(255, Math.max(0, parseInt(match[2]))),
					b: Math.min(255, Math.max(0, parseInt(match[3]))),
					a: match[4] ? parseFloat(match[4]) : 1
				};
			} else if (type === 'hsl') {
				const match = cleaned.match(/hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)/i);
				if (!match) return null;
				const h = parseFloat(match[1]) % 360;
				const s = Math.min(100, Math.max(0, parseFloat(match[2])));
				const l = Math.min(100, Math.max(0, parseFloat(match[3])));
				const rgb = hslToRgb(h, s, l);
				return { ...rgb, a: match[4] ? parseFloat(match[4]) : 1 };
			} else if (type === 'cmyk') {
				const match = cleaned.match(/cmyk\s*\(\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
				if (!match) return null;
				const c = Math.min(100, Math.max(0, parseFloat(match[1])));
				const m = Math.min(100, Math.max(0, parseFloat(match[2])));
				const y = Math.min(100, Math.max(0, parseFloat(match[3])));
				const k = Math.min(100, Math.max(0, parseFloat(match[4])));
				const rgb = cmykToRgb(c, m, y, k);
				return { ...rgb, a: 1 };
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
		const cmyk = rgbToCmyk(color.r, color.g, color.b);
		
		return {
			hex,
			hexLower: hex.toLowerCase(),
			rgb: formatRgb(color.r, color.g, color.b),
			rgba: formatRgba(color.r, color.g, color.b, color.a),
			hsl: formatHsl(hsl.h, hsl.s, hsl.l),
			hsla: formatHsla(hsl.h, hsl.s, hsl.l, color.a),
			cmyk: formatCmyk(cmyk.c, cmyk.m, cmyk.y, cmyk.k),
			values: {
				r: color.r,
				g: color.g,
				b: color.b,
				a: color.a,
				h: hsl.h,
				s: hsl.s,
				l: hsl.l,
				c: cmyk.c,
				m: cmyk.m,
				y: cmyk.y,
				k: cmyk.k
			}
		};
	});

	function loadSample() {
		inputValue = '#3B82F6';
		inputType = 'auto';
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

	// Handle color picker change
	function handleColorPicker(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			inputValue = target.value;
			inputType = 'hex';
		}
	}

	// Input placeholder based on type
	let placeholder = $derived(() => {
		switch (inputType) {
			case 'hex': return '#FF5733 or FF5733';
			case 'rgb': return 'rgb(255, 87, 51) or rgba(...)';
			case 'hsl': return 'hsl(9, 100%, 60%) or hsla(...)';
			case 'cmyk': return 'cmyk(0, 100, 100, 0)';
			default: return 'Paste any color format (#hex, rgb, hsl, cmyk)...';
		}
	});
</script>

<ToolWrapper
	keywords={['color converter', 'hex to rgb', 'rgb to hsl', 'color picker', 'color format converter', 'cmyk conversion']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Color Input</h3>
				
				<!-- Color Picker -->
				<div class="flex items-center gap-3 mb-3">
					<div class="relative">
						<label 
							for="color-picker" 
							class="block w-16 h-16 rounded-2xl cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg"
							style="background: linear-gradient(135deg, {isValid ? colorFormats()?.hex || '#3B82F6' : '#3B82F6'}, {isValid ? colorFormats()?.hex || '#8B5CF6' : '#8B5CF6'}); padding: 4px;"
						>
							<input
								id="color-picker"
								type="color"
								value={isValid && colorFormats() ? colorFormats()!.hex : '#3B82F6'}
								onchange={handleColorPicker}
								class="w-full h-full rounded-xl cursor-pointer opacity-0 absolute inset-0"
							/>
							<div 
								class="w-full h-full rounded-xl border-2 border-white/50 shadow-inner"
								style="background-color: {isValid && colorFormats() ? colorFormats()!.hex : '#3B82F6'};"
							></div>
						</label>
						<div class="absolute -bottom-1 -right-1 bg-primary text-primary-content text-xs px-2 py-0.5 rounded-full shadow-md font-medium">
							🎨
						</div>
					</div>
					<div class="flex-1">
						<div class="text-xs text-base-content/60 mb-1 font-medium">Visual Color Picker</div>
						<p class="text-xs text-base-content/50">Click the swatch to pick a color visually, or enter a color code below</p>
					</div>
				</div>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={inputValue}
						placeholder={placeholder()}
						class="input input-bordered flex-1 font-mono"
						class:input-error={inputValue.trim() && !isValid}
					/>
					<select bind:value={inputType} class="select select-bordered w-28">
						<option value="auto">Auto</option>
						<option value="hex">HEX</option>
						<option value="rgb">RGB</option>
						<option value="hsl">HSL</option>
						<option value="cmyk">CMYK</option>
					</select>
				</div>
				{#if inputValue.trim() && !isValid}
					<p class="text-error text-sm mt-2">Invalid or unrecognized color format</p>
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
			<div class="card rounded-2xl overflow-hidden" style="background: linear-gradient(135deg, {formats.hex}, {formats.hex});">
				<div class="card-body p-6 relative overflow-hidden">
					<div class="absolute inset-0 bg-black/10"></div>
					<div class="relative flex items-center justify-between">
						<div>
							<div class="text-white/80 text-sm mb-1 font-medium">Preview</div>
							<div class="text-white text-3xl font-mono font-bold drop-shadow-md tracking-wider">{formats.hex}</div>
							<div class="text-white/60 text-sm mt-1 font-mono">{formats.rgb}</div>
						</div>
						<div 
							class="w-24 h-24 rounded-2xl shadow-xl border-4 border-white/40 backdrop-blur-sm"
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

				<ConversionGroup title="CMYK Format" icon="🖨️">
					<div class="p-3 rounded-xl bg-base-300/50 group flex items-center justify-between">
						<div>
							<div class="text-xs text-base-content/60 mb-1">CMYK</div>
							<code class="text-lg font-mono font-bold">{formats.cmyk}</code>
						</div>
						<div class="opacity-0 group-hover:opacity-100 transition-opacity">
							<CopyButton text={formats.cmyk} label="" size="xs" />
						</div>
					</div>
					<div class="grid grid-cols-4 gap-2 mt-2">
						{#each ['c', 'm', 'y', 'k'] as char}
							<div class="text-center p-2 bg-base-100 rounded-lg">
								<div class="text-xs text-base-content/60 uppercase">{char}</div>
								<div class="font-mono font-bold">{formats.values[char as keyof typeof formats.values]}</div>
							</div>
						{/each}
					</div>
				</ConversionGroup>
			</div>

			<!-- Color Components Visualization -->
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Component Breakdown</h3>
					
					<!-- RGB Bars -->
					<div class="space-y-4">
						<div>
							<div class="text-xs font-semibold mb-2 opacity-70">RGB</div>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-red-500">R</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-red-500 transition-all" style="width: {(formats.values.r / 255) * 100}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.r}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-green-500">G</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-green-500 transition-all" style="width: {(formats.values.g / 255) * 100}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.g}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-blue-500">B</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-blue-500 transition-all" style="width: {(formats.values.b / 255) * 100}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.b}</span>
								</div>
							</div>
						</div>

						<div class="divider my-0"></div>

						<!-- HSL Bars -->
						<div>
							<div class="text-xs font-semibold mb-2 opacity-70">HSL</div>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono">H</span>
									<div class="flex-1 h-2 rounded-full overflow-hidden" style="background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);">
										<div class="h-full w-1 bg-white ring-1 ring-black/20" style="margin-left: {(formats.values.h / 360) * 100}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{Math.round(formats.values.h)}°</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono">S</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-base-content transition-all" style="width: {formats.values.s}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{Math.round(formats.values.s)}%</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono">L</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-base-content transition-all" style="width: {formats.values.l}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{Math.round(formats.values.l)}%</span>
								</div>
							</div>
						</div>

						<div class="divider my-0"></div>

						<!-- CMYK Bars -->
						<div>
							<div class="text-xs font-semibold mb-2 opacity-70">CMYK</div>
							<div class="space-y-2">
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-cyan-500">C</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-cyan-500 transition-all" style="width: {formats.values.c}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.c}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-magenta-500">M</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-fuchsia-500 transition-all" style="width: {formats.values.m}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.m}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-yellow-500">Y</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-yellow-500 transition-all" style="width: {formats.values.y}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.y}</span>
								</div>
								<div class="flex items-center gap-3">
									<span class="w-4 text-sm font-mono text-black">K</span>
									<div class="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
										<div class="h-full bg-black transition-all" style="width: {formats.values.k}%;"></div>
									</div>
									<span class="w-8 text-sm font-mono text-right opacity-60">{formats.values.k}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else if inputValue.trim()}
			<div class="card bg-error/10 rounded-2xl">
				<div class="card-body items-center text-center py-8">
					<span class="text-3xl mb-2">⚠️</span>
					<p class="text-error">Invalid or unrecognized color format</p>
					<p class="text-sm text-base-content/60 mt-2">
						Try: #FF5733, rgb(255, 87, 51), hsl(9, 100%, 60%), or cmyk(0, 50, 50, 0)
					</p>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">🎨</span>
					<p class="text-base-content/60">Enter a color code to see conversions</p>
					<p class="text-xs text-base-content/40 mt-1">Supports HEX, RGB, HSL, CMYK</p>
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
					<p><strong>CMYK:</strong> cmyk(cyan, magenta, yellow, key) — values 0-100</p>
					<p class="text-xs mt-2">Add 'a' for alpha: rgba(..., 0.5) or hsla(..., 0.5)</p>
				</div>
			</div>
		</div>

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

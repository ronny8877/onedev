<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { securityToolsContent } from '$lib/config/content/security-tools-content';

	const content = securityToolsContent['csp'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// CSP Directives with descriptions
	const directives = [
		{ name: 'default-src', description: 'Default policy for all resources', common: ["'self'", "'none'"] },
		{ name: 'script-src', description: 'Sources for JavaScript', common: ["'self'", "'unsafe-inline'", "'unsafe-eval'"] },
		{ name: 'style-src', description: 'Sources for CSS', common: ["'self'", "'unsafe-inline'"] },
		{ name: 'img-src', description: 'Sources for images', common: ["'self'", 'data:', 'https:'] },
		{ name: 'font-src', description: 'Sources for fonts', common: ["'self'", 'https://fonts.gstatic.com'] },
		{ name: 'connect-src', description: 'Sources for fetch, XHR, WebSocket', common: ["'self'", 'https:'] },
		{ name: 'media-src', description: 'Sources for audio/video', common: ["'self'"] },
		{ name: 'object-src', description: 'Sources for plugins (Flash, etc.)', common: ["'none'"] },
		{ name: 'frame-src', description: 'Sources for iframes', common: ["'self'", "'none'"] },
		{ name: 'frame-ancestors', description: 'Who can embed this page', common: ["'self'", "'none'"] },
		{ name: 'base-uri', description: 'Base URL for relative URLs', common: ["'self'"] },
		{ name: 'form-action', description: 'Form submission targets', common: ["'self'"] }
	];

	const unsafeValues = ["'unsafe-inline'", "'unsafe-eval'", '*'];

	// State
	let mode = $state<'build' | 'analyze'>('build');
	let cspInput = $state('');
	let selectedDirectives = $state<Record<string, string[]>>({});

	// Presets
	const presets = {
		strict: {
			'default-src': ["'none'"],
			'script-src': ["'self'"],
			'style-src': ["'self'"],
			'img-src': ["'self'"],
			'font-src': ["'self'"],
			'connect-src': ["'self'"],
			'frame-ancestors': ["'none'"],
			'base-uri': ["'self'"],
			'form-action': ["'self'"]
		},
		moderate: {
			'default-src': ["'self'"],
			'script-src': ["'self'", "'unsafe-inline'"],
			'style-src': ["'self'", "'unsafe-inline'"],
			'img-src': ["'self'", 'data:', 'https:'],
			'font-src': ["'self'", 'https://fonts.gstatic.com'],
			'connect-src': ["'self'", 'https:']
		},
		legacy: {
			'default-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
			'img-src': ['*']
		}
	};

	function loadPreset(name: keyof typeof presets) {
		selectedDirectives = { ...presets[name] };
	}

	function toggleValue(directive: string, value: string) {
		const current = selectedDirectives[directive] || [];
		if (current.includes(value)) {
			selectedDirectives[directive] = current.filter(v => v !== value);
			if (selectedDirectives[directive].length === 0) {
				delete selectedDirectives[directive];
			}
		} else {
			selectedDirectives[directive] = [...current, value];
		}
		selectedDirectives = { ...selectedDirectives };
	}

	function addCustomValue(directive: string, value: string) {
		if (!value.trim()) return;
		const current = selectedDirectives[directive] || [];
		if (!current.includes(value.trim())) {
			selectedDirectives[directive] = [...current, value.trim()];
			selectedDirectives = { ...selectedDirectives };
		}
	}

	// Generate CSP string
	let generatedCSP = $derived(() => {
		return Object.entries(selectedDirectives)
			.filter(([_, values]) => values.length > 0)
			.map(([directive, values]) => `${directive} ${values.join(' ')}`)
			.join('; ');
	});

	// Parse CSP for analysis
	interface ParsedDirective {
		name: string;
		values: string[];
		warnings: string[];
	}

	function parseCSP(csp: string): ParsedDirective[] {
		if (!csp.trim()) return [];
		
		return csp.split(';').map(part => {
			const tokens = part.trim().split(/\s+/);
			const name = tokens[0];
			const values = tokens.slice(1);
			const warnings: string[] = [];

			values.forEach(v => {
				if (unsafeValues.includes(v)) {
					warnings.push(`"${v}" is potentially unsafe`);
				}
			});

			if (name === 'script-src' && values.includes("'unsafe-inline'") && !values.some(v => v.startsWith("'nonce-") || v.startsWith("'sha"))) {
				warnings.push('Consider using nonce or hash instead of unsafe-inline');
			}

			return { name, values, warnings };
		}).filter(d => d.name);
	}

	let parsedCSP = $derived(parseCSP(cspInput));

	function clearAll() {
		selectedDirectives = {};
		cspInput = '';
	}

	let httpHeader = $derived(`Content-Security-Policy: ${generatedCSP()}`);
	let metaTag = $derived(`<meta http-equiv="Content-Security-Policy" content="${generatedCSP()}">`);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Mode Toggle -->
		<div class="flex justify-center">
			<div class="join">
				<button class="join-item btn {mode === 'build' ? 'btn-primary' : 'btn-ghost'}" onclick={() => mode = 'build'}>
					Build CSP
				</button>
				<button class="join-item btn {mode === 'analyze' ? 'btn-primary' : 'btn-ghost'}" onclick={() => mode = 'analyze'}>
					Analyze CSP
				</button>
			</div>
		</div>

		{#if mode === 'build'}
			<!-- Presets -->
			<div class="flex flex-wrap gap-2 justify-center">
				<span class="text-sm text-base-content/60">Presets:</span>
				<button class="btn btn-xs btn-ghost" onclick={() => loadPreset('strict')}>Strict</button>
				<button class="btn btn-xs btn-ghost" onclick={() => loadPreset('moderate')}>Moderate</button>
				<button class="btn btn-xs btn-ghost" onclick={() => loadPreset('legacy')}>Legacy</button>
				<button class="btn btn-xs btn-ghost text-error" onclick={clearAll}>Clear</button>
			</div>

			<!-- Directive Builder -->
			<div class="grid gap-3 md:grid-cols-2">
				{#each directives as directive}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-3">
							<div class="flex items-center justify-between mb-2">
								<h4 class="font-mono font-bold text-sm">{directive.name}</h4>
								{#if (selectedDirectives[directive.name] || []).some(v => unsafeValues.includes(v))}
									<span class="badge badge-warning badge-xs">unsafe</span>
								{/if}
							</div>
							<p class="text-xs text-base-content/60 mb-2">{directive.description}</p>
							<div class="flex flex-wrap gap-1">
								{#each directive.common as value}
									<button 
										class="btn btn-xs {(selectedDirectives[directive.name] || []).includes(value) ? 
											(unsafeValues.includes(value) ? 'btn-warning' : 'btn-primary') : 'btn-ghost'}"
										onclick={() => toggleValue(directive.name, value)}
									>
										{value}
									</button>
								{/each}
								<input 
									type="text" 
									placeholder="+ custom"
									class="input input-xs input-bordered w-20"
									onkeydown={(e) => {
										if (e.key === 'Enter') {
											addCustomValue(directive.name, (e.target as HTMLInputElement).value);
											(e.target as HTMLInputElement).value = '';
										}
									}}
								/>
							</div>
							{#if selectedDirectives[directive.name]?.length}
								<div class="mt-2 text-xs font-mono text-base-content/70">
									{selectedDirectives[directive.name].join(' ')}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>

			<!-- Generated Output -->
			{#if generatedCSP()}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-bold">Generated CSP</h3>
							<CopyButton text={generatedCSP()} size="sm" />
						</div>
						<pre class="bg-base-100 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap break-all">{generatedCSP()}</pre>

						<div class="grid gap-3 mt-4 md:grid-cols-2">
							<div>
								<div class="flex items-center justify-between mb-1">
									<span class="text-xs font-bold">HTTP Header</span>
									<CopyButton text={httpHeader} size="sm" />
								</div>
								<pre class="bg-base-100 p-2 rounded text-xs font-mono break-all whitespace-pre-wrap max-h-24 overflow-y-auto">{httpHeader}</pre>
							</div>
							<div>
								<div class="flex items-center justify-between mb-1">
									<span class="text-xs font-bold">Meta Tag</span>
									<CopyButton text={metaTag} size="sm" />
								</div>
								<pre class="bg-base-100 p-2 rounded text-xs font-mono break-all whitespace-pre-wrap max-h-24 overflow-y-auto">{metaTag}</pre>
							</div>
						</div>
					</div>
				</div>
			{/if}

		{:else}
			<!-- Analyze Mode -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-2">Paste CSP to Analyze</h3>
					<textarea
						bind:value={cspInput}
						placeholder="default-src 'self'; script-src 'self' 'unsafe-inline'..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-24"
					></textarea>
				</div>
			</div>

			{#if parsedCSP.length > 0}
				<div class="space-y-2">
					{#each parsedCSP as directive}
						<div class="card bg-base-200 rounded-xl {directive.warnings.length > 0 ? 'border border-warning/30' : ''}">
							<div class="card-body p-3">
								<div class="flex items-center gap-2">
									<span class="font-mono font-bold text-sm">{directive.name}</span>
									{#if directive.warnings.length > 0}
										<span class="badge badge-warning badge-xs">!</span>
									{/if}
								</div>
								<div class="flex flex-wrap gap-1 mt-1">
									{#each directive.values as value}
										<span class="badge badge-sm {unsafeValues.includes(value) ? 'badge-warning' : 'badge-ghost'}">
											{value}
										</span>
									{/each}
								</div>
								{#if directive.warnings.length > 0}
									<div class="mt-2 space-y-1">
										{#each directive.warnings as warning}
											<p class="text-xs text-warning">{warning}</p>
										{/each}
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
	</div>
</ToolWrapper>

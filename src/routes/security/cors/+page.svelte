<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { securityToolsContent } from '$lib/config/content/security-tools-content';

	const content = securityToolsContent['cors'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// State
	let allowedOrigins = $state<string[]>(['*']);
	let customOrigin = $state('');
	let allowedMethods = $state<string[]>(['GET', 'POST']);
	let allowedHeaders = $state<string[]>(['Content-Type']);
	let customHeader = $state('');
	let allowCredentials = $state(false);
	let maxAge = $state(86400);
	let exposeHeaders = $state<string[]>([]);

	const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
	const commonHeaders = ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Api-Key'];
	const originPresets = ['*', 'https://example.com', 'http://localhost:3000'];

	function toggleMethod(method: string) {
		if (allowedMethods.includes(method)) {
			allowedMethods = allowedMethods.filter(m => m !== method);
		} else {
			allowedMethods = [...allowedMethods, method];
		}
	}

	function toggleHeader(header: string) {
		if (allowedHeaders.includes(header)) {
			allowedHeaders = allowedHeaders.filter(h => h !== header);
		} else {
			allowedHeaders = [...allowedHeaders, header];
		}
	}

	function addCustomOrigin() {
		if (customOrigin.trim() && !allowedOrigins.includes(customOrigin.trim())) {
			allowedOrigins = [...allowedOrigins.filter(o => o !== '*'), customOrigin.trim()];
			customOrigin = '';
		}
	}

	function removeOrigin(origin: string) {
		allowedOrigins = allowedOrigins.filter(o => o !== origin);
		if (allowedOrigins.length === 0) {
			allowedOrigins = ['*'];
		}
	}

	function setWildcard() {
		allowedOrigins = ['*'];
	}

	// Generate headers
	let corsHeaders = $derived(() => {
		const headers: Record<string, string> = {};
		
		headers['Access-Control-Allow-Origin'] = allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins.join(', ');
		
		if (allowedMethods.length > 0) {
			headers['Access-Control-Allow-Methods'] = allowedMethods.join(', ');
		}
		
		if (allowedHeaders.length > 0) {
			headers['Access-Control-Allow-Headers'] = allowedHeaders.join(', ');
		}
		
		if (allowCredentials) {
			headers['Access-Control-Allow-Credentials'] = 'true';
		}
		
		if (maxAge > 0) {
			headers['Access-Control-Max-Age'] = maxAge.toString();
		}
		
		if (exposeHeaders.length > 0) {
			headers['Access-Control-Expose-Headers'] = exposeHeaders.join(', ');
		}
		
		return headers;
	});

	let headerText = $derived(() => {
		return Object.entries(corsHeaders())
			.map(([key, value]) => `${key}: ${value}`)
			.join('\n');
	});

	// Warnings
	let warnings = $derived(() => {
		const w: string[] = [];
		if (allowedOrigins.includes('*') && allowCredentials) {
			w.push('Cannot use credentials with wildcard origin (*)');
		}
		if (allowedOrigins.includes('*')) {
			w.push('Wildcard origin allows any website to make requests');
		}
		if (!allowedMethods.includes('OPTIONS')) {
			w.push('Consider including OPTIONS for preflight requests');
		}
		return w;
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Builder -->
			<div class="space-y-4">
				<!-- Origins -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm mb-3">Allowed Origins</h3>
						<div class="flex flex-wrap gap-1 mb-2">
							{#each allowedOrigins as origin}
								<span class="badge badge-primary gap-1">
									{origin}
									{#if origin !== '*' || allowedOrigins.length > 1}
										<button onclick={() => removeOrigin(origin)}>×</button>
									{/if}
								</span>
							{/each}
						</div>
						<div class="flex gap-2">
							<input 
								type="text" 
								bind:value={customOrigin}
								placeholder="https://example.com"
								class="input input-sm input-bordered flex-1"
								onkeydown={(e) => e.key === 'Enter' && addCustomOrigin()}
							/>
							<button class="btn btn-sm btn-ghost" onclick={addCustomOrigin}>Add</button>
							<button class="btn btn-sm btn-ghost" onclick={setWildcard}>*</button>
						</div>
					</div>
				</div>

				<!-- Methods -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm mb-3">Allowed Methods</h3>
						<div class="flex flex-wrap gap-1">
							{#each methods as method}
								<button 
									class="btn btn-sm {allowedMethods.includes(method) ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => toggleMethod(method)}
								>
									{method}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Headers -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm mb-3">Allowed Headers</h3>
						<div class="flex flex-wrap gap-1">
							{#each commonHeaders as header}
								<button 
									class="btn btn-xs {allowedHeaders.includes(header) ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => toggleHeader(header)}
								>
									{header}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Options -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm mb-3">Options</h3>
						<div class="space-y-3">
							<label class="flex items-center gap-2">
								<input type="checkbox" bind:checked={allowCredentials} class="checkbox checkbox-sm" />
								<span class="text-sm">Allow Credentials (cookies, auth)</span>
							</label>
							<div class="flex items-center gap-2">
								<span class="text-sm">Max Age:</span>
								<input 
									type="number" 
									bind:value={maxAge} 
									class="input input-sm input-bordered w-24"
								/>
								<span class="text-xs text-base-content/60">seconds</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Output -->
			<div class="space-y-4">
				<!-- Warnings -->
				{#if warnings().length > 0}
					<div class="card bg-warning/10 border border-warning/20 rounded-xl">
						<div class="card-body p-3">
							<h4 class="font-bold text-sm text-warning">Warnings</h4>
							<ul class="list-disc ml-4 text-sm">
								{#each warnings() as warning}
									<li>{warning}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}

				<!-- Generated Headers -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-bold">Response Headers</h3>
							<CopyButton text={headerText()} size="sm" />
						</div>
						<pre class="bg-base-100 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">{headerText()}</pre>
					</div>
				</div>

				<!-- Usage Examples -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h4 class="font-bold text-sm mb-3">Usage</h4>
						<div class="space-y-3">
							<div>
								<p class="text-xs font-bold text-base-content/60 mb-1">Express.js</p>
								<pre class="bg-base-100 p-2 rounded text-xs font-mono overflow-x-auto">res.set({'{'}
{Object.entries(corsHeaders()).map(([k, v]) => `  '${k}': '${v}'`).join(',\n')}
{'}'});</pre>
							</div>
							<div>
								<p class="text-xs font-bold text-base-content/60 mb-1">Nginx</p>
								<pre class="bg-base-100 p-2 rounded text-xs font-mono overflow-x-auto">{Object.entries(corsHeaders()).map(([k, v]) => `add_header '${k}' '${v}';`).join('\n')}</pre>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
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

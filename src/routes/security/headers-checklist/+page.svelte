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

	const content = securityToolsContent['headers-checklist'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// Headers with framework-specific snippets
	const headers = [
		{
			name: 'Content-Security-Policy',
			required: true,
			description: 'Defines approved sources of content. Prevents XSS and data injection.',
			snippets: {
				nginx: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:\";",
				apache: "Header set Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:\"",
				node: "res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self'\");",
				cloudflare: "Content-Security-Policy: default-src 'self'"
			}
		},
		{
			name: 'Strict-Transport-Security',
			required: true,
			description: 'Forces HTTPS connections. Protects against protocol downgrade attacks.',
			snippets: {
				nginx: 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";',
				apache: 'Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"',
				node: "res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');",
				cloudflare: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
			}
		},
		{
			name: 'X-Content-Type-Options',
			required: true,
			description: 'Prevents MIME type sniffing. Always set to nosniff.',
			snippets: {
				nginx: 'add_header X-Content-Type-Options "nosniff";',
				apache: 'Header always set X-Content-Type-Options "nosniff"',
				node: "res.setHeader('X-Content-Type-Options', 'nosniff');",
				cloudflare: 'X-Content-Type-Options: nosniff'
			}
		},
		{
			name: 'X-Frame-Options',
			required: true,
			description: 'Prevents clickjacking by controlling iframe embedding.',
			snippets: {
				nginx: 'add_header X-Frame-Options "DENY";',
				apache: 'Header always set X-Frame-Options "DENY"',
				node: "res.setHeader('X-Frame-Options', 'DENY');",
				cloudflare: 'X-Frame-Options: DENY'
			}
		},
		{
			name: 'Referrer-Policy',
			required: false,
			description: 'Controls how much referrer info is sent with requests.',
			snippets: {
				nginx: 'add_header Referrer-Policy "strict-origin-when-cross-origin";',
				apache: 'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
				node: "res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');",
				cloudflare: 'Referrer-Policy: strict-origin-when-cross-origin'
			}
		},
		{
			name: 'Permissions-Policy',
			required: false,
			description: 'Controls browser features like camera, microphone, geolocation.',
			snippets: {
				nginx: 'add_header Permissions-Policy "geolocation=(), microphone=(), camera=()";',
				apache: 'Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"',
				node: "res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');",
				cloudflare: 'Permissions-Policy: geolocation=(), microphone=(), camera=()'
			}
		},
		{
			name: 'Cross-Origin-Opener-Policy',
			required: false,
			description: 'Isolates document from cross-origin windows.',
			snippets: {
				nginx: 'add_header Cross-Origin-Opener-Policy "same-origin";',
				apache: 'Header always set Cross-Origin-Opener-Policy "same-origin"',
				node: "res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');",
				cloudflare: 'Cross-Origin-Opener-Policy: same-origin'
			}
		},
		{
			name: 'Cross-Origin-Embedder-Policy',
			required: false,
			description: 'Prevents loading cross-origin resources without permission.',
			snippets: {
				nginx: 'add_header Cross-Origin-Embedder-Policy "require-corp";',
				apache: 'Header always set Cross-Origin-Embedder-Policy "require-corp"',
				node: "res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');",
				cloudflare: 'Cross-Origin-Embedder-Policy: require-corp'
			}
		}
	];

	// State
	let framework = $state<'nginx' | 'apache' | 'node' | 'cloudflare'>('nginx');
	let environment = $state<'dev' | 'prod'>('prod');
	let implemented = $state<Set<string>>(new Set());

	function toggleImplemented(name: string) {
		const newSet = new Set(implemented);
		if (newSet.has(name)) {
			newSet.delete(name);
		} else {
			newSet.add(name);
		}
		implemented = newSet;
	}

	let progress = $derived(() => {
		const required = headers.filter(h => h.required).length;
		const requiredDone = headers.filter(h => h.required && implemented.has(h.name)).length;
		const total = headers.length;
		const done = implemented.size;
		return { required, requiredDone, total, done, percent: Math.round((done / total) * 100) };
	});

	function copyAllSnippets() {
		const snippets = headers.map(h => h.snippets[framework]).join('\n');
		navigator.clipboard.writeText(snippets);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap gap-4 justify-center">
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium">Framework:</span>
				<select bind:value={framework} class="select select-sm select-bordered">
					<option value="nginx">NGINX</option>
					<option value="apache">Apache</option>
					<option value="node">Node.js</option>
					<option value="cloudflare">Cloudflare</option>
				</select>
			</div>
			<div class="flex items-center gap-2">
				<span class="text-sm font-medium">Environment:</span>
				<div class="join">
					<button class="join-item btn btn-sm {environment === 'dev' ? 'btn-primary' : 'btn-ghost'}" onclick={() => environment = 'dev'}>Dev</button>
					<button class="join-item btn btn-sm {environment === 'prod' ? 'btn-primary' : 'btn-ghost'}" onclick={() => environment = 'prod'}>Prod</button>
				</div>
			</div>
		</div>

		<!-- Progress -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-2">
					<div>
						<span class="font-bold">{progress().done}/{progress().total} implemented</span>
						<span class="text-sm text-base-content/60 ml-2">({progress().requiredDone}/{progress().required} required)</span>
					</div>
					<button class="btn btn-sm btn-ghost" onclick={copyAllSnippets}>Copy All</button>
				</div>
				<div class="w-full h-2 bg-base-300 rounded-full overflow-hidden">
					<div class="h-full bg-success rounded-full transition-all" style="width: {progress().percent}%"></div>
				</div>
			</div>
		</div>

		<!-- Headers List -->
		<div class="space-y-3">
			{#each headers as header}
				<div class="card bg-base-200 rounded-xl {implemented.has(header.name) ? 'ring-2 ring-success/30' : ''}">
					<div class="card-body p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-center gap-3">
								<input 
									type="checkbox" 
									checked={implemented.has(header.name)}
									class="checkbox checkbox-sm checkbox-success"
									onchange={() => toggleImplemented(header.name)}
								/>
								<div>
									<div class="flex items-center gap-2">
										<h3 class="font-bold font-mono text-sm">{header.name}</h3>
										{#if header.required}
											<span class="badge badge-error badge-xs">Required</span>
										{:else}
											<span class="badge badge-ghost badge-xs">Optional</span>
										{/if}
									</div>
									<p class="text-xs text-base-content/60 mt-1">{header.description}</p>
								</div>
							</div>
							<CopyButton text={header.snippets[framework]} size="sm" />
						</div>
						<pre class="mt-2 p-2 bg-base-100 rounded text-xs font-mono whitespace-pre-wrap break-all">{header.snippets[framework]}</pre>
					</div>
				</div>
			{/each}
		</div>

		{#if environment === 'dev'}
			<div class="alert alert-warning rounded-xl">
				<span class="text-sm">Development mode: Some headers like HSTS may cause issues during local development.</span>
			</div>
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

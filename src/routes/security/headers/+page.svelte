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

	const content = securityToolsContent['headers'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// Security Headers database
	const headers = [
		{
			name: 'Content-Security-Policy',
			category: 'XSS Prevention',
			importance: 'Critical',
			color: 'error',
			description: 'Defines approved sources of content that browsers should load.',
			example: "default-src 'self'; script-src 'self' https://trusted.com",
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
			tip: 'Start with a report-only policy to test before enforcing.'
		},
		{
			name: 'Strict-Transport-Security',
			category: 'HTTPS',
			importance: 'Critical',
			color: 'error',
			description: 'Forces browsers to only connect via HTTPS.',
			example: 'max-age=31536000; includeSubDomains; preload',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security',
			tip: 'Include preload for browsers to enforce HTTPS from first visit.'
		},
		{
			name: 'X-Content-Type-Options',
			category: 'MIME Sniffing',
			importance: 'High',
			color: 'warning',
			description: 'Prevents browsers from MIME-sniffing a response away from declared content-type.',
			example: 'nosniff',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options',
			tip: 'Always set this to nosniff.'
		},
		{
			name: 'X-Frame-Options',
			category: 'Clickjacking',
			importance: 'High',
			color: 'warning',
			description: 'Prevents your page from being embedded in iframes.',
			example: 'DENY',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options',
			tip: 'Use CSP frame-ancestors for more control.'
		},
		{
			name: 'X-XSS-Protection',
			category: 'XSS Prevention',
			importance: 'Low',
			color: 'info',
			description: 'Configures the XSS filter built into browsers. (Deprecated)',
			example: '0',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection',
			tip: 'Set to 0 and rely on CSP instead. The XSS filter can introduce vulnerabilities.'
		},
		{
			name: 'Referrer-Policy',
			category: 'Privacy',
			importance: 'Medium',
			color: 'success',
			description: 'Controls how much referrer information is included with requests.',
			example: 'strict-origin-when-cross-origin',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy',
			tip: 'Use strict-origin-when-cross-origin for a good balance.'
		},
		{
			name: 'Permissions-Policy',
			category: 'Feature Control',
			importance: 'Medium',
			color: 'success',
			description: 'Controls which browser features can be used.',
			example: 'geolocation=(), microphone=(), camera=()',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy',
			tip: 'Disable features you don\'t use to reduce attack surface.'
		},
		{
			name: 'Cross-Origin-Opener-Policy',
			category: 'Isolation',
			importance: 'Medium',
			color: 'success',
			description: 'Isolates your document from cross-origin windows.',
			example: 'same-origin',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy',
			tip: 'Required for SharedArrayBuffer and high-resolution timers.'
		},
		{
			name: 'Cross-Origin-Resource-Policy',
			category: 'Isolation',
			importance: 'Medium',
			color: 'success',
			description: 'Prevents other origins from reading your resources.',
			example: 'same-origin',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy',
			tip: 'Use same-site for most resources.'
		},
		{
			name: 'Cross-Origin-Embedder-Policy',
			category: 'Isolation',
			importance: 'Medium',
			color: 'success',
			description: 'Prevents loading cross-origin resources without explicit permission.',
			example: 'require-corp',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy',
			tip: 'Required for cross-origin isolation.'
		},
		{
			name: 'Cache-Control',
			category: 'Caching',
			importance: 'High',
			color: 'warning',
			description: 'Directives for caching mechanisms in both requests and responses.',
			example: 'no-store, no-cache, must-revalidate',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control',
			tip: 'Use no-store for sensitive data to prevent caching.'
		},
		{
			name: 'Clear-Site-Data',
			category: 'Privacy',
			importance: 'Medium',
			color: 'success',
			description: 'Clears browsing data (cookies, storage, cache) associated with the site.',
			example: '"cache", "cookies", "storage"',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Clear-Site-Data',
			tip: 'Use on logout pages to clear all user data.'
		},
		{
			name: 'Content-Type',
			category: 'MIME Type',
			importance: 'High',
			color: 'warning',
			description: 'Indicates the media type of the resource.',
			example: 'text/html; charset=utf-8',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type',
			tip: 'Always include charset for text content.'
		},
		{
			name: 'X-DNS-Prefetch-Control',
			category: 'Performance',
			importance: 'Low',
			color: 'info',
			description: 'Controls DNS prefetching, which can leak privacy info.',
			example: 'off',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control',
			tip: 'Set to off for privacy-sensitive applications.'
		},
		{
			name: 'X-Download-Options',
			category: 'Download',
			importance: 'Low',
			color: 'info',
			description: 'Prevents IE from executing downloads in the site\'s context.',
			example: 'noopen',
			docs: 'https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/',
			tip: 'Use noopen for IE security.'
		},
		{
			name: 'X-Permitted-Cross-Domain-Policies',
			category: 'Cross-Domain',
			importance: 'Low',
			color: 'info',
			description: 'Controls Adobe Flash and PDF cross-domain policies.',
			example: 'none',
			docs: 'https://owasp.org/www-project-secure-headers/',
			tip: 'Set to none unless using Flash or PDF embedding.'
		},
		{
			name: 'Expect-CT',
			category: 'Certificate Transparency',
			importance: 'Low',
			color: 'info',
			description: 'Allows sites to opt in to Certificate Transparency requirements. (Deprecated)',
			example: 'max-age=86400, enforce',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expect-CT',
			tip: 'Now enforced by default in Chrome. May be removed soon.'
		},
		{
			name: 'Origin-Agent-Cluster',
			category: 'Isolation',
			importance: 'Low',
			color: 'info',
			description: 'Hints that the document should be placed in an origin-keyed agent cluster.',
			example: '?1',
			docs: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin-Agent-Cluster',
			tip: 'Improves isolation for sites with subdomains.'
		}
	];

	let search = $state('');
	let selectedCategory = $state<string | null>(null);

	const categories = [...new Set(headers.map(h => h.category))];

	let filteredHeaders = $derived(() => {
		let result = headers;
		if (selectedCategory) {
			result = result.filter(h => h.category === selectedCategory);
		}
		if (search) {
			const q = search.toLowerCase();
			result = result.filter(h => 
				h.name.toLowerCase().includes(q) || 
				h.description.toLowerCase().includes(q)
			);
		}
		return result;
	});

	function generateFullConfig() {
		return headers.map(h => `${h.name}: ${h.example}`).join('\n');
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Search & Filter -->
		<div class="flex flex-col sm:flex-row gap-4">
			<input
				type="text"
				bind:value={search}
				placeholder="Search headers..."
				class="input input-bordered flex-1"
			/>
			<div class="flex flex-wrap gap-1">
				<button 
					class="btn btn-sm {selectedCategory === null ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => selectedCategory = null}
				>All</button>
				{#each categories as cat}
					<button 
						class="btn btn-sm {selectedCategory === cat ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => selectedCategory = cat}
					>{cat}</button>
				{/each}
			</div>
		</div>

		<!-- Quick Copy All -->
		<div class="flex justify-end">
			<CopyButton text={generateFullConfig()} size="sm" label="Copy All Headers" />
		</div>

		<!-- Headers List -->
		<div class="space-y-3">
			{#each filteredHeaders() as header}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<div class="flex items-start justify-between gap-4">
							<div class="flex-1">
								<div class="flex items-center gap-2 flex-wrap">
									<h3 class="font-bold font-mono">{header.name}</h3>
									<span class="badge badge-{header.color} badge-sm">{header.importance}</span>
									<span class="badge badge-ghost badge-sm">{header.category}</span>
								</div>
								<p class="text-sm text-base-content/70 mt-1">{header.description}</p>
							</div>
							<CopyButton text={`${header.name}: ${header.example}`} size="sm" />
						</div>

						<div class="mt-3 p-3 bg-base-100 rounded-lg">
							<pre class="text-sm font-mono">{header.name}: {header.example}</pre>
						</div>

						<div class="flex items-center justify-between mt-2">
							<p class="text-xs text-base-content/50">💡 {header.tip}</p>
							<a 
								href={header.docs} 
								target="_blank" 
								rel="noopener"
								class="text-xs text-primary hover:underline"
							>MDN Docs →</a>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredHeaders().length === 0}
			<div class="text-center py-8 text-base-content/50">
				No headers match your search
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

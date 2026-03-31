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

	const content = securityToolsContent['x-frame'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// X-Frame-Options values
	const options = [
		{
			value: 'DENY',
			header: 'X-Frame-Options: DENY',
			description: 'The page cannot be displayed in a frame, regardless of the site attempting to do so.',
			useCases: ['Banking / financial sites', 'Admin panels', 'Login pages'],
			cspEquivalent: "frame-ancestors 'none'",
			protection: 'Maximum',
			color: 'error'
		},
		{
			value: 'SAMEORIGIN',
			header: 'X-Frame-Options: SAMEORIGIN',
			description: 'The page can only be displayed in a frame on the same origin as the page itself.',
			useCases: ['Internal applications', 'Sites with legitimate iframe usage', 'Embeddable widgets (same-origin)'],
			cspEquivalent: "frame-ancestors 'self'",
			protection: 'High',
			color: 'warning'
		},
		{
			value: 'ALLOW-FROM',
			header: 'X-Frame-Options: ALLOW-FROM https://trusted.com',
			description: 'The page can only be displayed in a frame on the specified origin. (Deprecated in most browsers)',
			useCases: ['Embedding on specific partner sites', 'Controlled third-party integration'],
			cspEquivalent: "frame-ancestors https://trusted.com",
			protection: 'Medium',
			color: 'info',
			deprecated: true
		}
	];

	let selectedOption = $state<'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM'>('DENY');
	let allowFromUrl = $state('https://trusted.com');

	let currentHeader = $derived(() => {
		if (selectedOption === 'ALLOW-FROM') {
			return `X-Frame-Options: ALLOW-FROM ${allowFromUrl}`;
		}
		return `X-Frame-Options: ${selectedOption}`;
	});

	let currentCSP = $derived(() => {
		if (selectedOption === 'DENY') return "frame-ancestors 'none'";
		if (selectedOption === 'SAMEORIGIN') return "frame-ancestors 'self'";
		return `frame-ancestors ${allowFromUrl}`;
	});

	function copyHeader() {
		navigator.clipboard.writeText(currentHeader());
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6 max-w-3xl mx-auto">
		<!-- What is X-Frame-Options -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h3 class="font-bold mb-2">What is X-Frame-Options?</h3>
				<p class="text-sm text-base-content/70">
					X-Frame-Options is an HTTP response header used to indicate whether a browser should be 
					allowed to render a page in a <code>&lt;frame&gt;</code>, <code>&lt;iframe&gt;</code>, 
					<code>&lt;embed&gt;</code> or <code>&lt;object&gt;</code>. It helps prevent 
					<strong>clickjacking attacks</strong> by controlling who can embed your pages.
				</p>
			</div>
		</div>

		<!-- Option Cards -->
		<div class="space-y-3">
			{#each options as opt}
				<div 
					class="card bg-base-200 rounded-xl cursor-pointer transition-all {selectedOption === opt.value ? `ring-2 ring-${opt.color}` : ''}"
					onclick={() => selectedOption = opt.value as typeof selectedOption}
				>
					<div class="card-body p-4">
						<div class="flex items-center justify-between">
							<div class="flex items-center gap-3">
								<input 
									type="radio" 
									name="xframe" 
									checked={selectedOption === opt.value}
									class="radio radio-{opt.color}"
									onchange={() => selectedOption = opt.value as typeof selectedOption}
								/>
								<div>
									<h4 class="font-bold font-mono">{opt.value}</h4>
									{#if opt.deprecated}
										<span class="badge badge-warning badge-xs">Deprecated</span>
									{/if}
								</div>
							</div>
							<span class="badge badge-{opt.color}">{opt.protection}</span>
						</div>
						<p class="text-sm text-base-content/70 mt-2">{opt.description}</p>
						
						{#if selectedOption === opt.value}
							<div class="mt-3 space-y-3">
								{#if opt.value === 'ALLOW-FROM'}
									<div>
										<label class="text-xs font-bold">Allowed Origin</label>
										<input 
											type="text" 
											bind:value={allowFromUrl}
											placeholder="https://trusted.com"
											class="input input-sm input-bordered w-full mt-1"
										/>
									</div>
								{/if}

								<div>
									<span class="text-xs font-bold">Use Cases:</span>
									<ul class="list-disc ml-4 text-sm">
										{#each opt.useCases as useCase}
											<li>{useCase}</li>
										{/each}
									</ul>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Generated Headers -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h3 class="font-bold mb-3">Generated Headers</h3>
				<div class="grid gap-3 md:grid-cols-2">
					<div>
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs font-bold">X-Frame-Options</span>
							<CopyButton text={currentHeader()} size="sm" />
						</div>
						<pre class="bg-base-100 p-3 rounded text-sm font-mono whitespace-pre-wrap break-all overflow-hidden">{currentHeader()}</pre>
					</div>
					<div>
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs font-bold">CSP Equivalent (Recommended)</span>
							<CopyButton text={`Content-Security-Policy: ${currentCSP()}`} size="sm" />
						</div>
						<pre class="bg-base-100 p-3 rounded text-sm font-mono whitespace-pre-wrap break-all overflow-hidden">Content-Security-Policy: {currentCSP()}</pre>
					</div>
				</div>
			</div>
		</div>

		<!-- CSP vs X-Frame-Options -->
		<div class="card bg-info/10 border border-info/20 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-bold text-sm">CSP frame-ancestors vs X-Frame-Options</h4>
				<p class="text-sm text-base-content/70 mt-2">
					<code>frame-ancestors</code> in Content-Security-Policy is the modern replacement for X-Frame-Options.
					It offers more flexibility (multiple origins, wildcards) and is recommended for new implementations.
					For maximum compatibility, use both headers.
				</p>
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

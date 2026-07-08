<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { jwtToolsContent } from '$lib/config/content/jwt-tools-content';

	const jwtContent = jwtToolsContent['claims'];
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let token = $state('');

	const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJzdWIiOiJ1c2VyXzEyMzQ1Njc4OTAiLCJhdWQiOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImV4cCI6MTkxNjIzOTAyMiwiaWF0IjoxNTE2MjM5MDIyLCJuYmYiOjE1MTYyMzkwMjIsImp0aSI6InVuaXF1ZS10b2tlbi1pZC0xMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJwZXJtaXNzaW9ucyI6WyJyZWFkIiwid3JpdGUiLCJkZWxldGUiXX0.signature';

	// Standard JWT claims with descriptions
	const standardClaims: Record<string, { name: string; description: string; rfc?: string }> = {
		iss: { name: 'Issuer', description: 'Principal that issued the JWT', rfc: '7519 §4.1.1' },
		sub: { name: 'Subject', description: 'Principal that is the subject of the JWT', rfc: '7519 §4.1.2' },
		aud: { name: 'Audience', description: 'Recipients that the JWT is intended for', rfc: '7519 §4.1.3' },
		exp: { name: 'Expiration Time', description: 'Time after which the JWT expires', rfc: '7519 §4.1.4' },
		nbf: { name: 'Not Before', description: 'Time before which the JWT must not be accepted', rfc: '7519 §4.1.5' },
		iat: { name: 'Issued At', description: 'Time at which the JWT was issued', rfc: '7519 §4.1.6' },
		jti: { name: 'JWT ID', description: 'Unique identifier for the JWT', rfc: '7519 §4.1.7' }
	};

	const recommendedClaims = ['iss', 'sub', 'aud', 'exp', 'iat'];

	// Base64URL decode
	function base64UrlDecode(str: string): string {
		let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
		const padding = base64.length % 4;
		if (padding) base64 += '='.repeat(4 - padding);
		return atob(base64);
	}

	interface ParseResult {
		payload: Record<string, unknown> | null;
		error: string | null;
	}

	let result = $derived.by((): ParseResult => {
		if (!token.trim()) return { payload: null, error: null };

		const parts = token.trim().split('.');
		if (parts.length !== 3) {
			return { payload: null, error: 'Invalid JWT format' };
		}

		try {
			const payload = JSON.parse(base64UrlDecode(parts[1]));
			return { payload, error: null };
		} catch {
			return { payload: null, error: 'Failed to decode JWT payload' };
		}
	});

	let claims = $derived.by(() => {
		if (!result.payload) return { standard: [], custom: [], missing: [] as string[] };

		const standard: { key: string; value: unknown; info: typeof standardClaims[string] }[] = [];
		const custom: { key: string; value: unknown }[] = [];

		for (const [key, value] of Object.entries(result.payload)) {
			if (key in standardClaims) {
				standard.push({ key, value, info: standardClaims[key] });
			} else {
				custom.push({ key, value });
			}
		}

		const missing = recommendedClaims.filter(c => !(c in result.payload!));

		return { standard, custom, missing };
	});

	function formatValue(value: unknown): string {
		if (typeof value === 'number' && value > 1000000000 && value < 10000000000) {
			return `${value} (${new Date(value * 1000).toLocaleString()})`;
		}
		if (Array.isArray(value)) {
			return value.join(', ');
		}
		if (typeof value === 'object') {
			return JSON.stringify(value);
		}
		return String(value);
	}

	function loadSample() {
		token = sampleToken;
	}

	function clearAll() {
		token = '';
	}

	let activeTab = $state<'standard' | 'custom'>('standard');
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input -->
		<div>
			<textarea
				bind:value={token}
				placeholder="Paste your JWT to view claims..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-y"
				class:textarea-error={result.error}
				spellcheck="false"
			></textarea>
		</div>

		<!-- Error -->
		{#if result.error}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{result.error}</span>
			</div>
		{/if}

		<!-- Missing Claims Warning -->
		{#if result.payload && claims.missing.length > 0}
			<div class="alert bg-warning/10 border border-warning/30 rounded-xl">
				<svg class="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<div>
					<p class="font-semibold text-warning">Missing Recommended Claims</p>
					<div class="flex flex-wrap gap-1 mt-1">
						{#each claims.missing as claim}
							<span class="badge badge-warning badge-sm font-mono">{claim}</span>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Claims -->
		{#if result.payload}
			<!-- Tabs -->
			<div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl w-fit">
				<button
					class="tab {activeTab === 'standard' ? 'tab-active' : ''}"
					onclick={() => activeTab = 'standard'}
				>
					Standard Claims
					<span class="badge badge-sm ml-1">{claims.standard.length}</span>
				</button>
				<button
					class="tab {activeTab === 'custom' ? 'tab-active' : ''}"
					onclick={() => activeTab = 'custom'}
				>
					Custom Claims
					<span class="badge badge-sm ml-1">{claims.custom.length}</span>
				</button>
			</div>

			<!-- Standard Claims -->
			{#if activeTab === 'standard'}
				<div class="grid gap-3 sm:grid-cols-2">
					{#each claims.standard as claim}
						<div class="card bg-base-200 rounded-xl hover:bg-base-300/50 transition-colors group">
							<div class="card-body p-4">
								<div class="flex items-start justify-between gap-2">
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-1">
											<code class="text-primary font-mono font-bold">{claim.key}</code>
											<span class="text-sm text-base-content/70">{claim.info.name}</span>
											{#if claim.info.rfc}
												<span class="badge badge-xs badge-ghost opacity-0 group-hover:opacity-100 transition-opacity">RFC {claim.info.rfc}</span>
											{/if}
										</div>
										<p class="text-xs text-base-content/50 mb-2">{claim.info.description}</p>
										<div class="font-mono text-sm break-all bg-base-100 p-2 rounded-lg">
											{formatValue(claim.value)}
										</div>
									</div>
									<CopyButton text={String(claim.value)} size="xs" />
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if claims.standard.length === 0}
					<div class="text-center py-8 text-base-content/50">
						<span class="text-4xl">📭</span>
						<p class="mt-2">No standard claims found</p>
					</div>
				{/if}
			{/if}

			<!-- Custom Claims -->
			{#if activeTab === 'custom'}
				<div class="grid gap-3 sm:grid-cols-2">
					{#each claims.custom as claim}
						<div class="card bg-base-200 rounded-xl">
							<div class="card-body p-4">
								<div class="flex items-start justify-between gap-2">
									<div class="flex-1 min-w-0">
										<code class="text-secondary font-mono font-bold">{claim.key}</code>
										<div class="font-mono text-sm break-all bg-base-100 p-2 rounded-lg mt-2">
											{formatValue(claim.value)}
										</div>
									</div>
									<CopyButton text={typeof claim.value === 'object' ? JSON.stringify(claim.value) : String(claim.value)} size="xs" />
								</div>
							</div>
						</div>
					{/each}
				</div>

				{#if claims.custom.length === 0}
					<div class="text-center py-8 text-base-content/50">
						<span class="text-4xl">📭</span>
						<p class="mt-2">No custom claims found</p>
					</div>
				{/if}
			{/if}

			<!-- All Claims JSON -->
			<details class="collapse collapse-arrow bg-base-200 rounded-xl">
				<summary class="collapse-title font-semibold">View Raw Payload JSON</summary>
				<div class="collapse-content">
					<div class="flex justify-end mb-2">
						<CopyButton text={JSON.stringify(result.payload, null, 2)} label="Copy JSON" size="sm" />
					</div>
					<pre class="p-4 rounded-xl bg-base-100 font-mono text-sm overflow-x-auto">{JSON.stringify(result.payload, null, 2)}</pre>
				</div>
			</details>
		{/if}

		<!-- Standard Claims Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Standard JWT Claims (RFC 7519)</h4>
				<div class="mt-2 grid gap-2 text-sm">
					{#each Object.entries(standardClaims) as [key, info]}
						<div class="flex items-start gap-2">
							<code class="text-primary font-mono shrink-0 w-8">{key}</code>
							<span class="text-base-content/70">{info.name} — {info.description}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={jwtContent.features} />
			<UseCases useCases={jwtContent.useCases} />
			<ConceptExplainer title={jwtContent.concept.title} content={jwtContent.concept.content} />
			<Examples examples={jwtContent.examples} />
			<FAQSection faqs={jwtContent.faqs} />
			{#if jwtContent.tips}
				<Tips tips={jwtContent.tips} />
			{/if}
			<RelatedTools relatedTools={jwtContent.relatedTools} />
		</div>
	</div>
</ToolWrapper>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { jwtToolsContent } from '$lib/config/content/jwt-tools-content';

	const jwtContent = jwtToolsContent['decoder'];
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let token = $state('');

	// Sample JWT with exp in the future
	const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

	interface DecodedJWT {
		header: Record<string, unknown>;
		payload: Record<string, unknown>;
		signature: string;
		parts: string[];
	}

	interface DecodeResult {
		decoded: DecodedJWT | null;
		error: string | null;
	}

	// Base64URL decode helper
	function base64UrlDecode(str: string): string {
		let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
		const padding = base64.length % 4;
		if (padding) {
			base64 += '='.repeat(4 - padding);
		}
		try {
			return atob(base64);
		} catch {
			throw new Error('Invalid Base64URL encoding');
		}
	}

	// Return both decoded result and error from derived
	let result = $derived.by((): DecodeResult => {
		if (!token.trim()) {
			return { decoded: null, error: null };
		}

		const parts = token.trim().split('.');
		if (parts.length !== 3) {
			return { decoded: null, error: 'Invalid JWT: Must have exactly 3 parts separated by dots (header.payload.signature)' };
		}

		try {
			const headerJson = base64UrlDecode(parts[0]);
			const payloadJson = base64UrlDecode(parts[1]);
			
			let header: Record<string, unknown>;
			let payload: Record<string, unknown>;
			
			try {
				header = JSON.parse(headerJson);
			} catch {
				return { decoded: null, error: 'Invalid JWT header: Not valid JSON' };
			}
			
			try {
				payload = JSON.parse(payloadJson);
			} catch {
				return { decoded: null, error: 'Invalid JWT payload: Not valid JSON' };
			}

			return {
				decoded: {
					header,
					payload,
					signature: parts[2],
					parts
				},
				error: null
			};
		} catch (e) {
			return { decoded: null, error: (e as Error).message };
		}
	});

	// Extract decoded and error from result
	let decoded = $derived(result.decoded);
	let error = $derived(result.error);

	// Format timestamp to human-readable date
	function formatTimestamp(timestamp: number): string {
		const date = new Date(timestamp * 1000);
		return date.toLocaleString(undefined, {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			timeZoneName: 'short'
		});
	}

	// Check if a value looks like a Unix timestamp
	function isTimestamp(value: unknown): value is number {
		return typeof value === 'number' && value > 1000000000 && value < 10000000000;
	}

	// Format JSON with syntax highlighting
	function formatJson(obj: Record<string, unknown>): string {
		return JSON.stringify(obj, null, 2);
	}

	function loadSample() {
		token = sampleToken;
	}

	function clearAll() {
		token = '';
	}

	let stats = $derived({
		chars: token.length,
		parts: token.split('.').filter(p => p).length
	});

	// Algorithm descriptions
	const algorithmInfo: Record<string, string> = {
		'HS256': 'HMAC with SHA-256',
		'HS384': 'HMAC with SHA-384',
		'HS512': 'HMAC with SHA-512',
		'RS256': 'RSA Signature with SHA-256',
		'RS384': 'RSA Signature with SHA-384',
		'RS512': 'RSA Signature with SHA-512',
		'ES256': 'ECDSA with P-256 and SHA-256',
		'ES384': 'ECDSA with P-384 and SHA-384',
		'ES512': 'ECDSA with P-521 and SHA-512',
		'PS256': 'RSA-PSS with SHA-256',
		'PS384': 'RSA-PSS with SHA-384',
		'PS512': 'RSA-PSS with SHA-512',
		'none': 'No signature (INSECURE)'
	};
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Warning Banner -->
		<div class="alert bg-warning/10 border border-warning/30 rounded-xl">
			<svg class="h-5 w-5 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<div>
				<p class="font-semibold text-warning">Decoding ≠ Verification</p>
				<p class="text-sm text-base-content/70">This tool only decodes the JWT. It does NOT verify the signature. Anyone can create a JWT with any claims—always verify tokens server-side with the correct secret or public key.</p>
			</div>
		</div>

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Input -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl overflow-hidden">
			<div class="card-body">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
						<AppIcon name={'🔐'} size={20} />
					</div>
					<div>
						<h3 class="font-bold">JWT Token</h3>
						<p class="text-xs text-base-content/50">Paste your JWT to decode</p>
					</div>
				</div>
				<textarea
					bind:value={token}
					placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
					class="textarea textarea-bordered w-full min-h-[120px] font-mono text-sm rounded-xl resize-y focus:border-primary transition-colors"
					class:textarea-error={error}
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Decoded Output -->
		{#if decoded}
			<div class="grid gap-4 lg:grid-cols-2">
				<!-- Header -->
				<div class="card bg-base-200 rounded-2xl overflow-hidden">
					<div class="card-body">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
									<AppIcon name={'📋'} size={16} />
								</div>
								<h3 class="font-bold">Header</h3>
								<span class="badge badge-sm badge-ghost font-mono">{decoded.parts[0].length} chars</span>
							</div>
							<CopyButton text={formatJson(decoded.header)} size="sm" />
						</div>
						
						<!-- Algorithm Chip -->
						{#if decoded.header.alg}
							{@const alg = String(decoded.header.alg)}
							<div class="mb-3 p-3 rounded-xl bg-base-300/50 border border-base-300">
								<div class="flex items-center gap-2">
									<span class="badge badge-primary font-mono">{alg}</span>
									<span class="text-sm text-base-content/70">
										{algorithmInfo[alg] || 'Unknown algorithm'}
									</span>
								</div>
								{#if alg === 'none'}
									<p class="text-xs text-error mt-2">⚠️ This token has no signature and should NEVER be trusted!</p>
								{/if}
							</div>
						{/if}

						<pre class="p-4 rounded-xl bg-base-100 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">{formatJson(decoded.header)}</pre>
					</div>
				</div>

				<!-- Payload -->
				<div class="card bg-base-200 rounded-2xl overflow-hidden">
					<div class="card-body">
						<div class="flex items-center justify-between mb-3">
							<div class="flex items-center gap-2">
								<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
									<AppIcon name={'📦'} size={16} />
								</div>
								<h3 class="font-bold">Payload</h3>
								<span class="badge badge-sm badge-ghost font-mono">{decoded.parts[1].length} chars</span>
							</div>
							<CopyButton text={formatJson(decoded.payload)} size="sm" />
						</div>

						<!-- Claims Overview -->
						<div class="space-y-2 mb-4">
							{#each Object.entries(decoded.payload) as [key, value]}
								<div class="flex items-start justify-between gap-2 p-2 rounded-lg bg-base-300/30 hover:bg-base-300/50 transition-colors">
									<div class="flex items-center gap-2 min-w-0">
										<code class="text-sm font-mono text-primary font-semibold shrink-0">{key}</code>
									</div>
									<div class="text-right text-sm font-mono truncate max-w-[60%]">
										{#if isTimestamp(value)}
											<div class="flex flex-col items-end gap-1">
												<span class="text-base-content/60">{value}</span>
												<span class="badge badge-sm badge-ghost">{formatTimestamp(value)}</span>
											</div>
										{:else if typeof value === 'object'}
											<span class="text-base-content/70">{JSON.stringify(value)}</span>
										{:else}
											<span class="text-base-content/70">{String(value)}</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>

						<details class="collapse collapse-arrow bg-base-100 rounded-xl">
							<summary class="collapse-title text-sm font-medium py-2 min-h-0">Raw JSON</summary>
							<div class="collapse-content">
								<pre class="font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all pt-2">{formatJson(decoded.payload)}</pre>
							</div>
						</details>
					</div>
				</div>
			</div>

			<!-- Signature -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
								<AppIcon name={'🔒'} size={16} />
							</div>
							<div>
								<h3 class="font-bold">Signature</h3>
								<p class="text-xs text-base-content/50">Cannot be verified client-side without the secret key</p>
							</div>
							<span class="badge badge-sm badge-ghost font-mono">{decoded.signature.length} chars</span>
						</div>
						<CopyButton text={decoded.signature} size="sm" />
					</div>
					<code class="block mt-2 p-3 rounded-lg bg-base-100 font-mono text-xs break-all text-base-content/60">
						{decoded.signature}
					</code>
				</div>
			</div>

			<!-- Token Structure Visualization -->
			<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold flex items-center gap-2 mb-3">
						<AppIcon name={'🧱'} size={16} /> Token Structure
					</h4>
					<div class="flex gap-1 text-xs font-mono overflow-x-auto pb-2">
						<div class="flex-1 min-w-0 p-2 rounded-l-lg bg-info/20 border-2 border-info/40">
							<div class="truncate text-info">Header</div>
						</div>
						<div class="flex items-center text-base-content/30">.</div>
						<div class="flex-[2] min-w-0 p-2 bg-success/20 border-2 border-success/40">
							<div class="truncate text-success">Payload</div>
						</div>
						<div class="flex items-center text-base-content/30">.</div>
						<div class="flex-1 min-w-0 p-2 rounded-r-lg bg-warning/20 border-2 border-warning/40">
							<div class="truncate text-warning">Signature</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About JWTs</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Header</strong> contains the algorithm and token type</li>
					<li>• <strong>Payload</strong> contains the claims (user data, expiration, etc.)</li>
					<li>• <strong>Signature</strong> is used to verify the token wasn't tampered with</li>
					<li>• JWTs are Base64URL encoded (not encrypted!) — anyone can read the contents</li>
				</ul>
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

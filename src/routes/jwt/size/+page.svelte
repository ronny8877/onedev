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

	const jwtContent = jwtToolsContent['size'];
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let token = $state('');

	const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwicGVybWlzc2lvbnMiOlsicmVhZCIsIndyaXRlIiwiZGVsZXRlIl0sImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

	// Common header size limits
	const sizeWarnings = [
		{ name: 'HTTP Header (recommended)', limit: 4096, color: 'success' },
		{ name: 'Apache default', limit: 8190, color: 'warning' },
		{ name: 'Nginx default', limit: 8192, color: 'warning' },
		{ name: 'AWS ALB', limit: 16384, color: 'info' }
	];

	interface SizeAnalysis {
		total: { chars: number; bytes: number };
		header: { chars: number; bytes: number; encoded: string };
		payload: { chars: number; bytes: number; encoded: string };
		signature: { chars: number; bytes: number; encoded: string };
		error: string | null;
	}

	function getByteLength(str: string): number {
		return new TextEncoder().encode(str).length;
	}

	let analysis = $derived.by((): SizeAnalysis | null => {
		if (!token.trim()) return null;

		const parts = token.trim().split('.');
		if (parts.length !== 3) {
			return {
				total: { chars: 0, bytes: 0 },
				header: { chars: 0, bytes: 0, encoded: '' },
				payload: { chars: 0, bytes: 0, encoded: '' },
				signature: { chars: 0, bytes: 0, encoded: '' },
				error: 'Invalid JWT: Must have 3 parts separated by dots'
			};
		}

		const [headerEnc, payloadEnc, signatureEnc] = parts;

		return {
			total: { 
				chars: token.length, 
				bytes: getByteLength(token) 
			},
			header: { 
				chars: headerEnc.length, 
				bytes: getByteLength(headerEnc),
				encoded: headerEnc 
			},
			payload: { 
				chars: payloadEnc.length, 
				bytes: getByteLength(payloadEnc),
				encoded: payloadEnc 
			},
			signature: { 
				chars: signatureEnc.length, 
				bytes: getByteLength(signatureEnc),
				encoded: signatureEnc 
			},
			error: null
		};
	});

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function getPercentage(part: number, total: number): number {
		return total > 0 ? Math.round((part / total) * 100) : 0;
	}

	function loadSample() {
		token = sampleToken;
	}

	function clearAll() {
		token = '';
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input -->
		<div>
			<textarea
				bind:value={token}
				placeholder="Paste your JWT to analyze size..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-y"
				class:textarea-error={analysis?.error}
				spellcheck="false"
			></textarea>
		</div>

		<!-- Error -->
		{#if analysis?.error}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{analysis.error}</span>
			</div>
		{/if}

		{#if analysis && !analysis.error}
			<!-- Total Size -->
			<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-2xl">
				<div class="card-body items-center text-center">
					<h2 class="text-4xl font-bold font-mono">
						{analysis.total.chars.toLocaleString()}
					</h2>
					<p class="text-base-content/60">characters ({formatBytes(analysis.total.bytes)})</p>
					
					<!-- Size warnings -->
					<div class="flex flex-wrap justify-center gap-2 mt-4">
						{#each sizeWarnings as warning}
							{@const isOver = analysis.total.bytes > warning.limit}
							<div class="badge {isOver ? 'badge-error' : 'badge-' + warning.color} gap-1">
								{#if isOver}
									<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
									</svg>
								{:else}
									<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								{/if}
								{warning.name}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Size Breakdown Chart -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body">
					<h3 class="font-bold flex items-center gap-2 mb-4">
						<span>📊</span> Size Breakdown
					</h3>

					<!-- Visual Bar -->
					<div class="flex rounded-xl overflow-hidden h-8 text-xs font-mono">
						<div 
							class="bg-info flex items-center justify-center text-info-content transition-all"
							style="width: {getPercentage(analysis.header.chars, analysis.total.chars)}%"
							title="Header"
						>
							{getPercentage(analysis.header.chars, analysis.total.chars)}%
						</div>
						<div 
							class="bg-success flex items-center justify-center text-success-content transition-all"
							style="width: {getPercentage(analysis.payload.chars, analysis.total.chars)}%"
							title="Payload"
						>
							{getPercentage(analysis.payload.chars, analysis.total.chars)}%
						</div>
						<div 
							class="bg-warning flex items-center justify-center text-warning-content transition-all"
							style="width: {getPercentage(analysis.signature.chars, analysis.total.chars)}%"
							title="Signature"
						>
							{getPercentage(analysis.signature.chars, analysis.total.chars)}%
						</div>
					</div>

					<!-- Legend -->
					<div class="grid grid-cols-3 gap-4 mt-4">
						<div class="text-center p-3 rounded-xl bg-info/10">
							<div class="w-4 h-4 rounded bg-info mx-auto mb-2"></div>
							<div class="font-bold">Header</div>
							<div class="text-sm text-base-content/70">{analysis.header.chars} chars</div>
							<div class="text-xs text-base-content/50">{formatBytes(analysis.header.bytes)}</div>
						</div>
						<div class="text-center p-3 rounded-xl bg-success/10">
							<div class="w-4 h-4 rounded bg-success mx-auto mb-2"></div>
							<div class="font-bold">Payload</div>
							<div class="text-sm text-base-content/70">{analysis.payload.chars} chars</div>
							<div class="text-xs text-base-content/50">{formatBytes(analysis.payload.bytes)}</div>
						</div>
						<div class="text-center p-3 rounded-xl bg-warning/10">
							<div class="w-4 h-4 rounded bg-warning mx-auto mb-2"></div>
							<div class="font-bold">Signature</div>
							<div class="text-sm text-base-content/70">{analysis.signature.chars} chars</div>
							<div class="text-xs text-base-content/50">{formatBytes(analysis.signature.bytes)}</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Size Limit Comparison -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold mb-4">HTTP Header Size Limits</h4>
					<div class="space-y-3">
						{#each sizeWarnings as warning}
							{@const percent = Math.min(100, (analysis.total.bytes / warning.limit) * 100)}
							{@const isOver = analysis.total.bytes > warning.limit}
							<div>
								<div class="flex justify-between text-sm mb-1">
									<span>{warning.name}</span>
									<span class="{isOver ? 'text-error font-bold' : 'text-base-content/60'}">
										{formatBytes(analysis.total.bytes)} / {formatBytes(warning.limit)}
										{#if isOver}(exceeded!){/if}
									</span>
								</div>
								<div class="h-2 rounded-full bg-base-300 overflow-hidden">
									<div 
										class="h-full transition-all {isOver ? 'bg-error' : 'bg-' + warning.color}"
										style="width: {percent}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Tips for Reducing Size -->
			{#if analysis.payload.chars > 500}
				<div class="alert bg-info/10 border border-info/30 rounded-xl">
					<svg class="h-5 w-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<div>
						<p class="font-semibold text-info">Tips to Reduce JWT Size</p>
						<ul class="text-sm text-base-content/70 mt-1">
							<li>• Use short claim names (e.g., <code>uid</code> instead of <code>userId</code>)</li>
							<li>• Store only essential data in the token</li>
							<li>• Reference IDs instead of embedding full objects</li>
							<li>• Consider storing large data server-side with a reference</li>
						</ul>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Why JWT Size Matters</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• JWTs are sent with every HTTP request in the Authorization header</li>
					<li>• Large tokens increase bandwidth and can exceed server header limits</li>
					<li>• Some proxies and load balancers have strict header size limits</li>
					<li>• Cookies have a ~4KB limit if you're storing JWTs there</li>
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

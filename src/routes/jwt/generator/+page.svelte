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

	const jwtContent = jwtToolsContent['generator'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { SignJWT, importJWK, generateSecret, exportJWK, type JWK } from 'jose';

	// Algorithm type
	type HMACAlgorithm = 'HS256' | 'HS384' | 'HS512';
	
	// Header state
	let headerAlg = $state<HMACAlgorithm>('HS256');
	let headerTyp = $state('JWT');

	// Secret key state
	let secretMode = $state<'generate' | 'custom'>('generate');
	let customSecret = $state('');
	let generatedSecretJwk = $state<JWK | null>(null);
	let generatedSecretBase64 = $state('');

	// Payload mode - unified data model
	let payloadMode = $state<'form' | 'json'>('form');

	// Form-based payload (source of truth)
	let formClaims = $state<{ key: string; value: string }[]>([
		{ key: 'sub', value: '1234567890' },
		{ key: 'name', value: 'John Doe' },
		{ key: 'iat', value: String(Math.floor(Date.now() / 1000)) }
	]);

	// JSON string (derived from form or manually edited)
	let jsonPayload = $state('');
	let jsonError = $state<string | null>(null);

	// Token generation state
	let generatedToken = $state('');
	let generationError = $state<string | null>(null);
	let isGenerating = $state(false);

	// Derived token parts for display
	let tokenParts = $derived(generatedToken ? generatedToken.split('.') : ['', '', '']);

	// Algorithm groups for better UX
	const algorithmGroups = [
		{
			label: 'HMAC (Symmetric)',
			description: 'Shared secret key',
			algorithms: [
				{ value: 'HS256' as HMACAlgorithm, label: 'HS256', description: 'SHA-256 (Recommended)', badge: 'popular' },
				{ value: 'HS384' as HMACAlgorithm, label: 'HS384', description: 'SHA-384', badge: null },
				{ value: 'HS512' as HMACAlgorithm, label: 'HS512', description: 'SHA-512 (Strongest)', badge: 'secure' }
			]
		}
	];

	// Common claim templates
	const claimTemplates = [
		{ key: 'sub', label: 'Subject', value: 'user_id_123', description: 'Unique user identifier' },
		{ key: 'name', label: 'Name', value: 'John Doe', description: 'Display name' },
		{ key: 'email', label: 'Email', value: 'user@example.com', description: 'User email' },
		{ key: 'role', label: 'Role', value: 'admin', description: 'User role/permissions' },
		{ key: 'aud', label: 'Audience', value: 'https://api.example.com', description: 'Intended audience' },
		{ key: 'iss', label: 'Issuer', value: 'https://auth.example.com', description: 'Token issuer' },
		{ key: 'jti', label: 'JWT ID', value: crypto.randomUUID(), description: 'Unique token ID' }
	];

	// Sync form to JSON when switching to JSON mode
	function syncFormToJson() {
		const payload: Record<string, unknown> = {};
		for (const claim of formClaims) {
			if (claim.key.trim()) {
				payload[claim.key.trim()] = parseValue(claim.value);
			}
		}
		jsonPayload = JSON.stringify(payload, null, 2);
		jsonError = null;
	}

	// Sync JSON to form when switching to form mode
	function syncJsonToForm() {
		try {
			const parsed = JSON.parse(jsonPayload);
			const newClaims: { key: string; value: string }[] = [];
			for (const [key, value] of Object.entries(parsed)) {
				newClaims.push({ 
					key, 
					value: typeof value === 'object' ? JSON.stringify(value) : String(value) 
				});
			}
			formClaims = newClaims;
			jsonError = null;
		} catch (e) {
			jsonError = 'Invalid JSON - cannot switch to form view';
		}
	}

	// Parse string value to appropriate type
	function parseValue(value: string): unknown {
		if (/^-?\d+$/.test(value)) return parseInt(value);
		if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
		if (value === 'true') return true;
		if (value === 'false') return false;
		if (value.startsWith('[') || value.startsWith('{')) {
			try { return JSON.parse(value); } catch { /* keep as string */ }
		}
		return value;
	}

	// Handle mode switch with sync
	function switchToForm() {
		if (payloadMode === 'json') {
			syncJsonToForm();
			if (!jsonError) payloadMode = 'form';
		}
	}

	function switchToJson() {
		if (payloadMode === 'form') {
			syncFormToJson();
			payloadMode = 'json';
		}
	}

	// Generate a new secret key
	async function generateNewSecret() {
		try {
			const secret = await generateSecret(headerAlg, { extractable: true });
			const jwk = await exportJWK(secret);
			generatedSecretJwk = jwk;
			generatedSecretBase64 = jwk.k as string;
		} catch (e) {
			generationError = `Failed to generate secret: ${(e as Error).message}`;
		}
	}

	// Build payload from form or JSON
	function buildPayload(): Record<string, unknown> {
		if (payloadMode === 'json') {
			return JSON.parse(jsonPayload);
		} else {
			const payload: Record<string, unknown> = {};
			for (const claim of formClaims) {
				if (claim.key.trim()) {
					payload[claim.key.trim()] = parseValue(claim.value);
				}
			}
			return payload;
		}
	}

	// Generate the JWT token
	async function generateToken() {
		isGenerating = true;
		generationError = null;
		generatedToken = '';

		try {
			let secretKey: CryptoKey;
			
			if (secretMode === 'generate') {
				if (!generatedSecretJwk) {
					await generateNewSecret();
				}
				if (!generatedSecretJwk) {
					throw new Error('Failed to generate secret key');
				}
				secretKey = await importJWK(generatedSecretJwk, headerAlg) as CryptoKey;
			} else {
				if (!customSecret.trim()) {
					throw new Error('Please enter a secret key');
				}
				const jwk = {
					kty: 'oct' as const,
					k: btoa(customSecret).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
					alg: headerAlg
				};
				secretKey = await importJWK(jwk, headerAlg) as CryptoKey;
			}

			const payload = buildPayload();
			const jwt = await new SignJWT(payload as Record<string, unknown>)
				.setProtectedHeader({ alg: headerAlg, typ: headerTyp })
				.sign(secretKey);

			generatedToken = jwt;
		} catch (e) {
			generationError = (e as Error).message;
		} finally {
			isGenerating = false;
		}
	}

	// Generate secret on mount and algorithm change
	$effect(() => {
		if (secretMode === 'generate') {
			generateNewSecret();
		}
	});

	function addClaim() {
		formClaims = [...formClaims, { key: '', value: '' }];
	}

	function removeClaim(index: number) {
		formClaims = formClaims.filter((_, i) => i !== index);
	}

	function addOrUpdateClaim(key: string, value: string) {
		const existingIdx = formClaims.findIndex(c => c.key === key);
		if (existingIdx !== -1) {
			formClaims[existingIdx].value = value;
			formClaims = [...formClaims];
		} else {
			formClaims = [...formClaims, { key, value }];
		}
	}

	function addExpClaim() {
		addOrUpdateClaim('exp', String(Math.floor(Date.now() / 1000) + 3600));
	}

	function addIatClaim() {
		addOrUpdateClaim('iat', String(Math.floor(Date.now() / 1000)));
	}

	function addNbfClaim() {
		addOrUpdateClaim('nbf', String(Math.floor(Date.now() / 1000)));
	}

	function addTemplateClaim(template: typeof claimTemplates[0]) {
		addOrUpdateClaim(template.key, template.value);
	}

	// Check if claim exists
	function hasClaim(key: string): boolean {
		return formClaims.some(c => c.key === key);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Info Banner -->
		<div class="alert bg-success/10 border border-success/30 rounded-xl">
			<svg class="h-5 w-5 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<p class="font-semibold text-success">Production-Ready Tokens</p>
				<p class="text-sm text-base-content/70">Uses the <code class="text-success">jose</code> library for cryptographically signed JWTs.</p>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Left Column: Header & Secret -->
			<div class="space-y-4">
				<!-- Header Editor -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
								<AppIcon name="clipboard" size={16} />
							</div>
							<h3 class="font-bold">Header</h3>
						</div>

						<div class="space-y-3">
							<div>
								<label class="text-sm font-medium mb-1.5 block">Algorithm</label>
								{#each algorithmGroups as group}
									<div class="mb-2">
										<p class="text-xs text-base-content/50 mb-1.5">{group.label}</p>
										<div class="grid grid-cols-3 gap-2">
											{#each group.algorithms as alg}
												<button
													class="btn btn-sm {headerAlg === alg.value ? 'btn-primary' : 'btn-ghost bg-base-100'} flex-col h-auto py-2"
													onclick={() => headerAlg = alg.value}
												>
													<span class="font-mono font-bold">{alg.label}</span>
													{#if alg.badge === 'popular'}
														<span class="badge badge-xs badge-success">Popular</span>
													{:else if alg.badge === 'secure'}
														<span class="badge badge-xs badge-warning">Secure</span>
													{/if}
												</button>
											{/each}
										</div>
									</div>
								{/each}
							</div>

							<div>
								<label class="text-sm font-medium mb-1 block">Type (typ)</label>
								<input
									type="text"
									bind:value={headerTyp}
									class="input input-sm input-bordered w-full font-mono"
									placeholder="JWT"
								/>
							</div>
						</div>
					</div>
				</div>

				<!-- Secret Key -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
								<AppIcon name="key" size={16} />
							</div>
							<h3 class="font-bold">Secret Key</h3>
						</div>

						<div class="tabs tabs-boxed bg-base-300 p-1 rounded-lg mb-3 w-fit">
							<button
								class="tab tab-sm {secretMode === 'generate' ? 'tab-active' : ''}"
								onclick={() => secretMode = 'generate'}
							>
								Auto-Generate
							</button>
							<button
								class="tab tab-sm {secretMode === 'custom' ? 'tab-active' : ''}"
								onclick={() => secretMode = 'custom'}
							>
								Custom
							</button>
						</div>

						{#if secretMode === 'generate'}
							<div class="space-y-2">
								{#if generatedSecretBase64}
									<div class="p-2.5 rounded-lg bg-base-100 font-mono text-xs break-all">
										<div class="flex items-center justify-between gap-2 mb-1.5">
											<span class="text-xs text-base-content/50">Base64 Secret</span>
											<CopyButton text={generatedSecretBase64} size="xs" />
										</div>
										<code class="text-warning">{generatedSecretBase64}</code>
									</div>
								{/if}
								<button class="btn btn-xs btn-outline" onclick={generateNewSecret}>
									🔄 Regenerate
								</button>
							</div>
						{:else}
							<input
								type="text"
								bind:value={customSecret}
								class="input input-sm input-bordered w-full font-mono text-sm"
								placeholder="Enter your secret key..."
							/>
							<p class="text-xs text-base-content/50 mt-1">Min 32 chars recommended</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Right Column: Payload Editor -->
			<div class="card bg-base-200 rounded-2xl h-fit">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
								<AppIcon name="package" size={16} />
							</div>
							<h3 class="font-bold">Payload</h3>
						</div>
						<div class="join">
							<button
								class="btn btn-xs join-item {payloadMode === 'form' ? 'btn-primary' : 'btn-ghost'}"
								onclick={switchToForm}
							>
								Form
							</button>
							<button
								class="btn btn-xs join-item {payloadMode === 'json' ? 'btn-primary' : 'btn-ghost'}"
								onclick={switchToJson}
							>
								JSON
							</button>
						</div>
					</div>

					{#if jsonError}
						<div class="alert alert-warning py-2 px-3 mb-2 text-xs rounded-lg">
							{jsonError}
						</div>
					{/if}

					{#if payloadMode === 'form'}
						<!-- Claims list -->
						<div class="space-y-1.5 mb-3 max-h-[280px] overflow-y-auto pr-1">
							{#each formClaims as claim, i}
								<div class="flex gap-1.5 items-center">
									<input
										type="text"
										bind:value={claim.key}
										placeholder="key"
										class="input input-xs input-bordered flex-1 font-mono min-w-0"
									/>
									<input
										type="text"
										bind:value={claim.value}
										placeholder="value"
										class="input input-xs input-bordered flex-[2] font-mono min-w-0"
									/>
									<button
										class="btn btn-xs btn-ghost btn-square text-error shrink-0"
										onclick={() => removeClaim(i)}
									>
										✕
									</button>
								</div>
							{/each}
						</div>

						<!-- Quick Actions -->
						<div class="border-t border-base-300 pt-3">
							<p class="text-xs text-base-content/50 mb-2">Quick Add</p>
							<div class="flex flex-wrap gap-1.5">
								<button class="btn btn-xs btn-outline" onclick={addClaim}>
									+ Custom
								</button>
								<button 
									class="btn btn-xs {hasClaim('exp') ? 'btn-success' : 'btn-outline btn-info'}" 
									onclick={addExpClaim}
								>
									exp {hasClaim('exp') ? '✓' : ''}
								</button>
								<button 
									class="btn btn-xs {hasClaim('iat') ? 'btn-success' : 'btn-outline btn-info'}" 
									onclick={addIatClaim}
								>
									iat {hasClaim('iat') ? '✓' : ''}
								</button>
								<button 
									class="btn btn-xs {hasClaim('nbf') ? 'btn-success' : 'btn-outline btn-info'}" 
									onclick={addNbfClaim}
								>
									nbf {hasClaim('nbf') ? '✓' : ''}
								</button>
							</div>
							
							<!-- Template Claims -->
							<details class="mt-2">
								<summary class="text-xs text-base-content/50 cursor-pointer hover:text-base-content/70">
									More claims...
								</summary>
								<div class="flex flex-wrap gap-1.5 mt-2">
									{#each claimTemplates as template}
										<button
											class="btn btn-xs {hasClaim(template.key) ? 'btn-success' : 'btn-ghost bg-base-100'}"
											onclick={() => addTemplateClaim(template)}
											title={template.description}
										>
											{template.label} {hasClaim(template.key) ? '✓' : ''}
										</button>
									{/each}
								</div>
							</details>
						</div>
					{:else}
						<textarea
							bind:value={jsonPayload}
							class="textarea textarea-bordered w-full min-h-[280px] font-mono text-sm"
							spellcheck="false"
							placeholder="Enter JSON payload..."
						></textarea>
					{/if}
				</div>
			</div>
		</div>

		<!-- Generate Button -->
		<button
			class="btn btn-primary btn-lg gap-2"
			onclick={generateToken}
			disabled={isGenerating}
		>
			{#if isGenerating}
				<span class="loading loading-spinner loading-sm"></span>
				Generating...
			{:else}
				<AppIcon name="zap" size={16} />
				Generate JWT
			{/if}
		</button>

		<!-- Error -->
		{#if generationError}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{generationError}</span>
			</div>
		{/if}

		<!-- Generated Token -->
		{#if generatedToken}
			<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
								<span>🎫</span>
							</div>
							<h3 class="font-bold">Generated Token</h3>
							<span class="badge badge-success badge-sm">Signed</span>
						</div>
						<CopyButton text={generatedToken} label="Copy" />
					</div>

					<div class="p-3 rounded-xl bg-base-100 font-mono text-sm break-all">
						<span class="text-info">{tokenParts[0]}</span>.<span class="text-success">{tokenParts[1]}</span>.<span class="text-warning">{tokenParts[2]}</span>
					</div>
					<p class="text-xs text-base-content/50 mt-1.5">
						<span class="text-info">Header</span> • <span class="text-success">Payload</span> • <span class="text-warning">Signature</span>
					</p>

					<!-- Verification Info -->
					<div class="mt-3 p-2.5 rounded-lg bg-base-100 border border-base-300">
						<div class="flex items-center justify-between mb-1">
							<span class="text-xs font-medium">Verification Secret</span>
							<CopyButton text={secretMode === 'generate' ? generatedSecretBase64 : customSecret} size="xs" />
						</div>
						<code class="text-xs text-base-content/60 break-all block">
							{secretMode === 'generate' ? generatedSecretBase64 : customSecret}
						</code>
					</div>
				</div>
			</div>
		{/if}

		<!-- Usage Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-3 px-4">
				<h4 class="text-sm font-semibold">Quick Tips</h4>
				<ul class="mt-1.5 space-y-0.5 text-xs text-base-content/70">
					<li>✅ Tokens are cryptographically signed with HMAC</li>
					<li>✅ Add <code class="text-primary">exp</code> for auto-expiration</li>
					<li>⚠️ Keep secrets secure — never share publicly</li>
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

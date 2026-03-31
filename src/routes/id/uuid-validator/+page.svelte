<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { validate as uuidValidate, version as uuidVersion } from 'uuid';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { idToolsContent } from '$lib/config/content/id-tools-content';

	const content = idToolsContent['uuid-validator'];

	// State
	let input = $state('');
	let validationResult = $state<{
		isValid: boolean;
		version?: number;
		errors: string[];
		details?: {
			timeLow: string;
			timeMid: string;
			timeHiAndVersion: string;
			clockSeqHiAndReserved: string;
			clockSeqLow: string;
			node: string;
		};
	} | null>(null);

	// Version descriptions
	const versionInfo: Record<number, { name: string; description: string; color: string }> = {
		1: { name: 'v1 (Timestamp)', description: 'Based on timestamp and MAC address. Legacy.', color: 'warning' },
		2: { name: 'v2 (DCE Security)', description: 'DCE security version. Rarely used.', color: 'neutral' },
		3: { name: 'v3 (MD5 Name)', description: 'MD5 hash of namespace + name.', color: 'info' },
		4: { name: 'v4 (Random)', description: 'Randomly generated. Most common.', color: 'primary' },
		5: { name: 'v5 (SHA-1 Name)', description: 'SHA-1 hash of namespace + name.', color: 'info' },
		6: { name: 'v6 (Reordered Time)', description: 'Improved timestamp ordering.', color: 'success' },
		7: { name: 'v7 (Unix Epoch)', description: 'Unix timestamp-based. Modern choice.', color: 'success' }
	};

	// UUID anatomy
	const uuidParts = [
		{ name: 'time_low', length: 8, description: 'Low 32 bits of time' },
		{ name: 'time_mid', length: 4, description: 'Middle 16 bits of time' },
		{ name: 'time_hi_version', length: 4, description: 'High 12 bits of time + 4-bit version' },
		{ name: 'clock_seq_variant', length: 4, description: 'Clock sequence + variant' },
		{ name: 'node', length: 12, description: 'Node identifier (48 bits)' }
	];

	// Validate UUID
	function validateUuid(uuid: string): typeof validationResult {
		const trimmed = uuid.trim();
		const errors: string[] = [];

		// Empty check
		if (!trimmed) {
			return null;
		}

		// Length check
		const withHyphens = trimmed.includes('-');
		const expectedLength = withHyphens ? 36 : 32;
		
		if (trimmed.length !== expectedLength) {
			errors.push(`Invalid length: ${trimmed.length} characters (expected ${expectedLength})`);
		}

		// Character check
		const validChars = withHyphens ? /^[0-9a-f-]+$/i : /^[0-9a-f]+$/i;
		if (!validChars.test(trimmed)) {
			const invalidChars = trimmed.replace(withHyphens ? /[0-9a-f-]/gi : /[0-9a-f]/gi, '');
			errors.push(`Invalid characters: "${[...new Set(invalidChars)].join('')}"`);
		}

		// Hyphen position check (if hyphens present)
		if (withHyphens && trimmed.length >= 36) {
			const hyphenPositions = [8, 13, 18, 23];
			const actualHyphens = [...trimmed].map((c, i) => c === '-' ? i : -1).filter(i => i !== -1);
			
			if (JSON.stringify(actualHyphens) !== JSON.stringify(hyphenPositions)) {
				errors.push('Hyphens in wrong positions (expected: 8-4-4-4-12 format)');
			}
		}

		// Try official validation
		const isValid = errors.length === 0 && uuidValidate(trimmed);
		
		if (errors.length === 0 && !isValid) {
			errors.push('Invalid UUID format or variant bits');
		}

		// Get version
		let version: number | undefined;
		if (isValid) {
			try {
				version = uuidVersion(trimmed);
			} catch {
				// Version detection failed
			}
		}

		// Parse parts if valid format
		let details: {
			timeLow: string;
			timeMid: string;
			timeHiAndVersion: string;
			clockSeqHiAndReserved: string;
			clockSeqLow: string;
			node: string;
		} | undefined = undefined;
		
		if (withHyphens && trimmed.length === 36) {
			const parts = trimmed.split('-');
			if (parts.length === 5) {
				details = {
					timeLow: parts[0],
					timeMid: parts[1],
					timeHiAndVersion: parts[2],
					clockSeqHiAndReserved: parts[3].substring(0, 2),
					clockSeqLow: parts[3].substring(2),
					node: parts[4]
				};
			}
		}

		return {
			isValid,
			version,
			errors,
			details
		};
	}

	// Debounced validation
	let validateTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const _input = input;
		
		if (validateTimeout) clearTimeout(validateTimeout);
		
		validateTimeout = setTimeout(() => {
			validationResult = validateUuid(_input);
		}, 150);

		return () => {
			if (validateTimeout) clearTimeout(validateTimeout);
		};
	});

	// Sample UUIDs
	const samples = [
		{ label: 'Valid v4', value: '550e8400-e29b-41d4-a716-446655440000' },
		{ label: 'Valid v7', value: '018e5c4c-8b3a-7000-8000-000000000001' },
		{ label: 'Invalid', value: '550e8400-e29b-41d4-XXXX-446655440000' }
	];

	function loadSample() {
		input = samples[0].value;
	}

	function clearAll() {
		input = '';
		validationResult = null;
	}

	let stats = $derived({
		chars: input.length > 0 ? input.length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Input -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<span>🔍</span>
					</div>
					<h3 class="font-bold">Enter UUID</h3>
				</div>

				<div class="relative">
					<input
						type="text"
						bind:value={input}
						placeholder="Paste your UUID here... (e.g., 550e8400-e29b-41d4-a716-446655440000)"
						class="input input-bordered w-full font-mono text-sm pr-24"
						spellcheck="false"
					/>
					{#if input}
						<div class="absolute right-2 top-1/2 -translate-y-1/2">
							<CopyButton text={input} size="sm" />
						</div>
					{/if}
				</div>

				<!-- Quick Samples -->
				<div class="flex flex-wrap gap-2 mt-3">
					<span class="text-xs text-base-content/50">Try:</span>
					{#each samples as sample}
						<button
							type="button"
							class="badge badge-sm badge-ghost hover:badge-primary cursor-pointer"
							onclick={() => input = sample.value}
						>
							{sample.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Validation Result -->
		{#if validationResult}
			<div class="card rounded-2xl {validationResult.isValid ? 'bg-success/10 border border-success/30' : 'bg-error/10 border border-error/30'}">
				<div class="card-body p-4">
					<div class="flex items-center gap-3">
						{#if validationResult.isValid}
							<div class="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
								<svg class="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-bold text-success">Valid UUID</h3>
								{#if validationResult.version && versionInfo[validationResult.version]}
									<div class="flex items-center gap-2 mt-1">
										<span class="badge badge-{versionInfo[validationResult.version].color}">
											{versionInfo[validationResult.version].name}
										</span>
										<span class="text-sm text-base-content/70">
											{versionInfo[validationResult.version].description}
										</span>
									</div>
								{/if}
							</div>
						{:else}
							<div class="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
								<svg class="w-7 h-7 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<div>
								<h3 class="text-lg font-bold text-error">Invalid UUID</h3>
								<p class="text-sm text-base-content/70">One or more validation checks failed</p>
							</div>
						{/if}
					</div>

					<!-- Error Details -->
					{#if validationResult.errors.length > 0}
						<div class="mt-4 bg-base-100/50 rounded-lg p-3">
							<h4 class="font-semibold text-sm text-error mb-2">Issues Found:</h4>
							<ul class="space-y-1">
								{#each validationResult.errors as error}
									<li class="flex items-start gap-2 text-sm">
										<span class="text-error">•</span>
										<span>{error}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<!-- UUID Breakdown -->
					{#if validationResult.details && validationResult.isValid}
						<div class="mt-4 bg-base-100/50 rounded-lg p-3">
							<h4 class="font-semibold text-sm mb-3">UUID Anatomy</h4>
							<div class="grid gap-2">
								{#each uuidParts as part, i}
									{@const values = [
										validationResult.details?.timeLow,
										validationResult.details?.timeMid,
										validationResult.details?.timeHiAndVersion,
										`${validationResult.details?.clockSeqHiAndReserved}${validationResult.details?.clockSeqLow}`,
										validationResult.details?.node
									]}
									<div class="flex items-center gap-3 text-sm">
										<code class="font-mono bg-base-300 px-2 py-1 rounded text-xs min-w-[100px]">
											{values[i]}
										</code>
										<span class="text-base-content/70">{part.description}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Version Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-3">UUID Versions Reference</h4>
				<div class="grid gap-2 sm:grid-cols-2">
					{#each Object.entries(versionInfo) as [ver, info]}
						<div class="flex items-center gap-2 text-sm">
							<span class="badge badge-sm badge-{info.color}">{info.name.split(' ')[0]}</span>
							<span class="text-base-content/70 text-xs">{info.description}</span>
						</div>
					{/each}
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

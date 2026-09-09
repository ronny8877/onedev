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

	const content = securityToolsContent['password'];
	import zxcvbn from 'zxcvbn';

	// State
	let password = $state('');
	let showPassword = $state(false);

	// Analyze password
	let analysis = $derived(() => {
		if (!password) return null;
		return zxcvbn(password);
	});

	// Score labels and colors
	const scoreLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
	const scoreColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

	// Entropy calculation
	function calculateEntropy(pwd: string): number {
		const charsetSize = getCharsetSize(pwd);
		return Math.log2(Math.pow(charsetSize, pwd.length));
	}

	function getCharsetSize(pwd: string): number {
		let size = 0;
		if (/[a-z]/.test(pwd)) size += 26;
		if (/[A-Z]/.test(pwd)) size += 26;
		if (/[0-9]/.test(pwd)) size += 10;
		if (/[^a-zA-Z0-9]/.test(pwd)) size += 32;
		return size || 1;
	}

	// Character analysis
	let charAnalysis = $derived(() => {
		return {
			length: password.length,
			lowercase: (password.match(/[a-z]/g) || []).length,
			uppercase: (password.match(/[A-Z]/g) || []).length,
			numbers: (password.match(/[0-9]/g) || []).length,
			special: (password.match(/[^a-zA-Z0-9]/g) || []).length
		};
	});

	let entropy = $derived(password ? calculateEntropy(password) : 0);

	function formatCrackTime(seconds: number): string {
		if (seconds < 1) return 'Instant';
		if (seconds < 60) return `${Math.round(seconds)} seconds`;
		if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
		if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
		if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
		if (seconds < 31536000 * 100) return `${Math.round(seconds / 31536000)} years`;
		if (seconds < 31536000 * 1000000)
			return `${Math.round(seconds / 31536000 / 1000)} thousand years`;
		return 'Centuries';
	}

	function generateStrongPassword() {
		const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
		let result = '';
		for (let i = 0; i < 16; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		password = result;
	}
</script>

<ToolWrapper>
	<div class="mx-auto flex max-w-2xl flex-col gap-6">
		<!-- Trust Badge -->
		<div class="alert rounded-xl border border-success/20 bg-success/10">
			<span class="text-sm text-success"
				>🔒 100% client-side. Your password never leaves your browser.</span
			>
		</div>

		<!-- Password Input -->
		<div class="card rounded-2xl bg-base-200">
			<div class="card-body p-6">
				<div class="relative">
					<input
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder="Enter password to test..."
						class="input-bordered input w-full pr-24 font-mono text-xl"
					/>
					<div class="absolute top-1/2 right-2 flex -translate-y-1/2 gap-1">
						<button class="btn btn-ghost btn-sm" onclick={() => (showPassword = !showPassword)}>
							{showPassword ? '🙈' : '👁️'}
						</button>
						<button class="btn btn-ghost btn-sm" onclick={generateStrongPassword}>🎲</button>
					</div>
				</div>

				{#if analysis()}
					<!-- Strength Meter -->
					<div class="mt-6">
						<div class="mb-2 flex items-center justify-between">
							<span class="font-bold" style="color: {scoreColors[analysis()!.score]}"
								>{scoreLabels[analysis()!.score]}</span
							>
							<span class="text-sm text-base-content/60">{analysis()!.score}/4</span>
						</div>
						<div class="h-3 w-full overflow-hidden rounded-full bg-base-300">
							<div
								class="h-full rounded-full transition-all duration-500"
								style="width: {(analysis()!.score + 1) * 20}%; background: {scoreColors[
									analysis()!.score
								]}"
							></div>
						</div>
					</div>

					<!-- Crack Time -->
					<div class="mt-4 rounded-xl bg-base-300/50 p-4 text-center">
						<p class="text-sm text-base-content/60">Time to crack (offline attack)</p>
						<p class="mt-1 text-2xl font-bold" style="color: {scoreColors[analysis()!.score]}">
							{formatCrackTime(
								Number(analysis()!.crack_times_seconds.offline_slow_hashing_1e4_per_second)
							)}
						</p>
					</div>
				{/if}
			</div>
		</div>

		{#if analysis()}
			<!-- Character Breakdown -->
			<div class="card rounded-xl bg-base-200">
				<div class="card-body p-4">
					<h3 class="mb-3 text-sm font-bold">Character Analysis</h3>
					<div class="grid grid-cols-5 gap-2 text-center">
						<div class="rounded-lg bg-base-300/50 p-2">
							<p class="text-2xl font-bold">{charAnalysis().length}</p>
							<p class="text-xs text-base-content/60">Length</p>
						</div>
						<div class="rounded-lg bg-base-300/50 p-2">
							<p class="text-2xl font-bold text-blue-500">{charAnalysis().lowercase}</p>
							<p class="text-xs text-base-content/60">a-z</p>
						</div>
						<div class="rounded-lg bg-base-300/50 p-2">
							<p class="text-2xl font-bold text-purple-500">{charAnalysis().uppercase}</p>
							<p class="text-xs text-base-content/60">A-Z</p>
						</div>
						<div class="rounded-lg bg-base-300/50 p-2">
							<p class="text-2xl font-bold text-orange-500">{charAnalysis().numbers}</p>
							<p class="text-xs text-base-content/60">0-9</p>
						</div>
						<div class="rounded-lg bg-base-300/50 p-2">
							<p class="text-2xl font-bold text-pink-500">{charAnalysis().special}</p>
							<p class="text-xs text-base-content/60">!@#</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Entropy -->
			<div class="card rounded-xl bg-base-200">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="text-sm font-bold">Entropy</h3>
							<p class="text-xs text-base-content/60">Higher is better (aim for 60+ bits)</p>
						</div>
						<div class="text-right">
							<p class="font-mono text-2xl font-bold">{entropy.toFixed(1)}</p>
							<p class="text-xs text-base-content/60">bits</p>
						</div>
					</div>
					<div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-base-300">
						<div
							class="h-full rounded-full transition-all duration-300"
							style="width: {Math.min((entropy / 80) * 100, 100)}%; background: {entropy < 30
								? '#ef4444'
								: entropy < 50
									? '#eab308'
									: '#22c55e'}"
						></div>
					</div>
				</div>
			</div>

			<!-- Warnings and Suggestions -->
			{#if analysis()?.feedback.warning || (analysis()?.feedback.suggestions?.length ?? 0) > 0}
				<div class="card rounded-xl border border-warning/20 bg-warning/10">
					<div class="card-body p-4">
						<h3 class="mb-2 text-sm font-bold text-warning">Suggestions</h3>
						{#if analysis()!.feedback.warning}
							<p class="text-sm">{analysis()!.feedback.warning}</p>
						{/if}
						<ul class="ml-4 list-disc space-y-1 text-sm">
							{#each analysis()!.feedback.suggestions as suggestion}
								<li>{suggestion}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<!-- Pattern Detection -->
			{#if (analysis()?.sequence?.length ?? 0) > 0}
				<div class="card rounded-xl bg-base-200">
					<div class="card-body p-4">
						<h3 class="mb-2 text-sm font-bold">Detected Patterns</h3>
						<div class="space-y-1">
							{#each analysis()!.sequence as match}
								<div class="flex items-center justify-between rounded bg-base-300/50 p-2 text-sm">
									<span class="font-mono">{match.token}</span>
									<span class="badge badge-ghost badge-sm">{match.pattern}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<div class="card rounded-xl bg-base-200">
				<div class="card-body p-8 text-center text-base-content/50">
					<p>Enter a password above to analyze its strength</p>
				</div>
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

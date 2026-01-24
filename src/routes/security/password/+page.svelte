<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
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
		if (seconds < 31536000 * 1000000) return `${Math.round(seconds / 31536000 / 1000)} thousand years`;
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
	<div class="flex flex-col gap-6 max-w-2xl mx-auto">
		<!-- Trust Badge -->
		<div class="alert bg-success/10 border border-success/20 rounded-xl">
			<span class="text-success text-sm">🔒 100% client-side. Your password never leaves your browser.</span>
		</div>

		<!-- Password Input -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-6">
				<div class="relative">
					<input 
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder="Enter password to test..."
						class="input input-bordered w-full text-xl font-mono pr-24"
					/>
					<div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
						<button class="btn btn-sm btn-ghost" onclick={() => showPassword = !showPassword}>
							{showPassword ? '🙈' : '👁️'}
						</button>
						<button class="btn btn-sm btn-ghost" onclick={generateStrongPassword}>🎲</button>
					</div>
				</div>

				{#if analysis()}
					<!-- Strength Meter -->
					<div class="mt-6">
						<div class="flex items-center justify-between mb-2">
							<span class="font-bold" style="color: {scoreColors[analysis()!.score]}">{scoreLabels[analysis()!.score]}</span>
							<span class="text-sm text-base-content/60">{analysis()!.score}/4</span>
						</div>
						<div class="w-full h-3 bg-base-300 rounded-full overflow-hidden">
							<div 
								class="h-full rounded-full transition-all duration-500"
								style="width: {(analysis()!.score + 1) * 20}%; background: {scoreColors[analysis()!.score]}"
							></div>
						</div>
					</div>

					<!-- Crack Time -->
					<div class="mt-4 p-4 bg-base-300/50 rounded-xl text-center">
						<p class="text-sm text-base-content/60">Time to crack (offline attack)</p>
						<p class="text-2xl font-bold mt-1" style="color: {scoreColors[analysis()!.score]}">
							{formatCrackTime(analysis()!.crack_times_seconds.offline_slow_hashing_1e4_per_second)}
						</p>
					</div>
				{/if}
			</div>
		</div>

		{#if analysis()}
			<!-- Character Breakdown -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-3">Character Analysis</h3>
					<div class="grid grid-cols-5 gap-2 text-center">
						<div class="p-2 bg-base-300/50 rounded-lg">
							<p class="text-2xl font-bold">{charAnalysis().length}</p>
							<p class="text-xs text-base-content/60">Length</p>
						</div>
						<div class="p-2 bg-base-300/50 rounded-lg">
							<p class="text-2xl font-bold text-blue-500">{charAnalysis().lowercase}</p>
							<p class="text-xs text-base-content/60">a-z</p>
						</div>
						<div class="p-2 bg-base-300/50 rounded-lg">
							<p class="text-2xl font-bold text-purple-500">{charAnalysis().uppercase}</p>
							<p class="text-xs text-base-content/60">A-Z</p>
						</div>
						<div class="p-2 bg-base-300/50 rounded-lg">
							<p class="text-2xl font-bold text-orange-500">{charAnalysis().numbers}</p>
							<p class="text-xs text-base-content/60">0-9</p>
						</div>
						<div class="p-2 bg-base-300/50 rounded-lg">
							<p class="text-2xl font-bold text-pink-500">{charAnalysis().special}</p>
							<p class="text-xs text-base-content/60">!@#</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Entropy -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-bold text-sm">Entropy</h3>
							<p class="text-xs text-base-content/60">Higher is better (aim for 60+ bits)</p>
						</div>
						<div class="text-right">
							<p class="text-2xl font-bold font-mono">{entropy.toFixed(1)}</p>
							<p class="text-xs text-base-content/60">bits</p>
						</div>
					</div>
					<div class="w-full h-2 bg-base-300 rounded-full overflow-hidden mt-2">
						<div 
							class="h-full rounded-full transition-all duration-300"
							style="width: {Math.min(entropy / 80 * 100, 100)}%; background: {entropy < 30 ? '#ef4444' : entropy < 50 ? '#eab308' : '#22c55e'}"
						></div>
					</div>
				</div>
			</div>

			<!-- Warnings and Suggestions -->
			{#if analysis()?.feedback.warning || (analysis()?.feedback.suggestions?.length ?? 0) > 0}
				<div class="card bg-warning/10 border border-warning/20 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm text-warning mb-2">Suggestions</h3>
						{#if analysis()!.feedback.warning}
							<p class="text-sm">{analysis()!.feedback.warning}</p>
						{/if}
						<ul class="list-disc ml-4 text-sm space-y-1">
							{#each analysis()!.feedback.suggestions as suggestion}
								<li>{suggestion}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/if}

			<!-- Pattern Detection -->
			{#if (analysis()?.sequence?.length ?? 0) > 0}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h3 class="font-bold text-sm mb-2">Detected Patterns</h3>
						<div class="space-y-1">
							{#each analysis()!.sequence as match}
								<div class="flex items-center justify-between text-sm p-2 bg-base-300/50 rounded">
									<span class="font-mono">{match.token}</span>
									<span class="badge badge-ghost badge-sm">{match.pattern}</span>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		{:else}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-8 text-center text-base-content/50">
					<p>Enter a password above to analyze its strength</p>
				</div>
			</div>
		{/if}
	</div>
</ToolWrapper>

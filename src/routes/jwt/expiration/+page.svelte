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

	const jwtContent = jwtToolsContent['expiration'];
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let token = $state('');
	let showUtc = $state(false);

	// Sample JWT with various timestamps
	const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNzA2MDAwMDAwLCJleHAiOjE3Mzc2MjI0MDAsIm5iZiI6MTcwNjAwMDAwMH0.demo-signature';

	interface TimeInfo {
		exp?: number;
		iat?: number;
		nbf?: number;
	}

	// Base64URL decode
	function base64UrlDecode(str: string): string {
		let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
		const padding = base64.length % 4;
		if (padding) base64 += '='.repeat(4 - padding);
		return atob(base64);
	}

	let timeInfo = $derived.by((): { info: TimeInfo; error: string | null } => {
		if (!token.trim()) return { info: {}, error: null };

		const parts = token.trim().split('.');
		if (parts.length !== 3) {
			return { info: {}, error: 'Invalid JWT format' };
		}

		try {
			const payload = JSON.parse(base64UrlDecode(parts[1]));
			return {
				info: {
					exp: typeof payload.exp === 'number' ? payload.exp : undefined,
					iat: typeof payload.iat === 'number' ? payload.iat : undefined,
					nbf: typeof payload.nbf === 'number' ? payload.nbf : undefined
				},
				error: null
			};
		} catch {
			return { info: {}, error: 'Failed to decode JWT payload' };
		}
	});

	let now = $state(Date.now());

	// Update time every second
	$effect(() => {
		const interval = setInterval(() => {
			now = Date.now();
		}, 1000);
		return () => clearInterval(interval);
	});

	// Status calculations
	let status = $derived.by(() => {
		const { exp, nbf } = timeInfo.info;
		const nowSec = Math.floor(now / 1000);

		if (!exp && !nbf) return { type: 'none' as const, message: 'No time claims found' };
		
		if (exp && nowSec > exp) {
			const ago = nowSec - exp;
			return { type: 'expired' as const, message: `Expired ${formatDuration(ago)} ago`, seconds: ago };
		}

		if (nbf && nowSec < nbf) {
			const until = nbf - nowSec;
			return { type: 'not-yet' as const, message: `Valid in ${formatDuration(until)}`, seconds: until };
		}

		if (exp) {
			const remaining = exp - nowSec;
			return { type: 'valid' as const, message: `Valid for ${formatDuration(remaining)}`, seconds: remaining };
		}

		return { type: 'valid' as const, message: 'No expiration set' };
	});

	function formatDuration(seconds: number): string {
		if (seconds < 60) return `${seconds} seconds`;
		if (seconds < 3600) {
			const mins = Math.floor(seconds / 60);
			return `${mins} minute${mins !== 1 ? 's' : ''}`;
		}
		if (seconds < 86400) {
			const hours = Math.floor(seconds / 3600);
			const mins = Math.floor((seconds % 3600) / 60);
			return `${hours}h ${mins}m`;
		}
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		return `${days} day${days !== 1 ? 's' : ''} ${hours}h`;
	}

	function formatTimestamp(ts: number): string {
		const date = new Date(ts * 1000);
		if (showUtc) {
			return date.toUTCString();
		}
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

	function getRelativeTime(ts: number): string {
		const nowSec = Math.floor(now / 1000);
		const diff = ts - nowSec;
		if (diff > 0) return `in ${formatDuration(diff)}`;
		return `${formatDuration(-diff)} ago`;
	}

	function loadSample() {
		token = sampleToken;
	}

	function clearAll() {
		token = '';
	}

	const claims = [
		{ key: 'exp', label: 'Expiration Time', icon: '⏰', description: 'Token expires after this time' },
		{ key: 'iat', label: 'Issued At', icon: '📅', description: 'When the token was created' },
		{ key: 'nbf', label: 'Not Before', icon: '⏳', description: 'Token not valid before this time' }
	] as const;
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input -->
		<div>
			<textarea
				bind:value={token}
				placeholder="Paste your JWT to check expiration..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-y"
				class:textarea-error={timeInfo.error}
				spellcheck="false"
			></textarea>
		</div>

		<!-- Error -->
		{#if timeInfo.error}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{timeInfo.error}</span>
			</div>
		{/if}

		<!-- Status Badge -->
		{#if token && !timeInfo.error}
			<div class="card rounded-2xl overflow-hidden {
				status.type === 'expired' ? 'bg-gradient-to-br from-error/20 to-error/10 border-2 border-error/30' :
				status.type === 'not-yet' ? 'bg-gradient-to-br from-warning/20 to-warning/10 border-2 border-warning/30' :
				status.type === 'valid' ? 'bg-gradient-to-br from-success/20 to-success/10 border-2 border-success/30' :
				'bg-base-200'
			}">
				<div class="card-body items-center text-center py-8">
					<div class="text-6xl mb-4">
						{#if status.type === 'expired'}
							❌
						{:else if status.type === 'not-yet'}
							⏳
						{:else if status.type === 'valid'}
							✅
						{:else}
							🤷
						{/if}
					</div>
					<h2 class="text-2xl font-bold {
						status.type === 'expired' ? 'text-error' :
						status.type === 'not-yet' ? 'text-warning' :
						status.type === 'valid' ? 'text-success' : ''
					}">
						{#if status.type === 'expired'}
							Token Expired
						{:else if status.type === 'not-yet'}
							Not Yet Valid
						{:else if status.type === 'valid'}
							Token Valid
						{:else}
							No Time Claims
						{/if}
					</h2>
					<p class="text-lg text-base-content/70">{status.message}</p>
					
					{#if status.type === 'valid' && status.seconds && status.seconds < 300}
						<div class="badge badge-warning gap-1 mt-2 animate-pulse">
							<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
								<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
							</svg>
							Expiring soon!
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Timezone Toggle -->
		{#if token && !timeInfo.error && (timeInfo.info.exp || timeInfo.info.iat || timeInfo.info.nbf)}
			<div class="flex justify-end">
				<label class="flex items-center gap-2 cursor-pointer">
					<span class="text-sm">Local</span>
					<input type="checkbox" bind:checked={showUtc} class="toggle toggle-sm" />
					<span class="text-sm">UTC</span>
				</label>
			</div>
		{/if}

		<!-- Time Claims -->
		{#if token && !timeInfo.error}
			<div class="grid gap-4 md:grid-cols-3">
				{#each claims as claim}
					{@const value = timeInfo.info[claim.key]}
					<div class="card bg-base-200 rounded-xl {value ? '' : 'opacity-50'}">
						<div class="card-body p-4">
							<div class="flex items-center gap-2 mb-2">
								<span class="text-2xl"><AppIcon name={claim.icon} size={24} /></span>
								<div>
									<h3 class="font-bold text-sm">{claim.label}</h3>
									<code class="text-xs text-base-content/50">{claim.key}</code>
								</div>
							</div>
							
							{#if value}
								<div class="space-y-2">
									<div class="font-mono text-lg font-bold">{value}</div>
									<div class="text-sm text-base-content/70">{formatTimestamp(value)}</div>
									<div class="badge badge-sm badge-ghost">{getRelativeTime(value)}</div>
								</div>
							{:else}
								<p class="text-sm text-base-content/50">Not present in token</p>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Timeline Visualization -->
		{#if token && !timeInfo.error && (timeInfo.info.iat || timeInfo.info.exp)}
			<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold flex items-center gap-2 mb-4">
						<AppIcon name={'📊'} size={16} /> Token Lifecycle Timeline
					</h4>
					<div class="relative">
						<!-- Timeline bar -->
						<div class="h-3 rounded-full bg-base-300 overflow-hidden relative">
							{#if timeInfo.info.iat && timeInfo.info.exp}
								{@const total = timeInfo.info.exp - timeInfo.info.iat}
								{@const elapsed = Math.floor(now / 1000) - timeInfo.info.iat}
								{@const percent = Math.max(0, Math.min(100, (elapsed / total) * 100))}
								<div 
									class="h-full transition-all duration-1000 {percent >= 100 ? 'bg-error' : percent > 80 ? 'bg-warning' : 'bg-success'}"
									style="width: {percent}%"
								></div>
							{/if}
						</div>
						<!-- Labels -->
						<div class="flex justify-between mt-2 text-xs text-base-content/50">
							<span>Issued{#if timeInfo.info.iat}: {new Date((timeInfo.info.iat) * 1000).toLocaleDateString()}{/if}</span>
							<span class="font-semibold text-primary">Now</span>
							<span>Expires{#if timeInfo.info.exp}: {new Date((timeInfo.info.exp) * 1000).toLocaleDateString()}{/if}</span>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Time Claims Explained</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>exp</strong> (expiration) — Token is invalid after this time</li>
					<li>• <strong>iat</strong> (issued at) — When the token was created</li>
					<li>• <strong>nbf</strong> (not before) — Token is invalid before this time</li>
					<li>• All times are Unix timestamps (seconds since Jan 1, 1970)</li>
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

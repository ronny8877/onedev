<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { systemToolsContent } from '$lib/config/content/system-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = systemToolsContent['browser'];

	let browserInfo = $state<{ label: string; value: string; icon: string }[]>([]);
	let isLoading = $state(true);

	function getBrowserName(): { name: string; version: string } {
		const ua = navigator.userAgent;

		// Order matters - check more specific first
		if (ua.includes('Firefox/')) {
			const match = ua.match(/Firefox\/(\d+(\.\d+)?)/);
			return { name: 'Firefox', version: match?.[1] || 'Unknown' };
		}
		if (ua.includes('Edg/')) {
			const match = ua.match(/Edg\/(\d+(\.\d+)?)/);
			return { name: 'Microsoft Edge', version: match?.[1] || 'Unknown' };
		}
		if (ua.includes('OPR/') || ua.includes('Opera/')) {
			const match = ua.match(/(?:OPR|Opera)\/(\d+(\.\d+)?)/);
			return { name: 'Opera', version: match?.[1] || 'Unknown' };
		}
		if (ua.includes('Chrome/')) {
			const match = ua.match(/Chrome\/(\d+(\.\d+)?)/);
			return { name: 'Chrome', version: match?.[1] || 'Unknown' };
		}
		if (ua.includes('Safari/') && !ua.includes('Chrome')) {
			const match = ua.match(/Version\/(\d+(\.\d+)?)/);
			return { name: 'Safari', version: match?.[1] || 'Unknown' };
		}

		return { name: 'Unknown', version: 'Unknown' };
	}

	function getEngine(): string {
		const ua = navigator.userAgent;
		if (ua.includes('Gecko/') && ua.includes('Firefox')) return 'Gecko';
		if (ua.includes('AppleWebKit/')) {
			if (ua.includes('Chrome') || ua.includes('Edg')) return 'Blink';
			return 'WebKit';
		}
		if (ua.includes('Trident/')) return 'Trident';
		return 'Unknown';
	}

	function getLanguages(): string {
		if (navigator.languages?.length > 0) {
			return navigator.languages.slice(0, 3).join(', ');
		}
		return navigator.language || 'Unknown';
	}

	function getTimezone(): string {
		try {
			return Intl.DateTimeFormat().resolvedOptions().timeZone;
		} catch {
			return 'Unknown';
		}
	}

	function getDoNotTrack(): string {
		if (navigator.doNotTrack === '1') return 'Enabled';
		if (navigator.doNotTrack === '0') return 'Disabled';
		return 'Not set';
	}

	function getCookiesEnabled(): string {
		return navigator.cookieEnabled ? 'Enabled' : 'Disabled';
	}

	function getPDFViewer(): string {
		return navigator.pdfViewerEnabled ? 'Available' : 'Not available';
	}

	function getJavaEnabled(): string {
		try {
			return navigator.javaEnabled?.() ? 'Enabled' : 'Disabled';
		} catch {
			return 'Not supported';
		}
	}

	function loadBrowserInfo() {
		isLoading = true;
		const browser = getBrowserName();

		browserInfo = [
			{ label: 'Browser', value: browser.name, icon: 'globe' },
			{ label: 'Version', value: browser.version, icon: 'clipboard' },
			{ label: 'Engine', value: getEngine(), icon: 'settings' },
			{ label: 'Languages', value: getLanguages(), icon: 'globe' },
			{ label: 'Timezone', value: getTimezone(), icon: 'clock' },
			{ label: 'Cookies', value: getCookiesEnabled(), icon: 'cookie' },
			{ label: 'Do Not Track', value: getDoNotTrack(), icon: 'eye' },
			{ label: 'PDF Viewer', value: getPDFViewer(), icon: 'file-text' },
			{ label: 'Java', value: getJavaEnabled(), icon: 'coffee' },
			{ label: 'Online', value: navigator.onLine ? 'Yes' : 'No', icon: 'wifi' }
		];

		isLoading = false;
	}

	let outputText = $derived.by(() => {
		return browserInfo.map(item => `${item.label}: ${item.value}`).join('\n');
	});

	function copyUserAgent() {
		navigator.clipboard.writeText(navigator.userAgent);
	}

	$effect(() => {
		loadBrowserInfo();
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions copyText={outputText} copyLabel="Copy Info">
			<button class="btn btn-sm btn-ghost" onclick={loadBrowserInfo}>
				🔄 Refresh
			</button>
		</ToolActions>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else}
			<!-- Browser Info Grid -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body">
					<h3 class="font-semibold text-lg mb-4">Browser Details</h3>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each browserInfo as item}
							<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
								<div class="flex items-center gap-2">
									<span class="text-lg"><AppIcon name={item.icon} size={18} /></span>
									<span class="text-sm text-base-content/70">{item.label}</span>
								</div>
								<span class="font-mono font-semibold text-sm">{item.value}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- User Agent -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-semibold text-lg flex items-center gap-2">
							<AppIcon name="file-pen" size={16} />
							User Agent String
						</h3>
						<button class="btn btn-sm btn-ghost gap-1" onclick={copyUserAgent}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							Copy
						</button>
					</div>
					<div class="p-3 rounded-xl bg-base-300/50">
						<code class="text-xs break-all text-base-content/80">{navigator.userAgent}</code>
					</div>
				</div>
			</div>
		{/if}

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

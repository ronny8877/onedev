<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { systemToolsContent } from '$lib/config/content/system-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';

	const content = systemToolsContent['network'];

	interface InfoItem {
		label: string;
		value: string;
		raw?: string | number | boolean | null;
	}

	// Connection info
	let connectionInfo = $state<InfoItem[]>([]);

	// IP and location info
	let ipData = $state<{
		loaded: boolean;
		loading: boolean;
		error: string | null;
		ip: string;
		location: InfoItem[];
	}>({
		loaded: false,
		loading: false,
		error: null,
		ip: '',
		location: []
	});

	let isLoading = $state(true);

	interface NetworkInformation {
		effectiveType?: string;
		downlink?: number;
		rtt?: number;
		saveData?: boolean;
		type?: string;
	}

	function getConnectionInfo(): InfoItem[] {
		const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
		const items: InfoItem[] = [
			{ label: 'Online Status', value: navigator.onLine ? 'Online' : 'Offline', raw: navigator.onLine }
		];

		if (conn) {
			if (conn.effectiveType) items.push({ label: 'Effective Type', value: conn.effectiveType.toUpperCase(), raw: conn.effectiveType });
			if (conn.type) items.push({ label: 'Connection Type', value: conn.type, raw: conn.type });
			if (conn.downlink !== undefined) items.push({ label: 'Downlink Speed', value: `${conn.downlink} Mbps`, raw: conn.downlink });
			if (conn.rtt !== undefined) items.push({ label: 'Round Trip Time', value: `${conn.rtt} ms`, raw: conn.rtt });
			if (conn.saveData !== undefined) items.push({ label: 'Data Saver', value: conn.saveData ? 'Enabled' : 'Disabled', raw: conn.saveData });
		} else {
			items.push({ label: 'Network API', value: 'Not supported by browser', raw: null });
		}

		return items;
	}

	interface IPWhoResponse {
		success: boolean;
		message?: string;
		ip: string;
		country: string;
		country_code: string;
		region: string;
		city: string;
		postal: string;
		latitude: number;
		longitude: number;
		timezone?: { id: string };
		connection?: { isp: string; org: string; asn: number };
	}

	async function fetchIPAndLocation() {
		ipData.loading = true;
		ipData.error = null;

		try {
			// Using ipwho.is (HTTPS, free, no API key needed, provides location)
			const response = await fetch('https://ipwho.is/');

			if (!response.ok) throw new Error('Failed to fetch IP data');

			const data: IPWhoResponse = await response.json();

			if (!data.success) {
				throw new Error(data.message || 'IP lookup failed');
			}

			ipData.ip = data.ip;
			ipData.location = [
				{ label: 'IP Address', value: data.ip, raw: data.ip },
				{ label: 'Country', value: `${data.country} (${data.country_code})`, raw: data.country },
				{ label: 'Region', value: data.region || 'N/A', raw: data.region },
				{ label: 'City', value: data.city || 'N/A', raw: data.city },
				{ label: 'Postal Code', value: data.postal || 'N/A', raw: data.postal },
				{ label: 'Coordinates', value: `${data.latitude}, ${data.longitude}`, raw: `${data.latitude},${data.longitude}` },
				{ label: 'Timezone', value: data.timezone?.id || 'N/A', raw: data.timezone?.id },
				{ label: 'ISP', value: data.connection?.isp || 'N/A', raw: data.connection?.isp },
				{ label: 'Organization', value: data.connection?.org || 'N/A', raw: data.connection?.org },
				{ label: 'ASN', value: data.connection?.asn ? `AS${data.connection.asn}` : 'N/A', raw: data.connection?.asn }
			];

			ipData.loaded = true;
		} catch (err) {
			ipData.error = err instanceof Error ? err.message : 'Failed to fetch IP data';
		} finally {
			ipData.loading = false;
		}
	}

	function loadInfo() {
		connectionInfo = getConnectionInfo();
		isLoading = false;

		// Listen for online/offline changes
		window.addEventListener('online', () => {
			connectionInfo = getConnectionInfo();
		});
		window.addEventListener('offline', () => {
			connectionInfo = getConnectionInfo();
		});
	}

	let jsonOutput = $derived.by(() => {
		const data: Record<string, Record<string, string | number | boolean | null | undefined>> = {
			connection: {},
			ipLocation: {}
		};

		for (const item of connectionInfo) {
			data.connection[item.label] = item.raw ?? item.value;
		}

		if (ipData.loaded) {
			for (const item of ipData.location) {
				data.ipLocation[item.label] = item.raw ?? item.value;
			}
		}

		return JSON.stringify(data, null, 2);
	});

	$effect(() => {
		loadInfo();
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions copyText={jsonOutput} copyLabel="Copy as JSON">
			<button class="btn btn-sm btn-ghost" onclick={loadInfo}>
				🔄 Refresh
			</button>
		</ToolActions>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else}
			<!-- Connection Info -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold text-lg flex items-center gap-2 mb-3">
						<span>📶</span>
						Connection Details
					</h3>
					<div class="grid gap-2 sm:grid-cols-2">
						{#each connectionInfo as item}
							<div class="flex items-center justify-between p-2.5 rounded-lg bg-base-300/50 text-sm">
								<span class="text-base-content/70">{item.label}</span>
								<span
									class="font-mono font-medium"
									class:text-success={item.label === 'Online Status' && item.value === 'Online'}
									class:text-error={item.label === 'Online Status' && item.value === 'Offline'}
								>
									{item.value}
								</span>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- IP and Location -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold text-lg flex items-center gap-2 mb-2">
						<span>🌐</span>
						IP Address & Location
					</h3>

					{#if !ipData.loaded}
						<p class="text-sm text-base-content/60 mb-4">
							Click the button to fetch your public IP and approximate location. This makes a request to ip-api.com.
						</p>
						<button
							class="btn btn-primary"
							onclick={fetchIPAndLocation}
							disabled={ipData.loading}
						>
							{#if ipData.loading}
								<span class="loading loading-spinner loading-sm"></span>
								Loading...
							{:else}
								🔍 Check IP & Location
							{/if}
						</button>

						{#if ipData.error}
							<div class="alert alert-error mt-4 rounded-xl text-sm">
								<span>{ipData.error}</span>
							</div>
						{/if}
					{:else}
						<div class="grid gap-2 sm:grid-cols-2 mt-2">
							{#each ipData.location as item}
								<div class="flex items-center justify-between p-2.5 rounded-lg bg-base-300/50 text-sm">
									<span class="text-base-content/70">{item.label}</span>
									<span class="font-mono font-medium truncate max-w-[50%] text-right" title={item.value}>
										{item.value}
									</span>
								</div>
							{/each}
						</div>

						<button class="btn btn-ghost btn-sm mt-4" onclick={fetchIPAndLocation}>
							🔄 Refresh IP Data
						</button>
					{/if}
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

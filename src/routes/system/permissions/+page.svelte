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

	const content = systemToolsContent['permissions'];

	// Permission state
	interface PermissionStatus {
		name: string;
		icon: string;
		state: 'granted' | 'denied' | 'prompt' | 'not-supported' | 'loading';
		canRequest?: boolean;
	}

	let permissions = $state<PermissionStatus[]>([
		{ name: 'Camera', icon: 'camera', state: 'loading', canRequest: true },
		{ name: 'Microphone', icon: 'mic', state: 'loading', canRequest: true },
		{ name: 'Geolocation', icon: 'map-pin', state: 'loading', canRequest: true },
		{ name: 'Notifications', icon: 'bell', state: 'loading', canRequest: true },
		{ name: 'Clipboard Read', icon: 'clipboard', state: 'loading', canRequest: true },
		{ name: 'Clipboard Write', icon: 'pencil', state: 'loading', canRequest: true },
		{ name: 'Persistent Storage', icon: 'save', state: 'loading', canRequest: true },
		{ name: 'Background Sync', icon: 'refresh-cw', state: 'loading', canRequest: false }
	]);

	let isLoading = $state(true);

	async function checkPermission(name: string): Promise<'granted' | 'denied' | 'prompt' | 'not-supported'> {
		if (!navigator.permissions) return 'not-supported';

		const permMap: Record<string, string> = {
			'Camera': 'camera',
			'Microphone': 'microphone',
			'Geolocation': 'geolocation',
			'Notifications': 'notifications',
			'Clipboard Read': 'clipboard-read',
			'Clipboard Write': 'clipboard-write',
			'Persistent Storage': 'persistent-storage',
			'Background Sync': 'background-sync'
		};

		const permName = permMap[name];
		if (!permName) return 'not-supported';

		try {
			const result = await navigator.permissions.query({ name: permName as PermissionName });
			return result.state as 'granted' | 'denied' | 'prompt';
		} catch {
			return 'not-supported';
		}
	}

	async function loadPermissions() {
		for (let i = 0; i < permissions.length; i++) {
			const state = await checkPermission(permissions[i].name);
			permissions[i].state = state;
		}
		permissions = [...permissions];
		isLoading = false;
	}

	async function requestPermission(name: string) {
		const idx = permissions.findIndex(p => p.name === name);
		if (idx === -1) return;

		try {
			switch (name) {
				case 'Camera':
					const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
					camStream.getTracks().forEach(t => t.stop());
					break;
				case 'Microphone':
					const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
					micStream.getTracks().forEach(t => t.stop());
					break;
				case 'Geolocation':
					await new Promise((resolve, reject) => {
						navigator.geolocation.getCurrentPosition(resolve, reject);
					});
					break;
				case 'Notifications':
					await Notification.requestPermission();
					break;
				case 'Persistent Storage':
					if (navigator.storage?.persist) {
						await navigator.storage.persist();
					}
					break;
				case 'Clipboard Read':
					// This will trigger the permission prompt
					await navigator.clipboard.readText();
					break;
				case 'Clipboard Write':
					// Write empty string to trigger permission
					await navigator.clipboard.writeText('');
					break;
			}
		} catch (err) {
			console.log('Permission request failed:', err);
		}

		// Re-check permission state
		permissions[idx].state = await checkPermission(name);
		permissions = [...permissions];
	}

	function getStateColor(state: string): string {
		switch (state) {
			case 'granted': return 'text-success';
			case 'denied': return 'text-error';
			case 'prompt': return 'text-warning';
			default: return 'text-base-content/50';
		}
	}

	function getStateBadge(state: string): string {
		switch (state) {
			case 'granted': return 'badge-success';
			case 'denied': return 'badge-error';
			case 'prompt': return 'badge-warning';
			default: return 'badge-ghost';
		}
	}

	function getStateLabel(state: string): string {
		switch (state) {
			case 'granted': return 'Granted';
			case 'denied': return 'Denied';
			case 'prompt': return 'Not Yet Asked';
			case 'not-supported': return 'Not Supported';
			case 'loading': return 'Checking...';
			default: return 'Unknown';
		}
	}

	let statsText = $derived.by(() => {
		return permissions.map(p => `${p.name}: ${p.state.toUpperCase()}`).join('\n');
	});

	$effect(() => {
		loadPermissions();
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions copyText={statsText} copyLabel="Copy Status List">
			<button class="btn btn-sm btn-ghost" onclick={loadPermissions}>
				🔄 Refresh
			</button>
		</ToolActions>

		{#if isLoading}
			<div class="flex items-center justify-center py-12">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else}
			<!-- Permissions Grid -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body">
					<h3 class="font-semibold text-lg mb-4">Permission Status</h3>

					<div class="grid gap-3">
						{#each permissions as perm}
							<div class="flex items-center justify-between p-3 rounded-xl bg-base-300/50">
								<div class="flex items-center gap-3">
									<span class="text-lg"><AppIcon name={perm.icon} size={18} /></span>
									<div>
										<span class="font-medium text-sm">{perm.name}</span>
										<div class="badge {getStateBadge(perm.state)} badge-sm ml-2">
											{getStateLabel(perm.state)}
										</div>
									</div>
								</div>

								{#if perm.state === 'prompt' && perm.canRequest}
									<button
										class="btn btn-xs btn-primary"
										onclick={() => requestPermission(perm.name)}
									>
										Request
									</button>
								{:else if perm.state === 'granted'}
									<svg class="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
								{:else if perm.state === 'denied'}
									<svg class="h-5 w-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Legend -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold mb-3">Status Legend</h4>
					<div class="flex flex-wrap gap-4 text-sm">
						<div class="flex items-center gap-2">
							<span class="badge badge-success badge-sm">Granted</span>
							<span class="text-base-content/70">Permission allowed</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="badge badge-warning badge-sm">Not Asked</span>
							<span class="text-base-content/70">Will prompt when needed</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="badge badge-error badge-sm">Denied</span>
							<span class="text-base-content/70">Permission blocked</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="badge badge-ghost badge-sm">Not Supported</span>
							<span class="text-base-content/70">Browser doesn't support</span>
						</div>
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

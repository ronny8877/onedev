<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CopyFormat {
		label: string;
		value: string;
		icon?: string;
	}

	interface Props {
		url: string;
		showFormats?: boolean;
		size?: 'xs' | 'sm' | 'md';
		class?: string;
	}

	let { url, showFormats = true, size = 'sm', class: className = '' }: Props = $props();
	let copied = $state(false);
	let dropdownOpen = $state(false);

	function generateFormats(targetUrl: string): CopyFormat[] {
		return [
			{ label: 'URL', value: targetUrl, icon: '🔗' },
			{ label: 'cURL', value: `curl '${targetUrl}'`, icon: '💻' },
			{ label: 'Fetch', value: `fetch('${targetUrl}')`, icon: '📦' },
			{ label: 'Axios', value: `axios.get('${targetUrl}')`, icon: '⚡' },
			{ label: 'wget', value: `wget '${targetUrl}'`, icon: '📥' },
			{ label: 'HTTPie', value: `http GET '${targetUrl}'`, icon: '🌐' },
			{ label: 'Markdown', value: `[Link](${targetUrl})`, icon: '📝' },
			{ label: 'HTML', value: `<a href="${targetUrl}">${targetUrl}</a>`, icon: '🏷️' }
		];
	}

	let formats = $derived(generateFormats(url));

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		dropdownOpen = false;
		setTimeout(() => copied = false, 2000);
	}

	async function copyDefault() {
		await copyToClipboard(url);
	}

	function handleClickOutside(event: MouseEvent) {
		dropdownOpen = false;
	}
</script>

<div class="flex items-center gap-0.5 z-50 {className}">
	{#if showFormats}
		<div class="dropdown dropdown-end">
			<button
				type="button"
				class="btn btn-ghost btn-{size} btn-square rounded-r-none border-r-0"
				onclick={() => dropdownOpen = !dropdownOpen}
				aria-label="More copy options"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
			</button>
			{#if dropdownOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="fixed inset-0 z-10" onclick={handleClickOutside} onkeydown={() => {}}></div>
				<ul class="dropdown-content  z-20 menu p-2 shadow-lg bg-base-200 rounded-2xl w-48 mt-1">
					{#each formats as format}
						<li>
							<button
								type="button"
								class="flex items-center gap-2 text-sm rounded-2xl"
								onclick={() => copyToClipboard(format.value)}
							>
								<span>{format.icon}</span>
								<span>{format.label}</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
	
	<button
		type="button"
		class="btn btn-{size}"
		class:btn-success={copied}
		class:rounded-l-none={showFormats}
		onclick={copyDefault}
		disabled={!url}
	>
		{#if copied}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
			Copied!
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
			Copy
		{/if}
	</button>
</div>

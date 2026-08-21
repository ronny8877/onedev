<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface CopyFormat {
		label: string;
		value: string;
		icon?: string;
	}

	interface Props {
		// Use `text` for plain text copy (no URL formats)
		// Use `url` for URL copy with format options
		text?: string;
		url?: string;
		label?: string;
		showFormats?: boolean;
		size?: 'xs' | 'sm' | 'md';
		class?: string;
	}

	let { 
		text = '', 
		url = '', 
		label = 'Copy',
		showFormats = true, 
		size = 'sm', 
		class: className = '' 
	}: Props = $props();

	let copied = $state(false);
	let dropdownOpen = $state(false);

	// Determine what to copy - text takes priority over url
	const copyValue = $derived(text || url);
	const isUrl = $derived(!text && !!url);

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

	let formats = $derived(isUrl ? generateFormats(url) : []);

	async function copyToClipboard(value: string) {
		await navigator.clipboard.writeText(value);
		copied = true;
		dropdownOpen = false;
		setTimeout(() => copied = false, 2000);
	}

	async function copyDefault() {
		await copyToClipboard(copyValue);
	}

	function handleClickOutside() {
		dropdownOpen = false;
	}
</script>

<div class="flex items-center gap-0.5  {className}">
	{#if showFormats && isUrl}
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
				<ul class="dropdown-content z-20 menu p-2 shadow-lg bg-base-200 rounded-2xl w-48 mt-1">
					{#each formats as format}
						<li>
							<button
								type="button"
								class="flex items-center gap-2 text-sm rounded-2xl"
								onclick={() => copyToClipboard(format.value)}
							>
								<AppIcon name={format.icon} size={14} />
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
		class:rounded-l-none={showFormats && isUrl}
		onclick={copyDefault}
		disabled={!copyValue}
	>
		{#if copied}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
			{#if label}Copied!{/if}
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
			{#if label}{label}{/if}
		{/if}
	</button>
</div>

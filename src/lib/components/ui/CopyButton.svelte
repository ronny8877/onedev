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
			{ label: 'URL', value: targetUrl, icon: 'link' },
			{ label: 'cURL', value: `curl '${targetUrl}'`, icon: 'monitor' },
			{ label: 'Fetch', value: `fetch('${targetUrl}')`, icon: 'package' },
			{ label: 'Axios', value: `axios.get('${targetUrl}')`, icon: 'zap' },
			{ label: 'wget', value: `wget '${targetUrl}'`, icon: 'download' },
			{ label: 'HTTPie', value: `http GET '${targetUrl}'`, icon: 'globe' },
			{ label: 'Markdown', value: `[Link](${targetUrl})`, icon: 'file-pen' },
			{ label: 'HTML', value: `<a href="${targetUrl}">${targetUrl}</a>`, icon: 'tag' }
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
				class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
				onclick={() => dropdownOpen = !dropdownOpen}
				aria-label="More copy options"
			>
				<AppIcon name="chevron-down" class="size-4" />
			</button>
			{#if dropdownOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="fixed inset-0 z-10" onclick={handleClickOutside} onkeydown={() => {}}></div>
				<ul class="dropdown-content z-20 menu w-48 mt-1">
					{#each formats as format}
						<li>
							<button
								type="button"
								class="flex items-center gap-2 text-sm"
								onclick={() => copyToClipboard(format.value)}
							>
								<AppIcon name={format.icon} class="size-4" />
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
		class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5"
		class:btn-success={copied}
		onclick={copyDefault}
		disabled={!copyValue}
	>
		{#if copied}
			<AppIcon name="check" class="size-4" />
			{#if label}Copied!{/if}
		{:else}
			<AppIcon name="copy" class="size-4" />
			{#if label}{label}{/if}
		{/if}
	</button>
</div>

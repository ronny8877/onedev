<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
	import { page } from '$app/stores';
	import { getSidebarAccordions, getToolNamesRecord } from '$lib/config/tools';
	import { initTheme, getTheme } from '$lib/stores/theme.svelte.ts';
	//fevicons
	import appleTouchIcon from '$lib/assets/apple-touch-icon.png';
	import favicon32 from '$lib/assets/favicon-32x32.png';
	import favicon16 from '$lib/assets/favicon-16x16.png';
	import siteWebmanifest from '$lib/assets/site.webmanifest';

	let { children } = $props();

	// Get from centralized config
	const sidebarAccordions = getSidebarAccordions();
	const toolNames = getToolNamesRecord();

	let currentToolName = $derived(toolNames[$page.url.pathname] || 'Dev Tools');

	// Mobile drawer state
	let drawerOpen = $state(false);

	// Command palette state
	let commandPaletteOpen = $state(false);

	// Theme
	let currentTheme = $derived(getTheme());

	$effect(() => {
		initTheme();
	});

	function handleGlobalKeydown(event: KeyboardEvent) {
		// Cmd+K (Mac) or Ctrl+K (Windows/Linux)
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			commandPaletteOpen = true;
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<svelte:head>
	<link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
	<link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
	<link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
	<link rel="manifest" href={siteWebmanifest} />
	<meta name="theme-color" content={currentTheme === 'dark' ? '#1d232a' : '#ffffff'} />

	<!-- Sitewide OG/Social defaults (overridden by individual pages) -->
	<meta property="og:site_name" content="OneDev Tools" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://onedev.tools/og-default.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:alt" content="OneDev Tools — Free Developer Utilities" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://onedev.tools/og-default.png" />
	<meta name="twitter:site" content="@onedevtools" />
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="main-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

	<div class="drawer-content ">
		<!-- Top Bar -->
		<TopBar toolName={currentToolName} onSearchClick={() => commandPaletteOpen = true} />

		<!-- Mobile menu button -->
		<label
			for="main-drawer"
			class="btn fixed top-2 left-4 z-50 btn-square btn-ghost lg:hidden"
			aria-label="Open menu"
		>
			<svg
				class="h-6 w-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				></path>
			</svg>
		</label>

		<!-- Main Content -->
		<main class="min-h-screen bg-base-100 pt-[var(--topbar-height)] lg:ml-80">
			<div class="p-6">
				{@render children()}
			</div>
		</main>
	</div>

	<!-- Sidebar Drawer -->
	<div class="drawer-side z-40">
		<label for="main-drawer" class="drawer-overlay" aria-label="Close menu"></label>
		<Sidebar accordions={sidebarAccordions} onNavigate={() => { drawerOpen = false; }} />
	</div>
</div>

<!-- Global Components -->
<Toast />
<CommandPalette bind:open={commandPaletteOpen} />

<script lang="ts">
	import './layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { getSidebarAccordions, getToolNamesRecord } from '$lib/config/tools';
	import { initTheme, getTheme } from '$lib/stores/theme.svelte.ts';
	import { trackPageView } from '$lib/utils/analytics';
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

	afterNavigate(() => {
		trackPageView($page.url.pathname + $page.url.search, document.title);
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
	<meta name="theme-color" content={currentTheme === 'dark' ? '#302b2b' : '#f7f6f4'} />

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
			class="btn btn-ghost fixed top-2 left-4 z-50 h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg lg:hidden"
			aria-label="Open menu"
		>
			<AppIcon name="menu" class="size-4" />
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

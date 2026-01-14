<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import { page } from '$app/stores';
	import { getSidebarAccordions, getToolNamesRecord } from '$lib/config/tools';

	let { children } = $props();

	// Get from centralized config
	const sidebarAccordions = getSidebarAccordions();
	const toolNames = getToolNamesRecord();

	let currentToolName = $derived(toolNames[$page.url.pathname] || 'OneDev Tools');

	// Mobile drawer state
	let drawerOpen = $state(false);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#1d232a" />
</svelte:head>

<div class="drawer lg:drawer-open">
	<input id="main-drawer" type="checkbox" class="drawer-toggle" bind:checked={drawerOpen} />

	<div class="drawer-content">
		<!-- Top Bar -->
		<TopBar toolName={currentToolName} />

		<!-- Mobile menu button -->
		<label
			for="main-drawer"
			class="btn btn-ghost btn-square fixed left-4 top-3 z-50 lg:hidden"
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
		<main
			class="min-h-screen bg-base-100 pt-(--topbar-height) lg:ml-(--sidebar-width)"
		>
			<div class="p-6">
				{@render children()}
			</div>
		</main>
	</div>

	<!-- Sidebar Drawer -->
	<div class="drawer-side z-40">
		<label for="main-drawer" class="drawer-overlay" aria-label="Close menu"></label>
		<Sidebar accordions={sidebarAccordions} />
	</div>
</div>

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	// Sidebar configuration
	const sidebarAccordions = [
		{
			name: 'JSON',
			icon: '{ }',
			items: [
				{ name: 'JSON Formatter', href: '/json/formatter' },
				{ name: 'JSON Validator', href: '/json/validator' },
				{ name: 'JSON Diff', href: '/json/diff' },
				{ name: 'JSON → Table', href: '/json/table' },
				{ name: 'JSON Visualizer', href: '/json/visualizer' },
				{ name: 'Type Generator', href: '/json/type-generator' },
				{ name: 'Path Tester', href: '/json/path-tester' }
			]
		},
		{
			name: 'Base64',
			icon: '⚡',
			items: [
				{ name: 'Encode / Decode', href: '/base64/encode-decode' },
				{ name: 'File Encoder', href: '/base64/file-encoder' },
				{ name: 'Image Preview', href: '/base64/image-preview' },
				{ name: 'URL-safe Converter', href: '/base64/url-safe' },
				{ name: 'Validator', href: '/base64/validator' },
				{ name: 'Splitter', href: '/base64/splitter' },
				{ name: 'Hex / Binary', href: '/base64/hex-binary' }
			]
		}
	];

	// Get current tool name from route
	const toolNames: Record<string, string> = {
		'/': 'OneDev Tools',
		'/json/formatter': 'JSON Formatter',
		'/json/validator': 'JSON Validator',
		'/json/diff': 'JSON Diff Checker',
		'/json/table': 'JSON to Table',
		'/json/visualizer': 'JSON Visualizer',
		'/json/type-generator': 'Type Generator',
		'/json/path-tester': 'JSON Path Tester',
		'/base64/encode-decode': 'Base64 Encode / Decode',
		'/base64/file-encoder': 'Base64 File Encoder',
		'/base64/image-preview': 'Base64 Image Preview',
		'/base64/url-safe': 'Base64 URL-safe Converter',
		'/base64/validator': 'Base64 Validator',
		'/base64/splitter': 'Base64 Splitter',
		'/base64/hex-binary': 'Base64 → Hex / Binary'
	};

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
			class="min-h-screen bg-base-100 pt-[var(--topbar-height)] lg:ml-[var(--sidebar-width)]"
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

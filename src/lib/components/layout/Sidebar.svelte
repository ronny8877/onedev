<script lang="ts">
	import { page } from '$app/stores';

	interface SidebarItem {
		name: string;
		href: string;
		icon?: string;
	}

	interface SidebarAccordion {
		name: string;
		icon?: string;
		items: SidebarItem[];
	}

	interface Props {
		items?: SidebarItem[];
		accordions?: SidebarAccordion[];
		onNavigate?: () => void;
	}

	let { items = [], accordions = [], onNavigate }: Props = $props();

	// Track which accordions are open
	let openAccordions = $state<Record<string, boolean>>({});

	// Auto-open accordion that contains active route
	$effect(() => {
		const currentPath = $page.url.pathname;
		for (const accordion of accordions) {
			if (accordion.items.some((item) => currentPath.startsWith(item.href))) {
				openAccordions[accordion.name] = true;
			}
		}
	});

	function toggleAccordion(name: string) {
		openAccordions[name] = !openAccordions[name];
	}

	function isActive(href: string): boolean {
		return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
	}

	function handleLinkClick(toolName: string, categoryName?: string) {
		if (typeof window !== 'undefined' && (window as Window & { umami?: { track: (event: string, data?: Record<string, string>) => void } }).umami) {
			(window as Window & { umami?: { track: (event: string, data?: Record<string, string>) => void } }).umami?.track('Tool Select', {
				tool: toolName,
				...(categoryName && { category: categoryName })
			});
		}

		if (onNavigate) {
			onNavigate();
		}
	}
</script>

<aside class="sidebar-container">
	<!-- App Title -->
	<div class="sidebar-header">
		<a href="/" class="logo" onclick={() => handleLinkClick('Home')}>
			<span class="logo-one">One</span><span class="logo-dev">dev</span><span class="logo-tools">.tools</span>
		</a>
	</div>

	<nav class="sidebar-nav">
		<!-- Simple Items -->
		{#if items.length > 0}
			<ul class="nav-list">
				{#each items as item}
					<li>
						<a 
							href={item.href} 
							class="nav-item"
							class:active={isActive(item.href)}
							onclick={() => handleLinkClick(item.name)}
						>
							{#if item.icon}
								<span class="nav-icon">{item.icon}</span>
							{/if}
							<span class="nav-text">{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Accordions -->
		<div class="accordion-list">
			{#each accordions as accordion}
				<div class="accordion">
					<!-- Category Header -->
					<button
						type="button"
						class="accordion-header"
						onclick={() => toggleAccordion(accordion.name)}
					>
						<span class="accordion-title">
							{#if accordion.icon}
								<span class="accordion-icon">{accordion.icon}</span>
							{/if}
							<span class="accordion-name">{accordion.name}</span>
						</span>
						<svg
							class="chevron"
							class:open={openAccordions[accordion.name]}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>

					<!-- Items List -->
					{#if openAccordions[accordion.name]}
						<ul class="accordion-items">
							{#each accordion.items as item}
								<li>
									<a 
										href={item.href} 
										class="nav-item"
										class:active={isActive(item.href)}
										onclick={() => handleLinkClick(item.name, accordion.name)}
									>
										{#if item.icon}
											<span class="nav-icon small">{item.icon}</span>
										{/if}
										<span class="nav-text">{item.name}</span>
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</div>
	</nav>
</aside>

<style>
	.sidebar-container {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 40;
		height: 100vh;
		width: var(--sidebar-width);
		overflow-y: auto;
		overflow-x: hidden;
		border-right: 1px solid oklch(var(--bc) / 0.08);
		background: oklch(var(--b2));
	}

	/* Custom scrollbar */
	.sidebar-container::-webkit-scrollbar {
		width: 4px;
	}
	.sidebar-container::-webkit-scrollbar-track {
		background: transparent;
	}
	.sidebar-container::-webkit-scrollbar-thumb {
		background: oklch(var(--bc) / 0.12);
		border-radius: 4px;
	}
	.sidebar-container::-webkit-scrollbar-thumb:hover {
		background: oklch(var(--bc) / 0.2);
	}

	/* Header */
	.sidebar-header {
		position: sticky;
		top: 0;
		z-index: 10;
		background: oklch(var(--b2));
		padding: 1.25rem 1rem 1rem;
		border-bottom: 1px solid oklch(var(--bc) / 0.06);
	}

	.logo {
		display: flex;
		justify-content: center;
		font-size: 1.375rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		text-decoration: none;
		transition: opacity 0.15s;
	}
	.logo:hover {
		opacity: 0.85;
	}
	.logo-one {
		color: oklch(var(--p));
	}
	.logo-dev {
		color: oklch(var(--bc));
	}
	.logo-tools {
		color: oklch(var(--bc) / 0.4);
		font-weight: 400;
	}

	/* Navigation */
	.sidebar-nav {
		padding: 0.75rem;
	}

	.nav-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		text-decoration: none;
		color: oklch(var(--bc) / 0.7);
		font-size: 0.8125rem;
		transition: all 0.12s ease;
	}
	.nav-item:hover {
		background: oklch(var(--bc) / 0.06);
		color: oklch(var(--bc) / 0.9);
	}
	.nav-item.active {
		background: oklch(var(--p) / 0.1);
		color: oklch(var(--p));
		font-weight: 500;
	}

	.nav-icon {
		font-size: 0.875rem;
		opacity: 0.8;
		flex-shrink: 0;
	}
	.nav-icon.small {
		font-size: 0.8125rem;
	}

	.nav-text {
		line-height: 1.3;
	}

	/* Accordions */
	.accordion-list {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-top: 0.5rem;
	}

	.accordion-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: none;
		border-radius: 0.5rem;
		background: transparent;
		cursor: pointer;
		transition: background 0.12s ease;
	}
	.accordion-header:hover {
		background: oklch(var(--bc) / 0.04);
	}

	.accordion-title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.accordion-icon {
		font-size: 0.9375rem;
	}

	.accordion-name {
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: oklch(var(--bc) / 0.45);
	}

	.chevron {
		width: 0.875rem;
		height: 0.875rem;
		color: oklch(var(--bc) / 0.35);
		transition: transform 0.2s ease;
	}
	.chevron.open {
		transform: rotate(180deg);
	}

	.accordion-items {
		list-style: none;
		margin: 0.25rem 0 0.5rem 0;
		padding: 0 0 0 0.5rem;
	}

	.accordion-items .nav-item {
		padding: 0.4rem 0.75rem;
	}
</style>

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
		onNavigate?: () => void; // Callback when user navigates
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
		// Track with Umami
		if (typeof window !== 'undefined' && (window as Window & { umami?: { track: (event: string, data?: Record<string, string>) => void } }).umami) {
			(window as Window & { umami?: { track: (event: string, data?: Record<string, string>) => void } }).umami?.track('Tool Select', {
				tool: toolName,
				...(categoryName && { category: categoryName })
			});
		}

		// Close mobile drawer
		if (onNavigate) {
			onNavigate();
		}
	}
</script>

<aside
	class="fixed top-0 left-0 z-40 h-screen w-[var(--sidebar-width)] overflow-y-auto border-r border-base-300 bg-base-200"
>
	<!-- App Title -->
	<div class="px-4 pt-4 pb-2">
		<a href="/" class="flex w-full justify-center text-3xl font-bold tracking-tight" onclick={() => handleLinkClick('Home')}>
			<span class="text-primary">One</span>dev.tools
		</a>
	</div>

	<nav class="p-4 pt-2">
		<!-- Simple Items -->
		{#if items.length > 0}
			<ul class="menu w-full">
				{#each items as item}
					<li>
						<a href={item.href} class:active={isActive(item.href)} onclick={() => handleLinkClick(item.name)}>
							{#if item.icon}
								<span class="text-lg">{item.icon}</span>
							{/if}
							{item.name}
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Accordions -->
		{#each accordions as accordion}
			<div class="mt-2">
				<button
					type="button"
					class="btn w-full justify-between text-left font-medium btn-ghost"
					onclick={() => toggleAccordion(accordion.name)}
				>
					<span class="flex items-center gap-2">
						{#if accordion.icon}
							<span class="text-lg">{accordion.icon}</span>
						{/if}
						{accordion.name}
					</span>
					<svg
						class="h-4 w-4 transition-transform duration-200"
						class:rotate-180={openAccordions[accordion.name]}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</button>

				{#if openAccordions[accordion.name]}
					<ul class="menu w-full gap-1 pl-4">
						{#each accordion.items as item}
							<li>
								<a 
									href={item.href} 
									class:active={isActive(item.href)}
									onclick={() => handleLinkClick(item.name, accordion.name)}
								>
									{#if item.icon}
										<span class="text-base">{item.icon}</span>
									{/if}
									{item.name}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</nav>
</aside>

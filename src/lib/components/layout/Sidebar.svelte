<script lang="ts">
	import { page } from '$app/stores';
	import { trackToolSelect } from '$lib/utils/analytics';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

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

	// Helper to check if any item in an accordion is active
	function isAccordionActive(accordion: SidebarAccordion): boolean {
		return accordion.items.some((item) => isActive(item.href));
	}

	// Auto-open accordion that contains active route
	$effect(() => {
		const currentPath = $page.url.pathname;
		for (const accordion of accordions) {
			// Check if we haven't set the state for this accordion yet
			// OR if it contains the current active item, enforce it open
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
		trackToolSelect(toolName, categoryName, 'sidebar');

		if (onNavigate) {
			onNavigate();
		}
	}
</script>

<aside class="sidebar-container bg-base-100 border-r border-base-300 h-screen w-80 fixed top-0 left-0 z-40 overflow-y-auto overflow-x-hidden flex flex-col supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh]">
	<!-- App Title -->
	<div class="sidebar-header justify-center flex sticky top-0 z-10 bg-base-100 border-b border-base-200 px-6 py-5">
		<a href="/" class="flex items-center gap-0.5 text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity" onclick={() => handleLinkClick('Home')}>
			<span class="text-base-content">Onedev</span><span class="text-base-content/40 font-normal">.tools</span>
		</a>
	</div>

	<nav class="flex-1 p-3 space-y-1">
		<!-- Simple Items -->
		{#if items.length > 0}
			<ul class="menu menu-sm bg-base-100 rounded-box w-full gap-1">
				{#each items as item}
					<li>
						<a 
							href={item.href} 
							class:active={isActive(item.href)}
							onclick={() => handleLinkClick(item.name)}
							class="font-medium"
						>
							{#if item.icon}
								<AppIcon name={item.icon} class="size-4" />
							{/if}
							<span>{item.name}</span>
						</a>
					</li>
				{/each}
			</ul>
		{/if}

		<!-- Accordions -->
		<ul class="bg-base-100 rounded-box w-full gap-1">
			{#each accordions as accordion}
				{@const active = isAccordionActive(accordion)}
				<li>
					<div class="flex flex-col gap-0 p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent">
						<!-- Category Header -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="w-full flex items-center justify-between py-2 px-3 mt-1 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-base-200 {active ? 'bg-base-200' : ''}"
							onclick={() => toggleAccordion(accordion.name)}
						>
							<div class="flex items-center gap-3">
								{#if accordion.icon}
									<AppIcon name={accordion.icon} class="size-4" />
								{/if}
								<span class="font-semibold text-sm tracking-wide text-base-content">{accordion.name}</span>
							</div>
							<AppIcon
								name="chevron-down"
								class="size-4 transition-transform duration-200 {openAccordions[accordion.name] ? 'rotate-180' : ''}"
							/>
						</div>

						<!-- Items List -->
						{#if openAccordions[accordion.name]}
							<ul class="menu menu-sm w-full mt-1 gap-1 bg-base-200 rounded-lg p-2">
								{#each accordion.items as item}
									<li>
										<a 
											href={item.href} 
											class="py-2 rounded-lg hover:bg-base-300 transition-colors {isActive(item.href) ? 'bg-base-300 text-base-content' : ''}"
											class:active={isActive(item.href)}
											onclick={() => handleLinkClick(item.name, accordion.name)}
										>
											{#if item.icon}
												<AppIcon name={item.icon} class="size-4" />
											{/if}
											<span class:font-medium={isActive(item.href)}>{item.name}</span>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</nav>

	<!-- Sidebar Footer — Trust Links -->
	<div class="border-t border-base-200 px-4 py-3 mt-auto">
		<div class="flex flex-wrap gap-x-3 gap-y-1 justify-center">
			<a href="/about" class="text-xs text-base-content/40 hover:text-base-content transition-colors">About</a>
			<span class="text-base-content/20 text-xs">·</span>
			<a href="/privacy" class="text-xs text-base-content/40 hover:text-base-content transition-colors">Privacy</a>
			<span class="text-base-content/20 text-xs">·</span>
			<a href="/contact" class="text-xs text-base-content/40 hover:text-base-content transition-colors">Contact</a>
			<span class="text-base-content/20 text-xs">·</span>
			<a href="/editorial-policy" class="text-xs text-base-content/40 hover:text-base-content transition-colors">Editorial</a>
		</div>
	</div>
</aside>


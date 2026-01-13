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
	}

	let { items = [], accordions = [] }: Props = $props();

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
</script>

<aside
	class="bg-base-200 fixed left-0 top-0 z-40 h-screen w-[var(--sidebar-width)] overflow-y-auto border-r border-base-300 pt-[var(--topbar-height)]"
>
	<nav class="p-4">
		<!-- Simple Items -->
		{#if items.length > 0}
			<ul class="menu w-full">
				{#each items as item}
					<li>
						<a href={item.href} class:active={isActive(item.href)}>
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
					class="btn btn-ghost w-full justify-between text-left font-medium"
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
					<ul class="menu w-full pl-4">
						{#each accordion.items as item}
							<li>
								<a href={item.href} class:active={isActive(item.href)}>
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

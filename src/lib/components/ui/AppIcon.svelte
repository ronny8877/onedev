<script lang="ts">
	import { icons, Wrench, type LucideIcon } from '@lucide/svelte';

	interface Props {
		name?: string | null;
		size?: number;
		class?: string;
		strokeWidth?: number;
		title?: string;
	}

	let {
		name = '',
		size = 16,
		class: className = '',
		strokeWidth = 2,
		title
	}: Props = $props();

	const ICON_MAP = icons as unknown as Record<string, LucideIcon | undefined>;

	function kebabToPascal(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
			.join('');
	}

	const Icon = $derived(ICON_MAP[kebabToPascal(name ?? '')] ?? Wrench);
</script>

<Icon
	{size}
	{strokeWidth}
	class="shrink-0 {className}"
	color="currentColor"
	aria-hidden={title ? undefined : true}
	role={title ? 'img' : undefined}
	{title}
/>

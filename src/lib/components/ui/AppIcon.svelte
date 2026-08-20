<script lang="ts">
	import { getIconMarkup } from '$lib/icons/registry';

	interface Props {
		name?: string | null;
		size?: number;
		class?: string;
		strokeWidth?: number;
		title?: string;
	}

	let {
		name = '',
		size = 18,
		class: className = '',
		strokeWidth = 2,
		title
	}: Props = $props();

	const markup = $derived(getIconMarkup(name));
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	class="shrink-0 {className}"
	aria-hidden={title ? undefined : 'true'}
	role={title ? 'img' : undefined}
>
	{#if title}
		<title>{title}</title>
	{/if}
	{@html markup}
</svg>

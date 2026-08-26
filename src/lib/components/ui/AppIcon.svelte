<script lang="ts">
	import { Wrench } from '@lucide/svelte';
	import { lucideIcons } from './lucide-icons';

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

	const Icon = $derived(lucideIcons[name ?? ''] ?? Wrench);
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

<script lang="ts">
	import CategoryPage from '$lib/components/ui/CategoryPage.svelte';
	import { getCategoryBySlug } from '$lib/config/tools';

	const category = getCategoryBySlug('convert')!;
</script>

{#if category}
	<CategoryPage {category} />
{/if}

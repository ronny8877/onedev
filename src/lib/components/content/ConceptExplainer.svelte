<script lang="ts">
	interface Props {
		title: string;
		content: string; // Brief HTML explanation
	}

	let { title, content }: Props = $props();
</script>

<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold text-base-content">{title}</h2>
	<div class="prose prose-sm max-w-none prose-p:text-base-content/80 prose-ul:text-base-content/80 prose-code:text-primary">
		{@html content}
	</div>
</section>

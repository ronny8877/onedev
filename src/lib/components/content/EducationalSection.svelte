<script lang="ts">
	interface Section {
		title: string;
		content: string; // HTML content
		subsections?: { title: string; content: string }[];
	}

	interface Props {
		sections: Section[];
	}

	let { sections }: Props = $props();
</script>

<div class="mt-12 space-y-8">
	{#each sections as section}
		<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
			<div class="prose prose-sm max-w-none prose-headings:text-base-content prose-p:text-base-content/80 prose-a:text-primary prose-strong:text-base-content prose-code:text-primary prose-pre:bg-base-300">
				<h2 class="mb-4 text-2xl font-bold">{section.title}</h2>
				{@html section.content}

				{#if section.subsections && section.subsections.length > 0}
					{#each section.subsections as subsection}
						<h3 class="mb-3 mt-6 text-xl font-semibold">{subsection.title}</h3>
						{@html subsection.content}
					{/each}
				{/if}
			</div>
		</section>
	{/each}
</div>

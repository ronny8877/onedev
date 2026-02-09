<script lang="ts">
	interface RelatedTool {
		name: string;
		path: string;
		description: string;
	}

	interface Props {
		relatedTools: RelatedTool[];
	}

	let { relatedTools }: Props = $props();
</script>

<div class="card bg-base-200 rounded-xl">
	<div class="card-body">
		<h3 class="text-xl font-bold mb-4">Related Tools</h3>
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each relatedTools as tool}
				<a 
					href={tool.path} 
					class="card bg-base-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 border border-base-300"
				>
					<div class="card-body py-3 px-4">
						<h4 class="font-semibold text-base mb-1">{tool.name}</h4>
						<p class="text-sm text-base-content/70">{tool.description}</p>
						<div class="mt-2 flex items-center gap-1 text-xs text-primary">
							<span>Try it</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M5 12h14"/>
								<path d="m12 5 7 7-7 7"/>
							</svg>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.card:hover h4 {
		color: hsl(var(--p));
	}
</style>

<script lang="ts">
	interface Example {
		label: string;
		code: string;
		isValid: boolean;
	}

	interface Props {
		examples: Example[];
	}

	let { examples }: Props = $props();
</script>

<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold text-base-content">Examples</h2>
	<div class="space-y-4">
		{#each examples as example}
			<div class="rounded-lg border {example.isValid ? 'border-success/30 bg-success/5' : 'border-error/30 bg-error/5'} p-4">
				<div class="mb-2 flex items-center gap-2">
					{#if example.isValid}
						<svg class="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
						<span class="text-sm font-semibold text-success">Valid</span>
					{:else}
						<svg class="h-5 w-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
						<span class="text-sm font-semibold text-error">Invalid</span>
					{/if}
					<span class="text-sm text-base-content/70">- {example.label}</span>
				</div>
				<pre class="overflow-x-auto rounded bg-base-300 p-3 text-xs"><code>{example.code}</code></pre>
			</div>
		{/each}
	</div>
</section>

<script lang="ts">
	import type { ParseError } from '$lib/utils/json';

	interface Props {
		error: ParseError | null;
	}

	let { error }: Props = $props();
</script>

{#if error}
	<div class="alert alert-error">
		<svg
			class="h-5 w-5 flex-shrink-0"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<div class="flex flex-col">
			<span class="font-medium">JSON Error</span>
			<span class="text-sm opacity-80">{error.message}</span>
			{#if error.line !== undefined}
				<span class="mt-1 text-xs opacity-60">
					Line {error.line}{error.column !== undefined ? `, Column ${error.column}` : ''}
				</span>
			{/if}
		</div>
	</div>
{/if}

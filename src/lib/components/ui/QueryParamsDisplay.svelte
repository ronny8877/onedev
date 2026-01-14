<script lang="ts">
	import type { QueryParam } from '$lib/utils/url';

	interface Props {
		params: QueryParam[];
		class?: string;
	}

	let { params, class: className = '' }: Props = $props();

	// Group params by key to detect arrays
	function groupParams(paramList: QueryParam[]): { key: string; values: string[]; isArray: boolean }[] {
		const grouped = new Map<string, string[]>();
		
		for (const param of paramList) {
			const existing = grouped.get(param.key) || [];
			existing.push(param.value);
			grouped.set(param.key, existing);
		}
		
		return Array.from(grouped.entries()).map(([key, values]) => ({
			key,
			values,
			isArray: values.length > 1 || Boolean(values[0] && values[0].includes(','))
		}));
	}

	function parseArrayValue(value: string): string[] {
		if (value.includes(',')) {
			return value.split(',').map(v => v.trim());
		}
		return [value];
	}

	let groupedParams = $derived(groupParams(params));

	async function copyValue(value: string) {
		await navigator.clipboard.writeText(value);
	}
</script>

<div class="space-y-2 {className}">
	{#each groupedParams as param}
		<div class="bg-base-200 p-3 rounded-lg">
			<div class="flex items-start justify-between gap-2">
				<div class="flex-1 min-w-0">
					<div class="flex items-center gap-2 mb-1">
						<span class="font-mono text-sm font-medium text-primary">{param.key}</span>
						{#if param.isArray}
							<span class="badge badge-info badge-xs">array</span>
						{/if}
					</div>
					
					{#if param.isArray}
						<div class="flex flex-wrap gap-1.5 mt-1">
							{#each param.values as value}
								{#each parseArrayValue(value) as item}
									<span class="badge badge-outline badge-sm font-mono">{item || '(empty)'}</span>
								{/each}
							{/each}
						</div>
					{:else}
						<div class="font-mono text-sm text-base-content/80 break-all">
							{#if param.values[0]}
								{param.values[0]}
							{:else}
								<span class="text-base-content/40 italic">empty</span>
							{/if}
						</div>
					{/if}
				</div>
				<button
					type="button"
					class="btn btn-ghost btn-xs shrink-0"
					onclick={() => copyValue(param.values.join(','))}
				>
					Copy
				</button>
			</div>
		</div>
	{/each}
</div>

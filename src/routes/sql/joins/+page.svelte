<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { JOIN_KINDS, JOIN_USERS, JOIN_ORDERS, runJoin, type JoinKind } from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['joins'];
	let kind = $state<JoinKind>('inner');
	let result = $derived(runJoin(kind));

	function cell(value: number | string | null): string {
		return value === null ? 'NULL' : String(value);
	}
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<p class="text-sm text-base-content/60">
			Sample data stays the same so you can compare join types. Users 1–3 on the left, orders on the right (including an order for missing user 4).
		</p>

		<div class="flex flex-wrap gap-2">
			{#each JOIN_KINDS as item}
				<button
					type="button"
					class="btn btn-sm {kind === item.value ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => (kind = item.value)}
				>
					{item.label}
				</button>
			{/each}
		</div>

		<div class="grid gap-6 lg:grid-cols-3">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">users</h3>
					<table class="table table-sm">
						<thead><tr><th>id</th><th>name</th></tr></thead>
						<tbody>
							{#each JOIN_USERS as u}
								<tr class={result.leftMatched.has(u.id) ? 'bg-primary/10' : ''}>
									<td class="font-mono">{u.id}</td>
									<td>{u.name}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">orders</h3>
					<table class="table table-sm">
						<thead><tr><th>id</th><th>user_id</th><th>total</th></tr></thead>
						<tbody>
							{#each JOIN_ORDERS as o}
								<tr class={result.rightMatched.has(o.id) ? 'bg-primary/10' : ''}>
									<td class="font-mono">{o.id}</td>
									<td class="font-mono">{o.user_id}</td>
									<td>{o.total}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4 items-center">
					<h3 class="font-bold mb-3">Match</h3>
					<svg viewBox="0 0 220 140" class="w-full max-w-[220px]" aria-hidden="true">
						<circle cx="80" cy="70" r="52" class="fill-primary/20 stroke-primary" stroke-width="2" />
						<circle cx="140" cy="70" r="52" class="fill-secondary/20 stroke-secondary" stroke-width="2" />
						{#if kind === 'inner' || kind === 'left-semi'}
							<ellipse cx="110" cy="70" rx="22" ry="40" class="fill-success/50" />
						{:else if kind === 'left' || kind === 'full'}
							<circle cx="80" cy="70" r="52" class="fill-success/35" />
						{:else if kind === 'right'}
							<circle cx="140" cy="70" r="52" class="fill-success/35" />
						{:else if kind === 'cross'}
							<circle cx="80" cy="70" r="52" class="fill-success/25" />
							<circle cx="140" cy="70" r="52" class="fill-success/25" />
						{:else}
							<circle cx="80" cy="70" r="52" class="fill-warning/40" />
							<ellipse cx="110" cy="70" rx="22" ry="40" class="fill-base-200" />
						{/if}
						<text x="52" y="74" class="fill-base-content text-[11px] font-semibold">users</text>
						<text x="138" y="74" class="fill-base-content text-[11px] font-semibold">orders</text>
					</svg>
				</div>
			</div>
		</div>

		<div class="alert rounded-xl bg-base-200 border border-base-300">
			<span class="text-sm">{result.description}</span>
		</div>

		<div>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">SQL</h3>
				<CopyButton text={result.sql} size="sm" />
			</div>
			<pre class="overflow-x-auto rounded-xl border border-base-300 bg-base-200 p-4 font-mono text-sm"><code>{result.sql}</code></pre>
		</div>

		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">
				Result ({result.rows.length} row{result.rows.length === 1 ? '' : 's'})
			</h3>
			<div class="overflow-x-auto rounded-xl border border-base-300">
				<table class="table table-sm">
					<thead>
						<tr>
							<th>user_id</th>
							<th>name</th>
							<th>order_id</th>
							<th>total</th>
						</tr>
					</thead>
					<tbody>
						{#each result.rows as row}
							<tr>
								<td class="font-mono {row.user_id === null ? 'opacity-40 italic' : ''}">{cell(row.user_id)}</td>
								<td class={row.name === null ? 'opacity-40 italic' : ''}>{cell(row.name)}</td>
								<td class="font-mono {row.order_id === null ? 'opacity-40 italic' : ''}">{cell(row.order_id)}</td>
								<td class="font-mono {row.total === null ? 'opacity-40 italic' : ''}">{cell(row.total)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>

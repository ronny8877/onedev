<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['cheatsheet'];

	interface Entry {
		name: string;
		sql: string;
		note: string;
	}

	interface Section {
		id: string;
		title: string;
		entries: Entry[];
	}

	const sections: Section[] = [
		{
			id: 'select',
			title: 'SELECT',
			entries: [
				{ name: 'Basic', sql: 'SELECT col FROM t WHERE cond;', note: 'Core read query' },
				{ name: 'Distinct', sql: 'SELECT DISTINCT col FROM t;', note: 'Drop duplicate values' },
				{ name: 'Alias', sql: 'SELECT u.name AS user_name FROM users u;', note: 'AS is optional in most engines' },
				{ name: 'Limit', sql: 'SELECT * FROM t ORDER BY id LIMIT 10 OFFSET 20;', note: 'Postgres, MySQL, SQLite' },
				{
					name: 'SQL Server page',
					sql: 'SELECT * FROM t ORDER BY id OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;',
					note: 'T-SQL paging'
				}
			]
		},
		{
			id: 'joins',
			title: 'JOINs',
			entries: [
				{ name: 'INNER', sql: 'FROM a INNER JOIN b ON a.id = b.a_id', note: 'Matches only' },
				{ name: 'LEFT', sql: 'FROM a LEFT JOIN b ON a.id = b.a_id', note: 'Keep all of a' },
				{ name: 'RIGHT', sql: 'FROM a RIGHT JOIN b ON a.id = b.a_id', note: 'Keep all of b' },
				{ name: 'FULL', sql: 'FROM a FULL OUTER JOIN b ON a.id = b.a_id', note: 'Keep leftovers on both sides' },
				{ name: 'CROSS', sql: 'FROM a CROSS JOIN b', note: 'Cartesian product' },
				{ name: 'Anti', sql: 'FROM a LEFT JOIN b ON a.id = b.a_id WHERE b.id IS NULL', note: 'Rows in a with no b' },
				{ name: 'EXISTS', sql: 'WHERE EXISTS (SELECT 1 FROM b WHERE b.a_id = a.id)', note: 'Semi-join, one row per a' }
			]
		},
		{
			id: 'nulls',
			title: 'NULL',
			entries: [
				{ name: 'IS NULL', sql: 'WHERE col IS NULL', note: 'Never use = NULL' },
				{ name: 'COALESCE', sql: 'COALESCE(a, b, c)', note: 'First non-null. All engines' },
				{ name: 'NULLIF', sql: 'NULLIF(a, b)', note: 'NULL if a equals b' },
				{ name: 'IFNULL', sql: 'IFNULL(a, b)', note: 'MySQL / SQLite two-arg' },
				{ name: 'ISNULL', sql: 'ISNULL(a, b)', note: 'SQL Server two-arg' }
			]
		},
		{
			id: 'types',
			title: 'Data types',
			entries: [
				{ name: 'Postgres', sql: 'INTEGER, BIGINT, NUMERIC, TEXT, BOOLEAN, TIMESTAMPTZ, JSONB, UUID', note: 'Prefer TIMESTAMPTZ' },
				{ name: 'MySQL', sql: 'INT, BIGINT, DECIMAL, VARCHAR(n), TINYINT(1), DATETIME, JSON', note: 'BOOLEAN is TINYINT' },
				{ name: 'SQLite', sql: 'INTEGER, REAL, TEXT, BLOB, NUMERIC', note: 'Types are affinities' },
				{ name: 'SQL Server', sql: 'INT, BIGINT, DECIMAL, NVARCHAR(n), BIT, DATETIME2, UNIQUEIDENTIFIER', note: 'NVARCHAR for unicode' }
			]
		},
		{
			id: 'agg',
			title: 'Aggregates',
			entries: [
				{ name: 'Count', sql: 'COUNT(*) / COUNT(col) / COUNT(DISTINCT col)', note: 'COUNT(*) counts null rows' },
				{ name: 'Group', sql: 'SELECT u.id, COUNT(*) FROM t GROUP BY u.id', note: 'Non-aggregated cols must be grouped' },
				{ name: 'Having', sql: 'GROUP BY u.id HAVING COUNT(*) > 1', note: 'Filter groups, not rows' },
				{ name: 'Filter', sql: 'COUNT(*) FILTER (WHERE active)', note: 'Postgres / SQLite 3.30+' }
			]
		},
		{
			id: 'window',
			title: 'Window functions',
			entries: [
				{ name: 'Row number', sql: 'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC)', note: '1..n per partition' },
				{ name: 'Rank', sql: 'RANK() OVER (ORDER BY score DESC)', note: 'Ties skip the next rank' },
				{ name: 'Lag / lead', sql: 'LAG(col, 1) OVER (ORDER BY ts)', note: 'Previous / next row' },
				{ name: 'Running sum', sql: 'SUM(amount) OVER (PARTITION BY user_id ORDER BY ts)', note: 'Frame defaults to RANGE UNBOUNDED PRECEDING' }
			]
		},
		{
			id: 'dates',
			title: 'Dates',
			entries: [
				{ name: 'Postgres trunc', sql: "DATE_TRUNC('day', ts)", note: 'Also week, month, year' },
				{ name: 'MySQL date', sql: 'DATE(ts) / DATE_FORMAT(ts, \'%Y-%m-%d\')', note: 'MySQL date helpers' },
				{ name: 'SQLite', sql: "strftime('%Y-%m-%d', ts)", note: 'SQLite date as string' },
				{ name: 'Interval', sql: "ts + INTERVAL '7 days'", note: 'Postgres. MySQL: DATE_ADD(ts, INTERVAL 7 DAY)' },
				{ name: 'Now', sql: 'CURRENT_TIMESTAMP / NOW() / GETDATE()', note: 'NOW is Postgres/MySQL, GETDATE is T-SQL' }
			]
		},
		{
			id: 'strings',
			title: 'Strings',
			entries: [
				{ name: 'Concat', sql: "col || 'x'   -- Postgres, SQLite\nCONCAT(col, 'x') -- MySQL, SQL Server", note: 'MySQL || is OR unless PIPES_AS_CONCAT' },
				{ name: 'LIKE', sql: "WHERE name LIKE 'A%' ESCAPE '\\'", note: '% any, _ one char' },
				{ name: 'ILIKE', sql: "WHERE name ILIKE '%smith%'", note: 'Postgres only' },
				{ name: 'Trim', sql: 'TRIM(BOTH FROM col) / LTRIM / RTRIM', note: 'All engines' },
				{ name: 'Length', sql: 'CHAR_LENGTH(col) / LEN(col)', note: 'LEN is SQL Server' }
			]
		},
		{
			id: 'write',
			title: 'INSERT / UPDATE / DELETE',
			entries: [
				{ name: 'Insert', sql: 'INSERT INTO t (a, b) VALUES (1, \'x\');', note: 'List columns explicitly' },
				{ name: 'Insert select', sql: 'INSERT INTO t (a) SELECT a FROM src;', note: 'Copy rows' },
				{ name: 'Returning', sql: 'INSERT INTO t (name) VALUES (\'Ada\') RETURNING id;', note: 'Postgres, SQLite 3.35+' },
				{ name: 'Update', sql: 'UPDATE t SET a = 1 WHERE id = 9;', note: 'Always include WHERE' },
				{ name: 'Delete', sql: 'DELETE FROM t WHERE id = 9;', note: 'DELETE FROM t; wipes the table' },
				{
					name: 'Upsert PG',
					sql: 'INSERT INTO t (id, n) VALUES (1, 2)\nON CONFLICT (id) DO UPDATE SET n = EXCLUDED.n;',
					note: 'PostgreSQL'
				},
				{
					name: 'Upsert MySQL',
					sql: 'INSERT INTO t (id, n) VALUES (1, 2)\nON DUPLICATE KEY UPDATE n = VALUES(n);',
					note: 'MySQL. 8.0.19+ prefers aliases'
				}
			]
		},
		{
			id: 'ddl',
			title: 'DDL',
			entries: [
				{ name: 'Create', sql: 'CREATE TABLE t (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL\n);', note: 'Add constraints in the table, not later if you can' },
				{ name: 'Index', sql: 'CREATE INDEX t_name_idx ON t (name);', note: 'B-tree by default' },
				{ name: 'Unique', sql: 'CREATE UNIQUE INDEX t_email_uidx ON t (email);', note: 'Enforces uniqueness' },
				{ name: 'Alter', sql: 'ALTER TABLE t ADD COLUMN bio TEXT;', note: 'Syntax varies a lot by engine' }
			]
		}
	];

	let query = $state('');
	let active = $state<string | null>(null);

	let visible = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return sections
			.filter((s) => !active || s.id === active)
			.map((s) => ({
				...s,
				entries: q
					? s.entries.filter(
							(e) =>
								e.name.toLowerCase().includes(q) ||
								e.sql.toLowerCase().includes(q) ||
								e.note.toLowerCase().includes(q) ||
								s.title.toLowerCase().includes(q)
						)
					: s.entries
			}))
			.filter((s) => s.entries.length > 0);
	});
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<input
			bind:value={query}
			class="input input-bordered w-full"
			placeholder="Search SQL (join, coalesce, limit, returning...)"
		/>

		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				class="btn btn-sm {active === null ? 'btn-primary' : 'btn-ghost'}"
				onclick={() => (active = null)}>All</button
			>
			{#each sections as section}
				<button
					type="button"
					class="btn btn-sm {active === section.id ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => (active = section.id)}>{section.title}</button
				>
			{/each}
		</div>

		{#each visible as section}
			<section>
				<h2 class="mb-3 text-lg font-bold">{section.title}</h2>
				<div class="space-y-3">
					{#each section.entries as entry}
						<div class="rounded-xl border border-base-300 bg-base-200 p-4">
							<div class="mb-2 flex items-start justify-between gap-3">
								<div>
									<div class="font-semibold">{entry.name}</div>
									<p class="text-xs text-base-content/50">{entry.note}</p>
								</div>
								<CopyButton text={entry.sql} size="sm" />
							</div>
							<pre class="overflow-x-auto rounded-lg bg-base-100 p-3 font-mono text-xs"><code>{entry.sql}</code></pre>
						</div>
					{/each}
				</div>
			</section>
		{:else}
			<p class="text-sm text-base-content/50">No snippets matched.</p>
		{/each}
	</div>
	<ToolContent {content} />
</ToolWrapper>

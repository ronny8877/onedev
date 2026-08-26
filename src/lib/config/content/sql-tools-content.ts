export interface SqlToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

const relatedCore = [
	{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print SQL' },
	{ name: 'SQL Validator', path: '/sql/validator', description: 'Check syntax' },
	{ name: 'SQL Minifier', path: '/sql/minifier', description: 'Compress SQL' },
	{ name: 'JSON to SQL', path: '/sql/from-json', description: 'INSERT from JSON' }
];

export const sqlToolsContent: Record<string, SqlToolContent> = {
	formatter: {
		features: [
			'Dialect selector: PostgreSQL, MySQL/MariaDB, SQLite, SQL Server, BigQuery, Snowflake',
			'Keyword case and indent without running the statement',
			'Parse errors tied to the selected dialect, not generic SQL',
			'Preserves string literals, dollar quotes, backticks, and brackets'
		],
		useCases: [
			'Pretty-print a Postgres query that MySQL dialect would reject ($$, ILIKE)',
			'Format a BigQuery script without treating backticks as MySQL errors',
			'Normalize keyword case before a Git diff in one dialect',
			'See why a T-SQL [bracket] identifier failed under PostgreSQL'
		],
		concept: {
			title: 'Format by dialect, not generic SQL',
			content: `<p>There is no single SQL. A formatter that assumes ANSI will mangle or reject real queries. This page uses sql-formatter with an explicit dialect. Pick the engine you will run against. Whitespace and keyword case change; the statement is not executed.</p>
<p><strong>What breaks across dialects:</strong> PostgreSQL <code>$$</code> dollar quotes and <code>ILIKE</code>. MySQL/MariaDB backticks and <code>#</code> comments. SQL Server <code>[brackets]</code> and <code>N'strings'</code>. BigQuery backticks for project.dataset.table. Snowflake identifier quoting. SQLite is a subset, still not Postgres.</p>
<p>If you format Postgres with the MySQL dialect, <code>$$body$$</code> looks like illegal syntax and you get a parse error instead of a pretty function body. The reverse: MySQL backticks become weird identifiers under Postgres rules.</p>
<p>Formatting will not fix a missing comma. If the dialect parser rejects the input, you get the error, not a guess. Do not format a query if a downstream system hashes the exact bytes.</p>`
		},
		examples: [
			{
				label: 'Postgres dollar quote (needs PostgreSQL dialect)',
				code: "SELECT $$it's a string$$;",
				isValid: true
			},
			{
				label: 'MySQL backticks',
				code: 'SELECT `order` FROM `user`;',
				isValid: true
			},
			{
				label: 'Unclosed string (any dialect)',
				code: "SELECT * FROM users WHERE name = 'Ada",
				isValid: false
			}
		],
		faqs: [
			{
				question: 'Why did a valid Postgres query fail here?',
				answer: '<p>The dialect dropdown is probably MySQL or the default. Switch to PostgreSQL for <code>$$</code>, <code>ILIKE</code>, <code>::</code> casts, and some type names. The formatter is not a lowest-common-denominator SQL engine.</p>'
			},
			{
				question: 'Does formatting change the meaning?',
				answer: '<p>Not for ordinary statements in the chosen dialect. Whitespace and optional keyword case change. String literals stay. Identifier quoting stays. Do not format if something hashes the exact SQL text.</p>'
			},
			{
				question: 'Can I format T-SQL and BigQuery on the same setting?',
				answer: '<p>No. Pick SQL Server or BigQuery separately. Bracket identifiers vs backticks vs double quotes are different languages that happen to look like SQL.</p>'
			},
			{
				question: 'Will this run my DELETE?',
				answer: '<p>No. There is no database connection. Pretty-print only.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL Validator', path: '/sql/validator', description: 'Syntax check without rewriting' },
			{ name: 'SQL Minifier', path: '/sql/minifier', description: 'Collapse whitespace after you chose a dialect' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'When the SQL is actually a JSON string in an API body' }
		],
		tips: [
			'2-space indent for diffs; 4-space if the team already uses it.',
			'If the error mentions the default sql dialect, pick PostgreSQL or MySQL instead.',
			'Dollar-quoted bodies need PostgreSQL. Backticks need MySQL or BigQuery.'
		]
	},
	minifier: {
		features: [
			'Collapse whitespace outside string literals and quoted identifiers',
			'Optionally strip -- and /* */ comments',
			'Keep quotes, dollar quotes, backticks, and brackets intact',
			'Show before and after byte counts',
			'Refuse to minify when quotes or parentheses are unbalanced',
			'Runs locally so production queries with credentials stay on this device'
		],
		useCases: [
			'Fit a query into a single log line',
			'Shrink SQL embedded in JSON or a QR payload',
			'Normalize a query before a byte-level hash',
			'Strip comments from a sample you are about to share',
			'Compare compact vs pretty size'
		],
		concept: {
			title: 'When minifying SQL is safe',
			content: `<p>Minifying SQL deletes comments and extra spaces. Engines ignore insignificant whitespace, so <code>SELECT a FROM t</code> and <code>SELECT a FROM t</code> with newlines are the same. Spaces inside <code>'string literals'</code> and quoted identifiers must stay. This minifier tokenizes those regions first.</p>
<p class="mt-2">MySQL <code>--</code> comments historically needed a space after the dashes. We treat <code>--</code> as a line comment in every dialect, which matches how people write them today.</p>`
		},
		examples: [
			{ label: 'Pretty input', code: "SELECT\n  id\nFROM users; -- active only", isValid: true },
			{ label: 'Already compact', code: 'SELECT id FROM users;', isValid: true },
			{ label: 'Broken, will not minify', code: "SELECT * FROM users WHERE name = 'Ada", isValid: false }
		],
		faqs: [
			{
				question: 'Will minifying break my string literals?',
				answer: '<p>No. Quoted strings, dollar quotes, backticks, and bracket identifiers are copied through unchanged. Only unquoted whitespace is collapsed.</p>'
			},
			{
				question: 'Are comments always removed?',
				answer: '<p>By default yes. Uncheck “strip comments” if you need to keep <code>--</code> and block comments.</p>'
			},
			{
				question: 'Is this the same as the formatter with no indent?',
				answer: '<p>No. The formatter parses a dialect grammar. The minifier is a tokenizer. Use the formatter when you want readable SQL; use the minifier when you want fewer bytes.</p>'
			}
		],
		relatedTools: relatedCore,
		tips: [
			'Keep a copy of the original if a migration tool compares exact SQL text.',
			'Strip comments before you paste a query into a public ticket.'
		]
	},
	validator: {
		features: [
			'Catch unclosed quotes, dollar quotes, and block comments',
			'Catch unmatched parentheses with a line and column',
			'Dialect-aware parse via the same engine as the formatter',
			'Count statements, JOINs, SELECTs, and mentioned tables',
			'Live check as you type, no upload',
			'Works for PostgreSQL, MySQL, SQLite, SQL Server, BigQuery, Snowflake'
		],
		useCases: [
			'See why a paste from Slack will not run',
			'Confirm a hand-edited migration is at least parseable',
			'Count how many statements are in a script before you run it',
			'List tables referenced in a messy query',
			'Check a query after a find-and-replace'
		],
		concept: {
			title: 'Syntax check vs running the query',
			content: `<p>This tool checks <strong>syntax</strong>: quotes close, parentheses match, and the formatter’s parser can read the statement. It does not connect to a database. A query can be syntactically fine and still fail at runtime (unknown column, permission denied, bad JOIN).</p>
<p class="mt-2">It is also not a linter for anti-patterns. <code>SELECT *</code> and missing <code>WHERE</code> on <code>DELETE</code> are valid SQL. The explainer calls those out in English; the validator does not block them.</p>`
		},
		examples: [
			{ label: 'Valid SELECT', code: 'SELECT id FROM users WHERE active = TRUE;', isValid: true },
			{ label: 'Unclosed parenthesis', code: 'SELECT id FROM users WHERE (active = TRUE;', isValid: false },
			{ label: 'Unclosed string', code: "INSERT INTO t (name) VALUES ('Ada);", isValid: false }
		],
		faqs: [
			{
				question: 'Does this execute my SQL?',
				answer: '<p>No. There is no database here. The check is local parsing only.</p>'
			},
			{
				question: 'Why is a misspelled keyword still “valid”?',
				answer: '<p>The parser may treat unknown words as identifiers. <code>FORM users</code> can look like a table named FORM. Use the explainer or read the formatted output if something feels off.</p>'
			},
			{
				question: 'Is schema validation included?',
				answer: '<p>No. We do not have your tables. Pair this with your engine’s <code>EXPLAIN</code> when you need a plan.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print after it parses' },
			{ name: 'SQL Explainer', path: '/sql/explainer', description: 'See clauses in English' },
			{ name: 'SQL Diff', path: '/sql/diff', description: 'Compare two queries' }
		],
		tips: [
			'Pick the dialect you will run. Postgres dollar quotes fail under MySQL.',
			'A DELETE without WHERE is valid SQL and dangerous. Read it twice.'
		]
	},
	'from-json': {
		features: [
			'Turn a JSON array of objects into INSERT statements',
			'Optional CREATE TABLE with inferred types',
			'Dialect quoting: Postgres ", MySQL `, SQL Server []',
			'Snake_case column names from camelCase keys',
			'Booleans, numbers, dates, JSON nested objects handled',
			'Runs locally so seed data with emails stays on this device'
		],
		useCases: [
			'Seed a local Postgres or SQLite from an API sample',
			'Turn a fixture JSON into MySQL INSERTs',
			'Generate CREATE TABLE from a response shape',
			'Move a small dataset between a mock API and a database',
			'Build a demo script from copied DevTools JSON'
		],
		concept: {
			title: 'JSON to SQL is a guess, not a migration',
			content: `<p>Each object key becomes a column. Types are inferred from the values you pasted: integers, floats, booleans, ISO dates, nested objects as JSON. That is a convenience for seeds, not a schema design. Production tables need constraints, indexes, and nullability you still choose.</p>
<p class="mt-2">Need CSV instead of JSON? Use <a href="/csv/to-sql">CSV to SQL</a>. Need the other direction later? Export from your database; we do not run SELECT here.</p>`
		},
		examples: [
			{
				label: 'Array of objects',
				code: '[{"id":1,"name":"Ada"}]',
				isValid: true
			},
			{ label: 'Not an object array', code: '[1, 2, 3]', isValid: false },
			{ label: 'Empty array', code: '[]', isValid: false }
		],
		faqs: [
			{
				question: 'How do I convert JSON to SQL INSERT?',
				answer: '<p>Paste a JSON array of objects, pick a dialect and table name, and copy the INSERT statements. Enable CREATE TABLE if you also want a matching table definition.</p>'
			},
			{
				question: 'Will this pick SERIAL / AUTO_INCREMENT?',
				answer: '<p>No. Integer columns become INTEGER (or INT64 on BigQuery). Add identity or sequences yourself.</p>'
			},
			{
				question: 'Are values escaped against SQL injection?',
				answer: '<p>Literals use dialect-appropriate quoting. Still do not run generated SQL from untrusted JSON on production.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV to SQL', path: '/csv/to-sql', description: 'INSERT from a spreadsheet' },
			{ name: 'SQL Escape', path: '/sql/escape', description: 'Quote a single value' },
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print the result' },
			{ name: 'JSON to CSV', path: '/csv/from-json', description: 'Spreadsheet instead of SQL' }
		],
		tips: [
			'Use snake_case when the target style is Postgres.',
			'Nested objects become JSON/JSONB strings, not child tables.'
		]
	},
	escape: {
		features: [
			'Escape string literals with doubled quotes or MySQL backslashes',
			'Quote identifiers for Postgres, MySQL, SQLite, SQL Server, BigQuery',
			'Unescape a pasted literal back to raw text',
			'Live preview as you type',
			'Nothing is uploaded'
		],
		useCases: [
			'Build a VALUES clause from a user-supplied name',
			'Quote a column that is also a reserved word (user, order, group)',
			'Turn a copied SQL literal back into the original string',
			'Switch identifier quotes when moving a query from MySQL to Postgres'
		],
		concept: {
			title: 'String literals vs identifiers',
			content: `<p>SQL uses two quoting systems. <strong>String literals</strong> use single quotes: <code>'Ada''s'</code> is the text Ada’s. <strong>Identifiers</strong> (table and column names) use double quotes in PostgreSQL and SQLite, backticks in MySQL, and brackets in SQL Server.</p>
<p class="mt-2">Mixing them is a common bug: <code>WHERE name = "Ada"</code> is an identifier comparison in Postgres, not a string. Escape the value here, then paste it into the query.</p>`
		},
		examples: [
			{ label: 'String with apostrophe', code: "Ada's book", isValid: true },
			{ label: 'Reserved identifier', code: 'order', isValid: true },
			{ label: 'Already-quoted literal', code: "'O''Reilly'", isValid: true }
		],
		faqs: [
			{
				question: 'How do I escape a single quote in SQL?',
				answer: '<p>In PostgreSQL, SQLite, and SQL Server, double it: <code>\'O\'\'Reilly\'</code>. MySQL also accepts a backslash. This tool emits the form for the dialect you pick.</p>'
			},
			{
				question: 'Should I quote every column name?',
				answer: '<p>Only when the name is a reserved word, has spaces, or must keep case. Quoted identifiers become case-sensitive in Postgres.</p>'
			}
		],
		relatedTools: relatedCore,
		tips: [
			'Prefer bound parameters in application code. This page is for one-off SQL and seeds.',
			'Postgres dollar quotes avoid quote doubling for long text, but they are not portable.'
		]
	},
	diff: {
		features: [
			'Format both queries with the same dialect before comparing',
			'Ignore keyword case and indent noise',
			'Line-level added and removed hunks',
			'Works for SELECT, INSERT, DDL, and scripts',
			'Nothing is uploaded'
		],
		useCases: [
			'See what changed between two versions of a report query',
			'Compare ORM SQL before and after an upgrade',
			'Check that a formatter-only change is whitespace',
			'Review a migration script against last week’s copy'
		],
		concept: {
			title: 'Formatted diff, not EXPLAIN',
			content: `<p>Both sides are pretty-printed with the same dialect and uppercase keywords, then compared line by line. That hides indent-only edits. It does not prove two queries return the same rows. Semantically equal SQL (<code>a = 1 AND b = 2</code> vs the reverse) can still show a diff.</p>`
		},
		examples: [
			{ label: 'Same query, different wrap', code: 'select id from t; vs SELECT id FROM t;', isValid: true },
			{ label: 'Real change', code: 'WHERE active = true vs WHERE active = false', isValid: true }
		],
		faqs: [
			{
				question: 'Why is there no diff after I change spaces?',
				answer: '<p>Both queries are formatted first. Indent and keyword case are normalized on purpose.</p>'
			},
			{
				question: 'Can I diff two files of 10k lines?',
				answer: '<p>The LCS diff is fine for typical queries. Multi-megabyte scripts may freeze the tab. Use <code>git diff</code> locally for those.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print one query' },
			{ name: 'SQL Validator', path: '/sql/validator', description: 'Parse each side first' },
			{ name: 'Text Diff', path: '/text/diff', description: 'Raw string compare' }
		],
		tips: ['If parse fails, fix quotes on that side first. Diff needs both queries to format.']
	},
	joins: {
		features: [
			'Interactive INNER, LEFT, RIGHT, FULL, CROSS, SEMI, and ANTI joins',
			'Fixed sample tables so the result is predictable',
			'Generated SQL you can copy',
			'Venn-style match highlighting',
			'Result grid with NULLs called out',
			'Runs entirely in this tab'
		],
		useCases: [
			'Teach INNER vs LEFT JOIN with a concrete example',
			'Remember why FULL OUTER JOIN needs NULLs on both sides',
			'See NOT EXISTS (anti join) vs LEFT JOIN ... IS NULL',
			'Explain CROSS JOIN row counts before someone ships one'
		],
		concept: {
			title: 'Joins combine row sets',
			content: `<p>A <strong>JOIN</strong> matches rows from two tables. <strong>INNER</strong> keeps matches only. <strong>LEFT</strong> keeps every left row (NULL on the right when nothing matches). <strong>RIGHT</strong> is the mirror. <strong>FULL OUTER</strong> keeps both leftovers. <strong>CROSS</strong> is a cartesian product: no <code>ON</code> clause, row count multiplies.</p>
<p class="mt-2"><strong>SEMI</strong> (EXISTS) returns left rows that have at least one match, once. <strong>ANTI</strong> (NOT EXISTS) returns left rows with no match. MySQL 8 and Postgres 15+ also have matching JOIN syntax in some engines; EXISTS works everywhere.</p>`
		},
		examples: [
			{ label: 'INNER JOIN', code: 'FROM users u INNER JOIN orders o ON o.user_id = u.id', isValid: true },
			{ label: 'Anti join', code: 'FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)', isValid: true }
		],
		faqs: [
			{
				question: 'What is the difference between INNER JOIN and LEFT JOIN?',
				answer: '<p>INNER JOIN drops left rows with no match. LEFT JOIN keeps them and fills right-hand columns with NULL. Toggle the visualizer to see Alice (has orders) vs Bob (none).</p>'
			},
			{
				question: 'Does SQLite support RIGHT and FULL JOIN?',
				answer: '<p>SQLite 3.39+ supports RIGHT and FULL OUTER JOIN. Older builds do not. Rewrite RIGHT as a LEFT with the tables swapped if you need to support old SQLite.</p>'
			},
			{
				question: 'When should I use EXISTS instead of JOIN?',
				answer: '<p>When you only need to know a match exists, not the matching rows. EXISTS (semi join) avoids duplicating the left row per match.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL Explainer', path: '/sql/explainer', description: 'Walk a real query' },
			{ name: 'SQL Cheat Sheet', path: '/sql/cheatsheet', description: 'Join syntax reference' },
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print join SQL' }
		],
		tips: [
			'Filter the right table in ON, not WHERE, if you want a LEFT JOIN to stay a left join. WHERE o.id IS NULL is the anti-join exception.',
			'CROSS JOIN of two large tables is how you lock up a database. Check counts first.'
		]
	},
	like: {
		features: [
			'Test SQL LIKE and ILIKE patterns against one string per line',
			'% matches any sequence, _ matches one character',
			'Optional ESCAPE character for literal % and _',
			'Case-insensitive mode (ILIKE / LOWER)',
			'Live match highlighting',
			'Nothing is uploaded'
		],
		useCases: [
			'Debug why a search box LIKE is matching too much',
			'Check an email domain pattern before shipping it',
			'See the difference between %sql and %.sql',
			'Verify ESCAPE when the user may type % in the search'
		],
		concept: {
			title: 'LIKE is not a regex',
			content: `<p><strong>LIKE</strong> is SQL’s wildcard match. <code>%</code> is “any length”, <code>_</code> is “one character”. It is not POSIX regex: <code>.*</code> is two literal characters plus a wildcard in LIKE, not “everything”.</p>
<p class="mt-2">PostgreSQL <code>ILIKE</code> is case-insensitive LIKE. MySQL LIKE case folding depends on collation. This tester’s insensitive mode always folds case in the browser so the result is predictable.</p>
<p class="mt-2">Use <code>ESCAPE</code> when the pattern itself may contain <code>%</code> or <code>_</code>. Example: <code>LIKE '%10\\%%' ESCAPE '\\'</code> matches text that contains <code>10%</code>.</p>`
		},
		examples: [
			{ label: 'Suffix match', code: '%.sql', isValid: true },
			{ label: 'Single char', code: 'a_c', isValid: true },
			{ label: 'Need escape', code: '100%', isValid: true }
		],
		faqs: [
			{
				question: 'How do I match a literal percent sign?',
				answer: '<p>Set an ESCAPE character (often <code>\\</code>) and write <code>\\%</code> in the pattern. Without ESCAPE, <code>%</code> always means “anything”.</p>'
			},
			{
				question: 'Is LIKE \'%x%\' slow?',
				answer: '<p>A leading wildcard usually cannot use a normal B-tree index. That is an engine concern. This page only tests the match, it does not plan queries.</p>'
			},
			{
				question: 'Does this support SIMILAR TO or regex?',
				answer: '<p>No. Use the <a href="/regex/tester">Regex Tester</a> for POSIX regular expressions.</p>'
			}
		],
		relatedTools: [
			{ name: 'Regex Tester', path: '/regex/tester', description: 'Full regular expressions' },
			{ name: 'SQL Cheat Sheet', path: '/sql/cheatsheet', description: 'LIKE syntax' },
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print the query' }
		],
		tips: [
			'Put user input through ESCAPE or switch to parameterized equality when you do not need wildcards.',
			'TRIM the haystack if your table has trailing spaces and the pattern does not.'
		]
	},
	explainer: {
		features: [
			'Plain-English walkthrough of SELECT, INSERT, UPDATE, DELETE',
			'Calls out FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT',
			'Warns when UPDATE or DELETE has no WHERE',
			'Handles multiple statements separated by semicolons',
			'Leaves string literals untouched so quotes stay honest',
			'Nothing is uploaded'
		],
		useCases: [
			'Read a query you inherited before you change it',
			'Explain a JOIN-heavy report to a teammate',
			'Spot a missing WHERE on DELETE',
			'Document what a scheduled job SQL does'
		],
		concept: {
			title: 'Clause order is not execution order',
			content: `<p>SQL is written <code>SELECT ... FROM ... WHERE ... GROUP BY ...</code>, but engines typically <em>think</em> FROM/JOIN, then WHERE, then GROUP BY, then SELECT. This explainer follows the text you pasted so it matches what you see, and labels each clause.</p>
<p class="mt-2">It is not <code>EXPLAIN ANALYZE</code>. There are no row counts or indexes. Nested subqueries inside parentheses are treated as part of their parent clause.</p>`
		},
		examples: [
			{
				label: 'Filtered select',
				code: 'SELECT id FROM users WHERE active = TRUE ORDER BY id LIMIT 10;',
				isValid: true
			},
			{ label: 'Dangerous delete', code: 'DELETE FROM users;', isValid: true }
		],
		faqs: [
			{
				question: 'Can this replace EXPLAIN?',
				answer: '<p>No. EXPLAIN shows the plan your database picked. This page only names the clauses in the SQL text.</p>'
			},
			{
				question: 'Does it understand window functions?',
				answer: '<p>OVER (...) stays inside the SELECT list. You will see it in the select-list step, not as a separate execution engine.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL JOIN Visualizer', path: '/sql/joins', description: 'See join types' },
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Pretty-print first' },
			{ name: 'SQL Cheat Sheet', path: '/sql/cheatsheet', description: 'Clause reference' }
		],
		tips: [
			'Format the query first if it is one long line. The explainer still works, but you will want the pretty version too.',
			'A DELETE or UPDATE without WHERE is called out on purpose.'
		]
	},
	cheatsheet: {
		features: [
			'Searchable SQL syntax reference',
			'Joins, data types, NULL, dates, strings, windows, indexes',
			'Postgres, MySQL, and SQLite notes where they diverge',
			'Copy any snippet',
			'Runs locally, no account'
		],
		useCases: [
			'Look up FULL OUTER JOIN syntax mid-query',
			'Remember COALESCE vs IFNULL vs ISNULL',
			'Copy a window-function skeleton',
			'Check date truncation names across engines'
		],
		concept: {
			title: 'SQL is a family of dialects',
			content: `<p>The core <code>SELECT FROM WHERE</code> shape is shared. Types, functions, and identifier quotes are not. Postgres <code>ILIKE</code> is MySQL <code>LIKE</code> with a case-insensitive collation. SQLite is typeless compared with the others. When a snippet is engine-specific, the sheet says so.</p>`
		},
		examples: [
			{ label: 'Limit', code: 'SELECT * FROM t ORDER BY id LIMIT 10 OFFSET 20;', isValid: true },
			{ label: 'SQL Server paging', code: 'SELECT * FROM t ORDER BY id OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;', isValid: true }
		],
		faqs: [
			{
				question: 'Is this a full SQL standard reference?',
				answer: '<p>No. It is a practical sheet for the queries people write daily. Use your engine docs for GRANT, replication, and vendor extensions.</p>'
			},
			{
				question: 'Can I run these snippets here?',
				answer: '<p>There is no database in the browser. Copy a snippet into your client, or pretty-print it in the SQL Formatter.</p>'
			}
		],
		relatedTools: [
			{ name: 'SQL JOIN Visualizer', path: '/sql/joins', description: 'Join examples' },
			{ name: 'SQL LIKE Tester', path: '/sql/like', description: 'Try LIKE patterns' },
			{ name: 'SQL Formatter', path: '/sql/formatter', description: 'Beautify a snippet' },
			{ name: 'Regex Cheat Sheet', path: '/regex/cheatsheet', description: 'Regex reference' }
		],
		tips: ['Search for COALESCE, OVER, or RETURNING if you know the keyword but forgot the shape.']
	}
};

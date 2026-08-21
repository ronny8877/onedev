export interface CsvToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const csvToolsContent: Record<string, CsvToolContent> = {
	'to-json': {
		features: [
			'CSV to JSON converter online, free in your browser',
			'Turn Excel CSV exports into a JSON array of objects',
			'Auto-detect comma, semicolon, tab (TSV), or pipe',
			'Quoted commas and line breaks inside cells stay intact',
			'Pretty-printed JSON you can copy or download',
			'UTF-8 BOM from Excel is stripped. Nothing is uploaded'
		],
		useCases: [
			'Convert CSV to JSON for an API mock or Node script',
			'Turn a Google Sheets or Excel download into JSON',
			'Load a CSV fixture into a JavaScript test',
			'Convert European semicolon CSV without changing the file first',
			'See how duplicate headers will look as object keys'
		],
		concept: {
			title: 'How to convert CSV to JSON online',
			content: `<p>A <strong>CSV to JSON converter</strong> turns a spreadsheet (CSV or Excel export) into JSON objects. The first row becomes property names. Each following row becomes one object. Empty cells are empty strings, not <code>null</code>.</p>
<p class="mt-2">Paste CSV, copy JSON. Delimiter detection looks at the first few lines. If it guesses wrong, pick comma, semicolon, tab, or pipe. ZIP codes and IDs stay as text so leading zeros are not lost. Files never leave this tab.</p>`
		},
		examples: [
			{ label: 'Simple table', code: 'id,name\n1,Ada\n2,Grace', isValid: true },
			{ label: 'Quoted comma', code: 'name,city\n"Lovelace, Ada",London', isValid: true },
			{ label: 'Unclosed quote', code: 'name,city\n"Ada,London', isValid: false }
		],
		faqs: [
			{
				question: 'How do I convert CSV to JSON?',
				answer: '<p>Paste your CSV (or Excel export) into this CSV to JSON converter and copy the JSON. Use JSON to CSV Converter for the reverse.</p>'
			},
			{
				question: 'Are numbers converted to JSON numbers?',
				answer: '<p>No. Every cell stays a string so leading zeros (ZIP codes, IDs) are not destroyed. Parse in your app when you know the type.</p>'
			},
			{
				question: 'What if two columns share a header?',
				answer: '<p>JSON objects cannot have duplicate keys. The later column overwrites the earlier one. Rename headers in the viewer first.</p>'
			},
			{
				question: 'Is TSV supported?',
				answer: '<p>Yes. Tabs are detected. You can also use the delimiter converter.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON to CSV', path: '/csv/from-json', description: 'The reverse conversion' },
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'Preview as a table first' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Pretty-print the JSON' }
		],
		tips: [
			'Keep a header row. Headerless CSV becomes column_1, column_2.',
			'For huge files, convert the first N rows locally with a CLI. A tab will run out of RAM before miller or csvkit does.'
		]
	},
	'from-json': {
		features: [
			'JSON to CSV converter online, free in your browser',
			'Turn a JSON array of objects into a CSV you can open in Excel',
			'Union of all keys becomes the header, so sparse objects still align',
			'Choose comma, semicolon, tab, or pipe',
			'Download a .csv file',
			'Nested objects are stored as JSON text in the cell. Nothing is uploaded'
		],
		useCases: [
			'Convert JSON to CSV for Excel or Google Sheets',
			'Export an API response to a spreadsheet',
			'Give a teammate a CSV from a JSON dump',
			'Produce semicolon CSV for locales that use comma as decimal',
			'Round-trip after CSV to JSON'
		],
		concept: {
			title: 'How to convert JSON to CSV (and Excel)',
			content: `<p>A <strong>JSON to CSV converter</strong> walks every object and collects keys in first-seen order. Missing keys become empty cells. Paste a JSON array, pick a delimiter, download CSV, and open it in Excel.</p>
<p class="mt-2">A JSON object that is not an array is rejected because CSV needs a list of rows. Nested objects are stringified into one cell. Flatten first if you need nested fields as columns.</p>`
		},
		examples: [
			{ label: 'Array of objects', code: '[{"id":1,"name":"Ada"}]', isValid: true },
			{ label: 'Sparse keys', code: '[{"a":1},{"b":2}]', isValid: true },
			{ label: 'Not an array', code: '{"id":1}', isValid: false }
		],
		faqs: [
			{
				question: 'How do I convert JSON to CSV for Excel?',
				answer: '<p>Paste a JSON array of objects, pick comma or semicolon, and download the CSV. Excel and Google Sheets open it as a table.</p>'
			},
			{
				question: 'Will nested JSON become extra columns?',
				answer: '<p>No. Nested objects and arrays are stringified in one cell. Flatten first if you need nested fields as columns.</p>'
			},
			{
				question: 'Why UTF-8 without BOM?',
				answer: '<p>It is the web default. Excel on Windows sometimes wants a BOM for umlauts. Add one in an editor if a column looks mojibake.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV to JSON', path: '/csv/to-json', description: 'Convert back' },
			{ name: 'JSON → Table', path: '/json/table', description: 'View JSON as a table' },
			{ name: 'CSV to SQL', path: '/csv/to-sql', description: 'Emit INSERT statements' }
		],
		tips: [
			'If the JSON is an object with a "data" array, extract that array first.',
			'Pick semicolon when the consumer is Excel in a comma-decimal locale.'
		]
	},
	viewer: {
		features: [
			'CSV viewer online: open a CSV file as a table in your browser',
			'View Excel CSV without installing Excel',
			'Auto-detect comma, semicolon, tab, or pipe',
			'Show the first 250 rows so a large paste stays fast',
			'Row and column counts for the full file',
			'Download the normalized CSV. Nothing is uploaded'
		],
		useCases: [
			'Open a CSV online when you do not have Excel',
			'Check whether a delimiter guess looks right',
			'Skim an export before converting to JSON',
			'See empty rows and ragged columns',
			'Confirm quoting survived an email forward'
		],
		concept: {
			title: 'Open a CSV file in your browser',
			content: `<p>A <strong>CSV viewer</strong> shows spreadsheet data as a table without Excel. Paste CSV or a Google Sheets export and scan columns. The whole paste is parsed in memory. The table only draws a cap of rows so the page stays cheap. Counts at the top include every row.</p>`
		},
		examples: [
			{ label: 'Normal table', code: 'a,b\n1,2\n3,4', isValid: true },
			{ label: 'Ragged row', code: 'a,b\n1\n2,3,4', isValid: true },
			{ label: 'Broken quotes', code: 'a,b\n"1,2', isValid: false }
		],
		faqs: [
			{
				question: 'Can I open a CSV file online without Excel?',
				answer: '<p>Yes. This CSV viewer shows the file as a table in your browser. Nothing is uploaded.</p>'
			},
			{
				question: 'Can I edit cells?',
				answer: '<p>This is a viewer. Copy the CSV, edit in a sheet, paste again.</p>'
			},
			{
				question: 'Why only 250 rows on screen?',
				answer: '<p>Rendering tens of thousands of DOM cells is slow. The parse still includes every row for counts and download.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Validator', path: '/csv/validator', description: 'List issues as a report' },
			{ name: 'CSV to JSON', path: '/csv/to-json', description: 'Export objects' },
			{ name: 'Delimiter converter', path: '/csv/delimiter', description: 'Switch comma/tab/semicolon' }
		],
		tips: [
			'If columns look shifted, the delimiter is probably wrong. Try the delimiter tool.',
			'A leading sep=, line from Excel is not a standard header. Remove it.'
		]
	},
	validator: {
		features: [
			'Report unclosed quotes with a line number',
			'Warn on empty headers, duplicate headers, empty rows, and ragged widths',
			'Show delimiter and shape stats',
			'Does not upload the file',
			'Works on TSV and semicolon CSV too'
		],
		useCases: [
			'Gate a CSV before a database import',
			'Explain why a parser stopped at row 4,081',
			'Catch duplicate column names before JSON conversion',
			'Check an Excel export for blank lines at the end',
			'Validate a partner file against basic hygiene, not a full schema'
		],
		concept: {
			title: 'What “valid CSV” means here',
			content: `<p>There is no single CSV spec in the wild, but RFC 4180 plus “every row has the header width” covers most importer failures. We do not type-check cells or enforce required columns. That is schema work for your pipeline.</p>`
		},
		examples: [
			{ label: 'Clean', code: 'id,name\n1,Ada', isValid: true },
			{ label: 'Duplicate header', code: 'id,id\n1,2', isValid: true },
			{ label: 'Unclosed quote', code: 'id,name\n1,"Ada', isValid: false }
		],
		faqs: [
			{
				question: 'Is a ragged row an error?',
				answer: '<p>We treat it as a warning and pad or trim so the table still builds. Some importers will reject it instead.</p>'
			},
			{
				question: 'Do you fetch a schema URL?',
				answer: '<p>No.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'See the rows' },
			{ name: 'CSV Diff', path: '/csv/diff', description: 'Compare two files' }
		],
		tips: [
			'Fix quotes first. Everything else is guesswork if a quote is left open.',
			'Empty last line is normal. Completely empty extra rows are usually an Excel artifact.'
		]
	},
	delimiter: {
		features: [
			'Convert between comma, semicolon, tab (TSV), and pipe',
			'Preserve quoting rules for the target delimiter',
			'Auto-detect the source delimiter',
			'Download with a sensible extension',
			'Local only'
		],
		useCases: [
			'Turn US comma CSV into EU semicolon CSV',
			'Make TSV for a tool that hates commas in text',
			'Convert pipe-delimited legacy dumps',
			'Normalize mixed exports before Git',
			'Prepare a file for psql COPY'
		],
		concept: {
			title: 'Delimiter is not encoding',
			content: `<p>Changing comma to tab does not change UTF-8 vs Latin-1. If names look broken, that is character encoding, not the delimiter. We also will not interpret decimal commas as numbers.</p>`
		},
		examples: [
			{ label: 'Comma to tab', code: 'a,b\n1,2', isValid: true },
			{ label: 'Already TSV', code: 'a\tb\n1\t2', isValid: true }
		],
		faqs: [
			{
				question: 'Will commas inside quotes split?',
				answer: '<p>No. We parse, then re-serialize. Quoted commas stay in the cell.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'Preview after convert' },
			{ name: 'CSV to JSON', path: '/csv/to-json', description: 'Once the delimiter is right' }
		],
		tips: [
			'Excel in many EU locales wants semicolon.',
			'Git diffs are cleaner if the whole repo agrees on one delimiter.'
		]
	},
	'to-xml': {
		features: [
			'Wrap each CSV row as an XML element',
			'Sanitize headers into legal tag names',
			'Choose root and row element names',
			'Escape cell text',
			'Download .xml'
		],
		useCases: [
			'Feed a spreadsheet into a legacy XML importer',
			'Build a simple catalog document from a sheet',
			'Round-trip with XML to CSV',
			'Produce a list the XPath tester can query'
		],
		concept: {
			title: 'Rows become repeating elements',
			content: `<p>CSV has no attributes unless you invent them. Every cell is a child element named after the header. Illegal XML names are rewritten. This is a pragmatic export, not XML Schema.</p>`
		},
		examples: [
			{ label: 'Two rows', code: 'id,name\n1,Ada', isValid: true }
		],
		faqs: [
			{
				question: 'Can headers become attributes?',
				answer: '<p>Not in this tool. Use JSON to XML with @keys if you need attributes.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML to CSV', path: '/xml/to-csv', description: 'Flatten XML lists' },
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Pretty-print the result' }
		],
		tips: ['Pick row names that match the target schema (item, record, book).']
	},
	'to-sql': {
		features: [
			'Generate INSERT statements from CSV',
			'Quote strings, pass through obvious numbers and booleans',
			'Empty cells become NULL',
			'Sanitize table and column identifiers',
			'Copy a script for local Postgres or SQLite'
		],
		useCases: [
			'Seed a local database from a sheet',
			'Build a demo dataset',
			'Move a small export without writing a loader',
			'Show a teammate the column mapping'
		],
		concept: {
			title: 'This is not a migration tool',
			content: `<p>Types are guessed from the cell text. ZIP codes that look like numbers will be emitted unquoted. Identifiers are stripped to ASCII word characters. For production loads use COPY, a proper ETL, or a typed schema.</p>`
		},
		examples: [
			{ label: 'Typical row', code: 'id,name\n1,Ada', isValid: true }
		],
		faqs: [
			{
				question: 'SQL injection?',
				answer: '<p>Values are quoted with doubled single quotes. Still, do not run generated SQL from untrusted CSV on production.</p>'
			},
			{
				question: 'Which dialect?',
				answer: '<p>Generic INSERT. Postgres, SQLite, and MySQL accept this shape for simple seeds.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON to SQL', path: '/sql/from-json', description: 'INSERT from a JSON array' },
			{ name: 'CSV to JSON', path: '/csv/to-json', description: 'Prefer JSON for app seeds' },
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'Check columns first' }
		],
		tips: ['Rename the table to something real before you run it.', 'Leading-zero IDs should stay quoted. Prefix the column or force text in the sheet.']
	},
	'to-markdown': {
		features: [
			'Render CSV as a GitHub-flavored Markdown table',
			'Escape pipes in cells',
			'Copy into README or docs',
			'Delimiter auto-detect'
		],
		useCases: [
			'Paste a small dataset into a pull request',
			'Document fixtures in Markdown',
			'Turn a sheet into a changelog table',
			'Share a comparison without attaching CSV'
		],
		concept: {
			title: 'Markdown tables are small',
			content: `<p>Large CSV makes unreadable Markdown. Use this for tens of rows, not tens of thousands. Newlines in cells become <code>&lt;br&gt;</code> which some renderers honor.</p>`
		},
		examples: [
			{ label: 'Tiny table', code: 'feature,status\nCSV,done', isValid: true }
		],
		faqs: [
			{
				question: 'Does this work on GitHub?',
				answer: '<p>Yes, GFM pipe tables. Alignment colons are not emitted; add them if you care.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'HTML table preview' },
			{ name: 'JSON → Table', path: '/json/table', description: 'Markdown copy from JSON' }
		],
		tips: ['Keep the sample under ~30 rows for a README.']
	},
	diff: {
		features: [
			'Compare two CSVs cell by cell using headers',
			'Flag added and removed rows by index',
			'Ignore delimiter differences if both parse',
			'Show which column changed',
			'Local only'
		],
		useCases: [
			'See what changed between two exports',
			'Review a vendor file against last week',
			'Check a transform did not scramble columns',
			'Diff before and after a cleanup'
		],
		concept: {
			title: 'Row index, not a primary key',
			content: `<p>Rows are compared by position. Inserting a row at the top marks later rows as changed. If you have an id column, sort both files by that id first, or use a dedicated data diff that keys on a column.</p>`
		},
		examples: [
			{ label: 'Value change', code: 'id,n\n1,a vs id,n\n1,b', isValid: true }
		],
		faqs: [
			{
				question: 'Can I key on a column?',
				answer: '<p>Not yet. Sort both CSVs by that column in a sheet, then paste.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'Inspect each side' },
			{ name: 'JSON Diff', path: '/json/diff', description: 'Structural JSON compare' }
		],
		tips: ['Normalize delimiters first so both sides parse the same way.']
	},
	transpose: {
		features: [
			'Swap rows and columns',
			'First row becomes the first column',
			'Keeps the detected delimiter',
			'Useful for “metrics as columns” vs “metrics as rows”'
		],
		useCases: [
			'Flip a wide export into a tall table',
			'Turn a year-as-column sheet into year-as-row',
			'Prepare data for a charting tool that wants the other orientation',
			'Make a matrix readable'
		],
		concept: {
			title: 'Transpose is mechanical',
			content: `<p>Cell (r, c) moves to (c, r). Headers are just the first row of the grid. There is no type inference.</p>`
		},
		examples: [
			{ label: '2x2', code: 'a,b\n1,2', isValid: true }
		],
		faqs: [
			{
				question: 'Will this square a ragged table?',
				answer: '<p>We pad to a rectangle using the parse step, then transpose.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'See it after the flip' },
			{ name: 'Delimiter converter', path: '/csv/delimiter', description: 'Fix delimiter first' }
		],
		tips: ['Preview in the viewer after transpose. Wide tables become long ones.']
	}
};

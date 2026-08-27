// Concise, high-value content for JSON tools
// Reusable across all similar tools

interface ToolContent {
	features: string[];
	useCases: string[];
	concept: {
		title: string;
		content: string; // Brief HTML explanation (200-300 words)
	};
	examples: Array<{
		label: string;
		code: string;
		isValid: boolean;
	}>;
	faqs: Array<{
		question: string;
		answer: string;
	}>;
	relatedTools: Array<{
		name: string;
		path: string;
		description: string;
	}>;
	tips?: string[];
	commonMistakes?: string[];
	howTo?: {
		lede: string[];
		steps: string[];
		breaks: string[];
	};
}

export const jsonToolsContent: Record<string, ToolContent> = {
	formatter: {
		features: [
			'First syntax error reported with a line and column, not a generic "Unexpected token"',
			'Pretty-print or minify after the document actually parses',
			'Indent of 2, 4, or 8 spaces so diffs stay consistent with the repo',
			'Refuses JSONC: comments and trailing commas are errors, not silently stripped',
			'Shows what JSON.parse did with duplicate keys (last write wins)',
			'Flags integers past Number.MAX_SAFE_INTEGER that JS will round'
		],
		useCases: [
			'Find the exact line a minified API body failed to parse',
			'See why a VS Code settings.json (JSONC) is not valid JSON',
			'Catch a duplicate key that overwrote a config value',
			'Check whether a 64-bit id survived JSON.parse as a Number',
			'Pretty-print a payload before a code review without changing values'
		],
		concept: {
			title: 'Pretty-print is not the hard part',
			content: `<p>Pretty-print is not the hard part. The first syntax error is, and JSON will not mention the second one until you fix the first.</p>
<p>Paste the blob. Hit Prettify. If it fails, the line number is the only thing that matters. Minify is for the copy you send, not the copy you read.</p>
<p>Read the first error line. Parsers stop at the first problem: missing comma, trailing comma, single quotes, unquoted keys. Duplicate keys are legal and a footgun. Most engines keep the last one. The formatter will not warn you.</p>
<p>Integers above <code>Number.MAX_SAFE_INTEGER</code> (2⁵³−1) are not safe in JavaScript. <code>9007199254740993</code> comes back as <code>9007199254740992</code>. Keep big IDs as strings. Comments are not JSON. JSONC (<code>//</code>, <code>/* */</code>) fails here. Strip comments first. Indent 2 for JS/TS unless the repo already uses 4. Minify does not change meaning, only bytes.</p>`
		},
		examples: [
			{
				label: 'Valid object (will pretty-print)',
				code: '{"id":"usr_01","ok":true,"n":42}',
				isValid: true
			},
			{
				label: 'Trailing comma (JSONC, not JSON)',
				code: `{
  "items": [1, 2, 3,],
}`,
				isValid: false
			},
			{
				label: 'JSONC comment (will not parse)',
				code: `{
  // feature flag
  "enabled": true
}`,
				isValid: false
			},
			{
				label: 'Duplicate key: last write wins',
				code: `{
  "port": 3000,
  "port": 8080
}`,
				isValid: true
			},
			{
				label: 'Unsafe integer (precision lost in JS)',
				code: `{
  "snowflake": 12345678901234567890
}`,
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why do I only see the first error?',
				answer: '<p>Pretty-print is not the hard part. The first syntax error is, and JSON will not mention the second one until you fix the first. Read the first error line. Parsers stop at the first problem: missing comma, trailing comma, single quotes, unquoted keys.</p>'
			},
			{
				question: 'Will the formatter warn me about duplicate keys?',
				answer: '<p>Duplicate keys are legal and a footgun. Most engines keep the last one. The formatter will not warn you.</p>'
			},
			{
				question: 'Why did a large integer change after Prettify?',
				answer: '<p>Integers above <code>Number.MAX_SAFE_INTEGER</code> (2⁵³−1) are not safe in JavaScript. <code>9007199254740993</code> comes back as <code>9007199254740992</code>. Keep big IDs as strings.</p>'
			},
			{
				question: 'Why do comments and trailing commas fail?',
				answer: '<p>Comments are not JSON. JSONC (<code>//</code>, <code>/* */</code>) fails here. Strip comments first. Trailing commas from JS objects fail. So do single quotes. <code>undefined</code> and <code>NaN</code> are not JSON. You get Unexpected token.</p>'
			},
			{
				question: 'Does minify change the meaning? Is pretty JSON valid for my API?',
				answer: '<p>Indent 2 for JS/TS unless the repo already uses 4. Minify does not change meaning, only bytes. A pretty document can still be the wrong shape for your API. This is syntax, not schema.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Validator', path: '/json/validator', description: 'Same parse errors without rewriting whitespace' },
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'JWT payloads are JSON objects with the same parse rules' },
			{ name: 'YAML to JSON', path: '/yaml/to-json', description: 'YAML is not JSON: Norway NO and comments fail differently' }
		],
		commonMistakes: [
			'Trailing commas from JS objects fail. So do single quotes.',
			'`undefined` and `NaN` are not JSON. You get Unexpected token.',
			'A pretty document can still be the wrong shape for your API. This is syntax, not schema.'
		],
		howTo: {
			lede: [
				'Paste the blob. Hit Prettify. If it fails, the line number is the only thing that matters. Minify is for the copy you send, not the copy you read.'
			],
			steps: [
				'Read the first error line. Parsers stop at the first problem: missing comma, trailing comma, single quotes, unquoted keys.',
				'Duplicate keys are legal and a footgun. Most engines keep the last one. The formatter will not warn you.',
				'Integers above `Number.MAX_SAFE_INTEGER` (2⁵³−1) are not safe in JavaScript. `9007199254740993` comes back as `9007199254740992`. Keep big IDs as strings.',
				'Comments are not JSON. JSONC (`//`, `/* */`) fails here. Strip comments first.',
				'Indent 2 for JS/TS unless the repo already uses 4. Minify does not change meaning, only bytes.'
			],
			breaks: [
				'Trailing commas from JS objects fail. So do single quotes.',
				'`undefined` and `NaN` are not JSON. You get Unexpected token.',
				'A pretty document can still be the wrong shape for your API. This is syntax, not schema.'
			]
		}
	},
	
	validator: {
		features: [
			'Real-time JSON syntax validation',
			'Line and column error reporting',
			'Instant feedback as you type',
			'Clear error messages with explanations',
			'Character and line count statistics',
			'Load sample invalid JSON for testing'
		],
		useCases: [
			'Validate JSON before saving to database',
			'Check API request/response validity',
			'Verify configuration file syntax',
			'Debug JSON parsing errors',
			'Ensure data integrity before deployment'
		],
		concept: {
			title: 'Understanding JSON Validation',
			content: `
				<p><strong>JSON validation</strong> ensures your data follows the correct syntax rules. Invalid JSON will cause parsing errors in applications, APIs, and databases.</p>
				
				<p><strong>Common validation checks:</strong></p>
				<ul>
					<li><strong>Syntax</strong> - Proper use of brackets, braces, commas, and quotes</li>
					<li><strong>Data types</strong> - Strings, numbers, booleans, arrays, objects, null</li>
					<li><strong>Structure</strong> - Balanced opening/closing brackets and braces</li>
					<li><strong>Encoding</strong> - Proper UTF-8 character encoding</li>
				</ul>
				
				<p>Our validator provides precise error locations (line and column numbers) to help you fix issues quickly.</p>
			`
		},
		examples: [
			{
				label: 'Valid JSON structure',
				code: `{
  "user": {
    "id": 12345,
    "active": true
  }
}`,
				isValid: true
			},
			{
				label: 'Missing comma between properties',
				code: `{
  "name": "John"
  "email": "john@example.com"
}`,
				isValid: false
			},
			{
				label: 'Unquoted property name',
				code: `{
  name: "John Doe"
}`,
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What makes JSON invalid?',
				answer: '<p>Common issues: missing/extra commas, unquoted keys, single quotes, trailing commas, unescaped characters, or unbalanced brackets.</p>'
			},
			{
				question: 'Can I validate JSON from a file?',
				answer: '<p>Yes, copy and paste your file contents into the validator. The tool works entirely in your browser.</p>'
			},
			{
				question: 'What does "Unexpected token" mean?',
				answer: '<p>It means the parser found a character it didn\'t expect. Check the line number - often it\'s a missing comma or quote.</p>'
			},
			{
				question: 'Why does valid-looking JSON fail?',
				answer: '<p>Check for: trailing commas, single quotes, unquoted keys, or comments (not allowed in standard JSON).</p>'
			},
			{
				question: 'Is the validation instant?',
				answer: '<p>Yes! Validation happens as you type with a small delay to avoid performance issues during fast typing.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format and beautify your JSON' },
			{ name: 'JSONPath Tester', path: '/json/path-tester', description: 'Query JSON with JSONPath expressions' },
			{ name: 'JSON Diff', path: '/json/diff', description: 'Compare two JSON documents' }
		]
	},

	diff: {
		features: [
			'Side-by-side and inline diff views',
			'Structural JSON comparison',
			'Highlights added, removed, and changed values',
			'Ignore key order option',
			'Auto-comparison on input',
			'Clear visual indicators for differences'
		],
		useCases: [
			'Compare API responses before/after changes',
			'Track configuration file changes',
			'Verify data transformations',
			'Debug data synchronization issues',
			'Review JSON updates before deployment'
		],
		concept: {
			title: 'Understanding JSON Diff',
			content: `
				<p><strong>JSON diff</strong> compares two JSON objects to find structural differences. Unlike text diff, it understands JSON structure and can ignore key ordering.</p>
				
				<p><strong>Types of changes detected:</strong></p>
				<ul>
					<li><strong>Added</strong> - New properties or array elements</li>
					<li><strong>Removed</strong> - Deleted properties or elements</li>
					<li><strong>Changed</strong> - Modified values (shows old → new)</li>
					<li><strong>Type changes</strong> - Same key, different data type</li>
				</ul>
				
				<p><strong>Key order:</strong> You can choose to ignore key order when comparing objects, treating <code>{"a":1,"b":2}</code> as identical to <code>{"b":2,"a":1}</code>.</p>
			`
		},
		examples: [
			{
				label: 'Identical objects',
				code: `Left:  {"name": "John", "age": 30}
Right: {"name": "John", "age": 30}
Result: No differences`,
				isValid: true
			},
			{
				label: 'Changed value',
				code: `Left:  {"version": "1.0.0"}
Right: {"version": "2.0.0"}
Result: version changed from "1.0.0" to "2.0.0"`,
				isValid: false
			},
			{
				label: 'Added property',
				code: `Left:  {"name": "John"}
Right: {"name": "John", "email": "john@example.com"}
Result: email added`,
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What does "ignore key order" do?',
				answer: '<p>It treats objects with the same keys but different order as identical. Example: <code>{"a":1,"b":2}</code> equals <code>{"b":2,"a":1}</code>.</p>'
			},
			{
				question: 'Can I compare large JSON files?',
				answer: '<p>Yes, but very large files may take longer to compare. For files over 5MB, consider using a desktop diff tool.</p>'
			},
			{
				question: 'What\'s the difference between side-by-side and inline?',
				answer: '<p>Side-by-side shows old and new values next to each other. Inline stacks them vertically with +/- indicators.</p>'
			},
			{
				question: 'Does it work with nested objects?',
				answer: '<p>Yes! It recursively compares nested objects and arrays, showing the full path to each difference.</p>'
			},
			{
				question: 'Can I export the diff results?',
				answer: '<p>You can copy the visual diff displayed on screen. For programmatic use, consider using a JSON diff library in your code.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Validator', path: '/json/validator', description: 'Validate JSON before comparing' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format JSON for easier comparison' },
			{ name: 'JSON Visualizer', path: '/json/visualizer', description: 'Visualize JSON differences' }
		]
	},

	table: {
		features: [
			'Convert JSON arrays to sortable tables',
			'Search and filter table data',
			'Export to CSV format',
			'Copy as markdown table',
			'Handle nested objects',
			'Responsive table layout'
		],
		useCases: [
			'Visualize JSON API responses as tables',
			'Export JSON data to spreadsheets',
			'Create markdown tables for documentation',
			'Analyze array data quickly',
			'Share readable data with non-developers'
		],
		concept: {
			title: 'Understanding JSON to Table Conversion',
			content: `
				<p><strong>JSON to table conversion</strong> transforms JSON arrays into tabular format for easier viewing and analysis.</p>
				
				<p><strong>How it works:</strong></p>
				<ul>
					<li><strong>Arrays of objects</strong> - Each object becomes a table row, keys become column headers</li>
					<li><strong>Nested objects</strong> - Flattened using dot notation (e.g., <code>user.name</code>)</li>
					<li><strong>Arrays in values</strong> - Displayed as comma-separated values or JSON strings</li>
					<li><strong>Mixed types</strong> - All values converted to strings for display</li>
				</ul>
				
				<p><strong>Export options:</strong> Export to CSV for Excel/Google Sheets, or copy as markdown for documentation.</p>
			`
		},
		examples: [
			{
				label: 'Simple array of objects',
				code: `[
  {"name": "Alice", "age": 30},
  {"name": "Bob", "age": 25}
]
→ Table with columns: name, age`,
				isValid: true
			},
			{
				label: 'Nested object flattening',
				code: `[
  {"user": {"name": "Alice", "id": 1}}
]
→ Column: user.name, user.id`,
				isValid: true
			},
			{
				label: 'Not an array (invalid)',
				code: `{"name": "Alice", "age": 30}
→ Error: Input must be an array`,
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What JSON format works best?',
				answer: '<p>An array of objects where each object has the same keys. Example: <code>[{"name":"Alice","age":30},{"name":"Bob","age":25}]</code>.</p>'
			},
			{
				question: 'Can I convert nested JSON?',
				answer: '<p>Yes! Nested objects are flattened using dot notation (e.g., <code>user.name</code>, <code>address.city</code>).</p>'
			},
			{
				question: 'How do I export to Excel?',
				answer: '<p>Click "Export to CSV" and open the downloaded file in Excel or Google Sheets.</p>'
			},
			{
				question: 'What if objects have different keys?',
				answer: '<p>All keys from all objects become columns. Missing values show as empty cells.</p>'
			},
			{
				question: 'Can I sort the table?',
				answer: '<p>Yes, click on any column header to sort by that column (ascending/descending).</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Visualizer', path: '/json/visualizer', description: 'Visualize JSON in tree structure' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format JSON data' },
			{ name: 'Type Generator', path: '/json/type-generator', description: 'Generate TypeScript types from JSON' }
		]
	},

	visualizer: {
		features: [
			'Interactive tree view of JSON structure',
			'Expand/collapse nodes',
			'Search within JSON',
			'Copy node paths',
			'Show data types and array indices',
			'Navigate complex nested data easily'
		],
		useCases: [
			'Explore deeply nested JSON structures',
			'Find specific keys in large JSON files',
			'Understand API response structure',
			'Debug complex configuration files',
			'Extract JSONPath expressions'
		],
		concept: {
			title: 'Understanding JSON Tree Visualization',
			content: `
				<p><strong>JSON tree visualization</strong> displays JSON as an interactive, expandable tree structure, making complex nested data easier to explore.</p>
				
				<p><strong>Benefits:</strong></p>
				<ul>
					<li><strong>Visual hierarchy</strong> - See parent-child relationships at a glance</li>
					<li><strong>Selective expansion</strong> - Collapse sections you don't need to see</li>
					<li><strong>Type indicators</strong> - Icons show whether a value is object, array, string, number, etc.</li>
					<li><strong>Path copying</strong> - Get JSONPath or dot notation for any node</li>
				</ul>
				
				<p>Perfect for understanding large API responses or config files with hundreds of nested properties.</p>
			`
		},
		examples: [
			{
				label: 'Nested structure visualization',
				code: `{
  "user": {
    "profile": {
      "name": "Alice",
      "contacts": ["email", "phone"]
    }
  }
}
→ Tree with expand/collapse controls`,
				isValid: true
			},
			{
				label: 'Array with objects',
				code: `{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ]
}
→ Shows array indices: users[0], users[1]`,
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How do I navigate large JSON files?',
				answer: '<p>Use the search box to find specific keys or values. Click nodes to expand/collapse sections and focus on what you need.</p>'
			},
			{
				question: 'Can I copy a specific value?',
				answer: '<p>Yes! Click on any node to see options like "Copy Value" or "Copy Path".</p>'
			},
			{
				question: 'What\'s the difference from the formatter?',
				answer: '<p>The formatter shows raw JSON text. The visualizer shows an interactive tree you can click through and explore.</p>'
			},
			{
				question: 'Can I edit values in the tree?',
				answer: '<p>No, the visualizer is read-only. Use the formatter tool if you need to edit JSON.</p>'
			},
			{
				question: 'Does it show data types?',
				answer: '<p>Yes! Each value has an icon/color indicating its type: string, number, boolean, array, object, or null.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format and beautify your JSON' },
			{ name: 'JSON to Table', path: '/json/table', description: 'Convert JSON to table format' },
			{ name: 'JSONPath Tester', path: '/json/path-tester', description: 'Test JSONPath queries' }
		]
	},

	'type-generator': {
		features: [
			'Generate TypeScript interfaces from JSON',
			'Generate Go structs from JSON',
			'Handles nested objects and arrays',
			'Optional fields detection',
			'Copy generated code instantly',
			'Supports complex types'
		],
		useCases: [
			'Create TypeScript types from API responses',
			'Generate Go structs for JSON unmarshaling',
			'Speed up type-safe development',
			'Document API data structures',
			'Ensure type safety in projects'
		],
		concept: {
			title: 'Understanding Type Generation',
			content: `
				<p><strong>Type generation</strong> automatically creates type definitions (TypeScript interfaces or Go structs) from JSON examples.</p>
				
				<p><strong>How it works:</strong></p>
				<ul>
					<li><strong>Inference</strong> - Analyzes JSON structure to determine types</li>
					<li><strong>Nested types</strong> - Creates separate interfaces for nested objects</li>
					<li><strong>Arrays</strong> - Detects array element types</li>
					<li><strong>Naming</strong> - Generates meaningful type names from keys</li>
				</ul>
				
				<p><strong>Type safety:</strong> Having proper types helps catch bugs at compile-time, enables autocomplete in IDEs, and makes code more maintainable.</p>
			`
		},
		examples: [
			{
				label: 'Simple object to TypeScript',
				code: `Input: {"name": "Alice", "age": 30}

Output:
interface Root {
  name: string;
  age: number;
}`,
				isValid: true
			},
			{
				label: 'Nested object',
				code: `Input: {"user": {"name": "Alice"}}

Output:
interface User {
  name: string;
}
interface Root {
  user: User;
}`,
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can it handle optional fields?',
				answer: '<p>The tool generates types based on the provided JSON. For optional fields, you may need to manually add <code>?</code> in TypeScript.</p>'
			},
			{
				question: 'What if I have arrays of different types?',
				answer: '<p>It will generate a union type (TypeScript) or use <code>interface{}</code> (Go) for mixed-type arrays.</p>'
			},
			{
				question: 'Can I customize type names?',
				answer: '<p>Generated names are based on property keys. You can copy the output and rename types as needed in your code.</p>'
			},
			{
				question: 'Does it support null values?',
				answer: '<p>Yes! Null values are typed as <code>null</code> in TypeScript or <code>*Type</code> (pointer) in Go.</p>'
			},
			{
				question: 'What about deeply nested JSON?',
				answer: '<p>The generator recursively creates types for all nested levels, creating intuitive type hierarchies.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Validator', path: '/json/validator', description: 'Validate JSON syntax' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format data for types' },
			{ name: 'JSON Visualizer', path: '/json/visualizer', description: 'Visualize complex structures' }
		]
	},

	'path-tester': {
		features: [
			'Test JSONPath expressions in real-time',
			'See matched values instantly',
			'Syntax highlighting for queries',
			'Common pattern examples',
			'Export results as JSON or array',
			'Error messages for invalid paths'
		],
		useCases: [
			'Extract specific values from complex JSON',
			'Test API query selectors',
			'Build data extraction pipelines',
			'Filter large JSON datasets',
			'Learn JSONPath syntax'
		],
		concept: {
			title: 'Understanding JSONPath',
			content: `
				<p><strong>JSONPath</strong> is a query language for JSON, similar to XPath for XML. It lets you extract specific values from JSON using path expressions.</p>
				
				<p><strong>Common syntax:</strong></p>
				<ul>
					<li><code>$</code> - Root element</li>
					<li><code>.property</code> - Access object property</li>
					<li><code>[index]</code> - Access array element</li>
					<li><code>[*]</code> - All array elements</li>
					<li><code>..</code> - Recursive descent (search all levels)</li>
					<li><code>[?(@.price &lt; 10)]</code> - Filter expression</li>
				</ul>
				
				<p>Example: <code>$.users[*].name</code> gets all user names from an array.</p>
			`
		},
		examples: [
			{
				label: 'Basic property access',
				code: `JSON: {"user": {"name": "Alice"}}
Path: $.user.name
Result: "Alice"`,
				isValid: true
			},
			{
				label: 'Array access',
				code: `JSON: {"users": [{"name": "Alice"}, {"name": "Bob"}]}
Path: $.users[*].name
Result: ["Alice", "Bob"]`,
				isValid: true
			},
			{
				label: 'Invalid path',
				code: `JSON: {"name": "Alice"}
Path: $.invalid
Result: null (path not found)`,
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What is $.users[*].name syntax?',
				answer: '<p><code>$</code> is root, <code>users</code> is the array, <code>[*]</code> selects all elements, <code>.name</code> gets the name property from each.</p>'
			},
			{
				question: 'How do I filter by value?',
				answer: '<p>Use filter expressions: <code>$.items[?(@.price &lt; 100)]</code> finds items with price less than 100.</p>'
			},
			{
				question: 'Can I search recursively?',
				answer: '<p>Yes! Use <code>..</code> for recursive descent: <code>$..name</code> finds all "name" properties at any level.</p>'
			},
			{
				question: 'What if the path doesn\'t exist?',
				answer: '<p>You\'ll get an empty result or null, depending on the query. Check your JSON structure and path syntax.</p>'
			},
			{
				question: 'Can I use it with APIs?',
				answer: '<p>Yes! Test your queries here, then use JSONPath libraries in your code to extract data from API responses.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Validator', path: '/json/validator', description: 'Validate JSON before querying' },
			{ name: 'JSON Visualizer', path: '/json/visualizer', description: 'Visualize JSON structure' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format JSON for readability' }
		]
	},

	relationship: {
		features: [
			'Interactive node-graph visualization of JSON structure',
			'Split-pane layout with live JSON editor and visual canvas',
			"Copy any node's JSON to clipboard with one click",
			'Collapsible editor panel for full-screen visualization',
			'Pan and zoom with mouse drag and scroll wheel',
			'Auto-fit graph to screen with smart zoom',
			'Color-coded nodes: indigo for objects, green for arrays',
			'Bezier curve connections with labeled relationship keys'
		],
		useCases: [
			'Understand complex API response structures at a glance',
			'Map relationships between entities in JSON data',
			'Visualize nested configuration files and their hierarchy',
			'Explore database export schemas with parent-child connections',
			'Document data models by visualizing JSON examples',
			'Debug deeply nested JSON payloads from microservices'
		],
		concept: {
			title: 'Understanding JSON Relationships',
			content: `
				<p><strong>JSON relationship visualization</strong> represents JSON data as a graph of interconnected nodes, making it easy to see how objects and arrays relate to each other.</p>
				
				<p><strong>How it works:</strong></p>
				<ul>
					<li><strong>Objects</strong> become nodes with their primitive properties listed inside</li>
					<li><strong>Arrays</strong> become nodes with child connections to each element</li>
					<li><strong>Nested structures</strong> are shown as parent→child connections with labeled edges</li>
					<li><strong>Primitives</strong> (strings, numbers, booleans) are displayed as properties within their parent node</li>
				</ul>
				
				<p><strong>Why use a node graph?</strong> Unlike tree views that expand vertically, a node graph shows the entire structure spatially—revealing patterns, depth, and branching that are hard to see in raw JSON text.</p>
			`
		},
		examples: [
			{
				label: 'Simple nested object',
				code: `{
  "user": {
    "name": "Alice",
    "address": { "city": "NYC", "zip": "10001" }
  }
}
→ 3 nodes: root → user → address`,
				isValid: true
			},
			{
				label: 'Array of objects',
				code: `{
  "users": [
    { "name": "Alice", "role": "admin" },
    { "name": "Bob", "role": "editor" }
  ]
}
→ root → users (array) → [0], [1]`,
				isValid: true
			},
			{
				label: 'Deeply nested config',
				code: `{
  "server": {
    "database": {
      "primary": { "host": "db1.example.com" },
      "replica": { "host": "db2.example.com" }
    }
  }
}
→ 5 nodes showing server hierarchy`,
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How is this different from the JSON Visualizer?',
				answer: "<p>The <strong>JSON Visualizer</strong> shows a vertical tree view with expand/collapse controls—great for browsing. The <strong>Relationship Visualizer</strong> shows a spatial node graph with connections, giving you a bird's-eye view of the entire structure and its relationships.</p>"
			},
			{
				question: "Can I copy a specific node's JSON?",
				answer: "<p>Yes! Every node has a copy button in its header. Clicking it copies that node's complete JSON (including all children) to your clipboard, formatted with 2-space indentation.</p>"
			},
			{
				question: 'How do I navigate large JSON structures?',
				answer: '<p>Use <strong>pan</strong> (click and drag) and <strong>zoom</strong> (scroll wheel or ± buttons) to navigate. Click the <strong>fit-to-screen</strong> button to auto-center and zoom to fit the entire graph.</p>'
			},
			{
				question: 'Is there a limit on JSON size?',
				answer: '<p>For best performance, arrays are limited to 6 visible child nodes, and objects show up to 14 properties. Truncated items show a "… N more" indicator. Very large JSON (1000+ nodes) may affect browser performance.</p>'
			},
			{
				question: 'Can I hide the editor to see only the visualization?',
				answer: '<p>Yes! Click the <strong>"Hide Editor"</strong> button to collapse the editor panel. The visualization expands to fill the full width. Click <strong>"Show Editor"</strong> to bring it back.</p>'
			},
			{
				question: 'What do the node colors mean?',
				answer: '<p><strong>Indigo/purple</strong> headers indicate objects (key-value pairs), while <strong>green</strong> headers indicate arrays (ordered lists). Property values inside nodes are color-coded by type: green for strings, amber for numbers, blue for booleans, purple for null.</p>'
			},
			{
				question: 'Is my data safe?',
				answer: '<p>Absolutely. Everything runs 100% client-side in your browser. No data is ever sent to any server.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Visualizer', path: '/json/visualizer', description: 'Explore JSON with an interactive tree view' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format and beautify JSON data' },
			{ name: 'JSON Diff', path: '/json/diff', description: 'Compare two JSON documents side by side' },
			{ name: 'Type Generator', path: '/json/type-generator', description: 'Generate TypeScript interfaces from JSON' }
		]
	}
};

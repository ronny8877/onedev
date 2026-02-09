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
}

export const jsonToolsContent: Record<string, ToolContent> = {
	formatter: {
		features: [
			'Instant JSON formatting with syntax validation',
			'Customizable indentation (2, 4, or 8 spaces)',
			'One-click minification for production',
			'Real-time error detection with line numbers',
			'Copy formatted output instantly',
			'Swap input/output for easy re-formatting'
		],
		useCases: [
			'Format minified API responses for debugging',
			'Beautify compressed JSON config files',
			'Prepare JSON for code reviews',
			'Validate JSON syntax before deployment',
			'Reduce file size with minification'
		],
		concept: {
			title: 'Understanding JSON Formatting',
			content: `
				<p><strong>JSON (JavaScript Object Notation)</strong> is a lightweight data format that's human-readable and machine-parseable. JSON formatting adds whitespace and indentation to make the structure visible.</p>
				
				<p><strong>Why format JSON?</strong></p>
				<ul>
					<li><strong>Debugging</strong> - See the structure of API responses clearly</li>
					<li><strong>Readability</strong> - Understand nested objects and arrays</li>
					<li><strong>Validation</strong> - Spot syntax errors like missing commas or brackets</li>
					<li><strong>Development</strong> - Work with configuration files more easily</li>
				</ul>
				
				<p><strong>Minified vs Formatted:</strong> Minified JSON removes whitespace for smaller file size (production), while formatted JSON adds indentation for readability (development).</p>
			`
		},
		examples: [
			{
				label: 'Valid JSON',
				code: `{
  "name": "John Doe",
  "age": 30,
  "active": true
}`,
				isValid: true
			},
			{
				label: 'Missing comma',
				code: `{
  "name": "John"
  "age": 30
}`,
				isValid: false
			},
			{
				label: 'Trailing comma',
				code: `{
  "items": [1, 2, 3,]
}`,
				isValid: false
			},
			{
				label: 'Single quotes',
				code: `{'name': 'John'}`,
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What is the difference between formatting and validation?',
				answer: '<p>Formatting adds indentation for readability, while validation checks syntax correctness. Our tool does both simultaneously.</p>'
			},
			{
				question: 'Should I use 2 or 4 spaces for indentation?',
				answer: '<p>Use <strong>2 spaces</strong> for JavaScript/TypeScript projects and <strong>4 spaces</strong> for Python/Java. Consistency within your project matters most.</p>'
			},
			{
				question: 'Does minifying affect functionality?',
				answer: '<p>No, minified and formatted JSON are functionally identical. Minifying only removes whitespace to reduce file size.</p>'
			},
			{
				question: 'Can JSON have comments?',
				answer: '<p>Standard JSON does not support comments. Some parsers accept JSONC (JSON with Comments), but it\'s not part of the official spec.</p>'
			},
			{
				question: 'Why does my JSON show errors?',
				answer: '<p>Common causes: missing commas, trailing commas, single quotes instead of double quotes, or unescaped special characters. Check the line number in the error message.</p>'
			},
			{
				question: 'Is my data safe?',
				answer: '<p>Yes! Everything runs in your browser - no data is sent to servers. Completely safe for sensitive information.</p>'
			},
			{
				question: 'How do I fix "Unexpected token" errors?',
				answer: '<p>Check for syntax issues at the error line: missing commas, extra commas, incorrect quotes, or NaN/undefined values.</p>'
			},
			{
				question: 'Can I format large JSON files?',
				answer: '<p>Yes, though very large files (10MB+) may take a moment. For huge files, consider a desktop JSON editor.</p>'
			}
		]
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
		]
	}
};

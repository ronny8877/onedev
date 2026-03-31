
export interface YamlToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const yamlToolsContent: Record<string, YamlToolContent> = {
	formatter: {
		features: [
			'Format and pretty-print YAML with configurable indentation (2 or 4 spaces)',
			'Remove redundant quotes and normalize boolean values',
			'Sort keys alphabetically (optional)',
			'Syntax error detection with line/column reporting',
			'Side-by-side before/after comparison',
			'Copy formatted output to clipboard with one click',
		],
		useCases: [
			'Clean up auto-generated or minified YAML from CI/CD pipelines',
			'Standardize indentation across team configuration files',
			'Pre-process YAML before committing to a repository',
			'Format Kubernetes manifests and Helm values files for readability',
			'Normalize whitespace and quoting style in Ansible playbooks',
		],
		concept: {
			title: 'What is YAML?',
			content: `<p><strong>YAML</strong> (YAML Ain't Markup Language) is a human-friendly data serialization format widely used for configuration files. Its key strength is readability — indentation defines structure, and documents are written in plain text without angle brackets or braces.</p>
<p class="mt-2">Well-formatted YAML is essential: a single wrong indent can cause a parse error or, worse, silent mis-configuration. Consistent formatting across a team prevents merge conflicts and makes code reviews easier.</p>
<p class="mt-2">YAML is a superset of JSON, meaning any valid JSON is also valid YAML. It supports scalars (strings, numbers, booleans, null), sequences (lists), and mappings (key-value objects) as its core data types.</p>`,
		},
		examples: [
			{ label: 'Unformatted (messy indent)', code: 'server:\n  host: localhost\n    port: 8080\n  debug:  true', isValid: false },
			{ label: 'Formatted (2-space indent)', code: 'server:\n  host: localhost\n  port: 8080\n  debug: true', isValid: true },
			{ label: 'Multi-document YAML', code: '---\nname: app-v1\n---\nname: app-v2', isValid: true },
		],
		faqs: [
			{
				question: 'Why does indentation matter so much in YAML?',
				answer: '<p>YAML uses indentation to represent nesting — unlike JSON which uses braces. A wrong level of indentation changes the structure of your data. For example, moving a key one level deeper makes it a child of the previous key instead of a sibling. This is often the root cause of "unexpected token" errors in Kubernetes or Docker Compose files.</p>',
			},
			{
				question: 'Tabs or spaces in YAML?',
				answer: '<p>YAML <strong>forbids tab characters for indentation</strong>. You must use spaces. Mixing tabs and spaces is a guaranteed parse error. Most editors have an option to convert tabs to spaces automatically — enable it for YAML files.</p>',
			},
			{
				question: 'Should I use 2 or 4 spaces?',
				answer: '<p>YAML itself does not mandate a specific number — any consistent number works. However, <strong>2 spaces</strong> is the dominant convention (used by Kubernetes, GitHub Actions, Docker Compose, Ansible). Use 4 spaces only if your team or tooling requires it.</p>',
			},
			{
				question: 'What does the --- separator do?',
				answer: '<p>The <code>---</code> marker denotes the start of a new YAML document within a single file. Some tools (like Kubernetes) support multi-document YAML files where different resources are separated by <code>---</code>. The <code>...</code> marker denotes end-of-document.</p>',
			},
			{
				question: 'Can I have comments in YAML?',
				answer: '<p>Yes! YAML supports single-line comments starting with <code>#</code>. Unlike JSON, comments are preserved when editing manually. However, most parsers discard comments when loading YAML into memory, so they are lost during programmatic round-trips (parse → serialize).</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Linter', path: '/yaml/linter', description: 'Check YAML for style issues' },
			{ name: 'YAML Validator', path: '/yaml/validator', description: 'Validate YAML syntax' },
			{ name: 'YAML Diff', path: '/yaml/diff', description: 'Compare two YAML files' },
			{ name: 'YAML Sorter', path: '/yaml/sorter', description: 'Sort YAML keys alphabetically' },
			{ name: 'YAML to JSON', path: '/yaml/to-json', description: 'Convert YAML to JSON' },
		],
		tips: [
			'Enable "format on save" in your editor for YAML files — it prevents accidental indent drift over time.',
			'Use consistent quoting: either always quote strings or never quote them (except when necessary for special characters).',
			'Run the formatter as a pre-commit hook (e.g., via <code>prettier --write</code> or <code>yamlfmt</code>) to enforce consistency automatically.',
			'Avoid trailing whitespace — it can cause issues with some parsers and adds noise to diffs.',
		],
	},

	linter: {
		features: [
			'Detect YAML syntax errors with precise line and column numbers',
			'Style checks: key ordering, trailing spaces, line length, quote consistency',
			'Best-practice warnings: duplicate keys, implicit null values, ambiguous booleans',
			'Configurable rule severity (error, warning, info)',
			'Real-time feedback as you type',
			'Rule explanation with examples for each violation',
		],
		useCases: [
			'Catch configuration errors before deploying to production',
			'Enforce coding standards across a team\'s YAML files',
			'Audit third-party YAML files for unexpected patterns',
			'Integrate lint checks into CI/CD pipelines',
			'Learn YAML best practices through interactive feedback',
		],
		concept: {
			title: 'YAML Linting',
			content: `<p><strong>Linting</strong> is static analysis that checks code for potential errors and style violations without running it. For YAML, this is especially valuable because:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>Syntax errors</strong> are caught immediately — wrong indentation, unclosed quotes, duplicate keys</li>
  <li><strong>Semantic warnings</strong> flag ambiguous values like <code>yes</code>/<code>no</code> (treated as booleans in YAML 1.1 but not YAML 1.2)</li>
  <li><strong>Style consistency</strong> ensures everyone on the team writes YAML the same way</li>
</ul>
<p class="mt-2">A linter is stricter than a validator: a validator only checks if the YAML parses; a linter also checks if it follows best practices.</p>`,
		},
		examples: [
			{ label: 'Duplicate key (error)', code: 'host: localhost\nhost: 127.0.0.1', isValid: false },
			{ label: 'Ambiguous boolean (warning)', code: 'enabled: yes  # "yes" is a bool in YAML 1.1', isValid: false },
			{ label: 'Clean YAML', code: 'host: localhost\nport: 8080\nenabled: true', isValid: true },
		],
		faqs: [
			{
				question: 'What is the difference between YAML 1.1 and 1.2?',
				answer: '<p>YAML 1.1 (used by most older parsers including PyYAML) treats <code>yes</code>, <code>no</code>, <code>on</code>, <code>off</code>, <code>true</code>, <code>false</code> as booleans. YAML 1.2 (stricter, used by newer tools) only recognizes <code>true</code> and <code>false</code>. This means a key with value <code>yes</code> may be parsed as boolean <code>true</code> in one tool and the string <code>"yes"</code> in another. Always use explicit <code>true</code>/<code>false</code>.</p>',
			},
			{
				question: 'Why are duplicate keys a problem?',
				answer: '<p>Most YAML parsers will either throw an error or silently use the last value when encountering duplicate keys. Either way, the result is unpredictable behavior. A linter catches this before it causes a hard-to-debug runtime issue.</p>',
			},
			{
				question: 'How do I suppress a lint warning for a specific line?',
				answer: '<p>Most YAML linters (like <code>yamllint</code>) support inline disable comments, e.g., <code># yamllint disable-line rule:line-length</code>. Use sparingly — if you find yourself disabling many rules, revisit whether the rule makes sense for your project.</p>',
			},
			{
				question: 'Should I run a linter in CI?',
				answer: '<p>Absolutely. Running <code>yamllint</code> or similar in your CI pipeline blocks merges of malformed or inconsistent YAML before it reaches production. This is especially critical for Kubernetes manifests and CI/CD pipeline definitions.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format and pretty-print YAML' },
			{ name: 'YAML Validator', path: '/yaml/validator', description: 'Validate YAML syntax' },
			{ name: 'YAML Diff', path: '/yaml/diff', description: 'Compare two YAML files' },
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Inspect Kubernetes manifests' },
		],
		tips: [
			'Add <code>yamllint</code> to your pre-commit hooks so errors are caught locally before pushing.',
			'Create a <code>.yamllint.yml</code> config file at your repo root to share consistent rules across your team.',
			'Treat lint warnings as errors in CI — this prevents warning accumulation that teams stop paying attention to.',
			'Pay special attention to the "truthy" check: using <code>true</code>/<code>false</code> explicitly instead of <code>yes</code>/<code>no</code> makes your YAML portable across all parsers.',
		],
	},

	validator: {
		features: [
			'Validate YAML syntax with detailed error messages and line numbers',
			'Parse and display the resulting data structure as a tree',
			'Detect common issues: unclosed quotes, bad indentation, duplicate keys',
			'Support for multi-document YAML (--- separator)',
			'Character-level error highlighting',
			'Schema validation for popular formats (Kubernetes, GitHub Actions, Docker Compose)',
		],
		useCases: [
			'Verify a configuration file before deploying an application',
			'Debug parse errors from CI/CD runners or deployment tools',
			'Validate programmatically generated YAML output',
			'Check Kubernetes manifests before applying with kubectl',
			'Verify Helm values files and chart templates',
		],
		concept: {
			title: 'YAML Validation',
			content: `<p><strong>Validation</strong> ensures your YAML is syntactically correct — that it can be parsed into a data structure without errors. A valid YAML file has correct indentation, properly balanced quotes, no illegal characters in unquoted strings, and valid key-value pairs.</p>
<p class="mt-2">Validation is the minimum bar: even perfectly valid YAML can have logical errors (wrong key names, missing required fields). For those, you need <em>schema validation</em>, which checks the parsed structure against a defined schema (like JSON Schema or CRD specs for Kubernetes).</p>`,
		},
		examples: [
			{ label: 'Valid YAML', code: 'name: my-app\nversion: 1.2.3\nenabled: true\ntags:\n  - web\n  - api', isValid: true },
			{ label: 'Invalid (wrong indent)', code: 'name: my-app\n  version: 1.2.3', isValid: false },
			{ label: 'Invalid (unclosed quote)', code: 'message: "Hello World', isValid: false },
		],
		faqs: [
			{
				question: 'What makes a YAML file invalid?',
				answer: '<p>Common causes of YAML parse errors: <ul class="list-disc pl-5 mt-1 space-y-1"><li>Inconsistent indentation or mixing tabs/spaces</li><li>Unclosed quotes (single or double)</li><li>Special characters (<code>:</code>, <code>#</code>, <code>{</code>, <code>}</code>) in unquoted strings</li><li>Colons without a space after them inside mappings</li><li>Multi-line strings that break the indentation context</li></ul></p>',
			},
			{
				question: 'Is valid YAML always safe to use?',
				answer: '<p>No. A YAML file can parse successfully but still be semantically wrong — referencing keys that don\'t exist, using wrong types (string instead of number), or missing required fields. For critical configs, also validate against a schema specific to your tool (e.g., Kubernetes API schemas, OpenAPI specs).</p>',
			},
			{
				question: 'How do I validate YAML in a terminal?',
				answer: '<p>Use <code>python3 -c "import yaml, sys; yaml.safe_load(sys.stdin)"</code> as a quick check. For more advanced output, install <code>yamllint</code> via pip: <code>pip install yamllint && yamllint myfile.yaml</code>.</p>',
			},
			{
				question: 'What does "expected block end" mean?',
				answer: '<p>This typically means the parser expected to close a mapping or sequence block but found something unexpected — usually caused by a bad indent on the next key. Indent the problematic line correctly to resolve it.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Linter', path: '/yaml/linter', description: 'Style and best-practice checks' },
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format and normalize YAML' },
			{ name: 'JSON Validator', path: '/json', description: 'Validate JSON documents' },
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Inspect Kubernetes manifests' },
		],
		tips: [
			'Always validate YAML in your editor with a plugin (e.g., YAML by Red Hat in VS Code) for instant feedback.',
			'If a file parses on your machine but not in production, check if the production parser uses a different YAML version (1.1 vs 1.2).',
			'Use <code>yaml.safe_load()</code> instead of <code>yaml.load()</code> in Python — the latter allows arbitrary code execution via YAML anchors.',
			'Multi-document YAML (using <code>---</code>) is useful for Kubernetes but can confuse tools expecting single-document files.',
		],
	},

	diff: {
		features: [
			'Side-by-side visual diff of two YAML documents',
			'Semantic diff: compares parsed structure, ignoring formatting differences',
			'Line-level diff for raw text comparison',
			'Added (green), removed (red), and changed (yellow) highlighting',
			'Key path display for nested changes (e.g., <code>spec.containers[0].image</code>)',
			'Copy diff output to clipboard',
		],
		useCases: [
			'Compare Kubernetes manifests before and after an upgrade',
			'Review changes to Helm values files across environments (dev vs. prod)',
			'Audit what changed between two versions of a CI/CD configuration',
			'Understand the difference between a backup and a current config file',
			'Debug why two nominally identical configs behave differently',
		],
		concept: {
			title: 'Semantic vs. Textual YAML Diff',
			content: `<p>A <strong>textual diff</strong> compares files line by line like <code>git diff</code>. This is fast but fragile — reformatting a YAML file changes the textual diff even if the data is identical.</p>
<p class="mt-2">A <strong>semantic diff</strong> parses both files into data structures and compares the resulting objects. This approach ignores formatting differences (indentation, quoting, ordering) and shows only meaningful data changes. It is far more useful for configuration files where only the values matter.</p>
<p class="mt-2">This tool supports both modes so you can choose the right level of fidelity for your comparison.</p>`,
		},
		examples: [
			{ label: 'Same data, different format (semantic: no diff)', code: 'port: 8080\nhost: localhost', isValid: true },
			{ label: 'Changed value', code: 'replicas: 2  →  replicas: 3', isValid: true },
			{ label: 'Added key', code: '+  debug: true', isValid: true },
		],
		faqs: [
			{
				question: 'Why does the diff show changes when I only reformatted the file?',
				answer: '<p>If you are using <strong>textual diff</strong> mode, any whitespace or ordering change will appear as a change. Switch to <strong>semantic diff</strong> mode, which parses the YAML and compares the resulting data structures — identical data will show no diff regardless of formatting.</p>',
			},
			{
				question: 'What is a YAML anchor and how does diff handle it?',
				answer: '<p>YAML anchors (<code>&anchor-name</code>) and aliases (<code>*anchor-name</code>) allow content reuse within a YAML file. The diff tool resolves all anchors to their referenced values before comparing, so you see the actual effective values rather than symbolic references.</p>',
			},
			{
				question: 'Can I compare YAML files from different environments?',
				answer: '<p>Yes — this is one of the most common use cases. Paste your development config in one panel and your production config in the other to see exactly what differs between environments. This is invaluable for debugging "works on my machine" issues.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Normalize YAML formatting' },
			{ name: 'Git Diff Viewer', path: '/git/diff-viewer', description: 'Text diff tool' },
			{ name: 'K8s Diff', path: '/k8s/diff', description: 'Compare Kubernetes manifests' },
		],
		tips: [
			'Use semantic diff when you only care about data changes, not formatting. Use textual diff when you need to audit exact file changes (e.g., for git blame).',
			'Before comparing large files, run both through the YAML Formatter first to normalize indentation and quoting — this reduces diff noise.',
			'The key path shown for each difference (e.g., <code>spec.replicas</code>) makes it easy to find the change in large nested files.',
		],
	},

	'from-json': {
		features: [
			'Convert JSON to YAML with configurable indentation',
			'Handles nested objects, arrays, strings, numbers, booleans, and null',
			'Preserves key order from the source JSON',
			'Optional: sort keys alphabetically in output',
			'Syntax error reporting for invalid JSON input',
			'Copy converted YAML to clipboard',
		],
		useCases: [
			'Convert API responses (JSON) to YAML for use in config files',
			'Transform package.json or tsconfig.json to YAML for tooling that prefers it',
			'Create Kubernetes manifests from JSON resource definitions',
			'Convert OpenAPI/Swagger JSON specs to YAML format',
			'Migrate JSON-based configuration to YAML for improved readability',
		],
		concept: {
			title: 'JSON to YAML Conversion',
			content: `<p>YAML is a superset of JSON: every valid JSON document is also a valid YAML document. Converting from JSON to YAML therefore never loses data — it is a lossless transformation that changes only the representation.</p>
<p class="mt-2">The key differences in the output: YAML replaces <code>{}</code> with indentation-based mappings, <code>[]</code> with <code>-</code>-prefixed lists, removes quotes from simple strings, and drops commas and braces entirely. The result is typically more compact and human-readable.</p>
<p class="mt-2">Special cases to be aware of: strings that look like numbers, booleans, or null values must be quoted in YAML to preserve their string type (e.g., the string <code>"true"</code> must be written as <code>'true'</code> in YAML).</p>`,
		},
		examples: [
			{ label: 'JSON input', code: '{"name": "app", "port": 8080, "tags": ["web", "api"]}', isValid: true },
			{ label: 'YAML output', code: 'name: app\nport: 8080\ntags:\n  - web\n  - api', isValid: true },
		],
		faqs: [
			{
				question: 'Is YAML always better than JSON for config files?',
				answer: '<p>YAML is more human-readable and supports comments, making it popular for config files. JSON is simpler (no indentation issues) and has universal parser support. For machine-to-machine communication (APIs), JSON is the clear winner. For files humans edit frequently (Kubernetes manifests, CI configs), YAML is often preferred.</p>',
			},
			{
				question: 'Will string values like "true" or "null" be preserved?',
				answer: '<p>The converter detects JSON strings that look like YAML reserved words (<code>true</code>, <code>false</code>, <code>null</code>) and wraps them in quotes to preserve their string type. Without quotes, <code>true</code> would be parsed as a boolean, changing the meaning of your data.</p>',
			},
			{
				question: 'What happens to JSON null values?',
				answer: '<p>JSON <code>null</code> is converted to YAML <code>null</code> (or an empty/tilde <code>~</code>). Both are valid representations. This tool outputs the explicit <code>null</code> spelling for clarity.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML to JSON', path: '/yaml/to-json', description: 'Convert YAML back to JSON' },
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format the resulting YAML' },
			{ name: 'YAML Validator', path: '/yaml/validator', description: 'Validate converted YAML' },
			{ name: 'JSON Tools', path: '/json', description: 'Format and validate JSON' },
		],
		tips: [
			'After converting, run the result through the YAML Formatter to ensure consistent indentation.',
			'If the source JSON has numeric string keys, they will be preserved as strings in YAML (quoted). Review manually if this matters for your use case.',
			'For large JSON files, the YAML output may be significantly shorter — a good sign for config readability.',
		],
	},

	'to-json': {
		features: [
			'Convert YAML to JSON with pretty-printing',
			'Handles YAML anchors, aliases, and merge keys',
			'Resolves multi-document YAML (<code>---</code>) into a JSON array',
			'Syntax error reporting with line numbers',
			'Minify or pretty-print the JSON output',
			'Copy converted JSON to clipboard',
		],
		useCases: [
			'Convert Kubernetes manifests or Helm values to JSON for API calls',
			'Use YAML-authored config in applications that require JSON input',
			'Convert OpenAPI YAML specs to JSON for tools that prefer it',
			'Process YAML configuration files in languages with better JSON support',
			'Migrate YAML-based secrets to JSON for environment variable injection',
		],
		concept: {
			title: 'YAML to JSON Conversion',
			content: `<p>Converting YAML to JSON parses the YAML into a data structure and serializes it as JSON. Because JSON is a strict subset of YAML, this conversion may encounter YAML features that have no direct JSON equivalent:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>Comments</strong> — YAML comments are discarded (JSON has no comments)</li>
  <li><strong>Anchors &amp; aliases</strong> — Resolved to their referenced values in the JSON output</li>
  <li><strong>Multi-document</strong> — Multiple <code>---</code>-separated documents are output as a JSON array</li>
  <li><strong>Binary data</strong> — YAML binary scalars are base64-encoded as JSON strings</li>
</ul>`,
		},
		examples: [
			{ label: 'YAML input', code: 'name: my-app\nreplicas: 3\nenabled: true', isValid: true },
			{ label: 'JSON output', code: '{\n  "name": "my-app",\n  "replicas": 3,\n  "enabled": true\n}', isValid: true },
		],
		faqs: [
			{
				question: 'Are YAML comments preserved in JSON output?',
				answer: '<p>No. JSON does not support comments, so all YAML comments are discarded during conversion. If you need to preserve comments for documentation, keep the YAML source file as the canonical version and generate JSON from it as needed.</p>',
			},
			{
				question: 'What happens to YAML anchors in the JSON output?',
				answer: '<p>Anchors (<code>&name</code>) and aliases (<code>*name</code>) are resolved: the alias is replaced by the full value of its anchor target. The JSON output contains the fully expanded data with no references.</p>',
			},
			{
				question: 'Can I convert a multi-document YAML file?',
				answer: '<p>Yes. A YAML file with multiple <code>---</code>-separated documents is converted to a JSON array where each element corresponds to one document. If you need a single object, ensure your YAML file contains only one document.</p>',
			},
		],
		relatedTools: [
			{ name: 'JSON to YAML', path: '/yaml/from-json', description: 'Convert JSON back to YAML' },
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format YAML before converting' },
			{ name: 'JSON Tools', path: '/json', description: 'Validate and format JSON' },
		],
		tips: [
			'Use minified JSON output when embedding in environment variables or API payloads.',
			'If the YAML uses custom tags (e.g., <code>!!binary</code>), verify the JSON output handles them as expected.',
			'For Kubernetes resources, converting to JSON enables you to use <code>kubectl apply -f -</code> with JSON piped from a script.',
		],
	},

	'to-env': {
		features: [
			'Convert flat YAML key-value pairs to .env file format',
			'Nested keys are flattened with configurable separator (double underscore or dot)',
			'Handles strings, numbers, and booleans correctly',
			'Filter keys by prefix to extract a subset of configuration',
			'Preview the resulting .env content before copying',
			'Copy or download the .env output',
		],
		useCases: [
			'Extract application config from YAML to .env for local development',
			'Convert Helm values to environment variables for container injection',
			'Generate .env files from configuration YAML in CI/CD pipelines',
			'Migrate from YAML-based config files to 12-factor app environment variables',
			'Create Docker run command arguments from YAML service configuration',
		],
		concept: {
			title: 'YAML to .env Conversion',
			content: `<p>The <strong>.env file format</strong> (popularized by the <code>dotenv</code> library) stores configuration as <code>KEY=VALUE</code> pairs. It is the standard way to provide environment variables to applications following the 12-Factor App methodology.</p>
<p class="mt-2">Converting nested YAML to .env requires <strong>flattening</strong>: a nested key like <code>database.host</code> becomes <code>DATABASE__HOST</code> (using double underscore as separator, a common convention). This allows the application to reconstruct the hierarchy if needed.</p>
<p class="mt-2">Note that .env does not support arrays or complex objects — only scalar values. Array values in YAML are either joined as comma-separated strings or skipped during conversion.</p>`,
		},
		examples: [
			{ label: 'YAML input', code: 'database:\n  host: localhost\n  port: 5432\n  name: mydb', isValid: true },
			{ label: '.env output', code: 'DATABASE__HOST=localhost\nDATABASE__PORT=5432\nDATABASE__NAME=mydb', isValid: true },
		],
		faqs: [
			{
				question: 'What separator should I use for nested keys?',
				answer: '<p>The most common convention is <strong>double underscore</strong> (<code>__</code>) because single underscore is often part of key names. Some frameworks (like ASP.NET Core, Spring Boot) use <code>__</code> specifically to reconstruct hierarchy from environment variables. Use <code>:</code> (colon) or <code>.</code> (dot) only if your application framework expects it.</p>',
			},
			{
				question: 'How are YAML arrays handled?',
				answer: '<p>Most .env converters join array values as a comma-separated string (e.g., <code>TAGS=web,api,backend</code>). If your application expects a specific array format, you may need to post-process this manually.</p>',
			},
			{
				question: 'Should I commit .env files to git?',
				answer: '<p><strong>Never commit .env files containing secrets</strong>. Add <code>.env</code> to your <code>.gitignore</code>. Instead, commit a <code>.env.example</code> file with placeholder values. Use a secrets manager (AWS Secrets Manager, Vault, etc.) for production secrets.</p>',
			},
			{
				question: 'Can I use this in a CI/CD pipeline?',
				answer: '<p>Yes. A common pattern: store non-secret config in YAML, convert to .env, and source it in your CI script: <code>set -a; source .env; set +a</code>. Secret values should come from your CI platform\'s secret store and be injected separately.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format YAML before converting' },
			{ name: 'YAML to JSON', path: '/yaml/to-json', description: 'Convert YAML to JSON' },
			{ name: 'Git Secrets Scanner', path: '/git/secrets-scanner', description: 'Scan for leaked secrets' },
		],
		tips: [
			'Always quote values that contain spaces or special characters in .env files: <code>DB_URL="postgresql://user:pass@host/db"</code>.',
			'Use a prefix filter to extract only the relevant section of a large YAML file (e.g., only keys under <code>app:</code>).',
			'The double-underscore convention (<code>DATABASE__HOST</code>) is more portable across frameworks than using colons or dots.',
		],
	},

	sorter: {
		features: [
			'Sort YAML keys alphabetically (ascending or descending)',
			'Recursive key sorting for nested objects',
			'Preserve comment positions (best-effort)',
			'Preview sorted output before applying',
			'Configurable: sort only top-level keys, or recursively sort all levels',
			'Merge with formatter for clean sorted output',
		],
		useCases: [
			'Standardize key ordering across config files for predictable diffs',
			'Sort Kubernetes manifest fields to match CRD documentation order',
			'Reduce merge conflicts by keeping keys in a consistent order',
			'Improve readability of large YAML files by grouping related alphabetically-adjacent keys',
			'Enforce alphabetical ordering in CI as part of a style guide',
		],
		concept: {
			title: 'Why Sort YAML Keys?',
			content: `<p>YAML mappings (objects) have <strong>no inherent ordering</strong> — the specification says key order is implementation-defined. In practice, parsers usually preserve insertion order, which means manually edited files develop arbitrary key orderings over time.</p>
<p class="mt-2">Sorting keys alphabetically provides two benefits: it makes <strong>code reviews cleaner</strong> (you can tell at a glance if a key was added or removed at the right alphabetical position) and it <strong>reduces merge conflicts</strong> (when two developers add different keys, they won't conflict if both follow the same ordering rule).</p>
<p class="mt-2">The tradeoff is that alphabetical order may not reflect logical grouping. Use judgment: alphabetical ordering makes most sense for configuration dictionaries and less sense for step-by-step pipeline stages.</p>`,
		},
		examples: [
			{ label: 'Unsorted', code: 'version: 1\nname: app\nauthor: Alice\ndesc: My App', isValid: true },
			{ label: 'Sorted', code: 'author: Alice\ndesc: My App\nname: app\nversion: 1', isValid: true },
		],
		faqs: [
			{
				question: 'Does sorting change the behavior of my config?',
				answer: '<p>For most use cases, no — YAML mappings are interpreted as unordered dictionaries by applications. However, there are exceptions: some tools process YAML steps or stages in document order (e.g., CI pipeline steps). Always test after sorting if your YAML represents ordered workflows.</p>',
			},
			{
				question: 'What happens to YAML comments when sorting?',
				answer: '<p>Comments are associated with the key that follows them. The sorter attempts to move inline and preceding comments with their associated key. However, freestanding block comments between keys may be repositioned or lost. Review the output carefully if comments are important.</p>',
			},
			{
				question: 'Should I sort Kubernetes manifests?',
				answer: '<p>It depends on the section. Fields like <code>metadata</code>, <code>spec</code>, <code>status</code> follow a conventional order that matches the Kubernetes documentation. Sorting these alphabetically would deviate from convention. However, within <code>labels</code>, <code>annotations</code>, or <code>env</code> maps, alphabetical sorting is common and helpful.</p>',
			},
		],
		relatedTools: [
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format sorted YAML output' },
			{ name: 'YAML Diff', path: '/yaml/diff', description: 'Compare before and after sorting' },
			{ name: 'YAML Linter', path: '/yaml/linter', description: 'Check sorted output for issues' },
		],
		tips: [
			'Combine with the YAML Formatter to get both sorted and consistently indented output in one step.',
			'Use the diff view to inspect exactly which keys moved — this helps you sanity-check the sorted output.',
			'Consider excluding <code>steps</code>, <code>stages</code>, or <code>containers</code> arrays from recursive sorting, since their order is semantically significant.',
		],
	},
};

// URL Tools Content Configuration
// SEO-optimized content for all URL-related tools

export interface URLToolContent {
	features: string[];
	useCases: string[];
	concept: {
		title: string;
		content: string;
	};
	examples: {
		label: string;
		code: string;
		isValid: boolean;
	}[];
	faqs: {
		question: string;
		answer: string;
	}[];
	relatedTools: {
		name: string;
		path: string;
		description: string;
	}[];
	tips?: string[]; // Optional tips for best practices
}

export const urlToolsContent: Record<string, URLToolContent> = {
	'encode-decode': {
		features: [
			'Instant URL encoding and decoding',
			'Automatic input detection (plain text or encoded)',
			'Multiple encoding modes (Component, Full URL, Query)',
			'Support for UTF-8 and special characters',
			'Client-side processing (no server uploads)',
			'Copy encoded/decoded output with one click'
		],
		useCases: [
			'Encode query parameters for API requests',
			'Decode URL-encoded strings from logs',
			'Fix broken URLs with special characters',
			'Encode spaces and symbols for web forms',
			'Debug URL encoding issues in applications'
		],
		concept: {
			title: 'Understanding URL Encoding',
			content: `
				<p><strong>URL encoding</strong> (also called percent-encoding) converts characters into a format that can be safely transmitted over the internet. Special characters are replaced with % followed by hexadecimal values.</p>
				
				<p><strong>Why URL encoding?</strong></p>
				<ul>
					<li><strong>Reserved characters</strong> - Characters like ?, &, =, / have special meaning in URLs</li>
					<li><strong>Space handling</strong> - Spaces must be encoded as %20 or +</li>
					<li><strong>Unicode support</strong> - Non-ASCII characters need encoding for compatibility</li>
					<li><strong>Data safety</strong> - Prevents URL interpretation errors</li>
				</ul>
				
				<p><strong>Encoding modes:</strong></p>
				<ul>
					<li><strong>Component</strong> - Encodes all special characters (best for query parameters)</li>
					<li><strong>Full URL</strong> - Preserves URL structure characters (://?#)</li>
					<li><strong>Query</strong> - Like component, but uses + for spaces</li>
				</ul>
				
				<p><strong>Example:</strong> "Hello World!" becomes "Hello%20World%21" (component mode) or "Hello+World%21" (query mode).</p>
			`
		},
		examples: [
			{
				label: 'Encoding text with spaces',
				code: 'Input: Hello World!\nOutput: Hello%20World%21\n// Space → %20, ! → %21',
				isValid: true
			},
			{
				label: 'Decoding URL-encoded string',
				code: 'Input: Hello%20World%21\nOutput: Hello World!\n// %20 → space, %21 → !',
				isValid: true
			},
			{
				label: 'Query mode (space as +)',
				code: 'Input: search query\nComponent: search%20query\nQuery: search+query',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is URL encoding used for?',
				answer: '<p>URL encoding ensures that special characters don\'t break URLs. It\'s essential for <strong>query parameters</strong>, <strong>form data</strong>, and <strong>API requests</strong>. Common uses include encoding search queries, filenames, user input, and international characters in URLs.</p>'
			},
			{
				question: 'What\'s the difference between %20 and + for spaces?',
				answer: '<p><strong>%20</strong> is the standard percent-encoding for spaces, used with <code>encodeURIComponent()</code>. The <strong>+</strong> character is specific to <strong>application/x-www-form-urlencoded</strong> format (HTML forms). Both decode to spaces, but %20 is safer for general URL use.</p>'
			},
			{
				question: 'When should I use different encoding modes?',
				answer: '<p>Use <strong>Component</strong> for query parameters and form data (encodes everything). Use <strong>Full URL</strong> when encoding complete URLs (preserves ://). Use <strong>Query</strong> for form submissions (space as +). Most cases need Component mode.</p>'
			},
			{
				question: 'Can URL encoding handle unicode characters?',
				answer: '<p>Yes! URL encoding converts unicode to <strong>UTF-8 bytes</strong>, then encodes each byte as %XX. For example, "café" becomes "caf%C3%A9". This ensures international characters work correctly in URLs across all systems.</p>'
			},
			{
				question: 'Do I need to encode the entire URL?',
				answer: '<p><strong>No.</strong> Only encode the <strong>dynamic parts</strong> like query parameters, not the protocol or domain. Example: <code>https://example.com/api?q=Hello%20World</code> - only "Hello World" needs encoding, not the base URL.</p>'
			}
		],
		relatedTools: [
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse URL query parameters' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build URLs with parameters' },
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate URL format' },
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Encode data to Base64' }
		]
	},

	'query-parser': {
		features: [
			'Parse URL query strings into key-value pairs',
			'Paste full URLs or just query strings starting with ?',
			'Display parameters in a sortable table',
			'Export as JSON for code or CSV for spreadsheets',
			'Handles arrays and multiple values',
			'Automatic URL decoding for readability'
		],
		useCases: [
			'Debug API request parameters',
			'Analyze tracking URLs and UTM parameters',
			'Extract form submission data',
			'Inspect OAuth callback parameters',
			'Convert query strings to JSON for APIs'
		],
		concept: {
			title: 'URL Query String Parsing',
			content: `
				<p><strong>Query strings</strong> are the portion of a URL after the <code>?</code> symbol, containing key-value pairs separated by <code>&</code> characters.</p>
				
				<p><strong>Query string format:</strong></p>
				<pre>https://example.com/api?key1=value1&key2=value2&key3=value3</pre>
				
				<p><strong>Common patterns:</strong></p>
				<ul>
					<li><strong>Simple pairs</strong> - <code>?name=John&age=25</code></li>
					<li><strong>Arrays</strong> - <code>?tags[]=red&tags[]=blue</code> or <code>?tags=red&tags=blue</code></li>
					<li><strong>Nested</strong> - <code>?user[name]=John&user[age]=25</code></li>
					<li><strong>Empty values</strong> - <code>?flag=&key</code> (key with no value)</li>
				</ul>
				
				<p><strong>Automatic decoding:</strong> Query values are URL-encoded. Our parser automatically decodes %20 (space), %21 (!), and other encoded characters for readability.</p>
				
				<p><strong>Use cases:</strong> Debug API calls, analyze marketing URLs (UTM parameters), inspect OAuth redirects, extract search filters.</p>
			`
		},
		examples: [
			{
				label: 'Simple query string',
				code: '?name=John&age=25&city=NYC\n\n→ name: John\n→ age: 25\n→ city: NYC',
				isValid: true
			},
			{
				label: 'URL-encoded values',
				code: '?q=Hello%20World&lang=en\n\n→ q: Hello World (decoded)\n→ lang: en',
				isValid: true
			},
			{
				label: 'Array parameters',
				code: '?tags[]=javascript&tags[]=typescript\n\n→ tags[]: [javascript, typescript]',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How do I handle array parameters in query strings?',
				answer: '<p>Arrays are represented as <strong>repeated keys</strong> (<code>?tag=red&tag=blue</code>) or with <strong>brackets</strong> (<code>?tag[]=red&tag[]=blue</code>). Our parser detects both formats and groups them automatically. Export as JSON to see the array structure.</p>'
			},
			{
				question: 'What if a query parameter has no value?',
				answer: '<p>Parameters with no value (e.g., <code>?flag&key</code>) are treated as <strong>boolean flags</strong>. The key exists but the value is empty. Some APIs use this for toggles like <code>?debug</code> or <code>?verbose</code>.</p>'
			},
			{
				question: 'Can I parse query strings from POST requests?',
				answer: '<p>Yes! While POST data is in the request body, it often uses <strong>application/x-www-form-urlencoded</strong> format, which is identical to query strings. Paste the body content (without the URL) to parse it.</p>'
			},
			{
				question: 'How do I export query parameters as JSON?',
				answer: '<p>Use the <strong>Export as JSON</strong> button. The output is a JSON object with key-value pairs. Arrays are represented as JSON arrays. This is useful for sending query data to APIs or storing it in databases.</p>'
			},
			{
				question: 'What\'s the difference between & and ; in query strings?',
				answer: '<p>The <strong>&</strong> (ampersand) is the standard separator (e.g., <code>?a=1&b=2</code>). The <strong>;</strong> (semicolon) is an alternative allowed by old W3C specs but rarely used. Modern URLs use <strong>&</strong> exclusively.</p>'
			}
		],
		relatedTools: [
			{ name: 'URL Builder', path: '/url/builder', description: 'Build URLs from parameters' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Encode parameter values' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format exported JSON' },
			{ name: 'URL to JSON', path: '/url/json-converter', description: 'Convert query to JSON' }
		]
	},

	'builder': {
		features: [
			'Build URLs with query parameters visually',
			'Add, edit, and remove parameters easily',
			'Automatic URL encoding of values',
			'Auto-parse existing URLs by pasting them',
			'Preview full URL in real-time',
			'Copy as URL, cURL, fetch, axios, and more'
		],
		useCases: [
			'Generate API request URLs',
			'Create tracking URLs with UTM parameters',
			'Build search URLs for testing',
			'Construct OAuth authorization URLs',
			'Test URL parameter combinations'
		],
		concept: {
			title: 'URL Construction and Query Building',
			content: `
				<p><strong>URL building</strong> allows you to construct complete URLs by adding query parameters visually, without manual encoding or syntax errors.</p>
				
				<p><strong>URL structure:</strong></p>
				<pre>https://example.com/path?key1=value1&key2=value2#hash</pre>
				
				<p><strong>Components:</strong></p>
				<ul>
					<li><strong>Base URL</strong> - Protocol, domain, and path (<code>https://example.com/api</code>)</li>
					<li><strong>Query string</strong> - Parameters after <code>?</code> (<code>?key=value&...</code>)</li>
					<li><strong>Fragment</strong> - Optional hash anchor (<code>#section</code>)</li>
				</ul>
				
				<p><strong>Automatic encoding:</strong> Values are automatically URL-encoded. "Hello World" becomes "Hello%20World". You don't need to manually encode special characters.</p>
				
				<p><strong>Editing mode:</strong> Paste an existing URL to parse and edit it. Modify parameters, add new ones, or remove unwanted ones, then copy the updated URL.</p>
			`
		},
		examples: [
			{
				label: 'Build API URL with parameters',
				code: 'Base: https://api.example.com/search\nParams:\n  - q: javascript tutorials\n  - lang: en\n  - limit: 10\n\nResult: https://api.example.com/search?q=javascript%20tutorials&lang=en&limit=10',
				isValid: true
			},
			{
				label: 'UTM tracking URL',
				code: 'Base: https://example.com/product\nParams:\n  - utm_source: newsletter\n  - utm_medium: email\n  - utm_campaign: spring_sale\n\nResult: https://example.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale',
				isValid: true
			},
			{
				label: 'Edit existing URL',
				code: 'Input: https://shop.com/search?q=shoes&size=10\nEdit: Add color=red, remove size\n\nResult: https://shop.com/search?q=shoes&color=red',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Does the URL builder encode values automatically?',
				answer: '<p>Yes! All parameter values are <strong>automatically URL-encoded</strong>. Spaces become %20, special characters like ! become %21. You don\'t need to manually encode values—just type plain text.</p>'
			},
			{
				question: 'Can I edit an existing URL with the builder?',
				answer: '<p>Absolutely! Paste any URL and the builder will <strong>parse it</strong> into base URL and parameters. Edit, add, or remove parameters, then copy the updated URL. Perfect for modifying tracking URLs or API endpoints.</p>'
			},
			{
				question: 'How do I add multiple values for the same key?',
				answer: '<p>Add the same key multiple times with different values (e.g., <code>tag=red</code>, <code>tag=blue</code>). The URL will include both: <code>?tag=red&tag=blue</code>. APIs often use this for arrays or filters.</p>'
			},
			{
				question: 'Can I include a hash/fragment in the URL?',
				answer: '<p>Yes! The hash (fragment) is the part after <code>#</code> in a URL. Add it in the dedicated fragment field. Example: <code>https://example.com/page#section</code>. Fragments are not sent to the server—they\'re used client-side.</p>'
			},
			{
				question: 'What\'s the correct order for URL parameters?',
				answer: '<p>Parameter order <strong>doesn\'t matter</strong> for most servers. <code>?a=1&b=2</code> and <code>?b=2&a=1</code> are equivalent. However, some APIs or caching systems may be sensitive to order. Our builder preserves your parameter order.</p>'
			}
		],
		relatedTools: [
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse existing URLs' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Encode parameter values' },
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate built URLs' },
			{ name: 'URL Normalizer', path: '/url/normalizer', description: 'Normalize URL format' }
		]
	},

	'validator': {
		features: [
			'Validate URL syntax and format',
			'Check protocol, domain, port, path',
			'Detect invalid characters',
			'Show URL component breakdown',
			'Real-time validation as you type',
			'Detailed error messages'
		],
		useCases: [
			'Verify user-submitted URLs',
			'Debug malformed URLs',
			'Validate API endpoint URLs',
			'Check URL format before requests',
			'Test URL parser implementations'
		],
		concept: {
			title: 'URL Validation Rules',
			content: `
				<p><strong>URL validation</strong> checks if a URL follows the correct syntax and format. Valid URLs must have a proper protocol, domain, and optional path/query/fragment components.</p>
				
				<p><strong>Valid URL components:</strong></p>
				<ul>
					<li><strong>Protocol</strong> - http://, https://, ftp://, etc.</li>
					<li><strong>Domain</strong> - example.com, sub.example.co.uk</li>
					<li><strong>Port</strong> - Optional :8080, :3000 (must be 1-65535)</li>
					<li><strong>Path</strong> - /api/users, /page.html</li>
					<li><strong>Query</strong> - ?key=value&foo=bar</li>
					<li><strong>Fragment</strong> - #section</li>
				</ul>
				
				<p><strong>Common errors:</strong></p>
				<ul>
					<li>Missing protocol (should be https://, not example.com)</li>
					<li>Invalid characters (spaces, non-ASCII without encoding)</li>
					<li>Malformed port (not a number or out of range)</li>
					<li>Incomplete domain (missing TLD or dots)</li>
				</ul>
				
				<p><strong>Note:</strong> A valid URL format doesn't mean the URL exists or is accessible—it just means the syntax is correct.</p>
			`
		},
		examples: [
			{
				label: 'Valid HTTPS URL',
				code: 'https://www.example.com/path?query=value#hash\n✓ Valid - correct protocol, domain, path, query, fragment',
				isValid: true
			},
			{
				label: 'Invalid - missing protocol',
				code: 'www.example.com/page\n✗ Invalid - must start with http:// or https://',
				isValid: false
			},
			{
				label: 'Valid - with port',
				code: 'https://localhost:3000/api\n✓ Valid - port number is valid',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What makes a URL valid?',
				answer: '<p>A valid URL must have: <strong>(1)</strong> a protocol (http://, https://), <strong>(2)</strong> a domain (example.com), and <strong>(3)</strong> proper encoding of special characters. Path, query, and fragment are optional. The port (if present) must be 1-65535.</p>'
			},
			{
				question: 'Why does "example.com" fail validation?',
				answer: '<p>URLs require a <strong>protocol</strong> like <code>http://</code> or <code>https://</code>. "example.com" is a <em>domain name</em>, not a complete URL. The valid version is <code>https://example.com</code>.</p>'
			},
			{
				question: 'Can URLs contain spaces?',
				answer: '<p><strong>No.</strong> Spaces must be URL-encoded as <code>%20</code> or <code>+</code>. A URL with unencoded spaces is <strong>invalid</strong>. Use our URL Encoder to fix URLs with spaces.</p>'
			},
			{
				question: 'Are localhost and IP addresses valid URLs?',
				answer: '<p>Yes! <code>https://localhost:3000</code> and <code>http://192.168.1.1</code> are valid URLs. IPv6 addresses must be in brackets: <code>http://[::1]:8080</code>.</p>'
			},
			{
				question: 'Does validation check if the URL exists?',
				answer: '<p><strong>No.</strong> Validation only checks <strong>syntax</strong>, not existence. A URL can be perfectly valid but point to a non-existent page or domain. To check existence, you need to make an HTTP request.</p>'
			}
		],
		relatedTools: [
			{ name: 'Parts Analyzer', path: '/url/parts', description: 'Visual URL breakdown' },
			{ name: 'URL Normalizer', path: '/url/normalizer', description: 'Fix URL formatting' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Fix encoding issues' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build valid URLs' }
		]
	},

	'parts': {
		features: [
			'Visual breakdown of URL components',
			'Display protocol, host, port, path, query, hash',
			'Syntax highlighting for each part',
			'Copy individual components',
			'Automatic query string parsing',
			'Show URL structure visually'
		],
		useCases: [
			'Understand complex URL structure',
			'Debug URL parsing issues',
			'Learn URL anatomy',
			'Extract specific URL parts',
			'Verify URL component values'
		],
		concept: {
			title: 'URL Anatomy and Components',
			content: `
				<p><strong>URLs (Uniform Resource Locators)</strong> are structured addresses for web resources. Understanding URL parts is essential for web development, API design, and debugging.</p>
				
				<p><strong>URL structure:</strong></p>
				<pre>https://user:pass@www.example.com:443/path/to/page?key=value#section
└─┬──┘ └───┬───┘ └─────┬──────┘ └┬┘ └────┬────┘ └───┬───┘ └──┬───┘
protocol  auth      host       port   path       query   fragment</pre>
				
				<p><strong>Component descriptions:</strong></p>
				<ul>
					<li><strong>Protocol</strong> - Transfer method (http, https, ftp, ws, etc.)</li>
					<li><strong>Authentication</strong> - Optional username:password (rarely used)</li>
					<li><strong>Host</strong> - Domain name or IP address</li>
					<li><strong>Port</strong> - Optional (default: 80 for HTTP, 443 for HTTPS)</li>
					<li><strong>Path</strong> - Resource location on the server</li>
					<li><strong>Query</strong> - Key-value parameters after ?</li>
					<li><strong>Fragment</strong> - Page section anchor after #</li>
				</ul>
				
				<p><strong>Use cases:</strong> Extract domains for allow-lists, parse query parameters, check protocols for security, understand API endpoint structure.</p>
			`
		},
		examples: [
			{
				label: 'Full URL breakdown',
				code: 'https://api.example.com:8080/v1/users?id=123&sort=name#results\n\nProtocol: https\nHost: api.example.com\nPort: 8080\nPath: /v1/users\nQuery: ?id=123&sort=name\nFragment: #results',
				isValid: true
			},
			{
				label: 'Simple URL without optional parts',
				code: 'https://example.com/page\n\nProtocol: https\nHost: example.com\nPort: (default 443)\nPath: /page\nQuery: (none)\nFragment: (none)',
				isValid: true
			},
			{
				label: 'URL with authentication',
				code: 'ftp://user:pass@ftp.example.com/files\n\nProtocol: ftp\nAuth: user:pass\nHost: ftp.example.com\nPath: /files',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What\'s the difference between path and query?',
				answer: '<p>The <strong>path</strong> identifies a resource (<code>/api/users</code>), while the <strong>query</strong> provides parameters (<code>?id=123&sort=name</code>). Paths are hierarchical (like folders), queries are key-value pairs. Both are sent to the server.</p>'
			},
			{
				question: 'What\'s the difference between query and fragment?',
				answer: '<p>The <strong>query</strong> (<code>?key=value</code>) is sent to the server in HTTP requests. The <strong>fragment</strong> (<code>#section</code>) is <strong>client-side only</strong>—it\'s not sent to the server and is used for page navigation (scrolling to sections).</p>'
			},
			{
				question: 'Why is the port sometimes missing?',
				answer: '<p>Ports have <strong>defaults</strong>: HTTP uses port 80, HTTPS uses 443. If the URL uses default ports, they\'re omitted (<code>https://example.com</code> is the same as <code>https://example.com:443</code>). Non-standard ports must be explicit (<code>:8080</code>).</p>'
			},
			{
				question: 'What is the host vs domain?',
				answer: '<p>The <strong>host</strong> is the full network address (e.g., <code>www.example.com</code> or <code>api.example.com</code>). The <strong>domain</strong> is the registered name (<code>example.com</code>). The host includes subdomains (www, api, blog, etc.).</p>'
			},
			{
				question: 'Can I use authentication in URLs safely?',
				answer: '<p><strong>No.</strong> <code>https://user:pass@example.com</code> exposes credentials in logs, browser history, and referrer headers. Modern browsers discourage this. Use <strong>Authorization headers</strong> or secure tokens instead.</p>'
			}
		],
		relatedTools: [
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate URL syntax' },
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse query string' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build URLs from parts' },
			{ name: 'URL Normalizer', path: '/url/normalizer', description: 'Standardize URL format' }
		]
	},

	'slug-generator': {
		features: [
			'Convert text to SEO-friendly URL slugs',
			'Unicode-safe: handles accented characters (café → cafe)',
			'Automatic lowercase conversion',
			'Replace spaces with hyphens or underscores',
			'Emoji removal: strips emoji and special characters',
			'Custom base URL: preview with your own domain'
		],
		useCases: [
			'Generate blog post URLs',
			'Create product page slugs',
			'Build SEO-friendly routes',
			'Convert titles to URL paths',
			'Standardize file names'
		],
		concept: {
			title: 'URL Slug Generation',
			content: `
				<p><strong>URL slugs</strong> are human-readable, SEO-friendly identifiers used in URLs. They typically use lowercase letters, numbers, and hyphens instead of spaces and special characters.</p>
				
				<p><strong>Slug rules:</strong></p>
				<ul>
					<li><strong>Lowercase only</strong> - "Hello World" → "hello-world"</li>
					<li><strong>Hyphens for spaces</strong> - Spaces become - or _</li>
					<li><strong>No special chars</strong> - Remove or transliterate !@#$%^&*()</li>
					<li><strong>Unicode handling</strong> - "café" → "cafe" (remove accents)</li>
					<li><strong>Consecutive hyphens</strong> - Collapse multiple --- to single -</li>
				</ul>
				
				<p><strong>Example transformations:</strong></p>
				<ul>
					<li>"10 Best JavaScript Tips" → "10-best-javascript-tips"</li>
					<li>"Node.js & Express Tutorial" → "nodejs-express-tutorial"</li>
					<li>"Café Français" → "cafe-francais"</li>
				</ul>
				
				<p><strong>SEO benefits:</strong> Slugs improve readability, help search engines understand content, and create clean, shareable URLs.</p>
			`
		},
		examples: [
			{
				label: 'Blog post title to slug',
				code: 'Input: 10 Best JavaScript Libraries in 2024\nOutput: 10-best-javascript-libraries-in-2024',
				isValid: true
			},
			{
				label: 'Special characters removed',
				code: 'Input: Node.js & Express: A Beginner\'s Guide!\nOutput: nodejs-express-a-beginners-guide',
				isValid: true
			},
			{
				label: 'Unicode and accents',
				code: 'Input: Café Français\nOutput: cafe-francais\n// Accents transliterated',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What makes a good URL slug?',
				answer: '<p>A good slug is <strong>short</strong>, <strong>descriptive</strong>, and includes <strong>relevant keywords</strong>. Use hyphens to separate words, keep it lowercase, and remove stop words (a, the, of) if possible. Example: "how-to-learn-javascript" instead of "how-to-learn-javascript-programming-language".</p>'
			},
			{
				question: 'Should I use hyphens or underscores in slugs?',
				answer: '<p>Use <strong>hyphens (-)</strong>. Google treats hyphens as word separators but treats underscores as part of the word. "seo-friendly" is read as two words, but "seo_friendly" is one word. Hyphens are the <strong>SEO best practice</strong>.</p>'
			},
			{
				question: 'How do I handle unicode characters like emoji?',
				answer: '<p>Most slug generators <strong>remove emoji</strong> and <strong>transliterate unicode</strong>. "Hello 👋 World" becomes "hello-world". For non-Latin scripts (Chinese, Arabic), consider using <strong>URL encoding</strong> or unique IDs instead of slugs.</p>'
			},
			{
				question: 'Should I include numbers in slugs?',
				answer: '<p>Yes, if they\'re meaningful! "10-best-tips" or "2024-guide" are fine. Numbers can improve SEO if they\'re part of the content (listicles, years). Avoid random IDs like "post-12345" unless necessary for uniqueness.</p>'
			},
			{
				question: 'Can two pages have the same slug?',
				answer: '<p>No, slugs should be <strong>unique</strong> within the same section/category. If you have duplicate titles, append a differentiator: "javascript-tutorial" and "javascript-tutorial-2", or use IDs: "javascript-tutorial-12345".</p>'
			}
		],
		relatedTools: [
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Encode special characters' },
			{ name: 'Case Converter', path: '/text/case-converter', description: 'Convert text case' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build URLs with slugs' },
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate slug URLs' }
		]
	},

	'normalizer': {
		features: [
			'Normalize URLs to standard format',
			'Lowercase scheme and host',
			'Remove default ports (80, 443)',
			'Sort query parameters alphabetically',
			'Remove unnecessary slashes',
			'Decode percent-encoded characters'
		],
		useCases: [
			'Compare URLs for equality',
			'Deduplicate URLs in databases',
			'Standardize URLs for caching',
			'Normalize URLs for analytics',
			'Clean up scraped URLs'
		],
		concept: {
			title: 'URL Normalization',
			content: `
				<p><strong>URL normalization</strong> converts URLs to a standard format so that equivalent URLs are represented identically. This is crucial for caching, deduplication, and comparison.</p>
				
				<p><strong>Normalization rules:</strong></p>
				<ul>
					<li><strong>Lowercase protocol & host</strong> - HTTP:// → http://, Example.COM → example.com</li>
					<li><strong>Remove default ports</strong> - :80 for HTTP, :443 for HTTPS</li>
					<li><strong>Sort query params</strong> - ?b=2&a=1 → ?a=1&b=2</li>
					<li><strong>Remove trailing slash</strong> - /page/ → /page (optional)</li>
					<li><strong>Decode unreserved chars</strong> - %7E → ~, %2D → -</li>
					<li><strong>Remove empty params</strong> - ?key=&foo= → (removed)</li>
				</ul>
				
				<p><strong>Example:</strong></p>
				<pre>Before: HTTP://Example.COM:80/Path?b=2&a=1
After:  http://example.com/Path?a=1&b=2</pre>
				
				<p><strong>Use cases:</strong> Prevent duplicate cache entries, merge identical URLs from different sources, improve URL comparison speed.</p>
			`
		},
		examples: [
			{
				label: 'Normalize protocol and host',
				code: 'Before: HTTP://Example.COM/page\nAfter:  http://example.com/page',
				isValid: true
			},
			{
				label: 'Remove default ports',
				code: 'Before: https://example.com:443/api\nAfter:  https://example.com/api',
				isValid: true
			},
			{
				label: 'Sort query parameters',
				code: 'Before: https://api.com/search?sort=date&q=test&limit=10\nAfter:  https://api.com/search?limit=10&q=test&sort=date',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why normalize URLs?',
				answer: '<p>Normalization ensures that <strong>equivalent URLs are identical</strong>. Without it, <code>example.com</code> and <code>Example.COM</code> are treated as different URLs, causing duplicate cache entries, broken deduplication, and inefficient databases.</p>'
			},
			{
				question: 'Does normalization change the URL\'s meaning?',
				answer: '<p><strong>No.</strong> Normalization preserves the URL\'s meaning. Lowercasing the host, removing default ports, and sorting query params don\'t change what the URL points to. However, <strong>path</strong> is case-sensitive on some servers.</p>'
			},
			{
				question: 'Should I normalize URLs before storing them?',
				answer: '<p><strong>Yes.</strong> Store normalized URLs in databases to avoid duplicates and improve query performance. Normalization also helps with <strong>caching keys</strong>, <strong>analytics</strong>, and <strong>URL-based deduplication</strong>.</p>'
			},
			{
				question: 'What about trailing slashes?',
				answer: '<p>Trailing slashes are <strong>tricky</strong>. On some servers, <code>/page</code> and <code>/page/</code> are different resources. Our normalizer offers an <strong>option</strong> to remove trailing slashes, but use it carefully based on your server\'s behavior.</p>'
			},
			{
				question: 'Does normalization sort query params by default?',
				answer: '<p>Yes! Sorting query parameters <strong>alphabetically</strong> ensures that <code>?b=2&a=1</code> and <code>?a=1&b=2</code> result in the same normalized URL. This is safe because parameter order doesn\'t matter for most APIs.</p>'
			}
		],
		relatedTools: [
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate normalized URLs' },
			{ name: 'URL Compare', path: '/url/compare', description: 'Compare URL differences' },
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse query parameters' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Encode URL parts' }
		]
	},

	'compare': {
		features: [
			'Compare two URLs side by side',
			'Highlight differences in parts',
			'Semantic comparison (ignores order)',
			'Visual diff for query parameters',
			'Protocol, host, path, query analysis',
			'Copy comparison results'
		],
		useCases: [
			'Find differences between similar URLs',
			'Debug URL changes in redirects',
			'Compare API endpoint versions',
			'Verify URL transformations',
			'Analyze URL variations'
		],
		concept: {
			title: 'URL Comparison and Semantic Diff',
			content: `
				<p><strong>URL comparison</strong> identifies differences between two URLs at the component level. Semantic comparison treats equivalent URLs as equal even if formatted differently.</p>
				
				<p><strong>Comparison levels:</strong></p>
				<ul>
					<li><strong>Exact match</strong> - Character-by-character comparison</li>
					<li><strong>Normalized match</strong> - Ignores case, default ports, param order</li>
					<li><strong>Semantic match</strong> - Same resource, different representation</li>
				</ul>
				
				<p><strong>What's compared:</strong></p>
				<ul>
					<li><strong>Protocol</strong> - http vs https</li>
					<li><strong>Host</strong> - domain differences</li>
					<li><strong>Port</strong> - explicit vs default</li>
					<li><strong>Path</strong> - route differences</li>
					<li><strong>Query params</strong> - added, removed, changed values</li>
					<li><strong>Fragment</strong> - hash anchor differences</li>
				</ul>
				
				<p><strong>Example:</strong> <code>example.com/page?a=1&b=2</code> vs <code>example.com/page?b=2&a=1</code> are <strong>semantically equal</strong> (query order doesn't matter) but not <strong>exact matches</strong>.</p>
			`
		},
		examples: [
			{
				label: 'Different query parameters',
				code: 'URL 1: https://api.com/search?q=test&lang=en\nURL 2: https://api.com/search?q=test&lang=fr\n\nDifference: lang parameter value changed',
				isValid: true
			},
			{
				label: 'Same URL, different format',
				code: 'URL 1: https://example.com:443/page?b=2&a=1\nURL 2: https://example.com/page?a=1&b=2\n\nDifference: None (semantically equal)',
				isValid: true
			},
			{
				label: 'Protocol difference',
				code: 'URL 1: http://example.com/page\nURL 2: https://example.com/page\n\nDifference: Protocol (http → https)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What\'s the difference between exact and semantic comparison?',
				answer: '<p><strong>Exact comparison</strong> requires URLs to match character-by-character. <strong>Semantic comparison</strong> treats equivalent URLs as equal (e.g., <code>EXAMPLE.COM</code> = <code>example.com</code>, <code>:443</code> omitted for HTTPS, query param order ignored).</p>'
			},
			{
				question: 'Does query parameter order matter in comparison?',
				answer: '<p>For <strong>semantic comparison</strong>, no. <code>?a=1&b=2</code> equals <code>?b=2&a=1</code> because parameter order doesn\'t affect meaning. For <strong>exact comparison</strong>, order matters and they\'ll be flagged as different.</p>'
			},
			{
				question: 'Can I compare URLs with different protocols?',
				answer: '<p>Yes! The tool will highlight that <code>http://</code> and <code>https://</code> are <strong>different protocols</strong>. While the rest of the URL may be identical, protocol differences often indicate security upgrades or configuration changes.</p>'
			},
			{
				question: 'How are missing query parameters handled?',
				answer: '<p>Missing parameters are shown as <strong>added</strong> or <strong>removed</strong>. If URL 1 has <code>?a=1&b=2</code> and URL 2 has only <code>?a=1</code>, the tool shows that <code>b</code> was removed.</p>'
			},
			{
				question: 'Does comparison normalize URLs first?',
				answer: '<p>You can choose! For <strong>semantic comparison</strong>, URLs are normalized (lowercase host, sorted params). For <strong>exact comparison</strong>, URLs are compared as-is. Use semantic mode to ignore formatting differences.</p>'
			}
		],
		relatedTools: [
			{ name: 'URL Normalizer', path: '/url/normalizer', description: 'Normalize before comparing' },
			{ name: 'URL Validator', path: '/url/validator', description: 'Validate both URLs' },
			{ name: 'Text Diff', path: '/text/diff', description: 'Text-based comparison' },
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse query params' }
		]
	},

	'json-converter': {
		features: [
			'Convert query strings to JSON objects',
			'Convert JSON objects to query strings',
			'Array support: repeated params become arrays in JSON',
			'Handle nested parameters and objects',
			'Auto-decode: URL-encoded values are decoded',
			'Bidirectional: convert either direction'
		],
		useCases: [
			'Convert form data to JSON for APIs',
			'Transform API responses to query strings',
			'Debug request/response formats',
			'Migrate between URL and JSON formats',
			'Build query strings from JSON config'
		],
		concept: {
			title: 'Query String and JSON Conversion',
			content: `
				<p><strong>Query string to JSON conversion</strong> transforms URL parameters into structured JSON objects, and vice versa. This is useful for API development and data transformation.</p>
				
				<p><strong>Query to JSON:</strong></p>
				<pre>?name=John&age=25&tags[]=red&tags[]=blue

↓

{
  "name": "John",
  "age": "25",
  "tags": ["red", "blue"]
}</pre>
				
				<p><strong>JSON to Query:</strong></p>
				<pre>{
  "search": "javascript",
  "filters": { "lang": "en", "year": 2024 }
}

↓

?search=javascript&filters[lang]=en&filters[year]=2024</pre>
				
				<p><strong>Features:</strong></p>
				<ul>
					<li><strong>Array handling</strong> - tags[]=a&tags[]=b or tags=a&tags=b</li>
					<li><strong>Nested objects</strong> - user[name]=John&user[age]=25</li>
					<li><strong>Auto encoding</strong> - Values are URL-encoded automatically</li>
				</ul>
			`
		},
		examples: [
			{
				label: 'Simple query to JSON',
				code: 'Query: ?name=John&age=25&city=NYC\n\nJSON:\n{\n  "name": "John",\n  "age": "25",\n  "city": "NYC"\n}',
				isValid: true
			},
			{
				label: 'Array parameters',
				code: 'Query: ?tags[]=javascript&tags[]=typescript\n\nJSON:\n{\n  "tags": ["javascript", "typescript"]\n}',
				isValid: true
			},
			{
				label: 'JSON to query string',
				code: 'JSON: { "q": "Hello World", "limit": 10 }\n\nQuery: ?q=Hello%20World&limit=10',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How are arrays represented in query strings?',
				answer: '<p>Arrays use <strong>repeated keys</strong> (<code>?tag=red&tag=blue</code>) or <strong>bracket notation</strong> (<code>?tag[]=red&tag[]=blue</code>). The converter supports both formats and outputs consistent JSON arrays: <code>{"tag": ["red", "blue"]}</code>.</p>'
			},
			{
				question: 'Can I convert nested JSON objects to query strings?',
				answer: '<p>Yes! Nested objects use <strong>bracket notation</strong>: <code>{"user": {"name": "John", "age": 25}}</code> becomes <code>?user[name]=John&user[age]=25</code>. This is common in PHP-style query strings and form submissions.</p>'
			},
			{
				question: 'Are values URL-encoded automatically?',
				answer: '<p><strong>Yes.</strong> When converting JSON to query strings, special characters are URL-encoded. "Hello World" becomes <code>Hello%20World</code>. When converting query to JSON, values are automatically decoded.</p>'
			},
			{
				question: 'What happens to empty values?',
				answer: '<p>Empty values in query strings (<code>?key=</code>) are converted to empty strings in JSON (<code>{"key": ""}</code>). In reverse, empty JSON strings become <code>?key=</code>. <code>null</code> values are skipped.</p>'
			},
			{
				question: 'Does JSON to query preserve object order?',
				answer: '<p>JavaScript objects are <strong>unordered</strong> by spec, but modern engines preserve insertion order. The converter respects JSON key order when generating query strings, but query parameter order doesn\'t affect functionality.</p>'
			}
		],
		relatedTools: [
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Parse query parameters' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format JSON output' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build query strings' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Encode query values' }
		]
	},

	'length-checker': {
		features: [
			'Check URL length in characters and bytes',
			'Browser and server limit warnings',
			'Component-level size breakdown',
			'Real-time length calculation',
			'Recommendations for long URLs',
			'Copy URL statistics'
		],
		useCases: [
			'Avoid "URL too long" errors',
			'Validate URLs before HTTP requests',
			'Check GET request URL limits',
			'Optimize tracking URLs',
			'Debug 414 status code errors'
		],
		concept: {
			title: 'URL Length Limits and Best Practices',
			content: `
				<p><strong>URL length limits</strong> vary by browser and server. Exceeding these limits causes "414 URI Too Long" errors or request failures.</p>
				
				<p><strong>Common limits:</strong></p>
				<ul>
					<li><strong>URL spec</strong> - No official limit, but practical limits exist</li>
					<li><strong>Browsers</strong> - Chrome/Safari: ~2MB, Firefox: ~65K, IE: 2KB</li>
					<li><strong>Servers</strong> - Apache: 8KB (default), Nginx: 4KB-8KB, IIS: 16KB</li>
					<li><strong>CDNs</strong> - CloudFlare: 16KB, Akamai: varies</li>
					<li><strong>Best practice</strong> - Keep URLs under 2,000 characters</li>
				</ul>
				
				<p><strong>Common causes of long URLs:</strong></p>
				<ul>
					<li>Many query parameters (analytics, tracking, filters)</li>
					<li>Base64-encoded data in URLs</li>
					<li>Long search queries</li>
					<li>Excessive nesting in paths</li>
				</ul>
				
				<p><strong>Solutions:</strong> Use POST instead of GET, shorten parameter names, remove unnecessary params, use URL shorteners, or store data server-side.</p>
			`
		},
		examples: [
			{
				label: 'Normal URL length',
				code: 'URL: https://example.com/api/users?id=123&sort=name\nLength: 50 characters\n✓ Well within limits',
				isValid: true
			},
			{
				label: 'Long tracking URL',
				code: 'URL: https://example.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale_2024&utm_content=hero_banner&utm_term=shoes&id=ABC123XYZ&ref=homepage\nLength: 180 characters\n✓ Safe, but consider shortening',
				isValid: true
			},
			{
				label: 'Dangerously long URL',
				code: 'URL with 3000+ characters due to Base64 data\n⚠ Warning: May exceed server limits\n→ Use POST or store data server-side',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What is the maximum URL length?',
				answer: '<p>There\'s <strong>no official limit</strong>, but practical limits exist. Browsers support 2KB-2MB, but servers often limit URLs to <strong>4KB-8KB</strong>. For maximum compatibility, keep URLs under <strong>2,000 characters</strong>.</p>'
			},
			{
				question: 'What happens if a URL is too long?',
				answer: '<p>The server returns <strong>414 URI Too Long</strong>, or the browser may refuse to send the request. Some proxies or CDNs silently truncate URLs, causing data loss. Always validate URL length before deployment.</p>'
			},
			{
				question: 'How can I shorten long URLs?',
				answer: '<p><strong>(1)</strong> Use abbreviations for parameter names, <strong>(2)</strong> remove unnecessary params, <strong>(3)</strong> use POST instead of GET, <strong>(4)</strong> store data server-side with an ID, or <strong>(5)</strong> use URL shorteners like bit.ly.</p>'
			},
			{
				question: 'Should I count URL length in characters or bytes?',
				answer: '<p>Count in <strong>bytes</strong> for accuracy. Non-ASCII characters (é, 中) take multiple bytes when UTF-8 encoded. Servers enforce byte limits, not character limits. Our tool shows both.</p>'
			},
			{
				question: 'Are URL fragments (#hash) counted in length limits?',
				answer: '<p><strong>No.</strong> Fragments (<code>#section</code>) are <strong>client-side only</strong> and aren\'t sent to the server in HTTP requests. They don\'t count toward server URL limits, but browsers still have total URL limits.</p>'
			}
		],
		relatedTools: [
			{ name: 'Query Parser', path: '/url/query-parser', description: 'Analyze query length' },
			{ name: 'URL Builder', path: '/url/builder', description: 'Build optimized URLs' },
			{ name: 'URL Encode/Decode', path: '/url/encode-decode', description: 'Check encoded length' },
			{ name: 'URL Normalizer', path: '/url/normalizer', description: 'Remove redundant parts' }
		],
		tips: [
			'Use URL shorteners for sharing',
			'Move large data to POST request body',
			'Use abbreviated parameter names',
			'Compress repeated values into arrays'
		]
	}
};

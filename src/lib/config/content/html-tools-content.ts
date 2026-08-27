interface HtmlToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
	howTo?: {
		lede: string[];
		steps: string[];
		breaks: string[];
	};
}

export const htmlToolsContent: Record<string, HtmlToolContent> = {
	'formatter': {
		features: [
			'Format and beautify HTML with proper indentation',
			'Minify HTML to reduce file size',
			'Configurable indentation (2 or 4 spaces)',
			'Toggle attribute formatting (one per line)',
			'Strip HTML comments option',
			'Instant formatting with live preview'
		],
		useCases: [
			'Clean up messy HTML from email templates or CMS exports',
			'Prepare HTML for production by minifying',
			'Make minified HTML readable for debugging',
			'Standardize code formatting across a project',
			'Format HTML before committing to version control'
		],
		concept: {
			title: 'HTML Formatting and Minification',
			content: `<p>HTML formatting is the process of organizing HTML code with proper indentation and line breaks to improve readability. Properly formatted HTML makes it easier to understand document structure, debug issues, and maintain code.</p>
			
			<p><strong>Beautifying</strong> adds whitespace, indentation, and line breaks to make code human-readable. This is useful during development when you need to inspect and modify HTML.</p>
			
			<p><strong>Minification</strong> removes all unnecessary whitespace, comments, and line breaks to reduce file size. Minified HTML loads faster but is harder to read. It's typically used in production to optimize page load times.</p>
			
			<p>Key formatting considerations:</p>
			<ul>
				<li><strong>Indentation:</strong> Nested elements are indented to show hierarchy</li>
				<li><strong>Attributes:</strong> Can be single-line or one-per-line for readability</li>
				<li><strong>Self-closing tags:</strong> Properly formatted with or without trailing slash</li>
				<li><strong>Comments:</strong> Can be preserved or stripped based on needs</li>
			</ul>`
		},
		examples: [
			{
				label: 'Unformatted HTML',
				code: '<div class="container"><h1>Title</h1><p>Content here</p></div>',
				isValid: true
			},
			{
				label: 'Beautified HTML',
				code: `<div class="container">
  <h1>Title</h1>
  <p>Content here</p>
</div>`,
				isValid: true
			},
			{
				label: 'Email Template Cleanup',
				code: '<table style="width:100%"><tr><td>Cell</td></tr></table>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Does formatting change how my HTML renders?',
				answer: 'No, HTML formatting only affects whitespace, which browsers ignore in most contexts. Your page will look identical after formatting or minification.'
			},
			{
				question: 'Should I minify HTML for production?',
				answer: 'Yes, minifying HTML reduces file size and improves page load times. Most build tools (Webpack, Vite, Parcel) include HTML minification automatically.'
			},
			{
				question: 'What\'s the difference between 2-space and 4-space indentation?',
				answer: '2-space indentation is more compact, while 4-space is more readable. Choose based on your project\'s style guide or personal preference. Most modern tools use 2 spaces for HTML.'
			},
			{
				question: 'Will formatting fix HTML errors?',
				answer: 'No, formatting only adjusts whitespace and indentation. It won\'t fix unclosed tags, invalid nesting, or other structural errors. Use the HTML Validator tool to find errors.'
			},
			{
				question: 'Can I preserve comments while formatting?',
				answer: 'Yes, you can toggle the "Remove comments" option to keep or strip HTML comments. Keep comments for documentation, remove them for production minification.'
			}
		],
		relatedTools: [
			{ name: 'HTML Validator', path: '/html/validator', description: 'Check for HTML errors and invalid syntax' },
			{ name: 'HTML to JSON', path: '/html/to-json', description: 'Convert HTML structure to JSON' },
			{ name: 'DOM Visualizer', path: '/html/dom-visualizer', description: 'Visualize HTML DOM tree structure' },
			{ name: 'Attribute Cleaner', path: '/html/attribute-cleaner', description: 'Remove unwanted HTML attributes' }
		],
		tips: [
			'Use prettify mode during development for readability, then minify before deploying to production',
			'Enable "one attribute per line" for complex elements with many attributes to make git diffs clearer',
			'Keep comments in development builds for documentation, remove them in production for smaller file sizes',
			'Format HTML before committing to version control to reduce merge conflicts and improve code review'
		]
	},
	'validator': {
		features: [
			'Detect unclosed HTML tags',
			'Check for invalid tag nesting',
			'Find duplicate ID attributes',
			'Identify self-closing tag errors',
			'Validate attribute syntax',
			'Real-time validation with error highlighting'
		],
		useCases: [
			'Debug HTML rendering issues in browsers',
			'Validate HTML before deploying to production',
			'Check email template HTML for compatibility',
			'Find structural errors in scraped or generated HTML',
			'Ensure accessibility compliance with proper structure'
		],
		concept: {
			title: 'HTML Validation and Error Detection',
			content: `<p>HTML validation is the process of checking HTML code against standard rules to ensure it's well-formed and error-free. Valid HTML renders consistently across browsers and is essential for accessibility and SEO.</p>
			
			<p><strong>Common HTML errors include:</strong></p>
			<ul>
				<li><strong>Unclosed tags:</strong> Opening tags like <code>&lt;div&gt;</code> without matching <code>&lt;/div&gt;</code></li>
				<li><strong>Invalid nesting:</strong> Block elements inside inline elements (e.g., <code>&lt;a&gt;&lt;div&gt;&lt;/div&gt;&lt;/a&gt;</code>)</li>
				<li><strong>Duplicate IDs:</strong> Multiple elements with the same <code>id</code> attribute</li>
				<li><strong>Self-closing errors:</strong> Non-void elements self-closed like <code>&lt;div /&gt;</code></li>
				<li><strong>Missing required attributes:</strong> <code>&lt;img&gt;</code> without <code>alt</code> or <code>src</code></li>
			</ul>
			
			<p><strong>Why validation matters:</strong></p>
			<ul>
				<li><strong>Browser compatibility:</strong> Valid HTML renders consistently across all browsers</li>
				<li><strong>Accessibility:</strong> Screen readers rely on proper HTML structure</li>
				<li><strong>SEO:</strong> Search engines prefer well-formed HTML</li>
				<li><strong>Debugging:</strong> Validation helps identify the root cause of rendering issues</li>
			</ul>
			
			<p>Note: This validator performs basic structural checks. For full HTML5 specification compliance, use the W3C Markup Validation Service.</p>`
		},
		examples: [
			{
				label: 'Valid HTML',
				code: '<div id="container"><p>Hello World</p></div>',
				isValid: true
			},
			{
				label: 'Unclosed Tag (Invalid)',
				code: '<div id="container"><p>Hello World</div>',
				isValid: false
			},
			{
				label: 'Duplicate ID (Invalid)',
				code: '<div id="box">A</div><div id="box">B</div>',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'Why does my HTML work in browsers but shows errors here?',
				answer: 'Modern browsers are very forgiving and auto-correct many HTML errors. However, relying on browser error correction can lead to unexpected behavior, accessibility issues, and SEO problems.'
			},
			{
				question: 'What\'s the difference between this and W3C validator?',
				answer: 'This tool performs basic structural validation (unclosed tags, nesting, duplicate IDs). The W3C validator checks full HTML5 specification compliance including semantic elements, attributes, and ARIA roles.'
			},
			{
				question: 'Can invalid HTML affect SEO?',
				answer: 'Yes, search engines prefer well-formed HTML. While they can parse invalid HTML, errors may prevent them from understanding your content structure, affecting rankings.'
			},
			{
				question: 'Should I validate HTML in email templates?',
				answer: 'Absolutely! Email clients are less forgiving than browsers. Invalid HTML can break layouts in Outlook, Gmail, or mobile email apps. Always validate email template HTML.'
			},
			{
				question: 'Are self-closing tags like <div /> valid?',
				answer: 'No, in HTML5 only void elements (img, br, hr, input, etc.) can be self-closing. Non-void elements like div, span, or p must have explicit closing tags.'
			}
		],
		relatedTools: [
			{ name: 'HTML Formatter', path: '/html/formatter', description: 'Format and beautify HTML code' },
			{ name: 'Tag Counter', path: '/html/tag-counter', description: 'Count HTML tag occurrences' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific HTML elements' },
			{ name: 'DOM Visualizer', path: '/html/dom-visualizer', description: 'Visualize HTML structure as a tree' }
		],
		tips: [
			'Validate HTML early in development to catch errors before they compound',
			'Use proper semantic HTML5 elements (header, nav, article, section) for better accessibility and SEO',
			'Always include alt attributes on images for accessibility—validators will remind you',
			'Keep IDs unique and use classes for styling multiple elements with the same style'
		]
	},
	'to-json': {
		features: [
			'Convert HTML DOM structure to JSON object',
			'Preserve element hierarchy and nesting',
			'Include all attributes in JSON output',
			'Extract text content from elements',
			'Pretty-print JSON with indentation',
			'Copy JSON output instantly'
		],
		useCases: [
			'Parse HTML for data extraction in Node.js or Python',
			'Convert scraped HTML to structured JSON data',
			'Analyze HTML structure programmatically',
			'Create JSON representations of email templates',
			'Feed HTML data to APIs expecting JSON format'
		],
		concept: {
			title: 'HTML to JSON Conversion',
			content: `<p>Converting HTML to JSON transforms the Document Object Model (DOM) tree structure into a JavaScript Object Notation (JSON) representation. This makes HTML data easier to process programmatically in various programming languages.</p>
			
			<p><strong>JSON structure for HTML:</strong></p>
			<ul>
				<li><strong>tagName:</strong> The HTML element name (e.g., "div", "p", "a")</li>
				<li><strong>attributes:</strong> Object containing all element attributes (id, class, href, etc.)</li>
				<li><strong>children:</strong> Array of child elements (recursive structure)</li>
				<li><strong>textContent:</strong> Text content inside the element (if any)</li>
			</ul>
			
			<p><strong>Use cases for HTML-to-JSON:</strong></p>
			<ul>
				<li><strong>Web scraping:</strong> Extract data from websites in a structured format</li>
				<li><strong>API integration:</strong> Send HTML structure to APIs that expect JSON</li>
				<li><strong>Data analysis:</strong> Analyze HTML patterns using JSON query tools like jq</li>
				<li><strong>Testing:</strong> Compare HTML structures by comparing JSON diffs</li>
				<li><strong>CMS migration:</strong> Convert legacy HTML templates to JSON for modern systems</li>
			</ul>
			
			<p>The resulting JSON can be processed with any programming language that supports JSON parsing, making it a universal format for HTML data exchange.</p>`
		},
		examples: [
			{
				label: 'Simple HTML',
				code: '<div class="box"><p>Hello</p></div>',
				isValid: true
			},
			{
				label: 'With Attributes',
				code: '<a href="https://example.com" target="_blank">Link</a>',
				isValid: true
			},
			{
				label: 'Nested Structure',
				code: '<ul><li>Item 1</li><li>Item 2</li></ul>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I convert JSON back to HTML?',
				answer: 'Yes, but you\'ll need a separate JSON-to-HTML converter. The reverse conversion is straightforward—iterate through the JSON object and rebuild HTML tags with attributes and children.'
			},
			{
				question: 'Does this preserve inline styles?',
				answer: 'Yes, all attributes including style, class, and data-* attributes are preserved in the JSON output as key-value pairs in the attributes object.'
			},
			{
				question: 'How are comments handled?',
				answer: 'HTML comments are typically excluded from the JSON output since they\'re not part of the DOM element tree. Only actual HTML elements with tags are converted.'
			},
			{
				question: 'Can I use this for web scraping?',
				answer: 'Yes, converting HTML to JSON makes it easier to extract specific data using JSON query tools or programming language JSON parsers. However, respect robots.txt and website terms of service.'
			},
			{
				question: 'Is the JSON output always valid?',
				answer: 'Yes, the output is always valid JSON. However, if your input HTML is malformed, the resulting JSON structure may not represent the intended hierarchy.'
			}
		],
		relatedTools: [
			{ name: 'HTML Validator', path: '/html/validator', description: 'Validate HTML before conversion' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific elements from HTML' },
			{ name: 'DOM Visualizer', path: '/html/dom-visualizer', description: 'Visualize HTML structure visually' },
			{ name: 'Text Extractor', path: '/html/text-extractor', description: 'Extract only text content from HTML' }
		]
	},
	'text-extractor': {
		features: [
			'Strip all HTML tags from content',
			'Extract plain text content only',
			'Preserve or remove line breaks',
			'Decode HTML entities (e.g., &amp; → &)',
			'Clean extra whitespace',
			'Copy extracted text instantly'
		],
		useCases: [
			'Extract article content from HTML for analytics',
			'Get plain text from rich HTML emails',
			'Convert HTML blog posts to plain text for AI processing',
			'Remove formatting from copied HTML text',
			'Extract readable content from scraped web pages'
		],
		concept: {
			title: 'HTML Text Extraction',
			content: `<p>HTML text extraction is the process of removing all HTML markup and tags to retrieve only the readable text content. This is useful when you need the content without formatting, links, or structure.</p>
			
			<p><strong>What gets removed:</strong></p>
			<ul>
				<li><strong>All HTML tags:</strong> <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;a&gt;</code>, etc.</li>
				<li><strong>Attributes:</strong> <code>class</code>, <code>id</code>, <code>style</code>, <code>href</code>, etc.</li>
				<li><strong>Script and style content:</strong> JavaScript and CSS code (optional)</li>
				<li><strong>HTML comments:</strong> <code>&lt;!-- comment --&gt;</code></li>
			</ul>
			
			<p><strong>What gets preserved:</strong></p>
			<ul>
				<li><strong>Text content:</strong> All visible text between tags</li>
				<li><strong>Line breaks:</strong> Optionally preserve paragraph and line breaks</li>
				<li><strong>Decoded entities:</strong> <code>&amp;nbsp;</code> → space, <code>&amp;lt;</code> → <code>&lt;</code></li>
				<li><strong>Whitespace:</strong> Can be normalized or preserved</li>
			</ul>
			
			<p><strong>Common use cases:</strong></p>
			<ul>
				<li><strong>Content analysis:</strong> Word count, readability scores, keyword density</li>
				<li><strong>AI/ML processing:</strong> Feed clean text to language models</li>
				<li><strong>Search indexing:</strong> Extract searchable content from HTML</li>
				<li><strong>Data export:</strong> Convert HTML content to plain text files</li>
			</ul>`
		},
		examples: [
			{
				label: 'HTML with Links',
				code: '<p>Visit <a href="/about">our about page</a> for more info.</p>',
				isValid: true
			},
			{
				label: 'Formatted Text',
				code: '<div><strong>Bold</strong> and <em>italic</em> text</div>',
				isValid: true
			},
			{
				label: 'HTML Entities',
				code: '<p>5 &lt; 10 &amp; 10 &gt; 5</p>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will this preserve paragraph breaks?',
				answer: 'Yes, you can toggle the "Preserve line breaks" option to maintain paragraph structure. Block-level elements like <p>, <div>, and <br> will be converted to line breaks.'
			},
			{
				question: 'How are HTML entities handled?',
				answer: 'HTML entities like &amp;nbsp;, &amp;lt;, &amp;gt;, and &amp;quot; are automatically decoded to their corresponding characters (space, <, >, ") in the output.'
			},
			{
				question: 'Does this remove script and style content?',
				answer: 'Yes, the contents of <script> and <style> tags are removed by default since they\'re not visible text content. Only readable text is extracted.'
			},
			{
				question: 'Can I use this to clean copied HTML text?',
				answer: 'Absolutely! When you copy text from a website, it often includes HTML formatting. Paste it here to get clean, plain text without any markup.'
			},
			{
				question: 'Will this work with email HTML?',
				answer: 'Yes, this is perfect for extracting plain text from HTML emails. You\'ll get the email content without tables, inline styles, and tracking pixels.'
			}
		],
		relatedTools: [
			{ name: 'HTML Formatter', path: '/html/formatter', description: 'Format HTML before text extraction' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific HTML elements' },
			{ name: 'HTML to JSON', path: '/html/to-json', description: 'Convert HTML to structured JSON' },
			{ name: 'Attribute Cleaner', path: '/html/attribute-cleaner', description: 'Remove HTML attributes selectively' }
		],
		tips: [
			'Enable "Preserve line breaks" to maintain paragraph structure for readability',
			'Use this to get word counts from HTML content—paste HTML, extract text, then use Word Count tool',
			'Perfect for cleaning text copied from websites before pasting into documents or emails',
			'Combine with Element Extractor to first isolate specific sections, then extract text from them'
		]
	},
	'element-extractor': {
		features: [
			'Extract all links (anchor tags) from HTML',
			'Extract all images with src and alt attributes',
			'Extract meta tags for SEO analysis',
			'Extract all scripts and their sources',
			'Filter by element type (links, images, meta, scripts)',
			'Export extracted elements as list or JSON'
		],
		useCases: [
			'Extract all links from a webpage for SEO audits',
			'Get all image URLs from HTML for downloading',
			'Extract meta tags to analyze page SEO',
			'Find all external scripts loaded by a page',
			'Build sitemaps from internal links'
		],
		concept: {
			title: 'HTML Element Extraction',
			content: `<p>HTML element extraction is the process of finding and isolating specific types of elements from HTML markup. This is useful for SEO analysis, content auditing, and data extraction.</p>
			
			<p><strong>Common elements to extract:</strong></p>
			<ul>
				<li><strong>Links (<code>&lt;a&gt;</code>):</strong> Extract hrefs for link audits, broken link checks, or sitemap generation</li>
				<li><strong>Images (<code>&lt;img&gt;</code>):</strong> Get image sources for downloading, alt text checking, or lazy loading analysis</li>
				<li><strong>Meta tags:</strong> Extract SEO-critical meta description, title, Open Graph, and Twitter Card tags</li>
				<li><strong>Scripts (<code>&lt;script&gt;</code>):</strong> Identify all JavaScript sources for security or performance audits</li>
			</ul>
			
			<p><strong>Use cases by element type:</strong></p>
			<ul>
				<li><strong>Links:</strong> SEO analysis, broken link detection, internal vs external link ratio</li>
				<li><strong>Images:</strong> Alt text audits for accessibility, image optimization checks</li>
				<li><strong>Meta tags:</strong> SEO optimization, social media preview analysis</li>
				<li><strong>Scripts:</strong> Third-party script audits, performance optimization</li>
			</ul>
			
			<p>Extracted elements can be exported as a list or JSON for further processing in spreadsheets, scripts, or SEO tools.</p>`
		},
		examples: [
			{
				label: 'HTML with Links',
				code: '<a href="/home">Home</a><a href="https://example.com">External</a>',
				isValid: true
			},
			{
				label: 'HTML with Images',
				code: '<img src="photo.jpg" alt="Photo"><img src="logo.png" alt="Logo">',
				isValid: true
			},
			{
				label: 'Meta Tags',
				code: '<meta name="description" content="Page description"><meta property="og:title" content="Title">',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I extract links from a live webpage?',
				answer: 'Not directly—paste the HTML source code here. To get HTML from a live page, right-click > "View Page Source" in your browser, then copy and paste it into this tool.'
			},
			{
				question: 'How do I differentiate internal vs external links?',
				answer: 'Internal links typically start with "/" (relative paths) or your domain name. External links have full URLs with different domains. You can filter the extracted list programmatically.'
			},
			{
				question: 'Can I extract custom data attributes?',
				answer: 'This tool focuses on standard elements (links, images, meta, scripts). For custom attributes or elements, use the HTML to JSON tool for full DOM extraction.'
			},
			{
				question: 'Why extract meta tags?',
				answer: 'Meta tags control how your page appears in search results and social media. Extracting them helps audit SEO compliance, ensure proper Open Graph tags, and verify Twitter Card metadata.'
			},
			{
				question: 'Can I export the extracted data?',
				answer: 'Yes, the tool shows extracted elements in a readable format. You can copy the output and paste it into spreadsheets or use the JSON export option for programmatic processing.'
			}
		],
		relatedTools: [
			{ name: 'HTML Validator', path: '/html/validator', description: 'Validate HTML structure first' },
			{ name: 'HTML to JSON', path: '/html/to-json', description: 'Convert entire HTML to JSON' },
			{ name: 'Text Extractor', path: '/html/text-extractor', description: 'Extract only text content' },
			{ name: 'Tag Counter', path: '/html/tag-counter', description: 'Count HTML tag occurrences' }
		],
		tips: [
			'Use this for SEO audits—extract all links and check for broken links or incorrect hrefs',
			'Extract images to audit alt text for accessibility compliance',
			'Check meta tags to ensure proper Open Graph and Twitter Card implementations for social sharing',
			'Combine with URL tools to validate and analyze all extracted links at once'
		]
	},
	'tag-counter': {
		features: [
			'Count occurrences of each HTML tag',
			'Show tag distribution as a table',
			'Visualize tag usage with percentages',
			'Sort by tag name or frequency',
			'Identify most/least used tags',
			'Export tag counts as CSV or JSON'
		],
		useCases: [
			'Analyze HTML structure and complexity',
			'Audit semantic HTML usage (<article>, <section>, etc.)',
			'Find excessive use of <div> or <span> tags',
			'Check table-based layouts vs modern CSS layouts',
			'Optimize HTML by identifying redundant tags'
		],
		concept: {
			title: 'HTML Tag Analysis',
			content: `<p>HTML tag counting analyzes the distribution and frequency of HTML elements in a document. This helps understand document structure, identify over-reliance on certain tags, and improve semantic HTML usage.</p>
			
			<p><strong>Why analyze HTML tags?</strong></p>
			<ul>
				<li><strong>Semantic HTML:</strong> Ensure proper use of HTML5 semantic elements like <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code></li>
				<li><strong>Div soup detection:</strong> Excessive <code>&lt;div&gt;</code> tags may indicate poor semantic structure</li>
				<li><strong>Table abuse:</strong> High <code>&lt;table&gt;</code> counts may indicate layout tables instead of CSS layouts</li>
				<li><strong>Accessibility:</strong> Check for proper heading hierarchy (h1-h6) and list usage</li>
			</ul>
			
			<p><strong>Insights from tag counts:</strong></p>
			<ul>
				<li><strong>High div/span counts:</strong> May need refactoring with semantic HTML5 elements</li>
				<li><strong>Missing semantic tags:</strong> Opportunities to improve SEO and accessibility</li>
				<li><strong>Table-heavy HTML:</strong> Consider modernizing with CSS Grid or Flexbox</li>
				<li><strong>Heading distribution:</strong> Ensure proper h1-h6 hierarchy for SEO</li>
			</ul>
			
			<p>Tag analysis is especially useful for auditing legacy HTML, comparing template structures, and ensuring best practices.</p>`
		},
		examples: [
			{
				label: 'Simple Page Structure',
				code: '<div><header><h1>Title</h1></header><main><p>Content</p></main></div>',
				isValid: true
			},
			{
				label: 'Div-Heavy HTML',
				code: '<div><div><div><div>Too many divs!</div></div></div></div>',
				isValid: true
			},
			{
				label: 'Semantic HTML5',
				code: '<article><header><h2>Post</h2></header><section><p>Text</p></section></article>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What\'s a good div-to-semantic-tag ratio?',
				answer: 'There\'s no strict rule, but if divs make up >50% of your tags, consider using semantic HTML5 elements like <article>, <section>, <nav>, <header>, <footer>, and <aside> instead.'
			},
			{
				question: 'Why should I use semantic HTML?',
				answer: 'Semantic HTML improves accessibility (screen readers understand page structure), SEO (search engines better understand content hierarchy), and maintainability (code is self-documenting).'
			},
			{
				question: 'Can I compare tag counts between pages?',
				answer: 'Yes, run the tool on different pages and export the results as JSON or CSV. Then compare the distributions to identify structural differences or consistency issues.'
			},
			{
				question: 'What if I have too many <table> tags?',
				answer: 'If tables are used for data, that\'s fine. If they\'re used for layout, consider refactoring to modern CSS Grid or Flexbox for better responsiveness and accessibility.'
			},
			{
				question: 'How many heading levels should I use?',
				answer: 'Use a logical hierarchy: one <h1> per page, <h2> for main sections, <h3> for subsections, etc. Avoid skipping levels (e.g., h1 → h3) for better accessibility.'
			}
		],
		relatedTools: [
			{ name: 'HTML Validator', path: '/html/validator', description: 'Validate HTML structure and nesting' },
			{ name: 'DOM Visualizer', path: '/html/dom-visualizer', description: 'Visualize HTML tree structure' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific HTML elements' },
			{ name: 'HTML to JSON', path: '/html/to-json', description: 'Convert HTML to structured JSON' }
		]
	},
	'attribute-cleaner': {
		features: [
			'Remove inline styles from HTML',
			'Strip data attributes (data-*)',
			'Remove all classes or specific class names',
			'Clean ID attributes',
			'Remove event handlers (onclick, onload, etc.)',
			'Selective attribute removal with preview'
		],
		useCases: [
			'Clean up HTML copied from Word or Google Docs',
			'Remove inline styles before applying CSS frameworks',
			'Strip tracking attributes from email HTML',
			'Prepare HTML for sanitization or security',
			'Clean legacy HTML with outdated attributes'
		],
		concept: {
			title: 'HTML Attribute Cleaning',
			content: `<p>HTML attribute cleaning is the process of selectively removing attributes from HTML elements. This is useful for cleaning up messy HTML, removing inline styles, stripping tracking code, or preparing HTML for sanitization.</p>
			
			<p><strong>Common attributes to remove:</strong></p>
			<ul>
				<li><strong>style:</strong> Inline CSS styles that should be in stylesheets</li>
				<li><strong>data-*:</strong> Custom data attributes used for JavaScript or tracking</li>
				<li><strong>class:</strong> CSS classes (remove all or specific ones)</li>
				<li><strong>id:</strong> Element identifiers (when standardizing HTML)</li>
				<li><strong>Event handlers:</strong> <code>onclick</code>, <code>onload</code>, etc. (security risk)</li>
			</ul>
			
			<p><strong>Why clean attributes?</strong></p>
			<ul>
				<li><strong>Security:</strong> Remove potentially malicious inline scripts and event handlers</li>
				<li><strong>Performance:</strong> Smaller HTML file size without bloated inline styles</li>
				<li><strong>Maintainability:</strong> Separate styling from structure (HTML vs CSS)</li>
				<li><strong>Standardization:</strong> Remove vendor-specific or deprecated attributes</li>
			</ul>
			
			<p><strong>Use cases:</strong></p>
			<ul>
				<li><strong>Rich text cleanup:</strong> Remove formatting from WYSIWYG editors</li>
				<li><strong>Email templates:</strong> Strip tracking pixels and analytics attributes</li>
				<li><strong>Content sanitization:</strong> Remove potentially dangerous attributes before displaying user-generated HTML</li>
				<li><strong>CSS refactoring:</strong> Remove inline styles to migrate to external CSS</li>
			</ul>`
		},
		examples: [
			{
				label: 'HTML with Inline Styles',
				code: '<div style="color: red; font-size: 16px;">Styled text</div>',
				isValid: true
			},
			{
				label: 'Tracking Attributes',
				code: '<a href="/page" data-track="click" data-analytics="btn-click">Link</a>',
				isValid: true
			},
			{
				label: 'Event Handlers',
				code: '<button onclick="alert(\'clicked\')">Click me</button>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will this break my page styling?',
				answer: 'If you remove inline styles without external CSS, yes. Make sure you have CSS stylesheets to replace the inline styles before removing them.'
			},
			{
				question: 'Why remove data attributes?',
				answer: 'Data attributes are often used for tracking, analytics, or JavaScript functionality. Removing them can improve privacy, reduce HTML size, or prepare HTML for different contexts.'
			},
			{
				question: 'Can I remove specific classes only?',
				answer: 'Yes, most attribute cleaners allow you to specify which classes to remove (e.g., all Bootstrap classes) while keeping others. This tool removes all or none—for selective removal, use find/replace.'
			},
			{
				question: 'Why remove event handlers like onclick?',
				answer: 'Inline event handlers are a security risk (XSS attacks) and violate Content Security Policy (CSP). It\'s best practice to attach events via JavaScript instead of inline attributes.'
			},
			{
				question: 'Can I clean HTML from Word or Google Docs?',
				answer: 'Yes! HTML copied from Word or Google Docs often contains excessive inline styles, classes, and proprietary attributes. Cleaning them gives you cleaner, more manageable HTML.'
			}
		],
		relatedTools: [
			{ name: 'HTML Formatter', path: '/html/formatter', description: 'Format HTML after cleaning attributes' },
			{ name: 'HTML Validator', path: '/html/validator', description: 'Validate cleaned HTML structure' },
			{ name: 'Text Extractor', path: '/html/text-extractor', description: 'Extract plain text from HTML' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific elements' }
		],
		tips: [
			'Remove inline styles when migrating to CSS frameworks like Tailwind or Bootstrap',
			'Strip data-* attributes to remove tracking code and improve privacy',
			'Always remove event handlers like onclick for better security and CSP compliance',
			'Clean Word/Google Docs HTML before using it in web pages—it contains bloated proprietary markup'
		]
	},
	'dom-visualizer': {
		features: [
			'Paste markup and expand nodes in the tree',
			'Search by tag, `#id`, or `.class`',
			'Copy the CSS path off a node (`body > div.container > header > h1`)',
			'Count depth: more than about 5–7 levels is usually extra divs',
			'Find which `td` actually wraps the button in email HTML'
		],
		useCases: [
			'A selector "should work" and doesn\'t: the tree is the problem, not CSS',
			'Paste what the browser actually rendered, including framework wrappers',
			'Count nested divs Grid or Flex would replace',
			'Email HTML is tables inside tables; find the wrapping `td`'
		],
		concept: {
			title: 'The tree is the problem, not CSS',
			content: `<p>Nested HTML is easy to write and hard to see. If a selector "should work" and doesn't, the tree is the problem, not CSS.</p>
			<p>Paste the markup. Expand nodes. Search by tag, <code>#id</code>, or <code>.class</code>. Copy the path when you find the element you thought was a direct child.</p>
			<p>Paste what the browser actually rendered, including wrappers your framework injects. Copy the CSS path off a node (<code>body > div.container > header > h1</code>). That's the selector to debug. Count depth. More than about 5–7 levels is usually extra divs Grid or Flex would replace. Email HTML is tables inside tables. The tree is how you find which <code>td</code> actually wraps the button.</p>
			<p>The selector fails because of a wrapper you didn't paste. Visualize the rendered DOM, not the source snippet. Search only sees the paste. Shadow DOM and iframes won't show up here. Deep trees aren't invalid. They're why <code>div > div > div > span</code> is fragile.</p>`
		},
		examples: [
			{
				label: 'Simple Tree',
				code: '<div><header><h1>Title</h1></header><main><p>Content</p></main></div>',
				isValid: true
			},
			{
				label: 'Deep Nesting',
				code: '<nav><ul><li><a href="#">Link 1</a></li><li><a href="#">Link 2</a></li></ul></nav>',
				isValid: true
			},
			{
				label: 'Complex Structure',
				code: '<article><header><h2>Post</h2></header><section><p>Paragraph</p></section><footer>Footer</footer></article>',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does my selector fail?',
				answer: '<p>The selector fails because of a wrapper you didn\'t paste. Visualize the rendered DOM, not the source snippet. Paste what the browser actually rendered, including wrappers your framework injects.</p>'
			},
			{
				question: 'How do I get the CSS path?',
				answer: '<p>Copy the CSS path off a node (<code>body > div.container > header > h1</code>). That\'s the selector to debug. Copy the path when you find the element you thought was a direct child.</p>'
			},
			{
				question: 'How deep should the tree be?',
				answer: '<p>Count depth. More than about 5–7 levels is usually extra divs Grid or Flex would replace. Deep trees aren\'t invalid. They\'re why <code>div > div > div > span</code> is fragile.</p>'
			},
			{
				question: 'Does search see Shadow DOM or iframes?',
				answer: '<p>Search only sees the paste. Shadow DOM and iframes won\'t show up here. Search by tag, <code>#id</code>, or <code>.class</code>.</p>'
			},
			{
				question: 'How do I debug email HTML?',
				answer: '<p>Email HTML is tables inside tables. The tree is how you find which <code>td</code> actually wraps the button.</p>'
			}
		],
		commonMistakes: [
			'The selector fails because of a wrapper you didn\'t paste. Visualize the rendered DOM, not the source snippet.',
			'Search only sees the paste. Shadow DOM and iframes won\'t show up here.',
			'Deep trees aren\'t invalid. They\'re why `div > div > div > span` is fragile.'
		],
		howTo: {
			lede: [
				'Paste the markup. Expand nodes. Search by tag, `#id`, or `.class`. Copy the path when you find the element you thought was a direct child.'
			],
			steps: [
				'Paste what the browser actually rendered, including wrappers your framework injects.',
				'Copy the CSS path off a node (`body > div.container > header > h1`). That\'s the selector to debug.',
				'Count depth. More than about 5–7 levels is usually extra divs Grid or Flex would replace.',
				'Email HTML is tables inside tables. The tree is how you find which `td` actually wraps the button.'
			],
			breaks: [
				'The selector fails because of a wrapper you didn\'t paste. Visualize the rendered DOM, not the source snippet.',
				'Search only sees the paste. Shadow DOM and iframes won\'t show up here.',
				'Deep trees aren\'t invalid. They\'re why `div > div > div > span` is fragile.'
			]
		},
		relatedTools: [
			{ name: 'HTML Validator', path: '/html/validator', description: 'Validate HTML structure and nesting' },
			{ name: 'HTML to JSON', path: '/html/to-json', description: 'Export DOM as JSON data' },
			{ name: 'Tag Counter', path: '/html/tag-counter', description: 'Analyze tag usage distribution' },
			{ name: 'Element Extractor', path: '/html/element-extractor', description: 'Extract specific elements from DOM' }
		]
	}
};

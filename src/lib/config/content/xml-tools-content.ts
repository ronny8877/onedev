export interface XmlToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const xmlToolsContent: Record<string, XmlToolContent> = {
	formatter: {
		features: [
			'XML formatter and beautifier that pretty prints XML in your browser',
			'Choose 2-space or 4-space indent like other code formatters',
			'See the first XML parse error instead of rewriting broken input',
			'Keep the XML declaration, comments, attributes, and CDATA',
			'Copy or download formatted XML with one click',
			'Free XML pretty print online. Nothing is uploaded'
		],
		useCases: [
			'Pretty print minified XML from an API or SOAP response',
			'Format XML so a code review is readable',
			'Beautify an RSS feed, Maven POM, or Android layout',
			'Fix “one long line” XML before you debug it',
			'Prepare a sample XML file for a test'
		],
		concept: {
			title: 'What is an XML formatter (XML beautifier)?',
			content: `<p>An <strong>XML formatter</strong> (also called an XML beautifier or XML pretty printer) adds line breaks and indentation so you can read the tree. Search for “pretty print XML” or “format XML online” and this is the job: take compressed XML and make tags nest visually.</p>
<p class="mt-2">Formatting does not change the meaning of element-only XML. Parsers ignore extra spaces between tags. This tool parses in your browser, then writes the tree with a consistent indent. It will not invent a missing close tag. If the XML is invalid, you get the error instead of a guess.</p>
<p class="mt-2">Comments and CDATA are kept. Use this page as a free XML formatter online for SOAP, RSS, config files, and any well-formed XML. Nothing is uploaded.</p>`
		},
		examples: [
			{ label: 'Minified (valid)', code: '<root><item id="1">Hello</item></root>', isValid: true },
			{ label: 'Unclosed tag', code: '<root><item>Hello</root>', isValid: false },
			{ label: 'With declaration', code: '<?xml version="1.0" encoding="UTF-8"?>\n<root/>', isValid: true }
		],
		faqs: [
			{
				question: 'How do I pretty print XML online?',
				answer: '<p>Paste XML into this XML formatter, pick 2 or 4 spaces, and copy the result. That is the same as an XML beautifier or “XML pretty print” tool.</p>'
			},
			{
				question: 'Does formatting change the meaning of my XML?',
				answer: '<p>Not for element-only documents. Mixed content (text and child tags in the same parent) can lose extra spaces we treat as insignificant. If a schema cares about that whitespace, keep a copy of the original.</p>'
			},
			{
				question: 'Why did my comments disappear in another tool?',
				answer: '<p>Some converters round-trip through a data model that has no comment nodes. This formatter walks the DOM and writes comments back. JSON conversion will still drop them.</p>'
			},
			{
				question: 'Can I format a 20 MB dump?',
				answer: '<p>The work happens in this tab’s memory. Very large files can freeze the page. Split the document or use a local CLI (<code>xmllint --format</code>) for multi-megabyte logs.</p>'
			},
			{
				question: 'Is this the same as HTML pretty-print?',
				answer: '<p>No. HTML is parsed with an HTML parser that invents missing tags. XML is strict. A stray <code>&amp;</code> or unclosed tag is an error here.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Validator', path: '/xml/validator', description: 'Check syntax and see tree stats' },
			{ name: 'XML Minifier', path: '/xml/minifier', description: 'Strip whitespace for payloads' },
			{ name: 'XML to JSON', path: '/xml/to-json', description: 'Convert the tree to JSON' },
			{ name: 'XPath Tester', path: '/xml/xpath', description: 'Query nodes after you can read the tree' }
		],
		tips: [
			'Keep a copy of production XML before pretty-printing if a downstream system hashes the exact bytes.',
			'If the error mentions line 1 column 1, look for a UTF-8 BOM or HTML pasted by mistake.',
			'Use 2-space indent for diffs. 4-space indent is fine for reading, noisier in Git.'
		]
	},
	validator: {
		features: [
			'XML validator online: check if XML is valid as you type',
			'Find XML syntax errors with line and column when the parser reports them',
			'Count elements, attributes, text nodes, comments, and depth',
			'List namespace URIs on the document',
			'Validate XML files free in this browser, no upload',
			'Works for SOAP, RSS, SVG, Maven POMs, and generic XML'
		],
		useCases: [
			'Confirm a hand-edited config is well-formed before deploy',
			'See why an Android layout file failed to inflate',
			'Check an RSS or Atom feed after a CMS export',
			'Count how deep a nested SOAP body actually goes',
			'Catch a raw ampersand that should have been &amp;amp;'
		],
		concept: {
			title: 'How to check if XML is valid',
			content: `<p>An <strong>XML validator</strong> answers “is this XML legal?” This page checks <strong>well-formedness</strong>: tags nest, attributes are quoted, there is one root, special characters are escaped. That is what people mean when they search “validate XML” or “XML checker” for a paste they already have.</p>
<p class="mt-2"><strong>Schema validity</strong> (XSD, DTD) is a second step. A document can be well-formed and still miss a required element your API expects. We do not fetch remote DTDs or XSDs, on purpose: that would be a network call.</p>
<p class="mt-2">If you need schema checks, run them in CI with the official XSD. Use this free XML validator online to catch broken markup in the paste you already have.</p>`
		},
		examples: [
			{ label: 'Well-formed', code: '<note><to>Ada</to></note>', isValid: true },
			{ label: 'Mismatched tags', code: '<note><to>Ada</from></note>', isValid: false },
			{ label: 'Unescaped ampersand', code: '<a>Tom & Jerry</a>', isValid: false }
		],
		faqs: [
			{
				question: 'How do I validate XML online?',
				answer: '<p>Paste the XML into this XML validator. If tags do not match or a character is not escaped, you get the error. The file never leaves your browser.</p>'
			},
			{
				question: 'Does this download my company’s XSD?',
				answer: '<p>No. There is no network request. External entities and DTD fetches are not performed.</p>'
			},
			{
				question: 'Why is my HTML “invalid XML”?',
				answer: '<p>HTML allows unquoted attributes, omitted closes, and void tags like <code>&lt;br&gt;</code>. XML does not. Use the HTML validator for HTML.</p>'
			},
			{
				question: 'What about XXE?',
				answer: '<p>We parse in the browser and do not resolve external entities. Do not paste secrets into any site you do not trust. This tab still never sends the bytes to us.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Pretty-print after it parses' },
			{ name: 'XML Diff', path: '/xml/diff', description: 'Compare two well-formed documents' },
			{ name: 'XPath Tester', path: '/xml/xpath', description: 'Select nodes in a valid tree' }
		],
		tips: [
			'A raw & in text must be written as &amp;amp;. URLs with query strings are a common source.',
			'Attribute values need quotes. HTML habits (class=foo) fail here.',
			'Multiple root elements are invalid. Wrap them or split the file.'
		]
	},
	minifier: {
		features: [
			'Remove insignificant whitespace between tags',
			'Keep the XML declaration when present',
			'Preserve CDATA and comments',
			'Show before/after byte counts',
			'Copy or download the compact payload',
			'Runs locally so SOAP bodies with credentials are not uploaded'
		],
		useCases: [
			'Shrink an XML fixture used in tests',
			'Fit a SOAP example into a ticket without wrapping',
			'Compare compact vs pretty size before putting XML in a QR or SMS (rare, but it happens)',
			'Normalize documents before a byte-level hash',
			'Prepare a compact sample for an API mock'
		],
		concept: {
			title: 'When minifying XML is safe',
			content: `<p>Minifying XML deletes whitespace that sits between elements. Element-only trees (the usual API and config case) keep the same information set. Mixed content, <code>xml:space="preserve"</code>, and significant newlines in text nodes are the exceptions.</p>
<p class="mt-2">This minifier parses first. Broken XML is not “minified” into something worse. Comments stay, which is unlike some production minifiers. Strip comments yourself if you need a smaller secret-free sample.</p>`
		},
		examples: [
			{ label: 'Pretty input', code: '<a>\n  <b>1</b>\n</a>', isValid: true },
			{ label: 'Already compact', code: '<a><b>1</b></a>', isValid: true },
			{ label: 'Broken, will not minify', code: '<a><b>1</a>', isValid: false }
		],
		faqs: [
			{
				question: 'Will minifying break my signature?',
				answer: '<p>If a signature covers canonical XML, pretty vs minified already differs. If it covers raw bytes, any whitespace change invalidates it. Do not minify a signed envelope unless you re-sign.</p>'
			},
			{
				question: 'Are comments removed?',
				answer: '<p>No. Remove them in an editor if the comment is the secret.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Go back to readable indent' },
			{ name: 'XML Validator', path: '/xml/validator', description: 'Confirm it still parses' }
		],
		tips: [
			'Minify after you have a green validator result.',
			'Gzip of pretty XML and minified XML is often close. Minify for readability of the on-wire sample, not as a compression strategy.'
		]
	},
	'to-json': {
		features: [
			'XML to JSON converter that runs in this tab',
			'Convert XML to JSON instantly, no signup',
			'Attributes become @name keys, a common xml2js style',
			'Repeated sibling tags become JSON arrays',
			'Pretty-printed JSON you can copy or paste into a JSON formatter',
			'Comments are dropped on purpose. JSON has no comment node'
		],
		useCases: [
			'Convert XML to JSON for a frontend mock or Postman test',
			'Turn an RSS or SOAP-style payload into JSON',
			'Move XML config into a JSON-first pipeline',
			'Inspect a Maven POM as nested objects',
			'See how XML attributes look after conversion'
		],
		concept: {
			title: 'How to convert XML to JSON online',
			content: `<p>People search “XML to JSON converter” when they have an XML file and need JSON for JavaScript, an API, or a database. XML has attributes, mixed content, and namespaces. JSON has objects and arrays. Any converter picks a convention.</p>
<p class="mt-2">Here, attributes are prefixed with <code>@</code>, repeated tags become arrays, and a lone text child becomes a string or number. Paste XML, copy JSON. Nothing is uploaded. This is enough for most config and list documents. It is not a lossless round-trip of every XML detail.</p>`
		},
		examples: [
			{ label: 'Element with attribute', code: '<book id="1"><title>Go</title></book>', isValid: true },
			{ label: 'Repeating siblings become an array', code: '<list><i>a</i><i>b</i></list>', isValid: true },
			{ label: 'Not XML', code: '{"a":1}', isValid: false }
		],
		faqs: [
			{
				question: 'How do I convert XML to JSON?',
				answer: '<p>Paste XML into this XML to JSON converter and copy the JSON on the right. Use JSON to XML Converter if you need the other direction.</p>'
			},
			{
				question: 'Why is my single child sometimes an object and sometimes an array?',
				answer: '<p>One sibling stays a single value. Two or more of the same tag become an array. If a schema sometimes has one item, normalize in code after convert.</p>'
			},
			{
				question: 'Where did comments go?',
				answer: '<p>JSON cannot hold them. Use the formatter if you need comments kept.</p>'
			},
			{
				question: 'Can I go back to XML?',
				answer: '<p>Yes, JSON to XML understands <code>@</code> attributes and arrays of the same key. Mixed content and original namespace prefixes may not round-trip perfectly.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON to XML', path: '/xml/from-json', description: 'Convert the other direction' },
			{ name: 'XML to CSV', path: '/xml/to-csv', description: 'Flatten repeating records' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Pretty-print the result' }
		],
		tips: [
			'If you need a stable array, ensure the sample has at least two sibling tags of that name.',
			'Namespaces: check the tag names in the JSON. You may want to strip prefixes in your app.'
		]
	},
	'from-json': {
		features: [
			'Turn a JSON object or array into well-formed XML',
			'Keys starting with @ become attributes',
			'Arrays become repeated sibling elements',
			'Choose the root element name',
			'Configurable indent',
			'Runs locally. API dumps never leave the tab'
		],
		useCases: [
			'Build a test SOAP-like envelope from a JSON fixture',
			'Export app state as XML for a legacy importer',
			'Wrap a JSON array in a root so XML tools can parse it',
			'Generate Android-style nested resources from JSON',
			'Round-trip after XML to JSON for a sanity check'
		],
		concept: {
			title: 'How JSON keys become tags',
			content: `<p>Each object key becomes an element name after a sanitize pass (illegal characters become underscores). Arrays emit the same tag once per item. <code>@id</code> style keys become attributes. <code>#text</code> becomes character data.</p>
<p class="mt-2">JSON arrays at the top level need a root wrapper because XML allows only one document element. Set the root name to something your consumer expects (<code>items</code>, <code>catalog</code>).</p>`
		},
		examples: [
			{ label: 'Object with attribute', code: '{"@id":"1","title":"Go"}', isValid: true },
			{ label: 'Array needs a root', code: '[{"n":1},{"n":2}]', isValid: true },
			{ label: 'Invalid JSON', code: '{id:1}', isValid: false }
		],
		faqs: [
			{
				question: 'Why was my key renamed?',
				answer: '<p>XML names cannot start with a digit or contain spaces. We rewrite those characters so the output still parses.</p>'
			},
			{
				question: 'Do I get an XML declaration?',
				answer: '<p>Yes, UTF-8. Remove it if your host already wraps the payload.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML to JSON', path: '/xml/to-json', description: 'Convert XML back to JSON' },
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Pretty-print the result' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Fix the JSON first' }
		],
		tips: [
			'Use @keys for attributes if you plan to round-trip.',
			'Pick a root name that matches the target schema, not a generic "root", when you can.'
		]
	},
	'to-csv': {
		features: [
			'Flatten repeating child elements of the root into CSV rows',
			'Attributes become @column headers',
			'Nested children become path-like headers (parent/child)',
			'Proper CSV quoting for commas and quotes',
			'Download a .csv the spreadsheet can open',
			'Client-side only'
		],
		useCases: [
			'Export an XML product catalog to Excel',
			'Turn a list of <record> elements into a table',
			'Give a non-developer a spreadsheet from an XML dump',
			'Compare XML lists in a CSV diff tool',
			'Feed repeating XML records into a data tool that wants CSV'
		],
		concept: {
			title: 'Which nodes become rows',
			content: `<p>CSV is a table. XML is a tree. We look at the children of the root, pick the most common tag name as the row type, and flatten each of those elements. Nested tags become slash paths. That works well for catalogs, RSS item lists, and “array of records” documents.</p>
<p class="mt-2">A deeply irregular tree (every child a different shape) will produce sparse columns. If the records are not siblings of the root, wrap them or use XPath to extract first.</p>`
		},
		examples: [
			{ label: 'Catalog of books', code: '<c><b id="1"><t>A</t></b><b id="2"><t>B</t></b></c>', isValid: true },
			{ label: 'Single record still works', code: '<c><b id="1"><t>A</t></b></c>', isValid: true },
			{ label: 'Empty root', code: '<c/>', isValid: false }
		],
		faqs: [
			{
				question: 'Why are some columns empty?',
				answer: '<p>Not every record had that child. CSV still needs a column because another row did.</p>'
			},
			{
				question: 'Can I choose a different row element?',
				answer: '<p>This version uses the most common child of the root. Restructure the XML or use XPath if your rows live deeper.</p>'
			}
		],
		relatedTools: [
			{ name: 'CSV Viewer', path: '/csv/viewer', description: 'Open the result as a table' },
			{ name: 'CSV to XML', path: '/csv/to-xml', description: 'Go back to XML' },
			{ name: 'XPath Tester', path: '/xml/xpath', description: 'Extract a node set first' }
		],
		tips: [
			'Put the repeating records directly under the root for the cleanest table.',
			'Excel may need a UTF-8 BOM for non-ASCII. This download is UTF-8 without BOM.'
		]
	},
	escape: {
		features: [
			'Escape & < > " \' for XML text or attributes',
			'Unescape named and numeric character references',
			'Switch between escape and unescape',
			'Preview the result immediately',
			'Copy the safe string into a document or code',
			'No server round-trip'
		],
		useCases: [
			'Put a URL with query string into an XML text node',
			'Embed a snippet of code in a docbook or config value',
			'Undo &amp;amp;lt; chains from double-escaped logs',
			'Prepare attribute values that contain quotes',
			'Explain to a teammate why Tom &amp; Jerry broke the parser'
		],
		concept: {
			title: 'The five characters XML reserves',
			content: `<p>In character data, <code>&amp;</code> and <code>&lt;</code> must be escaped. <code>&gt;</code> is often escaped for symmetry. In attributes, quotes need <code>&amp;quot;</code> or <code>&amp;apos;</code> depending on the delimiter.</p>
<p class="mt-2">Numeric references like <code>&amp;#169;</code> and <code>&amp;#xA9;</code> decode to Unicode. Unescape applies named entities we listed plus numeric forms. HTML-only names like <code>&amp;nbsp;</code> are not XML unless a DTD defined them.</p>`
		},
		examples: [
			{ label: 'Needs escape', code: 'Tom & Jerry <show>', isValid: false },
			{ label: 'Escaped', code: 'Tom &amp; Jerry &lt;show&gt;', isValid: true },
			{ label: 'Numeric entity', code: '&#x41;', isValid: true }
		],
		faqs: [
			{
				question: 'Should I escape inside CDATA?',
				answer: '<p>No. CDATA is raw except for the sequence <code>]]&gt;</code>. Do not double-escape there.</p>'
			},
			{
				question: 'Is this HTML entity encoding?',
				answer: '<p>Close, but HTML has a much larger named-entity list. XML without a DTD only guarantees &amp;amp; &amp;lt; &amp;gt; &amp;apos; &amp;quot; plus numeric forms.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Validator', path: '/xml/validator', description: 'Check the document after you paste' },
			{ name: 'HTML Formatter', path: '/html/formatter', description: 'HTML has different rules' }
		],
		tips: [
			'Escape first, then wrap in tags. Do not escape the tags themselves.',
			'If you see &amp;amp;amp;, the value was escaped more than once. Unescape until it looks like the original text.'
		]
	},
	xpath: {
		features: [
			'Run XPath 1.0 expressions with the browser engine',
			'See matching nodes, strings, numbers, or booleans',
			'Cap at 500 matches so a * query cannot freeze the tab',
			'Works on the XML you paste, not a live URL',
			'Copy any match',
			'Useful for RSS items, SOAP bodies, and config keys'
		],
		useCases: [
			'Pull all //book/title values from a catalog',
			'Test an XSLT select before you run a transform',
			'Count nodes: count(//error)',
			'Read an attribute: //book/@id',
			'Debug why a feed item selector is empty'
		],
		concept: {
			title: 'XPath in the browser',
			content: `<p><strong>XPath</strong> is a query language for XML trees. This page uses <code>document.evaluate</code>, which is XPath 1.0. You get node sets, strings, numbers, and booleans. You do not get XPath 2.0 functions or JSONPath.</p>
<p class="mt-2">Default namespaces are a common trap: an element in a namespace may not match <code>//foo</code> unless you use <code>local-name()</code>. We do not auto-bind prefixes from the document.</p>`
		},
		examples: [
			{ label: 'All titles', code: '//book/title', isValid: true },
			{ label: 'Attribute', code: '//book/@id', isValid: true },
			{ label: 'Invalid expression', code: '//book[', isValid: false }
		],
		faqs: [
			{
				question: 'Why does //item match nothing?',
				answer: '<p>Often a default namespace. Try <code>//*[local-name()="item"]</code>.</p>'
			},
			{
				question: 'Is this XPath 2.0?',
				answer: '<p>No. Browsers implement 1.0. Functions like <code>tokenize()</code> are not here.</p>'
			},
			{
				question: 'Do you fetch the URL in my XML?',
				answer: '<p>No. Paste the document. We do not retrieve remote files.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Read the tree first' },
			{ name: 'XML to JSON', path: '/xml/to-json', description: 'Then use JSONPath if you prefer' },
			{ name: 'JSON Path Tester', path: '/json/path-tester', description: 'JSONPath on JSON documents' }
		],
		tips: [
			'Start with //tagname then tighten the path.',
			'count(//*) is a quick way to see if the document parsed as you expect.'
		]
	},
	diff: {
		features: [
			'Compare two XML documents as JSON-like trees',
			'Flag added, removed, and changed paths',
			'Ignore pretty-print whitespace by parsing first',
			'Attribute changes show up as @keys',
			'All work stays in the browser',
			'Paste left and right, or load samples'
		],
		useCases: [
			'See what changed between two SOAP responses',
			'Diff Android manifests across app versions',
			'Review a config change without fighting indent noise',
			'Check an export before and after a migration',
			'Confirm a minified and pretty file are the same tree'
		],
		concept: {
			title: 'Structural XML diff',
			content: `<p>We parse both sides, convert to the same JSON convention as XML to JSON, then walk the trees. Key order in the source file does not count. Whitespace between tags does not count. Text and attribute values do.</p>
<p class="mt-2">This is not a legal redline and not a byte diff. Repeated elements are compared by array index, so inserting a record at the top shifts later indexes. For list diffs that care about identity, sort or key the records first.</p>`
		},
		examples: [
			{ label: 'Same tree, different indent', code: '<a><b>1</b></a> vs <a>\n  <b>1</b>\n</a>', isValid: true },
			{ label: 'Value change', code: '<a>1</a> vs <a>2</a>', isValid: true },
			{ label: 'Broken left document', code: '<a><b></a>', isValid: false }
		],
		faqs: [
			{
				question: 'Why did inserting one item mark many rows changed?',
				answer: '<p>Arrays are positional. An insert at index 0 makes every later sibling look moved. Use a keyed format or sort if you need identity.</p>'
			},
			{
				question: 'Are comments compared?',
				answer: '<p>No. They are dropped in the JSON projection.</p>'
			}
		],
		relatedTools: [
			{ name: 'XML Formatter', path: '/xml/formatter', description: 'Normalize indent first if you want a text diff' },
			{ name: 'YAML Diff', path: '/yaml/diff', description: 'Same idea for YAML' },
			{ name: 'JSON Diff', path: '/json/diff', description: 'Structural JSON compare' }
		],
		tips: [
			'Pretty-print both sides only for your eyes. The diff already ignores indent.',
			'If namespaces prefixes differ but URIs match, you may still see a change on the tag string.'
		]
	}
};

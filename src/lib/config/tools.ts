// Centralized tool configuration for sidebar, homepage, and sitemap
// Add active: false to hide a tool from all places

export interface ToolItem {
	name: string;
	href: string;
	description?: string;
	icon?: string;
	active?: boolean; // defaults to true
	keywords?: string[];
}

export interface ToolCategory {
	name: string;
	icon: string;
	description?: string; // SEO-rich category intro
	seoTitle?: string;
	active?: boolean; // defaults to true
	items: ToolItem[];
}

export const BASE_URL = import.meta.env.DEV ? 'http://localhost:5173' : 'https://onedev.tools';

export const toolCategories: ToolCategory[] = [
	{
		name: 'JSON',
		icon: 'braces',
		description: 'Format, validate, compare, and convert JSON in this browser. Nothing is uploaded.',
		items: [
			{ name: 'JSON Formatter', href: '/json/formatter', description: 'Pretty-print is not the hard part. The first syntax error is, and JSON will not mention the second one until you fix the first.', icon: 'braces', keywords: ['json formatter', 'json parse error line', 'jsonc trailing comma', 'duplicate json keys', 'max safe integer json'] },
			{ name: 'JSON Validator', href: '/json/validator', description: 'Check whether a document is valid JSON and jump to the first parse error.', icon: 'check' },
			{ name: 'JSON Diff', href: '/json/diff', description: 'Compare two JSON values structurally. Key order and whitespace do not count as changes.', icon: 'git-compare' },
			{ name: 'JSON → Table', href: '/json/table', description: 'Turn a JSON array of objects into a sortable table you can copy as CSV or Markdown.', icon: 'chart-column' },
			{ name: 'JSON Visualizer', href: '/json/visualizer', description: 'Browse a JSON document as an expandable tree and search for keys or values.', icon: 'tree-deciduous' },
			{ name: 'Type Generator', href: '/json/type-generator', description: 'Infer TypeScript interfaces or Go structs from a sample JSON payload.', icon: 'type' },
			{ name: 'Path Tester', href: '/json/path-tester', description: 'Run JSONPath expressions against a document and inspect the matched values.', icon: 'search' },
			{ name: 'Relationship Visualizer', href: '/json/relationship', description: 'View object relationships as a node graph you can pan and zoom.', icon: 'link' }
		]
	},
	{
		name: 'PDF',
		icon: 'file-text',
		description: 'View, split, merge, compress, watermark, redact, and sign PDFs in this tab. Files are not uploaded to us.',
		items: [
			{ name: 'PDF Viewer', href: '/pdf/viewer', description: 'View PDF files right in your browser with page navigation and zoom — nothing is uploaded.', icon: 'eye' },
			{ name: 'PDF Splitter', href: '/pdf/split', description: 'Split a PDF or pull out specific pages by range, then download the result.', icon: 'scissors' },
			{ name: 'PDF Merger', href: '/pdf/merge', description: 'Combine several PDFs into one document and drag pages to reorder them before saving.', icon: 'link' },
			{ name: 'PDF Compressor', href: '/pdf/compress', description: 'Adobe and Smallpdf want the file on their server. This page compresses in the tab.', icon: 'package', keywords: ['compress pdf', 'pdf compressor no upload', 'shrink pdf without uploading', 'smallpdf alternative', 'compress pdf locally'] },
			{ name: 'PDF Watermark', href: '/pdf/watermark', description: 'Add a text or image watermark to PDF pages, with control over opacity, position, and rotation.', icon: 'droplet' },
			{ name: 'PDF Page Numbers', href: '/pdf/page-numbers', description: 'Add page numbers to a PDF with your choice of position, font size, and starting number.', icon: 'hash' },
			{ name: 'PDF Redact', href: '/pdf/redact', description: 'Permanently remove sensitive text and images from a PDF by drawing redaction boxes.', icon: 'highlighter' },
			{ name: 'PDF Compare', href: '/pdf/compare', description: 'Compare two PDFs side by side and highlight what changed between versions.', icon: 'scale' },
			{ name: 'PDF Sign', href: '/pdf/sign', description: 'Draw or upload your signature and place it anywhere on a PDF to sign it.', icon: 'pen-line' },
			{ name: 'Images to PDF', href: '/pdf/images-to-pdf', description: 'Combine multiple images into a single PDF, choosing page size and orientation.', icon: 'image' }
		]
	},
	{
		name: 'Base64',
		icon: 'zap',
		description: 'Encode and decode Base64 for text, files, and images. Encoding is not encryption.',
		items: [
			{ name: 'Encode / Decode', href: '/base64/encode-decode', description: 'Base64 is encoding, not encryption. Anyone who can see it can reverse it.', icon: 'refresh-cw', keywords: ['base64 encode', 'base64 decode', 'base64 not encryption', 'url-safe base64', 'btoa unicode'] },
			{ name: 'Image to Base64', href: '/base64/image-encoder', description: 'Image to Base64 converter online. Convert PNG, JPG, WebP, and SVG images to Base64 data URIs for HTML/CSS embedding. Free image encoder tool.', icon: 'image' },
			{ name: 'File to Base64', href: '/base64/file-encoder', description: 'Encode files to Base64 online. Convert any file to Base64 content for embedding in HTML, JSON, or XML. Free file to Base64 converter.', icon: 'folder' },
			{ name: 'Image Preview', href: '/base64/image-preview', description: 'Base64 image viewer online. Paste Base64 image data and preview instantly. Supports PNG, JPG, WebP, GIF—decode and view Base64 images free.', icon: 'image' },
			{ name: 'URL-safe Converter', href: '/base64/url-safe', description: 'URL-safe Base64 converter online. Convert between standard Base64 and URL-safe Base64 format (replaces +/ with -_). Free browser tool.', icon: 'link' },
			{ name: 'Validator', href: '/base64/validator', description: 'Base64 validator online. Check if a string is valid Base64 instantly. Detect encoding issues, padding problems, and invalid characters free.', icon: 'check' },
			{ name: 'Splitter', href: '/base64/splitter', description: 'Base64 line splitter online. Split long Base64 strings into lines for embedding in code, config files, or PEM certificates. Free browser tool.', icon: 'scissors' },
			{ name: 'Hex / Binary', href: '/base64/hex-binary', description: 'Base64 to hex converter online. Convert Base64 to hexadecimal or binary representation and back. Free encoding conversion in your browser.', icon: 'binary' }
		]
	},
	{
		name: 'URL',
		icon: 'link',
		description: 'Encode, decode, parse, build, and normalize URLs. Encoding is per component, not the whole string.',
		items: [
			{ name: 'Encode / Decode', href: '/url/encode-decode', description: '`encodeURI` and `encodeURIComponent` are not the same function. Using the wrong one is why `?q=a+b` is a space in one API and a plus sign in the other.', icon: 'lock-keyhole', keywords: ['url encode', 'encodeuricomponent', 'encodeuri vs encodeuricomponent', 'percent encoding', 'plus vs %20'] },
			{ name: 'Query Parser', href: '/url/query-parser', description: 'URL query string parser online. Parse query parameters into a key-value table instantly. Export as JSON or CSV—free URL parameter extractor.', icon: 'clipboard' },
			{ name: 'URL Builder', href: '/url/builder', description: 'URL builder online. Build URLs with query parameters visually. Paste existing URLs to parse and edit them—generate URLs free in your browser.', icon: 'wrench' },
			{ name: 'Validator', href: '/url/validator', description: 'URL validator online. Check if a URL is valid and see protocol, domain, port, and path breakdown. Validate URLs instantly—free browser tool.', icon: 'check' },
			{ name: 'Parts Analyzer', href: '/url/parts', description: 'URL parser online. Visual breakdown of URL components: protocol, host, port, path, query, hash. Analyze URL structure instantly and free.', icon: 'microscope' },
			{ name: 'Slug Generator', href: '/url/slug-generator', description: 'URL slug generator online. Convert any text to SEO-friendly, URL-safe slugs. Handles unicode and special characters—create slugs instantly free.', icon: 'file-pen' },
			{ name: 'Normalizer', href: '/url/normalizer', description: 'URL normalizer online. Normalize URLs: lowercase hostname, sort query params, remove defaults. Standardize URLs for comparison—free browser tool.', icon: 'broom' },
			{ name: 'Compare', href: '/url/compare', description: 'URL comparator online. Compare two URLs semantically and find differences in path, query, or fragment. URL diff checker—free in your browser.', icon: 'scale' },
			{ name: 'JSON Converter', href: '/url/json-converter', description: 'URL to JSON converter online. Convert URL query strings to JSON objects and back. Handles nested parameters—free query string converter.', icon: 'refresh-cw' },
			{ name: 'Length Checker', href: '/url/length-checker', description: 'URL length checker online. Check URL length against browser and server limits. Avoid "URL too long" errors—free length validator.', icon: 'ruler' }
		]
	},
	{
		name: 'Image',
		icon: 'image',
		description: 'Compress, resize, crop, convert, and inspect images in the canvas. Photos stay on this device.',
		items: [
			{ name: 'Image Compressor', href: '/image/compressor', description: 'Online image compressor to reduce file size without losing quality. Compress JPEG, PNG, WebP images directly in your browser—free, no uploads.', icon: 'package' },
			{ name: 'Image BG Remover', href: '/image/remove-white', description: 'Make white or light image backgrounds transparent, with adjustable tolerance.', icon: 'broom' },
			{ name: 'Image Resizer', href: '/image/resize', description: 'Resize images by pixels or percentage, with an optional aspect-ratio lock — no uploads.', icon: 'ruler' },
			{ name: 'Image Cropper', href: '/image/crop', description: 'Crop images with preset ratios (16:9, 4:3, 1:1) or a freeform selection.', icon: 'scissors' },
			{ name: 'Image Format Converter', href: '/image/converter', description: 'Image format converter online. Convert images between JPEG, PNG, WebP, and GIF formats instantly. Free image converter in your browser.', icon: 'refresh-cw' },
			{ name: 'Image Metadata Viewer', href: '/image/metadata', description: 'View image EXIF metadata — camera, GPS location, date, and settings — with an option to strip it.', icon: 'clipboard' },
			{ name: 'Image Color Extractor', href: '/image/colors', description: 'Image color picker online. Extract dominant colors and color palette from images. Get hex codes for theming—free color extractor tool.', icon: 'palette' },
			{ name: 'Image Blur', href: '/image/blur', description: 'Image blur tool online. Apply blur or pixelate effects to images. Preview in real-time, then download—free image privacy tool.', icon: 'square' }
		]
	},
	{
		name: 'QR & Barcode',
		icon: 'qr-code',
		description: 'Create and read QR codes and 1D barcodes in the browser. Treat a WiFi QR like the password it encodes.',
		items: [
			{ name: 'QR Generator', href: '/qr/generator', description: 'A printed QR does not expire. If you put a Wi‑Fi password or a one-time login in it, that secret lives as long as the paper does.', icon: 'qr-code', keywords: ['qr code generator', 'static qr', 'wifi qr password', 'qr svg print', 'qr code'] },
			{ name: 'QR Reader', href: '/qr/reader', description: 'QR code reader online. Decode a QR code from an image or your camera. See the payload instantly — nothing is uploaded.', icon: 'camera' },
			{ name: 'WiFi QR', href: '/qr/wifi', description: 'WiFi QR code generator. Encode your network name, password, and security type so phones can join with a scan.', icon: 'wifi' },
			{ name: 'vCard QR', href: '/qr/vcard', description: 'vCard QR code generator. Turn a name, phone, email, and company into a contact QR that phones can save.', icon: 'user' },
			{ name: 'Barcode Generator', href: '/qr/barcode', description: 'Barcode generator online. Create CODE128, EAN-13, UPC, CODE39, and other 1D barcodes. Download SVG or PNG in your browser.', icon: 'barcode' },
			{ name: 'Barcode Reader', href: '/qr/barcode-reader', description: 'Barcode scanner online. Read EAN, UPC, CODE128, CODE39, and other barcodes from an image or camera.', icon: 'search' }
		]
	},
	{
		name: 'System',
		icon: 'monitor',
		description: 'See what this browser reports for OS, CPU, screen, and connection. Optional public IP lookup is opt-in and not used for ads.',
		items: [
			{ name: 'System Info', href: '/system/info', description: 'System information tool online. Detect your OS, CPU cores, memory, screen resolution, and GPU info. Check system specs in your browser—free.', icon: 'monitor' },
			{ name: 'Browser Info', href: '/system/browser', description: 'Browser detector online. Check browser name, version, engine, and supported features. Detect browser capabilities instantly—free tool.', icon: 'globe' },
			{ name: 'Network Info', href: '/system/network', description: 'Network info tool online. Check connection type, effective speed, and public IP address. Test your network details—free browser tool.', icon: 'radio' },
			{ name: 'Media Devices', href: '/system/media', description: 'Media device checker online. List available cameras, microphones, and speakers. Test webcam and mic access—free device detection tool.', icon: 'video' },
			{ name: 'Permissions', href: '/system/permissions', description: 'Browser permissions checker online. Check camera, microphone, location, notification permissions. See what browser has access to—free tool.', icon: 'lock-keyhole' }
		]
	},
	{
		name: 'Text',
		icon: 'file-pen',
		description: 'Change case, sort lines, diff text, count words, and generate placeholder copy.',
		items: [
			{ name: 'String Compare', href: '/text/string-compare', description: 'String comparison tool online. Compare two strings word by word to find differences. Visual textual comparison tool free.', icon: 'case-sensitive' },
			{ name: 'Case Converter', href: '/text/case-converter', description: 'Text case converter online. Convert between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, lowercase. Change text case instantly free.', icon: 'case-sensitive' },
			{ name: 'Line Tools', href: '/text/line-tools', description: 'Line sorter and text tools online. Sort lines, remove duplicates, trim whitespace, reverse order. Manipulate text lines free in your browser.', icon: 'clipboard' },
			{ name: 'Text Diff', href: '/text/diff', description: 'Text diff checker online. Compare two text blocks line by line with highlighted additions and deletions. Free text comparison tool.', icon: 'scale' },
			{ name: 'Find & Replace', href: '/text/find-replace', description: 'Find and replace online with regex support. Search and replace text patterns, preview matches before applying. Free regex replace tool.', icon: 'search' },
			{ name: 'Word Count', href: '/text/statistics', description: 'Count characters, words, sentences, paragraphs, and estimated reading time.', icon: 'chart-column' },
			{ name: 'Anagram Finder', href: '/text/anagram', description: 'Anagram solver online. Find all anagrams of a word or phrase with dictionary validation. Anagram generator free in your browser.', icon: 'shuffle' },
			{ name: 'Remove Duplicates', href: '/text/remove-duplicates', description: 'Remove duplicate lines online. Delete duplicate words or lines from text while preserving order. Free duplicate remover tool.', icon: 'scissors' },
			{ name: 'Lorem Ipsum', href: '/text/lorem-ipsum', description: 'Lorem ipsum generator online. Generate placeholder text: paragraphs, sentences, or words. Create dummy text instantly free.', icon: 'file-text' },
			{ name: 'Blabber Generator', href: '/text/blabber', description: 'Random text generator online. Generate readable gibberish text for testing layouts and designs. Fake text generator free.', icon: 'message-circle' }
		]
	},
	{
		name: 'HTML',
		icon: 'file-text',
		description: 'Format, check, and extract from HTML you paste. We do not fetch live URLs.',
		items: [
			{ name: 'HTML Validator (Basic)', href: '/html/validator', description: 'HTML validator online. Check for unclosed tags, invalid nesting, duplicate IDs, and common HTML errors. Validate HTML free in your browser.', icon: 'check' },
			{ name: 'HTML Formatter', href: '/html/formatter', description: 'HTML formatter and beautifier online. Format, prettify, or minify HTML with proper indentation. HTML pretty print free in your browser.', icon: 'braces' },
			{ name: 'HTML → Text', href: '/html/text-extractor', description: 'HTML to plain text converter online. Strip all HTML tags and extract text content only. Remove HTML tags free—get clean text instantly.', icon: 'file-pen' },
			{ name: 'Element Extractor', href: '/html/element-extractor', description: 'HTML element extractor online. Extract all links, images, meta tags, or scripts from HTML. Parse HTML elements free in your browser.', icon: 'search' },
			{ name: 'DOM Visualizer', href: '/html/dom-visualizer', description: 'Nested HTML is easy to write and hard to see. If a selector “should work” and doesn’t, the tree is the problem, not CSS.', icon: 'tree-deciduous' },
			{ name: 'HTML → JSON', href: '/html/to-json', description: 'HTML to JSON converter online. Convert HTML DOM structure to JSON representation. Parse HTML to JSON object free in your browser.', icon: 'refresh-cw' },
			{ name: 'Attribute Cleaner', href: '/html/attribute-cleaner', description: 'HTML attribute remover online. Remove inline styles, data attributes, classes, or empty attributes. Clean HTML code free in your browser.', icon: 'broom' },
			{ name: 'Tag Counter', href: '/html/tag-counter', description: 'HTML tag counter online. Count occurrences of each HTML tag and see element distribution. Analyze HTML structure free.', icon: 'chart-column' }
		]
	},
	{
		name: 'XML',
		icon: 'code-xml',
		seoTitle: 'Free XML Tools Online — Formatter, Beautifier, XML to JSON',
		description:
			'Free XML tools online: XML formatter and beautifier, XML validator, XML to JSON converter, JSON to XML, XML to CSV, minifier, XPath tester, and XML compare. Pretty print XML in your browser with no upload.',
		items: [
			{
				name: 'XML Formatter',
				href: '/xml/formatter',
				description:
					'XML formatter and beautifier online. Pretty print XML, format messy SOAP or RSS, and see the first parse error instantly. Free XML pretty print in your browser.',
				icon: 'sparkles',
				keywords: [
					'xml formatter',
					'xml beautifier',
					'pretty print xml',
					'format xml online',
					'xml pretty print',
					'beautify xml',
					'xml formatter online'
				]
			},
			{
				name: 'XML Validator',
				href: '/xml/validator',
				description:
					'XML validator online. Check if XML is valid, find syntax errors, and validate XML files free in your browser. No upload.',
				icon: 'check',
				keywords: [
					'xml validator',
					'validate xml',
					'check xml',
					'xml checker',
					'xml syntax checker',
					'xml validator online'
				]
			},
			{
				name: 'XML Minifier',
				href: '/xml/minifier',
				description:
					'XML minifier online. Compress XML by removing extra spaces. Minify XML files free in your browser.',
				icon: 'package',
				keywords: ['xml minifier', 'minify xml', 'compress xml', 'xml compressor', 'xml minify online']
			},
			{
				name: 'XML to JSON Converter',
				href: '/xml/to-json',
				description:
					'XML has attributes and text. JSON has neither, so something has to give.',
				icon: 'arrow-right',
				keywords: [
					'xml to json',
					'xml attributes to json',
					'xml @id #text',
					'repeating xml elements json array'
				]
			},
			{
				name: 'JSON to XML Converter',
				href: '/xml/from-json',
				description:
					'Convert JSON to XML online. Turn JSON into well-formed XML. Free JSON to XML converter in your browser.',
				icon: 'arrow-left',
				keywords: [
					'json to xml',
					'convert json to xml',
					'json to xml converter',
					'json xml converter',
					'json to xml online'
				]
			},
			{
				name: 'XML to CSV Converter',
				href: '/xml/to-csv',
				description:
					'Convert XML to CSV online. Turn XML lists into a spreadsheet table you can open in Excel. Free XML to CSV converter.',
				icon: 'chart-column',
				keywords: [
					'xml to csv',
					'convert xml to csv',
					'xml to excel',
					'xml to csv converter',
					'xml to spreadsheet'
				]
			},
			{
				name: 'XML Escape',
				href: '/xml/escape',
				description:
					'XML escape and unescape online. Encode or decode &, <, >, and quotes for XML text. Free XML encoder in your browser.',
				icon: 'lock-keyhole',
				keywords: [
					'xml escape',
					'xml encode',
					'escape xml characters',
					'xml unescape',
					'xml entity encoder'
				]
			},
			{
				name: 'XPath Tester',
				href: '/xml/xpath',
				description:
					'XPath tester online. Test XPath queries against XML and see matching nodes. Free XPath evaluator in your browser.',
				icon: 'search',
				keywords: ['xpath tester', 'xpath online', 'xpath evaluator', 'test xpath', 'xpath query tool']
			},
			{
				name: 'XML Diff',
				href: '/xml/diff',
				description:
					'Compare two XML files online. See what changed between XML documents. Free XML diff and XML compare tool.',
				icon: 'arrow-left-right',
				keywords: ['xml diff', 'compare xml', 'xml compare', 'xml difference', 'diff xml files']
			}
		]
	},
	{
		name: 'CSV',
		icon: 'table',
		seoTitle: 'Free CSV Tools Online — CSV to JSON, Viewer, Excel Converter',
		description:
			'Free CSV tools online: CSV to JSON converter, JSON to CSV, CSV viewer, open CSV in browser, CSV to Excel-friendly tables, CSV to SQL, CSV to Markdown, TSV converter, and CSV compare. Convert CSV files with no upload.',
		items: [
			{
				name: 'CSV to JSON Converter',
				href: '/csv/to-json',
				description:
					'A comma is not the only separator. Excel in Europe exports semicolons, and a leading zero in a zip code is data until JSON turns it into a number.',
				icon: 'arrow-right',
				keywords: [
					'csv to json',
					'rfc 4180 csv',
					'excel semicolon csv',
					'csv leading zeros',
					'ndjson vs json array'
				]
			},
			{
				name: 'JSON to CSV Converter',
				href: '/csv/from-json',
				description:
					'Convert JSON to CSV online. Download a CSV you can open in Excel. Free JSON to CSV converter in your browser.',
				icon: 'arrow-left',
				keywords: [
					'json to csv',
					'convert json to csv',
					'json to csv converter',
					'json to excel',
					'json csv converter'
				]
			},
			{
				name: 'CSV Viewer',
				href: '/csv/viewer',
				description:
					'CSV viewer online. Open a CSV file as a table in your browser. View Excel CSV without uploading.',
				icon: 'eye',
				keywords: [
					'csv viewer',
					'open csv online',
					'view csv file',
					'csv table viewer',
					'excel csv viewer'
				]
			},
			{
				name: 'CSV Validator',
				href: '/csv/validator',
				description:
					'CSV validator online. Check CSV files for errors, broken quotes, and missing columns. Validate CSV free.',
				icon: 'check',
				keywords: ['csv validator', 'validate csv', 'check csv file', 'csv checker', 'csv syntax']
			},
			{
				name: 'CSV Delimiter Converter',
				href: '/csv/delimiter',
				description:
					'Convert CSV delimiters online. Change comma to semicolon, tab (TSV), or pipe. Free CSV to TSV converter.',
				icon: 'arrow-left-right',
				keywords: [
					'csv delimiter',
					'csv to tsv',
					'comma to semicolon csv',
					'tsv converter',
					'change csv delimiter'
				]
			},
			{
				name: 'CSV to XML Converter',
				href: '/csv/to-xml',
				description:
					'Convert CSV to XML online. Turn spreadsheet rows into XML. Free CSV to XML converter in your browser.',
				icon: 'code-xml',
				keywords: ['csv to xml', 'convert csv to xml', 'csv to xml converter', 'excel to xml']
			},
			{
				name: 'CSV to SQL Converter',
				href: '/csv/to-sql',
				description:
					'Convert CSV to SQL online. Generate INSERT statements from a CSV file. Free CSV to SQL converter.',
				icon: 'archive',
				keywords: ['csv to sql', 'csv to insert', 'convert csv to sql', 'csv to mysql', 'excel to sql']
			},
			{
				name: 'CSV to Markdown',
				href: '/csv/to-markdown',
				description:
					'Convert CSV to Markdown table online. Paste CSV and get a GitHub Markdown table. Free CSV to MD converter.',
				icon: 'file-pen',
				keywords: [
					'csv to markdown',
					'csv to markdown table',
					'excel to markdown',
					'markdown table generator'
				]
			},
			{
				name: 'CSV Diff',
				href: '/csv/diff',
				description:
					'Compare two CSV files online. See added, removed, and changed rows. Free CSV compare and CSV diff tool.',
				icon: 'arrow-left-right',
				keywords: ['csv diff', 'compare csv files', 'csv compare', 'excel compare', 'diff csv']
			},
			{
				name: 'CSV Transpose',
				href: '/csv/transpose',
				description:
					'Transpose CSV online. Swap rows and columns in a CSV file. Free CSV transpose tool.',
				icon: 'refresh-cw',
				keywords: ['csv transpose', 'swap csv rows columns', 'transpose excel csv', 'pivot csv']
			}
		]
	},
	{
		name: 'SQL',
		icon: 'database',
		seoTitle: 'Free SQL Tools Online — Formatter, Beautifier, JSON to SQL, JOIN Visualizer',
		description:
			'Free SQL tools online: SQL formatter and beautifier, SQL minifier, SQL validator, JSON to SQL INSERT, string escape, query diff, JOIN visualizer, LIKE tester, and a SQL cheat sheet. Pretty-print PostgreSQL, MySQL, SQLite, SQL Server, BigQuery, and Snowflake in your browser. Nothing is uploaded.',
		items: [
			{
				name: 'SQL Formatter',
				href: '/sql/formatter',
				description:
					'SQL is not one language. Pretty-print without a dialect will “fix” Postgres into MySQL, then you paste it into prod.',
				icon: 'sparkles',
				keywords: [
					'sql formatter',
					'postgresql formatter',
					'mysql formatter',
					'sql dialect formatter',
					'dollar quote sql'
				]
			},
			{
				name: 'SQL Minifier',
				href: '/sql/minifier',
				description:
					'SQL minifier online. Compress SQL by stripping comments and extra whitespace while keeping string literals intact. Free SQL compressor in your browser.',
				icon: 'package',
				keywords: ['sql minifier', 'minify sql', 'compress sql', 'sql compressor', 'sql minify online']
			},
			{
				name: 'SQL Validator',
				href: '/sql/validator',
				description:
					'SQL validator online. Check SQL syntax, find unclosed quotes and parentheses, and see parse errors with line numbers. Free SQL checker, no upload.',
				icon: 'check',
				keywords: [
					'sql validator',
					'validate sql',
					'check sql syntax',
					'sql checker',
					'sql syntax checker',
					'sql validator online'
				]
			},
			{
				name: 'JSON to SQL Converter',
				href: '/sql/from-json',
				description:
					'Convert JSON to SQL online. Turn a JSON array of objects into INSERT statements, optionally with CREATE TABLE. Free JSON to SQL converter in your browser.',
				icon: 'arrow-left',
				keywords: [
					'json to sql',
					'convert json to sql',
					'json to insert',
					'json to sql converter',
					'json to mysql',
					'json to postgresql'
				]
			},
			{
				name: 'SQL Escape',
				href: '/sql/escape',
				description:
					'SQL escape and identifier quoting online. Quote string literals and column names for PostgreSQL, MySQL, SQLite, or SQL Server. Unescape pasted SQL too.',
				icon: 'lock-keyhole',
				keywords: [
					'sql escape',
					'sql string escape',
					'sql quote identifier',
					'escape sql string',
					'sql unescape'
				]
			},
			{
				name: 'SQL Diff',
				href: '/sql/diff',
				description:
					'Compare two SQL queries online. Format both, then diff. Whitespace and keyword case do not count as changes. Free SQL compare tool.',
				icon: 'arrow-left-right',
				keywords: ['sql diff', 'compare sql', 'sql compare', 'sql difference', 'diff sql queries']
			},
			{
				name: 'SQL JOIN Visualizer',
				href: '/sql/joins',
				description:
					'SQL JOIN visualizer online. See INNER, LEFT, RIGHT, FULL, CROSS, SEMI, and ANTI joins with sample tables and result rows. Free SQL join explainer.',
				icon: 'link',
				keywords: [
					'sql join visualizer',
					'sql joins',
					'inner join vs left join',
					'sql join explainer',
					'left join example'
				]
			},
			{
				name: 'SQL LIKE Tester',
				href: '/sql/like',
				description:
					'SQL LIKE tester online. Test % and _ wildcards, ESCAPE, and case-insensitive ILIKE against sample strings. Free LIKE pattern matcher.',
				icon: 'target',
				keywords: ['sql like', 'sql like tester', 'sql ilike', 'sql wildcard', 'like pattern', 'sql like example']
			},
			{
				name: 'SQL Explainer',
				href: '/sql/explainer',
				description:
					'SQL query explainer online. Break a SELECT, INSERT, UPDATE, or DELETE into clauses in plain English. Free SQL explainer in your browser.',
				icon: 'book-open',
				keywords: ['sql explainer', 'explain sql query', 'sql to english', 'what does this sql do', 'sql query explainer']
			},
			{
				name: 'SQL Cheat Sheet',
				href: '/sql/cheatsheet',
				description:
					'SQL cheat sheet online. Joins, data types, window functions, dates, and NULL handling for PostgreSQL, MySQL, and SQLite. Free searchable SQL reference.',
				icon: 'clipboard',
				keywords: ['sql cheat sheet', 'sql cheatsheet', 'sql reference', 'sql commands', 'sql syntax cheat sheet']
			}
		]
	},
	{
		name: 'Break',
		icon: 'coffee',
		description: 'Take a break from coding with relaxation tools. Pomodoro timer for focus sessions, ambient sounds, breathing exercises, and calming visuals—free productivity and wellness tools.',
		items: [
			{ name: 'Pomodoro Timer', href: '/break/pomodoro', description: 'A focus timer with 25/5 and 50/10 presets and a chime when each session ends.', icon: 'circle' },
			{ name: 'Ambient Rest', href: '/break/ambient', description: 'Full-screen calm backgrounds with rain or café sounds to help you focus and recharge.', icon: 'cloud-rain' },
			{ name: 'Minimal Clock', href: '/break/clock', description: 'A large, distraction-free fullscreen clock with analog or digital display.', icon: 'clock' },
			{ name: 'Zen Motion', href: '/break/zen-motion', description: 'A nostalgic bouncing-shape animation to rest your eyes between sessions.', icon: 'disc' },
			{ name: 'Breathing Timer', href: '/break/breathing', description: 'Guided breathing with configurable inhale, hold, and exhale — including box breathing and 4-7-8.', icon: 'wind' }
		]
	},
	{
		name: 'Convert',
		icon: 'refresh-cw',
		description: 'Convert CSS units, length, data size, time, color, and number bases. Formulas and assumptions are on each page.',
		items: [
			{ name: 'CSS Units', href: '/convert/css-units', description: 'Convert between px, rem, em, vw, vh, pt, and percentages, with live results.', icon: 'ruler' },
			{ name: 'Length', href: '/convert/length', description: 'Convert between mm, cm, inches, feet, meters, km, and pixels at any DPI.', icon: 'ruler' },
			{ name: 'Screen / Resolution', href: '/convert/screen', description: 'Work out screen dimensions, DPI, and PPI from a resolution — or the other way around.', icon: 'monitor' },
			{ name: 'Time', href: '/convert/time', description: 'Convert between milliseconds, seconds, minutes, hours, and days in human-readable form.', icon: 'timer' },
			{ name: 'Data Size', href: '/convert/data-size', description: 'Convert between bytes, KB, MB, GB, and TB using decimal (SI) or binary (IEC) units.', icon: 'save' },
			{ name: 'Angle', href: '/convert/angle', description: 'Convert between degrees, radians, gradians, and turns, with a visual arc preview.', icon: 'ruler' },
			{ name: 'Number Base', href: '/convert/number-base', description: 'Convert between binary, decimal, hexadecimal, and octal, with a bit-by-bit view.', icon: 'hash' },
			{ name: 'Typography', href: '/convert/typography', description: 'Convert px, pt, em, and rem for typography, and preview line-height and type scale.', icon: 'case-sensitive' },
			{ name: 'Color', href: '/convert/color', description: 'Convert between HEX, RGB, RGBA, HSL, HSLA, and HSB, with a live color preview.', icon: 'palette' }
		]
	},
	{
		name: 'Date & Time',
		icon: 'calendar',
		seoTitle: 'Free Date and Time Tools — Unix Timestamp Converter, Time Zone, World Clock',
		description:
			'Free date and time tools: Unix timestamp converter (epoch to date), time zone converter, world clock, date calculator, ISO 8601 parser, and time ago. Convert timestamp to date in your browser, no signup.',
		items: [
			{
				name: 'Unix Timestamp Converter',
				href: '/date/timestamp',
				description:
					'Ten digits is seconds. Thirteen is milliseconds.',
				icon: 'timer',
				keywords: [
					'unix timestamp',
					'10 digit vs 13 digit timestamp',
					'y2038',
					'to_timestamp postgres',
					'from_unixtime'
				]
			},
			{
				name: 'Time Zone Converter',
				href: '/date/timezone',
				description:
					'Time zone converter online. Convert a time between New York, London, Tokyo, and any city. Free timezone converter in your browser.',
				icon: 'globe',
				keywords: [
					'timezone converter',
					'time zone converter',
					'convert time zones',
					'est to pst',
					'utc converter',
					'world time converter'
				]
			},
			{
				name: 'ISO 8601 Date Converter',
				href: '/date/iso',
				description:
					'ISO 8601 converter online. Parse ISO dates and durations like P3DT4H. Free ISO 8601 date format tool.',
				icon: 'calendar',
				keywords: [
					'iso 8601',
					'iso date converter',
					'iso 8601 format',
					'iso timestamp',
					'iso 8601 parser'
				]
			},
			{
				name: 'Date Calculator',
				href: '/date/calculator',
				description:
					'Date calculator online. Add or subtract days, weeks, or months from a date. Free add days to date tool.',
				icon: 'plus',
				keywords: [
					'date calculator',
					'add days to date',
					'date plus days',
					'subtract days from date',
					'date math calculator'
				]
			},
			{
				name: 'Time Ago',
				href: '/date/relative',
				description:
					'Time ago calculator online. Convert a timestamp into "3 hours ago" or "in 2 days". Free relative time converter.',
				icon: 'hourglass',
				keywords: ['time ago', 'relative time', 'hours ago calculator', 'time from now', 'pretty time']
			},
			{
				name: 'World Clock',
				href: '/date/world-clock',
				description:
					'World clock online. See the current time in UTC, New York, London, Tokyo, and more. Free world clock.',
				icon: 'clock',
				keywords: ['world clock', 'world time', 'current time in cities', 'utc clock', 'international clock']
			},
			{
				name: 'Duration Calculator',
				href: '/date/duration',
				description:
					'Duration calculator online. Find the time between two dates. Free date difference and elapsed time calculator.',
				icon: 'ruler',
				keywords: [
					'duration calculator',
					'time between dates',
					'date difference',
					'days between dates',
					'elapsed time calculator'
				]
			},
			{
				name: 'Date Format Converter',
				href: '/date/formats',
				description:
					'Date format converter online. Get ISO, RFC 2822, Unix, Excel serial, and more from one date. Free date format tool.',
				icon: 'clipboard',
				keywords: [
					'date format converter',
					'date formats',
					'rfc 2822 date',
					'excel date serial',
					'convert date format'
				]
			}
		]
	},
	{
		name: 'CSS',
		icon: 'palette',
		description: 'Format CSS and generate gradients, shadows, filters, and keyframes with a live preview.',
		items: [
			{ name: 'Formatter', href: '/css/formatter', description: 'CSS formatter and beautifier online. Format CSS code with proper indentation. CSS pretty print and code beautifier—free in your browser.', icon: 'sparkles' },
			{ name: 'Minifier', href: '/css/minifier', description: 'Compress CSS by stripping whitespace and comments to shrink file size.', icon: 'package' },
			{ name: 'Prefix Cleaner', href: '/css/prefix-cleaner', description: 'CSS prefix remover online. Remove vendor prefixes (-webkit-, -moz-, -ms-, -o-). Clean up CSS autoprefixer output—free tool.', icon: 'broom' },
			{ name: 'CSS Gradient Generator', href: '/css/gradient', description: 'Create linear, radial, and conic gradients with a visual editor, multiple color stops, and live preview.', icon: 'palette' },
			{ name: 'Transition', href: '/css/transition', description: 'CSS transition generator online. Create CSS transitions with live preview. Generate smooth animations—free transition builder.', icon: 'refresh-cw' },
			{ name: 'Bezier Curve', href: '/css/bezier', description: 'CSS cubic-bezier editor online. Interactive curve editor for timing functions. Create custom easing—bezier curve generator free.', icon: 'trending-up' },
			{ name: 'Keyframes', href: '/css/keyframes', description: 'CSS keyframes generator online. Create @keyframes animations with editable stops. CSS animation builder—free keyframe editor.', icon: 'clapperboard' },

			{ name: 'Box Shadow Generator', href: '/css/box-shadow', description: 'CSS box shadow generator online. Create box-shadows with multiple layers and presets. Live preview—free shadow generator tool.', icon: 'moon' },
			{ name: 'Text Shadow Generator', href: '/css/text-shadow', description: 'CSS text shadow generator online. Create text-shadow effects with live preview. Multiple shadow layers—free text shadow tool.', icon: 'message-circle' },
			{ name: 'Filter Generator', href: '/css/filter', description: 'CSS filter generator online. Generate blur, brightness, contrast, grayscale, and more. Live filter preview—free CSS filter tool.', icon: 'sliders-vertical' },
			{ name: 'CSS Text Gradient', href: '/css/text-gradient', description: 'CSS text gradient generator. Create beautiful gradient text for headings and logos. Copy CSS code for gradient typography instantly.', icon: 'sparkles' },
			{ name: 'Snippets', href: '/css/snippets', description: 'CSS snippets library online. Ready-to-use CSS: centering tricks, text truncation, accessibility helpers. Copy CSS snippets free.', icon: 'clipboard' }
		]
	},
	{
		name: 'CSS Layout',
		icon: 'ruler',
		description: 'Visual playgrounds for Flexbox, Grid, spacing, and aspect-ratio. Output is CSS you paste into a project.',
		items: [
			{ name: 'Flexbox Generator', href: '/css-layout/flexbox', description: 'CSS flexbox visualizer and generator. Interactive playground for flex direction, alignment, wrapping, and gap. Generate flex layout code instantly.', icon: 'package' },
			{ name: 'Grid Builder', href: '/css-layout/grid', description: 'CSS grid generator online. Drag-and-drop grid builder with named areas and auto-placement. Create complex grid layouts visually.', icon: 'grid-3x3' },
			{ name: 'Masonry Layout', href: '/css-layout/masonry', description: 'CSS masonry layout generator. Create Pinterest-style layouts using pure CSS columns or flexbox fallback. Responsive masonry grid builder.', icon: 'brick-wall' },
			{ name: 'Responsive Helper', href: '/css-layout/responsive', description: 'CSS responsive design helper. Generate media queries and common breakpoints for mobile, tablet, and desktop. Responsive layout tool.', icon: 'smartphone' },
			{ name: 'Position & Z-Index', href: '/css-layout/position', description: 'CSS positioning playground. Visualize absolute, relative, fixed, sticky positioning and z-index stacking contexts. Layout positioning tool.', icon: 'map-pin' },
			{ name: 'Spacing & Gap', href: '/css-layout/spacing', description: 'CSS spacing generator. Visual margin and padding builder with preview. Generate consistent spacing utilities and layouts.', icon: 'arrow-left-right' },
			{ name: 'Aspect Ratio', href: '/css-layout/aspect-ratio', description: 'CSS aspect ratio calculator. Generate aspect-ratio property and padding-hack fallbacks. Visual aspect ratio preview tool.', icon: 'crop' }
		]
	},
	{
		name: 'AI Utilities',
		icon: 'bot',
		description: 'Estimate tokens and API cost for common chat models from published tokenizers and price lists. We do not call those APIs with your prompt.',
		items: [
			{ name: 'Token Counter', href: '/ai/token-counter', description: 'AI token counter online. Count tokens for GPT-5.6, Claude 5, Gemini 3.x, Grok 4.6, and DeepSeek V4. Character count and cost estimation in this browser.', icon: 'hash' },
			{ name: 'Token Visualizer', href: '/ai/token-visualizer', description: 'Shows how this encoding splits text: leading spaces, camelCase, CJK. Blocks are OpenAI BPE; Claude counts are scaled. Not a generic token counter.', icon: 'palette', keywords: ['bpe split', 'token id leading space', 'openai bpe visualizer', 'camelcase tokens', 'not a token counter'] },
			{ name: 'Context Estimator', href: '/ai/context-estimator', description: 'Window math: system + history + prompt + output must fit. Remaining vs max_tokens, not a token counter online.', icon: 'chart-column', keywords: ['context window remaining', 'max_tokens overflow', 'rag context budget', 'not a token counter'] },
			{ name: 'Prompt Trimmer', href: '/ai/prompt-trimmer', description: 'AI prompt trimmer. Trim text to fit token limits with sentence-aware and paragraph-aware modes. Nothing is uploaded.', icon: 'scissors' },
			{ name: 'Embedding Estimator', href: '/ai/embedding-estimator', description: 'AI embedding calculator. Estimate tokens, dimensions, and vector DB size for text-embedding-4-large, Gemini Embedding 2, and Cohere.', icon: 'ruler' },
			{ name: 'Cost Estimator', href: '/ai/cost-estimator', description: 'AI API cost calculator. Estimate GPT-5.6, Claude 5, Gemini 3.7 Flash, and DeepSeek V4 bills from published rates (updated 20 Aug 2026).', icon: 'coins' },
			{ name: 'Cost Compare', href: '/ai/cost-compare', description: 'Compare AI API costs. Monthly pricing across GPT-5.6 Sol/Terra/Luna, Claude Fable 5 / Opus 5 / Sonnet 5, Gemini 3.x, Grok 4.6, and DeepSeek V4.', icon: 'scale' }
		]
	},
	{
		name: 'Hash',
		icon: 'hash',
		description: 'Compute MD5, SHA-1, SHA-256, SHA-512, CRC32, and HMAC checksums, or check a digest against published test vectors. Hashes are not encryption.',
		items: [
			{ name: 'Hash Generator', href: '/hash/generator', description: 'SHA-512 is not password storage. MD5 is not integrity.', icon: 'lock-keyhole', keywords: ['sha256 checksum', 'md5 broken', 'sha1 broken', 'hash not for passwords', 'file hash'] },
			{ name: 'MD5 Checksum', href: '/hash/md5', description: 'Create an MD5 checksum from text or a file. MD5 is fine for accidental corruption checks, not for passwords.', icon: 'lock' },
			{ name: 'SHA-256 Hash', href: '/hash/sha256', description: 'Generate secure 256-bit SHA-256 hashes from text or files.', icon: 'lock' },
			{ name: 'SHA-512 Hash', href: '/hash/sha512', description: 'SHA-512 checksum (512-bit). Longer SHA-2 digest than SHA-256. Not a password KDF.', icon: 'lock' },
			{ name: 'SHA-1 Hash', href: '/hash/sha1', description: 'Create 160-bit SHA-1 hashes, still handy for Git commits and file verification.', icon: 'lock' },
			{ name: 'CRC32 Checksum', href: '/hash/crc32', description: 'Calculate a CRC32 checksum for quick file-integrity checks.', icon: 'check' },
			{ name: 'Hash Identifier', href: '/hash/identifier', description: 'Not sure what a hash is? Detect whether it looks like MD5, SHA-256, bcrypt, or another type.', icon: 'search' },
			{ name: 'Compare Hashes', href: '/hash/compare', description: 'Two hashes can look the same and still differ by one character, and they can look different and still be the same bytes. Eyeballing a 64-character hex string is how a bad ISO ships.', icon: 'scale' },
			{ name: 'File Checksum', href: '/hash/file-checksum', description: 'Verify a downloaded file hash against the expected value to confirm integrity.', icon: 'folder' },
			{ name: 'Hash Test Vectors', href: '/hash/lookup', description: 'Check whether a digest matches published RFC 1321 / FIPS 180 example strings. Not a password cracker.', icon: 'clipboard' },
			{ name: 'HMAC Generator', href: '/hash/hmac', description: 'Generate keyed HMAC-SHA256 and HMAC-SHA512 authentication codes.', icon: 'key' },
			{ name: 'Hash Converter', href: '/hash/converter', description: 'Convert a hash between hex and Base64, change its case, or add byte separators.', icon: 'refresh-cw' }
		]
	},
	{
		name: 'Git',
		icon: 'shuffle',
		description: 'gitignore, conventional commits, branch names, and Git explainers. Nothing clones your repository here.',
		items: [
			{ name: 'Gitignore Generator', href: '/git/gitignore', description: 'Create .gitignore files for Node, Python, Java, Go, Rust, and more — combine presets, then copy or download.', icon: 'ban' },
			{ name: 'Commit Generator', href: '/git/commit-generator', description: 'Conventional commit generator online. Build formatted commit messages with type, scope, and description. Emoji support—create git commits instantly.', icon: 'message-circle' },
			{ name: 'Commit Validator', href: '/git/commit-validator', description: 'Commit message validator online. Validate against Conventional Commits spec with detailed error explanations. Check commit format free.', icon: 'check' },
			{ name: 'Branch Generator', href: '/git/branch-generator', description: 'Git branch name generator online. Create feature, bugfix, hotfix branches with ticket IDs. Customizable prefix order—copy branch names instantly.', icon: 'leaf' },
			{ name: 'Workflow Guide', href: '/git/workflow', description: 'Git workflow cheat sheet online. Learn Git Flow, trunk-based development, and feature branching with visual diagrams. Free Git guide.', icon: 'clipboard' },
			{ name: 'Diff Viewer', href: '/git/diff-viewer', description: 'Compare text with a side-by-side or inline diff, with syntax highlighting and whitespace ignore.', icon: 'chart-column' },
			{ name: 'Log Formatter', href: '/git/log-formatter', description: 'Git log format generator online. Customize git log output with format placeholders. Generate pretty log commands—copy instantly.', icon: 'scroll' },
			{ name: 'Git Blame Explainer', href: '/git/blame-explainer', description: 'Git blame explainer online. Paste git blame output and understand each field. Learn blame format visually—free educational tool.', icon: 'search' },
			{ name: 'Reset Helper', href: '/git/reset-helper', description: 'Git reset helper online. Understand soft, mixed, hard reset with visual diagrams. Generate reset commands safely—free Git tool.', icon: 'rewind' },
			{ name: 'Rebase Helper', href: '/git/rebase-helper', description: 'Git rebase guide online. Interactive rebase steps with visual explanation. Learn rebase commands—free Git rebase tool.', icon: 'refresh-cw' },
			{ name: 'Config Generator', href: '/git/config-generator', description: 'Git config generator online. Generate git config commands for name, email, aliases, and settings. Configure Git easily—copy commands free.', icon: 'settings' },
			{ name: 'Alias Generator', href: '/git/alias-generator', description: 'Git alias generator online. Create common Git aliases like co, br, st. Custom alias builder—copy git alias commands free.', icon: 'keyboard' },
			{ name: 'README Generator', href: '/git/readme-generator', description: 'Create a GitHub README with badges, sections, and templates, with a live Markdown preview and download.', icon: 'file-text' },
			{ name: 'License Picker', href: '/git/license-picker', description: 'Choose a license (MIT, Apache, GPL) with plain-English explanations, then generate the LICENSE file.', icon: 'scroll' },
			{ name: 'Secrets Scanner', href: '/git/secrets-scanner', description: 'Git secrets scanner online. Detect API keys, tokens, passwords in code. Client-side scanning—find secrets before committing.', icon: 'lock-keyhole' },
			{ name: 'Large File Detector', href: '/git/large-files', description: 'Large file detector online. Find files too big for Git. Get Git LFS recommendations—detect large files before pushing.', icon: 'package' }
		]
	},
	{
		name: 'Regex',
		icon: 'regex',
		description: 'Test, extract, replace, and explain JavaScript regular expressions. Flavor differences vs PCRE are called out.',
		items: [
			{ name: 'Regex Tester', href: '/regex/tester', description: 'This is JavaScript regex, not PCRE, not Python, not Go. A pattern that “worked in PHP” can fail here for reasons that look like your test string is wrong.', icon: 'flask-conical', keywords: ['javascript regex tester', 'js regexp', 'pcre vs javascript regex', 'regex lastIndex'] },
			{ name: 'Regex Matcher', href: '/regex/matcher', description: 'Regex match extractor online. Extract all matches and capture groups from text. Export matches as JSON, CSV, or plain list—free regex extraction tool.', icon: 'target' },
			{ name: 'Regex Replacer', href: '/regex/replacer', description: 'Find and replace with regular expressions, with live preview and capture-group support ($1, $2).', icon: 'refresh-cw' },
			{ name: 'Regex Explainer', href: '/regex/explainer', description: 'Regex explainer online. Break down regex patterns into tokens with plain English explanations. Understand any regex visually—free regex breakdown tool.', icon: 'book-open' },
			{ name: 'Regex Cheat Sheet', href: '/regex/cheatsheet', description: 'Regex cheat sheet online. Complete regex syntax reference with examples: character classes, quantifiers, anchors, groups, and flags. Free regex guide.', icon: 'clipboard' }
		]
	},
	{
		name: 'JWT',
		icon: 'lock-keyhole',
		description: 'Decode JWT header and payload, inspect claims and expiry, mint unsigned tokens for UI tests. Decoding is not verification.',
		items: [
			{ name: 'JWT Decoder', href: '/jwt/decoder', description: 'Decode is not verify. A readable payload is not a trusted user.', icon: 'lock-open', keywords: ['jwt decoder', 'jwt decode not verify', 'alg none jwt', 'jwt payload'] },
			{ name: 'Expiration Checker', href: '/jwt/expiration', description: 'JWT expiration checker online. Check if your JWT is expired, see time remaining, and view exp/iat/nbf timestamps in human-readable format with timezone support.', icon: 'timer' },
			{ name: 'Claims Viewer', href: '/jwt/claims', description: 'JWT claims viewer online. View and understand all JWT claims with descriptions. Highlights standard claims (iss, sub, aud, exp) and flags missing recommended claims.', icon: 'clipboard' },
			{ name: 'JWT Generator', href: '/jwt/generator', description: 'JWT generator online for testing. Create unsigned or demo JWT tokens for UI testing. NOT for production—generates test tokens with custom header and payload.', icon: 'zap' },
			{ name: 'Size Analyzer', href: '/jwt/size', description: 'The JWT spec has no size limit. Your cookie jar and your reverse proxy do.', icon: 'ruler' }
		]
	},
	{
		name: 'ID Tools',
		icon: 'fingerprint-pattern',
		description: 'Generate UUID v4/v7, NanoID, and ULID, and validate UUID layout.',
		items: [
			{ name: 'UUID Generator', href: '/id/uuid-generator', description: 'v4 is random. v7 is time-ordered.', icon: 'key', keywords: ['uuid v7', 'uuid v4 vs v7', 'rfc 9562', 'uuid primary key'] },
			{ name: 'UUID Validator', href: '/id/uuid-validator', description: 'Check whether a UUID is valid, detect its version (v1–v7), and see why one fails.', icon: 'check' },
			{ name: 'NanoID Generator', href: '/id/nanoid-generator', description: 'Generate compact, URL-safe NanoIDs with a custom length and alphabet.', icon: 'zap' },
			{ name: 'ULID Generator', href: '/id/ulid-generator', description: 'Generate sortable ULIDs with a timestamp component, and see how sorting works.', icon: 'chart-column' }
		]
	},
	{
		name: 'Cron',
		icon: 'clock',
		description: 'Build, explain, and preview cron expressions, including timezone and DST caveats.',
		items: [
			{ name: 'Cron Generator', href: '/cron/generator', description: 'Build 5-field or Quartz cron expressions with a visual builder and presets.', icon: 'wrench' },
			{ name: 'Cron Explainer', href: '/cron/explainer', description: 'Five fields is Vixie. Six is Quartz.', icon: 'book-open', keywords: ['cron explainer', 'vixie cron or', 'quartz cron 6 field', 'cron dst'] },
			{ name: 'Next Run Calculator', href: '/cron/next-run', description: 'Cron next run calculator online. Show next 10 scheduled runs with timezone support. DST-safe cron schedule preview—free cron calculator.', icon: 'calendar' },
			{ name: 'Cron Validator', href: '/cron/validator', description: 'Validate cron syntax, check field ranges, and get helpful error messages.', icon: 'check' },
			{ name: 'Cron Presets', href: '/cron/presets', description: 'Cron expression examples and presets. Copy-paste ready cron expressions for common schedules. Every minute, daily, weekly, monthly—cron cheat sheet.', icon: 'clipboard' },
			{ name: 'Human to Cron', href: '/cron/human', description: 'Natural language to cron converter online. Build cron expressions with dropdowns. Human-readable cron builder—convert schedule to cron free.', icon: 'refresh-cw' }
		]
	},
	{
		name: 'YAML',
		icon: 'file-text',
		description: 'Validate, format, and convert YAML, including JSON round-trips. Comments are usually dropped on re-serialize.',
		items: [
			{ name: 'YAML Validator', href: '/yaml/validator', description: 'Validate YAML syntax with clear line-and-column error messages.', icon: 'check' },
			{ name: 'YAML Formatter', href: '/yaml/formatter', description: 'Format and beautify YAML with the indentation you prefer.', icon: 'sparkles' },
			{ name: 'YAML to JSON', href: '/yaml/to-json', description: 'YAML is not JSON with comments. `NO` is false, `on` is true, and Norway\'s country code will disappear into a boolean if you don\'t quote it.', icon: 'arrow-right', keywords: ['yaml to json', 'norway problem yaml', 'yaml no boolean', 'yaml anchors json'] },
			{ name: 'JSON to YAML', href: '/yaml/from-json', description: 'Convert JSON into tidy YAML, with control over indentation.', icon: 'arrow-left' },
			{ name: 'YAML Diff', href: '/yaml/diff', description: 'Compare two YAML files side by side with structural change highlighting.', icon: 'arrow-left-right' },
			{ name: 'YAML Linter', href: '/yaml/linter', description: 'Catch duplicate keys, indentation problems, and trailing spaces in YAML.', icon: 'search' },
			{ name: 'YAML Key Sorter', href: '/yaml/sorter', description: 'Sort YAML keys alphabetically, with an option to recurse into nested maps.', icon: 'case-sensitive' },
			{ name: 'YAML to ENV', href: '/yaml/to-env', description: 'Flatten YAML into .env format, with custom separators for nested keys.', icon: 'file-pen' }
		]
	},
	{
		name: 'Kubernetes',
		icon: 'ship-wheel',
		description: 'Inspect, diff, and split Kubernetes YAML. We do not talk to your cluster or read kubeconfig.',
		items: [
			{ name: 'K8s Inspector', href: '/k8s/inspector', description: 'Inspect Kubernetes manifests: detect resource types and check required fields.', icon: 'search' },
			{ name: 'K8s Resource Diff', href: '/k8s/diff', description: 'Compare Kubernetes manifests with a semantic diff of added, removed, and changed resources.', icon: 'arrow-left-right' },
			{ name: 'K8s Manifest Splitter', href: '/k8s/splitter', description: 'Split a multi-document YAML file into separate manifests and download them as a ZIP.', icon: 'scissors' },
			{ name: 'K8s to Helm', href: '/k8s/helm', description: 'Turn Kubernetes manifests into a Helm chart with generated values and templates.', icon: 'anchor' },
			{ name: 'K8s API Checker', href: '/k8s/api-checker', description: 'Check manifests for deprecated or removed Kubernetes APIs by cluster version.', icon: 'clipboard' }
		]
	},
	{
		name: 'Security',
		icon: 'lock',
		description: 'Draft CSP and CORS headers, test password strength locally, and read HTTP security references. This is not a pentest of your site.',
		items: [
			{ name: 'CSP Generator', href: '/security/csp', description: 'Build a Content Security Policy visually and get warnings about unsafe directives.', icon: 'shield' },
			{ name: 'CORS Generator', href: '/security/cors', description: 'Assemble Access-Control headers by choosing origins, methods, and options.', icon: 'globe' },
			{ name: 'Password Tester', href: '/security/password', description: 'Check password strength with entropy, estimated crack time, and dictionary checks — entirely in your browser.', icon: 'key' },
			{ name: 'HTTP Status Codes', href: '/security/http-status', description: 'A quick reference to every HTTP status code, explained with examples.', icon: 'chart-column' },
			{ name: 'X-Frame-Options', href: '/security/x-frame', description: 'Understand X-Frame-Options and how DENY and SAMEORIGIN help prevent clickjacking.', icon: 'image' },
			{ name: 'Security Headers', href: '/security/headers', description: 'A cheat sheet of HTTP security headers, each explained with examples.', icon: 'clipboard' },
			{ name: 'OWASP Top 10', href: '/security/owasp', description: 'An interactive checklist for tracking OWASP Top 10 (2021) coverage, with examples.', icon: 'check' },
			{ name: 'Misconfig Detector', href: '/security/misconfig', description: 'Scan headers and config files for common security misconfigurations.', icon: 'triangle-alert' },
			{ name: 'Headers Checklist', href: '/security/headers-checklist', description: 'Secure headers implementation checklist. Framework-specific snippets for NGINX, Apache, Node. Security headers setup guide.', icon: 'square-check' },
			{ name: 'Password Storage', href: '/security/password-storage', description: 'Password storage best practices generator. Algorithm recommendations, salt, pepper, cost factors. Secure password hashing guide.', icon: 'lock-keyhole' },
			{ name: 'Threat Model', href: '/security/threat-model', description: 'Run a quick STRIDE-style threat model with risk levels for your web app.', icon: 'zap' }
		]
	}
];

// Helper: Get all active categories
export function getActiveCategories(): ToolCategory[] {
	return toolCategories
		.filter(cat => cat.active !== false)
		.map(cat => ({
			...cat,
			items: cat.items.filter(item => item.active !== false)
		}));
}

// Helper: Get all active tools flat list
export function getAllActiveTools(): ToolItem[] {
	return getActiveCategories().flatMap(cat => cat.items);
}

// Helper: Get tool by path (returns full tool data for SEO)
export function getToolByPath(path: string): ToolItem | undefined {
	for (const cat of toolCategories) {
		const tool = cat.items.find(item => item.href === path);
		if (tool) return tool;
	}
	return undefined;
}

// Helper: Get tool name by path
export function getToolNameByPath(path: string): string | undefined {
	return getToolByPath(path)?.name;
}

// Helper: Build toolNames record for layout
export function getToolNamesRecord(): Record<string, string> {
	const record: Record<string, string> = { '/': 'Dev Tools', '/mcp': 'MCP Server' };
	for (const cat of getActiveCategories()) {
		for (const tool of cat.items) {
			record[tool.href] = tool.name;
		}
	}
	return record;
}

// Helper: Build sidebar accordions format
export function getSidebarAccordions() {
	return getActiveCategories().map(cat => ({
		name: cat.name,
		icon: cat.icon,
		items: cat.items.map(item => ({
			name: item.name,
			href: item.href
		}))
	}));
}

// Helper: Derive URL slug from category name e.g. "AI Utilities" → "ai"
// Matches the actual route paths used in the app
export function getCategorySlug(cat: ToolCategory): string {
	const overrides: Record<string, string> = {
		'AI Utilities': 'ai',
		'CSS Layout': 'css-layout',
		'ID Tools': 'id',
		'QR & Barcode': 'qr',
		'Kubernetes': 'k8s',
		'Date & Time': 'date'
	};
	return overrides[cat.name] ?? cat.name.toLowerCase().replace(/\s+/g, '-');
}

// Helper: Get a category by its URL slug
export function getCategoryBySlug(slug: string): ToolCategory | undefined {
	return toolCategories.find(cat => getCategorySlug(cat) === slug);
}

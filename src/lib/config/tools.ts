// Centralized tool configuration for sidebar, homepage, and sitemap
// Add active: false to hide a tool from all places

export interface ToolItem {
	name: string;
	href: string;
	description?: string;
	icon?: string;
	active?: boolean; // defaults to true
}

export interface ToolCategory {
	name: string;
	icon: string;
	description?: string; // SEO-rich category intro
	active?: boolean; // defaults to true
	items: ToolItem[];
}

export const BASE_URL = import.meta.env.DEV ? 'http://localhost:5173' : 'https://onedev.tools';

export const toolCategories: ToolCategory[] = [
	{
		name: 'JSON',
		icon: '{ }',
		description: 'Free online JSON tools to format, validate, compare, and convert JSON. Use our JSON formatter, validator, diff checker, and type generator directly in your browser—no uploads, no signup required.',
		items: [
			{ name: 'JSON Formatter', href: '/json/formatter', description: 'JSON formatter online to format, prettify, and validate JSON. Instantly beautify JSON, detect syntax errors, and fix invalid JSON directly in your browser.', icon: '{ }' },
			{ name: 'JSON Validator', href: '/json/validator', description: 'JSON validator online with line-by-line error details. Check if your JSON is valid instantly—get precise error locations and fix issues fast.', icon: '✓' },
			{ name: 'JSON Diff', href: '/json/diff', description: 'JSON diff checker online to compare two JSON objects side by side. Highlights added, removed, and changed values instantly in your browser.', icon: '≠' },
			{ name: 'JSON → Table', href: '/json/table', description: 'Convert JSON to table online. Transform JSON arrays into sortable, searchable tables. Export to CSV or copy as markdown—free and instant.', icon: '📊' },
			{ name: 'JSON Visualizer', href: '/json/visualizer', description: 'JSON tree viewer online. Explore JSON with an interactive tree view—expand, collapse, and search nodes. Visualize complex JSON structures instantly.', icon: '🌲' },
			{ name: 'Type Generator', href: '/json/type-generator', description: 'JSON to TypeScript online. Generate TypeScript interfaces or Go structs from JSON instantly. Convert JSON to types directly in your browser.', icon: '⟨T⟩' },
			{ name: 'Path Tester', href: '/json/path-tester', description: 'JSONPath tester online. Test JSONPath expressions against your data and see matched values instantly. Debug JSONPath queries free in your browser.', icon: '🔍' },
		{ name: 'Relationship Visualizer', href: '/json/relationship', description: 'JSON relationship visualizer online. Visualize JSON structure as an interactive node graph with connections. Explore object hierarchies, copy nodes, and pan/zoom—free in your browser.', icon: '🔗' }
		]
	},
	{
		name: 'PDF',
		icon: '📄',
		description: 'Free online PDF tools to view, split, merge, compress, and edit PDFs. Add watermarks and page numbers, redact content, compare PDFs, sign documents, and create PDFs from images—all processing happens in your browser, no file uploads.',
		items: [
			{ name: 'PDF Viewer', href: '/pdf/viewer', description: 'View PDF files right in your browser with page navigation and zoom — nothing is uploaded.', icon: '👁️' },
			{ name: 'PDF Splitter', href: '/pdf/split', description: 'Split a PDF or pull out specific pages by range, then download the result.', icon: '✂️' },
			{ name: 'PDF Merger', href: '/pdf/merge', description: 'Combine several PDFs into one document and drag pages to reorder them before saving.', icon: '🔗' },
			{ name: 'PDF Compressor', href: '/pdf/compress', description: 'Reduce PDF file size while keeping quality, so documents are easier to email or host.', icon: '📦' },
			{ name: 'PDF Watermark', href: '/pdf/watermark', description: 'Add a text or image watermark to PDF pages, with control over opacity, position, and rotation.', icon: '💧' },
			{ name: 'PDF Page Numbers', href: '/pdf/page-numbers', description: 'Add page numbers to a PDF with your choice of position, font size, and starting number.', icon: '🔢' },
			{ name: 'PDF Redact', href: '/pdf/redact', description: 'Permanently remove sensitive text and images from a PDF by drawing redaction boxes.', icon: '🖍️' },
			{ name: 'PDF Compare', href: '/pdf/compare', description: 'Compare two PDFs side by side and highlight what changed between versions.', icon: '⚖️' },
			{ name: 'PDF Sign', href: '/pdf/sign', description: 'Draw or upload your signature and place it anywhere on a PDF to sign it.', icon: '✍️' },
			{ name: 'Images to PDF', href: '/pdf/images-to-pdf', description: 'Combine multiple images into a single PDF, choosing page size and orientation.', icon: '🖼️' }
		]
	},
	{
		name: 'Base64',
		icon: '⚡',
		description: 'Free Base64 encoder and decoder online. Encode text, files, and images to Base64 or decode Base64 strings instantly in your browser. No file uploads to servers—everything runs client-side.',
		items: [
			{ name: 'Encode / Decode', href: '/base64/encode-decode', description: 'Base64 encoder and decoder online. Encode text to Base64 or decode Base64 strings instantly in your browser with automatic input detection.', icon: '🔄' },
			{ name: 'Image to Base64', href: '/base64/image-encoder', description: 'Image to Base64 converter online. Convert PNG, JPG, WebP, and SVG images to Base64 data URIs for HTML/CSS embedding. Free image encoder tool.', icon: '🖼️' },
			{ name: 'File to Base64', href: '/base64/file-encoder', description: 'Encode files to Base64 online. Convert any file to Base64 content for embedding in HTML, JSON, or XML. Free file to Base64 converter.', icon: '📁' },
			{ name: 'Image Preview', href: '/base64/image-preview', description: 'Base64 image viewer online. Paste Base64 image data and preview instantly. Supports PNG, JPG, WebP, GIF—decode and view Base64 images free.', icon: '🖼️' },
			{ name: 'URL-safe Converter', href: '/base64/url-safe', description: 'URL-safe Base64 converter online. Convert between standard Base64 and URL-safe Base64 format (replaces +/ with -_). Free browser tool.', icon: '🔗' },
			{ name: 'Validator', href: '/base64/validator', description: 'Base64 validator online. Check if a string is valid Base64 instantly. Detect encoding issues, padding problems, and invalid characters free.', icon: '✓' },
			{ name: 'Splitter', href: '/base64/splitter', description: 'Base64 line splitter online. Split long Base64 strings into lines for embedding in code, config files, or PEM certificates. Free browser tool.', icon: '✂️' },
			{ name: 'Hex / Binary', href: '/base64/hex-binary', description: 'Base64 to hex converter online. Convert Base64 to hexadecimal or binary representation and back. Free encoding conversion in your browser.', icon: '01' }
		]
	},
	{
		name: 'URL',
		icon: '🔗',
		description: 'Free URL tools online to encode, decode, parse, and build URLs. Validate URLs, generate SEO-friendly slugs, and parse query strings directly in your browser—no signup needed.',
		items: [
			{ name: 'Encode / Decode', href: '/url/encode-decode', description: 'URL encoder and decoder online. Encode special characters or decode percent-encoded URLs instantly. Auto-detects input type—free browser tool.', icon: '🔐' },
			{ name: 'Query Parser', href: '/url/query-parser', description: 'URL query string parser online. Parse query parameters into a key-value table instantly. Export as JSON or CSV—free URL parameter extractor.', icon: '📋' },
			{ name: 'URL Builder', href: '/url/builder', description: 'URL builder online. Build URLs with query parameters visually. Paste existing URLs to parse and edit them—generate URLs free in your browser.', icon: '🔧' },
			{ name: 'Validator', href: '/url/validator', description: 'URL validator online. Check if a URL is valid and see protocol, domain, port, and path breakdown. Validate URLs instantly—free browser tool.', icon: '✓' },
			{ name: 'Parts Analyzer', href: '/url/parts', description: 'URL parser online. Visual breakdown of URL components: protocol, host, port, path, query, hash. Analyze URL structure instantly and free.', icon: '🔬' },
			{ name: 'Slug Generator', href: '/url/slug-generator', description: 'URL slug generator online. Convert any text to SEO-friendly, URL-safe slugs. Handles unicode and special characters—create slugs instantly free.', icon: '📝' },
			{ name: 'Normalizer', href: '/url/normalizer', description: 'URL normalizer online. Normalize URLs: lowercase hostname, sort query params, remove defaults. Standardize URLs for comparison—free browser tool.', icon: '🧹' },
			{ name: 'Compare', href: '/url/compare', description: 'URL comparator online. Compare two URLs semantically and find differences in path, query, or fragment. URL diff checker—free in your browser.', icon: '⚖️' },
			{ name: 'JSON Converter', href: '/url/json-converter', description: 'URL to JSON converter online. Convert URL query strings to JSON objects and back. Handles nested parameters—free query string converter.', icon: '🔄' },
			{ name: 'Length Checker', href: '/url/length-checker', description: 'URL length checker online. Check URL length against browser and server limits. Avoid "URL too long" errors—free length validator.', icon: '📏' }
		]
	},
	{
		name: 'Image',
		icon: '🖼️',
		description: 'Free online image tools to compress, resize, crop, and convert images. Extract colors, view EXIF metadata, and remove backgrounds—all processing happens in your browser, no uploads.',
		items: [
			{ name: 'Image Compressor', href: '/image/compressor', description: 'Online image compressor to reduce file size without losing quality. Compress JPEG, PNG, WebP images directly in your browser—free, no uploads.', icon: '📦' },
			{ name: 'Image BG Remover', href: '/image/remove-white', description: 'Make white or light image backgrounds transparent, with adjustable tolerance.', icon: '🧹' },
			{ name: 'Image Resizer', href: '/image/resize', description: 'Resize images by pixels or percentage, with an optional aspect-ratio lock — no uploads.', icon: '📐' },
			{ name: 'Image Cropper', href: '/image/crop', description: 'Crop images with preset ratios (16:9, 4:3, 1:1) or a freeform selection.', icon: '✂️' },
			{ name: 'Image Format Converter', href: '/image/converter', description: 'Image format converter online. Convert images between JPEG, PNG, WebP, and GIF formats instantly. Free image converter in your browser.', icon: '🔄' },
			{ name: 'Image Metadata Viewer', href: '/image/metadata', description: 'View image EXIF metadata — camera, GPS location, date, and settings — with an option to strip it.', icon: '📋' },
			{ name: 'Image Color Extractor', href: '/image/colors', description: 'Image color picker online. Extract dominant colors and color palette from images. Get hex codes for theming—free color extractor tool.', icon: '🎨' },
			{ name: 'Image Blur', href: '/image/blur', description: 'Image blur tool online. Apply blur or pixelate effects to images. Preview in real-time, then download—free image privacy tool.', icon: '🔲' }
		]
	},
	{
		name: 'System',
		icon: '💻',
		description: 'Free browser-based system information tools. Detect your OS, CPU, memory, screen resolution, GPU, and network info. Check browser capabilities and device permissions—all client-side.',
		items: [
			{ name: 'System Info', href: '/system/info', description: 'System information tool online. Detect your OS, CPU cores, memory, screen resolution, and GPU info. Check system specs in your browser—free.', icon: '🖥️' },
			{ name: 'Browser Info', href: '/system/browser', description: 'Browser detector online. Check browser name, version, engine, and supported features. Detect browser capabilities instantly—free tool.', icon: '🌐' },
			{ name: 'Network Info', href: '/system/network', description: 'Network info tool online. Check connection type, effective speed, and public IP address. Test your network details—free browser tool.', icon: '📡' },
			{ name: 'Media Devices', href: '/system/media', description: 'Media device checker online. List available cameras, microphones, and speakers. Test webcam and mic access—free device detection tool.', icon: '🎥' },
			{ name: 'Permissions', href: '/system/permissions', description: 'Browser permissions checker online. Check camera, microphone, location, notification permissions. See what browser has access to—free tool.', icon: '🔐' }
		]
	},
	{
		name: 'Text',
		icon: '📝',
		description: 'Free online text tools for developers. Convert text case, sort lines, find and replace with regex, compare text, count words, and generate lorem ipsum—all in your browser.',
		items: [
			{ name: 'String Compare', href: '/text/string-compare', description: 'String comparison tool online. Compare two strings word by word to find differences. Visual textual comparison tool free.', icon: '🔤' },
			{ name: 'Case Converter', href: '/text/case-converter', description: 'Text case converter online. Convert between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, lowercase. Change text case instantly free.', icon: '🔤' },
			{ name: 'Line Tools', href: '/text/line-tools', description: 'Line sorter and text tools online. Sort lines, remove duplicates, trim whitespace, reverse order. Manipulate text lines free in your browser.', icon: '📋' },
			{ name: 'Text Diff', href: '/text/diff', description: 'Text diff checker online. Compare two text blocks line by line with highlighted additions and deletions. Free text comparison tool.', icon: '⚖️' },
			{ name: 'Find & Replace', href: '/text/find-replace', description: 'Find and replace online with regex support. Search and replace text patterns, preview matches before applying. Free regex replace tool.', icon: '🔍' },
			{ name: 'Word Count', href: '/text/statistics', description: 'Count characters, words, sentences, paragraphs, and estimated reading time.', icon: '📊' },
			{ name: 'Anagram Finder', href: '/text/anagram', description: 'Anagram solver online. Find all anagrams of a word or phrase with dictionary validation. Anagram generator free in your browser.', icon: '🔀' },
			{ name: 'Remove Duplicates', href: '/text/remove-duplicates', description: 'Remove duplicate lines online. Delete duplicate words or lines from text while preserving order. Free duplicate remover tool.', icon: '✂️' },
			{ name: 'Lorem Ipsum', href: '/text/lorem-ipsum', description: 'Lorem ipsum generator online. Generate placeholder text: paragraphs, sentences, or words. Create dummy text instantly free.', icon: '📄' },
			{ name: 'Blabber Generator', href: '/text/blabber', description: 'Random text generator online. Generate readable gibberish text for testing layouts and designs. Fake text generator free.', icon: '💬' }
		]
	},
	{
		name: 'HTML',
		icon: '📄',
		description: 'Free online HTML tools to validate, format, and extract content from HTML. Parse DOM structure, extract links and images, clean attributes—all processing in your browser.',
		items: [
			{ name: 'HTML Validator (Basic)', href: '/html/validator', description: 'HTML validator online. Check for unclosed tags, invalid nesting, duplicate IDs, and common HTML errors. Validate HTML free in your browser.', icon: '✓' },
			{ name: 'HTML Formatter', href: '/html/formatter', description: 'HTML formatter and beautifier online. Format, prettify, or minify HTML with proper indentation. HTML pretty print free in your browser.', icon: '{ }' },
			{ name: 'HTML → Text', href: '/html/text-extractor', description: 'HTML to plain text converter online. Strip all HTML tags and extract text content only. Remove HTML tags free—get clean text instantly.', icon: '📝' },
			{ name: 'Element Extractor', href: '/html/element-extractor', description: 'HTML element extractor online. Extract all links, images, meta tags, or scripts from HTML. Parse HTML elements free in your browser.', icon: '🔍' },
			{ name: 'DOM Visualizer', href: '/html/dom-visualizer', description: 'HTML DOM tree viewer online. Interactive tree view of HTML structure with search and copy. Visualize DOM hierarchy free.', icon: '🌲' },
			{ name: 'HTML → JSON', href: '/html/to-json', description: 'HTML to JSON converter online. Convert HTML DOM structure to JSON representation. Parse HTML to JSON object free in your browser.', icon: '🔄' },
			{ name: 'Attribute Cleaner', href: '/html/attribute-cleaner', description: 'HTML attribute remover online. Remove inline styles, data attributes, classes, or empty attributes. Clean HTML code free in your browser.', icon: '🧹' },
			{ name: 'Tag Counter', href: '/html/tag-counter', description: 'HTML tag counter online. Count occurrences of each HTML tag and see element distribution. Analyze HTML structure free.', icon: '📊' }
		]
	},
	{
		name: 'Break',
		icon: '☕',
		description: 'Take a break from coding with relaxation tools. Pomodoro timer for focus sessions, ambient sounds, breathing exercises, and calming visuals—free productivity and wellness tools.',
		items: [
			{ name: 'Pomodoro Timer', href: '/break/pomodoro', description: 'A focus timer with 25/5 and 50/10 presets and a chime when each session ends.', icon: '🍅' },
			{ name: 'Ambient Rest', href: '/break/ambient', description: 'Full-screen calm backgrounds with rain or café sounds to help you focus and recharge.', icon: '🌧️' },
			{ name: 'Minimal Clock', href: '/break/clock', description: 'A large, distraction-free fullscreen clock with analog or digital display.', icon: '🕐' },
			{ name: 'Zen Motion', href: '/break/zen-motion', description: 'A nostalgic bouncing-shape animation to rest your eyes between sessions.', icon: '📀' },
			{ name: 'Breathing Timer', href: '/break/breathing', description: 'Guided breathing with configurable inhale, hold, and exhale — including box breathing and 4-7-8.', icon: '🌬️' }
		]
	},
	{
		name: 'Convert',
		icon: '🔄',
		description: 'Free unit converter tools online. Convert CSS units, lengths, screen resolutions, time, data sizes, angles, number bases, typography, and colors—instant conversion in your browser.',
		items: [
			{ name: 'CSS Units', href: '/convert/css-units', description: 'Convert between px, rem, em, vw, vh, pt, and percentages, with live results.', icon: '📐' },
			{ name: 'Length', href: '/convert/length', description: 'Convert between mm, cm, inches, feet, meters, km, and pixels at any DPI.', icon: '📏' },
			{ name: 'Screen / Resolution', href: '/convert/screen', description: 'Work out screen dimensions, DPI, and PPI from a resolution — or the other way around.', icon: '🖥️' },
			{ name: 'Time', href: '/convert/time', description: 'Convert between milliseconds, seconds, minutes, hours, and days in human-readable form.', icon: '⏱️' },
			{ name: 'Data Size', href: '/convert/data-size', description: 'Convert between bytes, KB, MB, GB, and TB using decimal (SI) or binary (IEC) units.', icon: '💾' },
			{ name: 'Angle', href: '/convert/angle', description: 'Convert between degrees, radians, gradians, and turns, with a visual arc preview.', icon: '📐' },
			{ name: 'Number Base', href: '/convert/number-base', description: 'Convert between binary, decimal, hexadecimal, and octal, with a bit-by-bit view.', icon: '🔢' },
			{ name: 'Typography', href: '/convert/typography', description: 'Convert px, pt, em, and rem for typography, and preview line-height and type scale.', icon: '🔤' },
			{ name: 'Color', href: '/convert/color', description: 'Convert between HEX, RGB, RGBA, HSL, HSLA, and HSB, with a live color preview.', icon: '🎨' }
		]
	},
	{
		name: 'CSS',
		icon: '🎨',
		description: 'Free CSS tools and generators online. Format CSS, generate animations, create flexbox and grid layouts, build gradients and shadows—visual CSS generators in your browser.',
		items: [
			{ name: 'Formatter', href: '/css/formatter', description: 'CSS formatter and beautifier online. Format CSS code with proper indentation. CSS pretty print and code beautifier—free in your browser.', icon: '✨' },
			{ name: 'Minifier', href: '/css/minifier', description: 'Compress CSS by stripping whitespace and comments to shrink file size.', icon: '📦' },
			{ name: 'Prefix Cleaner', href: '/css/prefix-cleaner', description: 'CSS prefix remover online. Remove vendor prefixes (-webkit-, -moz-, -ms-, -o-). Clean up CSS autoprefixer output—free tool.', icon: '🧹' },
			{ name: 'CSS Gradient Generator', href: '/css/gradient', description: 'Create linear, radial, and conic gradients with a visual editor, multiple color stops, and live preview.', icon: '🌈' },
			{ name: 'Transition', href: '/css/transition', description: 'CSS transition generator online. Create CSS transitions with live preview. Generate smooth animations—free transition builder.', icon: '🔄' },
			{ name: 'Bezier Curve', href: '/css/bezier', description: 'CSS cubic-bezier editor online. Interactive curve editor for timing functions. Create custom easing—bezier curve generator free.', icon: '📈' },
			{ name: 'Keyframes', href: '/css/keyframes', description: 'CSS keyframes generator online. Create @keyframes animations with editable stops. CSS animation builder—free keyframe editor.', icon: '🎬' },

			{ name: 'Box Shadow Generator', href: '/css/box-shadow', description: 'CSS box shadow generator online. Create box-shadows with multiple layers and presets. Live preview—free shadow generator tool.', icon: '🌑' },
			{ name: 'Text Shadow Generator', href: '/css/text-shadow', description: 'CSS text shadow generator online. Create text-shadow effects with live preview. Multiple shadow layers—free text shadow tool.', icon: '💬' },
			{ name: 'Filter Generator', href: '/css/filter', description: 'CSS filter generator online. Generate blur, brightness, contrast, grayscale, and more. Live filter preview—free CSS filter tool.', icon: '🎛️' },
			{ name: 'CSS Text Gradient', href: '/css/text-gradient', description: 'CSS text gradient generator. Create beautiful gradient text for headings and logos. Copy CSS code for gradient typography instantly.', icon: '✨' },
			{ name: 'Snippets', href: '/css/snippets', description: 'CSS snippets library online. Ready-to-use CSS: centering tricks, text truncation, accessibility helpers. Copy CSS snippets free.', icon: '📋' }
		]
	},
	{
		name: 'CSS Layout',
		icon: '📐',
		description: 'Free CSS layout generators and tools. Visual builders for Flexbox, Grid, Masonry, and responsive design. Aspect ratio calculator and positioning playground—master CSS layouts visually.',
		items: [
			{ name: 'Flexbox Generator', href: '/css-layout/flexbox', description: 'CSS flexbox visualizer and generator. Interactive playground for flex direction, alignment, wrapping, and gap. Generate flex layout code instantly.', icon: '📦' },
			{ name: 'Grid Builder', href: '/css-layout/grid', description: 'CSS grid generator online. Drag-and-drop grid builder with named areas and auto-placement. Create complex grid layouts visually.', icon: '⊞' },
			{ name: 'Masonry Layout', href: '/css-layout/masonry', description: 'CSS masonry layout generator. Create Pinterest-style layouts using pure CSS columns or flexbox fallback. Responsive masonry grid builder.', icon: '🧱' },
			{ name: 'Responsive Helper', href: '/css-layout/responsive', description: 'CSS responsive design helper. Generate media queries and common breakpoints for mobile, tablet, and desktop. Responsive layout tool.', icon: '📱' },
			{ name: 'Position & Z-Index', href: '/css-layout/position', description: 'CSS positioning playground. Visualize absolute, relative, fixed, sticky positioning and z-index stacking contexts. Layout positioning tool.', icon: '📍' },
			{ name: 'Spacing & Gap', href: '/css-layout/spacing', description: 'CSS spacing generator. Visual margin and padding builder with preview. Generate consistent spacing utilities and layouts.', icon: '↔️' },
			{ name: 'Aspect Ratio', href: '/css-layout/aspect-ratio', description: 'CSS aspect ratio calculator. Generate aspect-ratio property and padding-hack fallbacks. Visual aspect ratio preview tool.', icon: 'rect' }
		]
	},
	{
		name: 'AI Utilities',
		icon: '🤖',
		description: 'Free AI and LLM tools for developers. Count tokens for GPT-4, Claude, Gemini. Estimate API costs, trim prompts to fit context limits, and plan embeddings—all in your browser.',
		items: [
			{ name: 'Token Counter', href: '/ai/token-counter', description: 'AI token counter online. Count tokens for GPT-4, Claude, Gemini and more. Character count and cost estimation—free LLM token calculator.', icon: '🔢' },
			{ name: 'Token Visualizer', href: '/ai/token-visualizer', description: 'AI token visualizer online. See how AI models break text into tokens. Understand tokenization visually—free token boundary viewer.', icon: '🎨' },
			{ name: 'Context Estimator', href: '/ai/context-estimator', description: 'AI context window calculator online. Calculate tokens for prompts, system messages, chat history. Check remaining context—free tool.', icon: '📊' },
			{ name: 'Prompt Trimmer', href: '/ai/prompt-trimmer', description: 'AI prompt trimmer online. Trim text to fit token limits. Sentence-aware and paragraph-aware modes—reduce prompt length free.', icon: '✂️' },
			{ name: 'Embedding Estimator', href: '/ai/embedding-estimator', description: 'AI embedding calculator online. Estimate tokens and vector dimensions for embedding models. Plan vector DB storage—free embeddings tool.', icon: '📐' },
			{ name: 'Cost Estimator', href: '/ai/cost-estimator', description: 'AI API cost calculator online. Estimate costs for GPT-4, Claude, Gemini APIs. Input and output token pricing—free LLM cost tool.', icon: '💰' },
			{ name: 'Cost Compare', href: '/ai/cost-compare', description: 'Compare AI API costs online. Estimate daily limits and monthly pricing across top LLM models like GPT-4o, Claude 3.5, Gemini, DeepSeek, and Kimi. Free LLM comparison grid.', icon: '⚖️' }
		]
	},
	{
		name: 'Hash',
		icon: '#️⃣',
		description: 'Free hash generator and checksum tools online. Create MD5, SHA-256, SHA-512, CRC32 hashes from text or files. Verify file integrity, compare hashes, and identify hash types—all in your browser.',
		items: [
			{ name: 'Hash Generator', href: '/hash/generator', description: 'Generate MD5, SHA-1, SHA-256, SHA-512, and CRC32 hashes from text or files, all in one place.', icon: '🔐' },
			{ name: 'MD5 Hash Online', href: '/hash/md5', description: 'Create an MD5 checksum from text or a file with this fast MD5 calculator.', icon: '🔒' },
			{ name: 'SHA-256 Hash', href: '/hash/sha256', description: 'Generate secure 256-bit SHA-256 hashes from text or files.', icon: '🔒' },
			{ name: 'SHA-512 Hash', href: '/hash/sha512', description: 'Generate 512-bit SHA-512 hashes when you need maximum strength.', icon: '🔒' },
			{ name: 'SHA-1 Hash', href: '/hash/sha1', description: 'Create 160-bit SHA-1 hashes, still handy for Git commits and file verification.', icon: '🔒' },
			{ name: 'CRC32 Checksum', href: '/hash/crc32', description: 'Calculate a CRC32 checksum for quick file-integrity checks.', icon: '✓' },
			{ name: 'Hash Identifier', href: '/hash/identifier', description: 'Not sure what a hash is? Detect whether it looks like MD5, SHA-256, bcrypt, or another type.', icon: '🔍' },
			{ name: 'Compare Hashes', href: '/hash/compare', description: 'Compare two hashes with case-insensitive matching and a clear match indicator.', icon: '⚖️' },
			{ name: 'File Checksum', href: '/hash/file-checksum', description: 'Verify a downloaded file hash against the expected value to confirm integrity.', icon: '📁' },
			{ name: 'Hash Lookup', href: '/hash/lookup', description: 'Reverse-lookup an MD5 or SHA-1 hash to see if it matches a known value.', icon: '🔓' },
			{ name: 'HMAC Generator', href: '/hash/hmac', description: 'Generate keyed HMAC-SHA256 and HMAC-SHA512 authentication codes.', icon: '🔑' },
			{ name: 'Hash Converter', href: '/hash/converter', description: 'Convert a hash between hex and Base64, change its case, or add byte separators.', icon: '🔄' }
		]
	},
	{
		name: 'Git',
		icon: '🔀',
		description: 'Free Git tools online for developers. Generate .gitignore files, format commit messages, create branch names, build Git commands, and scan for secrets—all in your browser.',
		items: [
			{ name: 'Gitignore Generator', href: '/git/gitignore', description: 'Create .gitignore files for Node, Python, Java, Go, Rust, and more — combine presets, then copy or download.', icon: '🚫' },
			{ name: 'Commit Generator', href: '/git/commit-generator', description: 'Conventional commit generator online. Build formatted commit messages with type, scope, and description. Emoji support—create git commits instantly.', icon: '💬' },
			{ name: 'Commit Validator', href: '/git/commit-validator', description: 'Commit message validator online. Validate against Conventional Commits spec with detailed error explanations. Check commit format free.', icon: '✓' },
			{ name: 'Branch Generator', href: '/git/branch-generator', description: 'Git branch name generator online. Create feature, bugfix, hotfix branches with ticket IDs. Customizable prefix order—copy branch names instantly.', icon: '🌿' },
			{ name: 'Workflow Guide', href: '/git/workflow', description: 'Git workflow cheat sheet online. Learn Git Flow, trunk-based development, and feature branching with visual diagrams. Free Git guide.', icon: '📋' },
			{ name: 'Diff Viewer', href: '/git/diff-viewer', description: 'Compare text with a side-by-side or inline diff, with syntax highlighting and whitespace ignore.', icon: '📊' },
			{ name: 'Log Formatter', href: '/git/log-formatter', description: 'Git log format generator online. Customize git log output with format placeholders. Generate pretty log commands—copy instantly.', icon: '📜' },
			{ name: 'Git Blame Explainer', href: '/git/blame-explainer', description: 'Git blame explainer online. Paste git blame output and understand each field. Learn blame format visually—free educational tool.', icon: '🔍' },
			{ name: 'Reset Helper', href: '/git/reset-helper', description: 'Git reset helper online. Understand soft, mixed, hard reset with visual diagrams. Generate reset commands safely—free Git tool.', icon: '⏪' },
			{ name: 'Rebase Helper', href: '/git/rebase-helper', description: 'Git rebase guide online. Interactive rebase steps with visual explanation. Learn rebase commands—free Git rebase tool.', icon: '🔄' },
			{ name: 'Config Generator', href: '/git/config-generator', description: 'Git config generator online. Generate git config commands for name, email, aliases, and settings. Configure Git easily—copy commands free.', icon: '⚙️' },
			{ name: 'Alias Generator', href: '/git/alias-generator', description: 'Git alias generator online. Create common Git aliases like co, br, st. Custom alias builder—copy git alias commands free.', icon: '⌨️' },
			{ name: 'README Generator', href: '/git/readme-generator', description: 'Create a GitHub README with badges, sections, and templates, with a live Markdown preview and download.', icon: '📄' },
			{ name: 'License Picker', href: '/git/license-picker', description: 'Choose a license (MIT, Apache, GPL) with plain-English explanations, then generate the LICENSE file.', icon: '📜' },
			{ name: 'Secrets Scanner', href: '/git/secrets-scanner', description: 'Git secrets scanner online. Detect API keys, tokens, passwords in code. Client-side scanning—find secrets before committing.', icon: '🔐' },
			{ name: 'Large File Detector', href: '/git/large-files', description: 'Large file detector online. Find files too big for Git. Get Git LFS recommendations—detect large files before pushing.', icon: '📦' }
		]
	},
	{
		name: 'Regex',
		icon: '.*',
		description: 'Free regex tools online to test, match, replace, and explain regular expressions. Build regex patterns, extract matches, and learn regex syntax—all in your browser with instant visual feedback.',
		items: [
			{ name: 'Regex Tester', href: '/regex/tester', description: 'Test regular expressions with live highlighting, flag toggles (g i m s u), and a match count.', icon: '🧪' },
			{ name: 'Regex Matcher', href: '/regex/matcher', description: 'Regex match extractor online. Extract all matches and capture groups from text. Export matches as JSON, CSV, or plain list—free regex extraction tool.', icon: '🎯' },
			{ name: 'Regex Replacer', href: '/regex/replacer', description: 'Find and replace with regular expressions, with live preview and capture-group support ($1, $2).', icon: '🔄' },
			{ name: 'Regex Explainer', href: '/regex/explainer', description: 'Regex explainer online. Break down regex patterns into tokens with plain English explanations. Understand any regex visually—free regex breakdown tool.', icon: '📖' },
			{ name: 'Regex Cheat Sheet', href: '/regex/cheatsheet', description: 'Regex cheat sheet online. Complete regex syntax reference with examples: character classes, quantifiers, anchors, groups, and flags. Free regex guide.', icon: '📋' }
		]
	},
	{
		name: 'JWT',
		icon: '🔐',
		description: 'Free JWT decoder and tools online. Decode JSON Web Tokens, check expiration, view claims, generate test tokens, and analyze token size—all client-side in your browser.',
		items: [
			{ name: 'JWT Decoder', href: '/jwt/decoder', description: 'Decode a JWT header and payload to view the algorithm, claims, and expiry as pretty JSON — decoding only, no signature verification.', icon: '🔓' },
			{ name: 'Expiration Checker', href: '/jwt/expiration', description: 'JWT expiration checker online. Check if your JWT is expired, see time remaining, and view exp/iat/nbf timestamps in human-readable format with timezone support.', icon: '⏱️' },
			{ name: 'Claims Viewer', href: '/jwt/claims', description: 'JWT claims viewer online. View and understand all JWT claims with descriptions. Highlights standard claims (iss, sub, aud, exp) and flags missing recommended claims.', icon: '📋' },
			{ name: 'JWT Generator', href: '/jwt/generator', description: 'JWT generator online for testing. Create unsigned or demo JWT tokens for UI testing. NOT for production—generates test tokens with custom header and payload.', icon: '⚡' },
			{ name: 'Size Analyzer', href: '/jwt/size', description: 'JWT size analyzer online. Check JWT token length in characters and bytes. See header vs payload size breakdown and get warnings for oversized tokens.', icon: '📏' }
		]
	},
	{
		name: 'ID Tools',
		icon: '🆔',
		description: 'Free UUID and ID generator tools online. Generate UUID v4, v7, NanoID, and ULID. Validate UUIDs, detect versions, and create unique identifiers—all client-side in your browser.',
		items: [
			{ name: 'UUID Generator', href: '/id/uuid-generator', description: 'Generate UUID v4 (random) or v7 (time-ordered) in bulk, then copy or export as JSON.', icon: '🔑' },
			{ name: 'UUID Validator', href: '/id/uuid-validator', description: 'Check whether a UUID is valid, detect its version (v1–v7), and see why one fails.', icon: '✓' },
			{ name: 'NanoID Generator', href: '/id/nanoid-generator', description: 'Generate compact, URL-safe NanoIDs with a custom length and alphabet.', icon: '⚡' },
			{ name: 'ULID Generator', href: '/id/ulid-generator', description: 'Generate sortable ULIDs with a timestamp component, and see how sorting works.', icon: '📊' }
		]
	},
	{
		name: 'Cron',
		icon: '⏰',
		description: 'Free cron expression tools online. Generate, explain, validate cron expressions. Calculate next run times with timezone support—all client-side in your browser.',
		items: [
			{ name: 'Cron Generator', href: '/cron/generator', description: 'Build 5-field or Quartz cron expressions with a visual builder and presets.', icon: '🛠️' },
			{ name: 'Cron Explainer', href: '/cron/explainer', description: 'Cron expression explainer online. Convert cron to plain English with field breakdown. Understand any cron schedule—explain cron expressions free.', icon: '📖' },
			{ name: 'Next Run Calculator', href: '/cron/next-run', description: 'Cron next run calculator online. Show next 10 scheduled runs with timezone support. DST-safe cron schedule preview—free cron calculator.', icon: '📅' },
			{ name: 'Cron Validator', href: '/cron/validator', description: 'Validate cron syntax, check field ranges, and get helpful error messages.', icon: '✓' },
			{ name: 'Cron Presets', href: '/cron/presets', description: 'Cron expression examples and presets. Copy-paste ready cron expressions for common schedules. Every minute, daily, weekly, monthly—cron cheat sheet.', icon: '📋' },
			{ name: 'Human to Cron', href: '/cron/human', description: 'Natural language to cron converter online. Build cron expressions with dropdowns. Human-readable cron builder—convert schedule to cron free.', icon: '🔄' }
		]
	},
	{
		name: 'YAML',
		icon: '📄',
		description: 'Free YAML tools online. Validate, format, convert YAML. YAML to JSON converter, diff checker, linter—all client-side in your browser.',
		items: [
			{ name: 'YAML Validator', href: '/yaml/validator', description: 'Validate YAML syntax with clear line-and-column error messages.', icon: '✓' },
			{ name: 'YAML Formatter', href: '/yaml/formatter', description: 'Format and beautify YAML with the indentation you prefer.', icon: '✨' },
			{ name: 'YAML to JSON', href: '/yaml/to-json', description: 'Convert YAML into clean, readable JSON and copy or download the result.', icon: '→' },
			{ name: 'JSON to YAML', href: '/yaml/from-json', description: 'Convert JSON into tidy YAML, with control over indentation.', icon: '←' },
			{ name: 'YAML Diff', href: '/yaml/diff', description: 'Compare two YAML files side by side with structural change highlighting.', icon: '⇄' },
			{ name: 'YAML Linter', href: '/yaml/linter', description: 'Catch duplicate keys, indentation problems, and trailing spaces in YAML.', icon: '🔍' },
			{ name: 'YAML Key Sorter', href: '/yaml/sorter', description: 'Sort YAML keys alphabetically, with an option to recurse into nested maps.', icon: '🔤' },
			{ name: 'YAML to ENV', href: '/yaml/to-env', description: 'Flatten YAML into .env format, with custom separators for nested keys.', icon: '📝' }
		]
	},
	{
		name: 'Kubernetes',
		icon: '☸️',
		description: 'Free Kubernetes tools online. Inspect K8s manifests, compare resources, generate Helm charts, check API deprecations—all client-side.',
		items: [
			{ name: 'K8s Inspector', href: '/k8s/inspector', description: 'Inspect Kubernetes manifests: detect resource types and check required fields.', icon: '🔍' },
			{ name: 'K8s Resource Diff', href: '/k8s/diff', description: 'Compare Kubernetes manifests with a semantic diff of added, removed, and changed resources.', icon: '⇄' },
			{ name: 'K8s Manifest Splitter', href: '/k8s/splitter', description: 'Split a multi-document YAML file into separate manifests and download them as a ZIP.', icon: '✂️' },
			{ name: 'K8s to Helm', href: '/k8s/helm', description: 'Turn Kubernetes manifests into a Helm chart with generated values and templates.', icon: '⚓' },
			{ name: 'K8s API Checker', href: '/k8s/api-checker', description: 'Check manifests for deprecated or removed Kubernetes APIs by cluster version.', icon: '📋' }
		]
	},
	{
		name: 'Security',
		icon: '🔒',
		description: 'Free security tools online. CSP generator, CORS headers, password strength tester, HTTP status codes—all client-side.',
		items: [
			{ name: 'CSP Generator', href: '/security/csp', description: 'Build a Content Security Policy visually and get warnings about unsafe directives.', icon: '🛡️' },
			{ name: 'CORS Generator', href: '/security/cors', description: 'Assemble Access-Control headers by choosing origins, methods, and options.', icon: '🌐' },
			{ name: 'Password Tester', href: '/security/password', description: 'Check password strength with entropy, estimated crack time, and dictionary checks — entirely in your browser.', icon: '🔑' },
			{ name: 'HTTP Status Codes', href: '/security/http-status', description: 'A quick reference to every HTTP status code, explained with examples.', icon: '📊' },
			{ name: 'X-Frame-Options', href: '/security/x-frame', description: 'Understand X-Frame-Options and how DENY and SAMEORIGIN help prevent clickjacking.', icon: '🖼️' },
			{ name: 'Security Headers', href: '/security/headers', description: 'A cheat sheet of HTTP security headers, each explained with examples.', icon: '📋' },
			{ name: 'OWASP Top 10', href: '/security/owasp', description: 'An interactive checklist for tracking OWASP Top 10 (2021) coverage, with examples.', icon: '✓' },
			{ name: 'Misconfig Detector', href: '/security/misconfig', description: 'Scan headers and config files for common security misconfigurations.', icon: '⚠' },
			{ name: 'Headers Checklist', href: '/security/headers-checklist', description: 'Secure headers implementation checklist. Framework-specific snippets for NGINX, Apache, Node. Security headers setup guide.', icon: '☑' },
			{ name: 'Password Storage', href: '/security/password-storage', description: 'Password storage best practices generator. Algorithm recommendations, salt, pepper, cost factors. Secure password hashing guide.', icon: '🔐' },
			{ name: 'Threat Model', href: '/security/threat-model', description: 'Run a quick STRIDE-style threat model with risk levels for your web app.', icon: '⚡' }
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
	const record: Record<string, string> = { '/': 'Dev Tools' };
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
	};
	return overrides[cat.name] ?? cat.name.toLowerCase().replace(/\s+/g, '-');
}

// Helper: Get a category by its URL slug
export function getCategoryBySlug(slug: string): ToolCategory | undefined {
	return toolCategories.find(cat => getCategorySlug(cat) === slug);
}

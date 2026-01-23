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

export const BASE_URL = 'https://onedev.tools';

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
			{ name: 'Path Tester', href: '/json/path-tester', description: 'JSONPath tester online. Test JSONPath expressions against your data and see matched values instantly. Debug JSONPath queries free in your browser.', icon: '🔍' }
		]
	},
	{
		name: 'Base64',
		icon: '⚡',
		description: 'Free Base64 encoder and decoder online. Encode text, files, and images to Base64 or decode Base64 strings instantly in your browser. No file uploads to servers—everything runs client-side.',
		items: [
			{ name: 'Encode / Decode', href: '/base64/encode-decode', description: 'Base64 encoder and decoder online. Encode text to Base64 or decode Base64 strings instantly in your browser with automatic input detection.', icon: '🔄' },
			{ name: 'File Encoder', href: '/base64/file-encoder', description: 'File to Base64 converter online. Convert any file to Base64 data URI instantly. Perfect for embedding images in CSS or JSON—no server uploads.', icon: '📁' },
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
			{ name: 'Compressor', href: '/image/compressor', description: 'Online image compressor to reduce file size without losing quality. Compress JPEG, PNG, WebP images directly in your browser—free, no uploads.', icon: '📦' },
			{ name: 'Remove White BG', href: '/image/remove-white', description: 'Remove white background online free. Make white or light backgrounds transparent instantly. Adjustable tolerance—works in your browser.', icon: '🧹' },
			{ name: 'Resize / Scale', href: '/image/resize', description: 'Image resizer online free. Resize images by pixels or percentage with aspect ratio lock. Scale images instantly in your browser—no uploads.', icon: '📐' },
			{ name: 'Crop', href: '/image/crop', description: 'Image cropper online free. Crop images with preset ratios (16:9, 4:3, 1:1) or freeform selection. Crop pictures instantly in your browser.', icon: '✂️' },
			{ name: 'Format Converter', href: '/image/converter', description: 'Image format converter online. Convert images between JPEG, PNG, WebP, and GIF formats instantly. Free image converter in your browser.', icon: '🔄' },
			{ name: 'Metadata Viewer', href: '/image/metadata', description: 'EXIF viewer online free. View image metadata: camera info, GPS location, date, settings. Option to strip EXIF data—works in your browser.', icon: '📋' },
			{ name: 'Color Extractor', href: '/image/colors', description: 'Image color picker online. Extract dominant colors and color palette from images. Get hex codes for theming—free color extractor tool.', icon: '🎨' },
			{ name: 'Blur / Pixelate', href: '/image/blur', description: 'Image blur tool online. Apply blur or pixelate effects to images. Preview in real-time, then download—free image privacy tool.', icon: '🔲' }
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
			{ name: 'Case Converter', href: '/text/case-converter', description: 'Text case converter online. Convert between camelCase, snake_case, kebab-case, PascalCase, UPPERCASE, lowercase. Change text case instantly free.', icon: '🔤' },
			{ name: 'Line Tools', href: '/text/line-tools', description: 'Line sorter and text tools online. Sort lines, remove duplicates, trim whitespace, reverse order. Manipulate text lines free in your browser.', icon: '📋' },
			{ name: 'Text Diff', href: '/text/diff', description: 'Text diff checker online. Compare two text blocks line by line with highlighted additions and deletions. Free text comparison tool.', icon: '⚖️' },
			{ name: 'Find & Replace', href: '/text/find-replace', description: 'Find and replace online with regex support. Search and replace text patterns, preview matches before applying. Free regex replace tool.', icon: '🔍' },
			{ name: 'Text Statistics', href: '/text/statistics', description: 'Word counter online free. Count characters, words, sentences, paragraphs, and reading time. Text statistics and character count tool.', icon: '📊' },
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
			{ name: 'Pomodoro Timer', href: '/break/pomodoro', description: 'Pomodoro timer online free. Focus timer with 25/5 and 50/10 minute presets. Audio notifications to boost productivity—works in your browser.', icon: '🍅' },
			{ name: 'Ambient Rest', href: '/break/ambient', description: 'Ambient sounds online for focus. Full-screen calm backgrounds with rain or café ambient sounds. Relax and recharge—free in your browser.', icon: '🌧️' },
			{ name: 'Minimal Clock', href: '/break/clock', description: 'Fullscreen clock online. Large, distraction-free clock with analog or digital display options. Minimal clock for focus—free.', icon: '🕐' },
			{ name: 'Zen Motion', href: '/break/zen-motion', description: 'Relaxing animation online. Nostalgic bouncing shape animation for resting your eyes. Zen screensaver for breaks—free in your browser.', icon: '📀' },
			{ name: 'Breathing Timer', href: '/break/breathing', description: 'Breathing exercise timer online. Guided breathing with configurable inhale, hold, exhale cycles. Box breathing and 4-7-8 technique—free.', icon: '🌬️' }
		]
	},
	{
		name: 'Convert',
		icon: '🔄',
		description: 'Free unit converter tools online. Convert CSS units, lengths, screen resolutions, time, data sizes, angles, number bases, typography, and colors—instant conversion in your browser.',
		items: [
			{ name: 'CSS Units', href: '/convert/css-units', description: 'CSS unit converter online. Convert between px, rem, em, vw, vh, pt, and percentages. Calculate CSS units with live updates—free tool.', icon: '📐' },
			{ name: 'Length', href: '/convert/length', description: 'Length converter online free. Convert mm, cm, inches, feet, meters, km, and pixels at any DPI. Unit converter for measurements.', icon: '📏' },
			{ name: 'Screen / Resolution', href: '/convert/screen', description: 'Screen resolution calculator online. Calculate screen dimensions from resolution and DPI, or vice versa. PPI calculator free.', icon: '🖥️' },
			{ name: 'Time', href: '/convert/time', description: 'Time converter online free. Convert milliseconds, seconds, minutes, hours, days. Human-readable time format converter.', icon: '⏱️' },
			{ name: 'Data Size', href: '/convert/data-size', description: 'Data size converter online. Convert bytes, KB, MB, GB, TB. Supports decimal (SI) and binary (IEC) units—file size calculator free.', icon: '💾' },
			{ name: 'Angle', href: '/convert/angle', description: 'Angle converter online free. Convert degrees, radians, gradians, turns. Visual arc preview—trigonometry angle calculator.', icon: '📐' },
			{ name: 'Number Base', href: '/convert/number-base', description: 'Number base converter online. Convert between binary, decimal, hexadecimal, octal. Binary to hex converter with bit visualization—free.', icon: '🔢' },
			{ name: 'Typography', href: '/convert/typography', description: 'Typography converter online. Convert px, pt, em, rem for fonts. Line-height calculator with font preview—free type scale tool.', icon: '🔤' },
			{ name: 'Color', href: '/convert/color', description: 'Color converter online free. Convert between HEX, RGB, RGBA, HSL, HSLA, HSB. Live color preview—hex to RGB converter.', icon: '🎨' }
		]
	},
	{
		name: 'CSS',
		icon: '🎨',
		description: 'Free CSS tools and generators online. Format CSS, generate animations, create flexbox and grid layouts, build gradients and shadows—visual CSS generators in your browser.',
		items: [
			{ name: 'Formatter', href: '/css/formatter', description: 'CSS formatter and beautifier online. Format CSS code with proper indentation. CSS pretty print and code beautifier—free in your browser.', icon: '✨' },
			{ name: 'Minifier', href: '/css/minifier', description: 'CSS minifier online free. Compress CSS by removing whitespace and comments. Reduce CSS file size instantly—minify CSS code.', icon: '📦' },
			{ name: 'Prefix Cleaner', href: '/css/prefix-cleaner', description: 'CSS prefix remover online. Remove vendor prefixes (-webkit-, -moz-, -ms-, -o-). Clean up CSS autoprefixer output—free tool.', icon: '🧹' },
			{ name: 'Gradient Generator', href: '/css/gradient', description: 'CSS gradient generator online free. Create linear, radial, and conic gradients with visual editor. Multiple color stops, angle control, and live preview—free gradient maker.', icon: '🌈' },
			{ name: 'Transition', href: '/css/transition', description: 'CSS transition generator online. Create CSS transitions with live preview. Generate smooth animations—free transition builder.', icon: '🔄' },
			{ name: 'Bezier Curve', href: '/css/bezier', description: 'CSS cubic-bezier editor online. Interactive curve editor for timing functions. Create custom easing—bezier curve generator free.', icon: '📈' },
			{ name: 'Keyframes', href: '/css/keyframes', description: 'CSS keyframes generator online. Create @keyframes animations with editable stops. CSS animation builder—free keyframe editor.', icon: '🎬' },
			{ name: 'Flexbox', href: '/css/flexbox', description: 'CSS flexbox generator online. Visual flexbox playground with live preview. Generate flex container and items—free flexbox builder.', icon: '📦' },
			{ name: 'Grid', href: '/css/grid', description: 'CSS grid generator online. Visual grid builder with live preview. Create grid layouts easily—free CSS grid layout tool.', icon: '⊞' },
			{ name: 'Box Shadow', href: '/css/box-shadow', description: 'CSS box shadow generator online. Create box-shadows with multiple layers and presets. Live preview—free shadow generator tool.', icon: '🌑' },
			{ name: 'Text Shadow', href: '/css/text-shadow', description: 'CSS text shadow generator online. Create text-shadow effects with live preview. Multiple shadow layers—free text shadow tool.', icon: '💬' },
			{ name: 'Filter', href: '/css/filter', description: 'CSS filter generator online. Generate blur, brightness, contrast, grayscale, and more. Live filter preview—free CSS filter tool.', icon: '🎛️' },
			{ name: 'Text Gradient', href: '/css/text-gradient', description: 'CSS gradient text generator online. Create beautiful gradient text with visual color stops. Text gradient maker—free CSS tool.', icon: '✨' },
			{ name: 'Snippets', href: '/css/snippets', description: 'CSS snippets library online. Ready-to-use CSS: centering tricks, text truncation, accessibility helpers. Copy CSS snippets free.', icon: '📋' }
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
			{ name: 'Cost Estimator', href: '/ai/cost-estimator', description: 'AI API cost calculator online. Estimate costs for GPT-4, Claude, Gemini APIs. Input and output token pricing—free LLM cost tool.', icon: '💰' }
		]
	},
	{
		name: 'Hash',
		icon: '#️⃣',
		description: 'Free hash generator and checksum tools online. Create MD5, SHA-256, SHA-512, CRC32 hashes from text or files. Verify file integrity, compare hashes, and identify hash types—all in your browser.',
		items: [
			{ name: 'Hash Generator', href: '/hash/generator', description: 'Hash generator online free. Generate MD5, SHA-1, SHA-256, SHA-512, CRC32 hashes from text or files. Multi-hash calculator in your browser.', icon: '🔐' },
			{ name: 'MD5 Hash Online', href: '/hash/md5', description: 'MD5 hash generator online free. Create MD5 checksum from text or file. Fast MD5 calculator—generate MD5 hashes instantly.', icon: '🔒' },
			{ name: 'SHA-256 Hash', href: '/hash/sha256', description: 'SHA-256 hash generator online free. Create secure 256-bit hashes from text or files. SHA256 checksum calculator instant.', icon: '🔒' },
			{ name: 'SHA-512 Hash', href: '/hash/sha512', description: 'SHA-512 hash generator online free. Generate 512-bit hashes for maximum security. SHA512 checksum calculator—free tool.', icon: '🔒' },
			{ name: 'SHA-1 Hash', href: '/hash/sha1', description: 'SHA-1 hash generator online. Create 160-bit SHA1 hashes—still used for git commits and file verification. Free SHA1 calculator.', icon: '🔒' },
			{ name: 'CRC32 Checksum', href: '/hash/crc32', description: 'CRC32 checksum calculator online free. Quick cyclic redundancy check for file integrity. Generate CRC32 hash instantly.', icon: '✓' },
			{ name: 'Hash Identifier', href: '/hash/identifier', description: 'Hash identifier online free. What hash is this? Detect if a hash is MD5, SHA-256, bcrypt, or other types. Identify hash algorithm.', icon: '🔍' },
			{ name: 'Compare Hashes', href: '/hash/compare', description: 'Hash comparator online free. Compare two hashes with case-insensitive matching. Visual match indicator—verify hashes instantly.', icon: '⚖️' },
			{ name: 'File Checksum', href: '/hash/file-checksum', description: 'File checksum verifier online. Verify downloaded file hash against expected value. Check file integrity—free checksum tool.', icon: '📁' },
			{ name: 'Hash Lookup', href: '/hash/lookup', description: 'Hash lookup online free. Reverse hash lookup to check if MD5 or SHA-1 matches known values. Hash reverse lookup tool.', icon: '🔓' },
			{ name: 'HMAC Generator', href: '/hash/hmac', description: 'HMAC generator online free. Generate HMAC-SHA256, HMAC-SHA512 keyed-hash authentication codes. HMAC calculator in your browser.', icon: '🔑' },
			{ name: 'Hash Converter', href: '/hash/converter', description: 'Hash format converter online. Convert hash from hex to Base64, change case, add byte separators. Hash encoding converter free.', icon: '🔄' }
		]
	},
	{
		name: 'Git',
		icon: '🔀',
		description: 'Free Git tools online for developers. Generate .gitignore files, format commit messages, create branch names, build Git commands, and scan for secrets—all in your browser.',
		items: [
			{ name: 'Gitignore Generator', href: '/git/gitignore', description: 'Gitignore generator online free. Create .gitignore files for Node, Python, Java, Go, Rust, and more. Combine multiple presets—download or copy instantly.', icon: '🚫' },
			{ name: 'Commit Generator', href: '/git/commit-generator', description: 'Conventional commit generator online. Build formatted commit messages with type, scope, and description. Emoji support—create git commits instantly.', icon: '💬' },
			{ name: 'Commit Validator', href: '/git/commit-validator', description: 'Commit message validator online. Validate against Conventional Commits spec with detailed error explanations. Check commit format free.', icon: '✓' },
			{ name: 'Branch Generator', href: '/git/branch-generator', description: 'Git branch name generator online. Create feature, bugfix, hotfix branches with ticket IDs. Customizable prefix order—copy branch names instantly.', icon: '🌿' },
			{ name: 'Workflow Guide', href: '/git/workflow', description: 'Git workflow cheat sheet online. Learn Git Flow, trunk-based development, and feature branching with visual diagrams. Free Git guide.', icon: '📋' },
			{ name: 'Diff Viewer', href: '/git/diff-viewer', description: 'Git diff viewer online free. Compare text with side-by-side or inline diff. Syntax highlighting and whitespace ignore—view diffs instantly.', icon: '📊' },
			{ name: 'Log Formatter', href: '/git/log-formatter', description: 'Git log format generator online. Customize git log output with format placeholders. Generate pretty log commands—copy instantly.', icon: '📜' },
			{ name: 'Blame Explainer', href: '/git/blame-explainer', description: 'Git blame explainer online. Paste git blame output and understand each field. Learn blame format visually—free educational tool.', icon: '🔍' },
			{ name: 'Reset Helper', href: '/git/reset-helper', description: 'Git reset helper online. Understand soft, mixed, hard reset with visual diagrams. Generate reset commands safely—free Git tool.', icon: '⏪' },
			{ name: 'Rebase Helper', href: '/git/rebase-helper', description: 'Git rebase guide online. Interactive rebase steps with visual explanation. Learn rebase commands—free Git rebase tool.', icon: '🔄' },
			{ name: 'Config Generator', href: '/git/config-generator', description: 'Git config generator online. Generate git config commands for name, email, aliases, and settings. Configure Git easily—copy commands free.', icon: '⚙️' },
			{ name: 'Alias Generator', href: '/git/alias-generator', description: 'Git alias generator online. Create common Git aliases like co, br, st. Custom alias builder—copy git alias commands free.', icon: '⌨️' },
			{ name: 'README Generator', href: '/git/readme-generator', description: 'README generator online free. Create GitHub README with badges, sections, and templates. Markdown preview—download README.md instantly.', icon: '📄' },
			{ name: 'License Picker', href: '/git/license-picker', description: 'License picker online free. Choose MIT, Apache, GPL with plain-English explanations. Generate LICENSE file—copy or download instantly.', icon: '📜' },
			{ name: 'Secrets Scanner', href: '/git/secrets-scanner', description: 'Git secrets scanner online. Detect API keys, tokens, passwords in code. Client-side scanning—find secrets before committing.', icon: '🔐' },
			{ name: 'Large File Detector', href: '/git/large-files', description: 'Large file detector online. Find files too big for Git. Get Git LFS recommendations—detect large files before pushing.', icon: '📦' }
		]
	},
	{
		name: 'Regex',
		icon: '.*',
		description: 'Free regex tools online to test, match, replace, and explain regular expressions. Build regex patterns, extract matches, and learn regex syntax—all in your browser with instant visual feedback.',
		items: [
			{ name: 'Regex Tester', href: '/regex/tester', description: 'Regex tester online free. Test regular expressions with live highlighting, flags toggle (g i m s u), and match count. Debug regex patterns instantly in your browser.', icon: '🧪' },
			{ name: 'Regex Matcher', href: '/regex/matcher', description: 'Regex match extractor online. Extract all matches and capture groups from text. Export matches as JSON, CSV, or plain list—free regex extraction tool.', icon: '🎯' },
			{ name: 'Regex Replacer', href: '/regex/replacer', description: 'Regex replace online free. Find and replace with regular expressions. Live preview, capture group support ($1, $2)—regex find and replace tool.', icon: '🔄' },
			{ name: 'Regex Explainer', href: '/regex/explainer', description: 'Regex explainer online. Break down regex patterns into tokens with plain English explanations. Understand any regex visually—free regex breakdown tool.', icon: '📖' },
			{ name: 'Regex Cheat Sheet', href: '/regex/cheatsheet', description: 'Regex cheat sheet online. Complete regex syntax reference with examples: character classes, quantifiers, anchors, groups, and flags. Free regex guide.', icon: '📋' }
		]
	},
	{
		name: 'JWT',
		icon: '🔐',
		description: 'Free JWT decoder and tools online. Decode JSON Web Tokens, check expiration, view claims, generate test tokens, and analyze token size—all client-side in your browser.',
		items: [
			{ name: 'JWT Decoder', href: '/jwt/decoder', description: 'JWT decoder online free. Decode JWT header and payload instantly. View algorithm, claims, and expiration in pretty JSON format—no signature verification, client-side only.', icon: '🔓' },
			{ name: 'Expiration Checker', href: '/jwt/expiration', description: 'JWT expiration checker online. Check if your JWT is expired, see time remaining, and view exp/iat/nbf timestamps in human-readable format with timezone support.', icon: '⏱️' },
			{ name: 'Claims Viewer', href: '/jwt/claims', description: 'JWT claims viewer online. View and understand all JWT claims with descriptions. Highlights standard claims (iss, sub, aud, exp) and flags missing recommended claims.', icon: '📋' },
			{ name: 'JWT Generator', href: '/jwt/generator', description: 'JWT generator online for testing. Create unsigned or demo JWT tokens for UI testing. NOT for production—generates test tokens with custom header and payload.', icon: '⚡' },
			{ name: 'Size Analyzer', href: '/jwt/size', description: 'JWT size analyzer online. Check JWT token length in characters and bytes. See header vs payload size breakdown and get warnings for oversized tokens.', icon: '📏' }
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

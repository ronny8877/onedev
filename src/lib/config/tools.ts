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
	active?: boolean; // defaults to true
	items: ToolItem[];
}

export const BASE_URL = 'https://onedev.tools';

export const toolCategories: ToolCategory[] = [
	{
		name: 'JSON',
		icon: '{ }',
		items: [
			{ name: 'JSON Formatter', href: '/json/formatter', description: 'Validate and format JSON in the browser. Highlights syntax errors and prettifies valid JSON.', icon: '{ }' },
			{ name: 'JSON Validator', href: '/json/validator', description: 'Check if JSON is valid with line-by-line error details. Instant validation as you type.', icon: '✓' },
			{ name: 'JSON Diff', href: '/json/diff', description: 'Compare two JSON objects side by side. Highlights added, removed, and changed values.', icon: '≠' },
			{ name: 'JSON → Table', href: '/json/table', description: 'Convert JSON arrays to sortable tables. Export to CSV or copy as markdown.', icon: '📊' },
			{ name: 'JSON Visualizer', href: '/json/visualizer', description: 'Explore JSON with an interactive tree view. Expand, collapse, and search nodes.', icon: '🌲' },
			{ name: 'Type Generator', href: '/json/type-generator', description: 'Generate TypeScript interfaces or Go structs from JSON. Handles nested objects.', icon: '⟨T⟩' },
			{ name: 'Path Tester', href: '/json/path-tester', description: 'Test JSONPath expressions against your data. See matched values instantly.', icon: '🔍' }
		]
	},
	{
		name: 'Base64',
		icon: '⚡',
		items: [
			{ name: 'Encode / Decode', href: '/base64/encode-decode', description: 'Encode text to Base64 or decode Base64 to text. Auto-detects input type.', icon: '🔄' },
			{ name: 'File Encoder', href: '/base64/file-encoder', description: 'Convert any file to Base64 data URI. Copy or download the encoded string.', icon: '📁' },
			{ name: 'Image Preview', href: '/base64/image-preview', description: 'Paste Base64 image data and preview it instantly. Supports PNG, JPG, WebP.', icon: '🖼️' },
			{ name: 'URL-safe Converter', href: '/base64/url-safe', description: 'Convert between standard Base64 and URL-safe Base64 (replaces +/ with -_).', icon: '🔗' },
			{ name: 'Validator', href: '/base64/validator', description: 'Check if a string is valid Base64. Shows encoding issues and padding problems.', icon: '✓' },
			{ name: 'Splitter', href: '/base64/splitter', description: 'Split long Base64 strings into lines for embedding in code or config files.', icon: '✂️' },
			{ name: 'Hex / Binary', href: '/base64/hex-binary', description: 'Convert Base64 to hexadecimal or binary representation and back.', icon: '01' }
		]
	},
	{
		name: 'URL',
		icon: '🔗',
		items: [
			{ name: 'Encode / Decode', href: '/url/encode-decode', description: 'URL encode special characters or decode percent-encoded URLs. Auto-detects input.', icon: '🔐' },
			{ name: 'Query Parser', href: '/url/query-parser', description: 'Parse URL query strings into key-value table. Export as JSON or CSV.', icon: '📋' },
			{ name: 'URL Builder', href: '/url/builder', description: 'Build URLs with query parameters. Paste existing URLs to parse and edit them.', icon: '🔧' },
			{ name: 'Validator', href: '/url/validator', description: 'Check if a URL is valid. Shows protocol, domain, port, and path breakdown.', icon: '✓' },
			{ name: 'Parts Analyzer', href: '/url/parts', description: 'Visual breakdown of URL components: protocol, host, port, path, query, hash.', icon: '🔬' },
			{ name: 'Slug Generator', href: '/url/slug-generator', description: 'Convert any text to URL-safe slugs. Handles unicode and special characters.', icon: '📝' },
			{ name: 'Normalizer', href: '/url/normalizer', description: 'Normalize URLs: lowercase hostname, sort query params, remove defaults.', icon: '🧹' },
			{ name: 'Compare', href: '/url/compare', description: 'Compare two URLs semantically. Find differences in path, query, or fragment.', icon: '⚖️' },
			{ name: 'JSON Converter', href: '/url/json-converter', description: 'Convert URL query strings to JSON objects and back. Handles nested params.', icon: '🔄' },
			{ name: 'Length Checker', href: '/url/length-checker', description: 'Check URL length against browser and server limits. Warns if too long.', icon: '📏' }
		]
	},
	{
		name: 'Image',
		icon: '🖼️',
		items: [
			{ name: 'Compressor', href: '/image/compressor', description: 'Reduce image file size with quality control. Supports JPEG, PNG, WebP output.', icon: '📦' },
			{ name: 'Remove White BG', href: '/image/remove-white', description: 'Make white or near-white backgrounds transparent. Adjustable tolerance.', icon: '🧹' },
			{ name: 'Resize / Scale', href: '/image/resize', description: 'Resize images by pixels or percentage. Lock aspect ratio option.', icon: '📐' },
			{ name: 'Crop', href: '/image/crop', description: 'Crop images with preset ratios (16:9, 4:3, 1:1) or freeform selection.', icon: '✂️' },
			{ name: 'Format Converter', href: '/image/converter', description: 'Convert images between JPEG, PNG, WebP, and GIF formats.', icon: '🔄' },
			{ name: 'Metadata Viewer', href: '/image/metadata', description: 'View EXIF data: camera, GPS, date, settings. Option to strip metadata.', icon: '📋' },
			{ name: 'Color Extractor', href: '/image/colors', description: 'Extract dominant colors from images. Get hex codes for theming.', icon: '🎨' },
			{ name: 'Blur / Pixelate', href: '/image/blur', description: 'Apply blur or pixelate effects. Preview in real-time, then download.', icon: '🔲' }
		]
	},
	{
		name: 'System',
		icon: '💻',
		items: [
			{ name: 'System Info', href: '/system/info', description: 'Detect OS, CPU cores, memory, screen resolution, and GPU info.', icon: '🖥️' },
			{ name: 'Browser Info', href: '/system/browser', description: 'Browser name, version, engine, and supported features detection.', icon: '🌐' },
			{ name: 'Network Info', href: '/system/network', description: 'Connection type, effective speed, and public IP address lookup.', icon: '📡' },
			{ name: 'Media Devices', href: '/system/media', description: 'List available cameras, microphones, and speakers with permissions.', icon: '🎥' },
			{ name: 'Permissions', href: '/system/permissions', description: 'Check browser permission status: camera, microphone, location, notifications.', icon: '🔐' }
		]
	},
	{
		name: 'Text',
		icon: '📝',
		items: [
			{ name: 'Case Converter', href: '/text/case-converter', description: 'Convert between camelCase, snake_case, kebab-case, PascalCase, and more.', icon: '🔤' },
			{ name: 'Line Tools', href: '/text/line-tools', description: 'Sort lines, remove duplicates, trim whitespace, reverse order.', icon: '📋' },
			{ name: 'Text Diff', href: '/text/diff', description: 'Compare two text blocks line by line. Highlights additions and deletions.', icon: '⚖️' },
			{ name: 'Find & Replace', href: '/text/find-replace', description: 'Search and replace text with regex support. Preview matches before applying.', icon: '🔍' },
			{ name: 'Text Statistics', href: '/text/statistics', description: 'Count characters, words, sentences, paragraphs, and reading time.', icon: '📊' },
			{ name: 'Anagram Finder', href: '/text/anagram', description: 'Find all anagrams of a word or phrase. Uses dictionary validation.', icon: '🔀' },
			{ name: 'Remove Duplicates', href: '/text/remove-duplicates', description: 'Remove duplicate words or lines from text. Preserves order.', icon: '✂️' },
			{ name: 'Lorem Ipsum', href: '/text/lorem-ipsum', description: 'Generate placeholder text: paragraphs, sentences, or words.', icon: '📄' },
			{ name: 'Blabber Generator', href: '/text/blabber', description: 'Generate random readable gibberish text for testing layouts.', icon: '💬' }
		]
	},
	{
		name: 'HTML',
		icon: '📄',
		items: [
			{ name: 'HTML Validator (Basic)', href: '/html/validator', description: 'Check for unclosed tags, invalid nesting, duplicate IDs, and common errors.', icon: '✓' },
			{ name: 'HTML Formatter', href: '/html/formatter', description: 'Beautify or minify HTML with proper indentation. Preserves inline elements.', icon: '{ }' },
			{ name: 'HTML → Text', href: '/html/text-extractor', description: 'Strip all HTML tags and extract plain text content only.', icon: '📝' },
			{ name: 'Element Extractor', href: '/html/element-extractor', description: 'Extract all links, images, meta tags, or scripts from HTML.', icon: '🔍' },
			{ name: 'DOM Visualizer', href: '/html/dom-visualizer', description: 'Interactive tree view of HTML structure. Search and copy nodes.', icon: '🌲' },
			{ name: 'HTML → JSON', href: '/html/to-json', description: 'Convert HTML DOM structure to JSON representation.', icon: '🔄' },
			{ name: 'Attribute Cleaner', href: '/html/attribute-cleaner', description: 'Remove inline styles, data attributes, classes, or empty attributes.', icon: '🧹' },
			{ name: 'Tag Counter', href: '/html/tag-counter', description: 'Count occurrences of each HTML tag. Shows element distribution.', icon: '📊' }
		]
	},
	{
		name: 'Break',
		icon: '☕',
		items: [
			{ name: 'Pomodoro Timer', href: '/break/pomodoro', description: 'Focus timer with 25/5 and 50/10 minute presets. Audio notification.', icon: '🍅' },
			{ name: 'Ambient Rest', href: '/break/ambient', description: 'Full-screen calm background with rain or café ambient sounds.', icon: '🌧️' },
			{ name: 'Minimal Clock', href: '/break/clock', description: 'Large, distraction-free clock. Analog or digital display options.', icon: '🕐' },
			{ name: 'Zen Motion', href: '/break/zen-motion', description: 'Nostalgic bouncing shape animation for resting your eyes.', icon: '📀' },
			{ name: 'Breathing Timer', href: '/break/breathing', description: 'Guided breathing: configurable inhale, hold, exhale cycles.', icon: '🌬️' }
		]
	},
	{
		name: 'Convert',
		icon: '🔄',
		items: [
			{ name: 'CSS Units', href: '/convert/css-units', description: 'Convert between px, rem, em, vw, vh, pt, and percentages. Live updates.', icon: '📐' },
			{ name: 'Length', href: '/convert/length', description: 'Convert mm, cm, inches, feet, meters, km, and pixels at any DPI.', icon: '📏' },
			{ name: 'Screen / Resolution', href: '/convert/screen', description: 'Calculate screen dimensions from resolution and DPI, or vice versa.', icon: '🖥️' },
			{ name: 'Time', href: '/convert/time', description: 'Convert ms, seconds, minutes, hours, days. Human-readable output.', icon: '⏱️' },
			{ name: 'Data Size', href: '/convert/data-size', description: 'Convert bytes, KB, MB, GB. Decimal (SI) and binary (IEC) units.', icon: '💾' },
			{ name: 'Angle', href: '/convert/angle', description: 'Convert degrees, radians, gradians, turns. Visual arc preview.', icon: '📐' },
			{ name: 'Number Base', href: '/convert/number-base', description: 'Convert binary, decimal, hexadecimal, octal. Bit visualization.', icon: '🔢' },
			{ name: 'Typography', href: '/convert/typography', description: 'Convert px, pt, em, rem. Line-height calculator and font preview.', icon: '🔤' },
			{ name: 'Color', href: '/convert/color', description: 'Convert HEX, RGB, RGBA, HSL, HSLA. Live color preview.', icon: '🎨' }
		]
	},
	{
		name: 'CSS',
		icon: '🎨',
		items: [
			{ name: 'Formatter', href: '/css/formatter', description: 'Beautify and format CSS code with proper indentation.', icon: '✨' },
			{ name: 'Minifier', href: '/css/minifier', description: 'Compress CSS by removing whitespace and comments.', icon: '📦' },
			{ name: 'Prefix Cleaner', href: '/css/prefix-cleaner', description: 'Remove vendor prefixes (-webkit-, -moz-, etc).', icon: '🧹' },
			{ name: 'Transition', href: '/css/transition', description: 'Generate CSS transitions with live preview.', icon: '🔄' },
			{ name: 'Bezier Curve', href: '/css/bezier', description: 'Interactive cubic-bezier curve editor for timing functions.', icon: '📈' },
			{ name: 'Keyframes', href: '/css/keyframes', description: 'Create @keyframes animations with editable stops.', icon: '🎬' },
			{ name: 'Flexbox', href: '/css/flexbox', description: 'Visual flexbox playground with live preview.', icon: '📦' },
			{ name: 'Grid', href: '/css/grid', description: 'CSS Grid generator with visual builder.', icon: '⊞' },
			{ name: 'Box Shadow', href: '/css/box-shadow', description: 'Create box-shadows with multiple layers and presets.', icon: '🌑' },
			{ name: 'Text Shadow', href: '/css/text-shadow', description: 'Generate text-shadow effects with live preview.', icon: '💬' },
			{ name: 'Filter', href: '/css/filter', description: 'CSS filter generator: blur, brightness, contrast, etc.', icon: '🎛️' },
			{ name: 'Text Gradient', href: '/css/text-gradient', description: 'Create beautiful gradient text with visual color stops.', icon: '🌈' },
			{ name: 'Snippets', href: '/css/snippets', description: 'Ready-to-use CSS snippets: centering, truncate, a11y.', icon: '📋' }
		]
	},
	{
		name: 'AI Utilities',
		icon: '🤖',
		items: [
			{ name: 'Token Counter', href: '/ai/token-counter', description: 'Count tokens for GPT-4, Claude, Gemini and more. See character count and estimated cost.', icon: '🔢' },
			{ name: 'Token Visualizer', href: '/ai/token-visualizer', description: 'See how AI models break text into tokens. Understand token boundaries visually.', icon: '🎨' },
			{ name: 'Context Estimator', href: '/ai/context-estimator', description: 'Calculate total tokens for prompts, system messages, and chat history. See remaining context.', icon: '📊' },
			{ name: 'Prompt Trimmer', href: '/ai/prompt-trimmer', description: 'Trim text to fit token limits. Supports hard cut, sentence-aware, and paragraph-aware modes.', icon: '✂️' },
			{ name: 'Embedding Estimator', href: '/ai/embedding-estimator', description: 'Estimate tokens and vector dimensions for embedding models. Great for vector DB planning.', icon: '📐' },
			{ name: 'Cost Estimator', href: '/ai/cost-estimator', description: 'Estimate API costs for AI models. Input tokens, output tokens, and per-request pricing.', icon: '💰' }
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

// Helper: Get tool name by path
export function getToolNameByPath(path: string): string | undefined {
	for (const cat of toolCategories) {
		const tool = cat.items.find(item => item.href === path);
		if (tool) return tool.name;
	}
	return undefined;
}

// Helper: Build toolNames record for layout
export function getToolNamesRecord(): Record<string, string> {
	const record: Record<string, string> = { '/': 'OneDev Tools' };
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

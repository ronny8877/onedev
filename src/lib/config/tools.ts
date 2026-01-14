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
			{ name: 'JSON Formatter', href: '/json/formatter', description: 'Prettify or minify JSON with syntax highlighting', icon: '{ }' },
			{ name: 'JSON Validator', href: '/json/validator', description: 'Check if your JSON is valid with detailed errors', icon: '✓' },
			{ name: 'JSON Diff', href: '/json/diff', description: 'Compare two JSON objects and find differences', icon: '≠' },
			{ name: 'JSON → Table', href: '/json/table', description: 'Convert JSON arrays to tables and export as CSV', icon: '📊' },
			{ name: 'JSON Visualizer', href: '/json/visualizer', description: 'Explore JSON with an interactive tree view', icon: '🌲' },
			{ name: 'Type Generator', href: '/json/type-generator', description: 'Generate TypeScript or Go types from JSON', icon: '⟨T⟩' },
			{ name: 'Path Tester', href: '/json/path-tester', description: 'Test JSONPath expressions on your data', icon: '🔍' }
		]
	},
	{
		name: 'Base64',
		icon: '⚡',
		items: [
			{ name: 'Encode / Decode', href: '/base64/encode-decode', description: 'Encode text to Base64 or decode with auto-detect', icon: '🔄' },
			{ name: 'File Encoder', href: '/base64/file-encoder', description: 'Convert files to Base64 data URIs', icon: '📁' },
			{ name: 'Image Preview', href: '/base64/image-preview', description: 'Preview Base64-encoded images. Paste and view', icon: '🖼️' },
			{ name: 'URL-safe Converter', href: '/base64/url-safe', description: 'Convert to/from URL-safe Base64 format', icon: '🔗' },
			{ name: 'Validator', href: '/base64/validator', description: 'Check if a string is valid Base64', icon: '✓' },
			{ name: 'Splitter', href: '/base64/splitter', description: 'Split long Base64 into lines or chunks', icon: '✂️' },
			{ name: 'Hex / Binary', href: '/base64/hex-binary', description: 'Convert Base64 to hex or binary representation', icon: '01' }
		]
	},
	{
		name: 'URL',
		icon: '🔗',
		items: [
			{ name: 'Encode / Decode', href: '/url/encode-decode', description: 'Encode special characters or decode URLs. Auto-detect.', icon: '🔐' },
			{ name: 'Query Parser', href: '/url/query-parser', description: 'Parse query strings to table. Export JSON/CSV.', icon: '📋' },
			{ name: 'URL Builder', href: '/url/builder', description: 'Build URLs with dynamic params. Auto-encode.', icon: '🔧' },
			{ name: 'Validator', href: '/url/validator', description: 'Check URL validity with protocol breakdown.', icon: '✓' },
			{ name: 'Parts Analyzer', href: '/url/parts', description: 'Visual breakdown of URL components.', icon: '🔬' },
			{ name: 'Slug Generator', href: '/url/slug-generator', description: 'Convert text to URL-safe slugs.', icon: '📝' },
			{ name: 'Normalizer', href: '/url/normalizer', description: 'Normalize URLs: lowercase, sort params, clean up.', icon: '🧹' },
			{ name: 'Compare', href: '/url/compare', description: 'Semantic URL comparison. Find differences.', icon: '⚖️' },
			{ name: 'JSON Converter', href: '/url/json-converter', description: 'Convert query strings ↔ JSON objects.', icon: '🔄' },
			{ name: 'Length Checker', href: '/url/length-checker', description: 'Check URL length against browser limits.', icon: '📏' }
		]
	},
	{
		name: 'Image',
		icon: '🖼️',
		items: [
			{ name: 'Compressor', href: '/image/compressor', description: 'Reduce file size with quality control.', icon: '📦' },
			{ name: 'Remove White BG', href: '/image/remove-white', description: 'Make white/near-white transparent.', icon: '🧹' },
			{ name: 'Resize / Scale', href: '/image/resize', description: 'Resize with aspect ratio lock.', icon: '📐' },
			{ name: 'Crop', href: '/image/crop', description: 'Crop with preset ratios or freeform.', icon: '✂️' },
			{ name: 'Format Converter', href: '/image/converter', description: 'Convert between JPG, PNG, WebP.', icon: '🔄' },
			{ name: 'Metadata Viewer', href: '/image/metadata', description: 'View and strip EXIF data.', icon: '📋' },
			{ name: 'Color Extractor', href: '/image/colors', description: 'Extract dominant colors for theming.', icon: '🎨' },
			{ name: 'Blur / Pixelate', href: '/image/blur', description: 'Apply blur or pixelate effects.', icon: '🔲' }
		]
	},
	{
		name: 'System',
		icon: '💻',
		items: [
			{ name: 'System Info', href: '/system/info', description: 'OS, CPU, memory, screen, GPU info.', icon: '🖥️' },
			{ name: 'Browser Info', href: '/system/browser', description: 'Browser name, version, engine, language.', icon: '🌐' },
			{ name: 'Network Info', href: '/system/network', description: 'Connection type, speed, IP lookup.', icon: '📡' },
			{ name: 'Media Devices', href: '/system/media', description: 'Check camera, mic, speaker list.', icon: '🎥' },
			{ name: 'Permissions', href: '/system/permissions', description: 'Check browser permission status.', icon: '🔐' }
		]
	},
	{
		name: 'Text',
		icon: '📝',
		items: [
			{ name: 'Case Converter', href: '/text/case-converter', description: 'Convert between camelCase, snake_case, etc.', icon: '🔤' },
			{ name: 'Line Tools', href: '/text/line-tools', description: 'Sort, dedupe, trim lines.', icon: '📋' },
			{ name: 'Text Diff', href: '/text/diff', description: 'Compare two text blocks.', icon: '⚖️' },
			{ name: 'Find & Replace', href: '/text/find-replace', description: 'Search and replace with regex.', icon: '🔍' },
			{ name: 'Text Statistics', href: '/text/statistics', description: 'Count chars, words, reading time.', icon: '📊' },
			{ name: 'Anagram Finder', href: '/text/anagram', description: 'Find anagrams of a word.', icon: '🔀' },
			{ name: 'Remove Duplicates', href: '/text/remove-duplicates', description: 'Remove duplicate words.', icon: '✂️' },
			{ name: 'Lorem Ipsum', href: '/text/lorem-ipsum', description: 'Generate placeholder text.', icon: '📄' },
			{ name: 'Blabber Generator', href: '/text/blabber', description: 'Generate random readable text.', icon: '💬' }
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

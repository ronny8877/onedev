/**
 * HTML Utilities for all HTML tools
 * Centralized functions for parsing, validating, formatting, and transforming HTML
 * 
 * SECURITY: All HTML parsing uses DOMParser which is safe and doesn't execute scripts.
 * We never use innerHTML with user content to prevent XSS attacks.
 */

export interface HTMLValidationIssue {
	type: 'error' | 'warning';
	message: string;
	line?: number;
	column?: number;
}

export interface HTMLValidationResult {
	valid: boolean;
	issues: HTMLValidationIssue[];
}

export interface HTMLNode {
	tag: string;
	attributes: Record<string, string>;
	children: HTMLNode[];
	text?: string;
}

export interface TagCount {
	tag: string;
	count: number;
}

export interface ExtractedElement {
	tag: string;
	attributes: Record<string, string>;
	text?: string;
	html?: string;
}

// Known HTML5 tags for validation
const VALID_HTML_TAGS = new Set([
	// Document structure
	'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script', 'noscript',
	// Sections
	'div', 'span', 'p', 'a', 'img', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
	'header', 'footer', 'nav', 'main', 'article', 'section', 'aside', 'figure', 'figcaption',
	// Lists
	'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'menu',
	// Tables
	'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'col', 'colgroup', 'caption',
	// Forms
	'form', 'input', 'textarea', 'button', 'select', 'option', 'optgroup', 'label', 
	'fieldset', 'legend', 'datalist', 'output', 'progress', 'meter',
	// Text formatting
	'strong', 'em', 'b', 'i', 'u', 's', 'small', 'mark', 'del', 'ins', 'sub', 'sup',
	'code', 'pre', 'kbd', 'samp', 'var', 'blockquote', 'q', 'cite', 'abbr', 'address', 'time',
	// Interactive
	'details', 'summary', 'dialog',
	// Embedded content
	'iframe', 'embed', 'object', 'param', 'video', 'audio', 'source', 'track', 'canvas', 'picture',
	// Template
	'template', 'slot',
	// Other
	'area', 'map', 'base', 'bdi', 'bdo', 'data', 'ruby', 'rb', 'rt', 'rtc', 'rp', 'wbr',
	// Deprecated but still valid
	'center', 'font', 'marquee', 'nobr', 'strike', 'tt', 'big',
	// SVG elements (commonly used)
	'svg', 'g', 'defs', 'symbol', 'use', 'image',
	'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
	'text', 'tspan', 'textpath',
	'clippath', 'mask', 'pattern', 'marker', 'filter',
	'lineargradient', 'radialgradient', 'stop',
	'animate', 'animatetransform', 'animatemotion', 'set',
	'foreignobject', 'switch', 'desc', 'title', 'metadata',
	'fegaussianblur', 'fecolormatrix', 'feoffset', 'feblend', 'feflood', 
	'fecomposite', 'femerge', 'femergenode', 'femorphology', 'feturbulence',
	'fedisplacementmap', 'fedropshadow', 'feimage', 'fetile', 'fediffuselighting',
	'fespecularlighting', 'fepointlight', 'fespotlight', 'fedistantlight',
	// MathML elements
	'math', 'mrow', 'mi', 'mn', 'mo', 'ms', 'mtext', 'mspace', 'mfrac', 'msqrt',
	'mroot', 'msub', 'msup', 'msubsup', 'munder', 'mover', 'munderover',
	'mtable', 'mtr', 'mtd', 'menclose', 'mfenced', 'maction', 'semantics', 'annotation'
]);

// Self-closing tags
const VOID_ELEMENTS = new Set([
	'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
	'param', 'source', 'track', 'wbr'
]);

/**
 * Parse HTML safely using DOMParser (no script execution, XSS-safe)
 */
export function parseHTMLSafe(input: string): { doc: Document; errors: string[] } {
	const parser = new DOMParser();
	const doc = parser.parseFromString(input, 'text/html');
	
	// Check for parser errors
	const errors: string[] = [];
	const parserErrors = doc.querySelectorAll('parsererror');
	parserErrors.forEach(err => {
		errors.push(err.textContent || 'Parser error');
	});
	
	return { doc, errors };
}

/**
 * Validate HTML for common issues
 * Note: This is basic validation, not W3C-compliant
 */
export function validateHTML(input: string): HTMLValidationResult {
	const issues: HTMLValidationIssue[] = [];
	const lines = input.split('\n');
	
	// Track seen IDs for duplicate detection
	const seenIds = new Map<string, number>();
	
	// Track open tags for unclosed element detection
	const tagStack: { tag: string; line: number }[] = [];
	
	// Regex to match tags
	const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9-]*)[^>]*\/?>/gi;
	const idRegex = /\bid\s*=\s*["']([^"']+)["']/gi;
	const selfClosingRegex = /\/\s*>$/;
	
	lines.forEach((line, lineIndex) => {
		const lineNum = lineIndex + 1;
		let match;
		
		// Check for duplicate IDs
		idRegex.lastIndex = 0;
		while ((match = idRegex.exec(line)) !== null) {
			const id = match[1];
			if (seenIds.has(id)) {
				issues.push({
					type: 'error',
					message: `Duplicate ID "${id}" (first seen on line ${seenIds.get(id)})`,
					line: lineNum
				});
			} else {
				seenIds.set(id, lineNum);
			}
		}
		
		// Check for valid/invalid tags and track open/close
		tagRegex.lastIndex = 0;
		while ((match = tagRegex.exec(line)) !== null) {
			const fullMatch = match[0];
			const tagName = match[1].toLowerCase();
			const isClosing = fullMatch.startsWith('</');
			const isSelfClosing = selfClosingRegex.test(fullMatch) || VOID_ELEMENTS.has(tagName);
			
			// Check for unknown tags (but allow custom elements with hyphens)
			if (!VALID_HTML_TAGS.has(tagName) && !tagName.includes('-')) {
				issues.push({
					type: 'warning',
					message: `Unknown HTML tag "<${tagName}>"`,
					line: lineNum
				});
			}
			
			// Track tag stack for unclosed elements
			if (!isClosing && !isSelfClosing && !VOID_ELEMENTS.has(tagName)) {
				tagStack.push({ tag: tagName, line: lineNum });
			} else if (isClosing) {
				// Find matching open tag
				let found = false;
				for (let i = tagStack.length - 1; i >= 0; i--) {
					if (tagStack[i].tag === tagName) {
						tagStack.splice(i, 1);
						found = true;
						break;
					}
				}
				if (!found && tagStack.length > 0) {
					issues.push({
						type: 'error',
						message: `Unexpected closing tag "</${tagName}>"`,
						line: lineNum
					});
				}
			}
		}
	});
	
	// Report unclosed tags
	tagStack.forEach(({ tag, line }) => {
		issues.push({
			type: 'error',
			message: `Unclosed tag "<${tag}>"`,
			line
		});
	});
	
	// Check basic nesting issues using parsed DOM
	const { doc } = parseHTMLSafe(input);
	
	// Check for p containing block elements
	doc.querySelectorAll('p').forEach(p => {
		const blockChildren = p.querySelectorAll('div, p, ul, ol, table, blockquote, h1, h2, h3, h4, h5, h6');
		if (blockChildren.length > 0) {
			issues.push({
				type: 'warning',
				message: `<p> should not contain block-level elements`
			});
		}
	});
	
	// Check for inline elements containing block elements
	const inlineElements = ['span', 'a', 'strong', 'em', 'b', 'i'];
	inlineElements.forEach(inline => {
		doc.querySelectorAll(inline).forEach(el => {
			const blockChildren = el.querySelectorAll('div, p, ul, ol, table, blockquote');
			if (blockChildren.length > 0) {
				issues.push({
					type: 'warning',
					message: `<${inline}> should not contain block-level elements`
				});
			}
		});
	});
	
	return {
		valid: issues.filter(i => i.type === 'error').length === 0,
		issues
	};
}

/**
 * Format (beautify) HTML with proper indentation
 */
export function formatHTML(input: string, indentSize: number = 2): string {
	const { doc } = parseHTMLSafe(input);
	const indent = ' '.repeat(indentSize);
	
	function formatNode(node: Node, level: number): string {
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent?.trim() || '';
			if (!text) return '';
			return indent.repeat(level) + text + '\n';
		}
		
		if (node.nodeType === Node.COMMENT_NODE) {
			return indent.repeat(level) + `<!--${node.textContent}-->\n`;
		}
		
		if (node.nodeType !== Node.ELEMENT_NODE) return '';
		
		const el = node as Element;
		const tagName = el.tagName.toLowerCase();
		
		// Build opening tag with attributes
		let attrs = '';
		for (const attr of Array.from(el.attributes)) {
			attrs += ` ${attr.name}="${escapeAttribute(attr.value)}"`;
		}
		
		const isVoid = VOID_ELEMENTS.has(tagName);
		let result = indent.repeat(level) + `<${tagName}${attrs}`;
		
		if (isVoid) {
			return result + ' />\n';
		}
		
		result += '>';
		
		// Handle children
		const children = Array.from(el.childNodes);
		const hasElementChildren = children.some(c => c.nodeType === Node.ELEMENT_NODE);
		const textOnly = children.length === 1 && children[0].nodeType === Node.TEXT_NODE;
		
		if (textOnly) {
			const text = children[0].textContent?.trim() || '';
			if (text.length < 60) {
				return result + text + `</${tagName}>\n`;
			}
		}
		
		if (hasElementChildren || (children.length > 0 && !textOnly)) {
			result += '\n';
			for (const child of children) {
				result += formatNode(child, level + 1);
			}
			result += indent.repeat(level);
		}
		
		return result + `</${tagName}>\n`;
	}
	
	// Check if input has doctype
	const hasDoctype = input.trim().toLowerCase().startsWith('<!doctype');
	let output = '';
	
	if (hasDoctype) {
		output = '<!DOCTYPE html>\n';
	}
	
	const html = doc.documentElement;
	if (html) {
		output += formatNode(html, 0);
	}
	
	return output.trim();
}

/**
 * Minify HTML (remove unnecessary whitespace)
 */
export function minifyHTML(input: string): string {
	return input
		.replace(/\s+/g, ' ')           // Collapse whitespace
		.replace(/>\s+</g, '><')        // Remove space between tags
		.replace(/\s+>/g, '>')          // Remove space before >
		.replace(/<\s+/g, '<')          // Remove space after <
		.trim();
}

/**
 * Extract text from HTML, stripping all tags
 */
export interface TextExtractOptions {
	preserveLineBreaks?: boolean;
	keepLinkUrls?: boolean;
	collapseWhitespace?: boolean;
}

export function htmlToText(input: string, options: TextExtractOptions = {}): string {
	const { doc } = parseHTMLSafe(input);
	const {
		preserveLineBreaks = true,
		keepLinkUrls = false,
		collapseWhitespace = true
	} = options;
	
	function extractText(node: Node): string {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent || '';
		}
		
		if (node.nodeType !== Node.ELEMENT_NODE) return '';
		
		const el = node as Element;
		const tagName = el.tagName.toLowerCase();
		
		// Skip script and style
		if (tagName === 'script' || tagName === 'style') return '';
		
		let text = '';
		
		// Handle links specially if keeping URLs
		if (keepLinkUrls && tagName === 'a') {
			const href = el.getAttribute('href');
			const linkText = Array.from(el.childNodes).map(extractText).join('');
			if (href && href !== linkText) {
				return `${linkText} (${href})`;
			}
		}
		
		for (const child of Array.from(el.childNodes)) {
			text += extractText(child);
		}
		
		// Add line breaks for block elements
		if (preserveLineBreaks) {
			const blockTags = ['p', 'div', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'blockquote'];
			if (blockTags.includes(tagName)) {
				text = '\n' + text + '\n';
			}
		}
		
		return text;
	}
	
	let result = extractText(doc.body || doc.documentElement);
	
	if (collapseWhitespace) {
		result = result.replace(/[ \t]+/g, ' ');
		result = result.replace(/\n\s*\n/g, '\n\n');
	}
	
	return result.trim();
}

/**
 * Extract specific elements from HTML
 */
export function extractElements(input: string, selector: string): ExtractedElement[] {
	const { doc } = parseHTMLSafe(input);
	const elements: ExtractedElement[] = [];
	
	try {
		doc.querySelectorAll(selector).forEach(el => {
			const attrs: Record<string, string> = {};
			for (const attr of Array.from(el.attributes)) {
				attrs[attr.name] = attr.value;
			}
			
			elements.push({
				tag: el.tagName.toLowerCase(),
				attributes: attrs,
				text: el.textContent?.trim() || undefined,
				html: el.outerHTML
			});
		});
	} catch {
		// Invalid selector - return empty
	}
	
	return elements;
}

/**
 * Convert HTML DOM to JSON structure
 */
export function htmlToJSON(input: string): HTMLNode | null {
	const { doc } = parseHTMLSafe(input);
	
	function nodeToJSON(node: Element): HTMLNode {
		const attrs: Record<string, string> = {};
		for (const attr of Array.from(node.attributes)) {
			attrs[attr.name] = attr.value;
		}
		
		const children: HTMLNode[] = [];
		let text = '';
		
		for (const child of Array.from(node.childNodes)) {
			if (child.nodeType === Node.ELEMENT_NODE) {
				children.push(nodeToJSON(child as Element));
			} else if (child.nodeType === Node.TEXT_NODE) {
				const t = child.textContent?.trim();
				if (t) text += t;
			}
		}
		
		return {
			tag: node.tagName.toLowerCase(),
			attributes: attrs,
			children,
			...(text ? { text } : {})
		};
	}
	
	const root = doc.documentElement;
	return root ? nodeToJSON(root) : null;
}

/**
 * Count HTML tags by type
 */
export function countTags(input: string): TagCount[] {
	const { doc } = parseHTMLSafe(input);
	const counts = new Map<string, number>();
	
	function countNode(el: Element) {
		const tag = el.tagName.toLowerCase();
		counts.set(tag, (counts.get(tag) || 0) + 1);
		
		for (const child of Array.from(el.children)) {
			countNode(child);
		}
	}
	
	if (doc.documentElement) {
		countNode(doc.documentElement);
	}
	
	return Array.from(counts.entries())
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count);
}

/**
 * Clean HTML attributes based on options
 */
export interface CleanOptions {
	removeInlineStyles?: boolean;
	removeEmptyAttributes?: boolean;
	removeDataAttributes?: boolean;
	removeEventHandlers?: boolean;
}

export function cleanAttributes(input: string, options: CleanOptions = {}): { output: string; removed: number } {
	const {
		removeInlineStyles = true,
		removeEmptyAttributes = true,
		removeDataAttributes = false,
		removeEventHandlers = true
	} = options;
	
	const { doc } = parseHTMLSafe(input);
	let removed = 0;
	
	const eventHandlers = [
		'onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout',
		'onkeydown', 'onkeypress', 'onkeyup', 'onfocus', 'onblur', 'onchange', 'onsubmit', 'onload', 'onerror'
	];
	
	function cleanNode(el: Element) {
		const toRemove: string[] = [];
		
		for (const attr of Array.from(el.attributes)) {
			const name = attr.name.toLowerCase();
			const value = attr.value;
			
			if (removeInlineStyles && name === 'style') {
				toRemove.push(attr.name);
			} else if (removeEmptyAttributes && value === '') {
				toRemove.push(attr.name);
			} else if (removeDataAttributes && name.startsWith('data-')) {
				toRemove.push(attr.name);
			} else if (removeEventHandlers && eventHandlers.includes(name)) {
				toRemove.push(attr.name);
			}
		}
		
		toRemove.forEach(name => {
			el.removeAttribute(name);
			removed++;
		});
		
		for (const child of Array.from(el.children)) {
			cleanNode(child);
		}
	}
	
	if (doc.documentElement) {
		cleanNode(doc.documentElement);
	}
	
	// Serialize back (safe - we're recreating from parsed DOM)
	const output = doc.documentElement?.outerHTML || '';
	
	return { output, removed };
}

/**
 * Generate CSS selector for an element
 */
export function generateSelector(el: Element): string {
	const parts: string[] = [];
	let current: Element | null = el;
	
	while (current && current !== document.documentElement) {
		let selector = current.tagName.toLowerCase();
		
		if (current.id) {
			selector += `#${current.id}`;
			parts.unshift(selector);
			break; // ID is unique, no need to go further
		}
		
		if (current.className) {
			const classes = current.className.trim().split(/\s+/).slice(0, 2);
			selector += '.' + classes.join('.');
		}
		
		// Add nth-child if needed for uniqueness
		const parent = current.parentElement;
		if (parent) {
			const siblings = Array.from(parent.children).filter(c => c.tagName === current!.tagName);
			if (siblings.length > 1) {
				const index = siblings.indexOf(current) + 1;
				selector += `:nth-child(${index})`;
			}
		}
		
		parts.unshift(selector);
		current = current.parentElement;
	}
	
	return parts.join(' > ');
}

/**
 * Generate XPath for an element
 */
export function generateXPath(el: Element): string {
	const parts: string[] = [];
	let current: Element | null = el;
	
	while (current && current.nodeType === Node.ELEMENT_NODE) {
		let index = 1;
		let sibling = current.previousElementSibling;
		
		while (sibling) {
			if (sibling.tagName === current.tagName) index++;
			sibling = sibling.previousElementSibling;
		}
		
		const tagName = current.tagName.toLowerCase();
		parts.unshift(`${tagName}[${index}]`);
		current = current.parentElement;
	}
	
	return '/' + parts.join('/');
}

/**
 * Escape HTML attribute value
 */
function escapeAttribute(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/**
 * Escape HTML content (for safe display)
 */
export function escapeHTML(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

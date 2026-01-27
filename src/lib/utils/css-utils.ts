// CSS Utility Functions

/**
 * Format CSS with proper indentation
 */
export function formatCSS(css: string, indent: string = '  '): string {
	if (!css.trim()) return '';
	
	let formatted = '';
	let indentLevel = 0;
	let inString = false;
	let stringChar = '';
	let i = 0;

	// Remove existing whitespace between tokens
	css = css.replace(/\s+/g, ' ').trim();

	while (i < css.length) {
		const char = css[i];
		const nextChar = css[i + 1] || '';

		// Handle strings
		if ((char === '"' || char === "'") && css[i - 1] !== '\\') {
			if (!inString) {
				inString = true;
				stringChar = char;
			} else if (char === stringChar) {
				inString = false;
			}
			formatted += char;
			i++;
			continue;
		}

		if (inString) {
			formatted += char;
			i++;
			continue;
		}

		// Handle opening brace
		if (char === '{') {
			formatted += ' {\n';
			indentLevel++;
			formatted += indent.repeat(indentLevel);
			i++;
			// Skip whitespace after brace
			while (css[i] === ' ') i++;
			continue;
		}

		// Handle closing brace
		if (char === '}') {
			indentLevel = Math.max(0, indentLevel - 1);
			formatted = formatted.trimEnd() + '\n' + indent.repeat(indentLevel) + '}\n';
			if (nextChar && nextChar !== '}') {
				formatted += '\n' + indent.repeat(indentLevel);
			}
			i++;
			// Skip whitespace after brace
			while (css[i] === ' ') i++;
			continue;
		}

		// Handle semicolon
		if (char === ';') {
			formatted += ';\n' + indent.repeat(indentLevel);
			i++;
			// Skip whitespace after semicolon
			while (css[i] === ' ') i++;
			continue;
		}

		// Handle colon (property: value)
		if (char === ':' && nextChar === ' ') {
			formatted += ': ';
			i += 2;
			continue;
		}

		if (char === ':') {
			formatted += ': ';
			i++;
			// Skip whitespace after colon
			while (css[i] === ' ') i++;
			continue;
		}

		formatted += char;
		i++;
	}

	// Clean up extra newlines and trailing whitespace
	return formatted
		.split('\n')
		.map(line => line.trimEnd())
		.join('\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
}

/**
 * Minify CSS by removing whitespace and comments
 */
export function minifyCSS(css: string): string {
	if (!css.trim()) return '';

	return css
		// Remove comments
		.replace(/\/\*[\s\S]*?\*\//g, '')
		// Remove newlines and tabs
		.replace(/[\n\r\t]/g, '')
		// Collapse multiple spaces
		.replace(/\s+/g, ' ')
		// Remove spaces around special characters
		.replace(/\s*([{};:,>~+])\s*/g, '$1')
		// Remove trailing semicolons before }
		.replace(/;}/g, '}')
		// Remove spaces in selectors
		.replace(/,\s+/g, ',')
		.trim();
}

/**
 * Remove vendor prefixes from CSS
 */
export function removePrefixes(css: string): string {
	const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
	let result = css;

	// Remove prefixed properties
	prefixes.forEach(prefix => {
		// Match property declarations with prefixes
		const propRegex = new RegExp(`${prefix}[a-z-]+\\s*:[^;]+;?\\s*`, 'gi');
		result = result.replace(propRegex, '');
	});

	// Remove prefixed values (like -webkit-flex)
	prefixes.forEach(prefix => {
		const valueRegex = new RegExp(prefix, 'g');
		result = result.replace(valueRegex, '');
	});

	// Clean up empty rules
	result = result.replace(/[^{}]+\{\s*\}/g, '');
	
	// Clean up multiple semicolons and whitespace
	result = result.replace(/;\s*;/g, ';');
	result = result.replace(/\n\s*\n/g, '\n');

	return result.trim();
}

/**
 * Generate box-shadow CSS
 */
export interface BoxShadowConfig {
	x: number;
	y: number;
	blur: number;
	spread: number;
	color: string;
	inset: boolean;
}

export function generateBoxShadow(shadows: BoxShadowConfig[]): string {
	if (shadows.length === 0) return 'none';
	
	return shadows.map(s => {
		const inset = s.inset ? 'inset ' : '';
		return `${inset}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`;
	}).join(', ');
}

/**
 * Generate text-shadow CSS
 */
export interface TextShadowConfig {
	x: number;
	y: number;
	blur: number;
	color: string;
}

export function generateTextShadow(shadows: TextShadowConfig[]): string {
	if (shadows.length === 0) return 'none';
	
	return shadows.map(s => {
		return `${s.x}px ${s.y}px ${s.blur}px ${s.color}`;
	}).join(', ');
}

/**
 * Generate CSS filter
 */
export interface FilterConfig {
	blur: number;
	brightness: number;
	contrast: number;
	grayscale: number;
	hueRotate: number;
	invert: number;
	saturate: number;
	sepia: number;
	opacity: number;
}

export function generateFilter(config: FilterConfig): string {
	const filters: string[] = [];
	
	if (config.blur > 0) filters.push(`blur(${config.blur}px)`);
	if (config.brightness !== 100) filters.push(`brightness(${config.brightness}%)`);
	if (config.contrast !== 100) filters.push(`contrast(${config.contrast}%)`);
	if (config.grayscale > 0) filters.push(`grayscale(${config.grayscale}%)`);
	if (config.hueRotate !== 0) filters.push(`hue-rotate(${config.hueRotate}deg)`);
	if (config.invert > 0) filters.push(`invert(${config.invert}%)`);
	if (config.saturate !== 100) filters.push(`saturate(${config.saturate}%)`);
	if (config.sepia > 0) filters.push(`sepia(${config.sepia}%)`);
	if (config.opacity !== 100) filters.push(`opacity(${config.opacity}%)`);
	
	return filters.length > 0 ? filters.join(' ') : 'none';
}

/**
 * Generate transition CSS
 */
export interface TransitionConfig {
	property: string;
	duration: number;
	timingFunction: string;
	delay: number;
}

export function generateTransition(config: TransitionConfig): string {
	return `${config.property} ${config.duration}ms ${config.timingFunction} ${config.delay}ms`;
}

/**
 * Generate flexbox CSS
 */
export interface FlexboxConfig {
	direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
	alignItems: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
	flexWrap: 'nowrap' | 'wrap' | 'wrap-reverse';
	gap: number;
}

export function generateFlexbox(config: FlexboxConfig): string {
	const lines = [
		'display: flex;',
		`flex-direction: ${config.direction};`,
		`justify-content: ${config.justifyContent};`,
		`align-items: ${config.alignItems};`,
		`flex-wrap: ${config.flexWrap};`,
	];
	
	if (config.gap > 0) {
		lines.push(`gap: ${config.gap}px;`);
	}
	
	return lines.join('\n');
}

/**
 * Generate grid CSS
 */
export interface GridConfig {
	columns: number;
	rows: number;
	columnGap: number;
	rowGap: number;
	columnSizes: string;
	rowSizes: string;
}

export function generateGrid(config: GridConfig): string {
	const colTemplate = config.columnSizes || `repeat(${config.columns}, 1fr)`;
	const rowTemplate = config.rowSizes || (config.rows > 0 ? `repeat(${config.rows}, 1fr)` : 'auto');
	
	const lines = [
		'display: grid;',
		`grid-template-columns: ${colTemplate};`,
	];
	
	if (config.rows > 0) {
		lines.push(`grid-template-rows: ${rowTemplate};`);
	}
	
	if (config.columnGap > 0 || config.rowGap > 0) {
		if (config.columnGap === config.rowGap) {
			lines.push(`gap: ${config.columnGap}px;`);
		} else {
			lines.push(`gap: ${config.rowGap}px ${config.columnGap}px;`);
		}
	}
	
	return lines.join('\n');
}

/**
 * Cubic bezier presets
 */
export const cubicBezierPresets = {
	'linear': [0, 0, 1, 1],
	'ease': [0.25, 0.1, 0.25, 1],
	'ease-in': [0.42, 0, 1, 1],
	'ease-out': [0, 0, 0.58, 1],
	'ease-in-out': [0.42, 0, 0.58, 1],
	'ease-in-quad': [0.55, 0.085, 0.68, 0.53],
	'ease-out-quad': [0.25, 0.46, 0.45, 0.94],
	'ease-in-cubic': [0.55, 0.055, 0.675, 0.19],
	'ease-out-cubic': [0.215, 0.61, 0.355, 1],
	'ease-in-back': [0.6, -0.28, 0.735, 0.045],
	'ease-out-back': [0.175, 0.885, 0.32, 1.275],
} as const;

export type CubicBezierPreset = keyof typeof cubicBezierPresets;

/**
 * CSS Snippets
 */
export const cssSnippets = {
	centerFlex: `.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
	
	centerGrid: `.centered {
  display: grid;
  place-items: center;
}`,

	centerAbsolute: `.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,

	truncateSingle: `.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,

	truncateMulti: `.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}`,

	aspectRatio: `.aspect-ratio {
  aspect-ratio: 16 / 9;
}`,

	aspectRatioFallback: `.aspect-ratio {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 */
}

.aspect-ratio > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`,

	stickyFooter: `body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

footer {
  flex-shrink: 0;
}`,

	visuallyHidden: `.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`,

	smoothScroll: `html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}`,

	resetButton: `.reset-button {
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}`,

	gradientText: `.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`,

	customScrollbar: `.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}`,

	skeleton: `.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`,

	glassEffect: `.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}`,

	focusVisible: `.focus-ring:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

.focus-ring:focus:not(:focus-visible) {
  outline: none;
}`,

	disabledState: `.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}`,

	textBalance: `.balanced-text {
  text-wrap: balance;
  max-inline-size: 50ch;
}`,

	containerQuery: `@container (min-width: 400px) {
  .card {
    grid-template-columns: 1fr 1fr;
  }
}

.container {
  container-type: inline-size;
}`,

	modernButton: `.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: white;
  background-color: #6366f1;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.btn:hover {
  background-color: #4f46e5;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}`,

	modernInput: `.input {
  display: block;
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #1f2937;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input:focus {
  border-color: #6366f1;
  outline: 0;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}`,

	customCheckbox: `.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.25em;
  height: 1.25em;
  border: 1px solid #d1d5db;
  border-radius: 0.25em;
  display: grid;
  place-content: center;
  transition: 0.2s ease-in-out;
}

.checkbox-input::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 0.12s transform ease-in-out;
  box-shadow: inset 1em 1em white;
  transform-origin: center;
  clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
}

.checkbox-input:checked {
  background-color: #6366f1;
  border-color: #6366f1;
}

.checkbox-input:checked::before {
  transform: scale(1);
}`,

	card: `.card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0,0,0,0.05);
}`,

	borderRadius: `.rounded-sm { border-radius: 0.125rem; }
.rounded { border-radius: 0.25rem; }
.rounded-md { border-radius: 0.375rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-3xl { border-radius: 1.5rem; }
.rounded-full { border-radius: 9999px; } 
.rounded-pill { border-radius: 100vw; }`,
};

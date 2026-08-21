import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | null = null;
let initPromise: Promise<Highlighter> | null = null;

/**
 * Initialize the Shiki highlighter with our preferred themes and languages
 */
async function getHighlighter(): Promise<Highlighter> {
	if (highlighter) return highlighter;

	if (!initPromise) {
		initPromise = createHighlighter({
			themes: ['min-light', 'github-dark'],
			langs: ['json', 'typescript', 'go', 'javascript', 'xml', 'html']
		});
	}

	highlighter = await initPromise;
	return highlighter;
}

/**
 * Highlight code with Shiki
 * @param code - The code to highlight
 * @param lang - The language (json, typescript, go, javascript)
 * @param theme - The theme to use (defaults to min-light)
 * @returns HTML string with highlighted code
 */
export async function highlight(
	code: string,
	lang: 'json' | 'typescript' | 'go' | 'javascript' | 'xml' | 'html' = 'json',
	theme: 'min-light' | 'github-dark' = 'min-light'
): Promise<string> {
	const hl = await getHighlighter();
	return hl.codeToHtml(code, {
		lang,
		theme
	});
}

/**
 * Check if highlighter is ready (for sync checks)
 */
export function isHighlighterReady(): boolean {
	return highlighter !== null;
}

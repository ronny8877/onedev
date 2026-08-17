export const GA_MEASUREMENT_ID = 'G-79EL2FS0FS';

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

function gtag(...args: unknown[]) {
	if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
	window.gtag(...args);
}

export function trackPageView(path: string, title?: string) {
	gtag('event', 'page_view', {
		page_path: path,
		page_title: title || (typeof document !== 'undefined' ? document.title : path),
		page_location: typeof window !== 'undefined' ? window.location.href : undefined
	});
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean | undefined>) {
	gtag('event', name, params);
}

export function trackToolSelect(tool: string, category?: string, source: 'sidebar' | 'search' | 'home' = 'sidebar') {
	trackEvent('select_content', {
		content_type: 'tool',
		item_id: tool,
		item_category: category,
		source
	});
}

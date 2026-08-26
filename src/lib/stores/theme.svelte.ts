type Theme = 'light' | 'dark';

const THEME_KEY = 'onedev-theme';

// DaisyUI theme names. Dark uses official `forest`, not `night` or a custom palette.
function dataTheme(theme: Theme): 'light' | 'forest' {
	return theme === 'light' ? 'light' : 'forest';
}

function getStoredTheme(): Theme {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 'dark';
	const stored = localStorage.getItem(THEME_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	if (stored === 'forest') return 'dark';
	return 'dark';
}

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	document.documentElement.setAttribute('data-theme', dataTheme(theme));
	document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', theme === 'dark' ? '#302b2b' : '#ffffff');
	}
}

let currentTheme = $state<Theme>('dark');

export function getTheme(): Theme {
	return currentTheme;
}

export function setTheme(theme: Theme) {
	currentTheme = theme;
	if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
		localStorage.setItem(THEME_KEY, theme);
	}
	applyTheme(theme);
}

export function toggleTheme() {
	setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

export function initTheme() {
	const stored = getStoredTheme();
	currentTheme = stored;
	applyTheme(stored);
}

export const themeKey = THEME_KEY;

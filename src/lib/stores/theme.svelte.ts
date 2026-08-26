import { THEME_KEY, daisyTheme, type ThemePreference } from '$lib/theme-daisy';

type Theme = ThemePreference;

function getStoredTheme(): Theme {
	if (typeof window === 'undefined' || typeof localStorage === 'undefined') return 'dark';
	return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const name = daisyTheme(theme);
	document.documentElement.setAttribute('data-theme', name);
	document.documentElement.style.colorScheme = theme === 'light' ? 'light' : 'dark';
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.setAttribute('content', theme === 'dark' ? '#302b2b' : '#f7f6f4');
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

export { THEME_KEY };

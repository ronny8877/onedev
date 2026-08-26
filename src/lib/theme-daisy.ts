export const THEME_KEY = 'onedev-theme';

export type ThemePreference = 'light' | 'dark';
export type DaisyTheme = 'emerald' | 'forest';

// Stored preference is light | dark. Daisy light is emerald, Daisy dark is forest.
// This is the only mapping. The FOUC boot script in src/app.html inlines the same
// ternary because it cannot import this module.
export function daisyTheme(preference: string | null | undefined): DaisyTheme {
	return preference === 'light' ? 'emerald' : 'forest';
}

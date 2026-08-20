<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { json } from '@codemirror/lang-json';
	import { xml } from '@codemirror/lang-xml';
	import { html } from '@codemirror/lang-html';
	import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
	import { StateField, StateEffect } from '@codemirror/state';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { tags } from '@lezer/highlight';

	export type EditorLanguage = 'json' | 'xml' | 'html';

	interface Props {
		value: string;
		placeholder?: string;
		readonly?: boolean;
		errorLine?: number;
		language?: EditorLanguage;
		onInput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Paste code here...',
		readonly = false,
		errorLine,
		language = 'json',
		onInput
	}: Props = $props();

	const langSupport = $derived(
		language === 'xml' ? xml() : language === 'html' ? html() : json()
	);

	// Syntax highlighting theme with vibrant colors that read well on both themes
	const highlightStyle = HighlightStyle.define([
		{ tag: tags.string, color: '#22c55e' },
		{ tag: tags.number, color: '#f59e0b' },
		{ tag: tags.bool, color: '#3b82f6' },
		{ tag: tags.null, color: '#a78bfa' },
		{ tag: tags.propertyName, color: '#ec4899', fontWeight: '500' },
		{ tag: [tags.punctuation, tags.bracket, tags.separator], color: '#94a3b8' },
		{ tag: tags.tagName, color: '#ec4899', fontWeight: '500' },
		{ tag: tags.attributeName, color: '#3b82f6' },
		{ tag: tags.attributeValue, color: '#22c55e' },
		{ tag: tags.angleBracket, color: '#94a3b8' },
		{ tag: tags.comment, color: '#94a3b8', fontStyle: 'italic' },
		{ tag: tags.processingInstruction, color: '#a78bfa' },
		{ tag: tags.documentMeta, color: '#a78bfa' }
	]);

	// Error line highlighting
	const errorLineEffect = StateEffect.define<number | null>();

	const errorLineField = StateField.define<DecorationSet>({
		create() {
			return Decoration.none;
		},
		update(decorations, tr) {
			for (const effect of tr.effects) {
				if (effect.is(errorLineEffect)) {
					if (effect.value === null || effect.value < 1) {
						return Decoration.none;
					}
					const line = tr.state.doc.line(Math.min(effect.value, tr.state.doc.lines));
					return Decoration.set([Decoration.line({ class: 'cm-error-line' }).range(line.from)]);
				}
			}
			return decorations.map(tr.changes);
		},
		provide: (f) => EditorView.decorations.from(f)
	});

	// Theme-aware editor styling driven by daisyUI CSS variables so it adapts to
	// light/dark automatically (color-mix gives us tinted overlays).
	const bc = (pct: number) => `color-mix(in oklch, var(--color-base-content) ${pct}%, transparent)`;
	const primary = (pct: number) => `color-mix(in oklch, var(--color-primary) ${pct}%, transparent)`;

	const baseTheme = EditorView.theme({
		'&': {
			backgroundColor: 'transparent',
			color: 'var(--color-base-content)',
			fontSize: '13.5px',
			fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
		},
		'&.cm-focused': { outline: 'none' },
		'.cm-scroller': {
			overflow: 'auto',
			fontFamily: 'inherit',
			lineHeight: '1.65'
		},
		'.cm-content': {
			padding: '10px 0',
			caretColor: 'var(--color-primary)'
		},
		'.cm-line': { padding: '0 14px' },
		// Gutters (line numbers + fold) — the key dark-mode fix
		'.cm-gutters': {
			backgroundColor: 'var(--color-base-200)',
			color: bc(45),
			border: 'none',
			borderRight: `1px solid ${bc(10)}`
		},
		'.cm-lineNumbers .cm-gutterElement': {
			padding: '0 10px 0 16px',
			minWidth: '2.5rem',
			textAlign: 'right'
		},
		'.cm-foldGutter .cm-gutterElement': {
			padding: '0 6px',
			color: bc(40),
			cursor: 'pointer'
		},
		'.cm-foldGutter .cm-gutterElement:hover': { color: 'var(--color-primary)' },
		'.cm-activeLineGutter': {
			backgroundColor: primary(14),
			color: 'var(--color-primary)',
			fontWeight: '600'
		},
		'.cm-activeLine': { backgroundColor: primary(6) },
		'.cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: `${primary(22)} !important`
		},
		'&.cm-focused .cm-selectionBackground': { backgroundColor: `${primary(28)} !important` },
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: 'var(--color-primary)',
			borderLeftWidth: '2px'
		},
		'.cm-placeholder': { color: bc(35) },
		// Bracket matching + selection match highlights
		'.cm-matchingBracket': {
			backgroundColor: primary(20),
			outline: `1px solid ${primary(45)}`,
			borderRadius: '3px'
		},
		'.cm-nonmatchingBracket': {
			backgroundColor: 'color-mix(in oklch, var(--color-error) 22%, transparent)'
		},
		'.cm-selectionMatch': {
			backgroundColor: 'color-mix(in oklch, var(--color-warning) 22%, transparent)',
			borderRadius: '3px'
		},
		// Error line highlight
		'.cm-error-line': {
			backgroundColor: 'color-mix(in oklch, var(--color-error) 14%, transparent)'
		},
		// Search panel (opened with Ctrl/Cmd+F)
		'.cm-panels': {
			backgroundColor: 'var(--color-base-200)',
			color: 'var(--color-base-content)',
			border: 'none'
		},
		'.cm-panels.cm-panels-bottom': { borderTop: `1px solid ${bc(10)}` },
		'.cm-panel.cm-search': { padding: '8px 10px' },
		'.cm-panel input, .cm-panel button': {
			backgroundColor: 'var(--color-base-100)',
			color: 'var(--color-base-content)',
			border: `1px solid ${bc(15)}`,
			borderRadius: '6px',
			padding: '2px 8px'
		},
		'.cm-searchMatch': {
			backgroundColor: 'color-mix(in oklch, var(--color-warning) 28%, transparent)',
			borderRadius: '2px'
		},
		'.cm-searchMatch-selected': { backgroundColor: primary(45) },
		// Autocomplete tooltip
		'.cm-tooltip': {
			backgroundColor: 'var(--color-base-100)',
			border: `1px solid ${bc(12)}`,
			borderRadius: '8px',
			boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
			overflow: 'hidden'
		},
		'.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
			backgroundColor: 'var(--color-primary)',
			color: 'var(--color-primary-content)'
		}
	});

	const extensions = [
		syntaxHighlighting(highlightStyle),
		baseTheme,
		errorLineField,
		EditorView.lineWrapping
	];

	// Capture the EditorView so error-line highlighting stays in sync with the prop.
	let view = $state<EditorView>();
	function handleReady(v: EditorView) {
		view = v;
	}
	$effect(() => {
		view?.dispatch({ effects: errorLineEffect.of(errorLine ?? null) });
	});

	let lineCount = $derived(value ? value.split('\n').length : 0);
	let charCount = $derived(value.length);

	let copied = $state(false);
	async function copyToClipboard() {
		await navigator.clipboard.writeText(value);
		copied = true;
		setTimeout(() => (copied = false), 1200);
	}
</script>

<div
	class="codemirror-wrapper overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-sm transition-all duration-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
>
	<!-- Toolbar -->
	<div
		class="flex items-center justify-between gap-2 border-b border-base-300/60 bg-base-300/30 px-4 py-2"
	>
		<div class="flex items-center gap-2 text-xs text-base-content/50">
			<span class="inline-flex items-center gap-1.5 font-medium">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
				{lineCount} line{lineCount !== 1 ? 's' : ''}
			</span>
			<span class="text-base-content/25">·</span>
			<span class="font-mono">{charCount.toLocaleString()} chars</span>
			{#if readonly}
				<span class="badge badge-ghost badge-xs">read-only</span>
			{/if}
			{#if errorLine}
				<span class="badge badge-error badge-xs">Error · line {errorLine}</span>
			{/if}
		</div>
		<div class="flex items-center gap-1">
			<span class="mr-1 hidden text-[11px] text-base-content/35 sm:inline">⌘/Ctrl+F to search</span>
			<button
				type="button"
				class="btn btn-ghost btn-xs gap-1 hover:bg-base-content/10"
				onclick={copyToClipboard}
				title="Copy to clipboard"
				aria-label="Copy to clipboard"
			>
				{#if copied}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-success"><path d="M20 6 9 17l-5-5"/></svg>
					<span class="text-success">Copied</span>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
				{/if}
			</button>
			{#if !readonly}
				<button
					type="button"
					class="btn btn-ghost btn-xs hover:bg-base-content/10"
					onclick={() => {
						value = '';
						onInput?.('');
					}}
					title="Clear"
					aria-label="Clear editor"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Editor -->
	<div class="editor-container">
		<CodeMirror
			bind:value
			lang={langSupport}
			{extensions}
			{placeholder}
			editable={!readonly}
			onready={handleReady}
		/>
	</div>
</div>

<style>
	.editor-container {
		min-height: 300px;
		max-height: 500px;
		overflow: auto;
		width: 100%;
	}

	.editor-container :global(.cm-editor) {
		min-height: 300px;
	}

	.editor-container :global(.cm-scroller) {
		min-height: 300px;
	}

	/* Keep the gutter pinned and opaque while scrolling horizontally */
	.editor-container :global(.cm-gutters) {
		position: sticky !important;
		left: 0 !important;
		z-index: 50 !important;
		background-color: var(--color-base-200) !important;
	}
</style>

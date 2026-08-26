<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { json } from '@codemirror/lang-json';
	import { xml } from '@codemirror/lang-xml';
	import { html } from '@codemirror/lang-html';
	import { sql, PostgreSQL, MySQL, MariaSQL, SQLite, MSSQL, StandardSQL } from '@codemirror/lang-sql';
	import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
	import { StateField, StateEffect } from '@codemirror/state';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { tags } from '@lezer/highlight';
	import { search } from '@codemirror/search';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { createSearchPanel } from '$lib/components/ui/codemirror-search-panel';

	export type EditorLanguage = 'json' | 'xml' | 'html' | 'sql';
	export type SqlEditorDialect = 'postgresql' | 'mysql' | 'mariadb' | 'sqlite' | 'transactsql' | 'standard';

	interface Props {
		value: string;
		placeholder?: string;
		readonly?: boolean;
		errorLine?: number;
		language?: EditorLanguage;
		sqlDialect?: SqlEditorDialect;
		onInput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Paste code here...',
		readonly = false,
		errorLine,
		language = 'json',
		sqlDialect = 'postgresql',
		onInput
	}: Props = $props();

	const sqlLang = $derived.by(() => {
		const dialect =
			sqlDialect === 'mysql'
				? MySQL
				: sqlDialect === 'mariadb'
					? MariaSQL
					: sqlDialect === 'sqlite'
						? SQLite
						: sqlDialect === 'transactsql'
							? MSSQL
							: sqlDialect === 'standard'
								? StandardSQL
								: PostgreSQL;
		return sql({ dialect, upperCaseKeywords: true });
	});

	const langSupport = $derived(
		language === 'xml' ? xml() : language === 'html' ? html() : language === 'sql' ? sqlLang : json()
	);

	// Syntax highlighting follows theme CSS variables. Light keywords stay
	// base-content so Daisy light's indigo primary does not paint the editor.
	const highlightStyle = HighlightStyle.define([
		{ tag: tags.keyword, color: 'var(--cm-keyword)', fontWeight: '600' },
		{ tag: tags.operatorKeyword, color: 'var(--cm-keyword)' },
		{ tag: tags.string, color: 'var(--cm-string)' },
		{ tag: tags.attributeValue, color: 'var(--cm-string)' },
		{ tag: tags.comment, color: 'var(--cm-comment)', fontStyle: 'italic' },
		{ tag: tags.propertyName, color: 'var(--cm-name)', fontWeight: '500' },
		{ tag: tags.tagName, color: 'var(--cm-name)', fontWeight: '500' },
		{ tag: tags.attributeName, color: 'var(--cm-name)' },
		{ tag: tags.number, color: 'var(--cm-name)' },
		{ tag: tags.bool, color: 'var(--cm-name)' },
		{ tag: tags.null, color: 'var(--cm-name)' },
		{ tag: tags.typeName, color: 'var(--cm-name)' },
		{ tag: tags.function(tags.variableName), color: 'var(--cm-name)' },
		{ tag: tags.standard(tags.name), color: 'var(--cm-name)' },
		{ tag: tags.processingInstruction, color: 'var(--cm-punct)' },
		{ tag: tags.documentMeta, color: 'var(--cm-punct)' },
		{ tag: [tags.punctuation, tags.bracket, tags.separator], color: 'var(--cm-punct)' },
		{ tag: tags.angleBracket, color: 'var(--cm-punct)' },
		{ tag: tags.operator, color: 'var(--cm-punct)' }
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
		'.cm-foldGutter .cm-gutterElement:hover': { color: 'var(--color-base-content)' },
		'.cm-activeLineGutter': {
			backgroundColor: bc(8),
			color: 'var(--color-base-content)',
			fontWeight: '600'
		},
		'.cm-activeLine': { backgroundColor: bc(6) },
		'.cm-selectionBackground, .cm-content ::selection': {
			backgroundColor: `${bc(18)} !important`
		},
		'&.cm-focused .cm-selectionBackground': { backgroundColor: `${bc(22)} !important` },
		'.cm-cursor, .cm-dropCursor': {
			borderLeftColor: 'var(--color-primary)',
			borderLeftWidth: '2px'
		},
		'.cm-placeholder': { color: bc(35) },
		'.cm-matchingBracket': {
			backgroundColor: bc(12),
			outline: `1px solid ${bc(28)}`,
			borderRadius: '3px'
		},
		'.cm-nonmatchingBracket': {
			backgroundColor: 'color-mix(in oklch, var(--color-error) 22%, transparent)'
		},
		'.cm-selectionMatch': {
			backgroundColor: bc(14),
			borderRadius: '3px'
		},
		'.cm-error-line': {
			backgroundColor: 'color-mix(in oklch, var(--color-error) 14%, transparent)'
		},
		'.cm-panels': {
			backgroundColor: 'var(--color-base-200)',
			color: 'var(--color-base-content)',
			border: 'none'
		},
		'.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--color-base-300)' },
		'.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--color-base-300)' },
		'.cm-searchMatch': {
			backgroundColor: bc(16),
			borderRadius: '2px'
		},
		'.cm-searchMatch-selected': { backgroundColor: bc(28) },
		'.cm-tooltip': {
			backgroundColor: 'var(--color-base-100)',
			border: `1px solid ${bc(12)}`,
			borderRadius: '8px',
			boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
			overflow: 'hidden'
		},
		'.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]': {
			backgroundColor: 'var(--color-base-300)',
			color: 'var(--color-base-content)'
		}
	});

	const extensions = [
		syntaxHighlighting(highlightStyle),
		baseTheme,
		errorLineField,
		EditorView.lineWrapping,
		search({ top: true, createPanel: createSearchPanel })
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
	class="codemirror-wrapper overflow-hidden rounded-lg border border-base-300 bg-base-200 shadow-sm focus-within:border-primary"
>
	<!-- Toolbar -->
	<div
		class="flex items-center justify-between gap-2 border-b border-base-300/60 bg-base-300/30 px-4 py-2"
	>
		<div class="flex items-center gap-2 text-xs text-muted">
			<span class="inline-flex items-center gap-1.5 font-medium">
				<AppIcon name="code-xml" class="size-4" />
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
			<span class="mr-1 hidden text-[11px] text-muted sm:inline">⌘/Ctrl+F to search</span>
			<button
				type="button"
				class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
				onclick={copyToClipboard}
				title="Copy to clipboard"
				aria-label="Copy to clipboard"
			>
				{#if copied}
					<AppIcon name="check" class="size-4 text-success" />
				{:else}
					<AppIcon name="copy" class="size-4" />
				{/if}
			</button>
			{#if !readonly}
				<button
					type="button"
					class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
					onclick={() => {
						value = '';
						onInput?.('');
					}}
					title="Clear"
					aria-label="Clear editor"
				>
					<AppIcon name="rotate-ccw" class="size-4" />
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

	.editor-container :global(.onedev-cm-search) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background: var(--color-base-200);
		color: var(--color-base-content);
		border-bottom: 1px solid var(--color-base-300);
	}

	.editor-container :global(.onedev-cm-search-field) {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-base-content);
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.editor-container :global(.onedev-cm-search-field input) {
		height: 32px;
		min-width: 10rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-base-300);
		background: var(--color-base-100);
		color: var(--color-base-content);
		padding: 0 0.75rem;
		font-size: 0.8125rem;
	}

	.editor-container :global(.onedev-cm-search-field input::placeholder) {
		color: var(--muted);
		opacity: 1;
	}

	.editor-container :global(.onedev-cm-search-field input:focus) {
		outline: none;
		border-color: var(--color-primary);
	}

	.editor-container :global(.onedev-cm-search button[aria-pressed='true']) {
		color: var(--color-base-content);
		background: var(--color-base-300);
	}
</style>

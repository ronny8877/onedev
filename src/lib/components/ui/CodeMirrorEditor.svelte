<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { json } from '@codemirror/lang-json';
	import { EditorView, Decoration, type DecorationSet } from '@codemirror/view';
	import { StateField, StateEffect } from '@codemirror/state';
	import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
	import { tags } from '@lezer/highlight';

	interface Props {
		value: string;
		placeholder?: string;
		readonly?: boolean;
		errorLine?: number;
		onInput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Enter JSON here...',
		readonly = false,
		errorLine,
		onInput
	}: Props = $props();

	// Syntax highlighting theme with vibrant colors
	const highlightStyle = HighlightStyle.define([
		{ tag: tags.string, color: '#22c55e' },           // green for strings
		{ tag: tags.number, color: '#f59e0b' },           // amber for numbers
		{ tag: tags.bool, color: '#3b82f6' },             // blue for booleans
		{ tag: tags.null, color: '#8b5cf6' },             // purple for null
		{ tag: tags.propertyName, color: '#ec4899' },     // pink for property names
		{ tag: tags.punctuation, color: '#64748b' },      // slate for punctuation
		{ tag: tags.bracket, color: '#64748b' },          // slate for brackets
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
					if (effect.value === null) {
						return Decoration.none;
					}
					const line = tr.state.doc.line(Math.min(effect.value, tr.state.doc.lines));
					return Decoration.set([
						Decoration.line({ class: 'cm-error-line' }).range(line.from)
					]);
				}
			}
			return decorations.map(tr.changes);
		},
		provide: (f) => EditorView.decorations.from(f)
	});

	// Base theme
	const baseTheme = EditorView.theme({
		'&': {
			backgroundColor: 'transparent',
			fontSize: '14px',
			fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
		},
		'.cm-content': {
			padding: '12px 0',
			caretColor: '#8b5cf6'
		},
		'.cm-line': {
			padding: '0 12px'
		},
		'.cm-gutters': {
			backgroundColor: 'rgba(0,0,0,0.03)',
			border: 'none',
			color: 'rgba(0,0,0,0.3)',
			minWidth: '3rem'
		},
		'.cm-lineNumbers .cm-gutterElement': {
			padding: '0 8px 0 12px',
			minWidth: '2rem',
			textAlign: 'right'
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'rgba(139, 92, 246, 0.1)'
		},
		'.cm-activeLine': {
			backgroundColor: 'rgba(139, 92, 246, 0.05)'
		},
		'.cm-selectionBackground': {
			backgroundColor: 'rgba(139, 92, 246, 0.2) !important'
		},
		'.cm-cursor': {
			borderLeftColor: '#8b5cf6'
		},
		'.cm-placeholder': {
			color: 'rgba(0,0,0,0.3)'
		},
		'.cm-scroller': {
			overflow: 'auto'
		},
		'.cm-error-line': {
			backgroundColor: 'rgba(239, 68, 68, 0.15) !important'
		},
		'.cm-error-line .cm-lineNumbers .cm-gutterElement': {
			color: '#ef4444 !important',
			fontWeight: 'bold'
		}
	});

	// Combined extensions
	const extensions = [
		syntaxHighlighting(highlightStyle),
		baseTheme,
		errorLineField
	];

	// Count lines for display
	let lineCount = $derived(value.split('\n').length);
</script>

<div class="codemirror-wrapper rounded-xl border border-base-300 bg-base-200 shadow-sm overflow-hidden">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-base-300/50 bg-base-300/30 px-4 py-2.5">
		<div class="flex items-center gap-2">
			<span class="text-xs font-medium text-base-content/50">
				{lineCount} line{lineCount !== 1 ? 's' : ''}
			</span>
			{#if errorLine}
				<span class="badge badge-error badge-xs">Error at line {errorLine}</span>
			{/if}
		</div>
		<div class="flex gap-1">
			<button
				type="button"
				class="btn btn-ghost btn-xs hover:bg-base-content/10"
				onclick={() => navigator.clipboard.writeText(value)}
				title="Copy to clipboard"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
			</button>
			{#if !readonly}
				<button
					type="button"
					class="btn btn-ghost btn-xs hover:bg-base-content/10"
					onclick={() => { value = ''; onInput?.(''); }}
					title="Clear"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
				</button>
			{/if}
		</div>
	</div>

	<!-- Editor -->
	<div class="editor-container">
		<CodeMirror
			bind:value
			lang={json()}
			{extensions}
			{placeholder}
			editable={!readonly}
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

	/* Error line gutter highlight */
	.editor-container :global(.cm-error-line) {
		background-color: rgba(239, 68, 68, 0.15) !important;
	}

	/* Fix line number overlap when scrolling horizontally */
	.editor-container :global(.cm-gutters) {
		position: sticky;
		left: 0;
		z-index: 10;
		background-color: oklch(var(--b2)) !important;
	}

	.editor-container :global(.cm-gutter) {
		background-color: oklch(var(--b2)) !important;
	}
</style>

<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { json } from '@codemirror/lang-json';
	import { EditorView } from '@codemirror/view';

	interface Props {
		value: string;
		placeholder?: string;
		readonly?: boolean;
		onInput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Enter JSON here...',
		readonly = false,
		onInput
	}: Props = $props();

	// Minimal light theme matching app aesthetics
	const customTheme = EditorView.theme({
		'&': {
			backgroundColor: 'transparent',
			fontSize: '14px',
			fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace'
		},
		'.cm-content': {
			padding: '12px 0',
			caretColor: 'oklch(var(--p))'
		},
		'.cm-line': {
			padding: '0 12px'
		},
		'.cm-gutters': {
			backgroundColor: 'oklch(var(--b3) / 0.3)',
			border: 'none',
			color: 'oklch(var(--bc) / 0.4)',
			minWidth: '3rem'
		},
		'.cm-gutter': {
			padding: '0'
		},
		'.cm-lineNumbers .cm-gutterElement': {
			padding: '0 8px 0 12px',
			minWidth: '2rem',
			textAlign: 'right'
		},
		'.cm-activeLineGutter': {
			backgroundColor: 'oklch(var(--p) / 0.1)'
		},
		'.cm-activeLine': {
			backgroundColor: 'oklch(var(--p) / 0.05)'
		},
		'.cm-selectionBackground': {
			backgroundColor: 'oklch(var(--p) / 0.2) !important'
		},
		'.cm-cursor': {
			borderLeftColor: 'oklch(var(--p))'
		},
		'.cm-placeholder': {
			color: 'oklch(var(--bc) / 0.3)'
		},
		'.cm-scroller': {
			overflow: 'auto'
		},
		// JSON syntax colors
		'.ͼb': { color: 'oklch(var(--su))' }, // strings - success
		'.ͼc': { color: 'oklch(var(--wa))' }, // numbers - warning
		'.ͼd': { color: 'oklch(var(--in))' }, // keywords (true/false/null) - info
		'.ͼe': { color: 'oklch(var(--p))' },  // property names - primary
		'.ͼm': { color: 'oklch(var(--bc) / 0.7)' } // punctuation
	});

	// Count lines for display
	let lineCount = $derived(value.split('\n').length);
</script>

<div class="codemirror-wrapper rounded-xl border border-base-300 bg-base-200 shadow-sm overflow-hidden">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-base-300/50 bg-base-300/30 px-4 py-2.5">
		<span class="text-xs font-medium text-base-content/50">
			{lineCount} line{lineCount !== 1 ? 's' : ''}
		</span>
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
			theme={customTheme}
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
	}

	.editor-container :global(.cm-editor) {
		min-height: 300px;
	}

	.editor-container :global(.cm-scroller) {
		min-height: 300px;
	}
</style>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		value: string;
		placeholder?: string;
		readonly?: boolean;
		errorLine?: number;
		onInput?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		placeholder = 'Paste your JSON here...',
		readonly = false,
		errorLine,
		onInput
	}: Props = $props();

	let textareaEl: HTMLTextAreaElement;
	let lineNumbersEl: HTMLDivElement;
	let lineNumbers = $derived(value.split('\n').length);

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;
		onInput?.(target.value);
	}

	function handleScroll() {
		// Sync this specific instance's line numbers with its textarea
		if (lineNumbersEl && textareaEl) {
			lineNumbersEl.scrollTop = textareaEl.scrollTop;
		}
	}

	async function copyToClipboard() {
		await navigator.clipboard.writeText(value);
	}

	function clearInput() {
		value = '';
		onInput?.('');
	}
</script>

<div class="code-editor-wrapper relative overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-sm">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-base-300/50 bg-base-300/30 px-4 py-2.5">
		<span class="text-xs font-medium text-base-content/50">
			{lineNumbers} line{lineNumbers !== 1 ? 's' : ''}
		</span>
		<div class="flex gap-1">
			<button
				type="button"
				class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
				onclick={copyToClipboard}
				title="Copy to clipboard"
				aria-label="Copy to clipboard"
			>
				<AppIcon name="copy" class="size-4" />
			</button>
			{#if !readonly}
				<button
					type="button"
					class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
					onclick={clearInput}
					title="Clear"
					aria-label="Clear editor"
				>
					<AppIcon name="rotate-ccw" class="size-4" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Editor Area -->
	<div class="flex max-h-[500px] min-h-[300px] overflow-hidden">
		<!-- Line Numbers -->
		<div
			bind:this={lineNumbersEl}
			class="line-numbers-container flex-shrink-0 overflow-hidden bg-base-300/20 py-3 text-right select-none"
		>
			{#each Array(lineNumbers) as _, i}
				<div
					class="px-3 font-mono text-xs leading-6 {errorLine === i + 1 ? 'text-error bg-error/10' : 'text-base-content/40'}"
				>
					{i + 1}
				</div>
			{/each}
		</div>

		<!-- Textarea -->
		<textarea
			bind:this={textareaEl}
			bind:value
			name="code"
			oninput={handleInput}
			onscroll={handleScroll}
			class="code-editor flex-1 resize-none bg-transparent p-3 font-mono text-sm leading-6 outline-none focus:outline-none focus:ring-0 ring-0 placeholder:text-base-content/30"
			{placeholder}
			{readonly}
			spellcheck="false"
		></textarea>
	</div>
</div>

<style>
	.line-numbers-container {
		min-width: 3rem;
	}

	.code-editor-wrapper {
		font-variant-ligatures: none;
	}
</style>

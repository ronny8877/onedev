<script lang="ts">
	import { readFileAsDataURL, formatFileSize } from '$lib/utils/image';

	interface Props {
		onImageLoad: (file: File, dataURL: string) => void;
		accept?: string;
		maxSizeMB?: number;
	}

	let { onImageLoad, accept = 'image/*', maxSizeMB = 50 }: Props = $props();

	let isDragging = $state(false);
	let error = $state('');
	let inputRef: HTMLInputElement;

	function validateAndLoad(file: File) {
		error = '';

		// Check if it's an image
		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			return;
		}

		// Check size
		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB > maxSizeMB) {
			error = `File too large. Maximum size is ${maxSizeMB}MB`;
			return;
		}

		// Load the image
		readFileAsDataURL(file).then((dataURL) => {
			onImageLoad(file, dataURL);
		});
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const file = e.dataTransfer?.files[0];
		if (file) validateAndLoad(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) validateAndLoad(file);
	}

	function openFilePicker() {
		inputRef?.click();
	}
</script>

<div
	class="relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
		{isDragging
		? 'border-primary bg-primary/10 scale-[1.02]'
		: 'border-base-content/20 hover:border-primary/50 hover:bg-base-200/50'}"
	role="button"
	tabindex="0"
	ondrop={handleDrop}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	onclick={openFilePicker}
	onkeydown={(e) => e.key === 'Enter' && openFilePicker()}
>
	<input
		bind:this={inputRef}
		type="file"
		{accept}
		class="hidden"
		onchange={handleFileSelect}
	/>

	<div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
		<div
			class="flex h-16 w-16 items-center justify-center rounded-2xl transition-colors
				{isDragging ? 'bg-primary/20 text-primary' : 'bg-base-200 text-base-content/50'}"
		>
			<svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
				></path>
			</svg>
		</div>

		<div>
			<p class="text-lg font-medium text-base-content">
				{isDragging ? 'Drop image here' : 'Drag & drop an image'}
			</p>
			<p class="mt-1 text-sm text-base-content/50">
				or click to browse • Max {maxSizeMB}MB
			</p>
		</div>
	</div>
</div>

{#if error}
	<div class="alert alert-error mt-4 rounded-xl">
		<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>{error}</span>
	</div>
{/if}

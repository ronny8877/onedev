<script lang="ts">
	import { CORNER_DOT_STYLES, CORNER_SQUARE_STYLES, DOT_STYLES, ERROR_LEVELS } from '$lib/utils/qr';
	import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from 'qr-code-styling';

	interface Props {
		size?: number;
		margin?: number;
		dotsType?: DotType;
		dotsColor?: string;
		backgroundColor?: string;
		cornersSquareType?: CornerSquareType;
		cornersDotType?: CornerDotType;
		errorCorrection?: ErrorCorrectionLevel;
		image?: string;
		imageSize?: number;
		hideBackgroundDots?: boolean;
	}

	let {
		size = $bindable(280),
		margin = $bindable(8),
		dotsType = $bindable<DotType>('rounded'),
		dotsColor = $bindable('#111827'),
		backgroundColor = $bindable('#ffffff'),
		cornersSquareType = $bindable<CornerSquareType>('extra-rounded'),
		cornersDotType = $bindable<CornerDotType>('dot'),
		errorCorrection = $bindable<ErrorCorrectionLevel>('M'),
		image = $bindable(''),
		imageSize = $bindable(0.35),
		hideBackgroundDots = $bindable(true)
	}: Props = $props();

	function handleLogo(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			image = String(reader.result || '');
			if (errorCorrection === 'L' || errorCorrection === 'M') errorCorrection = 'H';
		};
		reader.readAsDataURL(file);
	}

	function clearLogo() {
		image = '';
	}
</script>

<div class="space-y-4">
	<div class="grid gap-4 sm:grid-cols-2">
		<label class="form-control">
			<span class="label-text text-xs font-medium">Size ({size}px)</span>
			<input type="range" min="160" max="640" step="8" class="range range-primary range-sm mt-1" bind:value={size} />
		</label>
		<label class="form-control">
			<span class="label-text text-xs font-medium">Quiet zone ({margin}px)</span>
			<input type="range" min="0" max="40" step="2" class="range range-primary range-sm mt-1" bind:value={margin} />
		</label>
	</div>

	<div>
		<p class="mb-2 text-xs font-medium text-base-content/70">Dot style</p>
		<div class="flex flex-wrap gap-2">
			{#each DOT_STYLES as style}
				<button
					type="button"
					class="btn btn-xs {dotsType === style.id ? 'btn-primary' : 'btn-ghost border border-base-300'}"
					onclick={() => (dotsType = style.id)}
				>
					{style.label}
				</button>
			{/each}
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<div>
			<p class="mb-2 text-xs font-medium text-base-content/70">Corner square</p>
			<div class="flex flex-wrap gap-2">
				{#each CORNER_SQUARE_STYLES as style}
					<button
						type="button"
						class="btn btn-xs {cornersSquareType === style.id ? 'btn-primary' : 'btn-ghost border border-base-300'}"
						onclick={() => (cornersSquareType = style.id)}
					>
						{style.label}
					</button>
				{/each}
			</div>
		</div>
		<div>
			<p class="mb-2 text-xs font-medium text-base-content/70">Corner dot</p>
			<div class="flex flex-wrap gap-2">
				{#each CORNER_DOT_STYLES as style}
					<button
						type="button"
						class="btn btn-xs {cornersDotType === style.id ? 'btn-primary' : 'btn-ghost border border-base-300'}"
						onclick={() => (cornersDotType = style.id)}
					>
						{style.label}
					</button>
				{/each}
			</div>
		</div>
	</div>

	<div class="grid gap-4 sm:grid-cols-2">
		<label class="form-control">
			<span class="label-text text-xs font-medium">Foreground</span>
			<input type="color" class="h-10 w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 p-1" bind:value={dotsColor} />
		</label>
		<label class="form-control">
			<span class="label-text text-xs font-medium">Background</span>
			<input type="color" class="h-10 w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 p-1" bind:value={backgroundColor} />
		</label>
	</div>

	<label class="form-control">
		<span class="label-text text-xs font-medium">Error correction</span>
		<select class="select select-bordered select-sm mt-1" bind:value={errorCorrection}>
			{#each ERROR_LEVELS as level}
				<option value={level.id}>{level.label} — {level.hint}</option>
			{/each}
		</select>
	</label>

	<div class="rounded-xl border border-base-300 bg-base-200/60 p-3 space-y-3">
		<p class="text-xs font-medium text-base-content/70">Center logo</p>
		<div class="flex flex-wrap items-center gap-2">
			<input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm max-w-full" onchange={handleLogo} />
			{#if image}
				<button type="button" class="btn btn-ghost btn-xs" onclick={clearLogo}>Remove</button>
			{/if}
		</div>
		{#if image}
			<label class="form-control">
				<span class="label-text text-xs">Logo size ({Math.round(imageSize * 100)}%)</span>
				<input type="range" min="0.15" max="0.45" step="0.01" class="range range-primary range-sm mt-1" bind:value={imageSize} />
			</label>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={hideBackgroundDots} />
				Hide dots behind the logo
			</label>
		{/if}
	</div>
</div>

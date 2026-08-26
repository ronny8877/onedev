<script lang="ts">
	interface Props {
		value: string;
		options: { value: string; label: string }[];
		size?: 'xs' | 'sm' | 'md';
		onchange?: (value: string) => void;
	}

	let { value = $bindable(), options, size: _size = 'sm', onchange }: Props = $props();
</script>

<div class="join" role="group">
	{#each options as option}
		<button
			type="button"
			class="join-item btn h-8 min-h-8 rounded-lg border border-base-300 {value === option.value ? 'btn-primary' : 'btn-ghost'}"
			onclick={() => {
				value = option.value;
				onchange?.(option.value);
			}}
		>
			{option.label}
		</button>
	{/each}
</div>

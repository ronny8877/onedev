<script lang="ts" generics="T extends string | number">
	interface Option {
		value: T;
		label: string;
	}

	interface Props {
		value: T;
		options: Option[];
		size?: 'xs' | 'sm' | 'md';
		class?: string;
		label?: string;
	}

	let { value = $bindable(), options, size = 'sm', class: className = '', label }: Props = $props();

	let open = $state(false);
	const selected = $derived(options.find((option) => option.value === value) ?? options[0]);

	function pick(next: T) {
		value = next;
		open = false;
	}

	function close() {
		open = false;
	}
</script>

<div class="relative inline-flex items-center gap-2 {className}">
	{#if label}
		<span class="text-xs text-base-content/50 shrink-0">{label}</span>
	{/if}
	<button
		type="button"
		class="select-trigger select select-bordered select-{size} cursor-pointer text-left min-w-[7rem] w-full"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		{selected?.label ?? ''}
	</button>
	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-30" onclick={close} onkeydown={() => {}}></div>
		<ul
			class="absolute left-0 top-full z-40 mt-1 min-w-full overflow-hidden rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg"
			role="listbox"
		>
			{#each options as option}
				<li class="m-0 p-0">
					<button
						type="button"
						role="option"
						aria-selected={value === option.value}
						class="block w-full !rounded-none !border-0 !shadow-none px-3 py-2 text-left text-sm {value === option.value
							? 'bg-base-200 font-semibold text-primary'
							: 'bg-transparent text-base-content hover:bg-base-200'}"
						onclick={() => pick(option.value)}
					>
						{option.label}
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<script lang="ts">
	import { toast, type ToastMessage } from '$lib/utils/toast';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	let toasts = $state<ToastMessage[]>([]);

	$effect(() => {
		const unsubscribe = toast.subscribe(value => {
			toasts = value;
		});
		return unsubscribe;
	});

	function getIcon(type: string): string {
		switch (type) {
			case 'success': return '✓';
			case 'error': return '✕';
			case 'warning': return '⚠';
			case 'info': return 'ℹ';
			default: return '';
		}
	}

	function getAlertClass(type: string): string {
		switch (type) {
			case 'success': return 'alert-success';
			case 'error': return 'alert-error';
			case 'warning': return 'alert-warning';
			case 'info': return 'alert-info';
			default: return '';
		}
	}
</script>

<div class="toast-container">
	{#each toasts as t (t.id)}
		<div
			class="alert {getAlertClass(t.type)} shadow-lg"
			in:fly={{ y: 50, duration: 200 }}
			out:fade={{ duration: 150 }}
			animate:flip={{ duration: 200 }}
		>
			<span class="text-lg">{getIcon(t.type)}</span>
			<span class="text-sm font-medium">{t.message}</span>
			<button class="btn btn-ghost btn-xs btn-circle" onclick={() => toast.remove(t.id)}>✕</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 24rem;
		pointer-events: none;
	}

	.toast-container > :global(*) {
		pointer-events: auto;
	}

	.alert {
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		min-width: 16rem;
	}
</style>

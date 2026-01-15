// Toast store and utility
import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
	id: string;
	type: ToastType;
	message: string;
	duration: number;
}

function createToastStore() {
	const { subscribe, update } = writable<ToastMessage[]>([]);

	function addToast(type: ToastType, message: string, duration = 3000) {
		const id = crypto.randomUUID();
		const toast: ToastMessage = { id, type, message, duration };

		update(toasts => [...toasts, toast]);

		// Auto-remove after duration
		setTimeout(() => {
			removeToast(id);
		}, duration);

		return id;
	}

	function removeToast(id: string) {
		update(toasts => toasts.filter(t => t.id !== id));
	}

	return {
		subscribe,
		success: (message: string, duration?: number) => addToast('success', message, duration),
		error: (message: string, duration?: number) => addToast('error', message, duration),
		info: (message: string, duration?: number) => addToast('info', message, duration),
		warning: (message: string, duration?: number) => addToast('warning', message, duration),
		remove: removeToast
	};
}

export const toast = createToastStore();

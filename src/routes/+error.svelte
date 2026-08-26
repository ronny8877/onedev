<script lang="ts">
	import { page } from '$app/stores';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
</script>

<svelte:head>
	<title>404 — Page Not Found | OneDev Tools</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 animate-fade-in">
	<div class="text-8xl font-black text-primary/20 select-none mb-2">404</div>
	<h1 class="text-3xl font-bold text-base-content mb-3">Page Not Found</h1>
	<p class="text-base-content/60 max-w-md leading-relaxed mb-8">
		The tool or page at <code class="text-sm bg-base-200 px-2 py-0.5 rounded font-mono">{$page.url.pathname}</code> doesn't exist. It may have been moved or the URL may be incorrect.
	</p>

	<div class="flex flex-wrap gap-3 justify-center mb-10">
		<a href="/" class="btn btn-primary">← Browse All Tools</a>
		<a href="/contact" class="btn btn-ghost btn-outline">Report Broken Link</a>
	</div>

	<!-- Popular tools quick links -->
	<div class="max-w-lg w-full">
		<p class="text-sm text-base-content/50 uppercase tracking-widest font-semibold mb-4">Popular Tools</p>
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
			{#each [
				{ name: 'JSON Formatter', href: '/json/formatter', icon: 'braces' },
				{ name: 'Token Counter', href: '/ai/token-counter', icon: 'hash' },
				{ name: 'Base64 Encode', href: '/base64/encode-decode', icon: 'zap' },
				{ name: 'Hash Generator', href: '/hash/generator', icon: 'lock-keyhole' },
				{ name: 'Regex Tester', href: '/regex/tester', icon: 'regex' },
				{ name: 'CSS Gradient', href: '/css/gradient', icon: 'palette' },
			] as tool}
				<a href={tool.href} class="btn btn-ghost btn-sm border border-base-300 justify-start gap-2 font-normal">
					<AppIcon name={tool.icon} size={16} />
					<span class="text-sm">{tool.name}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	const jsonTools = [
		{
			name: 'JSON Formatter',
			description: 'Prettify or minify JSON with syntax highlighting',
			href: '/json/formatter',
			icon: '{ }'
		},
		{
			name: 'JSON Validator',
			description: 'Check if your JSON is valid with detailed errors',
			href: '/json/validator',
			icon: '✓'
		},
		{
			name: 'JSON Diff',
			description: 'Compare two JSON objects and find differences',
			href: '/json/diff',
			icon: '⇄'
		},
		{
			name: 'JSON → Table',
			description: 'Convert JSON arrays to tables and export as CSV',
			href: '/json/table',
			icon: '▤'
		},
		{
			name: 'JSON Visualizer',
			description: 'Explore JSON with an interactive tree view',
			href: '/json/visualizer',
			icon: '🌳'
		},
		{
			name: 'Type Generator',
			description: 'Generate TypeScript or Go types from JSON',
			href: '/json/type-generator',
			icon: '⟨T⟩'
		},
		{
			name: 'Path Tester',
			description: 'Test JSONPath expressions on your data',
			href: '/json/path-tester',
			icon: '🔍'
		}
	];

	const base64Tools = [
		{
			name: 'Encode / Decode',
			description: 'Auto-detect input and convert. UTF-8 safe.',
			href: '/base64/encode-decode',
			icon: '⚡'
		},
		{
			name: 'File Encoder',
			description: 'Encode files to Base64. Client-side only.',
			href: '/base64/file-encoder',
			icon: '📁'
		},
		{
			name: 'Image Preview',
			description: 'Paste Base64 and see the image.',
			href: '/base64/image-preview',
			icon: '🖼️'
		},
		{
			name: 'URL-safe Converter',
			description: 'Standard ↔ URL-safe Base64 conversion.',
			href: '/base64/url-safe',
			icon: '🔗'
		},
		{
			name: 'Validator',
			description: 'Check if Base64 is valid with explanations.',
			href: '/base64/validator',
			icon: '✓'
		},
		{
			name: 'Splitter',
			description: 'Split long Base64 into chunks.',
			href: '/base64/splitter',
			icon: '✂️'
		},
		{
			name: 'Hex / Binary',
			description: 'Convert Base64 to hex or binary.',
			href: '/base64/hex-binary',
			icon: '🔢'
		}
	];
</script>

<svelte:head>
	<title>OneDev Tools - Free Developer Tools</title>
	<meta
		name="description"
		content="Free, fast, and privacy-focused developer tools. JSON formatter, validator, diff checker, and more. No sign-up required."
	/>
	<meta property="og:title" content="OneDev Tools - Free Developer Tools" />
	<meta
		property="og:description"
		content="Free, fast, and privacy-focused developer tools. JSON formatter, validator, diff checker, and more."
	/>
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Hero Section -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold tracking-tight text-base-content lg:text-5xl">
			<span class="text-primary">One</span>Dev Tools
		</h1>
		<p class="text-lg text-base-content/70 leading-relaxed">
			Free, fast, and privacy-focused developer tools.
			<br />
			No sign-up required. Everything runs in your browser.
		</p>
	</div>

	<!-- Features -->
	<div class="mb-12 flex flex-wrap justify-center gap-4">
		<div class="flex items-center gap-2">
			<div class="badge badge-success gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					></path>
				</svg>
				100% Free
			</div>
		</div>
		<div class="flex items-center gap-2">
			<div class="badge badge-info gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					></path>
				</svg>
				Privacy First
			</div>
		</div>
		<div class="flex items-center gap-2">
			<div class="badge badge-warning gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					></path>
				</svg>
				Lightning Fast
			</div>
		</div>
	</div>

	<!-- JSON Tools Section -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-3 text-xl font-bold">
			<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm text-primary">
				{"{"}
			</span>
			JSON Tools
		</h2>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each jsonTools as tool}
				<a
					href={tool.href}
					class="card bg-base-200 border border-base-300/50 transition-all duration-200 hover:-translate-y-1 hover:bg-base-200/80 hover:shadow-lg hover:border-primary/20"
				>
					<div class="card-body p-5">
						<div class="mb-2 text-2xl">{tool.icon}</div>
						<h3 class="card-title text-base font-semibold">{tool.name}</h3>
						<p class="text-sm text-base-content/60 leading-relaxed">{tool.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Base64 Tools Section -->
	<section class="mb-12">
		<h2 class="mb-6 flex items-center gap-3 text-xl font-bold">
			<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-lg">
				⚡
			</span>
			Base64 Tools
		</h2>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each base64Tools as tool}
				<a
					href={tool.href}
					class="card bg-base-200 border border-base-300/50 transition-all duration-200 hover:-translate-y-1 hover:bg-base-200/80 hover:shadow-lg hover:border-warning/20"
				>
					<div class="card-body p-5">
						<div class="mb-2 text-2xl">{tool.icon}</div>
						<h3 class="card-title text-base font-semibold">{tool.name}</h3>
						<p class="text-sm text-base-content/60 leading-relaxed">{tool.description}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Footer -->
	<footer class="mt-16 border-t border-base-300/50 py-8 text-center text-sm text-base-content/50">
		<p>Built with Svelte, DaisyUI, and ❤️</p>
		<p class="mt-2">All processing happens locally in your browser. Your data never leaves your device.</p>
	</footer>
</div>

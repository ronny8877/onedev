<script lang="ts">
	import { BASE_URL } from '$lib/config/tools';
</script>

<svelte:head>
	<title>About OneDev Tools — Free Developer Utilities Built for Privacy</title>
	<meta
		name="description"
		content="OneDev Tools is a free collection of 160+ developer utilities built by developers, for developers. No sign-up, no data collection — everything runs locally in your browser."
	/>
	<link rel="canonical" href="{BASE_URL}/about" />
	<meta property="og:title" content="About OneDev Tools" />
	<meta property="og:description" content="Free developer tools built for privacy. 160+ utilities, no sign-up required." />
	<meta property="og:url" content="{BASE_URL}/about" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 animate-fade-in">

	<!-- Header -->
	<div class="mb-10">
		<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
			About Us
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-base-content mb-4">
			Built by Developers, for Developers
		</h1>
		<p class="text-lg text-base-content/70 leading-relaxed">
			OneDev Tools is a free, open collection of developer utilities — JSON formatters, token counters, hash generators, regex testers, and 150+ more tools — designed around one simple principle: <strong class="text-base-content">your data never leaves your device.</strong>
		</p>
	</div>

	<div class="divider"></div>

	<!-- Our Story -->
	<section class="mb-10">
		<h2 class="text-2xl font-bold text-base-content mb-4">Why We Built This</h2>
		<div class="prose prose-base max-w-none text-base-content/80">
			<p>
				Most online developer tools quietly upload your data to a server, run analytics on your usage, or gate basic features behind a login. When you paste an API key into a Base64 decoder, you probably don't expect it to be logged — but with many tools, it is.
			</p>
			<p>
				OneDev Tools was started in 2024 out of frustration with exactly this. We wanted a single reliable resource for the everyday utilities developers actually need — JSON formatting, token estimation, hash generation, regex testing — without the privacy tradeoffs.
			</p>
			<p>
				Every tool on this site runs entirely in your browser. No data is sent to our servers. No accounts required. No paywalls.
			</p>
		</div>
	</section>

	<!-- What We Cover -->
	<section class="mb-10">
		<h2 class="text-2xl font-bold text-base-content mb-6">What's Inside</h2>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each [
				{ icon: '🤖', title: 'AI & LLM Utilities', desc: 'Token counters, cost estimators, context window planners, and embedding calculators for GPT-4o, Claude, Gemini, and more.' },
				{ icon: '{ }', title: 'JSON Tools', desc: 'Format, validate, diff, convert, and visually explore JSON structures with our suite of 8 JSON utilities.' },
				{ icon: '🔒', title: 'Security Tools', desc: 'CSP generators, CORS builders, password testers, JWT decoders, hash generators, and security header references.' },
				{ icon: '🔀', title: 'Git Tools', desc: 'Gitignore generators, commit formatters, branch name builders, diff viewers, and README generators.' },
				{ icon: '🎨', title: 'CSS Generators', desc: 'Visual builders for gradients, box shadows, animations, flexbox, grid, and CSS layout utilities.' },
				{ icon: '🔄', title: 'Converters', desc: 'Unit converters for CSS, length, data size, time, color, typography, number base, and screen resolution.' },
				{ icon: '📝', title: 'Text Tools', desc: 'Case converters, diff checkers, regex testers, word counters, line sorters, and lorem ipsum generators.' },
				{ icon: '🖼️', title: 'Image Tools', desc: 'Browser-side image compression, resizing, cropping, format conversion, and EXIF metadata viewer.' },
				{ icon: '▦', title: 'QR & Barcode', desc: 'Generate customizable QR codes with logos and styles, scan QR codes, create WiFi and vCard codes, and generate or read barcodes.' }
			] as cat}
				<div class="card bg-base-200 border border-base-300/50 p-4">
					<div class="text-2xl mb-2">{cat.icon}</div>
					<h3 class="font-semibold text-base-content mb-1">{cat.title}</h3>
					<p class="text-sm text-base-content/60 leading-relaxed">{cat.desc}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Privacy Commitment -->
	<section class="mb-10 rounded-xl bg-success/5 border border-success/20 p-6">
		<h2 class="text-xl font-bold text-base-content mb-3 flex items-center gap-2">
			<span class="text-success">🔐</span> Our Privacy Commitment
		</h2>
		<ul class="space-y-2 text-base-content/80 text-sm leading-relaxed">
			<li class="flex items-start gap-2"><span class="text-success mt-0.5">✓</span> All tool processing happens locally in your browser — nothing is sent to a server.</li>
			<li class="flex items-start gap-2"><span class="text-success mt-0.5">✓</span> We do not store, log, or analyze any text you paste into any tool.</li>
			<li class="flex items-start gap-2"><span class="text-success mt-0.5">✓</span> No account creation required. We don't collect email addresses.</li>
			<li class="flex items-start gap-2"><span class="text-success mt-0.5">✓</span> See our <a href="/privacy" class="text-primary font-medium hover:underline">Privacy Policy</a> for details on analytics and third-party scripts.</li>
		</ul>
	</section>

	<!-- Technology -->
	<section class="mb-10">
		<h2 class="text-2xl font-bold text-base-content mb-4">How It's Built</h2>
		<p class="text-base-content/70 text-sm leading-relaxed mb-4">
			OneDev Tools is built with SvelteKit and deployed on Cloudflare's edge network for fast global access. The UI is styled with DaisyUI and Tailwind CSS. All tool logic runs client-side using standard browser APIs and JavaScript — no backend servers process your data.
		</p>
		<div class="flex flex-wrap gap-2">
			{#each ['SvelteKit', 'TypeScript', 'Cloudflare Workers', 'DaisyUI', 'Tailwind CSS', 'Web Crypto API'] as tech}
				<span class="badge badge-ghost border border-base-content/20 text-xs">{tech}</span>
			{/each}
		</div>
	</section>

	<!-- Accuracy & Updates -->
	<section class="mb-10">
		<h2 class="text-2xl font-bold text-base-content mb-4">Accuracy & Updates</h2>
		<p class="text-base-content/70 text-sm leading-relaxed">
			We maintain accuracy across all tools through regular reviews, particularly for data that changes frequently — such as AI model pricing. The AI model pricing data is updated at minimum monthly as providers update their APIs. If you notice outdated information or a bug, please <a href="/contact" class="text-primary font-medium hover:underline">contact us</a> and we'll correct it promptly.
		</p>
	</section>

	<div class="divider"></div>

	<!-- Footer links -->
	<div class="flex flex-wrap gap-4 text-sm text-base-content/60">
		<a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a>
		<a href="/contact" class="hover:text-primary transition-colors">Contact</a>
		<a href="/editorial-policy" class="hover:text-primary transition-colors">Editorial Policy</a>
		<a href="/" class="hover:text-primary transition-colors">← Back to Tools</a>
	</div>
</div>

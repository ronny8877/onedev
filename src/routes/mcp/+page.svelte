<script lang="ts">
	import { resolve } from '$app/paths';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { SITE_ORIGIN } from '$lib/config/indexing';

	const endpoint = 'https://mcp.onedev.tools/mcp';

	const toolGroups = [
		{
			icon: 'braces',
			title: 'JSON',
			description:
				'Format, minify, validate, generate types, diff documents, and query JSON paths.',
			tools: ['json_transform', 'json_diff', 'json_query']
		},
		{
			icon: 'binary',
			title: 'Encoding',
			description: 'Encode, decode, validate, and inspect Base64, image data URLs, and URL values.',
			tools: ['base64_transform', 'url_transform']
		},
		{
			icon: 'qr-code',
			title: 'QR & images',
			description:
				'Turn text into QR codes and receive SVG or Base64 image data from an assistant.',
			tools: ['qr_code']
		},
		{
			icon: 'lock-keyhole',
			title: 'Security',
			description: 'Generate hashes and HMACs, decode JWTs, and verify HMAC-signed JWTs.',
			tools: ['hash_text', 'hmac_generate', 'jwt_decode', 'jwt_verify_hmac']
		},
		{
			icon: 'fingerprint-pattern',
			title: 'Identifiers',
			description:
				'Generate batches of UUID v4, UUID v7, NanoID, and ULID values, or validate UUIDs.',
			tools: ['generate_ids', 'uuid_validate']
		},
		{
			icon: 'table',
			title: 'Data transforms',
			description:
				'Convert CSV to JSON, Markdown, or SQL; convert JSON to CSV; and transform YAML.',
			tools: ['tabular_transform', 'yaml_transform']
		},
		{
			icon: 'clock',
			title: 'Time & scheduling',
			description: 'Explain cron expressions, list upcoming runs, and convert common date formats.',
			tools: ['cron_inspect', 'time_convert']
		}
	];

	const config = `{
  "mcpServers": {
    "onedev": {
      "type": "http",
      "url": "${endpoint}"
    }
  }
}`;

	const exampleCall = `{
  "name": "json_transform",
  "arguments": {
    "operation": "minify",
    "input": "{\\"name\\": \\"test\\", \\"active\\": true}"
  }
}`;

	const exampleResult = `{
  "operation": "minify",
  "output": "{\\"name\\":\\"test\\",\\"active\\":true}"
}`;
</script>

<svelte:head>
	<title>OneDev MCP Server — Developer Tools for AI Assistants</title>
	<meta
		name="description"
		content="Connect the OneDev Tools MCP server to ChatGPT, Codex, Claude, or another compatible client. Use JSON, security, encoding, data, and time tools in your workflow."
	/>
	<meta name="author" content="OneDev Tools" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="{SITE_ORIGIN}/mcp" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="OneDev Tools" />
	<meta property="og:title" content="OneDev MCP Server" />
	<meta
		property="og:description"
		content="Use OneDev developer tools directly from an MCP-compatible AI assistant."
	/>
	<meta property="og:url" content="{SITE_ORIGIN}/mcp" />
</svelte:head>

<div class="animate-fade-in mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
	<section class="mb-12 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-10">
		<div class="max-w-3xl">
			<div class="mb-5 flex flex-wrap items-center gap-3">
				<span class="badge badge-outline badge-primary">Model Context Protocol</span>
				<span class="text-sm text-base-content/50">16 focused tools</span>
			</div>
			<h1 class="text-4xl font-bold tracking-tight text-base-content sm:text-5xl">
				OneDev Tools, in your assistant.
			</h1>
			<p class="mt-5 max-w-2xl text-lg leading-relaxed text-base-content/70">
				A hosted MCP server for practical developer utilities. Connect once, then ask your
				compatible AI assistant to transform data, inspect tokens, generate identifiers, and handle
				everyday engineering work.
			</p>
			<div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
				<div
					class="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3"
				>
					<AppIcon name="link" size={17} class="shrink-0 text-primary" />
					<code class="min-w-0 truncate text-sm text-base-content">{endpoint}</code>
				</div>
				<a href="#connect" class="btn btn-primary">Connect OneDev</a>
			</div>
		</div>
	</section>

	<section class="mb-14">
		<div class="mb-7">
			<p class="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">
				What it can do
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
				One server. Everyday tools.
			</h2>
			<p class="mt-2 max-w-2xl text-base-content/60">
				The hosted server exposes the same focused utilities as the website, ready to call from an
				MCP-compatible client.
			</p>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each toolGroups as group (group.title)}
				<article class="card border border-base-300 bg-base-200 p-6 shadow-sm">
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"
					>
						<AppIcon name={group.icon} size={20} />
					</div>
					<h3 class="text-lg font-semibold text-base-content">{group.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-base-content/60">{group.description}</p>
					<div class="mt-4 flex flex-wrap gap-1.5">
						{#each group.tools as tool (tool)}
							<code class="rounded bg-base-300 px-2 py-1 text-xs text-base-content/70">{tool}</code>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section id="connect" class="mb-14 scroll-mt-24">
		<div class="mb-7">
			<p class="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">Install</p>
			<h2 class="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
				Connect in a minute.
			</h2>
			<p class="mt-2 max-w-2xl text-base-content/60">
				Use the remote endpoint in any client that supports Streamable HTTP MCP servers. No API key
				or OAuth setup is required.
			</p>
		</div>

		<div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
			<article class="card border border-base-300 bg-base-200 p-6 shadow-sm">
				<div class="mb-4 flex items-center gap-3">
					<span
						class="flex h-9 w-9 items-center justify-center rounded-lg bg-base-300 text-primary"
					>
						<AppIcon name="bot" size={18} />
					</span>
					<h3 class="text-lg font-semibold text-base-content">Remote server URL</h3>
				</div>
				<p class="text-sm leading-relaxed text-base-content/60">
					In ChatGPT, Codex, Claude, or another MCP client, choose the option to add a remote server
					and paste this URL:
				</p>
				<code
					class="mt-5 block overflow-x-auto rounded-xl bg-base-300 p-4 text-sm text-base-content"
					>{endpoint}</code
				>
				<p class="mt-4 text-xs leading-relaxed text-base-content/50">
					If your client uses a JSON configuration file, use the example on the right.
				</p>
			</article>

			<article class="card border border-base-300 bg-base-200 p-0 shadow-sm">
				<div class="p-6 pb-0">
					<h3 class="text-lg font-semibold text-base-content">Example MCP configuration</h3>
					<p class="mt-2 text-sm text-base-content/60">
						Add this under <code>mcpServers</code> when your client supports JSON configuration.
					</p>
				</div>
				<pre
					class="mt-5 overflow-x-auto bg-base-300 p-6 text-sm leading-relaxed text-base-content"><code
						>{config}</code
					></pre>
			</article>
		</div>
	</section>

	<section class="mb-14">
		<div class="mb-7">
			<p class="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">Example</p>
			<h2 class="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
				Minify JSON with one tool call.
			</h2>
			<p class="mt-2 max-w-2xl text-base-content/60">
				The same server can handle the JSON example below from an assistant workflow.
			</p>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<div>
				<p class="mb-2 text-sm font-semibold text-base-content/70">Request</p>
				<pre
					class="overflow-x-auto rounded-xl bg-neutral p-5 text-sm leading-relaxed text-neutral-content"><code
						>{exampleCall}</code
					></pre>
			</div>
			<div>
				<p class="mb-2 text-sm font-semibold text-base-content/70">Result</p>
				<pre
					class="overflow-x-auto rounded-xl bg-neutral p-5 text-sm leading-relaxed text-neutral-content"><code
						>{exampleResult}</code
					></pre>
			</div>
		</div>
	</section>

	<section class="mb-14">
		<div class="mb-7">
			<p class="mb-2 text-xs font-semibold tracking-[0.16em] text-primary uppercase">QR output</p>
			<h2 class="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
				Return a QR image as Base64.
			</h2>
			<p class="mt-2 max-w-2xl text-base-content/60">
				Send any short text, URL, or structured QR payload and ask for a scalable SVG or a
				ready-to-embed Base64 data URL.
			</p>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<div>
				<p class="mb-2 text-sm font-semibold text-base-content/70">Request</p>
				<pre
					class="overflow-x-auto rounded-xl bg-neutral p-5 text-sm leading-relaxed text-neutral-content"><code
						>{`{
  "name": "qr_code",
  "arguments": {
    "input": "https://onedev.tools",
    "format": "data_url"
  }
}`}</code
					></pre>
			</div>
			<div>
				<p class="mb-2 text-sm font-semibold text-base-content/70">Result</p>
				<pre
					class="overflow-x-auto rounded-xl bg-neutral p-5 text-sm leading-relaxed text-neutral-content"><code
						>{`{
  "format": "data_url",
  "mimeType": "image/svg+xml",
  "base64": "PHN2ZyB4bWxucz0i...",
  "dataUrl": "data:image/svg+xml;base64,PHN2Zy..."
}`}</code
					></pre>
			</div>
		</div>
	</section>

	<section class="mb-12 grid gap-4 lg:grid-cols-2">
		<article class="rounded-2xl border border-warning/20 bg-warning/5 p-6">
			<div class="mb-3 flex items-center gap-2 text-warning">
				<AppIcon name="shield" size={18} />
				<h2 class="font-semibold text-base-content">A note about privacy</h2>
			</div>
			<p class="text-sm leading-relaxed text-base-content/70">
				Website tools run locally in your browser. MCP calls are different: your client sends the
				tool input to the hosted Worker. The Worker is stateless and does not persist tool inputs,
				outputs, or secrets, but Cloudflare may retain standard infrastructure metadata. Do not send
				sensitive data unless you accept that transmission.
			</p>
			<a
				href={resolve('/privacy')}
				class="mt-4 inline-block text-sm font-medium text-primary hover:underline"
				>Read the full privacy policy →</a
			>
		</article>

		<article class="rounded-2xl border border-base-300 bg-base-200 p-6">
			<div class="mb-3 flex items-center gap-2">
				<AppIcon name="info" size={18} class="text-primary" />
				<h2 class="font-semibold text-base-content">What you need</h2>
			</div>
			<ul class="space-y-2 text-sm leading-relaxed text-base-content/70">
				<li class="flex gap-2"><span class="text-primary">✓</span> An MCP-compatible AI client</li>
				<li class="flex gap-2"><span class="text-primary">✓</span> The remote endpoint above</li>
				<li class="flex gap-2">
					<span class="text-primary">✓</span> No account, API key, or OAuth setup
				</li>
			</ul>
		</article>
	</section>

	<div class="flex flex-wrap gap-4 border-t border-base-300 pt-6 text-sm text-base-content/60">
		<a href={resolve('/')} class="hover:text-primary">← Back to tools</a>
		<a href={resolve('/privacy')} class="hover:text-primary">Privacy Policy</a>
		<a href={resolve('/contact')} class="hover:text-primary">Contact</a>
	</div>
</div>

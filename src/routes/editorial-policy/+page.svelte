<script lang="ts">
	import { SITE_ORIGIN } from '$lib/config/indexing';
</script>

<svelte:head>
	<title>Editorial Policy — OneDev Tools</title>
	<meta
		name="description"
		content="OneDev Tools editorial policy. How we maintain accuracy, handle AI-assisted content, update pricing data, and ensure tool quality."
	/>
	<link rel="canonical" href="{SITE_ORIGIN}/editorial-policy" />
	<meta property="og:title" content="Editorial Policy — OneDev Tools" />
	<meta property="og:url" content="{SITE_ORIGIN}/editorial-policy" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 animate-fade-in">

	<div class="mb-8">
		<h1 class="text-4xl font-bold tracking-tight text-base-content mb-3">Editorial Policy</h1>
		<p class="text-sm text-base-content/50 mb-4">Last updated: August 17, 2026</p>
		<p class="text-base-content/70 leading-relaxed">
			This policy explains how OneDev Tools maintains the accuracy, quality, and integrity of the content and tools published on this site.
		</p>
	</div>

	<div class="prose prose-base max-w-none text-base-content/80 space-y-8">

		<section>
			<h2 class="text-xl font-bold text-base-content">1. Our Content Standards</h2>
			<p>
				Every tool, guide, and explanation published on OneDev Tools is evaluated against these standards before publication:
			</p>
			<ul class="space-y-2 text-sm list-none pl-0">
				{#each [
					['Accuracy', 'Tool logic must produce correct results consistent with the relevant specification (RFC, W3C standard, API documentation, etc.).'],
					['Practical Value', 'Content must address a real developer need. We do not publish tools or articles that exist solely to capture search traffic.'],
					['Educational Depth', 'Where relevant, we explain not just how to use a tool, but why the underlying concept matters and what common mistakes to avoid.'],
					['Up-to-Date Information', 'Time-sensitive content (like AI pricing, API specifications) is scheduled for regular review.'],
				] as [title, desc]}
					<li class="flex items-start gap-3 bg-base-200 rounded-xl px-4 py-3 not-prose">
						<span class="font-semibold text-base-content min-w-[120px]">{title}</span>
						<span class="text-base-content/70 text-sm">{desc}</span>
					</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">2. AI-Assisted Content Disclosure</h2>
			<div class="rounded-xl border border-warning/30 bg-warning/5 p-5 not-prose">
				<p class="font-semibold text-base-content mb-2">⚠️ Important Transparency Notice</p>
				<p class="text-sm text-base-content/80 leading-relaxed">
					Some descriptions, FAQs, use-case explanations, and educational content on this site were drafted with AI language model assistance (including models such as Claude and GPT-4). All AI-assisted content is reviewed and edited by a human developer before publication to verify technical accuracy and ensure it provides genuine value.
				</p>
				<p class="text-sm text-base-content/80 leading-relaxed mt-2">
					Tool logic itself — the algorithms, calculations, and processing code — is written by human developers and is not AI-generated. AI assistance is used only for written explanatory content, not for any functional tool behavior.
				</p>
			</div>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">3. Pricing & API Data Accuracy</h2>
			<p>
				The AI model pricing data displayed in our cost calculators, comparison tables, and context estimators is sourced directly from each provider's official pricing pages (OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, Mistral, Cohere, and Alibaba Cloud).
			</p>
			<p>
				This data is reviewed and updated <strong>at minimum monthly</strong>, or more frequently following major price changes announced by providers. Each update is timestamped within our source code, and the last-updated date is displayed directly on affected tool pages.
			</p>
			<p class="text-sm text-base-content/60">
				Despite our best efforts, pricing data may lag behind rapid changes. Always verify final pricing on the provider's official website before making financial decisions.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">4. Tool Accuracy Standards</h2>
			<p>
				Tool implementations are tested against authoritative references:
			</p>
			<ul class="list-disc list-inside space-y-1 text-sm">
				<li><strong>Tokenizers</strong> — Verified against official tokenizer libraries (OpenAI tiktoken, Anthropic reference implementations).</li>
				<li><strong>Hash generators</strong> — Results verified against known test vectors from NIST and RFC specifications.</li>
				<li><strong>JWT tools</strong> — Implemented per RFC 7519.</li>
				<li><strong>Cron expressions</strong> — Validated against standard POSIX cron and Quartz scheduler specifications.</li>
				<li><strong>CSS generators</strong> — Output tested against MDN specifications and browser compatibility data.</li>
				<li><strong>UUID generators</strong> — Implemented per RFC 4122 and RFC 9562 (UUID v7).</li>
			</ul>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">5. Update & Review Schedule</h2>
			<div class="overflow-x-auto not-prose">
				<table class="table table-sm table-zebra w-full text-sm">
					<thead>
						<tr>
							<th>Content Type</th>
							<th>Review Frequency</th>
						</tr>
					</thead>
					<tbody>
						<tr><td>AI model pricing data</td><td>Monthly minimum</td></tr>
						<tr><td>Tool algorithms &amp; logic</td><td>On specification change or bug report</td></tr>
						<tr><td>Educational articles &amp; guides</td><td>Quarterly</td></tr>
						<tr><td>FAQs and use-case content</td><td>On user feedback</td></tr>
						<tr><td>Security-related tools</td><td>On CVE or specification change</td></tr>
					</tbody>
				</table>
			</div>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">6. Corrections Policy</h2>
			<p>
				If you identify an error — factual, technical, or typographical — please <a href="/contact" class="text-primary hover:underline">contact us</a>. We investigate all reported inaccuracies and correct confirmed errors promptly, typically within 48 hours for tool logic errors and within 5 business days for editorial content.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">7. Advertising Independence</h2>
			<p>
				Advertising relationships have no influence on which tools we build, what content we publish, or how we evaluate or describe any technology or service. We do not accept sponsored content, paid reviews, or affiliate-driven tool recommendations.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">8. What we will not publish</h2>
			<p>
				We do not copy other sites' articles and republish them. We do not ship tools whose purpose is unauthorized access, document forgery, or tracking another person without consent. We do not publish adult or family-misleading content. Educational pages explain developer formats (JSON, hashes, JWTs, CSP) with original commentary. Where two tools share a UI pattern, the explanation is written for that algorithm or format, not copied as a doorway page.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">9. External Links & Citations</h2>
			<p>
				Where we reference external documentation, specifications, or research, we link to the primary source (official RFC, API documentation, academic paper). We do not cite secondary aggregator sites as primary sources. External links are reviewed periodically for link rot.
			</p>
		</section>

	</div>

	<div class="divider mt-10"></div>
	<div class="flex flex-wrap gap-4 text-sm text-base-content/60">
		<a href="/about" class="hover:text-primary transition-colors">About</a>
		<a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a>
		<a href="/contact" class="hover:text-primary transition-colors">Contact</a>
		<a href="/" class="hover:text-primary transition-colors">← Back to Tools</a>
	</div>
</div>

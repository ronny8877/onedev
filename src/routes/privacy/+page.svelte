<script lang="ts">
	import { BASE_URL } from '$lib/config/tools';
</script>

<svelte:head>
	<title>Privacy Policy — OneDev Tools</title>
	<meta
		name="description"
		content="OneDev Tools Privacy Policy. All tool processing happens in your browser. We do not collect or store the data you enter into any tool."
	/>
	<link rel="canonical" href="{BASE_URL}/privacy" />
	<meta property="og:title" content="Privacy Policy — OneDev Tools" />
	<meta property="og:url" content="{BASE_URL}/privacy" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 animate-fade-in">

	<div class="mb-8">
		<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
			Legal
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-base-content mb-3">Privacy Policy</h1>
		<p class="text-sm text-base-content/50">Last updated: August 16, 2026</p>
	</div>

	<div class="prose prose-base max-w-none text-base-content/80 space-y-8">

		<section>
			<h2 class="text-xl font-bold text-base-content">Summary</h2>
			<div class="rounded-xl bg-success/5 border border-success/20 p-5 not-prose">
				<ul class="space-y-2 text-sm text-base-content/80">
					<li class="flex items-start gap-2"><span class="text-success font-bold">✓</span> All tool processing runs in your browser. Your input data is never sent to our servers.</li>
					<li class="flex items-start gap-2"><span class="text-success font-bold">✓</span> We do not require accounts or collect personal information to use any tool.</li>
					<li class="flex items-start gap-2"><span class="text-success font-bold">✓</span> We may use anonymous analytics to understand which tools are most useful.</li>
				</ul>
			</div>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">1. Information We Do Not Collect</h2>
			<p>
				Every tool on OneDev Tools — JSON formatters, token counters, hash generators, regex testers, image compressors, and all others — processes your data entirely within your browser using client-side JavaScript. <strong>We do not transmit, store, or log any content you enter into any tool.</strong>
			</p>
			<p>
				This means that passwords you test in our Password Tester, API keys you paste into our Base64 encoder, JSON payloads you format, or text you analyze with our token counter are never seen by our servers.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">2. Information We May Collect</h2>
			<h3 class="text-base font-semibold text-base-content mt-4 mb-2">Anonymous Usage Analytics</h3>
			<p>
				We may collect anonymous, aggregated analytics data to understand which tools are most used and how we can improve the site. This data does not identify individual users and does not include any content you enter into tools. This may include: pages visited, time on site, and browser type.
			</p>
			<h3 class="text-base font-semibold text-base-content mt-4 mb-2">Standard Server Logs</h3>
			<p>
				Like all websites, our hosting provider (Cloudflare) may retain standard web server access logs, which can include your IP address, browser user-agent string, referring URL, and the pages you accessed. These logs are used for security and operational purposes and are governed by <a href="https://www.cloudflare.com/privacypolicy/" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare's Privacy Policy</a>.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">3. Advertising</h2>
			<p>
				OneDev Tools does not currently use Google AdSense. The site may still load third-party advertising scripts from other networks to help cover hosting costs. Those networks may use cookies or similar technologies.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">4. Cookies</h2>
			<p>
				OneDev Tools itself does not set first-party cookies for tracking or session management. Third-party advertising or analytics scripts, if present, may set their own cookies.
			</p>
			<p>
				Some tools use your browser's <code class="text-sm bg-base-200 px-1 rounded">localStorage</code> to save your preferences or recent inputs locally on your device. This data is stored only on your device and is never transmitted to us. You can clear it at any time by clearing your browser's local storage.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">5. Third-Party Links</h2>
			<p>
				Some pages on OneDev Tools may link to external websites or documentation (for example, links to API provider documentation or MDN Web Docs). We are not responsible for the privacy practices of these third-party sites.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">6. Children's Privacy</h2>
			<p>
				OneDev Tools is intended for developers and technical users. We do not knowingly collect any personal information from children under the age of 13. If you believe a child has provided personal information through our site, please contact us so we can remove it.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">7. Changes to This Policy</h2>
			<p>
				We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will update the "Last updated" date at the top of this page when we do. Continued use of the site after changes constitutes acceptance of the updated policy.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">8. Contact</h2>
			<p>
				If you have questions about this Privacy Policy or our data practices, please <a href="/contact" class="text-primary hover:underline">contact us</a>.
			</p>
		</section>

	</div>

	<div class="divider mt-10"></div>
	<div class="flex flex-wrap gap-4 text-sm text-base-content/60">
		<a href="/about" class="hover:text-primary transition-colors">About</a>
		<a href="/contact" class="hover:text-primary transition-colors">Contact</a>
		<a href="/editorial-policy" class="hover:text-primary transition-colors">Editorial Policy</a>
		<a href="/" class="hover:text-primary transition-colors">← Back to Tools</a>
	</div>
</div>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { SITE_ORIGIN } from '$lib/config/indexing';
</script>

<svelte:head>
	<title>Privacy Policy — OneDev Tools</title>
	<meta
		name="description"
		content="OneDev Tools Privacy Policy. All tool processing happens in your browser. We do not collect or store the data you enter into any tool."
	/>
	<link rel="canonical" href="{SITE_ORIGIN}/privacy" />
	<meta property="og:title" content="Privacy Policy — OneDev Tools" />
	<meta property="og:url" content="{SITE_ORIGIN}/privacy" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10 animate-fade-in">

	<div class="mb-8">
		<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
			Legal
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-base-content mb-3">Privacy Policy</h1>
		<p class="text-sm text-base-content/50">Last updated: August 17, 2026</p>
	</div>

	<div class="prose prose-base max-w-none text-base-content/80 space-y-8">

		<section>
			<h2 class="text-xl font-bold text-base-content">Summary</h2>
			<div class="rounded-xl bg-success/5 border border-success/20 p-5 not-prose">
				<ul class="space-y-2 text-sm text-base-content/80">
					<li class="flex items-start gap-2"><AppIcon name={'✓'} size={16} /> All tool processing runs in your browser. Your input data is never sent to our servers.</li>
					<li class="flex items-start gap-2"><AppIcon name={'✓'} size={16} /> We do not require accounts or collect personal information to use any tool.</li>
					<li class="flex items-start gap-2"><AppIcon name={'✓'} size={16} /> We use Google Analytics to see which pages are used. Tool input is never sent to analytics.</li>
					<li class="flex items-start gap-2"><AppIcon name={'✓'} size={16} /> We do not currently show ads. If Google ads are added later, third-party cookies will be disclosed here and in How Google uses data.</li>
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
			<h3 class="text-base font-semibold text-base-content mt-4 mb-2">Usage Analytics — Google Analytics</h3>
			<p>
				OneDev Tools uses Google Analytics (GA4) to understand which pages and tools people open, how they move through the site, and which links they click. This helps us decide what to improve. Analytics does <strong>not</strong> include the text, files, or other content you enter into any tool.
			</p>
			<p>
				Google Analytics may collect page URL, referrer, browser and device type, approximate location, and similar usage data. Google may set cookies such as <code class="text-sm bg-base-200 px-1 rounded">_ga</code> for this purpose. For details, see <a href="https://policies.google.com/privacy" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a> and <a href="https://tools.google.com/dlpage/gaoptout" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics opt-out</a>.
			</p>
			<h3 class="text-base font-semibold text-base-content mt-4 mb-2">Optional IP lookup (Network Info)</h3>
			<p>
				The Network Info tool can, if you click the button, ask a third-party IP echo service (<a href="https://ipwho.is/" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">ipwho.is</a>) for your public IP and an approximate country, region, city, and ISP. That request is made by your browser. We do not store the result. We do not use it for ads. Precise coordinates and postal codes are not shown. You can skip the button and still see connection type from the browser Network Information API, which stays on your device.
			</p>
			<h3 class="text-base font-semibold text-base-content mt-4 mb-2">Standard Server Logs</h3>
			<p>
				Like all websites, our hosting provider (Cloudflare) may retain standard web server access logs, which can include your IP address, browser user-agent string, referring URL, and the pages you accessed. These logs are used for security and operational purposes and are governed by <a href="https://www.cloudflare.com/privacypolicy/" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare's Privacy Policy</a>.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">3. Advertising</h2>
			<p>
				OneDev Tools does not currently display advertisements and does not load Google AdSense or other ad-network scripts. If we enable Google ads later, this policy will still apply, and we will update the "Last updated" date.
			</p>
			<p>
				When Google ads are shown, Google and other third parties may place and read cookies on your browser, or use web beacons, IP addresses, or similar identifiers as a result of ad serving. We do not pass names, email addresses, or the text you enter into tools to Google advertising systems. We do not use Google ads to target personalized ads based on health, finances, race, religion, sexual orientation, or other sensitive categories listed in Google's personalized advertising policy. This site is not directed at children under 13, and we will not use interest-based ads on child-directed content.
			</p>
			<p>
				To understand how Google uses data when you use sites or apps that partner with Google, read <a href="https://policies.google.com/technologies/partner-sites" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">How Google uses information from sites or apps that use our services</a>.
			</p>
			<p>
				If ads.txt is present on this domain, it lists who is authorized to sell advertising on onedev.tools. That file must stay accurate. We do not misstate site URLs or app IDs in ad requests.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">4. Cookies</h2>
			<p>
				OneDev Tools itself does not set first-party cookies for accounts or sessions. Google Analytics may set cookies to measure visits. If Google ads are enabled later, Google may also set advertising cookies as described in section 3. You can block analytics cookies in your browser or use Google's opt-out browser add-on.
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
				OneDev Tools is for software developers and other technical professionals. It is not directed at children under 13, and we do not knowingly collect personal information from children. The site is not a family or children's product. If you believe a child has provided personal information through our site, please contact us so we can remove it.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">7. Identifiers and Google</h2>
			<p>
				We do not send names, emails, or tool input to Google in a form Google could use as personally identifiable information. Analytics uses Google's standard measurement cookies. We do not merge that data with a user account, because we have no accounts.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">8. Changes to This Policy</h2>
			<p>
				We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will update the "Last updated" date at the top of this page when we do. Continued use of the site after changes constitutes acceptance of the updated policy.
			</p>
		</section>

		<section>
			<h2 class="text-xl font-bold text-base-content">9. Contact</h2>
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

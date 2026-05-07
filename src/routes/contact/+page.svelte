<script lang="ts">
	import { BASE_URL } from '$lib/config/tools';

	let name = $state('');
	let email = $state('');
	let subject = $state('general');
	let message = $state('');
	let submitted = $state(false);
	let submitting = $state(false);
	let error = $state('');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		error = '';

		// Build mailto link as the contact mechanism (client-side only, no server needed)
		const subjectLabel = {
			general: 'General Inquiry',
			bug: 'Bug Report',
			pricing: 'Pricing / Data Update',
			feature: 'Feature Request',
			other: 'Other'
		}[subject];

		const body = encodeURIComponent(
			`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
		);
		const mailtoUrl = `mailto:hello@onedev.tools?subject=${encodeURIComponent(`[OneDev Tools] ${subjectLabel}`)}&body=${body}`;
		window.location.href = mailtoUrl;

		// Optimistically mark submitted
		submitted = true;
		submitting = false;
	}
</script>

<svelte:head>
	<title>Contact — OneDev Tools</title>
	<meta
		name="description"
		content="Contact the OneDev Tools team. Report bugs, request features, ask about tool accuracy, or send general feedback."
	/>
	<link rel="canonical" href="{BASE_URL}/contact" />
	<meta property="og:title" content="Contact — OneDev Tools" />
	<meta property="og:url" content="{BASE_URL}/contact" />
	<meta property="og:type" content="website" />
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-10 animate-fade-in">

	<div class="mb-8">
		<div class="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-4">
			Get In Touch
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-base-content mb-3">Contact Us</h1>
		<p class="text-base-content/70 leading-relaxed">
			Found a bug? Have a feature idea? Noticed outdated AI pricing data? We'd love to hear from you.
		</p>
	</div>

	{#if submitted}
		<div class="alert alert-success shadow-sm">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
			<div>
				<p class="font-semibold">Your email client should open with a pre-filled message.</p>
				<p class="text-sm opacity-80">Alternatively, email us directly at <strong>hello@onedev.tools</strong></p>
			</div>
		</div>
	{:else}
		<form onsubmit={handleSubmit} class="card bg-base-200 border border-base-300/50 shadow-sm">
			<div class="card-body gap-5">

				<div class="grid sm:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label pb-1" for="contact-name">
							<span class="label-text font-medium">Your Name</span>
						</label>
						<input
							id="contact-name"
							type="text"
							bind:value={name}
							placeholder="Jane Smith"
							class="input input-bordered bg-base-100"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label pb-1" for="contact-email">
							<span class="label-text font-medium">Email Address</span>
						</label>
						<input
							id="contact-email"
							type="email"
							bind:value={email}
							placeholder="jane@example.com"
							class="input input-bordered bg-base-100"
							required
						/>
					</div>
				</div>

				<div class="form-control">
					<label class="label pb-1" for="contact-subject">
						<span class="label-text font-medium">Subject</span>
					</label>
					<select id="contact-subject" bind:value={subject} class="select select-bordered bg-base-100">
						<option value="general">General Inquiry</option>
						<option value="bug">Bug Report</option>
						<option value="pricing">Outdated Pricing / Data</option>
						<option value="feature">Feature Request</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div class="form-control">
					<label class="label pb-1" for="contact-message">
						<span class="label-text font-medium">Message</span>
					</label>
					<textarea
						id="contact-message"
						bind:value={message}
						placeholder="Describe your question or feedback in detail..."
						class="textarea textarea-bordered bg-base-100 h-36 resize-y"
						required
					></textarea>
				</div>

				{#if error}
					<div class="alert alert-error text-sm">{error}</div>
				{/if}

				<div class="card-actions justify-between items-center pt-1">
					<p class="text-xs text-base-content/50">
						Or email directly: <strong>hello@onedev.tools</strong>
					</p>
					<button type="submit" class="btn btn-primary" disabled={submitting}>
						{#if submitting}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						Send Message
					</button>
				</div>
			</div>
		</form>
	{/if}

	<!-- FAQ -->
	<div class="mt-12">
		<h2 class="text-xl font-bold text-base-content mb-5">Common Questions</h2>
		<div class="space-y-3">
			{#each [
				{
					q: 'How quickly do you respond?',
					a: 'We aim to respond to all inquiries within 2–3 business days. Bug reports that affect tool accuracy are prioritized.'
				},
				{
					q: 'How do I report outdated AI model pricing?',
					a: 'Select "Outdated Pricing / Data" in the subject above and include the model name and the correct price from the provider\'s official pricing page.'
				},
				{
					q: 'Can I request a new tool?',
					a: 'Yes! We actively review feature requests. Select "Feature Request" and describe the tool and your use case. Popular requests get built first.'
				},
				{
					q: 'I found a security issue. What do I do?',
					a: 'Please email hello@onedev.tools directly with the subject "Security Disclosure". All tools are client-side, so security issues are typically related to XSS or content injection.'
				}
			] as item}
				<div class="collapse collapse-plus border border-base-300 bg-base-200/50 rounded-xl">
					<input type="checkbox" />
					<div class="collapse-title font-medium text-base-content">{item.q}</div>
					<div class="collapse-content text-sm text-base-content/70 leading-relaxed">{item.a}</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="divider mt-10"></div>
	<div class="flex flex-wrap gap-4 text-sm text-base-content/60">
		<a href="/about" class="hover:text-primary transition-colors">About</a>
		<a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a>
		<a href="/editorial-policy" class="hover:text-primary transition-colors">Editorial Policy</a>
		<a href="/" class="hover:text-primary transition-colors">← Back to Tools</a>
	</div>
</div>

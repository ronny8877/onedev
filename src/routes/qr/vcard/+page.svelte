<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import QrPreview from '$lib/components/ui/QrPreview.svelte';
	import QrStyleControls from '$lib/components/ui/QrStyleControls.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { qrToolsContent } from '$lib/config/content/qr-tools-content';
	import { buildVCardPayload } from '$lib/utils/qr';
	import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from 'qr-code-styling';

	const content = qrToolsContent['vcard'];

	let firstName = $state('');
	let lastName = $state('');
	let org = $state('');
	let title = $state('');
	let phone = $state('');
	let email = $state('');
	let url = $state('');
	let street = $state('');
	let city = $state('');
	let region = $state('');
	let postal = $state('');
	let country = $state('');

	let size = $state(280);
	let margin = $state(10);
	let dotsType = $state<DotType>('classy-rounded');
	let dotsColor = $state('#1e3a8a');
	let backgroundColor = $state('#ffffff');
	let cornersSquareType = $state<CornerSquareType>('extra-rounded');
	let cornersDotType = $state<CornerDotType>('dot');
	let errorCorrection = $state<ErrorCorrectionLevel>('H');
	let image = $state('');
	let imageSize = $state(0.3);
	let hideBackgroundDots = $state(true);

	let payload = $derived(
		buildVCardPayload({ firstName, lastName, org, title, phone, email, url, street, city, region, postal, country })
	);

	function loadSample() {
		firstName = 'Ada';
		lastName = 'Lovelace';
		org = 'Analytical Engine';
		title = 'Mathematician';
		phone = '+44 20 7946 0958';
		email = 'ada@example.com';
		url = 'https://onedev.tools';
		city = 'London';
		country = 'UK';
	}

	function clearAll() {
		firstName = '';
		lastName = '';
		org = '';
		title = '';
		phone = '';
		email = '';
		url = '';
		street = '';
		city = '';
		region = '';
		postal = '';
		country = '';
		image = '';
	}
</script>

<ToolWrapper lastUpdated="2026-08-17">
	<div class="space-y-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<div class="grid gap-6 lg:grid-cols-[1fr_auto]">
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4 space-y-3">
						<h3 class="font-bold">Contact</h3>
						<div class="grid gap-3 sm:grid-cols-2">
							<input class="input input-bordered" placeholder="First name" bind:value={firstName} />
							<input class="input input-bordered" placeholder="Last name" bind:value={lastName} />
							<input class="input input-bordered" placeholder="Company" bind:value={org} />
							<input class="input input-bordered" placeholder="Job title" bind:value={title} />
							<input class="input input-bordered" placeholder="Phone" bind:value={phone} />
							<input class="input input-bordered" placeholder="Email" bind:value={email} />
						</div>
						<input class="input input-bordered w-full" placeholder="Website" bind:value={url} />
						<input class="input input-bordered w-full" placeholder="Street" bind:value={street} />
						<div class="grid gap-3 sm:grid-cols-2">
							<input class="input input-bordered" placeholder="City" bind:value={city} />
							<input class="input input-bordered" placeholder="Region / state" bind:value={region} />
							<input class="input input-bordered" placeholder="Postal code" bind:value={postal} />
							<input class="input input-bordered" placeholder="Country" bind:value={country} />
						</div>
						{#if payload}
							<div class="flex items-start justify-between gap-2 rounded-lg bg-base-300/50 p-2">
								<pre class="text-xs whitespace-pre-wrap break-all text-base-content/70">{payload}</pre>
								<CopyButton text={payload} size="xs" label="Copy" />
							</div>
						{/if}
					</div>
				</div>

				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<h3 class="font-bold mb-3">Style</h3>
						<QrStyleControls
							bind:size
							bind:margin
							bind:dotsType
							bind:dotsColor
							bind:backgroundColor
							bind:cornersSquareType
							bind:cornersDotType
							bind:errorCorrection
							bind:image
							bind:imageSize
							bind:hideBackgroundDots
						/>
					</div>
				</div>
			</div>

			<div class="lg:sticky lg:top-20 h-fit">
				<div class="card bg-base-100 border border-base-300 rounded-2xl">
					<div class="card-body p-4">
						<QrPreview
							data={payload}
							{size}
							{margin}
							{dotsType}
							{dotsColor}
							{backgroundColor}
							{cornersSquareType}
							{cornersDotType}
							{errorCorrection}
							{image}
							{imageSize}
							{hideBackgroundDots}
							filename="vcard-qr"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

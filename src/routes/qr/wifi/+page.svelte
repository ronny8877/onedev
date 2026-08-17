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
	import { buildWifiPayload, type WifiEncryption } from '$lib/utils/qr';
	import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from 'qr-code-styling';

	const content = qrToolsContent['wifi'];

	let ssid = $state('');
	let password = $state('');
	let encryption = $state<WifiEncryption>('WPA');
	let hidden = $state(false);

	let size = $state(280);
	let margin = $state(10);
	let dotsType = $state<DotType>('rounded');
	let dotsColor = $state('#0f766e');
	let backgroundColor = $state('#ffffff');
	let cornersSquareType = $state<CornerSquareType>('extra-rounded');
	let cornersDotType = $state<CornerDotType>('dot');
	let errorCorrection = $state<ErrorCorrectionLevel>('H');
	let image = $state('');
	let imageSize = $state(0.3);
	let hideBackgroundDots = $state(true);

	let payload = $derived(buildWifiPayload({ ssid, password, encryption, hidden }));

	function loadSample() {
		ssid = 'OneDev Guest';
		password = 'tools-are-local';
		encryption = 'WPA';
		hidden = false;
	}

	function clearAll() {
		ssid = '';
		password = '';
		hidden = false;
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
						<h3 class="font-bold">Network</h3>
						<input class="input input-bordered" placeholder="Network name (SSID)" bind:value={ssid} />
						<select class="select select-bordered" bind:value={encryption}>
							<option value="WPA">WPA / WPA2 / WPA3</option>
							<option value="WEP">WEP</option>
							<option value="nopass">Open (no password)</option>
						</select>
						{#if encryption !== 'nopass'}
							<input class="input input-bordered" type="password" placeholder="Password" bind:value={password} />
						{/if}
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={hidden} />
							Hidden network
						</label>
						{#if payload}
							<div class="flex items-center justify-between gap-2 rounded-lg bg-base-300/50 p-2">
								<code class="text-xs break-all text-base-content/70">{payload}</code>
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
							filename="wifi-qr"
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

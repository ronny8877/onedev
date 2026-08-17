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
	import {
		buildEmailPayload,
		buildPhonePayload,
		buildSmsPayload,
		buildVCardPayload,
		buildWifiPayload,
		normalizeUrl,
		type QrContentType
	} from '$lib/utils/qr';
	import type { CornerDotType, CornerSquareType, DotType, ErrorCorrectionLevel } from 'qr-code-styling';

	const content = qrToolsContent['generator'];

	const types: { id: QrContentType; label: string }[] = [
		{ id: 'text', label: 'Text' },
		{ id: 'url', label: 'URL' },
		{ id: 'email', label: 'Email' },
		{ id: 'phone', label: 'Phone' },
		{ id: 'sms', label: 'SMS' },
		{ id: 'wifi', label: 'WiFi' },
		{ id: 'vcard', label: 'vCard' }
	];

	let type = $state<QrContentType>('url');
	let text = $state('https://onedev.tools');
	let emailTo = $state('');
	let emailSubject = $state('');
	let emailBody = $state('');
	let phone = $state('');
	let smsPhone = $state('');
	let smsMessage = $state('');
	let wifiSsid = $state('');
	let wifiPassword = $state('');
	let wifiEncryption = $state<'WPA' | 'WEP' | 'nopass'>('WPA');
	let wifiHidden = $state(false);
	let firstName = $state('');
	let lastName = $state('');
	let org = $state('');
	let title = $state('');
	let vPhone = $state('');
	let vEmail = $state('');
	let vUrl = $state('');

	let size = $state(280);
	let margin = $state(8);
	let dotsType = $state<DotType>('rounded');
	let dotsColor = $state('#111827');
	let backgroundColor = $state('#ffffff');
	let cornersSquareType = $state<CornerSquareType>('extra-rounded');
	let cornersDotType = $state<CornerDotType>('dot');
	let errorCorrection = $state<ErrorCorrectionLevel>('M');
	let image = $state('');
	let imageSize = $state(0.35);
	let hideBackgroundDots = $state(true);

	let payload = $derived.by(() => {
		if (type === 'text') return text.trim();
		if (type === 'url') return normalizeUrl(text);
		if (type === 'email') return buildEmailPayload({ to: emailTo, subject: emailSubject, body: emailBody });
		if (type === 'phone') return buildPhonePayload(phone);
		if (type === 'sms') return buildSmsPayload({ phone: smsPhone, message: smsMessage });
		if (type === 'wifi') {
			return buildWifiPayload({ ssid: wifiSsid, password: wifiPassword, encryption: wifiEncryption, hidden: wifiHidden });
		}
		return buildVCardPayload({
			firstName,
			lastName,
			org,
			title,
			phone: vPhone,
			email: vEmail,
			url: vUrl,
			street: '',
			city: '',
			region: '',
			postal: '',
			country: ''
		});
	});

	function loadSample() {
		type = 'url';
		text = 'https://onedev.tools/qr/generator';
		dotsType = 'rounded';
		dotsColor = '#4f46e5';
		backgroundColor = '#ffffff';
	}

	function clearAll() {
		text = '';
		emailTo = '';
		emailSubject = '';
		emailBody = '';
		phone = '';
		smsPhone = '';
		smsMessage = '';
		wifiSsid = '';
		wifiPassword = '';
		firstName = '';
		lastName = '';
		org = '';
		title = '';
		vPhone = '';
		vEmail = '';
		vUrl = '';
		image = '';
	}
</script>

<ToolWrapper lastUpdated="2026-08-17">
	<div class="space-y-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<div class="flex flex-wrap gap-2">
			{#each types as item}
				<button
					type="button"
					class="btn btn-sm {type === item.id ? 'btn-primary' : 'btn-ghost border border-base-300'}"
					onclick={() => (type = item.id)}
				>
					{item.label}
				</button>
			{/each}
		</div>

		<div class="grid gap-6 lg:grid-cols-[1fr_auto]">
			<div class="space-y-4">
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4 space-y-3">
						<h3 class="font-bold">Content</h3>

						{#if type === 'text' || type === 'url'}
							<label class="form-control">
								<span class="label-text text-sm">{type === 'url' ? 'Website URL' : 'Text'}</span>
								<textarea class="textarea textarea-bordered mt-1 min-h-24" bind:value={text} placeholder={type === 'url' ? 'https://example.com' : 'Type anything'}></textarea>
							</label>
						{:else if type === 'email'}
							<input class="input input-bordered" placeholder="email@example.com" bind:value={emailTo} />
							<input class="input input-bordered" placeholder="Subject" bind:value={emailSubject} />
							<textarea class="textarea textarea-bordered min-h-20" placeholder="Message" bind:value={emailBody}></textarea>
						{:else if type === 'phone'}
							<input class="input input-bordered" placeholder="+1 555 123 4567" bind:value={phone} />
						{:else if type === 'sms'}
							<input class="input input-bordered" placeholder="Phone number" bind:value={smsPhone} />
							<textarea class="textarea textarea-bordered min-h-20" placeholder="Message" bind:value={smsMessage}></textarea>
						{:else if type === 'wifi'}
							<input class="input input-bordered" placeholder="Network name (SSID)" bind:value={wifiSsid} />
							<select class="select select-bordered" bind:value={wifiEncryption}>
								<option value="WPA">WPA / WPA2 / WPA3</option>
								<option value="WEP">WEP</option>
								<option value="nopass">Open (no password)</option>
							</select>
							{#if wifiEncryption !== 'nopass'}
								<input class="input input-bordered" type="password" placeholder="Password" bind:value={wifiPassword} />
							{/if}
							<label class="flex items-center gap-2 text-sm">
								<input type="checkbox" class="checkbox checkbox-sm" bind:checked={wifiHidden} />
								Hidden network
							</label>
						{:else}
							<div class="grid gap-3 sm:grid-cols-2">
								<input class="input input-bordered" placeholder="First name" bind:value={firstName} />
								<input class="input input-bordered" placeholder="Last name" bind:value={lastName} />
								<input class="input input-bordered" placeholder="Company" bind:value={org} />
								<input class="input input-bordered" placeholder="Title" bind:value={title} />
								<input class="input input-bordered" placeholder="Phone" bind:value={vPhone} />
								<input class="input input-bordered" placeholder="Email" bind:value={vEmail} />
							</div>
							<input class="input input-bordered w-full" placeholder="Website" bind:value={vUrl} />
						{/if}

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
						<h3 class="font-bold mb-2">Preview</h3>
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
							filename="qr-code"
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

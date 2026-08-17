export type QrContentType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiPayload {
	ssid: string;
	password: string;
	encryption: WifiEncryption;
	hidden: boolean;
}

export interface VCardPayload {
	firstName: string;
	lastName: string;
	org: string;
	title: string;
	phone: string;
	email: string;
	url: string;
	street: string;
	city: string;
	region: string;
	postal: string;
	country: string;
}

export interface EmailPayload {
	to: string;
	subject: string;
	body: string;
}

export interface SmsPayload {
	phone: string;
	message: string;
}

// WiFi QR strings treat \, ;, ,, and : as special, so they need a backslash.
function escapeWifi(value: string): string {
	return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
}

function foldVCard(line: string): string {
	return line.replace(/\r?\n/g, '\\n');
}

export function normalizeUrl(value: string): string {
	const trimmed = value.trim();
	if (!trimmed) return '';
	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
	return `https://${trimmed}`;
}

export function buildWifiPayload(wifi: WifiPayload): string {
	const ssid = escapeWifi(wifi.ssid.trim());
	if (!ssid) return '';
	const type = wifi.encryption;
	const password = type === 'nopass' ? '' : escapeWifi(wifi.password);
	const hidden = wifi.hidden ? 'true' : 'false';
	return `WIFI:T:${type};S:${ssid};P:${password};H:${hidden};;`;
}

export function buildVCardPayload(card: VCardPayload): string {
	const first = card.firstName.trim();
	const last = card.lastName.trim();
	const fullName = [first, last].filter(Boolean).join(' ');
	if (!fullName && !card.phone.trim() && !card.email.trim()) return '';

	const lines = [
		'BEGIN:VCARD',
		'VERSION:3.0',
		`N:${foldVCard(last)};${foldVCard(first)};;;`,
		`FN:${foldVCard(fullName || card.org.trim() || card.email.trim())}`
	];

	if (card.org.trim()) lines.push(`ORG:${foldVCard(card.org.trim())}`);
	if (card.title.trim()) lines.push(`TITLE:${foldVCard(card.title.trim())}`);
	if (card.phone.trim()) lines.push(`TEL;TYPE=CELL:${card.phone.trim()}`);
	if (card.email.trim()) lines.push(`EMAIL:${card.email.trim()}`);
	if (card.url.trim()) lines.push(`URL:${normalizeUrl(card.url)}`);

	const adr = [
		'',
		'',
		card.street.trim(),
		card.city.trim(),
		card.region.trim(),
		card.postal.trim(),
		card.country.trim()
	];
	if (adr.slice(2).some(Boolean)) {
		lines.push(`ADR;TYPE=WORK:${adr.map(foldVCard).join(';')}`);
	}

	lines.push('END:VCARD');
	return lines.join('\n');
}

export function buildEmailPayload(email: EmailPayload): string {
	const to = email.to.trim();
	if (!to) return '';
	const params = new URLSearchParams();
	if (email.subject.trim()) params.set('subject', email.subject.trim());
	if (email.body.trim()) params.set('body', email.body.trim());
	const query = params.toString();
	return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

export function buildSmsPayload(sms: SmsPayload): string {
	const phone = sms.phone.trim();
	if (!phone) return '';
	return sms.message.trim() ? `sms:${phone}?body=${encodeURIComponent(sms.message.trim())}` : `sms:${phone}`;
}

export function buildPhonePayload(phone: string): string {
	const trimmed = phone.trim();
	return trimmed ? `tel:${trimmed}` : '';
}

export const DOT_STYLES = [
	{ id: 'square', label: 'Square' },
	{ id: 'dots', label: 'Dots' },
	{ id: 'rounded', label: 'Rounded' },
	{ id: 'extra-rounded', label: 'Extra round' },
	{ id: 'classy', label: 'Classy' },
	{ id: 'classy-rounded', label: 'Classy round' }
] as const;

export const CORNER_SQUARE_STYLES = [
	{ id: 'square', label: 'Square' },
	{ id: 'dot', label: 'Dot' },
	{ id: 'extra-rounded', label: 'Extra round' }
] as const;

export const CORNER_DOT_STYLES = [
	{ id: 'square', label: 'Square' },
	{ id: 'dot', label: 'Dot' }
] as const;

export const ERROR_LEVELS = [
	{ id: 'L', label: 'L (~7%)', hint: 'Smallest code. Use for short text with no logo.' },
	{ id: 'M', label: 'M (~15%)', hint: 'Default. Fine for URLs and clean prints.' },
	{ id: 'Q', label: 'Q (~25%)', hint: 'Better recovery. Good when a logo is small.' },
	{ id: 'H', label: 'H (~30%)', hint: 'Best recovery. Use when you add a center logo.' }
] as const;

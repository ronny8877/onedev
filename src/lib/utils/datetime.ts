/**
 * Date and time helpers. Uses the browser Intl APIs. No network.
 */

export type TimestampUnit = 's' | 'ms' | 'us' | 'ns';

export interface ParsedInstant {
	date: Date;
	inputKind: 'unix' | 'iso' | 'rfc2822' | 'excel' | 'unknown';
	unit?: TimestampUnit;
	original: string;
}

const RFC2822 = /^(?:[A-Za-z]{3},\s+)?\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}(?::\d{2})?(?:\s+[+-]\d{4}|\s+[A-Z]{2,5})?$/;

export function parseInstant(input: string, now = Date.now()): ParsedInstant | { error: string } {
	const raw = input.trim();
	if (!raw) return { error: 'Enter a timestamp, ISO date, or type "now".' };

	if (/^(now|today)$/i.test(raw)) {
		return { date: new Date(now), inputKind: 'unix', unit: 'ms', original: raw };
	}

	if (/^-?\d+(\.\d+)?$/.test(raw)) {
		const n = Number(raw);
		if (!Number.isFinite(n)) return { error: 'Not a finite number.' };
		const { ms, unit } = guessUnixUnit(n);
		const date = new Date(ms);
		if (Number.isNaN(date.getTime())) return { error: 'Unix value is out of range for JavaScript Date.' };
		return { date, inputKind: 'unix', unit, original: raw };
	}

	if (RFC2822.test(raw)) {
		const date = new Date(raw);
		if (!Number.isNaN(date.getTime())) return { date, inputKind: 'rfc2822', original: raw };
	}

	if (raw.includes('/') && !Number.isNaN(Date.parse(raw))) {
		const date = new Date(raw);
		if (!Number.isNaN(date.getTime())) return { date, inputKind: 'unknown', original: raw };
	}

	const isoTry = Date.parse(raw);
	if (!Number.isNaN(isoTry)) {
		return { date: new Date(isoTry), inputKind: looksLikeIso(raw) ? 'iso' : 'unknown', original: raw };
	}

	const serial = Number(raw);
	if (Number.isFinite(serial) && serial > 20000 && serial < 80000 && raw.includes('.')) {
		const date = excelSerialToDate(serial);
		if (!Number.isNaN(date.getTime())) return { date, inputKind: 'excel', original: raw };
	}

	return { error: 'Could not parse that value. Try Unix seconds, milliseconds, ISO 8601, or RFC 2822.' };
}

function looksLikeIso(value: string): boolean {
	return /^\d{4}-\d{2}-\d{2}/.test(value) || /T\d{2}:\d{2}/.test(value);
}

export function guessUnixUnit(n: number): { ms: number; unit: TimestampUnit } {
	const abs = Math.abs(n);
	if (abs === 0) return { ms: 0, unit: 's' };
	const digits = Math.floor(Math.log10(abs)) + 1;
	if (digits >= 19) return { ms: n / 1e6, unit: 'ns' };
	if (digits >= 16) return { ms: n / 1e3, unit: 'us' };
	if (digits >= 12) return { ms: n, unit: 'ms' };
	return { ms: n * 1000, unit: 's' };
}

export function excelSerialToDate(serial: number): Date {
	const utcDays = Math.floor(serial - 25569);
	const utcValue = utcDays * 86400;
	const fractional = serial - Math.floor(serial);
	const seconds = Math.round(fractional * 86400);
	return new Date((utcValue + seconds) * 1000);
}

export function dateToExcelSerial(date: Date): number {
	return date.getTime() / 86400000 + 25569;
}

export function toUnix(date: Date, unit: TimestampUnit = 's'): number {
	const ms = date.getTime();
	switch (unit) {
		case 'ms':
			return ms;
		case 'us':
			return Math.round(ms * 1000);
		case 'ns':
			return Math.round(ms * 1e6);
		default:
			return Math.floor(ms / 1000);
	}
}

export function formatInZone(date: Date, timeZone: string, withMillis = false): string {
	try {
		const fmt = new Intl.DateTimeFormat('en-US', {
			timeZone,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hourCycle: 'h23',
			...(withMillis ? { fractionalSecondDigits: 3 as const } : {})
		});
		const parts = Object.fromEntries(fmt.formatToParts(date).map((p) => [p.type, p.value]));
		const frac = withMillis && parts.fractionalSecond ? `.${parts.fractionalSecond}` : '';
		return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}${frac}`;
	} catch {
		return date.toISOString();
	}
}

export function zoneOffset(date: Date, timeZone: string): string {
	try {
		const fmt = new Intl.DateTimeFormat('en-US', {
			timeZone,
			timeZoneName: 'shortOffset'
		});
		const tz = fmt.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? '';
		return tz;
	} catch {
		return '';
	}
}

export function isoWeek(date: Date): { year: number; week: number; weekday: number } {
	const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
	const day = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - day);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	return { year: d.getUTCFullYear(), week, weekday: day };
}

export function relativeFrom(date: Date, now = Date.now()): string {
	const diff = date.getTime() - now;
	const abs = Math.abs(diff);
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
		['year', 31536000000],
		['month', 2592000000],
		['week', 604800000],
		['day', 86400000],
		['hour', 3600000],
		['minute', 60000],
		['second', 1000]
	];
	for (const [unit, ms] of units) {
		if (abs >= ms || unit === 'second') {
			return rtf.format(Math.round(diff / ms), unit);
		}
	}
	return 'now';
}

export function addToDate(
	date: Date,
	amount: number,
	unit: 'years' | 'months' | 'weeks' | 'days' | 'hours' | 'minutes' | 'seconds'
): Date {
	const d = new Date(date.getTime());
	switch (unit) {
		case 'years':
			d.setUTCFullYear(d.getUTCFullYear() + amount);
			break;
		case 'months':
			d.setUTCMonth(d.getUTCMonth() + amount);
			break;
		case 'weeks':
			d.setUTCDate(d.getUTCDate() + amount * 7);
			break;
		case 'days':
			d.setUTCDate(d.getUTCDate() + amount);
			break;
		case 'hours':
			d.setUTCHours(d.getUTCHours() + amount);
			break;
		case 'minutes':
			d.setUTCMinutes(d.getUTCMinutes() + amount);
			break;
		case 'seconds':
			d.setUTCSeconds(d.getUTCSeconds() + amount);
			break;
	}
	return d;
}

export function durationBetween(a: Date, b: Date): {
	ms: number;
	human: string;
	parts: { days: number; hours: number; minutes: number; seconds: number };
	iso: string;
} {
	const ms = Math.abs(b.getTime() - a.getTime());
	const days = Math.floor(ms / 86400000);
	const hours = Math.floor((ms % 86400000) / 3600000);
	const minutes = Math.floor((ms % 3600000) / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const chunks: string[] = [];
	if (days) chunks.push(`${days} day${days === 1 ? '' : 's'}`);
	if (hours) chunks.push(`${hours} hour${hours === 1 ? '' : 's'}`);
	if (minutes) chunks.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
	chunks.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
	const iso = `P${days}DT${hours}H${minutes}M${seconds}S`;
	return { ms, human: chunks.join(', '), parts: { days, hours, minutes, seconds }, iso };
}

export function parseIsoDuration(input: string): { ok: boolean; ms: number; error?: string } {
	const raw = input.trim().toUpperCase();
	const match = raw.match(/^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
	if (!match) return { ok: false, ms: 0, error: 'Not a valid ISO 8601 duration (example: P3DT4H5M).' };
	const [, y, mo, w, d, h, mi, s] = match;
	const ms =
		Number(y || 0) * 31536000000 +
		Number(mo || 0) * 2592000000 +
		Number(w || 0) * 604800000 +
		Number(d || 0) * 86400000 +
		Number(h || 0) * 3600000 +
		Number(mi || 0) * 60000 +
		Number(s || 0) * 1000;
	return { ok: true, ms };
}

export function listTimeZones(): string[] {
	try {
		if (typeof Intl !== 'undefined' && 'supportedValuesOf' in Intl) {
			return Intl.supportedValuesOf('timeZone');
		}
	} catch {
		// fall through
	}
	return [
		'UTC',
		'America/New_York',
		'America/Chicago',
		'America/Denver',
		'America/Los_Angeles',
		'America/Sao_Paulo',
		'Europe/London',
		'Europe/Paris',
		'Europe/Berlin',
		'Europe/Moscow',
		'Africa/Cairo',
		'Asia/Dubai',
		'Asia/Kolkata',
		'Asia/Singapore',
		'Asia/Shanghai',
		'Asia/Tokyo',
		'Australia/Sydney',
		'Pacific/Auckland'
	];
}

export const WORLD_CLOCK_ZONES: Array<{ label: string; tz: string }> = [
	{ label: 'UTC', tz: 'UTC' },
	{ label: 'New York', tz: 'America/New_York' },
	{ label: 'Chicago', tz: 'America/Chicago' },
	{ label: 'Los Angeles', tz: 'America/Los_Angeles' },
	{ label: 'Sao Paulo', tz: 'America/Sao_Paulo' },
	{ label: 'London', tz: 'Europe/London' },
	{ label: 'Paris', tz: 'Europe/Paris' },
	{ label: 'Berlin', tz: 'Europe/Berlin' },
	{ label: 'Dubai', tz: 'Asia/Dubai' },
	{ label: 'Mumbai', tz: 'Asia/Kolkata' },
	{ label: 'Singapore', tz: 'Asia/Singapore' },
	{ label: 'Tokyo', tz: 'Asia/Tokyo' },
	{ label: 'Sydney', tz: 'Australia/Sydney' }
];

export function formatBundle(date: Date, timeZone = 'UTC'): Record<string, string> {
	const unix = toUnix(date, 's');
	const ms = toUnix(date, 'ms');
	const week = isoWeek(date);
	return {
		iso: date.toISOString(),
		rfc2822: date.toUTCString(),
		unix: String(unix),
		unixMs: String(ms),
		excel: dateToExcelSerial(date).toFixed(6),
		isoWeek: `${week.year}-W${String(week.week).padStart(2, '0')}`,
		local: formatInZone(date, timeZone, true),
		utc: formatInZone(date, 'UTC', true),
		relative: relativeFrom(date)
	};
}

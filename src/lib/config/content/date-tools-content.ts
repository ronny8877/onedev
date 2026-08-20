export interface DateToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const dateToolsContent: Record<string, DateToolContent> = {
	timestamp: {
		features: [
			'Convert Unix seconds, milliseconds, microseconds, or nanoseconds',
			'Paste ISO 8601 or RFC 2822 and get Unix back',
			'Type now to lock the current instant',
			'See UTC, a chosen IANA zone, ISO week, Excel serial, and relative time',
			'Copy any format with one click',
			'All math is in this tab. Log timestamps never leave the machine'
		],
		useCases: [
			'Decode a JWT exp or iat you already copied',
			'Translate a log line like 1690000000 into a clock time',
			'Check whether a value is seconds or milliseconds',
			'Produce an epoch for a database seed',
			'Convert ISO from an API into Unix for a query'
		],
		concept: {
			title: 'Unix time is UTC, not your wall clock',
			content: `<p>Unix time counts seconds (or a fraction) since 1970-01-01T00:00:00Z, ignoring leap seconds in the usual POSIX definition. A 10-digit value around 1.7e9 is seconds in the 2020s. 13 digits are milliseconds. Getting that wrong shifts the date by centuries or into 1970.</p>
<p class="mt-2">JavaScript <code>Date</code> stores milliseconds. Very old or far-future values can overflow. We guess the unit from digit length, and you can override by pasting ISO instead.</p>`
		},
		examples: [
			{ label: 'Seconds (2023)', code: '1690000000', isValid: true },
			{ label: 'ISO', code: '2026-08-20T21:00:00Z', isValid: true },
			{ label: 'Not a date', code: 'hello', isValid: false }
		],
		faqs: [
			{
				question: 'Is this the same as epochconverter.com?',
				answer: '<p>Same job: Unix ↔ human time. This page does not phone home. Leap seconds are not applied; POSIX Unix time does not include them.</p>'
			},
			{
				question: 'Why is my millisecond value a 1970 date?',
				answer: '<p>You probably pasted seconds into a tool that assumed ms, or the reverse. 10 digits ≈ seconds. 13 digits ≈ ms.</p>'
			},
			{
				question: 'Does Convert → Time do this?',
				answer: '<p>No. That page converts durations (hours to milliseconds). This page converts instants on the calendar.</p>'
			}
		],
		relatedTools: [
			{ name: 'Timezone converter', path: '/date/timezone', description: 'Same instant in another zone' },
			{ name: 'ISO 8601 tools', path: '/date/iso', description: 'Durations and strict ISO parse' },
			{ name: 'JWT Expiration', path: '/jwt/expiration', description: 'exp/iat on a token' }
		],
		tips: [
			'When a log is ambiguous, check both seconds and ms. One of them will be a nonsense year.',
			'Store UTC in databases. Convert to a zone only at display time.'
		]
	},
	timezone: {
		features: [
			'Show one instant in any IANA time zone',
			'List zones from the browser (Intl.supportedValuesOf)',
			'Offset and short name for that date (DST aware)',
			'Search/filter the zone list',
			'Uses the timestamp you paste, or now'
		],
		useCases: [
			'Schedule a meeting across London and Tokyo',
			'See what 09:00 America/New_York is in UTC',
			'Debug a CronJob that fired “at the wrong hour”',
			'Check DST on a date in the spring-forward gap',
			'Convert a support ticket timestamp to the customer zone'
		],
		concept: {
			title: 'IANA names, not GMT+2 stickers',
			content: `<p>Use <code>America/New_York</code>, not “EST”. EST ignores daylight saving. The IANA database knows the rules for that civil date. Offsets on this page come from <code>Intl</code> for the instant you picked, so they change across DST.</p>`
		},
		examples: [
			{ label: 'Zone id', code: 'Europe/Berlin', isValid: true },
			{ label: 'Not a zone', code: 'GMT+2', isValid: false }
		],
		faqs: [
			{
				question: 'Why is the zone missing?',
				answer: '<p>The list is what this browser ships. Very old engines may have a short fallback list.</p>'
			},
			{
				question: 'What happens in a DST gap?',
				answer: '<p>Local clocks skip an hour in spring. A local time in the gap may be adjusted by the engine. Prefer UTC for stored events.</p>'
			}
		],
		relatedTools: [
			{ name: 'Unix timestamp', path: '/date/timestamp', description: 'Get the instant first' },
			{ name: 'World clock', path: '/date/world-clock', description: 'Several cities at once' },
			{ name: 'Cron next run', path: '/cron/next-run', description: 'Schedules with a timezone' }
		],
		tips: ['Filter the zone box by city name (Chicago, Singapore).', 'Airlines and calendars still surprise people around DST weekends. Recheck those dates.']
	},
	iso: {
		features: [
			'Parse ISO 8601 datetimes and durations (P3DT4H)',
			'Show the instant in UTC and Unix',
			'Explain duration as days/hours/minutes/seconds',
			'Accept common RFC 3339 timestamps',
			'Flag strings the JS parser will not accept'
		],
		useCases: [
			'Decode a Duration from an API (P1DT2H)',
			'Check whether a timestamp needs a Z or offset',
			'Convert ISO week-unrelated instants to Unix',
			'Teach the difference between duration and interval',
			'Validate a JSON date field before it hits a client'
		],
		concept: {
			title: 'ISO 8601 is a family, not one string',
			content: `<p>Calendar dates, times, offsets, and durations are different productions. <code>2026-08-20T12:00:00Z</code> is an instant. <code>P3D</code> is a duration with no start. JavaScript parses many instants and almost no durations. This page handles both.</p>`
		},
		examples: [
			{ label: 'Instant', code: '2026-08-20T21:00:00.000Z', isValid: true },
			{ label: 'Duration', code: 'P3DT4H5M', isValid: true },
			{ label: 'Invalid duration', code: '3 days', isValid: false }
		],
		faqs: [
			{
				question: 'Are months in durations exact?',
				answer: '<p>We approximate P1M as 30 days and P1Y as 365 days. Civil months vary. For billing, use calendar arithmetic on the calculator page.</p>'
			},
			{
				question: 'Why did my local ISO without Z parse as local?',
				answer: '<p>ES5 treats date-only as UTC and date-time without offset as local, inconsistently across engines. Put a <code>Z</code> or offset on purpose.</p>'
			}
		],
		relatedTools: [
			{ name: 'Date calculator', path: '/date/calculator', description: 'Add calendar units' },
			{ name: 'Duration', path: '/date/duration', description: 'Difference between two instants' },
			{ name: 'Unix timestamp', path: '/date/timestamp', description: 'Epoch forms' }
		],
		tips: ['Always include a timezone or Z on instants you send over the wire.', 'Duration is not the same as two ISO dates with a slash (intervals).']
	},
	calculator: {
		features: [
			'Add or subtract years, months, weeks, days, hours, minutes, seconds',
			'Start from now, Unix, or ISO',
			'UTC calendar arithmetic for months and years',
			'See the result in ISO and Unix',
			'No server'
		],
		useCases: [
			'Compute trial-end = now + 14 days',
			'Find 90 days after a contract start',
			'Subtract 3 hours from an incident timestamp',
			'Build a reminder instant',
			'Check month-end clamping (Jan 31 plus one month)'
		],
		concept: {
			title: 'Calendar add is not duration multiply',
			content: `<p>Adding one month to 31 January is not “plus 30 days”. Engines clamp to a valid civil date. We use UTC getters/setters so your OS timezone does not shift the day while you add hours.</p>`
		},
		examples: [
			{ label: 'Plus 7 days', code: 'now + 7 days', isValid: true }
		],
		faqs: [
			{
				question: 'Is this business days?',
				answer: '<p>No. Weekends and holidays are not skipped. Use a business-day library for that.</p>'
			}
		],
		relatedTools: [
			{ name: 'Duration', path: '/date/duration', description: 'Distance between two dates' },
			{ name: 'Unix timestamp', path: '/date/timestamp', description: 'Read the result as epoch' }
		],
		tips: ['Add months in UTC if you care about not slipping a local DST hour.', 'For SLAs, prefer hours and days over months.']
	},
	relative: {
		features: [
			'Turn an instant into “3 hours ago” / “in 2 days”',
			'Uses Intl.RelativeTimeFormat',
			'Shows the exact ISO too, so relative never stands alone',
			'Updates from the timestamp you paste'
		],
		useCases: [
			'Preview how a UI will render a stored epoch',
			'Explain a log time in English',
			'Check “yesterday” around midnight UTC vs local',
			'Copy copy-deck for empty states'
		],
		concept: {
			title: 'Relative time is lossy',
			content: `<p>Intl picks the largest unit that still looks reasonable. “30 days ago” may become “last month”. Always keep the absolute timestamp in data. Relative is for display.</p>`
		},
		examples: [
			{ label: 'Past unix', code: '1600000000', isValid: true }
		],
		faqs: [
			{
				question: 'Will this match moment.fromNow?',
				answer: '<p>Thresholds differ. Intl is the platform. Moment is a library with its own buckets.</p>'
			}
		],
		relatedTools: [
			{ name: 'Unix timestamp', path: '/date/timestamp', description: 'Absolute forms' },
			{ name: 'World clock', path: '/date/world-clock', description: 'Wall clocks instead of relative' }
		],
		tips: ['Pair relative labels with a title attribute of the ISO string in UIs.']
	},
	'world-clock': {
		features: [
			'Live clocks for major cities, ticking once a second',
			'UTC plus a dozen IANA zones',
			'Offset shown per city',
			'Stays in this tab. No world-time API'
		],
		useCases: [
			'Pick a standup time that is not 3am for someone',
			'Glance at UTC while reading logs',
			'See DST offsets without a search',
			'Keep a lightweight clock wall during an incident'
		],
		concept: {
			title: 'Clocks from Intl, not a feed',
			content: `<p>Each card formats <code>new Date()</code> in a zone. If the OS clock is wrong, these clocks are wrong. We do not reach ntp.org.</p>`
		},
		examples: [
			{ label: 'UTC always listed', code: 'UTC', isValid: true }
		],
		faqs: [
			{
				question: 'Can I add a custom city?',
				answer: '<p>Use the timezone converter and pick any IANA id. This page is a fixed wall of common zones.</p>'
			}
		],
		relatedTools: [
			{ name: 'Timezone converter', path: '/date/timezone', description: 'Any IANA zone' },
			{ name: 'Minimal Clock', path: '/break/clock', description: 'Fullscreen local clock' }
		],
		tips: ['Trust UTC during incidents. Local labels hide DST.']
	},
	duration: {
		features: [
			'Difference between two instants as days, hours, minutes, seconds',
			'ISO 8601 duration string',
			'Millisecond total',
			'Accepts Unix or ISO on each side'
		],
		useCases: [
			'Incident length: detect to resolve',
			'Token lifetime between iat and exp',
			'Build time between CI stamps',
			'Age of a file from mtime epoch'
		],
		concept: {
			title: 'Elapsed time, not calendar months',
			content: `<p>We subtract milliseconds and break the absolute value into days and clock units. We do not emit P1M. For month-aware spans, use the calculator with calendar adds.</p>`
		},
		examples: [
			{ label: 'Two ISOs', code: '2026-01-01T00:00:00Z → 2026-01-02T03:04:05Z', isValid: true }
		],
		faqs: [
			{
				question: 'Negative durations?',
				answer: '<p>We report the absolute span and which side is later.</p>'
			}
		],
		relatedTools: [
			{ name: 'ISO 8601', path: '/date/iso', description: 'Parse a P… duration' },
			{ name: 'Convert Time', path: '/convert/time', description: 'Unit conversion for a single duration' }
		],
		tips: ['Paste JWT iat and exp to see remaining life without the JWT tool.']
	},
	formats: {
		features: [
			'One instant in ISO, RFC 2822, Unix s/ms, Excel serial, ISO week, locale strings',
			'Pick a display time zone',
			'Copy each field',
			'Good cheat sheet when an API wants a weird format'
		],
		useCases: [
			'Fill an HTTP Date header (RFC 2822-ish UTC)',
			'Get Excel serial for a spreadsheet formula',
			'Read ISO week number',
			'Compare locale vs UTC strings',
			'Produce Unix ms for JS Date'
		],
		concept: {
			title: 'Formats are projections of one instant',
			content: `<p>Excel serials are days since 1899-12-30 with leap-year quirks in desktop Excel. We use the common 25569 offset for Unix day conversion, which matches Sheets for modern dates. ISO week is UTC-based here.</p>`
		},
		examples: [
			{ label: 'now', code: 'now', isValid: true }
		],
		faqs: [
			{
				question: 'Is Excel serial exact for 1900?',
				answer: '<p>Excel’s 1900 leap-year bug is not fully emulated. Use this for dates after 1900 that you already trust as Unix instants.</p>'
			}
		],
		relatedTools: [
			{ name: 'Unix timestamp', path: '/date/timestamp', description: 'Focus on epoch' },
			{ name: 'ISO 8601', path: '/date/iso', description: 'Duration strings' }
		],
		tips: ['HTTP Date is UTC. Do not send a local RFC 2822 to caches.']
	}
};

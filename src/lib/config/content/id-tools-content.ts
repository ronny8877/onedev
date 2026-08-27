
export interface IdToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
	howTo?: {
		lede: string[];
		steps: string[];
		breaks: string[];
	};
}

export const idToolsContent: Record<string, IdToolContent> = {
	'uuid-generator': {
		features: [
			'UUID v4 (random) and UUID v7 (Unix-ms time-ordered) per RFC 9562',
			'Bulk generate, with v7 timestamps decoded from the first 48 bits',
			'Hyphens on/off; case toggle for systems that store 32 hex chars',
			'Collision notes: v4 is 122 random bits; v7 collisions are per millisecond'
		],
		useCases: [
			'Pick v7 as a SQL primary key when B-tree locality matters',
			'Keep v4 when the id must not leak creation time',
			'Seed fixtures with a known version nibble (4 or 7)',
			'See why v4 PKs fragment Postgres indexes under insert load'
		],
		concept: {
			title: 'v4 is random. v7 is time-ordered.',
			content: `<p>v4 is random. v7 is time-ordered. If you're about to use a UUID as a primary key, that difference is the whole page.</p>
<p>Hit generate. Copy v7 for new tables. Copy v4 only when a spec still demands it.</p>
<p>v4 is 122 bits of random. Fine for IDs that are never used as a clustered index. v7 encodes a Unix timestamp in the high bits, so inserts append instead of scattering. That's what you want for a PK in Postgres, MySQL, and InnoDB.</p>
<p>v1 is time + MAC. Don't use it if the machine identity shouldn't leak. v5 is a namespace hash, deterministic. Same input, same UUID, every time. A UUID is 36 characters with hyphens, 32 without, 16 bytes in binary. Store it as <code>uuid</code> (Postgres) or <code>BINARY(16)</code>, not <code>VARCHAR(36)</code>, if you care about size.</p>`
		},
		examples: [
			{ label: 'UUID v4 (version nibble 4)', code: '550e8400-e29b-41d4-a716-446655440000', isValid: true },
			{ label: 'UUID v7 (version nibble 7, time in first 12 hex chars)', code: '018e5c4c-8b3a-7000-8000-000000000001', isValid: true },
			{ label: 'Hyphenless 32 hex (same bits)', code: '550e8400e29b41d4a716446655440000', isValid: true }
		],
		faqs: [
			{
				question: 'Should my primary key be v4 or v7?',
				answer: '<p>v4 is random. v7 is time-ordered. If you\'re about to use a UUID as a primary key, that difference is the whole page. v4 is 122 bits of random. Fine for IDs that are never used as a clustered index. v7 encodes a Unix timestamp in the high bits, so inserts append instead of scattering. That\'s what you want for a PK in Postgres, MySQL, and InnoDB. Copy v7 for new tables. Copy v4 only when a spec still demands it.</p>'
			},
			{
				question: 'What about v1 and v5?',
				answer: '<p>v1 is time + MAC. Don\'t use it if the machine identity shouldn\'t leak. v5 is a namespace hash, deterministic. Same input, same UUID, every time.</p>'
			},
			{
				question: 'How should I store a UUID?',
				answer: '<p>A UUID is 36 characters with hyphens, 32 without, 16 bytes in binary. Store it as <code>uuid</code> (Postgres) or <code>BINARY(16)</code>, not <code>VARCHAR(36)</code>, if you care about size. Uppercase vs lowercase hex is the same ID. Hyphens vs not is the same ID. Don\'t uniqueness-check the string form without normalizing.</p>'
			},
			{
				question: 'Why is my huge table slow with v4 as the primary key?',
				answer: '<p>v4 as a primary key on a huge table is random page splits. The database gets slower as it grows. That\'s the bug, not “UUIDs are slow.”</p>'
			},
			{
				question: 'Is a UUID a secret?',
				answer: '<p>This is not a secret. A UUID is an identifier, not an auth token.</p>'
			}
		],
		relatedTools: [
			{ name: 'UUID Validator', path: '/id/uuid-validator', description: 'Read version/variant nibbles on an existing id' },
			{ name: 'ULID Generator', path: '/id/ulid-generator', description: 'Crockford Base32 sortable ids, not RFC 9562' },
			{ name: 'Hash Generator', path: '/hash/generator', description: 'Need a digest of content, not a unique label' }
		],
		tips: [
			'Postgres: uuid v7 as PK, plus a created_at timestamptz if you need human time without decoding the id.',
			'Do not mix v4 and v7 in one unique column if you depend on sort order meaning created-at.',
			'UUIDs are not encryption and not password hashes.'
		],
		commonMistakes: [
			'v4 as a primary key on a huge table is random page splits. The database gets slower as it grows. That\'s the bug, not “UUIDs are slow.”',
			'Uppercase vs lowercase hex is the same ID. Hyphens vs not is the same ID. Don\'t uniqueness-check the string form without normalizing.',
			'This is not a secret. A UUID is an identifier, not an auth token.'
		],
		howTo: {
			lede: [
				'v4 is random. v7 is time-ordered. If you\'re about to use a UUID as a primary key, that difference is the whole page.',
				'Hit generate. Copy v7 for new tables. Copy v4 only when a spec still demands it.'
			],
			steps: [
				'v4 is 122 bits of random. Fine for IDs that are never used as a clustered index.',
				'v7 encodes a Unix timestamp in the high bits, so inserts append instead of scattering. That\'s what you want for a PK in Postgres, MySQL, and InnoDB.',
				'v1 is time + MAC. Don\'t use it if the machine identity shouldn\'t leak. v5 is a namespace hash, deterministic. Same input, same UUID, every time.',
				'A UUID is 36 characters with hyphens, 32 without, 16 bytes in binary. Store it as `uuid` (Postgres) or `BINARY(16)`, not `VARCHAR(36)`, if you care about size.'
			],
			breaks: [
				'v4 as a primary key on a huge table is random page splits. The database gets slower as it grows. That\'s the bug, not “UUIDs are slow.”',
				'Uppercase vs lowercase hex is the same ID. Hyphens vs not is the same ID. Don\'t uniqueness-check the string form without normalizing.',
				'This is not a secret. A UUID is an identifier, not an auth token.'
			]
		}
	},

	'ulid-generator': {
		features: [
			'Generate Universally Unique Lexicographically Sortable Identifiers (ULIDs)',
			'Generate 1 to 10,000 ULIDs in a single operation with chunked rendering',
			'Color-coded breakdown of timestamp (10 chars) vs random (16 chars)',
			'Sortability live demo — watch ULIDs generated with delays sort correctly as strings',
			'Collision probability and time-to-collision statistics',
			'Export as .txt or .json with decoded timestamps',
			'Comparison table: ULID vs UUID v4 vs UUID v7',
		],
		useCases: [
			'Database primary keys that need both uniqueness and chronological sort order',
			'Event IDs in event-sourced systems where ordering matters',
			'Distributed log entries that must merge correctly when sorted',
			'Cursor-based pagination where users can sort by ID and get correct ordering',
			'Audit trail records that need creation time embedded without a separate column',
		],
		concept: {
			title: 'What is a ULID?',
			content: `<p>A <strong>ULID</strong> (Universally Unique Lexicographically Sortable Identifier) is a 128-bit identifier with two components:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>Timestamp (48 bits):</strong> Unix time in milliseconds, encoded in the first 10 Crockford Base32 characters</li>
  <li><strong>Randomness (80 bits):</strong> Cryptographically secure random data in the remaining 16 characters</li>
</ul>
<p class="mt-2">The result is a 26-character, case-insensitive string that sorts correctly as a plain string comparison — no special date parsing needed. ULIDs generated in the same millisecond are monotonically incremented to preserve ordering.</p>
<p class="mt-2">Crockford Base32 uses a 32-character alphabet that excludes visually ambiguous characters (<code>I</code>, <code>L</code>, <code>O</code>, <code>U</code>), making ULIDs human-readable and safe to use in URLs without encoding.</p>`,
		},
		examples: [
			{ label: 'ULID (timestamp + random)', code: '01ARZ3NDEKTSV4RRFFQ69G5FAV', isValid: true },
			{ label: 'Timestamp portion (first 10)', code: '01ARZ3NDEK', isValid: true },
			{ label: 'Random portion (last 16)', code: 'TSV4RRFFQ69G5FAV', isValid: true },
		],
		faqs: [
			{
				question: 'How is a ULID different from a UUID v7?',
				answer:
					'<p>Both are timestamp-prefixed, but they differ in encoding and alphabet. UUID v7 uses hexadecimal (base-16) with hyphens and has 74 bits of randomness. ULID uses Crockford Base32 (base-32) without hyphens, resulting in a shorter 26-character string with 80 bits of randomness. ULIDs are slightly shorter and use a more human-friendly alphabet. UUIDs are more widely supported in databases and libraries.</p>',
			},
			{
				question: 'Are ULIDs guaranteed to sort correctly?',
				answer:
					'<p>Yes, as long as they are compared as strings (lexicographic order) and no two ULIDs are generated in the same millisecond by independent systems. Within the same millisecond from one source, the monotonic increment ensures ordering. Across distributed systems sharing the same millisecond, ordering is probabilistic — but extremely unlikely to collide.</p>',
			},
			{
				question: 'Can I decode the timestamp from a ULID?',
				answer:
					'<p>Yes. The first 10 characters are the Crockford Base32 encoding of the Unix timestamp in milliseconds. This tool displays the decoded timestamp next to each ULID in the results. In code, use the <code>decodeTime(ulid)</code> function from the <code>ulid</code> library to get the milliseconds since the Unix epoch.</p>',
			},
			{
				question: 'Are ULIDs URL-safe?',
				answer:
					'<p>Yes. The Crockford Base32 alphabet uses only uppercase letters and digits (A–Z, 0–9), excluding <code>I</code>, <code>L</code>, <code>O</code>, and <code>U</code> to avoid visual ambiguity. This makes ULIDs safe for URLs, filesystems, and database identifiers without any encoding.</p>',
			},
			{
				question: 'How much randomness does a ULID have?',
				answer:
					'<p>80 bits of randomness per ULID. At 1,000 IDs/second, you would need trillions of years to reach a 1% collision probability. Even in a distributed system generating 1 billion ULIDs total, the collision probability approaches zero.</p>',
			},
		],
		relatedTools: [
			{ name: 'UUID Generator', path: '/id/uuid-generator', description: 'Generate UUID v4 & v7' },
			{ name: 'UUID Validator', path: '/id/uuid-validator', description: 'Validate UUID format' },
			{ name: 'NanoID Generator', path: '/id/nanoid-generator', description: 'Compact customizable IDs' },
		],
		tips: [
			'Use ULIDs when you need sortable primary keys and don\'t want to couple to a specific database\'s native UUID type.',
			'The Sortability Demo shows the key feature of ULIDs visually — generate it and share the screenshot with stakeholders.',
			'ULIDs are always uppercase by spec, but most implementations accept lowercase input for comparison.',
			'For pagination cursors, ULIDs are ideal — sort your records by ULID and use the last ULID as a cursor; no separate <code>created_at</code> column required.',
			'If your database supports UUID natively, UUID v7 may be a better choice for broader ecosystem compatibility; otherwise, ULID is an excellent alternative.',
		],
	},

	'nanoid-generator': {
		features: [
			'Generate compact, URL-safe NanoIDs with configurable length (4–64 chars)',
			'Pre-set alphabets: Default (64 chars), URL-safe alphanumeric, Hexadecimal, Numbers only',
			'Fully custom alphabet support — define your own character set',
			'Generate 1 to 10,000 IDs per run with chunked rendering',
			'Real-time collision probability and time-to-collision calculator',
			'Comparison table: NanoID vs UUID v4',
			'Export as .txt or .json',
		],
		useCases: [
			'Short, URL-safe slugs for links, blog posts, or shareable IDs',
			'Session tokens or API keys with configurable entropy',
			'File or object names in content delivery networks (e.g., S3 keys)',
			'Ticket numbers or order IDs with custom alphanumeric alphabets',
			'React component keys or DOM element IDs with guaranteed uniqueness',
			'Random tokens for one-time password (OTP) systems (numbers-only alphabet)',
		],
		concept: {
			title: 'What is NanoID?',
			content: `<p><strong>NanoID</strong> is a tiny, secure, URL-friendly unique string ID generator. At its default size of 21 characters using a 64-character alphabet, it achieves <strong>126 bits of entropy</strong> — matching or exceeding UUID v4 (122 bits) in a smaller, more compact form.</p>
<p class="mt-2">Unlike UUID, NanoID lets you control both the <strong>length</strong> and the <strong>alphabet</strong>. A 10-character ID from a 64-char alphabet gives ~60 bits. A 21-character ID gives ~126 bits. The <em>collision probability calculator</em> in this tool makes it easy to tune these parameters for your specific scale requirements.</p>
<p class="mt-2">NanoID uses <code>crypto.getRandomValues</code> in the browser (or <code>crypto.randomBytes</code> in Node.js) for cryptographically secure randomness, and avoids modulo bias through rejection sampling.</p>`,
		},
		examples: [
			{ label: 'Default (21 chars, 64 alphabet)', code: 'V1StGXR8_Z5jdHi6B-myT', isValid: true },
			{ label: 'Short URL slug (10 chars)', code: 'IRFa-VaY2b', isValid: true },
			{ label: 'Hex ID (16 chars)', code: 'a4f9e3b20c81d7f5', isValid: true },
			{ label: 'Numeric token (6 chars)', code: '482917', isValid: true },
		],
		faqs: [
			{
				question: 'How many characters should I use for a NanoID?',
				answer:
					'<p>Use the collision probability calculator to decide. For most applications, 21 characters (default) gives ~126 bits of entropy — virtually impossible to collide. For less critical use cases like short URLs, 10–12 characters with the URL-safe alphabet gives ~60–72 bits — sufficient for typical web traffic. Decrease length only if collision probability at your expected scale remains acceptable.</p>',
			},
			{
				question: 'Is NanoID more secure than UUID v4?',
				answer:
					'<p>They are comparable. UUID v4 has 122 random bits; default NanoID (21 chars, 64-char alphabet) has 126 bits. Both use cryptographically secure randomness. NanoID\'s advantage is its smaller footprint and customizable format — not a significant security improvement over UUID v4.</p>',
			},
			{
				question: 'Can I use NanoID for session tokens or API keys?',
				answer:
					'<p>Yes, with caveats. A 21-character NanoID has 126 bits of entropy, which is strong enough for most session tokens. For high-security API keys, consider 32+ characters to provide 192+ bits of entropy. Use the URL-safe alphabet to avoid encoding issues in headers. Always transmit over HTTPS and hash the token before storing it in your database.</p>',
			},
			{
				question: 'What is modulo bias and does NanoID avoid it?',
				answer:
					'<p>Modulo bias occurs when using <code>randomByte % alphabetSize</code> to pick a random character — certain characters are slightly more likely than others if the byte range is not evenly divisible by the alphabet size. NanoID avoids this using <em>rejection sampling</em>: it generates extra random bytes and discards those outside the valid range, ensuring each character is chosen with equal probability.</p>',
			},
			{
				question: 'Why choose NanoID over UUID?',
				answer:
					'<p>NanoID advantages: <ul class="list-disc pl-5 mt-1 space-y-1"><li>21 chars vs 36 chars (UUID with hyphens) — 40% shorter for the same entropy</li><li>No hyphens — one token type instead of multiple UUID-specific field names</li><li>Customizable alphabet — use only numbers, only hex, etc.</li><li>URL-safe by default — no encoding needed</li></ul> UUID advantage: ubiquitous standard support, especially in SQL databases with native UUID types.</p>',
			},
		],
		relatedTools: [
			{ name: 'UUID Generator', path: '/id/uuid-generator', description: 'Standard UUID v4 & v7' },
			{ name: 'ULID Generator', path: '/id/ulid-generator', description: 'Time-sortable 26-char IDs' },
			{ name: 'UUID Validator', path: '/id/uuid-validator', description: 'Validate & decode UUIDs' },
			{ name: 'Hash Generator', path: '/hash', description: 'SHA & MD5 hashing tools' },
		],
		tips: [
			'For URL slugs and short links, 10–12 characters with the URL-safe alphabet strikes a good balance between brevity and safety.',
			'Always check the collision probability for your expected daily/monthly volume — the calculator shows you whether your configuration is safe at scale.',
			'For numeric OTPs (one-time passwords), use the "Numbers Only" preset with 6–8 characters. Remember numeric-only IDs have lower entropy per character.',
			'Custom alphabets excluding confusing characters (like 0/O or 1/l) improve human readability for codes that users read aloud or type manually.',
			'Never store a NanoID token directly as a password or secret — always hash it first (e.g., with SHA-256) before persisting to a database.',
		],
	},

	'uuid-validator': {
		features: [
			'Validate any UUID (with or without hyphens) in real time',
			'Detect UUID version (v1 through v7) and display version-specific description',
			'Detailed anatomy breakdown: time_low, time_mid, time_hi_version, clock_seq, node',
			'Specific error messages: wrong length, invalid characters, misplaced hyphens, bad variant bits',
			'Reference table of all UUID versions v1–v7 with descriptions',
			'Sample UUIDs for quick testing (valid v4, valid v7, invalid)',
		],
		useCases: [
			'Validate user-submitted UUIDs in form inputs or API requests',
			'Debug UUID parsing errors in backend logs',
			'Determine which UUID version an ID is without reading the spec',
			'Verify that a UUID has the correct format after decoding from a QR code or OCR',
			'Check handoff between systems to ensure ID format consistency',
		],
		concept: {
			title: 'UUID Structure & Versions',
			content: `<p>A UUID is a 128-bit value structured as: <code>8-4-4-4-12</code> hexadecimal digits separated by hyphens (36 characters total).</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>Bits 49–52 (M field):</strong> Version number (1–7)</li>
  <li><strong>Bits 65–66 (N field):</strong> Variant bits — must be <code>10xx</code> (binary) for RFC 4122, meaning the high nibble of the N group is 8, 9, a, or b</li>
</ul>
<p class="mt-2">Common versions: <strong>v1</strong> (timestamp + MAC address, legacy), <strong>v3</strong> (MD5 name-based), <strong>v4</strong> (random), <strong>v5</strong> (SHA-1 name-based), <strong>v7</strong> (Unix epoch timestamp, modern). Versions 2 and 6 are niche. Version 8 (free-form) is draft status.</p>`,
		},
		examples: [
			{ label: 'Valid UUID v4', code: '550e8400-e29b-41d4-a716-446655440000', isValid: true },
			{ label: 'Valid UUID v7', code: '018e5c4c-8b3a-7000-8000-000000000001', isValid: true },
			{ label: 'Invalid (bad chars)', code: '550e8400-e29b-41d4-ZZZZ-446655440000', isValid: false },
			{ label: 'Valid, no hyphens', code: '550e8400e29b41d4a716446655440000', isValid: true },
		],
		faqs: [
			{
				question: 'How do I know which UUID version I have?',
				answer:
					'<p>Look at the <strong>13th character</strong> (first character of the 3rd group). This is the version digit: <code>4</code> for v4, <code>7</code> for v7, <code>1</code> for v1, etc. The validator detects this automatically and shows the version name and description.</p>',
			},
			{
				question: 'Is a UUID without hyphens valid?',
				answer:
					'<p>Structurally, the hyphen-free form (32 hex characters) is a valid UUID representation — it is the same 128-bit value without formatting. Whether a specific system accepts it depends on implementation. This validator handles both formats gracefully.</p>',
			},
			{
				question: 'What are the variant bits?',
				answer:
					'<p>The variant field occupies bits 65–66 of the UUID. RFC 4122 UUIDs use the binary pattern <code>10xx</code>, meaning the 17th character (first of the 4th group) must be 8, 9, a, or b. Other variants (NCS, Microsoft COM) exist but are legacy or Microsoft-specific. If the validator says "Invalid variant bits," the 17th character falls outside this range.</p>',
			},
			{
				question: 'Can two valid UUIDs be the same?',
				answer:
					'<p>Technically, any UUID that passes format validation could be intentionally constructed to be identical to another. The uniqueness guarantee only applies to <em>randomly generated</em> v4 UUIDs (122 bits of randomness makes collisions practically impossible). Name-based UUIDs (v3, v5) derived from the same input will always produce the same UUID by design.</p>',
			},
			{
				question: 'What does the UUID anatomy breakdown show?',
				answer:
					'<p>The anatomy section maps each hyphen-separated group to its RFC 4122 field: <strong>time_low</strong> (32 bits), <strong>time_mid</strong> (16 bits), <strong>time_hi_version</strong> (16 bits, includes version), <strong>clock_seq_hi_reserved + clock_seq_low</strong> (16 bits, includes variant), and <strong>node</strong> (48 bits, originally MAC address). In v4 UUIDs, most fields are random except the version and variant bits.</p>',
			},
		],
		relatedTools: [
			{ name: 'UUID Generator', path: '/id/uuid-generator', description: 'Generate UUID v4 & v7' },
			{ name: 'ULID Generator', path: '/id/ulid-generator', description: 'Time-sortable IDs' },
			{ name: 'NanoID Generator', path: '/id/nanoid-generator', description: 'Compact IDs' },
			{ name: 'Hash Generator', path: '/hash', description: 'SHA-256, MD5, and more' },
		],
		tips: [
			'Paste a UUID from your logs or database directly — the validator handles leading/trailing whitespace automatically.',
			'If validating UUIDs in production code, use a battle-tested library like the <code>uuid</code> npm package rather than a hand-rolled regex.',
			'For v3 and v5 UUIDs, the same namespace + name input always produces the same UUID — this is by design, not a bug.',
			'The variant byte (17th character) must be 8, 9, a, or b. If you see validation failures for otherwise-correct-looking UUIDs, check this character first.',
			'When debugging UUID issues across microservices, check whether each service produces the same version — mixing v1 and v4 in the same field can cause subtle bugs.',
		],
	},
};

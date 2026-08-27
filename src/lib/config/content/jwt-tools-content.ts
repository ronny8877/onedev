// Content for the JWT tools (/jwt/*). Written to be genuinely useful and
// human-readable rather than keyword-stuffed.

interface JwtToolContent {
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

export const jwtToolsContent: Record<string, JwtToolContent> = {
	decoder: {
		features: [
			'Splits header.payload.signature and Base64URL-decodes the first two parts',
			'Does not verify the signature. A decoded token is not a trusted token',
			'Flags alg none and other unsigned-looking headers',
			'Turns exp, iat, and nbf Unix seconds into readable dates',
			'Pretty-prints claims so nested JSON is readable'
		],
		useCases: [
			'See which alg and kid a staging token actually carries',
			'Confirm a 401 is an expired exp, not a parse failure',
			'Teach that anyone with the token can read the payload',
			'Inspect a fixture JWT before wiring a real verifier'
		],
		concept: {
			title: 'Decode is not verify',
			content: `<p>Decode is not verify. A readable payload is not a trusted user. <code>alg: none</code>, an expired <code>exp</code>, and a token you found in a log will all “decode” just fine.</p>
<p>Paste the token. You get header and payload as JSON. Nothing here checks the signature. If you needed that, you needed your server and the real secret, not this page.</p>
<p>Read <code>alg</code> first. <code>none</code> means there is no signature. <code>HS256</code> vs <code>RS256</code> is not a style choice. If the header says <code>none</code> and you still trust the claims, that’s the bug. <code>exp</code>, <code>nbf</code>, and <code>iat</code> are Unix seconds, not milliseconds. A <code>exp</code> in 2020 still decodes. It is just dead.</p>
<p>Three segments: header, payload, signature. Two segments is usually <code>alg: none</code> or a truncated copy-paste.</p>`
		},
		examples: [
			{
				label: 'Fixture token (obviously fake claims, HS256 header)',
				code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyX2Zha2VfMDEiLCJuYW1lIjoiVGVzdCBVc2VyIiwiZXhwIjoxOTE2MjM5MDIyLCJpc3MiOiJodHRwczovL2F1dGgudGVzdC5leGFtcGxlIn0.signature-not-verified',
				isValid: true
			},
			{
				label: 'alg none: unsigned, not trustworthy',
				code: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhdHRhY2tlciIsInJvbGUiOiJhZG1pbiJ9.',
				isValid: true
			},
			{
				label: 'Only two parts (missing signature segment)',
				code: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyX2Zha2VfMDEifQ',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'Does this tool verify the signature?',
				answer: '<p>Decode is not verify. A readable payload is not a trusted user. <code>alg: none</code>, an expired <code>exp</code>, and a token you found in a log will all “decode” just fine. Paste the token. You get header and payload as JSON. Nothing here checks the signature. If you needed that, you needed your server and the real secret, not this page.</p>'
			},
			{
				question: 'What does alg none mean?',
				answer: '<p>Read <code>alg</code> first. <code>none</code> means there is no signature. <code>HS256</code> vs <code>RS256</code> is not a style choice. If the header says <code>none</code> and you still trust the claims, that’s the bug. Three segments: header, payload, signature. Two segments is usually <code>alg: none</code> or a truncated copy-paste.</p>'
			},
			{
				question: 'Why does an expired token still decode?',
				answer: '<p><code>exp</code>, <code>nbf</code>, and <code>iat</code> are Unix seconds, not milliseconds. A <code>exp</code> in 2020 still decodes. It is just dead.</p>'
			},
			{
				question: 'Can I paste a production access token?',
				answer: '<p>An invalid Base64url character (a <code>+</code> from standard Base64, a trailing newline) fails the decode. Trim it. This will not tell you if the token is authentic. Anyone can mint a payload. Don’t paste live production tokens. The claims are the data. Treat them that way.</p>'
			}
		],
		relatedTools: [
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'JWT claims are JSON: same parse rules, duplicate keys, big numbers' },
			{ name: 'Unix Timestamp', path: '/date/timestamp', description: 'Convert exp and iat seconds (10 digits, not 13)' },
			{ name: 'Hash Generator', path: '/hash/generator', description: 'HS256 is HMAC-SHA-256, not a password hash' }
		],
		tips: [
			'If the payload looks empty, you probably pasted two segments instead of three.',
			'A token that decodes can still be expired, wrong-aud, or signed with a leaked HS256 secret.',
			'Never put real production tokens in docs, issue templates, or this page\'s sample field.'
		],
		commonMistakes: [
			'An invalid Base64url character (a `+` from standard Base64, a trailing newline) fails the decode. Trim it.',
			'This will not tell you if the token is authentic. Anyone can mint a payload.',
			'Don’t paste live production tokens. The claims are the data. Treat them that way.'
		],
		howTo: {
			lede: [
				'Decode is not verify. A readable payload is not a trusted user. `alg: none`, an expired `exp`, and a token you found in a log will all “decode” just fine.',
				'Paste the token. You get header and payload as JSON. Nothing here checks the signature. If you needed that, you needed your server and the real secret, not this page.'
			],
			steps: [
				'Read `alg` first. `none` means there is no signature. `HS256` vs `RS256` is not a style choice. If the header says `none` and you still trust the claims, that’s the bug.',
				'`exp`, `nbf`, and `iat` are Unix seconds, not milliseconds. A `exp` in 2020 still decodes. It is just dead.',
				'Three segments: header, payload, signature. Two segments is usually `alg: none` or a truncated copy-paste.'
			],
			breaks: [
				'An invalid Base64url character (a `+` from standard Base64, a trailing newline) fails the decode. Trim it.',
				'This will not tell you if the token is authentic. Anyone can mint a payload.',
				'Don’t paste live production tokens. The claims are the data. Treat them that way.'
			]
		}
	},

	claims: {
		features: [
			'Lists every claim in a token with a short description',
			'Highlights the registered claims from RFC 7519 (iss, sub, aud, exp, and more)',
			'Flags recommended claims that are missing',
			'Separates standard claims from your own custom claims',
			'Works offline in your browser with no token ever leaving the page'
		],
		useCases: [
			'Understanding an unfamiliar token issued by a third-party provider',
			'Auditing whether a token includes the audience and issuer you expect',
			'Learning what each registered claim is for while building an auth flow',
			'Spotting typos or missing fields in tokens your own service generates'
		],
		concept: {
			title: 'Registered, public, and private claims',
			content: `<p>Claims are the key–value pairs inside a JWT payload. The spec (RFC 7519) defines a small set of <strong>registered claims</strong> with reserved meanings: <code>iss</code> (issuer), <code>sub</code> (subject), <code>aud</code> (audience), <code>exp</code> (expiration), <code>nbf</code> (not before), <code>iat</code> (issued at), and <code>jti</code> (token id).</p>
			<p>Everything else falls into two buckets. <strong>Public claims</strong> use collision-resistant names (often a URI) so they can be shared safely between systems, while <strong>private claims</strong> are whatever custom fields you and your consumer agree on, like <code>role</code> or <code>email</code>.</p>
			<p>Reading claims tells you what a token asserts, but it does not prove any of it is true — that guarantee comes only from verifying the signature.</p>`
		},
		examples: [
			{
				label: 'Payload with common registered claims',
				code: '{\n  "iss": "https://auth.example.com",\n  "sub": "user_123",\n  "aud": "my-api",\n  "exp": 1916239022,\n  "iat": 1516239022\n}',
				isValid: true
			},
			{
				label: 'Custom (private) claims alongside standard ones',
				code: '{\n  "sub": "user_123",\n  "role": "admin",\n  "email": "jane@example.com"\n}',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between "sub" and a user id claim?',
				answer: 'The "sub" (subject) claim is the registered, standard place to identify who the token is about. A custom field like "userId" works too, but "sub" is understood by libraries and other services out of the box.'
			},
			{
				question: 'Why should I check the "aud" claim?',
				answer: 'The audience claim says which service the token is meant for. Verifying it prevents a token issued for one API from being accepted by another.'
			},
			{
				question: 'Are custom claims allowed?',
				answer: 'Yes. Anything beyond the registered claims is a public or private claim. Keep names short to save space and avoid clashing with reserved claim names.'
			}
		],
		relatedTools: [
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'Decode the full header, payload, and signature' },
			{ name: 'JWT Expiration Checker', path: '/jwt/expiration', description: 'Check exp, iat, and nbf timing claims' },
			{ name: 'JWT Generator', path: '/jwt/generator', description: 'Build a test token with the claims you choose' }
		]
	},

	expiration: {
		features: [
			'Tells you at a glance whether a token is expired or still valid',
			'Shows the time remaining until expiry (or how long ago it lapsed)',
			'Converts exp, iat, and nbf into readable dates in your timezone',
			'Explains the not-before window so early tokens make sense',
			'Processes the token locally without sending it anywhere'
		],
		useCases: [
			'Diagnosing "401 Unauthorized" errors caused by expired tokens',
			'Confirming how long a session token is meant to last',
			'Checking that a freshly issued token is not rejected by an nbf in the future',
			'Comparing issued-at and expiry to understand a provider’s token lifetime'
		],
		concept: {
			title: 'How JWT expiry actually works',
			content: `<p>Time in a JWT is stored as <strong>Unix timestamps</strong> — the number of seconds since January 1, 1970 (UTC). Three claims control timing: <code>iat</code> (when the token was issued), <code>exp</code> (when it stops being valid), and <code>nbf</code> (a time before which it must not be accepted).</p>
			<p>A token is considered active when the current time is at or after <code>nbf</code> and strictly before <code>exp</code>. Most servers also allow a small amount of "clock skew" — usually a minute or two — so tokens are not rejected just because two machines' clocks disagree slightly.</p>
			<p>Expiry is enforced by whoever verifies the token, not by the token itself. This checker reads the timestamps for you, but the real decision still happens server-side.</p>`
		},
		examples: [
			{
				label: 'exp set well into the future (still valid)',
				code: '{ "iat": 1516239022, "exp": 1916239022 }',
				isValid: true
			},
			{
				label: 'exp already in the past (expired)',
				code: '{ "iat": 1516239022, "exp": 1516242622 }',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'My token decodes fine but the API rejects it — why?',
				answer: 'A token can be perfectly well-formed and still be expired. Check the exp claim here; if the expiry time has passed, the server is right to reject it and you need a fresh token.'
			},
			{
				question: 'What is clock skew and why does it matter?',
				answer: 'Servers and clients rarely have perfectly synced clocks, so verifiers usually permit a small leeway (often 60 seconds) around exp and nbf to avoid rejecting otherwise-valid tokens.'
			},
			{
				question: 'Is exp required?',
				answer: 'It is optional in the spec, but strongly recommended. A token with no exp never expires on its own, which is a security risk if it is ever leaked.'
			}
		],
		relatedTools: [
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'Inspect the full token structure' },
			{ name: 'JWT Claims Viewer', path: '/jwt/claims', description: 'Understand every claim in the payload' },
			{ name: 'JWT Size Analyzer', path: '/jwt/size', description: 'Check how large a token has grown' }
		]
	},

	generator: {
		features: [
			'Creates test JWTs with a custom header and payload',
			'Handy for mocking auth responses while building a UI',
			'Add common claims like sub, exp, and iat with a click',
			'Everything is generated in your browser — no server round-trip',
			'Copy the finished token straight into your API client or tests'
		],
		useCases: [
			'Faking a logged-in user while developing a frontend',
			'Producing sample tokens for documentation or bug reports',
			'Testing how your app handles expired or malformed tokens',
			'Experimenting with different claim shapes before wiring up a real issuer'
		],
		concept: {
			title: 'Why this is for testing only',
			content: `<p>A real JWT is trustworthy because its signature was created with a secret (or private key) that only the issuer holds. Tokens made in a browser tool cannot be secured that way — the secret would be exposed — so anything generated here is meant strictly for <strong>local development and testing</strong>.</p>
			<p>Use these tokens to exercise your own code paths: how the UI behaves when a user is "logged in", how your app reacts to an expired <code>exp</code>, or how it handles missing claims. Never point production systems at self-generated tokens, and never treat them as a substitute for a proper auth server.</p>`
		},
		examples: [
			{
				label: 'A minimal test payload',
				code: '{ "sub": "test-user", "name": "Test User", "iat": 1516239022 }',
				isValid: true
			},
			{
				label: 'Add an exp to test expiry handling',
				code: '{ "sub": "test-user", "exp": 1516242622 }',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I use these tokens in production?',
				answer: 'No. They are for local testing only. Production tokens must be signed by your auth server with a secret that is never exposed to the browser.'
			},
			{
				question: 'How do I test that my app rejects expired tokens?',
				answer: 'Generate a token with an exp timestamp in the past, send it to your app, and confirm it responds with an authentication error instead of granting access.'
			},
			{
				question: 'What algorithm do the test tokens use?',
				answer: 'They are intended for UI and flow testing rather than real verification, so treat them as demo tokens. For anything that must verify a signature, use a proper server-side library.'
			}
		],
		relatedTools: [
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'Check that your generated token decodes correctly' },
			{ name: 'JWT Claims Viewer', path: '/jwt/claims', description: 'Review the claims you added' },
			{ name: 'JWT Expiration Checker', path: '/jwt/expiration', description: 'Confirm the exp you set behaves as expected' }
		]
	},

	size: {
		features: [
			'Characters, bytes, and a header / payload / signature split',
			'Watches the on-wire total: Base64url is about 4/3 of the JSON',
			'Cookie JWTs need to stay under ~4 KB; Authorization headers are often capped near 8 KB',
			'Growth is custom claims: permission arrays, profile blobs, long claim names',
			'Measures size. It does not verify the signature'
		],
		useCases: [
			'A token that still decodes can be why every request returns 431',
			'A cookie over ~4 KB gets dropped and the user looks logged out',
			'Finding which claims blew up the payload',
			'Keeping sub and exp (maybe a role) and fetching the rest from your API'
		],
		concept: {
			title: 'The JWT spec has no size limit',
			content: `<p>The JWT spec has no size limit. Your cookie jar and your reverse proxy do. A token that still decodes can be why every request returns 431 or the cookie silently disappears.</p>
			<p>Paste the token. You get characters, bytes, and a header / payload / signature split. The payload is almost always the part that blew up. Watch the on-wire total. Base64url is about 4/3 of the JSON.</p>
			<p>Cookie JWTs need to stay under ~4 KB. <code>Authorization</code> tokens share the whole header block, often capped near 8 KB. Header and signature barely move. Growth is custom claims: permission arrays, profile blobs, long claim names. Shrink it. Keep <code>sub</code> and <code>exp</code> (maybe a role) and fetch the rest from your API.</p>
			<p>431 or a load-balancer 400 is often this token, not your app. A cookie over ~4 KB gets dropped. The user looks logged out. This page measures size. It does not verify the signature. Decode is not verify. Don't paste live production tokens.</p>`
		},
		examples: [
			{
				label: 'A compact token with few claims',
				code: '{ "sub": "123", "exp": 1916239022 }',
				isValid: true
			},
			{
				label: 'Bloated payload (large claims add up fast)',
				code: '{ "sub": "123", "permissions": ["a","b","c","d","e","f","g"], "profile": { "bio": "..." } }',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'How big can a JWT be?',
				answer: '<p>The JWT spec has no size limit. Your cookie jar and your reverse proxy do. Cookie JWTs need to stay under ~4 KB. <code>Authorization</code> tokens share the whole header block, often capped near 8 KB.</p>'
			},
			{
				question: 'What makes a token large?',
				answer: '<p>Paste the token. You get characters, bytes, and a header / payload / signature split. The payload is almost always the part that blew up. Header and signature barely move. Growth is custom claims: permission arrays, profile blobs, long claim names. Watch the on-wire total. Base64url is about 4/3 of the JSON.</p>'
			},
			{
				question: 'How do I shrink a token?',
				answer: '<p>Shrink it. Keep <code>sub</code> and <code>exp</code> (maybe a role) and fetch the rest from your API.</p>'
			},
			{
				question: 'Why am I seeing 431 or a load-balancer 400?',
				answer: '<p>431 or a load-balancer 400 is often this token, not your app. A cookie over ~4 KB gets dropped. The user looks logged out.</p>'
			},
			{
				question: 'Does this page verify the signature?',
				answer: '<p>This page measures size. It does not verify the signature. Decode is not verify. Don\'t paste live production tokens.</p>'
			}
		],
		commonMistakes: [
			'431 or a load-balancer 400 is often this token, not your app.',
			'A cookie over ~4 KB gets dropped. The user looks logged out.',
			'This page measures size. It does not verify the signature. Decode is not verify. Don\'t paste live production tokens.'
		],
		howTo: {
			lede: [
				'A token that still decodes can be why every request returns 431 or the cookie silently disappears.',
				'Paste the token. You get characters, bytes, and a header / payload / signature split. The payload is almost always the part that blew up.'
			],
			steps: [
				'Watch the on-wire total. Base64url is about 4/3 of the JSON.',
				'Cookie JWTs need to stay under ~4 KB. `Authorization` tokens share the whole header block, often capped near 8 KB.',
				'Header and signature barely move. Growth is custom claims: permission arrays, profile blobs, long claim names.',
				'Shrink it. Keep `sub` and `exp` (maybe a role) and fetch the rest from your API.'
			],
			breaks: [
				'431 or a load-balancer 400 is often this token, not your app.',
				'A cookie over ~4 KB gets dropped. The user looks logged out.',
				'This page measures size. It does not verify the signature. Decode is not verify. Don\'t paste live production tokens.'
			]
		},
		relatedTools: [
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'See exactly which claims are in the payload' },
			{ name: 'JWT Claims Viewer', path: '/jwt/claims', description: 'Identify claims you could trim' },
			{ name: 'JWT Expiration Checker', path: '/jwt/expiration', description: 'Review the timing claims in your token' }
		]
	}
};

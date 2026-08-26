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
			content: `<p>A JWT is three Base64URL segments: <code>header.payload.signature</code>. This page decodes the header and payload. It does <strong>not</strong> check the signature. If the bytes parse, you will see claims even when the signature is garbage, stripped, or signed with the wrong key.</p>
<p><strong>alg=none</strong> means there is no signature. Some old libraries treated <code>{"alg":"none"}</code> as valid. If you see <code>none</code>, the token is an assertion anyone could have written. HS256 vs RS256 confusion is the other classic failure: a token that looks fine here can still be rejected (or worse, accepted) by a sloppy verifier.</p>
<p>The payload is encoded, not encrypted. Treat it as public. Do not put passwords, session secrets, or full PANs in claims. <strong>Do not paste live production tokens into examples or screenshots.</strong> Use a fixture with fake sub/email values. A still-valid access token in a ticket is a credential leak.</p>
<p>Expiry is a Unix second in <code>exp</code>. Decoding it here does not enforce it. The server that holds the key is the only place verification belongs.</p>`
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
				answer: '<p>No. Verification needs the HMAC secret or the issuer public key, and it belongs on your server. This page only Base64URL-decodes header and payload. A green decode means the JSON parsed, not that the token is authentic.</p>'
			},
			{
				question: 'What does alg none mean?',
				answer: '<p>The header says the token is unsigned. Anyone can mint a payload with <code>alg: none</code>. Reject it in production verifiers. If you decode one here, treat every claim as attacker-controlled.</p>'
			},
			{
				question: 'Can I paste a production access token?',
				answer: '<p>Do not. A live token is a credential. Use a fixture: fake <code>sub</code>, obviously fake email, expired or far-future <code>exp</code>. If you already pasted a real token, rotate it. Screenshots, HARs, and chat logs leak tokens even when the page itself does not upload them.</p>'
			},
			{
				question: 'Why can I read the payload without a key?',
				answer: '<p>Base64URL is encoding. There is no confidentiality. JWE (encrypted JWT) is a different format. This decoder is for JWS compact serialization, the three-part tokens APIs usually send.</p>'
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
		]
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
			'Measures the total token length in characters and bytes',
			'Breaks down how much space the header, payload, and signature use',
			'Warns when a token is large enough to bump into common limits',
			'Helps you see which claims are inflating the payload',
			'Runs locally so tokens stay on your machine'
		],
		useCases: [
			'Trimming a token that no longer fits inside a cookie',
			'Investigating why requests fail with header-too-large errors',
			'Deciding which claims to move out of the token and fetch on demand',
			'Keeping mobile requests lean where every byte of overhead counts'
		],
		concept: {
			title: 'Why token size is worth watching',
			content: `<p>A JWT is sent on <strong>every request</strong> that needs authentication, usually in the <code>Authorization</code> header. That means the token's size is pure overhead added to each call, so a bloated payload quietly slows things down and eats bandwidth.</p>
			<p>Size also runs into hard limits. Many web servers cap total header size (commonly around 8&nbsp;KB), reverse proxies and load balancers may be stricter, and if you store the token in a cookie you are bound by the ~4&nbsp;KB per-cookie limit. Tokens usually grow because of large or numerous custom claims.</p>
			<p>If a token gets too big, the usual fix is to keep only an identifier in the token and look up the rest of the data server-side.</p>`
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
				answer: 'There is no fixed limit in the spec, but practical limits apply: web servers often cap headers near 8 KB and cookies are limited to about 4 KB. Staying comfortably under a couple of kilobytes is a good target.'
			},
			{
				question: 'What makes a token large?',
				answer: 'Usually the payload — long custom claims, arrays of permissions, or embedded profile data. The header and signature are small and fairly constant by comparison.'
			},
			{
				question: 'How do I shrink a token?',
				answer: 'Keep only what the client truly needs (like a user id and expiry), use short claim names, and fetch heavier data from your API instead of packing it into the token.'
			}
		],
		relatedTools: [
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'See exactly which claims are in the payload' },
			{ name: 'JWT Claims Viewer', path: '/jwt/claims', description: 'Identify claims you could trim' },
			{ name: 'JWT Expiration Checker', path: '/jwt/expiration', description: 'Review the timing claims in your token' }
		]
	}
};

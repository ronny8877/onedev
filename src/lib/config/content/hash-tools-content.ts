interface HashToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const hashToolsContent: Record<string, HashToolContent> = {
	'generator': {
		features: [
			'Support for MD5, SHA-1, SHA-256, SHA-512, CRC32, and more',
			'Real-time hash generation as you type',
			'File hashing support (client-side processing)',
			'Compare multiple algorithms simultaneously',
			'One-click copy for all outputs',
			'Secure (no data leaves your browser)'
		],
		useCases: [
			'Verify file integrity after download',
			'Generate checksums for software releases',
			'Create unique identifiers for data',
			'Educational comparison of hash lengths and formats',
			'Quickly check password hashes (for testing)'
		],
		concept: {
			title: 'What is Hashing?',
			content: `<p><strong>Hashing</strong> is the process of converting data of any size into a fixed-size string of characters, which is typically a digest that is unique to the data being hashed.</p>
			<p><strong>Key Properties:</strong></p>
			<ul>
				<li><strong>Deterministic:</strong> The same input always produces the same hash.</li>
				<li><strong>Fast:</strong> It should be quick to calculate.</li>
				<li><strong>One-way:</strong> It is infeasible to generate the original data from the hash (pre-image resistance).</li>
				<li><strong>Avalanche Effect:</strong> A small change in input produces a significantly different hash.</li>
			</ul>`
		},
		examples: [
			{
				label: 'MD5 ("hello")',
				code: '5d41402abc4b2a76b9719d911017c592',
				isValid: true
			},
			{
				label: 'SHA-256 ("hello")',
				code: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is MD5 secure?',
				answer: 'No. MD5 is considered cryptographically broken and should not be used for security (like passwords). It is fine for checksums/integrity checks.'
			},
			{
				question: 'Can I decrypt a hash?',
				answer: 'No. Hashing is a one-way function. You cannot "decrypt" it, but you can try to "crack" it by guessing inputs until you find a match (brute-force).'
			},
			{
				question: 'How does file hashing work here?',
				answer: 'We use the Web Crypto API or fast JavaScript libraries to read your file in chunks directly in the browser. Your file is never uploaded to any server.'
			}
		],
		relatedTools: [
			{ name: 'Hash Identifier', path: '/hash/identifier', description: 'Identify unknown hashes' },
			{ name: 'File Checksum', path: '/hash/file-checksum', description: 'Verify downloads' },
			{ name: 'HMAC Generator', path: '/hash/hmac', description: 'Keyed hashing' }
		],
		tips: [
			'Use SHA-256 or higher for security purposes.',
			'Use CRC32 or MD5 for simple integrity checks where speed matters and security is not a concern.'
		]
	},
	'md5': {
		features: [
			'Instant MD5 hash generation',
			'File support (local processing)',
			'Compatible with standard `md5sum` utilities',
			'Fast and lightweight',
			'Copy to clipboard'
		],
		useCases: [
			'Verify file integrity (checksums)',
			'Legacy system compatibility',
			'Generate unique identifiers for non-security data',
			'Deduplication fingerprints'
		],
		concept: {
			title: 'MD5 (Message-Digest Algorithm 5)',
			content: `<p><strong>MD5</strong> produces a 128-bit hash value, typically expressed as a 32-digit hexadecimal number.</p>
			<p>Despite being broken for cryptographic security (collision attacks exist), it remains widely used for checksums to verify data integrity against unintentional corruption.</p>`
		},
		examples: [
			{
				label: 'Input',
				code: 'The quick brown fox jumps over the lazy dog',
				isValid: true
			},
			{
				label: 'Output',
				code: '9e107d9d372bb6826bd81d3542a419d6',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why is it widely used if broken?',
				answer: 'It is very fast and ubiquitous. For detecting accidental file corruption (bad download, disk error), it is perfectly adequate.'
			}
		],
		relatedTools: [
			{ name: 'SHA-1', path: '/hash/sha1', description: 'Another legacy hash' },
			{ name: 'SHA-256', path: '/hash/sha256', description: 'Secure alternative' }
		]
	},
	'sha256': {
		features: [
			'Secure SHA-256 generation',
			'Part of SHA-2 family',
			'Standard for modern security (TLS, Bitcoin, etc.)',
			'Client-side file hashing',
			'256-bit digest'
		],
		useCases: [
			'Cryptographic security',
			'Digital signatures',
			'Password hashing (with salt)',
			'Blockchain identifiers',
			'Secure file verification'
		],
		concept: {
			title: 'SHA-256',
			content: `<p><strong>SHA-256</strong> (Secure Hash Algorithm 256-bit) is a member of the SHA-2 family. It generates a unique 256-bit (32-byte) signature for a text or file.</p>
			<p>It is currently considered secure and is the industry standard for most cryptographic applications.</p>`
		},
		examples: [
			{
				label: 'Input',
				code: 'hello world',
				isValid: true
			},
			{
				label: 'Output',
				code: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is SHA-256 unbreakable?',
				answer: 'Currently, no practical attack exists to find collisions or pre-images. It is safe for foreseeable future uses.'
			}
		],
		relatedTools: [
			{ name: 'SHA-512', path: '/hash/sha512', description: 'Stronger variant' },
			{ name: 'HMAC', path: '/hash/hmac', description: 'Keyed SHA-256' }
		]
	},
	'sha512': {
		features: [
			'512-bit digest size (128 hex characters)',
			'Higher collision resistance than SHA-256',
			'Faster on 64-bit processors',
			'Secure for top-secret classification',
			'Client-side execution'
		],
		useCases: [
			'High-security applications',
			'Password hashing (e.g., in /etc/shadow)',
			'Verifying large datasets',
			'Post-quantum safety margin'
		],
		concept: {
			title: 'SHA-512',
			content: `<p><strong>SHA-512</strong> is part of the SHA-2 family but uses 64-bit words (unlike SHA-256\'s 32-bit words). This often makes it faster on modern 64-bit CPUs despite doing more work.</p>`
		},
		examples: [
			{
				label: 'Length',
				code: '128 hexadecimal characters',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Should I always use SHA-512 over 256?',
				answer: 'Not necessarily. It takes more storage space (64 bytes vs 32 bytes). Use it if you need the extra security margin or usually run on 64-bit hardware.'
			}
		],
		relatedTools: [
			{ name: 'SHA-256', path: '/hash/sha256', description: 'Standard alternative' }
		]
	},
	'sha1': {
		features: [
			'160-bit hash generation',
			'40 hex character output',
			'Git object ID compatibility',
			'Legacy support',
			'Fast computation'
		],
		useCases: [
			'Git commit content addressing',
			'Legacy checksums',
			'Identifying old files/records',
			'Non-cryptographic identifiers'
		],
		concept: {
			title: 'SHA-1 (Secure Hash Algorithm 1)',
			content: `<p><strong>SHA-1</strong> was once the standard but is now considered <strong>broken</strong> (shattered). It should not be used for digital signatures or certificates.</p>
			<p>It is still famously used by Git for version control integrity, though Git is moving towards SHA-256 compatibility.</p>`
		},
		examples: [
			{
				label: 'Input',
				code: 'git',
				isValid: true
			},
			{
				label: 'Output',
				code: '46f1a0bd5592a2f9244ca6afeb651b2694a73e67',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does Git still use it?',
				answer: 'Migrating a massive decentralized ecosystem is hard. Git uses SHA-1 primarily for content addressing, not security against active attackers, though collisions are a theoretical risk.'
			}
		],
		relatedTools: [
			{ name: 'MD5', path: '/hash/md5', description: 'Older alternative' },
			{ name: 'Git Tools', path: '/git/blame-explainer', description: 'Git utilities' }
		]
	},
	'crc32': {
		features: [
			'Extremely fast calculation',
			'Short 8-character hex output',
			'Ideal for error detection',
			'Standard implementation (IEEE 802.3)',
			'Low processing overhead'
		],
		useCases: [
			'Network packet error check',
			'Zip file integrity',
			'Quick difference check for files',
			'Short identifiers'
		],
		concept: {
			title: 'CRC32 (Cyclic Redundancy Check)',
			content: `<p><strong>CRC32</strong> is NOT a cryptographic hash. It is an error-detecting code designed to detect accidental changes to raw data.</p>
			<p>It is trivial to intentionally generate collisions, so never use it for security.</p>`
		},
		examples: [
			{
				label: 'Input',
				code: '123456789',
				isValid: true
			},
			{
				label: 'Output',
				code: 'cbf43926',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why use CRC32?',
				answer: 'It is incredibly fast and the output is short (8 chars). Perfect for spotting if a file copied correctly.'
			}
		],
		relatedTools: [
			{ name: 'MD5', path: '/hash/md5', description: 'More robust checksum' }
		]
	},
	'identifier': {
		features: [
			'Analyze hash format and length',
			'Detect likely algorithm (MD5, SHA, bcrypt, etc.)',
			'Identify common formats (Unix crypt, LDAP)',
			'Check for salt or potential encoding',
			'Educational feedback'
		],
		useCases: [
			'Determine what logic verified a leaked hash',
			'Debug unknown database records',
			'CTF (Capture The Flag) competitions',
			'Reverse engineering'
		],
		concept: {
			title: 'Hash Identification',
			content: `<p>Identification is based on:</p>
			<ul>
				<li><strong>Length:</strong> 32 chars (hex) = 128 bit (MD5/MD4). 64 chars = 256 bit.</li>
				<li><strong>Character Set:</strong> Hex (0-9, a-f) vs Base64 vs Custom.</li>
				<li><strong>Prefixes:</strong> "$2a$" suggests bcrypt, "$1$" suggests MD5-crypt.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Input',
				code: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
				isValid: true
			},
			{
				label: 'Result',
				code: 'Bcrypt (Blowfish)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can it guess 100% correctly?',
				answer: 'Not always. A 32-character hex string could be specific MD5, MD4, or NTLM. We provide the most likely candidates.'
			}
		],
		relatedTools: [
			{ name: 'Hash Details', path: '/hash/generator', description: 'Generate samples' }
		]
	},
	'compare': {
		features: [
			'Side-by-side hash comparison',
			'Case-insensitive matching',
			'Whitespace trimming option',
			'Visual diff indicator (Green/Red)',
			'Percentage match (if similar)'
		],
		useCases: [
			'Manually verify a downloaded file hash',
			'Compare generated vs stored password hash',
			'Check if two files are identical via hash',
			'Debug encoding issues'
		],
		concept: {
			title: 'Hash Comparison',
			content: `<p>Hashes must match <strong>exactly</strong>. A single bit difference in the source file results in a completely different hash.</p>
			<p>However, hash <em>strings</em> can sometimes differ in case (uppercase vs lowercase hex), which does not affect the actual value. This tool handles that normalization.</p>`
		},
		examples: [
			{
				label: 'Match',
				code: 'AABB... vs aabb...',
				isValid: true
			}
		],
		faqs: [],
		relatedTools: [
			{ name: 'File Checksum', path: '/hash/file-checksum', description: 'Verify files' }
		]
	},
	'file-checksum': {
		features: [
			'Client-side file processing (Upload-free)',
			'Supports huge files (Gigabytes)',
			'Progress bar for large files',
			'Auto-compare with expected hash',
			'Drag and drop support'
		],
		useCases: [
			'Verify OS ISO downloads (Linux distros)',
			'Check game patch integrity',
			'Validate backup restoration',
			'Ensure secure transfer of sensitive docs'
		],
		concept: {
			title: 'File Integrity',
			content: `<p>When downloading large files, errors can occur. Software publishers provide a "checksum" (hash) on their website.</p>
			<p>By computing the hash of your local file and comparing it, you prove that <strong>every single bit</strong> is identical to the original.</p>`
		},
		examples: [],
		faqs: [
			{
				question: 'Is my file uploaded?',
				answer: 'No. The browser reads the file from your disk and calculates the hash in memory. It never leaves your device.'
			}
		],
		relatedTools: [
			{ name: 'Hash Generator', path: '/hash/generator', description: 'Text hashing' }
		]
	},
	'lookup': {
		features: [
			'Reverse lookup for common hashes',
			'Check against rainbow table APIs (simulated or external)',
			'Identify common passwords',
			'Fast check for weak credentials'
		],
		useCases: [
			'Check if your password has been leaked',
			'Recover lost data from MD5 sums',
			'Audit database security for weak hashes'
		],
		concept: {
			title: 'Rainbow Tables & Lookup',
			content: `<p>Since you can\'t "decrypt" a hash, attackers use pre-computed tables of billions of common passwords and their hashes.</p>
			<p>If a hash is found in the database, the original password is revealed. This is why <strong>Salt</strong> is mandatory for password security.</p>`
		},
		examples: [
			{
				label: 'Hash',
				code: '5f4dcc3b5aa765d61d8327deb882cf99',
				isValid: true
			},
			{
				label: 'Result',
				code: 'password',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can you crack any hash?',
				answer: 'No. We only check against a dictionary of common request searches. Complex passwords won\'t be found.'
			}
		],
		relatedTools: [
			{ name: 'Password Tester', path: '/security/password', description: 'Check strength' }
		]
	},
	'hmac': {
		features: [
			'Keyed-Hash Message Authentication Code',
			'Support SHA-256, SHA-512, MD5',
			'Secret Key input',
			'Verify API signatures',
			'Standard compliance (RFC 2104)'
		],
		useCases: [
			'Debug API webhooks (Stripe, GitHub, Slack)',
			'Generate JWT signatures manually',
			'Verify authenticated messages',
			'Secure data exchange'
		],
		concept: {
			title: 'HMAC (Hash-based Message Authentication Code)',
			content: `<p>HMAC combines a cryptographic hash function with a secret cryptographic key.</p>
			<p><strong>Hash(Message)</strong> guarantees integrity.</p>
			<p><strong>HMAC(Message, Key)</strong> guarantees <strong>integrity</strong> AND <strong>authenticity</strong>. Only someone with the key could have created the hash.</p>`
		},
		examples: [
			{
				label: 'Secret',
				code: 'my-secret-key',
				isValid: true
			},
			{
				label: 'Message',
				code: '{"id": 123}',
				isValid: true
			}
		],
		faqs: [],
		relatedTools: [
			{ name: 'SHA-256', path: '/hash/sha256', description: 'Underlying hash' },
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'Uses HMAC' }
		]
	},
	'converter': {
		features: [
			'Convert Hash to Base64',
			'Convert Hash to Hex',
			'Convert Hash to Binary string',
			'Change casing (upper/lower)',
			'Add/Remove hex delimiters (0x, spaces, colons)'
		],
		useCases: [
			'Format hashes for specific API requirements',
			'Convert binary database storage to readable hex',
			'Standardize logs',
			'Prepare keys for configuration files'
		],
		concept: {
			title: 'Hash Encodings',
			content: `<p>A hash is raw binary data (bytes). To display it, we encode it.</p>
			<ul>
				<li><strong>Hex:</strong> Most common (e.g., \`a3f9...\`). 2 chars per byte.</li>
				<li><strong>Base64:</strong> More compact (e.g., \`o/k...\`). Used in web protocols.</li>
			</ul>`
		},
		examples: [],
		faqs: [],
		relatedTools: [
			{ name: 'Base64', path: '/base64/encode-decode', description: 'General encoder' },
			{ name: 'Hex/Binary', path: '/base64/hex-binary', description: 'Number bases' }
		]
	}
};

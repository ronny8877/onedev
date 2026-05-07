interface HashToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
	lastUpdated?: string;
}

export const hashToolsContent: Record<string, HashToolContent> = {
	'generator': {
		lastUpdated: '2026-05-07',
		features: [
			'Support for MD5, SHA-1, SHA-256, SHA-512, CRC32, and more',
			'Real-time hash generation as you type',
			'File hashing support (client-side processing for large files)',
			'Compare multiple algorithms simultaneously',
			'One-click copy for all outputs',
			'Secure processing (no data leaves your browser)'
		],
		useCases: [
			'Verify file integrity after downloading software',
			'Generate checksums for software releases or package managers',
			'Create unique cache identifiers for data payloads',
			'Compare the output lengths and formats of different hashing algorithms',
			'Quickly generate test hashes for database seeding or unit tests'
		],
		concept: {
			title: 'Understanding Cryptographic Hashing',
			content: `<p><strong>Hashing</strong> is a mathematical algorithm that maps data of arbitrary size to a fixed-size string of characters, called a hash or digest. It is a fundamental component of modern cryptography and data integrity.</p>
			<p><strong>Key Properties of a Good Hash Function:</strong></p>
			<ul>
				<li><strong>Deterministic:</strong> The exact same input will always produce the exact same hash output.</li>
				<li><strong>Pre-image Resistance (One-way):</strong> It is computationally infeasible to reverse the hash back to the original input.</li>
				<li><strong>Avalanche Effect:</strong> Changing even a single bit of the input produces a completely different hash output.</li>
				<li><strong>Collision Resistance:</strong> It should be extremely difficult to find two different inputs that produce the same hash.</li>
			</ul>
			<p>While some algorithms like MD5 and SHA-1 are fast, they are no longer collision-resistant and should only be used for non-security checksums. SHA-256 and SHA-512 remain the industry standard for cryptographic security.</p>`
		},
		examples: [
			{
				label: 'MD5 (Legacy Checksum)',
				code: 'Input: "admin123"\nMD5: 0192023a7bbd73250516f069df18b500',
				isValid: true
			},
			{
				label: 'SHA-256 (Modern Standard)',
				code: 'Input: "admin123"\nSHA-256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
				isValid: true
			},
			{
				label: 'Avalanche Effect Demonstration',
				code: 'Input 1: "Hello"\nSHA-256: 185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969\n\nInput 2: "hello" (lowercase h)\nSHA-256: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between hashing and encryption?',
				answer: '<p>Encryption is a two-way function: data is scrambled using a key and can be decrypted back to its original form using the same (or a related) key. Hashing is a one-way function: data is scrambled into a fixed-size digest, and it cannot be reversed to reveal the original data.</p>'
			},
			{
				question: 'Which hashing algorithm should I use?',
				answer: '<p>For security purposes (passwords, certificates, digital signatures), use <strong>SHA-256</strong> or <strong>SHA-512</strong>. For quick file integrity checks where malicious tampering is not a concern, <strong>MD5</strong> or <strong>CRC32</strong> are faster but cryptographically insecure.</p>'
			},
			{
				question: 'Is it safe to hash files on this website?',
				answer: '<p>Yes. This tool uses the Web Crypto API to process files entirely locally within your browser. The file data is never uploaded to a server, making it safe for sensitive or proprietary files.</p>'
			},
			{
				question: 'Can a hash be "cracked"?',
				answer: '<p>Technically, hashes cannot be "decrypted". However, attackers use techniques like dictionary attacks or rainbow tables (precomputed lists of hashes for common words) to guess the original input. This is why passwords should always be hashed with a unique "salt" to prevent rainbow table attacks.</p>'
			}
		],
		tips: [
			'When hashing passwords for a database, never use raw MD5, SHA-1, or SHA-256. Instead, use purpose-built password hashing functions like bcrypt, Argon2, or scrypt, which include salting and intentional computational delays.',
			'If you are hashing files, comparing a SHA-256 hash is the most robust way to ensure a large download wasn\'t corrupted over the network.'
		],
		commonMistakes: [
			'Using MD5 or SHA-1 for passwords or security tokens. Both are vulnerable to collision attacks.',
			'Forgetting that hashes are case-sensitive. "password" and "Password" yield completely different hashes.',
			'Assuming hashing is the same as encryption and expecting to "decode" the hash later.'
		],
		relatedTools: [
			{ name: 'Hash Identifier', path: '/hash/identifier', description: 'Analyze unknown hashes to detect the algorithm used.' },
			{ name: 'File Checksum', path: '/hash/file-checksum', description: 'Verify file integrity by calculating and comparing hashes.' },
			{ name: 'HMAC Generator', path: '/hash/hmac', description: 'Generate keyed hashes for API authentication.' }
		]
	},
	'md5': {
		lastUpdated: '2026-05-07',
		features: [
			'Instant MD5 (Message-Digest Algorithm 5) hash generation',
			'Local file support for checksum generation without uploads',
			'Compatible with standard `md5sum` terminal utilities',
			'Ultra-fast execution for large payloads',
			'One-click copy to clipboard'
		],
		useCases: [
			'Verify file integrity against accidental corruption during transfers',
			'Generate deduplication fingerprints for caching systems',
			'Create unique identifiers for non-sensitive data (e.g., Gravatar image URLs)',
			'Legacy system compatibility and integration',
			'Partitioning data by hashing keys in distributed databases'
		],
		concept: {
			title: 'MD5 (Message-Digest Algorithm 5)',
			content: `<p><strong>MD5</strong> is a widely used cryptographic hash function that produces a 128-bit (16-byte) hash value, typically rendered as a 32-character hexadecimal number.</p>
			<p>Originally designed in 1991 by Ronald Rivest as a cryptographically secure algorithm, MD5 has since been proven vulnerable to collision attacks. This means attackers can intentionally create two different files that produce the exact same MD5 hash.</p>
			<p>Despite being <strong>cryptographically broken</strong>, MD5 remains incredibly popular because it is extremely fast and computationally inexpensive. It is perfectly suited for detecting accidental data corruption, verifying downloads, and generating non-secure unique keys.</p>`
		},
		examples: [
			{
				label: 'Standard MD5 Output',
				code: 'Input: "The quick brown fox jumps over the lazy dog"\nMD5: 9e107d9d372bb6826bd81d3542a419d6',
				isValid: true
			},
			{
				label: 'Empty String',
				code: 'Input: "" (empty)\nMD5: d41d8cd98f00b204e9800998ecf8427e',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'If MD5 is broken, why do systems still use it?',
				answer: '<p>MD5 is broken for <em>security</em> (preventing malicious tampering), but it is excellent for <em>reliability</em> (detecting accidental corruption). Because it is highly optimized and present in nearly every programming language standard library, it is still the go-to algorithm for basic checksums, caching layers, and deduplication.</p>'
			},
			{
				question: 'How does Gravatar use MD5?',
				answer: '<p>Gravatar (Globally Recognized Avatars) uses MD5 to request user images. When you leave a comment on a blog, the site hashes your email address (e.g., `user@example.com` becomes `b58996c504c5638798eb6b511e6f49af`) and requests the image from Gravatar\'s servers using that hash. This provides a minor layer of privacy over sending raw emails in image URLs.</p>'
			},
			{
				question: 'What is an MD5 collision?',
				answer: '<p>A collision occurs when two different inputs produce the exact same hash output. In 2004, researchers demonstrated how to quickly generate MD5 collisions. Later, it was proven that attackers could create a malicious software executable with the exact same MD5 hash as a legitimate software executable, completely breaking MD5\'s usefulness for digital signatures.</p>'
			}
		],
		tips: [
			'Always trim leading and trailing whitespace from your input text before hashing, as invisible spaces will completely change the resulting MD5 hash.',
			'If you need a checksum for a massive file (e.g., 50GB database backup), MD5 is significantly faster to compute than SHA-256.'
		],
		commonMistakes: [
			'Using MD5 to hash passwords in a database. Passwords can be easily cracked using MD5 rainbow tables.',
			'Relying on MD5 to verify that a file was not maliciously altered by a hacker. (Use SHA-256 instead).'
		],
		relatedTools: [
			{ name: 'SHA-256', path: '/hash/sha256', description: 'Use SHA-256 if you need cryptographic security.' },
			{ name: 'Hash Identifier', path: '/hash/identifier', description: 'Analyze unknown hashes.' }
		]
	},
	'sha256': {
		lastUpdated: '2026-05-07',
		features: [
			'Secure SHA-256 hash generation (256-bit digest)',
			'Local file processing via Web Crypto API',
			'Standard implementation for modern cryptographic security',
			'Generates 64-character hexadecimal output',
			'Zero data upload ensures complete privacy'
		],
		useCases: [
			'Verifying the integrity and authenticity of software downloads',
			'Generating API signatures and authentication tokens',
			'Implementing secure blockchain protocols (Bitcoin uses double SHA-256)',
			'Hashing sensitive data for compliance (PII, email addresses)',
			'Creating secure digital signatures for document verification'
		],
		concept: {
			title: 'SHA-256 (Secure Hash Algorithm 2)',
			content: `<p><strong>SHA-256</strong> belongs to the SHA-2 family of cryptographic hash functions, designed by the United States National Security Agency (NSA). It produces a 256-bit (32-byte) digest, typically represented as a 64-character hexadecimal string.</p>
			<p>Currently, SHA-256 is the industry standard for most cryptographic applications. It strikes an excellent balance between security and performance.</p>
			<p>Unlike older algorithms like MD5 or SHA-1, there are no known collision attacks against SHA-256. It is considered computationally infeasible for modern hardware to find two inputs that produce the same SHA-256 hash, making it safe for high-security applications, digital certificates (SSL/TLS), and password hashing (when combined with a salt and key stretching).</p>`
		},
		examples: [
			{
				label: 'Standard SHA-256 Output',
				code: 'Input: "hello world"\nSHA-256: b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
				isValid: true
			},
			{
				label: 'Empty String',
				code: 'Input: "" (empty)\nSHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is SHA-256 unbreakable?',
				answer: '<p>In practical terms, yes. Currently, no attack exists to find collisions or pre-images for SHA-256. The number of possible SHA-256 hashes is 2<sup>256</sup>, which is roughly comparable to the number of atoms in the observable universe. However, as quantum computing advances, the security margins of 256-bit hashes may be reduced, which is why some highly sensitive systems are moving to SHA-512 or SHA-3.</p>'
			},
			{
				question: 'How is SHA-256 used in Bitcoin?',
				answer: '<p>Bitcoin uses SHA-256 extensively. Proof-of-Work mining involves repeatedly hashing a block header with a random number (nonce) until the resulting SHA-256 hash begins with a specific number of zeroes. Bitcoin actually applies the algorithm twice (SHA256(SHA256(data))) as an added security measure against length-extension attacks.</p>'
			},
			{
				question: 'Should I use SHA-256 to store passwords?',
				answer: '<p>Raw SHA-256 is <strong>not</strong> recommended for password storage because it is extremely fast. Attackers can compute billions of SHA-256 hashes per second using modern GPUs, making dictionary attacks easy. Instead, use algorithms designed specifically for passwords like bcrypt, Argon2, or PBKDF2 (which can use SHA-256 internally but runs it thousands of times to intentionally slow down attackers).</p>'
			}
		],
		tips: [
			'When comparing SHA-256 hashes provided by software vendors (like Docker image digests or Linux ISO checksums), ensure your tool or script handles case-insensitivity, as some vendors use uppercase hex while others use lowercase.',
			'If you are hashing data for compliance reasons (like masking user emails for analytics), ensure you append a secret "salt" to the string before hashing to prevent reverse-lookups via rainbow tables.'
		],
		commonMistakes: [
			'Storing raw SHA-256 hashes of passwords without a salt.',
			'Assuming SHA-256 encryption. Remember, hashing is one-way. You cannot decrypt a SHA-256 hash.',
			'Including accidental newline characters (\\n) when copying text to hash, resulting in a completely different digest.'
		],
		relatedTools: [
			{ name: 'SHA-512', path: '/hash/sha512', description: 'Stronger variant of the SHA-2 family.' },
			{ name: 'HMAC', path: '/hash/hmac', description: 'Keyed SHA-256 for API authentication signatures.' }
		]
	},
	'sha512': {
		lastUpdated: '2026-05-07',
		features: [
			'Ultra-secure SHA-512 hash generation (512-bit digest)',
			'Generates 128-character hexadecimal output',
			'Faster on 64-bit processors than SHA-256 in some implementations',
			'Local file processing without server uploads',
			'Approved for high-security and classified data'
		],
		useCases: [
			'Hashing passwords in Linux shadow files (`/etc/shadow`)',
			'High-security applications requiring maximum collision resistance',
			'Post-quantum cryptography preparation',
			'Generating long, unpredictable seed values for random number generators'
		],
		concept: {
			title: 'SHA-512',
			content: `<p><strong>SHA-512</strong> is the strongest standard variant of the SHA-2 family. It produces a massive 512-bit (64-byte) digest, typically rendered as a 128-character hexadecimal string.</p>
			<p>An interesting technical quirk of SHA-512 is that it operates using 64-bit words, whereas SHA-256 uses 32-bit words. Because modern server processors are 64-bit, computing a SHA-512 hash is often <strong>faster</strong> on 64-bit hardware than computing a SHA-256 hash, despite generating a larger, more secure digest.</p>
			<p>SHA-512 provides an immense security margin and is immune to any foreseeable cryptographic attack, including those posed by future quantum computers.</p>`
		},
		examples: [
			{
				label: 'Standard SHA-512 Output',
				code: 'Input: "OneDev Tools"\nSHA-512: 5046294d1b73e5140dc1bce1b4a10df768d7e9eecdbdb7df63073b6deab6be31d99fb3a7f8045f2be581e220e8baf1ea96d8bd6c84c1cc8db4a9bfe1b2bc320f',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Should I always use SHA-512 instead of SHA-256?',
				answer: '<p>Not necessarily. While SHA-512 is more secure and often faster on 64-bit CPUs, it produces a much longer string (128 characters vs 64 characters). If you are storing billions of hashes in a database, the doubled storage size can become a significant cost factor. Furthermore, SHA-256 is already considered practically unbreakable, making SHA-512 overkill for many web applications.</p>'
			},
			{
				question: 'Is SHA-512 used for passwords?',
				answer: '<p>Yes, but usually not in its raw form. Many Linux distributions use `crypt` with SHA-512 (often denoted as `$6$` in `/etc/shadow`) combined with a salt and thousands of rounds of iterative hashing to protect user passwords.</p>'
			}
		],
		tips: [
			'If your application runs primarily on 32-bit edge devices or IoT hardware, avoid SHA-512, as the 64-bit math will have to be emulated, causing a severe performance penalty. Use SHA-256 instead.',
			'Use SHA-512/256 (a truncated version of SHA-512) if you want the 64-bit hardware speed advantages of SHA-512 but the smaller 256-bit storage size.'
		],
		commonMistakes: [
			'Allocating a `VARCHAR(64)` database column for SHA-512. It requires 128 characters in hex format.',
			'Using it in bandwidth-constrained environments where the larger digest size increases payload latency.'
		],
		relatedTools: [
			{ name: 'SHA-256', path: '/hash/sha256', description: 'The standard 256-bit alternative.' },
			{ name: 'HMAC', path: '/hash/hmac', description: 'Calculate authenticated keyed hashes.' }
		]
	},
	'sha1': {
		lastUpdated: '2026-05-07',
		features: [
			'160-bit hash generation (40 hex characters)',
			'Compatible with Git object IDs and commit hashes',
			'Legacy system support and backward compatibility',
			'Extremely fast computation',
			'Client-side file and text hashing'
		],
		useCases: [
			'Interacting with Git version control systems (commit IDs, blob hashing)',
			'Verifying legacy checksums from older software archives',
			'Generating non-cryptographic unique identifiers for database records',
			'Checking files against older threat-intelligence blocklists'
		],
		concept: {
			title: 'SHA-1 (Secure Hash Algorithm 1)',
			content: `<p><strong>SHA-1</strong> produces a 160-bit (20-byte) hash value, represented as a 40-character hexadecimal number.</p>
			<p>For decades, SHA-1 was the cornerstone of internet security, used in SSL certificates and PGP signatures. However, in 2017, a joint team from Google and CWI Amsterdam executed the first successful collision attack (the SHAttered attack), proving they could create two different PDF files with the exact same SHA-1 hash.</p>
			<p>Today, SHA-1 is <strong>cryptographically broken</strong> and deprecated by NIST. Modern browsers will reject SSL certificates signed with SHA-1. It should never be used for digital signatures or security. It remains relevant primarily due to its deep integration into the Git version control system.</p>`
		},
		examples: [
			{
				label: 'Standard SHA-1 Output',
				code: 'Input: "git"\nSHA-1: 46f1a0bd5592a2f9244ca6afeb651b2694a73e67',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'If SHA-1 is broken, why does Git still use it?',
				answer: '<p>Git was designed around SHA-1 for content addressing (identifying file contents quickly), not primarily for cryptography. Migrating a massive, decentralized ecosystem like Git is exceptionally difficult. While a collision attack could theoretically be used to sneak malicious code into a repository, Git implements mitigation strategies to detect known collision techniques. Furthermore, newer versions of Git are slowly rolling out support for SHA-256 object formats.</p>'
			},
			{
				question: 'Can I use SHA-1 for a hash map or cache key?',
				answer: '<p>Yes. If security against malicious attackers is not a requirement, SHA-1 is perfectly fine for generating unique identifiers, cache keys, or deduplication tokens. It is faster than SHA-256 and provides a much lower chance of accidental collisions than MD5.</p>'
			}
		],
		tips: [
			'When working with Git internals, remember that Git prepends a header (`blob <length>\\0`) to the file contents before calculating the SHA-1 hash. Hashing a raw file with standard SHA-1 will not match the Git blob ID.',
			'If you encounter a 40-character hex string in a log file, it is almost certainly a SHA-1 hash.'
		],
		commonMistakes: [
			'Using SHA-1 to sign JWT (JSON Web Tokens) or API webhooks. Always use SHA-256 or higher for signatures.',
			'Assuming SHA-1 is safe just because it is used by Git.'
		],
		relatedTools: [
			{ name: 'Git Tools', path: '/git/blame-explainer', description: 'Explore Git utilities that rely on SHA-1 hashes.' },
			{ name: 'Hash Identifier', path: '/hash/identifier', description: 'Detect SHA-1 hashes among other formats.' }
		]
	},
	'crc32': {
		lastUpdated: '2026-05-07',
		features: [
			'Instant CRC32 (Cyclic Redundancy Check) calculation',
			'Produces short, 8-character hex outputs',
			'Ideal for detecting accidental data corruption',
			'Standard implementation (IEEE 802.3)',
			'Zero-latency processing for small texts'
		],
		useCases: [
			'Verifying the integrity of ZIP, GZIP, and PNG files',
			'Checking network packets for transmission errors (Ethernet frames)',
			'Quick difference checking for files where security is irrelevant',
			'Generating very short, fast identifiers for lookup tables'
		],
		concept: {
			title: 'CRC32 (Cyclic Redundancy Check)',
			content: `<p><strong>CRC32</strong> is an error-detecting code, not a cryptographic hash function. It uses polynomial division to generate a 32-bit integer, usually represented as an 8-character hexadecimal string.</p>
			<p>It was specifically designed to detect accidental changes to raw data, such as bit-flips caused by noisy network cables or scratched hard drives. It is incredibly fast and operates at the hardware level in many network interfaces.</p>
			<p>CRC32 offers <strong>zero security</strong>. It is trivial for an attacker to intentionally alter a file and append a few bytes to ensure the CRC32 checksum remains exactly the same. Never use it to prevent malicious tampering.</p>`
		},
		examples: [
			{
				label: 'Standard CRC32',
				code: 'Input: "123456789"\nCRC32: cbf43926',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why use CRC32 when MD5 is also fast?',
				answer: '<p>CRC32 is even faster than MD5 and requires much less overhead. Its output is only 8 characters long, making it highly efficient for embedded systems, network packet headers, and file formats like ZIP and PNG where space and speed are critical.</p>'
			},
			{
				question: 'Can CRC32 detect all errors?',
				answer: '<p>No. While it is excellent at detecting single-bit errors, double-bit errors, and burst errors common in telecommunications, it cannot guarantee detection of complex, multi-byte corruption. The probability of an accidental collision is 1 in 4.3 billion (2<sup>32</sup>).</p>'
			}
		],
		tips: [
			'CRC32 has many different polynomial variants (e.g., CRC-32C, CRC-32/MPEG-2). Standard ZIP files and Ethernet use the IEEE 802.3 polynomial, which is what this tool implements.',
			'If you need to verify a massive file quickly and don\'t care about hackers, CRC32 is your best option.'
		],
		commonMistakes: [
			'Using CRC32 to verify that a downloaded software binary wasn\'t altered by a hacker.',
			'Confusing CRC32 output (8 chars) with a truncated MD5 output.'
		],
		relatedTools: [
			{ name: 'File Checksum', path: '/hash/file-checksum', description: 'Use stronger algorithms to verify file downloads.' }
		]
	},
	'identifier': {
		lastUpdated: '2026-05-07',
		features: [
			'Analyze hash length, character sets, and formatting',
			'Detect likely algorithms (MD5, SHA-1, SHA-256, bcrypt, NTLM, etc.)',
			'Identify common password hash formats (Unix crypt, LDAP)',
			'Check for salts, iterations, or potential Base64 encoding',
			'Client-side analysis of leaked hashes'
		],
		useCases: [
			'Determining what hashing logic a legacy application used',
			'Identifying the format of hashes found in leaked database dumps',
			'CTF (Capture The Flag) cybersecurity competitions',
			'Reverse engineering undocumented APIs',
			'Auditing database security and password storage mechanisms'
		],
		concept: {
			title: 'Understanding Hash Identification',
			content: `<p>A hash is essentially just a string of bytes. Because they are often encoded as hexadecimal or Base64, determining exactly which algorithm produced a given string can be challenging. Hash identification tools use heuristics, pattern matching, and length checks to provide educated guesses.</p>
			<p><strong>Identification Factors:</strong></p>
			<ul>
				<li><strong>Length:</strong> A 32-character hex string represents 128 bits (likely MD5 or MD4). A 64-character hex string is 256 bits (likely SHA-256).</li>
				<li><strong>Character Set:</strong> Is it strictly hexadecimal (0-9, a-f)? Does it include upper and lowercase letters with symbols (likely Base64 or bcrypt)?</li>
				<li><strong>Prefixes/Signatures:</strong> Many modern password hashes use Modular Crypt Format (MCF). For example, a hash starting with <code>$2a$</code> or <code>$2b$</code> is bcrypt. A hash starting with <code>$6$</code> is SHA-512 crypt.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Bcrypt Hash Example',
				code: 'Input: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy\nResult: Identified as bcrypt (Blowfish)',
				isValid: true
			},
			{
				label: 'Ambiguous 32-character Hex',
				code: 'Input: 5d41402abc4b2a76b9719d911017c592\nResult: Possible algorithms include MD5, MD4, NTLM, MD2.',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can the identifier guess 100% correctly?',
				answer: '<p>No. Many algorithms produce hashes of the exact same length and format. For example, a 32-character hexadecimal string could be MD5, MD4, or an NTLM Windows password hash. The tool provides the most probable candidates, but context is required to know for sure.</p>'
			},
			{
				question: 'What does a hash starting with $ mean?',
				answer: '<p>This is likely the Modular Crypt Format (MCF), a standard used primarily on Unix/Linux systems to store passwords. The string between the first and second `$` indicates the algorithm (e.g., 1 for MD5, 5 for SHA-256, 6 for SHA-512, 2a for bcrypt). The next segment is usually the cost factor or salt.</p>'
			}
		],
		tips: [
			'If you encounter a hash ending in one or two `=` symbols, it is almost certainly Base64 encoded. Decode it from Base64 to Hex first to determine its true length and likely algorithm.',
			'In Windows environments, 32-character hex strings are frequently NTLM hashes, not MD5.'
		],
		commonMistakes: [
			'Assuming a 64-character string is definitely SHA-256. It could be a 32-character password that was accidentally hashed twice, or a completely different 256-bit algorithm like BLAKE2s or SHA-3-256.',
			'Trying to identify a hash without removing leading or trailing whitespace first.'
		],
		relatedTools: [
			{ name: 'Hash Generator', path: '/hash/generator', description: 'Generate samples of different hash formats to compare.' },
			{ name: 'Base64 Decoder', path: '/base64/encode-decode', description: 'Decode Base64 encoded hashes.' }
		]
	},
	'compare': {
		lastUpdated: '2026-05-07',
		features: [
			'Side-by-side hash comparison for quick visual verification',
			'Automatic case-insensitive matching (handles uppercase vs lowercase hex)',
			'Automatic whitespace and newline trimming',
			'Clear visual diff indicators (Green/Red validation)',
			'Client-side processing for privacy'
		],
		useCases: [
			'Manually verifying a downloaded Linux ISO or software binary',
			'Comparing a generated webhook signature against an expected signature',
			'Checking if two files are identical by comparing their MD5 or SHA-256 hashes',
			'Debugging encoding issues across different systems'
		],
		concept: {
			title: 'Understanding Hash Comparison',
			content: `<p>A core property of cryptographic hashing is that hashes must match <strong>exactly</strong>. A single bit difference in the source data results in a completely different hash string (the avalanche effect). Therefore, comparing hashes is the definitive way to prove two pieces of data are identical without comparing the data itself.</p>
			<p>However, hash <em>strings</em> can sometimes differ in their visual representation without altering their underlying byte value. For example, <code>AABBCC</code> (uppercase hexadecimal) represents the exact same bytes as <code>aabbcc</code> (lowercase). Furthermore, copying a hash from a website often accidentally includes trailing spaces or hidden newline characters.</p>
			<p>This tool normalizes the text (removing whitespace and unifying case) before performing a strict comparison, preventing false negatives caused by formatting artifacts.</p>`
		},
		examples: [
			{
				label: 'Case Insensitive Match',
				code: 'Hash A: 5D41402ABC4B2A76B9719D911017C592\nHash B: 5d41402abc4b2a76b9719d911017c592\nResult: Match (Valid)',
				isValid: true
			},
			{
				label: 'Mismatch',
				code: 'Hash A: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\nHash B: 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9825\nResult: Mismatch (Invalid)',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'If two hashes match, are the files definitely identical?',
				answer: '<p>For SHA-256 or SHA-512, yes, you can be mathematically certain the files are identical. For MD5 or SHA-1, it is extremely likely they are identical, unless you are dealing with a highly sophisticated attacker who has intentionally engineered a collision attack.</p>'
			},
			{
				question: 'Why does my hash comparison fail even though they look similar?',
				answer: '<p>Ensure you are comparing the exact same algorithm output. Comparing an MD5 hash to a SHA-256 hash will always fail. Also, check if one hash is Base64 encoded while the other is Hexadecimal encoded.</p>'
			}
		],
		tips: [
			'When manually checking hashes from software download pages, always use this tool rather than "eyeballing" it. Humans are notoriously bad at spotting a single changed character in a 64-character string.'
		],
		commonMistakes: [
			'Using `===` in JavaScript or `==` in Python to compare hashes without normalizing to lowercase first, leading to unexpected failures in authentication scripts.',
			'Comparing hashes of files generated on Windows vs Linux without accounting for line ending differences (CRLF vs LF), which will produce completely different hashes.'
		],
		relatedTools: [
			{ name: 'File Checksum', path: '/hash/file-checksum', description: 'Generate the hash of a file to compare.' },
			{ name: 'String Compare', path: '/text/string-compare', description: 'Visually highlight the exact character differences between two long strings.' }
		]
	},
	'file-checksum': {
		lastUpdated: '2026-05-07',
		features: [
			'100% Client-side file processing (Upload-free and secure)',
			'Supports huge files (Gigabytes in size) via chunked reading',
			'Generates MD5, SHA-1, SHA-256, and SHA-512 checksums',
			'Progress bar visualization for large file processing',
			'Auto-compare input to instantly verify against an expected hash',
			'Drag and drop interface support'
		],
		useCases: [
			'Verifying Linux OS ISO downloads to ensure they haven\'t been tampered with',
			'Checking large game patches or mod archives for integrity',
			'Validating database backup restorations before deploying them',
			'Ensuring secure transfer of sensitive documents or forensic evidence'
		],
		concept: {
			title: 'Understanding File Checksums',
			content: `<p>A <strong>checksum</strong> is a cryptographic hash generated from the raw bytes of a file. When downloading large files or sensitive software from the internet, data can be altered by network errors, broken connections, or malicious man-in-the-middle attacks.</p>
			<p>Software publishers often provide a checksum (usually a SHA-256 hash) next to the download link. By using this tool to compute the hash of your locally downloaded file and comparing it to the publisher's hash, you prove that <strong>every single bit</strong> of your local file is identical to the original.</p>
			<p><strong>Browser Security:</strong> Modern browsers support the Web Crypto API, allowing this tool to read your file directly from your hard drive into memory, calculate the hash, and discard the memory. The file never travels over the network, guaranteeing total privacy and enabling the processing of files much larger than your internet upload speed could handle.</p>`
		},
		examples: [
			{
				label: 'Typical Verification Workflow',
				code: '1. Download Ubuntu Linux ISO (3GB)\n2. Copy the SHA256 string from the Ubuntu website\n3. Drag the ISO file into this tool\n4. Paste the expected hash into the "Compare" box\n5. Tool confirms the file is authentic and uncorrupted.',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is my file uploaded to a server?',
				answer: '<p>No. Your file is read locally by your web browser using HTML5 File APIs. It never leaves your device. You can verify this by disconnecting from the internet and the tool will still work perfectly.</p>'
			},
			{
				question: 'Why does hashing a large file take time?',
				answer: '<p>Hashing requires mathematical operations to be performed on every single byte of the file. A 5GB file contains 5 billion bytes. While algorithms are fast, the speed is largely bottlenecked by how fast your computer\'s hard drive (SSD/HDD) can read the data into memory.</p>'
			},
			{
				question: 'What does it mean if the checksum fails?',
				answer: '<p>It means the file you downloaded is not identical to the file the publisher released. This could be due to an incomplete download, network corruption, or worst-case, the file was intercepted and replaced with malware. You should delete the file and download it again.</p>'
			}
		],
		tips: [
			'If you download software from a third-party mirror site, always verify the checksum against the hash published on the <em>official developer\'s website</em> to ensure the mirror hasn\'t inserted malware.',
			'For forensic analysis, generating a SHA-256 hash of a hard drive image establishes a chain of custody, proving the evidence was not altered after acquisition.'
		],
		commonMistakes: [
			'Assuming that because a file opens correctly (like a video playing), it is perfectly intact. Minor corruption can alter a checksum without completely breaking the file format.',
			'Hashing a `.zip` file, extracting it, hashing the extracted contents, and expecting the hashes to match. Hashing the container is different from hashing the contents.'
		],
		relatedTools: [
			{ name: 'Compare Hashes', path: '/hash/compare', description: 'Tool to manually compare two text hashes.' },
			{ name: 'Hash Generator', path: '/hash/generator', description: 'Generate hashes from standard text strings instead of files.' }
		]
	},
	'lookup': {
		lastUpdated: '2026-05-07',
		features: [
			'Reverse lookup capabilities for common MD5 and SHA-1 hashes',
			'Simulated checks against massive rainbow table databases',
			'Identify weak, commonly used passwords instantly',
			'Fast client-side logic for common strings',
			'Educational feedback on password vulnerabilities'
		],
		useCases: [
			'Checking if your password has been exposed in previous data breaches',
			'Recovering lost data or passwords from legacy MD5 database dumps',
			'Auditing internal database security to flag users with easily crackable passwords',
			'Understanding the mechanics of rainbow table attacks in cybersecurity training'
		],
		concept: {
			title: 'Rainbow Tables & Reverse Lookups',
			content: `<p>Because cryptographic hashing is a one-way mathematical function, you cannot simply "decrypt" a hash to find the original text. However, attackers use a workaround: they compute the hashes for millions of common passwords (like "123456", "password", "qwerty") and store them in massive databases called <strong>Rainbow Tables</strong>.</p>
			<p>When an attacker steals a database of hashed passwords, they simply query their rainbow table. If the stolen hash matches a hash in their table, they instantly know the original password.</p>
			<p>This tool simulates a reverse lookup against common weak passwords. If a hash can be "reversed" here, it means the original input is dangerously weak and highly vulnerable to automated cracking attacks.</p>`
		},
		examples: [
			{
				label: 'Successful MD5 Lookup (Weak Password)',
				code: 'Input Hash: 5f4dcc3b5aa765d61d8327deb882cf99\nResult: "password" (Found in dictionary)',
				isValid: true
			},
			{
				label: 'Failed Lookup (Strong/Salted Password)',
				code: 'Input Hash: 8b1a9953c4611296a827abf8c47804d7\nResult: Not found. The original text is too complex or salted.',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'Can you crack any hash?',
				answer: '<p>No. We only check the input against a dictionary of highly common passwords and words. If the original text was complex (e.g., "M!k3s_S3cur3_P@ssw0rd"), it will not exist in a rainbow table and cannot be reversed by this tool.</p>'
			},
			{
				question: 'How do websites protect against rainbow tables?',
				answer: '<p>They use a technique called <strong>Salting</strong>. A random string of characters (the salt) is generated for each user and appended to their password before hashing. Even if two users have the password "123456", their hashes will be completely different because their salts are different. This renders pre-computed rainbow tables completely useless.</p>'
			},
			{
				question: 'Is it legal to crack hashes?',
				answer: '<p>Reverse lookup tools are educational and defensive. It is legal to audit your own hashes or hashes you have explicit permission to test (e.g., in a penetration test). Attempting to crack hashes from stolen databases without authorization is illegal.</p>'
			}
		],
		tips: [
			'If you are building an authentication system, never rely on raw MD5 or SHA-256. Use bcrypt or Argon2, which handle salting automatically and are resistant to GPU-based brute force attacks.',
			'Use password managers to generate long, random passwords that will never appear in any reverse-lookup dictionary.'
		],
		commonMistakes: [
			'Believing that a hash function is secure just because this specific lookup tool failed to crack it. Dedicated hackers have rainbow tables terabytes in size.',
			'Using a "global" salt for all users instead of generating a unique salt per user. A global salt still allows attackers to build a custom rainbow table specifically for your application.'
		],
		relatedTools: [
			{ name: 'Password Tester', path: '/security/password', description: 'Check the strength and entropy of your passwords.' },
			{ name: 'Hash Generator', path: '/hash/generator', description: 'Generate hashes to test against the lookup tool.' }
		]
	},
	'hmac': {
		lastUpdated: '2026-05-07',
		features: [
			'Generate Keyed-Hash Message Authentication Codes (HMAC)',
			'Supports HMAC-SHA256, HMAC-SHA512, and HMAC-MD5',
			'Separate inputs for Secret Key and Message Payload',
			'Standard compliance with RFC 2104',
			'Instantly verify API webhook signatures'
		],
		useCases: [
			'Debugging API webhooks from services like Stripe, GitHub, or Slack which use HMAC for authentication',
			'Manually generating JSON Web Token (JWT) signatures for testing',
			'Verifying the authenticity and integrity of messages sent over untrusted networks',
			'Securing IoT device communications with symmetric keys'
		],
		concept: {
			title: 'HMAC (Hash-based Message Authentication Code)',
			content: `<p>A standard cryptographic hash (like SHA-256) guarantees data <strong>integrity</strong> (the data hasn't changed). However, it does not guarantee <strong>authenticity</strong>. Anyone can alter a message and simply generate a new standard hash for it.</p>
			<p><strong>HMAC</strong> solves this by combining the hash function with a secret cryptographic key shared only between the sender and receiver. The algorithm mixes the secret key with the message data before hashing it.</p>
			<p>When the receiver gets the message and the HMAC signature, they recompute the HMAC using their copy of the secret key. If the signatures match, it proves two things simultaneously: the message was not altered in transit (integrity), AND it was sent by someone who possesses the secret key (authenticity).</p>`
		},
		examples: [
			{
				label: 'HMAC-SHA256 Signature Generation',
				code: 'Secret Key: "my-super-secret-key"\nMessage: \'{"user_id": 123, "action": "delete"}\'\nAlgorithm: SHA-256\nResult (Hex): 91d37b607ab9b23173d6bfa84672bb664df670d853155ebf0653d8ea71f5af7e',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How does Stripe or GitHub use HMAC?',
				answer: '<p>When a payment succeeds, Stripe sends an HTTP POST request (a webhook) to your server. To prove the request actually came from Stripe and not a malicious hacker, Stripe generates an HMAC signature of the payload using a secret key they gave you. Your server re-generates the HMAC using the payload and your secret key. If they match, the webhook is authentic.</p>'
			},
			{
				question: 'Is HMAC encryption?',
				answer: '<p>No. HMAC is for authentication and integrity, not confidentiality. The message payload is still sent in plain text (unless sent over HTTPS). HMAC just guarantees that the plain text wasn\'t tampered with and was sent by a trusted party.</p>'
			},
			{
				question: 'Can I use any string as an HMAC key?',
				answer: '<p>Yes, but for maximum security, the key should be completely random and at least as long as the hash output size (e.g., 32 bytes/256 bits for HMAC-SHA256).</p>'
			}
		],
		tips: [
			'When comparing HMAC signatures in your application code, always use a "constant-time" or "timing-safe" string comparison function to prevent timing attacks where attackers guess the signature byte-by-byte.',
			'Never expose your HMAC secret key in frontend JavaScript code. HMAC generation and verification must happen on a secure backend server.'
		],
		commonMistakes: [
			'Appending the key to the message and hashing it manually (e.g., `SHA256(key + message)`). This is vulnerable to "length extension attacks". Always use standard HMAC functions provided by your language\'s crypto library.',
			'Formatting the message differently when generating vs verifying. Even a single extra space in the JSON payload will result in a completely different HMAC signature.'
		],
		relatedTools: [
			{ name: 'SHA-256', path: '/hash/sha256', description: 'The underlying hash function used in HMAC-SHA256.' },
			{ name: 'JWT Decoder', path: '/jwt/decoder', description: 'JSON Web Tokens rely heavily on HMAC for signature verification.' }
		]
	},
	'converter': {
		lastUpdated: '2026-05-07',
		features: [
			'Convert hash formats between Hexadecimal and Base64',
			'Change casing (Uppercase/Lowercase)',
			'Add or remove delimiter formatting (colons, spaces, `0x`)',
			'Convert hash digests into raw binary strings',
			'Client-side execution for immediate formatting'
		],
		useCases: [
			'Formatting hashes to meet specific API or database requirements',
			'Converting an SSL certificate fingerprint (e.g., `A1:B2:C3...`) into a continuous string',
			'Translating a Base64-encoded digest sent in an HTTP header back to readable Hex',
			'Standardizing log outputs for security information and event management (SIEM) systems'
		],
		concept: {
			title: 'Understanding Hash Encodings',
			content: `<p>A cryptographic hash algorithm outputs raw binary data (a sequence of bytes). Because raw bytes cannot be easily displayed on a screen or typed into a JSON file, the binary data must be <strong>encoded</strong> into printable characters.</p>
			<ul>
				<li><strong>Hexadecimal (Hex):</strong> The most common encoding. It uses 16 characters (0-9, a-f). Each byte of the hash is represented by exactly 2 hex characters. A 32-byte SHA-256 hash becomes a 64-character hex string.</li>
				<li><strong>Base64:</strong> A more compact encoding used frequently in web protocols and APIs. It uses 64 characters (A-Z, a-z, 0-9, +, /). A 32-byte SHA-256 hash becomes a 44-character Base64 string ending with an <code>=</code> padding character.</li>
			</ul>
			<p>Converting between Hex and Base64 does not change the actual hash value; it only changes how it is visually represented.</p>`
		},
		examples: [
			{
				label: 'Hex to Base64 Conversion',
				code: 'Original (Hex): b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9\nConverted (Base64): uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=',
				isValid: true
			},
			{
				label: 'Formatting a Fingerprint',
				code: 'Original: a3:b9:c1:4f:99\nConverted (Raw Hex): a3b9c14f99',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does my API require a Base64 hash instead of Hex?',
				answer: '<p>Base64 is roughly 33% more compact than Hexadecimal. When sending hashes in HTTP headers (like AWS S3\'s `Content-MD5` header), Base64 is preferred to save bandwidth and adhere to standard HTTP specifications.</p>'
			},
			{
				question: 'Does changing the case of a Hex hash change its value?',
				answer: '<p>No. In hexadecimal, `a` and `A` both represent the decimal number 10. `a1b2` is mathematically identical to `A1B2`. However, string comparison functions in programming languages will see them as different, which is why formatting is important.</p>'
			}
		],
		tips: [
			'If you see a string ending in `=` or `==`, it is almost certainly Base64 encoded. Convert it to Hex if you need to visually compare it to standard command-line tools like `sha256sum`.',
			'When storing hashes in a database to save space, store the raw binary bytes (using `BINARY` or `BLOB` column types) rather than the Hex string. It uses exactly half the disk space.'
		],
		commonMistakes: [
			'Trying to "decrypt" a Base64 hash. Base64 is just an encoding; decoding it back to Hex does not reverse the hash function to reveal the original password.',
			'Comparing a Hex-encoded string with a Base64-encoded string and assuming the underlying hashes are different.'
		],
		relatedTools: [
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'General purpose Base64 encoding tools.' },
			{ name: 'Hex / Binary', path: '/base64/hex-binary', description: 'Convert text to Hexadecimal and Binary representations.' }
		]
	}
};

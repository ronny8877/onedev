// Base64 Tools Content Configuration
// SEO-optimized content for all Base64-related tools

export interface Base64ToolContent {
	features: string[];
	useCases: string[];
	concept: {
		title: string;
		content: string;
	};
	examples: {
		label: string;
		code: string;
		isValid: boolean;
	}[];
	faqs: {
		question: string;
		answer: string;
	}[];
	relatedTools: {
		name: string;
		path: string;
		description: string;
	}[];
}

export const base64ToolsContent: Record<string, Base64ToolContent> = {
	'encode-decode': {
		features: [
			'Instant Base64 encoding and decoding',
			'Automatic input detection (text or Base64)',
			'Support for UTF-8 text encoding',
			'Character and byte count statistics',
			'Client-side processing (no server uploads)',
			'Copy encoded/decoded output with one click'
		],
		useCases: [
			'Encode credentials for HTTP Basic Authentication',
			'Embed small files in HTML, CSS, or JSON',
			'Decode Base64 strings from API responses',
			'Convert binary data to text-safe format',
			'Share text data in URL-safe format'
		],
		concept: {
			title: 'Understanding Base64 Encoding',
			content: `
				<p><strong>Base64</strong> is a binary-to-text encoding scheme that converts binary data into ASCII text using 64 printable characters. It's widely used for transmitting binary data over text-only channels.</p>
				
				<p><strong>Why Base64?</strong></p>
				<ul>
					<li><strong>Text-safe</strong> - Converts binary data to ASCII characters</li>
					<li><strong>Email compatible</strong> - Works in MIME email attachments</li>
					<li><strong>URL embedding</strong> - Embed images and files in HTML/CSS</li>
					<li><strong>API transmission</strong> - Send binary data in JSON</li>
				</ul>
				
				<p><strong>How it works:</strong> Base64 takes every 3 bytes (24 bits) of input and divides them into four 6-bit groups. Each 6-bit group is mapped to one of 64 characters (A-Z, a-z, 0-9, +, /).</p>
				
				<p><strong>Note:</strong> Base64 increases data size by approximately 33% due to encoding overhead.</p>
			`
		},
		examples: [
			{
				label: 'Encoding text to Base64',
				code: 'Input: Hello, World!\nOutput: SGVsbG8sIFdvcmxkIQ==',
				isValid: true
			},
			{
				label: 'Decoding Base64 string',
				code: 'Input: SGVsbG8sIFdvcmxkIQ==\nOutput: Hello, World!',
				isValid: true
			},
			{
				label: 'Invalid Base64 (incorrect padding)',
				code: 'SGVsbG8sIFdvcmxkIQ=\n// Missing one = padding character',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What is Base64 encoding used for?',
				answer: '<p>Base64 encoding converts binary data into ASCII text, making it safe for transmission over text-only protocols like email, JSON, and XML. Common uses include encoding images for HTML/CSS embedding, transmitting file data in APIs, and encoding credentials for HTTP Basic Authentication.</p>'
			},
			{
				question: 'Does Base64 provide encryption or security?',
				answer: '<p><strong>No.</strong> Base64 is an <em>encoding</em> scheme, not encryption. It makes data text-safe but offers zero security. Anyone can decode Base64 instantly. Never use Base64 alone to protect sensitive data—use proper encryption instead.</p>'
			},
			{
				question: 'Why does Base64 increase file size?',
				answer: '<p>Base64 encoding increases data size by approximately 33%. This happens because it converts every 3 bytes (24 bits) into 4 Base64 characters (32 bits). The overhead is necessary to ensure the output uses only printable ASCII characters.</p>'
			},
			{
				question: 'What are the = characters at the end of Base64 strings?',
				answer: '<p>The <code>=</code> characters are <strong>padding</strong>. Base64 processes data in 3-byte chunks. If the input isn\'t divisible by 3, padding (= or ==) is added to complete the final group. Some decoders are lenient with missing padding, but proper Base64 should include it.</p>'
			},
			{
				question: 'Can Base64 encode any type of file?',
				answer: '<p>Yes! Base64 can encode any binary data—images, PDFs, videos, ZIP files, executables, etc. However, for large files, Base64 is inefficient due to the 33% size increase. It\'s best suited for small files and embedding data directly in text formats.</p>'
			}
		],
		relatedTools: [
			{ name: 'File Encoder', path: '/base64/file-encoder', description: 'Encode files to Base64' },
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate Base64 strings' },
			{ name: 'URL-safe Converter', path: '/base64/url-safe', description: 'Convert to URL-safe format' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'Format JSON for encoding' }
		]
	},

	'file-encoder': {
		features: [
			'Encode any file type to Base64',
			'Drag-and-drop file upload',
			'Live file size and Base64 size preview',
			'Support for images, PDFs, ZIP files, and more',
			'Client-side encoding (files never leave your browser)',
			'Copy Base64 output or download as .txt file'
		],
		useCases: [
			'Embed images in HTML img src attributes',
			'Send binary files through JSON APIs',
			'Include logos and assets in email templates',
			'Convert fonts for CSS @font-face embedding',
			'Create data URIs for inline CSS backgrounds'
		],
		concept: {
			title: 'File to Base64 Conversion',
			content: `
				<p><strong>File to Base64 encoding</strong> converts any file's binary content into a text-safe Base64 string that can be embedded directly in HTML, CSS, JSON, or transmitted via APIs.</p>
				
				<p><strong>Common use cases:</strong></p>
				<ul>
					<li><strong>Data URIs</strong> - <code>data:image/png;base64,iVBORw0KG...</code></li>
					<li><strong>HTML embedding</strong> - <code>&lt;img src="data:image/png;base64,..."/&gt;</code></li>
					<li><strong>CSS backgrounds</strong> - <code>background-image: url(data:...)</code></li>
					<li><strong>API payloads</strong> - Send files in JSON without multipart/form-data</li>
				</ul>
				
				<p><strong>File size considerations:</strong> Base64 encoding increases file size by ~33%. A 100KB image becomes ~133KB when encoded. For large files, direct file uploads are more efficient.</p>
				
				<p><strong>Best practices:</strong> Use file-to-Base64 for small assets (<50KB) that need to be embedded. For larger files, use standard file uploads or CDN hosting.</p>
			`
		},
		examples: [
			{
				label: 'Small image encoded to data URI',
				code: 'File: logo.png (2.3 KB)\nBase64: iVBORw0KGgoAAAANSUhEUgAAAAUA...\nData URI: data:image/png;base64,iVBORw0KG...',
				isValid: true
			},
			{
				label: 'PDF file for API transmission',
				code: 'File: document.pdf (15 KB)\nBase64: JVBERi0xLjQKJeLjz9MKMSAwIG9ia...\nUse in JSON: {"file": "JVBERi0xLjQKJe..."}',
				isValid: true
			},
			{
				label: 'Large file - not recommended for Base64',
				code: 'File: video.mp4 (50 MB)\n// Too large! Base64 would be ~67 MB\n// Use direct upload instead',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What file types can I convert to Base64?',
				answer: '<p>You can convert <strong>any file type</strong> to Base64—images (PNG, JPG, GIF, SVG), documents (PDF, DOC), archives (ZIP, RAR), fonts (TTF, W OFF), videos, executables, and more. Base64 treats all files as binary data regardless of format.</p>'
			},
			{
				question: 'How do I use Base64-encoded images in HTML?',
				answer: '<p>Use a <strong>data URL</strong> in the <code>src</code> attribute:</p><pre>&lt;img src="data:image/png;base64,iVBORw0KGgo..." alt="Logo"&gt;</pre><p>The format is: <code>data:[MIME-type];base64,[BASE64-data]</code></p>'
			},
			{
				question: 'What\'s the maximum file size I should encode to Base64?',
				answer: '<p>For <strong>browser performance</strong>, keep Base64-encoded files under <strong>50-100KB</strong>. Larger files cause longer encoding times, increased memory usage, and bloated HTML/CSS. For files >100KB, use direct uploads or CDN hosting instead.</p>'
			},
			{
				question: 'Are my files uploaded to a server?',
				answer: '<p><strong>No.</strong> All file encoding happens <strong>client-side</strong> in your browser using JavaScript. Your files never leave your computer, ensuring complete privacy and security. The tool uses the browser\'s FileReader API to process files locally.</p>'
			},
			{
				question: 'Can I decode Base64 back to the original file?',
				answer: '<p>Yes! Use a Base64 decoder to convert the Base64 string back to binary data, then save it with the correct file extension. Our <strong>Encode/Decode</strong> tool supports this, or you can use the browser\'s <code>atob()</code> function with <code>Blob</code> APIs.</p>'
			}
		],
		relatedTools: [
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Standard Base64 encoding' },
			{ name: 'Image Preview', path: '/base64/image-preview', description: 'Preview Base64 images' },
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate encoded files' }
		]
	},

	'image-preview': {
		features: [
			'Instant Base64 image preview',
			'Support for PNG, JPG, GIF, WebP, SVG',
			'Display image dimensions and file size',
			'Detect and show MIME type',
			'Download decoded image',
			'Validate Base64 image data'
		],
		useCases: [
			'Preview data URI images before embedding',
			'Verify Base64 images from API responses',
			'Debug email template images',
			'Convert Base64 back to downloadable images',
			'Extract images from JSON/XML data'
		],
		concept: {
			title: 'Base64 Image Decoding and Preview',
			content: `
				<p><strong>Base64 image preview</strong> decodes Base64-encoded image data and renders it visually in your browser. This is useful for verifying images embedded in code, APIs, or databases.</p>
				
				<p><strong>Supported formats:</strong></p>
				<ul>
					<li><strong>PNG</strong> - Lossless compression, supports transparency</li>
					<li><strong>JPEG/JPG</strong> - Lossy compression, smaller file sizes</li>
					<li><strong>GIF</strong> - Animations and transparency</li>
					<li><strong>WebP</strong> - Modern format, excellent compression</li>
					<li><strong>SVG</strong> - Vector graphics, scalable without quality loss</li>
				</ul>
				
				<p><strong>Data URI format:</strong> Base64 images in HTML use the format <code>data:image/png;base64,iVBORw0KG...</code>. You can paste either just the Base64 string or the full data URI.</p>
				
				<p><strong>Use cases:</strong> Debugging embedded images, extracting images from JSON APIs, verifying image data before using it in production code.</p>
			`
		},
		examples: [
			{
				label: 'Valid PNG image data URL',
				code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...\n// Decodes to a 5x5px PNG image',
				isValid: true
			},
			{
				label: 'Base64 image string without data URI prefix',
				code: '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQE...\n// JPEG image, missing "data:image/jpeg;base64," prefix\n// Tool auto-detects and adds it',
				isValid: true
			},
			{
				label: 'Invalid Base64 image data',
				code: 'data:image/png;base64,NotValidBase64!!!\n// Invalid characters, cannot decode',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'How do I extract the MIME type from a Base64 image?',
				answer: '<p>If the Base64 string includes the <strong>data URI prefix</strong> (<code>data:image/png;base64,...</code>), the MIME type is between <code>data:</code> and <code>;base64</code>. Our tool automatically detects it. If there\'s no prefix, the tool attempts to identify the format by inspecting the binary header (magic bytes).</p>'
			},
			{
				question: 'Can I download the decoded image?',
				answer: '<p>Yes! Once the Base64 image is decoded and displayed, you can right-click the preview and select <strong>"Save Image As..."</strong> to download it. Some tools also provide a dedicated "Download" button that saves the image with the correct file extension.</p>'
			},
			{
				question: 'What if my Base64 image doesn\'t display?',
				answer: '<p>Common issues: <strong>(1)</strong> Invalid Base64 characters, <strong>(2)</strong> incorrect padding (missing =), <strong>(3)</strong> wrong MIME type prefix, or <strong>(4)</strong> corrupted binary data. Use our <strong>Validator</strong> tool to check if the Base64 string is properly formatted.</p>'
			},
			{
				question: 'Do Base64 images load slower than regular images?',
				answer: '<p>Base64 images embedded in HTML/CSS load <strong>faster initially</strong> (no separate HTTP request) but increase page size by ~33%. For many small images, this eliminates connection overhead. For large images, traditional <code>&lt;img src="url"&gt;</code> with caching is more efficient.</p>'
			},
			{
				question: 'Can I preview SVG images from Base64?',
				answer: '<p>Yes! SVG (Scalable Vector Graphics) can be Base64-encoded and previewed. The data URI format is <code>data:image/svg+xml;base64,...</code>. SVGs remain vector-based even when Base64-encoded, so they scale without quality loss.</p>'
			}
		],
		relatedTools: [
			{ name: 'File Encoder', path: '/base64/file-encoder', description: 'Encode images to Base64' },
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Decode Base64 strings' },
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate image data' }
		]
	},

	'url-safe': {
		features: [
			'Convert between standard and URL-safe Base64',
			'Automatic format detection',
			'Replace + with - and / with _ (RFC 4648)',
			'Handle padding differences',
			'Bi-directional conversion',
			'Copy converted output instantly'
		],
		useCases: [
			'Encode data for transmission in URLs',
			'Convert JWT tokens to URL-safe format',
			'Fix Base64 strings in query parameters',
			'Create URL-friendly file identifiers',
			'Prepare Base64 for use in HTML attributes'
		],
		concept: {
			title: 'URL-Safe Base64 Encoding',
			content: `
				<p><strong>URL-safe Base64</strong> is a variant of Base64 that replaces characters which have special meaning in URLs. This prevents encoding issues when Base64 data is used in URLs, query parameters, or file names.</p>
				
				<p><strong>Character replacements (RFC 4648):</strong></p>
				<ul>
					<li><strong>+</strong> (plus) → <strong>-</strong> (minus/hyphen)</li>
					<li><strong>/</strong> (slash) → <strong>_</strong> (underscore)</li>
					<li><strong>=</strong> (padding) → Often omitted or preserved</li>
				</ul>
				
				<p><strong>Why URL-safe Base64?</strong> Standard Base64 uses + and /, which have special meanings in URLs. The + character becomes a space when URL-decoded, and / is a path separator. These issues break Base64 data in URLs.</p>
				
				<p><strong>Common in:</strong> JWT tokens, OAuth2 tokens, URL parameters with encoded data, RESTful API identifiers, cookie values.</p>
				
				<p><strong>Note:</strong> Both formats are Base64, just with different characters. The underlying data is identical.</p>
			`
		},
		examples: [
			{
				label: 'Standard Base64 to URL-safe',
				code: 'Standard: SGVsbG8rV29ybGQvMTIz\nURL-safe: SGVsbG8tV29ybGQvMTIz\n// + → -, / → _',
				isValid: true
			},
			{
				label: 'URL-safe to Standard Base64',
				code: 'URL-safe: aGVsbG8_d29ybGQ-\nStandard: aGVsbG8/d29ybGQ+\n// - → +, _ → /',
				isValid: true
			},
			{
				label: 'JWT token (URL-safe Base64)',
				code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0\n// No + or / characters, safe for URLs',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'When should I use URL-safe Base64?',
				answer: '<p>Use URL-safe Base64 whenever the encoded data will appear in <strong>URLs</strong>, <strong>query parameters</strong>, <strong>file names</strong>, or <strong>HTTP headers</strong>. Examples: JWT tokens, OAuth2 tokens, URL shorteners, API keys in URLs, or any identifier in a REST API path.</p>'
			},
			{
				question: 'Is URL-safe Base64 compatible with standard Base64?',
				answer: '<p>Yes! The encoding is identical—only the characters differ. You can convert between them by replacing <code>+</code>↔<code>-</code> and <code>/</code>↔<code>_</code>. Most Base64 libraries support both formats. The decoded binary data is exactly the same.</p>'
			},
			{
				question: 'Do I need to remove padding (=) for URL-safe Base64?',
				answer: '<p>It depends. <strong>RFC 4648</strong> allows padding to be omitted in URL-safe Base64 since it can be inferred from the data length. JWT tokens, for example, omit padding. However, some libraries require padding. Test with your specific use case.</p>'
			},
			{
				question: 'Why do JWT tokens use URL-safe Base64?',
				answer: '<p>JWT tokens are often transmitted in <strong>URLs</strong> (query parameters) or <strong>HTTP headers</strong> (Authorization: Bearer). URL-safe Base64 ensures the token doesn\'t break due to special characters like + and / being misinterpreted by browsers or servers.</p>'
			},
			{
				question: 'Can I use URL-safe Base64 in HTML attributes?',
				answer: '<p>Yes! URL-safe Base64 is also <strong>HTML-attribute-safe</strong>. The characters <code>-</code> and <code>_</code> don\'t require escaping in HTML, unlike <code>+</code> and <code>/</code>. This makes it ideal for data attributes, hidden inputs, and meta tags.</p>'
			}
		],
		relatedTools: [
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Standard Base64 encoding' },
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate URL-safe Base64' },
			{ name: 'Hex/Binary Converter', path: '/base64/hex-binary', description: 'Convert to hex/binary' }
		]
	},

	'validator': {
		features: [
			'Validate Base64 string format',
			'Detect invalid characters',
			'Check padding correctness',
			'Identify encoding issues',
			'Real-time validation as you type',
			'Detailed error messages with line/column info'
		],
		useCases: [
			'Verify Base64 strings before decoding',
			'Debug API responses with Base64 data',
			'Check Base64 integrity after transmission',
			'Validate user-submitted Base64 input',
			'Test Base64 encoding implementations'
		],
		concept: {
			title: 'Base64 Validation Rules',
			content: `
				<p><strong>Base64 validation</strong> checks if a string conforms to Base64 encoding rules. Invalid Base64 causes decoding errors, data corruption, or security vulnerabilities.</p>
				
				<p><strong>Valid Base64 rules:</strong></p>
				<ul>
					<li><strong>Character set</strong> - Only A-Z, a-z, 0-9, +, /, and = (padding)</li>
					<li><strong>Padding</strong> - Must end with 0, 1, or 2 <code>=</code> characters</li>
					<li><strong>Length</strong> - Must be divisible by 4 (after padding)</li>
					<li><strong>Whitespace</strong> - Typically ignored but may indicate errors</li>
				</ul>
				
				<p><strong>Common errors:</strong></p>
				<ul>
					<li>Invalid characters (e.g., <code>@</code>, <code>#</code>, <code>!</code>)</li>
					<li>Incorrect padding (too many or missing <code>=</code>)</li>
					<li>Length not divisible by 4</li>
					<li>Whitespace in unexpected places</li>
				</ul>
				
				<p><strong>Why validate?</strong> Invalid Base64 can crash decoders, cause security issues (injection attacks), or silently corrupt data. Always validate Base64 from untrusted sources.</p>
			`
		},
		examples: [
			{
				label: 'Valid Base64 string',
				code: 'SGVsbG8sIFdvcmxkIQ==\n// Length: 20 (divisible by 4)\n// Padding: correct (2x =)',
				isValid: true
			},
			{
				label: 'Invalid character (@)',
				code: 'SGVsbG8@IFdvcmxkIQ==\n// Contains @ which is not in Base64 alphabet',
				isValid: false
			},
			{
				label: 'Incorrect padding',
				code: 'SGVsbG8sIFdvcmxkIQ===\n// Too many = padding characters (should be 0, 1, or 2)',
				isValid: false
			},
			{
				label: 'Length not divisible by 4',
				code: 'SGVsbG8sIFdvcmxk\n// Length: 16 (correct)\nSGVsbG8sIFdvcmxkI\n// Length: 17 (invalid, not divisible by 4)',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'What characters are allowed in Base64?',
				answer: '<p>Standard Base64 uses <strong>64 characters</strong>: uppercase A-Z (26), lowercase a-z (26), digits 0-9 (10), plus (+), and slash (/). The equals sign (=) is used for padding. URL-safe Base64 replaces + with - and / with _.</p>'
			},
			{
				question: 'Why does my Base64 string fail validation?',
				answer: '<p>Common reasons: <strong>(1)</strong> Invalid characters (check for spaces, tabs, newlines), <strong>(2)</strong> incorrect padding (should be 0, 1, or 2 = characters), <strong>(3)</strong> length not divisible by 4, or <strong>(4)</strong> mixing standard and URL-safe Base64 characters.</p>'
			},
			{
				question: 'Should Base64 strings contain newlines or spaces?',
				answer: '<p><strong>No.</strong> Strict Base64 has no whitespace. However, some formats (like PEM certificates) split Base64 into 64-character lines for readability. Most decoders ignore whitespace, but it\'s best to remove it for validation and consistency.</p>'
			},
			{
				question: 'Can Base64 validation detect corrupted data?',
				answer: '<p><strong>No.</strong> Validation only checks <em>format</em> (correct characters, padding, length). It cannot detect if the <em>content</em> is corrupted. Even if Base64 is valid, the decoded binary data might be corrupted. Use checksums (MD5, SHA-256) to verify data integrity.</p>'
			},
			{
				question: 'Is URL-safe Base64 valid for standard Base64 validators?',
				answer: '<p><strong>No.</strong> Standard Base64 validators will reject <code>-</code> and <code>_</code> characters as invalid. URL-safe Base64 requires a separate validation rule. Always specify which Base64 variant you\'re validating (standard or URL-safe).</p>'
			}
		],
		relatedTools: [
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Encode and decode Base64' },
			{ name: 'URL-safe Converter', path: '/base64/url-safe', description: 'Convert to URL-safe format' },
			{ name: 'Splitter', path: '/base64/splitter', description: 'Split Base64 into lines' }
		]
	},

	'splitter': {
		features: [
			'Split Base64 into fixed-length lines',
			'Configurable line width (e.g., 64, 76, 80 characters)',
			'PEM certificate format support',
			'Preserve or add line breaks',
			'Join split Base64 back to single line',
			'Copy formatted output'
		],
		useCases: [
			'Format Base64 for PEM certificates',
			'Split Base64 for email embedding (RFC 2045)',
			'Create readable multi-line Base64 in code',
			'Format Base64 for configuration files',
			'Match Git commit or line length limits'
		],
		concept: {
			title: 'Base64 Line Splitting',
			content: `
				<p><strong>Base64 line splitting</strong> divides long Base64 strings into multiple lines of fixed width. This improves readability and meets format requirements for standards like PEM and MIME.</p>
				
				<p><strong>Common line widths:</strong></p>
				<ul>
					<li><strong>64 characters</strong> - PEM certificates and SSH keys</li>
					<li><strong>76 characters</strong> - MIME email encoding (RFC 2045)</li>
					<li><strong>80 characters</strong> - General code formatting</li>
					<li><strong>Custom</strong> - Any width for specific requirements</li>
				</ul>
				
				<p><strong>PEM format example:</strong></p>
				<pre>-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL0UG...
vHxRKYs4h3JZlJYuFWvwxf7aO...
-----END CERTIFICATE-----</pre>
				
				<p><strong>Why split Base64?</strong> Many text formats have line length limits. Email standards limit lines to 76 characters. Code editors use 80-120 character limits. Splitting prevents horizontal scrolling and meets format specifications.</p>
			`
		},
		examples: [
			{
				label: 'Split Base64 into 64-character lines',
				code: 'Original:\nSGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgbG9uZyBCYXNlNjQgc3RyaW5n...\n\nSplit (64 chars/line):\nSGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgbG9uZyBCYXNlNjQgc3RyaW5n\ndGhhdCBuZWVkcyB0byBiZSBzcGxpdCBmb3IgUEVNIGZvcm1hdA==',
				isValid: true
			},
			{
				label: 'PEM certificate format',
				code: '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKL0UG4Nbj0FMA0GCSqGSIb3DQEBBQUAMEUGS\n...\n-----END CERTIFICATE-----',
				isValid: true
			},
			{
				label: 'Single-line Base64 (before splitting)',
				code: 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgdmVyeSBsb25nIEJhc2U2NCBlbmNvZGVkIHN0cmluZyB0aGF0IHdpbGwgYmUgc3BsaXQgaW50byBtdWx0aXBsZSBsaW5lcyBmb3IgYmV0dGVyIHJlYWRhYmlsaXR5IGFuZCBjb21wYXRpYmlsaXR5',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the standard line length for PEM certificates?',
				answer: '<p>PEM (Privacy Enhanced Mail) format uses <strong>64 characters per line</strong>. Certificates and keys are wrapped with <code>-----BEGIN CERTIFICATE-----</code> and <code>-----END CERTIFICATE-----</code> headers, with Base64 content split into 64-character lines between them.</p>'
			},
			{
				question: 'Does splitting Base64 change the encoded data?',
				answer: '<p><strong>No.</strong> Splitting only adds newline characters (<code>\\n</code>). The Base64 characters remain identical. When decoding, most tools ignore whitespace, so split and non-split Base64 decode to the same binary data.</p>'
			},
			{
				question: 'How do I join split Base64 back to a single line?',
				answer: '<p>Remove all newline and whitespace characters. In JavaScript: <code>base64.replace(/\\s+/g, "")</code>. In Python: <code>"".join(base64.split())</code>. Our tool provides a "Join" option to convert split Base64 back to a single line instantly.</p>'
			},
			{
				question: 'Why do email standards use 76-character lines?',
				answer: '<p><strong>RFC 2045 (MIME)</strong> specifies 76 characters per line for email Base64 content. This prevents mail transfer agents from breaking lines arbitrarily, which can corrupt the message. Modern email clients handle this automatically.</p>'
			},
			{
				question: 'Can I use different line lengths for different parts?',
				answer: '<p><strong>No.</strong> Best practice is to use a <strong>consistent line length</strong> throughout the entire Base64 block. Mixing line lengths makes the content harder to parse and may violate format specifications like PEM, which strictly requires 64 characters.</p>'
			}
		],
		relatedTools: [
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate split Base64' },
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Encode content for splitting' },
			{ name: 'File Encoder', path: '/base64/file-encoder', description: 'Encode files to Base64' }
		]
	},

	'hex-binary': {
		features: [
			'Convert Base64 to hexadecimal (hex)',
			'Convert Base64 to binary representation',
			'Reverse conversions (hex/binary to Base64)',
			'Byte-by-byte visualization',
			'Support for uppercase and lowercase hex',
			'Copy hex or binary output with one click'
		],
		useCases: [
			'Debug encoded data at the byte level',
			'Convert Base64 hashes to hex format',
			'Analyze binary protocols and file formats',
			'Compare Base64 with hex representations',
			'Extract raw bytes from Base64 strings'
		],
		concept: {
			title: 'Base64, Hex, and Binary Representations',
			content: `
				<p><strong>Base64, hexadecimal, and binary</strong> are different ways to represent the same binary data. Each has specific use cases and trade-offs.</p>
				
				<p><strong>Encoding comparisons:</strong></p>
				<ul>
					<li><strong>Binary</strong> - Base-2 (0,1), directly shows bits, very verbose</li>
					<li><strong>Hexadecimal (Hex)</strong> - Base-16 (0-9, A-F), compact, human-readable</li>
					<li><strong>Base64</strong> - Base-64 (A-Z, a-z, 0-9, +, /), text-safe, compact</li>
				</ul>
				
				<p><strong>Example (text "Hi"):</strong></p>
				<ul>
					<li><strong>Text:</strong> Hi</li>
					<li><strong>Binary:</strong> 01001000 01101001</li>
					<li><strong>Hex:</strong> 48 69</li>
					<li><strong>Base64:</strong> SGk=</li>
				</ul>
				
				<p><strong>When to use each:</strong> Use <strong>hex</strong> for debugging and hashes (MD5, SHA). Use <strong>Base64</strong> for text transmission (URLs, JSON, email). Use <strong>binary</strong> for low-level analysis and bit manipulation.</p>
			`
		},
		examples: [
			{
				label: 'Base64 to Hex conversion',
				code: 'Base64: SGVsbG8=\nHex: 48 65 6C 6C 6F\n// "Hello" in hexadecimal bytes',
				isValid: true
			},
			{
				label: 'Base64 to Binary conversion',
				code: 'Base64: SGVsbG8=\nBinary: 01001000 01100101 01101100 01101100 01101111\n// "Hello" as binary bits',
				isValid: true
			},
			{
				label: 'Hex to Base64 conversion',
				code: 'Hex: 48656c6c6f\nBase64: SGVsbG8=\n// "Hello" converted from hex to Base64',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between Base64 and hex?',
				answer: '<p><strong>Base64</strong> uses 64 characters (A-Z, a-z, 0-9, +, /) and is more compact than hex. <strong>Hexadecimal (hex)</strong> uses 16 characters (0-9, A-F) and represents each byte as 2 hex digits. Hex is more human-readable; Base64 is more efficient for transmission.</p>'
			},
			{
				question: 'Why convert Base64 to hex for hashes?',
				answer: '<p>Cryptographic hashes like <strong>MD5</strong> and <strong>SHA-256</strong> are traditionally displayed in <strong>hex format</strong>. Converting Base64-encoded hashes to hex makes them recognizable and comparable with standard hash databases and documentation.</p>'
			},
			{
				question: 'Is binary representation useful for anything practical?',
				answer: '<p>Yes! Binary is essential for <strong>bit manipulation</strong>, understanding <strong>binary protocols</strong>, analyzing <strong>file formats</strong> at the byte level, and debugging <strong>network packets</strong>. It shows the exact bits being transmitted or stored.</p>'
			},
			{
				question: 'Can I convert hex to Base64 if hex has spaces?',
				answer: '<p>Yes! Most tools ignore spaces in hex input. Hex is often formatted with spaces for readability (e.g., <code>48 65 6C</code>). The tool removes spaces before conversion, treating <code>48656C</code> and <code>48 65 6C</code> identically.</p>'
			},
			{
				question: 'Why is Base64 more compact than hex?',
				answer: '<p>Base64 encodes 6 bits per character (2<sup>6</sup>=64), while hex encodes 4 bits per character (2<sup>4</sup>=16). For the same data, Base64 is ~33% shorter than hex. Example: 3 bytes → 4 Base64 chars vs. 6 hex chars.</p>'
			}
		],
		relatedTools: [
			{ name: 'Base64 Encode/Decode', path: '/base64/encode-decode', description: 'Standard Base64 operations' },
			{ name: 'URL-safe Converter', path: '/base64/url-safe', description: 'URL-safe Base64 format' },
			{ name: 'Base64 Validator', path: '/base64/validator', description: 'Validate Base64  strings' }
		]
	}
};

// Unique editorial for each category hub. Reviewers and crawlers see this
// as HTML on /json, /hash, and so on, not only a grid of tool cards.

export interface CategoryGuide {
	intro: string;
	whenToUse: string[];
	howItWorks: string;
	pitfalls: string[];
	faqs: Array<{ question: string; answer: string }>;
}

export const categoryGuides: Record<string, CategoryGuide> = {
	json: {
		intro: `<p>JSON is the default payload for APIs, config files, and browser storage. These tools format, validate, compare, and convert JSON in the page you already have open. Nothing is posted to a server, which matters when the payload includes tokens, PII, or internal URLs.</p>
<p>Start with the formatter if the document is minified or you need to see structure. Use the validator when a parser fails and you want the first syntax error with a line number. Diff two responses after an API change. The table and visualizer views help when an array of objects is easier to scan than nested braces.</p>`,
		whenToUse: [
			'Pretty-print a minified API response before you file a bug',
			'Check a hand-edited config for a missing comma or trailing comma',
			'Compare staging and production JSON without uploading either file',
			'Turn a JSON array into a sortable table or export CSV',
			'Generate TypeScript interfaces or Go structs from a sample payload'
		],
		howItWorks: `<p>Every JSON tool here calls <code>JSON.parse</code> and related helpers in your browser. Large documents stay in memory on this tab. We do not stream the text to OneDev or a third-party formatter API.</p>
<p>JSONPath testing evaluates expressions against the parsed object. The type generator infers types from the values it sees, so optional fields that are missing in the sample will not appear. Diff compares parsed structures, not raw strings, so key order and whitespace do not count as changes.</p>`,
		pitfalls: [
			'JSON does not allow trailing commas, comments, or single quotes. Those are JSONC or JavaScript.',
			'A type generator only sees the sample you paste. Null vs missing keys and union types need a human pass.',
			'Duplicate keys are invalid in the spec; engines keep one of them and hide the bug.',
			'Mega-files (tens of megabytes) can freeze a tab. Split the document or use a local CLI for those.'
		],
		faqs: [
			{
				question: 'Is it safe to paste production API responses here?',
				answer: '<p>The text never leaves this browser tab. Still treat secrets with care: a compromised extension could read the page. For highly sensitive dumps, prefer a local editor.</p>'
			},
			{
				question: 'Why does valid JavaScript object literal fail the validator?',
				answer: '<p>JSON is stricter than JS. Keys must be double-quoted, there are no comments or trailing commas, and <code>undefined</code> is not a value. Convert the literal to JSON first.</p>'
			},
			{
				question: 'Formatter vs validator: which should I open?',
				answer: '<p>The formatter pretty-prints and will refuse invalid input. The validator is better when you only need the error location and do not want the document rewritten.</p>'
			}
		]
	},
	pdf: {
		intro: `<p>These PDF tools run with client-side libraries in the browser. You can view, split, merge, compress, watermark, number pages, redact, compare, sign, or build a PDF from images without uploading the file to our servers.</p>
<p>That is the point for contracts, IDs, and medical scans. A hosted "PDF compressor" that asks you to upload is a different trust model. Processing still happens on your machine, so very large files depend on available RAM and may be slower than a desktop app.</p>`,
		whenToUse: [
			'Pull a page range out of a report before you send it',
			'Merge signed pages from different people into one packet',
			'Shrink a scan so it fits an email size limit',
			'Redact names or account numbers before a screenshot leaves your desk',
			'Stamp DRAFT or add page numbers before print'
		],
		howItWorks: `<p>The browser reads the PDF bytes you select, parses pages with a PDF library, and writes a new file for download. Redaction burns pixels in the output; it is not a black box you can lift later. Compression re-encodes streams and images. Compare renders pages and highlights visual differences rather than a full text legal redline.</p>`,
		pitfalls: [
			'Password-protected PDFs cannot be processed until you open them with a tool that supports the password.',
			'Redaction must cover every occurrence. Search the file yourself after you download.',
			'A drawn signature is not the same as a cryptographic digital signature (PAdES / certificates).',
			'Extreme compression can blur small text. Check a page at 100% zoom before you archive it.'
		],
		faqs: [
			{
				question: 'Do you keep a copy of my PDF?',
				answer: '<p>No. The file is read locally and the download is generated locally. Close the tab and the bytes are gone from our app (your browser download folder is yours).</p>'
			},
			{
				question: 'Can I edit paragraphs like a word processor?',
				answer: '<p>No. These tools operate on pages, images, and overlays. For full text editing you still need a PDF editor or the original source document.</p>'
			},
			{
				question: 'Will redaction remove hidden text?',
				answer: '<p>Boxes you draw remove the visible region in the exported file. Hidden text outside those boxes can remain. If the document is sensitive, also flatten and inspect with a PDF inspector.</p>'
			}
		]
	},
	base64: {
		intro: `<p>Base64 turns binary into ASCII so it can travel through JSON, email, or a data URI. These tools encode and decode text, files, and images, convert URL-safe alphabets, validate padding, and split long strings for PEM or source files.</p>
<p>Base64 is encoding, not encryption. Anyone who sees the string can decode it. Use it to embed a small image or ship bytes through a text-only channel, not to hide a password.</p>`,
		whenToUse: [
			'Embed a small icon as a data URI in CSS or Markdown',
			'Decode a JWT-style or HTTP Basic credential you already understand is not a secret store',
			'Convert between standard Base64 and the URL-safe alphabet that replaces + and /',
			'Check padding and illegal characters before an API client fails',
			'Turn a file into Base64 for a fixture in a unit test'
		],
		howItWorks: `<p>Encoding uses the browser's <code>btoa</code> / <code>TextEncoder</code> / FileReader path depending on the tool. Images can be previewed as data URIs. URL-safe mode maps <code>+</code>/<code>/</code> to <code>-</code>/<code>_</code> and may strip padding, which some APIs require.</p>`,
		pitfalls: [
			'UTF-8 text must be encoded as bytes first. Naive btoa on Unicode throws or corrupts characters.',
			'Missing padding (<code>=</code>) is common in JWTs. Validators should allow that when the spec does.',
			'Huge files as Base64 inflate by about 33% and can lock the tab.',
			'Never treat Base64 as a way to protect API keys in frontend code.'
		],
		faqs: [
			{
				question: 'Why is the decoded output garbage?',
				answer: '<p>You may have URL-safe Base64 in a standard decoder, or the string is hex/binary rather than Base64. Try the URL-safe converter or hex tool first.</p>'
			},
			{
				question: 'Is Base64 compression?',
				answer: '<p>No. It increases size. Compress first (gzip, brotli, image codecs), then encode if you must put bytes in JSON.</p>'
			},
			{
				question: 'When do I need URL-safe Base64?',
				answer: '<p>When the string goes in a query parameter, filename, or JWT. Standard Base64 uses + and / which break URLs unless percent-encoded.</p>'
			}
		]
	},
	url: {
		intro: `<p>URLs look simple until query strings, encoding, and length limits show up. These tools encode and decode percent-sequences, parse query maps, build URLs visually, validate parts, generate slugs, normalize for comparison, and check length against common limits.</p>
<p>Encoding is not optional for spaces, non-ASCII, and reserved characters. Decoding twice can corrupt a value that was only encoded once. Normalization helps when two URLs differ only by default ports or sorted query keys.</p>`,
		whenToUse: [
			'Percent-encode a query value that contains spaces or Unicode',
			'Turn a long query string into a table of keys and values',
			'Build a tracking URL without hand-concatenating <code>?</code> and <code>&amp;</code>',
			'Make a blog slug from a title',
			'See why a CDN or browser rejects a URL as too long'
		],
		howItWorks: `<p>Parsing uses the URL and URLSearchParams APIs in the browser. Slug generation lowercases, strips combining marks where possible, and replaces runs of separators. Length checks compare against documented limits (browsers, proxies, and some servers differ). Compare is semantic: it looks at parts, not only string equality.</p>`,
		pitfalls: [
			'encodeURI and encodeURIComponent are not interchangeable. The latter encodes more reserved characters.',
			'Plus signs in query strings may mean spaces (application/x-www-form-urlencoded) or a literal +.',
			'Normalizing https://example.com:443/ is not always what a cache key expects.',
			'A valid URL can still be a phishing lookalike. Validation is syntax, not trust.'
		],
		faqs: [
			{
				question: 'Should I encode the whole URL or only the query values?',
				answer: '<p>Encode each component. Encoding the entire URL including https:// will break it. Path segments and query values have different rules.</p>'
			},
			{
				question: 'What is a slug?',
				answer: '<p>A short, URL-safe label derived from a title, usually lowercase with hyphens. It is for paths, not a full URL.</p>'
			},
			{
				question: 'Why do two URLs that look the same fail compare?',
				answer: '<p>Trailing slashes, http vs https, www, and query key order can all differ. Use the normalizer if you want a canonical form first.</p>'
			}
		]
	},
	image: {
		intro: `<p>Image compression, resize, crop, format conversion, EXIF viewing, color extraction, blur, and simple background removal all happen in the canvas and in-browser codecs. Your photo is not uploaded to an image CDN we control.</p>
<p>That is useful for screenshots with credentials in EXIF GPS, or product shots you are not ready to host. Quality still follows the codec: JPEG is lossy, PNG is better for UI chrome, WebP is often smaller for photos on the web.</p>`,
		whenToUse: [
			'Shrink a PNG screenshot before attaching it to a ticket',
			'Strip GPS and camera EXIF before you publish a photo',
			'Convert a WebP you cannot open in an older editor to PNG',
			'Pull a palette from a brand screenshot',
			'Blur a face or license plate in a demo image'
		],
		howItWorks: `<p>The file is read with FileReader or createImageBitmap, drawn to a canvas, and exported with <code>toBlob</code>. Metadata viewing parses EXIF tags locally. Background removal here is a light/white threshold, not a neural matting model, so it works best on high-contrast product shots.</p>`,
		pitfalls: [
			'Re-saving JPEG multiple times adds generation loss. Keep a lossless original.',
			'Canvas export may drop animation from GIFs.',
			'EXIF orientation can make a photo look rotated until you apply the flag.',
			'White-background removal will eat pale product edges. Tune tolerance and inspect the alpha.'
		],
		faqs: [
			{
				question: 'Is this as good as Photoshop or a cloud BG remover?',
				answer: '<p>No. These are fast local utilities. Hair, glass, and busy backgrounds need a dedicated editor or a model-based service you trust.</p>'
			},
			{
				question: 'Will compression keep EXIF?',
				answer: '<p>Usually not after canvas export. If you need metadata, copy it separately or use a tool that round-trips JPEG markers.</p>'
			},
			{
				question: 'What size limit should I expect?',
				answer: '<p>Very large camera RAWs are not the target. Multi-megapixel JPEG/PNG/WebP are fine on a typical laptop. If the tab hangs, resize first or use a desktop app.</p>'
			}
		]
	},
	qr: {
		intro: `<p>QR and 1D barcode tools generate and read codes entirely in the browser. You can style a QR (dots, corners, colors, logo), encode WiFi and vCard payloads, print SVG, and decode from an image or camera. Barcodes cover CODE128, EAN-13, UPC, CODE39, and similar formats.</p>
<p>A QR is only as trustworthy as the payload. Phones will open whatever URL is inside. Generate codes you control, and scan unknown stickers with the same caution you use for short links.</p>`,
		whenToUse: [
			'Put a URL or WiFi join code on a poster or packaging',
			'Hand someone a vCard at an event without a paper card',
			'Export SVG so print stays sharp at any size',
			'Check that a logo overlay still scans before you order a print run',
			'Read an EAN or CODE128 from a photo when you lack a hardware scanner'
		],
		howItWorks: `<p>Generation builds a matrix (QR) or bar pattern (1D) in JavaScript and draws SVG or raster. Reading uses a camera or image decoder in WASM/JS. WiFi uses the <code>WIFI:</code> MECARD-style payload. vCard uses a VCARD text block. Nothing is sent to a QR-as-a-service API.</p>`,
		pitfalls: [
			'Low contrast or a logo covering a finder square will fail on cheap cameras.',
			'Dense vCards printed tiny on business cards often will not scan.',
			'Inverted colors (light on dark) are less reliable outdoors.',
			'EAN-13 needs a valid checksum. Random 13 digits will not always encode.'
		],
		faqs: [
			{
				question: 'Does a styled QR encode different data?',
				answer: '<p>No. Dot shape and color are visual. The scanner reads module positions. Keep a quiet zone and dark-on-light contrast.</p>'
			},
			{
				question: 'PNG or SVG?',
				answer: '<p>SVG for print and large signs. PNG for the web and slides. Avoid JPEG; compression blurs module edges.</p>'
			},
			{
				question: 'Is the WiFi password uploaded?',
				answer: '<p>No. The password is only in the QR payload drawn on this page. Anyone who scans it can still join the network, so treat the image like the password itself.</p>'
			}
		]
	},
	system: {
		intro: `<p>System tools report what this browser can see: OS hints, CPU cores, memory pressure, screen, GPU renderer, connection type, media devices, and permission state. They are for debugging "works on my machine" issues and checking what a web app can access.</p>
<p>A website cannot read your full hardware inventory. Values come from browser APIs, which may be spoofed, rounded, or blocked for privacy. Treat them as what the page is allowed to know, not a BIOS dump.</p>`,
		whenToUse: [
			'Confirm the browser engine and version a user is actually running',
			'See if a camera or mic is enumerated before you debug getUserMedia',
			'Check permission state for notifications or geolocation',
			'Read approximate connection quality for a support ticket',
			'Capture screen size and DPR when a layout bug is viewport-specific'
		],
		howItWorks: `<p>We call <code>navigator</code>, <code>screen</code>, User-Agent Client Hints when available, <code>navigator.mediaDevices</code>, and the Permissions API. Public IP, if shown, requires a request to an IP echo service from your browser; other fields stay local. GPU info often comes from WebGL unmasked renderer strings when the browser exposes them.</p>`,
		pitfalls: [
			'User-Agent is easy to spoof and is being reduced in modern browsers.',
			'deviceMemory and hardwareConcurrency are bucketed for fingerprinting defense.',
			'Permission prompts only appear after a user gesture on many browsers.',
			'Listing media devices may show empty labels until permission is granted.'
		],
		faqs: [
			{
				question: 'Why is RAM or GPU missing?',
				answer: '<p>Safari and locked-down browsers omit several fields. That is expected, not a bug in the tool.</p>'
			},
			{
				question: 'Does this identify me uniquely?',
				answer: '<p>We do not store a fingerprint. The same APIs can be used for fingerprinting on other sites. Use a privacy browser if that is a concern.</p>'
			},
			{
				question: 'Can I see other computers on my LAN?',
				answer: '<p>No. These pages only describe this browser context.</p>'
			}
		]
	},
	text: {
		intro: `<p>Text tools cover case conversion, line sorting, diffs, find/replace with regex, word counts, duplicate removal, anagrams, and placeholder copy. They are for logs, CSV columns, copy decks, and the boring cleanup that should not need a full IDE.</p>
<p>Case conversion follows common programming conventions (camelCase, snake_case, kebab-case). Diff is line-oriented. Regex replace uses the JavaScript regex engine, which is close to but not identical to PCRE or Python.</p>`,
		whenToUse: [
			'Rename a list of identifiers from camelCase to snake_case',
			'Sort and unique a paste from a spreadsheet column',
			'Compare two README drafts before you commit',
			'Count words for a changelog or meta description',
			'Generate lorem copy that will not leak real customer names from production'
		],
		howItWorks: `<p>Transformations run as string operations in the tab. There is no language-server awareness: converting case will not rename symbols in a real codebase. Diff highlights added and removed lines. Statistics count characters, words, and rough reading time in English-centric rules.</p>`,
		pitfalls: [
			'Unicode words and CJK scripts make "word count" an approximation.',
			'Regex find/replace can destroy data if you skip the preview.',
			'Anagram results depend on a word list and will miss proper nouns.',
			'Blabber and lorem are for layout, not published content.'
		],
		faqs: [
			{
				question: 'Will case converter handle acronyms like HTTPServer?',
				answer: '<p>Heuristic splitters often turn that into http server or HTTP server incorrectly. Check identifiers that mix acronyms.</p>'
			},
			{
				question: 'Is the diff the same as git diff?',
				answer: '<p>It is a text diff in the browser, not Git. It will not understand renames or binary files.</p>'
			},
			{
				question: 'Does find/replace support multiline mode?',
				answer: '<p>JavaScript regex has an <code>s</code> (dotAll) and <code>m</code> (multiline) flag. Use the regex tools if you need to experiment with flags first.</p>'
			}
		]
	},
	html: {
		intro: `<p>HTML tools format, minify, do a basic well-formedness check, extract text or elements, visualize the DOM tree, convert a tree to JSON, clean attributes, and count tags. They run on the markup you paste, not by fetching a live URL (that would be a server-side crawl).</p>
<p>The validator is a practical linter for unclosed tags and nesting mistakes. It is not the W3C Nu Html Checker. Browser HTML parsers are famously forgiving; these tools help you see structure before the browser silently fixes it.</p>`,
		whenToUse: [
			'Pretty-print a minified template to find a missing </div>',
			'Strip tags to get readable text from an email HTML part',
			'List every href or img src in a fragment',
			'Remove inline styles or empty attributes before a CMS paste',
			'See tag frequency in a messy legacy page'
		],
		howItWorks: `<p>Parsing uses DOMParser in the browser. Extraction walks the resulting tree. Formatting serializes with indentation. Attribute cleaning removes selected attributes without a full HTML rewriter. JSON conversion is a structural dump, not a semantic article extract.</p>`,
		pitfalls: [
			'DOMParser in HTML mode will "fix" some errors, so the tree may not match the source byte-for-byte.',
			'Svg and foreign content have different parsing rules.',
			'Scripts in pasted HTML are parsed as nodes; we do not execute them, but treat untrusted HTML as untrusted.',
			'Minify can break HTML that depends on whitespace in <pre> or inline formatting.'
		],
		faqs: [
			{
				question: 'Can I paste a full production page with user data?',
				answer: '<p>It stays in the tab. Still avoid pasting secrets. Prefer a redacted fragment.</p>'
			},
			{
				question: 'Why did the formatter change my tags?',
				answer: '<p>The HTML parser may insert implied tags (tbody, html, body). Work on a fragment if you need byte-stable output.</p>'
			},
			{
				question: 'Is this an accessibility auditor?',
				answer: '<p>No. Use dedicated a11y tools for contrast, names, and keyboard support.</p>'
			}
		]
	},
	break: {
		intro: `<p>Break tools are for focus sessions, not for SEO pages. The Pomodoro timer and breathing guide are the ones with a real method behind them. Ambient sound, a fullscreen clock, and zen motion exist as optional rest screens and are kept out of search indexes because they are not informational articles.</p>
<p>Pomodoro is a simple cadence: focused work, short break, repeat, then a longer break. Breathing here uses a timed inhale-hold-exhale cycle so you are not watching a clock. Neither replaces medical advice or a real therapist.</p>`,
		whenToUse: [
			'Time a 25/5 or 50/10 deep-work block without installing another app',
			'Reset after a stressful deploy with a few guided breaths',
			'Keep a large clock visible during a workshop',
			'Play rain or café audio while you write'
		],
		howItWorks: `<p>Timers use <code>setInterval</code> in this tab. If the tab is backgrounded, browsers may throttle timers; keep the tab visible for accurate chimes. Audio and video for ambient scenes play from static files on this origin. No account and no cloud sync: if you close the tab, the session count is gone.</p>`,
		pitfalls: [
			'Background tabs can drift. Pin the timer tab if the chime matters.',
			'Ambient loops are mood tools, not white-noise therapy devices.',
			'Breathing patterns can feel wrong if you have respiratory issues. Stop if you feel lightheaded.',
			'Pomodoro is a heuristic. Some work needs longer uninterrupted blocks.'
		],
		faqs: [
			{
				question: 'Do you save my focus history?',
				answer: '<p>No. Session counts live in memory for this visit only.</p>'
			},
			{
				question: 'Why are some break pages not in Google search?',
				answer: '<p>Clock, ambient, and zen motion are rest UIs. We noindex them so they do not look like empty doorway pages. Pomodoro and breathing stay indexable because they document a technique.</p>'
			},
			{
				question: 'Can I customize Pomodoro lengths beyond 25/5 and 50/10?',
				answer: '<p>This timer ships those two common presets. If you need arbitrary lengths, use a dedicated timer app.</p>'
			}
		]
	},
	convert: {
		intro: `<p>Converters cover CSS units, physical length, screen resolution and DPI, time, data size (SI vs IEC), angles, number bases, typography scales, and color models. Results update as you type. They are calculators with the assumptions spelled out, not magic that knows your design token file.</p>
<p>px to rem needs a root font size. cm to px needs a DPI. MB vs MiB is a real disagreement between disk vendors and RAM. Color conversions between HEX, RGB, and HSL are straightforward; perceptual uniformity is not.</p>`,
		whenToUse: [
			'Convert 16px to rem at a 16px root',
			'Explain why a 1 inch print is not 96 CSS pixels on a 2x display',
			'Check whether a file size is decimal MB or binary MiB',
			'Translate a hex brand color to HSL for a design token',
			'Convert hex 0xFF to decimal while debugging a bit flag'
		],
		howItWorks: `<p>Each converter applies a documented formula. CSS px here follows the CSS reference pixel at the DPI you set (default 96). Data size lets you pick SI (1000) or IEC (1024). Color conversion uses standard sRGB channel math, not a color-managed CMS.</p>`,
		pitfalls: [
			'em vs rem: em is relative to the parent, rem to the root. Mixing them is a common layout bug.',
			'Screen PPI calculators need the real diagonal and resolution; marketing "inches" on phones can be rounded.',
			'Time conversion ignores calendars. 30 days is not a month.',
			'HSB/HSV is not HSL. Pick the model your CSS actually uses.'
		],
		faqs: [
			{
				question: 'Why does 1cm not match my ruler on screen?',
				answer: '<p>CSS pixels are not physical millimeters unless the environment is calibrated. Set DPI to your display if you care about print-ish sizes.</p>'
			},
			{
				question: 'GB or GiB?',
				answer: '<p>Storage marketing often uses GB (10^9). Windows RAM and many developer tools use GiB (2^30). Use the data size tool and pick the convention your OS shows.</p>'
			},
			{
				question: 'Are color conversions lossless?',
				answer: '<p>8-bit HEX/RGB round-trips. Going through HSL and back can move a channel by one bit. For brand colors, keep the original HEX.</p>'
			}
		]
	},
	css: {
		intro: `<p>CSS tools format and minify stylesheets, strip leftover vendor prefixes, and generate gradients, shadows, filters, transitions, cubic-bezier curves, keyframes, and text gradients with a live preview. Snippets collect small recipes (centering, truncation) you can copy.</p>
<p>Generators write CSS you paste into a project. They do not compile Tailwind or run PostCSS. Prefixed properties you no longer need can be cleaned if your browserslist already covers those engines.</p>`,
		whenToUse: [
			'Build a linear or conic gradient and copy the CSS',
			'Stack box-shadows without guessing four-value syntax',
			'Hear (see) an easing curve before you ship it',
			'Minify a small hand-written stylesheet for a CodePen',
			'Remove -webkit- linear-gradient prefixes from old copy-paste CSS'
		],
		howItWorks: `<p>Format/minify are text transforms. Visual generators keep state in Svelte components and stringify CSS. Keyframes are a list of stops, not a full animation IDE. Filters compose standard CSS filter functions. Nothing is sent to a "CSS as a service" backend.</p>`,
		pitfalls: [
			'Minify can break CSS that relies on hacky whitespace or uses certain old IE filters.',
			'Removing prefixes blindly can break Safari versions you still support.',
			'Multiple box-shadows are drawn in order; the first listed is on top.',
			'Filter: drop-shadow is not the same as box-shadow on the box model.'
		],
		faqs: [
			{
				question: 'Can I import a whole Tailwind project?',
				answer: '<p>No. Paste CSS, not a build pipeline. Use your local toolchain for that.</p>'
			},
			{
				question: 'Do gradients work in email HTML?',
				answer: '<p>Many email clients still need fallbacks or VML. Copy the CSS for the web, then check Litmus or a similar lab for email.</p>'
			},
			{
				question: 'Is the bezier editor the same as Chrome DevTools?',
				answer: '<p>Same cubic-bezier idea, smaller feature set. DevTools also shows the animation on a real element in your page.</p>'
			}
		]
	},
	'css-layout': {
		intro: `<p>Layout tools are visual playgrounds for Flexbox, Grid, masonry-style columns, media queries, positioning and z-index, spacing, and aspect-ratio. They exist because flex and grid are easier to learn by dragging than by memorizing every alignment keyword.</p>
<p>The generated CSS is a starting point. Real pages add wrapping, container queries, and design-system constraints these demos do not know about.</p>`,
		whenToUse: [
			'Remember the difference between justify-content and align-items',
			'Sketch a named grid template before you write production CSS',
			'Generate a media query for a common breakpoint',
			'Explain stacking contexts to a teammate with z-index',
			'Get padding-hack fallbacks for aspect-ratio in older browsers'
		],
		howItWorks: `<p>Each playground binds CSS properties to controls and shows the result on sample items. Masonry here is CSS columns or a flex approximation, not the newer native masonry spec which is still uneven across browsers. Copy buttons emit the current rule set.</p>`,
		pitfalls: [
			'Flex shrink and min-width: auto cause overflow surprises. The playground items are simplified.',
			'Grid named areas must form a rectangle. Invalid templates fail in CSS.',
			'z-index only compares within the same stacking context.',
			'Container queries are not the same as media queries. This helper is viewport-oriented.'
		],
		faqs: [
			{
				question: 'Should I still learn floats?',
				answer: '<p>For wrapping text around images, maybe. For page layout, flex and grid replaced floats years ago.</p>'
			},
			{
				question: 'Is masonry production-ready?',
				answer: '<p>Column-based masonry is widely used. Native CSS masonry is still catching up. Check your target browsers.</p>'
			},
			{
				question: 'Do you output Tailwind classes?',
				answer: '<p>These generators emit CSS properties. Map them to Tailwind utilities in your own codebase if you use that stack.</p>'
			}
		]
	},
	ai: {
		intro: `<p>AI utilities estimate tokens, visualize token boundaries, plan context windows, trim prompts, and ballpark API cost for common chat and embedding models. They run locally with published tokenizers and price tables. They do not call OpenAI, Anthropic, or Google on your behalf.</p>
<p>Token counts are estimates of what a given tokenizer would emit. Providers can change tokenizers and prices. Always confirm on the vendor's pricing page before you commit budget. Cost compare is a worksheet, not a contract.</p>`,
		whenToUse: [
			'See whether a prompt plus history fits an 8k, 32k, or 128k window',
			'Trim logs out of a prompt without cutting mid-sentence',
			'Compare input/output prices across models for a daily volume',
			'Estimate embedding dimensions and storage for a vector DB',
			'Explain to a stakeholder why "characters" are not "tokens"'
		],
		howItWorks: `<p>Tokenizers (where bundled) run in the browser. Some models use a close sibling tokenizer when the exact one is too large to ship. Prices live in our source and are dated. Context estimator adds system, tools, and history the way typical chat APIs bill, which is still an approximation of each provider's real billing rules.</p>`,
		pitfalls: [
			'A tokenizer mismatch of a few percent is normal across model families.',
			'Cached input, batch APIs, and fine-tuned models change the bill.',
			'Images, audio, and tools have their own token rules not covered by plain text counts.',
			'Prompt trimmer cannot know which paragraph is load-bearing. You still review the cut.'
		],
		faqs: [
			{
				question: 'Do you send my prompt to a model?',
				answer: '<p>No. Counting and trimming happen on this page. There is no chat completion.</p>'
			},
			{
				question: 'Why does OpenAI\'s counter disagree by a few tokens?',
				answer: '<p>Different tokenizer builds, special tokens, and chat templates. Use the vendor playground as the source of truth for billing disputes.</p>'
			},
			{
				question: 'How often is pricing updated?',
				answer: '<p>We review provider pages at least monthly. See the editorial policy. Check the last-updated date on the cost tools.</p>'
			}
		]
	},
	hash: {
		intro: `<p>Hash tools compute MD5, SHA-1, SHA-256, SHA-512, CRC32, and HMAC in Web Crypto or JS implementations, identify likely hash types, compare digests, checksum files, and convert hex/Base64. Lookup only checks a small local set of common strings, not a giant rainbow table in the cloud.</p>
<p>Hashes are one-way fingerprints. They verify integrity and feed HMAC. They are not encryption. MD5 and SHA-1 are broken for collision resistance; do not use them for new security designs. File checksums are still a reasonable way to verify a download matches the published digest.</p>`,
		whenToUse: [
			'Verify a Linux ISO against the published SHA-256',
			'Generate HMAC-SHA256 for an API signing test with a throwaway key',
			'Guess whether a 32-hex string is MD5 vs something else',
			'Compare two checksums without eyeballing',
			'Convert a hex digest to Base64 for a header'
		],
		howItWorks: `<p>Text is encoded as UTF-8 unless you hash a file's raw bytes. Web Crypto provides SHA-256/512 and HMAC where available. MD5/SHA-1/CRC32 use well-known implementations in JS. Identifier uses length and alphabet heuristics. Lookup is not an online cracker.</p>`,
		pitfalls: [
			'Hashing a string vs a file that contains that string plus a newline yields different digests.',
			'HMAC needs a secret. Pasting production secrets into any website is a process smell even when we do not upload them.',
			'Identifying a hash by length is a guess. Many algorithms share hex length.',
			'CRC32 is for accidental corruption, not adversaries.'
		],
		faqs: [
			{
				question: 'Can I reverse SHA-256?',
				answer: '<p>Not practically. Lookup only matches a tiny list of common inputs. If a password is in that list, it was a weak password.</p>'
			},
			{
				question: 'Should I store passwords with SHA-256?',
				answer: '<p>No. Use a password hashing scheme (Argon2, bcrypt, scrypt) with salt. See the password storage guide under Security.</p>'
			},
			{
				question: 'Why does my checksum not match?',
				answer: '<p>Wrong algorithm, text vs binary mode, or a truncated copy. Hash the downloaded file, not a zip of the file, unless the publisher hashed the zip.</p>'
			}
		]
	},
	git: {
		intro: `<p>Git tools generate gitignore files, conventional commit messages, branch names, config snippets, aliases, README and license starters, and they explain blame, reset, rebase, and workflows. Diff viewer and secrets scanner work on text you paste. Nothing clones your repo on our servers.</p>
<p>The educational helpers (reset, rebase, workflow) are diagrams and command builders so you can see what a flag does before you run it on a real repository. They do not execute Git.</p>`,
		whenToUse: [
			'Combine language gitignore templates without hunting gist collections',
			'Format a conventional commit with type and scope',
			'Name a branch from a ticket id',
			'Scan a paste for AWS keys before you commit',
			'Pick MIT vs Apache with a plain-language comparison'
		],
		howItWorks: `<p>Generators concatenate templates and options in the browser. Secrets scanning uses pattern lists (API key shapes) on the text you provide. Large-file detector looks at names and sizes you enter, not your disk. Workflow pages are static explainers.</p>`,
		pitfalls: [
			'A generated gitignore is a starting point. Add secrets files your stack actually uses.',
			'Secrets scanner false-negatives exist. Pre-commit hooks and git-secrets still matter.',
			'Reset --hard will discard work. The helper explains; it cannot undo a real reset.',
			'License picker is not legal advice.'
		],
		faqs: [
			{
				question: 'Does the secrets scanner look at my GitHub?',
				answer: '<p>No. Paste a diff or file contents. For CI, use a scanner in your pipeline.</p>'
			},
			{
				question: 'Is the commit validator the official Conventional Commits linter?',
				answer: '<p>It checks the common spec locally. Teams add extra scopes and ticket rules this tool may not know.</p>'
			},
			{
				question: 'Can I generate a .gitignore for a monorepo?',
				answer: '<p>Combine presets, then add root and package-level ignores yourself. Monorepos are too varied to fully automate.</p>'
			}
		]
	},
	regex: {
		intro: `<p>Regex tools test, extract, replace, and explain patterns using the JavaScript regular expression engine. The cheat sheet is a syntax map with examples. If you live in Python, Go, or POSIX, expect small differences (lookbehind, named groups, Unicode).</p>
<p>A regex is a compact program. Catastrophic backtracking can freeze a tab on crafted input. Keep tests on representative samples, not a 50 MB log in one shot.</p>`,
		whenToUse: [
			'Debug a pattern against a sample log line with live highlights',
			'Extract all capture groups to JSON or CSV',
			'Preview a replace with $1 backreferences before you run it in an editor',
			'Read a dense pattern token by token',
			'Look up anchors, character classes, and flags'
		],
		howItWorks: `<p>The tester compiles <code>new RegExp(pattern, flags)</code> and runs it on your text. Explainer tokenizes a common subset of JS regex syntax. It will not fully parse every exotic construct. Replacer uses <code>String.prototype.replace</code> semantics.</p>`,
		pitfalls: [
			'Greedy vs lazy quantifiers change matches in ways that look "random" until you highlight them.',
			'Dot does not match newlines unless the s flag is on.',
			'JavaScript has no POSIX character classes like [[:digit:]].',
			'Pasting untrusted regex plus untrusted text is a ReDoS risk in any language, including this page.'
		],
		faqs: [
			{
				question: 'Why does this match in regex101 (PCRE) but not here?',
				answer: '<p>Flavor mismatch. Switch regex101 to ECMAScript or rewrite lookbehind and possessive quantifiers.</p>'
			},
			{
				question: 'Are matches the same as grep -E?',
				answer: '<p>grep is POSIX or PCRE depending on flags. Anchors and word boundaries differ. Test in the environment that will run the pattern.</p>'
			},
			{
				question: 'Can you generate a regex from examples?',
				answer: '<p>Not automatically. Write the pattern and test it here. Generated regex from a few examples is usually wrong on the next input.</p>'
			}
		]
	},
	jwt: {
		intro: `<p>JSON Web Tokens are three Base64url parts: header, payload, signature. These tools decode claims, show expiry, list registered claims, measure size, and mint unsigned or demo tokens for UI tests. They do not verify signatures against your production keys, and they should not.</p>
<p>Decoding a JWT is not authentication. Anyone can read a typical payload. Put secrets in the token only if you accept that every client can see them. The generator is labeled for testing because an unsigned token is not a security boundary.</p>`,
		whenToUse: [
			'Read claims in a token from localStorage while debugging a 401',
			'See whether exp is in the past in your timezone',
			'Check if the token is too large for a cookie header',
			'Build a fake token so a frontend storybook can render an "authenticated" state'
		],
		howItWorks: `<p>We split on dots, Base64url-decode header and payload, and pretty-print JSON. Expiration reads <code>exp</code>, <code>nbf</code>, and <code>iat</code> as Unix seconds. Size counts characters of the compact serialization. Generator assembles a header and payload you edit; signature may be omitted or a dummy.</p>`,
		pitfalls: [
			'alg: none and unsigned tokens are for tests only.',
			'Signature verification needs the correct key and algorithm. A decoder that "verifies" with a key you pasted into a random website is a bad habit.',
			'Clock skew between servers makes exp look wrong by a few seconds.',
			'Nested JWTs and encrypted JWE are out of scope for these pages.'
		],
		faqs: [
			{
				question: 'Is decoding the same as verifying?',
				answer: '<p>No. Verification checks the signature. Decoding only reads the JSON. Never trust claims from a token you have not verified on a server.</p>'
			},
			{
				question: 'Did you leak my token?',
				answer: '<p>It stays in this tab. Treat tokens like passwords anyway: they are bearer credentials.</p>'
			},
			{
				question: 'Why is my token huge?',
				answer: '<p>Permissions arrays, profile photos as data URIs, or duplicated claims. Prefer opaque session IDs in cookies for large authorization data.</p>'
			}
		]
	},
	id: {
		intro: `<p>ID tools generate UUID v4 and v7, validate UUID layout and version, and mint NanoID and ULID values. Use them when you need unique keys in fixtures, docs, or a prototype. Do not use a website generator as the only source of IDs in a high-security lottery or crypto protocol; use your language's CSPRNG APIs in production code.</p>
<p>UUID v4 is random. UUID v7 is time-ordered, which is kinder to B-tree indexes. NanoID is shorter and URL-safe. ULID is sortable and encodes a timestamp.</p>`,
		whenToUse: [
			'Fill a test database with unique primary keys',
			'Check whether a value is a UUID and which version',
			'Generate compact public IDs for a demo API',
			'Show how ULID sorts compared to UUID v4'
		],
		howItWorks: `<p>Generation uses <code>crypto.getRandomValues</code> in the browser. Validators check canonical hex form, variant bits, and version nibble. Bulk generate loops in JS; thousands are fine, millions may hitch the UI.</p>`,
		pitfalls: [
			'UUID v1 leaks MAC-ish time info; we focus on v4 and v7.',
			'NanoID collision risk depends on length and alphabet. Do not shorten blindly.',
			'UUIDs in URLs should be treated as secret if they are capability links.',
			'Copy-paste can introduce curly quotes or hidden whitespace that fail validation.'
		],
		faqs: [
			{
				question: 'v4 or v7 for a new Postgres table?',
				answer: '<p>v7 (or ULID) if you care about index locality. v4 if you already standardized on random UUIDs. This is a database design choice, not a moral one.</p>'
			},
			{
				question: 'Are these RFC 9562 UUIDs?',
				answer: '<p>v4 and v7 follow the current UUID spec layout. We are not a conformance test suite for every version.</p>'
			},
			{
				question: 'Can I use these IDs as passwords?',
				answer: '<p>They are unique identifiers, not memorable secrets, and a web page is the wrong place to mint production credentials. Use your app\'s password hasher and a proper secret generator in code.</p>'
			}
		]
	},
	cron: {
		intro: `<p>Cron tools build, explain, validate, and preview Unix 5-field expressions and common Quartz 6/7-field variants. Next-run calculation includes a timezone so "every day at 9" is not silently UTC. Human-to-cron is a structured builder, not a free-form NLP that guesses poorly.</p>
<p>Cron looks small and fails loudly in production: day-of-month vs day-of-week, DST gaps, and the difference between 5-field crontab and Jenkins/Quartz. Read the explainer before you paste into Kubernetes CronJob spec.</p>`,
		whenToUse: [
			'Translate 0 9 * * 1-5 into English',
			'See the next ten fire times in a named timezone',
			'Validate a string before it lands in crontab',
			'Copy a preset for hourly, daily, or weekly jobs',
			'Switch between 5-field and Quartz seconds fields carefully'
		],
		howItWorks: `<p>Parsing splits fields and expands lists, ranges, and steps. Next-run iterates calendar minutes with the selected IANA timezone. DST: a job in a spring-forward gap may skip; a fall-back hour may run twice depending on the scheduler. We document the behavior of this calculator; your runner (cron, systemd, K8s, Cloud Scheduler) may differ.</p>`,
		pitfalls: [
			'Some crons treat day-of-month AND day-of-week as OR. Know your implementation.',
			'Nonstandard @hourly shortcuts are not portable to every engine.',
			'Quartz uses 1-7 for Sunday-Saturday in some versions and 0-7 in others.',
			'CronJob in Kubernetes is UTC unless you set a timeZone field (recent versions).'
		],
		faqs: [
			{
				question: 'Is this crontab or Quartz?',
				answer: '<p>The generator supports both styles. Check field count. Five fields is classic Unix. Quartz adds seconds (and sometimes year).</p>'
			},
			{
				question: 'Why did next run skip an hour?',
				answer: '<p>DST spring-forward. Schedule in UTC or use a timezone-aware runner if you cannot skip.</p>'
			},
			{
				question: 'Can I type "every weekday morning"?',
				answer: '<p>Use Human to Cron dropdowns. Free text like that is ambiguous (whose morning?).</p>'
			}
		]
	},
	yaml: {
		intro: `<p>YAML tools validate, format, convert to and from JSON, diff, lint duplicate keys, sort keys, and flatten to .env style. YAML is the language of Kubernetes, Ansible, and GitHub Actions, and it is easy to break with tabs, implicit typing, and duplicate keys.</p>
<p>Norway problem (<code>NO</code> becoming boolean false), unquoted colons, and multiline strings are the usual footguns. Prefer JSON for APIs; use YAML when humans edit nested config and you understand the spec version your runner uses.</p>`,
		whenToUse: [
			'Find the indent error Kubernetes refuses to apply',
			'Convert a Helm values snippet to JSON for a script',
			'Diff two manifests without caring about key order (or sort first)',
			'Export nested keys to ENV for local docker compose',
			'Catch duplicate keys that parsers silently overwrite'
		],
		howItWorks: `<p>Parsing uses a JavaScript YAML library in the browser. JSON conversion is a data-model round trip, so comments are dropped. Diff can be structural. .env flattening joins nested keys with a separator you choose. Linter rules are practical, not a full YAML 1.1 vs 1.2 certification.</p>`,
		pitfalls: [
			'Tabs are not indent. Use spaces.',
			'On/off, yes/no, and NO can become booleans depending on the parser.',
			'Anchors and merge keys may not survive every convert path.',
			'Sorting keys can change meaning if your tool relies on order (rare, but Helm hooks sometimes care about document order).'
		],
		faqs: [
			{
				question: 'Why did my country code become false?',
				answer: '<p>YAML 1.1 implicitly types some words as booleans. Quote <code>"NO"</code> or use a 1.2 parser. The linter tries to warn on this class of issue.</p>'
			},
			{
				question: 'Do you keep comments when formatting?',
				answer: '<p>Most format paths re-serialize the data model and drop comments. Keep a copy if comments matter.</p>'
			},
			{
				question: 'Is this safe for secrets in values.yaml?',
				answer: '<p>Processing is local. Still prefer sealed-secrets or a vault rather than pasting production values into any web page.</p>'
			}
		]
	},
	k8s: {
		intro: `<p>Kubernetes tools inspect manifests, diff resources, split multi-document YAML, sketch a Helm chart from YAML, and check apiVersion deprecations for a target cluster version. They do not talk to your cluster. No kubeconfig is uploaded.</p>
<p>Use them on a train or in a browser when installing kubectl plugins is not worth it. Apply and dry-run still belong on a machine with credentials. API deprecation data is a snapshot; confirm against the Kubernetes version you actually run.</p>`,
		whenToUse: [
			'See kind, name, and missing required fields in a pasted manifest',
			'Compare two Deployment YAML files after a change',
			'Split a single file with --- into one file per resource',
			'Get a head start on Helm values from existing YAML',
			'Check whether networking.k8s.io/v1beta1 still exists on 1.25+'
		],
		howItWorks: `<p>Manifests are parsed as YAML documents. Inspector looks at apiVersion, kind, and metadata. Diff is resource-aware when names match. Helm export templatizes obvious values; it will not produce a chart you should ship without review. API checker compares against a built-in deprecation table.</p>`,
		pitfalls: [
			'CRDs are not in the core deprecation table.',
			'Helm conversion will not handle every helper, hook, or lookup.',
			'Diff does not apply strategic merge patch semantics used by kubectl apply.',
			'A valid manifest can still be rejected by admission webhooks you do not see here.'
		],
		faqs: [
			{
				question: 'Can this replace kubectl explain?',
				answer: '<p>No. It is a quick inspect. Use kubectl explain and the official docs for field-level schema.</p>'
			},
			{
				question: 'Do you access my cluster?',
				answer: '<p>No. There is no API server call from these pages.</p>'
			},
			{
				question: 'Which Kubernetes version is the deprecation table for?',
				answer: '<p>Pick the version in the API checker UI. When in doubt, match <code>kubectl version</code> on the cluster, not your laptop.</p>'
			}
		]
	},
	security: {
		intro: `<p>Security tools help you draft CSP and CORS headers, test password strength locally, look up HTTP status codes, and walk through headers, OWASP Top 10, misconfig patterns, and password storage recommendations. They are references and builders, not a pentest of your site.</p>
<p>CSP and CORS mistakes cause either XSS holes or broken production. Password tester uses entropy and dictionary heuristics in the browser; it does not submit the password. Header snippets are starting points for NGINX, Apache, and Node. Threat model is a STRIDE worksheet, not an automated scanner of your repo.</p>`,
		whenToUse: [
			'Draft a Content-Security-Policy and see which directives are unsafe',
			'Build Access-Control-Allow-* headers for a specific origin',
			'Check a password you are about to use on a throwaway account (still never reuse production passwords in a webpage if you can avoid it)',
			'Look up what 425 or 451 means',
			'Walk an OWASP checklist before a release'
		],
		howItWorks: `<p>Header generators concatenate directives from checkboxes. Password scoring is local zxcvbn-style analysis. Misconfig detector matches patterns in headers or config text you paste. OWASP and header checklists are editorial content with copy-paste snippets.</p>`,
		pitfalls: [
			'CSP unsafe-inline and unsafe-eval undo most of the policy\'s value.',
			'CORS * with credentials is invalid and browsers will reject it.',
			'Password strength meters cannot see if the password was in a breach dump.',
			'Copy-pasting security headers without understanding them can break your app or give a false sense of safety.'
		],
		faqs: [
			{
				question: 'Is the password sent anywhere?',
				answer: '<p>No. Strength analysis runs in the tab. Use a password manager for real secrets.</p>'
			},
			{
				question: 'Will a CSP you generate be production-ready?',
				answer: '<p>It is a draft. You still need to add your real script hashes or nonces and test in report-only mode.</p>'
			},
			{
				question: 'Is this a substitute for a security review?',
				answer: '<p>No. Use it as a checklist and a header builder. Hire review for anything that handles money, health, or large PII.</p>'
			}
		]
	}
};

export function getCategoryGuide(slug: string): CategoryGuide | undefined {
	return categoryGuides[slug];
}

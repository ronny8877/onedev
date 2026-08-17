export interface QrToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
}

export const qrToolsContent: Record<string, QrToolContent> = {
	generator: {
		features: [
			'Generate QR codes from text, URLs, email, phone, SMS, WiFi, or a vCard',
			'Customize dot style, corner squares, colors, size, and quiet zone',
			'Drop a logo in the center with automatic high error correction',
			'Download PNG, SVG, or JPEG without sending data to a server',
			'Copy the encoded payload so you can inspect exactly what will be scanned',
			'Works entirely in the browser — nothing is uploaded'
		],
		useCases: [
			'Put a styled QR on packaging, posters, or a conference badge',
			'Share a URL, WiFi network, or contact card without typing',
			'Brand a QR with your logo while keeping it scannable',
			'Export SVG for print so the code stays sharp at any size',
			'Preview how error correction and a logo affect density before you print'
		],
		concept: {
			title: 'How a QR code stores data',
			content: `<p>A <strong>QR code</strong> (Quick Response code) is a 2D barcode defined by ISO/IEC 18004. Data is encoded into a grid of dark and light modules, with three finder patterns in the corners so scanners can locate and orient the code.</p>
<p class="mt-2"><strong>Error correction</strong> (Reed–Solomon) lets a scanner recover from damage. Level L recovers about 7% of the code, M about 15%, Q about 25%, and H about 30%. A center logo covers modules, so this tool raises correction to H when you add an image.</p>
<p class="mt-2">Styling the dots and corners does not change the payload. Scanners still read the same modules. Keep contrast high (dark on light), leave a quiet zone around the code, and avoid covering the finder patterns.</p>`
		},
		examples: [
			{ label: 'URL payload', code: 'https://onedev.tools/qr/generator', isValid: true },
			{ label: 'WiFi payload', code: 'WIFI:T:WPA;S:OneDev Guest;P:tools-are-local;H:false;;', isValid: true },
			{ label: 'Empty payload will not scan', code: '', isValid: false }
		],
		faqs: [
			{
				question: 'Does adding a logo make the QR code unscannable?',
				answer: '<p>Not if error correction is high enough and the logo stays in the center. This tool switches to level H when a logo is present and can hide modules behind the image. Keep the logo under about 30% of the code and do not cover the three corner squares.</p>'
			},
			{
				question: 'PNG or SVG for printing?',
				answer: '<p>Use <strong>SVG</strong> for print and large signage. It stays sharp at any size. Use PNG for the web, email, or slides. JPEG is a last resort because compression can blur module edges.</p>'
			},
			{
				question: 'Is my data uploaded?',
				answer: '<p>No. The QR is drawn in your browser with client-side JavaScript. The text, WiFi password, or vCard never leaves this page.</p>'
			},
			{
				question: 'Why does a styled QR still scan as plain text?',
				answer: '<p>Dot and corner styles are visual only. The scanner reads module positions, not the rounded corners. The payload is the string shown under Content.</p>'
			},
			{
				question: 'How much data can a QR code hold?',
				answer: '<p>Version 40 with level L can hold up to 4,296 alphanumeric characters. In practice, keep URLs and vCards short. Longer payloads make denser codes that fail on cheap cameras or small prints.</p>'
			}
		],
		relatedTools: [
			{ name: 'QR Reader', path: '/qr/reader', description: 'Decode a QR from an image or camera' },
			{ name: 'WiFi QR', path: '/qr/wifi', description: 'Encode a WiFi network for one-tap join' },
			{ name: 'vCard QR', path: '/qr/vcard', description: 'Turn a contact into a scannable card' },
			{ name: 'Barcode Generator', path: '/qr/barcode', description: 'Create CODE128, EAN-13, and UPC barcodes' }
		],
		tips: [
			'Print a test at the real size and scan it with a phone before you order a large run.',
			'Keep at least four modules of quiet space around the code.',
			'Dark modules on a light background scan more reliably than inverted colors.',
			'If you need a dedicated WiFi or contact code, the WiFi QR and vCard QR tools use the same styling controls.'
		],
		commonMistakes: [
			'Covering a finder square with a logo so phones cannot lock onto the code',
			'Using low contrast colors (light gray on white) that fail outdoors',
			'Printing a dense vCard QR too small on a business card',
			'Encoding a URL without https:// and expecting every scanner to guess the scheme'
		]
	},

	reader: {
		features: [
			'Decode QR codes from a PNG, JPEG, WebP, or GIF on your device',
			'Optional live camera scan — stops as soon as a code is found',
			'Shows the raw payload and detected format',
			'Opens http(s) links in a new tab when the payload is a URL',
			'Also reads Data Matrix, Aztec, and PDF417 if they appear in the image',
			'All decoding happens locally with ZXing'
		],
		useCases: [
			'Recover the URL or text from a QR screenshot',
			'Check what a printed code actually contains before you share it',
			'Read a WiFi or vCard payload and copy it',
			'Debug a code that will not scan on a phone by trying a cropped photo'
		],
		concept: {
			title: 'What a QR reader actually sees',
			content: `<p>A reader locates the three finder patterns, samples the module grid, then applies Reed–Solomon error correction to recover the original bytes. Those bytes are interpreted as a string: a URL, <code>WIFI:...</code>, <code>BEGIN:VCARD</code>, <code>mailto:</code>, and so on.</p>
<p class="mt-2">Blur, glare, perspective, and a logo that is too large are the usual reasons a scan fails. Cropping tightly around the code and using a higher-resolution photo usually helps more than another app.</p>`
		},
		examples: [
			{ label: 'URL result', code: 'https://onedev.tools', isValid: true },
			{ label: 'WiFi result', code: 'WIFI:T:WPA;S:Cafe;P:secret;H:false;;', isValid: true },
			{ label: 'Unreadable blurry photo', code: '(no result)', isValid: false }
		],
		faqs: [
			{
				question: 'Why did my image not decode?',
				answer: '<p>The code may be too small, too blurry, or cropped through a finder square. Try a tighter crop, more light, and a PNG instead of a heavily compressed JPEG.</p>'
			},
			{
				question: 'Does the camera send video to a server?',
				answer: '<p>No. Frames are decoded in the browser and the camera stops as soon as a payload is found.</p>'
			},
			{
				question: 'Can this read barcodes too?',
				answer: '<p>This page is tuned for QR and other 2D codes. Use the Barcode Reader for EAN, UPC, CODE128, and CODE39.</p>'
			}
		],
		relatedTools: [
			{ name: 'QR Generator', path: '/qr/generator', description: 'Create a custom QR code' },
			{ name: 'Barcode Reader', path: '/qr/barcode-reader', description: 'Read 1D product and shipping barcodes' },
			{ name: 'WiFi QR', path: '/qr/wifi', description: 'Build a WiFi join code' }
		],
		tips: [
			'If a screenshot fails, crop to just the QR and try again.',
			'Hold the camera steady; motion blur is the most common live-scan failure.',
			'A WiFi payload can be pasted into notes even if your OS will not auto-join from a web page.'
		],
		commonMistakes: [
			'Photographing a screen at an angle so the finder squares distort',
			'Expecting the browser to join WiFi for you — it can only show the payload',
			'Uploading a photo of several codes at once without cropping'
		]
	},

	wifi: {
		features: [
			'Build a WIFI: payload from SSID, password, and security type',
			'Supports WPA/WPA2/WPA3, WEP, and open networks',
			'Marks hidden networks so phones still prompt correctly',
			'Same styling controls as the main QR generator, including a logo',
			'Copy the raw WIFI: string for docs or config files'
		],
		useCases: [
			'Guest WiFi on a cafe table tent or Airbnb printout',
			'Office onboarding so new devices join without typing a long password',
			'A sticker on the router for the household network'
		],
		concept: {
			title: 'The WIFI: QR format',
			content: `<p>Most phones understand a MeCard-style string: <code>WIFI:T:&lt;type&gt;;S:&lt;ssid&gt;;P:&lt;password&gt;;H:&lt;true|false&gt;;;</code>. <code>T</code> is <code>WPA</code>, <code>WEP</code>, or <code>nopass</code>. Special characters in the SSID or password (<code>\\ ; , :</code>) are escaped with a backslash so the scanner does not split fields early.</p>
<p class="mt-2">Scanning does not send the password to this site. The phone reads the code locally and offers to join the network.</p>`
		},
		examples: [
			{ label: 'WPA network', code: 'WIFI:T:WPA;S:OneDev Guest;P:tools-are-local;H:false;;', isValid: true },
			{ label: 'Open network', code: 'WIFI:T:nopass;S:Airport Free;P:;H:false;;', isValid: true },
			{ label: 'Missing SSID', code: 'WIFI:T:WPA;S:;P:secret;H:false;;', isValid: false }
		],
		faqs: [
			{
				question: 'WPA3 or WPA2 — which type should I pick?',
				answer: '<p>Choose <strong>WPA</strong> for WPA2 and WPA3 personal networks. Phones treat that token as “password-based WiFi.” Use Open only when there is no password.</p>'
			},
			{
				question: 'Will every phone join automatically?',
				answer: '<p>iOS and Android will offer to join after a scan. Some desktop scanners only show the text. Always keep the password somewhere safe as a backup.</p>'
			}
		],
		relatedTools: [
			{ name: 'QR Generator', path: '/qr/generator', description: 'General QR codes with the same styles' },
			{ name: 'QR Reader', path: '/qr/reader', description: 'Verify the WIFI: payload' },
			{ name: 'vCard QR', path: '/qr/vcard', description: 'Share a contact instead of a network' }
		],
		tips: [
			'Print the SSID under the code so people know which network they are joining.',
			'Prefer WPA2/WPA3. WEP is only here for old hardware.',
			'Test with a phone that is not already on the network.'
		],
		commonMistakes: [
			'Putting a semicolon in the SSID without realizing it must be escaped (this tool escapes it)',
			'Using Open when the network actually has a password',
			'Making the code so decorative that phones cannot read it from a table across the room'
		]
	},

	vcard: {
		features: [
			'Build a vCard 3.0 contact (name, org, title, phone, email, URL, address)',
			'Generate a styled QR phones can save to Contacts',
			'Copy the vCard text to drop into an .vcf file',
			'Logo and color controls matching the main generator'
		],
		useCases: [
			'Business cards and conference badges',
			'Email signatures as a small QR instead of a long URL',
			'A reception desk sign that saves the office contact'
		],
		concept: {
			title: 'vCard inside a QR code',
			content: `<p>A contact QR is just a QR whose payload is a <strong>vCard</strong> (RFC 6350 family). Version 3.0 is the most widely accepted by phone cameras:</p>
<pre class="mt-2 text-xs">BEGIN:VCARD
VERSION:3.0
N:Lovelace;Ada;;;
FN:Ada Lovelace
TEL;TYPE=CELL:+44 ...
EMAIL:ada@example.com
END:VCARD</pre>
<p class="mt-2">Keep fields short. A full postal address plus a long bio makes a dense code that fails on small cards.</p>`
		},
		examples: [
			{
				label: 'Minimal vCard',
				code: 'BEGIN:VCARD\nVERSION:3.0\nN:Lovelace;Ada;;;\nFN:Ada Lovelace\nTEL;TYPE=CELL:+44 20 7946 0958\nEMAIL:ada@example.com\nEND:VCARD',
				isValid: true
			},
			{ label: 'Empty contact', code: '(no name, phone, or email)', isValid: false }
		],
		faqs: [
			{
				question: 'vCard 3 or 4?',
				answer: '<p>This tool emits <strong>3.0</strong> because camera apps still mishandle 4.0 more often. 3.0 is enough for name, phone, email, org, and URL.</p>'
			},
			{
				question: 'Can I add a photo to the vCard?',
				answer: '<p>Embedded photos bloat the QR until it will not scan. Put a logo in the QR styling instead, and keep the vCard text-only.</p>'
			}
		],
		relatedTools: [
			{ name: 'QR Generator', path: '/qr/generator', description: 'Other QR content types' },
			{ name: 'QR Reader', path: '/qr/reader', description: 'Confirm the vCard payload' },
			{ name: 'WiFi QR', path: '/qr/wifi', description: 'Share a network instead of a person' }
		],
		tips: [
			'Put the QR on the back of a card at least 2 cm wide.',
			'Prefer one phone number and one email. Extra fields add density fast.',
			'Scan your own code after you add a logo.'
		],
		commonMistakes: [
			'Cramming a full mailing address onto a tiny badge QR',
			'Using a low-contrast brand color that cameras miss',
			'Forgetting to test on both iOS and Android camera apps'
		]
	},

	barcode: {
		features: [
			'Generate CODE128, CODE39, EAN-13, EAN-8, UPC-A, ITF-14, MSI, Pharmacode, and Codabar',
			'Live SVG preview with bar width, height, and colors',
			'Checksum-aware length checks for retail formats',
			'Download SVG or PNG, or copy the encoded value',
			'Runs in the browser with JsBarcode'
		],
		useCases: [
			'Warehouse labels and internal SKUs (CODE128 / CODE39)',
			'Retail product codes (EAN-13, UPC-A)',
			'Shipping carton codes (ITF-14)',
			'Quick test barcodes for a scanner you are wiring up'
		],
		concept: {
			title: '1D barcodes vs QR codes',
			content: `<p><strong>1D barcodes</strong> encode data as a sequence of bars and spaces along one axis. They hold less data than a QR code but remain the standard on products, shelves, and shipping labels because laser scanners read them quickly.</p>
<p class="mt-2"><strong>EAN-13</strong> and <strong>UPC-A</strong> are numeric retail codes with a check digit. <strong>CODE128</strong> can hold mixed letters and digits, which is why warehouses like it. This tool validates length and character set before drawing so you do not print an illegal symbol.</p>`
		},
		examples: [
			{ label: 'CODE128 SKU', code: 'ONDEV-12345', isValid: true },
			{ label: 'EAN-13', code: '5901234123457', isValid: true },
			{ label: 'EAN-13 with too few digits', code: '12345', isValid: false }
		],
		faqs: [
			{
				question: 'Which format should I use?',
				answer: '<p>Use <strong>CODE128</strong> for internal labels with letters. Use <strong>EAN-13</strong> or <strong>UPC-A</strong> only when you have a real GS1 number. Do not invent retail codes for products you sell publicly.</p>'
			},
			{
				question: 'Does the tool add the check digit?',
				answer: '<p>JsBarcode adds the check digit when you enter 12 digits for EAN-13 or 11 for UPC-A. If you paste a full code including the check digit, it is validated as-is.</p>'
			},
			{
				question: 'Can a phone scan these?',
				answer: '<p>Yes, most camera apps read CODE128, EAN, and UPC. Dedicated hardware scanners are still more reliable in warehouses.</p>'
			}
		],
		relatedTools: [
			{ name: 'Barcode Reader', path: '/qr/barcode-reader', description: 'Decode a barcode from a photo' },
			{ name: 'QR Generator', path: '/qr/generator', description: 'Need more than a few dozen characters? Use a QR code' }
		],
		tips: [
			'Keep bars tall enough for handheld scanners — 1 inch is a safe starting point for labels.',
			'Do not stretch a barcode in a design tool; scale SVG uniformly.',
			'Leave quiet space on the left and right of the bars.'
		],
		commonMistakes: [
			'Using EAN-13 for a made-up number that will collide with a real product',
			'Printing CODE39 in lowercase (this tool uppercases it)',
			'Shrinking bars so much that a laser sees them as a single blob'
		]
	},

	'barcode-reader': {
		features: [
			'Read CODE128, CODE39, EAN-13, EAN-8, UPC, ITF, Codabar, and similar 1D codes',
			'Upload an image or scan with the camera',
			'Shows the symbology name and the decoded value',
			'Local ZXing decode — images are not uploaded'
		],
		useCases: [
			'Capture a product code from a photo when you have no hardware scanner',
			'Verify a label you just printed',
			'Copy an EAN or UPC into inventory software'
		],
		concept: {
			title: 'Reading 1D barcodes in a browser',
			content: `<p>The reader converts the image to a binary bitmap and runs ZXing’s 1D detectors. Good lighting, a straight-on photo, and a crop that includes the quiet zones on both sides matter more than megapixels.</p>
<p class="mt-2">QR codes are handled on the QR Reader page. If you point this tool at a QR, it may ignore it on purpose so product codes are not mixed with URLs.</p>`
		},
		examples: [
			{ label: 'EAN-13 result', code: '5901234123457', isValid: true },
			{ label: 'CODE128 result', code: 'ONDEV-12345', isValid: true },
			{ label: 'Blurry shelf photo', code: '(no result)', isValid: false }
		],
		faqs: [
			{
				question: 'It will not read my barcode. What next?',
				answer: '<p>Crop to a single code, flatten the angle, and avoid glare. If the bars are printed smaller than a few millimeters, a dedicated scanner will still beat a webcam.</p>'
			},
			{
				question: 'Which formats are supported?',
				answer: '<p>CODE128, CODE39, CODE93, EAN-13, EAN-8, UPC-A, UPC-E, ITF, Codabar, and RSS-14. QR and other 2D codes belong on the QR Reader.</p>'
			}
		],
		relatedTools: [
			{ name: 'Barcode Generator', path: '/qr/barcode', description: 'Create a matching 1D barcode' },
			{ name: 'QR Reader', path: '/qr/reader', description: 'Decode QR, Data Matrix, and Aztec' }
		],
		tips: [
			'Hold the camera parallel to the label; perspective squeeze is a common miss.',
			'If a screenshot from a PDF fails, export a PNG instead of photographing the screen.'
		],
		commonMistakes: [
			'Including several barcodes in one photo without cropping',
			'Using this reader on a QR code (use QR Reader instead)',
			'Expecting ISBN/Bookland codes to appear as ISBN text rather than EAN-13 digits'
		]
	}
};

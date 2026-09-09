import type { ToolContent } from './types';

type ConvertToolContent = ToolContent;

export const convertToolsContent: Record<string, ConvertToolContent> = {
	'css-units': {
		features: [
			'Convert between px, rem, em, vw, vh, and percentages',
			'Physical units: pt, pc, in, cm, mm',
			'Configurable base font size for rem/em calculations',
			'Viewport dimensions for vw/vh calculations',
			'Quick presets for common font sizes',
			'Clamp() generator for fluid typography'
		],
		useCases: [
			'Convert pixel values to responsive rem units',
			'Calculate viewport units for fluid layouts',
			'Generate CSS clamp() for fluid typography',
			'Convert print units (pt) to web units (px)',
			'Understand relative vs absolute CSS units'
		],
		concept: {
			title: 'CSS Unit System',
			content: `<p>CSS units are divided into <strong>absolute</strong> (fixed size) and <strong>relative</strong> (based on other values) categories. Understanding when to use each type is crucial for responsive design.</p>
			
			<p><strong>Relative Units:</strong></p>
			<ul>
				<li><strong>rem:</strong> Relative to root font size (html element), best for consistent sizing</li>
				<li><strong>em:</strong> Relative to parent font size, useful for component-relative sizing</li>
				<li><strong>%:</strong> Percentage of parent element's dimension</li>
				<li><strong>vw/vh:</strong> Percentage of viewport width/height, perfect for full-screen layouts</li>
			</ul>
			
			<p><strong>Absolute Units:</strong></p>
			<ul>
				<li><strong>px:</strong> Pixels, fixed size but scales with device pixel ratio</li>
				<li><strong>pt:</strong> Points (1/72 inch), primarily for print</li>
				<li><strong>in/cm/mm:</strong> Physical measurements, used in print stylesheets</li>
			</ul>
			
			<p><strong>Best Practices:</strong></p>
			<ul>
				<li>Use <code>rem</code> for font sizes and spacing—easier to scale globally</li>
				<li>Use <code>em</code> for padding/margin within components</li>
				<li>Use <code>vw/vh</code> for viewport-based layouts (hero sections, full-screen)</li>
				<li>Use <code>px</code> for borders and fixed-size elements</li>
				<li>Use <code>clamp()</code> for fluid typography that scales with viewport</li>
			</ul>`
		},
		examples: [
			{
				label: 'Font Size Conversion',
				code: '16px = 1rem (with 16px base)',
				isValid: true
			},
			{
				label: 'Viewport Units',
				code: '1920px width: 100px = 5.21vw',
				isValid: true
			},
			{
				label: 'Fluid Typography',
				code: 'clamp(1rem, 2vw + 0.5rem, 2rem)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Should I use px or rem for font sizes?',
				answer:
					"Use rem for font sizes. It respects user browser settings (accessibility) and makes global scaling easier. If a user sets their browser to larger text, rem scales but px doesn't."
			},
			{
				question: "What's the difference between rem and em?",
				answer:
					'rem is always relative to the root (html) font size, while em is relative to the parent element. rem is more predictable; em can compound with nesting (2em inside 2em = 4× base size).'
			},
			{
				question: 'When should I use vw/vh units?',
				answer:
					'Use vw/vh for full-screen sections, hero images, or elements that should scale with viewport size. Avoid for body text—viewport units can become too small on mobile or too large on desktop.'
			},
			{
				question: 'What is CSS clamp() and when should I use it?',
				answer:
					"clamp(min, preferred, max) sets a value that scales between min and max. Use it for fluid typography that's readable on all screen sizes: clamp(1rem, 2.5vw, 3rem) scales with viewport but never goes below 1rem or above 3rem."
			},
			{
				question: 'Do viewport units work in all browsers?',
				answer:
					'Yes, vw/vh have excellent support (IE9+). However, mobile browsers may calculate vh differently when address bars appear/disappear. Use svh (small viewport height) for more predictable behavior in modern browsers.'
			}
		],
		relatedTools: [
			{
				name: 'Typography Converter',
				path: '/convert/typography',
				description: 'Advanced typography and line-height calculator'
			},
			{
				name: 'Length Converter',
				path: '/convert/length',
				description: 'Convert physical length measurements'
			},
			{
				name: 'Screen / Resolution',
				path: '/convert/screen',
				description: 'Calculate screen dimensions and DPI'
			},
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format and beautify CSS code' }
		],
		tips: [
			'Set base font size to 16px (browser default) and use rem for all font sizes—easier accessibility',
			'Use clamp() for fluid typography: clamp(1rem, 2vw + 0.5rem, 2rem) scales smoothly across devices',
			'Avoid using em for font sizes—nesting compounds the multiplier. Use rem instead',
			'For consistent spacing, define a scale: 0.25rem, 0.5rem, 1rem, 1.5rem, 2rem, 3rem, 4rem'
		]
	},
	length: {
		features: [
			'Convert mm, cm, meters, kilometers',
			'Imperial units: inches, feet, yards, miles',
			'Pixel conversion with configurable DPI',
			'Metric and imperial systems in one tool',
			'Precision up to 6 decimal places',
			'Quick reference for common conversions'
		],
		useCases: [
			'Convert design mockup measurements to CSS pixels',
			'Calculate print dimensions from pixel sizes',
			'Convert physical dimensions for 3D printing',
			'Understand screen sizes in different units',
			'Convert map distances between metric and imperial'
		],
		concept: {
			title: 'Length Measurement Systems',
			content: `<p>Length measurement uses two primary systems: <strong>Metric</strong> (meters, centimeters, millimeters) and <strong>Imperial</strong> (inches, feet, yards). Web design also uses <strong>pixels</strong>, which vary with screen DPI.</p>
			
			<p><strong>Metric System:</strong></p>
			<ul>
				<li><strong>Millimeter (mm):</strong> 1/1000 of a meter, precision measurements</li>
				<li><strong>Centimeter (cm):</strong> 1/100 of a meter, common for everyday objects</li>
				<li><strong>Meter (m):</strong> Base unit, human scale (height, room dimensions)</li>
				<li><strong>Kilometer (km):</strong> 1000 meters, for distances</li>
			</ul>
			
			<p><strong>Imperial System:</strong></p>
			<ul>
				<li><strong>Inch (in):</strong> 2.54 cm, common for screens and paper</li>
				<li><strong>Foot (ft):</strong> 12 inches, used for height and room dimensions</li>
				<li><strong>Yard (yd):</strong> 3 feet, fabric and sports measurements</li>
				<li><strong>Mile (mi):</strong> 5280 feet, long distances</li>
			</ul>
			
			<p><strong>Pixels and DPI:</strong></p>
			<ul>
				<li><strong>DPI (Dots Per Inch):</strong> Pixel density—higher DPI = more pixels per inch</li>
				<li><strong>Standard DPI:</strong> 96 DPI for web, 72 DPI for older screens, 300 DPI for print</li>
				<li><strong>CSS pixels:</strong> Not physical pixels—1 CSS px ≈ 1/96 inch on standard displays</li>
				<li><strong>Retina displays:</strong> 2× or 3× device pixel ratio (2× CSS px = 4× physical pixels)</li>
			</ul>`
		},
		examples: [
			{
				label: 'Screen Size',
				code: '27-inch monitor = 68.58 cm diagonal',
				isValid: true
			},
			{
				label: 'Print Conversion',
				code: '300 DPI: 1 inch = 300 pixels',
				isValid: true
			},
			{
				label: 'Physical Distance',
				code: '1 mile = 1.609 kilometers',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What DPI should I use for web design?',
				answer:
					'96 DPI is the web standard. However, modern displays (Retina, HiDPI) have 2× or 3× pixel density. Design at 1× and let CSS handle scaling with device-pixel-ratio.'
			},
			{
				question: 'How do I convert pixels to inches for print?',
				answer:
					'Divide pixels by DPI. For print, use 300 DPI: 3000px width ÷ 300 DPI = 10 inches wide. For web previews, use 96 DPI: 960px ÷ 96 DPI = 10 inches.'
			},
			{
				question: 'Is 1 CSS pixel always the same size?',
				answer:
					'No, 1 CSS pixel is a reference unit, not a physical pixel. On Retina displays (2× DPR), 1 CSS pixel = 4 physical pixels (2×2). This ensures consistent visual size across devices.'
			},
			{
				question: "What's the difference between DPI and PPI?",
				answer:
					'DPI (Dots Per Inch) is for printers; PPI (Pixels Per Inch) is for screens. Both measure density—higher values mean sharper images. For screens, PPI is technically correct, but DPI is commonly used.'
			},
			{
				question: 'How do I measure screen size from resolution?',
				answer:
					'You need resolution AND DPI. Example: 1920×1080 at 96 DPI = 20×11.25 inches. Use the Screen/Resolution tool for automatic calculation of physical dimensions from resolution.'
			}
		],
		relatedTools: [
			{
				name: 'Screen / Resolution',
				path: '/convert/screen',
				description: 'Calculate screen dimensions from resolution and DPI'
			},
			{
				name: 'CSS Units',
				path: '/convert/css-units',
				description: 'Convert CSS units including pixels'
			},
			{
				name: 'Data Size',
				path: '/convert/data-size',
				description: 'Convert file sizes and data units'
			},
			{
				name: 'Angle Converter',
				path: '/convert/angle',
				description: 'Convert degrees, radians, and more'
			}
		],
		tips: [
			'For print designs, always use 300 DPI—anything less will look pixelated when printed',
			'Web standard is 96 DPI, but design graphics at 2× for Retina displays (192 DPI effective)',
			'1 inch = 2.54 cm exactly—useful for converting design mockups between systems',
			'For screen sizes, diagonal measurement is standard: √(width² + height²) in inches'
		]
	},
	screen: {
		features: [
			'Calculate physical dimensions from resolution',
			'Convert DPI/PPI to screen size',
			'Aspect ratio calculator',
			'Pixel density (PPI) calculator',
			'Compare different screen resolutions',
			'Viewport size visualization'
		],
		useCases: [
			'Find physical size of a monitor from its resolution',
			'Calculate PPI for Retina display detection',
			'Determine aspect ratio for responsive design',
			'Compare phone screen densities',
			'Calculate viewing distance for optimal readability'
		],
		concept: {
			title: 'Screen Resolution and Pixel Density',
			content: `<p>Screen resolution (width × height in pixels) combined with physical size determines <strong>pixel density (PPI)</strong>—a key factor in display quality and responsive design.</p>
			
			<p><strong>Key Concepts:</strong></p>
			<ul>
				<li><strong>Resolution:</strong> Number of pixels (e.g., 1920×1080, 2560×1440)</li>
				<li><strong>PPI (Pixels Per Inch):</strong> Pixel density—higher PPI = sharper display</li>
				<li><strong>Aspect Ratio:</strong> Width:Height ratio (16:9, 21:9, 4:3)</li>
				<li><strong>Device Pixel Ratio (DPR):</strong> Physical pixels per CSS pixel (1×, 2×, 3×)</li>
			</ul>
			
			<p><strong>Common Resolutions:</strong></p>
			<ul>
				<li><strong>HD (1280×720):</strong> 720p, budget monitors and TVs</li>
				<li><strong>Full HD (1920×1080):</strong> 1080p, standard for most displays</li>
				<li><strong>QHD/2K (2560×1440):</strong> 1440p, high-end monitors</li>
				<li><strong>4K UHD (3840×2160):</strong> 2160p, premium displays and TVs</li>
				<li><strong>Mobile:</strong> 390×844 (iPhone), 412×915 (Android typical)</li>
			</ul>
			
			<p><strong>PPI Categories:</strong></p>
			<ul>
				<li><strong>Low (~90-120 PPI):</strong> Standard desktop monitors, visible pixels</li>
				<li><strong>Retina (~220-260 PPI):</strong> Apple displays, imperceptible pixels at normal distance</li>
				<li><strong>High (~300-450 PPI):</strong> Modern smartphones, very sharp</li>
				<li><strong>Ultra (~500+ PPI):</strong> Flagship phones, VR headsets</li>
			</ul>
			
			<p><strong>DPI vs PPI:</strong> DPI (Dots Per Inch) is for printers; PPI (Pixels Per Inch) for screens. The terms are often used interchangeably, but PPI is technically correct for displays.</p>`
		},
		examples: [
			{
				label: '27-inch 4K Monitor',
				code: '3840×2160 @ 27" = 163 PPI',
				isValid: true
			},
			{
				label: 'iPhone 14',
				code: '1170×2532 @ 6.1" = 460 PPI',
				isValid: true
			},
			{
				label: 'Standard Laptop',
				code: '1920×1080 @ 15.6" = 141 PPI',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's a good PPI for a monitor?",
				answer:
					'For desktop monitors at 20-30 inches distance, 110-140 PPI is comfortable. Higher (160-220 PPI) is sharper but requires UI scaling. For laptops, 140-180 PPI is ideal. Phones need 300+ PPI for sharp text at close distance.'
			},
			{
				question: 'How is PPI calculated?',
				answer:
					'PPI = √(width² + height²) ÷ diagonal size. For a 27" 4K monitor: √(3840² + 2160²) ÷ 27 ≈ 163 PPI. Higher PPI means sharper images and text.'
			},
			{
				question: 'What is device pixel ratio (DPR)?',
				answer:
					'DPR is physical pixels per CSS pixel. A 2× Retina display uses 4 physical pixels (2×2) for each CSS pixel. This maintains consistent visual size while increasing sharpness. Check with window.devicePixelRatio in JavaScript.'
			},
			{
				question: 'Why do phones have much higher PPI than monitors?',
				answer:
					"Viewing distance! Phones are held 10-12 inches from eyes, monitors 20-30 inches away. To look equally sharp, phones need ~300-400 PPI while monitors need only ~110-140 PPI. It's about perceived sharpness, not absolute PPI."
			},
			{
				question: "What's the difference between 2K and 4K?",
				answer:
					'2K (2560×1440) has ~3.7M pixels; 4K (3840×2160) has ~8.3M pixels—more than double. 4K is sharper but requires more GPU power. For monitors <27", the difference is subtle. For 32"+, 4K is noticeably better.'
			}
		],
		relatedTools: [
			{
				name: 'Length Converter',
				path: '/convert/length',
				description: 'Convert physical measurements and DPI'
			},
			{
				name: 'CSS Units',
				path: '/convert/css-units',
				description: 'Convert vw/vh based on viewport size'
			},
			{
				name: 'Data Size',
				path: '/convert/data-size',
				description: 'Calculate image file sizes for different resolutions'
			},
			{
				name: 'Angle Converter',
				path: '/convert/angle',
				description: 'Calculate viewing angles and FOV'
			}
		],
		tips: [
			'For responsive design, test at 375×667 (mobile), 1366×768 (laptop), 1920×1080 (desktop)',
			'Retina detection: if devicePixelRatio ≥ 2, serve 2× resolution images (@2x suffix)',
			'Common aspect ratios: 16:9 (widescreen), 21:9 (ultrawide), 4:3 (old monitors), 16:10 (MacBook)',
			'Calculate image file size: width × height × 3 bytes (RGB) or × 4 bytes (RGBA)'
		]
	},
	time: {
		features: [
			'Convert milliseconds, seconds, minutes, hours, days',
			'Human-readable time format output',
			'Precise decimal conversions',
			'Unix timestamp support',
			'Duration calculator',
			'Time unit breakdown'
		],
		useCases: [
			'Convert API timeout values (ms to seconds)',
			'Calculate cache expiration times',
			'Understand JavaScript setTimeout delays',
			'Convert video durations between formats',
			'Calculate project time estimates'
		],
		concept: {
			title: 'Time Units and Conversions',
			content: `<p>Time units range from milliseconds (1/1000 second) to days. Understanding conversions is essential for programming, especially when working with APIs, timers, and duration calculations.</p>
			
			<p><strong>Standard Time Units:</strong></p>
			<ul>
				<li><strong>Millisecond (ms):</strong> 1/1000 second, used in JavaScript timing (setTimeout, Date.now())</li>
				<li><strong>Second (s):</strong> Base SI unit, human-perceivable time intervals</li>
				<li><strong>Minute (min):</strong> 60 seconds, short durations</li>
				<li><strong>Hour (h):</strong> 60 minutes = 3600 seconds, work periods</li>
				<li><strong>Day (d):</strong> 24 hours = 86,400 seconds, calendar unit</li>
			</ul>
			
			<p><strong>Programming Context:</strong></p>
			<ul>
				<li><strong>JavaScript:</strong> setTimeout/setInterval use milliseconds: setTimeout(fn, 5000) = 5 seconds</li>
				<li><strong>Unix timestamp:</strong> Seconds since Jan 1, 1970 UTC (Date.now() returns ms)</li>
				<li><strong>HTTP caching:</strong> max-age in seconds: Cache-Control: max-age=3600 = 1 hour</li>
				<li><strong>Database intervals:</strong> Often seconds or milliseconds for precision</li>
			</ul>
			
			<p><strong>Common Durations:</strong></p>
			<ul>
				<li><strong>1 day:</strong> 86,400 seconds = 86,400,000 milliseconds</li>
				<li><strong>1 hour:</strong> 3,600 seconds = 3,600,000 ms</li>
				<li><strong>1 minute:</strong> 60 seconds = 60,000 ms</li>
				<li><strong>1 week:</strong> 604,800 seconds = 7 days</li>
			</ul>
			
			<p><strong>Human-readable format:</strong> Large values are easier to understand when broken down: 3665 seconds = "1 hour, 1 minute, 5 seconds"</p>`
		},
		examples: [
			{
				label: 'JavaScript setTimeout',
				code: '5000ms = 5 seconds',
				isValid: true
			},
			{
				label: 'HTTP Cache Duration',
				code: '86400s = 1 day',
				isValid: true
			},
			{
				label: 'Video Duration',
				code: '125 minutes = 2 hours 5 minutes',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does JavaScript use milliseconds for setTimeout?',
				answer:
					'Milliseconds provide precision for animations and timers. setTimeout(fn, 1000) waits 1 second. Using ms avoids decimals (1.5 seconds = 1500ms) and allows sub-second precision for smooth animations (16.67ms ≈ 60fps).'
			},
			{
				question: "What's the difference between Date.now() and new Date()?",
				answer:
					'Date.now() returns a number (milliseconds since Unix epoch). new Date() returns a Date object with methods. Use Date.now() for timestamps and performance.now() for precise intervals (sub-millisecond accuracy).'
			},
			{
				question: 'How do I convert hours to milliseconds?',
				answer:
					'Multiply by 60 (minutes) × 60 (seconds) × 1000 (milliseconds): 1 hour = 1× 60 × 60 × 1000 = 3,600,000ms. For 24 hours: 24 × 3600000 = 86,400,000ms.'
			},
			{
				question: 'What is Unix timestamp and why use it?',
				answer:
					"Unix timestamp is seconds since Jan 1, 1970 UTC (epoch). It's timezone-independent, easy to compare/sort, and compact for storage. Most systems use it internally, then convert to local time for display."
			},
			{
				question: 'How accurate is setTimeout in JavaScript?',
				answer:
					'setTimeout is not precise—delays can vary by 1-10ms or more depending on browser load. For critical timing (animations), use requestAnimationFrame. For precise intervals, use Web Workers or server-side timing.'
			}
		],
		relatedTools: [
			{
				name: 'Number Base',
				path: '/convert/number-base',
				description: 'Convert timestamps between number systems'
			},
			{
				name: 'Data Size',
				path: '/convert/data-size',
				description: 'Calculate data transfer rates over time'
			},
			{
				name: 'CSS Units',
				path: '/convert/css-units',
				description: 'Convert CSS timing (s/ms for animations)'
			},
			{
				name: 'Cron Generator',
				path: '/cron/generator',
				description: 'Schedule tasks at specific times'
			}
		],
		tips: [
			'For HTTP caching, use seconds: Cache-Control: max-age=86400 (1 day), max-age=3600 (1 hour)',
			'JavaScript: performance.now() is more accurate than Date.now() for measuring intervals',
			'Avoid hardcoding milliseconds—use constants: const ONE_DAY_MS = 24 * 60 * 60 * 1000;',
			'For human-readable durations, use libraries like date-fns or day.js instead of manual conversion'
		]
	},
	'data-size': {
		features: [
			'Convert between bytes, KB, MB, GB, TB, PB',
			'Decimal (SI) and binary (IEC) unit systems',
			'Understand KB vs KiB difference',
			'File size calculator',
			'Data transfer rate estimation',
			'Storage capacity comparison'
		],
		useCases: [
			'Compare file sizes across platforms',
			'Understand storage capacity (HDD, SSD)',
			'Calculate download times at different speeds',
			'Optimize image sizes for web performance',
			'Plan database storage requirements'
		],
		concept: {
			title: 'Data Size Units: Decimal vs Binary',
			content: `<p>Data size uses two systems: <strong>Decimal (SI)</strong> based on powers of 1000, and <strong>Binary (IEC)</strong> based on powers of 1024. This causes confusion when "1 GB" means different things.</p>
			
			<p><strong>Decimal Units (SI - International System):</strong></p>
			<ul>
				<li><strong>Kilobyte (KB):</strong> 1,000 bytes (10³)</li>
				<li><strong>Megabyte (MB):</strong> 1,000 KB = 1,000,000 bytes (10⁶)</li>
				<li><strong>Gigabyte (GB):</strong> 1,000 MB = 1,000,000,000 bytes (10⁹)</li>
				<li><strong>Terabyte (TB):</strong> 1,000 GB = 1,000,000,000,000 bytes (10¹²)</li>
			</ul>
			
			<p><strong>Binary Units (IEC - Binary Prefixes):</strong></p>
			<ul>
				<li><strong>Kibibyte (KiB):</strong> 1,024 bytes (2¹⁰)</li>
				<li><strong>Mebibyte (MiB):</strong> 1,024 KiB = 1,048,576 bytes (2²⁰)</li>
				<li><strong>Gibibyte (GiB):</strong> 1,024 MiB = 1,073,741,824 bytes (2³⁰)</li>
				<li><strong>Tebibyte (TiB):</strong> 1,024 GiB = 1,099,511,627,776 bytes (2⁴⁰)</li>
			</ul>
			
			<p><strong>The Confusion:</strong></p>
			<ul>
				<li><strong>Hard drive manufacturers:</strong> Use decimal (1 TB = 1,000 GB)</li>
				<li><strong>Operating systems (Windows):</strong> Use binary but label as GB (1 GB = 1,024 MB)</li>
				<li><strong>Result:</strong> A "1 TB" drive shows as ~931 GB in Windows (it's actually 931 GiB)</li>
				<li><strong>Solution:</strong> Use GiB/MiB for clarity, or specify "1 TB = 1,000 GB (decimal)"</li>
			</ul>
			
			<p><strong>Web Context:</strong> Most web tools (file uploads, downloads) use decimal (MB/GB). Network speeds use decimal (100 Mbps Megabits per second). Storage APIs may vary—always check documentation.</p>`
		},
		examples: [
			{
				label: 'Hard Drive Capacity',
				code: '1 TB (decimal) = 931 GiB (binary)',
				isValid: true
			},
			{
				label: 'Image File Size',
				code: '5 MB (5,000,000 bytes) JPEG',
				isValid: true
			},
			{
				label: 'RAM Specification',
				code: '16 GB = 16 GiB = 17,179,869,184 bytes',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does my 1 TB hard drive show as 931 GB in Windows?',
				answer:
					'Hard drive makers use decimal (1 TB = 1,000 GB), but Windows uses binary and displays GiB as "GB". 1 TB = 1,000,000,000,000 bytes ÷ 1,073,741,824 bytes/GiB ≈ 931 GiB. You\'re not losing space—it\'s a labeling difference.'
			},
			{
				question: "What's the difference between MB and MiB?",
				answer:
					'MB (Megabyte) = 1,000,000 bytes (decimal). MiB (Mebibyte) = 1,048,576 bytes (binary). MiB is ~4.9% larger. Use MiB for clarity when referring to binary (RAM, file systems); MB for network/file sizes.'
			},
			{
				question: 'Which system should I use?',
				answer:
					'Use decimal (KB, MB, GB) for file sizes, network speeds, and storage (matches industry standard). Use binary (KiB, MiB, GiB) when discussing RAM or being precise about powers of 1024. Specify which you mean to avoid confusion.'
			},
			{
				question: 'How do I calculate file upload time?',
				answer:
					'File size (megabytes) ÷ upload speed (Mbps) × 8 bits/byte. Example: 100 MB file at 10 Mbps: 100 ÷ 10 × 8 = 80 seconds. Note: Mbps is megabits per second, MB is megabytes (8× difference).'
			},
			{
				question: "What's the largest data unit?",
				answer:
					'Petabyte (PB, 1,000 TB), Exabyte (EB, 1,000 PB), Zettabyte (ZB, 1,000 EB), Yottabyte (YB, 1,000 ZB). Google processes ~20 PB daily. Total internet traffic: ~1 ZB/month in 2024. Human brain: ~2.5 PB capacity.'
			}
		],
		relatedTools: [
			{
				name: 'Number Base',
				path: '/convert/number-base',
				description: 'Convert between binary and decimal numbers'
			},
			{
				name: 'Time Converter',
				path: '/convert/time',
				description: 'Calculate download/upload times'
			},
			{
				name: 'Length Converter',
				path: '/convert/length',
				description: 'Physical size of storage media'
			},
			{ name: 'CSS Units', path: '/convert/css-units', description: 'Optimize image sizes for web' }
		],
		tips: [
			'Always specify decimal (GB) vs binary (GiB) to avoid confusion—especially in technical docs',
			'For web images: aim for <100 KB per image, <500 KB for hero images, use WebP for better compression',
			'Internet speeds are in megabits (Mbps), file sizes in megabytes (MB)—divide speed by 8 for MB/s',
			'1 GiB RAM ≈ 1.074 GB. When buying RAM, "16 GB" usually means 16 GiB (17.2 GB decimal)'
		]
	},
	angle: {
		features: [
			'Convert degrees, radians, gradians, turns',
			'Visual arc preview for angle',
			'Trigonometric values (sin, cos, tan)',
			'Common angle quick reference',
			'Full circle and half circle calculations',
			'Angle normalization to 0-360°'
		],
		useCases: [
			'Convert CSS transform angles (deg to turn)',
			'Calculate trigonometric functions for canvas',
			'Convert between JavaScript Math (radians) and CSS (degrees)',
			'Understand rotation values in animations',
			'Calculate compass bearings'
		],
		concept: {
			title: 'Angle Measurement Systems',
			content: `<p>Angles are measured in four main units: <strong>degrees</strong> (most common), <strong>radians</strong> (mathematics/programming), <strong>gradians</strong> (rare, engineering), and <strong>turns</strong> (CSS, intuitive).</p>
			
			<p><strong>Angle Units:</strong></p>
			<ul>
				<li><strong>Degree (°):</strong> 1/360 of a full circle, most intuitive (90° = right angle)</li>
				<li><strong>Radian (rad):</strong> Arc length equal to radius, used in trigonometry (π radians = 180°)</li>
				<li><strong>Gradian (grad):</strong> 1/400 of a full circle, rarely used (100 grad = 90°)</li>
				<li><strong>Turn:</strong> Full rotations, used in CSS (0.25 turn = 90°, 1 turn = 360°)</li>
			</ul>
			
			<p><strong>Common Angles:</strong></p>
			<ul>
				<li><strong>Full circle:</strong> 360° = 2π rad = 400 grad = 1 turn</li>
				<li><strong>Half circle:</strong> 180° = π rad = 200 grad = 0.5 turn</li>
				<li><strong>Right angle:</strong> 90° = π/2 rad = 100 grad = 0.25 turn</li>
				<li><strong>45° angle:</strong> π/4 rad = 50 grad = 0.125 turn</li>
			</ul>
			
			<p><strong>Programming Context:</strong></p>
			<ul>
				<li><strong>JavaScript Math:</strong> Uses radians (Math.sin(Math.PI / 2) = 1)</li>
				<li><strong>CSS:</strong> Accepts deg, rad, grad, turn (transform: rotate(90deg))</li>
				<li><strong>Canvas:</strong> arc() uses radians, often needs conversion from degrees</li>
				<li><strong>Conversion:</strong> radians = degrees × π/180, degrees = radians × 180/π</li>
			</ul>
			
			<p><strong>Why radians?</strong> In calculus and physics, radians make formulas simpler (arc length = radius × angle in radians). That's why programming languages use radians by default.</p>`
		},
		examples: [
			{
				label: 'Right Angle',
				code: '90° = 1.5708 rad = 0.25 turn',
				isValid: true
			},
			{
				label: 'Half Circle',
				code: '180° = π rad = 0.5 turn',
				isValid: true
			},
			{
				label: 'CSS Rotation',
				code: 'transform: rotate(0.5turn) = 180°',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does JavaScript use radians instead of degrees?',
				answer:
					'Radians are the mathematical standard because they simplify calculus and physics formulas. To convert: radians = degrees × Math.PI / 180. For 90°: 90 × π / 180 = π/2 ≈ 1.5708 radians.'
			},
			{
				question: 'What are turns in CSS and when should I use them?',
				answer:
					'Turns are full rotations: 1 turn = 360°, 0.5 turn = 180°. Use turns for animations that need multiple rotations (5 turns) or when fractions make sense (0.25 turn instead of 90deg). More intuitive than degrees for full rotations.'
			},
			{
				question: 'How do I convert degrees to radians?',
				answer:
					'Multiply by π/180: radians = degrees × (Math.PI / 180). Example: 45° × π/180 = 0.7854 rad. Or divide by 180 and multiply by π: 45/180 × π = π/4.'
			},
			{
				question: "What are gradians and why don't we use them?",
				answer:
					"Gradians (1/400 of a circle) were designed so a right angle = 100 grad (easier decimal math). They're used in some surveying and engineering, but degrees and radians dominate because of historical adoption and mathematical convenience."
			},
			{
				question: 'How do I normalize an angle to 0-360°?',
				answer:
					'Use modulo: normalized = angle % 360. For negative angles: normalized = (angle % 360 + 360) % 360. Example: 450° % 360 = 90°, -45° normalized = 315°. This ensures angles are in the standard 0-360° range.'
			}
		],
		relatedTools: [
			{
				name: 'Number Base',
				path: '/convert/number-base',
				description: 'Convert angle decimal values to other bases'
			},
			{
				name: 'CSS Units',
				path: '/convert/css-units',
				description: 'CSS transform and animation units'
			},
			{
				name: 'Typography',
				path: '/convert/typography',
				description: 'Text rotation and skew angles'
			},
			{
				name: 'CSS Formatter',
				path: '/css/formatter',
				description: 'Format CSS with transform values'
			}
		],
		tips: [
			'For CSS animations with multiple rotations, use turns: @keyframes { from { rotate: 0turn } to { rotate: 5turn } }',
			'JavaScript Math.sin/cos/tan expect radians—convert first: Math.sin(90 * Math.PI / 180) = 1',
			'Radians cheatsheet: π/6 = 30°, π/4 = 45°, π/3 = 60°, π/2 = 90°, π = 180°, 2π = 360°',
			'For compass bearings: 0° = North, 90° = East, 180° = South, 270° = West'
		]
	},
	'number-base': {
		features: [
			'Convert between binary, decimal, hexadecimal, octal',
			'Bit visualization for binary',
			'Signed and unsigned integer support',
			'ASCII character encoding',
			'Color hex codes (#RRGGBB)',
			"Negative number representation (two's complement)"
		],
		useCases: [
			'Convert hex color codes to RGB',
			'Understand binary in programming',
			'Convert file permissions (octal) in Unix/Linux',
			'Decode hexadecimal memory addresses',
			'Work with bitwise operations'
		],
		concept: {
			title: 'Number Base Systems',
			content: `<p>Number bases (or radixes) define how we represent numbers. Our familiar decimal uses 10 digits (0-9), but computers use <strong>binary (base-2)</strong>, and programmers often use <strong>hexadecimal (base-16)</strong> and <strong>octal (base-8)</strong>.</p>
			
			<p><strong>Common Number Bases:</strong></p>
			<ul>
				<li><strong>Binary (base-2):</strong> Uses 0 and 1, how computers store data (0b1010 = 10)</li>
				<li><strong>Octal (base-8):</strong> Uses 0-7, common in Unix file permissions (0755)</li>
				<li><strong>Decimal (base-10):</strong> Uses 0-9, human standard (42)</li>
				<li><strong>Hexadecimal (base-16):</strong> Uses 0-9, A-F, compact binary (0xFF = 255)</li>
			</ul>
			
			<p><strong>Why Different Bases?</strong></p>
			<ul>
				<li><strong>Binary:</strong> Computers use binary—transistors are either on (1) or off (0)</li>
				<li><strong>Hexadecimal:</strong> Each hex digit = 4 binary bits (nibble). Easier to read than long binary strings</li>
				<li><strong>Octal:</strong> Each octal digit = 3 bits. Used in Unix permissions: 755 = 111,101,101 (rwxr-xr-x)</li>
			</ul>
			
			<p><strong>Common Use Cases:</strong></p>
			<ul>
				<li><strong>Colors:</strong> #FF5733 (hex) = rgb(255, 87, 51)</li>
				<li><strong>Memory addresses:</strong> 0x7FFF5C9A (hexadecimal)</li>
				<li><strong>File permissions:</strong> chmod 755 (octal: owner rwx, group r-x, others r-x)</li>
				<li><strong>Bitwise ops:</strong> 0b1010 & 0b0110 = 0b0010 (AND operation)</li>
				<li><strong>IPv6 addresses:</strong> 2001:0db8:85a3::8a2e:0370:7334 (hexadecimal)</li>
			</ul>
			
			<p><strong>Notation:</strong></p>
			<ul>
				<li><strong>Binary:</strong> 0b or 0B prefix (0b1010)</li>
				<li><strong>Octal:</strong> 0 prefix (0755) or 0o (0o755)</li>
				<li><strong>Hex:</strong> 0x or 0X prefix (0xFF) or # for colors (#FF00AA)</li>
			</ul>`
		},
		examples: [
			{
				label: 'Color Hex to RGB',
				code: '#FF5733 = 255, 87, 51',
				isValid: true
			},
			{
				label: 'Binary to Decimal',
				code: '0b1010 = 10',
				isValid: true
			},
			{
				label: 'Unix File Permission',
				code: '0755 (octal) = rwxr-xr-x',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How do I convert hex color codes to RGB?',
				answer:
					'Split hex into 3 pairs (RR, GG, BB), convert each to decimal. #FF5733: FF=255, 57=87, 33=51 → rgb(255,87,51). Each hex pair is 0-FF (0-255). Use this tool for instant conversion.'
			},
			{
				question: 'What do Unix file permissions like 755 mean?',
				answer:
					'755 (octal) = 111,101,101 (binary). Each digit is user/group/others. 7(111)=rwx, 5(101)=r-x, 5(101)=r-x. So 755 = owner can read/write/execute, others can read/execute. Common: 644 (rw-r--r--), 755 (rwxr-xr-x).'
			},
			{
				question: 'Why do programmers use hexadecimal so much?',
				answer:
					'Hex is compact—1 hex digit = 4 bits. A byte (8 bits) = 2 hex digits. Binary 11111111 = FF (much shorter). Memory addresses, colors, and byte data are easier to read in hex than long binary strings.'
			},
			{
				question: "What is two's complement for negative numbers?",
				answer:
					"Two's complement represents negative numbers in binary. Invert all bits and add 1. For -5 in 8-bit: 5 = 00000101, invert = 11111010, +1 = 11111011 (-5). Leftmost bit indicates sign (1=negative). Computers use this for arithmetic."
			},
			{
				question: 'How do I count in binary?',
				answer:
					'0, 1, 10, 11, 100, 101, 110, 111, 1000... Same as decimal but only using 0 and 1. Each position is a power of 2: 1010 = (1×8) + (0×4) + (1×2) + (0×1) = 10.'
			}
		],
		relatedTools: [
			{
				name: 'Color Converter',
				path: '/convert/color',
				description: 'Convert hex colors to RGB, HSL, and more'
			},
			{
				name: 'Data Size',
				path: '/convert/data-size',
				description: 'File sizes in different bases'
			},
			{ name: 'Typography', path: '/convert/typography', description: 'Convert typography values' },
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format hex colors in CSS' }
		],
		tips: [
			'Quick hex-to-decimal: F=15, A=10, B=11, C=12, D=13, E=14. #FF = 15×16 + 15 = 255',
			'Binary to hex: group 4 bits at a time. 11010101 = 1101,0101 = D5 (13 and 5 in hex)',
			'For colors, each channel (R,G,B) is 00-FF (0-255). #000000=black, #FFFFFF=white, #FF0000=red',
			'Common permissions: 644 (files), 755 (executables/dirs), 600 (private files), 777 (all access)'
		]
	},
	typography: {
		features: [
			'Convert font sizes (px, pt, em, rem)',
			'Line-height calculator with preview',
			'Type scale generator',
			'Golden ratio typography',
			'Vertical rhythm calculator',
			'Font preview with custom text'
		],
		useCases: [
			'Convert print typography (pt) to web (px, rem)',
			'Calculate optimal line-height for readability',
			'Generate harmonious type scales',
			'Convert between design tool units and CSS',
			'Ensure consistent vertical rhythm'
		],
		concept: {
			title: 'Typography Units and Scales',
			content: `<p>Typography uses multiple unit systems, and understanding conversions is crucial for translating designs from print to web and maintaining consistency across platforms.</p>
			
			<p><strong>Typography Units:</strong></p>
			<ul>
				<li><strong>Pixel (px):</strong> Fixed size, easy to understand but doesn't scale with user settings</li>
				<li><strong>Point (pt):</strong> Print unit (1/72 inch), used in design tools. 12pt ≈ 16px</li>
				<li><strong>Em:</strong> Relative to parent font size, useful for component-level scaling</li>
				<li><strong>Rem:</strong> Relative to root (html) font size, best for consistent scaling</li>
			</ul>
			
			<p><strong>Line-Height Best Practices:</strong></p>
			<ul>
				<li><strong>Body text:</strong> 1.5-1.6× font size for optimal readability</li>
				<li><strong>Headings:</strong> 1.2-1.3× font size (tighter leading)</li>
				<li><strong>Short lines (\<45 chars):</strong> 1.5 line-height</li>
				<li><strong>Long lines (\>75 chars):</strong> 1.6-1.8 line-height for easier tracking</li>
				<li><strong>Small text (\<14px):</strong> Higher line-height (1.6-1.8)</li>
			</ul>
			
			<p><strong>Type Scales:</strong></p>
			<ul>
				<li><strong>Modular scale:</strong> Multiply base size by ratio (1.25, 1.333, 1.5, 1.618)</li>
				<li><strong>Golden ratio:</strong> 1.618× each step (16px → 25.9px → 41.9px)</li>
				<li><strong>Perfect fourth:</strong> 1.333× (16px → 21.3px → 28.4px)</li>
				<li><strong>Major third:</strong> 1.25× (16px → 20px → 25px → 31.25px)</li>
			</ul>
			
			<p><strong>Vertical Rhythm:</strong></p>
			<p>Maintain consistent spacing by aligning text baselines to a grid. Set a baseline (e.g., 8px), then ensure all line-heights, margins, and padding are multiples of that baseline.</p>`
		},
		examples: [
			{
				label: 'Body Text',
				code: '16px, line-height: 1.5 (24px)',
				isValid: true
			},
			{
				label: 'Heading',
				code: '32px, line-height: 1.25 (40px)',
				isValid: true
			},
			{
				label: 'Type Scale (1.25)',
				code: '16px → 20px → 25px → 31px',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the ideal line-height for body text?",
				answer:
					'1.5-1.6× the font size for most body text. For 16px font, use 24-25.6px line-height. Longer lines need more line-height (1.6-1.8), shorter lines can use less (1.4-1.5). Accessibility guidelines recommend minimum 1.5.'
			},
			{
				question: 'Should I use px, em, or rem for font sizes?',
				answer:
					'Use rem for font sizes—it respects user browser settings (accessibility) and makes scaling easy. Use em for padding/margin within components. Avoid px for fonts—it ignores user preferences for larger text.'
			},
			{
				question: 'How do I convert pt (print) to px (web)?',
				answer:
					'At 96 DPI (web standard): px = pt × 96 / 72 ≈ pt × 1.333. So 12pt = 16px, 14pt ≈ 18.67px. For print (300 DPI): px = pt × 300 / 72 ≈ pt × 4.167. Design tools use 72 DPI, so 12pt shows as 12px.'
			},
			{
				question: 'What is a modular type scale?',
				answer:
					'A modular scale uses a consistent ratio to generate harmonious font sizes. Start with base (16px), multiply by ratio (1.25) for each step: 16px → 20px → 25px → 31.25px → 39px. Common ratios: 1.25 (major third), 1.333 (perfect fourth), 1.5 (perfect fifth), 1.618 (golden ratio).'
			},
			{
				question: 'Why use unitless line-height instead of px?',
				answer:
					"Unitless line-height (1.5) is relative to font size. If you use px (24px), nested elements with larger fonts won't scale properly. line-height: 1.5 on parent applies 1.5× to all children, regardless of their font size."
			}
		],
		relatedTools: [
			{
				name: 'CSS Units',
				path: '/convert/css-units',
				description: 'Convert all CSS units including typography'
			},
			{
				name: 'Length Converter',
				path: '/convert/length',
				description: 'Convert physical print measurements'
			},
			{
				name: 'Color Converter',
				path: '/convert/color',
				description: 'Convert text colors for design'
			},
			{
				name: 'CSS Formatter',
				path: '/css/formatter',
				description: 'Format CSS with typography rules'
			}
		],
		tips: [
			'Standard type scale for headings: h1=2.5rem (40px), h2=2rem (32px), h3=1.75rem (28px), h4=1.5rem (24px)',
			'Use unitless line-height (1.5) instead of px—it scales with font size changes',
			'Google Fonts renders at 72 DPI, so 12pt in Figma = 12px in CSS, but "true" 12pt = 16px at 96 DPI',
			'For vertical rhythm, set root font to 16px, line-height 1.5 = 24px baseline, use 8px spacing grid'
		]
	},
	color: {
		features: [
			'Convert HEX, RGB, RGBA, HSL, HSLA, CMYK, HSB',
			'Visual color picker with live preview',
			'Color palette swatches',
			'Accessibility contrast checker',
			'Alpha channel (transparency) support',
			'Quick preset colors'
		],
		useCases: [
			'Convert design tool colors to CSS',
			'Extract RGB values from hex codes',
			'Adjust color hue, saturation, lightness',
			'Convert print colors (CMYK) to web (RGB)',
			'Generate color variations for themes'
		],
		concept: {
			title: 'Color Models and Formats',
			content: `<p>Colors can be represented in multiple formats, each with different use cases. Web design primarily uses <strong>HEX</strong>, <strong>RGB</strong>, and <strong>HSL</strong>, while print uses <strong>CMYK</strong>.</p>
			
			<p><strong>Color Formats:</strong></p>
			<ul>
				<li><strong>HEX (#RRGGBB):</strong> Hexadecimal, compact format. #FF5733 = red(255), green(87), blue(51)</li>
				<li><strong>RGB (red, green, blue):</strong> Additive color (0-255 each). rgb(255, 87, 51)</li>
				<li><strong>RGBA:</strong> RGB + alpha channel (transparency 0-1). rgba(255, 87, 51, 0.5)</li>
				<li><strong>HSL (hue, saturation, lightness):</strong> Intuitive for color adjustments. hsl(9, 100%, 60%)</li>
				<li><strong>HSLA:</strong> HSL + alpha. hsla(9, 100%, 60%, 0.5)</li>
				<li><strong>CMYK:</strong> Print colors (cyan, magenta, yellow, black). Not web-native, convert to RGB first</li>
			</ul>
			
			<p><strong>When to Use Each Format:</strong></p>
			<ul>
				<li><strong>HEX:</strong> Concise, common in CSS. No transparency support (use RGBA instead)</li>
				<li><strong>RGB/RGBA:</strong> When you need alpha channel, or working with JavaScript color manipulation</li>
				<li><strong>HSL/HSLA:</strong> Best for creating color variations (adjust hue for different colors, lightness for shades)</li>
				<li><strong>CMYK:</strong> Print design only—convert to RGB for web</li>
			</ul>
			
			<p><strong>Color Properties:</strong></p>
			<ul>
				<li><strong>Hue:</strong> Pure color on color wheel (0-360°). 0=red, 120=green, 240=blue</li>
				<li><strong>Saturation:</strong> Color intensity (0-100%). 0%=gray, 100%=pure color</li>
				<li><strong>Lightness:</strong> Brightness (0-100%). 0%=black, 50%=pure color, 100%=white</li>
				<li><strong>Alpha:</strong> Transparency (0-1). 0=fully transparent, 1=fully opaque</li>
			</ul>
			
			<p><strong>Accessibility:</strong> Ensure sufficient contrast between text and background. WCAG 2.1 requires 4.5:1 for normal text, 3:1 for large text (18pt+ or 14pt bold+).</p>`
		},
		examples: [
			{
				label: 'Hex to RGB',
				code: '#FF5733 = rgb(255, 87, 51)',
				isValid: true
			},
			{
				label: 'RGB to HSL',
				code: 'rgb(255, 87, 51) = hsl(9, 100%, 60%)',
				isValid: true
			},
			{
				label: 'Transparency',
				code: 'rgba(255, 87, 51, 0.5) = 50% opacity',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the difference between HSL and RGB?",
				answer:
					'RGB uses red/green/blue channels (0-255). HSL uses hue (color), saturation (intensity), lightness (brightness). HSL is more intuitive for creating color variations—adjust hue for different colors, saturation for vibrancy, lightness for shades.'
			},
			{
				question: 'Can I use HEX colors with transparency?',
				answer:
					'Yes, 8-digit HEX includes alpha: #FF5733FF (opaque), #FF573380 (50% transparent). But RGBA is more readable: rgba(255,87,51,0.5). Not all browsers support 8-digit HEX, so RGBA is safer for transparency.'
			},
			{
				question: 'How do I convert CMYK to RGB for web?',
				answer:
					"CMYK (print) doesn't convert perfectly to RGB (screen)—colors may shift. Use this tool for approximate conversion. For accurate brand colors, use the RGB values your designer provides. CMYK is subtractive (ink), RGB is additive (light)."
			},
			{
				question: "What's the best color format for CSS?",
				answer:
					'HEX for solid colors (#FF5733), RGBA for transparency (rgba(255,87,51,0.5)), HSL for color variations (hsl(9,100%,60%)). Modern CSS also supports oklch() for better color space, but browser support is limited.'
			},
			{
				question: 'How do I create color shades and tints?',
				answer:
					'Use HSL. For shades (darker), decrease lightness: hsl(9, 100%, 60%) → hsl(9, 100%, 40%). For tints (lighter), increase lightness: hsl(9, 100%, 80%). Keep hue and saturation constant, adjust lightness 10-20% per step.'
			}
		],
		relatedTools: [
			{
				name: 'Number Base',
				path: '/convert/number-base',
				description: 'Convert hex color codes to decimal'
			},
			{
				name: 'CSS Formatter',
				path: '/css/formatter',
				description: 'Format CSS with color values'
			},
			{ name: 'Typography', path: '/convert/typography', description: 'Text color and typography' },
			{ name: 'CSS Units', path: '/convert/css-units', description: 'All CSS unit conversions' }
		],
		tips: [
			'For creating color scales: keep hue/saturation constant, vary lightness in 10% increments (20%, 30%, 40%...90%)',
			'Use HSL for theme customization—easier to adjust than RGB: --primary-hue: 220; hsl(var(--primary-hue), 70%, 50%)',
			'WCAG contrast: #000 on #FFF = 21:1 (perfect), #777 on #FFF = 4.5:1 (minimum for body text)',
			'Common mistake: #FF0000 is not the same as rgb(255,0,0) if alpha is involved. Use rgba(255,0,0,1) for explicit opacity'
		]
	}
};

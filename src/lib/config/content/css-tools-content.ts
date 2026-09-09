import type { ToolContent } from './types';

type CSSToolContent = ToolContent;

export const cssToolsContent: Record<string, CSSToolContent> = {
	bezier: {
		features: [
			'Visual Cubic Bezier editor',
			'Preview animation with custom duration',
			'Compare with standard easing functions',
			'Drag-and-drop curve manipulation',
			'Copy CSS content instantly',
			'Library of common easing presets'
		],
		useCases: [
			'Create smooth custom animations',
			'Visualize easing functions before coding',
			'Debug jerky animations',
			'Generate bounce or elastic effects',
			'Understand cubic-bezier mathematics'
		],
		concept: {
			title: 'Cubic Bezier Curves',
			content: `<p>A <strong>Cubic Bezier curve</strong> defines the speed of an animation over time. It is defined by four points: P0 (0,0), P1, P2, and P3 (1,1). The X-axis represents time, and the Y-axis represents progression.</p>
			
			<p><strong>Key Concepts:</strong></p>
			<ul>
				<li><strong>P1 & P2:</strong> Control points that shape the curve. You move these to change the timing.</li>
				<li><strong>Linear:</strong> Constant speed throughout (0,0, 1,1).</li>
				<li><strong>Ease-in:</strong> Starts slow, speeds up (acceleration).</li>
				<li><strong>Ease-out:</strong> Starts fast, slows down (deceleration).</li>
				<li><strong>Ease-in-out:</strong> Slow start, fast middle, slow end (natural movement).</li>
			</ul>
			
			<p><strong>CSS Syntax:</strong></p>
			<p><code>transition-timing-function: cubic-bezier(x1, y1, x2, y2);</code></p>
			<p>Where (x1, y1) are coordinates of P1 and (x2, y2) are coordinates of P2.</p>`
		},
		examples: [
			{
				label: 'Ease In',
				code: 'cubic-bezier(0.42, 0, 1, 1)',
				isValid: true
			},
			{
				label: 'Ease Out',
				code: 'cubic-bezier(0, 0, 0.58, 1)',
				isValid: true
			},
			{
				label: 'Custom Bounce',
				code: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the cubic-bezier function?',
				answer:
					"It's a CSS function that defines a custom timing function for transitions and animations. It accepts four values representing the coordinates of two control points that shape the curve of the animation."
			},
			{
				question: 'How do I use this in my CSS?',
				answer:
					'Copy the generated code and use it in `transition` or `animation` properties. Example: `transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);`.'
			},
			{
				question: 'Can values go outside 0-1 range?',
				answer:
					'Yes! Y-values (progression) can go below 0 or above 1 to create "bounce" or "elastic" effects (overshooting the target). X-values (time) must stay between 0 and 1.'
			}
		],
		relatedTools: [
			{
				name: 'CSS Transitions',
				path: '/css/transition',
				description: 'Generate complete transition syntax'
			},
			{ name: 'Keyframes', path: '/css/keyframes', description: 'Create complex animations' },
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format your CSS code' }
		],
		tips: [
			'Use ease-out for entering elements (feels responsive).',
			'Use ease-in for exiting elements (feels natural).',
			"Avoid complex curves for very short animations (<200ms) as they won't be noticeable."
		]
	},
	'box-shadow': {
		features: [
			'Layered shadows support (multiple shadows)',
			'Visual drag-and-drop controls',
			'Inset vs Outset toggle',
			'Color picker with opacity support',
			'Cross-browser code generation',
			'Neumorphism style generator'
		],
		useCases: [
			'Create depth and hierarchy in UI',
			'Design neumorphic (soft UI) elements',
			'Generate realistic material design shadows',
			'Create glow effects',
			'Add inner shadows for depth'
		],
		concept: {
			title: 'CSS Box Shadow',
			content: `<p>The <code>box-shadow</code> property adds shadow effects around an element's frame. You can set multiple effects separated by commas. A box shadow is described by X and Y offsets relative to the element, blur and spread radius, and color.</p>
			
			<p><strong>Syntax Breakdown:</strong></p>
			<p><code>box-shadow: [inset] offset-x offset-y blur-radius spread-radius color;</code></p>
			
			<ul>
				<li><strong>Inset:</strong> Changes the shadow from an outer shadow (outset) to an inner shadow.</li>
				<li><strong>Offset-x/y:</strong> Horizontal and vertical distance. Negative values move shadow left/up.</li>
				<li><strong>Blur Radius:</strong> How sharp or blurry the shadow is. 0 is sharp.</li>
				<li><strong>Spread Radius:</strong> Positive values increase the size of the shadow, negative values decrease it.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Soft Shadow',
				code: '0 4px 6px -1px rgba(0,0,0,0.1)',
				isValid: true
			},
			{
				label: 'Inner Shadow',
				code: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
				isValid: true
			},
			{
				label: 'Neumorphism',
				code: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How do I make a shadow only on one side?',
				answer:
					'Use a negative spread radius equal to the blur radius. For example, a bottom-only shadow: `0 10px 10px -10px rgba(0,0,0,0.5)`.'
			},
			{
				question: 'Can I have multiple shadows?',
				answer:
					'Yes! Separate them with commas. The first shadow in the list is rendered on top, the last one on the bottom. `box-shadow: 3px 3px red, -1em 0 0.4em olive;`'
			},
			{
				question: 'What is neumorphism?',
				answer:
					'Neumorphism (Soft UI) is a design trend that uses highlights and shadows to make elements look like they are extruded from the background. It typically requires two shadows: a light one and a dark one.'
			}
		],
		relatedTools: [
			{ name: 'Text Shadow', path: '/css/text-shadow', description: 'Add shadows to text' },
			{
				name: 'CSS Filter',
				path: '/css/filter',
				description: 'Add drop-shadow filters (follows transparent shapes)'
			},
			{
				name: 'Border Radius',
				path: '/css/border-radius',
				description: 'Round corners for your boxes'
			}
		],
		tips: [
			'Use multiple subtle shadows instead of one harsh shadow for a more realistic look.',
			'Avoid pure black shadows (#000000). Use a semi-transparent dark color matching your brand.',
			'Performance warning: Large blur radii and spread radii can be expensive to render on low-end devices.'
		]
	},
	filter: {
		features: [
			'Visual adjustment of all CSS filters',
			'Real-time image preview',
			'Presets for common photo effects (Grayscale, Sepia, Vintage)',
			'Combination of multiple filters',
			'Drag-and-drop ordering',
			'Copy-paste CSS code'
		],
		useCases: [
			'Adjust image brightness/contrast directly in CSS',
			'Create hover effects for images',
			'Convert images to black and white or sepia',
			'Add blur for background overlays',
			'Change hue of icons or images'
		],
		concept: {
			title: 'CSS Filters',
			content: `<p>The <code>filter</code> property provides graphical effects like blurring or color shifting to an element. Filters are commonly used to adjust the rendering of images, backgrounds, and borders.</p>
			
			<p><strong>Common Functions:</strong></p>
			<ul>
				<li><strong>blur(px):</strong> Applies a Gaussian blur.</li>
				<li><strong>brightness(%):</strong> Adjusts the brightness. 0% is black, 100% is original, >100% is brighter.</li>
				<li><strong>contrast(%):</strong> Adjusts the contrast.</li>
				<li><strong>grayscale(%):</strong> Converts to grayscale. 100% is completely gray.</li>
				<li><strong>hue-rotate(deg):</strong> Applies a hue rotation.</li>
				<li><strong>drop-shadow(x y blur color):</strong> Applies a shadow that follows the image's alpha mask (unlike box-shadow).</li>
			</ul>`
		},
		examples: [
			{
				label: 'Grayscale',
				code: 'filter: grayscale(100%);',
				isValid: true
			},
			{
				label: 'Blur',
				code: 'filter: blur(5px);',
				isValid: true
			},
			{
				label: 'High Contrast',
				code: 'filter: contrast(150%) brightness(110%);',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between box-shadow and drop-shadow?',
				answer:
					"`box-shadow` creates a rectangular shadow around the element's box. `drop-shadow` (a filter) creates a shadow that conforms to the shape of the content (e.g., a transparent PNG or SVG)."
			},
			{
				question: 'Does filter order matter?',
				answer:
					'Yes! Filters are applied in order. For example, `grayscale(100%) sepia(100%)` produces a different result than `sepia(100%) grayscale(100%)`.'
			},
			{
				question: 'Do filters affect performance?',
				answer:
					'Some filters like `blur` and `drop-shadow` can be computationally expensive, especially on large areas or during animations. Use `will-change: filter` sparingly if animating.'
			}
		],
		relatedTools: [
			{ name: 'Box Shadow', path: '/css/box-shadow', description: 'Create box shadows' },
			{ name: 'CSS Transitions', path: '/css/transition', description: 'Animate filter changes' },
			{ name: 'CSS Minifier', path: '/css/minifier', description: 'Minify your CSS' }
		],
		tips: [
			'Use `brightness(0)` to make an icon solid black, or `brightness(0) invert(1)` for solid white.',
			'Combine `grayscale(100%)` with a transition to `grayscale(0)` on hover for a nice effect.',
			'Filters apply to the element and all its children.'
		]
	},
	formatter: {
		features: [
			'Beautify messy CSS/SCSS/LESS code',
			'Consistent indentation (spaces or tabs)',
			'Add/remove space around brackets/colons',
			'Sort properties alphabetically (optional)',
			'Fix missing semicolons',
			'Minify option available'
		],
		useCases: [
			'Clean up legacy CSS files',
			'Standardize code style across a team',
			'Make minified CSS readable again',
			'Prepare CSS for production (minification)',
			'Debug syntax errors'
		],
		concept: {
			title: 'CSS Formatting & Style',
			content: `<p>Properly formatted CSS is easier to read, maintain, and debug. Consistent indentation, spacing, and property ordering help teams collaborate effectively.</p>
			
			<p><strong>Common Style Guides:</strong></p>
			<ul>
				<li><strong>Indentation:</strong> Usually 2 spaces or 4 spaces.</li>
				<li><strong>Brace Style:</strong> Opening brace on the same line (K&R style) is standard for CSS.</li>
				<li><strong>Property Sorting:</strong> Grouping by type (positioning, box model, typography) or alphabetical sorting.</li>
				<li><strong>Spacing:</strong> Space after colon (<code>color: red;</code>) and before opening brace.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Messy Input',
				code: 'body{color:red;margin:0}h1{font-size:2em}',
				isValid: true
			},
			{
				label: 'Formatted Output',
				code: 'body {\n  color: red;\n  margin: 0;\n}\n\nh1 {\n  font-size: 2em;\n}',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why format CSS?',
				answer:
					"Readability is key for maintenance. It's much harder to find bugs in a single long line of CSS. Formatting also ensures consistency when working in teams."
			},
			{
				question: 'Should I sort properties alphabetically?',
				answer:
					"It's a matter of preference. Some tools (and Google's style guide) recommend alphabetical sorting for faster scanning. Others prefer grouping by function (e.g., positioning first, then box model, then typography)."
			},
			{
				question: 'Can this fix errors?',
				answer:
					"It can fix minor syntax issues like missing semicolons or braces, but it won't fix invalid property names or logic errors."
			}
		],
		relatedTools: [
			{ name: 'CSS Minifier', path: '/css/minifier', description: 'Minify CSS for production' },
			{
				name: 'Prefix Cleaner',
				path: '/css/prefix-cleaner',
				description: 'Remove unnecessary vendor prefixes'
			},
			{ name: 'Snippets', path: '/css/snippets', description: 'Useful CSS snippets' }
		],
		tips: [
			'Always keep a formatted version of your CSS in source control, even if you deploy minified code.',
			'Use comments `/* section */` to organize large CSS files.',
			'Consider using a preprocessor like SASS or PostCSS for better organization.'
		]
	},
	gradient: {
		features: [
			'Linear and Radial gradient support',
			'Multi-stop color picker',
			'Angle/Direction control',
			'Visual preview area',
			'Cross-browser vendor prefixes',
			'CSS variable support'
		],
		useCases: [
			'Create beautiful backgrounds',
			'Design buttons with depth',
			'Generate metallic or glossy effects',
			'Create stripes or patterns',
			'Replace background images with CSS'
		],
		concept: {
			title: 'CSS Gradients',
			content: `<p>CSS gradients let you display smooth transitions between two or more specified colors. Browsers support two types of gradients: <strong>linear</strong> and <strong>radial</strong>.</p>
			
			<p><strong>Linear Gradients:</strong> <br>Colors change along a straight line (up, down, diagonal). <br>Syntax: <code>background: linear-gradient(direction, color-stop1, color-stop2, ...);</code></p>
			
			<p><strong>Radial Gradients:</strong> <br>Colors emanate from a center point. <br>Syntax: <code>background: radial-gradient(shape size at position, start-color, ..., last-color);</code></p>`
		},
		examples: [
			{
				label: 'Sunset Linear',
				code: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
				isValid: true
			},
			{
				label: 'Simple Radial',
				code: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)',
				isValid: true
			},
			{
				label: 'Stripes',
				code: 'linear-gradient(90deg, #000 50%, #fff 50%)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Do I still need vendor prefixes?',
				answer:
					'For modern browsers, no. `linear-gradient` is widely supported. However, for supporting very old browsers (like old Android or iOS versions), prefixes like `-webkit-` might be needed.'
			},
			{
				question: 'How do I create hard edges?',
				answer:
					'By setting two color stops at the same location. E.g., `red 50%, blue 50%` creates a sharp line between red and blue at the halfway point.'
			},
			{
				question: 'Can I overlay gradients?',
				answer:
					'Yes! You can specify multiple background images separated by commas. `background: linear-gradient(...), url(image.jpg);`.'
			}
		],
		relatedTools: [
			{ name: 'Text Gradient', path: '/css/text-gradient', description: 'Apply gradients to text' },
			{ name: 'Color Converter', path: '/convert/color', description: 'Pick and convert colors' },
			{ name: 'CSS Patterns', path: '/css/patterns', description: 'Generate CSS-only patterns' }
		],
		tips: [
			'Use semi-transparent colors in gradients to create sophisticated overlays on images.',
			'Linear gradients can be used to create custom underlines or borders.',
			'Use `conic-gradient` (modern browsers) for pie charts or color wheels.'
		]
	},
	keyframes: {
		features: [
			'Visual timeline for animation steps',
			'Add/remove keyframe stops (0%, 50%, 100%)',
			'Property editor for each step',
			'Preview with duration/delay/iteration controls',
			'Generate complex @keyframes code',
			'Preset library (fade, slide, bounce)'
		],
		useCases: [
			'Create complex multi-step animations',
			'Design loading spinners',
			'Animate element entrance/exit',
			'Create attention-grabbing effects (shake, pulse)',
			'Build pure CSS presentations'
		],
		concept: {
			title: 'CSS Keyframe Animations',
			content: `<p>The <code>@keyframes</code> rule allows you to create animations by gradually changing from one set of CSS styles to another. You specify when the change happens in percentages, or using the keywords <code>from</code> and <code>to</code>.</p>
			
			<p><strong>Syntax:</strong></p>
			<pre><code>@keyframes animationName {
  0%   { background-color: red; }
  50%  { background-color: yellow; }
  100% { background-color: green; }
}</code></pre>
			
			<p>Applying the animation:</p>
			<p><code>animation: name duration timing-function delay iteration-count direction fill-mode;</code></p>`
		},
		examples: [
			{
				label: 'Fade In',
				code: '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }',
				isValid: true
			},
			{
				label: 'Spin',
				code: '@keyframes spin { 100% { transform: rotate(360deg); } }',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between transition and animation?',
				answer:
					'Transitions move from state A to state B when a property changes (hover, class change). Animations can have intermediate steps (keyframes), loop, and start automatically without user interaction.'
			},
			{
				question: 'What does fill-mode do?',
				answer:
					'`animation-fill-mode` specifies a style for the element when the animation is not playing (before it starts, after it ends, or both). `forwards` retains the computed values set by the last keyframe.'
			},
			{
				question: 'Can I animate any property?',
				answer:
					'Most properties are animatable, but not all. Properties involving layout (height: auto) are notoriously hard to animate smoothly. Transform and Opacity are best for performance.'
			}
		],
		relatedTools: [
			{ name: 'Cubic Bezier', path: '/css/bezier', description: 'Create custom timing functions' },
			{ name: 'CSS Transitions', path: '/css/transition', description: 'Simple A-to-B animations' },
			{ name: 'Snippet Library', path: '/css/snippets', description: 'Common animation snippets' }
		],
		tips: [
			'Prioritize animating `transform` and `opacity` for 60fps performance.',
			'Use `will-change` sparingly to hint browsers about upcoming animations.',
			'Use `animation-delay` to stagger animations for a group of elements.'
		]
	},
	minifier: {
		features: [
			'Compress CSS file size',
			'Remove comments and whitespace',
			'Shorten color codes (optional)',
			'Remove unnecessary semicolons',
			'Statistics on savings',
			'Safe compression guarantees'
		],
		useCases: [
			'Prepare CSS for production deployment',
			'Reduce page load times (improving SEO)',
			'Decrease bandwidth usage',
			'Obfuscate code slightly',
			'Optimize large CSS frameworks'
		],
		concept: {
			title: 'CSS Minification',
			content: `<p>Minification is the process of removing unnecessary characters from source code without changing its functionality. For CSS, this includes removing whitespace, newlines, comments, and block delimiters.</p>
			
			<p><strong>Benefits:</strong></p>
			<ul>
				<li><strong>Smaller Files:</strong> download faster for users.</li>
				<li><strong>Reduced Bandwidth:</strong> saves money on hosting.</li>
				<li><strong>Faster Parsing:</strong> browsers read the code slightly faster.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Original',
				code: 'body {\n  color: white;\n  background: #000000;\n}',
				isValid: true
			},
			{
				label: 'Minified',
				code: 'body{color:#fff;background:#000}',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will minification break my layout?',
				answer:
					"No, a good minifier preserves the semantic meaning of your CSS. It only removes bytes that the browser doesn't need to understand the styles."
			},
			{
				question: 'Can I reverse minification?',
				answer:
					'Yes, using a "Formatter" or "Beautifier" tool. It won\'t restore original comments or variable names if they were removed, but it will make the code readable again.'
			},
			{
				question: 'Does this handle CSS variables?',
				answer:
					"Yes, modern minifiers respect CSS variables (--var-name) and won't rename them as that could break functionality."
			}
		],
		relatedTools: [
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Un-minify CSS code' },
			{
				name: 'Data Size Converter',
				path: '/convert/data-size',
				description: 'Calculate size savings'
			},
			{
				name: 'Prefix Cleaner',
				path: '/css/prefix-cleaner',
				description: 'Remove old vendor prefixes'
			}
		],
		tips: [
			'Automate minification in your build process (Webpack, Vite, Gulp) rather than doing it manually.',
			'Keep the source map if you need to debug minified CSS in production.'
		]
	},
	'prefix-cleaner': {
		features: [
			'Remove unnecessary vendor prefixes (-webkit-, -moz-, -ms-)',
			'Identify obsolete properties',
			'Modernize legacy CSS',
			'Bulk processing',
			'Preserve necessary prefixes (optional)',
			'Clean up copy-pasted code'
		],
		useCases: [
			'Clean up code from old generators',
			'Modernize 5+ year old CSS projects',
			'Reduce file size by removing dead code',
			'Fix validation errors caused by unknown properties',
			'Prepare code for Autoprefixer'
		],
		concept: {
			title: 'Vendor Prefixes',
			content: `<p>Vendor prefixes (e.g., <code>-webkit-border-radius</code>) were used by browsers to experiment with new CSS features before they became standard. Today, most modern browsers support standard properties, making many prefixes obsolete.</p>
			
			<p><strong>Common Prefixes:</strong></p>
			<ul>
				<li><code>-webkit-</code>: Chrome, Safari, newer Edge, Opera, iOS, Android</li>
				<li><code>-moz-</code>: Firefox</li>
				<li><code>-o-</code>: Old Opera</li>
				<li><code>-ms-</code>: Internet Explorer, old Edge</li>
			</ul>
			
			<p><strong>Why Clean Them?</strong> Keeping old prefixes bloats code and can sometimes cause unexpected behavior if the prefixed implementation differs from the standard one. It's best to write standard CSS and let a tool like Autoprefixer handle adding necessary prefixes for your target browsers.</p>`
		},
		examples: [
			{
				label: 'Dirty Input',
				code: '-webkit-border-radius: 5px;\n-moz-border-radius: 5px;\nborder-radius: 5px;',
				isValid: true
			},
			{
				label: 'Clean Output',
				code: 'border-radius: 5px;',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Should I remove ALL prefixes?',
				answer:
					'Not necessarily. Some cutting-edge features still require prefixes (like `-webkit-background-clip: text` or scrollbar styling). This tool targets *obsolete* prefixes for standard properties like border-radius, box-shadow, Flexbox, etc.'
			},
			{
				question: 'How do I know which prefixes are needed?',
				answer:
					'The best practice is to write standard CSS and use a build tool plugin called "Autoprefixer" which checks "Can I Use" data to automatically add only the prefixes needed for the browsers you want to support.'
			},
			{
				question: 'Why does -webkit- still exist?',
				answer:
					'Because of Chrome/Safari dominance, many sites relied on `-webkit-` properties. Even non-WebKit browsers sometimes implement `-webkit-` aliases for compatibility!'
			}
		],
		relatedTools: [
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format cleaned code' },
			{ name: 'CSS Minifier', path: '/css/minifier', description: 'Compress the result' },
			{ name: 'Box Shadow', path: '/css/box-shadow', description: 'Generate modern box shadows' }
		],
		tips: [
			"Don't manually write prefixes anymore. Use standard CSS and a post-processor.",
			'If copying code from old tutorials (pre-2015), run it through this cleaner first.'
		]
	},
	snippets: {
		features: [
			'Collection of common CSS patterns',
			'One-click copy',
			'Categorized (Layout, UI, Utilities)',
			'Modern CSS practices (Flexbox, Grid)',
			'Responsive helpers',
			'Reset/Normalize snippets'
		],
		useCases: [
			'Quickly center a div',
			'Add a clearfix',
			'Reset browser styles',
			'Create a responsive triangle',
			'Implement a sticky footer',
			'Hide scrollbars'
		],
		concept: {
			title: 'CSS Snippets',
			content: `<p>CSS Snippets are reusable blocks of code for solving common design problems. Instead of reinventing the wheel or searching StackOverflow every time, keep a library of trusted, modern solutions.</p>
			
			<p><strong>Modern CSS capabilities</strong> have simplified many old hacks:</p>
			<ul>
				<li><strong>Centering:</strong> Used to be hard, now <code>display: grid; place-items: center;</code> does it all.</li>
				<li><strong>Aspect Ratio:</strong> No more padding-top hack, use <code>aspect-ratio: 16/9;</code>.</li>
				<li><strong>Layout:</strong> Flexbox and Grid allow complex layouts with few lines of code.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Absolute Center',
				code: 'display: grid;\nplace-items: center;',
				isValid: true
			},
			{
				label: 'Truncate Text',
				code: 'white-space: nowrap;\noverflow: hidden;\ntext-overflow: ellipsis;',
				isValid: true
			},
			{
				label: 'Custom Scrollbar',
				code: '&::-webkit-scrollbar { width: 8px; }',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Are these snippets compatible with all browsers?',
				answer:
					'Most are standard modern CSS supported by all evergreen browsers. Some cutting-edge snippets might need fallback for Internet Explorer, but we focus on modern web development practices.'
			},
			{
				question: 'How do I use these in SASS/SCSS?',
				answer:
					'Most valid CSS is also valid SCSS. You can copy these directly into your mixins or classes. The nesting syntax `&` used in some snippets is native to SCSS (and now native CSS too!).'
			}
		],
		relatedTools: [
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format your code' },
			{ name: 'Flexbox Cheatsheet', path: '#', description: 'Learn flexbox layout' }, // Assuming we might add this later
			{ name: 'Grid Generator', path: '#', description: 'Generate grid layouts' }
		],
		tips: [
			'Build your own utility class library based on snippets you use often.',
			'Understand HOW the snippet works before pasting it, so you can debug it if needed.'
		]
	},
	'text-gradient': {
		features: [
			'Apply gradients to text (background-clip)',
			'Live preview with custom font',
			'Direction control',
			'Multi-color stops',
			'Fallback color generation',
			'Cross-browser support checks'
		],
		useCases: [
			'Create eye-catching headlines',
			'Design modern logos or branding',
			'Highlight keywords in text',
			'Create metallic text effects',
			'Add subtle depth to large typography'
		],
		concept: {
			title: 'Text Gradients',
			content: `<p>Creating a gradient on text is done by applying a background gradient to the element, and then clipping the background to the text itself using <code>background-clip: text</code> and making the text transparent.</p>
			
			<p><strong>The Magic Combo:</strong></p>
			<pre><code>background: linear-gradient(...);
-webkit-background-clip: text;
background-clip: text;
color: transparent;</code></pre>
			
			<p><strong>Note:</strong> <code>-webkit-background-clip: text</code> is still required for best compatibility, even in some non-WebKit browsers.</p>`
		},
		examples: [
			{
				label: 'Gold Gradient',
				code: 'background: linear-gradient(to right, #BF953F, #FCF6BA, #BF953F);',
				isValid: true
			},
			{
				label: 'Rainbow',
				code: 'background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why does my text disappear?',
				answer:
					'You likely forgot `color: transparent`. The gradient is on the background, sitting behind the text. You need to make the text transparent so the background shows through the character shapes.'
			},
			{
				question: 'Does this work in Internet Explorer?',
				answer:
					'No. IE11 does not support `background-clip: text`. You should provide a solid color fallback: define `color: black` before the gradient styles, and wrap the gradient code in `@supports (-webkit-background-clip: text) { ... }`.'
			},
			{
				question: 'Can I select the text?',
				answer:
					'Yes! Unlike SVG or Canvas text effects, CSS text gradients remain fully selectable and accessible screen text.'
			}
		],
		relatedTools: [
			{ name: 'CSS Gradient', path: '/css/gradient', description: 'General gradient generator' },
			{ name: 'Text Shadow', path: '/css/text-shadow', description: 'Add shadows to text' },
			{
				name: 'Typography',
				path: '/convert/typography',
				description: 'Font size and line-height tools'
			}
		],
		tips: [
			'Always include a solid `color` fallback for older browsers.',
			'Use high contrast colors against your page background in case the gradient fails to load.',
			'Avoid very light gradients on white backgrounds for accessibility (contrast ratios).'
		]
	},
	'text-shadow': {
		features: [
			'Add multiple shadows to text',
			'Visual X/Y/Blur controls',
			'Color picker with opacity',
			'Preview with custom font/text',
			'Layer management',
			' presets (Neon, 3D, Letterpress)'
		],
		useCases: [
			'Improve text readability on busy backgrounds',
			'Create glowing neon text',
			'Make 3D or retro style typography',
			'Create "letterpress" (engraved) effects',
			'Design creative headers'
		],
		concept: {
			title: 'CSS Text Shadow',
			content: `<p>The <code>text-shadow</code> property adds shadow to text. It accepts a comma-separated list of shadows, each specified by X offset, Y offset, blur radius, and color.</p>
			
			<p><strong>Syntax:</strong></p>
			<p><code>text-shadow: offset-x offset-y blur-radius color;</code></p>
			
			<p>Unlike box-shadow, text-shadow does NOT have a "spread" value. To make a shadow larger/thicker, you often need to layer multiple shadows.</p>`
		},
		examples: [
			{
				label: 'Basic Drop Shadow',
				code: '2px 2px 4px rgba(0,0,0,0.5)',
				isValid: true
			},
			{
				label: 'Glowing Neon',
				code: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de',
				isValid: true
			},
			{
				label: '3D Text',
				code: '1px 1px #d1d1d1, 2px 2px #d1d1d1, 3px 3px #d1d1d1',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How do I create a text outline (stroke)?',
				answer:
					'While `text-stroke` exists, it has poor support. A common trick is using 4 text-shadows: `1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000`.'
			},
			{
				question: 'Can I use rgba colors?',
				answer:
					"Yes, and it's recommended! Using a semi-transparent black (rgba(0,0,0,0.5)) allows the shadow to blend naturally with any background color."
			},
			{
				question: 'Why is there no spread radius?',
				answer:
					"The CSS spec for text-shadow doesn't include spread. To simulate spread (thicker shadow), you must stack multiple shadows with slightly different offsets."
			}
		],
		relatedTools: [
			{ name: 'Box Shadow', path: '/css/box-shadow', description: 'Shadows for elements' },
			{ name: 'Text Gradient', path: '/css/text-gradient', description: 'Gradients for text' },
			{ name: 'Typography', path: '/convert/typography', description: 'Typography tools' }
		],
		tips: [
			'For a "letterpress" effect (engraved), use a light shadow on the bottom right and a dark shadow on the top left (or vice versa depending on light source).',
			"Don't overdo blur on small text, it reduces readability."
		]
	},
	transition: {
		features: [
			'Visual transition builder',
			'Preview transition effects',
			'Customize duration, delay, property, and timing',
			'Support multiple properties',
			'Copy shorthand syntax',
			'Interactive Easing selection'
		],
		useCases: [
			'Smooth hover effects for buttons',
			'animate menu opening/closing',
			'Create polite UI interactions',
			'Visualize difference between ease/linear/ease-in',
			'Generate cross-browser code'
		],
		concept: {
			title: 'CSS Transitions',
			content: `<p>CSS Transitions allow property changes in CSS values to occur smoothly over a specified duration rather than happening instantly. Example: changing a button efficiency from blue to red on hover.</p>
			
			<p><strong>The Shorthand:</strong></p>
			<p><code>transition: property duration timing-function delay;</code></p>
			
			<ul>
				<li><strong>Property:</strong> What to animate (e.g., <code>all</code>, <code>opacity</code>, <code>transform</code>).</li>
				<li><strong>Duration:</strong> How long it takes (e.g., <code>0.3s</code>, <code>300ms</code>).</li>
				<li><strong>Timing Function:</strong> Acceleration curve (e.g., <code>ease</code>, <code>linear</code>, <code>cubic-bezier</code>).</li>
				<li><strong>Delay:</strong> Wait time before starting (optional).</li>
			</ul>`
		},
		examples: [
			{
				label: 'Standard Hover',
				code: 'transition: all 0.3s ease;',
				isValid: true
			},
			{
				label: 'Specific Property',
				code: 'transition: transform 0.2s ease-out, opacity 0.2s linear;',
				isValid: true
			},
			{
				label: 'Delayed Start',
				code: 'transition: opacity 1s ease-in 0.5s;',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I transition "display: none"?',
				answer:
					'No. `display` is not an animatable property because it toggles instantly. To fade out an element, transition `opacity` and `visibility`, but note that the element still takes up layout space unless you use JavaScript to set display none after the animation.'
			},
			{
				question: 'What is the best duration for UI interactions?',
				answer:
					'For hover effects, 150ms-300ms is snappy and responsive. For larger movements (modals, drawers), 300ms-500ms feels natural. Avoid >500ms for frequent interactions as it feels sluggish.'
			},
			{
				question: 'Why use specific properties instead of "all"?',
				answer:
					'Performance. `transition: all` forces the browser to check every property for changes. Specifying `transition: transform, opacity` is more efficient and prevents unintended animations on other properties.'
			}
		],
		relatedTools: [
			{ name: 'Cubic Bezier', path: '/css/bezier', description: 'Create custom timing functions' },
			{ name: 'Keyframes', path: '/css/keyframes', description: 'Complex animations' },
			{ name: 'CSS Formatter', path: '/css/formatter', description: 'Format your CSS' }
		],
		tips: [
			"Use `transform` and `opacity` for the smoothest (60fps) animations because they don't trigger layout repaints.",
			'Be careful transitioning `height` or `width` as it causes layout recalculations (can be laggy).'
		]
	}
};

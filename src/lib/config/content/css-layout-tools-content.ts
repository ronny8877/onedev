interface CSSLayoutToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const cssLayoutToolsContent: Record<string, CSSLayoutToolContent> = {
	'flexbox': {
		features: [
			'Interactive Flexbox playground',
			'Visual controls for direction, wrap, and alignment',
			'Real-time preview of flex items',
			'Code generation for container and items',
			'Support for gap and flex-grow/shrink',
			'Cheat sheet references built-in'
		],
		useCases: [
			'Design responsive navigation bars',
			'Center elements vertically and horizontally',
			'Create card layouts with equal height',
			'Build flexible sticky footers',
			'Align form elements'
		],
		concept: {
			title: 'CSS Flexbox',
			content: `<p>The <strong>Flexible Box Layout Module</strong> (Flexbox) is a one-dimensional layout method for laying out items in rows or columns. It excels at distributing space between items in an interface and powerful alignment capabilities.</p>
			
			<p><strong>Key Properties:</strong></p>
			<ul>
				<li><strong>justify-content:</strong> Aligns items along the main axis (horizontal if row).</li>
				<li><strong>align-items:</strong> Aligns items along the cross axis (vertical if row).</li>
				<li><strong>flex-direction:</strong> Decides if items stack in a row or column.</li>
				<li><strong>flex-wrap:</strong> Allows items to wrap onto multiple lines.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Perfect Center',
				code: 'display: flex;\njustify-content: center;\nalign-items: center;',
				isValid: true
			},
			{
				label: 'Navigation Bar',
				code: 'display: flex;\njustify-content: space-between;\nalign-items: center;',
				isValid: true
			},
			{
				label: 'Column Stack',
				code: 'display: flex;\nflex-direction: column;\ngap: 1rem;',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Flexbox vs Grid: Which one to use?',
				answer: 'Use Flexbox for 1D layouts (a row OR a column). Use CSS Grid for 2D layouts (rows AND columns). They work great together!'
			},
			{
				question: 'What does "flex: 1" mean?',
				answer: 'It is a shorthand for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`. It forces the item to expand and fill available space equally.'
			},
			{
				question: 'How do I push one item to the right?',
				answer: 'Set `margin-left: auto` on that specific item. In a flex container, auto margins absorb all available extra space.'
			}
		],
		relatedTools: [
			{ name: 'Grid Builder', path: '/css-layout/grid', description: 'Build 2D grid layouts' },
			{ name: 'Spacing', path: '/css-layout/spacing', description: 'Generate margin/padding' },
			{ name: 'Snippet Library', path: '/css/snippets', description: 'Common layout patterns' }
		],
		tips: [
			'Use `gap` instead of margins for spacing between flex items (supported in all modern browsers).',
			'Remember that `align-items` controls the cross-axis, while `justify-content` controls the main axis.',
			'Use `flex-wrap: wrap` to make flex layouts responsive on smaller screens.'
		]
	},
	'grid': {
		features: [
			'Visual CSS Grid drag-and-drop builder',
			'Define rows and columns visually',
			'Named grid areas support',
			'Gap and alignment controls',
			'Generate clean CSS Grid code',
			'Implicit vs Explicit grid preview'
		],
		useCases: [
			'Create complex dashboard layouts',
			'Build responsive image galleries',
			'Align items in two dimensions',
			'Create magazine-style layouts',
			'design full-page layouts'
		],
		concept: {
			title: 'CSS Grid Layout',
			content: `<p><strong>CSS Grid Layout</strong> is the most powerful layout system available in CSS. It is a 2-dimensional system, meaning it can handle both columns and rows, unlike Flexbox which is largely 1-dimensional.</p>
			
			<p><strong>Core Concepts:</strong></p>
			<ul>
				<li><strong>Grid Container:</strong> The parent with <code>display: grid</code>.</li>
				<li><strong>Grid Tracks:</strong> The rows and columns defined with <code>grid-template-rows</code> and <code>grid-template-columns</code>.</li>
				<li><strong>Grid Areas:</strong> Rectangular spaces on the grid made of one or more cells.</li>
				<li><strong>fr unit:</strong> A fractional unit representing a fraction of the available space.</li>
			</ul>`
		},
		examples: [
			{
				label: '3-Column Layout',
				code: 'display: grid;\ngrid-template-columns: 1fr 1fr 1fr;\ngap: 20px;',
				isValid: true
			},
			{
				label: 'Sidebar + Main',
				code: 'display: grid;\ngrid-template-columns: 250px 1fr;\ngaps: 1rem;',
				isValid: true
			},
			{
				label: 'Auto-Fit Grid',
				code: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(200px, 1fr));',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between auto-fill and auto-fit?',
				answer: '`auto-fill` fills the row with as many columns as it can, even if they are empty. `auto-fit` collapses empty columns and stretches the items to fit the row.'
			},
			{
				question: 'Can nested grids be subgrids?',
				answer: 'Yes! `grid-template-columns: subgrid` allows a child to inherit the grid tracks of its parent, ensuring perfect alignment across nested components (supported in Firefox and Safari, coming to Chrome).'
			},
			{
				question: 'Grid vs Bootstrap?',
				answer: 'CSS Grid replaces the need for layout frameworks like Bootstrap for structure. It is native, lighter, and more flexible.'
			}
		],
		relatedTools: [
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'For 1D layouts' },
			{ name: 'Masonry Layout', path: '/css-layout/masonry', description: 'Waterfalls layouts' },
			{ name: 'Aspect Ratio', path: '/css-layout/aspect-ratio', description: 'Sizing grid items' }
		],
		tips: [
			'Use `repeat(auto-fit, minmax(300px, 1fr))` for instantly responsive card grids without media queries.',
			'Name your grid lines for easier maintenance in complex layouts: `[main-start] 1fr [main-end]`.'
		]
	},
	'masonry': {
		features: [
			'Generate Pinterest-style masonry layouts',
			'Pure CSS column-count method',
			'Flexbox column fallback method',
			'Grid + Javascript method preview',
			'Responsive column adjustments',
			'Gap control'
		],
		useCases: [
			'Image galleries with varying aspect ratios',
			'Pinterest-style feed',
			'Portfolio showcases',
			'Blog post archives',
			'Testimonial walls'
		],
		concept: {
			title: 'Masonry Layouts',
			content: `<p>A <strong>Masonry layout</strong> (named after the stone-stacking technique) places elements in optimal positions based on available vertical space, like a brick wall. Unlike a strict grid, items do not have consistent row heights.</p>
			
			<p><strong>CSS Implementation:</strong></p>
			<p>True masonry is coming to CSS Grid (<code>grid-template-rows: masonry</code>), but browser support is currently limited to Firefox Nightly. For now, we use:</p>
			<ul>
				<li><strong>Multi-column:</strong> <code>column-count</code> (orders items top-to-bottom).</li>
				<li><strong>Flexbox:</strong> Flex direction column (orders items top-to-bottom).</li>
				<li><strong>JavaScript:</strong> Libraries like Masonry.js for left-to-right ordering.</li>
			</ul>`
		},
		examples: [
			{
				label: 'CSS Columns',
				code: '.container {\n  column-count: 3;\n  column-gap: 1em;\n}\n.item {\n  break-inside: avoid;\n}',
				isValid: true
			},
			{
				label: 'Future Grid Syntax',
				code: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngrid-template-rows: masonry;',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why is the order top-to-bottom in CSS?',
				answer: 'CSS Multi-column layout was designed for text flowing into columns (like a newspaper). It forces elements to fill column 1, then column 2, etc. This messes up chronological order (left-to-right).'
			},
			{
				question: 'How do I keep order left-to-right?',
				answer: 'Currently, you need JavaScript to calculate absolute positions for a true left-to-right masonry layout. Or you can use a CSS Grid with dense packing, though usually not strictly masonry.'
			},
			{
				question: 'What does "break-inside: avoid" do?',
				answer: 'It prevents an item from being split across two columns, keeping your cards or images intact.'
			}
		],
		relatedTools: [
			{ name: 'Grid Builder', path: '/css-layout/grid', description: 'Standard grid layouts' },
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'Flex layouts' },
			{ name: 'Aspect Ratio', path: '/css-layout/aspect-ratio', description: 'Image sizing' }
		],
		tips: [
			'Use the CSS columns approach for static content where order is less critical (e.g., image moodboards).',
			'Always add `width: 100%` and `display: block` to images inside masonry items to avoid layout shifts.'
		]
	},
	'responsive': {
		features: [
			'Generate standard media query breakpoints',
			'Mobile-first vs Desktop-first toggles',
			'Common device width reference',
			'Container query snippets',
			'Visual range preview',
			'Copy CSS @media blocks'
		],
		useCases: [
			'Set up breakpoints for a new project',
			'Target specific devices (Tablets, Large Desktops)',
			'Implement dark mode support',
			'Create responsive typography',
			'Debug layout issues on specific sizes'
		],
		concept: {
			title: 'Responsive Design',
			content: `<p><strong>Responsive Web Design</strong> makes web pages render well on a variety of devices and window or screen sizes. The core technique is the CSS <strong>Media Query</strong>.</p>
			
			<p><strong>Mobile-First (Min-Width):</strong></p>
			<p>Start with styles for mobile, then add overrides for larger screens. This is the industry standard.</p>
			<pre><code>/* Mobile styles here */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }</code></pre>
			
			<p><strong>Container Queries:</strong></p>
			<p>A modern evolution allowing components to adapt based on <em>their container's width</em>, not the viewport.</p>`
		},
		examples: [
			{
				label: 'Mobile First',
				code: '@media (min-width: 640px) { ... }',
				isValid: true
			},
			{
				label: 'Dark Mode',
				code: '@media (prefers-color-scheme: dark) { ... }',
				isValid: true
			},
			{
				label: 'Container Query',
				code: '@container (min-width: 400px) { ... }',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Min-width vs Max-width?',
				answer: 'Use `min-width` for mobile-first workflows (recommended). Use `max-width` for "desktop-first" workflows where you start with desktop styles and shrink them down. Avoid mixing them to prevent complexity.'
			},
			{
				question: 'What are the standard breakpoints?',
				answer: 'Common standards (like Tailwind CSS): 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl).'
			},
			{
				question: 'What meta tag do I need?',
				answer: 'Always include `<meta name="viewport" content="width=device-width, initial-scale=1">` in your HTML head, or responsive CSS won\'t work on mobile devices.'
			}
		],
		relatedTools: [
			{ name: 'Screen Converter', path: '/convert/screen', description: 'Pixels to REM/VW' },
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'Fluid layouts' },
			{ name: 'Snippet Library', path: '/css/snippets', description: 'Responsive snippets' }
		],
		tips: [
			'Use <code>em</code> or <code>rem</code> for media queries to respect user zoom settings.',
			'Don\'t target specific devices (like "iPhone 12"). Target content breakpoints where your layout breaks.',
			'Start with the base mobile view and scale up.'
		]
	},
	'position': {
		features: [
			'Interactive positioning playground',
			'Visualize Relative, Absolute, Fixed, Sticky',
			'Z-index stacking context simulator',
			'Parent/Child relationship visualization',
			'Coordinate controls (top, right, bottom, left)',
			'Generate positioning code'
		],
		useCases: [
			'Understand how "absolute" relates to "relative" parents',
			'Debug z-index wars',
			'Create sticky headers',
			'Center modals or overlays',
			'Create floating action buttons'
		],
		concept: {
			title: 'CSS Positioning',
			content: `<p>The <code>position</code> property specifies how an element is positioned in a document. The top, right, bottom, and left properties determine the final location of positioned elements.</p>
			
			<ul>
				<li><strong>static:</strong> Default. Normal flow. Top/left properties have no effect.</li>
				<li><strong>relative:</strong> Positioned relative to its normal position. Creates a reference for children.</li>
				<li><strong>absolute:</strong> Positioned relative to the nearest positioned ancestor (non-static).</li>
				<li><strong>fixed:</strong> Positioned relative to the viewport. Stays in place when scrolling.</li>
				<li><strong>sticky:</strong> Toggles between relative and fixed based on scroll position.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Absolute Center',
				code: 'position: absolute;\ntop: 50%;\nleft: 50%;\ntransform: translate(-50%, -50%);',
				isValid: true
			},
			{
				label: 'Sticky Header',
				code: 'position: sticky;\ntop: 0;\nz-index: 100;',
				isValid: true
			},
			{
				label: 'Full Cover',
				code: 'position: absolute;\ninset: 0;',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why is my absolute element misplaced?',
				answer: 'It needs a reference point. Ensure a parent element has `position: relative` (or fixed/sticky). otherwise, it will position itself relative to the `<body>`.'
			},
			{
				question: 'Why doesn\'t z-index work?',
				answer: '`z-index` only works on positioned elements (relative, absolute, fixed, sticky) or flex/grid children. It won\'t work on `position: static`.'
			},
			{
				question: 'What is a Stacking Context?',
				answer: 'A new layer in the render tree. Elements like opacity < 1, transform, filter, or z-index create new stacking contexts, trapping their children\'s z-index within them.'
			}
		],
		relatedTools: [
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'Align without positioning' },
			{ name: 'Snippet Library', path: '/css/snippets', description: 'Centering snippets' },
			{ name: 'Grid Builder', path: '/css-layout/grid', description: 'Layout structure' }
		],
		tips: [
			'Use <code>inset: 0</code> as a modern shorthand for <code>top: 0; right: 0; bottom: 0; left: 0;</code>.',
			'Avoid using z-index like `99999`. Use a structured system like 10, 20, 30, 100(modal), 1000(tooltip).',
			'Use `position: sticky` for headers or sidebar navigation.'
		]
	},
	'spacing': {
		features: [
			'Visual Margin vs Padding explorer',
			'Box Model visualization',
			'Interactive sizing controls',
			'Generate standard spacing utility classes',
			'REM/PX conversion toggle',
			'Border-box explanation'
		],
		useCases: [
			'Understand the CSS Box Model',
			'Generate consistent spacing scales',
			'Debug layout spacing issues',
			'Create spacing utility systems (Tailwind-like)',
			'Visualize negative margins'
		],
		concept: {
			title: 'The Box Model & Spacing',
			content: `<p>In CSS, every element is a box. The <strong>Box Model</strong> describes the layers of that box:</p>
			
			<ul>
				<li><strong>Content:</strong> The actual text or image.</li>
				<li><strong>Padding:</strong> Space inside the border, pushing content inward. Background fills this.</li>
				<li><strong>Border:</strong> The line around the padding.</li>
				<li><strong>Margin:</strong> Space outside the border, pushing other elements away. Transparent.</li>
			</ul>
			
			<p><strong>Box Sizing:</strong> Automatically set <code>box-sizing: border-box;</code>. This makes width = padding + border + content, which is much more intuitive.</p>`
		},
		examples: [
			{
				label: 'Global Reset',
				code: '*, *::before, *::after {\n  box-sizing: border-box;\n}',
				isValid: true
			},
			{
				label: 'Center Block',
				code: 'margin-left: auto;\nmargin-right: auto;\nwidth: 50%;',
				isValid: true
			},
			{
				label: 'Negative Margin',
				code: 'margin-top: -20px; /* Pulls element up */',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Margin vs Padding?',
				answer: 'Use Padding for internal space (background color applies). Use Margin for external space (distance between elements). "Padding makes me fat, Margin gives me personal space."'
			},
			{
				question: 'Why do my margins collapse?',
				answer: 'Vertical margins of adjacent block elements often combine into the largest single margin value. This is "Margin Collapsing". Adding a border or padding to the parent prevents it.'
			},
			{
				question: 'Why use REM?',
				answer: 'REM is relative to the root font size (usually 16px). This ensures your entire layout scales respectfully if a user changes their browser\'s default font size for accessibility.'
			}
		],
		relatedTools: [
			{ name: 'CSS Units', path: '/convert/css-units', description: 'Understand sizes' },
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'Gap spacing' },
			{ name: 'Grid Builder', path: '/css-layout/grid', description: 'Grid Tracks' }
		],
		tips: [
			'Stick to a spacing scale (4, 8, 16, 24, 32px) to keep your UI consistent.',
			'Use <code>gap</code> in Flexbox/Grid instead of margins to avoid "last-child" margin issues.'
		]
	},
	'aspect-ratio': {
		features: [
			'Calculate aspect ratio percentages',
			'Generate modern `aspect-ratio` syntax',
			'Generate "Padding Hack" fallback code',
			'Visual resize handle',
			'Common presets (16:9, 4:3, 1:1, 21:9)',
			'Preview with images'
		],
		useCases: [
			'Prevent Layout Shifts (CLS) for images',
			'Create responsive video embeds',
			'Square profile pictures',
			'Cinematic web headers',
			'Responsive product cards'
		],
		concept: {
			title: 'CSS Aspect Ratio',
			content: `<p>The aspect ratio of an element is the relationship between its width and height. Maintaining aspect ratio is critical for responsive media to prevent jank (layout shifts) while images load.</p>
			
			<p><strong>Modern Syntax:</strong> <br><code>aspect-ratio: 16 / 9;</code> - Supported in all modern browsers.</p>
			
			<p><strong>The "Padding Hack" (Legacy):</strong> <br>Before the new property, we used vertical padding percentages based on width. <br>Formula: <code>(Height / Width) * 100%</code>. <br>Ex: 9/16 = 56.25% padding-top.</p>`
		},
		examples: [
			{
				label: 'Modern Video',
				code: 'width: 100%;\naspect-ratio: 16 / 9;',
				isValid: true
			},
			{
				label: 'Square Avatar',
				code: 'width: 50px;\naspect-ratio: 1 / 1;\nborder-radius: 50%;\nobject-fit: cover;',
				isValid: true
			},
			{
				label: 'Padding Hack',
				code: '.container { width: 100%; padding-top: 56.25%; position: relative; }',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What happens if content overflows?',
				answer: 'By default, `aspect-ratio` sets a preferred size, but content can expand the element if it\'s too tall (unless you set `overflow: hidden` or `min-height`).'
			},
			{
				question: 'How do I fit an image inside?',
				answer: 'Combine `aspect-ratio` with `object-fit: cover;` to ensure the image fills the box without stretching/distorting.'
			},
			{
				question: 'Calculating Padding Hack?',
				answer: 'Divide Height by Width and multiply by 100. For 4:3 -> 3 / 4 = 0.75 = 75%.'
			}
		],
		relatedTools: [
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize images' },
			{ name: 'Grid Builder', path: '/css-layout/grid', description: 'Grid Layouts' },
			{ name: 'Flexbox Generator', path: '/css-layout/flexbox', description: 'Flex Layouts' }
		],
		tips: [
			'Always set width/height or aspect-ratio on `<img>` tags to improve Core Web Vitals (CLS score).',
			'Use `object-fit: cover` for images and `object-fit: contain` for full logos/icons.'
		]
	}
};

// Image Tools Content Configuration
// SEO-optimized content for all Image-related tools

export interface ImageToolContent {
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
	tips?: string[]; // Optional tips for best practices
}

export const imageToolsContent: Record<string, ImageToolContent> = {
	'resize': {
		features: [
			'Pixel-precise width and height control',
			'Maintain aspect ratio automatically',
			'Percentage-based scaling slider',
			'High-quality image resampling',
			'Real-time preview as you resize',
			'Support for all common image formats'
		],
		useCases: [
			'Resize images for web page optimization',
			'Create thumbnails from large images',
			'Fit images to specific dimensions for social media',
			'Reduce image files for faster loading',
			'Batch resize for consistent layouts'
		],
		concept: {
			title: 'Image Resizing and Scaling',
			content: `
				<p><strong>Image resizing</strong> changes the pixel dimensions of an image. This is essential for web optimization, responsive design, and reducing file sizes without quality loss.</p>
				
				<p><strong>Resizing methods:</strong></p>
				<ul>
					<li><strong>Exact dimensions</strong> - Set specific width and height in pixels</li>
					<li><strong>Percentage scaling</strong> - Scale by percentage of original (e.g., 50% = half size)</li>
					<li><strong>Aspect ratio lock</strong> - Maintain proportions while resizing</li>
					<li><strong>Constrain to max dimension</strong> - Fit within width/height limits</li>
				</ul>
				
				<p><strong>Quality considerations:</strong></p>
				<ul>
					<li><strong>Downscaling</strong> - Reducing size is generally safe, minimal quality loss</li>
					<li><strong>Upscaling</strong> - Enlarging images can cause pixelation/blur</li>
					<li><strong>Resampling algorithms</strong> - Bicubic, bilinear, nearest-neighbor affect quality</li>
					<li><strong>Format choice</strong> - JPEG for photos, PNG for graphics with transparency</li>
				</ul>
				
				<p><strong>Best practice:</strong> Always keep the original, resize copies for web use, and test quality at target dimensions.</p>
			`
		},
		examples: [
			{
				label: 'Resize to exact dimensions',
				code: 'Original: 1920×1080 px\nTarget: 800×600 px\nResult: Image resized to exact size (aspect ratio may change)',
				isValid: true
			},
			{
				label: 'Scale by percentage maintaining aspect ratio',
				code: 'Original: 2400×1600 px\nScale: 50%\nResult: 1200×800 px (proportions maintained)',
				isValid: true
			},
			{
				label: 'Resize for social media',
				code: 'Original: 3000×2000 px\nTarget: 1200×630 px (Facebook OG image)\nResult: Optimized for social sharing',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What happens to image quality when resizing?',
				answer: '<p><strong>Downscaling</strong> (making smaller) usually preserves quality well. <strong>Upscaling</strong> (making larger) can cause blurriness or pixelation since you\'re adding pixels that don\'t exist in the original. Our tool uses high-quality resampling to minimize quality loss.</p>'
			},
			{
				question: 'Should I maintain aspect ratio when resizing?',
				answer: '<p>Yes, in most cases! Maintaining aspect ratio prevents distortion. Unlock it only for specific use cases like fitting exact banner dimensions where stretching is acceptable. For thumbnails and web images, always keep aspect ratio locked.</p>'
			},
			{
				question: 'What\'s the difference between resizing and compressing?',
				answer: '<p><strong>Resizing</strong> changes pixel dimensions (e.g., 1920×1080 → 800×600). <strong>Compressing</strong> reduces file size without changing dimensions by adjusting quality. For best results, resize first, then compress.</p>'
			},
			{
				question: 'What dimensions should I use for web images?',
				answer: '<p>Common web sizes: <strong>Thumbnails</strong> 150-300px, <strong>Content images</strong> 800-1200px wide, <strong>Hero images</strong> 1920-2400px, <strong>Social media</strong> varies (Instagram 1080×1080, Twitter 1200×675). Always optimize for your layout and audience.</p>'
			},
			{
				question: 'Can I resize images without losing quality?',
				answer: '<p><strong>Downscaling</strong> preserves quality well. For <strong>upscaling</strong>, quality loss is inevitable—you can\'t add detail that wasn\'t captured. Use vector formats (SVG) or higher resolution originals when possible for enlarging.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Reduce file size' },
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert formats' },
			{ name: 'Image Cropper', path: '/image/crop', description: 'Crop to dimensions' },
			{ name: 'Image Metadata Viewer', path: '/image/metadata', description: 'View EXIF data' }
		],
		tips: [
			'Downscale by 50% gradually for best quality',
			'Use aspect ratio lock to prevent distortion',
			'Web-optimized width: 800-1200px for most content images',
			'Save originals before resizing—always work on copies'
		]
	},

	'compressor': {
		features: [
			'Quality control slider (10-100%)',
			'Target file size limit option',
			'Automatic dimension resize for large images',
			'Format conversion (JPEG, PNG, WebP)',
			'EXIF metadata preservation option',
			'Real-time compression preview and stats'
		],
		useCases: [
			'Reduce image file sizes for faster websites',
			'Meet file size limits for uploads',
			'Optimize images for email attachments',
			'Compress photos for mobile apps',
			'Batch optimize for web galleries'
		],
		concept: {
			title: 'Image Compression Techniques',
			content: `
				<p><strong>Image compression</strong> reduces file size by removing redundant or less noticeable data. This speeds up websites, saves bandwidth, and reduces storage costs.</p>
				
				<p><strong>Compression types:</strong></p>
				<ul>
					<li><strong>Lossy</strong> - Removes data permanently (JPEG, WebP). Smaller files, some quality loss</li>
					<li><strong>Lossless</strong> - No data loss (PNG). Larger files, perfect quality</li>
					<li><strong>Quality setting</strong> - Balance between file size and visual quality (80-90% is sweet spot)</li>
				</ul>
				
				<p><strong>Format selection:</strong></p>
				<ul>
					<li><strong>JPEG</strong> - Best for photos, gradients, complex images (lossy, no transparency)</li>
					<li><strong>PNG</strong> - Best for logos, text, transparency needed (lossless or lossy-lite)</li>
					<li><strong>WebP</strong> - Modern format, 25-35% smaller than JPEG/PNG with same quality</li>
					<li><strong>AVIF</strong> - Newest format, even smaller but limited browser support</li>
				</ul>
				
				<p><strong>Quality vs file size:</strong> At 90% quality, most users can't detect compression. At 60-70%, slight artifacts appear. Below 50%, noticeable degradation occurs.</p>
				
				<p><strong>Best practice:</strong> Use 80-85% quality for web images, preserve originals at 100%, and choose WebP for best size/quality ratio with JPEG fallback.</p>
			`
		},
		examples: [
			{
				label: 'Compress photo with quality control',
				code: 'Original: 5MB, 4000×3000 px\nQuality: 85%\nResult: 800KB (84% reduction)',
				isValid: true
			},
			{
				label: 'Target file size limit',
				code: 'Original: 3.2MB\nTarget: Max 1MB\nResult: Quality auto-adjusted to meet limit',
				isValid: true
			},
			{
				label: 'Convert to WebP for maximum savings',
				code: 'Original JPEG: 1.5MB\nConverted to WebP (85%): 450KB (70% reduction)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What quality setting should I use?',
				answer: '<p><strong>80-90%</strong> is the sweet spot for web images. At 90%, compression is nearly invisible. At 85%, you get good savings with minimal quality loss. Below 70%, artifacts become noticeable. Test on your specific images!</p>'
			},
			{
				question: 'Should I use JPEG, PNG, or WebP?',
				answer: '<p>Use <strong>WebP</strong> when possible (modern browsers support it). Fallback to <strong>JPEG</strong> for photos and <strong>PNG</strong> for logos/graphics with transparency. WebP offers 25-35% better compression than JPEG/PNG at the same quality.</p>'
			},
			{
				question: 'Will compression reduce image quality?',
				answer: '<p>Lossy compression (JPEG, WebP) removes some data, but at 80-90% quality, the loss is imperceptible to most users. Lossless compression (PNG) reduces file size without any quality loss. Always keep high-quality originals!</p>'
			},
			{
				question: 'What is EXIF metadata and should I keep it?',
				answer: '<p>EXIF is camera/photo data (date, location, camera settings). <strong>Remove it</strong> for web use (privacy + smaller file size). <strong>Preserve it</strong> for archival photos or when metadata is needed (e.g., copyright).</p>'
			},
			{
				question: 'Can I compress images multiple times?',
				answer: '<p><strong>No!</strong> Each lossy compression degrades quality further. Compress once from the original high-quality source. If you need to re-compress, go back to the original, don\'t compress an already compressed image.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Resizer', path: '/image/resize', description: 'Change dimensions' },
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert formats' },
			{ name: 'Image Metadata Viewer', path: '/image/metadata', description: 'Remove EXIF data' },
			{ name: 'Image BG Remover', path: '/image/remove-white', description: 'Remove white backgrounds' }
		],
		tips: [
			'Use 85% quality for a good balance of size and quality',
			'Convert to WebP for 25-35% better compression than JPEG',
			'Remove EXIF metadata to reduce file size and protect privacy',
			'Compress from originals—never re-compress already compressed images'
		]
	},

	'crop': {
		features: [
			'Visual crop area selection',
			'AspectRatio presets (16:9, 4:3, 1:1, etc.)',
			'Free-form cropping',
			'Precise pixel coordinate input',
			'Real-time preview of cropped area',
			'Maintain aspect ratio while cropping'
		],
		useCases: [
			'Remove unwanted edges from photos',
			'Crop to specific social media dimensions',
			'Focus on specific subjects in images',
			'Create square thumbnails from photos',
			'Prepare images for print with specific ratios'
		],
		concept: {
			title: 'Image Cropping Fundamentals',
			content: `
				<p><strong>Image cropping</strong> removes outer portions of an image to improve framing, emphasize subjects, or fit specific dimensions. Unlike resizing, cropping reduces the visible area.</p>
				
				<p><strong>Cropping methods:</strong></p>
				<ul>
					<li><strong>Free-form</strong> - Drag to select any crop area</li>
					<li><strong>Aspect ratio lock</strong> - Maintains proportions (16:9, 4:3, 1:1, etc.)</li>
					<li><strong>Pixel coordinates</strong> - Exact positioning with x, y, width, height</li>
					<li><strong>Presets</strong> - Common formats (Instagram square, Facebook cover, etc.)</li>
				</ul>
				
				<p><strong>Common aspect ratios:</strong></p>
				<ul>
					<li><strong>16:9</strong> - Widescreen, YouTube thumbnails, web banners</li>
					<li><strong>4:3</strong> - Standard photo, classic TV aspect</li>
					<li><strong>1:1</strong> - Square, Instagram posts, profile pictures</li>
					<li><strong>21:9</strong> - Ultra-wide, cinematic</li>
				</ul>
				
				<p><strong>Rule of thirds:</strong> Positioning subjects along the intersections of a 3×3 grid creates more interesting compositions than centering.</p>
			`
		},
		examples: [
			{
				label: 'Crop to Instagram square',
				code: 'Original: 1920×1080 px\nCrop to: 1080×1080 px (1:1)\nResult: Square image for Instagram',
				isValid: true
			},
			{
				label: 'Remove unwanted edges',
				code: 'Original: Photo with distracting borders\nCrop: Remove outer 10% on all sides\nResult: Focused composition',
				isValid: true
			},
			{
				label: 'Crop for YouTube thumbnail',
				code: 'Original: 3000×2000 px\nCrop to: 1280×720 px (16:9)\nResult: Perfect YouTube thumbnail ratio',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What\'s the difference between cropping and resizing?',
				answer: '<p><strong>Cropping</strong> removes outer portions of an image, reducing visible area. <strong>Resizing</strong> changes dimensions but keeps all content. Use cropping to remove unwanted parts, resizing to change size.</p>'
			},
			{
				question: 'What aspect ratio should I use?',
				answer: '<p>It depends on usage: <strong>1:1</strong> for Instagram/profile pics, <strong>16:9</strong> for YouTube/web banners, <strong>4:5</strong> for Instagram portraits, <strong>2:3</strong> for Pinterest. Match your platform or stay with the original ratio.</p>'
			},
			{
				question: 'Can I undo a crop?',
				answer: '<p><strong>No!</strong> Cropping permanently removes pixels. Always <strong>save a copy</strong> before cropping. Keep high-resolution originals and work on duplicates for web use.</p>'
			},
			{
				question: 'Should I crop before orafter resizing?',
				answer: '<p>Generally, <strong>crop first</strong> to get the right composition and aspect ratio, then <strong>resize</strong> to fit specific dimensions. This preserves more detail than resizing first.</p>'
			},
			{
				question: 'How do I crop without losing quality?',
				answer: '<p>Cropping itself doesn\'t reduce quality—it just removes pixels. For best results, crop from high-resolution originals, then resize/compress the cropped result for web use.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Resizer', path: '/image/resize', description: 'Change dimensions' },
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Reduce file size' },
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert formats' },
			{ name: 'Image BG Remover', path: '/image/remove-white', description: 'Remove backgrounds' }
		]
	},

	'converter': {
		features: [
			'Convert between JPEG, PNG, WebP, GIF',
			'Quality settings for lossy formats',
			'Transparency preservation for PNG',
			'Batch conversion support',
			'Format-specific optimization',
			'Preview before conversion'
		],
		useCases: [
			'Convert PNG to JPEG for smaller file sizes',
			'Convert JPEG to WebP for modern browsers',
			'Add transparency to images (convert to PNG)',
			'Convert for specific platform requirements',
			'Optimize images for web deployment'
		],
		concept: {
			title: 'Image Format Conversion',
			content: `
				<p><strong>Image format conversion</strong> transforms images between different file types, each optimized for specific use cases.</p>
				
				<p><strong>Common formats:</strong></p>
				<ul>
					<li><strong>JPEG (.jpg)</strong> - Lossy, no transparency. Best for photos</li>
					<li><strong>PNG (.png)</strong> - Lossless or lossy, supports transparency. Best for logos/graphics</li>
					<li><strong>WebP (.webp)</strong> - Modern format, 25-35% smaller than JPEG/PNG. Best for web</li>
					<li><strong>GIF (.gif)</strong> - Limited colors, animations. Best for simple graphics</li>
					<li><strong>SVG (.svg)</strong> - Vector format, infinitely scalable. Best for icons</li>
				</ul>
				
				<p><strong>Format selection guide:</strong></p>
				<ul>
					<li><strong>Photos</strong> → JPEG or WebP (lossy compression)</li>
					<li><strong>Logos with transparency</strong> → PNG or WebP</li>
					<li><strong>Screenshots</strong> → PNG (text clarity)</li>
					<li><strong>Simple animations</strong> → GIF or WebP (animated)</li>
					<li><strong>Icons/vectors</strong> → SVG</li>
				</ul>
				
				<p><strong>Transparency note:</strong> Only PNG, WebP, and GIF support transparency. Converting from these to JPEG replaces transparency with a solid color (usually white).</p>
			`
		},
		examples: [
			{
				label: 'Convert PNG to JPEG',
				code: 'Original: logo.png (2MB, transparency)\nConvert to: logo.jpg (200KB, white background)\nUse: When transparency not needed',
				isValid: true
			},
			{
				label: 'Convert JPEG to WebP',
				code: 'Original: photo.jpg (1.5MB)\nConvert to: photo.webp (450KB, same quality)\nUse: Modern web optimization',
				isValid: true
			},
			{
				label: 'Convert JPEG to PNG',
				code: 'Original: graphic.jpg (artifacts from compression)\nConvert to: graphic.png (lossless, crisp text)\nUse: When you need perfect quality',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What format should I use for web images?',
				answer: '<p>Use <strong>WebP</strong> with JPEG/PNG fallback for best compatibility and size. For photos, JPEG is fine. For logos/graphics with transparency, use PNG. Always optimize for web!</p>'
			},
			{
				question: 'Will I lose quality when converting formats?',
				answer: '<p>It depends: <strong>Lossless to lossless</strong> (PNG→PNG) preserves quality. <strong>Lossy to lossless</strong> (JPEG→PNG) doesn\'t add quality back. <strong>Lossless to lossy</strong> (PNG→JPEG) reduces quality. Choose appropriate formats!</p>'
			},
			{
				question: 'Can I convert JPEG to PNG to add transparency?',
				answer: '<p><strong>No.</strong> You can convert JPEG to PNG, but the transparent areas must be <strong>manually removed</strong> (use Remove Background tool). Conversion alone won\'t create transparency from solid backgrounds.</p>'
			},
			{
				question: 'What happens to transparency when converting to JPEG?',
				answer: '<p>JPEG doesn\'t support transparency. Transparent areas are replaced with a <strong>solid color</strong> (usually white). If you need transparency, stick with PNG or convert to WebP.</p>'
			},
			{
				question: 'Is WebP better than JPEG?',
				answer: '<p>Yes! WebP offers <strong>25-35% better compression</strong> than JPEG at the same visual quality, supports transparency, and has wide browser support. Use WebP with JPEG fallback for older browsers.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress after converting' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize dimensions' },
			{ name: 'Image BG Remover', path: '/image/remove-white', description: 'Add transparency' },
			{ name: 'Image Metadata Viewer', path: '/image/metadata', description: 'View/edit metadata' }
		],
		tips: [
			'Use WebP for web—25-35% smaller than JPEG at same quality',
			'JPEG for photos, PNG for logos/graphics with transparency',
			'Converting to lossless doesn\'t improve quality of lossy sources',
			'Test format compatibility with your target platforms'
		]
	},

	'blur': {
		features: [
			'Adjustable blur intensity',
			'Gaussian blur algorithm',
			'Real-time preview',
			'Full image or selective blur',
			'Privacy protection for sensitive content',
			'Instant processing'
		],
		useCases: [
			'Blur faces for privacy',
			'Hide sensitive information in screenshots',
			'Create depth-of-field effects',
			'Background blur for product photos',
			'Anonymize private data in images'
		],
		concept: {
			title: 'Image Blur Effects',
			content: `
				<p><strong>Image blurring</strong> reduces detail and sharpness by averaging neighboring pixels. It's used for privacy, artistic effects, and drawing attention to specific subjects.</p>
				
				<p><strong>Blur types:</strong></p>
				<ul>
					<li><strong>Gaussian blur</strong> - Smooth, natural-looking blur (most common)</li>
					<li><strong>Motion blur</strong> - Directional blur simulating movement</li>
					<li><strong>Box blur</strong> - Simple averaging, faster but less natural</li>
					<li><strong>Radial blur</strong> - Blur radiating from a center point</li>
				</ul>
				
				<p><strong>Blur intensity:</strong> Measured in pixels (radius). Higher values create stronger blur:</p>
				<ul>
					<li><strong>1-3px</strong> - Subtle softening</li>
					<li><strong>5-10px</strong> - Moderate blur for backgrounds</li>
					<li><strong>15-30px</strong> - Heavy blur for privacy/security</li>
					<li><strong>50+px</strong> - Extreme blur, complete obscuration</li>
				</ul>
				
				<p><strong>Privacy use:</strong> Blur is effective for hiding faces, license plates, addresses, or sensitive documents. For security-critical data, consider complete redaction instead of blurring.</p>
			`
		},
		examples: [
			{
				label: 'Privacy blur for faces',
				code: 'Original: Group photo\nBlur: 20px Gaussian on faces\nResult: Faces obscured, rest of image clear',
				isValid: true
			},
			{
				label: 'Background blur effect',
				code: 'Original: Product photo\nBlur: 15px on background only\nResult: Subject stands out with blurred background',
				isValid: true
			},
			{
				label: 'Screenshot sensitive data',
				code: 'Original: Screenshot with personal info\nBlur: 25px on private sections\nResult: Shareable screenshot with privacy protected',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can blurred data be un-blurred?',
				answer: '<p>Generally <strong>no</strong>, but sophisticated techniques can sometimes recover partial information from light blurs. For high-security needs, use <strong>solid redaction</strong> (black boxes) instead of blur.</p>'
			},
			{
				question: 'What blur intensity should I use for privacy?',
				answer: '<p>Use at least <strong>15-20px</strong> for faces and <strong>25-30px</strong> for text/sensitive data. Test by zooming in—if you can still recognize details, increase the blur radius.</p>'
			},
			{
				question: 'Does blurring reduce file size?',
				answer: '<p>Sometimes! Blurred areas have less detail, which can compress better (especially JPEG). However, the file size reduction is minor. Use compression tools for meaningful size reduction.</p>'
			},
			{
				question: 'Can I blur only part of an image?',
				answer: '<p>Yes! Select specific areas to blur while keeping the rest sharp. This is useful for backgrounds, faces, or sensitive information while maintaining overall image clarity.</p>'
			},
			{
				question: 'Is Gaussian blur the best for privacy?',
				answer: '<p>For typical needs, yes. Gaussian blur is hard to reverse. For maximum security (legal documents, passwords), use <strong>pixelation</strong> or <strong>solid black boxes</strong> instead.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Cropper', path: '/image/crop', description: 'Remove sensitive areas' },
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress blurred images' },
			{ name: 'Image Metadata Viewer', path: '/image/metadata', description: 'Remove location data' },
			{ name: 'Image BG Remover', path: '/image/remove-white', description: 'Isolate subjects' }
		]
	},

	'colors': {
		features: [
			'Adjust brightness and contrast',
			'Saturation and vibrance control',
			'Hue shifting and color tinting',
			'Grayscale and sepia filters',
			'Real-time color preview',
			'Reset to original with one click'
		],
		useCases: [
			'Enhance underexposed photos',
			'Create vintage sepia effects',
			'Convert to black and white',
			'Adjust color temperature',
			'Increase saturation for vibrant images'
		],
		concept: {
			title: 'Color Manipulation and Adjustment',
			content: `
				<p><strong>Color manipulation</strong> adjusts the visual properties of an image—brightness, contrast, saturation, and hue—to improve appearance or create artistic effects.</p>
				
				<p><strong>Key adjustments:</strong></p>
				<ul>
					<li><strong>Brightness</strong> - Overall lightness/darkness</li>
					<li><strong>Contrast</strong> - Difference between light and dark areas</li>
					<li><strong>Saturation</strong> - Color intensity (vibrant vs muted)</li>
					<li><strong>Hue</strong> - Actual color shift (red → orange → yellow, etc.)</li>
					<li><strong>Vibrance</strong> - Selective saturation (enhances muted colors without oversaturating)</li>
				</ul>
				
				<p><strong>Common filters:</strong></p>
				<ul>
					<li><strong>Grayscale</strong> - Remove all color, black and white</li>
					<li><strong>Sepia</strong> - Vintage brownish tint</li>
					<li><strong>Cool/Warm</strong> - Blue or orange color temperature shift</li>
					<li><strong>Invert</strong> - Negative effect, opposite colors</li>
				</ul>
				
				<p><strong>Best practices:</strong> Make small incremental adjustments. Oversaturating or over-brightening can look unnatural. Use histograms to avoid clipping highlights or shadows.</p>
			`
		},
		examples: [
			{
				label: 'Enhance underexposed photo',
				code: 'Original: Dark photo\nAdjustments: +30% brightness, +15% contrast\nResult: Well-exposed, vibrant image',
				isValid: true
			},
			{
				label: 'Create black and white',
				code: 'Original: Color photo\nFilter: Grayscale\nResult: Classic black and white image',
				isValid: true
			},
			{
				label: 'Vintage sepia toning',
				code: 'Original: Modern photo\nFilter: Sepia + reduced saturation\nResult: Nostalgic vintage look',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What\'s the difference between saturation and vibrance?',
				answer: '<p><strong>Saturation</strong> increases all colors equally, which can oversaturate already-vibrant tones. <strong>Vibrance</strong> selectively enhances muted colors while protecting already-saturated ones from clipping. Use vibrance for more natural results.</p>'
			},
			{
				question: 'How do I fix a dark photo?',
				answer: '<p>Increase <strong>brightness</strong> first, then adjust <strong>contrast</strong> to restore depth. If shadows are too dark, try <strong>shadow recovery</strong>. Avoid extreme brightness adjustments that cause washed-out highlights.</p>'
			},
			{
				question: 'Can I convert back from grayscale to color?',
				answer: '<p><strong>No.</strong> Grayscale conversion permanently removes color data. You can re-colorize (add fake colors), but the original colors are lost. Always keep a color copy before converting!</p>'
			},
			{
				question: 'Why do my colors look oversaturated?',
				answer: '<p>You\'ve pushed saturation too far! Dial it back. Use <strong>vibrance</strong> instead of saturation for more natural enhancement, and make small +10-20% adjustments rather than large jumps.</p>'
			},
			{
				question: 'What is color temperature?',
				answer: '<p>Color temperature makes images appear <strong>warmer</strong> (orange/yellow tint, like sunset) or <strong>cooler</strong> (blue tint, like shade). Adjust to match lighting conditions or create moods.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress edited images' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize for web' },
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert formats' },
			{ name: 'Image Cropper', path: '/image/crop', description: 'Crop composition' }
		]
	},

	'metadata': {
		features: [
			'View EXIF data (camera, date, location)',
			'Display GPS coordinates if present',
			'Show image dimensions and file info',
			'Remove metadata for privacy',
			'Preserve or strip EXIF when saving',
			'View copyright and author information'
		],
		useCases: [
			'Check when and where a photo was taken',
			'Remove location data before sharing',
			'View camera settings used for a shot',
			'Verify image authenticity (EXIF tampering)',
			'Extract copyright or authorship info'
		],
		concept: {
			title: 'Image Metadata and EXIF Data',
			content: `
				<p><strong>Image metadata</strong> is hidden information embedded in photo files, including camera settings, date/time, GPS location, copyright, and more.</p>
				
				<p><strong>EXIF (Exchangeable Image File Format):</strong></p>
				<ul>
					<li><strong>Camera info</strong> - Make, model, lens</li>
					<li><strong>Settings</strong> - ISO, aperture, shutter speed, focal length</li>
					<li><strong>DateTime</strong> - When the photo was taken</li>
					<li><strong>GPS</strong> - Latitude/longitude where photo was taken</li>
					<li><strong>Copyright</strong> - Author, copyright notice</li>
				</ul>
				
				<p><strong>Privacy concerns:</strong></p>
				<ul>
					<li><strong>Location tracking</strong> - GPS data reveals where you were</li>
					<li><strong>Time stamps</strong> - Shows when events occurred</li>
					<li><strong>Device fingerprinting</strong> - Camera serial numbers can identify you</li>
				</ul>
				
				<p><strong>When to remove metadata:</strong> Before sharing photos publicly, posting online, or sending to strangers. Remove GPS, camera serial, and personal info.</p>
				
				<p><strong>When to preserve metadata:</strong> Archival photos, professional portfolios (copyright), evidence/documentation, photo competitions requiring EXIF.</p>
			`
		},
		examples: [
			{
				label: 'View camera settings',
				code: 'Photo EXIF:\nCamera: Canon EOS R5\nLens: 24-70mm f/2.8\nSettings: f/2.8, 1/200s, ISO 400',
				isValid: true
			},
			{
				label: 'Check GPS location',
				code: 'EXIF GPS Data:\nLatitude: 37.7749° N\nLongitude: 122.4194° W\nLocation: San Francisco, CA',
				isValid: true
			},
			{
				label: 'Remove metadata for privacy',
				code: 'Original: Photo with GPS, camera serial\nAfter removal: Clean image, no personal data\nUse: Safe to share publicly',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is EXIF and why should I care?',
				answer: '<p>EXIF is hidden data in photos. It can reveal <strong>where</strong> you took a photo (GPS), <strong>when</strong> (timestamps), and <strong>what camera</strong>you used. For privacy, remove EXIF before sharing photos online!</p>'
			},
			{
				question: 'Do all images have EXIF data?',
				answer: '<p><strong>No.</strong> Only photos from cameras/phones typically have EXIF. Screenshots, drawn graphics, and web-downloaded images usually lack EXIF. JPEGs commonly have it; PNGs and WebPs less often.</p>'
			},
			{
				question: 'Can I edit EXIF data?',
				answer: '<p>Yes! You can edit or remove specific fields (copyright, author, keywords) or strip all EXIF. Some tools let you add custom EXIF. Note: editing may break digital signatures used for authenticity verification.</p>'
			},
			{
				question: 'Does social media remove EXIF when I upload photos?',
				answer: '<p>Usually <strong>yes</strong>. Most platforms (Facebook, Twitter, Instagram) strip EXIF automatically for privacy and file size reduction. However, <strong>don\'t rely on this</strong>—remove sensitive data yourself before uploading.</p>'
			},
			{
				question: 'Will removing EXIF reduce file size?',
				answer: '<p>Yes, slightly (usually 10-50KB). For massive file size reduction, use compression. Remove EXIF primarily for <strong>privacy</strong>, not size optimization.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Optionally remove EXIF' },
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert formats' },
			{ name: 'Image Blur', path: '/image/blur', description: 'Blur sensitive areas' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize images' }
		],
		tips: [
			'Remove GPS data before sharing photos publicly',
			'Preserve EXIF for archival or professional portfolios',
			'Check EXIF removal—don\'t rely solely on social media platforms',
			'Use EXIF to learn camera settings from great photos you find online'
		]
	},

	'remove-white': {
		features: [
			'Remove white backgrounds automatically',
			'Adjustable tolerance for near-white colors',
			'Output as PNG with transparency',
			'Clean edge detection',
			'Preview before downloading',
			'100% client-side processing'
		],
		useCases: [
			'Remove white backgrounds from logos',
			'Create transparent PNGs for overlays',
			'Prepare product photos for e-commerce',
			'Extract signatures from scanned documents',
			'Clean up scanned artwork'
		],
		concept: {
			title: 'Background Removal Techniques',
			content: `
				<p><strong>Background removal</strong> isolates the main subject by making the background transparent. This is essential for logos, product photos, and compositing images.</p>
				
				<p><strong>Removal methods:</strong></p>
				<ul>
					<li><strong>Color-based</strong> - Remove specific color (e.g., white, green screen)</li>
					<li><strong>Edge detection</strong> - Find subject boundaries automatically</li>
					<li><strong>AI-based</strong> - Machine learning identifies subjects (advanced)</li>
					<li><strong>Manual masking</strong> - Draw around subject (most precise)</li>
				</ul>
				
				<p><strong>Tolerance setting:</strong> Controls how "close" colors must be to white to be removed:</p>
				<ul>
					<li><strong>Low tolerance (5-10)</strong> - Only pure white removed</li>
					<li><strong>Medium (15-30)</strong> - Includes near-whites, slight gray</li>
					<li><strong>High (40-50)</strong> - Removes grays, may affect subject</li>
				</ul>
				
				<p><strong>Output format:</strong> Always save as <strong>PNG</strong> to preserve transparency. JPEG doesn't support transparency and will replace it with solid color.</p>
				
				<p><strong>Tip:</strong> For non-white backgrounds (green screen, blue, etc.), adjust the target color. For complex backgrounds, use AI-based removal tools.</p>
			`
		},
		examples: [
			{
				label: 'Remove white background from logo',
				code: 'Original: Logo on white background\nTolerance: 20\nResult: Transparent PNG, logo only',
				isValid: true
			},
			{
				label: 'Product photo for e-commerce',
				code: 'Original: Product on white backdrop\nTolerance: 25\nResult: Clean product with transparent background',
				isValid: true
			},
			{
				label: 'Extract signature from scan',
				code: 'Original: Scanned paper with signature\nTolerance: 30\nResult: Signature only, transparent background',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is tolerance and how should I set it?',
				answer: '<p><strong>Tolerance</strong> determines how similar colors must be to white to be removed. Start with <strong>20-25</strong>. If edges remain, increase. If subject disappears, decrease. Test and adjust!</p>'
			},
			{
				question: 'Why do I see white edges around my subject?',
				answer: '<p>Tolerance is too low! Increase it slightly to remove near-white pixels. Alternatively, use <strong>edge feathering</strong> or <strong>expand selection</strong> to clean up edges after removal.</p>'
			},
			{
				question: 'Can I remove colors other than white?',
				answer: '<p>Yes! This tool works best for white, but the same technique applies to any solid color (green screen, blue, etc.). For complex multicolor backgrounds, use AI-based background removal tools.</p>'
			},
			{
				question: 'Why is my output still JPEG and not transparent?',
				answer: '<p>You must save as <strong>PNG</strong>! JPEG doesn\'t support transparency. Only PNG and WebP formats can have transparent areas. Always export as PNG for transparent backgrounds.</p>'
			},
			{
				question: 'Does this work for complex backgrounds?',
				answer: '<p><strong>No.</strong> This tool is for <strong>solid or near-solid</strong> backgrounds (white, green screen, etc.). For complex/textured backgrounds, use AI-powered background removal tools that detect subjects intelligently.</p>'
			}
		],
		relatedTools: [
			{ name: 'Image Format Converter', path: '/image/converter', description: 'Convert to PNG' },
			{ name: 'Image Cropper', path: '/image/crop', description: 'Crop before removal' },
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress PNGs' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize output' }
		]
	}
};

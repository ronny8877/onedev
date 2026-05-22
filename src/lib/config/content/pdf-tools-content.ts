export interface PdfToolContent {
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
	tips?: string[];
}

export const pdfToolsContent: Record<string, PdfToolContent> = {
	'viewer': {
		features: [
			'View PDF files directly in your browser',
			'Page-by-page navigation with prev/next',
			'Zoom in and out for detailed reading',
			'Jump to any page number instantly',
			'Display page count and current position',
			'No file uploads—100% client-side processing'
		],
		useCases: [
			'Preview PDF documents before sharing or sending',
			'Quickly read PDFs without installing a PDF reader',
			'Review contracts and documents on any device',
			'Check PDF formatting and layout before publishing',
			'View PDF attachments without downloading to your device'
		],
		concept: {
			title: 'Online PDF Viewing',
			content: `<p><strong>PDF (Portable Document Format)</strong> is the universal document format used for sharing files that preserve their formatting across any device. Our PDF viewer lets you open and read PDFs directly in your browser without installing any software.</p>
			<p><strong>How PDF rendering works:</strong> PDF files contain instructions for drawing text, images, and vector graphics on each page. The viewer interprets these instructions and renders them to your screen using canvas technology. This means the document looks exactly as intended, regardless of your operating system or device.</p>
			<p><strong>Common viewing features:</strong> Page navigation (next/previous), zoom controls for detailed inspection, page number display, and total page count. Unlike desktop PDF readers, our online viewer requires no installation and works on any device with a modern browser.</p>
			<p><strong>Privacy advantage:</strong> Since all processing happens in your browser, your PDF file never leaves your device. This makes it ideal for viewing sensitive documents, contracts, medical records, or any confidential content you'd rather keep local.</p>`
		},
		examples: [
			{
				label: 'View a multi-page document',
				code: 'Open PDF → Navigate pages 1 through 15\nUse zoom to examine detailed sections\nJump directly to page 10',
				isValid: true
			},
			{
				label: 'Check PDF layout',
				code: 'Open PDF → Zoom to 150%\nVerify text alignment and image placement\nEnsure formatting matches design specifications',
				isValid: true
			},
			{
				label: 'Preview before sharing',
				code: 'Open PDF → Review all pages for errors\nConfirm all content is included\nShare with confidence knowing document is correct',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Do I need to install anything to use this PDF viewer?',
				answer: '<p><strong>No!</strong> Our PDF viewer runs entirely in your browser. There\'s nothing to download or install—just open your PDF file and start viewing immediately. It works on Windows, Mac, Linux, iOS, and Android.</p>'
			},
			{
				question: 'Is my PDF file sent to any server?',
				answer: '<p><strong>No.</strong> All PDF processing happens locally on your device using JavaScript. Your file never leaves your browser, making this tool completely private and secure for sensitive documents.</p>'
			},
			{
				question: 'What file size limitations are there?',
				answer: '<p>Large PDFs (50MB+) may load slower depending on your device\'s RAM. For best performance, PDFs under 20MB load quickly. The viewer handles any page count—from single-page flyers to 500-page books.</p>'
			},
			{
				question: 'Can I view encrypted or password-protected PDFs?',
				answer: '<p>Currently, our viewer supports standard unencrypted PDFs. Password-protected PDFs require decryption which isn\'t supported in the current version. Remove the password first using a desktop PDF tool.</p>'
			},
			{
				question: 'Does the viewer support all PDF features?',
				answer: '<p>Our viewer renders text and images accurately. Advanced features like embedded forms, JavaScript, 3D content, or video may not display fully. For basic document viewing and reading, it works excellently.</p>'
			},
			{
				question: 'Can I view PDFs on my phone or tablet?',
				answer: '<p>Yes! The viewer is fully responsive and works on any device with a modern browser. Pinch-to-zoom and swipe navigation work naturally on touch devices.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Extract pages from PDF' },
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Combine PDFs into one' },
			{ name: 'PDF Compressor', path: '/pdf/compress', description: 'Reduce file size' },
			{ name: 'PDF Compare', path: '/pdf/compare', description: 'Find differences between PDFs' }
		]
	},

	'split': {
		features: [
			'Extract specific page ranges from a PDF',
			'Split PDF into individual pages',
			'Select pages by number or range (e.g., 1-3,5,7-9)',
			'Download extracted pages as a new PDF',
			'Preview pages before splitting',
			'100% client-side—no file uploads'
		],
		useCases: [
			'Extract a single chapter from a large ebook',
			'Split a merged document back into separate files',
			'Remove unwanted pages from a PDF',
			'Save only specific forms from a multi-page document',
			'Separate scanned documents that were merged accidentally'
		],
		concept: {
			title: 'PDF Splitting Explained',
			content: `<p><strong>PDF splitting</strong> divides a single PDF file into multiple separate PDFs. You can extract specific pages, split every page into its own file, or separate a document into logical sections.</p>
			<p><strong>How splitting works:</strong> The tool reads your PDF, copies only the pages you specify into a new document, and saves the result. The original file remains untouched—you\'re creating a subset, not modifying the source.</p>
			<p><strong>Page range syntax:</strong> Use commas for individual pages (1,3,5) and hyphens for ranges (1-5). Combine both for flexible selection (1-3,7,10-12). Pages are 1-indexed (first page is 1, not 0).</p>
			<p><strong>Common strategies:</strong> Split into individual pages when you need each page as a separate file. Split by range when you need chapters or sections. Split by custom selection when you need specific pages only.</p>`
		},
		examples: [
			{
				label: 'Extract chapters 1-3',
				code: 'Original: 200-page book\nExtract: pages 1-45 (chapters 1-3)\nResult: New PDF with only selected chapters',
				isValid: true
			},
			{
				label: 'Split into individual pages',
				code: 'Original: 10-page document\nSplit: All pages individually\nResult: 10 separate PDF files',
				isValid: true
			},
			{
				label: 'Remove specific pages',
				code: 'Original: Invoice with blank page 3\nExtract: pages 1-2,4-5\nResult: Clean invoice without blank page',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will splitting reduce PDF quality?',
				answer: '<p><strong>No.</strong> Splitting copies pages from the original PDF into new files. There\'s no re-compression or quality loss—each extracted page is identical to the original.</p>'
			},
			{
				question: 'How do I specify page ranges?',
				answer: '<p>Use commas for individual pages (<strong>1,3,5</strong>) and hyphens for ranges (<strong>1-5</strong>). Combine them like <strong>1-3,7,10-12</strong> for flexible selection. Page numbers start at 1.</p>'
			},
			{
				question: 'Can I split a password-protected PDF?',
				answer: '<p>No, you\'ll need to remove the password first using a PDF reader that supports password removal. Once unprotected, you can split it with our tool.</p>'
			},
			{
				question: 'Is there a limit to how many pages I can split?',
				answer: '<p>No hard limit, but very large PDFs (200+ pages) may take longer to process. The tool processes everything in your browser\'s memory, so performance depends on your device.</p>'
			},
			{
				question: 'What happens to the original PDF?',
				answer: '<p><strong>Nothing!</strong> Since processing is client-side, your original file stays on your device. The tool creates new PDFs from copies of the selected pages, leaving the original untouched.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Combine PDFs into one' },
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'View PDF pages' },
			{ name: 'PDF Compressor', path: '/pdf/compress', description: 'Reduce file size' },
			{ name: 'PDF Redact', path: '/pdf/redact', description: 'Remove sensitive content' }
		],
		tips: [
			'Preview pages before splitting to verify you have the right pages',
			'Use ranges for continuous sections and commas for non-contiguous pages',
			'Always verify the output PDF contains all expected pages',
			'Keep the original PDF until you confirm the split was correct'
		]
	},

	'merge': {
		features: [
			'Combine multiple PDF files into one',
			'Drag-and-drop reorder pages before merging',
			'Support for unlimited PDF inputs',
			'Preview page thumbnails',
			'Download merged result as a single PDF',
			'100% client-side—no uploads to servers'
		],
		useCases: [
			'Combine multiple reports into a single document',
			'Merge scanned pages into one complete PDF',
			'Assemble presentation slides from separate files',
			'Combine invoices and receipts for expense reports',
			'Consolidate research papers from different sources'
		],
		concept: {
			title: 'PDF Merging Explained',
			content: `<p><strong>PDF merging</strong> combines two or more PDF files into a single, unified document. This is essential for consolidating reports, assembling presentations, or combining scanned documents.</p>
			<p><strong>How merging works:</strong> The tool copies all pages from each input PDF, in order, into a new document. You can reorder files before merging to arrange them in any sequence. The result is a complete PDF containing everything from your source files.</p>
			<p><strong>Order matters:</strong> Files are merged in the order you arrange them. If you want a title page first, place that PDF at the top. Use the drag-and-drop reorder feature to get the sequence right before clicking merge.</p>
			<p><strong>Preservation:</strong> All text, images, formatting, and page dimensions from the original PDFs are preserved. Bookmarks and interactive elements may not carry over, but the visual content remains intact.</p>`
		},
		examples: [
			{
				label: 'Combine two reports',
				code: 'Input: report-part1.pdf (10 pages) + report-part2.pdf (15 pages)\nResult: combined-report.pdf (25 pages)',
				isValid: true
			},
			{
				label: 'Assemble presentation',
				code: 'Input: title.pdf + content.pdf + appendix.pdf\nReorder: title first, then content, then appendix\nResult: Complete presentation PDF',
				isValid: true
			},
			{
				label: 'Merge scanned pages',
				code: 'Input: scan-01.pdf through scan-10.pdf (one page each)\nResult: full-scan.pdf (10 pages)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is there a limit to how many PDFs I can merge?',
				answer: '<p>No hard limit, but very large merges (50+ files or 500+ total pages) may be slower depending on your device\'s memory. For most use cases (2-10 files), merging is nearly instant.</p>'
			},
			{
				question: 'Will merging change the formatting of my PDFs?',
				answer: '<p><strong>No.</strong> Each page retains its original layout, fonts, images, and dimensions. Merging simply concatenates pages—it doesn\'t modify individual page content.</p>'
			},
			{
				question: 'What if my PDFs have different page sizes?',
				answer: '<p>Each page keeps its original dimensions. A merged PDF can contain mixed page sizes (e.g., A4 and Letter). If you need uniform size, resize pages before or after merging.</p>'
			},
			{
				question: 'Can I reorder the files after adding them?',
				answer: '<p>Yes! Use drag-and-drop to reorder files in the list. The merge order follows the list order from top to bottom. Rearrange until you\'re satisfied with the sequence.</p>'
			},
			{
				question: 'Does merging increase file size?',
				answer: '<p>File size is roughly the sum of all input PDFs. If your merged result is too large, use the PDF Compressor afterward to reduce the size without losing quality.</p>'
			},
			{
				question: 'Can I merge password-protected PDFs?',
				answer: '<p>No, you\'ll need to remove the password first. Once all PDFs are unprotected, you can merge them freely with our tool.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Extract pages from PDF' },
			{ name: 'PDF Compressor', path: '/pdf/compress', description: 'Reduce merged file size' },
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Preview PDF content' },
			{ name: 'Images to PDF', path: '/pdf/images-to-pdf', description: 'Create PDFs from images' }
		],
		tips: [
			'Arrange files in the order you want them to appear in the final PDF',
			'Use PDF Compressor after merging if the combined file is too large',
			'Merge related documents to keep them organized and easy to share',
			'Check the merged PDF to confirm all pages are present and in order'
		]
	},

	'compress': {
		features: [
			'Reduce PDF file size while preserving quality',
			'Compression level control (low, medium, high)',
			'Display before and after file sizes',
			'Calculate percentage reduction',
			'Downsample embedded images',
			'100% client-side compression'
		],
		useCases: [
			'Compress PDFs to meet email attachment limits',
			'Reduce file size for web uploads and sharing',
			'Optimize PDFs for faster download on websites',
			'Shrink scanned documents that are too large',
			'Batch compress for archiving or storage'
		],
		concept: {
			title: 'PDF Compression Explained',
			content: `<p><strong>PDF compression</strong> reduces the file size of a PDF document by optimizing images, removing redundant data, and using efficient encoding. This makes PDFs faster to upload, download, and share.</p>
			<p><strong>Compression methods:</strong> The main approach is downsampling embedded images—reducing their resolution while maintaining visual quality. Text and vector graphics are typically small and don\'t benefit as much from compression. Unused objects and metadata can also be stripped to save space.</p>
			<p><strong>Compression levels:</strong> Low compression preserves most quality with modest size reduction. Medium balances quality and size. High compression aggressively downsamples images for maximum savings—best when file size is the priority.</p>
			<p><strong>What to expect:</strong> PDFs with many high-resolution images will see the biggest reductions (50-80%). Text-heavy PDFs with few images may only shrink 5-15%. Scanned documents benefit significantly from compression.</p>`
		},
		examples: [
			{
				label: 'Compress a scanned document',
				code: 'Original: 25MB scanned PDF (300 DPI images)\nCompression: Medium\nResult: ~8MB (68% reduction)',
				isValid: true
			},
			{
				label: 'Optimize for email',
				code: 'Original: 18MB PDF\nTarget: Under 10MB for email\nCompression: High → 6.5MB result',
				isValid: true
			},
			{
				label: 'Minimal compression for quality',
				code: 'Original: 12MB presentation PDF\nCompression: Low\nResult: ~9MB (25% reduction, near-original quality)',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will compression reduce the visual quality?',
				answer: '<p>At <strong>low and medium</strong> settings, quality loss is minimal and barely noticeable. At <strong>high</strong> compression, you may see slight image degradation. Text and vector graphics remain sharp at all levels.</p>'
			},
			{
				question: 'How much can I reduce my PDF size?',
				answer: '<p>Results vary: <strong>Image-heavy PDFs</strong> can shrink 50-80%. <strong>Text-only PDFs</strong> may only compress 5-15%. <strong>Scanned documents</strong> benefit most since they contain large embedded images.</p>'
			},
			{
				question: 'Can I compress a PDF multiple times?',
				answer: '<p><strong>No!</strong> Each compression pass may further degrade image quality. Compress once from the original at your desired level. If the result isn\'t small enough, go back to the original and use a higher compression level.</p>'
			},
			{
				question: 'Does compression affect text searchability?',
				answer: '<p>No. Text content is preserved during compression. Your PDF will remain searchable and selectable at all compression levels. Only embedded images are affected.</p>'
			},
			{
				question: 'What compression level should I choose?',
				answer: '<p><strong>Low</strong> for archival/preservation. <strong>Medium</strong> for general sharing and web use. <strong>High</strong> for email attachments or when file size is the primary concern. Start with medium and adjust based on results.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Combine PDFs before compressing' },
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Preview compressed result' },
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Split large PDFs into parts' },
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress images before PDF' }
		],
		tips: [
			'Start with medium compression and test—adjust up or down as needed',
			'Always review the compressed PDF for acceptable quality',
			'Image-heavy PDFs benefit most from compression',
			'Keep the original uncompressed file for archival purposes'
		]
	},

	'watermark': {
		features: [
			'Add text watermarks to all PDF pages',
			'Customize text, font size, color, and opacity',
			'Control watermark position and rotation',
			'Add image-based watermarks (logos)',
			'Preview watermark before applying',
			'100% client-side processing'
		],
		useCases: [
			'Add CONFIDENTIAL or DRAFT markers to documents',
			'Brand PDFs with company logo watermark',
			'Add copyright notices to published content',
			'Mark internal documents as INTERNAL USE ONLY',
			'Watermark images portfolios or design proofs'
		],
		concept: {
			title: 'PDF Watermarking Explained',
			content: `<p><strong>PDF watermarking</strong> overlays text or images onto existing PDF pages without modifying the underlying content. Watermarks are semi-transparent and typically sit behind (or in front of) the main content.</p>
			<p><strong>Types of watermarks:</strong> Text watermarks display custom text like "CONFIDENTIAL", "DRAFT", or a copyright notice. Image watermarks overlay a logo or graphic, often used for branding. Both can be customized for opacity, position, and rotation.</p>
			<p><strong>Common positions:</strong> Center (diagonal across page), top/bottom margins, and corner placements. Diagonal watermarks at 45° are popular for "DRAFT" and "CONFIDENTIAL" since they cover the page evenly without blocking readability.</p>
			<p><strong>Opacity control:</strong> Higher opacity makes the watermark more visible but can interfere with reading. Lower opacity is subtle and non-intrusive. 20-40% opacity is usually the sweet spot for readability with clear marking.</p>`
		},
		examples: [
			{
				label: 'Add CONFIDENTIAL banner',
				code: 'Original: 25-page report PDF\nWatermark: "CONFIDENTIAL" diagonal, red, 30% opacity\nResult: Every page marked as confidential',
				isValid: true
			},
			{
				label: 'Brand with company logo',
				code: 'Original: Presentation PDF\nWatermark: Company logo, bottom-right, 15% opacity\nResult: Professionally branded document',
				isValid: true
			},
			{
				label: 'Add copyright notice',
				code: 'Original: Portfolio PDF\nWatermark: "© 2025 Your Name" centered, 25% opacity\nResult: Copyrighted portfolio pages',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I remove a watermark after applying it?',
				answer: '<p><strong>No.</strong> Watermarks are permanently embedded into the PDF. Always keep an unwatermarked original if you need a clean version later. Think of watermarking as a final step before distribution.</p>'
			},
			{
				question: 'Will the watermark cover or obscure my text?',
				answer: '<p>At proper opacity (20-40%), text watermarks are visible but don\'t prevent reading. For maximum readability, use diagonal placement and lower opacity. Preview before applying to check the balance.</p>'
			},
			{
				question: 'Can I watermark only specific pages?',
				answer: '<p>Currently, the tool applies watermarks to all pages. To watermark specific pages, use the PDF Splitter to extract those pages first, watermark them, then merge back if needed.</p>'
			},
			{
				question: 'What image formats work for image watermarks?',
				answer: '<p>PNG with transparency works best for logos. JPEG images can be used but will appear as solid rectangles. For best results, use a transparent PNG at a reasonable resolution.</p>'
			},
			{
				question: 'Can I customize the watermark font?',
				answer: '<p>Yes! You can set the text content, font size, color (HEX color picker), and opacity. The standard font set includes Helvetica, Times, and Courier in regular and bold weights.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Page Numbers', path: '/pdf/page-numbers', description: 'Add page numbers' },
			{ name: 'PDF Sign', path: '/pdf/sign', description: 'Add signatures to PDF' },
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Split before watermarking' },
			{ name: 'PDF Compressor', path: '/pdf/compress', description: 'Compress after watermarking' }
		],
		tips: [
			'Use 25-35% opacity for watermarks that don\'t interfere with reading',
			'Diagonal placement works best for status markers like DRAFT or CONFIDENTIAL',
			'Always keep an unwatermarked original for future editing',
			'Test watermark appearance on different page types (text-heavy vs image-heavy)'
		]
	},

	'page-numbers': {
		features: [
			'Add page numbers to all PDF pages',
			'Choose from 6 positions (top/bottom × left/center/right)',
			'Customizable font size and style',
			'Set starting page number',
			'Preview numbering before applying',
			'100% client-side processing'
		],
		useCases: [
			'Number pages in reports and proposals',
			'Add page numbers to scanned documents',
			'Prepare legal documents with proper numbering',
			'Number ebook pages for reference',
			'Add sequential numbering to merged PDFs'
		],
		concept: {
			title: 'PDF Page Numbering Explained',
			content: `<p><strong>Page numbering</strong> adds sequential numbers to each page of a PDF document. This makes documents easier to reference, navigate, and discuss—especially in legal, academic, and business contexts.</p>
			<p><strong>Position options:</strong> Page numbers can go in the header (top of page) or footer (bottom of page), aligned left, center, or right. Most formal documents use bottom-center. Legal documents often use bottom-right. Books may use alternating positions for left/right pages.</p>
			<p><strong>Starting number:</strong> You can start numbering from any number, not just 1. This is useful when combining documents (part 2 starts at page 51) or when the first few pages shouldn\'t be numbered (cover page, table of contents).</p>
			<p><strong>Font customization:</strong> Match the numbering style to your document\'s typography. Standard fonts (Helvetica, Times, Courier) ensure compatibility across all PDF readers.</p>`
		},
		examples: [
			{
				label: 'Number a business report',
				code: 'Original: 30-page report PDF\nNumbers: Bottom-center, Times 10pt\nResult: Professionally numbered report',
				isValid: true
			},
			{
				label: 'Number starting from page 5',
				code: 'Original: 20-page document (4 intro pages)\nNumbers: Bottom-right, start from 5\nResult: Content pages numbered 5-20',
				isValid: true
			},
			{
				label: 'Number merged chapters',
				code: 'Original: Merged PDF with 3 chapters\nNumbers: Bottom-center, Helvetica 9pt\nResult: Sequential numbering across all chapters',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I skip numbering on the first page?',
				answer: '<p>Yes! Set the starting page number to control which page gets "1". For example, if page 1 is a cover, start numbering from page 2 by setting start=2 and the first numbered page shows as 2—but you may want the cover as page 0 or title page.</p>'
			},
			{
				question: 'Will page numbers overlap with existing content?',
				answer: '<p>Page numbers are placed in the margins (top or bottom of the page). If your document has content very close to the edge, numbers may overlap. Choose a position that doesn\'t conflict with your layout.</p>'
			},
			{
				question: 'Can I change numbering style (Roman numerals, letters)?',
				answer: '<p>Currently, only Arabic numerals (1, 2, 3...) are supported. For Roman numerals or other formats, consider using a desktop PDF editor or formatting your document before exporting to PDF.</p>'
			},
			{
				question: 'What font size should I use?',
				answer: '<p><strong>9-10pt</strong> for body text that\'s 10-12pt. <strong>8pt</strong> for compact documents. <strong>11-12pt</strong> for presentations or when accessibility is a priority. Match the visual weight of your main text.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Watermark', path: '/pdf/watermark', description: 'Add text watermarks' },
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Combine PDFs before numbering' },
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Preview numbered pages' },
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Split after numbering' }
		],
		tips: [
			'Bottom-center is the most common and professional position',
			'Use 9-10pt font size for standard documents',
			'Set starting number to account for cover pages and tables of contents',
			'Preview first and last pages to verify numbering placement'
		]
	},

	'redact': {
		features: [
			'Permanently remove sensitive text and images',
			'Draw redaction rectangles on PDF pages',
			'Preview redactions before applying',
			'Irreversible removal—data cannot be recovered',
			'Navigate pages to redact multi-page documents',
			'100% client-side—secure local processing'
		],
		useCases: [
			'Hide personal information before sharing documents',
			'Redact financial data in public filings',
			'Remove names and addresses from legal documents',
			'Black out classified information in reports',
			'Anonymize data in research papers before publication'
		],
		concept: {
			title: 'PDF Redaction Explained',
			content: `<p><strong>PDF redaction</strong> permanently removes sensitive information from a document by drawing opaque black rectangles over the content and deleting the underlying data. Unlike simple drawing tools, redaction ensures the hidden content cannot be recovered.</p>
			<p><strong>Redaction vs. covering:</strong> Drawing a black box over text in a paint program doesn\'t truly redact—the text is still there underneath and can be recovered. True redaction deletes the underlying content so it\'s gone forever.</p>
			<p><strong>What to redact:</strong> Social security numbers, phone numbers, email addresses, home addresses, bank account details, medical records, classified information, trade secrets, and any personally identifiable information (PII).</p>
			<p><strong>Important:</strong> Redaction is <strong>permanent and irreversible</strong>. Always work on a copy of your document, not the original. Double-check all redactions before distributing the redacted version.</p>`
		},
		examples: [
			{
				label: 'Redact personal information',
				code: 'Original: Contract with SSNs and addresses\nRedact: Draw boxes over all SSNs and home addresses\nResult: Shareable contract with private data removed',
				isValid: true
			},
			{
				label: 'Anonymize research data',
				code: 'Original: Research paper with participant names\nRedact: Cover all participant identifiers\nResult: Anonymized paper ready for publication',
				isValid: true
			},
			{
				label: 'Protect financial details',
				code: 'Original: Bank statement\nRedact: Account numbers, balances, transaction details\nResult: Proof of account without exposing finances',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can redacted content be recovered?',
				answer: '<p><strong>No.</strong> Our redaction tool permanently removes the underlying text and image data. Unlike drawing a black box, true redaction deletes the content. Once redacted and saved, the information is gone forever.</p>'
			},
			{
				question: 'How do I know if my PDF is properly redacted?',
				answer: '<p>Try selecting text in the redacted area—if you can select it, it\'s not properly redacted. A correctly redacted PDF should have no selectable text in the redacted zones. Always verify before sharing.</p>'
			},
			{
				question: 'Can I undo redaction later?',
				answer: '<p><strong>No.</strong> Redaction is permanent. Always keep an unredacted original and only distribute the redacted copy. Think of redaction as the final, irreversible step before sharing sensitive documents.</p>'
			},
			{
				question: 'Should I redact or just blur sensitive info?',
				answer: '<p>For security-critical data (SSNs, bank details, medical records), always <strong>redact</strong>. Blur can sometimes be reversed. Redaction physically removes the data—it\'s the only truly secure method.</p>'
			},
			{
				question: 'Does redaction affect PDF file size?',
				answer: '<p>Minimally. Redaction may slightly reduce file size since content is removed, but the change is typically negligible. The primary purpose is privacy and security, not size reduction.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Preview PDF before redacting' },
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Extract pages to redact' },
			{ name: 'PDF Sign', path: '/pdf/sign', description: 'Sign after redacting sensitive data' },
			{ name: 'PDF Watermark', path: '/pdf/watermark', description: 'Add status after redaction' }
		],
		tips: [
			'Always work on a copy, never the original',
			'Double and triple check all redactions before sharing',
			'Try to select text in redacted zones to verify they\'re truly removed',
			'Consider redacting metadata (author, title) if it contains sensitive info'
		]
	},

	'compare': {
		features: [
			'Side-by-side PDF comparison view',
			'Pixel-level difference highlighting',
			'Navigate between difference areas',
			'Visual overlay of both PDFs',
			'Support for multi-page document comparison',
			'100% client-side comparison'
		],
		useCases: [
			'Compare contract versions to find changes',
			'Review document revisions before signing',
			'Verify PDF rendering between different export tools',
			'Check for unauthorized changes in legal documents',
			'Compare proposal versions from different dates'
		],
		concept: {
			title: 'PDF Comparison Explained',
			content: `<p><strong>PDF comparison</strong> identifies differences between two versions of a PDF document. This is essential for reviewing contract changes, verifying document revisions, and ensuring document integrity across versions.</p>
			<p><strong>How comparison works:</strong> Both PDFs are rendered to images page by page, then compared at the pixel level. Differences are highlighted so you can quickly spot what changed. This approach catches both text changes and formatting/layout changes.</p>
			<p><strong>What gets compared:</strong> Text content, font changes, image placement, formatting, spacing, margins—essentially everything visible on the page. The comparison doesn\'t detect hidden metadata changes (author, creation date) unless they affect the visual rendering.</p>
			<p><strong>Use cases:</strong> Legal teams comparing contract versions, editors reviewing document revisions, QA teams verifying PDF output, and anyone who needs to verify that only intended changes were made between document versions.</p>`
		},
		examples: [
			{
				label: 'Compare contract versions',
				code: 'Version 1: Draft contract from June\nVersion 2: Revised contract from July\nResult: All changes highlighted for review',
				isValid: true
			},
			{
				label: 'Verify no unauthorized changes',
				code: 'Version 1: Signed original\nVersion 2: Received copy\nComparison: Verify no text or layout changed',
				isValid: true
			},
			{
				label: 'Review design revision',
				code: 'Version 1: Design mockup v1\nVersion 2: Design mockup v2\nComparison: See all visual changes highlighted',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How accurate is the PDF comparison?',
				answer: '<p>Comparison is done at the pixel level after rendering both PDFs. It catches text, formatting, and layout changes. Very minor differences (sub-pixel shifts) may be flagged—this is normal and ensures nothing is missed.</p>'
			},
			{
				question: 'Can it compare PDFs with different page counts?',
				answer: '<p>Yes. Extra pages in either document are clearly shown as additions or deletions. Mismatched pages beyond the overlap are displayed as unmatched.</p>'
			},
			{
				question: 'Does it detect changes in metadata or invisible elements?',
				answer: '<p>No, only visual differences are detected. Changes to author, creation date, keywords, or other metadata that don\'t affect the visual appearance won\'t be flagged.</p>'
			},
			{
				question: 'What if the PDFs use different fonts that look the same?',
				answer: '<p>If the fonts render identically at the pixel level, they won\'t be flagged. If there are subtle rendering differences (kerning, line spacing), the comparison will highlight them.</p>'
			},
			{
				question: 'Is this suitable for legal document review?',
				answer: '<p>Yes, but always combine with human review. Pixel-level comparison is thorough but may flag intentional formatting changes. Use it as a tool to guide your review, not as the sole verification method.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Inspect individual PDFs' },
			{ name: 'PDF Splitter', path: '/pdf/split', description: 'Compare specific pages' },
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Combine compared versions' },
			{ name: 'Text Diff', path: '/text/diff', description: 'Compare plain text differences' }
		],
		tips: [
			'Use the same zoom level when comparing for accurate results',
			'Focus on highlighted areas first—those are the actual differences',
			'Compare page by page for large documents',
			'Keep the original version as a reference point'
		]
	},

	'sign': {
		features: [
			'Draw your signature directly on screen',
			'Upload a signature image (PNG recommended)',
			'Place signature on any PDF page',
			'Position and resize signature freely',
			'Preview signature placement before finalizing',
			'100% client-side—your signature stays local'
		],
		useCases: [
			'Digitally sign contracts and agreements',
			'Sign permission slips and forms without printing',
			'Add executive signatures to proposals',
			'Sign invoices and purchase orders',
			'Digitally approve documents remotely'
		],
		concept: {
			title: 'PDF Signature Explained',
			content: `<p><strong>PDF signing</strong> adds a visual signature image to your PDF document. This is a digital version of your handwritten signature—not to be confused with cryptographic digital signatures that provide authentication and integrity verification.</p>
			<p><strong>Visual signature vs. digital signature:</strong> Our tool adds a <strong>visual signature</strong> (an image of your handwriting) to a PDF. This doesn\'t provide legal non-repudiation or tamper-proofing like a cryptographic digital signature would. However, for most business and personal use, visual signatures are sufficient.</p>
			<p><strong>Creating your signature:</strong> You can draw it directly using your mouse, trackpad, or touch screen—or upload a scanned/photo of your physical signature. For best results, sign on white paper with a dark pen and scan at 300 DPI.</p>
			<p><strong>Placement:</strong> Drag the signature to the correct position on the page. Common placements include the signature line at the bottom of a letter, a contract page, or any designated signing area.</p>`
		},
		examples: [
			{
				label: 'Sign a contract',
				code: 'Original: 5-page contract with signature line\nSign: Draw signature, place on signature line\nResult: Signed contract PDF ready to return',
				isValid: true
			},
			{
				label: 'Upload scanned signature',
				code: 'Signature source: Scanned PNG at 300 DPI\nPlace on: Letterhead, bottom right\nResult: Professionally signed letter',
				isValid: true
			},
			{
				label: 'Sign permission slip',
				code: 'Original: School permission form PDF\nSign: Draw signature, place on parent signature line\nResult: Signed form ready to submit',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Is this legally binding?',
				answer: '<p>Visual signatures can be legally binding in many jurisdictions, but this tool provides <strong>visual signatures only</strong>—not cryptographic digital signatures. For legally sensitive documents, consider using a dedicated e-signature service that provides audit trails.</p>'
			},
			{
				question: 'Can I move or resize my signature after placing it?',
				answer: '<p>Yes! You can drag to reposition and use handles to resize before finalizing. Once you download the signed PDF, the signature becomes a permanent part of the document.</p>'
			},
			{
				question: 'What format should my uploaded signature image be?',
				answer: '<p><strong>PNG with transparency</strong> works best. Sign on a clean white background and remove the background for a clean signature overlay. JPEG is also supported but won\'t have transparency.</p>'
			},
			{
				question: 'Can I sign multiple pages at once?',
				answer: '<p>Currently, you sign one page at a time. Navigate to each page that needs a signature and place it individually. This gives you precise control over each signature placement.</p>'
			},
			{
				question: 'Is my signature secure?',
				answer: '<p>All processing happens in your browser. Your signature never leaves your device. However, the signed PDF can be shared, so be mindful of where you distribute signed documents.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Viewer', path: '/pdf/viewer', description: 'Preview before signing' },
			{ name: 'PDF Watermark', path: '/pdf/watermark', description: 'Add document status' },
			{ name: 'PDF Merge', path: '/pdf/merge', description: 'Combine signed documents' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize signature image' }
		],
		tips: [
			'Use a dark pen on white paper for the cleanest scanned signature',
			'Remove the background from your signature image for a professional look',
			'Preview the signed page before downloading to verify placement',
			'Keep your signature image file secure—anyone with it can "sign" documents'
		]
	},

	'images-to-pdf': {
		features: [
			'Convert multiple images to a single PDF',
			'Support for JPEG, PNG, WebP, and more',
			'Choose page size (A4, Letter, or custom)',
			'Portrait or landscape orientation',
			'Drag to reorder images before conversion',
			'100% client-side conversion'
		],
		useCases: [
			'Create PDF from scanned document photos',
			'Combine screenshots into a single PDF report',
			'Convert photo series into a shareable document',
			'Create a PDF portfolio from design mockups',
			'Turn whiteboard photos into meeting notes PDF'
		],
		concept: {
			title: 'Images to PDF Conversion',
			content: `<p><strong>Images to PDF conversion</strong> takes one or more image files and embeds them into a PDF document, one image per page. This is perfect for creating PDFs from scanned documents, photos, or screenshots.</p>
			<p><strong>How conversion works:</strong> Each image is embedded into a new PDF page at your chosen page size and orientation. Images are scaled to fit the page while maintaining their aspect ratio. The result is a clean, shareable PDF that preserves your images.</p>
			<p><strong>Page size selection:</strong> A4 is standard outside North America. Letter is standard in the US and Canada. Custom lets you specify exact dimensions. Choose based on your intended use and audience.</p>
			<p><strong>Image handling:</strong> Images are embedded at their original resolution (up to reasonable limits). Large images will be fitted to the page. For best quality, use images with sufficient resolution (150-300 DPI at the target page size).</p>`
		},
		examples: [
			{
				label: 'Create PDF from scanned pages',
				code: 'Input: scan-01.jpg through scan-10.jpg\nPage size: A4, portrait\nResult: 10-page PDF document',
				isValid: true
			},
			{
				label: 'Combine screenshots into report',
				code: 'Input: screenshot-1.png, screenshot-2.png\nPage size: Letter, landscape\nResult: 2-page PDF report',
				isValid: true
			},
			{
				label: 'Create photo portfolio',
				code: 'Input: photo-01.jpg through photo-20.jpg\nPage size: Custom 8×10 in., portrait\nResult: 20-page photo portfolio PDF',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What image formats are supported?',
				answer: '<p>JPEG, PNG, WebP, BMP, and GIF images are supported. PNG is recommended for graphics and screenshots. JPEG works best for photos. All common image formats from digital cameras and phones work fine.</p>'
			},
			{
				question: 'Will my images be downscaled or lose quality?',
				answer: '<p>Images are scaled to fit the chosen page size while maintaining aspect ratio. Very large images (4000+ px) may be downsampled. For best quality, use images at 150-300 DPI relative to your chosen page size.</p>'
			},
			{
				question: 'Can I add text or captions to the pages?',
				answer: '<p>No, this tool converts images directly to PDF pages without adding text. For adding captions, use an image editor first or use a PDF editor to add text after conversion.</p>'
			},
			{
				question: 'How many images can I convert at once?',
				answer: '<p>No hard limit, but memory usage increases with image count and size. For very large sets (50+ high-resolution images), conversion may take longer. Process in batches if needed.</p>'
			},
			{
				question: 'Can I change the image order before converting?',
				answer: '<p>Yes! Drag and drop images in the list to reorder them. The PDF pages will follow the list order from top to bottom.</p>'
			},
			{
				question: 'What happens to transparent PNGs?',
				answer: '<p>Transparent areas in PNGs are rendered as white in the PDF. PDF pages always have a white background. If you need transparency, consider PNG format instead of PDF.</p>'
			}
		],
		relatedTools: [
			{ name: 'PDF Merger', path: '/pdf/merge', description: 'Merge PDFs after creation' },
			{ name: 'PDF Compressor', path: '/pdf/compress', description: 'Compress the created PDF' },
			{ name: 'Image Compressor', path: '/image/compressor', description: 'Compress images before conversion' },
			{ name: 'Image Resizer', path: '/image/resize', description: 'Resize images to fit pages' }
		],
		tips: [
			'Use images at 150-300 DPI at your target page size for best quality',
			'Reorder images so they appear in the correct sequence',
			'Choose A4 for international documents, Letter for US documents',
			'Compress large images before conversion for a smaller resulting PDF'
		]
	}
};

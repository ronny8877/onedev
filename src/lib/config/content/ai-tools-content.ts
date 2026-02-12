interface AIToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const aiToolsContent: Record<string, AIToolContent> = {
	'token-counter': {
		features: [
			'Accurate token count for GPT-4, Claude, and Gemini',
			'Real-time character and word count',
			'Cost estimation based on current API pricing',
			'Support for multiple tokenizer models (cl100k_base, p50k_base)',
			'Whitespace and special character handling',
			'Batch processing capability'
		],
		useCases: [
			'Estimate API costs before sending requests',
			'Ensure prompts fit within context windows',
			'Compare token usage across different models',
			'Analyze text density (tokens per word)',
			'Budget for large-scale LLM operations'
		],
		concept: {
			title: 'Tokens vs. Words',
			content: `<p>Large Language Models (LLMs) don't read text by words or characters, but by <strong>tokens</strong>. A token can be a word, part of a word, or even a space.</p>
			
			<p><strong>Rule of Thumb:</strong> 1,000 tokens is approximately 750 words. In English, a token is roughly 4 characters or 0.75 words.</p>
			
			<p><strong>Tokenizer Models:</strong></p>
			<ul>
				<li><strong>cl100k_base:</strong> Used by GPT-4, GPT-3.5-Turbo, and <code>text-embedding-ada-002</code>.</li>
				<li><strong>p50k_base:</strong> Used by older Codex models.</li>
				<li><strong>r50k_base:</strong> Used by GPT-3.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Short Phrase',
				code: 'Hello, world!',
				isValid: true
			},
			{
				label: 'Complex Word',
				code: 'Indivisibility',
				isValid: true
			},
			{
				label: 'Code Snippet',
				code: 'print("Hello")',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why do token counts vary between models?',
				answer: 'Different models use different vocabularies (tokenizers). GPT-4 uses `cl100k_base`, which is more efficient than deeper, older tokenizers, often resulting in fewer tokens for the same text.'
			},
			{
				question: 'Does whitespace count as tokens?',
				answer: 'Yes, spaces, tabs, and newlines are all tokenized. In many tokenizers, a leading space is often merged with the following word.'
			},
			{
				question: 'How accurate is this counter?',
				answer: 'This tool uses the exact same tokenizer libraries (like `tiktoken`) used by OpenAI, ensuring near 100% accuracy for supported models.'
			}
		],
		relatedTools: [
			{ name: 'Cost Estimator', path: '/ai/cost-estimator', description: 'Calculate API costs' },
			{ name: 'Context Estimator', path: '/ai/context-estimator', description: 'Check context limits' },
			{ name: 'Token Visualizer', path: '/ai/token-visualizer', description: 'See token boundaries' }
		],
		tips: [
			'To save costs, remove unnecessary repeated whitespace or verbose descriptions from your prompts.',
			'Code usually consumes more tokens than prose because of special characters and indentation.'
		]
	},
	'token-visualizer': {
		features: [
			'Color-coded token visualization',
			'Hover to see Token ID',
			'Support for GPT-4 and legacy tokenizers',
			'Toggle special tokens',
			'Interactive exploration of token boundaries',
			'Copy token list as JSON'
		],
		useCases: [
			'Debug why a specific word is split into multiple tokens',
			'Understand how model pricing works granularly',
			'Optimize prompts by choosing single-token synonyms',
			'Educational demonstrations of NLP concepts',
			'Visualize whitespace handling'
		],
		concept: {
			title: 'Tokenization Visualized',
			content: `<p><strong>Tokenization</strong> is the process of breaking text into smaller units (tokens) that a machine learning model can process. </p>
			
			<p><strong>Common Patterns:</strong></p>
			<ul>
				<li><strong>Common words:</strong> Usually a single token (e.g., "apple").</li>
				<li><strong>Complex words:</strong> Split into sub-words (e.g., "smart" + "phone").</li>
				<li><strong>Spaces:</strong> Often attached to the start of a word in newer tokenizers (e.g., " word").</li>
			</ul>
			<p>This visualizer highlights adjacent tokens in alternating colors so you can see exactly where the splits occur.</p>`
		},
		examples: [
			{
				label: 'CamelCase',
				code: 'tokenVisualizerTool',
				isValid: true
			},
			{
				label: 'Email Address',
				code: 'user@example.com',
				isValid: true
			},
			{
				label: 'Math Equation',
				code: '2 + 2 = 4',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is a Token ID?',
				answer: 'Every unique token in the model\'s vocabulary is assigned a unique integer ID. For example, "The" might be ID 464.'
			},
			{
				question: 'Why are some short words split?',
				answer: 'If a word isn\'t in the vocabulary (or is rare), it falls back to sub-tokens or even bytes. This is common for names, typos, or technical jargon.'
			},
			{
				question: 'Does case matter?',
				answer: 'Yes! "Apple" and "apple" are completely different tokens with different IDs.'
			}
		],
		relatedTools: [
			{ name: 'Token Counter', path: '/ai/token-counter', description: 'Count total tokens' },
			{ name: 'Prompt Trimmer', path: '/ai/prompt-trimmer', description: 'Shorten text' },
			{ name: 'String Compare', path: '/text/string-compare', description: 'Compare texts' }
		],
		tips: [
			'Hover over any colored block to see the raw string value and its integer ID.',
			'Notice how spaces are handled—sometimes they are their own token, sometimes part of the next word.'
		]
	},
	'context-estimator': {
		features: [
			'Calculate context usage for System, User, and Assistant messages',
			'Presets for popular models (GPT-4-32k, Claude 2, etc.)',
			'Visual progress bar of context window usage',
			'Warning indicators for overflow',
			'Dynamic remaining token calculation',
			'Multi-message support'
		],
		useCases: [
			'Plan chat history retention strategies',
			'Ensure RAG (Retrieval Augmented Generation) context fits',
			'Debug "context length exceeded" errors',
			'Optimize system prompts for size',
			'Compare capacity of different models'
		],
		concept: {
			title: 'Context Window',
			content: `<p>The <strong>Context Window</strong> is the maximum amount of text (in tokens) the model can consider at one time. This includes:</p>
			<ol>
				<li><strong>System Instructions:</strong> The base behavior rules.</li>
				<li><strong>Conversation History:</strong> Past messages.</li>
				<li><strong>Current Input:</strong> Your new question.</li>
				<li><strong>Target Output:</strong> The space reserved for the answer.</li>
			</ol>
			<p>If you exceed this window, the model "forgets" the earliest parts of the conversation or simply errors out.</p>`
		},
		examples: [
			{
				label: 'Standard Chat',
				code: 'System: You are a helpful assistant.\nUser: Hello!',
				isValid: true
			},
			{
				label: 'RAG Context',
				code: 'Context: [Long document content...]\nQuestion: Summarize this.',
				isValid: true
			},
			{
				label: 'Few-Shot Prompting',
				code: 'User: A -> B\nUser: C -> D\nUser: E -> ?',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What happens if I overflow context?',
				answer: 'The API will reject your request with a 400 error. You must truncate old messages or summarize conversation history to free up space.'
			},
			{
				question: 'Does output count towards the limit?',
				answer: 'Yes! The total token count (Input + Output) must stay within the model\'s limit. Usually, you specify a `max_tokens` for output, which reserves space from the total window.'
			},
			{
				question: 'What is 128k context?',
				answer: 'It means the model can process ~128,000 tokens (approx. 100,000 words or 300 pages of text) in a single request.'
			}
		],
		relatedTools: [
			{ name: 'Prompt Trimmer', path: '/ai/prompt-trimmer', description: 'Fit text into context' },
			{ name: 'Token Counter', path: '/ai/token-counter', description: 'Count tokens' },
			{ name: 'Embedding Estimator', path: '/ai/embedding-estimator', description: 'Vector storage' }
		],
		tips: [
			'Always leave a buffer (e.g., 20% of context) for the model\'s response.',
			'Use the "Prompt Trimmer" tool to automatically shorten content if you are close to the limit.'
		]
	},
	'prompt-trimmer': {
		features: [
			'Trim text to exact token limits',
			'Sentence-aware trimming (keeps sentences intact)',
			'Paragraph-aware trimming',
			'Preserve start or end of text',
			'Real-time before/after token comparison',
			'One-click copy of trimmed text'
		],
		useCases: [
			'Fit large documents into a prompt',
			'Create snippets for search results',
			'Summarize logs without cutting off mid-word',
			'Prepare few-shot examples',
			'Cleaning dataset entries'
		],
		concept: {
			title: 'Smart Truncation',
			content: `<p>Truncating text blindly by character count often breaks words or sentences, leading to confusing inputs for AI models.</p>
			
			<p><strong>Strategies:</strong></p>
			<ul>
				<li><strong>Token-based:</strong> Cuts exactly at the token limit (most space-efficient).</li>
				<li><strong>Sentence-aware:</strong> Finds the last full sentence punctuation within the limit (most readable).</li>
				<li><strong>Preserve Start/End:</strong> sometimes the most important context is at the end (chat history) or the start (instructions).</li>
			</ul>`
		},
		examples: [
			{
				label: 'Trimming History',
				code: '...[Old messages]... \nMost recent message.',
				isValid: true
			},
			{
				label: 'Abstract Generation',
				code: 'First 500 tokens of the paper...',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Will this cut off in the middle of a word?',
				answer: 'If you choose "Exact Token" mode, yes (it cuts at the token boundary). If you choose "Sentence Aware", it will back up to the last period/punctuation mark to ensure complete thoughts.'
			},
			{
				question: 'Why "Preserve End" for chat?',
				answer: 'In conversations, the most recent messages are usually the most relevant. You often want to drop the oldest messages first (Preserve End).'
			},
			{
				question: 'Is it reversible?',
				answer: 'No, trimming is destructive. Always keep a copy of your original text.'
			}
		],
		relatedTools: [
			{ name: 'Context Estimator', path: '/ai/context-estimator', description: 'Check limits' },
			{ name: 'Token Counter', path: '/ai/token-counter', description: 'Count tokens' },
			{ name: 'Lorem Ipsum', path: '/text/lorem-ipsum', description: 'Generate placeholder text' }
		],
		tips: [
			'Use "Sentence Aware" mode for RAG contexts to prevent providing partial, confusing facts to the LLM.',
			'Use "Exact Token" mode when you need to squeeze in absolutely every possible bit of information.'
		]
	},
	'embedding-estimator': {
		features: [
			'Estimate storage size for vector databases',
			'Support for OpenAI (ada-002) and open-source models',
			'Calculate dimensionality (1536, 768, etc.)',
			'Estimate indexing costs',
			'Batch size calculation',
			'Memory usage Estimator (RAM vs Disk)'
		],
		useCases: [
			'Architecting RAG systems',
			'Budgeting for Pinecone/Milvus/Weaviate',
			'Choosing an embedding model',
			'Planning server RAM requirements',
			'Estimating migration time'
		],
		concept: {
			title: 'Embeddings & Vectors',
			content: `<p><strong>Embeddings</strong> are numerical representations (vectors) of text. They capture semantic meaning, allowing computers to "search by meaning" rather than just keywords.</p>
			
			<p><strong>Storage Math:</strong></p>
			<ul>
				<li>Usually <code>float32</code> (4 bytes per number).</li>
				<li>OpenAI <code>ada-002</code> has 1536 dimensions.</li>
				<li>Size per vector = 1536 * 4 bytes = <strong>~6 KB</strong>.</li>
				<li>1 Million vectors ≈ 6 GB of RAM/Disk (plus indexing overhead).</li>
			</ul>`
		},
		examples: [
			{
				label: 'OpenAI Ada-002',
				code: 'Dimensions: 1536\nType: Float32\nSize: ~6KB / vector',
				isValid: true
			},
			{
				label: 'MiniLM-L6',
				code: 'Dimensions: 384\nType: Float32\nSize: ~1.5KB / vector',
				isValid: true
			},
			{
				label: 'Million Scale',
				code: '1M docs * 1536 dims * 4 bytes = ~6GB raw data',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Does text length affect vector size?',
				answer: 'No! Whether you embed a single word or a paragraph, the resulting vector always has the same number of dimensions (e.g., 1536). However, the *token cost* to generate it depends on text length.'
			},
			{
				question: 'Float32 vs Int8?',
				answer: 'Quantization (using Int8) reduces size by 4x but sacrifices some precision/accuracy. It\'s great for massive datasets.'
			},
			{
				question: 'What is indexing overhead?',
				answer: 'To search fast (ANN), databases build extra structures (HNSW graphs, IVO lists). This typically adds 10-50% more RAM usage usage on top of raw vector data.'
			}
		],
		relatedTools: [
			{ name: 'Token Counter', path: '/ai/token-counter', description: 'Estimate generation cost' },
			{ name: 'Cost Estimator', path: '/ai/cost-estimator', description: 'API pricing' },
			{ name: 'Data Size Converter', path: '/convert/data-size', description: 'Convert units' }
		],
		tips: [
			'For local development, smaller models like `all-MiniLM-L6-v2` (384 dims) are much faster and lighter.',
			'Always calculate RAM needs before deployment—vector DBs love RAM.'
		]
	},
	'cost-estimator': {
		features: [
			'Up-to-date pricing for major LLM providers',
			'Separate Input vs Output token calculation',
			'Compare models side-by-side (GPT-4 vs Claude 3)',
			'Batch volume estimation (1k, 1M requests)',
			'Fine-tuning cost estimation',
			'Custom pricing entry'
		],
		useCases: [
			'Pitching AI features to stakeholders',
			'Comparing provider costs',
			'Estimating monthly SaaS bills',
			'Deciding between "smart" vs "fast" models',
			'Budgeting for batch processing jobs'
		],
		concept: {
			title: 'LLM Pricing Models',
			content: `<p>LLM pricing is almost always based on <strong>per 1 million tokens</strong> (1M).</p>
			
			<p><strong>Key Dynamics:</strong></p>
			<ul>
				<li><strong>Input is cheaper:</strong> Processing prompts usually costs 1/3rd to 1/2 of generating output.</li>
				<li><strong>Intelligence Tax:</strong> Smarter models (GPT-4) can be 20x to 50x more expensive than efficient models (GPT-3.5/Haiku).</li>
				<li><strong>Vision/Images:</strong> Often billed as a fixed token amount or by resolution.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Simple Chat',
				code: 'Input: 500 tokens\nOutput: 200 tokens\nCost: ~$0.00X',
				isValid: true
			},
			{
				label: 'RAG Query',
				code: 'Input: 4000 tokens (Context)\nOutput: 500 tokens\nCost: Higher input weight',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Do prices change often?',
				answer: 'Yes, it is a race to the bottom. Providers frequently cut prices. This calculator aims to use the latest published public rates.'
			},
			{
				question: 'What is a "Completion"?',
				answer: 'Completion refers to the text *generated* by the AI (Output). Prompt refers to the text *sent* to the AI (Input).'
			},
			{
				question: 'How to reduce costs?',
				answer: '1. Use smaller models for simple tasks. 2. Shorten prompts (remove examples). 3. Cache common responses. 4. Use batch APIs (often 50% discount).'
			}
		],
		relatedTools: [
			{ name: 'Token Counter', path: '/ai/token-counter', description: 'Count your usage' },
			{ name: 'Context Estimator', path: '/ai/context-estimator', description: 'Plan capacity' },
			{ name: 'Embedding Estimator', path: '/ai/embedding-estimator', description: 'Storage costs' }
		],
		tips: [
			'Always separate your Input (Prompt) and Output (Generation) estimates for accuracy.',
			'Don\'t forget to account for re-tries and errors in your volume estimates.'
		]
	}
};

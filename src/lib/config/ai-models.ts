// AI Models Configuration
// Centralized configuration for all AI model data
// Last updated: January 2026
//
// ⚠️ UPDATE THIS FILE when model pricing changes
// Check provider websites for current rates:
// - OpenAI: https://openai.com/api/pricing/
// - Anthropic: https://www.anthropic.com/pricing
// - Google: https://ai.google.dev/pricing

export const PRICING_LAST_UPDATED = '2026-01-20';

// ============================================================
// CHAT/COMPLETION MODELS
// ============================================================

export interface ChatModel {
	name: string;
	displayName: string;
	provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'deepseek' | 'x' | 'moonshot' | 'mistral' | 'cohere' | 'alibaba' | 'custom';
	contextWindow: number;
	maxOutput: number;
	inputPer1M: number; // USD per 1M input tokens
	outputPer1M: number; // USD per 1M output tokens
	cachedInputPer1M?: number; // Cached pricing if available
	multimodal?: boolean; // Multimodal support
	releaseDate?: string; // Release date (YYYY-MM)
	strengths?: string; // Strengths/use cases
	speedCategory?: 'fast' | 'balanced' | 'slow'; // Speed category
	reasoning?: boolean; // Reasoning capability
	apiAvailability?: boolean; // API availability
	notes?: string;
}

export const CHAT_MODELS: ChatModel[] = [
	// ============ OpenAI ============
	{
		name: 'o1',
		displayName: 'o1',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 15.00,
		outputPer1M: 60.00,
		cachedInputPer1M: 7.50,
		multimodal: true,
		releaseDate: '2024-12',
		strengths: 'Complex reasoning, math, coding',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		notes: 'Reasoning model'
	},
	{
		name: 'o3-mini',
		displayName: 'o3 Mini',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 1.10,
		outputPer1M: 4.40,
		cachedInputPer1M: 0.55,
		multimodal: false,
		releaseDate: '2025-01',
		strengths: 'Fast reasoning, coding tasks, logic',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Reasoning model'
	},
	{
		name: 'gpt-4o',
		displayName: 'GPT-4o',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 16384,
		inputPer1M: 2.50,
		outputPer1M: 10.00,
		cachedInputPer1M: 1.25,
		multimodal: true,
		releaseDate: '2024-05',
		strengths: 'General purpose, multimodal analysis, tool use',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'gpt-4o-mini',
		displayName: 'GPT-4o Mini',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 16384,
		inputPer1M: 0.15,
		outputPer1M: 0.60,
		cachedInputPer1M: 0.075,
		multimodal: true,
		releaseDate: '2024-07',
		strengths: 'High volume simple tasks, classification',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ Anthropic ============
	{
		name: 'claude-3-5-sonnet-20241022',
		displayName: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 8192,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		cachedInputPer1M: 0.30,
		multimodal: true,
		releaseDate: '2024-10',
		strengths: 'Coding, nuanced writing, computer use',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'claude-3-5-haiku-20241022',
		displayName: 'Claude 3.5 Haiku',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 8192,
		inputPer1M: 0.80,
		outputPer1M: 4.00,
		cachedInputPer1M: 0.08,
		multimodal: true,
		releaseDate: '2024-10',
		strengths: 'Fast analysis, text extraction',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'claude-3-opus-20240229',
		displayName: 'Claude 3 Opus',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 15.00,
		outputPer1M: 75.00,
		multimodal: true,
		releaseDate: '2024-02',
		strengths: 'Deep domain expertise, creative writing',
		speedCategory: 'slow',
		reasoning: false,
		apiAvailability: true
	},

	// ============ Google ============
	{
		name: 'gemini-1.5-pro',
		displayName: 'Gemini 1.5 Pro',
		provider: 'google',
		contextWindow: 2000000,
		maxOutput: 8192,
		inputPer1M: 1.25,
		outputPer1M: 5.00,
		cachedInputPer1M: 0.31,
		multimodal: true,
		releaseDate: '2024-05',
		strengths: 'Massive context (codebases, long videos)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: '2x pricing for prompts >128K tokens'
	},
	{
		name: 'gemini-1.5-flash',
		displayName: 'Gemini 1.5 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.075,
		outputPer1M: 0.30,
		cachedInputPer1M: 0.019,
		multimodal: true,
		releaseDate: '2024-05',
		strengths: 'High-speed multimodal extraction',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'gemini-2.0-flash',
		displayName: 'Gemini 2.0 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.10,
		outputPer1M: 0.40,
		cachedInputPer1M: 0.025,
		multimodal: true,
		releaseDate: '2024-12',
		strengths: 'High-speed multimodal, improved logic',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ DeepSeek ============
	{
		name: 'deepseek-chat',
		displayName: 'DeepSeek V3 (Chat)',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 8000,
		inputPer1M: 0.28,
		outputPer1M: 0.42,
		cachedInputPer1M: 0.028,
		multimodal: false,
		releaseDate: '2024-12',
		strengths: 'Coding, general assistant tasks, very cheap',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'deepseek-reasoner',
		displayName: 'DeepSeek R1 (Reasoner)',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 64000,
		inputPer1M: 0.28,
		outputPer1M: 0.42,
		cachedInputPer1M: 0.028,
		multimodal: false,
		releaseDate: '2025-01',
		strengths: 'Math, complex coding, step-by-step logic',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true
	},

	// ============ Meta ============
	{
		name: 'llama-3.3-70b',
		displayName: 'Llama 3.3 70B',
		provider: 'meta',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.13,
		outputPer1M: 0.40,
		multimodal: false,
		releaseDate: '2024-12',
		strengths: 'Open weights, high performance text tasks',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Pricing based on typical Groq/Together AI rates'
	},
	{
		name: 'llama-3.1-405b',
		displayName: 'Llama 3.1 405B',
		provider: 'meta',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.90,
		outputPer1M: 0.90,
		multimodal: false,
		releaseDate: '2024-07',
		strengths: 'Complex reasoning, synthetic data generation',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'llama-3.2-90b-vision',
		displayName: 'Llama 3.2 90B Vision',
		provider: 'meta',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.20,
		outputPer1M: 0.20,
		multimodal: true,
		releaseDate: '2024-09',
		strengths: 'Open vision model, image reasoning',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ xAI ============
	{
		name: 'grok-2',
		displayName: 'Grok 2',
		provider: 'x',
		contextWindow: 131072,
		maxOutput: 4096,
		inputPer1M: 2.00,
		outputPer1M: 10.00,
		multimodal: true,
		releaseDate: '2024-08',
		strengths: 'Humor, coding, real-time web knowledge',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'grok-2-mini',
		displayName: 'Grok 2 Mini',
		provider: 'x',
		contextWindow: 131072,
		maxOutput: 4096,
		inputPer1M: 0.20,
		outputPer1M: 1.00,
		multimodal: true,
		releaseDate: '2024-08',
		strengths: 'Fast conversations, code assistance',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ Mistral ============
	{
		name: 'mistral-large-2411',
		displayName: 'Mistral Large 2',
		provider: 'mistral',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 2.00,
		outputPer1M: 6.00,
		multimodal: false,
		releaseDate: '2024-11',
		strengths: 'Multilingual support, strict system prompts',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'pixtral-large',
		displayName: 'Pixtral Large',
		provider: 'mistral',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 2.00,
		outputPer1M: 6.00,
		multimodal: true,
		releaseDate: '2024-11',
		strengths: 'Chart/graph understanding, image OCR',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'ministral-8b',
		displayName: 'Ministral 8B',
		provider: 'mistral',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.10,
		outputPer1M: 0.10,
		multimodal: false,
		releaseDate: '2024-10',
		strengths: 'Edge computing, low latency workflows',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ Cohere ============
	{
		name: 'command-r-plus',
		displayName: 'Command R+',
		provider: 'cohere',
		contextWindow: 128000,
		maxOutput: 4000,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		multimodal: false,
		releaseDate: '2024-04',
		strengths: 'RAG, citations, multilingual enterprise usage',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'command-r',
		displayName: 'Command R',
		provider: 'cohere',
		contextWindow: 128000,
		maxOutput: 4000,
		inputPer1M: 0.50,
		outputPer1M: 1.50,
		multimodal: false,
		releaseDate: '2024-03',
		strengths: 'Fast RAG, data extraction, tool use',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},

	// ============ Alibaba (Qwen) ============
	{
		name: 'qwen-max',
		displayName: 'Qwen Max',
		provider: 'alibaba',
		contextWindow: 32768,
		maxOutput: 8192,
		inputPer1M: 1.60,
		outputPer1M: 6.40,
		multimodal: false,
		releaseDate: '2024-12',
		strengths: 'High performance general tasks, multilingual',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'qwen2.5-72b-instruct',
		displayName: 'Qwen 2.5 72B',
		provider: 'alibaba',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.40,
		outputPer1M: 1.20,
		multimodal: false,
		releaseDate: '2024-09',
		strengths: 'Open weights, coding, mathematics',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	}
];

// ============================================================
// EMBEDDING MODELS
// ============================================================

export interface EmbeddingModel {
	name: string;
	displayName: string;
	provider: 'openai' | 'cohere' | 'google';
	dimensions: number;
	maxTokens: number;
	pricePerMillion: number; // USD per 1M tokens
	notes?: string;
}

export const EMBEDDING_MODELS: EmbeddingModel[] = [
	{
		name: 'text-embedding-3-large',
		displayName: 'text-embedding-3-large',
		provider: 'openai',
		dimensions: 3072,
		maxTokens: 8191,
		pricePerMillion: 0.13
	},
	{
		name: 'text-embedding-3-small',
		displayName: 'text-embedding-3-small',
		provider: 'openai',
		dimensions: 1536,
		maxTokens: 8191,
		pricePerMillion: 0.02
	},
	{
		name: 'text-embedding-ada-002',
		displayName: 'text-embedding-ada-002',
		provider: 'openai',
		dimensions: 1536,
		maxTokens: 8191,
		pricePerMillion: 0.10
	},
	{
		name: 'embed-english-v3',
		displayName: 'Cohere Embed v3',
		provider: 'cohere',
		dimensions: 1024,
		maxTokens: 512,
		pricePerMillion: 0.10
	},
	{
		name: 'text-embedding-004',
		displayName: 'Gemini Text Embedding',
		provider: 'google',
		dimensions: 768,
		maxTokens: 2048,
		pricePerMillion: 0.025
	}
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getChatModel(name: string): ChatModel | undefined {
	return CHAT_MODELS.find((m) => m.name === name);
}

export function getEmbeddingModel(name: string): EmbeddingModel | undefined {
	return EMBEDDING_MODELS.find((m) => m.name === name);
}

export function calculateChatCost(
	modelName: string,
	inputTokens: number,
	outputTokens: number
): { inputCost: number; outputCost: number; totalCost: number } | null {
	const model = getChatModel(modelName);
	if (!model) return null;

	const inputCost = (inputTokens / 1_000_000) * model.inputPer1M;
	const outputCost = (outputTokens / 1_000_000) * model.outputPer1M;

	return {
		inputCost,
		outputCost,
		totalCost: inputCost + outputCost
	};
}

export function calculateEmbeddingCost(modelName: string, tokens: number): number | null {
	const model = getEmbeddingModel(modelName);
	if (!model) return null;
	return (tokens / 1_000_000) * model.pricePerMillion;
}

// Estimate vector size in bytes (float32 = 4 bytes per dimension)
export function estimateVectorBytes(modelName: string): number | null {
	const model = getEmbeddingModel(modelName);
	if (!model) return null;
	return model.dimensions * 4;
}

// Format currency with appropriate precision
export function formatCurrency(amount: number, decimals: number = 6): string {
	if (amount === 0) return '$0.00';
	if (amount < 0.000001) return '< $0.000001';
	if (amount < 0.01) return `$${amount.toFixed(decimals)}`;
	if (amount < 1) return `$${amount.toFixed(4)}`;
	return `$${amount.toFixed(2)}`;
}

// Format large numbers with commas or K/M/B notation for very large numbers
export function formatNumber(num: number): string {
	if (num >= 1_000_000_000) {
		return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
	}
	if (num >= 1_000_000) {
		return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (num >= 10_000) {
		return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return num.toLocaleString();
}

// Get provider badge color class
export function getProviderColor(provider: string): string {
	switch (provider) {
		case 'openai':
			return 'badge-success';
		case 'anthropic':
			return 'badge-warning';
		case 'google':
			return 'badge-info';
		case 'cohere':
			return 'badge-secondary';
		case 'meta':
			return 'badge-primary';
		case 'deepseek':
			return 'badge-accent';
		case 'x':
			return 'badge-neutral bg-black text-white';
		case 'moonshot':
			return 'badge-info bg-indigo-500 text-white border-none';
		case 'mistral':
			return 'badge-error'; // Or 'badge-warning text-white'
		case 'alibaba':
			return 'badge-error bg-orange-500 text-white border-none';
		case 'custom':
			return 'badge-ghost border border-base-content/20';
		default:
			return 'badge-ghost';
	}
}

// Get context window usage as percentage
export function getContextUsage(tokens: number, modelName: string): number {
	const model = getChatModel(modelName);
	if (!model) return 0;
	return Math.min(100, (tokens / model.contextWindow) * 100);
}

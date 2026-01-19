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
	provider: 'openai' | 'anthropic' | 'google';
	contextWindow: number;
	maxOutput: number;
	inputPer1M: number; // USD per 1M input tokens
	outputPer1M: number; // USD per 1M output tokens
	notes?: string;
}

export const CHAT_MODELS: ChatModel[] = [
	// ============ OpenAI ============
	{
		name: 'gpt-4o',
		displayName: 'GPT-4o',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 16384,
		inputPer1M: 2.50,
		outputPer1M: 10.00
	},
	{
		name: 'gpt-4o-mini',
		displayName: 'GPT-4o Mini',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 16384,
		inputPer1M: 0.15,
		outputPer1M: 0.60
	},
	{
		name: 'gpt-4-turbo',
		displayName: 'GPT-4 Turbo',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 4096,
		inputPer1M: 10.00,
		outputPer1M: 30.00
	},
	{
		name: 'gpt-4',
		displayName: 'GPT-4',
		provider: 'openai',
		contextWindow: 8192,
		maxOutput: 4096,
		inputPer1M: 30.00,
		outputPer1M: 60.00
	},
	{
		name: 'gpt-3.5-turbo',
		displayName: 'GPT-3.5 Turbo',
		provider: 'openai',
		contextWindow: 16385,
		maxOutput: 4096,
		inputPer1M: 0.50,
		outputPer1M: 1.50
	},
	{
		name: 'o1',
		displayName: 'o1',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 15.00,
		outputPer1M: 60.00
	},
	{
		name: 'o1-mini',
		displayName: 'o1 Mini',
		provider: 'openai',
		contextWindow: 128000,
		maxOutput: 65536,
		inputPer1M: 3.00,
		outputPer1M: 12.00
	},

	// ============ Anthropic ============
	{
		name: 'claude-3.5-sonnet',
		displayName: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 8192,
		inputPer1M: 3.00,
		outputPer1M: 15.00
	},
	{
		name: 'claude-3-opus',
		displayName: 'Claude 3 Opus',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 15.00,
		outputPer1M: 75.00
	},
	{
		name: 'claude-3-sonnet',
		displayName: 'Claude 3 Sonnet',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 3.00,
		outputPer1M: 15.00
	},
	{
		name: 'claude-3-haiku',
		displayName: 'Claude 3 Haiku',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 0.25,
		outputPer1M: 1.25
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
		notes: 'Up to 128K context'
	},
	{
		name: 'gemini-1.5-flash',
		displayName: 'Gemini 1.5 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.075,
		outputPer1M: 0.30,
		notes: 'Up to 128K context'
	},
	{
		name: 'gemini-2.0-flash',
		displayName: 'Gemini 2.0 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.10,
		outputPer1M: 0.40
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

// Format large numbers with commas
export function formatNumber(num: number): string {
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

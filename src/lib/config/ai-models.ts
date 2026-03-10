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
	provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'deepseek' | 'x' | 'moonshot' | 'custom';
	contextWindow: number;
	maxOutput: number;
	inputPer1M: number; // USD per 1M input tokens
	outputPer1M: number; // USD per 1M output tokens
	notes?: string;
}

export const CHAT_MODELS: ChatModel[] = [
	// ============ OpenAI ============
	{
		name: 'gpt-5.4',
		displayName: 'GPT-5.4',
		provider: 'openai',
		contextWindow: 1050000,
		maxOutput: 128000,
		inputPer1M: 2.50,
		outputPer1M: 15.00,
		notes: 'Standard context 272K; 1.05M opt-in (2x pricing beyond 272K)'
	},
	{
		name: 'gpt-5',
		displayName: 'GPT-5',
		provider: 'openai',
		contextWindow: 400000,
		maxOutput: 128000,
		inputPer1M: 1.25,
		outputPer1M: 10.00
	},
	{
		name: 'gpt-4.1',
		displayName: 'GPT-4.1',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 2.00,
		outputPer1M: 8.00
	},
	{
		name: 'gpt-4.1-mini',
		displayName: 'GPT-4.1 Mini',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 0.40,
		outputPer1M: 1.60
	},
	{
		name: 'gpt-4.1-nano',
		displayName: 'GPT-4.1 Nano',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 0.10,
		outputPer1M: 0.40
	},
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
		name: 'o3',
		displayName: 'o3',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 2.00,
		outputPer1M: 8.00,
		notes: 'Reasoning model; reasoning tokens billed as output'
	},
	{
		name: 'o3-mini',
		displayName: 'o3 Mini',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 1.10,
		outputPer1M: 4.40,
		notes: 'Reasoning model'
	},
	{
		name: 'o4-mini',
		displayName: 'o4 Mini',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 1.10,
		outputPer1M: 4.40,
		notes: 'Reasoning model; successor to o3-mini'
	},
	{
		name: 'o1',
		displayName: 'o1',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 15.00,
		outputPer1M: 60.00,
		notes: 'Reasoning model'
	},

	// ============ Anthropic ============
	{
		name: 'claude-opus-4-6',
		displayName: 'Claude Opus 4.6',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 32000,
		inputPer1M: 5.00,
		outputPer1M: 25.00,
		notes: '1M context window in beta (beta header required); 2x pricing >200K tokens'
	},
	{
		name: 'claude-sonnet-4-6',
		displayName: 'Claude Sonnet 4.6',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 64000,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		notes: '1M context window in beta; 2x pricing >200K tokens. Default model on claude.ai'
	},
	{
		name: 'claude-haiku-4-5',
		displayName: 'Claude Haiku 4.5',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 16000,
		inputPer1M: 1.00,
		outputPer1M: 5.00
	},
	{
		name: 'claude-3-5-sonnet-20241022',
		displayName: 'Claude 3.5 Sonnet',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 8192,
		inputPer1M: 3.00,
		outputPer1M: 15.00
	},
	{
		name: 'claude-3-opus-20240229',
		displayName: 'Claude 3 Opus',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 15.00,
		outputPer1M: 75.00
	},
	{
		name: 'claude-3-haiku-20240307',
		displayName: 'Claude 3 Haiku',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 4096,
		inputPer1M: 0.25,
		outputPer1M: 1.25,
		notes: 'Deprecating April 2026 — migrate to Haiku 4.5'
	},

	// ============ Google ============
	{
		name: 'gemini-2.5-pro',
		displayName: 'Gemini 2.5 Pro',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 65536,
		inputPer1M: 1.25,
		outputPer1M: 10.00,
		notes: '2x pricing for prompts >200K tokens'
	},
	{
		name: 'gemini-2.5-flash',
		displayName: 'Gemini 2.5 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 65536,
		inputPer1M: 0.30,
		outputPer1M: 2.50,
		notes: 'Hybrid reasoning model; flat pricing regardless of context length'
	},
	{
		name: 'gemini-2.5-flash-lite',
		displayName: 'Gemini 2.5 Flash-Lite',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 65536,
		inputPer1M: 0.10,
		outputPer1M: 0.40
	},
	{
		name: 'gemini-2.0-flash',
		displayName: 'Gemini 2.0 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.10,
		outputPer1M: 0.40,
		notes: 'Deprecating June 2026'
	},
	{
		name: 'gemini-1.5-pro',
		displayName: 'Gemini 1.5 Pro',
		provider: 'google',
		contextWindow: 2000000,
		maxOutput: 8192,
		inputPer1M: 1.25,
		outputPer1M: 5.00,
		notes: '2x pricing for prompts >128K tokens'
	},
	{
		name: 'gemini-1.5-flash',
		displayName: 'Gemini 1.5 Flash',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 8192,
		inputPer1M: 0.075,
		outputPer1M: 0.30
	},

	// ============ DeepSeek ============
	{
		name: 'deepseek-chat',
		displayName: 'DeepSeek V3.2 (Chat)',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 8000,
		inputPer1M: 0.28,
		outputPer1M: 0.42,
		notes: 'Cache hit: $0.028/M input. Non-thinking mode'
	},
	{
		name: 'deepseek-reasoner',
		displayName: 'DeepSeek V3.2 (Reasoner)',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 64000,
		inputPer1M: 0.28,
		outputPer1M: 0.42,
		notes: 'Cache hit: $0.028/M input. Thinking/reasoning mode; up to 32K reasoning tokens'
	},

	// ============ Moonshot AI (Kimi) ============
	{
		name: 'kimi-k2.5',
		displayName: 'Kimi K2.5',
		provider: 'moonshot',
		contextWindow: 262144,
		maxOutput: 32768,
		inputPer1M: 0.60,
		outputPer1M: 2.50,
		notes: '1T param MoE; 32B activated. Native multimodal + Agent Swarm. Cache hit: $0.10/M input'
	},
	{
		name: 'kimi-k2',
		displayName: 'Kimi K2',
		provider: 'moonshot',
		contextWindow: 131072,
		maxOutput: 16384,
		inputPer1M: 0.60,
		outputPer1M: 2.50,
		notes: 'Cache hit: $0.15/M input'
	},
	{
		name: 'kimi-k2-thinking',
		displayName: 'Kimi K2 Thinking',
		provider: 'moonshot',
		contextWindow: 131072,
		maxOutput: 16384,
		inputPer1M: 0.47,
		outputPer1M: 2.00,
		notes: 'Reasoning model; step-by-step CoT with tool use'
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

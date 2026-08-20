// AI Models Configuration
// Centralized configuration for all AI model data
// Last updated: August 20, 2026
//
// ⚠️ UPDATE THIS FILE when model pricing changes
// Check provider websites for current rates:
// - OpenAI: https://openai.com/api/pricing/
// - Anthropic: https://www.anthropic.com/pricing
// - Google: https://ai.google.dev/pricing
// - xAI: https://x.ai/api
// - DeepSeek: https://api-docs.deepseek.com/quick_start/pricing
// - Moonshot (Kimi): https://platform.moonshot.ai/

export const PRICING_LAST_UPDATED = '2026-08-20';

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
	// Tokenizer adjustment factor relative to the OpenAI BPE tokenizer used for
	// counting (gpt-tokenizer). Providers with a denser/different tokenizer emit
	// more tokens for the same text, which increases real cost. Defaults to 1.
	// e.g. Anthropic's Claude 4.7 tokenizer uses ~35% more tokens => 1.35.
	tokenizerFactor?: number;
	notes?: string;
}

export const CHAT_MODELS: ChatModel[] = [
	// ============ OpenAI ============
	// GPT-5.6 family — current flagship, listed on OpenAI API pricing (Aug 2026)
	{
		name: 'gpt-5.6-sol',
		displayName: 'GPT-5.6 Sol',
		provider: 'openai',
		contextWindow: 1050000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 30.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-08',
		strengths: 'Current OpenAI flagship for coding, agents, and knowledge work',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Listed as gpt-5.6-sol. Standard rates under ~270K input; long context is $10 / $45 per 1M. Batch 50% off. Regional data-residency endpoints add 10%.'
	},
	{
		name: 'gpt-5.6-terra',
		displayName: 'GPT-5.6 Terra',
		provider: 'openai',
		contextWindow: 1050000,
		maxOutput: 128000,
		inputPer1M: 2.00,
		outputPer1M: 12.00,
		cachedInputPer1M: 0.20,
		multimodal: true,
		releaseDate: '2026-08',
		strengths: 'Mid-tier GPT-5.6: coding and production chat at roughly GPT-5.4 input price with a lower output rate',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Listed as gpt-5.6-terra. Long-context band $4 / $18 per 1M. Strong default when Sol is more than you need.'
	},
	{
		name: 'gpt-5.6-luna',
		displayName: 'GPT-5.6 Luna',
		provider: 'openai',
		contextWindow: 400000,
		maxOutput: 64000,
		inputPer1M: 0.20,
		outputPer1M: 1.20,
		cachedInputPer1M: 0.02,
		multimodal: true,
		releaseDate: '2026-08',
		strengths: 'High-volume GPT-5.6: classification, cheap chat, extraction',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Listed as gpt-5.6-luna. Long-context band $0.40 / $1.80 per 1M. Same $0.20 input floor as Grok 4.1 Fast with higher output price.'
	},
	// Current flagship family (GPT-5.4) — released March 2026
	{
		name: 'gpt-5.4',
		displayName: 'GPT-5.4',
		provider: 'openai',
		contextWindow: 270000,
		maxOutput: 128000,
		inputPer1M: 2.50,
		outputPer1M: 15.00,
		cachedInputPer1M: 0.25,
		multimodal: true,
		releaseDate: '2026-03',
		strengths: 'Frontier coding, computer use, general reasoning, agentic tasks',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: 'Current flagship. 57.7% SWE-bench Pro. Unified model for coding, reasoning, and computer use.'
	},
	{
		name: 'gpt-5.4-mini',
		displayName: 'GPT-5.4 Mini',
		provider: 'openai',
		contextWindow: 400000,
		maxOutput: 64000,
		inputPer1M: 0.75,
		outputPer1M: 4.50,
		cachedInputPer1M: 0.075,
		multimodal: true,
		releaseDate: '2026-03',
		strengths: 'High-throughput production workloads, chat, coding at scale',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: '54.38% SWE-bench Pro — close to Standard at ~6x lower cost.'
	},
	{
		name: 'gpt-5.4-nano',
		displayName: 'GPT-5.4 Nano',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 32000,
		inputPer1M: 0.20,
		outputPer1M: 1.25,
		cachedInputPer1M: 0.02,
		multimodal: false,
		releaseDate: '2026-03',
		strengths: 'Ultra-budget classification, simple chat, edge use cases',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Cheapest GPT-5.4 variant. Undercuts nearly every alternative on input price.'
	},
	// GPT-5.5 family — current frontier, released April 2026
	{
		name: 'gpt-5.5',
		displayName: 'GPT-5.5',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 30.00,
		cachedInputPer1M: 1.25,
		multimodal: true,
		releaseDate: '2026-04',
		strengths: 'Agentic coding, computer use, long-horizon reasoning, scientific research, knowledge work',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Released Apr 24, 2026. 82.7% Terminal-Bench 2.0, 84.9% GDPval, 58.6% SWE-bench Pro. ~40% fewer output tokens per task vs GPT-5.4. Pricing doubles above 272K input tokens.'
	},
	{
		name: 'gpt-5.5-pro',
		displayName: 'GPT-5.5 Pro',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 30.00,
		outputPer1M: 180.00,
		cachedInputPer1M: 7.50,
		multimodal: true,
		releaseDate: '2026-04',
		strengths: 'Maximum reasoning depth, high-stakes agentic work, manuscript critique, complex research',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		notes: 'Premium tier of GPT-5.5 family. For workloads where accuracy outweighs cost. Batch/Flex at 50% off.'
	},
	{
		name: 'gpt-5.5-mini',
		displayName: 'GPT-5.5 Mini',
		provider: 'openai',
		contextWindow: 400000,
		maxOutput: 64000,
		inputPer1M: 0.90,
		outputPer1M: 5.40,
		cachedInputPer1M: 0.09,
		multimodal: true,
		releaseDate: '2026-05',
		strengths: 'High-throughput agentic workloads, chat, coding at scale with reasoning',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Released May 2026. Cost-efficient reasoning member of the GPT-5.5 family. ~6x cheaper than GPT-5.5 Standard at similar throughput.'
	},
	// GPT-4.1 family — long-context specialist, released April 2025
	{
		name: 'gpt-4.1',
		displayName: 'GPT-4.1',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 2.00,
		outputPer1M: 8.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2025-04',
		strengths: 'Long-context processing, codebases, legal documents, instruction-following',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: '1M token context at flat rate. Recommended replacement for GPT-4o.'
	},
	{
		name: 'gpt-4.1-mini',
		displayName: 'GPT-4.1 Mini',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 0.40,
		outputPer1M: 1.60,
		cachedInputPer1M: 0.10,
		multimodal: true,
		releaseDate: '2025-04',
		strengths: 'Large-context document processing at low cost',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'gpt-4.1-nano',
		displayName: 'GPT-4.1 Nano',
		provider: 'openai',
		contextWindow: 1000000,
		maxOutput: 16384,
		inputPer1M: 0.10,
		outputPer1M: 0.40,
		cachedInputPer1M: 0.025,
		multimodal: false,
		releaseDate: '2025-04',
		strengths: 'Cheapest capable model, long context classification',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Cheapest model in OpenAI lineup. 1M context at $0.10 input.'
	},
	// Reasoning / o-series
	{
		name: 'o3',
		displayName: 'o3',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 2.00,
		outputPer1M: 8.00,
		cachedInputPer1M: 0.50,
		multimodal: false,
		releaseDate: '2025-04',
		strengths: 'Math, formal logic, scientific analysis, complex multi-step reasoning',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		notes: 'Reasoning model. Replaced o1 at 87% lower cost with better performance.'
	},
	{
		name: 'o4-mini',
		displayName: 'o4 Mini',
		provider: 'openai',
		contextWindow: 200000,
		maxOutput: 100000,
		inputPer1M: 1.10,
		outputPer1M: 4.40,
		cachedInputPer1M: 0.275,
		multimodal: false,
		releaseDate: '2025-04',
		strengths: 'Cost-effective reasoning, math, coding logic, multi-step tasks',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Replaced o3-mini. Best-value reasoning model in OpenAI lineup.'
	},
	// Legacy models (still available)
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
		strengths: 'General purpose, multimodal analysis, tool use (legacy)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: 'Legacy model. GPT-5.4 or GPT-4.1 preferred for new projects.'
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
		strengths: 'High volume simple tasks, classification (legacy)',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Legacy. Prefer GPT-5.6 Luna ($0.20 / $1.20) or GPT-5.4 Nano for new work.'
	},

	// ============ Anthropic ============
	// Claude 5 family — current lineup on platform.claude.com/docs pricing (Aug 20, 2026)
	{
		name: 'claude-fable-5',
		displayName: 'Claude Fable 5',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 10.00,
		outputPer1M: 50.00,
		cachedInputPer1M: 1.00,
		multimodal: true,
		releaseDate: '2026-06',
		strengths: 'Highest self-serve Claude tier: hard agentic coding, long evaluations, when extra quality pays back',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Official: $10 / $50 per MTok, cache hits $1. Tokenizer is the 4.7+ generation (~30% more tokens than Sonnet 4.6 and earlier).'
	},
	{
		name: 'claude-opus-5',
		displayName: 'Claude Opus 5',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 25.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-07',
		strengths: 'Current Opus flagship for complex reasoning, coding, and enterprise agents',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Released Jul 24, 2026. Same $5 / $25 card as prior Opus 4.x. Cache hits $0.50. 4.7+ tokenizer (~30% more tokens vs 4.6).'
	},
	{
		name: 'claude-sonnet-5',
		displayName: 'Claude Sonnet 5',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 64000,
		inputPer1M: 2.00,
		outputPer1M: 10.00,
		cachedInputPer1M: 0.20,
		multimodal: true,
		releaseDate: '2026-06',
		strengths: 'Production default: coding, writing, and agents at the current standard $2 / $10 rate',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Anthropic made $2 / $10 the standard Sonnet 5 price (the planned Sep 1, 2026 rise to $3 / $15 will not happen). Cache hits $0.20. 4.7+ tokenizer.'
	},
	{
		name: 'claude-opus-4-8',
		displayName: 'Claude Opus 4.8',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 25.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-06',
		strengths: 'Previous Opus flagship, still listed at $5 / $25',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Still on the official price table. Prefer Opus 5 for new projects. 4.7+ tokenizer.'
	},
	// Claude 4.7 — previous generation still widely used
	{
		name: 'claude-opus-4-7',
		displayName: 'Claude Opus 4.7',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 25.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-04',
		strengths: 'Agentic coding, long-horizon multi-session work, high-res vision, enterprise doc workflows',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Released Apr 16, 2026. 87.6% SWE-bench Verified, 64.3% Terminal-Bench 2.0. New xhigh effort level. 3.75MP vision (3x previous). Task budgets beta. New tokenizer emits up to ~35% more tokens vs Opus 4.6, raising effective cost — token/cost estimates here are adjusted accordingly.'
	},
	{
		name: 'claude-sonnet-4-7',
		displayName: 'Claude Sonnet 4.7',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 64000,
		inputPer1M: 3.30,
		outputPer1M: 16.50,
		cachedInputPer1M: 0.33,
		multimodal: true,
		releaseDate: '2026-05',
		strengths: 'Balanced agentic coding, tool use, long-context reasoning at mid-tier price',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		tokenizerFactor: 1.30,
		notes: 'Released May 2026. Sonnet tier of the Claude 4.7 generation. Uses the same new tokenizer as Opus 4.7 (~35% more tokens than 4.6), so token/cost estimates are adjusted. 1M context flat-rate.'
	},
	// Claude 4.6 family — previous generation, still widely used
	{
		name: 'claude-opus-4-6',
		displayName: 'Claude Opus 4.6',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 5.00,
		outputPer1M: 25.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2025-10',
		strengths: 'Complex autonomous coding, agentic workflows, top SWE-bench performance',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		notes: 'Previous flagship. Now superseded by Opus 4.7. Extended thinking support. 1M context flat-rate, no surcharge.'
	},
	{
		name: 'claude-sonnet-4-6',
		displayName: 'Claude Sonnet 4.6',
		provider: 'anthropic',
		contextWindow: 1000000,
		maxOutput: 64000,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		cachedInputPer1M: 0.30,
		multimodal: true,
		releaseDate: '2025-10',
		strengths: 'Coding, nuanced writing, balanced speed and capability',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: 'Most popular production model. 1M token context at flat rate.'
	},
	{
		name: 'claude-haiku-4-5-20251001',
		displayName: 'Claude Haiku 4.5',
		provider: 'anthropic',
		contextWindow: 200000,
		maxOutput: 8192,
		inputPer1M: 1.00,
		outputPer1M: 5.00,
		cachedInputPer1M: 0.10,
		multimodal: true,
		releaseDate: '2025-10',
		strengths: 'Fast analysis, high-volume tasks, text extraction',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Budget tier of current Claude generation.'
	},
	// Older Claude models still available
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
		strengths: 'Coding, nuanced writing, computer use (previous gen)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: false,
		notes: 'Previous generation. Prefer Sonnet 5 ($2 / $10) for new projects. Not on the current first-party price table.'
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
		strengths: 'Fast analysis, text extraction (previous gen)',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: false,
		notes: 'Retired on first-party Claude API except Bedrock and Google Cloud. Prefer Haiku 4.5.'
	},

	// ============ Google ============
	// Gemini 3.x — latest generation
	{
		name: 'gemini-3.1-pro-preview',
		displayName: 'Gemini 3.1 Pro Preview',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 65536,
		inputPer1M: 2.00,
		outputPer1M: 12.00,
		cachedInputPer1M: 0.20,
		multimodal: true,
		releaseDate: '2026-02',
		strengths: 'Advanced reasoning, native video understanding, complex multimodal tasks',
		speedCategory: 'slow',
		reasoning: true,
		apiAvailability: true,
		notes: 'Official Gemini API: $2 / $12 under 200K prompt tokens, $4 / $18 above. Cache reads $0.20 / $0.40. Thinking tokens billed as output.'
	},
	{
		name: 'gemini-3.6-flash',
		displayName: 'Gemini 3.6 Flash',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65536,
		inputPer1M: 1.50,
		outputPer1M: 7.50,
		cachedInputPer1M: 0.15,
		multimodal: true,
		releaseDate: '2026-08',
		strengths: 'Current Gemini Flash for speed, search, and grounding',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Listed as gemini-3.6-flash on ai.google.dev pricing. Batch/Flex $0.75 / $3.75. Thinking tokens billed as output.'
	},
	{
		name: 'gemini-3.5-flash',
		displayName: 'Gemini 3.5 Flash',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65536,
		inputPer1M: 1.50,
		outputPer1M: 9.00,
		cachedInputPer1M: 0.15,
		multimodal: true,
		releaseDate: '2026-07',
		strengths: 'Gemini 3.5 Flash: speed plus grounding, higher output rate than 3.6 Flash',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Official: $1.50 / $9.00. Batch/Flex $0.75 / $4.50.'
	},
	{
		name: 'gemini-3.5-flash-lite',
		displayName: 'Gemini 3.5 Flash-Lite',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65536,
		inputPer1M: 0.30,
		outputPer1M: 2.50,
		cachedInputPer1M: 0.03,
		multimodal: true,
		releaseDate: '2026-07',
		strengths: 'High-volume agentic tasks, translation, simple extraction on the Gemini 3.5 line',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Official: $0.30 / $2.50 (text/image/video/audio). Batch $0.15 / $1.25.'
	},
	{
		name: 'gemini-3.1-flash-lite',
		displayName: 'Gemini 3.1 Flash-Lite',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65536,
		inputPer1M: 0.25,
		outputPer1M: 1.50,
		cachedInputPer1M: 0.025,
		multimodal: true,
		releaseDate: '2026-05',
		strengths: 'Cheapest current Gemini 3.x text/image/video path',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Official: $0.25 / $1.50 for text/image/video. Audio input is $0.50 / 1M.'
	},
	{
		name: 'gemini-3.1-flash',
		displayName: 'Gemini 3.1 Flash',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65536,
		inputPer1M: 0.40,
		outputPer1M: 3.00,
		cachedInputPer1M: 0.10,
		multimodal: true,
		releaseDate: '2026-05',
		strengths: 'Best price-to-performance in the Gemini 3.x line, fast multimodal reasoning, 1M context',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Released May 2026. Flash tier of Gemini 3.1 with configurable thinking. Flat pricing regardless of context length.'
	},
	// Gemini 2.5 — proven generation
	{
		name: 'gemini-2.5-pro',
		displayName: 'Gemini 2.5 Pro',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 65536,
		inputPer1M: 1.25,
		outputPer1M: 10.00,
		cachedInputPer1M: 0.31,
		multimodal: true,
		releaseDate: '2025-06',
		strengths: 'Long-context reasoning, coding, math, scientific tasks',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Pricing doubles above 200K tokens ($2.50/$15). Built-in "thinking" capability.'
	},
	{
		name: 'gemini-2.5-flash',
		displayName: 'Gemini 2.5 Flash',
		provider: 'google',
		contextWindow: 1048576,
		maxOutput: 65535,
		inputPer1M: 0.30,
		outputPer1M: 2.50,
		cachedInputPer1M: 0.075,
		multimodal: true,
		releaseDate: '2025-06',
		strengths: 'Best price-to-performance ratio, reasoning, 1M context, speed',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Outstanding value. Configurable reasoning depth. Flat pricing regardless of context.'
	},
	{
		name: 'gemini-2.5-flash-lite',
		displayName: 'Gemini 2.5 Flash-Lite',
		provider: 'google',
		contextWindow: 1000000,
		maxOutput: 32768,
		inputPer1M: 0.10,
		outputPer1M: 0.40,
		cachedInputPer1M: 0.025,
		multimodal: true,
		releaseDate: '2025-09',
		strengths: 'Highest-volume low-cost workloads, classification, simple extraction',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Cheapest model from a Tier-1 provider. Batch: $0.05/$0.20.'
	},
	// Legacy Google models
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
		strengths: 'High-speed multimodal, improved logic (legacy)',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: false,
		notes: 'DEPRECATED — shut down June 1, 2026. Migrate to Gemini 2.5 Flash or 3.5 Flash-Lite.'
	},
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
		strengths: 'Massive context (legacy)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true,
		notes: 'Legacy. 2x pricing for prompts >128K tokens. Upgrade to Gemini 2.5 Pro.'
	},

	// ============ DeepSeek ============
	// Current V4 family — launched April 2026
	{
		name: 'deepseek-v4-flash',
		displayName: 'DeepSeek V4 Flash (Chat)',
		provider: 'deepseek',
		contextWindow: 1000000,
		maxOutput: 384000,
		inputPer1M: 0.44,
		outputPer1M: 1.32,
		cachedInputPer1M: 0.014,
		multimodal: false,
		releaseDate: '2026-04',
		strengths: 'Extreme cost efficiency, coding, general tasks, 1M context, thinking/non-thinking modes',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Peak (01:00–04:00 and 06:00–10:00 UTC) $0.44 / $1.32 cache-miss. Off-peak is half ($0.22 / $0.66). Cache hit $0.007 off-peak / $0.014 peak. Rates effective Aug 16, 2026. Max output 384K on current V4 Flash.'
	},
	{
		name: 'deepseek-v4-pro',
		displayName: 'DeepSeek V4 Pro',
		provider: 'deepseek',
		contextWindow: 1000000,
		maxOutput: 384000,
		inputPer1M: 1.32,
		outputPer1M: 3.96,
		cachedInputPer1M: 0.044,
		multimodal: false,
		releaseDate: '2026-04',
		strengths: 'Frontier-class coding and reasoning, 1M context, open weights',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'GA as DeepSeek-V4-Pro-0813. Peak cache-miss $1.32 / $3.96; off-peak half ($0.66 / $1.98). Cache hit $0.022 / $0.044. Cost estimator uses peak so budgets are not surprised. Effective Aug 16, 2026.'
	},
	{
		name: 'deepseek-reasoner',
		displayName: 'DeepSeek R1',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 64000,
		inputPer1M: 0.55,
		outputPer1M: 2.19,
		cachedInputPer1M: 0.14,
		multimodal: false,
		releaseDate: '2025-01',
		strengths: 'Math, complex coding, step-by-step reasoning',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Legacy alias. Prefer deepseek-v4-flash thinking. First-party reasoner path was scheduled to route away Jul 24, 2026.'
	},
	{
		name: 'deepseek-chat',
		displayName: 'DeepSeek V3.2 (Chat)',
		provider: 'deepseek',
		contextWindow: 128000,
		maxOutput: 8000,
		inputPer1M: 0.28,
		outputPer1M: 0.42,
		cachedInputPer1M: 0.028,
		multimodal: false,
		releaseDate: '2024-12',
		strengths: 'Ultra-cheap general assistant, coding (legacy)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: false,
		notes: 'LEGACY — model string routes to V4 Flash. Do not budget this row for new apps.'
	},

	// ============ xAI ============
	// Grok 4.6 is the current flagship on docs.x.ai (Aug 2026)
	{
		name: 'grok-4.6',
		displayName: 'Grok 4.6',
		provider: 'x',
		contextWindow: 500000,
		maxOutput: 128000,
		inputPer1M: 2.00,
		outputPer1M: 6.00,
		cachedInputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-08',
		strengths: 'Current xAI flagship for coding, agents, and knowledge work',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Official: $2 / $0.50 / $6 per 1M under 200K prompt tokens; $4 / $1 / $12 at or above 200K for the whole request. 500K context. Reasoning effort low/medium/high/xhigh.'
	},
	{
		name: 'grok-4.5',
		displayName: 'Grok 4.5',
		provider: 'x',
		contextWindow: 500000,
		maxOutput: 128000,
		inputPer1M: 2.00,
		outputPer1M: 6.00,
		cachedInputPer1M: 0.30,
		multimodal: true,
		releaseDate: '2026-07',
		strengths: 'Prior Grok coding/agent model, same token rates as 4.6 with cheaper cache hits',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Official: $2 / $0.30 / $6 under 200K; doubles above. Prefer grok-4.6 for new work.'
	},
	{
		name: 'grok-4.3',
		displayName: 'Grok 4.3',
		provider: 'x',
		contextWindow: 1000000,
		maxOutput: 128000,
		inputPer1M: 1.25,
		outputPer1M: 2.50,
		cachedInputPer1M: 0.20,
		multimodal: true,
		releaseDate: '2026-06',
		strengths: '1M context Grok at a lower output rate than 4.6',
		speedCategory: 'fast',
		reasoning: true,
		apiAvailability: true,
		notes: 'Official: $1.25 / $0.20 / $2.50 under 200K; $2.50 / $0.40 / $5.00 above. 1M context.'
	},
	{
		name: 'grok-4',
		displayName: 'Grok 4',
		provider: 'x',
		contextWindow: 256000,
		maxOutput: 32768,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		multimodal: true,
		releaseDate: '2025-12',
		strengths: 'Reasoning, real-time X/web data, science & math',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Same pricing as Claude Sonnet 4.6. OpenAI-compatible API format.'
	},
	{
		name: 'grok-4.1-fast',
		displayName: 'Grok 4.1 Fast',
		provider: 'x',
		contextWindow: 2000000,
		maxOutput: 32768,
		inputPer1M: 0.20,
		outputPer1M: 0.50,
		multimodal: true,
		releaseDate: '2026-01',
		strengths: 'Largest context window (2M tokens), ultra-low cost, real-time data',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: '2M context is unique at this price tier. Prompt caching included automatically.'
	},
	{
		name: 'grok-4.1',
		displayName: 'Grok 4.1',
		provider: 'x',
		contextWindow: 256000,
		maxOutput: 32768,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		cachedInputPer1M: 0.75,
		multimodal: true,
		releaseDate: '2026-05',
		strengths: 'Reasoning, real-time X/web data, agentic tool use, science & math',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Released May 2026. Full-size upgrade over Grok 4 with reasoning and prompt caching. OpenAI-compatible API format.'
	},
	{
		name: 'grok-3',
		displayName: 'Grok 3',
		provider: 'x',
		contextWindow: 128000,
		maxOutput: 16384,
		inputPer1M: 3.00,
		outputPer1M: 15.00,
		multimodal: true,
		releaseDate: '2025-02',
		strengths: 'Reasoning, coding, real-time web knowledge (previous gen)',
		speedCategory: 'balanced',
		reasoning: false,
		apiAvailability: true
	},
	{
		name: 'grok-3-mini',
		displayName: 'Grok 3 Mini',
		provider: 'x',
		contextWindow: 128000,
		maxOutput: 8192,
		inputPer1M: 0.30,
		outputPer1M: 0.50,
		multimodal: false,
		releaseDate: '2025-02',
		strengths: 'Extraordinarily cheap output tokens, code generation, conversations',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Output at $0.50/M — 4x cheaper than GPT-5 Mini output.'
	},

	// ============ Moonshot AI (Kimi) ============
	// Current K2.6 generation — released April 2026
	{
		name: 'kimi-k2.6',
		displayName: 'Kimi K2.6',
		provider: 'moonshot',
		contextWindow: 262144,
		maxOutput: 16384,
		inputPer1M: 0.95,
		outputPer1M: 4.00,
		cachedInputPer1M: 0.16,
		multimodal: true,
		releaseDate: '2026-04',
		strengths: 'Long-horizon coding, frontend UI generation, 300-agent swarms, multi-agent orchestration',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: 'Released Apr 20, 2026. API list price checked Aug 2026: $0.95 input / $4.00 output, cache ~$0.16. 256K context. Open weights (Modified MIT).'
	},
	{
		name: 'kimi-k2.5',
		displayName: 'Kimi K2.5',
		provider: 'moonshot',
		contextWindow: 262144,
		maxOutput: 16384,
		inputPer1M: 0.60,
		outputPer1M: 2.50,
		cachedInputPer1M: 0.15,
		multimodal: true,
		releaseDate: '2026-01',
		strengths: 'Visual coding, Agent Swarm (100 parallel agents), general reasoning, cost-effective frontier quality',
		speedCategory: 'balanced',
		reasoning: true,
		apiAvailability: true,
		notes: '1T total / 32B active MoE. Thinking and non-thinking modes. 50.2% Humanity\'s Last Exam. 76% cheaper than Claude Opus 4.5 on comparable tasks. OpenAI-compatible API.'
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
		strengths: 'Open weights, high performance text tasks, self-hostable',
		speedCategory: 'fast',
		reasoning: false,
		apiAvailability: true,
		notes: 'Pricing based on typical Groq/Together AI rates. Can be self-hosted.'
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
		strengths: 'Complex reasoning, synthetic data generation, open weights',
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
		strengths: 'Open vision model, image reasoning, self-hostable',
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
		strengths: 'Multilingual support, strict system prompts, European data residency',
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
		strengths: 'Chart/graph understanding, image OCR, document parsing',
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
		strengths: 'Edge computing, low latency, on-device workflows',
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
		strengths: 'RAG pipelines, citations, multilingual enterprise usage',
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
		strengths: 'Fast RAG, data extraction, tool use, citations',
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
		strengths: 'High performance general tasks, multilingual, strong Chinese language',
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
		strengths: 'Open weights, coding, mathematics, cost-effective',
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
		name: 'text-embedding-4-large',
		displayName: 'text-embedding-4-large',
		provider: 'openai',
		dimensions: 4096,
		maxTokens: 32768,
		pricePerMillion: 0.15,
		notes: 'Released 2026. Higher-dimensional successor to the v3 series with a longer input window.'
	},
	{
		name: 'gemini-embedding-2',
		displayName: 'Gemini Embedding 2',
		provider: 'google',
		dimensions: 3072,
		maxTokens: 8192,
		pricePerMillion: 0.20,
		notes: 'Multimodal embedding (text $0.20 / 1M). Image/audio/video have separate rates on the Gemini pricing page.'
	},
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
		pricePerMillion: 0.10,
		notes: 'Legacy model. Prefer text-embedding-3 series.'
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
		name: 'gemini-embedding-001',
		displayName: 'Gemini Embedding 001',
		provider: 'google',
		dimensions: 3072,
		maxTokens: 2048,
		pricePerMillion: 0.15,
		notes: 'Released 2026. Matryoshka dimensions (truncatable to 1536/768). Successor to text-embedding-004.'
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

// Tokenizer adjustment factor for a model (defaults to 1 when unknown/unset).
export function getTokenizerFactor(modelName: string): number {
	return getChatModel(modelName)?.tokenizerFactor ?? 1;
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
			return 'badge-error';
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
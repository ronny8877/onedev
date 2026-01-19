// AI Model Token Utilities
// Uses gpt-tokenizer for accurate BPE tokenization
// Model configurations are in $lib/config/ai-models.ts

import { encode, decode } from 'gpt-tokenizer';
import { CHAT_MODELS, type ChatModel } from '$lib/config/ai-models';

// Re-export for convenience
export { CHAT_MODELS, type ChatModel };
export { formatNumber, getContextUsage } from '$lib/config/ai-models';

// Get model config by name
export function getModelConfig(modelName: string): ChatModel {
	return CHAT_MODELS.find((m) => m.name === modelName) || CHAT_MODELS[0];
}

// Count tokens for a given text and model
export function countTokens(text: string, modelName: string = 'gpt-4o'): number {
	if (!text) return 0;
	try {
		const tokens = encode(text, { allowedSpecial: 'all' });
		return tokens.length;
	} catch {
		// Fallback: rough estimate (4 chars per token on average)
		return Math.ceil(text.length / 4);
	}
}

// Get individual tokens with their text representations
export interface TokenInfo {
	id: number;
	text: string;
	startIndex: number;
	endIndex: number;
}

export function getTokens(text: string, modelName: string = 'gpt-4o'): TokenInfo[] {
	if (!text) return [];

	try {
		const tokenIds = encode(text, { allowedSpecial: 'all' });
		const tokens: TokenInfo[] = [];
		let currentIndex = 0;

		for (const tokenId of tokenIds) {
			const tokenText = decode([tokenId]);
			tokens.push({
				id: tokenId,
				text: tokenText,
				startIndex: currentIndex,
				endIndex: currentIndex + tokenText.length
			});
			currentIndex += tokenText.length;
		}

		return tokens;
	} catch {
		// Fallback: split by characters
		return text.split('').map((char, i) => ({
			id: i,
			text: char,
			startIndex: i,
			endIndex: i + 1
		}));
	}
}

// Check if text is within token limit
export function isWithinLimit(text: string, maxTokens: number, modelName: string = 'gpt-4o'): boolean {
	const tokenCount = countTokens(text, modelName);
	return tokenCount <= maxTokens;
}

// Trim text to fit within token limit
export type TrimMode = 'hard' | 'sentence' | 'paragraph';

export function trimToTokenLimit(
	text: string,
	maxTokens: number,
	modelName: string = 'gpt-4o',
	mode: TrimMode = 'hard',
	fromEnd: boolean = true
): { trimmed: string; removed: string; originalTokens: number; trimmedTokens: number } {
	const originalTokens = countTokens(text, modelName);

	if (originalTokens <= maxTokens) {
		return { trimmed: text, removed: '', originalTokens, trimmedTokens: originalTokens };
	}

	let trimmed = text;
	let removed = '';

	if (mode === 'hard') {
		// Hard cut at token boundary
		const tokens = encode(text, { allowedSpecial: 'all' });
		const keptTokens = fromEnd ? tokens.slice(0, maxTokens) : tokens.slice(-maxTokens);
		trimmed = decode(keptTokens);
		removed = fromEnd ? text.slice(trimmed.length) : text.slice(0, text.length - trimmed.length);
	} else if (mode === 'sentence') {
		// Sentence-aware trim
		const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
		trimmed = '';
		const kept: string[] = [];

		if (fromEnd) {
			for (const sentence of sentences) {
				const testText = kept.join('') + sentence;
				if (countTokens(testText, modelName) <= maxTokens) {
					kept.push(sentence);
				} else {
					break;
				}
			}
			trimmed = kept.join('');
			removed = text.slice(trimmed.length);
		} else {
			for (let i = sentences.length - 1; i >= 0; i--) {
				const testText = sentences[i] + kept.join('');
				if (countTokens(testText, modelName) <= maxTokens) {
					kept.unshift(sentences[i]);
				} else {
					break;
				}
			}
			trimmed = kept.join('');
			removed = text.slice(0, text.length - trimmed.length);
		}
	} else if (mode === 'paragraph') {
		// Paragraph-aware trim
		const paragraphs = text.split(/\n\s*\n/);
		const kept: string[] = [];

		if (fromEnd) {
			for (const para of paragraphs) {
				const testText = kept.length > 0 ? kept.join('\n\n') + '\n\n' + para : para;
				if (countTokens(testText, modelName) <= maxTokens) {
					kept.push(para);
				} else {
					break;
				}
			}
			trimmed = kept.join('\n\n');
			removed = text.slice(trimmed.length);
		} else {
			for (let i = paragraphs.length - 1; i >= 0; i--) {
				const testText = kept.length > 0 ? paragraphs[i] + '\n\n' + kept.join('\n\n') : paragraphs[i];
				if (countTokens(testText, modelName) <= maxTokens) {
					kept.unshift(paragraphs[i]);
				} else {
					break;
				}
			}
			trimmed = kept.join('\n\n');
			removed = text.slice(0, text.length - trimmed.length);
		}
	}

	return {
		trimmed,
		removed,
		originalTokens,
		trimmedTokens: countTokens(trimmed, modelName)
	};
}

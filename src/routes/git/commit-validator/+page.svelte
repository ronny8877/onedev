<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['commit-validator'];

	const conventionalPattern = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?(!)?: .+$/;
	const headerMaxLength = 72;
	const bodyLineMaxLength = 100;

	const validTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];

	interface ValidationResult {
		valid: boolean;
		type: 'error' | 'warning' | 'success';
		message: string;
		line?: number;
	}

	let commitMessage = $state('');

	const sampleValid = `feat(auth): add OAuth2 login support

Implemented Google and GitHub OAuth2 providers.
Added session management with secure cookies.

Closes #123`;

	const sampleInvalid = `Added new feature for login

this is a very long line that exceeds the recommended maximum length for commit message body lines which should ideally be under 100 characters`;

	// Parse and validate commit message
	let validation = $derived.by(() => {
		const results: ValidationResult[] = [];
		
		if (!commitMessage.trim()) {
			return { results, isValid: false, parsed: null };
		}
		
		const lines = commitMessage.split('\n');
		const header = lines[0] || '';
		const body = lines.slice(2).join('\n');
		
		// Parse header
		const headerMatch = header.match(/^(\w+)(?:\(([^)]+)\))?(!)?: (.+)$/);
		
		// Validation checks
		
		// 1. Header format
		if (!conventionalPattern.test(header)) {
			if (!header.includes(':')) {
				results.push({
					valid: false,
					type: 'error',
					message: 'Missing colon separator. Format: type(scope): description',
					line: 1
				});
			} else {
				const colonIdx = header.indexOf(':');
				const type = header.substring(0, colonIdx).replace(/\(.+\)/, '').replace('!', '');
				if (!validTypes.includes(type)) {
					results.push({
						valid: false,
						type: 'error',
						message: `Invalid type "${type}". Valid types: ${validTypes.join(', ')}`,
						line: 1
					});
				} else {
					results.push({
						valid: false,
						type: 'error',
						message: 'Invalid header format. Use: type(scope): description',
						line: 1
					});
				}
			}
		} else {
			results.push({
				valid: true,
				type: 'success',
				message: 'Valid conventional commit format',
				line: 1
			});
		}
		
		// 2. Header length
		if (header.length > headerMaxLength) {
			results.push({
				valid: false,
				type: 'warning',
				message: `Header too long (${header.length}/${headerMaxLength} chars). Keep it concise.`,
				line: 1
			});
		} else if (header.length > 50) {
			results.push({
				valid: true,
				type: 'success',
				message: `Header length OK (${header.length}/${headerMaxLength} chars)`,
				line: 1
			});
		}
		
		// 3. Description starts with lowercase
		if (headerMatch && headerMatch[4]) {
			const desc = headerMatch[4];
			if (desc[0] === desc[0].toUpperCase() && desc[0] !== desc[0].toLowerCase()) {
				results.push({
					valid: false,
					type: 'warning',
					message: 'Description should start with lowercase letter',
					line: 1
				});
			}
			if (desc.endsWith('.')) {
				results.push({
					valid: false,
					type: 'warning',
					message: 'Description should not end with a period',
					line: 1
				});
			}
		}
		
		// 4. Blank line after header
		if (lines.length > 1 && lines[1] !== '') {
			results.push({
				valid: false,
				type: 'error',
				message: 'Must have a blank line between header and body',
				line: 2
			});
		}
		
		// 5. Body line length
		for (let i = 2; i < lines.length; i++) {
			if (lines[i].length > bodyLineMaxLength) {
				results.push({
					valid: false,
					type: 'warning',
					message: `Line ${i + 1} exceeds ${bodyLineMaxLength} chars (${lines[i].length})`,
					line: i + 1
				});
			}
		}
		
		// 6. Check for breaking change consistency
		const hasBreakingMark = header.includes('!:');
		const hasBreakingFooter = /BREAKING CHANGE:/.test(body);
		if (hasBreakingMark && !hasBreakingFooter) {
			results.push({
				valid: true,
				type: 'warning',
				message: 'Breaking change marked but no BREAKING CHANGE footer found',
				line: 1
			});
		}
		
		const errors = results.filter(r => r.type === 'error');
		const warnings = results.filter(r => r.type === 'warning');
		const success = results.filter(r => r.type === 'success');
		
		const isValid = errors.length === 0;
		
		// Parse header for display
		let parsed = null;
		if (headerMatch) {
			parsed = {
				type: headerMatch[1],
				scope: headerMatch[2]?.slice(1, -1) || null,
				breaking: header.includes('!:'),
				description: headerMatch[4]
			};
		}
		
		return { results: [...errors, ...warnings, ...success], isValid, parsed };
	});

	function loadSample() {
		commitMessage = sampleValid;
	}

	function loadInvalidSample() {
		commitMessage = sampleInvalid;
	}

	function clearAll() {
		commitMessage = '';
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<div class="flex flex-wrap items-center gap-2">
			<ToolActions onSample={loadSample} onClear={clearAll} />
			<button type="button" class="btn btn-ghost btn-sm gap-1" onclick={loadInvalidSample}>
				<span>⚠️</span>
				Invalid Sample
			</button>
		</div>

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Commit Message</h3>
			<textarea
				bind:value={commitMessage}
				placeholder="Paste your commit message here...&#10;&#10;Example:&#10;feat(auth): add login functionality"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-40 {validation.isValid && commitMessage.trim() ? 'textarea-success' : !validation.isValid && commitMessage.trim() ? 'textarea-error' : ''}"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Validation Status -->
		{#if commitMessage.trim()}
			<div class="card rounded-2xl {validation.isValid ? 'bg-success/10 border-2 border-success/30' : 'bg-error/10 border-2 border-error/30'}">
				<div class="card-body py-4">
					<div class="flex items-center gap-3">
						{#if validation.isValid}
							<div class="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
								<svg class="h-6 w-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-success">Valid Conventional Commit</h3>
								<p class="text-sm text-base-content/70">This commit message follows the conventional commits spec.</p>
							</div>
						{:else}
							<div class="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center">
								<svg class="h-6 w-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<div>
								<h3 class="font-semibold text-error">Invalid Commit Message</h3>
								<p class="text-sm text-base-content/70">See issues below for details.</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Parsed Result -->
		{#if validation.parsed}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold mb-3">Parsed Header</h4>
					<div class="flex flex-wrap gap-2">
						<div class="badge badge-lg gap-2 badge-primary">
							<span>Type</span>
							<span class="font-mono">{validation.parsed.type}</span>
						</div>
						{#if validation.parsed.scope}
							<div class="badge badge-lg gap-2 badge-secondary">
								<span>Scope</span>
								<span class="font-mono">{validation.parsed.scope}</span>
							</div>
						{/if}
						{#if validation.parsed.breaking}
							<div class="badge badge-lg gap-2 badge-error">
								<span>⚠️ Breaking Change</span>
							</div>
						{/if}
					</div>
					<p class="mt-3 text-sm">
						<span class="text-base-content/70">Description:</span>
						<span class="font-medium">{validation.parsed.description}</span>
					</p>
				</div>
			</div>
		{/if}

		<!-- Validation Details -->
		{#if validation.results.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Validation Details</h3>
					<div class="space-y-2">
						{#each validation.results as result}
							<div class="flex items-start gap-3 p-3 rounded-lg {result.type === 'error' ? 'bg-error/10' : result.type === 'warning' ? 'bg-warning/10' : 'bg-success/10'}">
								<div class="shrink-0 mt-0.5">
									{#if result.type === 'error'}
										<svg class="h-5 w-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
									{:else if result.type === 'warning'}
										<svg class="h-5 w-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
										</svg>
									{:else}
										<svg class="h-5 w-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
									{/if}
								</div>
								<div class="flex-1">
									<p class="text-sm font-medium {result.type === 'error' ? 'text-error' : result.type === 'warning' ? 'text-warning' : 'text-success'}">{result.message}</p>
									{#if result.line}
										<p class="text-xs text-base-content/50 mt-0.5">Line {result.line}</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>📖</span>
					Conventional Commits Spec
				</h4>
				<div class="mt-2 text-sm text-base-content/70 space-y-2">
					<code class="block p-2 bg-base-300/50 rounded-lg font-mono text-xs">
						&lt;type&gt;[optional scope][!]: &lt;description&gt;<br/>
						[optional body]<br/>
						[optional footer(s)]
					</code>
					<ul class="space-y-1 mt-2">
						<li>• Header should be ≤72 characters</li>
						<li>• Description starts with lowercase</li>
						<li>• No period at end of description</li>
						<li>• Blank line between header and body</li>
						<li>• Body lines should be ≤100 characters</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
	</div>
</ToolWrapper>

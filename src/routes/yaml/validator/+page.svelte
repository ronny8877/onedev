<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import yaml from 'js-yaml';

	// State
	let input = $state('');

	// Sample YAML
	const sampleYaml = `# Example configuration
name: my-app
version: 1.0.0
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
features:
  - authentication
  - logging
  - caching
settings:
  debug: true
  maxConnections: 100`;

	// Validation result
	function validateYaml(): { isValid: boolean; error: { message: string; line?: number; column?: number } | null; parsed: unknown } {
		if (!input.trim()) {
			return { isValid: true, error: null, parsed: null };
		}

		try {
			const parsed = yaml.load(input);
			return { isValid: true, error: null, parsed };
		} catch (e) {
			const err = e as yaml.YAMLException;
			return {
				isValid: false,
				error: {
					message: err.reason || err.message,
					line: err.mark?.line !== undefined ? err.mark.line + 1 : undefined,
					column: err.mark?.column !== undefined ? err.mark.column + 1 : undefined
				},
				parsed: null
			};
		}
	}

	let result = $derived(validateYaml());

	// Get structure info
	function getStructureInfo(parsed: unknown): { keys: number; depth: number; type: string } {
		if (parsed === null || parsed === undefined) {
			return { keys: 0, depth: 0, type: 'null' };
		}
		if (Array.isArray(parsed)) {
			let maxDepth = 0;
			parsed.forEach(item => {
				const info = getStructureInfo(item);
				maxDepth = Math.max(maxDepth, info.depth);
			});
			return { keys: parsed.length, depth: maxDepth + 1, type: 'array' };
		}
		if (typeof parsed === 'object') {
			const keys = Object.keys(parsed as object);
			let maxDepth = 0;
			keys.forEach(key => {
				const info = getStructureInfo((parsed as Record<string, unknown>)[key]);
				maxDepth = Math.max(maxDepth, info.depth);
			});
			return { keys: keys.length, depth: maxDepth + 1, type: 'object' };
		}
		return { keys: 0, depth: 0, type: typeof parsed };
	}

	let structureInfo = $derived(() => {
		if (result.isValid && result.parsed) {
			return getStructureInfo(result.parsed);
		}
		return null;
	});

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined,
		chars: input.length > 0 ? input.length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Input -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<span>📄</span>
					</div>
					<h3 class="font-bold">YAML Input</h3>
				</div>

				<textarea
					bind:value={input}
					placeholder="Paste your YAML here..."
					class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Validation Result -->
		{#if input.trim()}
			{#if result.isValid}
				<div class="card bg-success/10 border border-success/20 rounded-2xl">
					<div class="card-body p-5">
						<div class="flex items-center gap-4">
							<div class="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
								<svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-bold text-success">Valid YAML</h3>
								<p class="text-base-content/70">Your YAML syntax is correct</p>
							</div>
						</div>

						{#if structureInfo()}
							{@const info = structureInfo()}
							<div class="mt-4 pt-4 border-t border-success/20">
								<div class="flex flex-wrap gap-4">
									<div class="text-center">
										<p class="text-2xl font-bold text-success">{info?.type}</p>
										<p class="text-xs text-base-content/60">Root Type</p>
									</div>
									<div class="text-center">
										<p class="text-2xl font-bold">{info?.keys}</p>
										<p class="text-xs text-base-content/60">Top Keys</p>
									</div>
									<div class="text-center">
										<p class="text-2xl font-bold">{info?.depth}</p>
										<p class="text-xs text-base-content/60">Max Depth</p>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{:else if result.error}
				<div class="card bg-error/10 border border-error/20 rounded-2xl">
					<div class="card-body p-5">
						<div class="flex items-start gap-4">
							<div class="w-14 h-14 rounded-full bg-error/20 flex items-center justify-center shrink-0">
								<svg class="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</div>
							<div class="flex-1">
								<h3 class="text-lg font-bold text-error">Invalid YAML</h3>
								
								<div class="mt-3 p-3 bg-base-100/50 rounded-lg">
									<p class="font-mono text-sm">{result.error.message}</p>
									{#if result.error.line}
										<div class="flex gap-4 mt-2 text-sm">
											<span class="badge badge-error badge-sm">Line {result.error.line}</span>
											{#if result.error.column}
												<span class="badge badge-ghost badge-sm">Column {result.error.column}</span>
											{/if}
										</div>
									{/if}
								</div>

								<div class="mt-3 text-sm text-base-content/70">
									<p>💡 Common fixes:</p>
									<ul class="list-disc ml-4 mt-1 space-y-1">
										<li>Check indentation (use spaces, not tabs)</li>
										<li>Ensure colons have a space after them</li>
										<li>Quote strings with special characters</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- YAML Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">YAML Syntax Tips</h4>
				<div class="grid gap-2 text-xs sm:grid-cols-2">
					<div><code class="bg-base-300 px-1 rounded">key: value</code> — Basic pair</div>
					<div><code class="bg-base-300 px-1 rounded">- item</code> — List item</div>
					<div><code class="bg-base-300 px-1 rounded">"string"</code> — Quoted string</div>
					<div><code class="bg-base-300 px-1 rounded"># comment</code> — Comment</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

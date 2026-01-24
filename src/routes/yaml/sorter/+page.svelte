<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import yaml from 'js-yaml';

	// State
	let input = $state('');
	let recursive = $state(true);
	let indent = $state(2);

	// Sample YAML
	const sampleYaml = `zebra: animal
apple: fruit
database:
  port: 5432
  host: localhost
  credentials:
    password: secret
    username: admin
features:
  - logging
  - authentication
  - caching`;

	// Sort keys
	function sortYamlKeys(obj: unknown, isRecursive: boolean): unknown {
		if (Array.isArray(obj)) {
			return isRecursive ? obj.map(item => sortYamlKeys(item, isRecursive)) : obj;
		}
		if (typeof obj === 'object' && obj !== null) {
			const sorted: Record<string, unknown> = {};
			const keys = Object.keys(obj as Record<string, unknown>).sort();
			for (const key of keys) {
				sorted[key] = isRecursive 
					? sortYamlKeys((obj as Record<string, unknown>)[key], isRecursive)
					: (obj as Record<string, unknown>)[key];
			}
			return sorted;
		}
		return obj;
	}

	function sortYaml(): { success: boolean; output: string; error?: string } {
		if (!input.trim()) {
			return { success: true, output: '' };
		}

		try {
			const parsed = yaml.load(input);
			const sorted = sortYamlKeys(parsed, recursive);
			const output = yaml.dump(sorted, {
				indent: indent,
				lineWidth: -1,
				noRefs: true,
				sortKeys: false // We already sorted
			});
			return { success: true, output };
		} catch (e) {
			const err = e as yaml.YAMLException;
			return { success: false, output: '', error: err.reason || err.message };
		}
	}

	let result = $derived(sortYaml());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function downloadOutput() {
		if (result.output) {
			const blob = new Blob([result.output], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'sorted.yaml';
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Settings -->
		<div class="flex flex-wrap gap-4 items-center justify-center">
			<label class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2 cursor-pointer">
				<input type="checkbox" bind:checked={recursive} class="checkbox checkbox-sm checkbox-primary" />
				<span class="text-sm font-medium">Sort recursively</span>
			</label>
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Indent:</span>
				<select bind:value={indent} class="select select-sm select-ghost">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
							<span>📄</span>
						</div>
						<h3 class="font-bold">Original YAML</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your YAML here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Output -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
								<span>🔤</span>
							</div>
							<h3 class="font-bold">Sorted YAML</h3>
						</div>
						{#if result.success && result.output}
							<div class="flex gap-1">
								<CopyButton text={result.output} size="sm" />
								<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>
							</div>
						{/if}
					</div>

					{#if result.error}
						<div class="alert alert-error rounded-lg mb-3">
							<span class="text-sm">{result.error}</span>
						</div>
					{/if}

					<textarea
						value={result.output}
						readonly
						placeholder="Sorted YAML will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed bg-base-100"
					></textarea>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import * as yaml from 'js-yaml';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { k8sToolsContent } from '$lib/config/content/k8s-tools-content';

	const content = k8sToolsContent['splitter'];
	import JSZip from 'jszip';

	// State
	let input = $state('');
	let selectedDocs = $state<Set<number>>(new Set());

	// Sample multi-doc YAML
	const sampleYaml = `---
apiVersion: v1
kind: Namespace
metadata:
  name: myapp
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: myapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    spec:
      containers:
      - name: web
        image: nginx:1.21
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: myapp
spec:
  ports:
  - port: 80
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: myapp
data:
  LOG_LEVEL: info`;

	interface ParsedDoc {
		index: number;
		kind: string;
		name: string;
		namespace?: string;
		filename: string;
		content: string;
		raw: unknown;
	}

	// Parse multi-doc YAML
	function parseDocuments(): { success: boolean; docs: ParsedDoc[]; error?: string } {
		if (!input.trim()) {
			return { success: true, docs: [] };
		}

		try {
			const rawDocs = input.split(/^---$/m).filter((d) => d.trim());
			const docs: ParsedDoc[] = [];

			rawDocs.forEach((rawContent, i) => {
				try {
					const parsed = yaml.load(rawContent) as Record<string, unknown>;
					if (!parsed || typeof parsed !== 'object') return;

					const kind = (parsed.kind as string) || 'unknown';
					const metadata = parsed.metadata as Record<string, unknown> | undefined;
					const name = (metadata?.name as string) || 'unnamed';
					const namespace = metadata?.namespace as string | undefined;

					// Generate filename
					const filename = `${kind.toLowerCase()}-${name}.yaml`;

					docs.push({
						index: i,
						kind,
						name,
						namespace,
						filename,
						content: rawContent.trim(),
						raw: parsed
					});
				} catch {
					// Skip invalid docs
				}
			});

			return { success: true, docs };
		} catch (e) {
			return { success: false, docs: [], error: (e as Error).message };
		}
	}

	let result = $derived(parseDocuments());

	// Auto-select all on parse
	$effect(() => {
		if (result.docs.length > 0 && selectedDocs.size === 0) {
			selectedDocs = new Set(result.docs.map((d) => d.index));
		}
	});

	function loadSample() {
		input = sampleYaml;
		selectedDocs = new Set();
	}

	function clearAll() {
		input = '';
		selectedDocs = new Set();
	}

	function toggleDoc(index: number) {
		const newSet = new Set(selectedDocs);
		if (newSet.has(index)) {
			newSet.delete(index);
		} else {
			newSet.add(index);
		}
		selectedDocs = newSet;
	}

	function selectAll() {
		selectedDocs = new Set(result.docs.map((d) => d.index));
	}

	function selectNone() {
		selectedDocs = new Set();
	}

	async function downloadZip() {
		const zip = new JSZip();
		const selectedDocsList = result.docs.filter((d) => selectedDocs.has(d.index));

		// Handle filename collisions
		const usedNames = new Map<string, number>();
		selectedDocsList.forEach((doc) => {
			let filename = doc.filename;
			const count = usedNames.get(filename) || 0;
			if (count > 0) {
				filename = `${doc.kind.toLowerCase()}-${doc.name}-${count}.yaml`;
			}
			usedNames.set(doc.filename, count + 1);
			zip.file(filename, `---\n${doc.content}\n`);
		});

		const blob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'k8s-manifests.zip';
		a.click();
		URL.revokeObjectURL(url);
	}

	function copySelected() {
		const selectedDocsList = result.docs.filter((d) => selectedDocs.has(d.index));
		const content = selectedDocsList.map((d) => `---\n${d.content}`).join('\n');
		navigator.clipboard.writeText(content);
	}

	let stats = $derived({
		docs: result.docs.length > 0 ? result.docs.length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card h-fit rounded-2xl bg-base-200">
				<div class="card-body p-4">
					<h3 class="mb-2 text-sm font-bold">Multi-Document YAML</h3>
					<textarea
						bind:value={input}
						placeholder="Paste multi-doc K8s YAML (separated by ---)..."
						class="textarea-bordered textarea min-h-72 w-full font-mono text-xs leading-relaxed"
						spellcheck="false"></textarea>
				</div>
			</div>

			<!-- Documents List -->
			<div class="space-y-4">
				{#if result.error}
					<div class="alert rounded-xl alert-error">
						<span>{result.error}</span>
					</div>
				{:else if result.docs.length > 0}
					<!-- Header -->
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<h3 class="font-bold">Found {result.docs.length} document(s)</h3>
							<span class="badge badge-ghost badge-sm">{selectedDocs.size} selected</span>
						</div>
						<div class="flex gap-1">
							<button class="btn btn-ghost btn-xs" onclick={selectAll}>All</button>
							<button class="btn btn-ghost btn-xs" onclick={selectNone}>None</button>
						</div>
					</div>

					<!-- Documents -->
					<div class="max-h-64 space-y-2 overflow-y-auto">
						{#each result.docs as doc}
							<div
								class="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors
									{selectedDocs.has(doc.index)
									? 'border border-primary/20 bg-primary/10'
									: 'bg-base-200 hover:bg-base-300'}"
								onclick={() => toggleDoc(doc.index)}
							>
								<input
									type="checkbox"
									checked={selectedDocs.has(doc.index)}
									class="checkbox checkbox-sm checkbox-primary"
									onclick={(e) => e.stopPropagation()}
									onchange={() => toggleDoc(doc.index)}
								/>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2">
										<span class="badge badge-ghost badge-sm">{doc.kind}</span>
										<span class="truncate font-mono text-sm font-bold">{doc.name}</span>
									</div>
									{#if doc.namespace}
										<span class="text-xs text-base-content/50">namespace: {doc.namespace}</span>
									{/if}
								</div>
								<span class="font-mono text-xs text-base-content/50">{doc.filename}</span>
							</div>
						{/each}
					</div>

					<!-- Actions -->
					<div class="flex gap-2">
						<button
							class="btn flex-1 btn-primary"
							disabled={selectedDocs.size === 0}
							onclick={downloadZip}
						>
							Download ZIP ({selectedDocs.size})
						</button>
						<button class="btn btn-ghost" disabled={selectedDocs.size === 0} onclick={copySelected}>
							Copy
						</button>
					</div>
				{:else}
					<div class="card rounded-xl bg-base-200">
						<div class="card-body p-6 text-center text-base-content/50">
							<p>Paste multi-doc YAML to split</p>
							<p class="mt-1 text-xs">Documents should be separated by <code>---</code></p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Info -->
		<div class="card rounded-xl border border-info/20 bg-info/10">
			<div class="card-body p-3">
				<p class="text-sm text-base-content/70">
					<strong>Tip:</strong> Files are named <code>{'{kind}'}-{'{name}'}.yaml</code>. Duplicates
					are automatically numbered.
				</p>
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

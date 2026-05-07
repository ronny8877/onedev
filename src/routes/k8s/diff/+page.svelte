<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import yaml from 'js-yaml';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { k8sToolsContent } from '$lib/config/content/k8s-tools-content';

	const content = k8sToolsContent['diff'];

	// State
	let leftInput = $state('');
	let rightInput = $state('');
	let showUnchanged = $state(false);

	// Sample K8s YAML
	const sampleLeft = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: default
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80`;

	const sampleRight = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          limits:
            memory: "128Mi"`;

	type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

	interface DiffItem {
		path: string;
		type: DiffType;
		leftValue?: unknown;
		rightValue?: unknown;
		breaking?: boolean;
	}

	interface DiffResult {
		success: boolean;
		error?: string;
		resourceId?: string;
		kind?: string;
		name?: string;
		diffs: DiffItem[];
	}

	// Breaking change fields
	const breakingFields = ['image', 'replicas', 'containerPort', 'port', 'targetPort', 'resources', 'env'];

	// Semantic diff between two objects
	function semanticDiff(left: unknown, right: unknown, path: string = ''): DiffItem[] {
		const diffs: DiffItem[] = [];

		// Both null/undefined
		if (left === right) {
			if (showUnchanged && path) {
				diffs.push({ path, type: 'unchanged', leftValue: left, rightValue: right });
			}
			return diffs;
		}

		// One is null
		if (left === null || left === undefined) {
			diffs.push({ path: path || 'root', type: 'added', rightValue: right });
			return diffs;
		}
		if (right === null || right === undefined) {
			diffs.push({ path: path || 'root', type: 'removed', leftValue: left });
			return diffs;
		}

		// Different types
		if (typeof left !== typeof right) {
			const fieldName = path.split('.').pop() || '';
			diffs.push({ 
				path: path || 'root', 
				type: 'changed', 
				leftValue: left, 
				rightValue: right,
				breaking: breakingFields.includes(fieldName)
			});
			return diffs;
		}

		// Arrays
		if (Array.isArray(left) && Array.isArray(right)) {
			const maxLen = Math.max(left.length, right.length);
			for (let i = 0; i < maxLen; i++) {
				const itemPath = `${path}[${i}]`;
				if (i >= left.length) {
					diffs.push({ path: itemPath, type: 'added', rightValue: right[i] });
				} else if (i >= right.length) {
					diffs.push({ path: itemPath, type: 'removed', leftValue: left[i] });
				} else {
					diffs.push(...semanticDiff(left[i], right[i], itemPath));
				}
			}
			return diffs;
		}

		// Objects
		if (typeof left === 'object' && typeof right === 'object') {
			const leftObj = left as Record<string, unknown>;
			const rightObj = right as Record<string, unknown>;
			const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);

			for (const key of allKeys) {
				const keyPath = path ? `${path}.${key}` : key;
				if (!(key in leftObj)) {
					diffs.push({ path: keyPath, type: 'added', rightValue: rightObj[key] });
				} else if (!(key in rightObj)) {
					diffs.push({ path: keyPath, type: 'removed', leftValue: leftObj[key] });
				} else {
					diffs.push(...semanticDiff(leftObj[key], rightObj[key], keyPath));
				}
			}
			return diffs;
		}

		// Primitives
		if (left !== right) {
			const fieldName = path.split('.').pop() || '';
			diffs.push({ 
				path: path || 'root', 
				type: 'changed', 
				leftValue: left, 
				rightValue: right,
				breaking: breakingFields.includes(fieldName)
			});
		} else if (showUnchanged && path) {
			diffs.push({ path, type: 'unchanged', leftValue: left, rightValue: right });
		}

		return diffs;
	}

	// Parse and compare
	function compareManifests(): DiffResult {
		if (!leftInput.trim() || !rightInput.trim()) {
			return { success: true, diffs: [] };
		}

		try {
			const left = yaml.load(leftInput) as Record<string, unknown>;
			const right = yaml.load(rightInput) as Record<string, unknown>;

			if (!left || !right) {
				return { success: false, error: 'Invalid YAML', diffs: [] };
			}

			const kind = (left.kind || right.kind) as string;
			const leftMeta = left.metadata as Record<string, unknown> | undefined;
			const rightMeta = right.metadata as Record<string, unknown> | undefined;
			const name = (leftMeta?.name || rightMeta?.name) as string;
			const resourceId = `${kind}/${name}`;

			const diffs = semanticDiff(left, right);
			
			return { success: true, resourceId, kind, name, diffs };
		} catch (e) {
			return { success: false, error: (e as Error).message, diffs: [] };
		}
	}

	let result = $derived(compareManifests());

	function loadSample() {
		leftInput = sampleLeft;
		rightInput = sampleRight;
	}

	function clearAll() {
		leftInput = '';
		rightInput = '';
	}

	function formatValue(val: unknown): string {
		if (val === null || val === undefined) return 'null';
		if (typeof val === 'object') return JSON.stringify(val);
		return String(val);
	}

	function copyDiffSummary() {
		const lines: string[] = [];
		lines.push(`# K8s Resource Diff: ${result.resourceId || 'Unknown'}`);
		lines.push('');
		
		const added = result.diffs.filter(d => d.type === 'added');
		const removed = result.diffs.filter(d => d.type === 'removed');
		const changed = result.diffs.filter(d => d.type === 'changed');

		if (added.length > 0) {
			lines.push('## Added');
			added.forEach(d => lines.push(`+ ${d.path}: ${formatValue(d.rightValue)}`));
			lines.push('');
		}
		if (removed.length > 0) {
			lines.push('## Removed');
			removed.forEach(d => lines.push(`- ${d.path}: ${formatValue(d.leftValue)}`));
			lines.push('');
		}
		if (changed.length > 0) {
			lines.push('## Changed');
			changed.forEach(d => lines.push(`~ ${d.path}: ${formatValue(d.leftValue)} → ${formatValue(d.rightValue)}`));
		}

		navigator.clipboard.writeText(lines.join('\n'));
	}

	let addedCount = $derived(result.diffs.filter(d => d.type === 'added').length);
	let removedCount = $derived(result.diffs.filter(d => d.type === 'removed').length);
	let changedCount = $derived(result.diffs.filter(d => d.type === 'changed').length);
	let breakingCount = $derived(result.diffs.filter(d => d.breaking).length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Two-pane Input -->
		<div class="grid gap-4 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-2">Original / Local</h3>
					<textarea
						bind:value={leftInput}
						placeholder="Paste local/original K8s YAML..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-48 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-2">Modified / Remote</h3>
					<textarea
						bind:value={rightInput}
						placeholder="Paste modified/remote K8s YAML..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-48 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Error -->
		{#if result.error}
			<div class="alert alert-error rounded-xl">
				<span>{result.error}</span>
			</div>
		{/if}

		<!-- Diff Results -->
		{#if result.success && leftInput.trim() && rightInput.trim()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<!-- Header -->
					<div class="flex items-center justify-between mb-4 flex-wrap gap-2">
						<div class="flex items-center gap-3">
							<h3 class="font-bold">{result.kind}/{result.name}</h3>
							<div class="flex gap-1">
								{#if addedCount > 0}
									<span class="badge badge-success badge-sm">+{addedCount}</span>
								{/if}
								{#if removedCount > 0}
									<span class="badge badge-error badge-sm">-{removedCount}</span>
								{/if}
								{#if changedCount > 0}
									<span class="badge badge-warning badge-sm">~{changedCount}</span>
								{/if}
							</div>
							{#if breakingCount > 0}
								<span class="badge badge-error">⚠ {breakingCount} breaking</span>
							{/if}
						</div>
						<button class="btn btn-sm btn-ghost" onclick={copyDiffSummary}>Copy Summary</button>
					</div>

					<!-- Toggle -->
					<label class="flex items-center gap-2 mb-3">
						<input type="checkbox" bind:checked={showUnchanged} class="checkbox checkbox-xs" />
						<span class="text-xs">Show unchanged fields</span>
					</label>

					<!-- Diff List -->
					{#if result.diffs.filter(d => d.type !== 'unchanged' || showUnchanged).length === 0}
						<div class="text-center py-6 text-success">
							<p class="font-bold">No differences found</p>
							<p class="text-sm text-base-content/60">Resources are identical</p>
						</div>
					{:else}
						<div class="space-y-1 max-h-72 overflow-y-auto">
							{#each result.diffs.filter(d => d.type !== 'unchanged' || showUnchanged) as diff}
								<div class="flex items-start gap-2 p-2 rounded text-sm font-mono
									{diff.type === 'added' ? 'bg-success/10 text-success' : ''}
									{diff.type === 'removed' ? 'bg-error/10 text-error' : ''}
									{diff.type === 'changed' ? 'bg-warning/10 text-warning' : ''}
									{diff.type === 'unchanged' ? 'bg-base-300/30 text-base-content/50' : ''}
								">
									<span class="shrink-0 w-4">
										{#if diff.type === 'added'}+{:else if diff.type === 'removed'}-{:else if diff.type === 'changed'}~{:else}={/if}
									</span>
									<span class="font-bold shrink-0">{diff.path}</span>
									<span class="flex-1 truncate text-base-content/70">
										{#if diff.type === 'changed'}
											{formatValue(diff.leftValue)} → {formatValue(diff.rightValue)}
										{:else if diff.type === 'added'}
											{formatValue(diff.rightValue)}
										{:else if diff.type === 'removed'}
											{formatValue(diff.leftValue)}
										{:else}
											{formatValue(diff.leftValue)}
										{/if}
									</span>
									{#if diff.breaking}
										<span class="badge badge-error badge-xs">breaking</span>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{:else if !leftInput.trim() || !rightInput.trim()}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-6 text-center text-base-content/50">
					<p>Paste two K8s manifests to compare</p>
				</div>
			</div>
		{/if}

		<!-- Legend -->
		<div class="flex flex-wrap gap-4 justify-center text-xs">
			<span class="flex items-center gap-1"><span class="badge badge-success badge-xs">+</span> Added</span>
			<span class="flex items-center gap-1"><span class="badge badge-error badge-xs">-</span> Removed</span>
			<span class="flex items-center gap-1"><span class="badge badge-warning badge-xs">~</span> Changed</span>
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

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
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

	const content = k8sToolsContent['inspector'];

	// State
	let input = $state('');

	// Sample K8s YAML
	const sampleYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  namespace: production
  labels:
    app: nginx
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"`;

	// K8s resource types with required fields (minimal icons)
	const k8sResourceTypes: Record<string, { color: string; requiredFields: string[] }> = {
		Pod: { color: 'success', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.containers'] },
		Deployment: { color: 'primary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.selector', 'spec.template'] },
		Service: { color: 'info', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.ports'] },
		ConfigMap: { color: 'warning', requiredFields: ['apiVersion', 'kind', 'metadata.name'] },
		Secret: { color: 'error', requiredFields: ['apiVersion', 'kind', 'metadata.name'] },
		Ingress: { color: 'accent', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.rules'] },
		StatefulSet: { color: 'primary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.serviceName', 'spec.template'] },
		DaemonSet: { color: 'secondary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.selector', 'spec.template'] },
		Job: { color: 'info', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.template'] },
		CronJob: { color: 'warning', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.schedule', 'spec.jobTemplate'] },
		PersistentVolumeClaim: { color: 'accent', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.accessModes', 'spec.resources'] },
		PersistentVolume: { color: 'secondary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.capacity', 'spec.accessModes'] },
		ServiceAccount: { color: 'info', requiredFields: ['apiVersion', 'kind', 'metadata.name'] },
		Role: { color: 'warning', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'rules'] },
		RoleBinding: { color: 'error', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'roleRef', 'subjects'] },
		ClusterRole: { color: 'primary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'rules'] },
		ClusterRoleBinding: { color: 'secondary', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'roleRef', 'subjects'] },
		Namespace: { color: 'success', requiredFields: ['apiVersion', 'kind', 'metadata.name'] },
		HorizontalPodAutoscaler: { color: 'info', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.scaleTargetRef'] },
		NetworkPolicy: { color: 'warning', requiredFields: ['apiVersion', 'kind', 'metadata.name', 'spec.podSelector'] }
	};

	interface ValidationIssue {
		type: 'error' | 'warning';
		message: string;
		field?: string;
	}

	interface K8sAnalysis {
		isValid: boolean;
		isK8s: boolean;
		parseError?: string;
		kind?: string;
		apiVersion?: string;
		name?: string;
		namespace?: string;
		labels?: Record<string, string>;
		annotations?: Record<string, string>;
		resourceInfo?: { color: string };
		issues: ValidationIssue[];
		summary: Record<string, unknown>;
	}

	// Get nested value from object
	function getNestedValue(obj: unknown, path: string): unknown {
		const parts = path.split('.');
		let current: unknown = obj;
		for (const part of parts) {
			if (current === null || current === undefined || typeof current !== 'object') {
				return undefined;
			}
			current = (current as Record<string, unknown>)[part];
		}
		return current;
	}

	// Analyze K8s YAML
	function analyzeK8s(): K8sAnalysis {
		if (!input.trim()) {
			return { isValid: true, isK8s: false, issues: [], summary: {} };
		}

		try {
			const parsed = yaml.load(input) as Record<string, unknown>;
			
			if (!parsed || typeof parsed !== 'object') {
				return { isValid: false, isK8s: false, parseError: 'Invalid YAML structure', issues: [], summary: {} };
			}

			const kind = parsed.kind as string | undefined;
			const apiVersion = parsed.apiVersion as string | undefined;
			const metadata = parsed.metadata as Record<string, unknown> | undefined;
			const name = metadata?.name as string | undefined;
			const namespace = metadata?.namespace as string | undefined;
			const labels = metadata?.labels as Record<string, string> | undefined;
			const annotations = metadata?.annotations as Record<string, string> | undefined;

			const issues: ValidationIssue[] = [];
			const isK8s = !!(kind && apiVersion);

			if (!isK8s) {
				if (!kind) issues.push({ type: 'warning', message: 'No "kind" field. This may not be a K8s manifest.' });
				if (!apiVersion) issues.push({ type: 'warning', message: 'No "apiVersion" field. This may not be a K8s manifest.' });
				return { isValid: true, isK8s: false, issues, summary: parsed };
			}

			// Check required fields for known resource types
			const resourceInfo = k8sResourceTypes[kind];
			if (resourceInfo) {
				for (const field of resourceInfo.requiredFields) {
					if (getNestedValue(parsed, field) === undefined) {
						issues.push({ type: 'error', message: `Missing: ${field}`, field });
					}
				}
			} else {
				issues.push({ type: 'warning', message: `Unknown resource: ${kind}` });
			}

			// Common validations
			if (!name) {
				issues.push({ type: 'error', message: 'Missing metadata.name', field: 'metadata.name' });
			}

			// Check for deprecated API versions
			if (apiVersion?.includes('extensions/v1beta1')) {
				issues.push({ type: 'warning', message: 'Deprecated API. Use apps/v1.' });
			}
			if (apiVersion?.includes('v1beta1') && kind === 'Ingress') {
				issues.push({ type: 'warning', message: 'Ingress v1beta1 deprecated. Use networking.k8s.io/v1.' });
			}

			// Check for container specs in workloads
			const containers = getNestedValue(parsed, 'spec.template.spec.containers') as unknown[] | undefined ||
			                   getNestedValue(parsed, 'spec.containers') as unknown[] | undefined;
			if (containers && Array.isArray(containers)) {
				containers.forEach((container, i) => {
					const c = container as Record<string, unknown>;
					if (!c.name) {
						issues.push({ type: 'error', message: `Container ${i + 1} missing "name"` });
					}
					if (!c.image) {
						issues.push({ type: 'error', message: `Container "${c.name || i + 1}" missing "image"` });
					}
					if (!c.resources) {
						issues.push({ type: 'warning', message: `Container "${c.name}" has no resource limits` });
					}
				});
			}

			// Build summary
			const summary: Record<string, unknown> = {};
			if (kind === 'Deployment' || kind === 'StatefulSet' || kind === 'DaemonSet') {
				summary['Replicas'] = getNestedValue(parsed, 'spec.replicas') ?? 'Not set';
				const containersList = containers?.map((c: unknown) => {
					const container = c as Record<string, unknown>;
					return `${container.image}`;
				});
				summary['Images'] = containersList?.join(', ') || 'None';
			}
			if (kind === 'Service') {
				summary['Type'] = getNestedValue(parsed, 'spec.type') ?? 'ClusterIP';
				const ports = getNestedValue(parsed, 'spec.ports') as unknown[] | undefined;
				summary['Ports'] = ports?.map((p: unknown) => {
					const port = p as Record<string, unknown>;
					return `${port.port}:${port.targetPort}`;
				}).join(', ') || 'None';
			}
			if (kind === 'CronJob') {
				summary['Schedule'] = getNestedValue(parsed, 'spec.schedule') ?? 'Not set';
			}

			return {
				isValid: issues.filter(i => i.type === 'error').length === 0,
				isK8s: true,
				kind,
				apiVersion,
				name,
				namespace,
				labels,
				annotations,
				resourceInfo,
				issues,
				summary
			};
		} catch (e) {
			const err = e as yaml.YAMLException;
			return {
				isValid: false,
				isK8s: false,
				parseError: err.reason || err.message,
				issues: [],
				summary: {}
			};
		}
	}

	let result = $derived(analyzeK8s());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined
	});

	let errorCount = $derived(result.issues.filter(i => i.type === 'error').length);
	let warningCount = $derived(result.issues.filter(i => i.type === 'warning').length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl h-fit">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<AppIcon name="ship-wheel" size={18} />
						<h3 class="font-bold">Kubernetes YAML</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your Kubernetes YAML manifest..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-80 resize-y leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Analysis Results -->
			<div class="space-y-4">
				{#if result.parseError}
					<div class="alert alert-error rounded-xl">
						<span>Parse Error: {result.parseError}</span>
					</div>
				{:else if result.isK8s}
					<!-- Resource Summary Card -->
					<div class="card bg-base-200 rounded-2xl">
						<div class="card-body p-4">
							<div class="flex items-center justify-between mb-4">
								<div>
									<div class="flex items-center gap-2">
										<h3 class="text-xl font-bold">{result.kind}</h3>
										<span class="badge badge-{result.resourceInfo?.color || 'ghost'} badge-sm">{result.apiVersion}</span>
									</div>
									<p class="text-base-content/70 font-mono text-sm">{result.name}</p>
								</div>
								{#if result.isValid}
									<span class="badge badge-success">Valid</span>
								{:else}
									<span class="badge badge-error">Issues</span>
								{/if}
							</div>

							<!-- Metadata -->
							<div class="grid gap-3 sm:grid-cols-2">
								<div class="p-3 bg-base-300/50 rounded-lg">
									<p class="text-xs text-base-content/60 mb-1">Name</p>
									<p class="font-mono text-sm font-bold truncate">{result.name || '—'}</p>
								</div>
								<div class="p-3 bg-base-300/50 rounded-lg">
									<p class="text-xs text-base-content/60 mb-1">Namespace</p>
									<p class="font-mono text-sm font-bold">{result.namespace || 'default'}</p>
								</div>
							</div>

							<!-- Labels -->
							{#if result.labels && Object.keys(result.labels).length > 0}
								<div class="mt-3">
									<p class="text-xs text-base-content/60 mb-2">Labels</p>
									<div class="flex flex-wrap gap-1">
										{#each Object.entries(result.labels) as [key, value]}
											<span class="badge badge-sm badge-ghost font-mono">{key}={value}</span>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Type-specific Summary -->
							{#if Object.keys(result.summary).length > 0}
								<div class="mt-3 pt-3 border-t border-base-300">
									<div class="space-y-1">
										{#each Object.entries(result.summary) as [key, value]}
											<div class="flex justify-between text-sm">
												<span class="text-base-content/70">{key}</span>
												<span class="font-mono font-medium truncate max-w-48">{value}</span>
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Validation Issues -->
					{#if result.issues.length > 0}
						<div class="card bg-base-200 rounded-xl">
							<div class="card-body p-4">
								<div class="flex items-center justify-between mb-3">
									<h4 class="font-bold text-sm">Validation</h4>
									<div class="flex gap-2">
										{#if errorCount > 0}
											<span class="badge badge-error badge-sm">{errorCount} error(s)</span>
										{/if}
										{#if warningCount > 0}
											<span class="badge badge-warning badge-sm">{warningCount} warning(s)</span>
										{/if}
									</div>
								</div>
								<div class="space-y-1 max-h-40 overflow-y-auto">
									{#each result.issues as issue}
										<div class="flex items-center gap-2 p-2 rounded text-sm {issue.type === 'error' ? 'bg-error/10' : 'bg-warning/10'}">
											<span class="{issue.type === 'error' ? 'text-error' : 'text-warning'}">
												{issue.type === 'error' ? '✗' : '⚠'}
											</span>
											<span class="flex-1">{issue.message}</span>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div class="card bg-success/10 border border-success/20 rounded-xl">
							<div class="card-body p-4 text-center">
								<p class="font-bold text-success">No issues found</p>
							</div>
						</div>
					{/if}
				{:else if input.trim() && !result.isK8s}
					<div class="card bg-warning/10 border border-warning/20 rounded-xl">
						<div class="card-body p-4">
							<h4 class="font-bold text-warning mb-2">Not a K8s Manifest</h4>
							<p class="text-sm text-base-content/70">K8s manifests require <code>apiVersion</code> and <code>kind</code> fields.</p>
						</div>
					</div>
				{:else}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-6 text-center text-base-content/50">
							<p>Paste a Kubernetes YAML manifest to analyze</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Supported Resource Types -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">Supported Resources</h4>
				<div class="flex flex-wrap gap-1 text-xs">
					{#each Object.keys(k8sResourceTypes) as kind}
						<span class="badge badge-ghost badge-sm">{kind}</span>
					{/each}
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

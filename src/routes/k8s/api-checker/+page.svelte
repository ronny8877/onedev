<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import yaml from 'js-yaml';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { k8sToolsContent } from '$lib/config/content/k8s-tools-content';

	const content = k8sToolsContent['api-checker'];

	// State
	let input = $state('');
	let targetVersion = $state('1.29');

	// Sample YAML with deprecated APIs
	const sampleYaml = `apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: myapp
          servicePort: 80
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    spec:
      containers:
      - name: app
        image: myapp:latest`;

	// K8s API deprecation database
	const apiDeprecations: Record<string, {
		deprecated?: string;
		removed?: string;
		replacement?: string;
		docs?: string;
	}> = {
		'extensions/v1beta1:Ingress': {
			deprecated: '1.14',
			removed: '1.22',
			replacement: 'networking.k8s.io/v1',
			docs: 'https://kubernetes.io/docs/concepts/services-networking/ingress/'
		},
		'extensions/v1beta1:Deployment': {
			deprecated: '1.8',
			removed: '1.16',
			replacement: 'apps/v1'
		},
		'extensions/v1beta1:DaemonSet': {
			deprecated: '1.8',
			removed: '1.16',
			replacement: 'apps/v1'
		},
		'extensions/v1beta1:ReplicaSet': {
			deprecated: '1.8',
			removed: '1.16',
			replacement: 'apps/v1'
		},
		'apps/v1beta1:Deployment': {
			deprecated: '1.9',
			removed: '1.16',
			replacement: 'apps/v1'
		},
		'apps/v1beta2:Deployment': {
			deprecated: '1.9',
			removed: '1.16',
			replacement: 'apps/v1'
		},
		'networking.k8s.io/v1beta1:Ingress': {
			deprecated: '1.19',
			removed: '1.22',
			replacement: 'networking.k8s.io/v1'
		},
		'rbac.authorization.k8s.io/v1beta1:Role': {
			deprecated: '1.17',
			removed: '1.22',
			replacement: 'rbac.authorization.k8s.io/v1'
		},
		'rbac.authorization.k8s.io/v1beta1:RoleBinding': {
			deprecated: '1.17',
			removed: '1.22',
			replacement: 'rbac.authorization.k8s.io/v1'
		},
		'rbac.authorization.k8s.io/v1beta1:ClusterRole': {
			deprecated: '1.17',
			removed: '1.22',
			replacement: 'rbac.authorization.k8s.io/v1'
		},
		'rbac.authorization.k8s.io/v1beta1:ClusterRoleBinding': {
			deprecated: '1.17',
			removed: '1.22',
			replacement: 'rbac.authorization.k8s.io/v1'
		},
		'admissionregistration.k8s.io/v1beta1:MutatingWebhookConfiguration': {
			deprecated: '1.16',
			removed: '1.22',
			replacement: 'admissionregistration.k8s.io/v1'
		},
		'admissionregistration.k8s.io/v1beta1:ValidatingWebhookConfiguration': {
			deprecated: '1.16',
			removed: '1.22',
			replacement: 'admissionregistration.k8s.io/v1'
		},
		'apiextensions.k8s.io/v1beta1:CustomResourceDefinition': {
			deprecated: '1.16',
			removed: '1.22',
			replacement: 'apiextensions.k8s.io/v1'
		},
		'batch/v1beta1:CronJob': {
			deprecated: '1.21',
			removed: '1.25',
			replacement: 'batch/v1'
		},
		'policy/v1beta1:PodDisruptionBudget': {
			deprecated: '1.21',
			removed: '1.25',
			replacement: 'policy/v1'
		},
		'policy/v1beta1:PodSecurityPolicy': {
			deprecated: '1.21',
			removed: '1.25',
			replacement: 'None (removed)'
		},
		'autoscaling/v2beta1:HorizontalPodAutoscaler': {
			deprecated: '1.23',
			removed: '1.26',
			replacement: 'autoscaling/v2'
		},
		'flowcontrol.apiserver.k8s.io/v1beta1:FlowSchema': {
			deprecated: '1.23',
			removed: '1.26',
			replacement: 'flowcontrol.apiserver.k8s.io/v1beta3'
		},
		'flowcontrol.apiserver.k8s.io/v1beta2:FlowSchema': {
			deprecated: '1.26',
			removed: '1.29',
			replacement: 'flowcontrol.apiserver.k8s.io/v1'
		}
	};

	const k8sVersions = ['1.25', '1.26', '1.27', '1.28', '1.29', '1.30'];

	interface ApiCheckResult {
		apiVersion: string;
		kind: string;
		name: string;
		status: 'ok' | 'deprecated' | 'removed';
		deprecatedIn?: string;
		removedIn?: string;
		replacement?: string;
		docs?: string;
	}

	// Compare versions (e.g., "1.22" > "1.21")
	function compareVersions(v1: string, v2: string): number {
		const [major1, minor1] = v1.split('.').map(Number);
		const [major2, minor2] = v2.split('.').map(Number);
		if (major1 !== major2) return major1 - major2;
		return minor1 - minor2;
	}

	// Check APIs
	function checkApis(): { success: boolean; results: ApiCheckResult[]; error?: string } {
		if (!input.trim()) {
			return { success: true, results: [] };
		}

		try {
			const docs = input.split(/^---$/m).filter(d => d.trim());
			const results: ApiCheckResult[] = [];

			for (const docContent of docs) {
				try {
					const doc = yaml.load(docContent) as Record<string, unknown>;
					if (!doc || typeof doc !== 'object') continue;

					const apiVersion = doc.apiVersion as string;
					const kind = doc.kind as string;
					const metadata = doc.metadata as Record<string, unknown> | undefined;
					const name = (metadata?.name as string) || 'unnamed';

					if (!apiVersion || !kind) continue;

					const key = `${apiVersion}:${kind}`;
					const deprecation = apiDeprecations[key];

					if (deprecation) {
						let status: 'ok' | 'deprecated' | 'removed' = 'ok';
						
						if (deprecation.removed && compareVersions(targetVersion, deprecation.removed) >= 0) {
							status = 'removed';
						} else if (deprecation.deprecated && compareVersions(targetVersion, deprecation.deprecated) >= 0) {
							status = 'deprecated';
						}

						results.push({
							apiVersion,
							kind,
							name,
							status,
							deprecatedIn: deprecation.deprecated,
							removedIn: deprecation.removed,
							replacement: deprecation.replacement,
							docs: deprecation.docs
						});
					} else {
						results.push({
							apiVersion,
							kind,
							name,
							status: 'ok'
						});
					}
				} catch {
					// Skip invalid docs
				}
			}

			return { success: true, results };
		} catch (e) {
			return { success: false, results: [], error: (e as Error).message };
		}
	}

	let result = $derived(checkApis());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function copyReport() {
		const lines: string[] = [];
		lines.push(`# K8s API Compatibility Report`);
		lines.push(`Target Version: ${targetVersion}`);
		lines.push('');

		const removed = result.results.filter(r => r.status === 'removed');
		const deprecated = result.results.filter(r => r.status === 'deprecated');
		const ok = result.results.filter(r => r.status === 'ok');

		if (removed.length > 0) {
			lines.push('## Removed APIs (Action Required)');
			removed.forEach(r => {
				lines.push(`- ${r.kind}/${r.name}: ${r.apiVersion}`);
				lines.push(`  Removed in: ${r.removedIn}, Use: ${r.replacement}`);
			});
			lines.push('');
		}

		if (deprecated.length > 0) {
			lines.push('## Deprecated APIs');
			deprecated.forEach(r => {
				lines.push(`- ${r.kind}/${r.name}: ${r.apiVersion}`);
				lines.push(`  Deprecated: ${r.deprecatedIn}, Removed: ${r.removedIn}, Use: ${r.replacement}`);
			});
			lines.push('');
		}

		if (ok.length > 0) {
			lines.push('## OK');
			ok.forEach(r => lines.push(`- ${r.kind}/${r.name}: ${r.apiVersion}`));
		}

		navigator.clipboard.writeText(lines.join('\n'));
	}

	let removedCount = $derived(result.results.filter(r => r.status === 'removed').length);
	let deprecatedCount = $derived(result.results.filter(r => r.status === 'deprecated').length);
	let okCount = $derived(result.results.filter(r => r.status === 'ok').length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Target Version -->
		<div class="flex justify-center">
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Target K8s Version:</span>
				<select bind:value={targetVersion} class="select select-sm select-ghost font-bold">
					{#each k8sVersions as version}
						<option value={version}>{version}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl h-fit">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-2">Kubernetes YAML</h3>
					<textarea
						bind:value={input}
						placeholder="Paste K8s manifests to check API versions..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Results -->
			<div class="space-y-4">
				{#if result.error}
					<div class="alert alert-error rounded-xl">
						<span>{result.error}</span>
					</div>
				{:else if result.results.length > 0}
					<!-- Summary -->
					<div class="flex items-center justify-between">
						<div class="flex gap-2">
							{#if okCount > 0}
								<span class="badge badge-success">{okCount} OK</span>
							{/if}
							{#if deprecatedCount > 0}
								<span class="badge badge-warning">{deprecatedCount} Deprecated</span>
							{/if}
							{#if removedCount > 0}
								<span class="badge badge-error">{removedCount} Removed</span>
							{/if}
						</div>
						<button class="btn btn-sm btn-ghost" onclick={copyReport}>Copy Report</button>
					</div>

					<!-- Results List -->
					<div class="space-y-2 max-h-72 overflow-y-auto">
						{#each result.results as item}
							<div class="p-3 rounded-lg
								{item.status === 'removed' ? 'bg-error/10 border border-error/20' : ''}
								{item.status === 'deprecated' ? 'bg-warning/10 border border-warning/20' : ''}
								{item.status === 'ok' ? 'bg-success/10 border border-success/20' : ''}
							">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="font-bold text-sm">{item.kind}</span>
										<span class="text-xs text-base-content/60 font-mono">{item.name}</span>
									</div>
									<span class="badge badge-sm 
										{item.status === 'removed' ? 'badge-error' : ''}
										{item.status === 'deprecated' ? 'badge-warning' : ''}
										{item.status === 'ok' ? 'badge-success' : ''}
									">
										{item.status === 'removed' ? 'REMOVED' : item.status === 'deprecated' ? 'DEPRECATED' : 'OK'}
									</span>
								</div>
								<div class="text-xs font-mono text-base-content/70 mt-1">
									{item.apiVersion}
								</div>
								{#if item.status !== 'ok'}
									<div class="mt-2 text-xs space-y-1">
										{#if item.deprecatedIn}
											<p>Deprecated: <strong>v{item.deprecatedIn}</strong></p>
										{/if}
										{#if item.removedIn}
											<p>Removed: <strong>v{item.removedIn}</strong></p>
										{/if}
										{#if item.replacement}
											<p class="text-success">Use: <strong>{item.replacement}</strong></p>
										{/if}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-6 text-center text-base-content/50">
							<p>Paste K8s manifests to check for deprecated APIs</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-info/10 border border-info/20 rounded-xl">
			<div class="card-body p-3">
				<p class="text-sm text-base-content/70">
					<strong>Checked APIs:</strong> extensions/v1beta1, apps/v1beta*, networking.k8s.io/v1beta1, 
					rbac.authorization.k8s.io/v1beta1, batch/v1beta1, policy/v1beta1, autoscaling/v2beta*, and more.
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

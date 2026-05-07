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

	const content = k8sToolsContent['helm'];

	// State
	let input = $state('');
	let chartName = $state('mychart');

	// Sample K8s YAML
	const sampleYaml = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: production
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: main
        image: myregistry/myapp:v1.0.0
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          value: postgres://db:5432/myapp
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"`;

	// Templatable field patterns
	const templatablePatterns = [
		{ path: 'image', valueKey: 'image.repository', tagKey: 'image.tag' },
		{ path: 'replicas', valueKey: 'replicaCount' },
		{ path: 'containerPort', valueKey: 'service.port' },
		{ path: 'resources.limits.memory', valueKey: 'resources.limits.memory' },
		{ path: 'resources.limits.cpu', valueKey: 'resources.limits.cpu' },
		{ path: 'resources.requests.memory', valueKey: 'resources.requests.memory' },
		{ path: 'resources.requests.cpu', valueKey: 'resources.requests.cpu' }
	];

	interface HelmOutput {
		success: boolean;
		error?: string;
		values: Record<string, unknown>;
		valuesYaml: string;
		templateSnippets: string[];
	}

	// Extract values from K8s manifest
	function extractHelmValues(): HelmOutput {
		if (!input.trim()) {
			return { success: true, values: {}, valuesYaml: '', templateSnippets: [] };
		}

		try {
			const parsed = yaml.load(input) as Record<string, unknown>;
			if (!parsed || typeof parsed !== 'object') {
				return { success: false, error: 'Invalid YAML', values: {}, valuesYaml: '', templateSnippets: [] };
			}

			const kind = parsed.kind as string;
			const metadata = parsed.metadata as Record<string, unknown> | undefined;
			const spec = parsed.spec as Record<string, unknown> | undefined;

			const values: Record<string, unknown> = {
				nameOverride: '',
				fullnameOverride: metadata?.name || ''
			};

			const templateSnippets: string[] = [];

			// Extract replicas
			if (spec?.replicas !== undefined) {
				values['replicaCount'] = spec.replicas;
				templateSnippets.push(`replicas: {{ .Values.replicaCount }}`);
			}

			// Extract container info
			const templateSpec = (spec?.template as Record<string, unknown>)?.spec as Record<string, unknown>;
			const containers = templateSpec?.containers as Record<string, unknown>[] | undefined;
			
			if (containers && containers.length > 0) {
				const container = containers[0];
				
				// Image
				if (container.image) {
					const imageParts = String(container.image).split(':');
					values['image'] = {
						repository: imageParts[0],
						tag: imageParts[1] || 'latest',
						pullPolicy: 'IfNotPresent'
					};
					templateSnippets.push(`image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"`);
				}

				// Ports
				const ports = container.ports as Record<string, unknown>[] | undefined;
				if (ports && ports.length > 0) {
					values['service'] = {
						type: 'ClusterIP',
						port: ports[0].containerPort
					};
					templateSnippets.push(`containerPort: {{ .Values.service.port }}`);
				}

				// Resources
				if (container.resources) {
					values['resources'] = container.resources;
					templateSnippets.push(`resources:\n{{ toYaml .Values.resources | indent 12 }}`);
				}

				// Env
				const env = container.env as Record<string, unknown>[] | undefined;
				if (env && env.length > 0) {
					const envObj: Record<string, string> = {};
					env.forEach(e => {
						if (e.name && e.value) {
							envObj[String(e.name)] = String(e.value);
						}
					});
					values['env'] = envObj;
					templateSnippets.push(`env:\n{{- range $key, $value := .Values.env }}\n- name: {{ $key }}\n  value: {{ $value | quote }}\n{{- end }}`);
				}
			}

			// Labels
			if (metadata?.labels) {
				values['labels'] = metadata.labels;
			}

			// Namespace
			if (metadata?.namespace) {
				values['namespace'] = metadata.namespace;
				templateSnippets.push(`namespace: {{ .Values.namespace }}`);
			}

			const valuesYaml = yaml.dump(values, { indent: 2, lineWidth: -1 });

			return { success: true, values, valuesYaml, templateSnippets };
		} catch (e) {
			return { success: false, error: (e as Error).message, values: {}, valuesYaml: '', templateSnippets: [] };
		}
	}

	let result = $derived(extractHelmValues());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function downloadValues() {
		if (result.valuesYaml) {
			const blob = new Blob([result.valuesYaml], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'values.yaml';
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	let stats = $derived({
		keys: Object.keys(result.values).length > 0 ? Object.keys(result.values).length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl h-fit">
				<div class="card-body p-4">
					<h3 class="font-bold text-sm mb-2">Kubernetes YAML</h3>
					<textarea
						bind:value={input}
						placeholder="Paste K8s deployment/service YAML..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Output -->
			<div class="space-y-4">
				{#if result.error}
					<div class="alert alert-error rounded-xl">
						<span>{result.error}</span>
					</div>
				{:else if result.valuesYaml}
					<!-- Values.yaml -->
					<div class="card bg-base-200 rounded-2xl">
						<div class="card-body p-4">
							<div class="flex items-center justify-between mb-3">
								<h3 class="font-bold text-sm">values.yaml</h3>
								<div class="flex gap-1">
									<CopyButton text={result.valuesYaml} size="sm" />
									<button class="btn btn-xs btn-ghost" onclick={downloadValues}>Download</button>
								</div>
							</div>
							<pre class="bg-base-100 p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-48">{result.valuesYaml}</pre>
						</div>
					</div>

					<!-- Template Snippets -->
					{#if result.templateSnippets.length > 0}
						<div class="card bg-base-200 rounded-xl">
							<div class="card-body p-4">
								<h3 class="font-bold text-sm mb-3">Template Snippets</h3>
								<div class="space-y-2">
									{#each result.templateSnippets as snippet}
										<div class="bg-base-100 p-2 rounded text-xs font-mono flex items-start gap-2">
											<code class="flex-1 whitespace-pre">{snippet}</code>
											<CopyButton text={snippet} size="sm" />
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				{:else}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-6 text-center text-base-content/50">
							<p>Paste K8s YAML to generate Helm values</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Extracted Fields Legend -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">Extracted Fields</h4>
				<div class="flex flex-wrap gap-2 text-xs">
					<span class="badge badge-ghost">image.repository</span>
					<span class="badge badge-ghost">image.tag</span>
					<span class="badge badge-ghost">replicaCount</span>
					<span class="badge badge-ghost">service.port</span>
					<span class="badge badge-ghost">resources</span>
					<span class="badge badge-ghost">env</span>
					<span class="badge badge-ghost">namespace</span>
					<span class="badge badge-ghost">labels</span>
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

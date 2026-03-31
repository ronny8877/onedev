
export interface K8sToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const k8sToolsContent: Record<string, K8sToolContent> = {
	'api-checker': {
		features: [
			'Detect deprecated and removed Kubernetes API versions in manifests',
			'Coverage for all major Kubernetes versions (1.16 through 1.32+)',
			'Per-resource migration guidance (deprecated → replacement API)',
			'Batch check multiple resources from a single YAML file',
			'Severity classification: deprecated (warning) vs. removed (error)',
			'Direct links to official Kubernetes migration guides',
		],
		useCases: [
			'Audit manifests before upgrading a Kubernetes cluster to a new minor version',
			'Identify resources using removed APIs that will break after an upgrade',
			'Migrate from <code>extensions/v1beta1</code> to <code>apps/v1</code> and similar',
			'Review third-party Helm charts for deprecated API usage',
			'Prepare upgrade runbooks for production Kubernetes clusters',
		],
		concept: {
			title: 'Kubernetes API Versioning & Deprecation',
			content: `<p>Kubernetes uses a versioned API (<code>apiVersion</code>) to allow safe evolution of resource definitions. APIs go through three stability stages: <strong>alpha</strong> (v1alpha1 — may break at any time), <strong>beta</strong> (v1beta1 — stable for 3+ releases), and <strong>GA/stable</strong> (v1 — stable with long support).</p>
<p class="mt-2">When an API is <strong>deprecated</strong>, it still works but produces warnings. When it is <strong>removed</strong> (typically 2-3 minor versions after deprecation), using it causes a hard error. The classic example: <code>extensions/v1beta1</code> Ingress was removed in Kubernetes 1.22 — clusters upgrading past that version would break any Ingress using the old APIVersion.</p>
<p class="mt-2">Checking your manifests proactively before each cluster upgrade is essential DevOps hygiene.</p>`,
		},
		examples: [
			{ label: 'Deprecated Ingress (pre-1.22)', code: 'apiVersion: extensions/v1beta1\nkind: Ingress', isValid: false },
			{ label: 'Current Ingress (1.22+)', code: 'apiVersion: networking.k8s.io/v1\nkind: Ingress', isValid: true },
			{ label: 'Deprecated PodDisruptionBudget', code: 'apiVersion: policy/v1beta1\nkind: PodDisruptionBudget', isValid: false },
		],
		faqs: [
			{
				question: 'How do I know which APIs are removed in my target Kubernetes version?',
				answer: '<p>The official <a href="https://kubernetes.io/docs/reference/using-api/deprecation-guide/" class="text-primary">Kubernetes Deprecation Guide</a> lists all removals by version. This tool automates that lookup: paste your manifests and select the target version to see all affected resources instantly.</p>',
			},
			{
				question: 'What is the difference between deprecated and removed?',
				answer: '<p><strong>Deprecated</strong>: the API still works but you will see warning messages in kubectl output and cluster logs. You have a grace period (usually 2+ minor versions) to migrate. <strong>Removed</strong>: the API endpoint no longer exists. Applying a manifest with a removed API version returns a <code>404 Not Found</code> error from the API server.</p>',
			},
			{
				question: 'How do I migrate from an old API version?',
				answer: '<p>Replace the <code>apiVersion</code> field with the current stable equivalent and update any fields that changed between versions. For example, Ingress moved from <code>extensions/v1beta1</code> to <code>networking.k8s.io/v1</code>, and the <code>backend</code> field structure changed. The API checker provides migration links for each deprecated resource.</p>',
			},
			{
				question: 'Do Helm charts have API deprecation issues?',
				answer: '<p>Yes, frequently. Older Helm charts (especially those not actively maintained) may use deprecated API versions in their templates. Run the rendered output of <code>helm template my-chart</code> through this checker before upgrading a chart on a newer cluster version.</p>',
			},
		],
		relatedTools: [
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Inspect and analyze manifests' },
			{ name: 'K8s Diff', path: '/k8s/diff', description: 'Compare two manifests' },
			{ name: 'Helm Templater', path: '/k8s/helm', description: 'Preview Helm chart output' },
			{ name: 'YAML Validator', path: '/yaml/validator', description: 'Validate YAML syntax' },
		],
		tips: [
			'Run this checker as part of your CI/CD pipeline before every cluster upgrade to catch issues early.',
			'After migrating an API version, validate the new manifest structure with the YAML Validator to verify schema compliance.',
			'Pay extra attention to <code>Ingress</code>, <code>PodDisruptionBudget</code>, <code>HorizontalPodAutoscaler</code>, and <code>CronJob</code> — these have had the most breaking API changes.',
			'Use <code>kubectl convert</code> (with the <code>kubectl-convert</code> plugin) to automatically migrate manifest API versions.',
		],
	},

	diff: {
		features: [
			'Side-by-side visual diff of two Kubernetes YAML manifests',
			'Semantic diff: ignores formatting, compares parsed YAML structure',
			'Highlights added (green), removed (red), and changed (yellow) fields',
			'Key path display for nested changes (e.g., <code>spec.containers[0].image</code>)',
			'Support for multi-document YAML files',
			'Copy diff output in unified diff format',
		],
		useCases: [
			'Compare manifests before and after an image or version upgrade',
			'Review infrastructure-as-code changes before applying to production',
			'Audit what changed between two Helm release revisions',
			'Understand the difference between dev, staging, and prod manifest versions',
			'Debug unexpected behavior by comparing the running state vs. desired state',
		],
		concept: {
			title: 'Kubernetes Manifest Diffing',
			content: `<p>Kubernetes manifests describe the <strong>desired state</strong> of your cluster resources. As applications evolve, manifests change — new images, updated resource limits, additional environment variables, changed replicas. Diffing lets you review those changes before applying them.</p>
<p class="mt-2">A semantic diff (comparing parsed YAML structures) is preferable to a textual diff for Kubernetes manifests because it highlights <em>logical</em> changes (field value changes, added/removed keys) without flagging cosmetic differences like extra whitespace or comment changes.</p>
<p class="mt-2"><code>kubectl diff -f manifest.yaml</code> performs a live diff against the cluster state — useful in production. This tool performs an offline diff between two manifest files without requiring cluster access.</p>`,
		},
		examples: [
			{ label: 'Image tag change', code: '-  image: nginx:1.24\n+  image: nginx:1.26', isValid: true },
			{ label: 'Replica change', code: '-  replicas: 2\n+  replicas: 5', isValid: true },
			{ label: 'Resource limit added', code: '+  resources:\n+    limits:\n+      cpu: 500m', isValid: true },
		],
		faqs: [
			{
				question: 'How is this different from `kubectl diff`?',
				answer: '<p><code>kubectl diff</code> compares a local manifest against the <em>live cluster state</em> and requires cluster access. This tool compares <em>two local manifest files</em> offline. Use this tool during development to review changes; use <code>kubectl diff</code> when you want to see what will change in a live cluster.</p>',
			},
			{
				question: 'Can I diff values files from Helm?',
				answer: '<p>Yes. Paste two versions of your <code>values.yaml</code> to compare Helm configuration changes. For diffing rendered Helm output, use <code>helm template</code> to render each version first, then compare the rendered YAML.</p>',
			},
			{
				question: 'What does the diff do with YAML anchors?',
				answer: '<p>YAML anchors and aliases are resolved before diffing. The diff shows the effective values — what the Kubernetes API server would actually receive — rather than the symbolic anchor references.</p>',
			},
		],
		relatedTools: [
			{ name: 'K8s API Checker', path: '/k8s/api-checker', description: 'Check for deprecated APIs' },
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Analyze a single manifest' },
			{ name: 'Helm Templater', path: '/k8s/helm', description: 'Render Helm charts' },
			{ name: 'YAML Diff', path: '/yaml/diff', description: 'General YAML comparison' },
		],
		tips: [
			'Before applying changes to production, always do an offline diff here <em>and</em> a live <code>kubectl diff</code> to ensure nothing unexpected is different.',
			'Diff your manifests between Git branches as part of your PR review process — it makes Kubernetes config changes as reviewable as code.',
			'Look for changes to <code>resource limits</code> and <code>requests</code> carefully — they directly affect cluster scheduling and stability.',
		],
	},

	helm: {
		features: [
			'Render Helm chart templates with custom values inline',
			'Paste chart templates and values.yaml to preview the rendered YAML output',
			'Supports Go template syntax: <code>{{ .Values.key }}</code>, <code>{{- if }}</code>, <code>{{- range }}</code>',
			'Syntax error highlighting for malformed templates',
			'Copy rendered manifest to clipboard',
			'Test conditional blocks and range loops interactively',
		],
		useCases: [
			'Preview what Helm chart templates render to before applying to a cluster',
			'Debug Go template syntax errors in chart templates',
			'Test conditional rendering logic without a full Helm install',
			'Validate that values flow correctly into rendered manifests',
			'Inspect third-party chart output for security and correctness',
			'Prototype new Helm templates rapidly in the browser',
		],
		concept: {
			title: 'How Helm Templates Work',
			content: `<p><strong>Helm</strong> is the package manager for Kubernetes. A Helm chart consists of Go template files (in <code>templates/</code>) and a <code>values.yaml</code> that provides default values. When you run <code>helm install</code> or <code>helm template</code>, Helm renders the templates by substituting the values, producing standard Kubernetes YAML manifests.</p>
<p class="mt-2">Go templates use <code>{{ }}</code> delimiters. Common patterns include:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><code>{{ .Values.key }}</code> — interpolate a value from values.yaml</li>
  <li><code>{{- if .Values.enabled }}</code> — conditional rendering</li>
  <li><code>{{- range .Values.items }}</code> — iterate over a list</li>
  <li><code>{{ include "chart.fullname" . }}</code> — call a named template</li>
  <li><code>tpl</code>, <code>toYaml</code>, <code>indent</code> — built-in Helm functions</li>
</ul>`,
		},
		examples: [
			{ label: 'Basic value substitution', code: 'replicas: {{ .Values.replicas }}\nimage: {{ .Values.image.repository }}:{{ .Values.image.tag }}', isValid: true },
			{ label: 'Conditional block', code: '{{- if .Values.ingress.enabled }}\napiVersion: networking.k8s.io/v1\nkind: Ingress\n{{- end }}', isValid: true },
			{ label: 'Range loop', code: '{{- range .Values.env }}\n- name: {{ .name }}\n  value: {{ .value }}\n{{- end }}', isValid: true },
		],
		faqs: [
			{
				question: 'What is `helm template` and when should I use it?',
				answer: '<p><code>helm template my-release ./my-chart -f custom-values.yaml</code> renders all chart templates to YAML without talking to the Kubernetes API server. Use it to inspect rendered output before deploying, or to pipe into <code>kubectl apply</code>. This tool does the same thing in-browser, without needing Helm installed.</p>',
			},
			{
				question: 'Why does my template output have extra blank lines?',
				answer: '<p>Go template conditionals and range blocks introduce whitespace. Use the "trim whitespace" markers: <code>{{-</code> (trim whitespace before) and <code>-}}</code> (trim whitespace after). Mastering these is key to producing clean Helm output.</p>',
			},
			{
				question: 'What Helm functions are available?',
				answer: '<p>Helm provides all standard Go template functions plus the Sprig library (100+ functions) and Helm-specific functions like <code>toYaml</code>, <code>required</code>, <code>tpl</code>, <code>lookup</code>, and <code>include</code>. Key Sprig functions: <code>default</code>, <code>quote</code>, <code>upper</code>, <code>lower</code>, <code>trim</code>, <code>list</code>, <code>dict</code>, <code>merge</code>.</p>',
			},
			{
				question: 'How do I test chart logic without deploying?',
				answer: '<p>Use <code>helm lint ./my-chart</code> to check for common issues, <code>helm template</code> to render output, and <code>helm test</code> to run post-deploy tests. This browser tool lets you iterate on template logic without any of those tools installed.</p>',
			},
		],
		relatedTools: [
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Inspect rendered manifests' },
			{ name: 'K8s API Checker', path: '/k8s/api-checker', description: 'Check API versions' },
			{ name: 'YAML Validator', path: '/yaml/validator', description: 'Validate rendered YAML' },
			{ name: 'K8s Diff', path: '/k8s/diff', description: 'Compare render outputs' },
		],
		tips: [
			'Use <code>{{- with .Values.section }}</code> to scope a block to a nested values section and simplify your template syntax.',
			'The <code>required "error message" .Values.key</code> function causes <code>helm template</code> to fail with a clear error if a required value is missing.',
			'Use <code>toYaml | nindent 4</code> to safely embed arbitrary YAML values (like resource limits) into templates without worrying about indentation.',
			'Test chart upgrades by rendering with the new values and diffing against the current rendered output using the K8s Diff tool.',
		],
	},

	inspector: {
		features: [
			'Parse and analyze Kubernetes YAML manifests visually',
			'Display resource kind, API version, name, namespace, and labels',
			'Inspect spec fields: containers, images, ports, env vars, volumes, resource limits',
			'Highlight missing best-practice fields (resource limits, liveness probes, security context)',
			'Multi-document YAML support (multiple resources in one file)',
			'Export parsed resource summary as JSON',
		],
		useCases: [
			'Quickly understand the contents of an unfamiliar Kubernetes manifest',
			'Review third-party manifests before applying to your cluster',
			'Identify missing resource limits that could cause OOMKills or CPU throttling',
			'Check containers are not running as root (<code>securityContext</code>)',
			'Audit images for unpinned tags (e.g., <code>:latest</code>)',
			'Prepare for Kubernetes security reviews and compliance audits',
		],
		concept: {
			title: 'Kubernetes Resource Structure',
			content: `<p>Every Kubernetes resource has four top-level fields: <strong>apiVersion</strong>, <strong>kind</strong>, <strong>metadata</strong>, and <strong>spec</strong> (plus <strong>status</strong>, which is managed by the cluster). Understanding this structure allows you to read any manifest regardless of the resource type.</p>
<p class="mt-2">For <strong>workload resources</strong> (Deployment, StatefulSet, DaemonSet), the key nested structure is: <code>spec.template.spec.containers[]</code> — a list of containers each with image, ports, env, resources, and probes. This is where most operational configuration lives.</p>
<p class="mt-2">The Inspector surfaces all these fields visually, making it easy to spot missing configurations like resource limits, health checks, or security contexts without reading raw YAML.</p>`,
		},
		examples: [
			{ label: 'Deployment with missing limits', code: 'containers:\n  - name: app\n    image: nginx:latest\n    # Missing: resources, livenessProbe, readinessProbe', isValid: false },
			{ label: 'Well-configured container', code: 'containers:\n  - name: app\n    image: nginx:1.26\n    resources:\n      requests:\n        cpu: 100m\n        memory: 128Mi\n      limits:\n        cpu: 500m\n        memory: 512Mi', isValid: true },
		],
		faqs: [
			{
				question: 'What are resource requests and limits?',
				answer: '<p><strong>Requests</strong>: the minimum CPU/memory the scheduler guarantees to the container. <strong>Limits</strong>: the maximum the container is allowed to use. Without requests, the scheduler cannot make informed placement decisions. Without limits, a runaway process can starve other containers on the same node. Always set both.</p>',
			},
			{
				question: 'Why is running as root in a container dangerous?',
				answer: '<p>If a container process is compromised, running as root gives the attacker the highest privilege level inside the container. Combined with container escape vulnerabilities, this can compromise the host node. Use <code>securityContext.runAsNonRoot: true</code> and <code>runAsUser: 1000</code> (or similar non-zero UID) to limit blast radius.</p>',
			},
			{
				question: 'What are liveness and readiness probes?',
				answer: '<p><strong>Liveness probe</strong>: Kubernetes restarts the container if it fails. <strong>Readiness probe</strong>: Kubernetes removes the pod from the Service endpoints until it passes (no traffic sent to unready pods). Without probes, Kubernetes cannot distinguish a stuck pod from a healthy one. Always define both for production workloads.</p>',
			},
			{
				question: 'Why is using the :latest image tag bad?',
				answer: '<p><code>:latest</code> is mutable — the same tag can point to different image versions on different pulls. This makes deployments non-deterministic and roll-backs unreliable. Always pin to a specific immutable tag (e.g., <code>nginx:1.26.0</code>) or a content digest (<code>nginx@sha256:...</code>).</p>',
			},
		],
		relatedTools: [
			{ name: 'K8s API Checker', path: '/k8s/api-checker', description: 'Check for deprecated APIs' },
			{ name: 'K8s Diff', path: '/k8s/diff', description: 'Compare two manifests' },
			{ name: 'YAML Linter', path: '/yaml/linter', description: 'Lint YAML manifests' },
			{ name: 'K8s Splitter', path: '/k8s/splitter', description: 'Split multi-resource files' },
		],
		tips: [
			'Set resource requests to the p50 (median) usage and limits to the p99 (99th percentile) from your monitoring data.',
			'Use <code>securityContext.allowPrivilegeEscalation: false</code> to prevent processes from gaining more privileges than their parent.',
			'Add <code>readinessProbe</code> before <code>livenessProbe</code> — a failing readiness probe just removes traffic; a failing liveness probe restarts the pod.',
			'Pin image tags to digests (<code>image: nginx@sha256:...</code>) for fully reproducible deployments that are immune to tag mutation.',
		],
	},

	splitter: {
		features: [
			'Split a multi-document YAML file into individual resource files',
			'Name output files by resource Kind and metadata.name (e.g., <code>deployment-my-app.yaml</code>)',
			'Filter by Kind: extract only Deployments, Services, ConfigMaps, etc.',
			'Download individual resources or all as a ZIP archive',
			'Preview each split document before downloading',
			'Count of resource types found in the input',
		],
		useCases: [
			'Break a large Kubernetes manifest bundle into per-resource files for GitOps workflows',
			'Extract specific resource types from a Helm-rendered output',
			'Reorganize a monolithic <code>all-in-one.yaml</code> into a structured directory layout',
			'Separate Secrets from other resources for different access controls',
			'Prepare resources for import into ArgoCD or Flux as individual files',
		],
		concept: {
			title: 'Multi-Document YAML in Kubernetes',
			content: `<p>Kubernetes tooling supports multi-document YAML files: multiple resources separated by <code>---</code> in a single file. This is convenient for bundling related resources (e.g., a Deployment, Service, and ConfigMap for one app), which can be applied together with <code>kubectl apply -f bundle.yaml</code>.</p>
<p class="mt-2">However, as applications grow, monolithic bundle files become hard to manage. <strong>GitOps practices</strong> (ArgoCD, Flux) and most team workflows prefer <em>one resource per file</em>, organized in directories. The splitter automates the tedious work of extracting each resource from a bundle into its own file.</p>
<p class="mt-2">A common pattern: use a monolithic file during development for quick iteration, then split before committing to a GitOps repository.</p>`,
		},
		examples: [
			{ label: 'Multi-doc input', code: '---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: my-app-svc', isValid: true },
			{ label: 'Split output 1', code: '# deployment-my-app.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: my-app', isValid: true },
		],
		faqs: [
			{
				question: 'What naming convention does the splitter use?',
				answer: '<p>Files are named <code>{kind}-{name}.yaml</code> (lowercase). For example, a Deployment named <code>my-api</code> becomes <code>deployment-my-api.yaml</code>. If namespace is set, it is included: <code>deployment-my-api-production.yaml</code>. All names are kebab-cased and lowercased.</p>',
			},
			{
				question: 'Can I filter by resource type?',
				answer: '<p>Yes. Use the Kind filter to extract only specific resource types — for example, extract all <code>Secret</code> resources from a large bundle to manage them separately (e.g., with Sealed Secrets or External Secrets).</p>',
			},
			{
				question: 'What about resources with no name?',
				answer: '<p>Resources without a <code>metadata.name</code> field (uncommon in practice) are named sequentially: <code>deployment-1.yaml</code>, <code>deployment-2.yaml</code>. Review these files manually before using them.</p>',
			},
			{
				question: 'How do I apply split files with kubectl?',
				answer: '<p>Apply an entire directory: <code>kubectl apply -f ./manifests/</code>. Apply recursively: <code>kubectl apply -R -f ./manifests/</code>. This is the standard GitOps pattern where each resource lives in its own file under a structured directory.</p>',
			},
		],
		relatedTools: [
			{ name: 'K8s Inspector', path: '/k8s/inspector', description: 'Inspect split resources' },
			{ name: 'K8s API Checker', path: '/k8s/api-checker', description: 'Check APIs in each file' },
			{ name: 'YAML Formatter', path: '/yaml/formatter', description: 'Format individual files' },
			{ name: 'Helm Templater', path: '/k8s/helm', description: 'Render and then split charts' },
		],
		tips: [
			'After splitting, organize files into subdirectories by resource type: <code>deployments/</code>, <code>services/</code>, <code>configmaps/</code>, <code>secrets/</code>.',
			'Never store raw Kubernetes Secret resources in git — use Sealed Secrets or External Secrets Operator instead.',
			'Run the API Checker on the split files to verify all resources use current API versions before applying.',
			'Use the filter feature to extract only Secrets for separate handling with restricted access controls.',
		],
	},
};

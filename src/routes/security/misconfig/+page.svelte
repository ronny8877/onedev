<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { securityToolsContent } from '$lib/config/content/security-tools-content';

	const content = securityToolsContent['misconfig'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// State
	let input = $state('');
	let configType = $state<'headers' | 'nginx' | 'apache' | 'express' | 'env'>('headers');

	// Sample inputs
	const samples: Record<string, string> = {
		headers: `HTTP/1.1 200 OK
Content-Type: text/html
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
Set-Cookie: session=abc123
X-Powered-By: Express`,
		nginx: `server {
    listen 80;
    server_name example.com;
    
    add_header X-Frame-Options "SAMEORIGIN";
    # Missing HSTS, CSP
    
    location /debug {
        # Debug endpoint exposed
    }
}`,
		env: `DEBUG=true
NODE_ENV=development
DATABASE_URL=postgres://admin:password123@localhost/db
SECRET_KEY=mysecretkey
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE`
	};

	interface Issue {
		severity: 'high' | 'medium' | 'low';
		title: string;
		description: string;
		fix: string;
		line?: number;
	}

	// Rule-based detection
	function analyzeConfig(): Issue[] {
		if (!input.trim()) return [];
		const issues: Issue[] = [];
		const lines = input.split('\n');

		lines.forEach((line, i) => {
			const lineNum = i + 1;
			const lower = line.toLowerCase();

			// Header checks
			if (configType === 'headers') {
				if (/access-control-allow-origin:\s*\*/i.test(line)) {
					issues.push({
						severity: 'high',
						title: 'CORS Wildcard Origin',
						description: 'Access-Control-Allow-Origin: * allows any origin to make requests.',
						fix: 'Specify allowed origins explicitly instead of using wildcard.',
						line: lineNum
					});
				}
				if (/access-control-allow-credentials:\s*true/i.test(line) && input.includes('Access-Control-Allow-Origin: *')) {
					issues.push({
						severity: 'high',
						title: 'CORS Credentials with Wildcard',
						description: 'Credentials cannot be used with wildcard origin.',
						fix: 'Remove wildcard origin or disable credentials.',
						line: lineNum
					});
				}
				if (/set-cookie:/i.test(line) && !/secure/i.test(line)) {
					issues.push({
						severity: 'medium',
						title: 'Cookie Missing Secure Flag',
						description: 'Cookie can be transmitted over unencrypted connections.',
						fix: 'Add Secure flag: Set-Cookie: name=value; Secure; HttpOnly',
						line: lineNum
					});
				}
				if (/set-cookie:/i.test(line) && !/httponly/i.test(line)) {
					issues.push({
						severity: 'medium',
						title: 'Cookie Missing HttpOnly Flag',
						description: 'Cookie accessible via JavaScript, vulnerable to XSS.',
						fix: 'Add HttpOnly flag to prevent JavaScript access.',
						line: lineNum
					});
				}
				if (/x-powered-by/i.test(line)) {
					issues.push({
						severity: 'low',
						title: 'X-Powered-By Header Exposed',
						description: 'Server technology disclosed. Helps attackers identify vulnerabilities.',
						fix: 'Remove X-Powered-By header from responses.',
						line: lineNum
					});
				}
			}

			// ENV checks
			if (configType === 'env') {
				if (/debug\s*=\s*true/i.test(line)) {
					issues.push({
						severity: 'high',
						title: 'Debug Mode Enabled',
						description: 'Debug mode exposes sensitive information in errors.',
						fix: 'Set DEBUG=false in production environments.',
						line: lineNum
					});
				}
				if (/node_env\s*=\s*development/i.test(line)) {
					issues.push({
						severity: 'medium',
						title: 'Development Mode',
						description: 'NODE_ENV=development disables production optimizations.',
						fix: 'Set NODE_ENV=production in production.',
						line: lineNum
					});
				}
				if (/password|secret|key/i.test(line.split('=')[0]) && line.includes('=')) {
					const value = line.split('=')[1];
					if (value && value.length < 20 && !/\$\{/.test(value)) {
						issues.push({
							severity: 'high',
							title: 'Weak or Hardcoded Secret',
							description: 'Secrets should be strong and loaded from secure sources.',
							fix: 'Use a secrets manager or strong, randomly generated values.',
							line: lineNum
						});
					}
				}
			}

			// NGINX checks
			if (configType === 'nginx') {
				if (/server_tokens\s+on/i.test(line)) {
					issues.push({
						severity: 'low',
						title: 'Server Tokens Enabled',
						description: 'NGINX version disclosed in responses.',
						fix: 'Add server_tokens off; to hide version.',
						line: lineNum
					});
				}
				if (/debug|test/i.test(line) && /location/i.test(line)) {
					issues.push({
						severity: 'medium',
						title: 'Debug/Test Endpoint',
						description: 'Debug or test endpoints should not be exposed.',
						fix: 'Remove or restrict access to debug endpoints.',
						line: lineNum
					});
				}
			}
		});

		// Global checks
		if (configType === 'headers') {
			if (!input.includes('X-Content-Type-Options')) {
				issues.push({ severity: 'medium', title: 'Missing X-Content-Type-Options', description: 'MIME sniffing not prevented.', fix: 'Add header: X-Content-Type-Options: nosniff' });
			}
			if (!input.includes('X-Frame-Options') && !input.includes('frame-ancestors')) {
				issues.push({ severity: 'medium', title: 'Missing X-Frame-Options', description: 'Clickjacking not prevented.', fix: 'Add header: X-Frame-Options: DENY' });
			}
			if (!input.includes('Strict-Transport-Security')) {
				issues.push({ severity: 'high', title: 'Missing HSTS', description: 'HTTPS not enforced.', fix: 'Add header: Strict-Transport-Security: max-age=31536000; includeSubDomains' });
			}
		}

		return issues.sort((a, b) => {
			const order = { high: 0, medium: 1, low: 2 };
			return order[a.severity] - order[b.severity];
		});
	}

	let issues = $derived(analyzeConfig());

	function loadSample() {
		input = samples[configType] || samples.headers;
	}

	const severityColors = { high: 'error', medium: 'warning', low: 'info' };
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Config Type Selector -->
		<div class="flex flex-wrap gap-2 justify-center">
			{#each ['headers', 'nginx', 'apache', 'express', 'env'] as type}
				<button 
					class="btn btn-sm {configType === type ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => configType = type as typeof configType}
				>
					{type === 'headers' ? 'HTTP Headers' : type === 'env' ? 'ENV Variables' : type.toUpperCase()}
				</button>
			{/each}
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl h-fit">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-bold text-sm">Paste Configuration</h3>
						<button class="btn btn-xs btn-ghost" onclick={loadSample}>Sample</button>
					</div>
					<textarea
						bind:value={input}
						placeholder="Paste your headers, config, or ENV variables..."
						class="textarea textarea-bordered w-full font-mono text-xs min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Results -->
			<div class="space-y-4">
				{#if issues.length > 0}
					<div class="flex items-center justify-between">
						<h3 class="font-bold">Found {issues.length} issue(s)</h3>
						<div class="flex gap-1">
							<span class="badge badge-error badge-sm">{issues.filter(i => i.severity === 'high').length} High</span>
							<span class="badge badge-warning badge-sm">{issues.filter(i => i.severity === 'medium').length} Medium</span>
							<span class="badge badge-info badge-sm">{issues.filter(i => i.severity === 'low').length} Low</span>
						</div>
					</div>

					<div class="space-y-2 max-h-96 overflow-y-auto">
						{#each issues as issue}
							<div class="card bg-{severityColors[issue.severity]}/10 border border-{severityColors[issue.severity]}/20 rounded-xl">
								<div class="card-body p-3">
									<div class="flex items-start justify-between">
										<div class="flex items-center gap-2">
											<span class="badge badge-{severityColors[issue.severity]} badge-sm">{issue.severity.toUpperCase()}</span>
											<h4 class="font-bold text-sm">{issue.title}</h4>
										</div>
										{#if issue.line}
											<span class="text-xs text-base-content/50">Line {issue.line}</span>
										{/if}
									</div>
									<p class="text-sm text-base-content/70 mt-1">{issue.description}</p>
									<div class="mt-2 p-2 bg-base-100 rounded text-xs font-mono flex items-center justify-between">
										<span>{issue.fix}</span>
										<CopyButton text={issue.fix} size="sm" />
									</div>
								</div>
							</div>
						{/each}
					</div>
				{:else if input.trim()}
					<div class="card bg-success/10 border border-success/20 rounded-xl">
						<div class="card-body p-6 text-center">
							<p class="font-bold text-success">No issues detected</p>
							<p class="text-sm text-base-content/60">Configuration appears secure based on our rules.</p>
						</div>
					</div>
				{:else}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-6 text-center text-base-content/50">
							<p>Paste configuration to analyze</p>
						</div>
					</div>
				{/if}
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

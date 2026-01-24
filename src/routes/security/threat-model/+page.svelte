<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// State - Form inputs
	let appType = $state<'web' | 'api' | 'mobile' | 'spa'>('web');
	let authType = $state<'session' | 'jwt' | 'oauth' | 'none'>('session');
	let dataSensitivity = $state<'low' | 'medium' | 'high'>('medium');
	let hasUserRoles = $state(true);
	let hasExternalIntegrations = $state(false);
	let generated = $state(false);

	// STRIDE categories
	interface Threat {
		category: string;
		categoryFull: string;
		threat: string;
		risk: 'low' | 'medium' | 'high';
		mitigation: string;
		controls: string[];
	}

	// Generate threats based on inputs
	let threats = $derived((): Threat[] => {
		const result: Threat[] = [];

		// Spoofing threats
		if (authType !== 'none') {
			result.push({
				category: 'S',
				categoryFull: 'Spoofing',
				threat: 'Attacker impersonates legitimate user via stolen credentials',
				risk: dataSensitivity === 'high' ? 'high' : 'medium',
				mitigation: 'Implement MFA for all user accounts',
				controls: ['MFA', 'Strong password policy', 'Account lockout', 'Session timeout']
			});
		}
		if (authType === 'jwt') {
			result.push({
				category: 'S',
				categoryFull: 'Spoofing',
				threat: 'JWT token forged or stolen from client',
				risk: 'high',
				mitigation: 'Use short-lived tokens with secure storage and proper signing',
				controls: ['Short expiry (15 min)', 'HTTP-only cookies', 'Token rotation', 'Signature verification']
			});
		}

		// Tampering threats
		result.push({
			category: 'T',
			categoryFull: 'Tampering',
			threat: 'Request parameters modified to bypass validation',
			risk: 'medium',
			mitigation: 'Server-side validation of all inputs',
			controls: ['Input validation', 'Parameterized queries', 'Integrity checks', 'CSRF tokens']
		});
		if (dataSensitivity === 'high') {
			result.push({
				category: 'T',
				categoryFull: 'Tampering',
				threat: 'Sensitive data modified in transit',
				risk: 'high',
				mitigation: 'Enforce TLS 1.3 for all communications',
				controls: ['TLS 1.3', 'HSTS', 'Certificate pinning', 'Data signing']
			});
		}

		// Repudiation threats
		result.push({
			category: 'R',
			categoryFull: 'Repudiation',
			threat: 'User denies performing critical action',
			risk: dataSensitivity === 'high' ? 'medium' : 'low',
			mitigation: 'Implement comprehensive audit logging',
			controls: ['Audit logs', 'Timestamps', 'User attribution', 'Log integrity']
		});

		// Information Disclosure threats
		result.push({
			category: 'I',
			categoryFull: 'Information Disclosure',
			threat: 'Sensitive data exposed via error messages or logs',
			risk: 'medium',
			mitigation: 'Sanitize error responses and logs',
			controls: ['Generic error messages', 'Log sanitization', 'Secure headers', 'Data masking']
		});
		if (hasExternalIntegrations) {
			result.push({
				category: 'I',
				categoryFull: 'Information Disclosure',
				threat: 'Data leaked to third-party integrations',
				risk: 'high',
				mitigation: 'Minimize data shared with external services',
				controls: ['Data minimization', 'API contracts', 'Vendor assessment', 'Encryption']
			});
		}

		// Denial of Service threats
		result.push({
			category: 'D',
			categoryFull: 'Denial of Service',
			threat: 'Application overwhelmed by excessive requests',
			risk: appType === 'api' ? 'high' : 'medium',
			mitigation: 'Implement rate limiting and resource quotas',
			controls: ['Rate limiting', 'Request throttling', 'CDN/WAF', 'Resource limits']
		});

		// Elevation of Privilege threats
		if (hasUserRoles) {
			result.push({
				category: 'E',
				categoryFull: 'Elevation of Privilege',
				threat: 'User escalates privileges to admin role',
				risk: 'high',
				mitigation: 'Enforce role-based access control on all endpoints',
				controls: ['RBAC', 'Least privilege', 'Access logs', 'Privilege separation']
			});
		}
		result.push({
			category: 'E',
			categoryFull: 'Elevation of Privilege',
			threat: 'Injection attack gains system access',
			risk: 'high',
			mitigation: 'Use parameterized queries and input sanitization',
			controls: ['Parameterized queries', 'ORM', 'Input validation', 'Sandboxing']
		});

		return result;
	});

	function generate() {
		generated = true;
	}

	function exportReport() {
		let md = '# Web App Threat Model\n\n';
		md += `## Application Profile\n`;
		md += `- Type: ${appType.toUpperCase()}\n`;
		md += `- Auth: ${authType}\n`;
		md += `- Data Sensitivity: ${dataSensitivity}\n`;
		md += `- User Roles: ${hasUserRoles ? 'Yes' : 'No'}\n`;
		md += `- External Integrations: ${hasExternalIntegrations ? 'Yes' : 'No'}\n\n`;
		md += `## Identified Threats\n\n`;
		
		threats().forEach(t => {
			md += `### [${t.category}] ${t.threat}\n`;
			md += `- Risk: ${t.risk.toUpperCase()}\n`;
			md += `- Mitigation: ${t.mitigation}\n`;
			md += `- Controls: ${t.controls.join(', ')}\n\n`;
		});

		navigator.clipboard.writeText(md);
	}

	const riskColors = { low: 'success', medium: 'warning', high: 'error' };
	const strideColors: Record<string, string> = { S: 'error', T: 'warning', R: 'info', I: 'secondary', D: 'primary', E: 'error' };

	let highCount = $derived(threats().filter(t => t.risk === 'high').length);
	let mediumCount = $derived(threats().filter(t => t.risk === 'medium').length);
	let lowCount = $derived(threats().filter(t => t.risk === 'low').length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6 max-w-3xl mx-auto">
		{#if !generated}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold">Describe Your Application</h3>
						<button class="btn btn-sm btn-primary" onclick={() => { appType = 'api'; authType = 'jwt'; dataSensitivity = 'high'; hasUserRoles = true; hasExternalIntegrations = true; generate(); }}>Sample</button>
					</div>
					<p class="text-sm text-base-content/60 mb-6">Answer a few questions to generate a threat model (2–3 minutes)</p>

					<div class="space-y-6">
						<div>
							<label class="text-sm font-medium block mb-2">Application Type</label>
							<div class="flex flex-wrap gap-2">
								{#each [['web', 'Web App'], ['api', 'REST API'], ['spa', 'SPA'], ['mobile', 'Mobile Backend']] as [value, label]}
									<button 
										class="btn btn-sm {appType === value ? 'btn-primary' : 'btn-ghost'}"
										onclick={() => appType = value as typeof appType}
									>{label}</button>
								{/each}
							</div>
						</div>

						<div>
							<label class="text-sm font-medium block mb-2">Authentication Type</label>
							<div class="flex flex-wrap gap-2">
								{#each [['session', 'Session/Cookie'], ['jwt', 'JWT'], ['oauth', 'OAuth/OIDC'], ['none', 'None']] as [value, label]}
									<button 
										class="btn btn-sm {authType === value ? 'btn-primary' : 'btn-ghost'}"
										onclick={() => authType = value as typeof authType}
									>{label}</button>
								{/each}
							</div>
						</div>

						<div>
							<label class="text-sm font-medium block mb-2">Data Sensitivity</label>
							<div class="flex gap-2">
								{#each ['low', 'medium', 'high'] as level}
									<button 
										class="btn btn-sm flex-1 {dataSensitivity === level ? 
											(level === 'high' ? 'btn-error' : level === 'medium' ? 'btn-warning' : 'btn-success') 
											: 'btn-ghost'}"
										onclick={() => dataSensitivity = level as typeof dataSensitivity}
									>
										{level.charAt(0).toUpperCase() + level.slice(1)}
									</button>
								{/each}
							</div>
						</div>

						<div class="space-y-2">
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" bind:checked={hasUserRoles} class="checkbox checkbox-sm" />
								<span class="text-sm">Multiple user roles (admin, user, etc.)</span>
							</label>
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" bind:checked={hasExternalIntegrations} class="checkbox checkbox-sm" />
								<span class="text-sm">External integrations (APIs, webhooks, third-party services)</span>
							</label>
						</div>
					</div>

					<button class="btn btn-primary mt-6" onclick={generate}>Generate Threat Model</button>
				</div>
			</div>
		{:else}
			<!-- Generated Report -->
			<div class="flex justify-between items-center">
				<button class="btn btn-sm btn-ghost" onclick={() => generated = false}>Edit</button>
				<button class="btn btn-sm btn-ghost" onclick={exportReport}>Export</button>
			</div>

			<!-- Summary -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<h3 class="font-bold">Identified {threats().length} Threats</h3>
						<div class="flex gap-1">
							<span class="badge badge-error">{highCount} High</span>
							<span class="badge badge-warning">{mediumCount} Medium</span>
							<span class="badge badge-success">{lowCount} Low</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Threats by STRIDE -->
			<div class="space-y-3">
				{#each threats() as threat}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body p-4">
							<div class="flex items-start justify-between gap-4">
								<div class="flex items-start gap-3">
									<span class="badge badge-lg font-mono badge-{strideColors[threat.category]}">{threat.category}</span>
									<div>
										<h4 class="font-bold text-sm">{threat.threat}</h4>
										<p class="text-xs text-base-content/60">{threat.categoryFull}</p>
									</div>
								</div>
								<span class="badge badge-{riskColors[threat.risk]}">{threat.risk.toUpperCase()}</span>
							</div>
							
							<div class="mt-3 p-2 bg-base-100 rounded text-sm">
								<strong>Mitigation:</strong> {threat.mitigation}
							</div>

							<div class="mt-2 flex flex-wrap gap-1">
								{#each threat.controls as control}
									<span class="badge badge-ghost badge-sm">{control}</span>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- STRIDE Legend -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-3">
					<p class="text-xs font-bold text-base-content/60 mb-2">STRIDE Categories</p>
					<div class="flex flex-wrap gap-2 text-xs">
						<span><strong>S</strong>poofing</span>
						<span><strong>T</strong>ampering</span>
						<span><strong>R</strong>epudiation</span>
						<span><strong>I</strong>nfo Disclosure</span>
						<span><strong>D</strong>enial of Service</span>
						<span><strong>E</strong>levation</span>
					</div>
				</div>
			</div>
		{/if}
	</div>
</ToolWrapper>

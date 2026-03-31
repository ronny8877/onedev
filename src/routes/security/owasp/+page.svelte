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

	const content = securityToolsContent['owasp'];
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// OWASP Top 10 2021 Data
	const owaspItems = [
		{
			id: 'A01',
			name: 'Broken Access Control',
			description: 'Failures that allow users to act outside their intended permissions.',
			example: 'Modifying URL parameters to access other users\' data, or bypassing access checks by modifying API requests.',
			causes: ['Missing access control checks', 'Insecure direct object references', 'CORS misconfiguration', 'Privilege escalation'],
			mitigation: ['Implement proper access controls on every request', 'Deny by default', 'Log access control failures', 'Rate limit API access']
		},
		{
			id: 'A02',
			name: 'Cryptographic Failures',
			description: 'Failures related to cryptography that expose sensitive data.',
			example: 'Storing passwords in plain text, using weak encryption algorithms like MD5, or transmitting data over HTTP.',
			causes: ['Weak hashing algorithms', 'Missing encryption', 'Hardcoded keys', 'Improper certificate validation'],
			mitigation: ['Use strong algorithms (AES-256, bcrypt)', 'Encrypt data in transit (TLS 1.3)', 'Never store plaintext secrets', 'Rotate keys regularly']
		},
		{
			id: 'A03',
			name: 'Injection',
			description: 'Untrusted data sent to an interpreter as part of a command or query.',
			example: 'SQL injection via login form, command injection through file upload, or XSS via reflected user input.',
			causes: ['Concatenating user input in queries', 'Missing input validation', 'Using eval() with user data', 'Unescaped output'],
			mitigation: ['Use parameterized queries', 'Validate and sanitize input', 'Use ORM/prepared statements', 'Escape output in templates']
		},
		{
			id: 'A04',
			name: 'Insecure Design',
			description: 'Missing or ineffective security controls due to design flaws.',
			example: 'No rate limiting on password reset, or allowing unlimited failed login attempts.',
			causes: ['No threat modeling', 'Missing security requirements', 'Insecure architecture', 'No secure design patterns'],
			mitigation: ['Threat model during design phase', 'Use secure design patterns', 'Limit resource consumption', 'Separate tenant data']
		},
		{
			id: 'A05',
			name: 'Security Misconfiguration',
			description: 'Insecure default configurations, incomplete setups, or verbose error messages.',
			example: 'Default admin credentials, directory listing enabled, stack traces shown to users, S3 buckets public.',
			causes: ['Default configurations', 'Unnecessary features enabled', 'Missing security hardening', 'Overly permissive settings'],
			mitigation: ['Automated hardening process', 'Remove unused features', 'Review cloud permissions', 'Security-focused CI/CD']
		},
		{
			id: 'A06',
			name: 'Vulnerable Components',
			description: 'Using components with known vulnerabilities.',
			example: 'Running outdated versions of libraries with known CVEs, or using abandoned packages.',
			causes: ['No dependency scanning', 'Outdated packages', 'No patch management', 'Using unmaintained libraries'],
			mitigation: ['Continuous vulnerability scanning', 'Automated dependency updates', 'Remove unused dependencies', 'Monitor security advisories']
		},
		{
			id: 'A07',
			name: 'Auth Failures',
			description: 'Weaknesses in authentication and session management.',
			example: 'Weak password policies, credential stuffing attacks, or session IDs in URLs.',
			causes: ['Weak passwords allowed', 'No MFA', 'Session fixation', 'Insecure session handling'],
			mitigation: ['Implement MFA', 'Use secure session management', 'Enforce strong passwords', 'Limit failed attempts']
		},
		{
			id: 'A08',
			name: 'Data Integrity Failures',
			description: 'Code and infrastructure that does not protect against integrity violations.',
			example: 'Deserializing untrusted data, auto-updating without signature verification, insecure CI/CD.',
			causes: ['Insecure deserialization', 'Unsigned updates', 'Unverified CI/CD pipelines', 'No integrity checks'],
			mitigation: ['Sign all updates and packages', 'Verify integrity of dependencies', 'Secure CI/CD pipeline', 'Avoid insecure deserialization']
		},
		{
			id: 'A09',
			name: 'Logging Failures',
			description: 'Insufficient logging, monitoring, and alerting.',
			example: 'Login failures not logged, no alerts for suspicious activity, logs not reviewed.',
			causes: ['No centralized logging', 'Missing audit trails', 'No alerting', 'Logs stored insecurely'],
			mitigation: ['Log security events', 'Implement alerting', 'Protect log integrity', 'Regular log review']
		},
		{
			id: 'A10',
			name: 'SSRF',
			description: 'Server-Side Request Forgery - when a server fetches a URL from user input.',
			example: 'Image URL fetcher accessing internal services, webhook URL pointing to localhost.',
			causes: ['Fetching user-provided URLs', 'No URL validation', 'Missing network segmentation', 'Trusting user input'],
			mitigation: ['Validate and sanitize URLs', 'Use allowlists for destinations', 'Segment internal networks', 'Disable unnecessary URL schemes']
		}
	];

	type Status = 'pending' | 'compliant' | 'na' | 'needs-work';

	interface ItemState {
		status: Status;
		notes: string;
	}

	// State
	let itemStates = $state<Record<string, ItemState>>(
		Object.fromEntries(owaspItems.map(item => [item.id, { status: 'pending', notes: '' }]))
	);
	let expandedId = $state<string | null>(null);

	// Progress calculation
	let progress = $derived(() => {
		const total = owaspItems.length;
		const completed = Object.values(itemStates).filter(s => s.status !== 'pending').length;
		const compliant = Object.values(itemStates).filter(s => s.status === 'compliant').length;
		return { total, completed, compliant, percent: Math.round((completed / total) * 100) };
	});

	function setStatus(id: string, status: Status) {
		itemStates[id] = { ...itemStates[id], status };
		itemStates = { ...itemStates };
	}

	function updateNotes(id: string, notes: string) {
		itemStates[id] = { ...itemStates[id], notes };
		itemStates = { ...itemStates };
	}

	function exportMarkdown() {
		let md = '# OWASP Top 10 Compliance Report\n\n';
		md += `**Completed:** ${progress().completed}/${progress().total} (${progress().percent}%)\n`;
		md += `**Compliant:** ${progress().compliant}/${progress().total}\n\n`;

		owaspItems.forEach(item => {
			const state = itemStates[item.id];
			const statusIcon = state.status === 'compliant' ? '✓' : state.status === 'na' ? '—' : state.status === 'needs-work' ? '✗' : '○';
			md += `## ${item.id}: ${item.name} [${statusIcon}]\n\n`;
			md += `**Status:** ${state.status.toUpperCase()}\n\n`;
			if (state.notes) md += `**Notes:** ${state.notes}\n\n`;
		});

		navigator.clipboard.writeText(md);
	}

	function exportJSON() {
		const data = {
			version: 'OWASP Top 10 2021',
			date: new Date().toISOString(),
			progress: progress(),
			items: owaspItems.map(item => ({
				...item,
				...itemStates[item.id]
			}))
		};
		navigator.clipboard.writeText(JSON.stringify(data, null, 2));
	}

	function resetAll() {
		itemStates = Object.fromEntries(owaspItems.map(item => [item.id, { status: 'pending', notes: '' }]));
	}

	function loadSample() {
		itemStates = {
			'A01': { status: 'compliant', notes: 'RBAC implemented with middleware' },
			'A02': { status: 'compliant', notes: 'Using bcrypt for passwords, TLS 1.3' },
			'A03': { status: 'compliant', notes: 'Parameterized queries via ORM' },
			'A04': { status: 'needs-work', notes: 'Need to add rate limiting' },
			'A05': { status: 'pending', notes: '' },
			'A06': { status: 'compliant', notes: 'Dependabot enabled' },
			'A07': { status: 'needs-work', notes: 'TODO: Add MFA support' },
			'A08': { status: 'na', notes: 'No custom deserialization' },
			'A09': { status: 'pending', notes: '' },
			'A10': { status: 'compliant', notes: 'URL allowlist implemented' }
		};
	}

	const statusColors: Record<Status, string> = {
		pending: 'bg-base-300',
		compliant: 'bg-success/20 border-success/30',
		na: 'bg-info/20 border-info/30',
		'needs-work': 'bg-error/20 border-error/30'
	};
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Progress Bar -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-2">
					<div>
						<span class="font-bold">{progress().completed}/{progress().total} reviewed</span>
						<span class="text-sm text-base-content/60 ml-2">({progress().compliant} compliant)</span>
					</div>
					<span class="text-2xl font-bold">{progress().percent}%</span>
				</div>
				<div class="w-full h-3 bg-base-300 rounded-full overflow-hidden">
					<div 
						class="h-full bg-success rounded-full transition-all"
						style="width: {progress().percent}%"
					></div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-wrap gap-2 justify-between">
			<button class="btn btn-sm btn-primary" onclick={loadSample}>Sample</button>
			<div class="flex gap-2">
				<button class="btn btn-sm btn-ghost" onclick={exportMarkdown}>Export Markdown</button>
				<button class="btn btn-sm btn-ghost" onclick={exportJSON}>Export JSON</button>
				<button class="btn btn-sm btn-ghost text-error" onclick={resetAll}>Reset</button>
			</div>
		</div>

		<!-- OWASP Items -->
		<div class="space-y-3">
			{#each owaspItems as item}
				{@const state = itemStates[item.id]}
				<div class="card {statusColors[state.status]} border rounded-xl">
					<div class="card-body p-4">
						<!-- Header -->
						<div 
							class="flex items-center justify-between cursor-pointer"
							onclick={() => expandedId = expandedId === item.id ? null : item.id}
						>
							<div class="flex items-center gap-3">
								<span class="font-mono font-bold text-sm bg-base-300 px-2 py-1 rounded">{item.id}</span>
								<h3 class="font-bold">{item.name}</h3>
							</div>
							<div class="flex items-center gap-2">
								<select 
									value={state.status}
									class="select select-sm select-bordered"
									onclick={(e) => e.stopPropagation()}
									onchange={(e) => setStatus(item.id, (e.target as HTMLSelectElement).value as Status)}
								>
									<option value="pending">Pending</option>
									<option value="compliant">Compliant</option>
									<option value="na">N/A</option>
									<option value="needs-work">Needs Work</option>
								</select>
								<span class="text-sm">{expandedId === item.id ? '▲' : '▼'}</span>
							</div>
						</div>

						<!-- Expanded Content -->
						{#if expandedId === item.id}
							<div class="mt-4 space-y-4">
								<p class="text-sm text-base-content/80">{item.description}</p>

								<div class="grid gap-4 md:grid-cols-2">
									<div>
										<h4 class="text-xs font-bold text-base-content/60 mb-1">Example</h4>
										<p class="text-sm bg-base-100/50 p-2 rounded">{item.example}</p>
									</div>
									<div>
										<h4 class="text-xs font-bold text-base-content/60 mb-1">Common Causes</h4>
										<ul class="text-sm space-y-1">
											{#each item.causes as cause}
												<li class="flex items-start gap-1">
													<span class="text-base-content/40">•</span>
													{cause}
												</li>
											{/each}
										</ul>
									</div>
								</div>

								<div>
									<h4 class="text-xs font-bold text-base-content/60 mb-1">Mitigation</h4>
									<div class="flex flex-wrap gap-1">
										{#each item.mitigation as m}
											<span class="badge badge-ghost badge-sm">{m}</span>
										{/each}
									</div>
								</div>

								<div>
									<h4 class="text-xs font-bold text-base-content/60 mb-1">Notes</h4>
									<textarea 
										value={state.notes}
										placeholder="Add notes about your implementation..."
										class="textarea textarea-bordered w-full text-sm min-h-16"
										onclick={(e) => e.stopPropagation()}
										oninput={(e) => updateNotes(item.id, (e.target as HTMLTextAreaElement).value)}
									></textarea>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		<!-- Legend -->
		<div class="flex flex-wrap gap-4 justify-center text-xs">
			<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-success/30"></span> Compliant</span>
			<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-info/30"></span> N/A</span>
			<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-error/30"></span> Needs Work</span>
			<span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-base-300"></span> Pending</span>
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

<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	interface SecretMatch {
		pattern: string;
		type: string;
		severity: 'critical' | 'high' | 'medium' | 'low';
		line: number;
		match: string;
		masked: string;
	}

	const secretPatterns = [
		// AWS
		{ type: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/gi, severity: 'critical' as const },
		{ type: 'AWS Secret Key', pattern: /[A-Za-z0-9/+=]{40}/gi, severity: 'critical' as const, context: /aws|secret|key/i },
		
		// GitHub
		{ type: 'GitHub Token', pattern: /gh[pousr]_[A-Za-z0-9_]{36,}/gi, severity: 'critical' as const },
		{ type: 'GitHub Personal Token', pattern: /github_pat_[A-Za-z0-9_]{22,}/gi, severity: 'critical' as const },
		
		// .env file patterns (KEY=value or KEY="value")
		{ type: 'Env API Key', pattern: /^[A-Z_]*(?:API[_-]?KEY|APIKEY)[A-Z_]*\s*=\s*["']?[a-zA-Z0-9_\-\.]{10,}["']?/gim, severity: 'high' as const },
		{ type: 'Env Secret', pattern: /^[A-Z_]*(?:SECRET|PASSWORD|PASSWD|PWD|TOKEN)[A-Z_]*\s*=\s*["']?[^\s"']{8,}["']?/gim, severity: 'high' as const },
		{ type: 'Env Private Key', pattern: /^[A-Z_]*(?:PRIVATE[_-]?KEY)[A-Z_]*\s*=\s*["']?.+["']?/gim, severity: 'critical' as const },
		{ type: 'Env Database URL', pattern: /^[A-Z_]*(?:DATABASE|DB|MONGO|POSTGRES|MYSQL|REDIS)[A-Z_]*[_-]?URL\s*=\s*["']?[^\s"']+["']?/gim, severity: 'critical' as const },
		{ type: 'Env Auth Token', pattern: /^[A-Z_]*(?:AUTH|ACCESS|REFRESH)[_-]?TOKEN\s*=\s*["']?[^\s"']{10,}["']?/gim, severity: 'high' as const },
		
		// Slack
		{ type: 'Slack Token', pattern: /xox[baprs]-[0-9]{10,13}-[0-9]{10,13}[a-zA-Z0-9-]*/gi, severity: 'high' as const },
		{ type: 'Slack Webhook', pattern: /https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8,}\/B[a-zA-Z0-9_]{8,}\/[a-zA-Z0-9_]{24}/gi, severity: 'high' as const },
		
		// Google & Others
		{ type: 'Google API Key', pattern: /AIza[0-9A-Za-z_-]{35}/gi, severity: 'high' as const },
		{ type: 'Stripe Live Key', pattern: /sk_live_[0-9a-zA-Z]{24}/gi, severity: 'critical' as const },
		{ type: 'Stripe Test Key', pattern: /sk_test_[0-9a-zA-Z]{24}/gi, severity: 'medium' as const },
		
		// Private Keys
		{ type: 'Private Key Header', pattern: /-----BEGIN (RSA|DSA|EC|OPENSSH|PGP) PRIVATE KEY-----/gi, severity: 'critical' as const },
		
		// Tokens
		{ type: 'JWT Token', pattern: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/gi, severity: 'high' as const },
		{ type: 'Bearer Token', pattern: /bearer\s+[a-zA-Z0-9_-]{20,}/gi, severity: 'high' as const },
		{ type: 'Basic Auth', pattern: /basic\s+[a-zA-Z0-9+/=]{20,}/gi, severity: 'high' as const },
		
		// Database URLs
		{ type: 'Database URL', pattern: /(mongodb|postgres|mysql|redis):\/\/[^:\s]+:[^@\s]+@/gi, severity: 'critical' as const },
		
		// Other services
		{ type: 'NPM Token', pattern: /npm_[A-Za-z0-9]{36}/gi, severity: 'high' as const },
		{ type: 'SendGrid API Key', pattern: /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/gi, severity: 'high' as const },
		{ type: 'Twilio', pattern: /SK[a-fA-F0-9]{32}/gi, severity: 'high' as const },
		{ type: 'Mailchimp', pattern: /[a-f0-9]{32}-us[0-9]{1,2}/gi, severity: 'medium' as const },
		{ type: 'Firebase', pattern: /AAAA[a-zA-Z0-9_-]{7}:[a-zA-Z0-9_-]{140}/gi, severity: 'high' as const },
		
		// Generic patterns (checked last)
		{ type: 'Generic API Key', pattern: /['"](?:api[_-]?key|apikey|api[_-]?token)['"]\s*[:=]\s*['"][a-zA-Z0-9_-]{16,}['"]/gi, severity: 'medium' as const },
		{ type: 'Generic Secret', pattern: /['"](?:secret|password|passwd|pwd)['"]\s*[:=]\s*['"][^'"]{8,}['"]/gi, severity: 'high' as const },
		{ type: 'Hardcoded Password', pattern: /password\s*[:=]\s*["'][^"']{6,}["']/gi, severity: 'high' as const }
	];

	let input = $state('');
	let matches = $state<SecretMatch[]>([]);

	const sampleCode = `# .env file example
API_KEY="sk_live_1234567890abcdefghijklmn"
DATABASE_URL=postgres://admin:supersecretpass123@db.example.com:5432/mydb
SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
STRIPE_SECRET_KEY=sk_live_1234567890abcdefghij
JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N"
MONGO_URL=mongodb://user:password123@cluster.mongodb.net/mydb
AUTH_TOKEN=supersecretauthtoken12345678`;

	function maskSecret(match: string): string {
		if (match.length <= 8) return '*'.repeat(match.length);
		return match.slice(0, 4) + '*'.repeat(Math.min(match.length - 8, 20)) + match.slice(-4);
	}

	function scanForSecrets() {
		const results: SecretMatch[] = [];
		const lines = input.split('\n');
		const seenMatches = new Set<string>(); // Deduplicate
		
		lines.forEach((line, lineIndex) => {
			secretPatterns.forEach(({ type, pattern, severity, context }) => {
				pattern.lastIndex = 0;
				let match;
				while ((match = pattern.exec(line)) !== null) {
					if (context && !context.test(input)) continue;
					
					const matchKey = `${lineIndex}-${match[0]}`;
					if (seenMatches.has(matchKey)) continue;
					seenMatches.add(matchKey);
					
					results.push({
						pattern: pattern.source,
						type,
						severity,
						line: lineIndex + 1,
						match: match[0],
						masked: maskSecret(match[0])
					});
				}
			});
		});
		
		// Sort by severity
		const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
		matches = results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
	}

	$effect(() => {
		if (input.trim()) {
			scanForSecrets();
		} else {
			matches = [];
		}
	});

	let criticalCount = $derived(matches.filter(m => m.severity === 'critical').length);
	let highCount = $derived(matches.filter(m => m.severity === 'high').length);
	let mediumCount = $derived(matches.filter(m => m.severity === 'medium').length);

	function loadSample() {
		input = sampleCode;
	}

	function clearAll() {
		input = '';
		matches = [];
	}

	const severityColors: Record<string, string> = {
		critical: 'error',
		high: 'warning',
		medium: 'info',
		low: 'neutral'
	};
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Security Notice -->
		<div class="alert alert-info rounded-xl">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>🔒 <strong>100% client-side.</strong> Your code never leaves your browser.</span>
		</div>

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Paste Code, .env File, or Config</h3>
			<textarea
				bind:value={input}
				placeholder="Paste your .env file, code, or configuration here...&#10;&#10;Examples:&#10;API_KEY=your_api_key_here&#10;DATABASE_URL=postgres://user:pass@host/db&#10;SECRET_TOKEN=&quot;my_secret_value&quot;"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-64"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Summary -->
		{#if matches.length > 0}
			<div class="card bg-error/10 border-2 border-error/30 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center gap-4">
						<div class="w-14 h-14 rounded-full bg-error/20 flex items-center justify-center shrink-0">
							<svg class="h-8 w-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-error text-lg">{matches.length} Secret{matches.length > 1 ? 's' : ''} Found!</h3>
							<p class="text-sm text-base-content/70">Review before committing.</p>
						</div>
					</div>
					<div class="flex flex-wrap gap-3 mt-4">
						{#if criticalCount > 0}
							<span class="badge badge-lg badge-error gap-1">🔴 {criticalCount} Critical</span>
						{/if}
						{#if highCount > 0}
							<span class="badge badge-lg badge-warning gap-1">🟠 {highCount} High</span>
						{/if}
						{#if mediumCount > 0}
							<span class="badge badge-lg badge-info gap-1">🟡 {mediumCount} Medium</span>
						{/if}
					</div>
				</div>
			</div>
		{:else if input.trim()}
			<div class="card bg-success/10 border-2 border-success/30 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center gap-4">
						<div class="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center shrink-0">
							<svg class="h-8 w-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<div>
							<h3 class="font-semibold text-success text-lg">No Secrets Detected</h3>
							<p class="text-sm text-base-content/70">No common patterns found. Always double-check.</p>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Matches List -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4">Detected Secrets</h3>
					<div class="space-y-3">
						{#each matches as match}
							<div class="p-4 rounded-xl bg-{severityColors[match.severity]}/10 border border-{severityColors[match.severity]}/30">
								<div class="flex items-center gap-2 mb-2">
									<span class="badge badge-{severityColors[match.severity]} capitalize">{match.severity}</span>
									<span class="font-semibold">{match.type}</span>
									<span class="text-sm text-base-content/50">Line {match.line}</span>
								</div>
								<code class="block font-mono text-sm p-2 bg-base-300/50 rounded-lg break-all">
									{match.masked}
								</code>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Patterns We Check -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Patterns We Check</h4>
				<div class="grid sm:grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
					<span class="p-2 bg-base-300/50 rounded-lg">✅ .env files (KEY=value)</span>
					<span class="p-2 bg-base-300/50 rounded-lg">AWS Keys</span>
					<span class="p-2 bg-base-300/50 rounded-lg">GitHub Tokens</span>
					<span class="p-2 bg-base-300/50 rounded-lg">Stripe Keys</span>
					<span class="p-2 bg-base-300/50 rounded-lg">Database URLs</span>
					<span class="p-2 bg-base-300/50 rounded-lg">JWT Tokens</span>
					<span class="p-2 bg-base-300/50 rounded-lg">Private Keys</span>
					<span class="p-2 bg-base-300/50 rounded-lg">Generic Secrets</span>
				</div>
			</div>
		</div>

		<!-- Remediation -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">🛡️ How to Protect Secrets</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Add <code class="px-1 bg-base-300 rounded">.env</code> to <code class="px-1 bg-base-300 rounded">.gitignore</code></li>
					<li>• Use environment variables: <code class="px-1 bg-base-300 rounded">process.env.API_KEY</code></li>
					<li>• Use secret managers (AWS Secrets Manager, Vault, 1Password)</li>
					<li>• Rotate exposed secrets immediately</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>

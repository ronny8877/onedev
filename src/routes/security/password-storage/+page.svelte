<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	// State
	let appType = $state<'web' | 'mobile' | 'internal'>('web');
	let threatLevel = $state<'low' | 'medium' | 'high'>('medium');
	let compliance = $state<string[]>([]);
	let generated = $state(false);

	const complianceOptions = ['SOC2', 'HIPAA', 'PCI-DSS', 'GDPR', 'None'];

	function toggleCompliance(opt: string) {
		if (compliance.includes(opt)) {
			compliance = compliance.filter(c => c !== opt);
		} else {
			compliance = [...compliance, opt];
		}
	}

	// Generate policy based on inputs
	interface Policy {
		algorithm: string;
		algorithmReason: string;
		saltLength: number;
		pepper: boolean;
		costFactor: string;
		rotationDays: number;
		minLength: number;
		requirements: string[];
		resetGuidelines: string[];
		codeExamples: { lang: string; code: string }[];
	}

	let policy = $derived((): Policy => {
		const isHighSecurity = threatLevel === 'high' || compliance.includes('HIPAA') || compliance.includes('PCI-DSS');

		return {
			algorithm: isHighSecurity ? 'Argon2id' : 'bcrypt',
			algorithmReason: isHighSecurity 
				? 'Argon2id is memory-hard and resistant to GPU attacks, recommended for high-security applications.'
				: 'bcrypt is well-tested, widely supported, and sufficient for most applications.',
			saltLength: isHighSecurity ? 32 : 16,
			pepper: isHighSecurity,
			costFactor: isHighSecurity ? 'Argon2: m=65536, t=3, p=4' : 'bcrypt: cost=12',
			rotationDays: isHighSecurity ? 90 : 0,
			minLength: isHighSecurity ? 12 : 8,
			requirements: [
				`Minimum ${isHighSecurity ? 12 : 8} characters`,
				isHighSecurity ? 'Require uppercase, lowercase, numbers, and symbols' : 'Encourage but don\'t require complexity',
				'Check against breached password lists',
				isHighSecurity ? 'No password reuse for last 12 passwords' : 'No password reuse for last 5 passwords'
			],
			resetGuidelines: [
				'Use secure, time-limited tokens (30 min expiry)',
				'Never reveal if email exists in system',
				'Rate limit reset requests (3 per hour)',
				'Require email verification before reset',
				isHighSecurity ? 'Notify user of password change via email' : ''
			].filter(Boolean),
			codeExamples: isHighSecurity ? [
				{ lang: 'Node.js', code: `import argon2 from 'argon2';

// Hash password
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
});

// Verify password
const valid = await argon2.verify(hash, password);` },
				{ lang: 'Python', code: `from argon2 import PasswordHasher

ph = PasswordHasher(
    time_cost=3,
    memory_cost=65536,
    parallelism=4
)

# Hash password
hash = ph.hash(password)

# Verify password
try:
    ph.verify(hash, password)
except VerifyMismatchError:
    return False` }
			] : [
				{ lang: 'Node.js', code: `import bcrypt from 'bcrypt';

const COST = 12;

// Hash password
const hash = await bcrypt.hash(password, COST);

// Verify password
const valid = await bcrypt.compare(password, hash);` },
				{ lang: 'Python', code: `import bcrypt

COST = 12

# Hash password
salt = bcrypt.gensalt(rounds=COST)
hash = bcrypt.hashpw(password.encode(), salt)

# Verify password
valid = bcrypt.checkpw(password.encode(), hash)` }
			]
		};
	});

	function generatePolicy() {
		generated = true;
	}

	function exportPolicy() {
		let md = '# Password Storage Policy\n\n';
		md += `## Configuration\n`;
		md += `- App Type: ${appType}\n`;
		md += `- Threat Level: ${threatLevel}\n`;
		md += `- Compliance: ${compliance.join(', ') || 'None'}\n\n`;
		md += `## Algorithm: ${policy().algorithm}\n`;
		md += `${policy().algorithmReason}\n\n`;
		md += `## Parameters\n`;
		md += `- Salt Length: ${policy().saltLength} bytes\n`;
		md += `- Pepper: ${policy().pepper ? 'Yes (store separately)' : 'Not required'}\n`;
		md += `- Cost Factor: ${policy().costFactor}\n\n`;
		md += `## Password Requirements\n`;
		policy().requirements.forEach(r => md += `- ${r}\n`);
		md += '\n## Reset Guidelines\n';
		policy().resetGuidelines.forEach(r => md += `- ${r}\n`);
		
		navigator.clipboard.writeText(md);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6 max-w-3xl mx-auto">
		{#if !generated}
			<!-- Input Form -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold">Configure Your Application</h3>
						<button class="btn btn-sm btn-primary" onclick={() => { threatLevel = 'high'; compliance = ['HIPAA']; generatePolicy(); }}>Sample</button>
					</div>

					<div class="space-y-6">
						<div>
							<label class="text-sm font-medium block mb-2">Application Type</label>
							<div class="flex gap-2">
								{#each ['web', 'mobile', 'internal'] as type}
									<button 
										class="btn btn-sm flex-1 {appType === type ? 'btn-primary' : 'btn-ghost'}"
										onclick={() => appType = type as typeof appType}
									>
										{type === 'web' ? 'Web App' : type === 'mobile' ? 'Mobile App' : 'Internal Tool'}
									</button>
								{/each}
							</div>
						</div>

						<div>
							<label class="text-sm font-medium block mb-2">Threat Level</label>
							<div class="flex gap-2">
								{#each ['low', 'medium', 'high'] as level}
									<button 
										class="btn btn-sm flex-1 {threatLevel === level ? 
											(level === 'high' ? 'btn-error' : level === 'medium' ? 'btn-warning' : 'btn-success') 
											: 'btn-ghost'}"
										onclick={() => threatLevel = level as typeof threatLevel}
									>
										{level.charAt(0).toUpperCase() + level.slice(1)}
									</button>
								{/each}
							</div>
						</div>

						<div>
							<label class="text-sm font-medium block mb-2">Compliance Requirements</label>
							<div class="flex flex-wrap gap-2">
								{#each complianceOptions as opt}
									<button 
										class="btn btn-sm {compliance.includes(opt) ? 'btn-primary' : 'btn-ghost'}"
										onclick={() => toggleCompliance(opt)}
									>
										{opt}
									</button>
								{/each}
							</div>
						</div>
					</div>

					<button class="btn btn-primary mt-6" onclick={generatePolicy}>Generate Policy</button>
				</div>
			</div>
		{:else}
			<!-- Generated Policy -->
			<div class="flex justify-between items-center">
				<button class="btn btn-sm btn-ghost" onclick={() => generated = false}>Edit Config</button>
				<button class="btn btn-sm btn-ghost" onclick={exportPolicy}>Export Markdown</button>
			</div>

			<div class="card bg-primary/10 border border-primary/20 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between">
						<h3 class="font-bold text-lg">{policy().algorithm}</h3>
						<span class="badge badge-primary">{threatLevel === 'high' ? 'High Security' : 'Standard'}</span>
					</div>
					<p class="text-sm text-base-content/70 mt-1">{policy().algorithmReason}</p>
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h4 class="font-bold text-sm mb-2">Parameters</h4>
						<ul class="space-y-2 text-sm">
							<li class="flex justify-between"><span>Salt Length:</span><strong>{policy().saltLength} bytes</strong></li>
							<li class="flex justify-between"><span>Pepper:</span><strong>{policy().pepper ? 'Required' : 'Optional'}</strong></li>
							<li class="flex justify-between"><span>Cost Factor:</span><strong>{policy().costFactor}</strong></li>
							<li class="flex justify-between"><span>Rotation:</span><strong>{policy().rotationDays > 0 ? `${policy().rotationDays} days` : 'Not required'}</strong></li>
						</ul>
					</div>
				</div>

				<div class="card bg-base-200 rounded-xl">
					<div class="card-body p-4">
						<h4 class="font-bold text-sm mb-2">Password Requirements</h4>
						<ul class="space-y-1 text-sm">
							{#each policy().requirements as req}
								<li class="flex items-start gap-1">
									<span class="text-success">✓</span>
									{req}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-bold text-sm mb-2">Reset Flow Guidelines</h4>
					<ul class="space-y-1 text-sm">
						{#each policy().resetGuidelines as g}
							<li class="flex items-start gap-1">
								<span class="text-base-content/40">•</span>
								{g}
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h4 class="font-bold text-sm mb-3">Code Examples</h4>
					<div class="space-y-3">
						{#each policy().codeExamples as ex}
							<div>
								<div class="flex items-center justify-between mb-1">
									<span class="text-xs font-bold">{ex.lang}</span>
									<CopyButton text={ex.code} size="sm" />
								</div>
								<pre class="bg-base-100 p-3 rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto">{ex.code}</pre>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</ToolWrapper>

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['config-generator'];

	// Config sections
	let userName = $state('');
	let userEmail = $state('');
	let defaultBranch = $state('main');
	let editor = $state('code --wait');
	let autocrlf = $state('input');
	let pushDefault = $state('simple');
	let pullRebase = $state(false);
	let colorUI = $state(true);
	let rerereEnabled = $state(false);

	const editors = [
		{ value: 'code --wait', label: 'VS Code' },
		{ value: 'vim', label: 'Vim' },
		{ value: 'nano', label: 'Nano' },
		{ value: 'emacs', label: 'Emacs' },
		{ value: 'subl -n -w', label: 'Sublime Text' },
		{ value: 'atom --wait', label: 'Atom' },
		{ value: 'notepad', label: 'Notepad (Windows)' }
	];

	const autocrlfOptions = [
		{ value: 'true', label: 'true (Windows)', desc: 'Convert LF to CRLF on checkout' },
		{ value: 'input', label: 'input (macOS/Linux)', desc: 'Convert CRLF to LF on commit' },
		{ value: 'false', label: 'false', desc: 'No conversion' }
	];

	// Generate commands
	let commands = $derived.by(() => {
		const cmds: { category: string; cmd: string; desc: string }[] = [];
		
		if (userName.trim()) {
			cmds.push({ category: 'User', cmd: `git config --global user.name "${userName}"`, desc: 'Set your name' });
		}
		if (userEmail.trim()) {
			cmds.push({ category: 'User', cmd: `git config --global user.email "${userEmail}"`, desc: 'Set your email' });
		}
		if (defaultBranch) {
			cmds.push({ category: 'Core', cmd: `git config --global init.defaultBranch ${defaultBranch}`, desc: 'Default branch for new repos' });
		}
		if (editor) {
			cmds.push({ category: 'Core', cmd: `git config --global core.editor "${editor}"`, desc: 'Default text editor' });
		}
		cmds.push({ category: 'Core', cmd: `git config --global core.autocrlf ${autocrlf}`, desc: 'Line ending conversion' });
		cmds.push({ category: 'Push', cmd: `git config --global push.default ${pushDefault}`, desc: 'Push behavior' });
		
		if (pullRebase) {
			cmds.push({ category: 'Pull', cmd: 'git config --global pull.rebase true', desc: 'Rebase on pull' });
		}
		if (colorUI) {
			cmds.push({ category: 'UI', cmd: 'git config --global color.ui auto', desc: 'Colored output' });
		}
		if (rerereEnabled) {
			cmds.push({ category: 'Advanced', cmd: 'git config --global rerere.enabled true', desc: 'Reuse recorded resolution' });
		}
		
		return cmds;
	});

	let allCommands = $derived(commands.map(c => c.cmd).join('\n'));

	// Generate .gitconfig format
	let gitconfigFormat = $derived.by(() => {
		let config = '';
		
		if (userName.trim() || userEmail.trim()) {
			config += '[user]\n';
			if (userName.trim()) config += `    name = ${userName}\n`;
			if (userEmail.trim()) config += `    email = ${userEmail}\n`;
		}
		
		config += '[core]\n';
		if (editor) config += `    editor = ${editor}\n`;
		config += `    autocrlf = ${autocrlf}\n`;
		
		config += '[init]\n';
		config += `    defaultBranch = ${defaultBranch}\n`;
		
		config += '[push]\n';
		config += `    default = ${pushDefault}\n`;
		
		if (pullRebase) {
			config += '[pull]\n    rebase = true\n';
		}
		
		if (colorUI) {
			config += '[color]\n    ui = auto\n';
		}
		
		if (rerereEnabled) {
			config += '[rerere]\n    enabled = true\n';
		}
		
		return config;
	});

	let outputFormat = $state<'commands' | 'gitconfig'>('commands');

	function loadSample() {
		userName = 'John Doe';
		userEmail = 'john@example.com';
		defaultBranch = 'main';
		editor = 'code --wait';
		autocrlf = 'input';
		pullRebase = true;
		colorUI = true;
	}

	function clearAll() {
		userName = '';
		userEmail = '';
		defaultBranch = 'main';
		editor = 'code --wait';
		autocrlf = 'input';
		pushDefault = 'simple';
		pullRebase = false;
		colorUI = true;
		rerereEnabled = false;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={outputFormat === 'commands' ? allCommands : gitconfigFormat} />

		<!-- User Settings -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<AppIcon name="user" size={16} />
					User Settings
				</h3>
				<div class="grid md:grid-cols-2 gap-4">
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Name</label>
						<input
							type="text"
							bind:value={userName}
							placeholder="John Doe"
							class="input input-bordered w-full rounded-xl"
						/>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Email</label>
						<input
							type="email"
							bind:value={userEmail}
							placeholder="john@example.com"
							class="input input-bordered w-full rounded-xl"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Core Settings -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<AppIcon name="settings" size={16} />
					Core Settings
				</h3>
				<div class="grid md:grid-cols-2 gap-4">
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Default Branch</label>
						<input
							type="text"
							bind:value={defaultBranch}
							placeholder="main"
							class="input input-bordered w-full rounded-xl font-mono"
						/>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Editor</label>
						<select bind:value={editor} class="select select-bordered w-full rounded-xl">
							{#each editors as ed}
								<option value={ed.value}>{ed.label}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Line Endings (autocrlf)</label>
						<select bind:value={autocrlf} class="select select-bordered w-full rounded-xl">
							{#each autocrlfOptions as opt}
								<option value={opt.value}>{opt.label}</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Push Default</label>
						<select bind:value={pushDefault} class="select select-bordered w-full rounded-xl">
							<option value="simple">simple (recommended)</option>
							<option value="current">current</option>
							<option value="upstream">upstream</option>
							<option value="matching">matching</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Toggles -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<AppIcon name="sliders-vertical" size={16} />
					Additional Options
				</h3>
				<div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
					<label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-base-300/50">
						<input type="checkbox" bind:checked={pullRebase} class="toggle toggle-primary" />
						<div>
							<span class="text-sm font-medium">Pull with Rebase</span>
							<p class="text-xs text-base-content/50">Rebase instead of merge on pull</p>
						</div>
					</label>
					<label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-base-300/50">
						<input type="checkbox" bind:checked={colorUI} class="toggle toggle-primary" />
						<div>
							<span class="text-sm font-medium">Colored Output</span>
							<p class="text-xs text-base-content/50">Enable colored terminal output</p>
						</div>
					</label>
					<label class="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-base-300/50">
						<input type="checkbox" bind:checked={rerereEnabled} class="toggle toggle-primary" />
						<div>
							<span class="text-sm font-medium">Rerere</span>
							<p class="text-xs text-base-content/50">Remember merge conflict resolutions</p>
						</div>
					</label>
				</div>
			</div>
		</div>

		<!-- Output Format Toggle -->
		<div class="flex justify-center">
			<div class="join">
				<button
					type="button"
					class="btn join-item {outputFormat === 'commands' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => outputFormat = 'commands'}
				>
					Git Commands
				</button>
				<button
					type="button"
					class="btn join-item {outputFormat === 'gitconfig' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => outputFormat = 'gitconfig'}
				>
					.gitconfig Format
				</button>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl border-2 border-success/30">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<AppIcon name="clipboard" size={16} />
						{outputFormat === 'commands' ? 'Git Commands' : '.gitconfig'}
					</h3>
					<CopyButton text={outputFormat === 'commands' ? allCommands : gitconfigFormat} label="Copy All" size="sm" />
				</div>
				
				{#if outputFormat === 'commands'}
					<div class="space-y-2">
						{#each commands as cmd}
							<div class="flex items-center justify-between gap-2 p-2 bg-base-300/50 rounded-lg">
								<div class="flex-1 min-w-0">
									<code class="block font-mono text-sm truncate">{cmd.cmd}</code>
									<span class="text-xs text-base-content/50">{cmd.desc}</span>
								</div>
								<CopyButton text={cmd.cmd} size="sm" />
							</div>
						{/each}
					</div>
				{:else}
					<pre class="font-mono text-sm p-4 bg-base-300/50 rounded-xl whitespace-pre-wrap">{gitconfigFormat}</pre>
				{/if}
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Commands use <code class="px-1 bg-base-300 rounded">--global</code> to apply to all repositories</li>
					<li>• Remove <code class="px-1 bg-base-300 rounded">--global</code> for repo-specific settings</li>
					<li>• View current config with <code class="px-1 bg-base-300 rounded">git config --list</code></li>
					<li>• .gitconfig is located at <code class="px-1 bg-base-300 rounded">~/.gitconfig</code></li>
				</ul>
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

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

	const content = gitToolsContent['gitignore'];

	// Gitignore presets organized by category
	const presets = {
		languages: [
			{ id: 'node', name: 'Node.js', icon: 'circle', patterns: ['node_modules/', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', '.npm', '.yarn-integrity', '.env', '.env.local', '.env.*.local', 'dist/', 'build/', '.cache/', '*.tsbuildinfo'] },
			{ id: 'python', name: 'Python', icon: 'worm', patterns: ['__pycache__/', '*.py[cod]', '*$py.class', '*.so', '.Python', 'build/', 'develop-eggs/', 'dist/', 'downloads/', 'eggs/', '.eggs/', 'lib/', 'lib64/', 'parts/', 'sdist/', 'var/', 'wheels/', '*.egg-info/', '.installed.cfg', '*.egg', 'venv/', 'ENV/', '.env', '.venv'] },
			{ id: 'java', name: 'Java', icon: 'coffee', patterns: ['*.class', '*.log', '*.jar', '*.war', '*.ear', '*.zip', '*.tar.gz', '*.rar', 'target/', 'build/', '.gradle/', 'gradle-app.setting', '!gradle-wrapper.jar', '.gradletasknamecache', 'out/', '.idea/', '*.iml'] },
			{ id: 'go', name: 'Go', icon: 'rabbit', patterns: ['*.exe', '*.exe~', '*.dll', '*.so', '*.dylib', '*.test', '*.out', 'go.work', 'vendor/', 'bin/', 'pkg/'] },
			{ id: 'rust', name: 'Rust', icon: 'bug', patterns: ['/target/', 'Cargo.lock', '**/*.rs.bk', '*.pdb'] },
			{ id: 'ruby', name: 'Ruby', icon: 'gem', patterns: ['*.gem', '*.rbc', '/.config', '/coverage/', '/InstalledFiles', '/pkg/', '/spec/reports/', '/spec/examples.txt', '/test/tmp/', '/test/version_tmp/', '/tmp/', '.bundle/', 'vendor/bundle/', '/.yardoc/', '/_yardoc/', '/doc/', '/rdoc/'] },
			{ id: 'php', name: 'PHP', icon: 'box', patterns: ['vendor/', 'composer.lock', '.env', '*.log', 'storage/', 'bootstrap/cache/', '.phpunit.result.cache'] },
			{ id: 'csharp', name: 'C#/.NET', icon: 'diamond', patterns: ['[Bb]in/', '[Oo]bj/', '[Ll]og/', '[Ll]ogs/', '.vs/', '*.user', '*.suo', '*.cache', '*.dll', '*.pdb', '*.exe'] },
			{ id: 'swift', name: 'Swift', icon: 'apple', patterns: ['.build/', 'Packages/', 'xcuserdata/', '*.xccheckout', '*.moved-aside', '*.xcuserstate', 'DerivedData/', '.swiftpm/'] },
			{ id: 'kotlin', name: 'Kotlin', icon: 'circle', patterns: ['*.class', '*.log', '*.jar', '.gradle/', 'build/', '.idea/', '*.iml', 'out/'] }
		],
		frameworks: [
			{ id: 'react', name: 'React', icon: 'atom', patterns: ['node_modules/', 'build/', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*'] },
			{ id: 'vue', name: 'Vue.js', icon: 'square', patterns: ['node_modules/', 'dist/', '.env.local', '.env.*.local', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', 'pnpm-debug.log*', '*.local'] },
			{ id: 'angular', name: 'Angular', icon: 'type', patterns: ['node_modules/', 'dist/', 'tmp/', 'out-tsc/', 'bazel-out/', '.angular/', '.sass-cache/', 'connect.lock', 'coverage/', 'libpeerconnection.log'] },
			{ id: 'svelte', name: 'Svelte', icon: 'flame', patterns: ['node_modules/', '.svelte-kit/', 'build/', '.env', '.env.*', '!.env.example', 'package/', '.vercel/'] },
			{ id: 'nextjs', name: 'Next.js', icon: 'arrow-up', patterns: ['node_modules/', '.next/', 'out/', '.env*.local', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', '.vercel/'] },
			{ id: 'django', name: 'Django', icon: 'guitar', patterns: ['*.log', '*.pot', '*.pyc', '__pycache__/', 'local_settings.py', 'db.sqlite3', 'media/', 'staticfiles/', '.env', 'venv/'] },
			{ id: 'rails', name: 'Rails', icon: 'train-track', patterns: ['*.rbc', 'capybara-*.html', '.rspec', '/db/*.sqlite3', '/db/*.sqlite3-*', '/log/*', '/tmp/', '/storage/', '.byebug_history', 'config/master.key', 'config/credentials.yml.enc'] },
			{ id: 'laravel', name: 'Laravel', icon: 'circle', patterns: ['/vendor/', 'node_modules/', 'npm-debug.log', 'yarn-error.log', '.env', '.env.backup', 'Homestead.json', 'Homestead.yaml', 'storage/*.key', '/public/hot', '/public/storage', '/.idea/'] },
			{ id: 'flutter', name: 'Flutter', icon: 'heart', patterns: ['.dart_tool/', '.packages', 'build/', '.flutter-plugins', '.flutter-plugins-dependencies', '.pub-cache/', '.pub/', 'pubspec.lock'] },
			{ id: 'dotnet', name: 'ASP.NET', icon: 'square', patterns: ['[Bb]in/', '[Oo]bj/', '[Ll]ogs/', '.vs/', '*.user', '*.suo', 'project.lock.json', 'appsettings.*.json', '!appsettings.json'] }
		],
		os: [
			{ id: 'macos', name: 'macOS', icon: 'apple', patterns: ['.DS_Store', '.AppleDouble', '.LSOverride', 'Icon', '._*', '.DocumentRevisions-V100', '.fseventsd', '.Spotlight-V100', '.TemporaryItems', '.Trashes', '.VolumeIcon.icns', '.com.apple.timemachine.donotpresent'] },
			{ id: 'windows', name: 'Windows', icon: 'app-window', patterns: ['Thumbs.db', 'Thumbs.db:encryptable', 'ehthumbs.db', 'ehthumbs_vista.db', '*.stackdump', '[Dd]esktop.ini', '$RECYCLE.BIN/', '*.cab', '*.msi', '*.msix', '*.msm', '*.msp', '*.lnk'] },
			{ id: 'linux', name: 'Linux', icon: 'bird', patterns: ['*~', '.fuse_hidden*', '.directory', '.Trash-*', '.nfs*'] }
		],
		editors: [
			{ id: 'vscode', name: 'VS Code', icon: 'monitor', patterns: ['.vscode/*', '!.vscode/settings.json', '!.vscode/tasks.json', '!.vscode/launch.json', '!.vscode/extensions.json', '*.code-workspace', '.history/'] },
			{ id: 'jetbrains', name: 'JetBrains', icon: 'brain', patterns: ['.idea/', '*.iws', '*.iml', '*.ipr', 'out/', '.idea_modules/', 'atlassian-ide-plugin.xml', 'com_crashlytics_export_strings.xml'] },
			{ id: 'vim', name: 'Vim', icon: 'file-pen', patterns: ['[._]*.s[a-v][a-z]', '!*.svg', '[._]*.sw[a-p]', '[._]s[a-rt-v][a-z]', '[._]ss[a-gi-z]', '[._]sw[a-p]', 'Session.vim', 'Sessionx.vim', '.netrwhist', '*~', 'tags', '[._]*.un~'] },
			{ id: 'emacs', name: 'Emacs', icon: 'scroll', patterns: ['*~', '\\#*\\#', '/.emacs.desktop', '/.emacs.desktop.lock', '*.elc', 'auto-save-list', 'tramp', '.\\#*', '.org-id-locations', '*_archive', '*_flymake.*', '/eshell/history', '/eshell/lastdir'] },
			{ id: 'sublime', name: 'Sublime Text', icon: 'circle', patterns: ['*.tmlanguage.cache', '*.tmPreferences.cache', '*.stTheme.cache', '*.sublime-workspace', '*.sublime-project', 'sftp-config.json', 'sftp-config-alt*.json', 'Package Control.last-run', 'Package Control.ca-list'] }
		],
		misc: [
			{ id: 'logs', name: 'Logs', icon: 'clipboard', patterns: ['*.log', 'logs/', '*.log.*', 'npm-debug.log*', 'yarn-debug.log*', 'yarn-error.log*', 'pnpm-debug.log*', 'lerna-debug.log*'] },
			{ id: 'env', name: 'Environment', icon: 'lock-keyhole', patterns: ['.env', '.env.local', '.env.*.local', '.env.development', '.env.test', '.env.production', '*.env', '.envrc'] },
			{ id: 'coverage', name: 'Coverage', icon: 'chart-column', patterns: ['coverage/', '.nyc_output/', '*.lcov', '.coverage', 'htmlcov/', 'coverage.xml', 'coverage.json'] },
			{ id: 'docker', name: 'Docker', icon: 'container', patterns: ['docker-compose*.yml', '!docker-compose.yml', '!docker-compose.override.yml', '.docker/'] },
			{ id: 'terraform', name: 'Terraform', icon: 'construction', patterns: ['**/.terraform/*', '*.tfstate', '*.tfstate.*', 'crash.log', 'crash.*.log', '*.tfvars', '*.tfvars.json', 'override.tf', 'override.tf.json', '*_override.tf', '*_override.tf.json'] }
		]
	};

	type CategoryKey = keyof typeof presets;

	let selectedPresets = $state<Set<string>>(new Set());
	let customPatterns = $state('');
	let activeCategory = $state<CategoryKey>('languages');

	const categoryLabels: Record<CategoryKey, { label: string; icon: string }> = {
		languages: { label: 'Languages', icon: 'monitor' },
		frameworks: { label: 'Frameworks', icon: 'rocket' },
		os: { label: 'Operating Systems', icon: 'monitor' },
		editors: { label: 'Editors & IDEs', icon: 'pencil' },
		misc: { label: 'Miscellaneous', icon: 'package' }
	};

	function togglePreset(id: string) {
		const newSet = new Set(selectedPresets);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		selectedPresets = newSet;
	}

	function isSelected(id: string): boolean {
		return selectedPresets.has(id);
	}

	// Generate .gitignore content
	let gitignoreContent = $derived.by(() => {
		const sections: string[] = [];
		
		// Add header
		sections.push('# Generated by OneDev Tools - https://onedev.tools/git/gitignore');
		sections.push('# ' + new Date().toISOString().split('T')[0]);
		sections.push('');
		
		// Get all categories and add patterns for selected presets
		for (const [categoryKey, categoryPresets] of Object.entries(presets)) {
			const selectedInCategory = categoryPresets.filter(p => selectedPresets.has(p.id));
			if (selectedInCategory.length > 0) {
				sections.push(`# ${categoryLabels[categoryKey as CategoryKey].label}`);
				for (const preset of selectedInCategory) {
					sections.push(`# ${preset.name}`);
					sections.push(...preset.patterns);
					sections.push('');
				}
			}
		}
		
		// Add custom patterns
		if (customPatterns.trim()) {
			sections.push('# Custom patterns');
			sections.push(customPatterns.trim());
			sections.push('');
		}
		
		return sections.join('\n');
	});

	let stats = $derived({
		lines: gitignoreContent.split('\n').length,
		chars: gitignoreContent.length
	});

	function loadSample() {
		// Select common presets
		selectedPresets = new Set(['node', 'macos', 'vscode', 'env', 'logs']);
	}

	function clearAll() {
		selectedPresets = new Set();
		customPatterns = '';
	}

	function downloadGitignore() {
		const blob = new Blob([gitignoreContent], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = '.gitignore';
		a.click();
		URL.revokeObjectURL(url);
	}

	function selectAll(category: CategoryKey) {
		const newSet = new Set(selectedPresets);
		for (const preset of presets[category]) {
			newSet.add(preset.id);
		}
		selectedPresets = newSet;
	}

	function clearCategory(category: CategoryKey) {
		const newSet = new Set(selectedPresets);
		for (const preset of presets[category]) {
			newSet.delete(preset.id);
		}
		selectedPresets = newSet;
	}
</script>

<ToolWrapper title="Gitignore Generator | Create .gitignore Files">
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={gitignoreContent} stats={selectedPresets.size > 0 ? stats : undefined} />

		<!-- Preset Categories Tab Navigation -->
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(categoryLabels) as [key, { label, icon }]}
				<button
					type="button"
					class="btn btn-sm gap-2 {activeCategory === key ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => activeCategory = key as CategoryKey}
				>
					<span>{icon}</span>
					{label}
				</button>
			{/each}
		</div>

		<!-- Preset Grid -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<span><AppIcon name={categoryLabels[activeCategory].icon} size={16} /></span>
						{categoryLabels[activeCategory].label}
					</h3>
					<div class="flex gap-2">
						<button type="button" class="btn btn-xs btn-ghost" onclick={() => selectAll(activeCategory)}>
							Select All
						</button>
						<button type="button" class="btn btn-xs btn-ghost" onclick={() => clearCategory(activeCategory)}>
							Clear
						</button>
					</div>
				</div>
				
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{#each presets[activeCategory] as preset}
						<button
							type="button"
							class="relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 {isSelected(preset.id) ? 'border-primary bg-primary/10 shadow-lg' : 'border-base-300 bg-base-100 hover:border-primary/50'}"
							onclick={() => togglePreset(preset.id)}
						>
							{#if isSelected(preset.id)}
								<div class="absolute top-2 right-2">
									<svg class="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
									</svg>
								</div>
							{/if}
							<span class="text-2xl mb-2"><AppIcon name={preset.icon} size={24} /></span>
							<span class="text-sm font-medium text-center">{preset.name}</span>
							<span class="text-xs text-base-content/50 mt-1">{preset.patterns.length} rules</span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Selected Presets Chips -->
		{#if selectedPresets.size > 0}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-3">
					<h4 class="text-sm font-medium text-base-content/70 mb-2">Selected ({selectedPresets.size})</h4>
					<div class="flex flex-wrap gap-2">
						{#each Object.values(presets).flat().filter(p => selectedPresets.has(p.id)) as preset}
							<div class="badge badge-lg gap-2 bg-primary/20 border-primary/30">
								<span><AppIcon name={preset.icon} size={16} /></span>
								{preset.name}
								<button
									type="button"
									class="hover:text-error transition-colors"
									onclick={() => togglePreset(preset.id)}
									aria-label={`Remove ${preset.name}`}
								>
									<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Custom Patterns -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Custom Patterns (Optional)</h3>
			<textarea
				bind:value={customPatterns}
				placeholder="Add custom patterns, one per line...&#10;e.g., *.secret&#10;my-custom-folder/"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-24"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Preview & Output -->
		{#if selectedPresets.size > 0 || customPatterns.trim()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							<AppIcon name="file-text" size={16} />
							.gitignore Preview
						</h3>
						<div class="flex gap-2">
							<CopyButton text={gitignoreContent} label="Copy" size="sm" />
							<button type="button" class="btn btn-sm btn-primary gap-2" onclick={downloadGitignore}>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
								</svg>
								Download
							</button>
						</div>
					</div>
					<div class="bg-base-300/50 rounded-xl p-4 max-h-96 overflow-auto">
						<pre class="font-mono text-sm whitespace-pre-wrap break-words">{gitignoreContent}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Quick Tips -->
		<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>💡</span>
					Quick Tips
				</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <code class="px-1 bg-base-300 rounded">*</code> matches any file or folder</li>
					<li>• <code class="px-1 bg-base-300 rounded">**</code> matches nested directories</li>
					<li>• <code class="px-1 bg-base-300 rounded">!</code> negates a pattern (includes files that would otherwise be ignored)</li>
					<li>• Patterns ending with <code class="px-1 bg-base-300 rounded">/</code> match directories only</li>
					<li>• Always add <code class="px-1 bg-base-300 rounded">.env</code> to prevent committing secrets</li>
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

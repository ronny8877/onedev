<script lang="ts">
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

	const content = gitToolsContent['readme-generator'];

	let projectName = $state('');
	let description = $state('');
	let authorName = $state('');
	let authorGithub = $state('');
	let license = $state('MIT');
	let previewMode = $state<'raw' | 'rendered'>('raw');

	// Sections toggle
	let sections = $state({
		description: true,
		features: true,
		installation: true,
		usage: true,
		api: false,
		contributing: true,
		license: true,
		acknowledgements: false
	});

	// Badges
	let badges = $state({
		npm: false,
		license: true,
		build: false,
		coverage: false,
		downloads: false,
		stars: false
	});

	const licenseOptions = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'];

	// Generate README
	let readme = $derived.by(() => {
		let md = '';
		const name = projectName.trim() || 'Project Name';
		const desc = description.trim() || 'A brief description of your project';
		const github = authorGithub.trim() || 'username';
		
		// Title
		md += `# ${name}\n\n`;
		
		// Badges
		const badgeList: string[] = [];
		if (badges.npm) badgeList.push(`[![npm version](https://badge.fury.io/js/${name.toLowerCase()}.svg)](https://badge.fury.io/js/${name.toLowerCase()})`);
		if (badges.license) badgeList.push(`[![License: ${license}](https://img.shields.io/badge/License-${license}-yellow.svg)](https://opensource.org/licenses/${license})`);
		if (badges.build) badgeList.push(`[![Build Status](https://github.com/${github}/${name.toLowerCase()}/workflows/CI/badge.svg)](https://github.com/${github}/${name.toLowerCase()}/actions)`);
		if (badges.coverage) badgeList.push(`[![codecov](https://codecov.io/gh/${github}/${name.toLowerCase()}/branch/main/graph/badge.svg)](https://codecov.io/gh/${github}/${name.toLowerCase()})`);
		if (badges.downloads) badgeList.push(`[![Downloads](https://img.shields.io/npm/dm/${name.toLowerCase()}.svg)](https://www.npmjs.com/package/${name.toLowerCase()})`);
		if (badges.stars) badgeList.push(`[![GitHub stars](https://img.shields.io/github/stars/${github}/${name.toLowerCase()}.svg)](https://github.com/${github}/${name.toLowerCase()}/stargazers)`);
		
		if (badgeList.length > 0) {
			md += badgeList.join(' ') + '\n\n';
		}
		
		// Description
		if (sections.description) {
			md += `${desc}\n\n`;
		}
		
		// Features
		if (sections.features) {
			md += `## ✨ Features\n\n`;
			md += `- Feature 1\n`;
			md += `- Feature 2\n`;
			md += `- Feature 3\n\n`;
		}
		
		// Installation
		if (sections.installation) {
			md += `## 📦 Installation\n\n`;
			md += `\`\`\`bash\nnpm install ${name.toLowerCase()}\n\`\`\`\n\n`;
			md += `Or with yarn:\n\n`;
			md += `\`\`\`bash\nyarn add ${name.toLowerCase()}\n\`\`\`\n\n`;
		}
		
		// Usage
		if (sections.usage) {
			md += `## 🚀 Usage\n\n`;
			md += `\`\`\`javascript\nimport { example } from '${name.toLowerCase()}';\n\n// Your code here\nexample();\n\`\`\`\n\n`;
		}
		
		// API
		if (sections.api) {
			md += `## 📖 API\n\n`;
			md += `### \`functionName(param)\`\n\n`;
			md += `Description of the function.\n\n`;
			md += `| Parameter | Type | Description |\n`;
			md += `| --- | --- | --- |\n`;
			md += `| param | \`string\` | Description of param |\n\n`;
		}
		
		// Contributing
		if (sections.contributing) {
			md += `## 🤝 Contributing\n\n`;
			md += `Contributions, issues and feature requests are welcome!\n\n`;
			md += `1. Fork the project\n`;
			md += `2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)\n`;
			md += `3. Commit your changes (\`git commit -m 'Add amazing feature'\`)\n`;
			md += `4. Push to the branch (\`git push origin feature/amazing-feature\`)\n`;
			md += `5. Open a Pull Request\n\n`;
		}
		
		// License
		if (sections.license) {
			const author = authorName.trim() || 'Your Name';
			md += `## 📝 License\n\n`;
			md += `Copyright © ${new Date().getFullYear()} [${author}](https://github.com/${github}).\n\n`;
			md += `This project is [${license}](./LICENSE) licensed.\n\n`;
		}
		
		// Acknowledgements
		if (sections.acknowledgements) {
			md += `## 🙏 Acknowledgements\n\n`;
			md += `- [Inspiration](link)\n`;
			md += `- [Resources](link)\n\n`;
		}
		
		// Footer
		md += `---\n\n`;
		md += `Made with ❤️`;
		if (authorName.trim()) md += ` by ${authorName.trim()}`;
		
		return md;
	});

	// Simple markdown to HTML renderer
	let renderedHtml = $derived.by(() => {
		let html = readme;
		
		// Escape HTML
		html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		
		// Headers
		html = html.replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
		html = html.replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 pb-2 border-b border-base-300">$1</h2>');
		html = html.replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>');
		
		// Code blocks
		html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-base-300 p-3 rounded-lg overflow-x-auto my-2 font-mono text-sm"><code>$2</code></pre>');
		
		// Inline code
		html = html.replace(/`([^`]+)`/g, '<code class="bg-base-300 px-1 py-0.5 rounded text-sm">$1</code>');
		
		// Bold
		html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
		
		// Italic
		html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
		
		// Links
		html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank">$1</a>');
		
		// Images (badges)
		html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="inline-block h-5" />');
		
		// Tables
		html = html.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, body) => {
			const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th class="border border-base-300 px-2 py-1 text-left">${h.trim()}</th>`).join('');
			const rows = body.trim().split('\n').map((row: string) => {
				const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td class="border border-base-300 px-2 py-1">${c.trim()}</td>`).join('');
				return `<tr>${cells}</tr>`;
			}).join('');
			return `<table class="w-full border-collapse my-2"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
		});
		
		// Lists  
		html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-6 list-decimal">$2</li>');
		html = html.replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>');
		
		// Horizontal rule
		html = html.replace(/^---$/gm, '<hr class="border-base-300 my-4" />');
		
		// Paragraphs (wrap remaining text)
		html = html.split('\n\n').map(block => {
			if (block.match(/^<(h[1-6]|pre|ul|ol|table|hr|li)/)) return block;
			if (block.trim() === '') return '';
			return `<p class="my-2">${block}</p>`;
		}).join('\n');
		
		return html;
	});

	function downloadReadme() {
		const blob = new Blob([readme], { type: 'text/markdown' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'README.md';
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadSample() {
		projectName = 'Awesome Project';
		description = 'A powerful library for building modern applications with ease.';
		authorName = 'John Doe';
		authorGithub = 'johndoe';
		license = 'MIT';
		badges = { npm: true, license: true, build: true, coverage: false, downloads: true, stars: false };
	}

	function clearAll() {
		projectName = '';
		description = '';
		authorName = '';
		authorGithub = '';
		license = 'MIT';
		sections = { description: true, features: true, installation: true, usage: true, api: false, contributing: true, license: true, acknowledgements: false };
		badges = { npm: false, license: true, build: false, coverage: false, downloads: false, stars: false };
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={readme} />

		<!-- Project Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<span>📋</span>
					Project Info
				</h3>
				<div class="grid md:grid-cols-2 gap-4">
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Project Name</label>
						<input type="text" bind:value={projectName} placeholder="my-awesome-project" class="input input-bordered w-full rounded-xl" />
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">License</label>
						<select bind:value={license} class="select select-bordered w-full rounded-xl">
							{#each licenseOptions as lic}
								<option value={lic}>{lic}</option>
							{/each}
						</select>
					</div>
					<div class="md:col-span-2">
						<label class="text-sm text-base-content/70 mb-1 block">Description</label>
						<textarea bind:value={description} placeholder="A brief description of your project..." class="textarea textarea-bordered w-full rounded-xl h-20"></textarea>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Author Name</label>
						<input type="text" bind:value={authorName} placeholder="John Doe" class="input input-bordered w-full rounded-xl" />
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">GitHub Username</label>
						<input type="text" bind:value={authorGithub} placeholder="johndoe" class="input input-bordered w-full rounded-xl" />
					</div>
				</div>
			</div>
		</div>

		<!-- Sections -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<span>📝</span>
					Sections
				</h3>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{#each Object.entries(sections) as [key, value]}
						<label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-base-300/50">
							<input type="checkbox" bind:checked={sections[key as keyof typeof sections]} class="checkbox checkbox-sm checkbox-primary" />
							<span class="text-sm capitalize">{key}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Badges -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<span>🏷️</span>
					Badges
				</h3>
				<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
					{#each Object.entries(badges) as [key, value]}
						<label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-base-300/50">
							<input type="checkbox" bind:checked={badges[key as keyof typeof badges]} class="checkbox checkbox-sm checkbox-primary" />
							<span class="text-sm capitalize">{key}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-4">
						<h3 class="font-semibold flex items-center gap-2">
							<span>👁️</span>
							Preview
						</h3>
						<div class="join">
							<button
								type="button"
								class="btn btn-xs join-item {previewMode === 'raw' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => previewMode = 'raw'}
							>
								Raw
							</button>
							<button
								type="button"
								class="btn btn-xs join-item {previewMode === 'rendered' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => previewMode = 'rendered'}
							>
								Rendered
							</button>
						</div>
					</div>
					<div class="flex gap-2">
						<CopyButton text={readme} label="Copy" size="sm" />
						<button type="button" class="btn btn-sm btn-primary gap-2" onclick={downloadReadme}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download
						</button>
					</div>
				</div>
				<div class="bg-base-300/50 rounded-xl p-4 max-h-[500px] overflow-auto">
					{#if previewMode === 'raw'}
						<pre class="font-mono text-sm whitespace-pre-wrap">{readme}</pre>
					{:else}
						<div class="prose prose-sm max-w-none">
							{@html renderedHtml}
						</div>
					{/if}
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

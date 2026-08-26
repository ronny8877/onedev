<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['blame-explainer'];

	interface BlameLine {
		sha: string;
		author: string;
		date: string;
		lineNumber: string;
		content: string;
		original: string;
	}

	let input = $state('');
	let parsedLines = $state<BlameLine[]>([]);

	const sampleBlame = `^a1b2c3d (John Doe  2024-01-15 10:30:45 +0530  1) import React from 'react';
a1b2c3d4 (Jane Smith 2024-02-20 14:22:10 +0530  2) import { useState } from 'react';
b2c3d4e5 (Bob Wilson 2024-03-10 09:15:33 +0530  3) 
c3d4e5f6 (John Doe  2024-03-15 16:45:00 +0530  4) function App() {
c3d4e5f6 (John Doe  2024-03-15 16:45:00 +0530  5)   const [count, setCount] = useState(0);
d4e5f6g7 (Jane Smith 2024-04-01 11:30:22 +0530  6)   
e5f6g7h8 (Alice Brown 2024-04-05 08:20:15 +0530  7)   return (
e5f6g7h8 (Alice Brown 2024-04-05 08:20:15 +0530  8)     <div>
f6g7h8i9 (John Doe  2024-04-10 13:55:40 +0530  9)       <h1>Count: {count}</h1>
f6g7h8i9 (John Doe  2024-04-10 13:55:40 +0530 10)       <button onClick={() => setCount(c => c + 1)}>
f6g7h8i9 (John Doe  2024-04-10 13:55:40 +0530 11)         Increment
f6g7h8i9 (John Doe  2024-04-10 13:55:40 +0530 12)       </button>
e5f6g7h8 (Alice Brown 2024-04-05 08:20:15 +0530 13)     </div>
e5f6g7h8 (Alice Brown 2024-04-05 08:20:15 +0530 14)   );
c3d4e5f6 (John Doe  2024-03-15 16:45:00 +0530 15) }`;

	const blameFields = [
		{ name: 'Commit SHA', field: 'sha', icon: 'bookmark', description: 'Unique identifier of the commit that last modified this line. The ^ prefix indicates the initial commit.' },
		{ name: 'Author', field: 'author', icon: 'user', description: 'Name of the person who made the change to this line.' },
		{ name: 'Date', field: 'date', icon: 'calendar', description: 'When the change was committed (YYYY-MM-DD HH:MM:SS timezone).' },
		{ name: 'Line Number', field: 'lineNumber', icon: 'hash', description: 'Line number in the current file.' },
		{ name: 'Content', field: 'content', icon: 'file-pen', description: 'The actual content of the line.' }
	];

	function parseBlame() {
		const lines = input.split('\n');
		const parsed: BlameLine[] = [];
		
		for (const line of lines) {
			if (!line.trim()) continue;
			
			// Pattern: SHA (Author Date LineNum) Content
			// e.g.: a1b2c3d4 (John Doe  2024-01-15 10:30:45 +0530  1) import React...
			const match = line.match(/^(\^?[a-f0-9]{7,40})\s+\(([^)]+)\)\s*(.*)$/);
			
			if (match) {
				const sha = match[1];
				const meta = match[2];
				const content = match[3];
				
				// Parse meta: Author Name  Date Time Timezone  LineNum
				const metaMatch = meta.match(/^(.+?)\s{2,}(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+[+-]\d{4})\s+(\d+)$/);
				
				if (metaMatch) {
					parsed.push({
						sha,
						author: metaMatch[1].trim(),
						date: metaMatch[2],
						lineNumber: metaMatch[3],
						content,
						original: line
					});
				} else {
					// Fallback: try simpler parsing
					const simpleMeta = meta.match(/^(.+?)\s+(.+?)\s+(\d+)$/);
					if (simpleMeta) {
						parsed.push({
							sha,
							author: simpleMeta[1].trim(),
							date: simpleMeta[2],
							lineNumber: simpleMeta[3],
							content,
							original: line
						});
					}
				}
			}
		}
		
		parsedLines = parsed;
	}

	$effect(() => {
		if (input.trim()) {
			parseBlame();
		} else {
			parsedLines = [];
		}
	});

	// Get unique authors for color assignment
	let authors = $derived([...new Set(parsedLines.map(l => l.author))]);
	
	const authorColors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];
	
	function getAuthorColor(author: string): string {
		const index = authors.indexOf(author);
		return authorColors[index % authorColors.length];
	}

	function loadSample() {
		input = sampleBlame;
	}

	function clearAll() {
		input = '';
		parsedLines = [];
	}

	let stats = $derived({
		lines: parsedLines.length,
		authors: authors.length,
		commits: [...new Set(parsedLines.map(l => l.sha))].length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- How to Get Blame Output -->
		<div class="card bg-info/10 border border-info/30 rounded-xl">
			<div class="card-body py-3">
				<p class="text-sm">
					<strong>Generate blame output:</strong>
					<code class="ml-2 px-2 py-1 bg-base-300 rounded font-mono">git blame filename.js</code>
				</p>
			</div>
		</div>

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Paste Git Blame Output</h3>
			<textarea
				bind:value={input}
				placeholder="Paste the output of 'git blame filename' here..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Summary Stats -->
		{#if parsedLines.length > 0}
			<div class="flex flex-wrap gap-4">
				<div class="badge badge-lg badge-primary gap-2">
					<span>{stats.lines}</span> lines
				</div>
				<div class="badge badge-lg badge-secondary gap-2">
					<span>{stats.authors}</span> authors
				</div>
				<div class="badge badge-lg badge-accent gap-2">
					<span>{stats.commits}</span> commits
				</div>
			</div>
		{/if}

		<!-- Field Explanation -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<AppIcon name="book-open" size={16} />
					Blame Output Fields Explained
				</h3>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
					{#each blameFields as field}
						<div class="p-3 rounded-xl bg-base-300/50">
							<div class="flex items-center gap-2 mb-1">
								<span><AppIcon name={field.icon} size={16} /></span>
								<span class="font-semibold text-sm">{field.name}</span>
							</div>
							<p class="text-xs text-base-content/70">{field.description}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Parsed Output -->
		{#if parsedLines.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4 flex items-center gap-2">
						<AppIcon name="search" size={16} />
						Parsed Blame
					</h3>
					
					<!-- Author Legend -->
					<div class="flex flex-wrap gap-2 mb-4 pb-4 border-b border-base-300">
						{#each authors as author}
							<div class="flex items-center gap-2 px-3 py-1 rounded-full bg-base-300/50">
								<div class="w-3 h-3 rounded-full" style="background-color: {getAuthorColor(author)}"></div>
								<span class="text-sm">{author}</span>
							</div>
						{/each}
					</div>
					
					<div class="overflow-x-auto">
						<table class="table table-sm w-full">
							<thead>
								<tr>
									<th class="text-center">Line</th>
									<th>SHA</th>
									<th>Author</th>
									<th>Date</th>
									<th>Content</th>
								</tr>
							</thead>
							<tbody>
								{#each parsedLines as line}
									<tr class="hover">
										<td class="text-center font-mono text-base-content/50">{line.lineNumber}</td>
										<td>
											<code class="font-mono text-xs px-2 py-1 bg-base-300 rounded">
												{line.sha.length > 8 ? line.sha.slice(0, 8) : line.sha}
											</code>
										</td>
										<td>
											<div class="flex items-center gap-2">
												<div class="w-2 h-2 rounded-full shrink-0" style="background-color: {getAuthorColor(line.author)}"></div>
												<span class="text-sm">{line.author}</span>
											</div>
										</td>
										<td class="text-xs text-base-content/60 whitespace-nowrap">{line.date.split(' ')[0]}</td>
										<td>
											<code class="font-mono text-xs">{line.content}</code>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Usage Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Useful Git Blame Options</h4>
				<div class="grid gap-2 mt-2 text-sm font-mono">
					<div class="p-2 bg-base-300/50 rounded-lg">git blame -L 10,20 file.js <span class="text-base-content/50"># Lines 10-20 only</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git blame -w file.js <span class="text-base-content/50"># Ignore whitespace</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git blame -C file.js <span class="text-base-content/50"># Detect moved code</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git blame --since=2024-01-01 file.js <span class="text-base-content/50"># Since date</span></div>
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

<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
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

	const content = gitToolsContent['license-picker'];

	const licenses = [
		{
			id: 'MIT',
			name: 'MIT License',
			icon: '📜',
			color: 'success',
			summary: 'Simple and permissive. Do whatever you want, just include the copyright notice.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
			conditions: ['Include copyright', 'Include license'],
			limitations: ['No liability', 'No warranty'],
			text: `MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
		},
		{
			id: 'Apache-2.0',
			name: 'Apache License 2.0',
			icon: '🪶',
			color: 'info',
			summary: 'Permissive with patent protection. Good for larger projects.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
			conditions: ['Include copyright', 'Include license', 'State changes', 'Include NOTICE'],
			limitations: ['No liability', 'No warranty', 'No trademark use'],
			text: `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

Copyright [year] [fullname]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.`
		},
		{
			id: 'GPL-3.0',
			name: 'GNU GPL v3',
			icon: '🦬',
			color: 'warning',
			summary: 'Copyleft license. Derivatives must also be open source under GPL.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
			conditions: ['Include source', 'Include copyright', 'State changes', 'Same license', 'Include license'],
			limitations: ['No liability', 'No warranty'],
			text: `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) [year] [fullname]

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`
		},
		{
			id: 'BSD-3-Clause',
			name: 'BSD 3-Clause',
			icon: '😈',
			color: 'secondary',
			summary: 'Similar to MIT but prohibits use of project name for endorsement.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
			conditions: ['Include copyright', 'Include license'],
			limitations: ['No liability', 'No warranty', 'No endorsement'],
			text: `BSD 3-Clause License

Copyright (c) [year], [fullname]

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`
		},
		{
			id: 'ISC',
			name: 'ISC License',
			icon: '📄',
			color: 'primary',
			summary: 'Simpler version of MIT. Preferred by npm and Node.js.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
			conditions: ['Include copyright'],
			limitations: ['No liability', 'No warranty'],
			text: `ISC License

Copyright (c) [year], [fullname]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`
		},
		{
			id: 'Unlicense',
			name: 'The Unlicense',
			icon: '🔓',
			color: 'neutral',
			summary: 'Public domain dedication. No restrictions whatsoever.',
			permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
			conditions: [],
			limitations: ['No liability', 'No warranty'],
			text: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`
		}
	];

	let selectedLicense = $state('MIT');
	let fullName = $state('');
	let year = $state(new Date().getFullYear().toString());

	const activeLicense = $derived(licenses.find(l => l.id === selectedLicense)!);
	
	let licenseText = $derived(
		activeLicense.text
			.replace(/\[year\]/g, year)
			.replace(/\[fullname\]/g, fullName || 'Your Name')
	);

	function downloadLicense() {
		const blob = new Blob([licenseText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'LICENSE';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- License Selection -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each licenses as license}
				<button
					type="button"
					class="flex flex-col p-4 rounded-2xl border-2 text-left transition-all {selectedLicense === license.id ? `border-${license.color} bg-${license.color}/10 shadow-lg` : 'border-base-300 hover:border-primary/50'}"
					onclick={() => selectedLicense = license.id}
				>
					<div class="flex items-center gap-2 mb-2">
						<span class="text-2xl"><AppIcon name={license.icon} size={24} /></span>
						<span class="font-semibold">{license.name}</span>
					</div>
					<p class="text-sm text-base-content/70">{license.summary}</p>
				</button>
			{/each}
		</div>

		<!-- License Details -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold flex items-center gap-2 mb-4">
					<span><AppIcon name={activeLicense.icon} size={16} /></span>
					{activeLicense.name}
				</h3>
				
				<div class="grid md:grid-cols-3 gap-4">
					<!-- Permissions -->
					<div class="p-3 rounded-xl bg-success/10 border border-success/30">
						<h4 class="text-sm font-semibold text-success mb-2 flex items-center gap-1">
							<span>✅</span> Permissions
						</h4>
						<ul class="space-y-1 text-sm">
							{#each activeLicense.permissions as perm}
								<li class="flex items-center gap-1">
									<span class="text-success">•</span>
									{perm}
								</li>
							{/each}
						</ul>
					</div>
					
					<!-- Conditions -->
					<div class="p-3 rounded-xl bg-info/10 border border-info/30">
						<h4 class="text-sm font-semibold text-info mb-2 flex items-center gap-1">
							<AppIcon name={'📋'} size={16} /> Conditions
						</h4>
						<ul class="space-y-1 text-sm">
							{#if activeLicense.conditions.length > 0}
								{#each activeLicense.conditions as cond}
									<li class="flex items-center gap-1">
										<span class="text-info">•</span>
										{cond}
									</li>
								{/each}
							{:else}
								<li class="text-base-content/50">None</li>
							{/if}
						</ul>
					</div>
					
					<!-- Limitations -->
					<div class="p-3 rounded-xl bg-error/10 border border-error/30">
						<h4 class="text-sm font-semibold text-error mb-2 flex items-center gap-1">
							<span>⚠️</span> Limitations
						</h4>
						<ul class="space-y-1 text-sm">
							{#each activeLicense.limitations as limit}
								<li class="flex items-center gap-1">
									<span class="text-error">•</span>
									{limit}
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Customization -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3">Customize</h3>
				<div class="grid md:grid-cols-2 gap-4">
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Your Name / Organization</label>
						<input
							type="text"
							bind:value={fullName}
							placeholder="John Doe"
							class="input input-bordered w-full rounded-xl"
						/>
					</div>
					<div>
						<label class="text-sm text-base-content/70 mb-1 block">Year</label>
						<input
							type="text"
							bind:value={year}
							placeholder="2025"
							class="input input-bordered w-full rounded-xl"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- License Text -->
		<div class="card bg-gradient-to-br from-{activeLicense.color}/10 to-primary/10 rounded-2xl border-2 border-{activeLicense.color}/30">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<AppIcon name={'📄'} size={16} />
						LICENSE
					</h3>
					<div class="flex gap-2">
						<CopyButton text={licenseText} label="Copy" size="sm" />
						<button type="button" class="btn btn-sm btn-primary gap-2" onclick={downloadLicense}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download
						</button>
					</div>
				</div>
				<div class="bg-base-300/50 rounded-xl p-4 max-h-[400px] overflow-auto">
					<pre class="font-mono text-sm whitespace-pre-wrap">{licenseText}</pre>
				</div>
			</div>
		</div>

		<!-- Comparison Table -->
		<div class="card bg-base-200 rounded-xl overflow-x-auto">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3">Quick Comparison</h3>
				<table class="table table-sm">
					<thead>
						<tr>
							<th>License</th>
							<th class="text-center">Commercial</th>
							<th class="text-center">Modification</th>
							<th class="text-center">Must Share Source</th>
							<th class="text-center">Patent Grant</th>
						</tr>
					</thead>
					<tbody>
						<tr class="{selectedLicense === 'MIT' ? 'bg-success/10' : ''}"><td>MIT</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-error">✗</td><td class="text-center text-error">✗</td></tr>
						<tr class="{selectedLicense === 'Apache-2.0' ? 'bg-info/10' : ''}"><td>Apache 2.0</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-error">✗</td><td class="text-center text-success">✓</td></tr>
						<tr class="{selectedLicense === 'GPL-3.0' ? 'bg-warning/10' : ''}"><td>GPL 3.0</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td></tr>
						<tr class="{selectedLicense === 'BSD-3-Clause' ? 'bg-secondary/10' : ''}"><td>BSD 3-Clause</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-error">✗</td><td class="text-center text-error">✗</td></tr>
						<tr class="{selectedLicense === 'ISC' ? 'bg-primary/10' : ''}"><td>ISC</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-error">✗</td><td class="text-center text-error">✗</td></tr>
						<tr class="{selectedLicense === 'Unlicense' ? 'bg-neutral/10' : ''}"><td>Unlicense</td><td class="text-center text-success">✓</td><td class="text-center text-success">✓</td><td class="text-center text-error">✗</td><td class="text-center text-error">✗</td></tr>
					</tbody>
				</table>
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

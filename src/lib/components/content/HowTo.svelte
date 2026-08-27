<script lang="ts">
	interface InlinePart {
		code: boolean;
		text: string;
	}

	interface Props {
		lede: string[];
		steps: string[];
		breaks: string[];
	}

	let { lede, steps, breaks }: Props = $props();

	function inlineParts(text: string): InlinePart[] {
		const parts: InlinePart[] = [];
		const re = /`([^`]+)`/g;
		let last = 0;
		let match: RegExpExecArray | null;
		while ((match = re.exec(text)) !== null) {
			if (match.index > last) {
				parts.push({ code: false, text: text.slice(last, match.index) });
			}
			parts.push({ code: true, text: match[1] });
			last = match.index + match[0].length;
		}
		if (last < text.length) {
			parts.push({ code: false, text: text.slice(last) });
		}
		return parts;
	}
</script>

{#snippet inline(text: string)}
	{#each inlineParts(text) as part}
		{#if part.code}
			<code class="font-mono text-sm text-base-content">{part.text}</code>
		{:else}
			{part.text}
		{/if}
	{/each}
{/snippet}

<section class="rounded-lg text-base-content">
	<div class="space-y-3">
		{#each lede as para}
			<p class="text-muted leading-relaxed">{@render inline(para)}</p>
		{/each}
	</div>

	<h2 class="mt-4 text-base font-semibold text-base-content">How to use it</h2>
	<ol class="mt-2 list-decimal space-y-1.5 pl-5 text-muted leading-relaxed">
		{#each steps as step}
			<li>{@render inline(step)}</li>
		{/each}
	</ol>

	<h2 class="mt-4 text-base font-semibold text-base-content">When it breaks</h2>
	<ul class="mt-2 list-disc space-y-1.5 pl-5 text-muted leading-relaxed">
		{#each breaks as item}
			<li>{@render inline(item)}</li>
		{/each}
	</ul>
</section>

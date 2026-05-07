<script lang="ts">
	interface FAQ {
		question: string;
		answer: string;
	}

	interface Breadcrumb {
		name: string;
		item: string;
	}

	interface ApplicationData {
		name: string;
		description: string;
		url: string;
		category?: string;
		price?: string;
		currency?: string;
	}

	interface Props {
		application?: ApplicationData;
		faqs?: FAQ[];
		breadcrumbs?: Breadcrumb[];
	}

	let { application, faqs, breadcrumbs }: Props = $props();

	let schemaGraph = $derived.by(() => {
		const graph: any[] = [];

		if (application) {
			graph.push({
				"@context": "https://schema.org",
				"@type": "SoftwareApplication",
				"name": application.name,
				"description": application.description,
				"applicationCategory": application.category || "DeveloperApplication",
				"operatingSystem": "Any",
				"offers": {
					"@type": "Offer",
					"price": application.price || "0",
					"priceCurrency": application.currency || "USD"
				},
				"url": application.url
			});
		}

		if (faqs && faqs.length > 0) {
			graph.push({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				"mainEntity": faqs.map(faq => ({
					"@type": "Question",
					"name": faq.question,
					"acceptedAnswer": {
						"@type": "Answer",
						"text": faq.answer.replace(/<[^>]*>?/gm, '') // Strip HTML for schema
					}
				}))
			});
		}

		if (breadcrumbs && breadcrumbs.length > 0) {
			graph.push({
				"@context": "https://schema.org",
				"@type": "BreadcrumbList",
				"itemListElement": breadcrumbs.map((bc, index) => ({
					"@type": "ListItem",
					"position": index + 1,
					"name": bc.name,
					"item": bc.item
				}))
			});
		}

		return graph;
	});
	
	let jsonLdString = $derived(JSON.stringify(schemaGraph.length === 1 ? schemaGraph[0] : {
		"@context": "https://schema.org",
		"@graph": schemaGraph
	}));
</script>

<svelte:head>
	{#if schemaGraph.length > 0}
		{@html `<script type="application/ld+json">${jsonLdString}</script>`}
	{/if}
</svelte:head>

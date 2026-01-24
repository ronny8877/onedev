<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	// HTTP Status Codes database
	const statusCodes = [
		// 1xx Informational
		{ code: 100, name: 'Continue', category: '1xx', description: 'The server has received the request headers and the client should proceed to send the request body.', causes: ['Large file uploads', 'Expect header sent'], curl: 'curl -I -X POST -H "Expect: 100-continue" https://example.com' },
		{ code: 101, name: 'Switching Protocols', category: '1xx', description: 'The server is switching protocols as requested by the client.', causes: ['WebSocket upgrade', 'HTTP/2 upgrade'], curl: 'curl -I -H "Upgrade: websocket" https://example.com' },
		{ code: 103, name: 'Early Hints', category: '1xx', description: 'Used to preload resources while the server prepares a response.', causes: ['Link preloading', 'Performance optimization'], curl: 'N/A' },

		// 2xx Success
		{ code: 200, name: 'OK', category: '2xx', description: 'The request was successful.', causes: ['Successful GET/POST', 'Resource found'], curl: 'curl -I https://example.com' },
		{ code: 201, name: 'Created', category: '2xx', description: 'The request succeeded and a new resource was created.', causes: ['POST creating resource', 'PUT creating resource'], curl: 'curl -I -X POST -d "data" https://api.example.com/resource' },
		{ code: 204, name: 'No Content', category: '2xx', description: 'The request succeeded but there is no content to return.', causes: ['Successful DELETE', 'Update without response body'], curl: 'curl -I -X DELETE https://api.example.com/resource/1' },
		{ code: 206, name: 'Partial Content', category: '2xx', description: 'The server is delivering only part of the resource due to a range header.', causes: ['Video streaming', 'Resume download'], curl: 'curl -I -H "Range: bytes=0-1023" https://example.com/video.mp4' },

		// 3xx Redirection
		{ code: 301, name: 'Moved Permanently', category: '3xx', description: 'The resource has permanently moved to a new URL.', causes: ['URL change', 'Domain migration', 'HTTPS redirect'], curl: 'curl -I -L https://old.example.com' },
		{ code: 302, name: 'Found', category: '3xx', description: 'The resource temporarily resides at a different URL.', causes: ['Temporary redirect', 'Login redirect'], curl: 'curl -I https://example.com/temp-page' },
		{ code: 304, name: 'Not Modified', category: '3xx', description: 'The resource has not been modified since the last request.', causes: ['Browser cache valid', 'ETag match'], curl: 'curl -I -H "If-None-Match: \\"abc123\\"" https://example.com' },
		{ code: 307, name: 'Temporary Redirect', category: '3xx', description: 'The request should be repeated with another URL, keeping the method.', causes: ['Temporary redirect preserving method'], curl: 'curl -I -X POST https://example.com/api' },
		{ code: 308, name: 'Permanent Redirect', category: '3xx', description: 'The resource has permanently moved, keeping the request method.', causes: ['Permanent redirect preserving method'], curl: 'curl -I -X POST https://old.example.com/api' },

		// 4xx Client Errors
		{ code: 400, name: 'Bad Request', category: '4xx', description: 'The server cannot process the request due to client error.', causes: ['Malformed syntax', 'Invalid parameters', 'Missing required fields'], curl: 'curl -I -X POST -d "invalid" https://api.example.com' },
		{ code: 401, name: 'Unauthorized', category: '4xx', description: 'Authentication is required and has failed or not been provided.', causes: ['Missing auth token', 'Invalid credentials', 'Expired token'], curl: 'curl -I -H "Authorization: Bearer invalid" https://api.example.com' },
		{ code: 403, name: 'Forbidden', category: '4xx', description: 'The server understood the request but refuses to authorize it.', causes: ['Insufficient permissions', 'IP blocked', 'Resource protected'], curl: 'curl -I https://example.com/admin' },
		{ code: 404, name: 'Not Found', category: '4xx', description: 'The requested resource could not be found.', causes: ['Typo in URL', 'Resource deleted', 'Wrong endpoint'], curl: 'curl -I https://example.com/nonexistent' },
		{ code: 405, name: 'Method Not Allowed', category: '4xx', description: 'The request method is not supported for the resource.', causes: ['POST to GET-only endpoint', 'DELETE not allowed'], curl: 'curl -I -X DELETE https://example.com' },
		{ code: 409, name: 'Conflict', category: '4xx', description: 'The request conflicts with the current state of the resource.', causes: ['Duplicate entry', 'Version conflict', 'Resource already exists'], curl: 'curl -I -X PUT https://api.example.com/resource/1' },
		{ code: 413, name: 'Payload Too Large', category: '4xx', description: 'The request entity is larger than the server is willing to process.', causes: ['File upload too large', 'Request body exceeds limit'], curl: 'curl -I -X POST -d @largefile.bin https://api.example.com/upload' },
		{ code: 422, name: 'Unprocessable Entity', category: '4xx', description: 'The request was well-formed but semantically incorrect.', causes: ['Validation errors', 'Business logic violation'], curl: 'curl -I -X POST -H "Content-Type: application/json" -d \'{"email":"invalid"}\' https://api.example.com' },
		{ code: 429, name: 'Too Many Requests', category: '4xx', description: 'The user has sent too many requests in a given time.', causes: ['Rate limiting', 'API quota exceeded', 'DDoS protection'], curl: 'curl -I https://api.example.com' },

		// 5xx Server Errors
		{ code: 500, name: 'Internal Server Error', category: '5xx', description: 'The server encountered an unexpected condition.', causes: ['Unhandled exception', 'Code bug', 'Database error'], curl: 'curl -I https://example.com' },
		{ code: 502, name: 'Bad Gateway', category: '5xx', description: 'The server received an invalid response from an upstream server.', causes: ['Upstream server down', 'Proxy misconfigured', 'Load balancer issue'], curl: 'curl -I https://example.com' },
		{ code: 503, name: 'Service Unavailable', category: '5xx', description: 'The server is not ready to handle the request.', causes: ['Server overloaded', 'Maintenance mode', 'Database unavailable'], curl: 'curl -I https://example.com' },
		{ code: 504, name: 'Gateway Timeout', category: '5xx', description: 'The server did not receive a timely response from upstream.', causes: ['Upstream timeout', 'Slow backend', 'Network issues'], curl: 'curl -I https://example.com' }
	];

	// Category info
	const categories = {
		'1xx': { name: 'Informational', color: 'info', description: 'Request received, continuing process' },
		'2xx': { name: 'Success', color: 'success', description: 'Request successfully received and processed' },
		'3xx': { name: 'Redirection', color: 'warning', description: 'Further action needed to complete request' },
		'4xx': { name: 'Client Error', color: 'error', description: 'Request contains bad syntax or cannot be fulfilled' },
		'5xx': { name: 'Server Error', color: 'secondary', description: 'Server failed to fulfill a valid request' }
	};

	// State
	let search = $state('');
	let selectedCategory = $state<string | null>(null);
	let expandedCode = $state<number | null>(null);

	// Filtered codes
	let filteredCodes = $derived(() => {
		let codes = statusCodes;
		
		if (selectedCategory) {
			codes = codes.filter(c => c.category === selectedCategory);
		}
		
		if (search) {
			const q = search.toLowerCase();
			codes = codes.filter(c => 
				c.code.toString().includes(q) ||
				c.name.toLowerCase().includes(q) ||
				c.description.toLowerCase().includes(q)
			);
		}
		
		return codes;
	});

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Search -->
		<div class="flex gap-2">
			<input
				type="text"
				bind:value={search}
				placeholder="Search status codes..."
				class="input input-bordered flex-1"
			/>
		</div>

		<!-- Category Filters -->
		<div class="flex flex-wrap gap-2 justify-center">
			<button 
				class="btn btn-sm {selectedCategory === null ? 'btn-primary' : 'btn-ghost'}"
				onclick={() => selectedCategory = null}
			>
				All
			</button>
			{#each Object.entries(categories) as [key, cat]}
				<button 
					class="btn btn-sm {selectedCategory === key ? `btn-${cat.color}` : 'btn-ghost'}"
					onclick={() => selectedCategory = key}
				>
					{key}
				</button>
			{/each}
		</div>

		<!-- Category Description -->
		{#if selectedCategory}
			<div class="text-center text-sm text-base-content/60">
				{categories[selectedCategory as keyof typeof categories].description}
			</div>
		{/if}

		<!-- Status Codes Grid -->
		<div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredCodes() as status}
				{@const cat = categories[status.category as keyof typeof categories]}
				<div 
					class="card bg-base-200 rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
					onclick={() => expandedCode = expandedCode === status.code ? null : status.code}
				>
					<div class="card-body p-4">
						<div class="flex items-center gap-3">
							<div class="w-16 h-16 rounded-xl bg-{cat.color}/20 flex items-center justify-center">
								<span class="text-2xl font-bold text-{cat.color}">{status.code}</span>
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-bold">{status.name}</h3>
								<span class="badge badge-{cat.color} badge-sm">{status.category}</span>
							</div>
						</div>
						
						{#if expandedCode === status.code}
							<div class="mt-4 space-y-3 animate-fadeIn">
								<p class="text-sm text-base-content/70">{status.description}</p>

								<div>
									<p class="text-xs font-bold text-base-content/60 mb-1">Common Causes</p>
									<ul class="list-disc ml-4 text-sm">
										{#each status.causes as cause}
											<li>{cause}</li>
										{/each}
									</ul>
								</div>

								<div>
									<p class="text-xs font-bold text-base-content/60 mb-1">cURL Example</p>
									<div class="flex items-center gap-2">
										<code class="text-xs bg-base-300 p-2 rounded flex-1 overflow-x-auto">{status.curl}</code>
										<button class="btn btn-xs btn-ghost" onclick={(e) => { e.stopPropagation(); copyToClipboard(status.curl); }}>
											📋
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>

		{#if filteredCodes().length === 0}
			<div class="text-center py-8 text-base-content/50">
				No status codes match your search
			</div>
		{/if}
	</div>
</ToolWrapper>

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
	.animate-fadeIn {
		animation: fadeIn 0.2s ease-out;
	}
</style>

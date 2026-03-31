
export interface SecurityToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const securityToolsContent: Record<string, SecurityToolContent> = {
	cors: {
		features: [
			'Visual builder for CORS (Cross-Origin Resource Sharing) headers',
			'Configure allowed origins, methods, headers, credentials, and max-age',
			'Wildcard origin support with security warning when credentials are enabled',
			'Generated header output for Nginx, Express, Apache, and Koa',
			'Live preflight request simulation to preview browser behavior',
			'Common configuration presets (public API, private API, same-site)',
		],
		useCases: [
			'Configure a REST API to accept requests from a specific frontend domain',
			'Debug CORS errors from browser console by understanding the required headers',
			'Set up CORS for a public API that allows all origins',
			'Restrict API access to only trusted partner domains',
			'Generate CORS configuration snippets for different web frameworks',
		],
		concept: {
			title: 'What is CORS?',
			content: `<p><strong>CORS</strong> (Cross-Origin Resource Sharing) is a browser security mechanism that restricts web pages from making requests to a different domain than the one that served the page. Without CORS headers, a script on <code>app.com</code> cannot fetch data from <code>api.com</code>.</p>
<p class="mt-2">CORS uses HTTP headers to tell browsers which cross-origin requests are permitted. The server adds headers like <code>Access-Control-Allow-Origin</code> to its responses, and the browser enforces them. For non-simple requests (e.g., PUT, DELETE, or requests with custom headers), the browser first sends a <strong>preflight</strong> OPTIONS request to check permissions.</p>
<p class="mt-2">CORS is enforced exclusively by browsers — server-to-server requests (including curl, Postman, and backend services) are never subject to CORS restrictions.</p>`,
		},
		examples: [
			{ label: 'Public API (all origins)', code: 'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Methods: GET, POST', isValid: true },
			{ label: 'Private API (specific origin)', code: 'Access-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Credentials: true', isValid: true },
			{ label: 'Invalid: wildcard + credentials', code: 'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true', isValid: false },
		],
		faqs: [
			{
				question: 'Why does CORS work in Postman but not in the browser?',
				answer: '<p>CORS is enforced by browsers only. Postman, curl, and backend applications are not subject to same-origin restrictions, so they never send or enforce CORS checks. If your API works in Postman but not in the browser, the CORS headers are missing or misconfigured on the server side.</p>',
			},
			{
				question: 'Can I use wildcard (*) with credentials?',
				answer: '<p><strong>No.</strong> When <code>Access-Control-Allow-Credentials: true</code> is set, the browser requires an exact origin instead of a wildcard. Setting both <code>*</code> and credentials will cause the browser to block the request entirely. Reflect the specific requesting origin dynamically in this case.</p>',
			},
			{
				question: 'What is a preflight request?',
				answer: '<p>Before sending "non-simple" cross-origin requests, the browser automatically sends an HTTP OPTIONS request (the "preflight") to verify the server permits the method and headers. The server must respond with appropriate <code>Access-Control-Allow-*</code> headers. Cache preflight responses with <code>Access-Control-Max-Age</code> to reduce round trips.</p>',
			},
			{
				question: 'What is the difference between simple and preflighted requests?',
				answer: '<p><strong>Simple requests</strong>: GET/HEAD/POST with only standard headers (Accept, Content-Type: application/x-www-form-urlencoded, etc.) — no preflight. <strong>Non-simple</strong>: PUT, DELETE, PATCH, custom headers, or JSON Content-Type — browser sends a preflight OPTIONS request first.</p>',
			},
		],
		relatedTools: [
			{ name: 'CSP Builder', path: '/security/csp', description: 'Content Security Policy' },
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers' },
			{ name: 'Headers Checklist', path: '/security/headers-checklist', description: 'Security header audit' },
			{ name: 'X-Frame Builder', path: '/security/x-frame', description: 'Clickjacking protection' },
		],
		tips: [
			'Never use <code>Access-Control-Allow-Origin: *</code> for APIs that handle authentication cookies or sensitive data.',
			'Maintain an explicit allowlist of trusted origins and validate the request <code>Origin</code> header against it, dynamically reflecting the matched origin.',
			'Set <code>Access-Control-Max-Age: 86400</code> to cache preflight responses for 24 hours and reduce latency for repeat requests.',
			'Log blocked CORS requests server-side to detect misconfiguration or potential attack attempts.',
		],
	},

	csp: {
		features: [
			'Visual builder for Content Security Policy (CSP) headers',
			'Configure all CSP directives: default-src, script-src, style-src, img-src, connect-src, and more',
			'Nonce and hash-based script allowlisting',
			'Report-Only mode for policy testing without enforcement',
			'CSP violation report endpoint configuration',
			'Preset policies: strict, moderate, permissive',
			'Generated header and meta tag output',
		],
		useCases: [
			'Protect web applications from Cross-Site Scripting (XSS) attacks',
			'Lock down which domains can serve scripts, styles, and media',
			'Migrate from inline scripts to nonce-based CSP',
			'Test a CSP policy in report-only mode before enforcing it',
			'Generate CSP headers for a specific framework (Next.js, Express, etc.)',
		],
		concept: {
			title: 'Content Security Policy (CSP)',
			content: `<p><strong>Content Security Policy</strong> is a security standard that tells browsers which content sources are legitimate for your web application. It is one of the most powerful defenses against Cross-Site Scripting (XSS) attacks — even if an attacker injects a script, CSP prevents the browser from executing it if the source is not whitelisted.</p>
<p class="mt-2">CSP is delivered as an HTTP header or a <code>&lt;meta&gt;</code> tag. A strict policy blocks all inline scripts, eval, and external resources by default (<code>default-src 'none'</code>) and then explicitly allows only trusted sources. The <code>Content-Security-Policy-Report-Only</code> header lets you test a policy without enforcement, collecting violation reports instead.</p>
<p class="mt-2">Modern best practice uses <strong>nonces</strong> (random per-request tokens) or <strong>hashes</strong> to allow specific inline scripts without <code>'unsafe-inline'</code>.</p>`,
		},
		examples: [
			{ label: 'Strict CSP', code: "default-src 'none'; script-src 'nonce-{random}'; style-src 'self'; img-src 'self' data:; frame-ancestors 'none'", isValid: true },
			{ label: 'Permissive (avoid in prod)', code: "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'", isValid: false },
			{ label: 'Report-Only mode', code: "Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report", isValid: true },
		],
		faqs: [
			{
				question: 'What is \'unsafe-inline\' and why should I avoid it?',
				answer: '<p><code>\'unsafe-inline\'</code> allows all inline scripts and styles, which defeats the primary XSS protection CSP provides. If an attacker can inject inline JavaScript (via XSS), <code>\'unsafe-inline\'</code> lets it execute. Use nonces (<code>\'nonce-abc123\'</code>) or hashes (<code>\'sha256-abc...\'</code>) to allow specific inline scripts without this broad permission.</p>',
			},
			{
				question: 'What is a CSP nonce?',
				answer: '<p>A nonce (number used once) is a cryptographically random token generated per-request. Add it to the CSP header (<code>script-src \'nonce-{token}\'</code>) and to each legitimate <code>&lt;script nonce="{token}"&gt;</code> tag. Injected scripts without the nonce won\'t execute. The nonce must be random and unique per page load — never reuse it.</p>',
			},
			{
				question: 'How do I test my CSP without breaking my site?',
				answer: '<p>Use <code>Content-Security-Policy-Report-Only</code> instead of <code>Content-Security-Policy</code>. The browser enforces nothing but sends violation reports to your <code>report-uri</code>. Review the reports for a few days to understand what your existing code needs, then refine the policy before switching to enforcement mode.</p>',
			},
			{
				question: 'Does CSP prevent all XSS attacks?',
				answer: '<p>A strict CSP significantly raises the bar for XSS attacks but does not eliminate them entirely. DOM-based XSS that operates within allowed sources, JSONP endpoints, and browser extension vulnerabilities can bypass CSP. CSP is one layer in a defense-in-depth strategy, not a single solution.</p>',
			},
		],
		relatedTools: [
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers reference' },
			{ name: 'CORS Builder', path: '/security/cors', description: 'Configure CORS headers' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'OWASP Top 10 reference' },
			{ name: 'Misconfig Detector', path: '/security/misconfig', description: 'Detect common misconfigs' },
		],
		tips: [
			'Start with <code>Content-Security-Policy-Report-Only</code> in production for at least a week before switching to enforcement mode.',
			'Never use <code>\'unsafe-eval\'</code> — it enables eval(), new Function(), and setTimeout/setInterval with string arguments, all common XSS vectors.',
			'Use <code>frame-ancestors \'none\'</code> instead of X-Frame-Options for clickjacking protection — CSP\'s frame-ancestors is more flexible and modern.',
			'Set <code>upgrade-insecure-requests</code> to automatically upgrade HTTP subrequests to HTTPS without breaking existing HTTP references.',
		],
	},

	headers: {
		features: [
			'Comprehensive reference for all HTTP security headers',
			'Description, risk level, and recommended value for each header',
			'Search and filter by header name or category',
			'Framework-specific implementation examples (Nginx, Express, Apache, Cloudflare)',
			'Compatibility table showing browser support',
			'Copy header value or implementation snippet with one click',
		],
		useCases: [
			'Audit which security headers your server is missing',
			'Look up the correct syntax for a specific security header',
			'Understand the security implications of each header',
			'Generate a baseline security header configuration for a new application',
			'Prepare for a security review or penetration test',
		],
		concept: {
			title: 'HTTP Security Headers',
			content: `<p><strong>HTTP security headers</strong> are response headers that instruct browsers to enable or restrict specific behaviors, reducing your app's attack surface. They are one of the easiest wins in web security — requiring no code changes, only server configuration.</p>
<p class="mt-2">Key headers include: <strong>Strict-Transport-Security</strong> (forces HTTPS), <strong>Content-Security-Policy</strong> (prevents XSS), <strong>X-Frame-Options</strong> (prevents clickjacking), <strong>X-Content-Type-Options</strong> (prevents MIME sniffing), <strong>Referrer-Policy</strong> (controls the Referer header), and <strong>Permissions-Policy</strong> (controls browser feature access).</p>
<p class="mt-2">Tools like <a href="https://securityheaders.com" class="text-primary">securityheaders.com</a> grade your live site's header configuration. Aim for an A+ grade as a baseline security hygiene standard.</p>`,
		},
		examples: [
			{ label: 'HSTS (force HTTPS)', code: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload', isValid: true },
			{ label: 'X-Content-Type-Options', code: 'X-Content-Type-Options: nosniff', isValid: true },
			{ label: 'Referrer-Policy', code: 'Referrer-Policy: strict-origin-when-cross-origin', isValid: true },
		],
		faqs: [
			{
				question: 'What is the most important security header to add first?',
				answer: '<p><strong>Strict-Transport-Security (HSTS)</strong> is the highest impact single header — it forces browsers to always use HTTPS for your domain, preventing protocol downgrade attacks and cookie hijacking. Set <code>max-age=31536000; includeSubDomains</code> after verifying your entire site is HTTPS-capable.</p>',
			},
			{
				question: 'What does X-Content-Type-Options: nosniff do?',
				answer: '<p>It prevents browsers from "MIME sniffing" — guessing the content type of a response and potentially executing a file as a different type than intended. For example, without this header, a browser might execute a text file containing JavaScript. Always include it.</p>',
			},
			{
				question: 'Is X-XSS-Protection still useful?',
				answer: '<p><code>X-XSS-Protection</code> is a legacy header for an old IE browser filter. Modern browsers have removed it, and in some configurations it could introduce vulnerabilities. Do not rely on it — use a strong <code>Content-Security-Policy</code> instead. If you must set it for legacy browsers, use <code>1; mode=block</code>.</p>',
			},
			{
				question: 'What is Permissions-Policy?',
				answer: '<p><code>Permissions-Policy</code> (formerly Feature-Policy) lets you control access to browser APIs and hardware features like camera, microphone, geolocation, payment, and full-screen. Restrict what your app doesn\'t use: <code>Permissions-Policy: camera=(), microphone=(), geolocation=()</code>.</p>',
			},
		],
		relatedTools: [
			{ name: 'Headers Checklist', path: '/security/headers-checklist', description: 'Implementation by framework' },
			{ name: 'CSP Builder', path: '/security/csp', description: 'Build a Content Security Policy' },
			{ name: 'CORS Builder', path: '/security/cors', description: 'Configure CORS headers' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'OWASP Top 10 guide' },
		],
		tips: [
			'Use the <a href="https://securityheaders.com" class="text-primary">SecurityHeaders.com</a> scanner to grade your live site\'s current header configuration.',
			'Add security headers at the reverse proxy or CDN layer (Nginx, Cloudflare) so they apply to all responses without touching application code.',
			'The <code>Permissions-Policy</code> header defaults to allowing everything — explicitly deny APIs your app doesn\'t use.',
			'HSTS with <code>preload</code> enrolls your domain in browser preload lists. Test thoroughly before enabling it — it\'s difficult to reverse.',
		],
	},

	'headers-checklist': {
		features: [
			'Step-by-step security header implementation checklist',
			'Framework-specific code snippets: Express, Nginx, Apache, Cloudflare Workers, Fastify',
			'Priority ordering — implement the highest-impact headers first',
			'Mark headers as done to track audit progress',
			'Copy implementation code for your chosen framework',
			'Links to official documentation for each header',
		],
		useCases: [
			'Conduct a security header audit for an existing application',
			'Implement security headers on a new project from day one',
			'Track header implementation progress across a codebase',
			'Generate a framework-specific security header boilerplate',
			'Prepare for a web application security assessment',
		],
		concept: {
			title: 'Security Header Implementation',
			content: `<p>Knowing which security headers exist is only half the battle — the other half is knowing how to add them to your specific stack. The implementation syntax differs across frameworks:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>Nginx</strong>: <code>add_header</code> directive in the server or location block</li>
  <li><strong>Express/Node</strong>: use the <code>helmet</code> package or <code>res.setHeader()</code> in middleware</li>
  <li><strong>Apache</strong>: <code>Header set</code> in <code>.htaccess</code> or httpd.conf (requires mod_headers)</li>
  <li><strong>Cloudflare Workers</strong>: modify headers in the <code>Response</code> object</li>
  <li><strong>Next.js</strong>: configure in <code>next.config.js</code> under the <code>headers()</code> function</li>
</ul>
<p class="mt-2">This checklist provides copy-paste snippets for each framework so you can implement headers correctly without looking up syntax for each one.</p>`,
		},
		examples: [
			{ label: 'Express (helmet)', code: 'import helmet from "helmet";\napp.use(helmet());', isValid: true },
			{ label: 'Nginx snippet', code: 'add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;', isValid: true },
			{ label: 'Next.js config', code: '// next.config.js\nheaders: () => [{ source: "/**", headers: [...] }]', isValid: true },
		],
		faqs: [
			{
				question: 'Should I add security headers in the app or at the load balancer?',
				answer: '<p>Prefer adding them at the <strong>reverse proxy or CDN layer</strong> (Nginx, Cloudflare, ALB). This applies headers to all responses (including static files and error pages) without touching application code. Application-level headers (e.g., via Helmet in Express) are also fine but require code changes and may miss edge cases.</p>',
			},
			{
				question: 'What is the Helmet.js library?',
				answer: '<p>Helmet is a popular Node.js middleware that sets many security headers in one line: <code>app.use(helmet())</code>. It configures HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and others. It also provides individual sub-modules for fine-grained control (e.g., <code>helmet.contentSecurityPolicy()</code>).</p>',
			},
			{
				question: 'How do I verify my headers are set correctly?',
				answer: '<p>Open browser DevTools → Network tab → select your page request → look at the Response Headers panel. Or use the <code>curl -I https://yoursite.com</code> command to view response headers in the terminal. For a comprehensive grade, use <a href="https://securityheaders.com" class="text-primary">securityheaders.com</a>.</p>',
			},
		],
		relatedTools: [
			{ name: 'Security Headers', path: '/security/headers', description: 'Headers reference and descriptions' },
			{ name: 'CSP Builder', path: '/security/csp', description: 'Build Content Security Policy' },
			{ name: 'CORS Builder', path: '/security/cors', description: 'Configure CORS' },
			{ name: 'Misconfig Detector', path: '/security/misconfig', description: 'Detect misconfigurations' },
		],
		tips: [
			'Start with the "easy wins": <code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: DENY</code>, and <code>Referrer-Policy: strict-origin-when-cross-origin</code> can be added in minutes.',
			'Use the Helmet.js npm package for Node.js apps — it sets 10+ headers securely with sensible defaults in a single line.',
			'After implementation, re-run your security scanner (Burp Suite, OWASP ZAP, or securityheaders.com) to confirm headers are delivered correctly.',
		],
	},

	'http-status': {
		features: [
			'Complete reference for all HTTP status codes (1xx–5xx)',
			'Search by code number or descriptive keyword',
			'Detailed description, common causes, and usage examples for each code',
			'Color-coded by category: informational (1xx), success (2xx), redirect (3xx), client error (4xx), server error (5xx)',
			'RFC reference links for each status code',
			'Cacheable status codes highlighted',
		],
		useCases: [
			'Look up the meaning of an unfamiliar HTTP status code in error logs',
			'Choose the correct status code when designing an API response',
			'Debug client or server errors reported by monitoring tools',
			'Understand redirect chains and caching behavior',
			'Learn HTTP semantics while building REST APIs',
		],
		concept: {
			title: 'HTTP Status Codes',
			content: `<p><strong>HTTP status codes</strong> are three-digit numbers returned by servers to indicate the result of a client request. They are grouped into five classes by their first digit:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>1xx Informational</strong>: request received, continuing process (<code>100 Continue</code>, <code>101 Switching Protocols</code>)</li>
  <li><strong>2xx Success</strong>: request was successfully received, understood, and accepted (<code>200 OK</code>, <code>201 Created</code>, <code>204 No Content</code>)</li>
  <li><strong>3xx Redirection</strong>: further action needed (<code>301 Moved Permanently</code>, <code>302 Found</code>, <code>304 Not Modified</code>)</li>
  <li><strong>4xx Client Errors</strong>: request contains bad syntax or cannot be fulfilled (<code>400</code>, <code>401</code>, <code>403</code>, <code>404</code>, <code>429</code>)</li>
  <li><strong>5xx Server Errors</strong>: server failed to fulfill a valid request (<code>500</code>, <code>502</code>, <code>503</code>, <code>504</code>)</li>
</ul>`,
		},
		examples: [
			{ label: '200 OK', code: '200 OK — Standard response for successful HTTP request', isValid: true },
			{ label: '404 Not Found', code: '404 Not Found — Resource could not be found on server', isValid: true },
			{ label: '429 Too Many Requests', code: '429 Too Many Requests — Rate limit exceeded by client', isValid: false },
		],
		faqs: [
			{
				question: 'What is the difference between 401 and 403?',
				answer: '<p><strong>401 Unauthorized</strong>: the client must authenticate (login) first. Despite the name, it means "unauthenticated." <strong>403 Forbidden</strong>: the client is authenticated but does not have permission for this resource. Think of 401 as "who are you?" and 403 as "I know who you are, but you can\'t come in."</p>',
			},
			{
				question: 'When should I use 301 vs 302 vs 307?',
				answer: '<p><strong>301 Moved Permanently</strong>: old URL is gone forever, browsers may cache this redirect. Use for SEO-friendly URL changes. <strong>302 Found</strong>: temporary redirect; do not cache. <strong>307 Temporary Redirect</strong>: like 302 but guarantees the HTTP method is preserved (POST stays POST). Use 307 when you need to temporarily redirect non-GET requests.</p>',
			},
			{
				question: 'What is 204 and when should I use it?',
				answer: '<p><strong>204 No Content</strong> means the request succeeded but there is no response body. Use it for DELETE requests, or for PATCH/PUT when you don\'t return the updated resource. It tells the client "success, nothing more to say" without sending an empty JSON object.</p>',
			},
			{
				question: 'What does 429 Too Many Requests mean?',
				answer: '<p>The client has exceeded the API\'s rate limit. The server should include a <code>Retry-After</code> header indicating when the client may try again. Always implement rate limiting on public APIs to prevent abuse and ensure fair usage.</p>',
			},
		],
		relatedTools: [
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers' },
			{ name: 'CORS Builder', path: '/security/cors', description: 'CORS configuration' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'Web security checklist' },
		],
		tips: [
			'Return <code>204 No Content</code> for successful DELETE operations — it\'s semantically cleaner than returning an empty JSON object.',
			'Use <code>429 Too Many Requests</code> with a <code>Retry-After</code> header when rate limiting API clients so they know exactly when to retry.',
			'Prefer <code>307 Temporary Redirect</code> over <code>302</code> for temporary redirects of POST endpoints to preserve the HTTP method.',
			'Log 5xx errors with full request context — they always represent a bug in your system, not the client\'s fault.',
		],
	},

	misconfig: {
		features: [
			'Paste configuration snippets to detect common security misconfigurations',
			'Covers: exposed debug endpoints, insecure CORS, default credentials, open admin interfaces',
			'Pattern matching for Nginx, Apache, Docker Compose, and application configs',
			'Risk level classification: critical, high, medium, low',
			'Remediation guidance with secure configuration examples',
			'Supports YAML, JSON, Nginx config, and plain text',
		],
		useCases: [
			'Quick security review of server or application configuration files',
			'Detect accidentally exposed admin interfaces or debug endpoints',
			'Audit Docker Compose files for insecure environment variables or exposed ports',
			'Check Nginx/Apache configs for dangerous options before deploying',
			'Pre-commit hook to catch security mistakes in configuration',
		],
		concept: {
			title: 'Security Misconfiguration',
			content: `<p><strong>Security misconfiguration</strong> is consistently one of the OWASP Top 10 vulnerabilities. It encompasses a wide range of issues: default credentials, unnecessary features enabled, overly permissive CORS, exposed debug information, and insecure default settings.</p>
<p class="mt-2">Unlike code vulnerabilities that require exploiting logic flaws, misconfigurations often expose open doors directly. Common examples include: debug mode enabled in production, admin interfaces accessible from the internet, default passwords never changed, and verbose error messages revealing stack traces.</p>
<p class="mt-2">Automated misconfiguration detection provides a safety net alongside manual code review, catching patterns that are easy to overlook under development pressure.</p>`,
		},
		examples: [
			{ label: 'Debug mode in production', code: 'DEBUG=True  # CRITICAL: never in production', isValid: false },
			{ label: 'Insecure CORS wildcard', code: 'Access-Control-Allow-Origin: *\nAccess-Control-Allow-Credentials: true', isValid: false },
			{ label: 'Exposed admin interface', code: 'location /admin {\n    # Missing: allow only internal IPs', isValid: false },
		],
		faqs: [
			{
				question: 'What are the most common production misconfigurations?',
				answer: '<p>The most frequent are: <ul class="list-disc pl-5 mt-1 space-y-1"><li>Debug/verbose logging enabled in production</li><li>Default credentials on databases, admin panels, or cloud resources</li><li>Overly permissive CORS (especially wildcard with credentials)</li><li>S3 buckets or cloud storage set to public</li><li>Admin/monitoring interfaces exposed without authentication</li><li>Old software versions with known CVEs</li></ul></p>',
			},
			{
				question: 'How do I automatically detect misconfigurations in CI?',
				answer: '<p>Tools like <code>trivy config</code>, <code>tfsec</code> (for Terraform), <code>kube-bench</code> (for Kubernetes), and <code>cfn-nag</code> (for CloudFormation) can detect misconfigurations in infrastructure-as-code files. Add them to your CI pipeline alongside code linting.</p>',
			},
			{
				question: 'What is the principle of least privilege?',
				answer: '<p>Every component (user, service, container) should have only the minimum permissions needed to perform its function, nothing more. This limits the blast radius if a component is compromised. Apply it to: database users, S3 bucket policies, IAM roles, Kubernetes RBAC, and application service accounts.</p>',
			},
		],
		relatedTools: [
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'OWASP Top 10 guide' },
			{ name: 'Threat Modeler', path: '/security/threat-model', description: 'Model application threats' },
			{ name: 'Git Secrets Scanner', path: '/git/secrets-scanner', description: 'Scan for leaked secrets' },
		],
		tips: [
			'Disable all features and services your application doesn\'t need — reduces attack surface automatically.',
			'Use environment-specific configuration: strict production settings, relaxed dev/test settings. Never ship dev config to production.',
			'Rotate all default passwords before the first deployment, not after — treat defaults as compromised from day one.',
			'Enable security scanning in your CI/CD pipeline to catch misconfigurations before they reach production.',
		],
	},

	owasp: {
		features: [
			'Interactive OWASP Top 10 (2021) checklist with descriptions and examples',
			'Track remediation progress per risk category',
			'Expandable detail panels with attack scenarios, impact, and prevention measures',
			'Real-world examples of each vulnerability',
			'Links to OWASP official documentation and cheat sheets',
			'Export progress report as PDF or JSON',
		],
		useCases: [
			'Conduct a structured security review against the OWASP Top 10',
			'Onboard developers to common web security vulnerabilities',
			'Prepare for a penetration test or security audit',
			'Track security remediation progress across a sprint',
			'Create a security checklist for a new application or feature',
		],
		concept: {
			title: 'OWASP Top 10',
			content: `<p>The <strong>OWASP Top 10</strong> is the definitive list of the ten most critical web application security risks, published by the Open Web Application Security Project. Updated in 2021, it is the most widely used framework for evaluating web security and is referenced by compliance standards (PCI DSS, SOC 2, ISO 27001).</p>
<p class="mt-2">The 2021 Top 10 (A01–A10): <strong>A01 Broken Access Control</strong>, <strong>A02 Cryptographic Failures</strong>, <strong>A03 Injection</strong>, <strong>A04 Insecure Design</strong>, <strong>A05 Security Misconfiguration</strong>, <strong>A06 Vulnerable &amp; Outdated Components</strong>, <strong>A07 Authentication Failures</strong>, <strong>A08 Software &amp; Data Integrity Failures</strong>, <strong>A09 Security Logging Failures</strong>, <strong>A10 SSRF</strong>.</p>`,
		},
		examples: [
			{ label: 'A01: Broken Access Control', code: 'GET /api/users/123  # What about /api/users/124? (IDOR)', isValid: false },
			{ label: 'A03: SQL Injection', code: "SELECT * FROM users WHERE id = '" + "' OR 1=1; --", isValid: false },
			{ label: 'A02: Weak password hashing', code: 'MD5(password)  # Never use MD5 for passwords', isValid: false },
		],
		faqs: [
			{
				question: 'How often is the OWASP Top 10 updated?',
				answer: '<p>The OWASP Top 10 is updated approximately every 3–4 years, most recently in 2021 (previous: 2017). The list reflects emerging threats, industry survey data, and vulnerability database analysis. The 2021 version moved Broken Access Control to #1 (from #5 in 2017), reflecting how common access control failures have become.</p>',
			},
			{
				question: 'Is addressing the OWASP Top 10 sufficient for security?',
				answer: '<p>It is an excellent baseline but not comprehensive. The Top 10 focuses on the most common and impactful risks, not all possible vulnerabilities. For mature security programs, also address: business logic flaws, supply chain risks, API security (OWASP API Security Top 10), and infrastructure security.</p>',
			},
			{
				question: 'What is A01: Broken Access Control?',
				answer: '<p>Broken Access Control (the #1 risk) occurs when users can act outside their intended permissions — accessing other users\' data, performing admin functions, or bypassing authorization checks. Common examples: Insecure Direct Object References (IDORs), accessing endpoints without authentication, and privilege escalation. Prevention: enforce access control server-side, deny by default, and test all access control paths.</p>',
			},
		],
		relatedTools: [
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers' },
			{ name: 'Threat Modeler', path: '/security/threat-model', description: 'Identify threats' },
			{ name: 'Misconfig Detector', path: '/security/misconfig', description: 'Detect misconfigurations (A05)' },
			{ name: 'Password Strength', path: '/security/password', description: 'Password security (A07)' },
		],
		tips: [
			'Address A01 (Broken Access Control) first — it\'s the most common and consistently exploitable vulnerability category.',
			'Use the OWASP Cheat Sheet Series (cheatsheetseries.owasp.org) for implementation details for each Top 10 category.',
			'Include OWASP Top 10 review as part of your code review checklist — developers catching issues during review is far cheaper than post-deployment fixes.',
			'Use automated SAST/DAST tools to continuously scan for Top 10 vulnerabilities rather than relying on point-in-time audits.',
		],
	},

	password: {
		features: [
			'Real-time password strength analyzer using the zxcvbn library',
			'Entropy calculation (bits) and estimated crack time',
			'Pattern detection: keyboard walks, common words, dates, sequences',
			'Detailed feedback explaining exactly why a password is weak',
			'Strength score 0–4 with visual meter',
			'All analysis is done client-side — passwords never leave the browser',
		],
		useCases: [
			'Test and improve passwords before setting them on critical accounts',
			'Understand what makes a password strong or weak',
			'Implement a strength meter in your own web application',
			'Train users on password security best practices',
			'Evaluate the strength of passphrases vs. complex random strings',
		],
		concept: {
			title: 'Password Strength Analysis',
			content: `<p>Password strength is determined by <strong>entropy</strong> — the number of bits of randomness, which determines how many guesses an attacker needs to crack it. A password with 40 bits of entropy requires 2<sup>40</sup> ≈ 1 trillion guesses.</p>
<p class="mt-2">Modern password crackers don't guess randomly — they use patterns: dictionary words, common substitutions (a→@, e→3), keyboard walks (qwerty, 12345), and leaked password databases. <strong>zxcvbn</strong> (the library powering this tool) was developed by Dropbox to model realistic attacker behavior, making its strength estimates far more accurate than simple "8 chars with numbers + symbols" rules.</p>
<p class="mt-2">A strong password is <strong>long and random</strong> — a 5-word passphrase (<code>correct horse battery staple</code>) is often stronger than a short complex password (<code>P@s$w0rd!</code>), because length beats complexity for entropy.</p>`,
		},
		examples: [
			{ label: 'Weak (common word)', code: 'password123  → Score 0, crack time: instantly', isValid: false },
			{ label: 'Medium (short complex)', code: 'P@s$w0rd!  → Score 2, crack time: minutes', isValid: false },
			{ label: 'Strong (long random)', code: 'correct-horse-battery-staple  → Score 4, crack time: centuries', isValid: true },
		],
		faqs: [
			{
				question: 'Is a long passphrase better than a short complex password?',
				answer: '<p>Usually yes. Entropy = log2(character set size) × length. A 20-character passphrase of common words has lower entropy per character but much higher entropy overall due to length. The passphrase is also far easier to memorize. NIST SP 800-63B recommends focusing on length rather than complexity rules.</p>',
			},
			{
				question: 'What is the zxcvbn library?',
				answer: '<p><code>zxcvbn</code> was developed by Dropbox to measure password strength the way attackers think. Instead of just checking for uppercase/numbers/symbols, it uses pattern matching (dictionary lookup, date detection, keyboard sequences, l33t speak), scoring on realistic crack time rather than arbitrary rules.</p>',
			},
			{
				question: 'Is it safe to paste my password here?',
				answer: '<p>Yes. All analysis is performed client-side using JavaScript — your password is never sent over the network or stored. You can verify this by checking the Network tab in browser DevTools while typing your password.</p>',
			},
			{
				question: 'What are password managers and should I use one?',
				answer: '<p>Password managers (Bitwarden, 1Password, Dashlane) generate and store unique, random passwords for every account. This completely eliminates password reuse — the #1 cause of account takeovers. A strong master password + a password manager is the gold standard for personal password security.</p>',
			},
		],
		relatedTools: [
			{ name: 'Password Storage', path: '/security/password-storage', description: 'How to hash passwords securely' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'Authentication security (A07)' },
			{ name: 'Threat Modeler', path: '/security/threat-model', description: 'Model authentication threats' },
		],
		tips: [
			'Use a password manager to generate unique 20+ character random passwords for every account — never reuse passwords.',
			'A 4–5 word passphrase is often stronger and far more memorable than an 8-character complex password.',
			'Enable multi-factor authentication (MFA) on all important accounts — even a weak password becomes much harder to exploit with MFA.',
			'Check if your email has appeared in known data breaches using haveibeenpwned.com — change passwords for breached accounts immediately.',
		],
	},

	'password-storage': {
		features: [
			'Interactive guide to password hashing algorithms: bcrypt, argon2id, scrypt, PBKDF2',
			'Configuration recommendations: work factor, memory cost, parallelism',
			'Side-by-side comparison of algorithm strengths and weaknesses',
			'Code examples for secure password storage in Node.js, Python, Java, Go',
			'Common mistakes: MD5, SHA-1, unsalted hashes, unprocessed storage',
			'Work factor tuning calculator: target hash time vs. server load',
		],
		useCases: [
			'Choose the right password hashing algorithm for a new application',
			'Upgrade from an insecure hashing algorithm (MD5, SHA-1) to a modern one',
			'Document password storage security decisions for a compliance audit',
			'Train developers on secure password storage practices',
			'Tune bcrypt work factor for the right balance of security and performance',
		],
		concept: {
			title: 'Secure Password Storage',
			content: `<p>Passwords must <strong>never be stored in plaintext or with fast hash functions</strong> like MD5 or SHA-256. Fast hashes can compute billions of guesses per second on modern GPUs, making offline cracking of a leaked database trivial.</p>
<p class="mt-2">Secure password storage uses <strong>adaptive hashing algorithms</strong> specifically designed to be slow and memory-intensive: <strong>bcrypt</strong>, <strong>Argon2id</strong>, and <strong>scrypt</strong>. These defeat offline cracking by requiring significant computation per guess, making brute-force attacks economically impractical.</p>
<p class="mt-2">Key properties of secure password hashing: (1) <strong>Slow by design</strong> — takes ~100–300ms to compute. (2) <strong>Salted</strong> — a unique random salt per password prevents rainbow table attacks. (3) <strong>Adaptive</strong> — work factor can be increased as hardware improves. The current OWASP recommendation is <strong>Argon2id</strong> with appropriate memory and iteration settings.</p>`,
		},
		examples: [
			{ label: 'Insecure: plain MD5', code: 'MD5("password")  → Never use for passwords', isValid: false },
			{ label: 'Secure: bcrypt', code: 'bcrypt.hash(password, 12)  → 12 rounds, ~250ms', isValid: true },
			{ label: 'Best: Argon2id', code: 'argon2id(password, m=65536, t=3, p=4)', isValid: true },
		],
		faqs: [
			{
				question: 'Which algorithm should I use: bcrypt, scrypt, or Argon2id?',
				answer: '<p>OWASP recommends <strong>Argon2id</strong> as the first choice (winner of the Password Hashing Competition). Use <strong>bcrypt</strong> if Argon2 library support is unavailable or you need maximum ecosystem compatibility. Avoid scrypt for most applications — it\'s trickier to tune correctly. Never use MD5, SHA-1, or SHA-256 for passwords.</p>',
			},
			{
				question: 'What work factor should I use for bcrypt?',
				answer: '<p>Use the highest factor that keeps hashing time under 300ms on your production server. Start at factor 12 and benchmark: <code>time node -e "require(\'bcrypt\').hash(\'test\', 12, ()=>{})"</code>. OWASP recommends a minimum cost factor of 10 (2023). Increase the factor over time as hardware speeds up.</p>',
			},
			{
				question: 'What is a salt and why is it necessary?',
				answer: '<p>A salt is a random string appended to the password before hashing. Each password gets a unique, randomly generated salt. This prevents: (1) identical passwords producing identical hashes, (2) precomputed rainbow table attacks, and (3) an attacker cracking all passwords at once after a breach. Modern libraries (bcrypt, Argon2) handle salting automatically.</p>',
			},
			{
				question: 'How do I migrate from MD5 to bcrypt?',
				answer: '<p>You cannot rehash existing MD5 hashes without the original passwords. The standard migration approach: (1) add a new <code>password_hash</code> column, (2) when a user logs in successfully, rehash their password with bcrypt and store it, (3) after all active users have logged in (typically 90 days), require the remaining users to reset their passwords.</p>',
			},
		],
		relatedTools: [
			{ name: 'Password Strength', path: '/security/password', description: 'Test password strength' },
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'Authentication (A07)' },
			{ name: 'Hash Generator', path: '/hash', description: 'General-purpose hashing' },
		],
		tips: [
			'Use the Argon2id algorithm with OWASP\'s recommended settings: <code>m=65536</code> (64MB memory), <code>t=3</code> iterations, <code>p=4</code> parallelism.',
			'Never log passwords — not in debug output, not in request logs, not in error tracking (Sentry, Datadog). Treat them like credit card numbers.',
			'Store only the hash and salt — never the plaintext or an intermediate form. The hash is the credential.',
			'Implement account lockout or exponential backoff after failed login attempts to prevent online brute-force attacks (regardless of hash strength).',
		],
	},

	'threat-model': {
		features: [
			'Guided STRIDE threat modeling questionnaire',
			'Auto-generated threat list based on your application characteristics',
			'Risk prioritization matrix: likelihood × impact',
			'Mitigation recommendations for each identified threat',
			'Export threat model as structured JSON or PDF report',
			'Application type presets: Web App, API, Mobile, SPA',
		],
		useCases: [
			'Conduct a lightweight threat model for a new feature or service',
			'Identify security risks early in the design phase (before coding)',
			'Create a threat model document for a compliance audit (SOC 2, ISO 27001)',
			'Onboard developers to security thinking via guided questions',
			'Review security architecture before a product launch',
		],
		concept: {
			title: 'Threat Modeling with STRIDE',
			content: `<p><strong>Threat modeling</strong> is a structured approach to identifying and mitigating security risks during the design phase — when they are cheapest to address. The most common methodology is <strong>STRIDE</strong>, developed by Microsoft:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><strong>S</strong>poofing — Can an attacker impersonate a user, service, or component?</li>
  <li><strong>T</strong>ampering — Can an attacker modify data in transit or at rest?</li>
  <li><strong>R</strong>epudiation — Can a user deny performing an action (is there an audit trail)?</li>
  <li><strong>I</strong>nformation Disclosure — Can an attacker access data they shouldn't?</li>
  <li><strong>D</strong>enial of Service — Can an attacker disrupt service availability?</li>
  <li><strong>E</strong>levation of Privilege — Can an attacker gain higher permissions than intended?</li>
</ul>`,
		},
		examples: [
			{ label: 'Spoofing threat', code: 'Using a stolen JWT token → Mitigate: short expiry + revocation list', isValid: false },
			{ label: 'Tampering threat', code: 'Modifying API request payload → Mitigate: input validation + HMAC signatures', isValid: false },
			{ label: 'Mitigation example', code: 'Rate limiting on auth endpoints → Mitigates: brute force, DoS', isValid: true },
		],
		faqs: [
			{
				question: 'When should I do threat modeling?',
				answer: '<p>The best time is during the <strong>design phase</strong>, before writing a line of code. Changes to address design flaws are much cheaper than fixing them in production. However, threat modeling is valuable at any phase — doing it on an existing system is better than not doing it at all. Schedule a threat model for every new major feature, system integration, or architecture change.</p>',
			},
			{
				question: 'What is STRIDE?',
				answer: '<p>STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) is a methodology for categorizing threats. For each component in your system, consider which STRIDE threats apply. This structured approach ensures you don\'t miss categories of threat that are less obvious.</p>',
			},
			{
				question: 'How detailed does a threat model need to be?',
				answer: '<p>It depends on the risk level of the system. For critical financial or healthcare systems, work with security engineers on a detailed data flow diagram (DFD) and thorough STRIDE analysis. For most features, a lightweight model (30–60 minutes with the team) using this tool is sufficient and far better than nothing.</p>',
			},
			{
				question: 'What is an attack surface?',
				answer: '<p>The attack surface is the sum of all points where an attacker could try to enter or extract data from your system: API endpoints, web forms, file uploads, authentication interfaces, third-party integrations, and administrative interfaces. Minimizing attack surface (turning off unused features, restricting access) is a foundational security principle.</p>',
			},
		],
		relatedTools: [
			{ name: 'OWASP Checklist', path: '/security/owasp', description: 'OWASP Top 10 reference' },
			{ name: 'Security Headers', path: '/security/headers', description: 'HTTP security headers' },
			{ name: 'Misconfig Detector', path: '/security/misconfig', description: 'Detect misconfigurations' },
			{ name: 'CSP Builder', path: '/security/csp', description: 'Content Security Policy' },
		],
		tips: [
			'Run a threat modeling session with your team for every new major feature — even 30 minutes of structured thinking uncovers surprising risks.',
			'Focus first on threats that are both high likelihood AND high impact — address those before lower-risk items.',
			'Document your threat model and mitigations alongside your code (in a SECURITY.md or architecture doc) so the reasoning is preserved for future maintainers.',
			'Revisit your threat model after significant architecture changes — systems evolve and new threats emerge.',
		],
	},

	'x-frame': {
		features: [
			'Visual builder for X-Frame-Options and CSP frame-ancestors headers',
			'Options: DENY, SAMEORIGIN, ALLOW-FROM (legacy), and CSP-based frame-ancestors',
			'Allowlist specific domains for embedding via iframe',
			'Implementation snippets for Nginx, Apache, Express, and meta tag',
			'Live preview of how the header affects iframe embedding',
			'Explanation of clickjacking attacks and how the header prevents them',
		],
		useCases: [
			'Protect a web application from clickjacking attacks',
			'Allow your app to be embedded in iframes from specific trusted domains',
			'Completely block iframe embedding of a login or payment page',
			'Migrate from the legacy X-Frame-Options header to modern CSP frame-ancestors',
			'Audit which pages on your site can be embedded in iframes',
		],
		concept: {
			title: 'Clickjacking & Frame Protection',
			content: `<p><strong>Clickjacking</strong> is an attack where a malicious page embeds your web app in a hidden or transparent iframe, tricking users into clicking on your buttons (submitting forms, making payments, changing settings) while thinking they are clicking on the attacker\'s content.</p>
<p class="mt-2">Protection uses the <strong>X-Frame-Options</strong> HTTP header (legacy) or <strong>CSP frame-ancestors</strong> directive (modern). Both tell browsers under what conditions your page may be framed:</p>
<ul class="mt-2 space-y-1 list-disc pl-5 text-base-content/80">
  <li><code>DENY</code> — never allow framing</li>
  <li><code>SAMEORIGIN</code> — only allow framing from the same origin</li>
  <li><code>frame-ancestors 'none'</code> — CSP equivalent of DENY (preferred)</li>
  <li><code>frame-ancestors 'self' https://partner.com</code> — allow specific origins</li>
</ul>
<p class="mt-2"><strong>CSP frame-ancestors</strong> is the modern standard — it supports multiple origins and overrides X-Frame-Options. Use it instead of X-Frame-Options when possible.</p>`,
		},
		examples: [
			{ label: 'Block all framing (X-Frame)', code: 'X-Frame-Options: DENY', isValid: true },
			{ label: 'Same-origin only', code: 'X-Frame-Options: SAMEORIGIN', isValid: true },
			{ label: 'CSP (preferred, specific domains)', code: "Content-Security-Policy: frame-ancestors 'self' https://trusted-partner.com", isValid: true },
		],
		faqs: [
			{
				question: 'Should I use X-Frame-Options or CSP frame-ancestors?',
				answer: '<p>Prefer <strong>CSP frame-ancestors</strong> — it supports multiple origins, uses a modern standard, and CSP overrides X-Frame-Options when both are present. For maximum compatibility with older browsers, you can set both. If only setting one, use CSP frame-ancestors.</p>',
			},
			{
				question: 'Is there a legitimate reason to allow iframing?',
				answer: '<p>Yes: embedded widgets, payment frames, analytics dashboards, and partner integrations legitimately embed content in iframes. In this case, use <code>frame-ancestors \'self\' https://trusted-partner.com</code> to allow only the specific trusted domain, not a wildcard.</p>',
			},
			{
				question: 'Does DENY break my own app if I use iframes?',
				answer: '<p>Yes. If your app uses iframes internally (e.g., to embed a map, payment widget, or same-origin rich text editor), use <code>SAMEORIGIN</code> instead of <code>DENY</code>. For fine-grained control over which pages can be framed vs. which can frame others, apply the header selectively at the route level.</p>',
			},
			{
				question: 'Do mobile apps also need clickjacking protection?',
				answer: '<p>Native mobile apps do not use iframes, so traditional clickjacking is not a concern. However, mobile webviews can render web content and some webview implementations may be susceptible to UI redressing attacks. When building hybrid apps, apply the same frame protection headers to the web content served to the webview.</p>',
			},
		],
		relatedTools: [
			{ name: 'CSP Builder', path: '/security/csp', description: 'Full CSP including frame-ancestors' },
			{ name: 'Security Headers', path: '/security/headers', description: 'All HTTP security headers' },
			{ name: 'Headers Checklist', path: '/security/headers-checklist', description: 'Implementation guide' },
			{ name: 'CORS Builder', path: '/security/cors', description: 'Cross-origin resource sharing' },
		],
		tips: [
			'Add <code>X-Frame-Options: SAMEORIGIN</code> and <code>Content-Security-Policy: frame-ancestors \'self\'</code> to your baseline response headers today — it takes 5 minutes and provides immediate clickjacking protection.',
			'Apply DENY to sensitive pages (login, payment, account settings) even if you allow SAMEORIGIN elsewhere.',
			'Test your header is working by trying to embed your page in a simple iframe: <code>&lt;iframe src="https://yoursite.com"&gt;&lt;/iframe&gt;</code> — the browser should block it.',
			'Use browser DevTools → Network → Response Headers to confirm the header is being delivered on each request.',
		],
	},
};

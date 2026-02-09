// Comprehensive SEO-optimized content for System tools
// Centralized configuration for features, use cases, concepts, examples, FAQs, tips, and related tools

interface SystemToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[]; // Optional tips for applicable tools
}

export const systemToolsContent: Record<string, SystemToolContent> = {
	'info': {
		features: [
			'Comprehensive system info detection in browser',
			'OS, CPU, memory, and GPU information',
			'Screen resolution and display details',
			'Battery status and feature support detection',
			'Copy all data as JSON for reports',
			'Privacy-safe client-side detection'
		],
		useCases: [
			'Check device specs before installing apps',
			'Debug display issues with screen info',
			'Verify browser feature support',
			'Generate system reports for support tickets',
			'Test responsive designs on different devices'
		],
		concept: {
			title: 'How Browser System Detection Works',
			content: `<p><strong>Browser system detection</strong> uses JavaScript APIs to gather information about your device, OS, and capabilities. These APIs are designed with privacy in mind and return limited, sanitized data.</p>
			<p><strong>Key limitations:</strong></p>
			<ul>
				<li><strong>Memory caps at 8GB</strong> - Browsers limit reported RAM to protect privacy</li>
				<li><strong>Architecture may be indeterminate</strong> - Modern browsers obscure CPU architecture for fingerprinting protection</li>
				<li><strong>Approximate values</strong> - Some metrics like battery level are rounded</li>
				<li><strong>Permission-gated</strong> - Certain info requires user consent (battery, media devices)</li>
			</ul>
			<p>The tool uses APIs like <code>navigator.hardwareConcurrency</code>, <code>screen</code>, WebGL debug renderer, and Device Memory API to build a comprehensive system profile entirely in your browser.</p>`
		},
		examples: [
			{ label: 'Checking GPU for WebGL games', code: 'GPU Renderer: NVIDIA GeForce RTX 3080\nWebGL Version: 2.0\nMax Texture Size: 16384px', isValid: true },
			{ label: 'Verifying memory for heavy apps', code: 'Device Memory: ≥8 GB\nLogical CPU Cores: 12\nNote: Browser caps at 8GB', isValid: true },
			{ label: 'Display info for responsive design', code: 'Screen Resolution: 2560 × 1440\nDevice Pixel Ratio: 2x\nActual Pixels: 5120 × 2880', isValid: true }
		],
		faqs: [
			{ question: 'Why does memory show "≥8 GB" instead of exact amount?', answer: '<p>Browsers cap the Device Memory API at 8GB to prevent fingerprinting and protect user privacy. If your device has 16GB+ RAM, the browser will only report 8GB.</p>' },
			{ question: 'Is my GPU information exposed to websites?', answer: '<p>By default, browsers hide GPU details. This tool uses the WebGL debug renderer extension to show your GPU, but this only works if your browser allows it. Many browsers now block this for privacy.</p>' },
			{ question: 'Why is architecture "indeterminate" on my Mac?', answer: '<p>Modern Macs report "MacIntel" even on Apple Silicon chips due to Rosetta compatibility and browser privacy measures. The browser intentionally obscures whether you\'re using Intel or ARM.</p>' },
			{ question: 'Can I trust the battery information?', answer: '<p>Battery data is approximate and rounded by the browser. It\'s useful for debugging but not precise enough for critical applications. Some browsers (like Firefox) have disabled the Battery API entirely.</p>' },
			{ question: 'How can I copy all this data for a bug report?', answer: '<p>Click the "Copy as JSON" button to copy all system information in JSON format. You can paste this into bug reports or support tickets for developers to analyze.</p>' }
		],
		relatedTools: [
			{ name: 'Browser Info', path: '/system/browser', description: 'Detect browser name, version, and capabilities' },
			{ name: 'Network Info', path: '/system/network', description: 'Check connection type and public IP' },
			{ name: 'Media Devices', path: '/system/media', description: 'List cameras, mics, and speakers' },
			{ name: 'Permissions', path: '/system/permissions', description: 'Check browser permission states' }
		],
		tips: [
			'Use "Copy as JSON" for bug reports—it includes all detected values in a structured format developers can analyze',
			'Memory and architecture may be obscured for privacy; use developer tools or native apps for exact specs',
			'Screen resolution shows CSS pixels; multiply by Device Pixel Ratio for actual physical pixels',
			'Battery API is deprecated in some browsers; if "Not supported" shows, your browser prioritizes privacy'
		]
	},
	'browser': {
		features: [
			'Detect browser name and version instantly',
			'Check rendering engine and user agent',
			'Verify JavaScript and CSS feature support',
			'Test modern API availability (WebGPU, WebRTC)',
			'Identify language and timezone settings',
			'Privacy-first browser fingerprint analysis'
		],
		useCases: [
			'Debug browser-specific CSS or JS issues',
			'Check if WebAssembly or SharedArrayBuffer is supported',
			'Verify timezone for date/time calculations',
			'Test progressive web app compatibility',
			'Generate browser info for support requests'
		],
		concept: {
			title: 'Understanding Browser Detection',
			content: `<p><strong>Browser detection</strong> identifies your browser, version, and supported features using the <code>navigator</code> object and feature detection APIs. Unlike server-side user agent parsing, client-side detection is more accurate and respects user privacy.</p>
			<p><strong>Detection methods:</strong></p>
			<ul>
				<li><strong>User Agent parsing</strong> - Analyzes the UA string for browser name and version</li>
				<li><strong>Feature detection</strong> - Checks for API availability (e.g., <code>'serviceWorker' in navigator</code>)</li>
				<li><strong>Capability tests</strong> - Tests actual functionality (e.g., WebGL context creation)</li>
			</ul>
			<p><strong>Why use browser detection?</strong> Modern web apps need to know if cutting-edge features like WebGPU, SharedArrayBuffer, or Web Bluetooth are available. Feature detection is better than version checking because browsers evolve differently.</p>
			<p>This tool shows both metadata (browser, language, timezone) and capability flags to help you make informed decisions about what APIs your app can safely use.</p>`
		},
		examples: [
			{ label: 'Checking WebAssembly support', code: 'WebAssembly: Yes\nSharedArrayBuffer: Yes\nWeb Workers: Yes', isValid: true },
			{ label: 'Verifying PWA prerequisites', code: 'Service Worker: Yes\nNotifications: Yes\nLocal Storage: Yes\nIndexedDB: Yes', isValid: true },
			{ label: 'Testing emerging APIs', code: 'WebGPU: Yes\nWeb Bluetooth: No\nWeb USB: No\nWeb Serial: No', isValid: true }
		],
		faqs: [
			{ question: 'What\'s the difference between browser version and engine version?', answer: '<p>Browser version is the marketing version (e.g., Chrome 120). Engine version refers to the rendering engine like Blink, WebKit, or Gecko. This tool shows the browser version, which is usually more useful for compatibility checks.</p>' },
			{ question: 'Why does "Do Not Track" show "Not set"?', answer: '<p>Do Not Track (DNT) is a deprecated privacy signal. Most modern browsers don\'t set it because it was never widely respected by websites. Browsers now use other privacy mechanisms like tracking protection.</p>' },
			{ question: 'Can I use this for browser fingerprinting?', answer: '<p>While this tool shows browser capabilities, using it for fingerprinting is discouraged. Modern browsers actively fight fingerprinting by standardizing or hiding unique identifiers. Use feature detection for legitimate compatibility checks only.</p>' },
			{ question: 'What does "Cookies: Disabled" mean?', answer: '<p>If cookies are disabled, your browser blocks all website cookies. This breaks most session-based authentication. Third-party cookie blocking (common in privacy-focused browsers) shows as "Enabled" here.</p>' },
			{ question: 'How accurate is the timezone detection?', answer: '<p>Timezone detection via <code>Intl.DateTimeFormat</code> is very accurate and respects your system settings. It shows the IANA timezone name (e.g., "America/New_York"), which is more precise than UTC offsets.</p>' }
		],
		relatedTools: [
			{ name: 'System Info', path: '/system/info', description: 'View OS, CPU, memory, and GPU info' },
			{ name: 'Network Info', path: '/system/network', description: 'Check internet connection details' },
			{ name: 'Permissions', path: '/system/permissions', description: 'Check granted browser permissions' },
			{ name: 'Media Devices', path: '/system/media', description: 'Detect cameras and microphones' }
		],
		tips: [
			'Feature detection is better than browser version checking—test for the specific API you need (e.g., WebGL, WebRTC)',
			'SharedArrayBuffer requires cross-origin isolation headers; "No" here may indicate server config, not browser support',
			'Service Workers require HTTPS (except localhost); test on a secure connection for accurate results',
			'Language/timezone can reveal user location; be mindful of privacy when logging or fingerprinting this data'
		]
	},
	'network': {
		features: [
			'Detect current connection type (WiFi, 4G, etc)',
			'Check effective network speed (slow-2g to 4g)',
			'Measure round-trip time and downlink speed',
			'View public IP address and ISP info',
			'Test online/offline status',
			'Monitor connection changes in real-time'
		],
		useCases: [
			'Optimize media quality based on connection speed',
			'Defer large downloads on slow connections',
			'Show offline UI when connection is lost',
			'Debug network-related issues',
			'Test adaptive streaming strategies'
		],
		concept: {
			title: 'Network Information API Explained',
			content: `<p>The <strong>Network Information API</strong> exposes your device's network connection details to web apps, allowing them to adapt content based on speed and type. This is crucial for optimizing data usage and user experience.</p>
			<p><strong>Key metrics:</strong></p>
			<ul>
				<li><strong>Connection type</strong> - WiFi, cellular, Ethernet, Bluetooth, or unknown</li>
				<li><strong>Effective type</strong> - slow-2g, 2g, 3g, or 4g based on measured speed</li>
				<li><strong>Downlink</strong> - Estimated download speed in Mbps</li>
				<li><strong>RTT</strong> - Round-trip time in milliseconds (latency)</li>
			</ul>
			<p><strong>Practical use:</strong> Video streaming apps use this to choose video quality. Social media apps defer image uploads on slow connections. Progressive web apps download lighter assets when bandwidth is limited.</p>
			<p>The API also fires <code>change</code> events when your connection changes, allowing apps to react in real-time (e.g., pause downloads, reduce quality).</p>`
		},
		examples: [
			{ label: 'Fast WiFi connection', code: 'Type: wifi\nEffective Type: 4g\nDownlink: 10 Mbps\nRTT: 50 ms', isValid: true },
			{ label: 'Slow mobile data', code: 'Type: cellular\nEffective Type: 2g\nDownlink: 0.4 Mbps\nRTT: 800 ms', isValid: true },
			{ label: 'Checking if online', code: 'Status: Online\nConnection Available: Yes\nPublic IP: 203.0.113.42', isValid: true }
		],
		faqs: [
			{ question: 'Why does connection type show "unknown"?', answer: '<p>Some browsers don\'t support the Network Information API, or your device/OS doesn\'t expose connection type. Desktop computers on Ethernet often show "unknown" for privacy reasons.</p>' },
			{ question: 'Is the downlink speed accurate?', answer: '<p>Downlink is an <em>estimate</em> based on recent transfers, not a real-time speed test. It\'s useful for categorization (fast/slow) but not as precise as running a dedicated speed test.</p>' },
			{ question: 'What does "effective type: 2g" mean on WiFi?', answer: '<p>Effective type reflects actual performance, not connection type. If your WiFi is congested or has high latency, it may be classified as "2g" even though you\'re on WiFi. This helps apps adapt to real conditions.</p>' },
			{ question: 'Can I get my exact ISP from this tool?', answer: '<p>This tool shows your public IP, which can be used to look up your ISP via third-party services. However, the browser doesn\'t directly expose ISP information for privacy reasons.</p>' },
			{ question: 'How often does the connection info update?', answer: '<p>The browser updates connection info periodically based on real network performance. Apps can listen to <code>change</code> events to react when the connection type or speed changes.</p>' }
		],
		relatedTools: [
			{ name: 'System Info', path: '/system/info', description: 'View device and OS information' },
			{ name: 'Browser Info', path: '/system/browser', description: 'Check browser capabilities' },
			{ name: 'Media Devices', path: '/system/media', description: 'List available cameras and mics' },
			{ name: 'Permissions', path: '/system/permissions', description: 'Check browser permissions' }
		]
	},
	'media': {
		features: [
			'List all available cameras (front, back, external)',
			'Detect microphones and audio input devices',
			'Show speaker and audio output devices',
			'Request and test camera/mic permissions',
			'Preview video from selected camera',
			'Check device labels and capabilities'
		],
		useCases: [
			'Debug webcam or microphone issues',
			'Select specific camera for video recording',
			'Test device permissions before starting call',
			'Verify external USB camera is detected',
			'Check if headset mic is recognized'
		],
		concept: {
			title: 'Media Devices API for Camera and Mic Access',
			content: `<p>The <strong>Media Devices API</strong> (<code>navigator.mediaDevices</code>) allows web apps to access cameras, microphones, and speakers. This is the foundation for video calling, screen sharing, and audio recording in the browser.</p>
			<p><strong>How it works:</strong></p>
			<ul>
				<li><strong>Enumerate devices</strong> - <code>enumerateDevices()</code> lists all media inputs/outputs</li>
				<li><strong>Request permission</strong> - <code>getUserMedia()</code> prompts the user for camera/mic access</li>
				<li><strong>Get media stream</strong> - Returns a <code>MediaStream</code> object that can be played or recorded</li>
			</ul>
			<p><strong>Privacy protection:</strong> Browsers hide device labels until permission is granted. Before permission, you'll see generic labels like "Camera 1" or "Microphone 2". After granting access, actual device names appear (e.g., "FaceTime HD Camera").</p>
			<p>This tool shows all available devices and lets you test access by requesting permissions and previewing camera feeds.</p>`
		},
		examples: [
			{ label: 'Laptop with built-in camera', code: 'Cameras: 1\n- FaceTime HD Camera (Built-in)\nMicrophones: 1\n- Built-in Microphone', isValid: true },
			{ label: 'Desktop with external devices', code: 'Cameras: 2\n- Logitech C920 (USB)\n- Razer Kiyo (USB)\nMicrophones: 3\n- Blue Yeti (USB)\n- Headset Mic\n- Built-in', isValid: true },
			{ label: 'Mobile device', code: 'Cameras: 2\n- Front Camera\n- Back Camera\nMicrophones: 2\n- Bottom Mic\n- Top Mic', isValid: true }
		],
		faqs: [
			{ question: 'Why do I see "Camera 1" instead of the actual device name?', answer: '<p>For privacy, browsers hide device labels until you grant camera/microphone permission. Click "Request Permission" to see real device names.</p>' },
			{ question: 'Can I select which camera to use for video calls?', answer: '<p>Yes! Apps can use <code>getUserMedia()</code> with a specific <code>deviceId</code> to target a particular camera. This tool shows all available device IDs.</p>' },
			{ question: 'Why isn\'t my USB webcam showing up?', answer: '<p>Make sure the camera is plugged in and not in use by another app. Try refreshing the page or restarting your browser. On Linux, check that your user has permissions to access <code>/dev/video*</code> devices.</p>' },
			{ question: 'What\'s the difference between audioinput and audiooutput?', answer: '<p><code>audioinput</code> devices are microphones (record audio). <code>audiooutput</code> devices are speakers/headphones (play audio). Most browsers support input enumeration but not all support output selection.</p>' },
			{ question: 'Can websites access my camera without permission?', answer: '<p>No. Browsers require explicit user permission before accessing camera or microphone. Permissions are granted per-origin and can be revoked at any time in browser settings.</p>' }
		],
		relatedTools: [
			{ name: 'Permissions', path: '/system/permissions', description: 'Check camera/mic permission status' },
			{ name: 'System Info', path: '/system/info', description: 'View OS and hardware details' },
			{ name: 'Browser Info', path: '/system/browser', description: 'Check browser feature support' },
			{ name: 'Network Info', path: '/system/network', description: 'Test network connection' }
		]
	},
	'permissions': {
		features: [
			'Check camera and microphone permission status',
			'View location and notification permissions',
			'Test clipboard, geolocation, and sensor access',
			'Request permissions directly from the tool',
			'See permission state (granted, denied, prompt)',
			'Privacy-focused permission management'
		],
		useCases: [
			'Debug why an app can\'t access camera',
			'Check if location permission is granted',
			'Verify notification permissions before sending',
			'Test permission prompts in your web app',
			'Audit browser permissions for privacy review'
		],
		concept: {
			title: 'Browser Permissions API Explained',
			content: `<p>The <strong>Permissions API</strong> lets web apps query the status of browser permissions without triggering prompts. This improves UX by showing appropriate UI before requesting sensitive access.</p>
			<p><strong>Permission states:</strong></p>
			<ul>
				<li><strong>Granted</strong> - User allowed access; app can use the feature immediately</li>
				<li><strong>Denied</strong> - User blocked access; app should show alternative UI</li>
				<li><strong>Prompt</strong> - User hasn\'t decided; app can request permission via API</li>
			</ul>
			<p><strong>Common permissions:</strong> Camera, microphone, notifications, geolocation, clipboard, persistent storage, background sync, and more. Each has different privacy implications.</p>
			<p><strong>Best practice:</strong> Check permission status <em>before</em> calling the API. If denied, don\'t repeatedly prompt—explain why you need it and let users change it in browser settings. Respect user privacy preferences.</p>
			<p>This tool shows current permission states and lets you test requesting permissions to see how browsers prompt users.</p>`
		},
		examples: [
			{ label: 'Checking camera permission', code: 'Camera: prompt\n→ User hasn\'t decided\n→ Can request via getUserMedia()', isValid: true },
			{ label: 'Location already granted', code: 'Geolocation: granted\n→ Can call navigator.geolocation immediately\n→ No prompt needed', isValid: true },
			{ label: 'Notifications blocked', code: 'Notifications: denied\n→ User declined notifications\n→ Must change in browser settings', isValid: true }
		],
		faqs: [
			{ question: 'What does "prompt" mean for a permission?', answer: '<p>"Prompt" means the user hasn\'t made a decision yet. The next time your app requests this permission, the browser will show a permission dialog. If the user allows or denies, the state changes to "granted" or "denied".</p>' },
			{ question: 'Can I reset a denied permission from this tool?', answer: '<p>No. Once a user denies a permission, it can only be reset in browser settings (usually in the address bar lock icon or site settings). This prevents websites from bypassing user decisions.</p>' },
			{ question: 'Why can\'t I query all permissions at once?', answer: '<p>For privacy, the Permissions API only works for a limited subset of permissions. Sensitive permissions like camera/microphone can only be queried after being requested with <code>getUserMedia()</code>.</p>' },
			{ question: 'What\'s the difference between checking and requesting permissions?', answer: '<p>Checking (via Permissions API) tells you the current state without prompting. Requesting (via feature API like <code>getUserMedia()</code>) triggers a browser dialog if state is "prompt". Always check first to avoid unnecessary prompts.</p>' },
			{ question: 'Can websites track me through permissions?', answer: '<p>Permission states can contribute to browser fingerprinting, but modern browsers mitigate this. The Permissions API is designed to improve UX without exposing more information than feature detection already reveals.</p>' }
		],
		relatedTools: [
			{ name: 'Media Devices', path: '/system/media', description: 'List and test camera/mic devices' },
			{ name: 'Browser Info', path: '/system/browser', description: 'Check browser capabilities' },
			{ name: 'System Info', path: '/system/info', description: 'View device information' },
			{ name: 'Network Info', path: '/system/network', description: 'Check connection status' }
		],
		tips: [
			'Always check permission status before requesting to avoid annoying users with repetitive prompts',
			'If permission is denied, show a helpful message explaining why you need it and how to enable it in settings',
			'Permissions are origin-specific—https://example.com and https://www.example.com have separate permissions',
			'Some permissions (like camera) require secure context (HTTPS); they won\'t work on HTTP except localhost'
		]
	}
};

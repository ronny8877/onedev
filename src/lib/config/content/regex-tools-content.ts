
export interface RegexToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
}

export const regexToolsContent: Record<string, RegexToolContent> = {
	tester: {
		features: [
			'JavaScript RegExp only (the flavor in browsers and Node)',
			'Live match highlight with g i m s u flags',
			'Capture groups listed with index and length',
			'Shows a syntax error from `new RegExp`, not a PCRE diagnostic',
			'Does not emulate Python, Go RE2, .NET, or POSIX'
		],
		useCases: [
			'Debug a pattern that will run in the browser or in Node',
			'See why lookbehind works here but failed in an old engine',
			'Check that /g does not hide a lastIndex surprise',
			'Prototype a validator before pasting it into application code'
		],
		concept: {
			title: 'This tester is JavaScript, not PCRE',
			content: `<p>The engine here is <code>new RegExp(pattern, flags)</code>. That is ECMAScript regular expressions: the same syntax as <code>/pattern/flags</code> in the browser and in Node. It is <strong>not</strong> PCRE, not Python <code>re</code>, not Go <code>regexp</code>, not .NET, not POSIX. If you need those flavors, use regex101 and pick the flavor. This page will not pretend to cover them.</p>
<p>Failure modes that bite people moving from PCRE: possessive quantifiers (<code>++</code>, <code>*+</code>) are syntax errors in JS. <code>\\A</code> / <code>\\Z</code> are not start/end anchors here (<code>^</code> / <code>$</code> plus the <code>m</code> flag are). Named groups use <code>(?&lt;name&gt;...)</code> in modern JS, not Python\'s <code>(?P&lt;name&gt;...)</code>. Atomic groups <code>(?&gt;...)</code> do not exist.</p>
<p>JavaScript-specific traps: without <code>g</code> you only get the first match. With <code>g</code>, <code>exec</code> advances <code>lastIndex</code>, so a reused regex object can skip input. <code>.</code> does not match newlines unless <code>s</code> (dotAll) is on. Catastrophic backtracking still exists in JS: nested quantifiers like <code>(a+)+b</code> on a long string of <code>a</code>s can freeze the tab.</p>`
		},
		examples: [
			{
				label: 'JS named group (valid here)',
				code: '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})',
				isValid: true
			},
			{
				label: 'Python named group (invalid in JS)',
				code: '(?P<year>\\d{4})',
				isValid: false
			},
			{
				label: 'PCRE possessive + (invalid in JS)',
				code: '\\d++',
				isValid: false
			},
			{
				label: 'Lookbehind (JS; not in older IE, fine in modern engines)',
				code: '(?<=@)\\w+',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can I test a Python or PHP (PCRE) pattern here?',
				answer: '<p>Only if the syntax happens to overlap. Possessive quantifiers, <code>\\A</code>, <code>(?P&lt;name&gt;)</code>, and many PCRE verbs will throw in JavaScript. For those flavors, regex101 is the right tool. This page exists to show what <em>this</em> engine will do.</p>'
			},
			{
				question: 'Why does my PCRE pattern throw a syntax error?',
				answer: '<p>JS has no possessive <code>++</code>, no atomic groups, and a smaller set of lookaround and backreference features depending on the engine version. Read the error from <code>new RegExp</code>. Translate the construct to JS or keep the pattern in the original language.</p>'
			},
			{
				question: 'What do the flags g, i, m, s, u mean in JavaScript?',
				answer: '<p><code>g</code> all matches (and lastIndex). <code>i</code> case-insensitive. <code>m</code> makes <code>^</code> and <code>$</code> match line edges. <code>s</code> lets <code>.</code> match newline. <code>u</code> Unicode mode (needed for some property escapes). There is no PCRE <code>x</code> (extended / ignore whitespace) flag here.</p>'
			},
			{
				question: 'Why did a second exec() skip my string?',
				answer: '<p>A regex with <code>g</code> stores <code>lastIndex</code> on the object. In application code, create a new RegExp per test or reset <code>lastIndex = 0</code>. This tester builds a fresh expression each run so the UI does not carry lastIndex across keystrokes.</p>'
			}
		],
		relatedTools: [
			{ name: 'Regex Explainer', path: '/regex/explainer', description: 'Token breakdown of the same JS pattern' },
			{ name: 'Regex Replacer', path: '/regex/replacer', description: 'JS String.replace with $1, $2 (not PCRE replacements)' },
			{ name: 'JSON Formatter', path: '/json/formatter', description: 'When the test fixture is a JSON string that itself needs escaping' }
		],
		tips: [
			'If the pattern came from a Java, PHP, or Python codebase, assume it is PCRE-ish until you prove each construct exists in JS.',
			'Avoid (a+)+b and similar nested greedy quantifiers on untrusted input.',
			'Escape literal dots: host\\.example\\.com, not host.example.com.'
		],
		commonMistakes: [
			'Pasting a PCRE pattern with ++ or (?P<name>) and expecting it to run',
			'Assuming ^ and $ are \\A and \\Z',
			'Forgetting the g flag and thinking there is only one match',
			'Reusing a /g regex in a loop without resetting lastIndex'
		]
	},

	explainer: {
		features: [
			'Token-by-token visual breakdown of any regex pattern',
			'Color-coded token types: anchors, quantifiers, groups, character classes, escapes, lookarounds',
			'Interactive hover & click to inspect individual tokens',
			'Complexity score to gauge pattern difficulty',
			'Natural-language plain English summary of the pattern',
			'Complete token list with type, character range, and explanation',
			'Quick patterns for common use cases (Email, URL, Phone, etc.)',
			'"Try in Tester" shortcut to test the explained pattern live',
		],
		useCases: [
			'Understand a complicated regex found in legacy code',
			'Learn regex syntax through interactive exploration',
			'Debug a broken pattern by examining each component',
			'Review a regex submitted in a pull request',
			'Explain a pattern to a less experienced team member',
		],
		concept: {
			title: 'How Regex Parsing Works',
			content: `<p>A regex engine reads a pattern character by character, converting it into an internal state machine. Each <strong>token</strong> is a unit of meaning: a literal character, a metacharacter (like <code>.</code> or <code>*</code>), an escape sequence, or a group boundary.</p>
<p class="mt-2">Understanding tokens is the key to mastering regex. When you know what each piece does in isolation, you can build and diagnose complex patterns with confidence.</p>
<p class="mt-2">Token types include: <strong>Anchors</strong> (<code>^</code>, <code>$</code>, <code>\\b</code>), <strong>Quantifiers</strong> (<code>*</code>, <code>+</code>, <code>?</code>, <code>{n,m}</code>), <strong>Character Classes</strong> (<code>[abc]</code>, <code>\\d</code>, <code>\\w</code>), <strong>Groups</strong> (<code>(...)</code>, <code>(?:...)</code>), and <strong>Lookarounds</strong> (<code>(?=...)</code>, <code>(?!...)</code>).</p>`,
		},
		examples: [
			{ label: 'Email', code: '^[\\w.+-]+@[\\w.-]+\\.[a-zA-Z]{2,}$', isValid: true },
			{ label: 'URL', code: 'https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w\\-.~:/?#@!$&\'()*+,;=%]*', isValid: true },
			{ label: 'Named Group', code: '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})', isValid: true },
			{ label: 'Lookahead', code: '\\d+(?= dollars)', isValid: true },
		],
		faqs: [
			{
				question: 'What is a capturing group vs non-capturing group?',
				answer:
					'<p>A <strong>capturing group</strong> <code>(...)</code> matches a sub-expression and saves the matched text for later use (back-references or extraction). A <strong>non-capturing group</strong> <code>(?:...)</code> groups without saving the match — useful for applying a quantifier to multiple characters without the overhead of capturing.</p>',
			},
			{
				question: 'What is a lookahead and why is it useful?',
				answer:
					'<p>A <strong>positive lookahead</strong> <code>(?=...)</code> asserts that what follows the current position matches the given pattern, without consuming characters. For example, <code>\\d+(?= dollars)</code> matches a number only if followed by " dollars". A <strong>negative lookahead</strong> <code>(?!...)</code> asserts the opposite.</p>',
			},
			{
				question: 'What does the complexity score mean?',
				answer:
					'<p>The complexity score is a heuristic that weights each token type: lookarounds and groups are high-value (harder to reason about), while literals are low-value. A "Very Complex" score above 50 suggests the pattern may be difficult to maintain and worth simplifying or documenting thoroughly.</p>',
			},
			{
				question: 'What is a word boundary (\\b)?',
				answer:
					'<p><code>\\b</code> is a zero-width assertion that matches the position between a word character (<code>\\w</code>) and a non-word character (or the start/end of the string). <code>\\bcat\\b</code> matches "cat" in "a cat sat" but not in "catch".</p>',
			},
			{
				question: 'How do I match a specific number of repetitions?',
				answer:
					'<p>Use a <strong>quantifier range</strong>: <code>{n}</code> for exactly n times, <code>{n,}</code> for n or more, and <code>{n,m}</code> for between n and m times. For example, <code>\\d{4}</code> matches exactly 4 digits.</p>',
			},
		],
		relatedTools: [
			{ name: 'Regex Tester', path: '/regex/tester', description: 'Test patterns live against text' },
			{ name: 'Regex Cheatsheet', path: '/regex/cheatsheet', description: 'Full syntax reference' },
			{ name: 'Regex Replacer', path: '/regex/replacer', description: 'Find and replace with regex' },
		],
		tips: [
			'Click a token in the breakdown to "pin" its explanation even as you move your mouse.',
			'Paste a regex from your codebase directly into the input — even complex production patterns can be decoded.',
			'Use the complexity score as a signal: if it\'s "Very Complex", consider splitting the regex into two simpler ones.',
			'Named capture groups (<code>(?&lt;name&gt;...)</code>) make complex patterns much more readable and maintainable.',
			'The natural-language summary is approximate — always verify the token breakdown for accuracy in edge cases.',
		],
	},

	replacer: {
		features: [
			'Regex-powered find & replace with live preview',
			'Global, case-insensitive, and multiline flag controls',
			'Capture group references in replacements ($1, $2, $&)',
			'Inline diff view with color-coded changes',
			'Side-by-side original vs result comparison',
			'Line-by-line diff for multi-line text',
			'Apply changes in place (editable undo stack)',
			'Pre-built replacement pattern templates',
		],
		useCases: [
			'Reformat dates from YYYY-MM-DD to DD/MM/YYYY using capture groups',
			'Bulk transform URLs or file paths with a single pattern',
			'Sanitize or redact sensitive patterns in log files',
			'Convert camelCase to snake_case or kebab-case',
			'Remove duplicate whitespace, HTML tags, or boilerplate text',
		],
		concept: {
			title: 'Regex Find & Replace',
			content: `<p><strong>Regex replacements</strong> go beyond plain string substitution. Using <strong>capture groups</strong>, you can reference parts of the matched text in your replacement string.</p>
<p class="mt-2">In JavaScript's <code>String.replace()</code>, the replacement string supports special patterns: <code>$1</code>, <code>$2</code>, etc. for numbered capture groups; <code>$&lt;name&gt;</code> for named groups; <code>$&</code> for the whole match; <code>$\`</code> for the text before the match; and <code>$'</code> for the text after the match.</p>
<p class="mt-2">This makes regex replacement a powerful transformation tool — not just for simple swaps, but for restructuring, reformatting, and annotating text programmatically.</p>`,
		},
		examples: [
			{ label: 'Date reformat (YYYY-MM-DD → DD/MM/YYYY)', code: '(\\d{4})-(\\d{2})-(\\d{2}) → $3/$2/$1', isValid: true },
			{ label: 'Remove HTML tags', code: '<[^>]+> → (empty)', isValid: true },
			{ label: 'Wrap emails in brackets', code: '\\b[\\w.+-]+@[\\w.-]+\\.\\w{2,} → [$&]', isValid: true },
			{ label: 'camelCase to snake_case', code: '([A-Z]) → _$1 (then lowercase)', isValid: true },
		],
		faqs: [
			{
				question: 'How do I reference a capture group in the replacement?',
				answer:
					'<p>Use <code>$1</code> for the first group, <code>$2</code> for the second, and so on. For named groups like <code>(?&lt;year&gt;\\d{4})</code>, use <code>$&lt;year&gt;</code>. For example, pattern <code>(\\w+)@(\\w+)</code> with replacement <code>$1 at $2</code> turns "john@example" into "john at example".</p>',
			},
			{
				question: 'What does $& mean in the replacement?',
				answer:
					'<p><code>$&</code> represents the entire matched string. So a pattern <code>\\d+</code> with replacement <code>[$&]</code> would wrap every number in brackets: "Order 123" → "Order [123]".</p>',
			},
			{
				question: 'Can I replace with an empty string (delete matches)?',
				answer:
					'<p>Yes! Leave the replacement field empty. This effectively removes all occurrences of the pattern. For example, pattern <code>&lt;[^&gt;]+&gt;</code> with an empty replacement strips all HTML tags.</p>',
			},
			{
				question: 'What is the difference between the Preview, Side-by-Side, and Diff views?',
				answer:
					'<p><strong>Preview</strong> shows the final result text. <strong>Side-by-Side</strong> displays the original next to the result for easy comparison. <strong>Diff</strong> shows inline changes (strikethrough red for removed, green for added) and a line-by-line diff below, like a code review.</p>',
			},
			{
				question: 'What is the "Apply Changes" button for?',
				answer:
					'<p>It replaces the content of the input text area with the result, allowing you to chain multiple replacements. The <strong>Undo</strong> button lets you revert to the previous state. You can step through a series of transformations without losing your original text.</p>',
			},
		],
		relatedTools: [
			{ name: 'Regex Tester', path: '/regex/tester', description: 'Test patterns without replacing' },
			{ name: 'Regex Matcher', path: '/regex/matcher', description: 'Extract groups from text' },
			{ name: 'Regex Explainer', path: '/regex/explainer', description: 'Understand your pattern' },
			{ name: 'Text Diff', path: '/text/diff', description: 'Compare two texts' },
		],
		tips: [
			'Use the Diff view to sanity-check that only the intended text was changed before clicking Apply.',
			'Chain replacements by clicking "Apply Changes" between each, using the Undo stack to backtrack if needed.',
			'For reformatting dates or structured text, named capture groups (<code>(?&lt;year&gt;\\d{4})</code>) make your replacement pattern self-documenting.',
			'Test your replacement pattern on a small sample before running it on a large file.',
			'To delete trailing whitespace from every line, use pattern <code>[ \\t]+$</code> with the <code>m</code> (multiline) flag and an empty replacement.',
		],
	},

	matcher: {
		features: [
			'Extract all capture groups (named and numbered) from text',
			'Card and Table view modes for match results',
			'Filter to unique matches only',
			'Sort by position, length, or alphabetically',
			'Statistical dashboard: total, unique, groups, average length',
			'Export results as JSON, CSV, and plain text',
			'Expand/collapse individual match cards for detailed inspection',
		],
		useCases: [
			'Parse log files and extract structured fields (timestamps, levels, messages)',
			'Scrape and extract URLs, emails, or IDs from HTML or Markdown',
			'Extract named entities across a large body of text',
			'Validate and collect all matching tokens from code snippets',
			'Export structured data from unstructured text to JSON or CSV',
		],
		concept: {
			title: 'Capture Groups & Named Groups',
			content: `<p><strong>Capture groups</strong> are the most powerful feature of regular expressions. By wrapping part of your pattern in parentheses <code>(...)</code>, you tell the engine to "capture" that portion of the match separately from the full match.</p>
<p class="mt-2"><strong>Named capture groups</strong> — <code>(?&lt;name&gt;...)</code> — give each group a descriptive identifier instead of a number. This makes your pattern self-documenting and allows referencing groups by name in replacements and APIs.</p>
<p class="mt-2">Example: the pattern <code>(?&lt;user&gt;\\w+)@(?&lt;domain&gt;\\w+\\.\\w+)</code> on "john@example.com" captures <code>user: "john"</code> and <code>domain: "example.com"</code> — clean, structured data from raw text.</p>`,
		},
		examples: [
			{ label: 'Named groups', code: '(?<user>\\w+)@(?<domain>\\w+)\\.(?<tld>\\w+)', isValid: true },
			{ label: 'Date parts', code: '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})', isValid: true },
			{ label: 'Log level', code: '\\[(INFO|WARN|ERROR)\\] (.+)', isValid: true },
		],
		faqs: [
			{
				question: 'What is the difference between the Regex Tester and the Regex Matcher?',
				answer:
					'<p>The <strong>Tester</strong> focuses on highlighting matches inline within your text and is great for verifying your pattern is correct. The <strong>Matcher</strong> focuses on <em>extracting</em> and <em>exporting</em> the matched data — especially capture groups — making it ideal for data extraction workflows.</p>',
			},
			{
				question: 'What are named capture groups and how do I use them?',
				answer:
					'<p>Named groups use the syntax <code>(?&lt;name&gt;pattern)</code>. Instead of referencing by number (<code>$1</code>), you reference by name (<code>$&lt;name&gt;</code>). They appear in the "Capture Groups" panel with their name as the label, making results much more readable when extracting structured data.</p>',
			},
			{
				question: 'What does "Unique only" do?',
				answer:
					'<p>It filters the match list to show only distinct matches — duplicates are removed. This is useful when extracting unique values from a large text, such as a deduplicated list of all URLs or email addresses that appear.</p>',
			},
			{
				question: 'Can I export the matches?',
				answer:
					'<p>Yes. The <strong>Export</strong> button lets you download results as <code>.json</code> (structured, with groups), <code>.csv</code> (spreadsheet-friendly), or <code>.txt</code> (one match per line). The Quick Copy section in the results panel lets you copy any format to clipboard instantly.</p>',
			},
			{
				question: 'Why does the Matcher always use the global (g) flag?',
				answer:
					'<p>The Matcher is designed to find <em>all</em> occurrences, so the global flag is always active. Other flags (case-insensitive <code>i</code>, multiline <code>m</code>) can be toggled as needed.</p>',
			},
		],
		relatedTools: [
			{ name: 'Regex Tester', path: '/regex/tester', description: 'Highlight matches in text' },
			{ name: 'Regex Replacer', path: '/regex/replacer', description: 'Transform matched text' },
			{ name: 'Regex Explainer', path: '/regex/explainer', description: 'Decode your pattern' },
			{ name: 'JSON Tools', path: '/json', description: 'Work with JSON data' },
		],
		tips: [
			'Use named capture groups (<code>(?&lt;name&gt;...)</code>) for self-documenting patterns — the names appear as column headers in CSV export.',
			'The "Unique only" filter is invaluable for deduplication tasks like collecting all distinct emails from a mailing list.',
			'Sort by "Length" to quickly find the longest or shortest matches — useful for finding outliers.',
			'Export to JSON when you need structured data with group names preserved; use CSV for spreadsheet imports.',
			'For non-capturing groups — when you only need to group for quantifiers but don\'t care about capturing — use <code>(?:...)</code> for better performance.',
		],
	},

	cheatsheet: {
		features: [
			'Complete regex syntax reference organized by category',
			'Character classes, quantifiers, anchors, groups, and flags',
			'Common pattern examples for emails, URLs, dates, and more',
			'Interactive examples you can click to test immediately',
		],
		useCases: [
			'Quick lookup of a syntax element while writing a pattern',
			'Learning regex from scratch with a structured guide',
			'Reviewing the full range of available features',
			'Reference during code reviews involving regular expressions',
		],
		concept: {
			title: 'Regular Expression Syntax',
			content: `<p>Regular expressions have a concise but dense syntax. They consist of <strong>literals</strong> (characters that match themselves), <strong>metacharacters</strong> (characters with special meaning), <strong>character classes</strong>, <strong>anchors</strong>, <strong>quantifiers</strong>, and <strong>groups</strong>.</p>
<p class="mt-2">The power of regex comes from combining these building blocks. A cheatsheet is your quick reference for recalling the exact syntax of each piece without needing to look it up from scratch every time.</p>`,
		},
		examples: [
			{ label: '\\d+ — One or more digits', code: '\\d+', isValid: true },
			{ label: '^Hello — Starts with Hello', code: '^Hello', isValid: true },
			{ label: '[aeiou] — Any vowel', code: '[aeiou]', isValid: true },
			{ label: '(?=\\d) — Positive lookahead for digit', code: '(?=\\d)', isValid: true },
		],
		faqs: [
			{
				question: 'What is the simplest way to learn regex?',
				answer:
					'<p>Start with literals and character classes (<code>\\d</code>, <code>\\w</code>, <code>\\s</code>), then add quantifiers (<code>+</code>, <code>*</code>, <code>?</code>), then anchors (<code>^</code>, <code>$</code>), and finally groups. Practice on real data with the <a href="/regex/tester" class="text-primary">Regex Tester</a>.</p>',
			},
			{
				question: 'Is regex the same across all languages?',
				answer:
					'<p>The core syntax is similar (PCRE-inspired), but there are differences: Python uses <code>re</code> module with slightly different flags; Go uses RE2 which does not support backreferences; JavaScript does not support POSIX character classes. Always test in the target language.</p>',
			},
			{
				question: 'What is greedy vs lazy matching?',
				answer:
					'<p><strong>Greedy</strong> quantifiers (<code>*</code>, <code>+</code>) match as much as possible. <strong>Lazy</strong> quantifiers (<code>*?</code>, <code>+?</code>) match as little as possible. Example: on "aXbXc", <code>a.+c</code> (greedy) matches "aXbXc"; <code>a.+?c</code> (lazy) matches "aXbXc" — same here, but the difference is significant when anchors or patterns repeat multiple times.</p>',
			},
			{
				question: 'What are POSIX character classes?',
				answer:
					'<p>POSIX classes like <code>[:alpha:]</code> or <code>[:digit:]</code> are used in GREP and some other tools but are <strong>not</strong> supported in JavaScript. Use the equivalent shorthand like <code>\\d</code> for digits or <code>[a-zA-Z]</code> for letters instead.</p>',
			},
		],
		relatedTools: [
			{ name: 'Regex Tester', path: '/regex/tester', description: 'Test patterns live' },
			{ name: 'Regex Explainer', path: '/regex/explainer', description: 'Decode any pattern' },
			{ name: 'Regex Replacer', path: '/regex/replacer', description: 'Find & replace with regex' },
			{ name: 'Regex Matcher', path: '/regex/matcher', description: 'Extract capture groups' },
		],
		tips: [
			'Bookmark the cheatsheet as a companion tab while writing code that uses regex.',
			'When confused about a specific token, jump to the Explainer with that pattern to see it decoded visually.',
			'The "dot" metacharacter <code>.</code> does NOT match newlines by default — add the <code>s</code> (dotall) flag to change this.',
			'Character class negation with <code>[^...]</code> is one of the most useful patterns: <code>[^\\s]</code> matches any non-whitespace character.',
		],
	},
};

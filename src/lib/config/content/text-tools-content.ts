// Comprehensive SEO-optimized content for Text tools
// Centralized configuration for features, use cases, concepts, examples, FAQs, tips, and related tools

import type { ToolContent } from './types';

type TextToolContent = ToolContent;

export const textToolsContent: Record<string, TextToolContent> = {
	'string-compare': {
		features: [
			'Word-by-word string comparison',
			'Visual diff with color-coded highlighting',
			'Character-level and word-level comparison',
			'Case-sensitive and case-insensitive modes',
			'Side-by-side and inline diff views',
			'Copy comparison results instantly'
		],
		useCases: [
			'Compare API responses for debugging',
			'Verify text transformations are correct',
			'Find subtle differences in config files',
			'Check if two strings match exactly',
			'Debug string manipulation functions'
		],
		concept: {
			title: 'How String Comparison Works',
			content: `<p><strong>String comparison</strong> analyzes two strings character-by-character or word-by-word to identify differences. This tool uses diff algorithms similar to those in version control systems to highlight additions, deletions, and changes.</p>
			<p><strong>Comparison modes:</strong></p>
			<ul>
				<li><strong>Character-level</strong> - Compares every character, useful for finding typos</li>
				<li><strong>Word-level</strong> - Compares whole words, better for text content</li>
				<li><strong>Case-sensitive</strong> - "Hello" ≠ "hello"</li>
				<li><strong>Case-insensitive</strong> - "Hello" = "hello"</li>
			</ul>
			<p>The tool uses color coding: <span style="color: #22c55e">green for additions</span>, <span style="color: #ef4444">red for deletions</span>, and <span style="color: #f59e0b">yellow for modifications</span>.</p>`
		},
		examples: [
			{
				label: 'Finding typo differences',
				code: 'String 1: "The quick brown fox"\nString 2: "The qiuck brown fox"\n→ Highlights "quick" vs "qiuck"',
				isValid: true
			},
			{
				label: 'Case-insensitive match',
				code: 'String 1: "Hello World"\nString 2: "hello world"\n→ Match (case-insensitive mode)',
				isValid: true
			},
			{
				label: 'API response comparison',
				code: 'Response 1: {"status": "success"}\nResponse 2: {"status": "failure"}\n→ Highlights "success" vs "failure"',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the difference between character and word comparison?",
				answer:
					'<p>Character comparison checks every single character, making it ideal for catching typos. Word comparison treats each word as a unit, which is better for comparing sentences or paragraphs where word order matters.</p>'
			},
			{
				question: 'Does this tool support regex patterns?',
				answer:
					'<p>No, this is a direct string comparison tool. For pattern-based search and comparison, use the Find & Replace tool or Text Diff tool which support regex.</p>'
			},
			{
				question: 'Can I compare multi-line strings?',
				answer:
					'<p>Yes! The tool handles multi-line strings and will show differences line by line, similar to a code diff viewer.</p>'
			},
			{
				question: 'What does "case-insensitive" mean?',
				answer:
					'<p>In case-insensitive mode, uppercase and lowercase letters are treated as equal. For example, "Hello", "HELLO", and "hello" would all be considered identical.</p>'
			},
			{
				question: 'How can I use this for debugging?',
				answer:
					'<p>Paste expected output vs actual output to quickly spot differences. This is especially useful for debugging string manipulation, API responses, or text transformations.</p>'
			}
		],
		relatedTools: [
			{ name: 'Text Diff', path: '/text/diff', description: 'Line-by-line text comparison' },
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Find and replace with regex'
			},
			{
				name: 'Remove Duplicates',
				path: '/text/remove-duplicates',
				description: 'Remove duplicate lines'
			},
			{
				name: 'Case Converter',
				path: '/text/case-converter',
				description: 'Convert text case formats'
			}
		],
		tips: [
			'Use case-insensitive mode when comparing user input that might have inconsistent capitalization',
			'For JSON comparison, format both strings first using a JSON formatter to ensure consistent spacing',
			'Word-level comparison is faster and cleaner for large text blocks—use character-level only when precision matters',
			'Copy the diff output to include in bug reports or documentation to show exactly what changed'
		]
	},
	'case-converter': {
		features: [
			'Convert between 10+ text case formats instantly',
			'Support for camelCase, PascalCase, snake_case, kebab-case',
			'UPPERCASE, lowercase, Title Case, Sentence case',
			'Preserve or remove special characters',
			'Bulk text conversion',
			'Copy converted text with one click'
		],
		useCases: [
			'Convert variable names between coding conventions',
			'Format database column names (snake_case)',
			'Create URL slugs (kebab-case)',
			'Format class names (PascalCase)',
			'Normalize user input text'
		],
		concept: {
			title: 'Understanding Text Case Conventions',
			content: `<p><strong>Text case</strong> refers to how letters are capitalized and words are separated. Different programming languages, databases, and systems have different conventions.</p>
			<p><strong>Common formats:</strong></p>
			<ul>
				<li><strong>camelCase</strong> - First word lowercase, rest capitalized: <code>myVariableName</code></li>
				<li><strong>PascalCase</strong> - All words capitalized: <code>MyClassName</code></li>
				<li><strong>snake_case</strong> - Words separated by underscores: <code>my_variable_name</code></li>
				<li><strong>kebab-case</strong> - Words separated by hyphens: <code>my-url-slug</code></li>
				<li><strong>UPPER_SNAKE_CASE</strong> - Constants: <code>MAX_RETRY_COUNT</code></li>
			</ul>
			<p><strong>When to use each:</strong> JavaScript uses camelCase for variables, PascalCase for classes. Python and Ruby use snake_case. URLs use kebab-case. Database columns often use snake_case. Constants use UPPER_SNAKE_CASE.</p>`
		},
		examples: [
			{
				label: 'JavaScript variable to Python',
				code: 'Input: myVariableName\ncamelCase → snake_case\nOutput: my_variable_name',
				isValid: true
			},
			{
				label: 'Creating URL slug',
				code: 'Input: My Blog Post Title\nTitle Case → kebab-case\nOutput: my-blog-post-title',
				isValid: true
			},
			{
				label: 'Database constant',
				code: 'Input: max retry count\nlowercase → UPPER_SNAKE_CASE\nOutput: MAX_RETRY_COUNT',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the difference between camelCase and PascalCase?",
				answer:
					'<p>camelCase starts with a lowercase letter (myVariable), while PascalCase starts with uppercase (MyClass). Both capitalize subsequent words.</p>'
			},
			{
				question: 'When should I use snake_case vs kebab-case?',
				answer:
					'<p>Use snake_case for code (Python, Ruby, database columns) because underscores are valid in identifiers. Use kebab-case for URLs and file names because hyphens are more readable in URLs.</p>'
			},
			{
				question: 'Can this tool handle special characters?',
				answer:
					'<p>Yes! The tool can preserve or remove special characters like @, #, $, etc. depending on your needs. Non-alphabetic characters are typically removed in programming identifiers.</p>'
			},
			{
				question: 'What is SCREAMING_SNAKE_CASE used for?',
				answer:
					'<p>SCREAMING_SNAKE_CASE (all uppercase with underscores) is conventionally used for constants in many programming languages, like MAX_BUFFER_SIZE or API_KEY.</p>'
			},
			{
				question: 'Does this preserve acronyms correctly?',
				answer:
					'<p>The tool tries to preserve acronyms intelligently. For example, "HTTPSConnection" → "https_connection" in snake_case, keeping the acronym together.</p>'
			}
		],
		relatedTools: [
			{
				name: 'String Compare',
				path: '/text/string-compare',
				description: 'Compare text differences'
			},
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Find and replace patterns'
			},
			{
				name: 'Remove Duplicates',
				path: '/text/remove-duplicates',
				description: 'Remove duplicate text'
			},
			{ name: 'Line Tools', path: '/text/line-tools', description: 'Sort and manipulate lines' }
		],
		tips: [
			'When converting to kebab-case for URLs, the tool automatically lowercases everything—perfect for SEO-friendly slugs',
			'For API parameter conversion, camelCase is standard for JSON while snake_case is common for query params',
			'Use PascalCase for class names, React components, and type names in TypeScript',
			'Database naming: use snake_case for tables and columns to match SQL conventions'
		]
	},
	'line-tools': {
		features: [
			'Sort lines alphabetically or reverse',
			'Remove duplicate lines while preserving order',
			'Trim whitespace from each line',
			'Remove empty lines',
			'Reverse line order',
			'Number lines automatically'
		],
		useCases: [
			'Sort import statements in code',
			'Organize list of names or items',
			'Clean up messy text files',
			'Remove duplicate entries from lists',
			'Prepare data for CSV import'
		],
		concept: {
			title: 'Text Line Manipulation Techniques',
			content: `<p><strong>Line-based text processing</strong> treats each line as an independent unit that can be sorted, filtered, or transformed. This is fundamental to Unix text processing and very useful for data cleanup.</p>
			<p><strong>Common operations:</strong></p>
			<ul>
				<li><strong>Sorting</strong> - Alphabetical (A-Z), reverse (Z-A), or natural (numbers sorted correctly)</li>
				<li><strong>Deduplication</strong> - Remove exact duplicate lines, keep first or last occurrence</li>
				<li><strong>Trimming</strong> - Remove leading/trailing whitespace from each line</li>
				<li><strong>Filtering</strong> - Remove empty lines or lines matching a pattern</li>
			</ul>
			<p><strong>Use cases:</strong> Sorting imports in code files, organizing to-do lists, cleaning CSV data, removing duplicate entries from logs, preparing lists for alphabetical index.</p>`
		},
		examples: [
			{
				label: 'Sorting import statements',
				code: 'Input:\nimport React\nimport axios\nimport lodash\n→ Sorted alphabetically',
				isValid: true
			},
			{
				label: 'Removing duplicates',
				code: 'Input:\napple\nbanana\napple\ncherry\n→ Output: apple, banana, cherry',
				isValid: true
			},
			{
				label: 'Cleaning whitespace',
				code: 'Input:\n  hello  \n world  \n→ Output: hello, world (trimmed)',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the difference between normal sort and natural sort?",
				answer:
					'<p>Normal sort treats numbers as strings, so "10" comes before "2". Natural sort recognizes numbers, so "2" comes before "10". Use natural sort for lists with numbers.</p>'
			},
			{
				question: 'Does removing duplicates preserve order?',
				answer:
					'<p>Yes! The tool keeps the first occurrence of each unique line in its original position, removing only the subsequent duplicates.</p>'
			},
			{
				question: 'Can I sort case-insensitively?',
				answer:
					'<p>Yes! Case-insensitive sort treats "Apple" and "apple" as the same for sorting purposes, but preserves the original case in the output.</p>'
			},
			{
				question: 'What happens to empty lines when sorting?',
				answer:
					'<p>Empty lines are typically moved to the beginning or end of the sorted list. You can also choose to remove them entirely before sorting.</p>'
			},
			{
				question: 'Can I number lines like a code editor?',
				answer:
					'<p>Yes! The line numbering feature adds sequential numbers to the beginning of each line, useful for creating numbered lists or referencing specific lines.</p>'
			}
		],
		relatedTools: [
			{
				name: 'Remove Duplicates',
				path: '/text/remove-duplicates',
				description: 'Dedicated duplicate removal'
			},
			{ name: 'Text Diff', path: '/text/diff', description: 'Compare sorted vs unsorted' },
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Pattern-based line filtering'
			},
			{ name: 'Word Count', path: '/text/statistics', description: 'Count lines and words' }
		],
		tips: [
			"Before sorting code imports, make sure they're one per line—use Find & Replace to convert comma-separated imports",
			'Use "Remove empty lines" + "Trim whitespace" together to clean up messy copy-pasted text',
			'Natural sort is essential for filenames with numbers like "file1, file2, file10" to sort correctly',
			'When preparing CSV data, remove duplicates first, then sort to make it easier to spot remaining issues'
		]
	},
	diff: {
		features: [
			'Line-by-line text comparison with diff view',
			'Highlighted additions, deletions, and changes',
			'Side-by-side and inline diff modes',
			'Ignore whitespace option',
			'Context lines for better readability',
			'Export diff output'
		],
		useCases: [
			'Compare two versions of config files',
			'Review code changes before committing',
			'Diff database migration scripts',
			'Compare API documentation versions',
			'Check contract or legal document changes'
		],
		concept: {
			title: 'Understanding Diff Algorithms',
			content: `<p><strong>Text diffing</strong> identifies the changes needed to transform one text into another. This tool uses the same algorithms as Git and other version control systems.</p>
			<p><strong>Diff output format:</strong></p>
			<ul>
				<li><strong>Green lines</strong> - Added in the new version</li>
				<li><strong>Red lines</strong> - Removed from the old version</li>
				<li><strong>Yellow lines</strong> - Modified (combination of add/delete)</li>
				<li><strong>Gray lines</strong> - Context (unchanged, shown for reference)</li>
			</ul>
			<p><strong>Algorithms used:</strong> Myers diff algorithm for accuracy, with optimizations for large files. The tool can optionally ignore whitespace changes (useful for code reformatted with different indentation).</p>`
		},
		examples: [
			{
				label: 'Config file change',
				code: 'Before: port=8080\nAfter: port=3000\n→ Shows "8080" deleted, "3000" added',
				isValid: true
			},
			{
				label: 'Code refactoring',
				code: 'Before: function foo() {...}\nAfter: const foo = () => {...}\n→ Highlights syntax change',
				isValid: true
			},
			{
				label: 'Documentation update',
				code: 'Before: "Version 1.0 released"\nAfter: "Version 2.0 released"\n→ Shows version number change',
				isValid: true
			}
		],
		faqs: [
			{
				question: "What's the difference between side-by-side and inline diff?",
				answer:
					'<p>Side-by-side shows both versions next to each other, making it easy to compare. Inline shows changes in a single column with +/- markers, like Git diff output.</p>'
			},
			{
				question: 'Should I ignore whitespace when comparing code?',
				answer:
					'<p>Yes, if you only care about actual code changes. Ignore whitespace to hide indentation differences caused by auto-formatting tools.</p>'
			},
			{
				question: 'How does this compare to Git diff?',
				answer:
					'<p>This uses the same Myers diff algorithm as Git. The difference is this runs in your browser without needing Git installed, and has a more visual interface.</p>'
			},
			{
				question: 'Can I diff JSON or XML files?',
				answer:
					'<p>Yes, but format them first! Use a JSON/XML formatter to ensure consistent indentation, then diff the formatted versions for cleaner comparison.</p>'
			},
			{
				question: 'What are context lines?',
				answer:
					'<p>Context lines are unchanged lines shown around changes to give you context. For example, 3 context lines shows 3 unchanged lines before and after each change.</p>'
			}
		],
		relatedTools: [
			{
				name: 'String Compare',
				path: '/text/string-compare',
				description: 'Character-level comparison'
			},
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Find differences with regex'
			},
			{ name: 'Line Tools', path: '/text/line-tools', description: 'Sort before comparing' },
			{ name: 'Word Count', path: '/text/statistics', description: 'Compare text statistics' }
		],
		tips: [
			'Format both texts consistently before diffing—use JSON/XML formatters to eliminate formatting noise',
			"Ignore whitespace when comparing code that's been auto-formatted with different tools",
			'Use side-by-side view for large changes, inline view for quick review of small diffs',
			"Copy the diff output to include in code reviews or changelogs—it's a standard format developers understand"
		]
	},
	'find-replace': {
		features: [
			'Find and replace with regex support',
			'Case-sensitive and case-insensitive search',
			'Global replace or first match only',
			'Preview matches before replacing',
			'Match count and statistics',
			'Regex pattern validation and testing'
		],
		useCases: [
			'Replace all occurrences of old API endpoints',
			'Remove sensitive data from logs',
			'Convert date formats in text',
			'Clean up malformed CSV data',
			'Batch rename variables in code snippets'
		],
		concept: {
			title: 'Find and Replace with Regular Expressions',
			content: `<p><strong>Find and replace</strong> allows you to search for text patterns and replace them with new text. With <strong>regex (regular expressions)</strong>, you can match complex patterns, not just exact strings.</p>
			<p><strong>Common regex patterns:</strong></p>
			<ul>
				<li><code>\\d+</code> - One or more digits (e.g., "123")</li>
				<li><code>\\w+</code> - One or more word characters</li>
				<li><code>[a-z]+</code> - One or more lowercase letters</li>
				<li><code>.*</code> - Any characters (greedy match)</li>
				<li><code>(group)</code> - Capture group for use in replacement</li>
			</ul>
			<p><strong>Replacement patterns:</strong> Use <code>$1</code>, <code>$2</code> to reference captured groups. For example, find <code>(\\d+)-(\\d+)</code> and replace with <code>$2-$1</code> to swap two numbers.</p>`
		},
		examples: [
			{
				label: 'Replace URLs',
				code: 'Find: http://example.com\nReplace: https://example.com\n→ Updates all HTTP to HTTPS',
				isValid: true
			},
			{
				label: 'Format phone numbers',
				code: 'Find: (\\d{3})(\\d{3})(\\d{4})\nReplace: ($1) $2-$3\n→ "1234567890" becomes "(123) 456-7890"',
				isValid: true
			},
			{
				label: 'Remove extra spaces',
				code: 'Find: \\s+\nReplace: " " (single space)\n→ Collapses multiple spaces',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is regex and why should I use it?',
				answer:
					'<p>Regex (regular expressions) is a powerful pattern-matching language. Instead of finding exact text, you can find patterns like "any email address" or "all phone numbers". It\'s essential for advanced text processing.</p>'
			},
			{
				question: 'How do I reference captured groups in replacement?',
				answer:
					'<p>Use $1, $2, etc. For example, if you capture email with <code>(\\w+)@(\\w+\\.com)</code>, you can reverse it with <code>$2 - $1</code> in the replacement field.</p>'
			},
			{
				question: 'What does "global" replace mean?',
				answer:
					'<p>Global replaces all occurrences in the text. Without global, only the first match on each line is replaced. Always use global unless you specifically want to replace only the first match.</p>'
			},
			{
				question: 'Can I preview changes before applying?',
				answer:
					'<p>Yes! The tool shows a preview of what will be changed, with matches highlighted. This prevents accidental destructive replacements.</p>'
			},
			{
				question: 'How do I escape special characters in regex?',
				answer:
					'<p>Use backslash (\\) before special characters like . * + ? [ ] ( ) { } ^ $ |. For example, to match a literal period, use <code>\\.</code></p>'
			}
		],
		relatedTools: [
			{
				name: 'String Compare',
				path: '/text/string-compare',
				description: 'Verify replacements worked'
			},
			{ name: 'Text Diff', path: '/text/diff', description: 'See before/after changes' },
			{ name: 'Case Converter', path: '/text/case-converter', description: 'Change case format' },
			{
				name: 'Remove Duplicates',
				path: '/text/remove-duplicates',
				description: 'Remove duplicate lines'
			}
		],
		tips: [
			'Test your regex pattern on a small sample first before running it on large text—regex mistakes can be destructive',
			'Use the preview feature to verify matches before clicking Replace—it shows exactly what will change',
			'Common mistake: forgetting to escape special characters like periods (.) which match ANY character in regex',
			'For complex replacements, break them into multiple steps—do one find/replace, verify, then continue'
		]
	},
	statistics: {
		features: [
			'Count characters, words, sentences, paragraphs',
			'Calculate reading time and speaking time',
			'Show unique word count',
			'Longest and shortest word detection',
			'Average word and sentence length',
			'Character frequency analysis'
		],
		useCases: [
			'Check essay word count for assignments',
			'Verify tweet or SMS character limits',
			'Calculate blog post reading time',
			'Analyze content length for SEO',
			'Count words in articles for payment'
		],
		concept: {
			title: 'Text Statistics and Readability Metrics',
			content: `<p><strong>Word counting</strong> and text statistics help writers, editors, and content creators analyze their content. Different platforms have different limits: Twitter is 280 characters, SMS is 160, and Medium estimates reading time.</p>
			<p><strong>Key metrics:</strong></p>
			<ul>
				<li><strong>Character count</strong> - Total characters including spaces (for Twitter, SMS)</li>
				<li><strong>Word count</strong> - Total words separated by spaces (for essays, articles)</li>
				<li><strong>Reading time</strong> - Based on average 200-250 words per minute</li>
				<li><strong>Speaking time</strong> - Based on average 150 words per minute</li>
				<li><strong>Sentence count</strong> - Total sentences (for readability analysis)</li>
			</ul>
			<p><strong>SEO implications:</strong> Blog posts with 1,500-2,500 words rank better. Article length affects reading time, which impacts engagement metrics.</p>`
		},
		examples: [
			{
				label: 'Tweet length check',
				code: 'Input: "Just launched my new website!"\nCharacters: 30 (under 280 limit) ✓',
				isValid: true
			},
			{
				label: 'Blog post analysis',
				code: 'Input: 1,847 words\nReading time: ~7 minutes\nSentences: 94',
				isValid: true
			},
			{
				label: 'Essay word count',
				code: 'Input: 498 words\nTarget: 500 words\nNeed: 2 more words',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How is reading time calculated?',
				answer:
					'<p>Reading time assumes an average reading speed of 200-250 words per minute for adults. The tool uses 238 WPM (based on research), though individual speeds vary from 150-400 WPM.</p>'
			},
			{
				question: 'Does character count include spaces?',
				answer:
					"<p>Yes! Character count includes spaces, punctuation, and special characters. Some platforms (like Twitter) count spaces, while others don't—this tool shows both.</p>"
			},
			{
				question: 'What counts as a word?',
				answer:
					'<p>A word is any sequence of characters separated by spaces. Contractions like "don\'t" count as one word. Hyphenated words like "well-being" also count as one word.</p>'
			},
			{
				question: 'Can I use this for SEO optimization?',
				answer:
					"<p>Yes! Content length is an SEO factor. Most SEO experts recommend 1,500-2,500 words for blog posts to rank well. Use this to check if you've hit your target length.</p>"
			},
			{
				question: "What's the difference between unique words and total words?",
				answer:
					'<p>Total words counts every word, including repeats. Unique words counts each distinct word only once. High uniqu ratio indicates diverse vocabulary.</p>'
			}
		],
		relatedTools: [
			{
				name: 'Text Diff',
				path: '/text/diff',
				description: 'Compare word counts between versions'
			},
			{ name: 'Line Tools', path: '/text/line-tools', description: 'Count lines in text' },
			{ name: 'Find & Replace', path: '/text/find-replace', description: 'Find word occurrences' },
			{
				name: 'Remove Duplicates',
				path: '/text/remove-duplicates',
				description: 'Remove duplicate words'
			}
		],
		tips: [
			'For SEO blog posts, aim for 1,500-2,500 words with a reading time of 7-10 minutes',
			'Twitter counts characters, not words—use character count to stay under 280 limit',
			'Speaking time is useful for preparing presentations—1,000 words = ~6-7 minutes of speech',
			'Check unique word count to assess vocabulary diversity—higher percentage indicates richer content'
		]
	},
	anagram: {
		features: [
			'Find all anagrams of a word or phrase',
			'Dictionary validation of real words',
			'Multi-word anagram generation',
			'Filter by word length',
			'Sort results alphabetically',
			'Show word definitions'
		],
		useCases: [
			'Solve word puzzles and games',
			'Generate creative usernames',
			'Find rhyming alternatives',
			'Crossword puzzle solving',
			'Wordle and Scrabble help'
		],
		concept: {
			title: 'Anagram Generation and Word Puzzles',
			content: `<p>An <strong>anagram</strong> is a word or phrase formed by rearranging the letters of another word or phrase. For example, "listen" is an anagram of "silent".</p>
			<p><strong>How it works:</strong></p>
			<ul>
				<li><strong>Letter frequency</strong> - Count each letter in the input</li>
				<li><strong>Dictionary lookup</strong> - Find all words with the same letter frequency</li>
				<li><strong>Validation</strong> - Check against English dictionary to ensure real words</li>
				<li><strong>Multi-word</strong> - Combine multiple words that use all letters exactly once</li>
			</ul>
			<p><strong>Famous anagrams:</strong> "astronomers" = "moon starers", "conversation" = "voices rant on", "debit card" = "bad credit".</p>`
		},
		examples: [
			{
				label: 'Simple anagram',
				code: 'Input: "listen"\nAnagrams: silent, enlist, inlets, tinsel',
				isValid: true
			},
			{
				label: 'Name anagram',
				code: 'Input: "William Shakespeare"\nAnagram: "I am a weakish speller"',
				isValid: true
			},
			{ label: 'Phrase anagram', code: 'Input: "the eyes"\nAnagram: "they see"', isValid: true }
		],
		faqs: [
			{
				question: 'What makes a valid anagram?',
				answer:
					'<p>A valid anagram uses all the letters from the original word exactly once—no more, no fewer. "Cat" cannot be an anagram of "bat" because the letters differ.</p>'
			},
			{
				question: 'Does the anagram finder include proper nouns?',
				answer:
					'<p>By default, the tool focuses on common English words. Proper nouns (names, places) are generally excluded unless they\'re also common words (like "bill" or "rose").</p>'
			},
			{
				question: 'Can I find anagrams of phrases?',
				answer:
					'<p>Yes! For phrases, the tool ignores spaces and punctuation, treating "the eyes" and "they see" as anagrams because they have the same letters.</p>'
			},
			{
				question: 'How many anagrams exist for a typical word?',
				answer:
					'<p>It varies widely. Common short words might have 5-20 anagrams. Longer words often have fewer because the letter combination becomes more unique.</p>'
			},
			{
				question: 'Can this help with Wordle or Scrabble?',
				answer:
					'<p>Absolutely! Enter your available letters, and the tool finds all valid words you can make. For Wordle, use it to find words with specific letter patterns.</p>'
			}
		],
		relatedTools: [
			{
				name: 'String Compare',
				path: '/text/string-compare',
				description: 'Compare word similarities'
			},
			{ name: 'Case Converter', path: '/text/case-converter', description: 'Change word format' },
			{ name: 'Word Count', path: '/text/statistics', description: 'Analyze word statistics' },
			{ name: 'Find & Replace', path: '/text/find-replace', description: 'Find letter patterns' }
		]
	},
	'remove-duplicates': {
		features: [
			'Remove duplicate lines from text',
			'Remove duplicate words from sentences',
			'Case-sensitive or case-insensitive deduplication',
			'Preserve original order',
			'Count duplicates removed',
			'Trim whitespace before comparison'
		],
		useCases: [
			'Clean up email lists',
			'Remove duplicate entries from logs',
			'Deduplicate CSV data',
			'Clean up repeated words in writing',
			'Prepare unique lists for import'
		],
		concept: {
			title: 'Deduplication Algorithms and Strategies',
			content: `<p><strong>Deduplication</strong> removes repeated items while preserving unique entries. This tool works line-by-line or word-by-word to eliminate redundancy.</p>
			<p><strong>Deduplication modes:</strong></p>
			<ul>
				<li><strong>Line-based</strong> - Each line is compared; duplicate lines are removed</li>
				<li><strong>Word-based</strong> - Each word is compared; duplicate words are removed</li>
				<li><strong>Case-sensitive</strong> - "Apple" and "apple" are different</li>
				<li><strong>Case-insensitive</strong> - "Apple" and "apple" are considered duplicates</li>
			</ul>
			<p><strong>Order preservation:</strong> The tool keeps the first occurrence of each item in its original position, removing only subsequent duplicates. This is different from sort+unique which changes order.</p>`
		},
		examples: [
			{
				label: 'Email list cleanup',
				code: 'Input:\nuser@example.com\ntest@test.com\nuser@example.com\n→ Removes second "user@example.com"',
				isValid: true
			},
			{
				label: 'Repeated words',
				code: 'Input: "The the quick brown brown fox"\n→ Output: "The quick brown fox"',
				isValid: true
			},
			{
				label: 'Case-insensitive',
				code: 'Input:\nApple\napple\nBanana\n→ Keeps "Apple", removes "apple"',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Does removing duplicates change the order of items?',
				answer:
					'<p>No! The tool preserves the original order. The first occurrence of each unique item stays in its original position—only subsequent duplicates are removed.</p>'
			},
			{
				question: "What's the difference between line and word deduplication?",
				answer:
					'<p>Line deduplication treats each line as a unit. Word deduplication works within lines, removing repeated words while keeping the line structure.</p>'
			},
			{
				question: 'Should I use case-sensitive or case-insensitive mode?',
				answer:
					'<p>Use case-insensitive for email lists, names, or URLs where "Example.com" and "example.com" should be considered the same. Use case-sensitive for code or where capitalization matters.</p>'
			},
			{
				question: 'Does the tool trim whitespace before comparing?',
				answer:
					'<p>Yes, by default! Leading/trailing spaces are removed before comparison, so "  apple" and "apple  " are treated as duplicates. You can disable this if needed.</p>'
			},
			{
				question: 'How can I see how many duplicates were removed?',
				answer:
					'<p>The tool shows statistics: original line count, unique line count, and number of duplicates removed. This helps verify the cleanup worked correctly.</p>'
			}
		],
		relatedTools: [
			{ name: 'Line Tools', path: '/text/line-tools', description: 'Sort and manipulate lines' },
			{ name: 'Text Diff', path: '/text/diff', description: 'See what was removed' },
			{ name: 'Word Count', path: '/text/statistics', description: 'Count unique words' },
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Find duplicates with regex'
			}
		],
		tips: [
			'Before removing duplicates from CSV data, sort it first so related items are grouped together',
			'Use case-insensitive mode for email lists to catch "User@Email.com" and "user@email.com" as duplicates',
			'Combine with "Trim whitespace" in Line Tools to ensure clean comparison without invisible space differences',
			'Export the statistics (before vs after count) to document data cleanup in your workflow'
		]
	},
	'lorem-ipsum': {
		features: [
			'Generate Lorem Ipsum placeholder text',
			'Choose paragraphs, sentences, or words',
			'Adjustable length and quantity',
			'Classic Lorem Ipsum or random text',
			'HTML paragraph tags option',
			'Copy generated text instantly'
		],
		useCases: [
			'Fill website mockups and templates',
			'Test responsive design layouts',
			'Demonstrate typography styles',
			'Prototype content-heavy pages',
			'Test CMS or blog platforms'
		],
		concept: {
			title: 'Lorem Ipsum and Placeholder Text',
			content: `<p><strong>Lorem Ipsum</strong> is dummy text used in design and publishing since the 1500s. It resembles normal English word length and letter distribution, making it ideal for testing layouts without distraction.</p>
			<p><strong>Why use Lorem Ipsum?</strong></p>
			<ul>
				<li><strong>Realistic length</strong> - Shows how actual content will fit</li>
				<li><strong>Language-neutral</strong> - Doesn't distract with meaningful content</li>
				<li><strong>Balanced appearance</strong> - Letters are distributed like real text</li>
				<li><strong>Industry standard</strong> - Widely recognized as placeholder text</li>
			</ul>
			<p><strong>Origin:</strong> Lorem Ipsum comes from Cicero's "de Finibus Bonorum et Malorum" (45 BC), scrambled to remove meaning while maintaining natural-looking text flow.</p>`
		},
		examples: [
			{
				label: 'Single paragraph',
				code: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt...',
				isValid: true
			},
			{
				label: 'Three short sentences',
				code: 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Sed do eiusmod tempor.',
				isValid: true
			},
			{
				label: '50 words',
				code: 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt...',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What does "Lorem Ipsum" mean?',
				answer:
					"<p>It doesn't mean anything! The text is scrambled Latin from Cicero's writings. The words are broken and rearranged so readers focus on layout, not content.</p>"
			},
			{
				question: 'Why not just use "test test test"?',
				answer:
					'<p>Real text has varying word lengths, letter frequencies, and punctuation. Lorem Ipsum mimics this natural distribution, giving more realistic layout testing than repeated words.</p>'
			},
			{
				question: 'Can I generate text with HTML tags?',
				answer:
					'<p>Yes! The tool can wrap paragraphs in <code>&lt;p&gt;</code> tags, making it easy to paste directly into HTML code without manual formatting.</p>'
			},
			{
				question: 'Is Lorem Ipsum still relevant in modern design?',
				answer:
					"<p>Absolutely! It's an industry standard in web design, graphic design, and publishing. Clients and designers immediately recognize it as placeholder text.</p>"
			},
			{
				question: "What's the difference between paragraphs, sentences, and words?",
				answer:
					'<p>Paragraphs generate full blocks of text separated by line breaks. Sentences generate complete sentences with periods. Words generate just words separated by spaces, no punctuation.</p>'
			}
		],
		relatedTools: [
			{
				name: 'Blabber Generator',
				path: '/text/blabber',
				description: 'Generate random readable text'
			},
			{ name: 'Word Count', path: '/text/statistics', description: 'Count generated text length' },
			{ name: 'Case Converter', path: '/text/case-converter', description: 'Change text case' },
			{
				name: 'Find & Replace',
				path: '/text/find-replace',
				description: 'Customize generated text'
			}
		]
	},
	blabber: {
		features: [
			'Generate random readable gibberish text',
			'Adjustable paragraph and sentence count',
			'Mimics natural language structure',
			'Pronounceable but nonsensical words',
			'Variable sentence length',
			'Perfect for realistic layout testing'
		],
		useCases: [
			'Test multilingual layouts',
			'Prototype content-heavy designs',
			'Fill UI components with realistic text',
			'Test text overflow handling',
			'Create dummy data for demos'
		],
		concept: {
			title: 'Random Text Generation for Testing',
			content: `<p><strong>Blabber text</strong> generates pronounceable gibberish that looks like real language. Unlike Lorem Ipsum (scrambled Latin), this creates completely random but structured text.</p>
			<p><strong>Generation algorithm:</strong></p>
			<ul>
				<li><strong>Consonant-vowel patterns</strong> - Mimics natural syllable structure (ba-la-ka, mi-do-ra)</li>
				<li><strong>Variable word length</strong> - Mix of short (2-3 letters) and long (8-12 letters) words</li>
				<li><strong>Sentence structure</strong> - Capital letters, periods, commas for realistic appearance</li>
				<li><strong>Paragraph flow</strong> - Multiple sentences with varied length</li>
			</ul>
			<p><strong>Use case:</strong> Better than Lorem Ipsum when you want text that doesn't look like Latin, or need completely unique placeholder content for each element.</p>`
		},
		examples: [
			{
				label: 'Generated paragraph',
				code: 'Mikalora befindo ralesta. Kolpa mindara selko befindo ralesta polikarn...',
				isValid: true
			},
			{
				label: 'Short blabber',
				code: 'Beka milo. Randa kolf pesi. Mika belo ranta.',
				isValid: true
			},
			{
				label: 'Long form text',
				code: 'Mikolandara befindorel kolikorestana polikestran mirandoleskal...',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'How is this different from Lorem Ipsum?',
				answer:
					'<p>Lorem Ipsum is scrambled Latin text. Blabber generates completely random pronounceable words that look like a made-up language. Use Blabber when you want unique, non-Latin placeholder text.</p>'
			},
			{
				question: 'Is the generated text truly random?',
				answer:
					'<p>Yes! Each time you generate, you get completely different words. The algorithm creates new syllable combinations every time, so no two generations are identical.</p>'
			},
			{
				question: 'Can I use this for multilingual testing?',
				answer:
					'<p>Yes! Blabber text works well for testing layouts with "foreign-looking" text without using real languages that might have cultural or translation issues.</p>'
			},
			{
				question: 'Why use gibberish instead of real placeholder text?',
				answer:
					'<p>Real text can distract stakeholders or users during reviews. Gibberish makes it obvious that content is temporary while still showing realistic text flow.</p>'
			},
			{
				question: 'Is the generated text repeatable?',
				answer:
					"<p>No, it's random each time. If you need the same placeholder text across multiple elements, generate once and copy/paste or use Lorem Ipsum which has standard paragraphs.</p>"
			}
		],
		relatedTools: [
			{
				name: 'Lorem Ipsum',
				path: '/text/lorem-ipsum',
				description: 'Generate classic Lorem Ipsum'
			},
			{ name: 'Word Count', path: '/text/statistics', description: 'Count generated text' },
			{ name: 'Case Converter', path: '/text/case-converter', description: 'Change text case' },
			{ name: 'Text Statistics', path: '/text/statistics', description: 'Analyze generated text' }
		]
	}
};

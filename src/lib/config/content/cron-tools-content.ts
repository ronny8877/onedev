export interface ToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
	commonMistakes?: string[];
}

export const cronToolsContent: Record<string, ToolContent> = {
	generator: {
		features: [
			'Visual UI for building cron expressions without memorizing syntax',
			'Supports both standard 5-field (Linux/Unix) and Quartz (Spring/AWS) 6-field/7-field formats',
			'Instant plain-English translation of your current schedule',
			'Real-time calculation of the next 5 upcoming run times',
			'Support for advanced modifiers like Last day (L), Weekday (W), and Nth day (#)',
			'One-click copy to clipboard'
		],
		useCases: [
			'Scheduling automated database backups at a specific time (e.g., Sunday at 2 AM)',
			'Configuring AWS CloudWatch Events or Kubernetes CronJobs',
			'Setting up periodic system maintenance scripts or log rotations',
			'Creating recurring Jenkins or GitHub Actions CI/CD pipeline triggers',
			'Learning cron syntax through visual feedback'
		],
		concept: {
			title: 'Understanding Cron Syntax',
			content: `<p>A standard <strong>Cron Expression</strong> is a string comprising five or six fields separated by whitespace. It represents a set of times, used by the <code>cron</code> daemon to execute scheduled tasks.</p>
			
			<p><strong>The Standard 5 Fields:</strong></p>
			<ol>
				<li><strong>Minute</strong>: <code>0-59</code></li>
				<li><strong>Hour</strong>: <code>0-23</code></li>
				<li><strong>Day of Month</strong>: <code>1-31</code></li>
				<li><strong>Month</strong>: <code>1-12</code> (or JAN-DEC)</li>
				<li><strong>Day of Week</strong>: <code>0-6</code> (Sun-Sat, or SUN-SAT)</li>
			</ol>
			
			<p>Using special characters like the asterisk <code>*</code> (every), comma <code>,</code> (value list separator), hyphen <code>-</code> (range of values), or slash <code>/</code> (step values) helps create highly flexible recurring schedules.</p>`
		},
		examples: [
			{
				label: 'Every Midnight',
				code: '0 0 * * *',
				isValid: true
			},
			{
				label: 'Every Monday at 9:00 AM',
				code: '0 9 * * 1',
				isValid: true
			},
			{
				label: 'Every 15 Minutes',
				code: '*/15 * * * *',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'What is the difference between Standard Unix Cron and Quartz?',
				answer: 'Standard Unix cron uses 5 fields (Minute, Hour, Day of Month, Month, Day of Week) and only resolves down to the minute. Quartz cron adds a 6th field for "Seconds" at the very beginning, allowing sub-minute task scheduling, and sometimes a 7th field for "Year". Quartz also supports advanced flags like `L` (Last) and `W` (Weekday).'
			},
			{
				question: 'How do I run a task every 5 minutes?',
				answer: 'Use the step operator `/`. The expression `*/5 * * * *` means "every 5th minute".'
			},
			{
				question: 'Does cron handle timezones?',
				answer: 'By default, the cron daemon runs based on the system\'s local timezone in the server environment. If the server is in UTC, schedule your jobs relative to UTC. Some modern runners (like GitHub Actions) exclusively use UTC.'
			}
		],
		relatedTools: [
			{ name: 'Cron Explainer', path: '/cron/explainer', description: 'Translate cron strings to English' },
			{ name: 'Cron Presets', path: '/cron/presets', description: 'Copy common scheduling strings' },
			{ name: 'Next Run Calculator', path: '/cron/next-run', description: 'Calculate future executions' }
		],
		tips: [
			'Always double check the timezone context of the system running the cronbot (like AWS Lambda or GitHub Actions—they default to UTC!).',
			'Try avoiding running heavy tasks at exactly midnight `0 0 * * *` to prevent "thundering herd" bottlenecks; use a random offset like `14 2 * * *`.'
		]
	},
	explainer: {
		features: [
			'Plain-English read of 5-field Vixie cron and 6-field Quartz',
			'Calls out DOM + DOW both restricted: Vixie ORs those fields',
			'Flags DST skips and repeats around the spring/fall transition',
			'Field-by-field breakdown (minute hour DOM month DOW, plus seconds for Quartz)'
		],
		useCases: [
			'Decode a crontab before you assume it means AND on day-of-month and weekday',
			'Tell a 6-field Spring/Quartz string from a 5-field Linux crontab',
			'Check whether 0 2 * * * fires twice or not at all on a DST night',
			'Document a legacy schedule without running it'
		],
		concept: {
			title: 'Vixie OR, Quartz 6-field, and DST',
			content: `<p><strong>Vixie cron</strong> (Linux crontab, most Unix) is five fields: minute hour day-of-month month day-of-week. When <em>both</em> DOM and DOW are restricted (neither is <code>*</code>), Vixie treats them as <strong>OR</strong>. <code>0 0 1 * 1</code> means "midnight on the 1st of the month, <em>or</em> midnight every Monday", not "Mondays that are also the 1st". People coming from Quartz or from English "and" get this wrong.</p>
<p><strong>Quartz</strong> (Spring, many Java schedulers) is usually six fields with <strong>seconds first</strong>: second minute hour DOM month DOW, sometimes a seventh year. <code>0 0 12 * * ?</code> is noon every day in Quartz. Paste that into Vixie and the fields shift. Quartz uses <code>?</code> for "no value" on DOM or DOW because it does not OR those fields the Vixie way. <code>L</code>, <code>W</code>, and <code>#</code> are Quartz (and some AWS) extensions, not standard crontab.</p>
<p><strong>DST:</strong> cron uses the machine timezone. At spring-forward, 02:30 may never exist; the job is skipped. At fall-back, 01:30 may exist twice; some crons fire twice, some once. Kubernetes CronJobs and GitHub Actions use UTC. Do not schedule a local 2 AM job in a DST zone and assume it is daily.</p>`
		},
		examples: [
			{
				label: 'Vixie OR: 1st of month OR Mondays (not AND)',
				code: '0 0 1 * 1',
				isValid: true
			},
			{
				label: 'Weekdays only (DOW restricted, DOM is *)',
				code: '30 4 * * 1-5',
				isValid: true
			},
			{
				label: 'Quartz 6-field noon (seconds first, ? for DOM)',
				code: '0 0 12 * * ?',
				isValid: true
			},
			{
				label: 'Minute 65 is invalid',
				code: '65 * * * *',
				isValid: false
			}
		],
		faqs: [
			{
				question: 'Why did 0 0 1 * 1 run on a Monday that was not the 1st?',
				answer: '<p>Vixie cron ORs day-of-month and day-of-week when both are restricted. That expression is "the 1st, or Mondays". Quartz does not work that way; it uses <code>?</code> on one of those fields. Read the man page for crontab(5) if the daemon is Vixie/cronie.</p>'
			},
			{
				question: 'Is 0 0 12 * * ? valid on Linux crontab?',
				answer: '<p>No. That is Quartz (seconds + <code>?</code>). Linux wants five fields and has no <code>?</code>. Six numbers in Vixie will shift every field or be rejected.</p>'
			},
			{
				question: 'Will my 2 AM job run on DST change weekend?',
				answer: '<p>Maybe not, or twice. Spring-forward skips the missing hour. Fall-back can duplicate it. Schedule in UTC (K8s, GitHub Actions) or pick 3:30 AM local if you must use a DST zone.</p>'
			},
			{
				question: 'Sunday is 0 or 7?',
				answer: '<p>Vixie accepts both 0 and 7 as Sunday. Some parsers only accept 0-6. Do not assume <code>7</code> works in Quartz (often 1-7 with 1 = Sunday).</p>'
			}
		],
		relatedTools: [
			{ name: 'Cron Generator', path: '/cron/generator', description: 'Build 5-field or Quartz strings with the same field rules' },
			{ name: 'Next Run Calculator', path: '/cron/next-run', description: 'Preview upcoming fires, including DST-affected hours' },
			{ name: 'Unix Timestamp', path: '/date/timestamp', description: 'Convert a fire time to epoch after you know the timezone' }
		],
		tips: [
			'If both DOM and DOW are not *, assume OR on Linux until you prove the daemon is Quartz.',
			'GitHub Actions and K8s CronJobs are UTC. Write the expression for UTC, not your laptop timezone.',
			'Avoid 0 2 * * * in America/New_York. Use 30 7 * * * UTC instead.'
		],
		commonMistakes: [
			'Reading Vixie DOM+DOW as AND',
			'Pasting a Quartz 6-field string into crontab',
			'Assuming 2 AM local always exists',
			'Treating Sunday as 7 on a parser that only allows 0-6'
		]
	},
	validator: {
		features: [
			'Strict syntax validation for standard Linux/Unix cron',
			'Boundary checks (e.g., rejecting minute > 59 or month > 12)',
			'Specific detection of invalid characters or typos',
			'Range validation ensuring the start boundary is lower than the end boundary',
			'Provides immediate feedback on exact character errors'
		],
		useCases: [
			'Linting infrastructure-as-code (Terraform, Ansible) cron definitions',
			'Preventing catastrophic server misfires caused by typos',
			'Testing complex range and step configurations (`15-45/10`)',
			'Ensuring GitHub Action or GitLab CI schedule triggers meet strict parser rules'
		],
		concept: {
			title: 'Cron Syntax Errors',
			content: `<p>Because cron strings are just space-delimited sequences, a single typo can either fail silently or run a job 60 times an hour instead of once a day.</p>
			
			<p><strong>Common Traps the Validator Catches:</strong></p>
			<ul>
				<li><strong>Out of Bounds:</strong> e.g., <code>0 25 * * *</code> (Hour 25 does not exist).</li>
				<li><strong>Invalid Steps:</strong> e.g., <code>*//5 * * * *</code> (Double slash syntax error).</li>
				<li><strong>Reversed Ranges:</strong> e.g., <code>0 0 5-1 * *</code> (Range must go from smaller to larger).</li>
				<li><strong>Field Count:</strong> Providing only 4 parameters instead of the required 5.</li>
			</ul>`
		},
		examples: [
			{
				label: 'Missing Required Field (Error)',
				code: '* * * *',
				isValid: false
			},
			{
				label: 'Out of Bounds (Error)',
				code: '0 0 32 * *',
				isValid: false
			},
			{
				label: 'Valid Complex Range',
				code: '5-20/5 0 * * 1,3,5',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why did my CI pipeline reject a valid cron?',
				answer: 'Different systems have different parser rules. For example, GitHub Actions does NOT support the `@daily` or `@hourly` alias strings, nor does it support non-standard steps like `W` or `L`. Always stick to the 5 baseline numeric columns for maximum compatibility.'
			},
			{
				question: 'Is `7` a valid Day of Week?',
				answer: 'In many standard Linux implementations, `0` and `7` both represent Sunday. The validator normally accepts either, but it is best practice to simply use `0` to avoid parser bugs.'
			},
			{
				question: 'How do I specify a step size within a range?',
				answer: 'Combine the hyphen and slash. For example, `10-50/10` means "every 10 units bounded between the 10th and 50th offset".'
			}
		],
		relatedTools: [
			{ name: 'Cron Explainer', path: '/cron/explainer', description: 'Convert to readable English' },
			{ name: 'Human to Cron', path: '/cron/human', description: 'Convert English to cron' },
			{ name: 'Next Run Calculator', path: '/cron/next-run', description: 'See upcoming datetimes' }
		],
		tips: [
			'Always validate complex strings if you use multiple commas combined with range hyphens (e.g. `1,15,30-45`).',
			'Some tools prefer text abbreviations (`MON-FRI`) over numbers (`1-5`); ensuring both bounds use the same format helps prevent errors.'
		]
	},
	'next-run': {
		features: [
			'Calculates and lists the exact dates and times for the next upcoming executions',
			'Full interactive Timezone support (Convert UTC to local time instantly)',
			'Preview up to 100 future occurrences',
			'Highlights time-deltas (e.g., "happens in 2 hours")',
			'Safely evaluates edge cases around Daylight Saving Time (DST) and leap years'
		],
		useCases: [
			'Aligning server maintenance tasks with low-traffic timezone hours',
			'Ensuring a monthly billing script fires on the correct calendar day',
			'Debugging jobs that seemed to skip a run over a holiday or DST shift',
			'Proving to QA/Stakeholders exactly when an automated email campaign will trigger'
		],
		concept: {
			title: 'Timezones and Next Runs',
			content: `<p>A cron expression itself is <strong>timezone agnostic</strong>—it only knows hours and minutes, not global geography. The actual execution relies entirely on the server's local clock.</p>
			
			<p>If you write <code>0 12 * * *</code> (noon) and deploy it to a server running in UTC, it will trigger at 12:00 UTC. If you intended for it to run at noon EST (Eastern Standard Time), it will fire 5 hours earlier than you wanted!</p>
			
			<p>Using a Next Run Calculator with timezone projections is crucial when orchestrating cloud-native architectures that span globally distributed clusters.</p>`
		},
		examples: [
			{
				label: 'Weekly Midnight UTC',
				code: '0 0 * * 0',
				isValid: true
			},
			{
				label: 'Quarterly Task',
				code: '0 0 1 1,4,7,10 *',
				isValid: true
			},
			{
				label: 'Leap Year Edge Case',
				code: '0 0 29 2 *',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Why did my cron skip an execution today?',
				answer: 'If your cron was scheduled between 2 AM and 3 AM during a "Spring Forward" Daylight Savings Time shift, that hour never existed localized to the server clock, causing the daemon to skip the job.'
			},
			{
				question: 'How do I handle leap years?',
				answer: 'If you schedule a job for February 29th (`0 0 29 2 *`), the next-run calculator will confirm that this job will only trigger on leap years (e.g. 2024, 2028).'
			},
			{
				question: 'Can cron run every few seconds?',
				answer: 'Standard Unix cron can only run as frequently as every 1 minute (`* * * * *`). If you need sub-minute resolution (e.g. every 10 seconds), you must use an application-level generic scheduler or sleep loops.'
			}
		],
		relatedTools: [
			{ name: 'Cron Explainer', path: '/cron/explainer', description: 'See what the cron does' },
			{ name: 'Cron Generator', path: '/cron/generator', description: 'Build a new cron' },
			{ name: 'Time Converter', path: '/convert/time', description: 'Convert time units' }
		],
		tips: [
			'When using cloud providers like AWS or Vercel, pretend the server is ALWAYS in UTC and do the mental math backwards for your chron expressions.',
			'Use the Next Run list to verify the exact behavior of jobs that run on the 31st of restricted months.'
		]
	},
	presets: {
		features: [
			'Copypaste-ready list of the most commonly used cron patterns',
			'Categorized by frequency (Hourly, Daily, Weekly, Monthly, Yearly)',
			'Includes standard predefined macros (e.g., @daily, @hourly)',
			'One-click clipboard copy functionality',
			'Short descriptions explaining the exact execution conditions'
		],
		useCases: [
			'Quickly grabbing a standard script trigger without opening a manual generator',
			'Finding inspiration for how to structure a complex schedule',
			'Standardizing the recurrence notation across your DevOps team',
			'Learning cron syntax by studying canonical examples'
		],
		concept: {
			title: 'Cron Macros (Non-Standard Extensions)',
			content: `<p>Many modern cron daemons support special shortcut strings (macros) in place of the 5-part numeric string. These make code highly readable but aren't supported by every single CI engine.</p>
			
			<p><strong>Common Macros:</strong></p>
			<ul>
				<li><code>@hourly</code>: Run once an hour (Equivalent to <code>0 * * * *</code>)</li>
				<li><code>@daily</code> / <code>@midnight</code>: Run once a day at midnight (Equivalent to <code>0 0 * * *</code>)</li>
				<li><code>@weekly</code>: Run once a week at midnight on Sunday (Equivalent to <code>0 0 * * 0</code>)</li>
				<li><code>@monthly</code>: Run once a month, on the first day (Equivalent to <code>0 0 1 * *</code>)</li>
				<li><code>@yearly</code> / <code>@annually</code>: Run once a year on Jan 1st (Equivalent to <code>0 0 1 1 *</code>)</li>
			</ul>`
		},
		examples: [
			{
				label: 'Office Hours Only',
				code: '0 9-17 * * 1-5',
				isValid: true
			},
			{
				label: 'Bi-Hourly',
				code: '0 */2 * * *',
				isValid: true
			},
			{
				label: 'First Day of Month',
				code: '0 0 1 * *',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Are presets universally supported?',
				answer: 'Numeric 5-field presets are universally supported across Linux, Unix, Kubernetes, and Serverless platforms. Text Macros like `@daily` are not universally supported (e.g., GitHub Actions does not allow them).'
			},
			{
				question: 'How do I run a job at a random time to prevent server lag?',
				answer: 'Avoid preset "round" numbers like `0 0 * * *`. Instead, pick a random minute and hour offset like `17 3 * * *` (3:17 AM). Jenkins specifically supports an `H` flag (`H H * * *`) to automatically hash a random offset, but this is exclusive to Jenkins.'
			},
			{
				question: 'Can I do "every other week"?',
				answer: 'Cron does not natively understand bi-weekly spans very well. You generally have to schedule it weekly, but add a bash conditional script inside the job to check if the current week number is even/odd before executing.'
			}
		],
		relatedTools: [
			{ name: 'Cron Generator', path: '/cron/generator', description: 'Modify a preset visually' },
			{ name: 'Cron Explainer', path: '/cron/explainer', description: 'Explain the preset' },
			{ name: 'Next Run', path: '/cron/next-run', description: 'See when a preset will fire' }
		],
		tips: [
			'Start with a preset that roughly matches your needs, copy it to the Generator tool, and then finetune the minutes/hours.',
			'If a cron task takes longer to execute than the interval between occurrences, instances will overlap and potentially crash your server.'
		]
	},
	human: {
		features: [
			'Type your desired schedule in natural plain English (e.g., "every tuesday at 4pm")',
			'AI-driven contextual parsing translates the phrase directly into valid cron syntax',
			'Supports complex clauses ("every 15 minutes between 9am and 5pm")',
			'Instant reverse-explanation validation generated automatically',
			'Handles colloquialisms like "weekdays", "midnight", or "weekends"'
		],
		useCases: [
			'Writing infrastructure schedules without needing to memorize cron syntax rules',
			'Quickly prototyping deployment triggers during meetings or brainstorming',
			'Allowing non-technical product managers to generate schedule configurations safely',
			'Converting legacy English documentation directly into code-ready cron strings'
		],
		concept: {
			title: 'Natural Language Scheduling',
			content: `<p>Generative natural language processing bridges the gap between human intent and the strict structural bounds of system architecture.</p>
			
			<p>When you type "every weekday at 6:30 PM", the parser maps the linguistic tokens to the cron fields:</p>
			<ul>
				<li>"6:30 PM" → Minute <code>30</code> and Hour <code>18</code> (24-hour clock conversion)</li>
				<li>"every weekday" → Days <code>1-5</code> (Mon-Fri) instead of the <code>*</code> wildcard</li>
			</ul>
			<p>Resulting output: <code>30 18 * * 1-5</code></p>`
		},
		examples: [
			{
				label: 'Simple Input',
				code: 'Every Monday at 9:00 AM',
				isValid: true
			},
			{
				label: 'Range Input',
				code: 'Every 30 minutes from 10am to 2pm',
				isValid: true
			},
			{
				label: 'Specific Days',
				code: 'On the 1st and 15th of the month at midnight',
				isValid: true
			}
		],
		faqs: [
			{
				question: 'Can the tool understand "every other week"?',
				answer: 'Natural Language to Cron has limitations based on the underlying cron spec itself. Since pure cron cannot do modulo math on weeks, requests for "bi-weekly" schedules might generate approximations or fallbacks.'
			},
			{
				question: 'How specific do I need to be in my sentences?',
				answer: 'Try to be clear about Minutes, Hours, and Days. "Every morning" is vague and might default to 8:00 AM. It is better to write "Every morning at 8:30 AM".'
			},
			{
				question: 'Does this handle timezone phrases?',
				answer: 'If you type "at 5 PM EST", the translated cron string will still just output `0 17 * * *`. You must ensure the environment executing the cron is locally set to EST, or shift the math to UTC yourself.'
			}
		],
		relatedTools: [
			{ name: 'Cron Explainer', path: '/cron/explainer', description: 'Reverse translation' },
			{ name: 'Cron Validator', path: '/cron/validator', description: 'Ensure syntax safety' },
			{ name: 'Next Run', path: '/cron/next-run', description: 'Check the AI\'s math' }
		],
		tips: [
			'Always use the companion "Next Run Calculator" to verify that the generated output from your English phrase perfectly matches your actual intentions.',
			'Keep your language simple and instructional rather than conversational for best parsing accuracy.'
		]
	}
};

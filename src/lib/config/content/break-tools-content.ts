export interface BreakToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const breakToolsContent: Record<string, BreakToolContent> = {
	pomodoro: {
		features: [
			'25/5 and 50/10 presets used by a lot of software teams',
			'Work and break phases with a distinct color so you know which you are in',
			'A short chime when a phase ends (Web Audio, no extra download)',
			'Session counter for this visit only',
			'Pause and reset without creating an account'
		],
		useCases: [
			'Protect a coding block from "just one more Slack message"',
			'Pair a 50/10 cycle with a hard problem that needs longer focus',
			'Use the chime as a reminder to stand up, not as a productivity score',
			'Time a review session so it does not eat the whole afternoon'
		],
		concept: {
			title: 'What Pomodoro actually is',
			content: `<p>The Pomodoro Technique is a cadence, not a personality test. You pick a work interval (classically 25 minutes), then a short break (5 minutes). After about four work intervals, you take a longer break. The original method used a kitchen timer. This page is the same idea in the browser.</p>
<p class="mt-2">The value is interruption control. A closed loop makes it easier to ignore a non-urgent ping until the break. It is a poor fit for work that cannot be paused (a live incident, a meeting, a compile that takes 40 minutes). If 25 minutes feels fake, use 50/10.</p>
<p class="mt-2">This timer keeps state in the tab. Close it and the count is gone. Browsers throttle timers in background tabs, so leave the tab visible if you care about the chime firing on time.</p>`
		},
		faqs: [
			{
				question: 'Do you sync my sessions across devices?',
				answer: '<p>No. There is no account and no cloud. The counter is only for this page load.</p>'
			},
			{
				question: 'Why did the timer drift when I switched apps?',
				answer: '<p>Background tabs are often throttled. Keep this tab in the foreground, or use a dedicated desktop timer if you need second-accurate alerts while you are in another window.</p>'
			},
			{
				question: 'Is 25/5 required?',
				answer: '<p>No. It is the well-known default. 50/10 is here for people who need a longer deep-work block. Arbitrary custom minutes are out of scope for this simple timer.</p>'
			},
			{
				question: 'Does the chime play if the tab is muted?',
				answer: '<p>Site mute and OS mute both silence Web Audio. Unmute the tab if you want the beep.</p>'
			}
		],
		relatedTools: [
			{ name: 'Breathing Timer', path: '/break/breathing', description: 'Guided inhale, hold, and exhale between sessions' },
			{ name: 'Word Count', path: '/text/statistics', description: 'Check writing length when a Pomodoro is a writing block' }
		],
		tips: [
			'Decide the task before you press Start. A timer without a target is just a clock.',
			'After four work sessions, stand up for a longer break even if this UI does not force it.',
			'If you are on-call, skip Pomodoro. Incident work is not interval training.'
		]
	},
	breathing: {
		features: [
			'Timed inhale, hold, and exhale with a growing and shrinking circle',
			'1, 2, or 3 minute sessions',
			'Default 4-4-6 pattern (inhale 4s, hold 4s, exhale 6s)',
			'Breath count for the current run',
			'Runs locally; no account and no biometric tracking'
		],
		useCases: [
			'A two-minute reset after a stressful code review',
			'A short pause before you reply to a heated thread',
			'Practice a longer exhale, which many people find more settling than equal box breathing',
			'A screen-based cue when counting in your head is distracting'
		],
		concept: {
			title: 'Why the pattern is 4-4-6',
			content: `<p>This timer uses a 4 second inhale, 4 second hold, and 6 second exhale. A longer exhale is a common way to slow breathing without forcing a full "box" (4-4-4-4) or 4-7-8 cycle. Those other patterns exist in clinical and wellness literature; this page is a simple visual metronome, not a medical device.</p>
<p class="mt-2">Stop if you feel dizzy, short of breath, or uncomfortable. People with respiratory or cardiac conditions should follow advice from their clinician, not a website timer. There is no data collection: we do not record heart rate, video, or how often you use the tool.</p>
<p class="mt-2">The animation is CSS scale driven by a 50ms tick. Like the Pomodoro timer, background tabs may stutter. Keep the tab visible for a smooth circle.</p>`
		},
		faqs: [
			{
				question: 'Is this box breathing or 4-7-8?',
				answer: '<p>Neither exactly. Box breathing is equal sides. 4-7-8 is inhale 4, hold 7, exhale 8. This default is 4-4-6 so the cycle is shorter and easier to follow on a short break.</p>'
			},
			{
				question: 'Do you store breathing data?',
				answer: '<p>No. Breath count is in memory for this run only.</p>'
			},
			{
				question: 'Can I change the inhale and exhale lengths?',
				answer: '<p>Not in this version. Pick 1, 2, or 3 minutes and follow the 4-4-6 circle. Use a dedicated breathing app if you need custom timings.</p>'
			},
			{
				question: 'Should I use this instead of seeing a doctor?',
				answer: '<p>No. It is a pacing aid for a short pause, not treatment.</p>'
			}
		],
		relatedTools: [
			{ name: 'Pomodoro Timer', path: '/break/pomodoro', description: 'Focus intervals with a chime when a phase ends' }
		],
		tips: [
			'Sit upright and breathe through the nose if that is comfortable.',
			'If 4 seconds inhale is too long, skip this tool rather than straining.',
			'Use this between Pomodoro sessions, not during an incident bridge.'
		]
	}
};


interface GitToolContent {
	features: string[];
	useCases: string[];
	concept: { title: string; content: string };
	examples: Array<{ label: string; code: string; isValid: boolean }>;
	faqs: Array<{ question: string; answer: string }>;
	relatedTools: Array<{ name: string; path: string; description: string }>;
	tips?: string[];
}

export const gitToolsContent: Record<string, GitToolContent> = {
	'gitignore': {
		features: [
			'Generate .gitignore files for 500+ languages and frameworks',
			'Combine multiple presets (e.g., Node + MacOS + VSCode)',
			'Search with autocomplete',
			'Instant copy or download',
			'Preview generated content'
		],
		useCases: [
			'Starting a new project',
			'Adding a new language or tool to an existing repo',
			'Ensuring sensitive or temporary files are not committed'
		],
		concept: {
			title: 'What is .gitignore?',
			content: '<p>A <code>.gitignore</code> file tells Git which files or directories to ignore. It is essential for keeping your repository clean by excluding build artifacts, temporary files, and sensitive information like API keys.</p>'
		},
		examples: [
			{ label: 'Node.js', code: 'node_modules/\n.env\nnpm-debug.log', isValid: true },
			{ label: 'Python', code: '__pycache__/\n*.py[cod]\n.venv/', isValid: true }
		],
		faqs: [
			{ question: 'Why ignore files?', answer: 'To prevent clutter, reduce repo size, and avoid leaking secrets.' },
			{ question: 'Can I un-ignore a file?', answer: 'Yes, use `git add -f <file>` or remove the entry from .gitignore.' },
            { question: 'Does it affect already tracked files?', answer: 'No. If a file is already tracked, adding it to .gitignore won\'t remove it. You must use `git rm --cached <file>`.' }
		],
		relatedTools: [
			{ name: 'Secrets Scanner', path: '/git/secrets-scanner', description: 'Find secrets in code' },
			{ name: 'README Generator', path: '/git/readme-generator', description: 'Create README.md' },
            { name: 'License Picker', path: '/git/license-picker', description: 'Choose a license' }
		],
		tips: ['Always include OS-specific files like `.DS_Store` (macOS) or `Thumbs.db` (Windows).', 'Commit your .gitignore file so everyone on the team uses the same rules.']
	},
	'commit-generator': {
		features: [
			'Build Conventional Commits visually',
			'Select commit type (feat, fix, chore, etc.)',
			'Add scope, description, body, and footer',
			'Preview formatted commit message',
			'Emoji support',
            'Breaking change indicator'
		],
		useCases: [
			'Standardizing commit messages across a team',
			'Learning Conventional Commits specification',
			'Writing descriptive and structured history'
		],
		concept: {
			title: 'Conventional Commits',
			content: '<p><strong>Conventional Commits</strong> is a specification for adding human and machine readable meaning to commit messages. It follows the structure: <code>&lt;type&gt;[optional scope]: &lt;description&gt;</code>.</p>'
		},
		examples: [
			{ label: 'Feature', code: 'feat(auth): add login with Google', isValid: true },
			{ label: 'Fix', code: 'fix(api): handle timeout error gracefully', isValid: true },
            { label: 'Breaking Change', code: 'feat!: drop support for Node 12', isValid: true }
		],
		faqs: [
			{ question: 'Why use this format?', answer: 'It enables automated changelog generation and semantic versioning.' },
			{ question: 'What are common types?', answer: '`feat` (feature), `fix` (bug fix), `docs` (documentation), `style` (formatting), `refactor` (code restructuring).' },
            { question: 'Is scope required?', answer: 'No, scope is optional but helpful for large projects to indicate which part of the code changed.' }
		],
		relatedTools: [
			{ name: 'Commit Validator', path: '/git/commit-validator', description: 'Check commit format' },
			{ name: 'Branch Generator', path: '/git/branch-generator', description: 'Create branch names' },
            { name: 'Log Formatter', path: '/git/log-formatter', description: 'Format git logs' }
		],
		tips: ['Keep the first line (subject) under 50 characters.', 'Use the imperative mood (e.g., "add" not "added").']
	},
	'commit-validator': {
		features: [
			'Validate commit messages against Conventional Commits spec',
			'Real-time error feedback',
			'Checks for line length limits',
			'Suggests corrections',
            'Explains each part of the commit message'
		],
		useCases: [
			'Verifying a commit message before committing',
			'Troubleshooting why a commit hook failed',
			'Teaching team members proper formatting'
		],
		concept: {
			title: 'Commit Validation',
			content: '<p>Validating commit messages ensures they follow a specific set of rules, usually the Conventional Commits specification. This consistency is crucial for automated tools that parse commit history.</p>'
		},
		examples: [
			{ label: 'Valid', code: 'feat(ui): update button styles', isValid: true },
			{ label: 'Invalid (No Type)', code: 'update button styles', isValid: false },
            { label: 'Invalid (Too Long)', code: 'feat: this subject line is way too long and should definitely be shortened because it exceeds the standard limit', isValid: false }
		],
		faqs: [
			{ question: 'What is the max length?', answer: 'The subject line should ideally be under 50 chars, and never over 72.' },
			{ question: 'What if I have a lot to say?', answer: 'Use the commit body! Leave a blank line after the subject and write as much as you need.' },
            { question: 'Does case matter?', answer: 'Yes, types like `feat` and `fix` are usually lowercase.' }
		],
		relatedTools: [
			{ name: 'Commit Generator', path: '/git/commit-generator', description: 'Build commit messages' },
			{ name: 'Git Workflow', path: '/git/workflow', description: 'Learn git workflows' }
		],
		tips: ['Use a git hook (like Husky) to automate this check locally.']
	},
	'branch-generator': {
		features: [
			'Generate standard branch names',
			'Types: feature, bugfix, hotfix, release',
			'Ticket ID support (JIRA, GitHub)',
			'Slugifies descriptions automatically',
			'Customizable format'
		],
		useCases: [
			'Creating consistent branches for tasks',
			'Linking branches to issue trackers',
			'Collaborating in shared repositories'
		],
		concept: {
			title: 'Branch Naming Conventions',
			content: '<p>Consistent branch naming helps in identifying the purpose of a branch at a glance. Common patterns include <code>type/ticket-id/description</code> or <code>user/type/description</code>.</p>'
		},
		examples: [
			{ label: 'Feature', code: 'feature/PROJ-123-add-user-login', isValid: true },
			{ label: 'Bugfix', code: 'bugfix/header-alignment-error', isValid: true },
            { label: 'Hotfix', code: 'hotfix/v1.2.1-security-patch', isValid: true }
		],
        faqs: [
			{ question: 'Why use slashes?', answer: 'Git treats slashes as directory separators, allowing you to group branches logically (e.g., all `feature/*` branches).' },
			{ question: 'Can I use spaces?', answer: 'No, spaces are not allowed in git branch names. Use hyphens or underscores.' },
            { question: 'What is a "chore" branch?', answer: 'Usually for maintenance tasks that don\'t change production code, like updating dependencies.' }
		],
		relatedTools: [
			{ name: 'Commit Generator', path: '/git/commit-generator', description: 'Create commit messages' },
			{ name: 'Git Workflow', path: '/git/workflow', description: 'Visual workflow guide' }
		],
		tips: ['Keep branch names short but descriptive.', 'Include the ticket ID to automatically link to your project management tool.']
	},
	'workflow': {
        features: [
            'Visual diagrams for Git Flow, GitHub Flow, and Trunk-Based Development',
            'Step-by-step command guides',
            'Pros and cons for each workflow',
            'Interactive command copying'
        ],
        useCases: [
			'Choosing the right workflow for your team',
			'Onboarding a new developer',
			'Understanding complex branching strategies'
		],
		concept: {
			title: 'Git Workflows',
			content: '<p>A <strong>Git Workflow</strong> defines how a team uses Git to collaborate. It establishes rules for creating branches, merging code, and deploying releases.</p>'
		},
		examples: [
			{ label: 'Git Flow', code: 'git flow init', isValid: true },
			{ label: 'Feature Branch', code: 'git checkout -b feature/new-idea', isValid: true }
		],
		faqs: [
			{ question: 'Which workflow is best?', answer: 'Trunk-based is great for CI/CD and fast iteration. Git Flow is better for scheduled releases.' },
			{ question: 'What is a "main" branch?', answer: 'The primary branch where production-ready code lives (formerly "master").' },
            { question: 'What is a Pull Request?', answer: 'A request to merge code from one branch into another, allowing for code review.' }
		],
		relatedTools: [
			{ name: 'Visual Cheatsheet', path: '/git/cheatsheet', description: 'Git commands reference' },
            { name: 'Branch Generator', path: '/git/branch-generator', description: 'Create branch names' }
		],
		tips: ['Start with GitHub Flow (simple feature branches) if you represent a small team.']
    },
    'diff-viewer': {
        features: [
            'Side-by-side and Inline diff views',
            'Syntax highlighting',
            'Whitespace ignore option',
            'Line number alignment',
            'Large text support'
        ],
        useCases: [
			'Comparing two versions of a config file',
			'Reviewing code snippets before pasting',
			'Debugging generated output vs expected output'
		],
		concept: {
			title: 'Diffing',
			content: '<p>A <strong>Diff</strong> shows the difference between two pieces of text. It highlights added lines (green) and removed lines (red). Git uses diffs extensively to track changes.</p>'
		},
		examples: [
			{ label: 'Simple Change', code: '- color: red;\n+ color: blue;', isValid: true },
            { label: 'Addition', code: '+ New line added here.', isValid: true }
		],
		faqs: [
			{ question: 'What does @@ mean?', answer: 'It is the chunk header, showing the line numbers where the changes occurred in the original and new files.' },
			{ question: 'Why merge conflicts?', answer: 'When two people change the same lines in a file, Git cannot automatically decide which one to keep.' }
		],
		relatedTools: [
			{ name: 'Commit Diff', path: '/git/commit-diff', description: 'View commit changes' },
			{ name: 'Text Diff', path: '/text/diff', description: 'General text comparison' }
		],
		tips: ['Use "Ignore Whitespace" if the only changes are indentation fixes.']
    },
    'log-formatter': {
        features: [
            'Visual builder for `git log` formats',
            'Presets (One-line, Detailed, Graph)',
            'Color and placeholder customization',
			'Preview output instantly',
			'Copy ready-to-run command'
        ],
        useCases: [
			'Creating pretty git aliases',
			'Generating change reports',
			'Analyzing history visually in the terminal'
		],
		concept: {
			title: 'Git Log Formatting',
			content: '<p>The `git log` command supports powerful formatting options using the `--pretty=format:"..."` flag. You can control exactly what information is shown (hash, author, date, subject) and how it is colored.</p>'
		},
		examples: [
			{ label: 'One Line', code: 'git log --oneline', isValid: true },
			{ label: 'Custom', code: 'git log --pretty=format:"%h - %an, %ar : %s"', isValid: true }
		],
		faqs: [
			{ question: 'What is %h?', answer: 'The abbreviated commit hash.' },
			{ question: 'What is %an?', answer: 'The author name.' },
			{ question: 'What is --graph?', answer: 'It draws a text-based graphical representation of the commit history on the left side.' }
		],
		relatedTools: [
			{ name: 'Alias Generator', path: '/git/alias-generator', description: 'Save as alias' },
			{ name: 'Commit Validator', path: '/git/commit-validator', description: 'Check commit style' }
		],
		tips: ['Save your favorite format as an alias like `git lg` using the Alias Generator tool.']
    },
    'blame-explainer': {
        features: [
            'Parse and explain `git blame` output',
            'Identify author, date, and commit hash per line',
            'Visual breakdown of code history',
            'Link to explanation of blame concept'
        ],
        useCases: [
			'Understanding who wrote a specific line of code and when',
			'Debugging regressions by finding the changing commit',
			'Code archaeology'
		],
		concept: {
			title: 'Git Blame',
			content: '<p><code>git blame</code> (or verify/annotate) shows the last modification information for each line of a file. It helps trace back <em>why</em> a line was changed by looking at the associated commit message.</p>'
		},
		examples: [
			{ label: 'Command', code: 'git blame src/main.js', isValid: true }
		],
		faqs: [
			{ question: 'Is it to blame people?', answer: 'Ideally no :) It is for context. "Git Annotate" is a friendlier name for the same concept.' },
			{ question: 'Can it ignore whitespace?', answer: 'Yes, use `git blame -w` to ignore whitespace changes.' }
		],
		relatedTools: [
			{ name: 'Log Formatter', path: '/git/log-formatter', description: 'See history' },
			{ name: 'Diff Viewer', path: '/git/diff-viewer', description: 'See changes' }
		],
		tips: ['In many IDEs, there is a "Annotate" or "Blame" view integrated into the editor.']
    },
    'reset-helper': {
        features: [
            'Visual guide to Soft, Mixed, and Hard resets',
            'Interactive state simulation',
            'Generate safe reset commands',
            'Undo guide (Reflog)'
        ],
        useCases: [
			'Unstaging files',
			'Undoing the last commit but keeping changes',
			'Completely wiping local changes to match remote'
        ],
		concept: {
			title: 'Git Reset',
			content: '<p><strong>Git Reset</strong> moves the `HEAD` pointer to a specific state. It is powerful but can be destructive.</p><ul><li><strong>--soft:</strong> Moves HEAD, keeps staging and working directory (safest).</li><li><strong>--mixed:</strong> Moves HEAD, resets staging, keeps working directory (default).</li><li><strong>--hard:</strong> Moves HEAD, resets staging and working directory (destructive).</li></ul>'
		},
		examples: [
			{ label: 'Undo last commit (keep work)', code: 'git reset --soft HEAD~1', isValid: true },
			{ label: 'Unstage file', code: 'git reset HEAD <file>', isValid: true },
            { label: 'Hard Reset (Danger)', code: 'git reset --hard origin/main', isValid: true }
		],
		faqs: [
			{ question: 'Can I undo a hard reset?', answer: 'Sometimes! Check `git reflog` immediately. If the commit wasn\'t garbage collected, you can reset back to it.' },
			{ question: 'Difference vs Revert?', answer: '`reset` changes history (don\'t do on shared branches). `revert` creates a new commit that undoes changes (safe for shared branches).' }
		],
		relatedTools: [
			{ name: 'Rebase Helper', path: '/git/rebase-helper', description: 'Rebase guide' },
			{ name: 'Workflow', path: '/git/workflow', description: 'Git concepts' }
		],
		tips: ['Always run `git status` before resetting to know where you are.', 'Never `git reset --hard` unless you are 100% sure you don\'t need your local uncommitted changes.']
    },
	'rebase-helper': {
		features: [
			'Interactive guide to interactive rebase (`-i`)',
			'Visual explanation of squash, fixup, reword, drop',
			'Command generator for common rebase scenarios',
			'Conflict resolution tips'
		],
		useCases: [
			'Cleaning up local commit history before merging',
			'Updating a feature branch with latest main text',
			'Squashing "wip" commits'
		],
		concept: {
			title: 'Git Rebase',
			content: '<p><strong>Rebasing</strong> is the process of moving or combining a sequence of commits to a new base commit. Interactive rebase (`git rebase -i`) is a powerful tool to rewrite history by editing, reordering, or merging commits.</p>'
		},
		examples: [
			{ label: 'Interactive Rebase', code: 'git rebase -i HEAD~3', isValid: true },
			{ label: 'Rebase on main', code: 'git checkout feature\ngit rebase main', isValid: true }
		],
		faqs: [
			{ question: 'Rebase vs Merge?', answer: 'Merge preserves history exactly as it happened. Rebase creates a linear, clean history but rewrites commit hashes.' },
			{ question: 'Is it safe?', answer: 'Only rebase branches that *only you* are working on. Never rebase public/shared branches.' }
		],
		relatedTools: [
			{ name: 'Reset Helper', path: '/git/reset-helper', description: 'Undo changes' },
			{ name: 'Workflow', path: '/git/workflow', description: 'Branching strategies' }
		],
		tips: ['Use `fixup` during rebase to merge a commit into the previous one without keeping its log message.']
	},
	'config-generator': {
		features: [
			'Generate `git config` commands',
			'Global vs Local config selector',
			'Common settings (user, core, alias, color)',
			'Preview resulting .gitconfig file'
		],
		useCases: [
			'Setting up a new machine',
			'Configuring a specific repo with a different email',
			'Enabling helpful colors and behaviors'
		],
		concept: {
			title: 'Git Configuration',
			content: '<p>Git settings are stored in text files. <strong>System</strong> (all users), <strong>Global</strong> (current user), and <strong>Local</strong> (current repo). Local overrides global, which overrides system.</p>'
		},
		examples: [
			{ label: 'Set Identity', code: 'git config --global user.name "John Doe"\ngit config --global user.email john@example.com', isValid: true },
			{ label: 'Default Editor', code: 'git config --global core.editor "code --wait"', isValid: true }
		],
		faqs: [
			{ question: 'Where is the file?', answer: 'Global config is usually at `~/.gitconfig`.' },
			{ question: 'List all settings?', answer: 'Run `git config --list`.' }
		],
		relatedTools: [
			{ name: 'Alias Generator', path: '/git/alias-generator', description: 'Create aliases' },
			{ name: 'Gitignore', path: '/git/gitignore', description: 'Ignore files' }
		],
		tips: ['Set `init.defaultBranch` to `main` to stop creating `master` branches by default.']
	},
	'alias-generator': {
		features: [
			'Create custom short commands for Git',
			'Presets for popular aliases (co, br, st, lg)',
			'Shell command execution support (!)',
			'Instant copy to config format'
		],
		useCases: [
			'Typing less (efficiency)',
			'Creating complex compound commands',
			'fixing common typos (git statsu -> status)'
		],
		concept: {
			title: 'Git Aliases',
			content: '<p>Aliases allow you to define shortcuts for Git commands. They are stored in your `.gitconfig`. For example, mapping `co` to `checkout`.</p>'
		},
		examples: [
			{ label: 'Shortcuts', code: 'st = status\nco = checkout\nbr = branch', isValid: true },
			{ label: 'Complex', code: 'lg = log --graph --oneline --decorate --all', isValid: true }
		],
		faqs: [
			{ question: 'How to use?', answer: 'After setting `st = status`, you can just type `git st`.' },
			{ question: 'Can I verify?', answer: 'Run `git config --global alias.st` to see if it is set.' }
		],
		relatedTools: [
			{ name: 'Config Generator', path: '/git/config-generator', description: 'General config' },
			{ name: 'Log Formatter', path: '/git/log-formatter', description: 'Format logs' }
		],
		tips: ['Don\'t over-alias to the point you forget the real commands!']
	},
	'readme-generator': {
		features: [
			'Visual README.md builder',
			'Drag-and-drop sections (Title, Badges, Install, Usage)',
			'Preset templates (Library, App, backend)',
			'Live Markdown preview',
            'Emoji and Badge picker'
		],
		useCases: [
			'Creating a professional landing page for your repo',
			'Documenting API usage',
			'Providing installation instructions'
		],
		concept: {
			title: 'README.md',
			content: '<p>The README is the first thing people see when they visit your repository. A good README explains <strong>what</strong> the project does, <strong>why</strong> it is useful, and <strong>how</strong> to get started.</p>'
		},
		examples: [
			{ label: 'Header', code: '# Project Name\n> A short description.', isValid: true },
			{ label: 'Badges', code: '![License](https://img.shields.io/badge/license-MIT-blue)', isValid: true }
		],
		faqs: [
			{ question: 'What format is it?', answer: 'Usually Markdown (.md), but reStructuredText (.rst) is also supported by GitHub.' },
			{ question: 'Are badges dynamic?', answer: 'Yes, if you use a service like Shields.io, they can show live build status or version numbers.' }
		],
		relatedTools: [
			{ name: 'License Picker', path: '/git/license-picker', description: 'Add a license' },
			{ name: 'Gitignore', path: '/git/gitignore', description: 'Exclude files' }
		],
		tips: ['Include screenshots or GIFs! They make a huge difference in engagement.']
	},
	'license-picker': {
		features: [
			'Compare popular licenses (MIT, Apache, GPL)',
			'Plain English summary of permissions, conditions, and limitations',
			'One-click copy of full license text',
			'Recommendation wizard'
		],
		useCases: [
			'Open sourcing a new private project',
			'Understanding compatibility between libraries',
			'Ensuring legal safety for your code'
		],
		concept: {
			title: 'Open Source Licenses',
			content: '<p>A license tells others what they can and cannot do with your code. Without a license, the default copyright laws apply, meaning no one can use, modify, or distribute your work.</p>'
		},
		examples: [
			{ label: 'MIT', code: 'Permissive. Do whatever you want, just keep the copyright notice.', isValid: true },
			{ label: 'GPLv3', code: 'Copyleft. If you use this, your project must also be open source (GPL).', isValid: true }
		],
		faqs: [
			{ question: 'Is MIT same as Apache?', answer: 'Similar, but Apache includes an explicit grant of patent rights.' },
			{ question: 'What is Unlicense?', answer: 'Public domain dedication. You waive all copyright.' }
		],
		relatedTools: [
			{ name: 'README Generator', path: '/git/readme-generator', description: 'Project docs' },
			{ name: 'Gitignore', path: '/git/gitignore', description: 'File exclusion' }
		],
		tips: ['If you don\'t care, use MIT. It is the most common and permissive standard.']
	},
	'secrets-scanner': {
		features: [
			'Scan text for common API keys (AWS, Stripe, Google, etc.)',
			'Regex-based detection patterns',
			'Client-side only (secrets never leave browser)',
			'Risk level assessment'
		],
		useCases: [
			'Sanitizing code snippets before sharing online',
			'Checking a file before committing to a public repo',
			'Auditing pasted configuration'
		],
		concept: {
			title: 'Secret Leaks',
			content: '<p>Accidentally committing secrets (API keys, passwords, tokens) to git is a major security risk. Once pushed, it is in the history forever, even if you delete the file later. You must rotate compromised keys immediately.</p>'
		},
		examples: [
			{ label: 'AWS Key', code: 'AKIAIOSFODNN7EXAMPLE', isValid: false },
			{ label: 'Safe Variable', code: 'const apiKey = process.env.API_KEY', isValid: true }
		],
		faqs: [
			{ question: 'Does this remove them?', answer: 'No, this tool detects them so you can remove or mock them manually.' },
			{ question: 'Is it safe to paste here?', answer: 'Yes, this tool runs entirely in your browser. No data is sent to any server.' }
		],
		relatedTools: [
			{ name: 'Gitignore', path: '/git/gitignore', description: 'Prevent tracking' },
			{ name: 'Misconfig Detector', path: '/security/misconfig', description: 'Security audit' }
		],
		tips: ['Use `.env` files and add them to `.gitignore`. Never hardcode secrets.']
	},
	'large-files': {
		features: [
			'Detect files exceeding Git limits (100MB)',
			'Scan directory structure (simulated or drag-drop)',
			'Git LFS recommendations',
			'Size formatting'
		],
		useCases: [
			'Pre-commit check for large assets (videos, datasets)',
			'Cleaning up a repository',
			'Deciding which files to ignore'
		],
		concept: {
			title: 'Large Files in Git',
			content: '<p>Git is not designed for large binary files. GitHub blocks files larger than 100MB. For large assets, use <strong>Git LFS</strong> (Large File Storage), which stores pointers in the repo and the actual data elsewhere.</p>'
		},
		examples: [
			{ label: 'Video.mp4 (200MB)', code: 'Suggests: Git LFS', isValid: false },
			{ label: 'Script.js (5KB)', code: 'OK', isValid: true }
		],
		faqs: [
			{ question: 'What is Git LFS?', answer: 'An extension that replaces large files with text pointers inside Git, while storing the file contents on a remote server.' },
			{ question: 'Can I remove a large file from history?', answer: 'Yes, but it is effectively rewriting history. Tools like `git-filter-repo` or BFG Repo-Cleaner are simpler than standard git commands.' }
		],
		relatedTools: [
			{ name: 'Gitignore', path: '/git/gitignore', description: 'Ignore files' },
			{ name: 'Data Size Converter', path: '/convert/data-size', description: 'Check sizes' }
		],
		tips: ['Don\'t commit `node_modules` or build artifacts. That is the #1 cause of bloat.']
	}
};

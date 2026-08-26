import { mount, unmount } from 'svelte';
import type { EditorView, Panel, ViewUpdate } from '@codemirror/view';
import { runScopeHandlers } from '@codemirror/view';
import {
	SearchQuery,
	getSearchQuery,
	setSearchQuery,
	findNext,
	findPrevious,
	replaceNext,
	replaceAll,
	closeSearchPanel
} from '@codemirror/search';
import AppIcon from './AppIcon.svelte';

const ICON_BTN =
	'btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg text-base-content';
const TEXT_BTN = 'btn btn-ghost h-8 min-h-8 rounded-lg px-3 text-base-content';

function mountIcon(target: HTMLElement, name: string) {
	return mount(AppIcon, { target, props: { name, class: 'size-4' } });
}

function commitQuery(
	view: EditorView,
	search: string,
	replace: string,
	caseSensitive: boolean,
	regexp: boolean,
	wholeWord: boolean
) {
	const query = new SearchQuery({ search, replace, caseSensitive, regexp, wholeWord });
	if (!query.eq(getSearchQuery(view.state))) {
		view.dispatch({ effects: setSearchQuery.of(query) });
	}
}

export function createSearchPanel(view: EditorView): Panel {
	const icons: Array<{ unmount: () => void }> = [];
	const readOnly = view.state.readOnly;

	const root = document.createElement('div');
	root.className = 'onedev-cm-search';
	root.addEventListener('keydown', (event) => {
		if (runScopeHandlers(view, event, 'search-panel')) {
			event.preventDefault();
		} else if (event.key === 'Enter' && event.target === findField) {
			event.preventDefault();
			(event.shiftKey ? findPrevious : findNext)(view);
		} else if (event.key === 'Enter' && event.target === replaceField) {
			event.preventDefault();
			replaceNext(view);
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closeSearchPanel(view);
		}
	});

	function labeledField(labelText: string, input: HTMLInputElement) {
		const label = document.createElement('label');
		label.className = 'onedev-cm-search-field';
		const span = document.createElement('span');
		span.textContent = labelText;
		label.append(span, input);
		return label;
	}

	function iconButton(icon: string, aria: string, onClick: () => void) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = ICON_BTN;
		btn.setAttribute('aria-label', aria);
		btn.title = aria;
		btn.addEventListener('click', onClick);
		const mounted = mountIcon(btn, icon);
		icons.push({ unmount: () => unmount(mounted) });
		return btn;
	}

	function textButton(label: string, onClick: () => void) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = TEXT_BTN;
		btn.textContent = label;
		btn.addEventListener('click', onClick);
		return btn;
	}

	const initial = getSearchQuery(view.state);

	const findField = document.createElement('input');
	findField.type = 'search';
	findField.placeholder = 'Find';
	findField.value = initial.search;
	findField.setAttribute('main-field', 'true');
	findField.autocomplete = 'off';
	findField.spellcheck = false;

	const replaceField = document.createElement('input');
	replaceField.type = 'text';
	replaceField.placeholder = 'Replace';
	replaceField.value = initial.replace;
	replaceField.autocomplete = 'off';
	replaceField.spellcheck = false;

	let caseSensitive = initial.caseSensitive;
	let regexp = initial.regexp;
	let wholeWord = initial.wholeWord;

	const caseBtn = iconButton('case-sensitive', 'Match case', () => {
		caseSensitive = !caseSensitive;
		syncToggles();
		syncQuery();
	});
	const regexBtn = iconButton('regex', 'Regular expression', () => {
		regexp = !regexp;
		syncToggles();
		syncQuery();
	});
	const wordBtn = iconButton('whole-word', 'Match whole word', () => {
		wholeWord = !wholeWord;
		syncToggles();
		syncQuery();
	});

	function syncToggles() {
		caseBtn.setAttribute('aria-pressed', String(caseSensitive));
		regexBtn.setAttribute('aria-pressed', String(regexp));
		wordBtn.setAttribute('aria-pressed', String(wholeWord));
	}

	function syncQuery() {
		commitQuery(view, findField.value, replaceField.value, caseSensitive, regexp, wholeWord);
	}

	findField.addEventListener('input', syncQuery);
	replaceField.addEventListener('input', syncQuery);

	root.append(
		labeledField('Find', findField),
		iconButton('chevron-up', 'Previous match', () => findPrevious(view)),
		iconButton('chevron-down', 'Next match', () => findNext(view)),
		caseBtn,
		regexBtn,
		wordBtn
	);

	if (!readOnly) {
		root.append(
			labeledField('Replace', replaceField),
			textButton('Replace', () => replaceNext(view)),
			textButton('Replace all', () => replaceAll(view))
		);
	}

	root.append(iconButton('x', 'Close search', () => closeSearchPanel(view)));
	syncToggles();

	return {
		dom: root,
		top: true,
		mount() {
			findField.select();
		},
		update(update: ViewUpdate) {
			for (const tr of update.transactions) {
				for (const effect of tr.effects) {
					if (effect.is(setSearchQuery)) {
						const q = effect.value;
						if (findField.value !== q.search) findField.value = q.search;
						if (replaceField.value !== q.replace) replaceField.value = q.replace;
						caseSensitive = q.caseSensitive;
						regexp = q.regexp;
						wholeWord = q.wholeWord;
						syncToggles();
					}
				}
			}
		},
		destroy() {
			for (const icon of icons) icon.unmount();
		}
	};
}

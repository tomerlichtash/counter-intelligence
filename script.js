let NODES = [];

const CSS_COUNTER = 'my-counter';
const COUNTER_TYPES = ['decimal','decimal-leading-zero','arabic-indic','armenian','upper-armenian','lower-armenian','bengali','cambodian','khmer','devanagari','georgian','gujarati','gurmukhi','hebrew','kannada','lao','malayalam','mongolian','myanmar','oriya','persian','lower-roman','upper-roman','telugu','thai','tibetan'];
const OFFSET_INPUT_ID =  'offsetInput';
const RANGE_INPUT_ID =  'rangeInput';
const LANGUAGE_INPUT_ID =  'languageInput';

const UI = {
	COUNTER_RESET_NODE: document.createElement('style'),
	COUNTER_TYPE_NODE: document.createElement('style'),
	ROOT_NODE: document.querySelector('.items'),
	rangeInput: document.querySelector('#count'),
	offsetInput: document.querySelector('#offset'),
	languageInput: document.querySelector('#language')
};

const getInputValue = name => Number(UI[name].value);
const onOffsetChange = cssCounterRef => resetAll(getInputValue(OFFSET_INPUT_ID), cssCounterRef);
const onCountChange = cssCounterRef => resetAll(getInputValue(RANGE_INPUT_ID), cssCounterRef);

const random = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);
const getRandomLang = () => COUNTER_TYPES[random(0, COUNTER_TYPES.length - 1)];
const getRandomValue = (offset, range) => random(-40, 40);

const getNodes = () => Array.prototype.slice.call(NODES);
const addNode = (node) => {
	NODES.push(node);
	UI.ROOT_NODE.appendChild(node);
};
const createNode = () => {
	const el = document.createElement('label');
	const input = document.createElement('input');
	const span = document.createElement('span');
	span.className = 'content';
	input.type = 'checkbox';
	input.className = 'state';
	el.className = 'item';
	el.appendChild(input);
	el.appendChild(span);
	return el;
};

const getUrlParam = (name, url) => {
	if (!url) url = location.href;
	name = name.replace(/[[]/,'[').replace(/[\]]/,']');
	const s = '[\\?&]' + name + '=([^&#]*)';
	const rgx = new RegExp(s);
	const res = rgx.exec(url);
	return res == null ? null : res[1];
};
const getLangVal = param => param || getRandomLang();
const getParams = (offsetVal, rangeVal) => {
	const offset = Number(offsetVal) || getRandomValue();
	const range = Number(rangeVal) || getRandomValue();
	if (range <= 0) {
		return getParams();
	} else if (offset >= range) {
		return getParams(range, offset);
	}
	const language = getLangVal(getUrlParam('lang'));
	return {offset, range, language};
};

const resetCSSCounter = (offset, counterName) => UI.COUNTER_RESET_NODE.innerHTML = `body{counter-reset: ${counterName} ${offset}}`;
const setCounterLanguage = language => document.querySelector('body').setAttribute('data-list-type', language);
const resetAll = (cssResetVal, cssCounterRef) => {
	getNodes().map(node => UI.ROOT_NODE.removeChild(node));
	resetCSSCounter(cssResetVal, cssCounterRef);
	NODES = [];
	render();
};

const render = () => Array(getInputValue(RANGE_INPUT_ID) - getInputValue(OFFSET_INPUT_ID)).fill().map((n, index) => addNode(createNode(index)));
const renderTypeSelector = language => COUNTER_TYPES.map(type => UI[LANGUAGE_INPUT_ID].appendChild(getOptionDef(type, language)));
const getOptionDef = (value, language) => Object.assign(document.createElement('option'), {
	value,
	innerHTML: value.toUpperCase(),
	selected: value === language
});

const init = (cssCounterRef, counterTypes) => {
	const offset = getUrlParam('offset');
	const range = getUrlParam('range');
	const params = getParams(offset, range);

	UI[RANGE_INPUT_ID].addEventListener('change', () => onCountChange(cssCounterRef));
	UI[OFFSET_INPUT_ID].addEventListener('change', () => onOffsetChange(cssCounterRef));
	UI[LANGUAGE_INPUT_ID].addEventListener('change', evt => setCounterLanguage(evt.target.value));

	UI[OFFSET_INPUT_ID].value = params.offset;
	UI[RANGE_INPUT_ID].value = params.range;

	resetCSSCounter(params.offset, cssCounterRef);
	setCounterLanguage(params.language);
	renderTypeSelector(params.language);
	render();
};

document.body.appendChild(UI.COUNTER_RESET_NODE);
document.body.appendChild(UI.COUNTER_TYPE_NODE);

init(CSS_COUNTER, COUNTER_TYPES);
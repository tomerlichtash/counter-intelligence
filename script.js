const CSS_COUNTER_RESET_ELEMENT = document.createElement('style');
const CSS_COUNTER_TYPE_ELEMENT = document.createElement('style');
document.body.appendChild(CSS_COUNTER_RESET_ELEMENT);
document.body.appendChild(CSS_COUNTER_TYPE_ELEMENT);

// states
let nodes = [];

// consts
const ROOT_NODE = document.querySelector('.items');
const CSS_COUNTER = 'my-counter';
// const DEFAULT_COUNTER_TYPE = 'hebrew';
const COUNTER_TYPES = ['decimal','decimal-leading-zero','arabic-indic','armenian','upper-armenian','lower-armenian','bengali','cambodian','khmer','devanagari','georgian','gujarati','gurmukhi','hebrew','kannada','lao','malayalam','mongolian','myanmar','oriya','persian','lower-roman','upper-roman','telugu','thai','tibetan'];

const UIParts = {
	rangeInput: document.querySelector('#count'),
	offsetInput: document.querySelector('#offset'),
	languageInput: document.querySelector('#language')
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
const addNode = (node) => {
	nodes.push(node);
	ROOT_NODE.appendChild(node);
};

const getUrlParam = (name, url) => {
	if (!url) {
    url = location.href;
  }
	name = name.replace(/[[]/,'[').replace(/[\]]/,']');
	const s = '[\\?&]' + name + '=([^&#]*)';
	const rgx = new RegExp(s);
	const res = rgx.exec(url);
	return res == null ? null : res[1];
};
const getParamVal = (param) => {
  if (!param) {
    return randomize();
  }
  return Number(param);
};

const getParams = (o, r) => {
  const offsetParam = o || getUrlParam('offset');
  const rangeParam = r || getUrlParam('range');

  const offset = getParamVal(offsetParam);
  const range = getParamVal(rangeParam);

  if (offset - range === 0) {
    return getParams();
  } else if (offset >= range) {
    return getParams(range, offset);
  }

  const langParam = getUrlParam('lang');
  const language = langParam ? langParam : randomizeLang();
  
  return {offset, range, language};
};

const randomize = (offset, range) => {
  const min = Math.ceil(offset) || Math.floor(Math.random() * 100);
  const max = Math.floor(range) || Math.floor(Math.random() * 100);
  return Math.floor(Math.random() * (max - min + 1)) + 1;
};

const randomizeLang = () => {
  return COUNTER_TYPES[Math.floor(Math.random(COUNTER_TYPES.length) * COUNTER_TYPES.length)];
};

const bindUI = (UI, cssCounterRef, params) => {
	UI.rangeInput.addEventListener('change', () => onCountChange(cssCounterRef));
	UI.offsetInput.addEventListener('change', () => onOffsetChange(cssCounterRef));
  UI.languageInput.addEventListener('change', (evt) => setCounterLanguage(evt.target.value));
  UIParts.offsetInput.value = params.offset;
  UIParts.rangeInput.value = params.range;
};

// resets
const resetCSSCounter = (offset, counterName) => {
	CSS_COUNTER_RESET_ELEMENT.innerHTML = `body{counter-reset: ${counterName} ${offset}}`;
};
const setCounterLanguage = (language) => {
	document.querySelector('body').setAttribute('data-list-type', language);
};
const resetAll = (cssResetVal, cssCounterRef) => {
	getNodes().map((node) => ROOT_NODE.removeChild(node));
	resetCSSCounter(cssResetVal, cssCounterRef);
  nodes = [];
  return false;
};
const resetGrid = (isChecked) => {
	getInputs().map((input) => input.checked = isChecked || false);
};

// getters
const getNodes = () => {
	return Array.prototype.slice.call(nodes);
};
const getInputs = () => {
	return getNodes().map(label => label.querySelector('input[type="checkbox"]'));
};
const getOffsetValue = () => {
	return Number(UIParts.offsetInput.value);
};
const getCountValue = () => {
	return Number(UIParts.rangeInput.value);
};

// events
const onOffsetChange = (cssCounterRef) => {
	if (getCountValue() < getOffsetValue()) {
		return resetAll(-1);
	}
	resetAll(getOffsetValue(), cssCounterRef);
	render();
};
const onCountChange = (cssCounterRef) => {
	resetAll(getOffsetValue(), cssCounterRef);
	render();
};

// render
const renderTypeSelector = (language) => {
	return COUNTER_TYPES.map(type => {
		const option = document.createElement('option');
		option.value = type;
		option.innerHTML = type.toUpperCase();
		option.selected = type === language;
		UIParts.languageInput.appendChild(option);
	});
};

const render = () => {
	const nodeCount = getCountValue() - getOffsetValue();
	if (nodeCount < 0) resetGrid(false);
	Array(nodeCount).fill().map((n, index) => addNode(createNode(index)));
};

const init = (cssCounterRef) => {
  const params = getParams();
	return new Promise(resolve => {
		bindUI(UIParts, cssCounterRef, params);
    resetCSSCounter(params.offset, cssCounterRef);
		setCounterLanguage(params.language);
    renderTypeSelector(params.language);
		render();
		resolve();
	});
};

init(CSS_COUNTER);
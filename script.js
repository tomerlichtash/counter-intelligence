const CSS_COUNTER = 'my-counter';
const rootNode = document.querySelector('.labels');

let nodes = [];
let counterResetStyleTag = document.createElement('style');
let listStyleTypeTag = document.createElement('style');
let defaultCounterStyleType = 'hebrew';
let playState = null;

// url params
const getUrlParam = (name, url) => {
	if (!url) url = location.href;
	name = name.replace(/[[]/,'[').replace(/[\]]/,']');
	const regexS = '[\\?&]' + name + '=([^&#]*)';
	const regex = new RegExp(regexS);
	const results = regex.exec(url);
	return results == null ? null : results[1];
};

const hasUrlParams = () => {
	return typeof startAt == 'number' && typeof endAt == 'number' && typeof counterStyleType == 'string';
};

const startAt = Number(getUrlParam('startAt'));
const endAt = Number(getUrlParam('endAt'));
const customCounterStyleType = getUrlParam('counterStyleType');

// ui dom refs
const countInput = document.querySelector('#count');
const offsetInput = document.querySelector('#offset');
const hideBtn = document.querySelector('#hide');
const showBtn = document.querySelector('#show');
const randBtn = document.querySelector('#rand');
const playBtn = document.querySelector('#play');
const pauseBtn = document.querySelector('#pause');
const counterTypeSelector = document.querySelector('#counterTypeSelector');
const status = document.querySelector('#status');

// ui events
hideBtn.addEventListener('click', () => resetGrid(false));
showBtn.addEventListener('click', () => resetGrid(true));
randBtn.addEventListener('click', () => setRandomGridValues());
playBtn.addEventListener('click', () => playAnimation());
pauseBtn.addEventListener('click', () => pauseAnimation());

const counterTypes = ['decimal','decimal-leading-zero','arabic-indic','armenian','upper-armenian','lower-armenian','bengali','cambodian','khmer','cjk-decimal','devanagari','georgian','gujarati','gurmukhi','hebrew','kannada','lao','malayalam','mongolian','myanmar','oriya','persian','lower-roman','upper-roman','tamil','telugu','thai','tibetan'];

const playAnimation = () => {
	playState = true;
	animate(CSS_COUNTER);
};

const pauseAnimation = () => {
	playState = false;
};

// list-style-type selector
const renderTypeSelector = (defaultStyleType) => {
	return counterTypes.map(type => {
		const option = document.createElement('option');
		option.value = type;
		option.innerHTML = type.toUpperCase();
		option.selected = type === defaultStyleType;
		counterTypeSelector.appendChild(option);
	});
};

// inputs
countInput.addEventListener('change', () => onCountChange());
offsetInput.addEventListener('change', () => onOffsetChange());
counterTypeSelector.addEventListener('change', (evt) => setCounterType(evt.target.value));

// css counter
document.body.appendChild(counterResetStyleTag);
document.body.appendChild(listStyleTypeTag);

const setStatus = (msg) => {
	status.innerHTML = msg;
};

const createNode = () => {
	const el = document.createElement('label');
	const input = document.createElement('input');
	const span = document.createElement('span');
	input.type = 'checkbox';
	input.checked = true;
	el.appendChild(input);
	el.appendChild(span);
	return el;
};

const addNode = (node) => {
	nodes.push(node);
	document.querySelector('.labels').appendChild(node);
};

const getNodes = () => {
	return Array.prototype.slice.call(nodes);
};

const getInputs = () => {
	return getNodes().map(label => label.querySelector('input[type="checkbox"]'));
};

const resetGrid = (isChecked) => {
	getInputs().map((input) => input.checked = isChecked || false);
	updateStatus();
};

const setRandomGridValues = () => {
	const inputs = getInputs();
	const randVals = inputs.map(() => Math.floor(Math.random() * inputs.length) % 2); 
	resetGrid();
	randVals.map((r, index) => getInputs()[index].checked = r);
	updateStatus();
};

const updateStatus = () => {
	const inputs = getInputs();
	const current = inputs.filter((input) => input.checked);
	setStatus(`${current.length}/${inputs.length}`);
};

const getOffsetValue = () => {
	return Number(offsetInput.value);
};

const getCountValue = () => {
	return Number(countInput.value);
};

const resetCSSCounter = (limit, counterName) => {
	counterResetStyleTag.innerHTML = `body{counter-reset: ${counterName} ${limit}}`;
};

const resetAll = (cssResetVal) => {
	const localNodes = rootNode.querySelectorAll('label');
	Array.prototype.slice.call(localNodes).map((node) => rootNode.removeChild(node));
	resetCSSCounter(cssResetVal, CSS_COUNTER);
	nodes = [];
};

const onOffsetChange = () => {
	if (getCountValue() < getOffsetValue()) {
		resetAll(-1);
		return false;
	}
	resetAll(getOffsetValue());
	render();
};

const onCountChange = () => {
	resetAll(getOffsetValue());
	render();
};

const setCounterType = (counterType) => {
	document.querySelector('body').setAttribute('data-list-type', counterType);
};

const resetValues = (count, offset) => {
	countInput.value = count;
	offsetInput.value = offset;
};

const render = () => {
	const nodeCount = getCountValue() - getOffsetValue();
	if (nodeCount < 0) resetGrid(false);
	Array(nodeCount).fill().map((n, index) => addNode(createNode(index)));
	updateStatus();
};

const animate = () => {
	return new Promise(resolve =>
		setTimeout(() => {
			const checkedNodes = getNodes().filter(node => node.querySelector('input').checked);
			if (!checkedNodes.length || !playState) {
				playState = false;
				resolve({playState});
				return playState;
			}

			const randVal = Math.random();
			const randIndex = Math.floor(randVal * checkedNodes.length);
      
			const randomEl = checkedNodes[randIndex];
			randomEl.querySelector('input');
      
			randomEl.setAttribute('data-tracked', 'tracked');
			setTimeout(() => randomEl.removeAttribute('data-tracked'), 1450);
      
			animate();
			resolve();
		}, 50)
	);
};

const shuffleGrid = () => {
	setRandomGridValues();
	return new Promise(resolve => {
		setTimeout(() => {
			shuffleGrid();
			resolve();
		}, Math.random() * 5000);
	});
};

const init = (cssCounterRef, styleType) => {
	resetCSSCounter(getOffsetValue(), cssCounterRef);
	setCounterType(styleType);
	renderTypeSelector(styleType);
  
	if (hasUrlParams()) {
		resetValues(endAt, startAt);
	}

	render();
	shuffleGrid();
	playAnimation();
};

init(CSS_COUNTER, customCounterStyleType || defaultCounterStyleType);
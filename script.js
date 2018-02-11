const getUrlParam = (name, url) => {
	if (!url) url = location.href;
	name = name.replace(/[[]/,'[').replace(/[\]]/,']');
	const regexS = '[\\?&]' + name + '=([^&#]*)';
	const regex = new RegExp(regexS);
	const results = regex.exec(url);
	return results == null ? null : results[1];
};

const hasUrlParams = () => {
	return typeof startAt == 'number' && typeof endAt == 'number' && typeof customCounterStyleType == 'string';
};

const bindUI = (UI, cssCounterRef) => {
	UI.hideBtn.addEventListener('click', () => resetGrid(false));
	UI.showBtn.addEventListener('click', () => resetGrid(true));
	UI.randBtn.addEventListener('click', () => setRandomGridValues());
	UI.playBtn.addEventListener('click', () => playAnimation(cssCounterRef));
	UI.pauseBtn.addEventListener('click', () => setPlayState(false));
	UI.countInput.addEventListener('change', () => onCountChange(cssCounterRef));
	UI.offsetInput.addEventListener('change', () => onOffsetChange(cssCounterRef));
	UI.counterTypeSelector.addEventListener('change', (evt) => setCounterType(evt.target.value));
};

const setPlayState = (state) => {
	playState = state;
	document.querySelector('body').setAttribute('data-play-state', state ? 'play' : 'pause');
	return playState;
};

const playAnimation = (counterRef) => {
	setPlayState(true);
	animate(counterRef).then(() => shuffleGrid());
};

const renderTypeSelector = (defaultStyleType) => {
	return counterTypes.map(type => {
		const option = document.createElement('option');
		option.value = type;
		option.innerHTML = type.toUpperCase();
		option.selected = type === defaultStyleType;
		UIParts.counterTypeSelector.appendChild(option);
	});
};

const setStatus = (msg) => {
	status.innerHTML = msg;
};

const createNode = () => {
	const el = document.createElement('label');
	const input = document.createElement('input');
	const span = document.createElement('span');
  
	input.type = 'checkbox';
	input.checked = Math.random() > 0.5;
  
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
	return Number(UIParts.offsetInput.value);
};

const getCountValue = () => {
	return Number(UIParts.countInput.value);
};

const resetCSSCounter = (offset, counterName) => {
	counterResetStyleTag.innerHTML = `body{counter-reset: ${counterName} ${offset}}`;
};

const resetAll = (cssResetVal, cssCounterRef) => {
	getNodes().map((node) => rootNode.removeChild(node));
	resetCSSCounter(cssResetVal, cssCounterRef);
	nodes = [];
};

const onOffsetChange = (cssCounterRef) => {
	if (getCountValue() < getOffsetValue()) {
		resetAll(-1);
		return false;
	}
	resetAll(getOffsetValue(), cssCounterRef);
	render();
};

const onCountChange = (cssCounterRef) => {
	resetAll(getOffsetValue(), cssCounterRef);
	render();
};

const setCounterType = (counterType) => {
	document.querySelector('body').setAttribute('data-list-type', counterType);
};

const resetValues = (count, offset) => {
	UIParts.countInput.value = count;
	UIParts.offsetInput.value = offset;
};

const render = () => {
	const nodeCount = getCountValue() - getOffsetValue();
	if (nodeCount < 0) resetGrid(false);
	Array(Math.abs(nodeCount)).fill().map((n, index) => addNode(createNode(index)));
	updateStatus();
};

const getCheckedNodes = () => {
	return getNodes().filter(node => node.querySelector('input').checked);
};

const animate = () => {
	return new Promise(resolve =>
		setTimeout(() => {
			const checkedNodes = getCheckedNodes();
      
			if (!checkedNodes.length || !playState) {
				resolve(setPlayState(false));
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
	return new Promise(resolve => {
		setTimeout(() => {
      if (!playState) {
        resolve();
        return false;
      }
			setRandomGridValues();
			shuffleGrid();
			resolve();
		}, Math.random() * 5000);
	});
};

const init = (cssCounterRef, styleType) => {
	bindUI(UIParts, cssCounterRef);

	if (hasUrlParams()) {
		resetValues(endAt, startAt);
	}

	resetCSSCounter(Number(getUrlParam('startAt')) || getOffsetValue(), cssCounterRef);
	setCounterType(styleType);

	renderTypeSelector(styleType);
	render();

	playAnimation(cssCounterRef);
};

const UIParts = {
	countInput: document.querySelector('#count'),
	offsetInput: document.querySelector('#offset'),
	hideBtn: document.querySelector('#hide'),
	showBtn: document.querySelector('#show'),
	randBtn: document.querySelector('#rand'),
	playBtn: document.querySelector('#play'),
	pauseBtn: document.querySelector('#pause'),
	counterTypeSelector: document.querySelector('#counterTypeSelector'),
	status: document.querySelector('#status')
};

// consts
const CSS_COUNTER = 'my-counter';
const rootNode = document.querySelector('.labels');
const counterTypes = ['decimal','decimal-leading-zero','arabic-indic','armenian','upper-armenian','lower-armenian','bengali','cambodian','khmer','cjk-decimal','devanagari','georgian','gujarati','gurmukhi','hebrew','kannada','lao','malayalam','mongolian','myanmar','oriya','persian','lower-roman','upper-roman','tamil','telugu','thai','tibetan'];
const defaultCounterStyleType = 'hebrew';

// style tags
const counterResetStyleTag = document.createElement('style');
const listStyleTypeTag = document.createElement('style');
document.body.appendChild(counterResetStyleTag);
document.body.appendChild(listStyleTypeTag);

// url params
const startAt = Number(getUrlParam('startAt'));
const endAt = Number(getUrlParam('endAt'));
const customCounterStyleType = getUrlParam('counterStyleType');

// states
let nodes = [];
let playState = null;

init(CSS_COUNTER, customCounterStyleType || defaultCounterStyleType);
const CSS_COUNTER = 'my-counter';

let nodes = [];
let counterResetStyleTag = document.createElement('style');
let defaultCounterStyleType = 'hebrew';

// url params
const getUrlParam = (name, url) => {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = '[\\?&]' + name + '=([^&#]*)';
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  return results == null ? null : results[1];
}

const hasUrlParams = () => {
  return typeof startAt == 'number' && typeof endAt == 'number' && typeof counterStyleType == 'string'
}

const startAt = Number(getUrlParam('startAt'));
const endAt = Number(getUrlParam('endAt'));
const counterStyleType = getUrlParam('counterStyleType');

// ui dom refs
const rootNode = document.querySelector('body');
const countInput = document.querySelector('#count');
const offsetInput = document.querySelector('#offset');
const hideBtn = document.querySelector('#hide');
const showBtn = document.querySelector('#show');
const randBtn = document.querySelector('#rand');
const resetBtn = document.querySelector('#reset');
const counterTypeSelector = document.querySelector('#counterTypeSelector');
const status = document.querySelector('#status');

// ui events
hideBtn.addEventListener('click', (evt) => resetGrid(false));
showBtn.addEventListener('click', (evt) => resetGrid(true));
randBtn.addEventListener('click', (evt) => setRandomGridValues(getRandomInput()));

const counterTypes = ['decimal','decimal-leading-zero','arabic-indic','armenian','upper-armenian','lower-armenian','bengali','cambodian','khmer','cjk-decimal','devanagari','georgian','gujarati','gurmukhi','hebrew','kannada','lao','malayalam','mongolian','myanmar','oriya','persian','lower-roman','upper-roman','tamil','telugu','thai','tibetan']

// list-style-type selector
const renderTypeSelector = (defaultStyleType) => {
  return counterTypes.map(type => {
    const option = document.createElement('option');
    option.value = type;
    option.innerHTML = type.toUpperCase();
    option.selected = type === defaultStyleType;
    counterTypeSelector.appendChild(option)
  });
}

// inputs
countInput.addEventListener('change', (evt) => onCountChange())
offsetInput.addEventListener('change', (evt) => onOffsetChange())
counterTypeSelector.addEventListener('change', (evt) => dangerouslySetCounterType(evt))

// css counter
document.body.appendChild(counterResetStyleTag);

const createNode = (index) => {
  const el = document.createElement('label');
  const input = document.createElement('input')
  const span = document.createElement('span');
  input.type = 'checkbox';
  input.checked = false;
  input.addEventListener('change', () => updateStatus())
  el.appendChild(input);
  el.appendChild(span);
  el.setAttribute('data-computed-index', index);
  return el;
}

const addNode = (node) => {
  nodes.push(node);
  document.body.appendChild(node);
}

const getNodes = () => {
  return Array.prototype.slice.call(nodes);
}

const getInputs = () => {
  return getNodes().map(label => label.querySelector('input[type="checkbox"]'));
}

const getRandomInput = () => {
  const inputs = getInputs();
  return inputs.map((d, index) => Math.floor(Math.random() * inputs.length) % 2); 
}

const resetGrid = (isChecked) => {
  getInputs().map((input, index) => input.checked = isChecked || false);
  updateStatus();
}

const destroyAll = () => {
  getNodes().map((d, index) => rootNode.removeChild(d));
  items = [];
}

const setRandomGridValues = (vals) => {
  resetGrid();
  vals.map((r, index) => getInputs()[index].checked = r > 0);
  updateStatus();
}

const updateStatus = () => {
  const current = getInputs().filter((d, index) => d.checked);
  status.innerHTML = `${current.length}/${getInputs().length}`;
}

const getOffsetValue = () => {
  return Number(offsetInput.value);
}

const getCountValue = () => {
  return Number(countInput.value);
}

const resetCSSCounter = (limit, counterName) => {
  counterResetStyleTag.innerHTML = `body{counter-reset: ${counterName} ${limit}}`;
}

const resetAll = (cssResetVal) => {
  destroyAll();
  resetCSSCounter(cssResetVal, CSS_COUNTER);
}

const onOffsetChange = () => {
  if (getCountValue() < getOffsetValue()) {
    resetAll(-1);
    return false;
  }
  resetAll();
  render();
}

const onCountChange = () => {
  resetAll(getOffsetValue());
  render();
}

const dangerouslySetCounterType = (evt) => {
  document.styleSheets[1].cssRules[21].style.content = `counter(${CSS_COUNTER}, ${evt.target.value})`
}

const resetValues = (count, offset) => {
  countInput.value = count;
  offsetInput.value = offset;
}

const render = () => {
  const nodeCount = getCountValue() - getOffsetValue();
  if (nodeCount < 0) resetGrid(false);
  Array(nodeCount).fill().map((n, index) => addNode(createNode(index)));
  updateStatus();
}

const animate = (callback) => {
  return new Promise(resolve =>
    setTimeout(() => {
      const checkedNodes = getNodes().filter(node => node.querySelector('input').checked);
      // const uncheckedNodes = getNodes().filter(node => node.querySelector('input').checked == false);

      const randVal = Math.random();
      const randIndexBool = randVal > 0.5;
      const randIndex = Math.floor(randVal * checkedNodes.length);
      const randomEl = checkedNodes[randIndex];
      const randomElInput = randomEl.querySelector('input');
      
      randomEl.setAttribute('data-tracked', 'tracked');

      setTimeout(() => {
        randomEl.removeAttribute('data-tracked');
        randomElInput.checked = false;
      }, Math.random() * (Math.random() * 1000000));

      animate();
      resolve();
    }, 1000)
  )
}

const init = (cssCounterRef) => {
  renderTypeSelector(defaultCounterStyleType);
  resetCSSCounter(getOffsetValue(), cssCounterRef);

  if (hasUrlParams()) {
    resetValues(endAt, startAt);
    dangerouslySetCounterType({target:{value: counterStyleType}});
  }

  render();
  animate();
}

init(CSS_COUNTER);
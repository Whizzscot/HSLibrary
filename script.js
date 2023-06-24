const ItemInfoForm = document.getElementById('item-info-form');

function ev(el){
	el=el||{};
	console.log('Hello', el.innerText);
}

function tagContextEvent(e){
	let input = e.target.parentElement.parentElement.parentElement.querySelector('.tag-input');
	input.value = e.target.innerText;
	e.target.remove();
	input.focus();
}

function tagInputEvent(event){
	event.target.classList[event.target.value ? 'remove' : 'add']('empty');
	
}

function applyTag(inputElem){
	if(!inputElem.value) return inputElem.focus();
	let list = inputElem.parentElement.querySelector('.applied-tags-list');
	if(list.querySelector(`.applied-tag[tag-id='${encodeURIComponent(inputElem.value)}']`)) return inputElem.focus();
	let orderId = inputElem.parentElement.getAttribute('tag-order-id') || 0;
	orderId = Number(orderId);
	let tagElem = document.createElement('span');
	tagElem.classList.add('applied-tag');
	tagElem.setAttribute('tag-order-id', orderId);
	tagElem.setAttribute('tag-id', encodeURIComponent(inputElem.value));
	tagElem.innerText = inputElem.value;
	tagElem.addEventListener('contextmenu', tagContextEvent);
	inputElem.parentElement.setAttribute('tag-order-id', ++orderId);
	inputElem.value = '';
	list.appendChild(tagElem);
	let sortMode = inputElem.parentElement.querySelector('.applied-tags-sort-select').value;
	if(sortMode == 'alpha') sortTags(list, 'alpha');
	inputElem.focus();
}

function tagOrderCompare(a, b){
	let aVal = Number(a.getAttribute('tag-order-id'))||0;
	let bVal = Number(b.getAttribute('tag-order-id'))||0;
	return aVal - bVal;
}

function tagAlphaCompare(a, b){
	const tagA = a.innerText.toLowerCase(); // ignore upper and lowercase
	const tagB = b.innerText.toLowerCase(); // ignore upper and lowercase
	return tagA.localeCompare(tagB);
}

function sortTags(list, mode){
	let f = tagOrderCompare;
	if(mode == 'alpha') f = tagAlphaCompare;
	let tags = Array.from(list.childNodes);
	tags.sort(f).map(list.appendChild.bind(list));
}
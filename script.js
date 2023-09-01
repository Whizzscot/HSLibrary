const ItemInfoForm = document.getElementById('item-info-form');

function ev(el){
	el=el||{};
	console.log('Hello', el.innerText);
}

function removeTag(tagElem, inputElem){
	inputElem = inputElem || tagElem.parentElement.parentElement.parentElement.querySelector('.tag-input');
	if(!inputElem) return console.error('pointer to inputElem invalid');
	inputElem.value = tagElem.innerText;
	tagElem.remove();
	inputElem.focus();
}

function beforeInput({data, dataTransfer, inputType, isComposing}){
	console.log({data, dataTransfer, inputType, isComposing});
}

//let elem = document.querySelector('.tag-input');
//Object.keys(window).forEach(key => {
//	if(!/^on/.test(key)) return;
//	elem.addEventListener(key.slice(2), ({type})=>console.log(type))
//});

function encodeTag(tag){
	return encodeURIComponent(tag);
}

function applyTag(inputElem){
	inputElem.focus();
	if(!inputElem.value) return;
	let tag = inputElem.value;
	let encodedTag = encodeTag(tag);
	let list = document.querySelector(`form.item-info:has(#${inputElem.id}) .applied-tags-list`);
	if(list.querySelector(`.applied-tag[tag-id='${encodedTag.replace(/'/g,"\\'")}']`)) return;
	let orderId = inputElem.getAttribute('tag-order-id') || 0;
	orderId = Number(orderId) || 0;
	let tagElem = document.createElement('span');
	tagElem.classList.add('applied-tag');
	tagElem.setAttribute('applied-order', orderId);
	tagElem.setAttribute('tag-id', encodedTag);
	tagElem.innerText = inputElem.value;
	tagElem.addEventListener('contextmenu', e => removeTag(e.target, inputElem));
	inputElem.setAttribute('tag-order-id', ++orderId);
	inputElem.value = '';
	list.appendChild(tagElem);
	let sortMode = document.querySelector(`form.item-info:has(#${inputElem.id}) .applied-tags-sort-select`).value;
	if(sortMode != 'applied') sortTags(list, sortMode);
}

var tagCompareFunctions = {
	alphabetical:(a, b) => {
		return a.innerText.localeCompare(b.innerText);
	},
	applied:(a, b) => {
		let aVal = Number(a.getAttribute('applied-order'))||0;
		let bVal = Number(b.getAttribute('applied-order'))||0;
		return aVal - bVal;
	}
};

function sortTags(list, mode){
	let tags = Array.from(list.childNodes);
	tags.sort(tagCompareFunctions[mode]).map(list.appendChild.bind(list));
}
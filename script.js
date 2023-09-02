const ItemInfoForm = document.getElementById('item-info-form');

function ev(el){
	el=el||{};
	console.log('Hello', el.innerText);
}

function cancelEvent(e){e.preventDefault();e.stopPropagation();return false;}

function closeAllDialogs(){
	document.querySelectorAll('dialog:not(.self-close)').forEach(el=>el.close());
}

const TagContextDialog = document.querySelector("#tag-context-dialog");
const TagContextMenu = TagContextDialog.firstElementChild;

function tagContextEvent(tag, input){
	if(TagContextDialog.open) return TagContextDialog.close();
	if(matchMedia('(pointer:fine)').matches){
		let elemBox = tag.getBoundingClientRect();
		TagContextDialog.style.left = `min(${elemBox.right - window.scrollX}px, calc(100% - 5.2rem - var(--padding)))`;
		TagContextDialog.style.bottom = `calc(${window.innerHeight - elemBox.y - window.scrollY}px + var(--padding))`;
		TagContextDialog.show();
	}else{
		TagContextDialog.showModal();
	}
	TagContextDialog.returnValue = "none";
	TagContextMenu.setAttribute("selected-tag", tag.getAttribute("tag-value"));
	tag.classList.add("selected");
	TagContextDialog.addEventListener("close", ()=>{
		switch(TagContextDialog.returnValue){
			case "edit":
				editTag(tag, input);
			break;
			case "remove":
				tag.remove();
			break;
		}
		tag.classList.remove("selected");
		TagContextMenu.removeAttribute("selected-tag");
	}, {once:true});
}

function editTag(tagElem, inputElem){
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

function getTagById(parent=new HTMLElement(), id="", isValue=false){
	return parent.querySelector(`.applied-tag[tag-${isValue ? "value" : "id"}='${id.replace(/'/g, "\\'")}']`);
}

function applyTag(inputElem, focus=true){
	if(focus) inputElem.focus();
	if(!inputElem.value) return;
	let tag = inputElem.value;
	let encodedTag = encodeTag(tag);
	let list = document.querySelector(`form.item-info:has(#${inputElem.id}) .applied-tags-list`);
	if(getTagById(list, encodedTag)) return;
	let orderId = inputElem.getAttribute('tag-order-id') || 0;
	orderId = Number(orderId) || 0;
	let tagElem = document.createElement('span');
	tagElem.classList.add('applied-tag');
	tagElem.setAttribute('applied-order', orderId);
	tagElem.setAttribute('tag-id', encodedTag);
	tagElem.setAttribute('tag-value', tag);
	tagElem.innerText = tag;
	tagElem.addEventListener('contextmenu', e => {e.preventDefault();tagContextEvent(e.target, inputElem)});
	tagElem.addEventListener('mousedown', e => {if(matchMedia('(pointer:coarse)').matches){e.stopPropagation();tagContextEvent(e.target, inputElem)}});
	inputElem.setAttribute('tag-order-id', ++orderId);
	inputElem.value = '';
	list.appendChild(tagElem);
	let sortMode = document.querySelector(`form.item-info:has(#${inputElem.id}) .applied-tags-sort-select`).value;
	if(sortMode != 'applied') sortTags(list, sortMode);

}


const tagInput = document.querySelector(".tag-input");
for(let x = 0; x < 100; x++){
	tagInput.value = Math.random().toString(36).slice(10);
	applyTag(tagInput);
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
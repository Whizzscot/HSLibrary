var Tags = {};
var Items = {};
var Authors = {};


[
	'thing1',
	'thing2',
	'thing3',
	'sci fi',
	'fantasy',
	'curriculum',
].forEach(tag => {
	Tags[encodeURIComponent(tag)] = tag;
});

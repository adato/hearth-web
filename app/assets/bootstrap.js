// scripts to be loaded sooner

$(document).on({
	'DOMNodeInserted': function() {
		$('.pac-item, .pac-item span', this).addClass('needsclick');
	}
}, '.pac-container');


// Object.values polyfill for IE

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Reflect.ownKeys;

if (!Object.values) {
	Object.values = function values(O) {
		return reduce(keys(O), (v, k) => concat(v, typeof k === 'string' && isEnumerable(O, k) ? [O[k]] : []), []);
	};
}

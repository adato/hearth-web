// scripts to be loaded sooner

$(document).on({
	'DOMNodeInserted': function() {
		$('.pac-item, .pac-item span', this).addClass('needsclick');
	}
}, '.pac-container');


if (!Object.values) {
	Object.values = function values(O) {
		return Object.keys(O).map(k => O[k]);
	};
}

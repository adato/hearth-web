// scripts to be loaded sooner

$(document).on({
	'DOMNodeInserted': function() {
		$('.pac-item, .pac-item span', this).addClass('needsclick');
	}
}, '.pac-container');
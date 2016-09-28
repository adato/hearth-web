;(function(window) {
	'use strict'

	var $ = window.aeg.$,
 		fe = window.aeg.fe,
		findParentBySelector = window.aeg.findParentBySelector,
		shuffle = window.aeg.shuffle;

	//
	//	FACES
	//

	// FACES VARIABLES
	var tabsIdentificator = '[tabs]',
		tabHeaderWrapperIdentificator = '[tab-headers]',
		tabHeadersIdentificator = '[tab-headers] li',
		tabContentsIdentificator = '[tab-content]',
		tabContentsPaneIdentificator = '[tab-pane]';

	// DYNAMIC DATA FILL
	var bartaSetup = getTestimonialTranslations('barta'),
		hajzlerSetup = getTestimonialTranslations('hajzler'),
		panekSetup = getTestimonialTranslations('panek'),
		vaclavekSetup = getTestimonialTranslations('vaclavek');
	bartaSetup.code = 'barta';
	bartaSetup.imgId = 'image-testimonial-barta';
	bartaSetup.name = 'Jiří Bárta';
	hajzlerSetup.code = 'hajzler';
	hajzlerSetup.imgId = 'image-testimonial-hajzler';
	hajzlerSetup.name = 'Tomáš Hajzler';
	panekSetup.code = 'panek';
	panekSetup.imgId = 'image-testimonial-panek';
	panekSetup.name = 'Šimon Pánek';
	vaclavekSetup.code = 'vaclavek';
	vaclavekSetup.imgId = 'image-testimonial-vaclavek';
	vaclavekSetup.name = 'Petr Václavek';

	var dynaTestimonials = {
		wrapperSelector: '#testimonialsWrapper',
		tabs: [
			bartaSetup,
			hajzlerSetup,
			panekSetup,
			vaclavekSetup
		]
	};

	/**
	 *	Function that finds a person-id='personId' in the html and gets translated variables from it
	 */
	function getTestimonialTranslations(personId) {
		var personTranslations = $('[person-id="' + personId + '"]');
		if (personTranslations) personTranslations = {
			position: {
				short: personTranslations[0].getAttribute('position-short'),
				long: personTranslations[0].getAttribute('position-long')
			},
			text: personTranslations[0].getAttribute('text')
		};
		return personTranslations || {position: ''};
	}

	// shuffle the tabs
	shuffle(dynaTestimonials.tabs);
	// show at most 4
	dynaTestimonials.tabs = dynaTestimonials.tabs.slice(0, 4);

	fillWithData(dynaTestimonials);

	function fillWithData(dynaTestimonials) {
		var headers = '',
			contents = '';
		for (var i = 0,l = dynaTestimonials.tabs.length;i < l;i++) {
			var q = dynaTestimonials.tabs[i];
			headers += "\
				<li role='presentation' class='" + (i === 0 ? 'active' : '') + "'>\
					<a href='#" + q.code + "' aria-controls='" + q.code + "' role='tab' data-toggle='tab'>\
						<div class='position-relative text-align-center'>\
							<div class='img-circle' id='" + q.imgId + "'></div>\
							<span class='quote'><i class='fa fa-quote-left'></i></span>\
						</div>\
						<div class='text-align-center margin-top-small large-only text'>\
							<p class='margin-vertical-none'><strong class='text-uppercase'>" + q.name + "</strong></p>\
							<small class='text-muted'>" + q.position.short + "</small>\
						</div>\
					</a>\
				</li>\
			";
			contents += "\
				<div role='tabpanel' class='tab-pane fade " + (i === 0 ? 'active' : '') + "' id='" + q.code + "' tab-pane>\
					<div class='tab-inner'>\
						<div class='medium-down'>\
							<p class='margin-vertical-none'><strong class='text-uppercase'>" + q.name + "</strong></p>\
							<small>" + q.position.long + "</small>\
						</div>\
						<p class='lead'>" + q.text + "</p>\
						<p class='text-align-right large-only'>\
							&mdash;&nbsp;" + q.name + "<br />\
							<small class='text-muted'><i>" + q.position.long + "</i></small>\
						</p>\
					</div>\
				</div>\
			";
		}
		$(dynaTestimonials.wrapperSelector).querySelector(tabHeaderWrapperIdentificator).innerHTML = headers;
		$(dynaTestimonials.wrapperSelector).querySelector(tabContentsIdentificator).innerHTML = contents;
	}

	// TESTIMONIALS CODE
	fe($(tabsIdentificator), function(tabs) {
		var tabHeaders = tabs.querySelectorAll(tabHeadersIdentificator);
		var tabContents = tabs.querySelectorAll(tabContentsPaneIdentificator);
		if (tabContents) {
			for (var i = tabHeaders.length;i--;) {
				tabHeaders[i].addEventListener('click', function(event) {
					event.preventDefault();
					event.stopImmediatePropagation();
					var a = findParentBySelector(event.target, 'a');
					if (a) {
						removeActive(tabHeaders);
						a.parentNode.classList.add('active');
						var tab = $(a.getAttribute('href'));
						if (tab) {
							removeActive(tabContents, false, 1);
							tab.classList.add('active');
						}
					}
				});
			}
		}
	});

	function removeActive(elems, fromParent) {
		for (var i = elems.length;i--;) {
			var el = (fromParent ? elems[i].parentNode : elems[i]);
			el.classList.remove('active');
		}
	}

})(window);
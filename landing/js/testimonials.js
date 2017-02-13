;(function(window) {
	'use strict';

	var $ = window.aeg.$;
 	var fe = window.aeg.fe;
	var findParentBySelector = window.aeg.findParentBySelector;
	var shuffle = window.aeg.shuffle;

	//
	//	FACES
	//

	// FACES VARIABLES
	var tabsIdentificator = '[tabs]';
	var tabHeaderWrapperIdentificator = '[tab-headers]';
	var tabHeadersIdentificator = '[tab-headers] li';
	var tabContentsIdentificator = '[tab-content]';
	var tabContentsPaneIdentificator = '[tab-pane]';

	var tabsRotatorLeftSelector = '[rotate-left]';
	var tabsRotatorRightSelector = '[rotate-right]';

	// DYNAMIC DATA FILL
	var bartaSetup = getTestimonialTranslations('barta');
	var hajzlerSetup = getTestimonialTranslations('hajzler');
	var panekSetup = getTestimonialTranslations('panek');
	var vaclavekSetup = getTestimonialTranslations('vaclavek');
	var fellmerSetup = getTestimonialTranslations('fellmer');
	var dusekSetup = getTestimonialTranslations('dusek');
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
	fellmerSetup.code = 'fellmer';
	fellmerSetup.imgId = 'image-testimonial-fellmer';
	fellmerSetup.name = 'Raphael Fellmer';
	dusekSetup.code = 'dusek';
	dusekSetup.imgId = 'image-testimonial-dusek';
	dusekSetup.name = 'Jaroslav Dušek';

	var dynaTestimonials = {
		wrapperSelector: '[testimonials-wrapper]',
		tabs: [
			bartaSetup,
			hajzlerSetup,
			panekSetup,
			vaclavekSetup,
			fellmerSetup,
			dusekSetup
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

	fillWithData(dynaTestimonials);

	function fillWithData(dynaTestimonials) {
		const initIndex = 2;
		var headers = '';
		var contents = '';
		for (var i = 0,l = dynaTestimonials.tabs.length;i < l;i++) {
			var q = dynaTestimonials.tabs[i];
			headers += "\
				<li role='presentation' class='" + (i === initIndex ? 'active' : '') + "'>\
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
				<div role='tabpanel' class='tab-pane fade " + (i === initIndex ? 'active' : '') + "' id='" + q.code + "' tab-pane>\
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
		$(dynaTestimonials.wrapperSelector)[0].querySelector(tabHeaderWrapperIdentificator).innerHTML = headers;
		$(dynaTestimonials.wrapperSelector)[0].querySelector(tabContentsIdentificator).innerHTML = contents;
	}

	// TESTIMONIALS CODE
	fe($(tabsIdentificator), function(tabs) {
		var tabHeaders = tabs.querySelectorAll(tabHeadersIdentificator);
		var tabContents = tabs.querySelectorAll(tabContentsPaneIdentificator);
		if (tabContents) {
			for (var i = tabHeaders.length;i--;) {
				tabHeaders[i].addEventListener('click', testimonialClickHandler);
			}
			fe($(tabsRotatorLeftSelector), i => {
				i.addEventListener('click', () => {
					rotate({ parent: tabs, tabHeaders, tabContents });
				});
			});
			fe($(tabsRotatorRightSelector), i => {
				i.addEventListener('click', () => {
					rotate({ parent: tabs, tabHeaders, tabContents, dir: 1 });
				});
			});
		}

		function testimonialClickHandler(event) {

			var tabHeaders = tabs.querySelectorAll(tabHeadersIdentificator);
			var tabContents = tabs.querySelectorAll(tabContentsPaneIdentificator);

			event.preventDefault();
			event.stopImmediatePropagation();
			var a = findParentBySelector(event.target, 'a');
			setActive({ tabContents, tabHeaders, a })
		}

		/**
		 * - parent {Node} - the parent node on which to search for face item wrapper
		 * - dir {Boolean} - direction of rotation. false means right [false]

		 * - tabHeaders {NodeList}
		 * - tabContents {NodeList}
		 */
		function rotate(opts = {}) {
			let parent = opts.parent.querySelector(tabHeaderWrapperIdentificator);
			let { tabHeaders, tabContents } = opts;


			// reassign active class
			let currentActiveElement = parent.querySelector('.active');
			let target = opts.dir ? currentActiveElement.previousElementSibling : currentActiveElement.nextElementSibling;
			let backupTarget = opts.dir ? currentActiveElement.parentNode.lastElementChild : currentActiveElement.parentNode.firstElementChild;
			let toBeActiveElement = target || backupTarget;
			removeActive(tabContents, false);
			let a = toBeActiveElement.querySelector('a');
			setActive({ a, tabContents, tabHeaders });

			// rotate the list
			let paramA = opts.dir ? parent.children.length - 1 : 0;
			let paramB = opts.dir ? 0 : parent.children.length;

			// direct swap
			parent.insertBefore(parent.children[paramA], parent.children[paramB]);

			// animated swap
			// animateSwap({ parent, newNode: parent.children[paramA], refNode: parent.children[paramB] });
		}

		function animateSwap({ parent, newNode, refNode }) {
			newNode.classList.remove('active');
			var clone = newNode.cloneNode(true);

			newNode.classList.add('anim-hidden');
			setTimeout(() => {
				parent.removeChild(newNode);
			}, 300);

			clone.classList.add('anim-hidden');
			parent.insertBefore(clone, refNode);
			setTimeout(() => {
				clone.classList.remove('anim-hidden');
			})
		}

	});


	function setActive({ a, tabContents, tabHeaders }) {
		if (a) {
			removeActive(tabHeaders);
			a.parentNode.classList.add('active');
			var tab = $(a.getAttribute('href'));
			if (tab) {
				removeActive(tabContents, false);
				tab.classList.add('active');
			}
		}
	}

	function removeActive(elems, fromParent) {
		for (var i = elems.length;i--;) {
			var el = (fromParent ? elems[i].parentNode : elems[i]);
			el.classList.remove('active');
		}
	}

})(window);
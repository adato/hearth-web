;(function(window) {
	'use strict';

	var $ = window.aeg.$;
 	var fe = window.aeg.fe;
	var findParentBySelector = window.aeg.findParentBySelector;
	var shuffle = window.aeg.shuffle;
	const breakpoints = window.aeg.breakpoints;

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

	var initIndex = getInitIndex();

	fillWithData(dynaTestimonials);

	function fillWithData(dynaTestimonials) {
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
						</div>"
						+ "<div class='text-align-center margin-top-small large-only text'>\
							<p class='margin-vertical-none'><strong class='text-uppercase'>" + q.name + "</strong></p>\
							<small class='text-muted'>" + q.position.short + "</small>\
						</div>"
					+ "</a>\
				</li>\
			";
			contents += "\
				<div role='tabpanel' class='tab-pane fade " + (i === initIndex ? 'active' : '') + "' id='" + q.code + "' tab-pane>\
					<div class='tab-inner'>"
						// + "<div class='medium-down'>\
						// 	<p class='margin-vertical-none'><strong class='text-uppercase'>" + q.name + "</strong></p>\
						// 	<small>" + q.position.long + "</small>\
						// </div>"
						+ "<p class='lead'>" + q.text + "</p>\
						<p class='text-align-right large-only-a'>\
							&mdash;&nbsp;" + q.name + "<br />\
							<small class='text-muted'><i>" + q.position.long + "</i></small>\
						</p>\
					</div>\
				</div>\
			";
		}
		var th = $(dynaTestimonials.wrapperSelector)[0].querySelector(tabHeaderWrapperIdentificator);
		th.innerHTML = th.innerHTML + headers;
		$(dynaTestimonials.wrapperSelector)[0].querySelector(tabContentsIdentificator).innerHTML = contents;

	}

	function getInitIndex() {
		if (window.matchMedia('(min-width: ' + breakpoints.large + ')').matches) {
			return 2;
		} else if (window.matchMedia('(min-width: ' + breakpoints.medium + ')').matches) {
			return 1;
		}
		return 0;
	}

	// TESTIMONIALS CODE
	fe($(tabsIdentificator), function(tabs) {

		var animationRunning = false;
		const safetyLength = 30;
		const animationLength = 200;

		var tabHeaders = tabs.querySelectorAll(tabHeadersIdentificator);
		var tabContents = tabs.querySelectorAll(tabContentsPaneIdentificator);

		if (tabContents) {
			for (var i = tabHeaders.length;i--;) {
				tabHeaders[i].addEventListener('click', testimonialClickHandler);
			}
			fe($(tabsRotatorLeftSelector), i => {
				i.addEventListener('click', () => {
					if (animationRunning) return;
					rotate({ parent: tabs, tabHeaders, tabContents, dir: -1 });
				});
			});
			fe($(tabsRotatorRightSelector), i => {
				i.addEventListener('click', () => {
					if (animationRunning) return;
					rotate({ parent: tabs, tabHeaders, tabContents, dir: 1 });
				});
			});

			window.addEventListener('resize', function() {
				var newIndex = getInitIndex();
				if (initIndex !== newIndex) {
					initIndex = newIndex;
					setActive({ a: tabHeaders[initIndex].children[0], tabHeaders, tabContents });
				}
			});
		}

		function testimonialClickHandler(event) {
			if (animationRunning) return;

			event.preventDefault();
			event.stopImmediatePropagation();
			var a = findParentBySelector(event.target, 'a');

			// direct set active
			// setActive({ tabContents, tabHeaders, a });

			// rotate and set active
			rotateAndSetActive({ tabs, tabContents, tabHeaders, a });
		}

		/**
		 * - parent {Node} - the parent node on which to search for face item wrapper
		 * - dir {Boolean} - direction of rotation. false means right [false]

		 * - tabHeaders {NodeList}
		 * - tabContents {NodeList}
		 */
		function rotate({ parent, tabHeaders, tabContents, dir, cb }) {
			parent = parent.querySelector(tabHeaderWrapperIdentificator);

			let direction = (-1 * dir) > 0;

			// reassign active class
			let currentActiveElement = parent.querySelector('.active');
			let target = direction ? currentActiveElement.previousElementSibling : currentActiveElement.nextElementSibling;
			let backupTarget = direction ? currentActiveElement.parentNode.lastElementChild : currentActiveElement.parentNode.firstElementChild;
			let toBeActiveElement = target || backupTarget;
			removeActive(tabContents, false);
			let a = toBeActiveElement.querySelector('a');
			setActive({ a, tabContents, tabHeaders });

			// rotate the list
			let newNode = direction ? parent.children.length - 1 : 0;
			let refNode = direction ? 0 : parent.children.length;

			// direct swap
			// parent.insertBefore(parent.children[newNode], parent.children[refNode]);

			// animated swap
			animateSwap({ parent, newNode: parent.children[newNode], refNode: parent.children[refNode], parent, tabHeaders, tabContents, dir: direction, cb });
		}

		function animateSwap({ parent, newNode, refNode, tabHeaders, tabContents, dir, cb }) {

			animationRunning = true;

			if (dir) {

				newNode.classList.add('anim-hidden', 'no-anim');
				parent.insertBefore(newNode, refNode);
				setTimeout(() => {
					newNode.classList.remove('anim-hidden', 'no-anim');
				}, safetyLength);
				setTimeout(() => {
					animationRunning = false;
					cb && cb();
				}, animationLength);

			} else {

				var clone = newNode.cloneNode(true);

				parent.insertBefore(clone, parent.children[0]);
				setTimeout(() => {
					clone.classList.add('anim-hidden');
				}, safetyLength);
				setTimeout(() => {
					parent.removeChild(clone);
					animationRunning = false;
					cb && cb();
				}, animationLength);

				newNode.classList.add('anim-hidden', 'no-anim');
				parent.insertBefore(newNode, refNode);
				setTimeout(() => {
					newNode.classList.remove('anim-hidden', 'no-anim');
				}, safetyLength);

			}
		}

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

		function rotateAndSetActive({ a, tabContents, tabHeaders, tabs }) {
			let centerIndex = getInitIndex();
			let elIndex = Array.prototype.indexOf.call(a.parentNode.parentNode.children, a.parentNode);

			let diff = centerIndex - elIndex;
			if (diff !== 0) {
				let repeatCount = Math.abs(diff);
				function repeater() {
					if (--repeatCount) {
						rotate({ parent: tabs, tabHeaders, tabContents, dir: -diff, cb: repeater });
					}
				}
				rotate({ parent: tabs, tabHeaders, tabContents, dir: -diff, cb: repeater });
			}
		}

		function removeActive(elems, fromParent) {
			for (var i = elems.length;i--;) {
				var el = (fromParent ? elems[i].parentNode : elems[i]);
				el.classList.remove('active');
			}
		}

	});


})(window);
(function(window, config) {
	'use strict'

	//
	//	INCLUDES
	//
	var $ = window.aeg.$,
		cookieFactory = window.aeg.cookieFactory,
 		fe = window.aeg.fe,
 		findParentBySelector = window.aeg.findParentBySelector,
		request = window.aeg.request,
		requestApi = window.aeg.requestApi,
		shuffle = window.aeg.shuffle,
		throttle = window.aeg.throttle;


	//
	//	DROPDOWN
	//
	var isActive = 'is-active',
		dropdownIdentificator = 'dropdown',
		dropdownSelector = '[' + dropdownIdentificator + ']';
	fe($(dropdownSelector), function(el) {
		el.addEventListener('click', function() {
			var target = el.getAttribute(dropdownIdentificator);

			// hide all other dropdowns
			fe($(dropdownSelector + ':not([' + dropdownIdentificator + '=' + target + '])'), function(otherEl) {
				var otherELNode = $('#' + otherEl.getAttribute(dropdownIdentificator));
				if (otherELNode) otherELNode.classList.remove(isActive);
			});

			// show target
			var targetNode = $('#' + target);
			if (targetNode) targetNode.classList.toggle(isActive);

			// bind/unbind click on window
			setTimeout(function(){
				setToggleHandler(targetNode.classList.contains(isActive));
			});

			// dropdown options
			var ddo = el.getAttribute('dropdown-opts');
			if (ddo) {
				try {
					var temp = jsonGetter(ddo);
					ddo = JSON.parse(temp);
					if (ddo.applyActiveToSelf) el.classList.toggle(isActive);
				} catch (e) {console.info(e || '');}
			}
		});
	});
	function toggleHandler(event) {
		var dd = findParentBySelector(event.target, dropdownSelector),
			selector = dd ? dropdownSelector + ':not([' + dropdownIdentificator + '=' + dd.getAttribute(dropdownIdentificator) + '])' : dropdownSelector;

		if (!(findParentBySelector(event.target, '.hover-window'))) {
			// close (?all) dropdowns
			fe($(selector), function(el) {
				var elNode = $('#' + el.getAttribute(dropdownIdentificator));
				if (elNode) elNode.classList.remove(isActive);

				// dropdown options
				var ddo = el.getAttribute('dropdown-opts');
				if (ddo) {
					try {
						var temp = jsonGetter(ddo);
						ddo = JSON.parse(temp);
						if (ddo.applyActiveToSelf) el.classList.remove(isActive);
					} catch (e) {console.info(e || '');}
				}
			});
			if (!dd) setToggleHandler(false);
		}
	}
	var toggleHandlerAttached;
	/**
	 * toggle handler attacher preventing duplicate event attaching
	 */
	function setToggleHandler(value) {
		if (value) {
			if (toggleHandlerAttached) return;
			toggleHandlerAttached = true;
			window.addEventListener('click', toggleHandler);
		} else {
			window.removeEventListener('click', toggleHandler);
			toggleHandlerAttached = false;
		}
	}
	/**
	 *	tries to create a valid JSON string
	 */
	function jsonGetter(string) {
		var temp1 = string.split(':');
			temp2 = string.slice(0,1) + '"' + temp1[0].slice(1) + '":' + temp1[1];
		return temp2;
	}

	//
	//	MENU CLASSES ON SCROLL
	//
	var header = $('.header-wrapper');
	var CONTRACTED_CLASS = 'contracted';
	var HEADER_SCROLL_TOP = 50;
	if (header && header.length) {
		header = header[0];
		var headerLarge = true;
		window.addEventListener('scroll', throttle(function(event) {
			var top = window.pageYOffset || document.documentElement.scrollTop;
			if (headerLarge && top > HEADER_SCROLL_TOP) {
				headerLarge = false;
				header.classList.add(CONTRACTED_CLASS);
			} else if ((!headerLarge) && top < HEADER_SCROLL_TOP) {
				headerLarge = true;
				header.classList.remove(CONTRACTED_CLASS);
			}
		}));
	}

	//
	//	SMALL/MEDIUM MENU HIDE ON USAGE
	//
	(function() {
		var menuHideOnUsageSelector = '[deactivate-after-link-usage]',
			menuHideOnUsageLinks = menuHideOnUsageSelector + ' a',
			smoothScrollDuration = 400;
		var menuToHideNode = $(menuHideOnUsageSelector);
		if (menuToHideNode) {
			fe($(menuHideOnUsageLinks), function(el) {
				el.addEventListener('click', function() {
					setTimeout(function() { fe(menuToHideNode, function(mEl) { mEl.classList.remove(isActive); }) }, smoothScrollDuration - 50 || 0);
				});
			});
		}
	})();

})(window, window.hearthConfig);
(function(window) {
	//
	//	COMMON
	//
	function $(q) {
		return document['querySelector' + (q.slice(0,1) === '#' ? '' : 'All')](q);
	}
	function fe(q, fn) {
		if (! (q && q.length)) return;
		for (var i = 0, l = q.length; i < l; fn(q[i]), i++);
	}
	function collectionHas(a, b) {
		for(var i = 0, len = a.length;i < len;i++) {
			if(a[i] === b) return true;
		}
		return false;
	}
	function findParentBySelector(elem, selector) {
		var all = document.querySelectorAll(selector);
		var cur = elem;
		while (cur && !collectionHas(all, cur)) {
			cur = cur.parentNode;
		}
		return cur; //will return null if not found
	}
	function request(method, path) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, path);
		xhr.setRequestHeader('X-API-TOKEN', apiToken);
		xhr.setRequestHeader('Accept', 'application/vnd.hearth-v1+json');
		xhr.setRequestHeader('X-API-VERSION', '1');
		xhr.setRequestHeader('Content-Type', 'application/json');
		return xhr;
	}
	function throttle(callback, limit) {
	    var wait = false;
		limit = limit || 10;
	    return function() {
	        if (!wait) {
	            callback.call();
	            wait = true;
	            setTimeout(function() {
	                wait = false;
	            }, limit);
	        }
	    }
	}
	function shuffle(array) {
		var currentIndex = array.length,
			temporaryValue,
			randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	// expose something through window.aeg
	window.aeg = {
		$: $,
		fe: fe
	}

	var cookieFactory = {
		get: function(cname){
			var name = cname + '=';
			var cookies = document.cookie.split(';');
			for(var i = 0;i < cookies.length;i++){
				var c = cookies[i];
				while(c.charAt(0) === ' ') c = c.substring(1);
				if(c.indexOf(name) === 0) return c.substring(name.length, c.length);
			}
			return '';
		},
		set: function(cname, cvalue){
			document.cookie = cname + '=' + cvalue + '; expires=Thu, 31 Jan 3131 00:00:00 GMT';
		},
		remove: function(cname){
			document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
		}
	};

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
					ddo = JSON.parse(ddo);
					if (ddo.applyActiveToSelf) el.classList.toggle(isActive);
				} catch (e) {console.info(e);}
			}
		});
	});
	function toggleHandler(event) {
		var dd = findParentBySelector(event.target, dropdownSelector);
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
						ddo = JSON.parse(ddo);
						if (ddo.applyActiveToSelf) el.classList.remove(isActive);
					} catch (e) {console.info(e);}
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

	//
	//	GESICHTE
	//
	var tabs = $('#nav-tabs').getElementsByTagName('li');
	var tabContents = $('#tabs-collapse').getElementsByClassName('tab-pane');
	function removeActive(elems, fromParent) {
		for (var i = elems.length;i--;) {
			var el = (fromParent ? elems[i].parentNode : elems[i]);
			el.classList.remove('active');
		}
	}
	if (tabs) {
		for (var i = tabs.length;i--;) {
			tabs[i].addEventListener('click', function(event) {
				event.preventDefault();
				event.stopImmediatePropagation();
				var a = findParentBySelector(event.target, 'a');
				if (a) {
					removeActive(tabs);
					a.parentNode.classList.add('active');
					var tab = $(a.getAttribute('href'));
					if (tab) {
						removeActive(tabContents);
						tab.classList.add('active');
					}
				}
			});
		}
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

	//
	//	SLIDESHOW
	//
	(function(){

		var jumboWrapperSelector = '[jumbo-wrapper]',
			jumboImages = [
				"<div class='jumbo-show show-1'></div>",
				"<div class='jumbo-show show-2'></div>",
				"<div class='jumbo-show show-3'></div>",
				"<div class='jumbo-show show-4'></div>",
				"<div class='jumbo-show show-5'></div>"
			];

		shuffle(jumboImages);

		fe($(jumboWrapperSelector), function(el) {
			for (var i = jumboImages.length;i--;) {
				el.insertAdjacentHTML('afterbegin', jumboImages[i]);
			}
		});

		[].slice.call( document.querySelectorAll( '.jumbo-wrapper' ) ).forEach( function( nav ) {
			new DotNav( nav );
		} );
	})();

	//
	//	PROFILE
	//
	var profile,
		apiPath = 'https://api.dev.hearth.net',
		authTokenIdentificator = 'authToken';

	var loggedSelector = '[user-logged]',
		notLoggedSelector = '[user-not-logged]',
		profileSectionSelector = '#profileSection',
		profileAvatarSelector = '[profile-image]',
		profileFullNameSelector = '[profile-name]',
		profileLinkSelector = '[profile-link]';

	var apiToken = cookieFactory.get(authTokenIdentificator);
	if (apiToken) {
		initProfile(apiToken);
	} else {
		fe($(notLoggedSelector), function(el) {el.style.display = 'inherit';el.classList.add('inited');});
		fe($(loggedSelector), function(el) {el.style.display = 'none';el.classList.add('inited');});
	}

	///////////////////

	function initProfile(apiToken) {
		var req = request('GET', apiPath + '/profile');
		req.onload = function() {
		    if (req.status === 200) {
		        profile = JSON.parse(xhr.responseText);
				// console.log(profile);
				fillProfile(profile);
		    } else {
				profileNotLogged();
		        console.log('Profile request failed. Returned status of ' + xhr.status);
		    }
		};
		req.send();
	}

	/**
	 *	function that sets all elements that are for logged users to be visible and
	 *	all those that are for not-logged only, invisible
	 */
	function profileLogged() {
		fe($(loggedSelector), function(el) {el.style.display = '';el.classList.add('inited');});
		fe($(notLoggedSelector), function(el) {el.style.display = 'none';el.classList.add('inited');});
	}
	/**
	 *	function that sets all elements that are for logged users to be invisible and
	 *	all those that are for not-logged only, visible
	 */
	function profileNotLogged() {
		fe($(notLoggedSelector), function(el) {el.style.display = '';el.classList.add('inited');});
		fe($(loggedSelector), function(el) {el.style.display = 'none';el.classList.add('inited');});
	}

	/**
	 *	set all profile attributes
	 */
	function fillProfile(profileObject) {
		profileLogged();

		fe($(profileAvatarSelector), function(el) {el.setAttribute('src', profile.avatar.normal);});
		fe($(profileFullNameSelector), function(el) {el.innerHTML = [profile.name, profile.surname].join('\u00A0').trim();});
		fe($(profileLinkSelector), function(el) {el.setAttribute('href', '/app/profile/' + profile._id);});
	}

	/**
	 * contact api to remove session
	 * on success delete auth cookie and set ui to not-logged state
	 */
	function logout() {
		var req = request('POST', apiPath + '/logout');
		req.onload = function() {
			if (req.status === 200) {
				cookieFactory.remove(authTokenIdentificator);
				profileNotLogged();
			} else {
				console.error('Something went wong logging out:', req);
			}
		};
	}
	var logoutNodeIdentificator = '[logout]';
	function initLogoutFunction() {
		fe($(logoutNodeIdentificator), function(el) {
			if (el.tagName.toLowerCase() === 'a') {
				el.setAttribute('href', 'javascript:logout()');
			} else {
				el.addEventListener('click', logout)
			}
		});
	}
	initLogoutFunction()

})(window);
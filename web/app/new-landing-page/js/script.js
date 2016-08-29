(function(window){
	//
	//	COMMON
	//
	function $(q){
		return document['querySelector' + (q.slice(0,1) === '#' ? '' : 'All')](q);
	}
	function fe(q, fn) {
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
	//	MENU AND LANGUAGE PANEL
	//
	var langToggle = 'language-toggle',
		langPanel = 'language-panel',
		isActive = 'is-active';
	var hamburger = $('#hamburger');
	var ltoggle = $('.' + langToggle);
	var menu = $('#main-navigation');
	var windowShown;
	var action = true;
	if (!(hamburger && menu)) throw new Error('all elements are required - hamburger, language-panel, main-navigation');
	fe(ltoggle, function(el) {
		el.addEventListener('click', function(event) {
			toggleMenu(event, 'lang');
		});
	});
	hamburger.addEventListener('click', function(event) {
		toggleMenu(event, 'menu');
	});

	function langHandler(lp) {
		menu.classList.remove(isActive);
		hamburger.classList.remove(isActive);
		// fe($('.' + langPanel), function(el) {el.classList.remove(isActive);});

		if (!action) return action = true;
		if (lp) lp.classList.toggle(isActive);
	}
	function menuHandler() {
		fe($('.' + langPanel), function(el) {el.classList.remove(isActive);});

		if (!action) return action = true;
		hamburger.classList.toggle(isActive);
		menu.classList.toggle(isActive);
	}

	function toggleMenu(event, w) {
		var toggle = event ? findParentBySelector(event.target, '.' + langToggle) : false;
		var lp;
		if (toggle) {
			lp = toggle.parentNode.getElementsByClassName(langPanel);
			if (!(lp && lp.length)) throw new Error('".language-panel" element required as a sibling to language-toggle.');
			lp = lp[0];
		}
		if (!windowShown) {
			window.addEventListener('mousedown', toggleHandler);
		} else {
			window.removeEventListener('mousedown', toggleHandler);
		}
		if (w === 'menu') {
			menuHandler();
		} else if (w === 'lang') {
			langHandler((lp ? lp : false));
		} else {
			fe($('.' + langPanel), function(el) {el.classList.remove(isActive);});
			menu.classList.remove(isActive);
			hamburger.classList.remove(isActive);
		}
		windowShown = w;
	}

	function toggleHandler(event) {
		if (!(findParentBySelector(event.target, '.hover-window'))) {
			var burgerAction = findParentBySelector(event.target, '#hamburger');
			var ltoggleAction = findParentBySelector(event.target, '#language-toggle');
			if ((burgerAction && menu.classList.contains('is-active')) || (ltoggleAction && lp.classList.contains('is-active'))) {
				action = false;
			}
			toggleMenu({}, false);
			window.removeEventListener('click', toggleHandler);
		} else if (event.target.tagName === 'A') {
			window.setTimeout(toggleMenu, 400);
		};
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
		window.addEventListener('scroll', throttle(function(event){
			var top = window.pageYOffset || document.documentElement.scrollTop
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
	//	SLIDESHOW
	//
	[].slice.call( document.querySelectorAll( '.jumbo-wrapper' ) ).forEach( function( nav ) {
		new DotNav( nav );
	} );

	//
	//	PROFILE
	//
	var profile;

	var loggedSelector = '.userLogged',
		notLoggedSelector = '.userNotLogged',
		profileSectionSelector = '#profileSection';

	var apiToken = cookieFactory.get('authToken');
	if (apiToken) {
		initProfile(apiToken);
	} else {
		fe($(notLoggedSelector), function(el) {el.style.display = ''});
	}

	///////////////////

	function initProfile(apiToken) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.dev.hearth.net/profile');
		xhr.setRequestHeader('X-API-TOKEN', apiToken);
		xhr.setRequestHeader('Accept', 'application/vnd.hearth-v1+json');
		xhr.setRequestHeader('X-API-VERSION', '1');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
		    if (xhr.status === 200) {
		        profile = JSON.parse(xhr.responseText);
				console.log(profile);
				fillProfile(profile);
		    } else {
				fe($(notLoggedSelector), function(el) {el.style.display = ''});
		        console.log('Profile request failed. Returned status of ' + xhr.status);
		    }
		};
		xhr.send();
	}

	function fillProfile(profileObject) {
		fe($(loggedSelector), function(el) {el.style.display = ''});
		$(profileSectionSelector).innerHTML = (profile.avatar.small ? '<img class="avatar" src="' + profile.avatar.small + '" />' : '') + '<a href="/app/profile/' + profile._id + '" class="text-emphasize">' + [profile.name, profile.surname].join('\u00A0').trim() + '</a>';
	}

})(window);
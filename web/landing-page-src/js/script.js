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
					var temp = jsonGetter(ddo);
					ddo = JSON.parse(temp);
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
						var temp = jsonGetter(ddo);
						ddo = JSON.parse(temp);
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
	/**
	 *	tries to create a valid JSON string
	 */
	function jsonGetter(string) {
		var temp1 = string.split(':');
			temp2 = string.slice(0,1) + '"' + temp1[0].slice(1) + '":' + temp1[1];
		return temp2;
	}

	//
	//	GESICHTE
	//
	(function() {

		// GESICHTE VARIABLES
		var tabsIdentificator = '[tabs]',
			tabHeaderWrapperIdentificator = '[tab-headers]',
			tabHeadersIdentificator = '[tab-headers] li',
			tabContentsIdentificator = '[tab-content]',
			tabContentsPaneIdentificator = '[tab-pane]';

		// DYNAMIC DATA FILL
		var dynaGesichte = {
			wrapperSelector: '#gesichteWrapper',
			tabs: [
				{
					code: 'barta',
					imgSrc: 'img/people/jiri-barta.png',
					name: 'Jiří Bárta',
					position: {
						short: 'Nadace Via',
						long: 'Nadace Via'
					},
					text: 'Parádní nápad. Dar je radost i starost. Je projevem zájmu, příležitost\
						pomoci anebo pomoc přijmout. Pro někoho příležitost naděje, pro jiného\
						závazek pomoci. Držím vám palce a přeju, aby se díky Hearth.net\
						potkávalo co nejvíc lidí a darů ve správný čas.'
				}, {
					code: 'panek',
					imgSrc: 'img/people/simon-panek.png',
					name: 'Šimon Pánek',
					position: {
						short: 'Člověk v tísni',
						long: 'Ředitel humanitární organizace Člověk v tísni'
					},
					text: 'Zajímavá možnost jak se ve složitém a uspěchaném světě vrátit k prostému\
						aktu někomu něco darovat, pomoci mu, seznámit se s ním. Dřív to šlo v rámci\
						komunity a širšího příbuzenstva či kmene. Dnes máme Hearth.net a to je skvělé.'
				}, {
					code: 'hajzler',
					imgSrc: 'img/people/tomas-hajzler.png',
					name: 'Tomáš Hajzler',
					position: {
						short: 'Peoplecomm.cz',
						long: 'Zakladatel Peoplecomm.cz a člověk, co se nebojí být sám sebou'
					},
					text: 'Nadchla mě vaše jednoduchost. Přestěhoval jsem se a myslím, že mi\
					Hearth.net pomůže vybudovat vztahy v novém místě. Dávání bylo a\
					bude základ každé rodiny a navíc vám přináší skvělý pocit. Dnešní\
					doba sociálních sítí k tomu ideálně nahrává.'
				}, {
					code: 'vaclavek',
					imgSrc: 'img/people/petr-vaclavek.png',
					name: 'Petr Václavek',
					position: {
						short: 'novebohatstvi.cz',
						long: 'Člověk, který opustil vysoké posty světa reklamy, a založil spirituální blog novebohatstvi.cz'
					},
					text: 'Hearth.net je skvělé místo pro každého, kdo se chce spojit se\
					světem jiným, novým a smysluplným způsobem. Dává možnost jak\
					uplatnit svůj dar-talent, a dělat tak, co nás naplňuje radostí.'
				}
				// , {
				// 	code: '',
				// 	imgSrc: '',
				// 	name: '',
				// 	position: {
				// 		short: '',
				// 		long: ''
				// 	},
				// 	text: ''
				// }
			]
		};

		// shuffle the tabs
		shuffle(dynaGesichte.tabs);
		// show at most 4
		dynaGesichte.tabs = dynaGesichte.tabs.slice(0, 4);

		fillWithData(dynaGesichte);

		function fillWithData(dynaGesichte) {
			var headers = '',
				contents = '';
			for (var i = 0,l = dynaGesichte.tabs.length;i < l;i++) {
				var q = dynaGesichte.tabs[i];
				headers += "\
					<li role='presentation' class='" + (i === 0 ? 'active' : '') + "'>\
						<a href='#" + q.code + "' aria-controls='" + q.code + "' role='tab' data-toggle='tab'>\
							<div class='position-relative text-align-center'>\
								<img class='img-circle' src='" + q.imgSrc + "' />\
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
			$(dynaGesichte.wrapperSelector).querySelector(tabHeaderWrapperIdentificator).innerHTML = headers;
			$(dynaGesichte.wrapperSelector).querySelector(tabContentsIdentificator).innerHTML = contents;
		}

		// GESICHTE CODE
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

	})();


	//var tabs = $('#nav-tabs').getElementsByTagName('li');
	//var tabContents = $('#tabs-collapse').getElementsByClassName('tab-pane');

	// if (tabs) {
	// 	for (var i = tabs.length;i--;) {
	// 		tabs[i].addEventListener('click', function(event) {
	// 			event.preventDefault();
	// 			event.stopImmediatePropagation();
	// 			var a = findParentBySelector(event.target, 'a');
	// 			if (a) {
	// 				removeActive(tabs);
	// 				a.parentNode.classList.add('active');
	// 				var tab = $(a.getAttribute('href'));
	// 				if (tab) {
	// 					removeActive(tabContents);
	// 					tab.classList.add('active');
	// 				}
	// 			}
	// 		});
	// 	}
	// }

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
		// add as many dots as there are jumboImages
		var dotStyleWrapper = $('.dotstyle-wrapper ul')[0];
		for (var i = jumboImages.length;i--;) {
			dotStyleWrapper.insertAdjacentHTML('afterbegin', "<li><a href='#'>#</a></li>");
		}

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
		        profile = JSON.parse(req.responseText);
				// console.log(profile);
				fillProfile(profile);
		    } else {
				profileNotLogged();
		        console.log('Profile request failed. Returned status of ' + req.status);
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
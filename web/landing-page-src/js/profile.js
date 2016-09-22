;(function(window, config) {
	'use strict'

	var $ = window.aeg.$,
		cookieFactory = window.aeg.cookieFactory,
 		fe = window.aeg.fe,
		requestApi = window.aeg.requestApi;

	//
	//	PROFILE
	//
	var profile,
		apiPath = config.apiPath,
		authTokenIdentificator = config.authTokenIdentificator;

	var loggedSelector = '[user-logged]',
		notLoggedSelector = '[user-not-logged]',
		profileSectionSelector = '#profileSection',
		profileAvatarSelector = '[profile-image]',
		profileFullNameSelector = '[profile-name]',
		profileLinkSelector = '[profile-link]',
		logoutNodeIdentificator = '[logout]';

	var apiToken = cookieFactory.get(authTokenIdentificator);
	if (apiToken) {
		initProfile(apiToken);
	} else {
		fe($(notLoggedSelector), function(el) {el.style.display = 'inherit'; el.classList.add('inited');});
		fe($(loggedSelector), function(el) {el.style.display = 'none'; el.classList.add('inited');});
	}

	// expose logout function
	window.logout = logout;

	initLogoutFunction();

	///////////////////

	function initProfile(apiToken) {
		var req = requestApi('GET', apiPath + '/profile', {token: apiToken});
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
		var req = requestApi('POST', apiPath + '/logout', {token: apiToken});
		req.onload = function() {
			if (req.status === 200) {
				cookieFactory.remove(authTokenIdentificator);
				profileNotLogged();
			} else {
				console.error('Something went wong during logout:', req);
			}
		};
		req.send();
	}
	function initLogoutFunction() {
		fe($(logoutNodeIdentificator), function(el) {
			if (el.tagName.toLowerCase() === 'a') {
				el.setAttribute('href', 'javascript:logout()');
			} else {
				el.addEventListener('click', logout)
			}
		});
	}

})(window, window.hearthConfig);
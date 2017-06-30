;(function(window, config) {
	'use strict';

	const $ = window.aeg.$;
	const cookieFactory = window.aeg.cookieFactory;
 	const fe = window.aeg.fe;
	const requestApi = window.aeg.requestApi;

	//
	//	PROFILE
	//
	var profile;
	const apiPath = config.apiPath;
	const authTokenIdentificator = config.authTokenIdentificator;

	const loggedSelector = '[user-logged]';
	const notLoggedSelector = '[user-not-logged]';
	const profileSectionSelector = '#profileSection';
	const profileAvatarSelector = '[profile-image]';
	const profileAvatarDefault = '/img/no-avatar.jpg';
	const profileFullNameSelector = '[profile-name]';
	const profileLinkSelector = '[profile-link]';
	const logoutNodeIdentificator = '[logout]';
	const unreadMessagesBadgeSelector = '[message-count]';

	// COOKIE PATH ERROR FIX-UP
	cookieFactory.remove(authTokenIdentificator, '/cs');
	cookieFactory.remove(authTokenIdentificator, '/sk');

	var apiToken = cookieFactory.get(authTokenIdentificator);
	if (apiToken) {
		initProfile(apiToken);
	} else {
		fe($(notLoggedSelector), function(el) {el.style.display = 'inherit'; el.classList.add('inited');});
		fe($(loggedSelector), function(el) {el.style.display = 'none'; el.classList.add('inited');});
		initCharacterLinks();
	}

	// expose logout function
	window.logout = logout;

	initLogoutFunction();

	///////////////////

	function initProfile(apiToken) {
		// get profile information
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
			initCharacterLinks(profile);
		};
		req.send();

		// get unread message count
		var unreadMessageCountReq = requestApi('GET', apiPath + '/conversations/counter', {token: apiToken});
		unreadMessageCountReq.onload = function() {
			if (unreadMessageCountReq.status === 200) {
				var res = JSON.parse(unreadMessageCountReq.responseText);
				if (res && res.unread !== void 0) {
					var unreadCount = parseInt(res.unread) > 1000 ? '999+' : res.unread;
					fe($(unreadMessagesBadgeSelector), function(el) {el.innerHTML = unreadCount; el.style.display = 'block'});
				}
			}
		}
		unreadMessageCountReq.send();
	}

	/**
	 *	function that sets all elements that are for logged users to be visible and
	 *	all those that are for not-logged only, invisible
	 */
	function profileLogged() {
		fe($(loggedSelector), function(el) {el.style.display = '';el.classList.add('inited')})
		fe($(notLoggedSelector), function(el) {el.style.display = 'none';el.classList.add('inited')})
	}
	/**
	 *	function that sets all elements that are for logged users to be invisible and
	 *	all those that are for not-logged only, visible
	 */
	function profileNotLogged() {
		fe($(notLoggedSelector), function(el) {el.style.display = '';el.classList.add('inited')})
		fe($(loggedSelector), function(el) {el.style.display = 'none';el.classList.add('inited')})
	}

	/**
	 *	set all profile attributes
	 */
	function fillProfile(profileObject) {
		profileLogged()

		fe($(profileAvatarSelector), function(el) {el.setAttribute('src', (profile.avatar ? profile.avatar.normal : profileAvatarDefault)})
		fe($(profileFullNameSelector), function(el) {el.innerHTML = [profile.name, profile.surname].join('\u00A0').trim()})
		fe($(profileLinkSelector), function(el) {el.setAttribute('href', '/app/profile/' + profile._id)})
	}

	/**
	 * contact api to remove session
	 * on success delete auth cookie and set ui to not-logged state
	 */
	function logout() {
		var req = requestApi('POST', apiPath + '/logout', {token: apiToken})
		req.onload = function() {
			if (req.status === 200) {
				cookieFactory.remove(authTokenIdentificator)

				// COOKIE PATH ERROR FIX-UP
				cookieFactory.remove(authTokenIdentificator, '/cs')
				cookieFactory.remove(authTokenIdentificator, '/sk')

				profileNotLogged()
			} else {
				console.error('Something went wong during logout:', req)
			}
		}
		req.send()
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

	function initCharacterLinks(profile) {
		if (typeof window.marketplaceMasonryInit === 'function') window.marketplaceMasonryInit({additionalParams: 'lang=' + (profile ? (profile.user_languages.join(',') + '&my-lang=1') : document.querySelector('html').getAttribute('lang'))});
	}

})(window, window.hearthConfig);
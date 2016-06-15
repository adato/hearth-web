(function(){
	function $(q){
		return document['querySelector' + (q.slice(0,1) === '#' ? '' : 'All')](q);
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

	var hamburger = $('#hamburger');
	var ltoggle = $('#language-toggle');
	var lp = $('#language-panel');
	var menu = $('#main-navigation');
	var windowShown;
	if (!(hamburger && lp && menu)) throw new Error('all elements are required - hamburger, language-panel, main-navigation');
	ltoggle.addEventListener('click', toggleMenu.bind(false, 'lang'));
	hamburger.addEventListener('click', toggleMenu.bind(false, 'menu'));

	function langHandler() {
		menu.classList.remove('is-active');
		hamburger.classList.remove('is-active');

		lp.classList.toggle('is-active');
	}
	function menuHandler() {
		lp.classList.remove('is-active');

		hamburger.classList.toggle('is-active');
		menu.classList.toggle('is-active');
	}

	function toggleMenu(w) {
		if (w === 'menu') {
			menuHandler();
		} else if (w === 'lang') {
			langHandler();
		} else {
			lp.classList.remove('is-active');
			menu.classList.remove('is-active');
			hamburger.classList.remove('is-active');
		}
		if(!windowShown){
			window.addEventListener('mousedown', toggleHandler);
		} else {
			window.removeEventListener('mousedown', toggleHandler);
		};
		windowShown = w;
	};

	function toggleHandler(event) {
		console.log('cau');
		if (!(findParentBySelector(event.target, '.hover-window'))) {
			toggleMenu();
			window.removeEventListener('click', toggleHandler);
		};
	};

})();
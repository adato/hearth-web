;(function(window) {
	'use strict'

	var $ = window.aeg.$,
 		fe = window.aeg.fe,
		findParentBySelector = window.aeg.findParentBySelector,
		shuffle = window.aeg.shuffle;

	//
	//	GESICHTE
	//

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
				imgId: 'image-gesicht-barta',
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
				imgId: 'image-gesicht-panek',
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
				imgId: 'image-gesicht-hajzler',
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
				imgId: 'image-gesicht-vaclavek',
				name: 'Petr Václavek',
				position: {
					short: 'novebohatstvi.cz',
					long: 'Člověk, který opustil vysoké posty světa reklamy, a založil spirituální blog novebohatstvi.cz'
				},
				text: 'Hearth.net je skvělé místo pro každého, kdo se chce spojit se\
				světem jiným, novým a smysluplným způsobem. Dává možnost jak\
				uplatnit svůj dar-talent, a dělat tak, co nás naplňuje radostí.'
			}
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

})(window);
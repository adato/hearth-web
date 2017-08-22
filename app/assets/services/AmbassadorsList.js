'use strict';

angular.module('hearth').factory('AmbassadorsCache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('ambassadors');
}]);


/**
 * @ngdoc service
 * @name hearth.services.AmbassadorsList
 * @description Depends on CommunityMembers and does caching results via $cacheFactory
 */

angular.module('hearth.services').service('AmbassadorsListService', ['CommunityMembers', 'AmbassadorsCache', function(CommunityMembers, AmbassadorsCache) {

	const ambassadorsList = [
		{ 
			realName: 'Barbora Stehlíková',
			id: '563c9ee6f278bf000700005b',
			area: 'Praha',
			reason: 'Protože si myslím, že Hearth je zajímavý projekt, o kterém by se mělo dozvědět co nejvíce lidí.',
			story: 'Obohacujícím je pro mě na Hearthu především setkávání s lidmi, které jsem poznala buď skrze dary nebo díky ambasadorství. Obzvláště inspirující pro mě bylo setkání s rodinou, která toho nemá nijak mnoho, ale s o to větším nadšením daruje.',
		},
		{ 
			realName: 'Dominik Bureš',
			id: '52166e5d9685ed0200000003',
			area: 'Praha, Slapy-Měřín',
			reason: 'Libí se mi inspirovat ostatní lidi, aby začali fungovat jako lidi a dělali, co je baví.',
			story: 'Inspirovaly mne principy buddhismu, vlastně jsem se o projektu dozvěděl náhodou při brouzdání internetem, hledal jsem kde a jak u nás působí scéna alternativců-kreativců. No a shodou okolnosti jsem někde zahlédl logo Jobs.cz a LMC a že zakladatel těchto portálů má dost podobný pohled na svět jako já. Tak jsem šel na oficiální tiskovku s kamarádkou.',
		},
		{ 
			realName: 'Eduard Černáč',
			id: '572dd1b83ed44b000b000324',
			area: 'Praha',
			reason: 'Mám za to, že pomáhat si a projevovat laskavost a přímost je přirozený způsob života.',
			story: 'O Hearthu jsem se dozvěděl ústně v době, kdy se podařilo přesun do Prahy jedné kamarádce, ženě s pěti dětmi, které jsme společně s dalšími pomáhali již několik let. ',
		},
		{ 
			realName: 'Hana Holá',
			id: '569620a966a6f10007001192',
			area: 'Praha',
			reason: 'Ambasadorství ke mně přišlo tak nějak samo. :-) Hearth.net se mi líbí již delší dobu a již delší dobu jsem měla pocit, že bych mohla Hearth.net podpořit i jinak než jako běžný uživatel. Celé to začalo, když jsem potkala Lenku (v tu dobu novou ředitelku Adato Paradigma) a tak nějak jsme si hned sedly.',
			story: 'Zažila jsem si, že splněná přání přichází se správným nastavením mysli. Díky Hearth.net jsem si uvědomila, že umím spíš dávat, než žádat, a díky Hearth.net se to učím – i když zatím velice pomalu. :-D',
		},
		{ 
			realName: 'Hanka Zemánková',
			id: '570183ccdcf621000a000ab6',
			area: 'Praha',
			reason: 'Protože to tak asi má být :) Hearth mám ráda a ráda daruji věci druhým lidem. Na druhou stranu nijak aktivně Hearth nešířím, myslím, že darování a radost, kterou to přináší, vzniká sama v pravý čas, vzniká až poté, co pochopíme, co je láska – a k tomu nejde nikoho „přinutit“. Proto se zaměřuji spíše na to, jak druhé inspirovat k lásce, místo toho, abych je inspirovala k darování, protože pak je takový dar neupřímný a poslání celého Hearthu a jeho smysl se míjí účinkem. ',
			story: 'O Hearth jsem se dozvěděla na festivalu Evolution, moc se mi to líbilo, a tak jsem se zaregistrovala a začala sdílet. Díky Hearthu jsem si našla přátele, našla jsem také okruh lidí, které mohu inspirovat sama tím, co tvořím, zažila jsem moc příjemná setkání, splnila si jeden ze svých snů – jízdu na koni ve volné přírodě. Vzpomínám si doteď na ten pocit naprosté přítomnosti, blaženosti a rozplynutí, obrovské vděčnosti a štěstí, když jsem se proháněla na koňském hřbetě uprostřed malebné krajiny… :)',
		},
		{ 
			realName: 'Helena Civínová',
			id: '5328b47b7b6ee40200000d85',
			area: 'Slaný',
			reason: 'Byla jsem pozvána, Hearth.net se mi líbí, mám radost, že se mohu zapojit do vytváření sítě štědrosti, hodně jsem se přitom o sobě naučila.',
			story: 'Už si nepamatuji, kde jsem se o Hearth.net dozvěděla, ale skutečně jsem ho objevila až když jsem se do něho více zapojila a objevuji ho nadále. Všechny dary přijaté i darované mě obohatily. Na Dařišti na náměstí ve Slaném, jsem si pomyslela, že mám hlad a za chvíli mi paní od stánku s palačinkami jednu přinesla. To mě hodně potěšilo, ani jsem nemusela přání vyslovit a už bylo splněno.',
		},
		{ 
			realName: 'Honza Dolínek',
			id: '5225e39a937e3f020000000f',
			area: 'Praha',
			reason: 'Protože věřím v naše společné paradigma',
			story: 'Moje příběhy jsou obyčejné, poznal jsem za svůj život a 20 let práce v nezisku jistě stovky, možná nízké tisíce dobrovolníků, kteří Hearth žijí… radost je v tom vidět a jistě vědět, že tohle je fakt bezva žít',
		},
		{ 
			realName: 'Iveta Maršíková',
			id: '56e307db68c30d0007000609',
			area: 'Příbram',
			reason: 'Protože mi to přináší radost! Líbí se mi podporovat tenhle ojedinělý projekt, který vede lidi k tomu, co je opravdu důležité: radost, víra v dobro, štědrost...',
			story: 'O Hearth.net jsem se dozvěděla v knize TVARYTMY od Jaroslava Duška. Ihned jsem se zaregistrovala a změnilo mi to život – začala jsem poznávat spoustu skvělých lidí, cokoli přijímat i darovat. Jako první jsem navštívila kurz jógy smíchu a to byl zážitek  Díky Hearth.net jsem navázala několik krásných přátelství.',
		},
		{ 
			realName: 'Iveta Vrbová',
			id: '522f6fc061a9eb0200000022',
			area: 'kdekoliv :-)',
			reason: 'Protože mi to po třech letech na hearth bylo nabídnuto a já přijala',
			story: '',
		},
		{ 
			realName: 'Jana Vlčková',
			id: '526ea249924b430200000018',
			area: 'Příbram',
			reason: 'Myšlenka Hearthu se mnou souzní, vlastně jsem se tak chovala ještě dřív, než Hearth začal existovat. Ambasadorem?- šířím principy H. ve svém okolí, ale poslední dobou mám trochu černé svědomí, protože z časových důvodů nejsem až tak aktivní.',
			story: 'Jelikož ráda čtu příběhy úspěšných podnikatelů, tak jsem sledovala profesní dráhu Libora Malého a když o něm vyšel článek v časopise, že založil Hearth, hned jsem se zaregistrovala a stala se aktivním členem. Poznala jsem několik skvělých lidí, s kterými se stále přátelím. Za obohacující dar považuji právě ta nová přátelství a seznámení se se zajímavými novými lidmi a dále radost z darů, které jsem věnovala.',
		},
		{ 
			realName: 'Kamila Rubešová',
			id: '5540744e6536390007680000',
			area: 'Kozomín, Středočeský kraj',
			reason: 'Ráda šířím dobro, pomáhání, štědrost a vzájemné sdílení',
			story: 'Poznala jsem tady hodně zajímavých lidí, se kterými jsem stále v kontaktu, ale je jasné, že ne s každým si člověk padne kolem krku. Před vánoci jsem připravila sbírku dárků pro maminky do azylového domu v Kralupech, zapojila se i děvčata z Hearth – Julka, Inka, Linda, Petra. Linda navíc připravila pro maminky motivační přednášku a líčení a fotografování. Hearth pro mne není jen o předávání hmotných věcí, ale zejména předání informací, znalostí a energie. A ujištění, že je tady hodně lidí, kteří mají vidění světa podobné jako já a nejsem v tom sama.',
		},
		{ 
			realName: 'Linda Kubačáková',
			id: '577ec345cc7d2900060007a3',
			area: 'Roztoky u Prahy, Středočeský kraj',
			reason: 'Protože chci',
			story: '',
		},
		{ 
			realName: 'Lucie Slouková',
			id: '57e57f238b5fbc000a32bca7',
			area: 'Kralupy nad Vltavou',
			reason: 'Ambasadorem Hearth.net jsem, protože se mi líbí šířit myšlenku sdílení, udržitelnosti a vytváření radosti. Jsem milovnice bazarů, second-handů, antiků. Člověk tam najde většinu věcí, které si chce pořídit. Ovšem za zlomek ceny. V druhé řadě pak takovýmto nákupem nevytváří další nešetrnou průmyslovou stopu. No a nesmíme opomenout ani na chemii, která je z takového trička z druhé ruky už několikrát opraná. A stejná pozitiva mají i hmotné dary na tržišti Hearth.net. Co se týká darování a přijímání umů a zkušeností, nejde pak jen o nově nabytou dovednost či posekání zahrady, ale i o potkávání inspirujících lidí, poznávání míst a vytváření zážitků. A s tím vším velice sympatizuji.',
			story: 'Velice mě potěšila mladá paní, jenž nám darovala klávesy. Můj muž párkrát vyprávěl, jak rád by na ně hrál, a dcerka je poměrně muzikální, a tak věřím, že díky této milé dámě bude naše rodina svůj hudební talent rozvíjet, a jednou dceři povyprávíme, kde se vlastně u nás tehdá to piano vzalo:-)',
		},
		{ 
			realName: 'Marián Klimek',
			id: '5642693204dcb4000b0000b6',
			area: 'Praha',
			reason: 'Projekt se mi líbí a chci ho podpořit',
			story: 'Na Heartu jsem potkal řadu skvělých lidí s otevřeným srdcem a zajímavými životními příběhy a líbí se mi pomáhat Heart objevovat i dalším lidem které potkávám na své životní cestě, baví mě propojovat lidi z různých projektů a světů.',
		},
		{ 
			realName: 'Michal Čagánek',
			id: '521f5b5ab8f421d7200042e8',
			area: 'Praha a Zlínský kraj',
			reason: 'Kvůli síti krásných lidí, se kterými je radost se setkávat, spolupracovat a společně šířit myšlenky štědrosti.',
			story: 'Hearth.net používám od jeho vzniku. Za tu dobu jsem ho využil bezpočetněkrát k nabízení i přijímání darů. Jedním z nejkrásnějších darů, které jsem přijal, je spolupráce s grafikem Petrem Lozanem. Ten se mi přihlásil na moji poptávku týkající se vytvoření obalu na mé CD. Obal jsme společně vytvořili. Necelý rok na to jsme společně formou oboustranného daru realizovali můj román Plyšový Buddha. Petr mi pomohl s grafikou, já jsem mu pomohl realizovat jeho sen vysázet si krásnou knihu  Nádavkem mi ještě ke knize vytvořil krásné záložky a pohlednice. Skutečně nádherná tvůrčí spolupráce.',
		},
		{ 
			realName: 'Monika a Michal Sabáčkovi',
			id: '550d9688626337000b070000',
			area: 'Liberecký kraj',
			reason: 'Z radosti ze života, neboť je vzácný a už vůbec ne samozřejmý:-)',
			story: '',
		},
		{ 
			realName: 'Oldřich Kahoun',
			id: '5717eeba5f0c66000b0003f7',
			area: 'Židlochovice, Brno-venkov',
			reason: 'Je v souladu s mojí vizí „spojovat lidi a rozdávat přitom radost pro lepší svět“',
			story: 'Na Heart.net jsem přišel při svém hledání vize v lese. Řekl jsem si, že když už tu cestu někdo absolvuje, že je lepší jít s ním než vytvářet cestu jinou.',
		},
		{ 
			realName: 'Petra Fuksová',
			id: '5643940fd4ab910007000094',
			area: 'Praha',
			reason: 'Kvůli dobrému pocitu z pomoci, smysluplnému naplnění volného času, poznávání lidí se stejnými či podobnými názory na život, zájmy a jiné.',
			story: 'Nikde není tak lehké jako zde být obklopen lidmi, kteří věří v dobrotu, jsou milí, laskaví, nevyčítají, nelžou, nezávidí si. ',
		},
		{ 
			realName: 'Petra Minářová',
			id: '52937e74a0d18e020000000b',
			area: 'Prostějov',
			reason: 'Považuji za radost darovat čas,  hmotné věci (a tím pádem šetřit životní prostřední). Vytvářet láskyplné prostředí mi prostě připadá smysluplné... A setkávat se s lidmi, kteří už nejsou tak chyceni v systému mě nabíjí a dělá mi radost.',
			story: '',
		},
		{ 
			realName: 'Radek Horák',
			id: '55e9ed53a98f56000700390a',
			area: 'Vsetín',
			reason: 'Protože tak platformu sdílení a ekonomiky daru nemusím vymýšlet znovu a sám; Pro podporu myšlenky změny v přístupu ke zdrojům pro uspokojování životních potřeb – změna paradigma; Pro možnost prosazovat nezištný přístup v praxi s podporou internetové platformy a existující komunity.',
			story: 'Životní zkušenosti mě přivedly do stavu, kdy jsem si uvědomil, že tržní ekonomický systém nemůže ze své podstaty vytvářet podmínky pro dlouhodobou prosperitu lidské společnosti, ani zajistit trvalou ochranu přírody, životního prostředí a přírodních zdrojů. Zjistil jsem, že teoreticky už existují návrhy na jiné ekonomické modely společnosti.',
		},
		{ 
			realName: 'Renata Handlová',
			id: '54661ad33934660002000000',
			area: 'Milín, Středočeský kraj',
			reason: 'Baví mě podporovat smysluplné projekty a šířit poselství Hearth.net',
			story: 'Libora Malého znám z dob, kdy jsem pracovala pro jeho společnost LMC. Pro mě je to výjimečný člověk, takže když jsem zaslechla o jeho projektu Hearth.net, vzbudilo to mou zvědavost. Nejdříve jsem byla jen v pozici dárce, protože tehdy jsem ještě neuměla přijímat dary a pomoc od druhých lidí. Po nějaké době jsem v rámci svého působení v dobrovolnickém centru požádala o pomoc s tvorbou vánočních balíčků pro pacienty LDN a pak už jsem postupně přijímala dary i pro sebe. Největším darem, který mi Hearth.net přinesl, je výjimečné přátelství, kterého si nesmírně vážím. O jeden z mých prvních darů projevila zájem členka Hearth.net z mého blízkého okolí a po předání daru se postupně utvářelo naše přátelství, které upevnilo mimo jiné i naše společné úsilí o šíření poselství Hearth.net na Příbramsku.   ',
		},
		{ 
			realName: 'Viktor Hes',
			id: '54394e3165363700020c0000',
			area: 'Praha',
			reason: 'Projekt Hearth.net se mi osvědčil jako dobrá cesta při socializování se a poznávání lidi kteří mne mohou posunout dál ale i k lidem které mohu inspirovat a dělám to ze srdce rád. V takovém konceptu dobrosrdečného, komunitního prostředí bez tržních principů se jako člověk tišší a plašší povahy cítím lépe. ',
			story: 'Ona sama je tím darem :-). Ve změti darů a přání mne, je to už pár let zpět, zaujala Ingrid, kterou jsem tehdy osobně neznal. Její inzeráty s věnováním modlitby, čtyřlístků pro štěstí, sdílení se mlčky i slovem mne podnítily k tomu, že jsem jí pozval do čajovny. ',
		},
	];

	function fetchAmbassadorsCommunity() {
		return CommunityMembers.query({ communityId: '57fa6266b7c3ff000a20228c'}).$promise;
	}


	function getList(callback) {
		var cachedResult = null;
		if (typeof (cachedResult = AmbassadorsCache.get('ambassadorsList')) != 'undefined') {
			return callback(cachedResult);
		}
		return fetchAmbassadorsCommunity().then(function (result) {
			var res = [];
			for (var i in result) {
				var communityResult = result[i];
				for (var y in ambassadorsList) {
					var ambassadorResult = ambassadorsList[y];
					if (communityResult._id == ambassadorResult.id) {
						res.push(angular.extend(ambassadorResult, communityResult));
					}
				};
			};
			AmbassadorsCache.put('ambassadorsList', res);
			return callback(res);
		})
	}
	
	return {
		getList: getList
	}

}])
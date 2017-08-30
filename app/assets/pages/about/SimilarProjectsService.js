/**
 * @ngdoc service
 * @name hearth.services.SimilarProjectsList
 * @description 
 */

angular.module('hearth.services').service('SimilarProjectsService', ['$filter', function($filter) {

	const similarProjects = [
		{
			url: 'http://www.zdrojovna.cz/services/freeshop/',
			name: 'Freeshop Zdrojovny',
			description: 'na Praze 3, Žižkově – 2 večery v týdnu, přijímají jen určité věci – kdokoli si je může odnést. Motiv: „ekologie – znovuvyužití věcí, místo vyhazování solidarita – s těmi, co mají méně“ ',
			country: 'cs',
		},
		{
			url: 'http://www.knihobudka.cz',
			name: 'Knihobudka',
			description: 'knížky darem, k půjčení v již nepoužívaných telefonních budkách',
			country: 'cs',
		},
		{
			url: 'http://vsezaodvoz.cz/',
			name: 'Vše za odvoz',
			description: 'důraz na „nepotřebné věci, které se mohou někomu hodit“.',
			country: 'cs',
		},
		{
			url: 'http://www.darujizaodvoz.cz/',
			name: 'Daruji za odvoz',
			description: 'opět důraz na „zadarmo“ a „zbavení se starých věcí“',
			country: 'cs',
		},
		{
			url: 'https://www.facebook.com/groups/201878203317215/',
			name: 'Daruji za odvoz Praha a okolí',
			description: 'Skupina na Facebooku, 19 tis. členů.',
			country: 'cs',
		},
		{
			url: 'http://rerere.cz/',
			name: 'ReReRe',
			description: 'ReReRe (Reduce, Reuse, Recycle) znamená snižuj spotřebu, opětovně používej, recykluj. Věříme, že těmito zásadami prodloužíme funkčním věcem život, těm nepotřebným nalezneme nové vděčné majitele a zároveň odlehčíme životnímu prostředí jednak snížením odpadu, který by jinak skončil na skládkách, a také ochranou přírodních zdrojů.',
			country: 'cs',
		},
		{
			url: 'https://www.nevyhazujto.cz/',
			name: 'Nevyhazuj to',
			description: '„Nepotřebné věci novému majiteli. Za odvoz.“',
			country: 'cs',
		},
		{
			name: 'Rubrika „Daruji“ nebo „Do 100 Kč“',
			description: 'je snad na všech realitních serverech a bazarech – cíl je opět stejný – zbavit se nepotřebných věcí.',
			country: 'cs',
		},
		{
			url: 'http://lets.ecn.cz/cojelets.php',
			name: 'LETS systém',
			description: '„obchodní systémy místní měny“ nebo "systémy místního výměnného obchodu"',
			country: 'cs',
		},
		{
			name: 'Bezpeněžní zóny na FB',
			description: '<a target="_blank" href="https://www.facebook.com/groups/140880262947887/?fref=ts">Zlín</a>, <a target="_blank" href="https://www.facebook.com/groups/142927829228046/?fref=ts">Plzeň</a>, <a target="_blank" href="https://www.facebook.com/groups/201878203317215/?multi_permalinks=640697832768581&notif_t=commerce_interesting_product&notif_id=1481380807840032">Praha a okolí</a>, Napajedla, Uherské Hradiště, Nové Město nad Metují, Kralupy n/V…',
			country: 'cs',
		},
		{
			url: 'http://casovabanka.cz/',
			name: 'Časová banka',
			description: 'za hodinu svého času dostat nebo i výrobek hodinu času někoho jiného a tak si pomoci. - <a target="_blank" href="https://communities.cyclos.org/praha/">časová banka Praha</a> – vyvíjí ji Michal Sirůček, který <a target="_blank" href="https://www.hearth.net/app/profile/531f3bebc752820200002a73">je také na Hearth.net</a>.',
			country: 'cs',
		},
		{
			url: 'http://stastnecesko.cz',
			name: 'Štastné Česko',
			description: 'iniciativa, za kterou stojí Ctirad Hemelík (mj. Pořadatel veletrhu Evolution) a emailový mág David Kirš. V květnu byla úvodní akce, Libor Malý byl jedním z hostů, Hearth se tam také představoval, jsme ve spojení a otevřeni spolupráci. <br> Cíle/témata nadačního fondu Šťastné Česko: Jaké by bylo zdvojnásobit štěstí v ČR? A co to vůbec je štěstí? Je hrubé domácí štěstí důležitější než hrubý domácí produkt? Lze z ČR vytvořit nejšťastnější zemi světa, kde lidé žijí rádi a šťastně?',
			country: 'cs',
			starred: true,
		},
		{
			url: 'http://www.pronaladu.cz/bumerang-laskavosti-osmy-tyden/',
			name: 'Bumerang laskavosti',
			description: 'Na pronaladu.cz – 8 týdnů laskavosti s výzvami, dole pod článkem je všech 8',
			country: 'cs',
			starred: true,
		},
		{
			url: 'https://www.flowee.cz/o-nas',
			name: 'Flowee',
			description: 'Český internetový magazín. „Filosofie flowee.cz je jednoduchá, stejně tak, jako život sám. Vznikli jsme, protože víme, že každý může žít plnohodnotný život naplněný zdravím, láskou, štěstím, navíc takový, který je fér k okolí a zohledňuje naše vnitřní pocity a emoce. Mnoho lidí ale neví, kde a jak začít a možná ani netuší, jak moc je to jednoduché.“',
			country: 'cs',
		},
		{
			url: 'http://umsemumtam.cz',
			name: 'Um sem um tam',
			description: 'propojují profesionály z byznysu a neziskovek – lidé nabízí svůj um/svou práci neziskovkám – tedy dar svého času a talentu.',
			country: 'cs',
		},
		{
			url: 'http://summerjob.naplno.net',
			name: 'SummerJob',
			description: 'týden trvající dobrovolnická brigáda ve vesnicích a městečkách českého pohraničí. „Pomáháme domácnostem nezištnou prací ve stodole, doma či na zahradě. S tím, co je zrovna potřeba. Navazováním vztahů s lidmi, dialogem a kulturním programem pro veřejnost přispíváme k pozitivní změně atmosféry v těchto místech.“ Motiv: Touha po živé společnosti, která pramení z křesťanských hodnot.',
			country: 'cs',
		},
		{
			url: 'http://potravinypomahaji.cz/',
			name: 'Potraviny pomáhají',
			description: 'zabývají se zamezení plýtvání potravinami, mají projekt Národní potravinová sbírka.',
			country: 'cs',
		},
		{
			url: 'https://www.blablacar.cz/o-nas',
			name: 'Blablacar (dříve Jízdomat)',
			description: 'světová komunita pro spolujízdu. Spojuje řidiče s volnými místy v autě a cestující na stejné trase. Díky spolujízdě pak šetří čas i peníze. Jde o nový způsob cestování, postavený na lidech a vzájemném sdílení.',
			country: 'cs',
		},
		{
			url: 'http://www.chcipomoci.info',
			name: 'Chcipomoci',
			description: 'platforma pro dobrovolnou pomoc v místě bydliště.',
			country: 'cs',
		},
		{
			url: 'https://www.dobrovolnik.cz',
			name: 'Dobrovolník.cz',
			description: 'platforma o dobrovolnictví, včetně nabídek a poptávek.',
			country: 'cs',
		},
		{
			url: 'http://www.budupomahat.cz',
			name: 'Budu pomáhat',
			description: 'Platforma o dobrovolnictví, nabídky i poptávky.',
			country: 'cs',
		},
		{
			url: 'http://www.daruj-hracku.cz/',
			name: 'Daruj hračku',
			description: 'už od r. 1997, kontaktují dětské domy a jiné, děti si píší přání o dárky k Vánocům a lidé jim je pak plní.',
			country: 'cs',
		},
		{
			url: 'http://www.krabiceodbot.cz/',
			name: 'Krabice od bot',
			description: 'organizuje Diakonie: „Naplňte s dětmi prázdnou krabici od bot dětskými dárky k Vánocům a doneste ji na sběrné místo. Dárek dostane některé z dětí z chudých rodin v ČR a určitě mu udělá radost. Děti darují dětem.',
			country: 'cs',
		},
		{
			url: 'https://www.socialniklinika.cz/',
			name: 'Sociální klinika',
			description: 'poskytuje na Praze 6 lidem, kteří si to nemohou dovolit, ale chtějí na sobě pracovat, psychoterapeutické služby zdarma',
			country: 'cs',
		},
		{
			url: 'http://probonocentrum.cz/',
			name: 'Pro bono centrum',
			description: 'poskytnutí bezplatných právních služeb neziskovým organizacím.',
			country: 'cs',
		},
		{
			url: 'https://seminkovny.wordpress.com/',
			name: 'Semínkovna',
			description: 'sdílení osiva mezi lidmi darem, už na 30 místech po celé ČR.',
			country: 'cs',
		},
		{
			url: 'http://www.cuketka.cz/kvasek/kvasek.html',
			name: 'Kvásková mapa',
			description: 'lidé si darují kvásek na chleba, u toho se propojují.',
			country: 'cs',
		},
		{
			url: 'https://na-ovoce.cz/',
			name: 'Na ovoce',
			description: 'mapují volně dostupné ovocné stromy, keře a bylinky.',
			country: 'cs',
		},
		{
			url: 'http://www.coffeeshare.cz/',
			name: 'Zavěšený kafe, Coffee Share',
			description: 'koncepty, kdy si v kavárně koupíte „zavěšený kafe“, které provozovatel daruje někomu, kdo si jej nemůže dovolit a přijde se zeptat, zda mají najaký zavěšený kafe. Údajně už 1 800 kaváren po celém světě, i v ČR.',
			country: 'cs',
		},
		{
			url: 'http://jidloaradost.ambi.cz/',
			name: 'Oběd pro dalšího',
			description: 'podobně jako zavěšený kafe koupíte oběd za 90,-, v pražských pobočkách Lokálu, ty jej nabídnou klientům 3 neziskovek pracující s lidmi bez domova.',
			country: 'cs',
		},
		{
			url: 'https://www.facebook.com/bezpenazna.zona',
			name: 'Zóna bez peňazí',
			country: 'sk',
		},
		{
			url: 'http://www.vypestujdobro.sk/',
			name: 'Vypěstuj dobro',
			description: 'lidé odevzdávají své přebytky ze zahrádky a server je distribuuje žadatelům o pomoc, jsou pak informováni, komu pomohli. ',
			country: 'sk',
		},
		{
			url: 'http://www.casovabanka.sk',
			name: 'Časová banka na Slovensku',
			description: 'založili mladí lidé, kteří chtějí udělat něco dobré pro své okolí.',
			country: 'sk',
		},
		{
			url: 'http://www.za-odvoz.sk/',
			name: 'Za odvoz',
			description: 'Slovenská verze českého http://www.darujizaodvoz.cz/, nebo je to naopak?',
			country: 'sk',
		},
		{
			url: 'http://karmatribe.com/about-us/',
			name: 'Karma Tribe',
			description: 'Laskavost, štědrost, sdílení, vzájemná pomoc: „is a global Tribe of kind-hearted people who genuinely enjoy helping each other“. Necelých 1 300 uživatelů z celého světa, od 5/2016.',
			country: 'intl',
			starred: true,
		},
		{
			url: 'https://impossible.com/',
			name: 'Impossible People',
			description: 'fungují od r. 2014, podpora od zakladatele Wikipedie, článek v The Guardian a The Telegraph. Uvádí, že jsou ve 120 zemích!',
			country: 'intl',
			starred: true,
		},
		{
			url: 'http://www.thepeoplewhoshare.com/sharing-economy-guide',
			name: 'Průvodce',
			description: 'Projekty a jednotlivci zajišťujícími sdílení – čehokoliv, jakkoliv.',
			country: 'intl',
			starred: true,
		},
		{
			url: 'http://www.goodnet.org/about',
			name: 'Goodnet',
			description: 'spojují a zviditelňují lidi, kteří „konají dobro“ a potvrzují, že štědrost je nakažlivá   - connects people around the world with opportunities for doing good - it’s that simple.',
			country: 'intl',
		},
		{
			url: 'http://www.wakeupproject.com.au',
			name: 'Wake up project',
			description: 'komunita víc jak 150 000 lidí, kteří nabízí transformační události a zážitky...propojit se s vlastní moudrostí a zjistit, jak udělat svět laskavějším místem. Rozeslali zdarma 350 000 kartiček laskavosti.',
			country: 'intl',
		},
		{
			url: 'http://foodisfreeproject.org/',
			name: 'Food is Free',
			description: 'učí lidi budovat si své zahrady, komunitně, fungují už od r. 2012. ',
			country: 'intl',
		},
		{
			url: 'http://www.skillsforchange.com/',
			name: 'Skills for Change',
			description: 'dobrovolnický web pro zaneprázdněné lidi.',
			country: 'intl',
		},
		{
			url: 'http://www.collective-evolution.com/2016/12/09/what-happens-when-you-grow-more-produce-than-you-can-eat-well-give-it-away-of-course/',
			name: 'Grow Free',
			description: 'Australský off-line projekt, učí lidi jak si vypěstovat své jídlo, komunitně.',
			country: 'intl',
		},
		{
			url: 'http://www.collective-evolution.com/about-us/',
			name: 'Collective Evolution',
			description: 'internetový magazín, inspirující a přispívající ke změně kolektivního vědomí pozitivním a srdečným způsobem. ',
			country: 'intl',
		},
		{
			url: 'http://ilikegiving.com/get-involved/corporate-involvement',
			name: 'Ilikegiving.com',
			description: 'prostřednictvím příběhů inspirují ke štědřejšímu životu. Cílí jednak na firmy - jsou partnery firem, kde mění způsob, jakým dělají byznys. Mají různé produkty – knihy, kartičky, videa, speakera k nim do firmy. Pak na jednotlivce a církve – mají 3týdenní program na změnu vědomí o štědrosti. ',
			country: 'intl',
		},
		{
			url: 'https://www.facebook.com/groups/307554252727875/?multi_permalinks=674781616005135&notif_t=group_highlights&notif_id=1477477969671916',
			name: 'Vancouver gift economy',
			description: 'dnes už international – FB skupina s více než 2 000 členy. ',
			country: 'intl',
		},
		{
			url: 'https://www.generosity.com/',
			name: 'Generosity by INDIEGOGO',
			description: 'is a platform for human goodness“ – platforma pro lidské dobro, od 11/2015. Lidé napíší svůj příběh, s čím chtějí pomoci – představí se na platformě jako foundraiser; pak to sdílí přes různé sítě a nástroje, které platforma nabízí; pak dárcům děkují a informují je, jak pomohli. Indiegogo je jako český https://www.hithit.com/cs/home - tj. fundraisingová a crowdfundingová platforma a založili Generosity, kde mohou lidé pomáhat jednotlivcům – s poplatky na léčbu nemocí, se školným, neziskovky dostanou podporu i v zemích, kde doposud nebyly.',
			country: 'intl',
		},
		{
			url: 'http://www.generositypath.org/',
			name: 'Generosity Path',
			description: 'šíří zprávy z Bible o štědrosti. „We help those whom God has entrusted with much as they host conversations about the joy and freedom that flow from a life generously lived.“ Zdroje se zajímavými videi: <a target="_blank" href="http://www.generositypath.org/resources/">http://www.generositypath.org/resources/',
			country: 'intl',
		},
		{
			url: 'https://giftival.org/',
			name: 'Giftival',
			description: 'týdenní setkání lidí z celého světa, kteří se zabývají ekonomikou daru v jakékoli podobě – od umělců, učitelů, léčitelů až po aktivisty. V roce 2013 se konalo v Turecku, účastnil se ho i náš Libor, v roce 2015 bylo v Itálii, 2016 v Brazílii.',
			country: 'intl',
		},
		{
			url: 'http://generositywater.com',
			name: 'Generosity water',
			description: 'Prodávají zdravou vodu a za každou prodanou lahev zajistí 2 lidem čistou vodu na 1 měsíc: „Věříme, že lidé jsou důležití a vše, co děláme, je vyjádřením této základní hodnoty.“ Na lahvi je QR kód, kde se vám zobrazí, kde konkrétně pomáháte – na webu mají zatím jen 2 projekty na Haiti.',
			country: 'intl',
		},
		{
			url: 'http://www.generositymag.com.au/about-us/',
			name: 'Generosity magazine',
			description: 'zdroj nezávislých zpráv, příběhů a informací o darování v Austrálii. Jejím cílem je oslavovat darování v Austrálii a větší zpřístupnění filantropie. ',
			country: 'intl',
		}
	];


	function localeSensitiveComparator(v1, v2) {
		if (v1.type !== 'string' || v2.type !== 'string') { // if not strings, compare by index
			return (v1.index < v2.index) ? -1 : 1;
		}
		return v1.value.localeCompare(v2.value); // else compare with locales
	}


	// function first filters similar projects list by country, then orders by stars and name
	function fetchAll(country) {
		return $filter('orderBy')($filter('orderBy')(similarProjects.filter(function (item) {
			if (item.country === country) return item;
		}), 'name', false, localeSensitiveComparator), 'starred');
	}

	return {
		fetch: fetchAll
	}


}]);

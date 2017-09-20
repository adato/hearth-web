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
			geo: [[14.4378, 50.075538]],
			reason: 'Protože si myslím, že Hearth.net je zajímavý projekt, o&nbsp;kterém by se mělo dozvědět co nejvíce lidí.',
			story: 'Obohacujícím je pro mě na Hearthu především setkávání s lidmi, které jsem poznala buď skrze dary nebo díky ambasadorství. Obzvláště inspirující pro mě bylo setkání s rodinou, která toho nemá nijak mnoho, ale s o to větším nadšením daruje.',
		},
		{ 
			realName: 'Dominik Bureš',
			id: '52166e5d9685ed0200000003',
			area: 'Praha, Slapy-Měřín',
			geo: [[14.4378, 50.075538],[14.427885, 49.789825]],
			reason: 'Libí se mi inspirovat ostatní lidi, aby začali fungovat jako lidi a&nbsp;dělali, co je baví.',
			story: 'Inspirovaly mne principy buddhismu, vlastně jsem se o&nbsp;projektu dozvěděl náhodou při brouzdání internetem, hledal jsem kde a&nbsp;jak u nás působí scéna alternativců-kreativců. No a&nbsp;shodou okolnosti jsem někde zahlédl logo Jobs.cz a&nbsp;LMC a&nbsp;že zakladatel těchto portálů má dost podobný pohled na svět jako já. Tak jsem šel na oficiální tiskovku s kamarádkou.',
		},
		{ 
			realName: 'Eduard Černáč',
			id: '572dd1b83ed44b000b000324',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Mám za to, že pomáhat si a&nbsp;projevovat laskavost a&nbsp;přímost je přirozený způsob života.',
			story: 'O Hearthu jsem se dozvěděl ústně v době, kdy se podařilo přesun do Prahy jedné kamarádce, ženě s pěti dětmi, které jsme společně s dalšími pomáhali již několik let. ',
		},
		{ 
			realName: 'Hana Holá',
			id: '569620a966a6f10007001192',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Ambasadorství ke mně přišlo tak nějak samo. :-) Hearth.net se mi líbí již delší dobu a již delší dobu jsem měla pocit, že bych mohla Hearth.net podpořit i jinak než jako běžný uživatel. Celé to začalo, když jsem potkala Lenku (v tu dobu novou ředitelku Adato Paradigma) a&nbsp;tak nějak jsme si hned sedly.',
			story: 'Zažila jsem si, že splněná přání přichází se správným nastavením mysli. Díky Hearth.net jsem si uvědomila, že umím spíš dávat, než žádat, a&nbsp;díky Hearth.net se to učím – i když zatím velice pomalu. :-D',
		},
		{ 
			realName: 'Hanka Zemánková',
			id: '570183ccdcf621000a000ab6',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Protože to tak asi má být :) Hearth.net mám ráda a&nbsp;ráda daruji věci druhým lidem. Na druhou stranu nijak aktivně Hearth.net nešířím, myslím, že darování a&nbsp;radost, kterou to přináší, vzniká sama v pravý čas, vzniká až poté, co pochopíme, co je láska – a&nbsp;k tomu nejde nikoho „přinutit“. Proto se zaměřuji spíše na to, jak druhé inspirovat k lásce, místo toho, abych je inspirovala k darování, protože pak je takový dar neupřímný a&nbsp;poslání celého Hearthu a&nbsp;jeho smysl se míjí účinkem. ',
			story: 'O Hearth.net jsem se dozvěděla na festivalu Evolution, moc se mi to líbilo, a&nbsp;tak jsem se zaregistrovala a&nbsp;začala sdílet. Díky Hearthu jsem si našla přátele, našla jsem také okruh lidí, které mohu inspirovat sama tím, co tvořím, zažila jsem moc příjemná setkání, splnila si jeden ze svých snů – jízdu na koni ve volné přírodě. Vzpomínám si doteď na ten pocit naprosté přítomnosti, blaženosti a&nbsp;rozplynutí, obrovské vděčnosti a&nbsp;štěstí, když jsem se proháněla na koňském hřbetě uprostřed malebné krajiny… :)',
		},
		{ 
			realName: 'Helena Civínová',
			id: '5328b47b7b6ee40200000d85',
			area: 'Slaný',
			geo: [[14.086944, 50.230462]],			
			reason: 'Hearth.net se mi líbí, mám radost, že se mohu zapojit do vytváření sítě štědrosti, hodně jsem se přitom o sobě naučila.',
			story: 'Už si nepamatuji, kde jsem se o&nbsp;Hearth.net dozvěděla, ale skutečně jsem ho objevila až když jsem se do něho více zapojila a&nbsp;objevuji ho nadále. Všechny dary přijaté i darované mě obohatily. Na Dařišti na náměstí ve Slaném jsem si pomyslela, že mám hlad a&nbsp;za chvíli mi paní od stánku s palačinkami jednu přinesla. To mě hodně potěšilo, ani jsem nemusela přání vyslovit a&nbsp;už bylo splněno. Snažím se organizovat pravidelná Dařiště ve Slaném (zatím se to podařilo 4x). V plánu je Dařiště každý měsíc v rámci pravidelné burzy knih ve slánské knihovně, kde máme k dispozici nástěnku pro Hearth.net off-line. Ale zatím jsme na to tři ženy ze Slaného s podporou Lucie z Kralup a&nbsp;mého milého přítele, těšíme se až se k nám přidají další. Mým snem je prostor a&nbsp;čas pro stálé off-line Dařiště napojené na Hearth.net. ',
		},
		{ 
			realName: 'Honza Dolínek',
			id: '5225e39a937e3f020000000f',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Protože věřím v naše společné paradigma.',
			story: 'Moje příběhy jsou obyčejné, poznal jsem za svůj život a&nbsp;20 let práce v nezisku jistě stovky, možná nízké tisíce dobrovolníků, kteří Hearth.net žijí… radost je v tom vidět a&nbsp;jistě vědět, že tohle je fakt bezva žít.',
		},
		{ 
			realName: 'Iveta Maršíková',
			id: '56e307db68c30d0007000609',
			area: 'Příbram',
			geo: [[13.998945, 49.685432]],
			reason: 'Protože mi to přináší radost! Líbí se mi podporovat tenhle ojedinělý projekt, který vede lidi k tomu, co je opravdu důležité: radost, víra v dobro, štědrost...',
			story: 'O Hearth.net jsem se dozvěděla v knize TVARYTMY od Jaroslava Duška. Ihned jsem se zaregistrovala a&nbsp;změnilo mi to život – začala jsem poznávat spoustu skvělých lidí, cokoli přijímat i darovat. Jako první jsem navštívila kurz jógy smíchu a&nbsp;to byl zážitek. Díky Hearth.net jsem navázala několik krásných přátelství.',
		},
		{ 
			realName: 'Jana Vlčková',
			id: '526ea249924b430200000018',
			area: 'Příbram',
			geo: [[13.998945, 49.685432]],
			reason: 'Myšlenka Hearthu se mnou souzní, vlastně jsem se tak chovala ještě dřív, než Hearth.net začal existovat. Šířím principy a&nbsp;myšlenky Hearthu ve svém okolí a&nbsp;jdu příkladem. Již 3. rok se podílím na účasti Hearth.net na místí velké akci Korzo Obora. Nápadů mám spoustu, ale bohužel mi zatím chybí více času.',
			story: 'Jelikož ráda čtu příběhy úspěšných podnikatelů, tak jsem sledovala profesní dráhu Libora Malého a&nbsp;když o&nbsp;něm vyšel článek v časopise, že založil Hearth, hned jsem se zaregistrovala a&nbsp;stala se aktivním členem. Poznala jsem několik skvělých lidí, s kterými se stále přátelím. Za obohacující dar považuji právě ta nová přátelství a&nbsp;seznámení se se zajímavými novými lidmi a&nbsp;dále radost z darů, které jsem věnovala.',
		},
		{ 
			realName: 'Kamila Rubešová',
			id: '5540744e6536390007680000',
			area: 'Kozomín, Středočeský kraj',
			geo: [[14.371115, 50.236819]], /**/
			reason: 'Ráda šířím dobro, pomáhání, štědrost a&nbsp;vzájemné sdílení. V naší prodejně mám koutek s plackama Hearth, taky sdílení semínek – Semínkovnu, v srpnu oslavíme rok od otevření a miniknihovnu – knížky o bylinkách a včelách. Pokud jedu se stánkem na akci, kde se to svým zaměřením hodí, tak beru placky a semínka s sebou. ',
			story: 'Poznala jsem tady hodně zajímavých lidí, se kterými jsem stále v kontaktu, ale je jasné, že ne s každým si člověk padne kolem krku. Před vánoci jsem připravila sbírku dárků pro maminky do azylového domu v Kralupech, zapojila se i děvčata z Hearth.net – Julka, Inka, Linda, Petra. Linda navíc připravila pro maminky motivační přednášku a&nbsp;líčení a&nbsp;fotografování. Hearth.net pro mne není jen o&nbsp;předávání hmotných věcí, ale zejména předání informací, znalostí a&nbsp;energie. a&nbsp;ujištění, že je tady hodně lidí, kteří mají vidění světa podobné jako já a&nbsp;nejsem v tom sama.',
		},
		{ 
			realName: 'Linda Kubačáková',
			id: '577ec345cc7d2900060007a3',
			area: 'Roztoky u Prahy, Středočeský kraj',
			geo: [[14.397612, 50.158416]],
			reason: 'Protože chci',
			story: 'Propaguji Hearth.net kde můžu – pomáhám při jejich prezentacích, dále na svých akcích, školeních, seminářích, na Fóru žen, svém webu atp. Plánuji založit vlastní nadaci Time4change na pomoc ženám, které se ocitly v tíživé životní situaci a potřebují jak finanční pomoc, tak psychickou podporu a mentoring.',
		},
		{ 
			realName: 'Lucie Slouková',
			id: '57e57f238b5fbc000a32bca7',
			area: 'Kralupy nad Vltavou',
			geo: [[14.310645, 50.241645]],
			reason: 'Ambasadorem Hearth.net jsem, protože se mi líbí šířit myšlenku sdílení, udržitelnosti a&nbsp;vytváření radosti. Jsem milovnice bazarů, second-handů, antiků. Člověk tam najde většinu věcí, které si chce pořídit. Ovšem za zlomek ceny. V druhé řadě pak takovýmto nákupem nevytváří další nešetrnou průmyslovou stopu. No a&nbsp;nesmíme opomenout ani na chemii, která je z takového trička z druhé ruky už několikrát opraná. a&nbsp;stejná pozitiva mají i hmotné dary na tržišti Hearth.net. Co se týká darování a&nbsp;přijímání umů a&nbsp;zkušeností, nejde pak jen o&nbsp;nově nabytou dovednost či posekání zahrady, ale i o&nbsp;potkávání inspirujících lidí, poznávání míst a&nbsp;vytváření zážitků. a&nbsp;s tím vším velice sympatizuji.',
			story: 'Velice mě potěšila mladá paní, jenž nám darovala klávesy. Můj muž párkrát vyprávěl, jak rád by na ně hrál, a&nbsp;dcerka je poměrně muzikální, a&nbsp;tak věřím, že díky této milé dámě bude naše rodina svůj hudební talent rozvíjet, a&nbsp;jednou dceři povyprávíme, kde se vlastně u nás tehdá to piano vzalo:-)',
		},
		{ 
			realName: 'Michal Čagánek',
			id: '521f5b5ab8f421d7200042e8',
			area: 'Praha a&nbsp;Zlínský kraj',
			geo: [[14.4378, 50.075538], [17.772035, 49.216230]],
			reason: 'Kvůli síti krásných lidí, se kterými je radost se setkávat, spolupracovat a&nbsp;společně šířit myšlenky štědrosti.',
			story: 'Hearth.net používám od jeho vzniku. Za tu dobu jsem ho využil bezpočetněkrát k nabízení i přijímání darů. Jedním z nejkrásnějších darů, které jsem přijal, je spolupráce s grafikem Petrem Lozanem. Ten se mi přihlásil na moji poptávku týkající se vytvoření obalu na mé CD. Obal jsme společně vytvořili. Necelý rok na to jsme společně formou oboustranného daru realizovali můj román Plyšový Buddha. Petr mi pomohl s grafikou, já jsem mu pomohl realizovat jeho sen vysázet si krásnou knihu. Nádavkem mi ještě ke knize vytvořil krásné záložky a&nbsp;pohlednice. Skutečně nádherná tvůrčí spolupráce.',
		},
		{ 
			realName: 'Monika a&nbsp;Michal Sabáčkovi',
			id: '550d9688626337000b070000',
			area: 'Liberecký kraj',
			geo: [[14.763242, 50.659424]],
			reason: 'Patrně pro určité přesvědčení a vnitřní nastavení... Z radosti ze života, neboť je vzácný a už vůbec ne samozřejmý:-).',
			story: 'Letos jsme pomohli s prezentací Hearth.net na Svatojánských slavnostech na Vlčí hoře. Nicméně poselství Hearth.net, které je též naší podstatou-cítěním, předáváme každý den světu - laskavým slovem i činy, v těch nejobyčejnějších "samozřejmostech" běžného dne...',
		},
		{ 
			realName: 'Oldřich Kahoun',
			id: '5717eeba5f0c66000b0003f7',
			area: 'Židlochovice, Brno-venkov',
			geo: [[16.618811, 49.039524]],
			reason: 'Je v souladu s mojí vizí „spojovat lidi a&nbsp;rozdávat přitom radost pro lepší svět“.',
			story: 'Na Hearth.net jsem přišel při svém hledání vize v lese. Řekl jsem si, že když už tu cestu někdo absolvuje, že je lepší jít s ním než vytvářet cestu jinou.',
		},
		{ 
			realName: 'Petra Fuksová',
			id: '5643940fd4ab910007000094',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Kvůli dobrému pocitu z pomoci, smysluplnému naplnění volného času, poznávání lidí se stejnými či podobnými názory na život, zájmy a&nbsp;jiné. Vítám nováčky a jsem jejich prvním průvodcem na Hearth.net. Představuji Hearth.net lidem jako dobrovolník na stánku na festivalech a jiných akcích.',
			story: 'Nikde není tak lehké jako zde být obklopen lidmi, kteří věří v dobrotu, jsou milí, laskaví, nevyčítají, nelžou, nezávidí si. ',
		},
		{ 
			realName: 'Petra Minářová',
			id: '52937e74a0d18e020000000b',
			area: 'Prostějov',
			geo: [[17.106751, 49.472449]],
			reason: 'Považuji za radost darovat čas, hmotné věci (a tím pádem šetřit životní prostřední). Vytvářet láskyplné prostředí mi prostě připadá smysluplné... a&nbsp;setkávat se s lidmi, kteří už nejsou tak chyceni v systému mě nabíjí a&nbsp;dělá mi radost.',
			story: '',
		},
		{ 
			realName: 'Radek Horák',
			id: '55e9ed53a98f56000700390a',
			area: 'Vsetín',
			geo: [[17.993852, 49.338925]],
			reason: 'Protože tak platformu sdílení a&nbsp;ekonomiky daru nemusím vymýšlet znovu a&nbsp;sám. Pro podporu myšlenky změny v přístupu ke zdrojům pro uspokojování životních potřeb – změna paradigma. Pro možnost prosazovat nezištný přístup v praxi s podporou internetové platformy a&nbsp;existující komunity. Připravuji presentace pro veřejnost formou povídání, besedy. V rámci Hearth.net mám místní komunitu ve Zlínském kraji. Snažím se o osobní příklad nezištného přístupu v běžném životě a praxi',
			story: 'Životní zkušenosti mě přivedly do stavu, kdy jsem si uvědomil, že tržní ekonomický systém nemůže ze své podstaty vytvářet podmínky pro dlouhodobou prosperitu lidské společnosti, ani zajistit trvalou ochranu přírody, životního prostředí a&nbsp;přírodních zdrojů. Zjistil jsem, že teoreticky už existují návrhy na jiné ekonomické modely společnosti.',
		},
		{ 
			realName: 'Renata Handlová',
			id: '54661ad33934660002000000',
			area: 'Milín, Středočeský kraj',
			geo: [[14.046003, 49.631928]],
			reason: 'Baví mě podporovat smysluplné projekty a&nbsp;šířit poselství Hearth.net.',
			story: 'Libora Malého znám z dob, kdy jsem pracovala pro jeho společnost LMC. Pro mě je to výjimečný člověk, takže když jsem zaslechla o&nbsp;jeho projektu Hearth.net, vzbudilo to mou zvědavost. Nejdříve jsem byla jen v pozici dárce, protože tehdy jsem ještě neuměla přijímat dary a&nbsp;pomoc od druhých lidí. Po nějaké době jsem v rámci svého působení v dobrovolnickém centru požádala o&nbsp;pomoc s tvorbou vánočních balíčků pro pacienty LDN a&nbsp;pak už jsem postupně přijímala dary i pro sebe. Největším darem, který mi Hearth.net přinesl, je výjimečné přátelství, kterého si nesmírně vážím. o&nbsp;jeden z mých prvních darů projevila zájem členka Hearth.net z mého blízkého okolí a&nbsp;po předání daru se postupně utvářelo naše přátelství, které upevnilo mimo jiné i naše společné úsilí o&nbsp;šíření poselství Hearth.net na Příbramsku.   ',
		},
		{ 
			realName: 'Viktor Hes',
			id: '54394e3165363700020c0000',
			area: 'Praha',
			geo: [[14.4378, 50.075538]],
			reason: 'Projekt Hearth.net se mi osvědčil jako dobrá cesta při socializování se a poznávání lidí, kteří mne mohou posunout dál, ale i k lidem, které mohu inspirovat já a dělám to ze srdce rád. V takovém konceptu dobrosrdečného, komunitního prostředí, bez tržních principů se jako člověk tišší a plašší povahy cítím lépe. ',
			story: 'Pomáhám Hearth.net jako dobrovolník na akcích, připravil jsem také workshop řezání lupénkovou pilkou na letní setkání se sdílením u Vltavy. Sdílet a propojovat lidi, tvořit soulad bych chtěl i dále. Máš akustický hudební nástroj či zpěv jako koníčka? Ozvi se a pojď s námi tvořit přátelskou atmosféru, chystám totiž v Praze na řadu malých hudebních událostí - muzicírování v parku pro radost. Ve změti darů a přání mne, je to už pár let zpět, zaujala Ingrid, kterou jsem tehdy osobně neznal. Její inzeráty s věnováním modlitby, čtyřlístků pro štěstí, sdílení se mlčky i slovem mne podnítily k tomu, že jsem jí pozval do čajovny. Bylo to milé setkání se skromnou a dobrosrdečnou osůbkou, která mne i přes to, že jí život uštědřil nejednu ránu, udivuje svou vůlí k životu.',
		},
		{ 
			realName: 'Petr Noščák',
			id: '53f5cc1e6232300002080000',
			area: 'Liberec, Liberecký kraj',
			geo: [[14.763242, 50.659424], [15.054339, 50.766280]],
			reason: 'Rád tuto myšlenku šířím dál, ve větší skupině je větší síla! ',
			story: 'Před pár měsíci jsem pozval Honzu Dolínka z Hearth.net do Liberce, aby profesionálně představil Hearth.net na akci Nazdar Bazar, kterou pravidelně připravuji. Honza vystřihnul luxusní povídání, rozpravu a&nbsp;mě spadla čelist. Prostě vtipné, energetické, vyvážené (ne vše je růžové…) povídání. a&nbsp;i přesto, že jsem v Hearth.net delší dobu, dozvěděl jsem se mnoho zajímavých věcí. Nebo spíše jsem si věci lépe pospojoval a&nbsp;pochopil…  Určitě  nejsilnější zážitek s Hearth.net.',
		},
		{ 
			realName: 'Jakub Beníšek',
			id: '55d77753cd9a4d0007000407',
			area: 'Planiny (Nové Mitrovice), CHKO Brdy',
			geo: [[13.693037, 49.603882]],
			reason: 'Hearth.net považuji za krásný a&nbsp;funkční nástroj pro šíření nového řádu, ráje na Zemi, který se již pár let postupně vlévá do připravených lidských srdcí, hlav i rukou. Jsem si vědom, že to, co nás čeká, je obrovská změna. Proto je třeba se dobrovolně vzdát všech strachů i „jistot“ současné doby, které jakoukoli změnu automaticky brzdí a&nbsp;připravit se na (již probíhající) masové přeprogramování lidských hodnot (proměnných) každého života-chtivého jedince. Hearth.net je parta „neběžných“ lidí, kteří vidí své současné Teď i soustavu společných budoucích Teď prostě jednodušší, štědřejší, radostnější, šťastnější a&nbsp;celkově výrazně smysluplnější. Je třeba to žít a&nbsp;předvádět v praxi, tak to zkouším ;-)',
			story: 'Hearth.net jsem objevil zcela klasicky – čili „náhodou“, když jsem vizionařil a&nbsp;hledal na internetu informace, právní aspekty a&nbsp;daňové dopady k fenoménu jménem Dar. Je to jeden z klíčů od Ráje… Srdce mi zaplesalo, když jsem zjistil, že už „to“ „je“ formou aplikace Hearth.net. Díky za Vás! Každý dar obohatí :-), každé přání se může splnit (pozor na to:-)), každé setkání je příběh, kdy se potkají originální reality a&nbsp;mohou společně prožít soustavu Teď, obohatit se navzájem… Stojí to za to! Víc se sem nevejde, je toho minimálně na celovečerák :-))) Zdááár z Pralesa!',
		},
		{ 
			realName: 'Ivonka Ušelová',
			id: '55201b576164640007280000',
			area: 'Praha, středočeský kraj, Zlínsko',
			geo: [[14.4378, 50.075538],[17.662763, 49.224437]],
			reason: 'Líbí se mi nová perspektiva, kterou mi Hearth.net vnesl do každodenního života – totiž více pospolitosti a&nbsp;vzájemného obohacování se díky sdílení. Vědomí, že jsme obklopeni spoustou skvělých lidí, o&nbsp;které se můžeme kdykoliv opřít, současně sami být oporou či inspirací potřebným – stačí se jen nebát důvěřovat a&nbsp;otevřít srdce, rozšířit okruh blízkých mimo zdi domova.',
			story: 'Skrze drobné dary jsem poznala spoustu skvělých lidí, což mě posouvá dál. Co se materiálního daru týče, nej dárek byla žehlička, o&nbsp;kterou jsem zažádala a&nbsp;do 5 minut jsem ji už měla od kamarádky bydlící v naší ulici. Také spousta nehmotných darů a&nbsp;informací zde mě obohatila. Velmi si například cením možnosti pobývat na domečku v přírodě, který nám majitel propůjčil na dobu své nepřítomnosti. Mile mě hřeje u srdce, když si dá někdo na předání daru pro „cizího“ člověka záležet – s láskou a&nbsp;pozorností připravený balíček, který jsem nejednou dostala, dává znát, že žijeme v přátelském světě s velkými možnostmi a&nbsp;začínáme si to připouštět. Sama jsem pak snad vnesla trošku naděje do srdce paní, která můj nepoužívaný pareo šátek využila na terapie po úmrtí syna. Dlouho jsme si povídaly na ulici, dala mi nahlédnout do duše a&nbsp;jsem jí za to vděčná.',
		},
		{ 
			realName: 'Pavla Kohoutová',
			id: '526513019044a7020000001e',
			area: 'Praha, Pelhřimovsko',
			geo: [[14.4378, 50.075538], [15.222983, 49.430621]],
			reason: 'Jsem součástí interního týmu Hearth.net, koordinátorkou ambasadorů, dobrovolníků a produkční off-line prezentací Hearth.net, pečuji o uživatele. Mám ráda komunitu, společenství lidí, kteří mají stejný směr.',
			story: 'Když jsem Hearth.net „náhodou“ objevila, byla jsem nadšená z toho, že tohle fakt funguje! Že už existuje, co jsem vždycky cítila, že jsme všichni jedna rodina, že jsme propojení, podporujeme se, pomáháme si, zkrátka jsme „na stejné lodi“. Nadšeně jsem se zapojila a po roce přišel newsletter s poptávkou člověka do týmu, který přesně popisoval mě... a výsledek už znáte. Od té doby se zájmem pozoruji lidské příběhy štědrosti, laskavosti, někdy i smutku a naštvání, všechno, co k životu patří, a jsem ráda, že můžu Hearth.net pomáhat objevit dalším lidem.',
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



	function getLocalities(callback) {
		this.getList(function (data) {

			var newData = [];
			data.forEach(function (single) {
				if (single.geo.length == 1) {
					newData.push(angular.extend({}, single, { locality: single.geo[0] }));
				} else if (single.geo.length == 2) {
					newData.push(angular.extend({}, single, { locality: single.geo[0] }));
					newData.push(angular.extend({}, single, { locality: single.geo[1] }));
				} else {}
			});
			callback(newData);
		});
	}

	// Module interface
	return {
		getList: getList,
		getLocalities: getLocalities
	}

}])
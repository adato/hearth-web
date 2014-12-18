var $$config;

$$config = {
	apiPath: '/api',
	gApiKey: 'AIzaSyDArE48iXuR16XEp8zEUDo4g6E7GSqGJgc',
	fbAppId: '277542219089599', // production
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	fbAppId: '277542219089599', // production
	defaultLanguage: 'cs',
	defaultUserAvatar: 'images/no-avatar.jpg',
	defaultCommunityAvatar: 'images/no-cm-avatar.jpg',
	sharingEndpoints: {
		facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
		gplus: 'https://plus.google.com/share?url=',
		twitter: 'https://twitter.com/share?url=',
		linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url='
	},
	languages: ["cs", "en", "preklady"],
	features: {
		aboutPage: false,
		searchImage: false,
		german: false,
		follow: true,
		myHearth: true,
		myHearthSearch: true,
		searchTypeahead: true,
		deleteAccount: true,
		uploadFiles: false,
		newCreateEditForm: false
	}
};

// copy data from localConfig
// if($$localConfig) {
// 	for(var key in $$localConfig) $$config[key]=$$localConfig[key];
// }

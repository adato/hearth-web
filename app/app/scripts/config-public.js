var $$config;

$$config = {
	apiPath: '/api',
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	defaultLanguage: 'cs',
	defaultUserImage: 'images/no-avatar.png',
	sharingEndpoints: {
		facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
		gplus: 'https://plus.google.com/share?url=',
		twitter: 'https://twitter.com/share?url=',
		linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url='
	},
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
if($$localConfig) {
	for(var key in $$localConfig) $$config[key]=$$localConfig[key];
}

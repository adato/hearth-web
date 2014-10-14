var $$config;

$$config = {
	apiPath: '/api',
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	defaultLanguage: 'cs',
	defaultUserImage: 'images/no-avatar.png',
	gApiKey: 'AIzaSyDArE48iXuR16XEp8zEUDo4g6E7GSqGJgc',
	// fbAppId: '277542219089599', // production
	fbAppId: '769756073037691', // staging
	fbAppId: {
				facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
				gplus: 'https://plus.google.com/share?url=' + url,
				twitter: 'https://twitter.com/share?url=' + url,
				linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url
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
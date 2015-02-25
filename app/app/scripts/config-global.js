var $$config;

$$config = {
	appUrl: window.location.origin+window.location.pathname,
	apiPath: '/api',
	fbAppId: '1495788017321716', // dev
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	defaultLanguage: 'cs',
	defaultUserAvatar: 'images/no-avatar.jpg',
	defaultCommunityAvatar: 'images/no-cm-avatar.jpg',
	sharingEndpoints: {
		facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
		gplus: 'https://plus.google.com/share?url=',
		twitter: 'https://twitter.com/share?url=',
		linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url='
	},
	activitiesIcons: ["new_post", "edit_post", "new_reply", "resume_post"],
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

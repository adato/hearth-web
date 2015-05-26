var $$config;

$$config = {
	basePath: '/app/',
	appUrl: window.location.origin + '/app/',
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	defaultLanguage: 'cs',
	fbSharing: {
		minWidth: 200,
		minHeight: 200
	},
	defaultHearthImage: 'images/facebook-sharing-image.png',
	defaultHearthImageSize: [600, 600],
	defaultHearthImageWidth: 600,
	defaultHearthImageHeight: 600,
	defaultUserAvatar: 'images/no-avatar.jpg',
	defaultCommunityAvatar: 'images/no-cm-avatar.jpg',
	sharingEndpoints: {
		facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
		gplus: 'https://plus.google.com/share?url=',
		twitter: 'https://twitter.com/share?url=',
		linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url='
	},
	activitiesIcons: {
		new_post: 'new_post',
		community_new_post: 'new_post',
		edit_post: 'edit_post',
		new_reply: 'new_reply',
		prolong_post: 'resume_post',
		resume_post: 'resume_post',
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

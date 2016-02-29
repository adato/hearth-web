var $$config;

$$config = {
	basePath: '/app/',
	appUrl: window.location.origin + '/app/',
	modalTemplates: 'templates/modal/',
	templates: 'templates/',
	lengthUnit: 'km',
	defaultLanguage: 'en',
	maxImagesSize: 6, // max size of all attached images in MB
	fbSharing: {
		minWidth: 200,
		minHeight: 200
	},
	defaultMapLocation: [50.075977, 14.426142],
	imgMaxPixelSize: 1024,
	defaultHearthImage: 'images/facebook-sharing-image.jpg',
	defaultHearthImageSize: [1200, 630],
	defaultHearthImageWidth: 1200,
	defaultHearthImageHeight: 630,
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
		suspend_post: 'suspend_post',
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
	},
	itemAddresses: {
		"Community": "community",
		"User": "profile",
		"Post": "post",
		"Conversation": "messages",
	},
	postTypes: {
		User: {
			need: 'DOES_WISH',
			offer: 'DOES_GIVE',
			false: 'DOES_WISH',
			true: 'DOES_GIVE'
		},
		Community: {
			need: 'WE_NEED',
			offer: 'WE_OFFER',
			false: 'WE_NEED',
			true: 'WE_OFFER'
		}
	},
	replyLabels: {
		offer: 'WISH_GIFT',
		need: 'OFFER_GIFT'
	},
	replyCountTexts: {
		offer: 'PEOPLE_COUNT_WISH_PL',
		need: 'PEOPLE_COUNT_OFFER_PL'
	}
};

// copy data from localConfig
if ($$localConfig) {
	for (var key in $$localConfig) $$config[key] = $$localConfig[key];
}

var _rollbarConfig = {
	accessToken: $$config.rollbar,
	captureUncaught: true,
	payload: {
		environment: $$config.env
	},
	enable: ["0.0.0.0", '127.0.0.1', 'localhost'].indexOf(window.location.hostname) < 0
};
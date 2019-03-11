window['$$config'] = {
	basePath: '/app/',
	appUrl: window.location.origin + '/app/',
	imgUrl: '/app/assets/img',
	modalTemplates: 'assets/modals/',
	staticTemplatesRoute: 'assets/locales/',
	lengthUnit: 'km',
	defaultLanguage: 'en',
	maxImagesSize: 6, // max size of all attached images in MB
	fbSharing: {
		minWidth: 200,
		minHeight: 200
	},
	defaultMapLocation: [50.075977, 14.426142],
	imgMaxPixelSize: 1024,
	defaultHearthImage: 'assets/img/facebook-sharing-image.jpg',
	defaultHearthImageSize: [1200, 630],
	defaultHearthImageWidth: 1200,
	defaultHearthImageHeight: 630,
	defaultUserAvatar: 'assets/img/no-avatar.jpg',
	defaultCommunityAvatar: 'assets/img/no-cm-avatar.jpg',
	sharingEndpoints: {
		facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
		facebook_invite: 'https://www.facebook.com/share.php?u=',
		twitter: 'https://twitter.com/share?url=',
		linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url='
	},
	shortLinkGeneratorUrl: 'https://go.hearth.net/',
	shortLinkAccessUrl: 'https://hearth.net/groups/',
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
	policy: {
		SIGNED_IN: 'SIGNED_IN',
		UNAUTH: 'UNAUTH',
		ADMIN: 'ADMIN'
	},
	postTypes: {
		User: {
			gift: {
				need: 'NEED',  		 // POST.I.NEED
				offer: 'OFFER'		 // POST.I.OFFER
			},
			loan: {
				need: 'BORROW', 	 // POST.I.BORROW
				offer: 'LEND'   	 // POST.I.LEND
			},
			any: {
				need: 'NEED_BORROW', // POST.I.NEED_BORROW
				offer: 'OFFER_LEND'  // POST.I.OFFER_LEND
			},
			need: 'DOES_WISH',		 // POST.I.NEED
			offer: 'DOES_GIVE',		 // POST.I.OFFER
			false: 'DOES_WISH',		 // POST.I.NEED
			true: 'DOES_GIVE'		 // POST.I.OFFER
		},
		Community: {
			gift: {
				need: 'WE_NEED',	 // POST.WE.NEED
				offer: 'WE_OFFER'	 // POST.WE.OFFER
			},
			loan: {
				need: 'WE_BORROW',	 // POST.WE.BORROW
				offer: 'WE_LEND'	 // POST.WE.LEND
			},
			any: {
				need: 'WE_NEED_BORROW',	// POST.WE.NEED_BORROW
				offer: 'WE_OFFER_LEND'  // POST.WE.OFFER_LEND
			},
			need: 'WE_NEED',		 // POST.WE.NEED
			offer: 'WE_OFFER',		 // POST.WE.OFFER
			false: 'WE_NEED',		 // POST.WE.NEED
			true: 'WE_OFFER'		 // POST.WE.OFFER
		}
	},
	postCharacter: [{
		name: 'energy',
		translate: 'CATEGORY_ENERGY',			// POST.CATEGORY.ENERGY.LABEL
		translateText: 'CATEGORY_ENERGY_TEXT'	// POST.CATEGORY.ENERGY.TEXT
	}, {
		name: 'mass',
		translate: 'CATEGORY_MASS',				// POST.CATEGORY.MASS.LABEL
		translateText: 'CATEGORY_MASS_TEXT'		// POST.CATEGORY.MASS.TEXT
	}, {
		name: 'information',
		translate: 'CATEGORY_INFORMATION',		// POST.CATEGORY.INFORMATION.LABEL
		translateText: 'CATEGORY_INFORMATION_TEXT'	// POST.CATEGORY.INFORMATION.TEXT
	}],
	//
	// referrerCookieName:
	// name of a cookie used for invitation referrals and
	// url search attr used for sending referral tokens to API
	referrerCookieName: 'referrals',
	replyLabels: {
		offer: 'POST.ACTION_ASK_FOR_GIFT',
		need: 'POST.ACTION_OFFER_GIFT'
	},
	replyCountTexts: {
		offer: 'PEOPLE_COUNT_WISH_PL', 			// POST.X_PEOPLE_WISHED
		need: 'PEOPLE_COUNT_OFFER_PL'			// POST.X_PEOPLE_OFFERED
	},
	filterOptions: {
		default: ['market', 'keywords', 'character', 'postType', 'postTime', 'author', 'location', 'postLanguage', 'saveFilter'],
		search: ['fulltext', 'location', 'entityType']
	},
	usersNameList: {
		initNameLimit: 4
	}
};

// copy data from localConfig
if ($$localConfig) {
	for (var key in $$localConfig) $$config[key] = $$localConfig[key];
}

var $$versionNumber = 'LOCAL_VERSION';

var _rollbarConfig = {
	accessToken: $$config.rollbar,
	captureUncaught: true,
	payload: {
		environment: $$config.env,
		version: $$versionNumber,
	},
	enable: ["0.0.0.0", '127.0.0.1', 'localhost'].indexOf(window.location.hostname) < 0
};

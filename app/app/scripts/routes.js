angular.module('hearth').config([
	'$routeSegmentProvider', '$routeProvider',
	function($routeSegmentProvider, $routeProvider) {


		$routeSegmentProvider
			.when('/', 'market')
			.when('/search/?', 'search')
			.when('/ad/:id', 'ad')
			.when('/404', 'err404')
			.when('/setup', 'setup')
			.when('/terms', 'terms')
			.when('/about', 'about')
			.when('/feedback', 'feedback')
			// ... 
			.when('/register', 'reg')
			.when('/login', 'login')
			.when('/reset-password', 'reset-pass')
			.when('/forgotten-password', 'forgot-pass')
			.when('/confirmEmail', 'confirm-email')
			.when('/change-password', 'change-pass')

		.when('/profile/:id', 'profile')
			.when('/profile/:id/posts', 'profile.posts')
			.when('/profile/:id/communities', 'profile.communities')
			.when('/profile/:id/given-ratings', 'profile.given')
			.when('/profile/:id/received-ratings', 'profile.received')
			.when('/profile/:id/following', 'profile.following')
			.when('/profile/:id/activity-feed', 'profile.activities')
			.when('/profile/:id/followers', 'profile.followers')
			.when('/profile/:id/invite', 'profile.invite')

		.when('/profile-edit', 'profileEdit')
			.when('/profile-settings', 'profileSettings')

		.when('/communities/:action?', 'communities')
		// .when('/community/:id/:action?', 'community')
		// .when('/community-create', 'community-create')
		// .when('/profile/:id/:action', 'profile-action')
		// .when('/', '')
		.segment('market', {
			templateUrl: 'templates/market.html',
			controller: 'MarketCtrl',
			reloadOnSearch: false,
			disableCache: true,
			pageType: 'search'
		}).segment('search', {
			templateUrl: 'templates/fulltext.html',
			controller: 'FulltextCtrl'
		}).segment('reg', {
			templateUrl: 'templates/register.html',
			controller: 'RegisterCtrl'
		}).segment('login', {
			templateUrl: 'templates/login.html',
			controller: 'LoginCtrl',
			pageType: 'login'
		}).segment('confirm-email', {
			templateUrl: 'templates/confirmEmail.html',
			controller: 'ConfirmEmailCtrl'
		}).segment('change-pass', {
			templateUrl: 'templates/changePassword.html',
			controller: 'ChangePwdCtrl',
			access: 'private'
		}).segment('forgot-pass', {
			templateUrl: 'templates/forgottenPassword.html',
			controller: 'ForgottenPasswordCtrl'
		}).segment('reset-pass', {
			templateUrl: 'templates/resetPassword.html',
			controller: 'ResetPwdCtrl'
		}).segment('feedback', {
			templateUrl: 'templates/feedback.html',
			controller: 'FeedbackCtrl',
			pageType: 'feedback'
		}).segment('404', {
			templateUrl: 'templates/404.html'
		}).segment('setup', {
			templateUrl: 'templates/setup.html',
			controller: 'SetupCtrl'
		}).segment('terms', {
			controller: 'TermsCtrl',
			templateUrl: 'templates/terms.html'
		}).segment('about', {
			templateUrl: 'templates/about.html',
			pageType: 'about'
		}).segment('ad', {
			controller: 'ItemDetail',
			templateUrl: 'templates/itemDetail.html'
		}).segment('communities', {
			templateUrl: 'templates/communityList.html',
			controller: 'CommunityListCtrl',
			pageType: 'communities'

		}).segment('profileEdit', {
			templateUrl: 'templates/profile/editProfile.html',
			controller: 'ProfileEditCtrl',
			reloadOnSearch: false,
			pageType: 'profile'

		}).segment('profileSettings', {
			templateUrl: 'templates/profile/editSettings.html',
			controller: 'ProfileSettingsCtrl',
			reloadOnSearch: false,
			pageType: 'profile'

		}).segment('profile', {
			templateUrl: 'templates/profile/topPanel.html',
			controller: 'ProfileCtrl',
			reloadOnSearch: false,
			pageType: 'profile'
		})

		.within()

			.segment('home', {
				default: true,
				controller: 'ProfileDataFeedCtrl',
				templateUrl: 'templates/profile/home.html'
			})
			.segment('posts', {
				templateUrl: 'templates/profile/posts.html',
				controller: 'ProfileDataFeedCtrl',
				reloadOnSearch: false,
				dependencies: ['id']
			})
			.segment('given', {
				templateUrl: 'templates/profile/ratingsGiven.html',
				controller: 'ProfileDataFeedCtrl',
				reloadOnSearch: false,
				dependencies: ['id']
			})
			.segment('received', {
				templateUrl: 'templates/profile/ratingsReceived.html',
				controller: 'ProfileDataFeedCtrl',
				reloadOnSearch: false,
				dependencies: ['id']
			})
			.segment('communities', {
				templateUrl: 'templates/profile/communities.html',
				controller: 'ProfileDataFeedCtrl',
				reloadOnSearch: false,
				dependencies: ['id']
			})
			.segment('followers', {
				templateUrl: 'templates/profile/followers.html',
				controller: 'ProfileDataFeedCtrl',
				reloadOnSearch: false,
				dependencies: ['id']
			})
			.segment('following', {
				templateUrl: 'templates/profile/following.html',
				controller: 'ProfileDataFeedCtrl',
				dependencies: ['id']
			})
			.segment('activities', {
				templateUrl: 'templates/profile/activities.html',
				controller: 'ProfileDataFeedCtrl',
				dependencies: ['id']
			})

			.segment('invite', {
				templateUrl: 'templates/profile/invite.html',
				controller: 'ProfileInviteCtrl',
				dependencies: ['id']
			})
		$routeProvider.otherwise({
			redirectTo: '/'
		});

		// }).when('/community/:id/:action?', {
		//     templateUrl: 'templates/communityProfile.html',
		//     controller: 'CommunityProfileCtrl',
		//     pageType: 'community-profile',
		//     reloadOnSearch: false
		// }).when('/community-create', {
		//     templateUrl: 'templates/communityRegister.html',
		//     controller: 'CommunityRegisterCtrl',
		//     pageType: 'community-create'
		// }).when('/my', {
		//     templateUrl: 'templates/my.html',
		//     controller: 'SearchCtrl',
		//     reloadOnSearch: false,
		//     pageType: 'my'
		// }).when('/profile/:id/:action', {
		//     templateUrl: 'templates/profile.html',
		//     controller: 'ProfileCtrl',
		//     reloadOnSearch: false,
		//     pageType: 'profile'
	}
]);
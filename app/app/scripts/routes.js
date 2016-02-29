angular.module('hearth').config([
	'$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// delay routing - first load all dependencies (user session, translations)
		$urlRouterProvider.deferIntercept();
		$urlRouterProvider.rule(function($injector, $location) {

			var re = /(.+)(\/+)(\?.*)?$/
			var path = $location.url();

			if (re.test(path)) {
				return path.replace(re, '$1$3')
			}
			return false;
		});

		$stateProvider
			.state('market', {
				url: '/?query&type',
				templateUrl: 'templates/market.html',
				controller: 'MarketCtrl',
			})
			.state('market-old', {
				url: '/old',
				templateUrl: 'templates/_market.html',
				controller: '_MarketCtrl',
			})
			.state('market-refresh', {
				url: "/market",
				controller: ['$location', function($location) {
					$location.path('/'); // just for refresh purposes
				}],
			})
			.state('map', {
				url: '/map',
				templateUrl: 'templates/map.html',
				controller: 'MapCtrl',
			})
			.state('communities', {
				abstract: true,
				url: "/communities",
				templateUrl: 'templates/community/communities.html',
				controller: 'CommunitiesCtrl'
			})
			.state('communities.suggested', {
				url: "",
				templateUrl: 'templates/community/communityList.html',
				controller: 'CommunityListCtrl'
			})
			.state('communities.all', {
				url: "/all",
				templateUrl: 'templates/community/communityList.html',
				controller: 'CommunityListCtrl'
			})
			.state('reset-pass', {
				url: '/reset-password',
				templateUrl: 'templates/userForms/resetPassword.html',
				controller: 'ResetPwdCtrl'
			})
			.state('forgot-pass', {
				url: '/forgotten-password',
				templateUrl: 'templates/userForms/forgottenPassword.html',
				controller: 'ForgottenPasswordCtrl'
			})
			.state('token-login', {
				url: '/token-login/:token',
				controller: 'TokenLoginCtrl'
			})
			.state('fill-email', {
				url: '/fill-email/:token',
				templateUrl: 'templates/userForms/fillEmail.html',
				controller: 'FillEmailCtrl'
			})
			.state('confirm-email', {
				url: '/confirm-email',
				templateUrl: 'templates/userForms/confirmEmail.html',
				controller: 'ConfirmEmailCtrl'
			})
			.state('login', {
				url: '/login',
				templateUrl: 'templates/userForms/login.html',
				controller: 'LoginCtrl'
			})
			.state('reg', {
				url: '/register?facebook',
				templateUrl: 'templates/userForms/register.html',
				controller: 'RegisterCtrl'
			})
			.state('search', {
				url: '/search?query',
				templateUrl: 'templates/fulltext.html',
				controller: 'FulltextCtrl'
			})
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'templates/feedback.html',
				controller: 'FeedbackCtrl'
			})
			.state('faq', {
				url: '/faq',
				templateUrl: 'templates/localizationPage.html',
				controller: 'StaticPageCtrl'
			})
			.state('taxes', {
				url: '/taxes',
				templateUrl: 'templates/localizationPage.html',
				controller: 'StaticPageCtrl'
			})
			.state('terms', {
				url: '/terms',
				templateUrl: 'templates/localizationPage.html',
				controller: 'StaticPageCtrl'
			})
			.state('new-terms', { // duplicate of previous, redirected to classic terms, keep for some time, then remove pls
				url: '/new-terms',
				templateUrl: 'templates/terms.html',
				controller: 'TermsCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'templates/terms.html',
				controller: 'TermsCtrl'
			})
			.state('components', {
				url: '/components',
				templateUrl: 'templates/components.html',
				controller: 'ComponentsCtrl'
			})
			.state('ad', {
				url: '/ad/:id',
				controller: 'ItemDetailOld'
			})
			.state('post', {
				url: '/post/:id',
				templateUrl: 'templates/itemDetail.html',
				controller: 'ItemDetail'
			})
			.state('messages', {
				title: 'messages.0',
				url: '/messages',
				templateUrl: 'templates/messages/list.html',
				controller: 'MessagesCtrl'
			})
			.state('messages.detail', {
				titleIgnore: true,
				url: '/:id',
				template: '<div>abcd dbawdwd</div>'
			})
			.state('profile', {
				title: false,
				abstract: true,
				url: '/profile/:id',
				templateUrl: 'templates/profile/profile.html',
				controller: 'ProfileCtrl',
			})
			.state('profile.default', {
				title: false,
				url: '',
				controller: 'ProfileDataFeedCtrl',
				templateUrl: 'templates/profile/subviews/home.html',
			})
			.state('profile.subview', {
				title: false,
				url: '/{page}',
				controller: 'ProfileDataFeedCtrl',
				templateUrl: function($stateParams) {
					var pages = ['activities', 'given-ratings', 'received-ratings', 'communities', 'friends', 'followers', 'following', 'posts', 'replies', 'bookmarks'];
					var tplPath = 'templates/profile/subviews/';
					if (!~pages.indexOf($stateParams.page))
						$stateParams.page = 'home';
					return tplPath + $stateParams.page + '.html';
				}
			})
			.state('profileEdit', {
				url: '/profile-edit',
				templateUrl: 'templates/profile/edit.html',
				controller: 'ProfileEditCtrl',
			})
			.state('profileSettings', {
				url: '/profile-settings',
				templateUrl: 'templates/profile/editSettings.html',
				controller: 'ProfileSettingsCtrl',
			})
			.state('communityEdit', {
				url: '/community/:id/edit',
				templateUrl: 'templates/community/editCommunity.html',
				controller: 'CommunityCreateCtrl',
			})
			.state('community', {
				abstract: true,
				url: '/community/:id',
				templateUrl: 'templates/community/profile.html',
				controller: 'CommunityProfileCtrl',
			})
			.state('community.default', {
				title: false,
				url: '',
				controller: 'CommunityDataFeedCtrl',
				templateUrl: 'templates/community/subviews/home.html',
			})
			.state('community.subview', {
				title: false,
				url: '/{page}',
				controller: 'CommunityDataFeedCtrl',
				templateUrl: function($stateParams) {
					var pages = ['activity', 'members', 'given-ratings', 'received-ratings', 'applications', 'about', 'posts'];
					var tplPath = 'templates/community/subviews/';

					if (!~pages.indexOf($stateParams.page))
						$stateParams.page = 'home';
					return tplPath + $stateParams.page + '.html';
				}
			})
			.state('error404', {
				templateUrl: 'templates/error404.html',
				controller: 'Error404Ctrl'
			});

		$urlRouterProvider.otherwise(function($injector, $location) {
			var state = $injector.get('$state');
			state.go('error404');
			return $location.path();
		});
	}
]);
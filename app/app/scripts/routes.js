angular.module('hearth').config([
	'$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		// delay routing - first load all dependencies (user session, translations)
		$urlRouterProvider.deferIntercept();
		$urlRouterProvider.rule(function ($injector, $location) {

		    var re = /(.+)(\/+)(\?.*)?$/
		    var path = $location.url();

		    if(re.test(path)) {
		        return path.replace(re, '$1$3')
		    }

		    return false;
		});

		// For any unmatched url, redirect to /state1
		// $urlRouterProvider.otherwise("/error404");
		//
		// Now set up the states
		$stateProvider
			.state('market', {
				url: '/',
				templateUrl: 'templates/market.html',
				controller: 'MarketCtrl',
			})
			.state('map', {
				url: '/map',
				templateUrl: 'templates/map.html',
				controller: 'MapCtrl',
			})
			.state('market-refresh', {
				url: "/market",
				controller: ['$location', function($location) {
					$location.path('/'); // just for refresh purposes
				}],
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
				url: '/register',
				templateUrl: 'templates/userForms/register.html',
			    controller: 'RegisterCtrl'
			})
			.state('search', {
				url: '/search?q',
				templateUrl: 'templates/fulltext.html',
			    controller: 'FulltextCtrl'
			})
			.state('feedback', {
				url: '/feedback',
				templateUrl: 'templates/feedback.html',
			    controller: 'FeedbackCtrl'
			})
			.state('terms', {
				url: '/terms',
				templateUrl: 'templates/terms.html',
			    controller: 'TermsCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'templates/terms.html',
			    controller: 'TermsCtrl'
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
				url: '/messages',
				templateUrl: 'templates/messages/list.html',
	            controller: 'MessagesCtrl'
			})
			.state('messages.detail', {
				url: '/:id',
      			template: '<div>abcd dbawdwd</div>'
			})
			.state('profile', {
				abstract: true,
    			url: '/profile/:id',
				templateUrl: 'templates/profile/profile.html',
				controller: 'ProfileCtrl',
			})
			.state('profile.default', {
				url: '',
				controller: 'ProfileDataFeedCtrl',
				templateUrl: 'templates/profile/subviews/home.html',
			})
			.state('profile.subview', {
				url: '/{page}',
				controller: 'ProfileDataFeedCtrl',
				templateUrl: function ($stateParams) {
					var pages = ['activities', 'given-ratings', 'received-ratings', 'communities', 'friends', 'followers', 'following', 'posts', 'replies'];
					var tplPath = 'templates/profile/subviews/';

					if(!~pages.indexOf($stateParams.page))
						$stateParams.page = 'home';
					return tplPath+$stateParams.page+'.html';
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
				url: '',
				controller: 'CommunityDataFeedCtrl',
				templateUrl: 'templates/community/subviews/home.html',
			})
			.state('community.subview', {
				url: '/{page}',
				controller: 'CommunityDataFeedCtrl',
				templateUrl: function ($stateParams) {
					var pages = ['activity', 'members', 'received-ratings', 'applications', 'about', 'posts'];
					var tplPath = 'templates/community/subviews/';

					if(!~pages.indexOf($stateParams.page))
						$stateParams.page = 'home';
					return tplPath+$stateParams.page+'.html';
			  	}
			})
			.state('error404', {
				templateUrl: 'templates/error404.html',
				controller: 'Error404Ctrl'
			});
			
		$urlRouterProvider.otherwise(function($injector, $location){
		   var state = $injector.get('$state');
		   state.go('error404');
		   return $location.path();
		});
	}
]);
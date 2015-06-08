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
				url: "/communities",
				templateUrl: 'templates/community/list.html',
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
		return;

			
			// ====== General routes
		$routeSegmentProvider
			.when('/', 'market')
			.when('/market', 'market-refresh')
			.when('/search/?', 'search')
			.when('/ad/:id', 'ad')
			.when('/post/:id', 'post')
			.when('/404', 'err404')
			.when('/terms', 'terms')
			.when('/taxes', 'taxes')
			.when('/faq', 'faq')
			.when('/feedback', 'feedback')
			
			// ======= User routes
			.when('/register', 'reg')
			.when('/login', 'login')
			.when('/reset-password', 'reset-pass')
			.when('/forgotten-password', 'forgot-pass')
			.when('/confirm-email', 'confirm-email')
			.when('/token-login/:token', 'token-login')
			.when('/fill-email/:token', 'fill-email')
			// .when('/change-password', 'change-pass')
			
			// ======= Profile routes & subroutes
			.when('/profile/:id', 'profile')
			.when('/profile/:id/feedback', 'profile-ratings-refresh')
			.when('/profile/:id/posts', 'profile.posts')
			.when('/profile/:id/communities', 'profile.communities')
			.when('/profile/:id/given-ratings', 'profile.given')
			.when('/profile/:id/received-ratings', 'profile.received')
			.when('/profile/:id/following', 'profile.following')
			.when('/profile/:id/activity-feed', 'profile.activities')
			.when('/profile/:id/followers', 'profile.followers')
			.when('/profile/:id/friends', 'profile.friends')
			.when('/profile/:id/invite', 'profile.invite')
			.when('/profile-edit', 'profileEdit')
			.when('/profile-settings', 'profileSettings')

			// ======= Messages & subroutes
			.when('/messages', 'messages')
			.when('/messages/new', 'messagesAdd')
			.when('/messages/:id', 'messages')
			
			// ======= Communities & subroutes
			.when('/communities', 'communityList')
			.when('/community-create', 'communityCreate')
			.when('/community/:id/edit', 'communityEdit')
			.when('/community/:id', 'community')
			.when('/community/:id/given-ratings', 'community.given')
			.when('/community/:id/received-ratings', 'community.received')
			.when('/community/:id/invite-friends', 'community.inviteFriends')
			.when('/community/:id/posts', 'community.posts')
			.when('/community/:id/members', 'community.members')
			.when('/community/:id/applications', 'community.applications')
			.when('/community/:id/about', 'community.about')
			.when('/community/:id/activity-feed', 'community.activity-feed')
			.when('/not-found', 'error404')

			// ====== Route settings =========
			.segment('market', {
				templateUrl: 'templates/market.html',
				controller: 'MarketCtrl',
				reloadOnSearch: false,
				disableCache: true,
				pageType: 'search'
			}).segment('profile-ratings-refresh', {
				controller: ['$location', '$stateParams', function($location, $stateParams) {
									$location.path('/profile/'+$routeParams.id+'/received-ratings'); // just for refresh purposes
								}],
				reloadOnSearch: false,
				disableCache: true,
			}).segment('market-refresh', {
				controller: ['$location', function($location) {
											$location.path('/'); // just for refresh purposes
										}],
				reloadOnSearch: false,
				disableCache: true,
			}).segment('search', {
				templateUrl: 'templates/fulltext.html',
				controller: 'FulltextCtrl'
			}).segment('reg', {
				templateUrl: 'templates/userForms/register.html',
				controller: 'RegisterCtrl'
			}).segment('login', {
				templateUrl: 'templates/userForms/login.html',
				controller: 'LoginCtrl',
				pageType: 'login'
			}).segment('confirm-email', {
				templateUrl: 'templates/userForms/confirmEmail.html',
				controller: 'ConfirmEmailCtrl'
			}).segment('taxes', {
				templateUrl: 'templates/localizationPage.html',
				controller: 'LocalizationPage'
			}).segment('faq', {
				templateUrl: 'templates/localizationPage.html',
				controller: 'LocalizationPage'
			}).segment('fill-email', {
				templateUrl: 'templates/userForms/fillEmail.html',
				controller: 'FillEmailCtrl'
			}).segment('token-login', {
				// templateUrl: 'templates/userForms/fillEmail.html',
				controller: 'TokenLoginCtrl'
			}).segment('forgot-pass', {
				templateUrl: 'templates/userForms/forgottenPassword.html',
				controller: 'ForgottenPasswordCtrl'
			}).segment('reset-pass', {
				templateUrl: 'templates/userForms/resetPassword.html',
				controller: 'ResetPwdCtrl'
			}).segment('feedback', {
				templateUrl: 'templates/feedback.html',
				controller: 'FeedbackCtrl',
				pageType: 'feedback'
			}).segment('404', {
				templateUrl: 'templates/404.html'
			}).segment('terms', {
				controller: 'TermsCtrl',
				templateUrl: 'templates/terms.html'
			}).segment('ad', {
				controller: 'ItemDetailOld',
			}).segment('post', {
				controller: 'ItemDetail',
				templateUrl: 'templates/itemDetail.html'
			}).segment('error404', {
				controller: 'Error404Ctrl',
				templateUrl: 'templates/error404.html'

			// ============ messages =============
			}).segment('messages', {
			    templateUrl: 'templates/messages/list.html',
			    controller: 'MessagesCtrl',
			    pageType: 'messages',
			}).segment('messagesAdd', {
			    templateUrl: 'templates/messages/add.html',
			    controller: 'AddMessageCtrl',
			    pageType: 'messages-add',

			}).segment('communityList', {
			    templateUrl: 'templates/community/list.html',
			    controller: 'CommunityListCtrl',
			    pageType: 'community-list',
			    reloadOnSearch: false
			}).segment('communityCreate', {
			    templateUrl: 'templates/community/editCommunity.html',
			    controller: 'CommunityCreateCtrl',
			    pageType: 'community-create',
			    reloadOnSearch: false
			}).segment('communityEdit', {
			    templateUrl: 'templates/community/editCommunity.html',
			    controller: 'CommunityCreateCtrl',
			    pageType: 'community-create',
			    reloadOnSearch: false
			}).segment('community', {
			    templateUrl: 'templates/community/profile.html',
			    controller: 'CommunityProfileCtrl',
			    pageType: 'community',
			    reloadOnSearch: false
		    })
			.within()
				.segment('home', {
					default: true,
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileHome.html',
				})
				.segment('members', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileMembers.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('applications', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileApplications.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('given', {
					templateUrl: 'templates/community/ratingsGiven.html',
					controller: 'CommunityDataFeedCtrl',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('received', {
					templateUrl: 'templates/community/ratingsReceived.html',
					controller: 'CommunityDataFeedCtrl',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('posts', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profilePosts.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('about', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileAbout.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('inviteFriends', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileInviteFriends.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
				.segment('activity-feed', {
					controller: 'CommunityDataFeedCtrl',
					templateUrl: 'templates/community/profileActivityFeed.html',
					reloadOnSearch: false,
					dependencies: ['id']
				})
		  	.up()
			// ========= Profile
			.segment('profileEdit', {
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
				.segment('friends', {
					templateUrl: 'templates/profile/friends.html',
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
				});


			// $routeProvider.otherwise({
		 //        controller: 'Error404Controller',
		 //        templateUrl: 'templates/profile/Error404.html'
	  //   	});

			$routeProvider.otherwise({
		        controller: 'Error404Ctrl',
				templateUrl: 'templates/error404.html'
				// redirectTo: '/not-found'
			});
	
	}
]);
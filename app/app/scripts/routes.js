angular.module('hearth').config([
	'$routeSegmentProvider', '$routeProvider',
	function($routeSegmentProvider, $routeProvider) {


		$routeSegmentProvider
			
			// ====== General routes
			.when('/', 'market')
			.when('/market', 'market-refresh')
			.when('/search/?', 'search')
			.when('/ad/:id', 'ad')
			.when('/404', 'err404')
			.when('/terms', 'terms')
			.when('/about', 'about')
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

			// ======= Communities & subroutes
			.when('/communities', 'communityList')
			.when('/community-create', 'communityCreate')
			.when('/community/:id/edit', 'communityEdit')
			.when('/community/:id', 'community')
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
				controller: ['$location', '$routeParams', function($location, $routeParams) {
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
			}).segment('about', {
				templateUrl: 'templates/about.html',
				pageType: 'about'
			}).segment('ad', {
				controller: 'ItemDetail',
				templateUrl: 'templates/itemDetail.html'
			}).segment('error404', {
				controller: 'Error404Ctrl',
				templateUrl: 'templates/error404.html'

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
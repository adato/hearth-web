'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description
 * @restrict A
 */

angular.module('hearth.directives').directive('infoBox', [
	'$rootScope', 'UsersCommunitiesService', '$state', '$analytics', 'IsEmpty',
	function($rootScope, UsersCommunitiesService, $state, $analytics, IsEmpty) {
		return {
			transclude: true,
			replace: true,
			scope: {
				infoBox: "=",
				infoboxIndex: "=",
				infoboxClass: "=",
			},
			templateUrl: 'templates/directives/infoBox.html',
			link: function(scope, el, attrs) {
				scope.show = false; // infobox shown
				scope.error = false; // an error occured when loading info
				scope.info = false; // we will cache infobox content
				scope.getProfileLink = $rootScope.getProfileLink;
				scope.isEmpty = IsEmpty;

				// totaly useless code - delete
				// scope.infoboxIndex = 0 || scope.infoboxIndex;
				// scope.infoboxClass = '' || scope.infoboxClass;

				/**
				 * Show user info into the box
				 */
				function fillUserInfo(info) {
					scope.info = info;

					$analytics.eventTrack('InfoBox shown', {
						Id: info._id,
						name: info.name,
						context: $state.current.name
					});
				};

				/**
				 * When loading fail, it will show error message into the box
				 */
				function displayError() {
					scope.error = true;
				};

				/**
				 * On mouse in, show info box
				 */
				el.on('mouseenter', function() {
					if ($rootScope.loggedUser._id) {
						scope.$apply(function(scope) {
							scope.show = true;
							scope.error = false;
							UsersCommunitiesService.loadProfileInfo(scope.infoBox, fillUserInfo, displayError);
						});
					}
				});

				/**
				 * On mouse out, hide info box
				 */
				el.on('mouseleave', function() {
					scope.$apply(function(scope) {
						scope.show = false;
					});
				});

			}
		};
	}
]);
'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.fileUpload
 * @description 
 * @restrict A
 */

angular.module('hearth.directives').directive('infoBox', [
	'$rootScope', 'User', 'Community',
	function($rootScope, User, Community) {
		return {
			transclude: true,
			replace: true,
			scope: {
				infoBox: "=",
			},
			templateUrl: 'templates/directives/infoBox.html',
			link: function(scope, el, attrs) {
				scope.show = false;	// infobox shown
				scope.error = false; // an error occured when loading info
				scope.info = false;  // we will cache infobox content

				/**
				 * Show user info into the box
				 */
				function fillUserInfo(info) {
					scope.info = info;
					$rootScope.cacheInfoBox[scope.infoBox._id] = info;
				};

				/**
				 * When loading fail, it will show error message into the box
				 */
				function displayError() {
					scope.error = true;
				};

				function loadInfoBox(id) {
					if($rootScope.cacheInfoBox[id])
						return scope.info = $rootScope.cacheInfoBox[id];

					if(!scope.info) {
						if(scope.infoBox._type == 'User')
							User.get({user_id: id}, fillUserInfo, displayError);
						else
							Community.get({communityId: id}, fillUserInfo, displayError);
					}
				}

				/**
				 * On mouse in, show info box
				 */
				scope.hoverIn = function() {
					if($rootScope.loggedUser._id) {
						scope.show = true;
						scope.error = false;
						
						loadInfoBox(scope.infoBox._id);
					}
				};
				
				/**
				 * On mouse out, hide info box
				 */
				scope.hoverOut = function() {
					scope.show = false;
				};

			}
		};
	}
]);
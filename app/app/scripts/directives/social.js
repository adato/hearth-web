'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.social
 * @description Displays social networks links
 * @restrict E
 */
angular.module('hearth.directives').directive('social', [

	'Facebook',
	function(Facebook) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '=',
				title: '=name',
				summary: '=',
				facebookInvite: '@'
			},
			templateUrl: 'templates/directives/social.html',
			link: function(scope) {

				scope.fbInvite = function() {
					Facebook.inviteFriends();
					return false;
				}

				scope.$watch('item', function(value) {
				 	var url = window.location.href.replace(window.location.hash, ''),
						title = encodeURIComponent(scope.title),
						summary = encodeURIComponent(scope.summary);

					if (value) {
						url += '%23/ad/' + value;
					}

					angular.extend(scope, $$config.sharingEndpoints);
				});
			}
		};
	}
]);
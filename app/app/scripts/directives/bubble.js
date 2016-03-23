'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('bubble', [
	'$rootScope', 'User',
	function($rootScope, User) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				type: '@'
			},
			templateUrl: 'templates/directives/bubble.html',
			link: function(scope, element, attrs) {
				var bubble = $('.bubble-container').first();
				bubble.show();


				var isScrolledIntoView = function($elem) {
					if (!$elem) return false;
					var $window = $(window);

					var docViewTop = $window.scrollTop();
					var docViewBottom = docViewTop + $window.height();

					var elemTop = $elem.offset().top;
					var elemBottom = elemTop + $elem.height();

					return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
				}

				var closeOnDocumentClick = function(event) {
					if (isScrolledIntoView(bubble)) {
						$('body').unbind('click', closeOnDocumentClick);
						scope.removeReminder(event, scope.type, 'document-click');
					}
				}

				$('body').unbind().on('click', closeOnDocumentClick);

				scope.removeReminder = $rootScope.removeReminder;
			}
		};
	}
]);
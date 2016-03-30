'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('bubble', [
	'Bubble',
	function(Bubble) {
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

				function closeOnDocumentClick(event) {
					if (Bubble.isInViewport(bubble)) {
						$('body').unbind('click', closeOnDocumentClick);
						Bubble.removeReminder(event, scope.type, 'document-click');
					}
				}

				$('body').unbind().on('click', closeOnDocumentClick);

			}
		};
	}
]);
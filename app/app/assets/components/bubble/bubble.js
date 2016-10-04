'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.bubble
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('bubble', [
	'Bubble', '$rootScope',
	function(Bubble, $rootScope) {
		return {
			restrict: 'E',
			scope: {},
			template: '<div class="bubble-notification" ng-include="template" ng-cloak ng-show="shown" ng-class="class"></div>',
			link: function(scope, element, attrs) {
				scope.shown = true;
				scope.type = scope.$parent.type;
				scope.template = scope.$parent.templateUrl;
				scope.class = scope.$parent.class || '';

				var bubbleClick = function(event) {
					scope.shown = false;
					Bubble.removeReminder({
						event: event,
						type: scope.type,
						reason: (event.target.dataset.bubble === 'close' ? Bubble.CLOSE_REASONS.BUTTON_CLICK : Bubble.CLOSE_REASONS.BUBBLE_CLICK)
					});
					element.off('click', bubbleClick);
				}
				element.on('click', bubbleClick);

				var deregister = $rootScope.$on('closeBubble', function(event, paramObj) {
					if (scope.type === paramObj.type && paramObj.justHide) {
						scope.shown = false;
						return true;
					}
					if ((paramObj.type === 'all' && Bubble.isInViewport(element[0])) || paramObj.type === scope.type || paramObj.force) {
						scope.shown = false;
						if (!$rootScope.$$phase) $rootScope.$apply();
						if (!paramObj.justHide) {
							Bubble.removeReminder({
								event: paramObj.event,
								type: scope.type,
								reason: paramObj.reason
							});
						}
						deregister();
					}
				});
			}
		};
	}
]);
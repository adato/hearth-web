'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.ad
 * @description
 * @restrict E
 */
angular.module('hearth.directives').directive('ad', [
	'$timeout',

	function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			scope: {
				item: '='
			},
			templateUrl: 'templates/item.html',
			link: function(scope) {
				var init = function() {
					angular.extend(scope, {
						edit: false,
						message: '',
						agreed: true,
						submited: false
					});
					scope.replyForm.$setPristine();
				};

				scope.sendReply = function() {
					scope.submiting = true;
					scope.$emit('sendReply', {
						id: scope.item._id,
						message: scope.message,
						agreed: scope.agree
					});
					scope.submited = true;
					$timeout(init, 3000);
				};
				scope.cancelEdit = function() {
					init();
				};
				init();
			}

		};
	}
]);
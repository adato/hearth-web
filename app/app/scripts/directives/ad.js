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

				scope.$watch('item', function(value) {
					var url = window.location.href.replace(window.location.hash, '');
					if (value) {
						url += '%23/ad/' + value._id;
					}

					angular.extend(scope, {
						facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + url,
						gplus: 'https://plus.google.com/share?url=' + url,
						twitter: 'https://twitter.com/share?url=' + url
						//linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url
					});
				});

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
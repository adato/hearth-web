'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.showTextInPassword
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('showTextInPassword', [
	function() {
		return {
		    transclude:true,
			restrict: 'E',
			replace:true,
			scope: true,
			// template: '<div class="text-in-password"><span class="fa fa-eye" ng-click="toggleShow()"></span><div ng-transclude></div></div>',
			template: '<div class="text-in-password"><span ng-transclude></span><span class="fa fa-eye" ng-click="toggleShow()"></span></div>',
			link: function($scope, el, attrs) {
				var el = $('input', el);
				$scope.toggleShow = function() {
					console.log(el.attr('type'));
					if(el.attr('type') == 'password') {
						el.attr('type', 'text');
					} else {
						el.attr('type', 'password');
					}
				};
			}
		};
	}
]);
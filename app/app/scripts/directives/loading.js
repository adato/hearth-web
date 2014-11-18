'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.loading
 * @description 
 * @restrict E
 */

angular.module('hearth.directives').directive('loading', ['$timeout', '$translate', function($timeout, $translate) {
	return {
		restrict: 'AE',
		scope: {
			text: "@",
			show: "=",
			delayed: "="
		},
		template: '<div ng-if="display" class="text-center loading">' + '<i class="fa fa-spinner fa-spin"></i>{{msg}}</div>',
		link: function($scope, el, attrs) {
			$scope.timeout = $scope.delayed || 200;
			$scope.show = $scope.show || false;
			$scope.showTimeout = 0;
			$scope.showSchedule = false;
			$scope.defaultMessage = 'COMMON.LOADING';

			// hide message on start
			$(el).css('display', 'none ');

			function processScheduled() {
				// show
				if($scope.showSchedule) {
					$scope.display = $scope.showSchedule;
					$(el).fadeIn('fast');
				} else {
					// hide
					$(el).hide();
					$scope.display = $scope.showSchedule;
				}
			}

			$scope.$watch('text', function(val) {
				if(val) {
					$scope.msg = val;
				} else {
				    var translation = $translate($scope.defaultMessage, function(val) {
				    	$scope.msg = val;
				    });

				    if(translation == $scope.defaultMessage)
				    	translation = 'Načítám ...';

				    $scope.msg = translation;
				}
			});

			$scope.$watch('show', function(show) {
				
				// if not show - cancel scheduled timeout if exists
				if(!show && $scope.showTimeout) {
					$timeout.cancel($scope.showTimeout);
				}

				// schedule timeout
				$scope.showSchedule = show;

				// display or hide
				if($scope.delayed) {
					$scope.showTimeout = $timeout(processScheduled, $scope.timeout);
				} else {
					processScheduled();
				}
			});
		}
	};
}]);

angular.module('hearth.directives').directive('fileModel', ['$parse', '$rootScope', function($parse, $rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change', function() {
				modelSetter(scope, element[0].files[0]);
				if (!scope.$$phase && !$rootScope.$$phase) scope.$apply();
			});
		}
	};
}]);
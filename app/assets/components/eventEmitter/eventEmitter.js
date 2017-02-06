angular.module('hearth.directives').directive('eventEmitter', ['$rootScope', function($rootScope) {

  return {
    restrict: 'A',
    link: (scope, el, attrs) => {
      let setup = scope.$eval(attrs.eventEmitter);
      if (setup.event) {
        let emitter = setup.rootScope ? $rootScope : scope;
        emitter.$emit(setup.event, setup.data || void 0);
      }
    }
  };

}]);
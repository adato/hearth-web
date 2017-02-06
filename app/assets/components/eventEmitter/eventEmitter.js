angular.module('hearth.directives').directive('eventEmitter', ['$rootScope', function($rootScope) {

  return {
    restrict: 'A',
    link: (scope, el, attrs) => {
      let setup = scope.$eval(attrs.eventEmitter);
      if (setup.event) {
        let emitter = setup.rootScope ? $rootScope : scope;
        if (!setup.waitFor) {
          emitter.$emit(setup.event, setup.data || void 0);
        } else {
          el.on(setup.waitFor, () => {
            emitter.$emit(setup.event, setup.data || void 0);
          });
        }
      }
    }
  };

}]);
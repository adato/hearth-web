angular.module('hearth.directives').directive('infoBubbleLocation', [function() {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleLocation.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: [function() {

      const ctrl = this

    }]
  }

}])
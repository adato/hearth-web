angular.module('hearth.directives').directive('usersNameList', [function() {

  return {
    restrict: 'AE',
    templateUrl: 'assets/components/usersList/usersNameList.html',
    scope: {},
    bindToController: {
      usersNameList: '='
    },
    controllerAs: 'vm',
    controller: ['$window', function($window) {

      const ctrl = this

      ctrl.$onInit = () => {
        ctrl.limit = $window.$$config.usersNameList.initNameLimit
      }

    }]
  }

}])
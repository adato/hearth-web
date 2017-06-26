angular.module('hearth.directives').directive('usersList', [function() {

  return {
    restrict: 'AE',
    templateUrl: 'assets/components/usersList/usersList.html',
    scope: {
      usersList: '=',
      other: '='
    },
    bindToController: true,
    controllerAs: 'vm',
    controller: ['$filter', '$locale', '$window', function($filter, $locale, $window) {

      const ctrl = this

      ctrl.$onInit = () => {
        ctrl.limit = $window.$$config.usersNameList.initNameLimit
        ctrl.avatarLimit = $window.$$config.usersNameList.initNameLimit

        if (ctrl.other && ctrl.other.created_at) {
          ctrl.other.created_at_timeago = $filter('ago')(ctrl.other.created_at)
          ctrl.other.created_at_date = $filter('date')(ctrl.other.created_at, $locale.DATETIME_FORMATS.medium)
        }
      }

    }]
  }

}])
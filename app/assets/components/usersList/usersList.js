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
    controller: ['$filter', '$locale', '$window', '$rootScope', function($filter, $locale, $window, $rootScope) {

      const vm = this

      vm.$onInit = () => {
        vm.limit = $window.$$config.usersNameList.initNameLimit
        vm.avatarLimit = $window.$$config.usersNameList.initNameLimit

        vm.getProfileLink = $rootScope.getProfileLink

        if (vm.other && vm.other.created_at) {
          vm.other.created_at_timeago = $filter('ago')(vm.other.created_at)
          vm.other.created_at_date = $filter('date')(vm.other.created_at, $locale.DATETIME_FORMATS.medium)
        }
      }

    }]
  }

}])
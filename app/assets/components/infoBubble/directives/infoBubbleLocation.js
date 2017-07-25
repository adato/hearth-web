angular.module('hearth.directives').directive('infoBubbleLocation', [function() {

  return {
    restrict: 'E',
    templateUrl: 'assets/components/infoBubble/templates/infoBubbleLocation.html',
    scope: {},
    bindToController: {
      model: '='
    },
    controllerAs: 'vm',
    controller: ['$q', '$locale', function($q, $locale) {

      const ctrl = this

      ctrl.$onInit = () => {

        ctrl.pluralCat = $locale.pluralCat

        init()

      }

      /////////////////

      function init() {

        if (!ctrl.model.infoBubble) {
          $q.all({
            // userDetail: UsersService.get(ctrl.model._id)
          })
          .then(res => {
            // ctrl.model.infoBubble = res.userDetail
          })
        }

      }

    }]
  }

}])

angular.module('hearth.controllers').controller('EventsCtrl', [
	'$scope', '$rootScope', '$http',
	function($scope, $rootScope, $http) {
        var vm = this;
        vm.events = [];
        vm.loading = false;
        
        function init() {
            vm.loading = true;
            $http.get('http://cms.hearth.net/api/event/list', { withCredentials: false }).then(function (obj) {
                if (obj && obj.data && obj.data.response && obj.data.response.length) {
                    vm.events = obj.data.response;
                }
                vm.loading = false;
            }, function (err) {
                vm.events = [];
                vm.loading = false;
            })
        }

        init();
    }
]);

angular.module('hearth.controllers').controller('EventCtrl', [
	'$scope', '$rootScope', '$http', '$stateParams', 
	function($scope, $rootScope, $http, $stateParams) {
        var vm = this;
        vm.event = {};
        vm.loading = false;
        vm.error = false;
        
        function init() {
            vm.loading = true;
            if (!$stateParams.id) { 
                vm.loading = false;
                vm.error = true;
                return;
            }

            $http.get('https://cms.hearth.net/api/event/list', { withCredentials: false }).then(function (obj) {
                if (obj && obj.data && obj.data.response && obj.data.response.length) {
                    var event = obj.data.response.filter(function (item) {
                        if (item.id == $stateParams.id) return true; else return false;
                    })
                    if (event.length) vm.event = event[0];
                    console.log(vm.event)
                }
                vm.loading = false;
                vm.error = false;
            }, function (err) {
                vm.event = {};
                vm.loading = false;
                vm.error = true;
            })
        }

        init();
    }
]);
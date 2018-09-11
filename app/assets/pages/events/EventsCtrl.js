
angular.module('hearth.controllers').controller('EventsCtrl', [
	'$scope', '$rootScope', '$http', '$timeout',
	function($scope, $rootScope, $http, $timeout) {
        var vm = this;
        vm.events = [];
        vm.loading = false;
        
        function masonryInit() {
            var elem = document.querySelector('#masonry-container');
            var msnry = new Masonry( elem, {
                itemSelector: '.single-event'
            });
        }

        function init() {
            vm.loading = true;
            $http.get('https://cms.hearth.net/api/event/list', { withCredentials: false }).then(function (obj) {
                if (obj && obj.data && obj.data.response && obj.data.response.length) {
                    vm.events = obj.data.response;
                    $timeout(masonryInit, 100);
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
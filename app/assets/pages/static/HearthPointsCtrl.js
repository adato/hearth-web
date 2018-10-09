'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.HearthPointsCtrl
 * @description controller providing functions for hearth points and central HP
 */


angular.module('hearth.services').service('HearthPointService', ['$http', '$q', function ($http, $q) {

    function queryText(slug) {
        let deferred = $q.defer();
        if (!slug) deferred.reject("No slug provided");
        $http.get('https://cms.hearth.net/api/document/' + slug, { withCredentials: false, cache:true }).then((obj) => {
            if (!obj || !obj.data || !obj.data.response) deferred.reject("No data response");
            
            deferred.resolve(obj.data.response.filter((item) => {
                if (item.slug == slug) return true; else return false;
            })[0]);
            
        });
        return deferred.promise;
    }

    return {
        query: queryText
    }
}]);



angular.module('hearth.controllers').controller('HearthPointsCtrl', ['$rootScope', 'HearthPointService', '$state', function($rootScope, HearthPointService, $state) {
    const ctrl = this
    ctrl.loaded = false;
    ctrl.data = {};

    let slug = "hearth.points";
    
    ctrl.init = function () {
        if (!$state || !$state.current || !$state.current.slug) {
            slug = "hearth.points"
        } else {
            slug = $state.current.slug
        }

        HearthPointService.query(slug).then((result) => {
            console.log(result)
            ctrl.data = result;
            ctrl.loaded = true;
        }, () => {
            ctrl.data = {};
            ctrl.loaded = true;
        })
    }

    ctrl.init();
    
}]);
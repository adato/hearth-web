'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.ComponentsController
 * @description  used by "kitchen sink" page with all custom hearth components
 */

angular.module('hearth.controllers').controller('ComponentsCtrl', [
    '$scope', 'KeywordsService',
    function($scope, KeywordsService) {
        $scope.components = {
            "author": {
                _id: '521f5d48b8f421d7200049d2',
                _type: 'User',
                avatar_large: null,
                updated_at: "2015-10-26T11:00:05.948+01:00",
                down_votes: 10,
                up_votes: 8,
                karma: "44%"
            },
            "textinput": null,
            "textarea": null,
            "checkbox": [],
            "radio": false,
            "expandGroup": false,
            "authorSelectorDisabled": false,
            "authorList": [{
                _id: "52000f9d584b06020000004b",
                _type: "User",
                name: "Ashtar Sheran"
            }, {
                _id: "520023efds06020000004b",
                _type: "Community",
                name: "Ashtars Sherans Community"
            }]

        };
        $scope.queryKeywords = function($query) {
            return KeywordsService.queryKeywords($query);
        };
    }
]);
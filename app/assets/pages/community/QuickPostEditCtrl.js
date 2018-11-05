'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.QuickPostEditCtrl
 * @description
 */

angular.module('hearth.controllers').controller('QuickPostEditCtrl', [
	'$scope', 'Post',
	function($scope, Post) {
        var ctrl = this;
        ctrl.post = {};
        ctrl.draftLoaded = false;

        Post.createDraft({}, function(draft) {
            ctrl.post = draft;
            ctrl.isDraft = true;
            ctrl.draftLoaded = true;
        });


        ctrl.save = function () {
            console.log("saving", ctrl.post)
        }
    }
]);
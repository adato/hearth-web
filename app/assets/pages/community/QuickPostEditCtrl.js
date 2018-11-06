'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.QuickPostEditCtrl
 * @description
 */

angular.module('hearth.controllers').controller('QuickPostEditCtrl', [
	'$scope', 'Post', '$state',
	function($scope, Post, $state) {
        var ctrl = this;
        ctrl.post = {};
        ctrl.imageUploading = false;
        ctrl.showError = {
            files: {},
            title: false,
            text: false,
        }
		ctrl.imageUploadOptions = {
			uploadingQueue: ctrl.imageUploading,
			error: ctrl.showError.files,
			minSize: 200, // Pixels
			limitMb: 5,
			multiple: true,
			resultPropName: 'public_url'
        };

        ctrl.draftLoaded = false;


        ctrl.init = function () {
            // initialize draft
            Post.createDraft({}, function(draft) {
                ctrl.post = draft;

                // prefill values
                var prefill = {
                    character: ['information'],
                    exact_type: 'gift',
                    location_unlimited: true,
                    type: 'offer'
                };

                // if its from community, prefill it too
                if ($scope.ngDialogData && $scope.ngDialogData.community) {
                    prefill.related_communities = [{
                        _id: $scope.ngDialogData.community._id,
                        name: $scope.ngDialogData.community.name,
                    }]
                }

                angular.extend(ctrl.post, prefill);

                ctrl.isDraft = true;
                ctrl.draftLoaded = true;
            });
        }    

		ctrl.removeImage = function(index) {
			var files = ctrl.post.attachments_attributes;
            if (files && files[index]) files.splice(index, 1);
        }


        ctrl.save = function () {
            // update post type depending on question mark in title
            //ctrl.post.type = (ctrl.post.title.substring())
            console.log("saving", ctrl.post)
        }

        ctrl.init();
    }
]);
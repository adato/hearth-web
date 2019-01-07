'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.QuickPostEditCtrl
 * @description
 */

angular.module('hearth.controllers').controller('QuickPostEditCtrl', [
	'$scope', 'Post', '$rootScope', '$timeout', 
	function($scope, Post, $rootScope, $timeout) {
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
        ctrl.sending = false;

        ctrl.init = function () {
            // initialize draft
            Post.createDraft({}, function(draft) {
                ctrl.post = draft;

                // prefill values
                var prefill = {
                    character: ['information'],
                    exact_type: 'gift',
                    location_unlimited: true,
                    locations: [],
                    type: 'offer',
                    language: $rootScope.language
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


        ctrl.save = function (form) {
            if (!ctrl.testForm(ctrl.post, form)) return;

            var postData = angular.extend(
				angular.copy(ctrl.post), {
                    id: ctrl.post._id,
                }
			);

            delete postData.$promise;
            delete postData.$resolved;

			if (ctrl.sending) return false;
			ctrl.sending = true;

			Post.add(postData, function(data) {

                // is ok
                $timeout(function() {
                    $scope.closeThisDialog();
                    $rootScope.$broadcast('postCreated', data);
                }, 100);
    
                ctrl.sending = false;
                    
			}, function (err) {
                console.error(err)
                ctrl.sending = false;
            });
        }

        ctrl.testForm = function (post, form) {
			var res = false;
			form.$setDirty();

			if (form.title.$invalid) {
				res = ctrl.showError.title = true;
			}

			if (form.text.$invalid) {
				res = ctrl.showError.text = true;
			}
			return !res;
		};


        /**
         * function to detect direction of gift
         * (ie - title contains question mark? so it is need, othervise its offer)
         * @param post 
         */
        ctrl.detectDirection = function (post) {
            if (!post || !post.title) return;
            let direction = (post.title.indexOf('?') > -1 ? 'need' : 'offer');
            post.type = direction;
        }

        ctrl.init();
    }
]);
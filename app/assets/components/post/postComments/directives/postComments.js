'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.postComments
 * @description Directive that provides UI for comments to posts
 * @restrict E
 */
angular.module('hearth.directives').directive('postComments', [function() {

	return {
		restrict: 'E',
    templateUrl: 'assets/components/post/postComments/templates/postComments.html',
    scope: {},
    bindToController: {
      model: '=',
      postId: '='
    },
    controllerAs: 'vm',
    controller: ['Post', '$rootScope', '$timeout', '$filter', function(Post, $rootScope, $timeout, $filter) {

      const ctrl = this

      const STATUS_TIMEOUT = 2000

      ctrl.$onInit = () => {

        ctrl.loggedUser = $rootScope.loggedUser

        ctrl.message
        ctrl.sending
        ctrl.success
        ctrl.error

        ctrl.submit = submitMessage

        init()

      }

      /////////////////

      function init() {
        ctrl.model = ctrl.model || []
        Post.queryComments({postId: ctrl.postId}).$promise
        .then(res => {
          res && res.length && (ctrl.model = res.map(comment => {
						comment.created_at_timeago = $filter('ago')(comment.created_at)
						return comment
					}))
        })
        .catch(err => {
          console.log('failed to query comments', err)
        })
      }

      function submitMessage(message) {
        if (!message || ctrl.sending) return

        ctrl.sending = true
        Post.createComment({postId: ctrl.postId}, {comment: {text: message}}).$promise
        .then(res => {
          ctrl.message = ''

					res.created_at_timeago = $filter('ago')(res.created_at)
          ctrl.model.push(res)

          ctrl.success = true
          $timeout(() => ctrl.success = false, STATUS_TIMEOUT)
        })
        .catch(err => {
          console.log('failed to create a post comment', err)

          ctrl.error = true
          $timeout(() => ctrl.error = false, STATUS_TIMEOUT)
        })
        .finally(() => {
          ctrl.sending = false
        })
      }

    }]
  }

}])
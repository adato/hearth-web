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
      postId: '=',
      limitComments: '=',
    },
    controllerAs: 'vm',
    controller: ['Post', 'PostComment', '$rootScope', '$timeout', '$filter', '$anchorScroll', '$location', function(Post, PostComment, $rootScope, $timeout, $filter, $anchorScroll, $location) {

      const ctrl = this

      const STATUS_TIMEOUT = 2000
			const POST_COMMENT_NEW = 'post-comment-new'

      ctrl.$onInit = () => {

        ctrl.loggedUser = $rootScope.loggedUser
        ctrl.userHasRight = $rootScope.userHasRight;
        ctrl.showControls = null; // controlled by template -- shows delete etc for particular comment
        ctrl.message
        ctrl.sending
        ctrl.success
        ctrl.error

        ctrl.showError = false; // default state of error message
        ctrl.showMoreCommentsLink = false; // default not show link
        ctrl.expanded = false;
        ctrl.submit = submitMessage
        ctrl.hideComment = hideComment
        ctrl.unhideComment = unhideComment

        init()

      }

      /////////////////

      function init() {
        ctrl.model = ctrl.model || []
        Post.queryComments({postId: ctrl.postId}).$promise
        .then((res) => {
          res && res.length && (ctrl.model = res.map((comment) => {
						return prerenderValues(comment);
          }))

          // limit comments to X and set flag to show link to post detail
          if (ctrl.limitComments && Number.isInteger(ctrl.limitComments) && res && res.length > ctrl.limitComments) {
            ctrl.model = ctrl.model.slice(Math.max(ctrl.model.length - ctrl.limitComments, 1))
            ctrl.showMoreCommentsLink = true;
          }

          // scroll to comments if hash is specified
          if (res.length && $location.hash()) {
            setTimeout(function () {  // scroll to comment-{id} when specified
              $anchorScroll();
            }, 100);
          }
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

					//res.created_at_timeago = $filter('ago')(res.created_at)
          ctrl.model.push(prerenderValues(res));

          ctrl.success = true
          $timeout(() => ctrl.success = false, STATUS_TIMEOUT)

					$rootScope.$emit(POST_COMMENT_NEW, {postId: ctrl.postId, newComment: res, commentList: angular.copy(ctrl.model)})
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

			function commentContained({arr, comment}) {
				for (var i = arr.length;i--;) {
					if (arr[i]._id === comment._id) return true
				}
				return false
      }
      
      function prerenderValues(comment) {
        comment.created_at_timeago = $filter('ago')(comment.created_at);
        comment.text_parsed = $filter('nl2br')($filter('linky')(comment.text, '_blank'));
        comment.text_short = $filter('ellipsis')(comment.text, 270, true);
        comment.text_short_parsed = $filter('linky')(comment.text_short, '_blank')
        return comment;
      }

      function hideComment(comment) {
        PostComment.hideComment({ postId: ctrl.postId, commentId: comment._id, hide: true }).$promise.then(function (res) {
          init();
        }, function (err) {
          throw new Error("cannot query comment control")
        })
      }

      function unhideComment(comment) {
        PostComment.unhideComment({ postId: ctrl.postId, commentId: comment._id, unhide: true }).$promise.then(function (res) {
          init();
        }, function (err) {
          throw new Error("cannot query comment control")
        })
      }

    }]
  }

}])
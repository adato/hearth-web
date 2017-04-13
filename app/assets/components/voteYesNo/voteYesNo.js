'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.voteYesNo
 * @description Simple Yes/No voting. It is possible to set title and handle the result.
 * @restrict E
 */

angular.module('hearth.directives').directive('voteYesNo', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      title: '@',
      vote: '&',
      isVoted: '='
    },
    templateUrl: 'assets/components/voteYesNo/voteYesNo.html',
    link: function (scope, el) {
      scope.votingInProgress = false;

      scope.voteWithResult = (result) => {
        scope.votingInProgress = true;
        scope.result = result;

        scope.vote({result: result === 'YES' ? 1 : 0});
      }

    }
  };
});

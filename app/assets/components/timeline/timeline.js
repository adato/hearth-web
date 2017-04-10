'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timeline', function () {
  return {
    restrict: 'AE',
    replace: true,
    scope: {
      timelineItems: '='
    },
    templateUrl: 'assets/components/timeline/timeline.html',
    link: function (scope, el) {
      scope.getIconType = item => {
        if (item.verb === 'community_accepted_user')
          return 'fa-user-o';
        if (item.verb === 'community_new_post')
          return 'fa-plus';
        if (item.verb === 'new_rating_received')
          return 'icon-rating-positive';
      };

      scope.getRating = item => {
        return [{
          "_id": "588b385337a6e90007933d59",
          "_type": "Rating",
          "created_at": "2017-01-27T13:08:52.012+01:00",
          "updated_at": "2017-01-27T13:08:52.012+01:00",
          "entity_from": {
            "_id": "572dd1b83ed44b000b000324",
            "_type": "User",
            "name": "Ed Černáč",
            "first_name": "Ed",
            "last_name": "Černáč",
            "avatar": {
              "normal": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/572dd1b83ed44b000b000324/normal_4ad5e05696adba2bd09ab4e9ca530816.jpeg",
              "large": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/572dd1b83ed44b000b000324/large_4ad5e05696adba2bd09ab4e9ca530816.jpeg",
              "size": [
                400.0,
                400.0
              ]
            },
            "down_votes": 0,
            "up_votes": 10
          },
          "entity_to": {
            "_id": "5319adc60a28f40200002c90",
            "_type": "Community",
            "name": "Nenásilná komunikace a Kruhy obnovy",
            "admin": "5319abd10a28f40200002c06",
            "avatar": {
              "normal": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/5319adc60a28f40200002c90/normal_36bf1ad75800302e16bbc3c94d103ddf.jpg",
              "large": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/5319adc60a28f40200002c90/large_36bf1ad75800302e16bbc3c94d103ddf.jpg",
              "size": [
                338.0,
                400.0
              ]
            },
            "down_votes": 1,
            "up_votes": 1,
            "short_description": "Všichni, kdo si přejí spokojené soužití s ostatními (ať už ve dvoji...",
            "motto": null
          },
          "user": {
            "_id": "572dd1b83ed44b000b000324",
            "_type": "User",
            "name": "Ed Černáč",
            "first_name": "Ed",
            "last_name": "Černáč",
            "avatar": {
              "normal": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/572dd1b83ed44b000b000324/normal_4ad5e05696adba2bd09ab4e9ca530816.jpeg",
              "large": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/572dd1b83ed44b000b000324/large_4ad5e05696adba2bd09ab4e9ca530816.jpeg",
              "size": [
                400.0,
                400.0
              ]
            },
            "down_votes": 0,
            "up_votes": 10
          },
          "score": 1,
          "text": "Nenásilná komunikace se může zdát poměrně zdlouhavou záležitostí ale při minimu chuti a kapičce vstřícnosti se dá dojít k uspokojení /byť třeba částečnému/zato ale u všech zúčastněných - vyjímku z tohoto pravidla tvoří přibližně 1,5 promile populace. ;o) Dobréa báječné ))))))))))))))",
          "post_id": null,
          "post_title": null,
          "comment": null,
          "hidden": false
        }]
      }
    }
  };
});

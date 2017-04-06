'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.timeline
 * @description show the list of events happen in community.
 * @restrict AE
 */
angular.module('hearth.directives').directive('timeline', ['$q', '$sce', function($q, $sce) {

  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    scope: {
      timelineItems: '=',
    },
    templateUrl: 'assets/components/timeline/timeline.html',
    link: function (scope, el) {

      const template = $sce.getTrustedResourceUrl('assets/components/item/items/post.html');
      // const template = 'assets/components/item/items/post.html';

      scope.getPostOptions = item => {
        return {
          getData: function() {
            return $q((resolve, reject) => {
              return resolve([
                {
                  "_id":"58e64c2d50e20100074e7f3c","_type":"Post","owner_id":"56980f53e09e1900070006d1",
                  "text":"awefaijweoife","title":"awefawe","type":"offer","exact_type":"loan","state":"active",
                  "language":"en","keywords":[],"is_private":false,
                  "author":{
                    "_id":"56980f53e09e1900070006d1","_type":"User","name":"Kamil Novotny","first_name":"Kamil","last_name":"Novotny",
                    "avatar":{
                      "normal":"https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/56980f53e09e1900070006d1/normal_8d102cb6c7d97705498c771a0c6f3648.jpeg",
                      "large":"https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/56980f53e09e1900070006d1/large_8d102cb6c7d97705498c771a0c6f3648.jpeg",
                      "size":[400.0,400.0]
                    },
                    "down_votes":0,"up_votes":0
                  },
                  "reply_count":0,"updated_at":"2017-04-06T16:10:01.508+02:00",
                  "character":["information"],"suspended_at":null,
                  "valid_until":"2017-05-06T00:00:00.000+02:00","location_unlimited":true,"related_communities":[],"edited_by_admin":false,
                  "author_type":"User","is_hidden":false,"is_replied":false,"is_bookmarked":false,"is_followed":false,"admin_communities":[],
                  "spam_reported":false,"activations_count":0,"locations":[],"attachments_attributes":[]
                }
              ]);
            })
          },
          templateUrl: template
        };
      };

    }
  };

}]);
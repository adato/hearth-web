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

      scope.getPostOptions = item => {
        return {
          getData: function() {
            return $q((resolve, reject) => {
              return resolve([
                {
                  "_type": "Post",
                  "_id": "58c1788319700e0007a0b289",
                  "_score": null,
                  "language": "cs",
                  "text": "http://adre.v.siti.cz/DlouhyNazevPostuKteryMusiPretectVsechnyMozeMezeAleNepreteceProtozeKluciJsouBorciAUrciteToDobreOpravili",
                  "title": "DlouhyNazevPostuKteryMusiPretectVsechnyMozeMezeAleNepretece",
                  "type": "offer",
                  "exact_type": "gift",
                  "character": ["energy"],
                  "state": "active",
                  "is_private": false,
                  "edited_by_admin": false,
                  "location_unlimited": true,
                  "created_at": "2017-03-09T16:45:07.192+01:00",
                  "updated_at": "2017-03-09T16:49:02.316+01:00",
                  "deleted_at": null,
                  "valid_until": "2017-04-09T00:00:00.000+02:00",
                  "keywords": [],
                  "owner_id": "521f5d50b8f421d720004a0c",
                  "community_id": null,
                  "boost": 1,
                  "author": {
                    "_id": "521f5d50b8f421d720004a0c",
                    "_type": "User",
                    "name": "Přemysl Malý",
                    "first_name": "Přemysl",
                    "last_name": "Malý",
                    "avatar": {
                      "normal": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/521f5d50b8f421d720004a0c/normal_a98f3af5a8f9a343c59a0c8810462d72.jpeg",
                      "large": "https://hearth-net-topmonks-dev-ugc.s3.amazonaws.com/uploads/avatars/521f5d50b8f421d720004a0c/large_a98f3af5a8f9a343c59a0c8810462d72.jpeg",
                      "size": [800, 800]
                    },
                    "down_votes": 0,
                    "up_votes": 15
                  },
                  "locations": [],
                  "attachments_attributes": [],
                  "related_communities": [],
                  "replies_count": 0,
                  "activations_count": 0,
                  "highlight": {},
                  "spam_reported": false,
                  "admin_communities": [],
                  "reply_count": 0,
                  "is_replied": false,
                  "is_bookmarked": false,
                  "is_followed": false,
                  "is_hidden": false
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
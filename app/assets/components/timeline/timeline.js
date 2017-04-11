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
      };

      scope.getPost = () => {
        return {
          "_type": "Post",
          "_id": "58c1788319700e0007a0b289",
          "_score": null,
          "language": "cs",
          "text": "Dařiště i na živo - to je Nazdar Bazar Liberec https://www.facebook.com/events/184225445423289/?ti=cl hodí se každá ruka, nápad, propagace, kontakty, fotografové, řidiči, lidé jenž mohou na chvíli nabídnout kousek prostoru...., Zároveň výzva pro setkání Hearth.net v blízkém i vzdáleném okolí. Pozn. plakát je z minulé akce.",
          "title": "pomoc s organizací akce Nazdar Bazar 14.května 2017",
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
      }

    }
  };
});

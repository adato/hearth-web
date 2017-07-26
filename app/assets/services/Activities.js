'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Activities
 * @description
 */

angular.module('hearth.services').service('Activities', ['$rootScope', '$translate', 'PostAux', function($rootScope, $translate, PostAux) {

	const self = this
	var ratingActivities = ['new_rating', 'new_rating_received']

	this.buildRatingActivityCode = function(info) {
		var arrCode = info.verb.split('_');
		arrCode.shift();

		return [
			'activities',
			arrCode.join('_'),
			info.narrative_mode.split('_')[0],
			info.actor._type.toLowerCase().substr(0, 4),
			info.target_object._type.toLowerCase().substr(0, 4)
		].join('.');
	};

	this.getActivityTranslationCode = function(info) {
		let isTargetCommunity = '';
		let type = '';
		if (info.type) type = '.' + info.type;
		if (ratingActivities.indexOf(info.verb) > -1) {
			return self.buildRatingActivityCode(info);
		} else if (info.target_object && info.target_object._type == 'Community' && info.verb !== 'accepted_into_community') {
			isTargetCommunity = '_comm';
		}

		const code = 'activities.' + info.narrative_mode + '.' + info.verb + type + isTargetCommunity;
		return code;
	};

	this.getActivityTranslation = function(info) {
		return $translate.instant(self.getActivityTranslationCode(info), self.getActivityData(info));
	};

  this.getActivityData = function (info) {
    let data = {};
    // common for all activities
    const obj = (info.target_object) ? info.target_object : info.object;
    if (obj) {
      data.user = info.actor ? info.actor.name : null;
      data.name = obj.title || obj.name;
      data.url = $rootScope.getProfileLink(obj._type, obj._id);
    }
    if (info.verb == 'group' && info.type == 'community_accepted_user') {
      // group of accepted user
      let names = [];
      let nameHtml;

      let index;
      for (index = 0; index < info.objects.length; ++index) {
        const object = info.objects[index].object;
        nameHtml = '<a href="' + $rootScope.getProfileLink(object._type, object._id) + '">' + object.name + "</a>";
        names.push(nameHtml);
      }
      data.names = names.join(', ');
    }
    if (info.verb == 'new_post' || info.verb == 'community_new_post') {
      // add post character to title
      if (obj.author_type && obj.type && obj.exact_type)
        data.name = $translate.instant(PostAux.getPostTypeCode(obj.author_type, obj.type, obj.exact_type)) + '&nbsp' + obj.title;
    }
    return data;
  }

}])
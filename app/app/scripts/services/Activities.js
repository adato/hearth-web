'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Activities
 * @description
 */

angular.module('hearth.services').service('Activities', [
	'$rootScope', '$translate',
	function($rootScope, $translate) {
		var self = this;
		var ratingActivities = ['new_rating', 'new_rating_received'];

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
			var isTargetCommunity = '';
			var code = '';

			if (ratingActivities.indexOf(info.verb) > -1) {

				return self.buildRatingActivityCode(info);
			} else if (info.target_object && info.target_object._type == 'Community' && info.verb !== 'accepted_into_community') {
				isTargetCommunity = '_comm';
			}

			code = 'activities.' + info.narrative_mode + '.' + info.verb + isTargetCommunity;
			return code;
		};

		this.getActivityTranslation = function(info) {
			return $translate.instant(self.getActivityTranslationCode(info), self.getActivityData(info));
		}

		this.getActivityData = function(info) {
			var obj = (info.target_object) ? info.target_object : info.object;

			var data = {
				user: info.actor.name,
				name: obj.title || obj.name,
				url: $rootScope.getProfileLink(obj._type, obj._id)
			};

			return data;
		};

		return this;
	}
]);
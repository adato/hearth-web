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

		this.getActivityTranslationCode = function(info) {
			var isTargetCommunity = '';

			if(info.target_object && info.target_object._type == 'Community' && info.verb !== 'accepted_into_community')
				isTargetCommunity = '_comm';

			return 'activities.'+info.narrative_mode+'.'+info.verb+isTargetCommunity;
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
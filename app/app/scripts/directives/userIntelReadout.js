'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.userIntelReadout
 * @description Writes out a table comprising information about a user
 * @restrict E
 */

angular.module('hearth.directives').directive('userIntelReadout', [
	'IsEmpty', 'MottoLength', 'CommunityInfoMaxLength', '$filter',
	function(IsEmpty, MottoLength, CommunityInfoMaxLength, $filter) {
		return {
			restrict: 'E',
			scope: {
				entity: '=',
				type: '='
			},
			templateUrl: 'templates/directives/userIntelReadout.html',
			link: function(scope) {
				scope.isEmpty = IsEmpty;

				var defs = {
					motto: 'motto',
					about: 'about',
					about_shortened: 'about_shortened',
					interests: 'interests',
					work: 'work',
					locations: 'locations',
					languages: 'languages',
					email: 'email',
					phone: 'phone',
					webs: 'webs'
				};

				var setup = {
					'informative': [defs.about_shortened, defs.locations, defs.languages, defs.email, defs.phone],
					'infobox': [defs.locations, defs.languages, defs.email, defs.phone], // note that there is a motto missing which is on purpose as it is shown differently usually
					'profile': [defs.about, defs.interests, defs.work, defs.locations, defs.languages, defs.email, defs.phone, defs.webs]
				};

				scope.selectedSetup = setup[scope.type] || setup.profile;

				// community has a 'description' property instead of 'about'
				if (scope.entity._type && scope.entity._type.toLowerCase() === 'community') {
					scope.entity.about = scope.entity.description;

					// for community show shortened description...
					if (scope.entity.about.length > CommunityInfoMaxLength) {
						scope.entity.community_about_shortened = $filter('ellipsis')(scope.entity.about, CommunityInfoMaxLength, true);
					}
				}

				// this is for marketplace post detail where the description should not be too long;
				if (scope.entity.motto || scope.entity.about) {
					scope.entity.about_shortened = scope.entity.motto || (scope.entity.about ? (scope.entity.about.length > (MottoLength + 3) ? (scope.entity.about.substring(0, MottoLength) + '…') : scope.entity.about) : '');
				}

				scope.canShow = function(itemName) {
					return (scope.selectedSetup.indexOf(itemName) > -1 && typeof scope.entity[itemName] !== 'undefined' && scope.entity[itemName] !== null && scope.entity[itemName].length > 0);
				}

			}
		}
	}
]);
'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.userIntelReadout
 * @description Writes out a table comprising information about a user
 * @restrict E
 */

angular.module('hearth.directives').directive('userIntelReadout', [
	'IsEmpty', 'MottoLength',
	function(IsEmpty, MottoLength) {
		return {
			restrict: 'E',
			scope: {
				entity: '=',
				type: '='
			},
			templateUrl: 'templates/directives/userIntelReadout.html',
			link: function(scope) {
				scope.isEmpty = IsEmpty;

				var motto = 'motto',
					about = 'about',
					about_shortened = 'about_shortened',
					interests = 'interests',
					work = 'work',
					locations = 'locations',
					languages = 'languages',
					email = 'email',
					phone = 'phone',
					webs = 'webs';

				var setup = {};
				setup.informative = [about_shortened, locations, languages, email, phone];
				setup.infobox = setup.informative.slice(1);
				// note that there is a motto missing which is on purpose as it is shown differently usually
				setup.all = [about, interests, work, locations, languages, email, phone, webs];
				setup.profile = setup.all;

				scope.typeMatch = setup[scope.type] || setup.all;

				// this is for marketplace post detail where the description should not be too long;
				scope.getShorterDescription = function() {
					if (scope.entity && (scope.entity.motto || scope.entity.about)) {
						scope.entity.about_shortened = scope.entity.motto || (scope.entity.about ? (scope.entity.about.length > (MottoLength + 3) ? (scope.entity.about.substring(0, MottoLength) + '...') : scope.entity.about) : '');
						return true;
					} else {
						return false;
					}
				};
				// community has a 'description' property instead of 'about'
				if (scope.entity._type && scope.entity._type.toLowerCase() === 'community') {
					scope.entity.about = scope.entity.description;
				}
			}
		}
	}
]);
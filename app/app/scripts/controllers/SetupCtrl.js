'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.SetupCtrl
 * @description 
 */
 
 angular.module('hearth.controllers').controller('SetupCtrl', [
	'$scope', '$feature',
	function($scope, $feature) {
		$scope.features = Object.keys($$config.features).map(function(name) {
			return {
				name: name,
				value: $feature.isEnabled(name)
			};
		});
		$scope.toggle = function(name) {
			var features = $scope.features.filter(function(feature) {
				return feature.name === name;
			}).forEach(function(feature) {
				var _ref;
				if ($$config.features[name] !== feature.value) {
					return $.cookie('FEATURE_' + feature.name, (_ref = feature.value) != null ? _ref : {
						'1': ''
					});
				} else {
					return $.cookie('FEATURE_' + feature.name, void 0);
				}
			});
			return features;
		};
	}
]);
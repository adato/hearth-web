'use strict';

angular.module('hearth.controllers').controller('SetupCtrl', [
	'$scope', '$feature', 'ipCookie',
	function($scope, $feature, ipCookie) {
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
					return ipCookie('FEATURE_' + feature.name, (_ref = feature.value) != null ? _ref : {
						'1': ''
					});
				} else {
					return ipCookie('FEATURE_' + feature.name, void 0);
				}
			});
			return features;
		};
	}
]);
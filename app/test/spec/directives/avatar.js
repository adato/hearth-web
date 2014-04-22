'use strict';

describe('Directives: avatar', function() {

	var scope, element;

	beforeEach(module('hearth.directives'));
	beforeEach(
		inject(function($compile, $rootScope) {
			scope = $rootScope;
			element = angular.element('<avatar>');
			$compile(element, scope);
			scope.$digest();
		})
	);

	it('should return path with prefix', inject(function(avatarDirective) {

		expect(element.find('img')).toBe('/apiundefined');

	}));

});
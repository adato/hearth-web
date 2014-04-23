'use strict';

describe('Directives: avatar', function() {

	var scope, element;

	beforeEach(module('hearth.directives'));
	beforeEach(module('templates/avatar.html'));
	beforeEach(
		inject(function($compile, $rootScope) {
			scope = $rootScope;
			element = angular.element('<avatar size="small">');
			$compile(element, scope);
			scope.$digest();
		})
	);

	it('test', inject(function() {
		expect(element.find('img').length).toBe(1);
	}));

});
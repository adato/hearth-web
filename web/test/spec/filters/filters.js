'use strict';

describe('Filters: apiPrefix', function() {

	beforeEach(module('hearth.filters'));

	it('should return path with prefix', inject(function(apiPrefixFilter) {
		expect(apiPrefixFilter()).toBe('/apiundefined');
		expect(apiPrefixFilter('')).toBe('/api');
		expect(apiPrefixFilter('/test')).toBe('/api/test');
	}));

	it('should return path with prefix', inject(function(urlizeFilter) {
		expect(urlizeFilter(null)).toBeUndefined();
		expect(urlizeFilter()).toBeUndefined();
		expect(urlizeFilter('test@test')).toBe('test@test');
		expect(urlizeFilter('test@text.com')).toBe('<a href="mailto:test@text.com" target="_blank">test@text.com</a>');
		expect(urlizeFilter('www.test.com')).toBe('<a href="http://www.test.com" target="_blank">www.test.com</a>');
		expect(urlizeFilter('http://www.test.com')).toBe('<a href="http://www.test.com" target="_blank">http://www.test.com</a>');
		expect(urlizeFilter('https://www.test.com')).toBe('<a href="https://www.test.com" target="_blank">https://www.test.com</a>');
	}));
});
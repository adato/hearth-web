'use strict';

describe('Services: ProfileProgress', function() {

	beforeEach(function() {
		module('hearth.services');
	});

	it('should contain an Feedback service', inject(function(ProfileProgress) {
		expect(ProfileProgress).not.toBeUndefined();
		expect(ProfileProgress.getProgress()).toBe(0);
		expect(ProfileProgress.getProgress({})).toBe(0);
		expect(ProfileProgress.getProgress(undefined, {})).toBe(0);
	}));

	it('simple object ', inject(function(ProfileProgress) {
		var data = {
			value1: 'abc'
		},
			pattern = {
				value1: true
			};

		expect(ProfileProgress.getProgress(data, pattern)).toBe(100);
		data = {
			value1: 'abc'
		};
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(50);
		data = {
			value1: 'abc',
			value2: '',
			value3: 'abc'
		};
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(50);
		data = {
			value1: 'abc',
			value2: '',
			value3: ''
		};
		pattern = {
			value1: true,
			value2: true,
			value3: true,
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(33);

	}));

	it('array ', inject(function(ProfileProgress) {
		var data = {
			value1: 'abc',
			value2: [],
			value3: ''
		},
			pattern = {
				value1: true,
				value2: true,
				value3: true,
			};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(33);

		data = {
			value1: 'abc',
			value2: ['']
		};
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(50);

		data = {
			value1: 'abc',
			value2: ['1']
		};
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(100);

		data = {
			value1: 'abc',
			value2: ['xxxx', '1111'],
			value3: ''
		};
		pattern = {
			value1: true,
			value2: true,
			value3: true,
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(67);
	}));

	it('object ', inject(function(ProfileProgress) {
		var data = {
			value1: 'abc',
			value2: {}
		},
			pattern = {
				value1: true,
				value2: true,
			};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(50);

		data = {
			value1: 'abc',
			value2: {
				prop: ''
			}
		},
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(50);

		data = {
			value1: 'abc',
			value2: {
				prop: true
			}
		},
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(100);

	}));

});
'use strict';

describe('Services: ProfileProgress', function() {

	beforeEach(function() {
		module('hearth.services');
	});

	it('should contain an ProfileProgress service', inject(function(ProfileProgress) {
		expect(ProfileProgress).not.toBeUndefined();
		expect(ProfileProgress.getProgress()).toBe(0);
		expect(ProfileProgress.getProgress({})).toBe(0);
		expect(ProfileProgress.getProgress(undefined, {})).toBe(0);
		expect(ProfileProgress).not.toBeUndefined();
		expect(ProfileProgress.getListOfMissing()).toEqual([]);
		expect(ProfileProgress.getListOfMissing({})).toEqual([]);
		expect(ProfileProgress.getListOfMissing(undefined, {})).toEqual([]);
	}));

	it('getProgress: simple object ', inject(function(ProfileProgress) {
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

	it('getProgress: array ', inject(function(ProfileProgress) {
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

	it('getListOfMissing: object ', inject(function(ProfileProgress) {
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
		};
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
		};
		pattern = {
			value1: true,
			value2: true
		};
		expect(ProfileProgress.getProgress(data, pattern)).toBe(100);

	}));

	it('getListOfMissing: simple object ', inject(function(ProfileProgress) {
		var data = {
			value1: 'abc'
		},
			pattern = {
				value1: 'VALUE1'
			};

		expect(ProfileProgress.getListOfMissing(data, pattern)).toEqual([]);
		data = {
			value1: 'abc',
			value2: ''
		};
		pattern = {
			value1: 'VALUE1',
			value2: 'VALUE2'
		};

		expect(ProfileProgress.getListOfMissing(data, pattern)).toEqual(['VALUE2']);

		data = {
			value1: 'abc',
			value2: '',
			value3: undefined
		};
		pattern = {
			value1: 'VALUE1',
			value2: 'VALUE2',
			value3: 'VALUE3'
		};

		expect(ProfileProgress.getListOfMissing(data, pattern)).toEqual(['VALUE2', 'VALUE3']);

	}));

	it('getListOfMissing: array  and object ', inject(function(ProfileProgress) {
		var data = {
			value1: 'abc',
			value2: [],
			value3: ['item'],
			value4: {},
			value5: {
				property: true
			}
		},
			pattern = {
				value1: 'VALUE1',
				value2: 'VALUE2',
				value3: 'VALUE3',
				value4: 'VALUE4',
				value5: 'VALUE5'
			};

		expect(ProfileProgress.getListOfMissing(data, pattern)).toEqual(['VALUE2', 'VALUE4']);
	}));

});
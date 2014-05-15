'use strict';

describe('Services: ProfileProgress', function() {

	beforeEach(function() {
		module('hearth.services');
	});

	it('should contain an ProfileProgress service', inject(function(ProfileProgress) {
		expect(ProfileProgress).not.toBeUndefined();
		expect(ProfileProgress.get().progress).toBe(0);
		expect(ProfileProgress.get({}).progress).toBe(0);
		expect(ProfileProgress.get(undefined, {}).progress).toBe(0);
	}));

	it('get: simple object ', inject(function(ProfileProgress) {
		var data = {
				name: 'xxxx'
			},
			pattern = [{
				name: 'name',
				message: 'MISSING_NAME'
			}];

		expect(ProfileProgress.get(data, pattern).progress).toBe(100);
		expect(ProfileProgress.get(data, pattern).missing.length).toBe(0);

		data = {
			value1: 'abc',
			value2: ''
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(50);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2']);

		data = {
			value1: 'abc',
			value2: '',
			value3: 'abc'
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}, {
			name: 'value3',
			message: 'MISSING_NAME3'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(67);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2']);

		data = {
			value1: 'abc',
			value2: '',
			value3: ''
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}, {
			name: 'value3',
			message: 'MISSING_NAME3'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(33);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2', 'MISSING_NAME3']);
	}));

	it('get: array ', inject(function(ProfileProgress) {
		var data = {
				value1: 'abc',
				value2: [],
				value3: ''
			},
			pattern = [{
				name: 'value1',
				message: 'MISSING_NAME1'
			}, {
				name: 'value2',
				message: 'MISSING_NAME2'
			}, {
				name: 'value3',
				message: 'MISSING_NAME3'
			}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(33);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2', 'MISSING_NAME3']);

		data = {
			value1: 'abc',
			value2: ['']
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(50);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2']);

		data = {
			value1: 'abc',
			value2: ['1']
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(100);
		expect(ProfileProgress.get(data, pattern).missing).toEqual([]);

		data = {
			value1: 'abc',
			value2: ['xxxx', '1111'],
			value3: ''
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}, {
			name: 'value3',
			message: 'MISSING_NAME3'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(67);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME3']);
	}));

	it('getListOfMissing: object ', inject(function(ProfileProgress) {
		var data = {
				value1: 'abc',
				value2: {}
			},
			pattern = [{
				name: 'value1',
				message: 'MISSING_NAME1'
			}, {
				name: 'value2',
				message: 'MISSING_NAME2'
			}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(50);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2']);

		data = {
			value1: 'abc',
			value2: {
				prop: ''
			}
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(50);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_NAME2']);

		data = {
			value1: 'abc',
			value2: {
				prop: true
			}
		};
		pattern = [{
			name: 'value1',
			message: 'MISSING_NAME1'
		}, {
			name: 'value2',
			message: 'MISSING_NAME2'
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(100);
		expect(ProfileProgress.get(data, pattern).missing).toEqual([]);

	}));

	it('getListOfMissing: pattern group ', inject(function(ProfileProgress) {
		var data = {
				value1: 'abc',
				value2: {}
			},
			pattern = [{
				message: 'MISSING_SOCIAL',
				items: [{
					name: 'facebook'
				}, {
					name: 'twitter'
				}, {
					name: 'googleplus'
				}, {
					name: 'linkedin'
				}]
			}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(0);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['MISSING_SOCIAL']);

		data = {
			facebook: 'abc'
		};
		pattern = [{
			message: 'MISSING_SOCIAL',
			items: [{
				name: 'facebook'
			}, {
				name: 'twitter'
			}, {
				name: 'googleplus'
			}, {
				name: 'linkedin'
			}]
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(100);
		expect(ProfileProgress.get(data, pattern).missing).toEqual([]);

		data = {
			facebook: 'abc',
			value2: {}
		};
		pattern = [{
			name: 'value2',
			message: 'value2err'
		}, {
			message: 'MISSING_SOCIAL',
			items: [{
				name: 'facebook'
			}, {
				name: 'twitter'
			}, {
				name: 'googleplus'
			}, {
				name: 'linkedin'
			}]
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(50);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['value2err']);

		data = {
			facebook: 'abc',
			twitter: '',
			value2: {},
			value3: {},
			value4: ''
		};
		pattern = [{
			name: 'value4',
			message: 'value4err'
		}, {
			message: 'MISSING_VALUE',
			items: [{
				name: 'value2'
			}, {
				name: 'value3'
			}]
		}, {
			message: 'MISSING_SOCIAL',
			items: [{
				name: 'facebook'
			}, {
				name: 'twitter'
			}, {
				name: 'googleplus'
			}, {
				name: 'linkedin'
			}]
		}];
		expect(ProfileProgress.get(data, pattern).progress).toBe(33);
		expect(ProfileProgress.get(data, pattern).missing).toEqual(['value4err', 'MISSING_VALUE']);



	}));

});
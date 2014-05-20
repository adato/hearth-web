'use strict';

angular.module('hearth.services').factory('Errors', function() {
	return {
		process: function(error, targetObject) {
			var data, result, _ref, _ref1;
			if (!error) {
				return null;
			}
			if (error.status === 400) {
				data = error.data;
				result = {};
				if (data.errors != null) {
					Object.keys(data.errors).forEach(function(key) {
						var e;
						e = data.errors[key];
						if ((e.name != null) && e.name === 'ValidatorError') {
							result[key] = e.type;
							return result[key];
						}
					});
				}
				if (targetObject != null) {
					targetObject.errors = result;
				}
			} else if (error.status === 500) {
				window.alert('Application error: ' + ((_ref = error.data) != null ? _ref.message : void 0));
			}
			return (_ref1 = error.data) != null ? _ref1.message : void 0;
		}
	};
});
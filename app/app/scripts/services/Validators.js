'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Validators
 * @description This service contains some functions for validating
 */

angular.module('hearth.services').service('Validators', [
	function() {
		var self = this;

		// validate email
		this.email = function(e) {
            return e.trim().match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		};
		
		// validate emails in array
        this.emails = function(arr) {
            var valid = true;
            
            for(var i in arr)
            	if(!self.email(arr[i]))
            		return false;
            return true;
        };
        
		return this;
	}
]);
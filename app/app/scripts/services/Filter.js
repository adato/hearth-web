'use strict';

/**
 * @ngdoc service
 * @name hearth.services.Filter
 * @description
 */

angular.module('hearth.services').factory('Filter', [
	'$location', '$rootScope', 'User',
	function($location, $rootScope, User) {
		return {
			toggleTag: function(tag) {
				var params, index;

                params = $location.search();
                params.keywords = params.keywords || [];

                if(! $.isArray(params.keywords))
                    params.keywords = params.keywords.split(",");

                index = params.keywords.indexOf(tag);
                if(index == -1)
                    params.keywords.push(tag);
                else {
                   params.keywords.splice(index,1);
                }

                params.keywords = params.keywords.join(",");
                if(params.keywords == "")
                    delete params.keywords;
                
                $location.search(params);
                $rootScope.$broadcast("filterApplied", params);
			},
			getActiveTags: function() {
				var params = $location.search();
            	
            	if(! params.keywords)
            		return [];

	            if(! $.isArray(params.keywords))
	            	return angular.copy(params.keywords).split(",");
	            else
                    return params.keywords;

			},
            get: function() {
                return $location.search();
            },
            isSet: function() {
                return !$.isEmptyObject($location.search());
            },
            apply: function(filterData, save){
                $location.search(filterData);
                if (save) {
                    User.edit(angular.extend({
                        _id: $rootScope.loggedUser,
                        filter: filterData
                    }));
                }

                $rootScope.$broadcast("filterApplied", filterData);
            },
            reset: function() {
                $location.search('');
                if ($rootScope.loggedUser) {
                    User.edit({
                        _id: $rootScope.loggedUser._id,
                        filter: {}
                    });
                }

                $rootScope.$broadcast("filterReseted");
            }
		};
	}
]);
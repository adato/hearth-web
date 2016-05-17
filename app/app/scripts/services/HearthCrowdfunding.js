'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthCrowdfunding
 * @description
 */

angular.module('hearth.services').service('HearthCrowdfundingBanner', [
	'$q',
	function($q) {

		this.bannerData = {
			"_type": "Banner", // ie. template -- watch for banner.html in templates/directives/items
			"_id": "...." // to be generated
		};

		this.decorateMarketplace = function(data) {
			this.bannerData._id = Math.random * 10000;

			data.splice(5, 0, this.bannerData);
			return data;
		}

		return this;
	}
]);
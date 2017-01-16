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

			// apply only on full result set, when top banner has been closed by user.
			// then display this once on a first result set, then on no more
			if (this.titleBannerIsClosed && !this.isDisplayed && data.length >= 15) {
				var position = Math.floor(Math.random() * 10) + 5;
				data.splice(position, 0, this.bannerData);
				this.isDisplayed = true;
			}

			return data;
		}

		this.titleBannerIsClosed = ($.cookie('crowdsourcing-banner') === 'true');
		this.isDisplayed = false;

	}
]);
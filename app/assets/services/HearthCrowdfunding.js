'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthCrowdfunding
 * @description
 */

angular.module('hearth.services').factory('HearthCrowdfundingBanner', [
	'$q', '$http',
	function($q, $http) {

		var isDisplayed = false;
		// var titleBannerIsClosed = ($.cookie('crowdsourcing-banner') === 'true');

		const BLOG_POST_COUNT = 3;
		const blogposts = [];

		initBlogposts();

		const factory = {
			bannerData: {
				// '_type': 'Banner', // ie. template -- watch for banner.html in templates/directives/items
				'_type': 'blogposts',
				'_id': '....' // to be generated
			},
			decorateMarketplace,
			blogposts,
		};

		return factory;

		///////////////

		function decorateMarketplace(data) {
			this.bannerData._id = Math.random * 10000;

			// apply only on full result set, when top banner has been closed by user.
			// then display this once on a first result set, then on no more
			// if (titleBannerIsClosed && !isDisplayed && data.length >= 15) {
			if (1 || !isDisplayed && data.length >= 15) {
				var position = 1 || Math.floor(Math.random() * 10) + 5;
				data.splice(position, 0, this.bannerData);
				isDisplayed = true;
			}

			return data;
		}

		////////////////

		function initBlogposts() {
			if (isDisplayed) return;

			// cleanup headers for the call
			var apiTokenHeader = $http.defaults.headers.common['X-API-TOKEN'];
			delete $http.defaults.headers.common['X-API-TOKEN'];
			var apiVersionHeader = $http.defaults.headers.common['X-API-VERSION'];
			delete $http.defaults.headers.common['X-API-VERSION'];
			var deviceHeader = $http.defaults.headers.common['X-DEVICE'];
			delete $http.defaults.headers.common['X-DEVICE'];

			$http.get('https://blog.hearth.net/category/pribehy-a-inspirace/feed/', {
				withCredentials: false,
				headers: {
					'Content-Type': undefined
				}
			}).then(res => {
				if (res.status === 200) {
					processBlogposts(res.data);
				} else {
					console.error('Failed to retrieve blogposts');
				}
			});

			// return headers to their default values
			$http.defaults.headers.common['X-API-TOKEN'] = apiTokenHeader;
			$http.defaults.headers.common['X-API-VERSION'] = apiVersionHeader;
			$http.defaults.headers.common['X-DEVICE'] = deviceHeader;

		}

		function processBlogposts(data) {
			const parser = new DOMParser();
			const postsFragment = parser.parseFromString(data, 'text/xml');
			const posts = postsFragment.querySelectorAll('item');
			const limit = posts.length < BLOG_POST_COUNT ? posts.length : BLOG_POST_COUNT;
			for (var i = 0;i < limit;i++) {
				blogposts.push(getBlogPostObject(posts[i]));
			}
		}

		function getBlogPostObject(post) {
			var title = getElInnerHtmlAsText(post.querySelector('title'), {strip: 'title'});
			var link = getElInnerHtmlAsText(post.querySelector('link'), {strip: 'link'});
			var text = getElInnerHtmlAsText(post.querySelector('description'), {strip: 'description'});
			var textHTML = ''; // variable for transfrerring xml into html
			var pubDate = getElInnerHtmlAsText(post.querySelector('pubDate'), {strip: 'pubDate'});

			// strip text of CDATA
			if (text) textHTML = text.replace('<![CDATA[', '').replace(']]>', '');

			// try to get image from the text html (this must happen after stripping CDATA)
			var image = document.createElement('div');
			image.innerHTML = textHTML;
			image = image.querySelector('[data-blogpost-thumbnail] img');

			const obj = {
				title,
				link,
				text: textHTML,
				image,
				date: new Date(pubDate)
			};

			return obj;
		}

		function getElInnerHtmlAsText(el, opts) {
			opts = opts || {};
			var s = new XMLSerializer();
			var str = s.serializeToString(el);
			if (opts.strip) str = str.substring(opts.strip.length + 2, str.length - (opts.strip.length + 3));
			return str;
		}

	}
]);
'use strict';

/**
 * @ngdoc service
 * @name hearth.services.HearthCrowdfunding
 * @description
 */

angular.module('hearth.services').factory('HearthCrowdfundingBanner', [
	'$q', '$http', 'ArrayHelper',
	function($q, $http, ArrayHelper) {

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
			if (!isDisplayed && data.length >= 15) {
				var position = Math.floor(Math.random() * 10) + 5;
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

			$http.get('https://blog.hearth.net/category/sdilime/feed/json', {
				withCredentials: false,
				headers: {
					'Content-Type': undefined //'application/javascript'
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
			var posts = data.items || [];
			const limit = posts.length < BLOG_POST_COUNT ? posts.length : BLOG_POST_COUNT;
			if (!posts.length) return;

			// shuffle the posts
			ArrayHelper.shuffle(posts);

			for (var i = 0;i < limit;i++) {
				blogposts.push(getBlogPostObject(posts[i]));
			}
		}

		function getBlogPostObject(post) { 
			var title = post.title;
			var link = post.url;
			var text = post.content_html;
			var pubDate = post.date_published;

			var description = document.createElement('div');
			description.innerHTML = text;
			var imgSrc = description.querySelector("img").getAttribute("src");
			text = description.innerText;
			
			var image = document.createElement('img');
			image.src = imgSrc;

			const obj = {
				title,
				link,
				text: text,
				image,
				date: new Date(pubDate)
			};

			return obj;
		}
	}
]);
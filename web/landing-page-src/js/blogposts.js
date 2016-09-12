(function(window, config) {

	var request = window.aeg.request,
		$ = window.aeg.$,
		fe = window.aeg.fe;

	var posts = [],
		postsElementWrapperSelector = '[blog-posts-wrapper]',
		postsElementWrapper = $(postsElementWrapperSelector);

	// If posts element wrapper is not present on the page, kill all blog posts processing
	if (postsElementWrapper && postsElementWrapper.length) {
		postsElementWrapper = postsElementWrapper[0];
	} else {
		return false;
	}

	var req = request('GET', 'https://blog.hearth.net/feed/');
	req.onload = function(data) {
		if (req.status === 200) {
			posts = req.responseText;
			// console.log('BLOG POSTS: ', posts);
			fillBlogPosts({posts: posts, limit: config.blogPostLimit});
		} else {
			blogPostsError(req);
		}
	}
	req.send();

	/**
	 *	- {String} posts - the string that comes from the server
	 *	- {Int} limit - the limit of posts to show
	 */
	function fillBlogPosts(params) {
		params = params || {};
		if (!(params.posts && params.posts.length)) return false;

		var postsFragment = document.createElement('div');
		postsFragment.innerHTML = params.posts;

		var posts = postsFragment.querySelectorAll('item');

		if (!posts.length) return blogPostsError();

		if (posts.length < config.blogPostLimit) params.limit = posts.length;
		for (var i = 0;i < params.limit;i++) {
			if (i === 0) console.log(posts[i]);
			appendBlogPost({post: posts[i]});
		}
	}

	function appendBlogPost(params) {
		if (!(params && params.post)) throw new TypeError('Trying to append an undefined blog post.');

		var standaradizedPost = document.createElement('div');
		standaradizedPost.className = 'flex-div flex-1 blog-block';

		var title = params.post.querySelector('title'),
			link = params.post.querySelector('link'),
			text = params.post.querySelector('content\\:encoded'),
			pubDate = params.post.querySelector('pubDate');

			console.log(link);

		standaradizedPost.innerHTML = ""
			+ "<div class='blog-img-wrapper'><div class='blog-img' id='image-blog-1'></div></div>"
			+ (pubDate && pubDate.innerHTML ? "<div class='text-muted'>" + pubDate.innerHTML + "</div>" : "")
			+ (title && title.innerHTML ? "<h3>" + title.innerHTML + "</h3>" : "")
			+ (text && text.innerHTML ? "<p>" + text.innerHTML + "</p>" : "")
			+ (link && link.innerHTML ? "<a href='" + link.innerHTML + "' class='display-block margin-top-medium color-primary'>Přečíst na blogu</a>" : "");

		postsElementWrapper.appendChild(standaradizedPost);
	}

	// var qqq = function(function(data) {
	// 	var $xml = $(data);
	// 	var cntr = 0;
	// 	$xml.find("item").each(function() {
	// 		cntr ++;
	// 		var $this = $(this),
	// 			item = {
	// 				title: $this.find("title").text(),
	// 				link: $this.find("link").text(),
	// 				description: $this.find("description").text(),
	// 				pubDate: $this.find("pubDate").text()
	// 		};
	// 		if (cntr > 3) return;
	// 		var html = '<article class="news-overview"><header><h3>\
	// 			<a title="Více z článku.." href="'+item.link+'">'+item.title+'</a></h3></header>\
	// 			<div class="abstract"><p>'+item.description+'</p></div><div class="btns">\
	// 			<a title="Více z článku.." class="more" href="'+item.link+'">Přečíst na blogu</a></div></article>';
	//
	// 		$('.news-list').append(html);
	// 	});
	// });

	function blogPostsError(req) {
		// TODO: hide the whole section?
		console.log('Blog posts request failed.' + (req ? ' Returned status of ' + req.status : ''));
	}

})(window, window.hearthConfig);
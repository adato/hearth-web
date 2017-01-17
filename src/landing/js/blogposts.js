;(function(window, config) {
	'use strict';

	var request = window.aeg.request,
		$ = window.aeg.$,
		fe = window.aeg.fe,
		formatDate = window.aeg.formatDate;

	var posts = [],
		postsSectionWrapperSelector = '[blog-post-section]',
		postsElementWrapperSelector = '[blog-posts-wrapper]',
		postsElementWrapper = $(postsElementWrapperSelector),
		readOnBlogTranslationSelector = '[translation-holder--read-on-our-blog]';

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

		var parser = new DOMParser();
		var postsFragment = parser.parseFromString(params.posts, 'text/xml');

		var posts = postsFragment.querySelectorAll('item');

		if (!posts.length) return blogPostsError();

		if (posts.length < config.blogPostLimit) params.limit = posts.length;
		for (var i = 0;i < params.limit;i++) {
			appendBlogPost({post: posts[i]});
		}
	}

	function appendBlogPost(params) {
		if (!(params && params.post)) throw new TypeError('Trying to append an undefined blog post.');

		var standaradizedPost = document.createElement('div');
		standaradizedPost.className = 'flex-div flex-1 blog-block';

		var title = params.post.querySelector('title'),
			link = params.post.querySelector('link'),
			text = params.post.querySelector('description'),
			textHTML = '', // variable for transfrerring xml into html
			pubDate = params.post.querySelector('pubDate');

		// strip text of CDATA
		if (text && text.innerHTML) textHTML = text.innerHTML.replace('<![CDATA[', '').replace(']]>', '');

		// try to get image from the text html (this must happen after stripping CDATA)
		var image = document.createElement('div');
		image.innerHTML = textHTML;
		image = image.querySelector('[data-blogpost-thumbnail] img');

		// try to format publishing date
		var formattedPubDate = formatDate(new Date(pubDate.innerHTML));

		var readOnBlog = 'Blog',
			readOnBlogTranslation = $(readOnBlogTranslationSelector);
		if (readOnBlogTranslation && readOnBlogTranslation.length) readOnBlog = readOnBlogTranslation[0].getAttribute('translation');

		standaradizedPost.innerHTML = ""
			+ (image ? '<div class="blog-img-wrapper">' + getElHtml(image) + '</div>' : '')
			+ (formattedPubDate ? '<div class="text-muted">' + formattedPubDate + '</div>' : '')
			+ (title && title.innerHTML ? '<h3>'
				+ (link && link.childNodes.length ? '<a target="_blank" href="' + link.childNodes[0].nodeValue + '">' : '')
			 		+ title.innerHTML
				+ (link && link.childNodes.length ? '</a>' : '')
			+ '</h3>' : '')
			+ (textHTML ? '<div class="faux-paragraph">' + textHTML + '</div>' : '')
			+ (link && link.childNodes.length ? '<a target="_blank" href="' + link.childNodes[0].nodeValue + '" class="display-block margin-top-medium color-primary">' + readOnBlog + '</a>' : '');

		postsElementWrapper.appendChild(standaradizedPost);
	}

	function getElHtml(el) {
		var div = document.createElement('div');
		div.appendChild(el);
		return div.innerHTML;
	}

	function blogPostsError(req) {
		console.log('Blog posts request failed.' + (req ? ' Returned status of ' + req.status : ''));

		// hide the whole blog posts wrapper
		fe($(postsSectionWrapperSelector), function(el) { el.style.display = 'none'; });
	}

})(window, window.hearthConfig);
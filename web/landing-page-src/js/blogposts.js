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

		var title = getElInnerHtmlAsText(params.post.querySelector('title'), {strip: 'title'}),
			link = getElInnerHtmlAsText(params.post.querySelector('link'), {strip: 'link'}),
			text = getElInnerHtmlAsText(params.post.querySelector('description'), {strip: 'description'}),
			textHTML = '', // variable for transfrerring xml into html
			pubDate = getElInnerHtmlAsText(params.post.querySelector('pubDate'), {strip: 'pubDate'});

		// strip text of CDATA
		if (text) textHTML = text.replace('<![CDATA[', '').replace(']]>', '');

		// try to get image from the text html (this must happen after stripping CDATA)
		var image = document.createElement('div');
		image.innerHTML = textHTML;
		image = image.querySelector('[data-blogpost-thumbnail] img');

		// try to format publishing date
		var formattedPubDate = formatDate(new Date(pubDate));

		var readOnBlog = 'Blog',
			readOnBlogTranslation = $(readOnBlogTranslationSelector);
		if (readOnBlogTranslation && readOnBlogTranslation.length) readOnBlog = readOnBlogTranslation[0].getAttribute('translation');


		standaradizedPost.innerHTML = ''
			+ (image ? '<div class="blog-img-wrapper">' + getElHtml(image) + '</div>' : '')
			+ (formattedPubDate ? '<div class="text-muted">' + formattedPubDate + '</div>' : '')
			+ (title ? '<h3>'
				+ (!!link ? '<a target="_blank" href="' + link + '">' : '')
			 		+ title
				+ (!!link ? '</a>' : '')
			+ '</h3>' : '')
			+ (textHTML ? '<div class="faux-paragraph">' + textHTML + '</div>' : '')
			+ (!!link ? '<a target="_blank" href="' + link + '" class="display-block margin-top-medium color-primary">' + readOnBlog + '</a>' : '');

		postsElementWrapper.appendChild(standaradizedPost);
	}

	/**
	 *	because IE is the BESTEST BROWSER EVER!
	 *
	 *	- opts - {String} strip - xml tag to strip
	 */
	function getElInnerHtmlAsText(el, opts) {
		opts = opts || {};
		var s = new XMLSerializer();
		var str = s.serializeToString(el);
		if (opts.strip) str = str.substring(opts.strip.length + 2, str.length - (opts.strip.length + 3));
		return str;
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
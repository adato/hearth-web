/* =======================================================================*
 * Own defined JavaScripts.                                               *
 *                                                                        *
 * by Codevels (info@codevels.com), 2014                                  *
 * =======================================================================*/

// to stop XX pixels above the target
var readabilityOffset = 80; 

var header = $( 'header.header>div.header-content' );
var headerHeight = header.innerHeight();
var headerWidth = header.innerWidth();
var viewportHeight = $(window).height();
var viewportWidth = $(window).width();
var viewportRatio = viewportHeight / viewportWidth;	
var logoWidth = $( '.logo-strip>.container' ).innerWidth();
setHeaderHeight();
// window.onresize = setHeaderHeight;
stickifyPanel( $( '.sticky-panel' ), '.logo-container')

$(function () 
{
	/* Enable smooth scrolling on anchors */
    $('a[href^="#"]').bind('click.smoothscroll', function (e) {
		    // Stop classic behavior
		    e.preventDefault();

		    // Locals
		    var target = this.hash;
		        $target = $(target);

		    $('html, body').stop().animate(
		    {
		        'scrollTop': $target.offset().top - readabilityOffset
		    }, 1000, 'swing', function () 
		    {
		        window.location.hash = target;
		    });
	});

    // load blog data
    $.get('//blog.hearth.net/feed/', function(data) {
        var $xml = $(data);
        var cntr = 0;
        $xml.find("item").each(function() {
        	cntr ++;
            var $this = $(this),
                item = {
                    title: $this.find("title").text(),
                    link: $this.find("link").text(),
                    description: $this.find("description").text(),
                    pubDate: $this.find("pubDate").text()
            };
            if (cntr > 3) return;
            var html = '<article class="news-overview"><header><!--<time datetime="'+item.pubDate+'">..</time>--><h3>'+item.title+'</h3></header><div class="abstract"><p>'+item.description+'</p></div><div class="btns"><a title="Více z článku.." class="more" href="'+item.link+'">Přečíst na blogu</a></div></article>';
            $('.news-list').append(html);
        });
    });

});

function setHeaderHeight() {
	// Set header part to fit viewport
	var height = (( viewportHeight * window.devicePixelRatio) / headerHeight) * .93 ;
	if (height > 1 || viewportRatio > 1) return;
	header.css({ "transform-origin": "0% 0%", "transform": "scale(" + height + ", " + height + ")", "width": headerWidth * (1/height) + "px" });
	header.height(viewportHeight * window.devicePixelRatio); 
	$( '.logo-strip>.container' ).width(logoWidth * (1/height));
	$( '.strip-btns>.container' ).width(logoWidth * (1/height));
	$( '.strip-btns .btn').css({ 'font-size': 18 * (1/height) + 'px' });
}

// Creates stickyfying behavior to the given panel
function stickifyPanel( stickyPanel, logoClass )
{
	$(function() 
	{
		var panelTopY = stickyPanel.offset().top;
		var panelBottomY = stickyPanel.offset().top + stickyPanel.innerHeight();
		var panelHeight = stickyPanel.height();
		var panelLinks = stickyPanel.find('.menu a');
		var scrollLinks = panelLinks.map(function() {
			var item = $($(this).attr("href"));
			if (item.length) { return item; }
		});
		var lastId;

		var positionPanel = function() {

			// set up scroll-spy adding .active class to right-over elements
	    	var panelHeight = panelBottomY - panelTopY;
			var fromTop = $(this).scrollTop() + panelHeight;
			var cur = scrollLinks.map(function() {
				if ($(this).offset().top < fromTop)
					return this;
			});
			cur = cur[cur.length-1];
			var id = cur && cur.length ? cur[0].id : "";
			if (lastId !== id) {
				lastId = id;
				panelLinks.parent().removeClass("active").end().filter("[href=#"+id+"]").parent().addClass("active");
			}

	    	var viewPortTopY = $( window ).scrollTop();
	    	var viewPortBottomY = viewPortTopY + $(window).height();
	    	var logo = $( logoClass );
	    	var body = $( document.body );

		    var opacityOffset = 100;

	    	// Fixed panel scroll support
	    	stickyPanel.css('left', -1 * $(this).scrollLeft() + "px");
	    	if ( $(this).scrollLeft() != 0 )
	    		stickyPanel.css('right', "auto");
	    	else
	    		stickyPanel.css('right', 0);

	    	// Decide where to stick (top/bottom?) the panel
		    if ( viewPortTopY > panelTopY ) 
		    {
		        body.addClass('stickify-up');
		        readabilityOffset = 20 + panelHeight;
		    } else 
		    {
		       	body.removeClass('stickify-up');

		        readabilityOffset = 20;

		       	if ( viewPortBottomY < panelBottomY )
		       	{
		        	body.addClass('stickify-down');
		       	}
		       	else 
		       	{
		        	body.removeClass('stickify-down');
		       	}
		    }

		    // Logo fade-in/out
		    if ( viewPortTopY < panelTopY - opacityOffset )
		    {
	    		logo.css({'opacity': 0 });
		    }
		    else if ( viewPortTopY > panelTopY)
		    {
	    		logo.css({'opacity': 1 });
		    }
		    else 
		    {
		    	var opacity = 1 + ( viewPortTopY - panelTopY ) / opacityOffset;
	    		logo.css({'opacity': opacity });
		    }
		}

		// Set it as scroll listener
		$(window).scroll(positionPanel);
		$(window).resize(positionPanel);

		// Call it for the first time, even before all scroll handlers fire
		positionPanel();
	})
}

// === Test if we are logged in hearth
// if yes, refresh user to /app
$.get('/api/session', function(res) {
	if(res._id)
		location.reload('/app');
});
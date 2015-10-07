preferredLanguage = $.cookie('language') || $$config.defaultLanguage;

$(function() { 
  
  $(window).scroll(function() {
    var fixedHeader = $('.navigation');

    fixedHeader.css('left', -1 * $(this).scrollLeft() + "px");
    if ( $(this).scrollLeft() != 0 )
      fixedHeader.css('right', "auto");
    else
      fixedHeader.css('right', 0);
  });
 
});

setTimeout(function(){var a=document.createElement("script");
var b=document.getElementsByTagName("script")[0];
a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/0018/6260.js?"+Math.floor(new Date().getTime()/3600000);
a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);

(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:$$config.hotjar,hjsv:5};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'//static.hotjar.com/c/hotjar-','.js?sv=');

var googleApiScriptUrl = '//maps.googleapis.com/maps/api/js?' +
    ($$config && $$config['map'] && $$config['map']['apiKey'] ? 'key=' + $$config['map']['apiKey'] + '&' : '') +
    'sensor=true&libraries=places,geometry&language=';
document.write('<script id="google-maps-script" src="'+googleApiScriptUrl+preferredLanguage+'"><\/script>');

$(document).foundation({
  offcanvas: {
    close_on_click: true
  }
});

$(function() { FastClick.attach(document.body);});

/**
 * Temporary function for cookie path translation
 * Move all cookies from /app/ path to /
 */
(function($) {
  var cookies = document.cookie.split('; ');
  var used = {};
  for(var i in cookies) {
    var c = cookies[i].split('=');
    if(used[c[0]])
      continue;
    used[c[0]] = c[1];

    $.removeCookie(c[0])
    // $.removeCookie(c[0], { path: '/app/' }); // => true
    $.cookie(c[0], c[1], {path: "/", expires: 20 * 365});
  }
})($);
// fb invite jump out from FB frame
if (top.location!= self.location) {
  top.location = self.location;
}

// fb login redirects to this URL
if (window.location.hash && window.location.hash === '#_=_') {
    window.location.hash = '';
}

// refresh from old URL style to new one #!/ => /
if (!!~window.location.href.indexOf('#!/')){
   // != -1 && window.location.href.indexOf('#!') == -1
  window.location.href =  window.location.href.replace('#!/', '');
}

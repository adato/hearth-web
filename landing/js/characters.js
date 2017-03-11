;(function(window, config) {
	'use strict';

	var requestApi = window.aeg.requestApi;
	var $ = window.aeg.$;
	var fe = window.aeg.fe;
  var apiPath = config.apiPath;

  var CHAR_FILL = 'character-fill';
  var CHARACTER_FILL_SELECTOR = '[' + CHAR_FILL + ']';

  fe($(CHARACTER_FILL_SELECTOR), item => {
    var character = item.getAttribute(CHAR_FILL);
    var req = requestApi('GET', apiPath + '/search?counters=true&type=post&character=' + character);
		req.onload = function() {
      if (req.status === 200) {
        var res = JSON.parse(req.responseText);
        if (!(res && res.counters && res.counters.post)) return console.info('derp');
        item.innerHTML = '(' + res.counters.post + ')';
      } else {
        console.error('Failed to fetch item counts for character "' + character + '"');
      }
    }
    req.send();
  });

})(window, window.hearthConfig);
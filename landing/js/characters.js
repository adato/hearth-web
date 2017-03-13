;(function(window, config) {
	'use strict';

	const requestApi = window.aeg.requestApi;
	const $ = window.aeg.$;
	const fe = window.aeg.fe;
  const apiPath = config.apiPath;

  const CHAR_FILL = 'character-fill';
  const CHARACTER_FILL_SELECTOR = '[' + CHAR_FILL + ']';

  const NUMBER_OF_GIFTS_TRANSLATION_SELECTOR = 'translation[rel="NUMBER_OF_GIFTS"]';
  const NUMBER_VARIABLE = '{{count}}';
  const NUMBER_OF_GIFTS_TRANSLATION = $(NUMBER_OF_GIFTS_TRANSLATION_SELECTOR)[0].innerHTML;

  fe($(CHARACTER_FILL_SELECTOR), item => {
    const character = item.getAttribute(CHAR_FILL);
    const req = requestApi('GET', apiPath + '/search?counters=true&type=post&character=' + character);
		req.onload = function() {
      if (req.status === 200) {
        const res = JSON.parse(req.responseText);
        if (!(res && res.counters && res.counters.post)) return console.info('derp');
        item.innerHTML = NUMBER_OF_GIFTS_TRANSLATION.replace(NUMBER_VARIABLE, res.counters.post);
      } else {
        console.error('Failed to fetch item counts for character "' + character + '"');
      }
    }
    req.send();
  });

})(window, window.hearthConfig);
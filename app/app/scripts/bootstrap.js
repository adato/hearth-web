// scripts to be loaded sooner
preferredLanguage = $.cookie('language') || $$config.defaultLanguage;

var googleApiScriptUrl = '//maps.googleapis.com/maps/api/js?' +
	($$config && $$config['map'] && $$config['map']['apiKey'] ? 'key=' + $$config['map']['apiKey'] + '&' : '') +
	'libraries=places,geometry&language=';
document.write('<script id="google-maps-script" src="' + googleApiScriptUrl + preferredLanguage + '"><\/script>');
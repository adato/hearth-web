'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.filterbar
 * @description Main bar of app
 * @restrict E
 */
angular.module('hearth.directives').directive('filterbar', ['$state', 'geo', '$location', 'Auth', '$timeout', 'Filter', '$rootScope', 'KeywordsService', 'LanguageList', '$translate', '$window', 'ItemAux',
  function($state, geo, $location, Auth, $timeout, Filter, $rootScope, KeywordsService, LanguageList, $translate, $window, ItemAux) {
		return {
			replace: true,
			restrict: 'E',
			templateUrl: 'assets/components/filterbar/filterbar.html',
			scope: true,
			link: function(scope, element) {
        var filterDefault = {
          query: null,
          type: null,
          post_type: null,
          character: null,
          distance: 25,
          inactive: null,
          keywords: [],
          days: null,
          post_language: 'my',
        };

        var options = {
          types: ['geocode']
        };
        var input = $('input#geolocation', element);
        var autocomplete = new google.maps.places.Autocomplete(input[0], options);

        scope.loggedUser = Auth.isLoggedIn();
        scope.inited = false;
        scope.filterCount = false;
        scope.postCharacter = $window.$$config.postCharacter;
				scope.filterType = $state.params.type;
				scope.searchParams = '';

        angular.extend(scope, {
          filterSelected: false
        });

        // add single filter property and apply filter
        scope.addFilter = (name, value) => {
          scope.filter[name] = value;
          scope.applyFilter();
        };

        scope.applyFilter = () => {
          if ($.isEmptyObject(scope.filter)) {
            scope.reset();
          } else {
            Filter.apply(convertFilterToParams(scope.filter), scope.filterSave, true);
            scope.close();
          }
        };

        // convert parameters from scope to location fields
        function convertFilterToParams(filter) {
          var fields = ['query', 'type', 'inactive', 'post_type', 'days', 'lang', 'r_lang', 'my_section', 'character'],
            related = [],
            // character = [],
            params = {};

          fields.forEach(function(name) {
            if (typeof filter[name] !== 'undefined' && filter[name] !== null) params[name] = filter[name];
          });

          if (filter.user) {
            related.push('user');
          }
          if (filter.community) {
            related.push('community');
          }
          if (related.length) {
            params.related = related.join(',');
          }
          if (filter.keywords.length) {
            params.keywords = $.map(filter.keywords || [], function(item) {
              return item.text;
            }).join(',');
          }

          // by location
          if (filter.lon && filter.lat && filter.name) {
            params.lon = filter.lon;
            params.lat = filter.lat;
            params.name = filter.name;
            params.distance = parseInt(filter.distance) + $$config.lengthUnit;
            params.order = 'distance';
          }

          // all languages
          if (filter.post_language == 'all') {
            params.lang = 'all';
          }
          // own language (selected from ui box)
          if (filter.post_language == 'other' && typeof filter.post_language_other != 'undefined' && filter.post_language_other != null && filter.post_language_other.length > 0) {
            // thou return only them code, neigh them name
            let lang = filter.post_language_other.map(function (item) {
              return item.code;
            });
            params.lang = lang.join(',');
          }

          // all languages I speak, taken from session
          if (filter.post_language == 'my') {
            params.lang = Auth.getUserLanguages();
          }

          return params;
        };

        // convert fields from url to scope parameters
        scope.convertParamsToFilter = function(params) {
          if (params.keywords && !$.isArray(params.keywords)) {
            params.keywords = params.keywords.split(",");
          }

          var filter_post_language_other = [];

          var getParamPostLanguage = function (lang_param) {
            if (lang_param == 'all') {
              return 'all';
            }
            // if it is the same as in session or default filter
            if (typeof lang_param == 'undefined' || JSON.stringify(lang_param.split(',').sort()) == JSON.stringify(Auth.getUserLanguages().split(',').sort())) {
              return 'my';
            }
            // otherwise check 'other' and prefill select box
            lang_param.split(',').forEach(function (userLang) {
              filter_post_language_other.push({
                'code': userLang,
                'name': $translate.instant('MY_LANG.' + userLang)
              });
            });
            return 'other';
          };

          var filter = {
            query: params.query || filterDefault.query,
            inactive: params.inactive || filterDefault.inactive,
            type: params.type || filterDefault.type,
            post_type: params.post_type || filterDefault.post_type,
            days: params.days || filterDefault.days,
            post_language: getParamPostLanguage(params.lang),
            post_language_other: filter_post_language_other,
            r_lang: params.r_lang,
            my_section: params.my_section,
            character: params.character || filterDefault.character,
            user: (params.related || '').indexOf('user') > -1 ? true : undefined,
            community: (params.related || '').indexOf('community') > -1 ? true : undefined,
            keywords: $.map(params.keywords || {}, function(keyword) {
              return {
                text: keyword
              };
            }),
            lon: params.lon,
            lat: params.lat,
            name: params.name,
            distance: parseInt((params.distance || filterDefault.distance)),
          };

          if (filter.name === '') {

            delete filter.lon;
            delete filter.lat;
            delete filter.name;
            delete filter.distance;
          }
          return filter;
        };


        scope.toggleFilter = () => {
          scope.filterSelected = !scope.filterSelected;
        };

        scope.testFilterActive = () => {
          var paramString = Filter.getParams();

          scope.filterOn = Filter.isSet();
          scope.searchParams = (paramString) ? '?' + paramString : '';
        };

        scope.cancelFilter = () => { Filter.reset(); };

        scope.logCharInfoShown = () => {ItemAux.logCharInfoShown('Filter')};

        scope.configOptionsShow = Filter.getOptionsShow($state.current.name);
        if (!scope.type) scope.type = 'post';

        var timeout = $timeout(() => {
          $(".tags input", element).keypress(function(e) {
            if ($(e.target).val() != '') {
              if (e.keyCode == 9) {
                var self = this;
                setTimeout(function() {
                  $(".tags input", element).focus();
                });
              }
            }
          });
        });

        scope.queryKeywords = ($query) => {
          if ($query === '' || $query.length < 3) {
            return Filter.queryCommonKeywords($query);
          }
          return KeywordsService.queryKeywords($query);
        };

        // when (un)checked checkbox for save filter - send request also to api
        scope.toggleSaveFilter = (save) => {
          if (!$rootScope.loggedUser._id) return false;

          if (save) {
            Filter.setUserFilter(convertFilterToParams(scope.filter));
          } else {
            Filter.deleteUserFilter();
          }
        };

        scope.close = () => { scope.$emit('filterClose'); };

        scope.reset = () => { Filter.reset(); };

        scope.insertKeyword = (keyword) => {
          var exists = false;

          if (scope.filter.keywords) {
            scope.filter.keywords.forEach(function(val) {
              if (val.text === keyword)
                exists = true;
            });
          }

          if (!exists)
            scope.filter.keywords.push({
              text: keyword
            })
        };

        scope.loadKeywords = () => {
          Filter.getCommonKeywords(function(res) {
            scope.commonKeywords = res;
          });
        };

        scope.loadLanguages = () => {
          scope.languageList = LanguageList.localizedList;
        };


        // it queries languages for tag-input autocomplete filtering
        scope.queryLanguages = (query) => {
          var languages = LanguageList.localizedList;

          return languages.filter((lang) => {
            return lang.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
          });
        };

        scope.recountPosts = () => {
          var f = convertFilterToParams(scope.filter);
          if (!f.type) f.type = scope.type;
          if (f.lang == 'all') delete f.lang;
          Filter.getFilterCount(f, function(count) {
            scope.filterCount = count;
          });
        };

        scope.updateFilterByRoute = () => {
          var search = $location.search();
          scope.filter = $.isEmptyObject(search) ? angular.copy(filterDefault) : scope.convertParamsToFilter(search);
        };

        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();

          if (typeof place === "undefined" || !place.address_components) {
            $(input).val('');
            return false;
          }

          if (place && place.address_components) {
            var location = place.geometry.location;
            var name = place.formatted_address;

            scope.$apply(function() {
              scope.filter.name = name;
              scope.filter.lat = location.lat();
              scope.filter.lon = location.lng();
            });
          }
        });

        // watchers
        scope.$watch('filter', scope.recountPosts, true);
        scope.$watch('filterShown', function(isShown) {
          if (isShown) scope.recountPosts();
        });

        // listeners
        scope.$on('filterOpen', scope.toggleFilter);
        scope.$on('filterReset', scope.cancelFilter);

        scope.$on('filterClose', function() {
          scope.filterSelected = false;
        });

        scope.$on('filterReseted', function() {
          scope.testFilterActive();
          $rootScope.searchQuery.query = null;
          scope.filter = angular.copy(filterDefault);
          scope.filterSave = false;
          scope.close();
        });

        scope.$on('filterApplied', function() {
          scope.testFilterActive();
          scope.updateFilterByRoute();
        });

        scope.$on('initFinished', scope.init);

        scope.$on('$destroy', function() {
          scope.input = null;
          scope.autocomplete = null;
          $timeout.cancel(timeout);
          $(".tags input", element).unbind('keypress');
        });

        scope.init = function() {
          scope.inited = true;
          scope.loadKeywords();
          scope.loadLanguages();
          scope.filterSave = Filter.isSaved();
        };

        scope.testFilterActive();
        scope.updateFilterByRoute();
        $rootScope.initFinished && scope.init();
			}
		};
	}
]);

'use strict';

angular.module('hearth.directives').directive('createAdSelect', [

	function() {
		return {
			restrict: 'AE',
			replace: true,
			scope: true,
			template: '<div>\
        <div ng-click="typeSwitchVisible = !typeSwitchVisible" ng-class="{ \'muted\' : typeSwitchVisible }">\
            <a href="" ng-show="loggedCommunity._id && post.type == \'need\'">{{ \'WE_NEED\' | translate }}<i ng-class="{ \'icon-caret-down right\': !typeSwitchVisible, \'icon-caret-up right\': typeSwitchVisible }" style="margin:3px;"></i></a>\
            <a href="" ng-show="loggedCommunity._id && post.type == \'offer\'">{{ \'WE_GIVE\' | translate }}<i ng-class="{ \'icon-caret-down right\': !typeSwitchVisible, \'icon-caret-up right\': typeSwitchVisible }" style="margin:3px;"></i></a>\
            <a href="" ng-show="!loggedCommunity._id && post.type == \'need\'">{{ \'NEED\' | translate }}<i ng-class="{ \'icon-caret-down right\': !typeSwitchVisible, \'icon-caret-up right\': typeSwitchVisible }" style="margin:3px;"></i></a>\
            <a href="" ng-show="!loggedCommunity._id && post.type == \'offer\'">{{ \'OFFER\' | translate }}<i ng-class="{ \'icon-caret-down right\': !typeSwitchVisible, \'icon-caret-up right\': typeSwitchVisible }" style="margin:3px;"></i></a>\
        </div>\
        <div ng-show="typeSwitchVisible" ng-click="typeSwitchVisible = false">\
            <div class="hr" style=""></div>\
            <a href="" ng-click="post.type = \'need\';" ng-show="loggedCommunity._id">{{ \'WE_NEED\' | translate }}</a>\
            <a href="" ng-click="post.type = \'offer\';" ng-show="loggedCommunity._id">{{ \'WE_GIVE\' | translate }}</a>\
            <a href="" ng-click="post.type = \'need\';" ng-show="!loggedCommunity._id">{{ \'NEED\' | translate }}</a>\
            <a href="" ng-click="post.type = \'offer\';" ng-show="!loggedCommunity._id">{{ \'OFFER\' | translate }}</a>\
        </div>\
    </div>',
			link: function(scope, el, attrs) {}
		};
	}
]).directive('fulltextTypeahead', [

	function() {
		return {
			restrict: 'AE',
			replace: true,
			scope: true,
			template: '\
      <form ng-submit="refreshSearch(); a.focused = false" class="search-form">\
        <button class="prefix primary button connect-left round padding-1" type="submit" style="width:10%; height:100%;" ng-click="srch.type = null;"><i class="icon-search"></i></button>\
        <input type="text"\
               ng-click="a.focused = !a.focused"\
               ng-init="a.focused = false"\
               ng-keydown="moveCursor($event)"\
               ng-model="srch.query" placeholder="{{ \'TYPE_IN_WHAT_YOU_SEARCH_FOR\' | translate }}"\
               style="width:90%;"\
               class="text-input round connect-right">\
        <div class="typeahead" ng-show="srch.query && a.focused">\
            <div ng-repeat="filter in srch.filters" ng-mouseenter="setSel($index)" ng-mouseleave="setSel(srch.filters.length)" ng-class="{ \'item-selected\': sel == $index}">\
                <div ng-click="setSearchType(filter.type); a.focused = false;refreshSearch();">\
                {{ srch.query }} <b>{{ \'FULLTEXT_SEARCH_IN\' | translate }} {{ filter.name | translate }}</b>\
                </div>\
            </div>\
        </div>\
      </form>',
			link: function(scope, el, attrs) {
				scope.sel = 3;
				scope.setSel = function(sel) {
					return scope.sel = sel;
				};
				return scope.moveCursor = function($event) {
					var _ref, _ref1, _ref2;
					if (!scope.a.focused && ((_ref = $event.keyCode) === 38 || _ref === 40)) {
						scope.a.focused = true;
					}
					if ($event.keyCode === 38) {
						scope.setSel(scope.sel - 1);
					}
					if ($event.keyCode === 40) {
						scope.setSel(scope.sel + 1);
					}
					if (scope.sel > scope.srch.filters.length) {
						scope.setSel(0);
					}
					if (scope.sel < 0) {
						scope.setSel(scope.srch.filters.length);
					}
					if ($event.keyCode === 27) {
						scope.a.focused = false;
						scope.setSel(0);
					}
					if ($event.keyCode === 13) {
						if (((_ref1 = scope.srch.filters[scope.sel]) != null ? _ref1.type : void 0) != null) {
							scope.setSearchType(scope.srch.filters[scope.sel].type);
						} else {
							scope.setSearchType(null);
						}
						scope.refreshSearch();
						scope.a.focused = false;
						$event.preventDefault();
					}
					if ((_ref2 = $event.keyCode) === 38 || _ref2 === 40 || _ref2 === 13 || _ref2 === 27) {
						return $event.stopPropagation();
					}
				};
			}
		};
	}
]);
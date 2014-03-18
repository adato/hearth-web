angular.module('hearth.directives', [])
	.directive('feature', function($feature) {
		return {
			restrict: 'EC',
			scope: {
				enabled: '@',
				disabled: '@'
			},
			link: function(scope, element, attrs) {
				if (((attrs.enabled != null) && !$feature.isEnabled(attrs.enabled)) || ((attrs.disabled != null) && $feature.isEnabled(attrs.disabled))) {
					return element.remove();
				}
			}
		};
	}).directive('featureEnabled', function($feature) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				if (!$feature.isEnabled(attrs.featureEnabled)) {
					return element.remove();
				}
			}
		};
	}).directive('featureDisabled', function($feature) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				if ($feature.isEnabled(attrs.featureDisabled)) {
					return element.remove();
				}
			}
		};
	}).directive('signedIn', function($session) {
		return {
			link: function(scope, element, attrs) {
				return $session.then(function(session) {
					if (!session._id) {
						return element.css('display', 'none');
					}
				}, function() {
					return element.css('display', 'none');
				});
			}
		};
	}).directive('signedOut', function($session) {
		return {
			link: function(scope, element, attrs) {
				return $session.then(function(session) {
					if (session._id) {
						return element.css('display', 'none');
					}
				}, function() {
					return element.css('display', 'none');
				});
			}
		};
	}).directive('apiPrefix', function() {
		return {
			scope: {
				apiHref: '@',
				apiSrc: '@',
				action: '@'
			},
			link: function(scope, element, attrs) {
				return [['apiHref', 'href'], ['ngSrc', 'src'], ['action', 'action']].forEach(function(attr) {
					if (attrs[attr[0]]) {
						return element.attr(attr[1], '' + $$config.apiPath + attrs[attr[0]]);
					}
				});
			}
		};
	}).directive('fileUploadOutput', [
		'$rootScope',
		function($rootScope) {
			return {
				scope: true,
				replace: true,
				template: '<div>' + '<ul ng-if="!progress && errors.length"><li ng-repeat="error in errors"><small class="alert-box alert error round">{{ error | translate}}</small></li></ul>' + '<div class="progress success round" ng-show="progress"><span class="meter" style="width: {{ progress }}%;"></span></div>' + '</div>',
				link: function(scope, el, attrs) {
					var init;
					init = function() {
						scope.progress = 0;
						return scope.errors = [];
					};
					$rootScope.$on('fileUploadProgress', function($event, val) {
						if (val.percent != null) {
							return scope.progress = val.percent;
						}
					});
					$rootScope.$on('fileUploadError', function($event, val) {
						return scope.errors = val.errors;
					});
					$rootScope.$on('fileUploadFinished', function($event, val) {
						return init();
					});
					return init();
				}
			};
		}
	]).directive('fileUpload', [
		'$timeout', '$parse', '$rootScope',
		function($timeout, $parse, $rootScope) {
			return {
				transclude: true,
				replace: true,
				scope: true,
				template: '<div>' + '<span ng-transclude style="position:relative"></span>' + '<input class="file-upload-input" type="file"' + 'id="{{ uploadElementName }}" name="{{ uploadElementName }}"' + 'accept="image/*" capture style="">' + '</div>',
				link: function(scope, el, attrs) {
					var invoker;
					scope.uploadName = attrs.uploadName;
					scope.$watch(scope.uploadName, function(newval) {
						if (newval != null) {
							return scope.uploadElementName = newval;
						}
					});
					if (attrs.onFileUploadSuccess) {
						invoker = $parse(attrs.onFileUploadSuccess);
					}
					return el.bind('change', function(event) {
						return scope.$apply(function() {
							var errorUpload, file, formData, progressUpload, successUpload, xhr;
							file = event.target.files[0];
							if (!file) {
								return;
							}
							scope.errors = [];
							if (!/^image\//.test(file.type)) {
								scope.errors.push('ERR_WRONG_IMAGE_TYPE');
							}
							if (file.size > 1024 * 1024 * 10) {
								scope.errors.push('ERR_WRONG_IMAGE_SIZE');
							}
							if (scope.errors.length) {
								$rootScope.$broadcast('fileUploadError', {
									errors: scope.errors
								});
								return;
							}
							scope.progress = 0;
							scope.uploaded = false;
							formData = new FormData();
							formData.append(scope.uploadElementName, file);
							xhr = new XMLHttpRequest();
							progressUpload = function(val) {
								var progress;
								progress = (val.loaded / val.total) * 100;
								return scope.$apply(function() {
									$rootScope.$broadcast('fileUploadProgress', {
										percent: progress
									});
									return scope.progress = progress;
								});
							};
							successUpload = function(xhrEvent) {
								return scope.$apply(function() {
									$rootScope.$broadcast('fileUploadFinished', {});
									scope.progress = 0;
									scope.uploaded = true;
									if (attrs.onFileUploadSuccess) {
										return invoker(scope, {
											$event: xhrEvent
										});
									}
								});
							};
							errorUpload = function() {
								$rootScope.$broadcast('fileUploadError', {
									error: scope.errors
								});
								return scope.$apply(function() {
									scope.progress = 0;
									scope.uploaded = false;
									if (attrs.onFileUploadError) {
										return scope.$eval(attrs.onFileUploadError);
									}
								});
							};
							xhr.upload.addEventListener('progress', progressUpload, false);
							xhr.addEventListener('load', successUpload, false);
							xhr.addEventListener('error', errorUpload, false);
							xhr.addEventListener('abort', errorUpload, false);
							xhr.open('POST', $$config.apiPath + attrs.fileUploadPath);
							xhr.send(formData);
							if (attrs.onFileUploadStarted) {
								return scope.$eval(attrs.onFileUploadStarted);
							}
						});
					});
				}
			};
		}
	]).directive('htmlLabel', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				attrs.$observe('html', function(value) {
					return element.html(value);
				});
				return element.bind('click', function(event) {
					if (event.target.nodeName.toLowerCase() === 'a') {
						$('#terms').foundation('reveal', 'open');
						event.preventDefault();
						return event.stopPropagation();
					}
				});
			}
		};
	}).directive('validatedCheckbox', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var input;
				input = element.find('input');
				return scope.$watch(function() {
					var hasError, hasPristine;
					hasPristine = input.hasClass('ng-pristine');
					hasError = input.hasClass('ng-invalid');
					if (!hasError || hasPristine) {
						return element.removeClass('ng-invalid');
					} else {
						return element.addClass('ng-invalid');
					}
				});
			}
		};
	}).directive('withErrors', function() {
		return {
			restrict: 'A',
			require: 'form',
			link: function(scope, element, attrs, form) {
				var clearPristine, fixAutoComplete;
				fixAutoComplete = function(form, element) {
					return angular.forEach(element[0].elements, function(formControl) {
						var model;
						$(formControl).removeClass('ng-pristine');
						$(formControl).addClass('ng-dirty');
						model = form[formControl.name];
						if (!model) {
							return;
						}
						switch (formControl.type) {
							case 'checkbox':
								if ( !! model.$viewValue !== !! formControl.checked) {
									return model.$setViewValue(formControl.value);
								}
								break;
							default:
								return model.$setViewValue(formControl.value);
						}
					});
				};
				clearPristine = function(form, element) {
					form.$pristine = false;
					element.removeClass('ng-pristine');
					form.$dirty = true;
					element.addClass('ng-dirty');
					return angular.forEach(element[0].elements, function(formControl) {
						var model;
						model = form[formControl.name];
						if (!model) {
							return;
						}
						return model.$setViewValue(model.$viewValue);
					});
				};
				return element.bind('submit', function(event) {
					fixAutoComplete(form, element);
					clearPristine(form, element);
					if (!form.$valid) {
						return event.preventDefault();
					}
				});
			}
		};
	}).directive('timeAgo', [
		'timeAgoService', '$rootScope',
		function(timeago, $rootScope) {
			return {
				replace: true,
				restrict: 'EA',
				scope: {
					'fromTime': '='
				},
				link: {
					post: function(scope, linkElement, attrs) {
						scope.process = function() {
							var value;
							if (scope.timeago.nowTime != null) {
								value = scope.timeago.nowTime - timeago.x(scope.fromTime);
								if (value) {
									return linkElement.text(scope.timeago.inWords(value));
								}
							}
						};
						scope.timeago = timeago;
						scope.timeago.init();
						scope.$watch('timeago.nowTime-timeago.x(fromTime)', function(value) {
							return scope.process();
						});
						return $rootScope.$on('$translateChangeSuccess', function() {
							return scope.process();
						});
					}
				}
			};
		}
	]).directive('whenScrolled', [
		'$timeout',
		function($timeout) {
			return function(scope, elm, attr) {
				var lastRun, raw;
				raw = elm[0];
				lastRun = null;
				return angular.element(window).bind('scroll', function(evt) {
					var rectObject;
					rectObject = raw.getBoundingClientRect();
					if (parseInt(rectObject.bottom) > 0 && parseInt(rectObject.bottom) <= parseInt(window.innerHeight)) {
						evt.stopPropagation();
						evt.preventDefault();
						if (lastRun + 2000 < new Date().getTime()) {
							scope.$apply(attr.whenScrolled);
							return lastRun = new Date().getTime();
						}
					}
				});
			};
		}
	]).directive('scrollTo', [
		'$location', '$anchorScroll',
		function($location, $anchorScroll) {
			return function(scope, element, attrs) {
				return element.bind('click', function(event) {
					var location;
					event.stopPropagation();
					location = attrs.scrollTo;
					$location.hash(location);
					return $anchorScroll();
				});
			};
		}
	]).directive('feedback', function() {
		return {
			restrict: 'E',
			replace: true,
			template: '<div class="ratings-bar large-centered">' + '<i class="hearthicon-appreciate"></i>' + '<div class="ratio">' + '<div class="thumb-ups" ng-style="ratio" title="{{ upVotes }}"></div>' + '<div class="thumb-downs" title="{{ downVotes }}"></div>' + '</div>' + '<i class="hearthicon-hate right"></i>' + '</div>',
			link: function(scope, el, attrs) {
				var recompute;
				recompute = function() {
					var ratio;
					ratio = (100 / (scope.upVotes + scope.downVotes)) * scope.downVotes;
					return scope.ratio = {
						right: ratio + '%'
					};
				};
				scope.$watch(attrs.upVotes, function(newval) {
					if (newval >= 0) {
						scope.upVotes = newval;
						return recompute();
					}
				});
				return scope.$watch(attrs.downVotes, function(newval) {
					if (newval >= 0) {
						scope.downVotes = newval;
						return recompute();
					}
				});
			}
		};
	}).directive('addressAutocomplete', [
		'$timeout',
		function($timeout) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					'connections': '@',
					'placeholders': '=',
					'location': '=',
					'isRequired': '=',
					'onEmpty': '&',
					'focus': '&',
					'blur': '&'
				},
				controller: [
					'$scope', '$timeout',
					function($scope, $timeout) {
						$scope.$watch('location', function(newval) {
							if ((newval != null) && ((newval != null ? newval.name : void 0) != null)) {
								return $scope.setLocation(newval);
							} else {
								return $scope.locationName = '';
							}
						});
						return $scope.setLocation = function(location) {
							$scope.locationName = location.name;
							$scope.location = location || null;
							return location.enabled = true;
						};
					}
				],
				template: '<input type="text" class="location text-input" placeholder="{{ placeholders | translate }}"' + ' ng-model="locationName" ng-focus="focus()" ng-blur="doBlur()" ng-required="isRequired">',
				link: function(scope, el, attrs) {
					var init, inputElement;
					scope.doBlur = function() {
						return $timeout(function() {
							return scope.blur();
						}, 100);
					};
					inputElement = el[0];
					angular.element(inputElement).bind('focus', function() {
						return scope.$apply(function() {
							scope.locationName = '';
							if (!scope.initted) {
								init();
							}
							if ((scope.onEmpty != null) && scope.onEmpty && !scope.locationName) {
								return scope.onEmpty();
							}
						});
					});
					return init = function() {
						var autocomplete;
						scope.initted = true;
						autocomplete = new google.maps.places.Autocomplete(inputElement);
						google.maps.event.addDomListener(inputElement, 'keydown', function(e) {
							if (e.keyCode === 13) {
								e.preventDefault();
							}
							return $('body > .pac-container').filter(':visible').bind('DOMNodeInserted DOMNodeRemoved', function(event) {
								return $('.pac-item').addClass('needsclick');
							});
						});
						return google.maps.event.addListener(autocomplete, 'place_changed', function(a, b, c) {
							var place;
							place = autocomplete.getPlace();
							if (!(place.geometry || place.geometry.location)) {
								return;
							}
							return scope.$apply(function() {
								var location;
								location = {
									coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
									name: place.formatted_address,
									type: 'Point',
									enabled: true
								};
								return scope.setLocation(location);
							});
						});
					};
				}
			};
		}
	]).directive('setLocation', [
		'$timeout', 'Geocoder', 'UserLocation',
		function($timeout, Geocoder, UserLocation) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					location: '=',
					loggedUser: '=',
					setLocationFn: '&'
				},
				templateUrl: 'userLocationDirective.html',
				link: function(scope, el, attrs) {
					scope.showAutodetect = false;
					scope.emptyFocusFn = function() {
						return scope.showAutodetect = true;
					};
					scope.editLocation = function() {
						return scope.editingLocation = true;
					};
					scope.autodetectMyLocation = function() {
						return Geocoder.findMeAndGeocode().then(function(geocodedLocation) {
							return scope.location = geocodedLocation;
						});
					};
					scope.$watch('location', function(newval, oldval) {
						scope.editingLocation = false;
						if ((newval != null) && newval !== oldval && oldval !== undefined) {
							scope.saveLocation();
						}
						if (newval == null) {
							return scope.editLocation();
						}
					});
					return scope.saveLocation = function() {
						var location, _ref;
						if (!scope.location) {
							return;
						}
						scope.editingLocation = false;
						location = Geocoder.latLonToGeoJson(scope.location);
						if (((_ref = scope.loggedUser) != null ? _ref._id : void 0) == null) {
							scope.setLocationFn({
								location: scope.location
							});
							return;
						}
						location.id = scope.loggedUser._id;
						return UserLocation.add(location, function(data) {
							return scope.setLocationFn({
								location: scope.location
							});
						});
					};
				}
			};
		}
	]).directive('identitySwitch', [
		'UsersService', 'Auth', '$window', '$location', '$timeout',
		function(UsersService, Auth, $window, $location, $timeout) {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					loggedUser: '=',
					loggedCommunity: '=',
					switchFn: '&'
				},
				template: '<div class="user-switch text-center" ng-if="loggedUser._id" title="{{ loggedCommunity.name || loggedUser.name }} ">\
                <div class="switch">\
                    <a href="" ng-click="clickAvatar()">\
                        <avatar source="loggedEntity.avatar" size="normal" type="loggedEntity._type"></avatar>&nbsp;\
                        <i class="icon-chevron-down" ng-show="!switchExpanded && myCommunities.length"></i>\
                        <i class="icon-chevron-up" ng-show="switchExpanded && myCommunities.length"></i>\
                    </a>\
                </div>\
                <div class="switch-menu" ng-show="switchExpanded && myCommunities.length">\
                    <ul>\
                        <li>\
                            <a href="" ng-click="switchBack()" title="{{ loggedUser.name }}">\
                                <avatar source="loggedUser.avatar" size="small" type="\'User\'"></avatar>\
                                {{ loggedUser.name }}\
                            </a>\
                        </li>\
                        <li ng-repeat="community in myCommunities">\
                            <a href="" ng-click="switchTo(community)" title="{{ community.name }}">\
                                <avatar source="community.avatar" size="small" type="\'Community\'"></avatar>\
                                {{ community.name }}\
                            </a>\
                        </li>\
\
                    </ul>\
                </div>\
            </div>',
				link: function(scope, el, attrs) {
					var init;
					scope.myCommunities = [];
					scope.switchTo = function(account) {
						var accountId;
						accountId = account.id || account._id;
						return Auth.switchIdentity(accountId).then(function() {
							$location.path('/community/' + accountId);
							return $timeout(function() {
								return $window.location.reload();
							});
						});
					};
					scope.switchBack = function() {
						return Auth.switchIdentityBack().then(function() {
							$location.path('/profile/' + scope.loggedUser._id);
							return $timeout(function() {
								return $window.location.reload();
							});
						});
					};
					scope.clickAvatar = function() {
						var _ref, _ref1, _ref2;
						if ((_ref = scope.myCommunities) != null ? _ref.length : void 0) {
							return scope.switchExpanded = !scope.switchExpanded;
						} else {
							if (!((_ref1 = scope.loggedCommunity) != null ? _ref1._id : void 0)) {
								$location.path('/profile/' + scope.loggedUser._id);
							}
							if ((_ref2 = scope.loggedCommunity) != null ? _ref2._id : void 0) {
								return $location.path('/community/' + scope.loggedCommunity._id);
							}
						}
					};
					scope.$watch('loggedUser', function(newval, oldval) {
						if (newval !== oldval && (newval !== null && newval !== (void 0))) {
							return init();
						}
					});
					scope.$watch('loggedCommunity', function(newval, oldval) {
						if (newval !== oldval && (newval !== null && newval !== (void 0))) {
							return init();
						}
					});
					init = function() {
						var _ref;
						scope.loggedEntity = scope.loggedCommunity || scope.loggedUser;
						if (((_ref = scope.loggedUser) != null ? _ref._id : void 0) != null) {
							return UsersService.queryCommunities(scope.loggedUser._id).then(function(data) {
								scope.myCommunities = [];
								return data.forEach(function(item) {
									if ((item.admin != null) && item.admin === scope.loggedUser._id) {
										return scope.myCommunities.push({
											name: item.userFullname,
											id: item.userId._id,
											avatar: item.userAvatar
										});
									}
								});
							});
						}
					};
					return init();
				}
			};
		}
	]).directive('avatar', [

		function() {
			return {
				restrict: 'E',
				replace: true,
				scope: {
					'relation': '=',
					'source': '=',
					'clickFn': '&click',
					'type': '='
				},
				template: '<span ng-class="extraClass" ng-click="clickFn()" style="z-index:1000;"><img ng-src="{{ image.src }}" height="{{ image.px }}" width="{{ image.px }}"></span>',
				link: function(scope, el, attrs) {
					scope.$watch('relation', function(val) {
						return scope.extraClass = val;
					});
					scope.$watch('type', function(val) {
						if (val === 'Community') {
							scope.defaultImageType = EMPTY_COMMUNITY_AVATAR_URL;
						}
						if (val === 'User' || val === null || val === undefined) {
							return scope.defaultImageType = EMPTY_AVATAR_URL;
						}
					});
					return scope.$watch('source', function(val) {
						scope.image = {
							name: 'normal',
							src: scope.defaultImageType
						};
						if ((attrs["class"] != null) && attrs['class']) {
							scope.image.className = attrs['class'];
						}
						if (attrs.size === 'small') {
							scope.image.px = 30;
						}
						if (attrs.size === 'normal') {
							scope.image.px = 50;
						}
						if (attrs.size === 'follow') {
							scope.image.px = 60;
						}
						if (attrs.size === 'user-search') {
							scope.image.px = 80;
						}
						if (attrs.size === 'large') {
							scope.image.px = 96;
						}
						if ((val != null) && (val[scope.image.name] != null) && val[scope.image.name]) {
							return scope.image.src = val[scope.image.name];
						}
					});
				}
			};
		}
	]).directive('createAdSelect', [

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
        <button class="prefix primary button connect-left round padding-1" type="submit" style="width:10%; height:100%; z-index:101;" ng-click="srch.type = null;"><i class="icon-search"></i></button>\
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
	]).directive('invitationForm', [
		'Invitation', '$timeout', 'ResponseErrors',
		function(Invitation, $timeout, ResponseErrors) {
			return {
				restrict: 'AE',
				replace: true,
				scope: {
					'visible': '=',
					'loggedUser': '='
				},
				template: '\
      <div ng-show="status.visible && loggedUser._id">\
        <div ng-show="!status.sentOk" class="invitation-form">\
            <form name="sendInvitationForm" id="sendInvitationForm" ng-submit="sendInvitation()">\
                <h4 translate>HEARTH_INVITATION</h4>\
                <p translate>HEARTH_INVITATION_TEXT</p>\
                <div style="position:relative;">\
                    <div class="alert-box alert error round connect-bottom" ng-show="status.sentError">{{ status.sentError.base | translate }}</div>\
                    <button type="submit" class="primary button prefix round connect-left" ng-disabled="status.sending"\
                            analytics-on analytics-event="sending invitation" analytics-category="Invitations"\
                            ><i class="icon-envelope"></i></button>\
                    <input type="email" class="text-input round connect-right" ng-model="invitation.toEmail" style="width:85%;" required>\
                </div>\
                <a href="" ng-click="cancel()" translate>CANCEL</a>\
            </form>\
        </div>\
        <div ng-show="status.sentOk" class="clearfix padding-2 padding-v-4 successfully-sent">\
              {{ \'INVITATION_SENDING_SUCCESS\' | translate }}\
        </div>\
      </div>',
				link: function(scope, el, attrs) {
					var init;
					init = function() {
						var _ref;
						scope.status = {
							visible: false,
							sentOk: false,
							sentError: false,
							sending: false
						};
						scope.invitation = {
							toEmail: null,
							userId: (_ref = scope.loggedUser) != null ? _ref._id : void 0
						};
						return scope.sendInvitationForm.$setPristine(true);
					};
					scope.$watch('visible', function(newval, oldval) {
						if (newval !== oldval && (newval != null)) {
							return scope.status.visible = newval;
						}
					});
					scope.$watch('status.visible', function(newval, oldval) {
						if (newval !== oldval && (newval != null)) {
							return scope.visible = newval;
						}
					});
					scope.sendInvitation = function() {
						if (!scope.sendInvitationForm.$valid) {
							return;
						}
						scope.status.sending = true;
						return Invitation.add(scope.invitation, function(data) {
							scope.status.sentOk = true;
							return $timeout(function() {
								return init();
							}, 3000);
						}, function(err) {
							return scope.status.sentError = new ResponseErrors(err);
						});
					};
					scope.cancel = init;
					return init();
				}
			};
		}
	]);
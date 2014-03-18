'use strict';
if (typeof $$config === 'undefined' || $$config === null) {
	console.log('ERROR: config.js not loaded');
}

angular.module('hearth.services', ['ivpusic.cookie'])
	.factory('Auth', [
		'$session', '$http', '$rootScope', '$q',
		function($session, $http, $rootScope, $q) {
			return {
				init: function(callback) {
					$rootScope.user = {
						name: '',
						loggedIn: false
					};
					return $session.then(function(session) {
						if (session._id) {
							$rootScope.user = session;
							$rootScope.user.loggedIn = true;
							$rootScope.$broadcast('onUserLogin');
						}
						return callback();
					});
				},
				login: function(credentials) {
					return $http.post($$config.apiPath + '/login', credentials).then(function(data) {
						$rootScope.user = data.data.user;
						$rootScope.user.loggedIn = true;
						return $rootScope.$broadcast('onUserLogin');
					});
				},
				isLoggedIn: function() {
					return $rootScope.user.loggedIn;
				},
				changePassword: function(password, success) {
					return $http.post($$config.apiPath + '/change-password', {
						password: password
					}).success(function(data) {
						return success(data);
					});
				},
				getCredentials: function() {
					return $rootScope.user.getloggedInUser || {
						_id: null
					};
				},
				getCommunityCredentials: function() {
					return $rootScope.user.activeIdentity || null;
				},
				getBaseCredentials: function() {
					if ($rootScope.user._id) {
						return {
							_id: $rootScope.user._id,
							name: $rootScope.user.name
						};
					} else {
						return null;
					}
				},
				confirmRegistration: function(hash, success, err) {
					return $http.post($$config.apiPath + '/confirm-registration', {
						'hash': hash
					}).success(function(data) {
						return success(data);
					}).error(function(data) {
						return err(data);
					});
				},
				requestPasswordReset: function(email) {
					return $http.post($$config.apiPath + '/reset-password', {
						email: email
					});
				},
				resetPassword: function(token, password, success, err) {
					return $http.put($$config.apiPath + '/reset-password', {
						token: token,
						password: password,
						confirm: password
					}).success(function(data) {
						return success(data);
					}).error(function(data) {
						return err(data);
					});
				},
				switchIdentity: function(identity) {
					var defer;
					defer = $q.defer();
					$http.post($$config.apiPath + '/switch-identity/' + identity).success(function(data) {
						return defer.resolve(data);
					}).error(function(data) {
						return defer.reject(data);
					});
					return defer.promise;
				},
				switchIdentityBack: function() {
					var defer;
					defer = $q.defer();
					$http.post($$config.apiPath + '/leave-identity').success(function(data) {
						return defer.resolve(data);
					}).error(function(data) {
						return defer.reject(data);
					});
					return defer.promise;
				}
			};
		}
	]).factory('TermsAgreement', [
		'$q', '$location',
		function($q, $location) {
			var isTermsErrorResponse;
			isTermsErrorResponse = function(response) {
				return response.status === 403 && response.data.reason === 'not-agreed-with-terms';
			};
			return function(promise) {
				return promise.then(function(response) {
					return response;
				}, function(response) {
					if (!isTermsErrorResponse(response)) {
						return $q.reject(response);
					}
					$location.path('/terms');
					return $q.reject(response);
				});
			};
		}
	]).factory('Post', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/posts/:postId', {
				postId: '@id'
			}, {
				get: {
					method: 'GET',
					params: {
						limit: 10,
						offset: 0,
						sort: '-createdAt',
						r: Math.random()
					}
				},
				query: {
					method: 'GET',
					isArray: true
				},
				add: {
					method: 'POST'
				},
				update: {
					method: 'PUT'
				},
				remove: {
					method: 'DELETE'
				}
			});
		}
	]).factory('PostReplies', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/posts/:userId/replies', {
				userId: '@id'
			}, {
				add: {
					method: 'POST'
				}
			});
		}
	]).factory('User', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId', {
				userId: '@_id'
			}, {
				add: {
					method: 'POST'
				},
				get: {
					method: 'GET',
					params: {
						r: Math.random()
					}
				},
				edit: {
					method: 'PUT'
				},
				remove: {
					method: 'DELETE'
				}
			});
		}
	]).factory('Community', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/communities/:communityId', {
				communityId: '@_id'
			}, {
				get: {
					method: 'GET',
					params: {
						r: Math.random()
					}
				},
				query: {
					method: 'GET',
					isArray: true,
					params: {
						r: Math.random()
					}
				},
				edit: {
					method: 'PUT'
				},
				add: {
					method: 'POST'
				}
			});
		}
	]).factory('CommunityMemberships', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/communities', {
				userId: '@id'
			}, {
				get: {
					method: 'GET',
					params: {
						r: Math.random()
					}
				},
				query: {
					method: 'GET',
					isArray: true,
					params: {
						r: Math.random()
					}
				}
			});
		}
	]).factory('CommunityApplicants', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/communities/:communityId/applicants/:applicantId', {
				communityId: '@communityId',
				applicantId: '@applicantId'
			}, {
				add: {
					method: 'POST'
				},
				show: {
					method: 'GET'
				},
				remove: {
					method: 'DELETE'
				},
				query: {
					method: 'GET',
					isArray: true,
					params: {
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('CommunityMembers', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/communities/:communityId/members/:memberId', {
				communityId: '@communityId',
				memberId: '@memberId'
			}, {
				add: {
					method: 'POST'
				},
				show: {
					method: 'GET'
				},
				remove: {
					method: 'DELETE'
				},
				query: {
					method: 'GET',
					isArray: true,
					params: {
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('CommunityPosts', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/communities/:communityId/posts', {
				communityId: '@id'
			}, {
				get: {
					method: 'GET',
					isArray: true,
					params: {
						r: Math.random()
					}
				}
			});
		}
	]).factory('CommunityRatings', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/communities/:communityId/ratings', {
				communityId: '@id'
			}, {
				add: {
					method: 'POST'
				},
				get: {
					method: 'GET',
					isArray: true,
					params: {
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('Fulltext', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/search', {}, {
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('Keywords', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/keywords', {}, {
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('UserPosts', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/posts', {
				userId: '@id'
			}, {
				get: {
					method: 'GET',
					isArray: true,
					params: {
						limit: 10,
						offset: 0,
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('UserRatings', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/ratings', {
				userId: '@id'
			}, {
				add: {
					method: 'POST'
				},
				get: {
					method: 'GET',
					isArray: true,
					params: {
						limit: 10,
						offset: 0,
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('UserLocation', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/location', {
				userId: '@id'
			}, {
				add: {
					method: 'POST'
				},
				remove: {
					method: 'DELETE'
				}
			});
		}
	]).factory('Feedback', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/feedback', {}, {
				add: {
					method: 'POST'
				}
			});
		}
	]).factory('Invitation', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/invitation', {}, {
				add: {
					method: 'POST'
				}
			});
		}
	]).factory('Session', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/session', {}, {
				show: {
					method: 'GET',
					params: {
						r: Math.random()
					}
				},
				update: {
					method: 'PUT'
				}
			});
		}
	]).factory('Info', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/info', {}, {
				show: {
					method: 'GET'
				}
			});
		}
	]).factory('Followers', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/followers/:followerId', {
				userId: '@userId',
				followerId: '@followerId'
			}, {
				add: {
					method: 'POST'
				},
				show: {
					method: 'GET'
				},
				remove: {
					method: 'DELETE'
				},
				query: {
					method: 'GET',
					isArray: true,
					params: {
						sort: '-createdAt',
						r: Math.random()
					}
				}
			});
		}
	]).factory('Friends', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/friends/:friendId', {
				userId: '@userId',
				friendId: '@friendId',
				r: Math.random()
			}, {
				show: {
					method: 'GET'
				},
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('Followees', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/followees/', {
				userId: '@userId',
				r: Math.random()
			}, {
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('FolloweePosts', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/followees/posts', {
				userId: '@userId'
			}, {
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('FolloweeSearch', [
		'$resource',
		function($resource) {
			return $resource($$config.apiPath + '/users/:userId/followees/search', {
				userId: '@userId'
			}, {
				query: {
					method: 'GET',
					isArray: true
				}
			});
		}
	]).factory('$session', [
		'Session', '$q',
		function(Session, $q) {
			var deferredSession, session;
			deferredSession = $q.defer();
			session = Session.show(function() {
				return deferredSession.resolve(session);
			}, function() {
				return deferredSession.reject();
			});
			return deferredSession.promise;
		}
	]).factory('SessionLanguageStorage', [
		'$session', '$log',
		function($session, $log) {
			var changeSessionLanguage, language, session;
			session = null;
			language = preferredLanguage;
			changeSessionLanguage = function() {
				if (!session) {
					return;
				}
				if (session.language !== language) {
					session.language = language;
					return session.$update();
				}
			};
			$session.then(function(resolvedSession) {
				session = resolvedSession;
				return changeSessionLanguage();
			}, function() {
				return $log.warn('Cannot preserve session locale');
			});
			return {
				set: function(name, value) {
					language = value;
					return changeSessionLanguage();
				},
				get: function(name) {
					return (session != null ? session.language : void 0) || language;
				}
			};
		}
	]).factory('Errors', function() {
		return {
			process: function(error, targetObject) {
				var data, result, _ref, _ref1;
				if (!error) {
					return null;
				}
				if (error.status === 400) {
					data = error.data;
					result = {};
					if (data.errors != null) {
						Object.keys(data.errors).forEach(function(key) {
							var e;
							e = data.errors[key];
							if ((e.name != null) && e.name === 'ValidatorError') {
								return result[key] = e.type;
							}
						});
					}
					if (targetObject != null) {
						targetObject.errors = result;
					}
				} else if (error.status === 500) {
					alert('Application error: ' + ((_ref = error.data) != null ? _ref.message : void 0));
				}
				return (_ref1 = error.data) != null ? _ref1.message : void 0;
			}
		};
	}).factory('ResponseErrors', function() {
		return function(res) {
			var exposeErrors, init, isClientError, isServerError, parseServerErrors, parseValidationErrors, responseClassCode, responseErrors;
			responseErrors = this;
			isClientError = function() {
				return responseClassCode() === 4;
			};
			isServerError = function() {
				return responseClassCode() === 5;
			};
			responseClassCode = function() {
				if (!(res && res.status)) {
					return 0;
				}
				return 1 * res.status.toString()[0];
			};
			parseValidationErrors = function() {
				var errors;
				errors = {};
				if (!(res && res.data)) {
					return errors;
				}
				Object.keys(res.data.errors || {}).map(function(key) {
					return {
						key: key,
						name: res.data.errors[key].name,
						type: res.data.errors[key].type
					};
				}).filter(function(error) {
					return error.name === 'ValidatorError';
				}).reduce(function(errors, error) {
					errors[error.key] = error.type;
					if (!errors.base) {
						errors.base = error.type;
					}
					return errors;
				}, errors);
				if (res.data.name === 'ValidationError' && res.data.message && !errors.base) {
					errors.base = res.data.message;
				}
				return errors;
			};
			parseServerErrors = function() {
				if (!(res && res.data && res.data.message)) {
					return {};
				}
				return {
					base: res.data.message
				};
			};
			exposeErrors = function(errors) {
				return Object.keys(errors).forEach(function(key) {
					return responseErrors[key] = errors[key];
				});
			};
			init = function() {
				if (isClientError()) {
					return exposeErrors(parseValidationErrors());
				} else if (isServerError()) {
					return exposeErrors(parseServerErrors());
				}
			};
			return init();
		};
	}).provider('$feature', function() {
		var featureCookies, isEnabled;
		featureCookies = function() {
			return document.cookie.split('; ').reduce(function(cookies, cookie) {
				var index, name, value;
				if (cookie.indexOf('FEATURE_') !== 0) {
					return cookies;
				}
				index = cookie.indexOf('=');
				name = cookie.substring(8, index);
				value = !! cookie.substring(index + 1);
				cookies[name] = value;
				return cookies;
			}, {});
		};
		isEnabled = function(name, defaultValue) {
			if (defaultValue == null) {
				defaultValue = true;
			}
			if (featureCookies().hasOwnProperty(name)) {
				return featureCookies()[name];
			} else if ($$config.features && $$config.features.hasOwnProperty(name)) {
				return $$config.features[name];
			} else {
				return defaultValue;
			}
		};
		this.$get = function() {
			return {
				isEnabled: isEnabled
			};
		};
		this.isEnabled = isEnabled;
		return this;
	}).service('timeAgoService', [
		'$interval', '$translate',
		function($interval, $translate) {
			var ref;
			ref = null;
			return {
				getStrings: function() {
					return {
						seconds: $translate('LESS_THAN_MINUTE_AGO'),
						minute: $translate('MINUTE_AGO'),
						minutes: $translate('%d MINUTES_AGO'),
						hour: $translate('HOUR_AGO'),
						hours: $translate('%d HOURS_AGO'),
						day: $translate('DAY_AGO'),
						days: $translate('%d DAYS_AGO'),
						month: $translate('MONTH_AGO'),
						months: $translate('%d MONTHS_AGO'),
						year: $translate('YEAR_AGO'),
						years: $translate('%d YEARS_AGO'),
						numbers: []
					};
				},
				nowTime: 0,
				initted: false,
				settings: {
					refreshMillis: 60000,
					strings: {}
				},
				doTimeout: function() {
					return ref.nowTime = (new Date()).getTime();
				},
				init: function() {
					var that;
					if (!this.initted) {
						this.initted = true;
						this.nowTime = (new Date()).getTime();
						ref = this;
						that = this;
						that.settings.strings = that.getStrings();
						$interval(ref.doTimeout, ref.settings.refreshMillis);
						return this.initted = true;
					}
				},
				inWords: function(distanceMillis) {
					var $l, days, hours, lang, minutes, seconds, separator, substitute, words, years;
					lang = window.lang;
					$l = this.getStrings();
					seconds = Math.abs(distanceMillis) / 1000;
					minutes = seconds / 60;
					hours = minutes / 60;
					days = hours / 24;
					years = days / 365;
					substitute = function(stringOrFunction, number) {
						var str, value;
						if ($.isFunction(stringOrFunction)) {
							str = stringOrFunction(number, distanceMillis);
						}
						if (!$.isFunction(stringOrFunction)) {
							str = stringOrFunction;
						}
						value = ($l.numbers && $l.numbers[number]) || number;
						return str.replace(/%d/i, value);
					};
					words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) || seconds < 90 && substitute($l.minute, 1) || minutes < 45 && substitute($l.minutes, Math.round(minutes)) || minutes < 90 && substitute($l.hour, 1) || hours < 24 && substitute($l.hours, Math.round(hours)) || hours < 42 && substitute($l.day, 1) || days < 30 && substitute($l.days, Math.round(days)) || days < 45 && substitute($l.month, 1) || days < 365 && substitute($l.months, Math.round(days / 30)) || years < 1.5 && substitute($l.year, 1) || substitute($l.years, Math.round(years));
					separator = $l.wordSeparator;
					if ($l.wordSeparator === void 0) {
						separator = ' ';
					}
					return $.trim([words].join(separator));
				},
				x: function(v) {
					var d;
					d = new Date(v);
					return d.getTime();
				}
			};
		}
	]).service('LanguageSwitch', [
		'$feature', '$translate', '$http', 'ipCookie',
		function($feature, $translate, $http, ipCookie) {
			var init, languages, self;
			self = this;
			languages = [];
			init = function() {
				languages = [{
					code: 'en',
					name: 'English'
				}, {
					code: 'cs',
					name: 'Česky'
				}];
				if ($feature.isEnabled('german')) {
					return languages.push({
						code: 'de',
						name: 'Deutsch'
					});
				}
			};
			this.getLanguages = function() {
				return languages;
			};
			this.uses = function() {
				return $translate.uses();
			};
			this.use = function(language) {
				ipCookie('language', language.code, {
					expires: 21
				});
				$http.defaults.headers.common['Accept-Language'] = language.code;
				return $translate.uses(language.code);
			};
			return init();
		}
	]).service('Geocoder', [
		'$window', '$q', '$rootScope',
		function($window, $q, $rootScope) {
			var deg2rad, that;
			that = this;
			this.findMe = function(callback) {
				var deferred;
				deferred = $q.defer();
				if ($window.navigator.geolocation) {
					$window.navigator.geolocation.getCurrentPosition(function(position) {
						var location;
						location = {
							lat: position.coords.latitude,
							lon: position.coords.longitude
						};
						return $rootScope.$apply(function() {
							return deferred.resolve(location);
						});
					}, function(err) {
						return deferred.reject(err);
					}, {
						maximumAge: 60000,
						timeout: 5000,
						enableHighAccuracy: true
					});
				}
				return deferred.promise;
			};
			this.geocoder = function(position, callback) {
				var deferred, geocoder, latlng;
				deferred = $q.defer();
				geocoder = new google.maps.Geocoder();
				latlng = new google.maps.LatLng(position.lat, position.lon);
				geocoder.geocode({
					'latLng': latlng
				}, function(results, status) {
					var location;
					if (status === google.maps.GeocoderStatus.OK) {
						location = {
							lat: position.lat,
							lon: position.lon,
							name: results[1].formatted_address
						};
						return $rootScope.$apply(function() {
							return deferred.resolve(location);
						});
					} else {
						return deferred.reject(status);
					}
				});
				return deferred.promise;
			};
			this.findMeAndGeocode = function() {
				var deferred;
				deferred = $q.defer();
				this.findMe().then(function(myLocation) {
					return that.geocoder(myLocation);
				}).then(function(geocoded) {
					return deferred.resolve(geocoded);
				});
				return deferred.promise;
			};
			this.geoJsonToLatLon = function(geoJson) {
				var latlon;
				if (geoJson == null) {
					return null;
				}
				if ((geoJson.lat != null) && (geoJson.lon != null)) {
					return geoJson;
				}
				if (geoJson.coordinates != null) {
					latlon = {
						name: '',
						lon: geoJson.coordinates[0],
						lat: geoJson.coordinates[1]
					};
					if (geoJson.name != null) {
						latlon.name = geoJson.name;
					}
					return latlon;
				}
			};
			this.latLonToGeoJson = function(latlon) {
				var geojson;
				if (latlon.type === 'Point') {
					return latlon;
				}
				if ((latlon.lat != null) && (latlon.lon != null)) {
					geojson = {
						type: 'Point',
						name: '',
						coordinates: [latlon.lon, latlon.lat]
					};
				}
				if (latlon.name != null) {
					geojson.name = latlon.name;
				}
				return geojson;
			};
			this.getDistance = function(position1, position2) {
				var R, a, c, d, dLat, dLon;
				if (position1 === undefined || position1 === null || position1 === 0 || position1 === '') {
					return;
				}
				if (position2 === undefined || position2 === null || position2 === 0 || position2 === '') {
					return;
				}
				if (!position1.lat || !position1.lon || !position2.lat || !position2.lon) {
					return;
				}
				R = 6371;
				dLat = deg2rad(position2.lat - position1.lat);
				dLon = deg2rad(position2.lon - position1.lon);
				a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position1.lat)) * Math.cos(deg2rad(position2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
				c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
				d = R * c;
				return d;
			};
			deg2rad = function(deg) {
				return deg * (Math.PI / 180);
			};
			return this;
		}
	]).service('PostsService', [
		'Post', 'PostReplies', '$q',
		function(Post, PostReplies, $q) {
			this.query = function(params) {
				var deferred;
				deferred = $q.defer();
				Post.query(params, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.add = function(post) {
				var deferred;
				deferred = $q.defer();
				Post.add(post, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.update = function(post) {
				var deferred;
				deferred = $q.defer();
				post.id = post._id;
				post.post_id = post._id;
				Post.update(post, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.reply = function(reply) {
				var deferred;
				deferred = $q.defer();
				PostReplies.add(reply, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.remove = function(post) {
				var deferred;
				deferred = $q.defer();
				post.id = post._id;
				Post.remove({
					postId: post._id
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('FolloweesPostsService', [
		'FolloweePosts', '$q',
		function(FolloweePosts, $q) {
			this.query = function(params) {
				var deferred;
				deferred = $q.defer();
				FolloweePosts.query(params, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('FolloweesSearchService', [
		'FolloweeSearch', '$q',
		function(FolloweeSearch, $q) {
			this.query = function(params) {
				var deferred;
				deferred = $q.defer();
				FolloweeSearch.query(params, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('FulltextService', [
		'Fulltext', '$q',
		function(Fulltext, $q) {
			this.query = function(params) {
				var deferred;
				deferred = $q.defer();
				Fulltext.query(params, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('UsersService', [
		'User', 'UserPosts', 'UserRatings', '$q', 'Followers', 'Friends', 'Followees', '$analytics', 'CommunityMemberships',
		function(User, UserPosts, UserRatings, $q, UserFollowers, UserFriends, UserFollowees, $analytics, CommunityMemberships) {
			this.clone = function(profile) {
				return new User(angular.extend({}, profile));
			};
			this.get = function(id) {
				var deferred;
				deferred = $q.defer();
				User.get({
					userId: id
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.update = function(profile) {
				var deferred;
				deferred = $q.defer();
				profile.$edit(function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.remove = function(profile) {
				var deferred;
				deferred = $q.defer();
				profile.$remove(function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryPosts = function(searchParams) {
				var deferred;
				deferred = $q.defer();
				UserPosts.get(searchParams, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryRatings = function(searchParams) {
				var deferred;
				deferred = $q.defer();
				UserRatings.get(searchParams, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.addRating = function(rating) {
				var deferred;
				deferred = $q.defer();
				UserRatings.add(rating, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.addFollower = function(userId, followerId) {
				var deferred;
				deferred = $q.defer();
				UserFollowers.add({
					userId: userId
				}, function(data) {
					$analytics.eventTrack('add follower', {
						category: 'followers',
						label: 'add follower'
					});
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.removeFollower = function(userId, followerId) {
				var deferred;
				deferred = $q.defer();
				UserFollowers.remove({
					userId: userId,
					followerId: followerId
				}, function(data) {
					$analytics.eventTrack('remove follower', {
						category: 'followers',
						label: 'remove follower'
					});
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.isFollower = function(userId, followerId) {
				var deferred;
				deferred = $q.defer();
				UserFollowers.show({
					userId: userId,
					followerId: followerId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.isFriend = function(userId, friendId) {
				var deferred;
				deferred = $q.defer();
				UserFriends.show({
					userId: userId,
					friendId: friendId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryFriends = function(userId) {
				var deferred;
				deferred = $q.defer();
				UserFriends.query({
					userId: userId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryFollowers = function(userId) {
				var deferred;
				deferred = $q.defer();
				UserFollowers.query({
					userId: userId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryFollowees = function(userId) {
				var deferred;
				deferred = $q.defer();
				UserFollowees.query({
					userId: userId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryCommunities = function(userId) {
				var deferred;
				deferred = $q.defer();
				CommunityMemberships.query({
					userId: userId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('UsersCommunitiesService', [
		'$q', 'CommunityMemberships',
		function($q, CommunityMemberships) {
			this.query = function(params) {
				var deferred;
				deferred = $q.defer();
				CommunityMemberships.query(params, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('CommunityService', [
		'$q', 'Community', 'CommunityPosts', 'CommunityRatings', 'CommunityApplicants', 'CommunityMembers',
		function($q, Community, CommunityPosts, CommunityRatings, CommunityApplicants, CommunityMembers) {
			this.add = function(community) {
				var deferred;
				deferred = $q.defer();
				Community.add(community, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.update = function(community) {
				var deferred;
				deferred = $q.defer();
				community.$edit(function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.get = function(id) {
				var deferred;
				deferred = $q.defer();
				Community.get({
					communityId: id
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.query = function(searchParams) {
				var deferred;
				deferred = $q.defer();
				Community.query(searchParams, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryPosts = function(searchParams) {
				var deferred;
				deferred = $q.defer();
				CommunityPosts.get(searchParams, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryRatings = function(searchParams) {
				var deferred;
				deferred = $q.defer();
				CommunityRatings.get(searchParams, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.addRating = function(rating) {
				var deferred;
				deferred = $q.defer();
				CommunityRatings.add(rating, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.addApplicant = function(communityId) {
				var deferred;
				deferred = $q.defer();
				CommunityApplicants.add({
					communityId: communityId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.removeApplicant = function(communityId, applicantId) {
				var deferred;
				deferred = $q.defer();
				CommunityApplicants.remove({
					communityId: communityId,
					applicantId: applicantId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryApplicants = function(communityId) {
				var deferred;
				deferred = $q.defer();
				CommunityApplicants.query({
					communityId: communityId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.getApplicant = function(communityId, applicantId) {
				var deferred;
				deferred = $q.defer();
				CommunityApplicants.show({
					communityId: communityId,
					applicantId: applicantId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.queryMembers = function(communityId) {
				var deferred;
				deferred = $q.defer();
				CommunityMembers.query({
					communityId: communityId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			this.removeMember = function(communityId, memberId) {
				var deferred;
				deferred = $q.defer();
				CommunityMembers.remove({
					communityId: communityId,
					memberId: memberId
				}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]).service('KeywordsService', [
		'$q', 'Keywords',
		function($q, Keywords) {
			this.listKeywords = function() {
				var deferred;
				deferred = $q.defer();
				Keywords.query({}, function(data) {
					return deferred.resolve(data);
				}, function(err) {
					return deferred.reject(err);
				});
				return deferred.promise;
			};
			return this;
		}
	]);

angular.module('hearth.filters', []).filter('urlize', function() {
	return function(input) {
		var emailAddressPattern, pseudoUrlPattern, urlPattern;
		if ((input == null) || !input) {
			return;
		}
		urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
		pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
		emailAddressPattern = /\w+@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6})+/gim;
		return input.replace(urlPattern, '<a href="$&" target="_blank">$&</a>').replace(pseudoUrlPattern, '$1<a href="http://$2" target="_blank">$2</a>').replace(emailAddressPattern, '<a href="mailto:$&" target="_blank">$&</a>');
	};
}).filter('apiPrefix', function() {
	return function(input) {
		return $$config.apiPath + input;
	};
});
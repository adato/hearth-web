'use strict';

/**
 * @ngdoc directive
 * @name hearth.geo.locations
 * @description Renders fields for selecting location, and allows to select location.
 * @restrict E
 *
 * @requires $timeout
 * @requires geo
 */
angular.module('hearth.geo').directive('locations', [
	'geo', '$timeout', '$rootScope', 'Viewport', '$analytics', '$state',
	function(geo, $timeout, $rootScope, Viewport, $analytics, $state) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				locations: "=",
				required: "=isRequired",
				disabled: "=limit",
				showError: "=",
				errorCode: "@",
				base: "@"
			},
			templateUrl: 'templates/geo/locations.html',
			link: function($scope, baseElement) {
				var map, autocomplete, tagsInput, marker = false;
				$scope.mapPoint = false;
				$scope.mapPointShowName = true; // due to chrome bug with rerendering
				$scope.errorWrongPlace = false;
				$scope.initFinished = $rootScope.initFinished;
				$scope.mapIsVisible = false;

				if (!$scope.errorCode)
					$scope.errorCode = 'LOCATIONS_ARE_EMPTY';

				var markerImage = {
					url: 'images/pin.png',
					size: new google.maps.Size(49, 49),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(14, 34)
				};

				// init Google Places Autocomplete
				function addPlacesAutocompleteListener(input) {
					var options = {
						types: ['address']
					};
					var autocomplete = new google.maps.places.Autocomplete(input, options);

					google.maps.event.addListener(autocomplete, 'place_changed', function() {
						var place = autocomplete.getPlace();
						$scope.showError = false;

						if (typeof place === "undefined" || !place.address_components) {
							$(input).val('');
							return false;
						}

						if (place && place.address_components) {
							$scope.errorWrongPlace = false;
							fillLocations(place);
						} else {
							$scope.errorWrongPlace = true;
						}
					});

					$(input).on('keyup keypress', function(e) {
						if (e.keyCode == 13 && $(input).val() != '') {
							e.preventDefault();
							return false;
						}
					});

					/**
					 * When user fills some location and clicks enter (does not select option in autocomplete)
					 * simulate key down and enter to select first item in autocomplete
					 */
					function pacSelectFirst(input) {
						// store the original event binding function
						if (typeof input === 'undefined') return;
						var _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

						function addEventListenerWrapper(type, listener) {
							// Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
							// and then trigger the original listener.
							if (type == "keydown") {
								var orig_listener = listener;
								listener = function(event) {
									var suggestion_selected = $(".pac-item-selected").length > 0;
									if (event.which == 13 && !suggestion_selected) {
										var simulated_downarrow = $.Event("keydown", {
											keyCode: 40,
											which: 40
										});
										orig_listener.apply(input, [simulated_downarrow]);
									}

									orig_listener.apply(input, [event]);
								};
							}

							_addEventListener.apply(input, [type, listener]);
						}

						input.addEventListener = addEventListenerWrapper;
						input.attachEvent = addEventListenerWrapper;
					}

					$timeout(function() {
						pacSelectFirst(input);
					});


					$(document).on('focusout', input, function(e) {
						$timeout(function() {
							tagsInput.val('');
						});
					});

					$(document).on('focusin', input, function(e) {
						$scope.errorWrongPlace = false;
					});

					return autocomplete;
				};

				// this will translate info from location to used format
				function translateLocation(loc) {
					var short = {},
						long = {};

					if (loc) {
						Object.keys(loc).forEach(function(key) {
							short[loc[key].types[0]] = loc[key].short_name;
							long[loc[key].types[0]] = loc[key].long_name;
						});
					}
					return {
						street_number: long.street_number, // house number
						street_premise: long.premise, // descriptive number
						street: long.route, // street
						country: long.country, // country
						country_code: short.country, // country code - CZ
						zipcode: long.postal_code, // postal code
						city: long.postal_town || long.locality || long.administrative_area_level_1, // mestska cast nebo jen mesto nebo kraj
						area: long.administrative_area_level_1, // kraj
					};
				};


				/**
				 *	Function checking if an array of locations contains a given place
				 *
				 *	@param place {Object} - place to check
				 *	@return Boolean - true if the place is already contained in the locations array, false otherwise
				 */
				$scope.placeExists = function(place) {
					var exists = false;

					angular.forEach($scope.locations, function(location) {
						if (location.place_id === place.place_id) {
							exists = true;
						}
					});

					return exists;
				};

				// add place to list
				/**
				 *	@param {Object} place -	the whole object returned by MAPS API
				 */
				function fillLocations(place) {
					// only add if it is not in the list yet
					if (!$scope.placeExists(place)) {
						$timeout(function() {
							$scope.locations.push(place);
							tagsInput.focus();
						});
					}

					// and erase input for next location
					tagsInput.val('');
				};

				var MAP_TOGGLE_CLICK = 'Ad map toggled';
				var MAP_LOCATION_SELECTED = 'Ad map location selected';

				function trackMapEvents(paramObj) {
					var parent = $scope.$parent;
					var state = parent.post ? parent.post.state : '';
					$analytics.eventTrack(paramObj.eventName, {
						'action': paramObj.action,
						'state': state,
						'context': $state.current.name
					});
				}

				// slide down
				$scope.showMap = function() {
					trackMapEvents({
						eventName: MAP_TOGGLE_CLICK,
						action: 'show'
					});

					$(".mapIcon .fa-times", baseElement).show();
					$(".location-map", baseElement).slideDown();
					$scope.mapIsVisible = true;
					$timeout($scope.initMap, 100);
				};

				// slide up
				/**
				 *	@param {Object} paramObj -	locationChosen {Bool}
				 *								suppressTracking {Bool}
				 */
				$scope.closeMap = function(paramObj) {
					paramObj = paramObj || {};
					if (!paramObj.suppressTracking) {
						trackMapEvents({
							eventName: (paramObj.locationChosen ? MAP_LOCATION_SELECTED : MAP_TOGGLE_CLICK),
							action: 'hide'
						});
					}

					if (marker) {
						marker.setMap(null);
						marker = false;
					}

					$scope.mapPoint = false;
					$scope.mapIsVisible = false;

					$(".location-map", baseElement).slideUp();
					$(".mapIcon .fa-times", baseElement).hide();
				};

				$scope.chooseMapLocation = function() {
					if (!$scope.mapPoint)
						return false;

					fillLocations($scope.mapPoint);
					$scope.closeMap({
						locationChosen: true
					});
				};

				$scope.refreshMapPoint = function() {
					geo.getAddress(marker.getPosition()).then(function(place) {
						$scope.mapPointShowName = false;
						$scope.mapPoint = place;

						// chrome has problem with rerendering point
						// after location change - hide location and show again after.
						$timeout(function() {
							$scope.mapPointShowName = true;

							// let address to display on page and then scroll to it if it is not visible
							/*$timeout(function() {
							    Viewport.scrollIfHidden(".map-point", 60, $scope.base);
							});*/
						});
					});
				};

				$scope.initMap = function() {
					if ($(".location-map", baseElement).hasClass("inited"))
						return false;

					map = geo.createMap($(".map-container", baseElement)[0], {
						draggableCursor: 'url(images/pin.png) 14 34, default',
						scrollwheel: false
					});

					google.maps.event.addListener(map, 'click', function(e) {
						map.panTo(e.latLng);

						if (marker) {
							return marker.setPosition(e.latLng);
						}

						marker = new google.maps.Marker({
							map: map,
							draggable: true,
							animation: google.maps.Animation.DROP,
							position: e.latLng,
							icon: markerImage
						});

						$scope.refreshMapPoint();
						google.maps.event.addListener(marker, "position_changed", $scope.refreshMapPoint);
					});

					$(".location-map", baseElement).addClass("inited");
				};

				$scope.toggleMap = function() {
					if ($scope.disabled) return false;

					if ($(".location-map", baseElement).is(":visible")) {
						$scope.closeMap({
							suppressTracking: true
						});
					} else {
						$scope.showMap();
					}
				};

				function locationDoesNotMatter(val, suppressTracking) {
					$scope.errorWrongPlace = false;
					$scope.closeMap({
						suppressTracking: suppressTracking
					});
					$scope.showError = false;

					if ($scope.disabled) {
						$scope.locations = [];
						tagsInput.attr("disabled", "disabled");
					} else {
						tagsInput.removeAttr("disabled");
					}
				}

				function init() {
					tagsInput = $(".tags input", baseElement);
					autocomplete = addPlacesAutocompleteListener($('.tags input', baseElement)[0]);
					$scope.$watch('disabled', function(val) {
						locationDoesNotMatter(val, true);
					});
				}

				$scope.$watch("showError", function(val) {
					if (!val)
						$scope.showError = false;
					if (val)
						$scope.errorWrongPlace = false;
				});
				$timeout(init);



				$scope.$on("$destroy", function() {
					$(document).unbind("focusin");
					$(document).unbind("focusout");
				})
			}
		};
	}
]);
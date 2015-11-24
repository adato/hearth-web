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
	'geo', '$timeout', '$rootScope', 'Viewport',
	function(geo, $timeout, $rootScope, Viewport) {
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
				var map, sBox, tagsInput, marker = false;
				$scope.mapPoint = false;
				$scope.mapPointShowName = true; // due to chrome bug with rerendering
				$scope.errorWrongPlace = false;
				$scope.initFinished = $rootScope.initFinished;
				$scope.mapIsVisible = false;

				if (!$scope.errorCode)
					$scope.errorCode = 'LOCATIONS_ARE_EMPTY';

				$scope.$watch("locations", function(val) {
					$scope.locations = (val) ? filterUniqueLocations(val) : [];
				});

				var markerImage = {
					url: 'images/pin.png',
					size: new google.maps.Size(49, 49),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(14, 34)
				};

				function filterUniqueLocations(locations) {
					var arr = [];
					var item;

					// remove duplicit locations
					for (var i = 0; i < locations.length; i++) {
						if (!locations[i].origin_address)
							locations[i].origin_address = locations[i].address;

						for (var j = 0; j < i; j++) {
							if (locations[j].address == locations[i].address) {
								locations.splice(i--, 1);
								break;
							}
						}
					}

					return locations;
				}

				// init google places search box
				function addPlacesAutocompleteListener(input) {

					var sBox = new google.maps.places.SearchBox(input);
					google.maps.event.addListener(sBox, 'places_changed', function() {
						var places = sBox.getPlaces();
						$scope.showError = false;

						if (!places.length || !places[0].address_components) {
							$(input).val('');
							return false;
						}

						if (places && places.length) {
							$scope.errorWrongPlace = false;
							var location = places[0].geometry.location,
								name = places[0].formatted_address,
								info = $scope.translateLocation(places[0].address_components);

							$scope.fillLocation(location, name, info, true);
						} else {
							$scope.errorWrongPlace = true;
							$scope.apply();
						}
					});

					// $(input).focusin(function () {
					//     $(document).keypress(function (e) {
					//         if (e.which == 13) {
					//             $(input).trigger('focus');
					//             $(input).simulate('keydown', { keyCode: $.ui.keyCode.DOWN } ).simulate('keydown', { keyCode: $.ui.keyCode.ENTER });
					//         }
					//     });
					// });

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
						$scope.apply();
					});

					return sBox;
				};

				// this will translate info from location to used format
				$scope.translateLocation = function(loc) {
					var short = {},
						long = {};

					if (loc) {
						Object.keys(loc).forEach(function(key) {
							short[loc[key].types[0]] = loc[key].short_name;
							long[loc[key].types[0]] = loc[key].long_name;
						});
					}
					return {
						street_number: long.street_number, // cislo baraku
						street_premise: long.premise, // cislo popisne
						street: long.route, // ulice
						country: long.country, // zeme
						country_code: short.country, // kod zeme - CZ
						zipcode: long.postal_code, // PSC
						city: long.postal_town || long.locality || long.administrative_area_level_1, // mestska cast nebo jen mesto nebo kraj
						area: long.administrative_area_level_1, // kraj
					};
				};

				$scope.apply = function() {
					if (!$scope.$$phase)
						$scope.$digest();
				};

				// go throught all places and compare them with new location
				// if there is duplicity - dont add it
				$scope.locationExists = function(lng, lat) {
					var precision = 7;

					for (var loc in $scope.locations) {
						var latlng = $scope.locations[loc].coordinates;
						if (
							latlng[0].toFixed(precision) == lng.toFixed(precision) &&
							latlng[1].toFixed(precision) == lat.toFixed(precision)
						)
							return true;
					}
					return false;
				};

				// add location to list
				$scope.fillLocation = function(pos, addr, info, apply) {
					// but only when it is now added yet
					if (!$scope.locationExists(pos.lng(), pos.lat())) {

						info.origin_address = addr;
						info.address = addr;
						info.coordinates = [pos.lng(), pos.lat()];
						$timeout(function() {
							$scope.locations.push(info);
							tagsInput.focus();
							apply && $scope.apply();
						});
					}

					// and erase input for next location
					tagsInput.val('');
				};

				// slide down
				$scope.showMap = function() {

					$(".mapIcon .fa-times", baseElement).show();
					$(".location-map", baseElement).slideDown();
					$scope.mapIsVisible = true;
					$timeout($scope.initMap, 100);
				};

				// slide up 
				$scope.closeMap = function() {
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
					$scope.fillLocation($scope.mapPoint.latLng, $scope.mapPoint.name, $scope.mapPoint.info, false);
					$scope.closeMap();
				};

				$scope.refreshMapPoint = function() {
					geo.getAddress(marker.getPosition()).then(function(info) {
						$scope.mapPointShowName = false;

						$scope.mapPoint = {
							latLng: marker.getPosition(),
							name: info.formatted_address,
							info: $scope.translateLocation(info.address_components)
						};

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

					if ($(".location-map", baseElement).is(":visible"))
						$scope.closeMap();
					else
						$scope.showMap();
				};

				$scope.locationDoesNotMatter = function(val) {
					$scope.errorWrongPlace = false;
					$scope.closeMap();
					$scope.showError = false;

					if ($scope.disabled) {
						$scope.locations = [];
						tagsInput.attr("disabled", "disabled");
					} else {
						tagsInput.removeAttr("disabled");
					}
				};

				$scope.init = function() {

					tagsInput = $(".tags input", baseElement);
					sBox = addPlacesAutocompleteListener($('.tags input', baseElement)[0]);
					$scope.$watch('disabled', $scope.locationDoesNotMatter);
				};

				$scope.$watch("showError", function(val) {
					if (!val)
						$scope.showError = false;
					if (val)
						$scope.errorWrongPlace = false;
				});
				$timeout($scope.init);



				$scope.$on("$destroy", function() {
					$(document).unbind("focusin");
					$(document).unbind("focusout");
				})
			}
		};
	}
]);
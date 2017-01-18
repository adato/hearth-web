'use strict';

/**
 * @ngdoc service
 * @name hearth.services.PresignUploader
 * @description
 *    function to use to get presigned url for amazon direct upload
 *    resolves a json with
 *     - url to upload images to
 *     - presigned time-limited key that allows the upload
 *     - other information required by aws enabling the upload
 */

angular.module('hearth.services').factory('PresignUploader', [
	'Presign', '$q', '$http',
	function(Presign, $q, $http) {

		var HOUR = 3600000;

		var store = {};

		var factory = {

			/**
			 *  Function that uploads a file to a cdn
			 *  First, data about cdn is fetched from API
			 *  Second the given file is uploaded
			 *
			 *  @param {Object} - file - the file to upload
			 *  @resolve {url: cdn uri of the file uploaded}
			 */
			upload: upload
		};

		return factory;

		////////////////

		function getPresignInfo() {
			return $q(function(resolve, reject) {
				if (store.data && store.validSince.getTime() + HOUR > new Date().getTime()) {
					return resolve(store.data);
				} else {
					Presign.save({}, function(res) {

						store.validSince = new Date();
						store.data = res;

						return resolve(store.data);
					}, function(err) {
						return reject(err);
					});
				}
			});
		}

		function upload(paramObject) {
			return $q(function(resolve, reject) {
				getPresignInfo()
					.then(function(res) {

						delete res.$promise;
						delete res.$resolved;
						var uploadData = angular.merge({}, res);
						delete uploadData.url;
						delete uploadData.host;
						var fd = new FormData();
						for (var prop in uploadData) {
							if (uploadData.hasOwnProperty(prop)) fd.append(prop, uploadData[prop]);
						}
						fd.append('file', paramObject.file);

						// cleanup headers for upload call
						var apiTokenHeader = $http.defaults.headers.common["X-API-TOKEN"];
						delete $http.defaults.headers.common["X-API-TOKEN"];
						var apiVersionHeader = $http.defaults.headers.common["X-API-VERSION"];
						delete $http.defaults.headers.common["X-API-VERSION"];

						var req = $http.post(res.url, fd, {
							withCredentials: false,
							headers: {
								'Content-Type': undefined
							}
						});

						// return headers to their default values
						$http.defaults.headers.common["X-API-TOKEN"] = apiTokenHeader;
						$http.defaults.headers.common["X-API-VERSION"] = apiVersionHeader;

						return req;

					}).then(function(res) {

						var fileLink = res.data.match('<Location>(.*?)</Location>');

						if (!fileLink.length) reject(res);

						resolve({
							url: fileLink[1]
						});

					}).catch(reject);
			});
		}

	}
]);
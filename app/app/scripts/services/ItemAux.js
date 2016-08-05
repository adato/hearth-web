'use strict';

/**
 * @ngdoc service
 * @name hearth.services.ItemAux
 * @description functions for marketplace items / posts
 */

angular.module('hearth.services').factory('ItemAux', ['ngDialog',
	function(ngDialog) {

		var factory = {
			confirmSuspend: confirmSuspend
		};

		return factory;

		/////////////////////

		function confirmSuspend(item, scope) {
			scope.item = item;
			ngDialog.open({
				template: $$config.modalTemplates + 'suspendItem.html',
				controller: 'ItemSuspend',
				scope: scope,
				data: item,
				className: 'ngdialog-tutorial ngdialog-theme-default ngdialog-confirm-box',
				closeByDocument: false,
				showClose: false,
				closeByEscape: true,
			});
		}

	}
]);
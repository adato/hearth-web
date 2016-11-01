'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.ctrlEnterSubmit
 * @description Directive that submits a form (or performs other action) on ctrl/meta-key + enter
 *		It may take options in an attribute ctrl-enter-submit-opts, which is an object with possible props:
 *			- {Boolean} refocus - if true, refocuses the element after submitting
 * @restrict A
 */
angular.module('hearth.directives').directive('ctrlEnterSubmit', ['$timeout',
	function($timeout) {

		return ({
			link: link,
			require: '^?form',
			restrict: 'A'
		});

		function link(scope, element, attributes, formController) {
			if (!attributes.ctrlEnterSubmit && !formController) return false;
			element.on('keydown', handleKeyEvent);

			function handleKeyEvent(event) {
				if ((event.which === 13) && (event.metaKey || event.ctrlKey)) {
					event.preventDefault();
					attributes.ctrlEnterSubmit ? triggerExpression(event) : triggerFormEvent();
				}
			}

			function triggerExpression(keyEvent) {
				scope.$apply(
					function changeViewModel() {
						scope.$eval(attributes.ctrlEnterSubmit, {
							$event: keyEvent
						});
					}
				);
			}

			function triggerFormEvent() {
				closestForm().triggerHandler('submit');
				if (attributes.ctrlEnterSubmitOpts) {
					var opts = scope.$eval(attributes.ctrlEnterSubmitOpts);
					if (opts.refocus) $timeout(function() {
						console.log(element[0]);
						element[0].focus();
					});
				}
			}

			function closestForm() {
				var parent = element.parent();
				while (parent.length && (parent[0].tagName !== 'FORM')) {
					parent = parent.parent();
				}
				return (parent);
			}

		}

	}
]);
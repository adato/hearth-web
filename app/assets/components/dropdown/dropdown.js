'use strict';

/**
 * @ngdoc directive
 * @name hearth.directives.dropdown
 * @description
 * @restrict E
 */

angular.module('hearth.directives').directive('dropdown', ['$document', '$timeout', 'DOMTraversalService', function($document, $timeout, DOMTraversalService) {

	return {
		restrict: 'A',
		scope: {
			dropdown: '@', // class or id of element to show/hide
			hover: '=', // show/hide dropdown also on hover event
			dropdownScope: '='
		},
		link: function($scope, el, attrs) {

			var dropdownSearchScope = findScope()

			// on element click toggle dropdown
			el.on('click', event => {
				const action = getTarget().css('display') == 'block' ? hideDropdown : showDropdown
				hideDropdown()
				$timeout(action)
			})

			if ($scope.hover) {
				el.parent().on('mouseenter', showDropdown)
				el.parent().on('mouseleave', hideDropdown)
			}

			// when clicking outside of dropdown label, hide dropdown
			$document.on('click', e => DOMTraversalService.hasParent(e.target, el) ? false : hideDropdown())

			// clean-up
			$scope.$on('$destroy', () => {
				$document.off('click', hideDropdown)
			})

			///////////////

			// return the dropdown element to show/hide
			function getTarget() {
				return dropdownSearchScope.find($scope.dropdown)
			}

			function showDropdown() {
				getTarget().css('display', 'block')
			}

			// hide dropdown
			function hideDropdown() {
				getTarget().css('display', 'none')
			}

			function findScope() {
				var scope
				if ($scope.dropdownScope) {
					scope = DOMTraversalService.findParentBySelector(el[0], $scope.dropdownScope)
				}
				return scope ? angular.element(scope) : $document
			}

		}
	}

}])
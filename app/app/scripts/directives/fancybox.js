'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.fancybox
 * @description Add fancybox page preview
 * @restrict A
 */
angular.module('hearth.directives').directive('fancybox', function($compile, $timeout) {
    return {
        link: function($scope, element, attrs) {
            $(element).find(".fancy").fancybox({
                padding: 0,
                helpers: {
                    overlay: {
                        locked: false
                    }
                },
                hideOnOverlayClick: false,
                hideOnContentClick: false,
                enableEscapeButton: false,
                showNavArrows: false,
                onComplete: function() {
                    $timeout(function() {
                        $compile($("#fancybox-content"))($scope);
                        $scope.$apply();
                        $.fancybox.resize();
                    })
                }
            });
        }
    }
});


angular.module('hearth.directives').directive('flexslider', function() {

    return {
        link: function($scope, element, attrs) {

            setTimeout(function() {

                element.flexslider({
                    animation: "slide",
                    itemWidth: 600,
                    itemMargin: 5,
                    directionNav: false,
                    after: $scope.hideItem,

                });
            });

            $scope.hideItem = function(slider) {
                console.log(slider.currentSlide);
            }
        }
    }
});
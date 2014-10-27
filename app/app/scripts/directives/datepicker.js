'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.datepicker
 * @description Solves UI for selecting date
 * @restrict A
 */
angular.module('hearth.directives').directive('datepicker', [
    '$rootScope', '$filter',
    function($rootScope, $filter) {
        return {
            restrict: 'A',
            scope: {
                datepicker: '@'
            },
            link: function(scope, element, attrs) {
                attrs.$observe('datepicker', function() {
                    var now = new Date(),
                        limit = (new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)).getTime();
                    var dateFormat = attrs.datepickerFormat || 'd. M. y';
                    // var dateFormat = 'd. M. y';

                    // datepicker has different format for dates - use m as Month number
                    // for more info: http://api.jqueryui.com/datepicker/
                    dateFormat = dateFormat.toLowerCase();

                    // also make year longer - from 14 to 2014 and so on
                    dateFormat = dateFormat.replace(/([^y]|y)yy(?!y)/g, '$1yyyy');
                    dateFormat = dateFormat.replace(/([^y]|^)y(?!y)/g, '$1yyyy');

                    var datepick = $(element).fdatepicker({
                        onRender: function(date) {
                            return date.getTime() < limit ? 'disabled' : '';
                        },
                        isInline: true,
                        autoclose: true,
                        weekStart: attrs.datepicker === 'en' ? 0 : 1,
                        format: dateFormat,
                        language: attrs.datepicker === 'cs' ? 'cz' : attrs.datepicker
                    }).on('changeDate', function(ev) {
                        if (ev.date.getTime() < limit) {
                            datepick.fdatepicker('update', now);
                        }
                    }).on('show', function() {
                        $('.datepicker-dropdown:visible').css({
                            top: parseInt($('.datepicker-dropdown:visible').css('top'), 10) - parseInt($('.main-container').css('margin-top'), 10)
                        });
                    });
                });
            }
        };
    }
]);
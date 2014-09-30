'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
    '$scope', '$rootScope', '$location', '$route', 'Auth', 'ngDialog', '$timeout', '$element', 'CommunityMemberships', '$window',

    function($scope, $rootScope, $location, $route, Auth, ngDialog, $timeout, $element, CommunityMemberships, $window) {
        var timeout;
        $scope.segment = false;

        $rootScope.$on("$routeChangeSuccess", function() {
            $scope.segment = $route.current.segment;
        });

        $scope.closeDropdown = function(id) {
            Foundation.libs.dropdown.close($('#'+id));
        };

        $scope.topArrowText = {};
        $scope.isScrolled = false;

        $scope.showUI = function(ui) {
            $scope.$broadcast('showUI', ui);
        };
        $scope.logout = function() {
            Auth.logout(function() {
                window.location = window.location.pathname;
            });
        };
        $scope.search = function(text) {
            if (!text) return false;
            $location.path('/search');
            $location.search('q=' + (text || ""));
            
            // first reload scope to new location, then start searching
            $timeout(function() {
                $scope.$broadcast("fulltextSearch");
            });
        };
        $scope.top = function() {
            $('html, body').animate({
                scrollTop: 0
            }, 1000);
        };

        $scope.$watch('user', function() {
            var user = $scope.user.get_logged_in_user;
        });

        $scope.$on('$includeContentLoaded', function() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function() {
                $(document).foundation();
            }, 1000);
        });

        $scope.$on('$routeChangeSuccess', function(next, current) {

            $("#all").removeClass();
            $("#all").addClass(current.controller);
        });

        angular.element(window).bind('scroll', function() {
            if ($(window).scrollTop() > 0 !== $scope.isScrolled) {
                $('html').toggleClass('scrolled');
                $scope.isScrolled = !$scope.isScrolled;
            }
        });

        $scope.getRandom = function() {
            return Math.random();
        };

        $scope.loadMyCommunities = function() {
            CommunityMemberships.get({user_id: $rootScope.loggedUser._id},function(res) {
                $rootScope.myCommunities = res;
                $rootScope.myAdminCommunities = [];
                res.forEach(function(item) {

                    // create list of communities I'm admin in
                    if(item.admin == $rootScope.loggedUser._id)
                        $rootScope.myAdminCommunities.push(item);
                });
            });
        };

        $rootScope.switchIdentity = function(id) {
            Auth.switchIdentity(id).then(function() {
                // $location.path('/community/' + id);
                window.location.hash = '#!/community/'+id;
                location.reload();
                // return $timeout(function() {
                //     return $window.location.reload("/community/"+id);
                // });
            });
        };

        $rootScope.leaveIdentity = function(id) {
            Auth.switchIdentityBack(id).then(function() {
                window.location.hash = '#!/profile/' + id
                location.reload();
                // $location.path();
                // return $timeout(function() {
                //     return $window.location.reload();
                // });
            });
        };

        $scope.$on('reloadCommunities', $scope.loadMyCommunities);
        $scope.$on('initFinished', $scope.loadMyCommunities);
        $rootScope.initFinished && $scope.loadMyCommunities();

        // ======================================== PUBLIC METHODS =====================================
        $rootScope.showLoginBox = function() {

            ngDialog.open({
                template: $$config.modalTemplates + 'loginBox.html',
                controller: 'LoginCtrl',
                scope: $scope
            });
        };

        $rootScope.editItem = function(post) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox();

            var scope = $scope.$new();
            scope.post = angular.copy(post);

            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'itemEdit.html',
                controller: 'ItemEdit',
                scope: scope,
                closeByDocument: false,
                showClose: false
            });

            dialog.closePromise.then(function(data) {});
        };


        $rootScope.replyItem = function(post) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox();

            var scope = $scope.$new();
            scope.post = post;
            
            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'itemReply.html',
                controller: 'ItemReply',
                scope: scope,
                closeByDocument: false,
                showClose: false
            });

            dialog.closePromise.then(function(data) {});
        };
    }
]);
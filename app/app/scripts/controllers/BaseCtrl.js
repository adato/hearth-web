'use strict';

/**
 * @ngdoc controller
 * @name hearth.controllers.BaseCtrl
 * @description
 */

angular.module('hearth.controllers').controller('BaseCtrl', [
    '$scope', '$locale', '$rootScope', '$location', '$route', 'Auth', 'ngDialog', '$timeout', '$element', 'CommunityMemberships', '$window', 'Post', 'Tutorial', 'Notify',

    function($scope, $locale, $rootScope, $location, $route, Auth, ngDialog, $timeout, $element, CommunityMemberships, $window, Post, Tutorial, Notify) {
        var timeout;
        $rootScope.myCommunities = false;
        $scope.segment = false;
        $scope.addresses = {
            "Community": "community",
            "User": "profile",
            "Post": "ad",
        };

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
                window.location.hash = '#!/';
                location.reload();
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

        $scope.getProfileLinkByType = function(type) {
            return $scope.addresses[type];
        };

        $scope.refreshToPath = function(path) {
            window.location.hash = '#!/' + path;
            location.reload();
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
                window.location.hash = '#!/community/'+id;
                location.reload();
            });
        };

        $rootScope.leaveIdentity = function(id) {
            Auth.switchIdentityBack(id).then(function() {
                window.location.hash = '#!/profile/' + id
                location.reload();
            });
        };

        // try to load tutorial pages - if there is any, show tutorial
        $scope.checkTutorial = function() {
            // check only after login
            if($.cookie('tutorial') === '1') {

                $.removeCookie('tutorial');
                Tutorial.get({user_id: $rootScope.loggedUser._id}, function(res) {
                    if(res.length) $rootScope.showTutorial(res);
                });
            }
        };

        $scope.initHearthbeat = function() {

            if($rootScope.loggedUser._id) {
                $scope.checkTutorial();
                $scope.loadMyCommunities();
            } else {
                // set to check tutorial after next login
                $.cookie('tutorial', 1);
            }

            $scope.showTutorial();

            $rootScope.pluralCat = $locale.pluralCat;
            $rootScope.DATETIME_FORMATS = $locale.DATETIME_FORMATS;
        };

        $scope.$on('reloadCommunities', $scope.loadMyCommunities);
        $scope.$on('initFinished', $scope.initHearthbeat);
        $rootScope.initFinished && $scope.initHearthbeat();

        // ======================================== PUBLIC METHODS =====================================
        $rootScope.showLoginBox = function(showMsgOnlyLogged) {
            
            $scope.showMsgOnlyLogged = showMsgOnlyLogged;
            ngDialog.open({
                template: $$config.templates + 'userForms/login.html',
                controller: 'LoginCtrl',
                scope: $scope,
                closeByEscape: false,
                showClose: false
            });
        };

        // send report to API and close modal.. maybe fire some notification too?
        $rootScope.reportItem = function(item, modal) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox(true);

            Post.spam({id: item._id}, function(res) {
                if(modal) $('#'+modal).foundation('reveal', 'close');
                $rootScope.$broadcast('reportItem', item);

                Notify.addSingleTranslate('NOTIFY.POST_SPAM_REPORT_SUCCESS', Notify.T_SUCCESS);
            }, function(err) {
                
                Notify.addSingleTranslate('NOTIFY.POST_SPAM_REPORT_FAILED', Notify.T_ERROR);
            });
        };

        // open modal window for item edit
        $rootScope.editItem = function(post, isInvalid) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox(true);

            var scope = $scope.$new();
            scope.post = angular.copy(post);
            scope.postOrig = post;
            scope.isInvalid = isInvalid;

            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'itemEdit.html',
                controller: 'ItemEdit',
                scope: scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose: false
            });
            dialog.closePromise.then(function(data) {});
        };

        $rootScope.removeItemFromList = function(id, list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i]._id === id) {
                    list.splice(i, 1);
                    break;
                }
            }
            return list;
        };

        // delete item
        $rootScope.deleteItem = function(post, modal, cb) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox(true);

            Post.remove({postId:post._id}, function(res) {
                if(modal) $('#'+modal).foundation('reveal', 'close'); // if opened close modal window
                $rootScope.$broadcast("itemDeleted", post); // broadcast event to hearth

                Notify.addSingleTranslate('NOTIFY.POST_DELETED_SUCCESFULLY', Notify.T_INFO);

                cb && cb(post); // if callback given, call it
            });
        };

        $rootScope.closeModal = function(item, modal) {
            // if opened close modal window
            if(modal) $('#'+modal).foundation('reveal', 'close');
        };
        
        $rootScope.replyItem = function(post) {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox(true);
            
            var scope = $scope.$new();
            scope.post = post;
            
            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'itemReply.html',
                controller: 'ItemReply',
                scope: scope,
                closeByDocument: false,
                closeByEscape: false,
                showClose: false
            });

            dialog.closePromise.then(function(data) {});
        };

        // show modal window with invite options
        $rootScope.openInviteBox = function() {
            if (!Auth.isLoggedIn())
                return $rootScope.showLoginBox(true);
            
            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'inviteBox.html',
                controller: 'InviteBox',
                scope: $scope.$new(),
                className: 'ngdialog-invite-box',
                closeByDocument: false,
                closeByEscape: false,
                // showClose: false
            });

            dialog.closePromise.then(function(data) {});
        };

        $rootScope.showTutorial = function(slides) {

            var scope = $scope.$new();
            scope.tutorials = slides || [];

            var dialog = ngDialog.open({
                template: $$config.modalTemplates + 'tutorial.html',
                controller: 'Tutorial',
                scope: scope,
                className: 'ngdialog-tutorial ngdialog-theme-default',
                closeByDocument: false,
                closeByEscape: false,
                showClose: false
            });

            dialog.closePromise.then(function(data) {});
        };

        // this will flash post box with some background color
        $rootScope.blinkPost = function(item) {
            var delayIn = 200;
            var delayOut = 2000;
            var color = "#FFB697";
            $(".post_"+item._id+" .item").animate({backgroundColor: color}, delayIn, function() {
                $(".post_"+item._id+" .item").animate({backgroundColor: "#FFF"}, delayOut );
            });
    
            $(".post_"+item._id+" .item .overlap").animate({backgroundColor: color}, delayIn, function() {
                $(".post_"+item._id+" .item .overlap").animate({backgroundColor: "#FFF"}, delayOut );
            });

            $(".post_"+item._id+" .item .arrowbox").animate({backgroundColor: color}, delayIn, function() {
                $(".post_"+item._id+" .item .arrowbox").animate({backgroundColor: "#FFF"}, delayOut );
            });

        };

        // == deactivate / prolong / activate post item
        // and close modal or call given callback
        $rootScope.pauseToggle = function(item, modal, cb) {
            var Action, actionType;

            // suspend or play based on post active state
            if($rootScope.isPostActive(item)) {

                Action = Post.suspend;
                actionType = 'suspend';
            } else {

                // if item is expired, then prolong him, or just resume
                Action = (item.is_expired) ? Post.prolong : Post.resume;
                actionType = 'activate';
            }
            
            // call service
            Action({
                    id: item._id
                },
                function(res) {

                    if(modal) $('#'+modal).foundation('reveal', 'close');
                    if(cb) cb(item);
                    $rootScope.$broadcast('updatedItem', res);
                    Notify.addSingleTranslate('NOTIFY.POST_UPDATED_SUCCESFULLY', Notify.T_SUCCESS);

                }, function(err) {
                    if( err.status == 422) {

                        // somethings went wrong - post is not valid
                        // open edit box and show error
                        if(modal) $('#'+modal).foundation('reveal', 'close');
                        $rootScope.editItem(item, true);
                    } else {

                        Notify.addSingleTranslate('NOTIFY.POST_UPDAT_FAILED', Notify.T_ERROR);
                    }
            });
        };

        // this will scroll to given element in given container (if not setted take body as default)
        $rootScope.scrollToElement = function(el, cont) {
            var offset = 200;
            var container = cont || 'html, body';
            var elementPos;

            if(! $(el).first().length)
                return false;

            elementPos = Math.max($(el).first().offset().top - offset, 0);
            $(container).animate({scrollTop: elementPos}, 'slow');
        };

        // this will scroll to given element or first error message on page
        $rootScope.scrollToError = function(el, cont) {
            setTimeout(function() {
                $rootScope.scrollToElement(el || $('.error').not('.alert-box'), cont);
            });
        };

        // return false if post is inactive
        $rootScope.isPostActive = function(item) {
            return item.is_active && !item.is_expired;
        };
    }
]);
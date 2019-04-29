'use strict';

/**
 * @ngdoc controller for inviting members into community
 * @name hearth.controllers.CommunityInvitationCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityInvitationCtrl', [
	'$scope', '$rootScope', 'Community', '$stateParams', 'PostAux', '$http', '$window', '$translate',
	function($scope, $rootScope, Community, $stateParams, PostAux, $http, $window, $translate) {
        var ctrl = this;
        ctrl.invitation = {
            postsLoaded: false,
            postsExpanded: false,
            posts: [],
            body: '',
            communityName: null,
            url: null,
            
        }
        ctrl.url = null;
        ctrl.showMaxPostsError = false;

        ctrl.fetchCommunityInfo = () => {
            let id = $stateParams['id'];
            let url = $window.$$config.appUrl + 'community/' + id;

            if ($window.$$config.shortLinkGeneratorUrl && $window.$$config.shortLinkAccessUrl) {
                $http.get($window.$$config.shortLinkGeneratorUrl, { 
                    withCredentials: false,
                    params: { url: url }
                }).then((response) => {
                    if (response.data && response.data.url) {
                        ctrl.url = $window.$$config.shortLinkAccessUrl + response.data.url;
                        ctrl.initCommunityInfo(id);
                    }
                }, (error) => {
                    ctrl.url = url;
                    ctrl.initCommunityInfo(id);
                });
            } else {
                ctrl.url = url;
                ctrl.initCommunityInfo(id);
            }
        }

        ctrl.initCommunityInfo = (id) => {
            Community.get({ _id: id }).$promise.then((res) => {
                ctrl.invitation.url = ctrl.url;
                ctrl.invitation.communityName = res.name;
                ctrl.invitation.body = $translate.instant('COMMUNITY.INVITATION.EMAIL_BODY')
                    .replace("COMMUNITY_NAME", res.name)
                    .replace("COMMUNITY_URL", ctrl.url);
            })
        }
                


        ctrl.fetchPosts = () => {
            let id = $stateParams['id'];
            Community.getPosts({
                communityId: id,
                limit: 20,
                offset: 0
            }).$promise.then(function (res) {
                let counter = 0;
                let MAX_COUNTER = 3;
                let filtered = res.data.filter(item => {
                    return item.state === 'active';
                });
                filtered.forEach(post => {
                    if (counter < MAX_COUNTER) post.checked = true;
                    post.postTypeCode = PostAux.getPostTypeCode(post.author._type, post.type, post.exact_type);
                    post.isInfoGift = PostAux.isInfoGift(post);
                    counter++;
                });
                ctrl.invitation.postsLoaded = true;
                ctrl.invitation.posts = filtered;
            })
        };


        ctrl.generatePoster = (type) => {
            let filtered = ctrl.invitation.posts.filter((item) => {
                return (item.checked === true);
            });
            let publishData = { 
                posts: filtered,
                community: {
                    name: ctrl.invitation.communityName,
                    link: ctrl.invitation.url
                }
            }
            var newWindow = $window.open('', '_blank');
            newWindow.document.write('<p>' + $translate.instant('COMMON.LOADING') + '</p>');
            $http.post($window.$$config.pdfFrontendUrl, publishData, { withCredentials: false }).then((res) => {
                if (res.data && res.data.result === "ok") {
                    let token = res.data.token;
                    let tmpUrl = $window.$$config.pdfFrontendUrl + "?token=" + token + "&layout=" + type;
                    let url = encodeURIComponent(tmpUrl);
                    newWindow.location = $window.$$config.pdfApiUrl + '?url=' + url;
                } else {
                    /// ... ajajaj
                }
            }, (err) => {
                throw new Error("Error PDF FE");
            })
        }


        function selectAllText(where) {
            var el = $window.document.getElementById(where);
            if (el && el.focus && el.select) {
                el.focus();
                el.select();
            }
        }

        ctrl.copyLink = () => {
            selectAllText('community-invitation-textarea');
            $window.document.execCommand("copy");
            ctrl.showSuccessTick = true;
            $window.setTimeout(() => {
                ctrl.showSuccessTick = false;
            }, 1000);
        }


        ctrl.copyUrlLink = () => {
            selectAllText('community-invitation-url');
            $window.document.execCommand("copy");
            ctrl.showUrlSuccessTick = true;
            $window.setTimeout(() => {
                ctrl.showUrlSuccessTick = false;
            }, 1000);
        }

        ctrl.checkNumberOfSelectedPosts = () => {
            var num = (ctrl.invitation.posts.filter((item) => {
                return (item.checked === true);
            }).length);
            return num > 2;
        }


        ctrl.fetchCommunityInfo();
        ctrl.fetchPosts();

    }
]);
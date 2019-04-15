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
            communityLink: null,
            
        }
        ctrl.communityLink = null;
        ctrl.showMaxPostsError = false;

        ctrl.fetchCommunityInfo = () => {
            let id = $stateParams['id'];
            let communityLink = $window.$$config.appUrl + 'community/' + id;

            if ($window.$$config.shortLinkGeneratorUrl && $window.$$config.shortLinkAccessUrl) {
                $http.get($window.$$config.shortLinkGeneratorUrl, { 
                    withCredentials: false,
                    params: { url: communityLink }
                }).then((response) => {
                    if (response.data && response.data.url) {
                        ctrl.communityLink = $window.$$config.shortLinkAccessUrl + response.data.url;
                        ctrl.initCommunityInfo(id);
                    }
                }, (error) => {
                    ctrl.communityLink = communityLink;
                    ctrl.initCommunityInfo(id);
                });
            } else {
                ctrl.communityLink = communityLink;
                ctrl.initCommunityInfo(id);
            }
        }

        ctrl.initCommunityInfo = (id) => {
            Community.get({ _id: id }).$promise.then((res) => {
                ctrl.invitation.communityLink = ctrl.communityLink;
                ctrl.invitation.communityName = res.name;
                ctrl.invitation.body = $translate.instant('COMMUNITY.INVITATION.EMAIL_BODY')
                    .replace("COMMUNITY_NAME", res.name)
                    .replace("COMMUNITY_URL", ctrl.communityLink);
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
                res.data.forEach(post => {
                    if (counter < MAX_COUNTER) post.checked = true;
                    post.postTypeCode = PostAux.getPostTypeCode(post.author._type, post.type, post.exact_type);
                    post.isInfoGift = PostAux.isInfoGift(post);
                    counter++;
                });
                ctrl.invitation.postsLoaded = true;
                ctrl.invitation.posts = res.data;
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
                    link: ctrl.invitation.communityLink
                }
            }

            console.log($window.$$config);
            $http.post($window.$$config.pdfFrontendUrl, publishData, { withCredentials: false }).then((res) => {
                if (res.data && res.data.result === "ok") {
                    let token = res.data.token;
                    let tmpUrl = $window.$$config.pdfFrontendUrl + "?token=" + token + "&layout=" + type;
                    let url = encodeURIComponent(tmpUrl);
                    $window.open($window.$$config.pdfApiUrl + '?url=' + url);
                } else {
                    /// ... ajajaj
                }
            }, (err) => {
                throw new Error("Error PDF FE");
            })
        }


        function selectAllText() {
            var el = $window.document.getElementById('community-invitation-textarea');
            if (el && el.focus && el.select) {
                el.focus();
                el.select();
            }
        }

        ctrl.copyLink = () => {
            selectAllText();
            $window.document.execCommand("copy");
            ctrl.showSuccessTick = true;
            $window.setTimeout(() => {
                ctrl.showSuccessTick = false;
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
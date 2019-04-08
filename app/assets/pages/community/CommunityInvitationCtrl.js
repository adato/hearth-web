'use strict';

/**
 * @ngdoc controller for inviting members into community
 * @name hearth.controllers.CommunityInvitationCtrl
 * @description
 */

angular.module('hearth.controllers').controller('CommunityInvitationCtrl', [
	'$scope', '$rootScope', 'Community', '$stateParams', 'PostAux', '$http', '$window', '$filter',
	function($scope, $rootScope, Community, $stateParams, PostAux, $http, $window, $filter) {
        var ctrl = this;
        ctrl.invitation = {
            postsLoaded: false,
            postsExpanded: false,
            posts: [],
            body: 'COMMUNITY.INVITATION.EMAIL_BODY',
            communityName: null,
            communityLink: null,
            
        }
        ctrl.communityLink = null;

        const PDF_FRONTEND_URL = "http://pdf.hearth.net.adato.miniserver.cz/";
        const PDF_API_URL = "https://67ngmpm84c.execute-api.us-east-1.amazonaws.com/dev/pdf"

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
                    }
                }, (error) => {
                    ctrl.communityLink = communityLink;
                });
            } else {
                ctrl.communityLink = communityLink;
            }

            Community.get({ _id: id }).$promise.then((res) => {
                ctrl.invitation.communityLink = ctrl.communityLink;
                ctrl.invitation.communityName = res.name;
                ctrl.invitation.body = $filter('translate')(ctrl.invitation.body)
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
            console.log("generate poster");
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
            $http.post(PDF_FRONTEND_URL, publishData, { withCredentials: false }).then((res) => {
                if (res.data && res.data.result === "ok") {
                    let token = res.data.token;
                    let tmpUrl = PDF_FRONTEND_URL + "?token=" + token + "&layout=" + type;
                    console.log("open", tmpUrl)
                    let url = encodeURIComponent(tmpUrl);
                    $window.open(PDF_API_URL + '?url=' + url);
                } else {
                    /// ... ajajaj
                }
            }, (err) => {
                throw new Error("Error PDF FE");
            })
        }

        ctrl.fetchCommunityInfo();
        ctrl.fetchPosts();

    }
]);
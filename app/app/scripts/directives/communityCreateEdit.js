'use strict';
/**
 * @ngdoc directive
 * @name hearth.directives.communityCreateEdit
 * @description 
 * @restrict E
 */
angular.module('hearth.directives').directive('communityCreateEdit', [
    '$rootScope', '$location', '$routeParams', 'Community', 'CommunityMembers', 'CommunityDelegateAdmin', 'Notify',
    function($rootScope, $location, $routeParams, Community, CommunityMembers, CommunityDelegateAdmin, Notify) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                close: "&"
            },
            templateUrl: 'templates/directives/communityEditForm.html',
            link: function($scope, element) {
                $scope.communityMembers = false;
                $scope.loaded = false;
                $scope.sendingDelete = false;
                $scope.defaultCommunity = {
                    name: '',
                    location: [{name:''}],
                    description: '',
                    terms: '',
                };
                $scope.showError = {
                    name: false,
                    location: false,
                    description: false,
                };
                $scope.community = {};
                
                $scope.fillDefaultCommunity = function() {
                    
                    $scope.community = angular.copy($scope.defaultCommunity);
                    $scope.loaded = true;
                };

                $scope.transformDataOut = function(data) {

                    data.location = data.location[0];
                    return data;
                };

                $scope.transformDataIn = function(data) {

                    if(data.location === null) {
                        data.location = [{name:''}];
                    } else {
                        data.location = [data.location];
                    }
                    return data;
                };

                /**
                 * Function will remove user from list
                 * @param  {string} id UserId to remove
                 * @param  {array} arr User list in array
                 * @return {array}     User list without me
                 */
                $scope.removeMemberFromList = function(arr, uId) {

                    for(var i = 0; i < arr.length; i++) {
                        if(arr[i]._id == uId) {
                            arr.splice(i, 1);
                            break;
                        }
                    }
                    return arr;
                };

                $scope.loadCommunity = function(id) {
                    Community.get({communityId: id}, function(res) {
                        $scope.community = $scope.transformDataIn(res);
                        $scope.loaded = true;
                    });

                    CommunityMembers.query({communityId: id}, function(res) {
                        // remove myself from list
                        $scope.communityMembers = $scope.removeMemberFromList(res, $rootScope.loggedUser._id);
                        if($scope.communityMembers.length) {
                            $scope.adminChangeId = $scope.communityMembers[0]._id;
                        }
                    });
                };

                $scope.getCommunityId = function() {
                    return $routeParams.id;
                };

                $scope.validate = function(data) {
                    var err = false;

                    if($scope.communityForm.name.$invalid) {
                        $scope.showError.name = err = true;
                    }
                    
                    if($scope.communityForm.description.$invalid) {
                        $scope.showError.description = err = true;
                    }

                    if(data.location[0].name == '') {
                        $scope.showError.location = err = true;
                    }

                    return ! err; // return true if valid
                }

                $scope.save = function() {
                    // if we have community ID - then edit
                    var service = ($scope.community._id) ? Community.edit : Community.add;
                    var transformedData;
                    // validate data
                    if(!$scope.validate($scope.community)) {
                        $rootScope.scrollToError();
                        return false;
                    }

                    // lock
                    if($scope.sending) return false;
                    $scope.sending = true;
                    $rootScope.globalLoading = true;

                    transformedData = $scope.transformDataOut(angular.copy($scope.community));
                    service(transformedData, function(res) {
                        $rootScope.globalLoading = false;
                        $rootScope.$broadcast("reloadCommunities");
                        $location.path('/community/'+res._id);

                        if ($scope.community._id)
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_UPDATE_SUCCESS', Notify.T_SUCCESS);
                        else
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_CREATE_SUCCESS', Notify.T_SUCCESS);

                    }, function(res) {
                        $scope.sending = false;
                        $rootScope.globalLoading = false;
                        

                        // and show another based on what we wanted to do
                        if ($scope.community._id)
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_UPDATE_FAILED', Notify.T_ERROR, '.communities-notify-area');
                        else
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_CREATE_FAILED', Notify.T_ERROR, '.communities-notify-area');
                    });
                };
                
                $scope.change = function(id) {

                    if(!id) {
                        return false;
                    }

                    $rootScope.globalLoading = true;
                    CommunityDelegateAdmin.delegate({community_id: $scope.community._id, new_admin_id: id},
                        function(res) {
                            $rootScope.globalLoading = false;
                            $rootScope.$broadcast("reloadCommunities");
                            $location.path('/community/'+$scope.community._id);
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELEGATE_ADMIN_SUCCESS', Notify.T_SUCCESS);
                        }, function(res) {
                            $rootScope.globalLoading = false;
                            Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELEGATE_ADMIN_FAILED', Notify.T_ERROR);
                        });
                };

                $scope.delete = function() {

                    if($scope.sendingDelete) return false;
                    $scope.sendingDelete = true;
                    $rootScope.globalLoading = true;
                    Community.remove({communityId: $scope.community._id}, function(res) {
                        $rootScope.globalLoading = false;
                        $scope.sendingDelete = false;
                        $scope.closeModal(null, 'confirm-delete-community');
                        Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELETE_SUCCESS', Notify.T_SUCCESS);

                        $rootScope.$broadcast("reloadCommunities");
                        $location.path("/communities");
                    }, function(res) {

                        $rootScope.globalLoading = false;
                        Notify.addSingleTranslate('NOTIFY.COMMUNITY_DELETE_FAILED', Notify.T_ERROR);
                        $scope.sendingDelete = false;
                    });
                };

                $scope.close2 = function() {
                    $scope.close();
                };

                $scope.init = function() {
                    $scope.pluralCat = $rootScope.pluralCat;
                    $scope.closeModal = $rootScope.closeModal;

                    if($scope.getCommunityId()) {
                        $scope.loadCommunity($scope.getCommunityId());
                    } else {
                        $scope.fillDefaultCommunity();
                    }
                };

                $scope.$on('initFinished', $scope.init);
                $rootScope.initFinished && $scope.init();
            }
        };
    }
]);
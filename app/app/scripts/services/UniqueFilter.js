'use strict';

/**
 * @ngdoc service
 * @name hearth.services.FilterService
 * @description filter results to remove duplicities
 */

angular.module('hearth.services').factory('UniqueFilter', function () {

  // the public widget API
  return function() {
    var self = this;
    var idList = [];

    this.getList = function() {
      return idList;
    };

    this.clear = function() {
      idList = [];  
    };

    this.add = function(item) {
      idList.push(item);
    };
    
    this.isInIdList = function(item) {
      return idList.indexOf(item) !== -1
    };

    this.addItemsToIdList = function(items) {
      items.forEach(function(i) {
        self.add(i._id);
      });
    };

    this.filter = function(data) {
      data = self.removeDuplicities(data);
      self.addItemsToIdList(data);
      return data;
    };
    
    this.removeDuplicities = function(items) {
      var out = [];

      items.forEach(function(item) {
        if(!self.isInIdList(item._id)) out.push(item);
      });
      return out;
    };

    return this;
  };
});
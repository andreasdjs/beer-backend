'use strict';

app.service('dataService', function($http) {

  /* Get matched available beer */

  this.getMatchedSystembolagetBeer = function(cb) {
    $http.get('/api/systembolagetMatchedBeer').then(cb);
  };

  /* Get available beer */

  this.getAvailableBeer = function(cb) {
    $http.get('/api/availableBeer').then(cb);
  };

  /* Get rated beer */

  this.getRatedBeer = function(cb) {
    $http.get('/api/ratedBeer').then(cb);
  };

  /* Get rated systembolagetbeer */

  this.getSystembolagetBeer = function(cb) {
    $http.get('/api/systembolagetBeer').then(cb);
  };

});



'use strict';

app.controller('myController', function($scope, dataService) {

	dataService.getMatchedSystembolagetBeer(function(response) {
		$scope.systembolagetMatchedBeer =  response.data.systembolagetMatchedBeer;
	});

	dataService.getRatedBeer(function(response) {
		$scope.ratedBeer =  response.data.ratedBeer;
	});

	dataService.getSystembolagetBeer(function(response) {
		$scope.systembolagetBeer =  response.data.systembolagetBeer;
	});

	dataService.getAvailableBeer(function(response) {
		$scope.availableBeer =  response.data.availableBeer;
	});

});





/**
 * @author HP
 */
app.controller('UserCtrl', function($rootScope,$route,$location, $scope, $http, $window) {
	$scope.user = {
		username : '',
		password : ''
	};
	
	$scope.message = '';
	$scope.submit = function() {
		console.log("login")
		$http.post('/authenticate', $scope.user).success(function(data, status, headers, config) {
			//console.log(data)
			$window.sessionStorage.token = data.token;
			$rootScope.Ui.turnOff('modal1');
			$location.path("/");
			$route.reload();
			$scope.message = '';
		}).error(function(data, status, headers, config) {
			// Erase the token if the user fails to log in
			delete $window.sessionStorage.token;

			// Handle login errors here
			$scope.message = 'Error: '+data;
		});
	};
}); 
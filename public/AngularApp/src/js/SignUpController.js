/**
 * @author HP
 */
app.controller('SignUpCtrl', function($rootScope,$route,$location, $scope, $http, $window) {
	$scope.user = {
		username 	: '',
		password 	: '',
		name		: '',
		mail		: ''
	};
	
	$scope.message = '';
	$scope.submit = function() {
		console.log("signUp")
		$http.post('/signUp', $scope.user).success(function(data, status, headers, config) {
			//console.log(data)
			//$window.sessionStorage.token = data.token;
			//$rootScope.Ui.turnOff('modal1');
			//$location.path("/");
			//$route.reload();
			$rootScope.topButtonClk();
			$rootScope.successfullySign = "Accoun was created!"
			//$scope.message = 'Welcome';
		}).error(function(data, status, headers, config) {
			// Erase the token if the user fails to log in
			delete $window.sessionStorage.token;
			
			// Handle login errors here
			$scope.message = 'Error: '+data;
		});
	};
}); 
/**
 *
 */
app.controller('homeController', function($rootScope, $scope, $http, $location, serviceHttp) {
	$rootScope.myToggleableDropdown = "";
	// $rootScope.toggle('myToggleableDropdown', 'on');

	$scope.users = [];
	serviceHttp.get("/webService/usersT", function(json) {
		console.log(json.length);
		for (var i = 0; i < json.length; i++) {
			console.log(json[i]);
			$scope.users.push(json[i]);
			console.log("USER " + $scope.users[i].name)
		}
	});

	$scope.selectUser = function(item) {
		console.log(item)
		localStorage.setItem("userID", item.user_id);
		localStorage.setItem("userName", item.name);
		$location.path("graphs");

	}
	// serviceHttp.deleteCol("/samples",function(json){
	// console.log("sters")
	// })

	// serviceHttp.post("/webService/usersApneea", '{"username": "manu", "password": "manu", "name": "Emanuel Bulboaca", "mail": "manu.bulb@medic.ro"}', function(json) {
		// console.log(json);
// 		
	// })
	
	
});

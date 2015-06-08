/**
 *
 */
app.controller('homeController', function($rootScope, $scope, $http, $location, serviceHttp) {
	$rootScope.myToggleableDropdown = "";
	// $rootScope.toggle('myToggleableDropdown', 'on');

	$scope.users = [];
	serviceHttp.get("/webService/usersT", function(json) {
		//console.log(json.length);
		for (var i = 0; i < json.length; i++) {
			//console.log(json[i]);
			$scope.users.push(json[i]);
			//console.log("USER " + $scope.users[i].name)
		}
		
		// for (var i = 0; i < 1000	; i++) {
			// $scope.users.push(
				// {"user_id": "user "+i, "name": "user de "+ i, "email": "email"+i, "address": "adresa"+i, "idate": "sysdate"}
				// );
		// }
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

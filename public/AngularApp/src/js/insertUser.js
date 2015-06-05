app.controller('insertUserController', function($rootScope, $scope, $http, serviceHttp) {
	$scope.collapse = false;
	$scope.collapseEdit = false;
	$scope.errorShowU = false;
	
	var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var sysdate = day + "-" + month + "-" + year;
    console.log(sysdate);
	
	//Functions
	$scope.getUsers = function() {
		$scope.users = [];
		serviceHttp.get("/webService/usersT", function(json) {
			//console.log(json.length);
			for (var i = 0; i < json.length; i++) {
				console.log(json[i]);
				$scope.users.push(json[i]);
				//console.log("USER " + $scope.users[i].name)
			}
		});
	}
	$scope.getUsers();
	
	$scope.getMachines = function() {
		$scope.availableMachines = [];
		serviceHttp.get("/webService/machinesT", function(json) {
			console.log(json.length);
			for (var i = 0; i < json.length; i++) {
				console.log(json[i].user_id);
				if (json[i].user_id == undefined){
					$scope.availableMachines.push(json[i]);
				}
					

			}
		});
	}
	$scope.getMachines();
	
	$scope.insertUser = function() {

		console.log("insert user");
		console.log($scope.name, $scope.email, $scope.address, $scope.id_pacient)

		if ($scope.name == undefined || $scope.address == undefined) {
			console.log("undefined")
			$scope.errorShowU = true;
		} else {
			$scope.collapse = !$scope.collapse;
			$scope.errorShowU = false;
			serviceHttp.post("/webService/usersT", '{"user_id": "' + $scope.id_pacient + '", "name": "' + $scope.name + '", "email": "' + $scope.email + '", "address": "' + $scope.address + '", "idate": "'+ sysdate +'"}', function(json) {
				console.log(json);
				$scope.getUsers();
			})
		}
	}
	
	$scope.getMachineID = function(user_id){
		serviceHttp.get("/webService/machinesT/byID/" + user_id, function(json) {
			
			$scope.idMachineSelected = json.machine_id;
			//$scope.assignedMachine = json.machine_id;
			
		});
		
	}

	$scope.showEditUser = function(item) {
		console.log(item)
		$scope.collapseEdit = !$scope.collapseEdit;
		$scope.editModel = item;
		$scope.editModelBackup = item;
	}

	$scope.editUser = function() {
		console.log($scope.editModel);
		$scope.collapseEdit = !$scope.collapseEdit;
		serviceHttp.edit("/webService/usersT/" + $scope.editModel._id, '{"user_id": "' + $scope.editModel.user_id + '", "name": "' + $scope.editModel.name + '", "email": "' + $scope.editModel.email + '", "address": "' + $scope.editModel.address + '"}', function(json) {
			console.log(json);

		})
	}
	$scope.deleteUser = function() {
		$scope.collapseEdit = !$scope.collapseEdit;
		serviceHttp.deleteReq("/webService/usersT/" + $scope.editModel._id, function(json) {
			console.log(json);
			$scope.getUsers();
		})
	}
	
	$scope.assignMachine = function(){
		console.log($scope.assignedMachine);
		serviceHttp.edit("/webService/machinesT/" + $scope.assignedMachine._id, '{"machine_id": "' + $scope.assignedMachine.machine_id + '", "model": "' + $scope.assignedMachine.model + '", "user_id": "' + $scope.editModel.user_id + '"}', function(json) {
			console.log(json);
		})
	}
}); 
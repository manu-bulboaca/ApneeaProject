app.controller('insertMachineController', function($rootScope, $scope, $http, serviceHttp) {
	$scope.collapseM = false;

	$scope.getMachines = function() {
		$scope.machines = [];
		serviceHttp.get("/webService/machinesT", function(json) {
			console.log(json.length);
			for (var i = 0; i < json.length; i++) {
				console.log(json[i]);
				$scope.machines.push(json[i]);

			}
		});
	}
	$scope.getMachines();

	$scope.usersSelect = [];
	// $scope.usersSelect.push({name: "select user"});
	serviceHttp.get("/webService/usersT", function(json) {
		console.log(json.length);
		for (var i = 0; i < json.length; i++) {
			console.log(json[i]);
			$scope.usersSelect.push(json[i]);
			console.log("USER " + $scope.usersSelect[i].name)
		}
	});
	
	
	
	$scope.userSelected = "select an user";
	$scope.desc = "description";
	$scope.machine = "machine id"
	$scope.errorShowM = false;

	$scope.insertMachine = function() {

		console.log("insert machine");
		console.log($scope.machine_id);

		$scope.collapseM = !$scope.collapseM;
		$scope.errorShowM = false;
		serviceHttp.post("/webService/machinesT", '{"model": "' + $scope.model + '", "machine_id": "' + $scope.machine_id + '"}', function(json) {
			console.log(json)
		})
	}
	
	$scope.showEditMachine = function(item) {
		console.log(item)
		$scope.collapseEdit = !$scope.collapseEdit;
		$scope.editModel = item;
		$scope.editModelBackup = item;
	}

	$scope.editMachine = function() {
		console.log($scope.editModel);
		$scope.collapseEdit = !$scope.collapseEdit;
		serviceHttp.edit("/webService/machinesT/" + $scope.editModel._id, '{"machine_id": "' + $scope.editModel.machine_id + '", "model": "' + $scope.editModel.model + '"}', function(json) {
			console.log(json);

		})
	}
	$scope.deleteMachine = function() {
		$scope.collapseEdit = !$scope.collapseEdit;
		serviceHttp.deleteReq("/webService/machinesT/" + $scope.editModel._id, function(json) {
			console.log(json);
			$scope.getMachines();
		})
	}
	
	$scope.assignUser = function(){
		console.log($scope.userSelected);
		serviceHttp.edit("/webService/machinesT/" + $scope.editModel._id, '{"machine_id": "' + $scope.editModel.machine_id + '", "model": "' + $scope.editModel.model + '", "user_id": "' + $scope.userSelected.user_id + '"}', function(json) {
			console.log(json);
		})
	}
	
	
	
	// for (var i = 1; i <= 30; i++) {
// 
		// serviceHttp.post("/samples", '[{"id_machine": "m1","time": "' + "2015-03-" + i + '", "val": "' + "1" + '"}]', function(json) {
			// console.log(json)
		// })
	// }
	// for (var i = 1; i <= 20; i++) {
// 
		// serviceHttp.post("/samples", '[{"id_machine": "m1","time": "' + "2015-04-" + i + '", "val": "' + "1" + '"}]', function(json) {
			// console.log(json)
		// })
	// }
	// for (var i = 21; i <= 28; i++) {
// 
		// serviceHttp.post("/samples", '[{"id_machine": "m1","time": "' + "2015-04-" + i + '", "val": "' + "0" + '"}]', function(json) {
			// console.log(json)
		// })
	// }
	// for (var i = 1; i <= 14; i++) {
// 
		// serviceHttp.post("/samples", '[{"id_machine": "m1","time": "' + "2015-05-" + i + '", "val": "' + "1" + '"}]', function(json) {
			// console.log(json)
		// })
	// }
	// for (var i = 15; i < 17; i++) {
// 
		// serviceHttp.post("/samples", '[{"id_machine": "m1","time": "' + "2015-05-" + i + '", "val": "' + "0" + '"}]', function(json) {
			// console.log(json)
		// })
	// }
	
	
}); 
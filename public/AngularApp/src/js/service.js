/**
 *
 */

app.service('serviceHttp', function($http, $rootScope) {
	this.post = function(url, dataA, callback) {
		console.log(url)
		console.log(dataA)
		var req = {
			method : 'POST',
			url : url,

			data : dataA,
		}

		$http(req).success(function(data, status) {
			// console.log(data);
			// console.log(status);
			callback(data)
		}).error(function() {
			console.log("error on post - service Function")
		});
	}
	this.get = function(url, callback) {
		var req = {
			method : 'GET',
			url : url,
		}

		$http(req).success(function(data, status) {
			//console.log(data);
			//console.log(status);
			callback(data);
		}).error(function(data, status) {
			console.log(data);
			console.log(status);
			$rootScope.Ui.turnOn('modal1')
			console.log("error on get - service Function")
		});
	}

	this.deleteReq = function(url, callback) {
		var req = {
			method : 'DELETE',
			url : url
		}

		$http(req).success(function(data, status) {
			//console.log(data);
			//console.log(status);
			callback(data);
		}).error(function() {
			console.log("error on deleteReq - service Function")
		});
	}

	this.deleteCol = function(url, callback) {
		var req = {
			method : 'DELETE',
			url : url
		}

		$http(req).success(function(data, status) {
			//console.log(data);
			//console.log(status);
			callback(data);
		}).error(function() {
			console.log("error on deleteCol - service Function")
		});
	}

	this.edit = function(url, dataA, callback) {
		console.log(url)
		console.log(dataA)
		var req = {
			method : 'PUT',
			url : url,

			data : dataA,
		}

		$http(req).success(function(data, status) {
			// console.log(data);
			// console.log(status);
			callback(data)
		}).error(function() {
			console.log("error on PUT - service Function")
		});
	}
}); 
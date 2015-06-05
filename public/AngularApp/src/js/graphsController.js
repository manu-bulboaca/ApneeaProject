app.controller('graphsController', function($rootScope, $scope, $http, serviceHttp) {

	$scope.userSelected = "null";
	$scope.machineSelected = "null";
	$rootScope.usersSelect = [];
	// $rootScope.usersSelect.push({name: "select user"});
	serviceHttp.get("/webService/usersT", function(json) {
		//console.log(json.length);
		for (var i = 0; i < json.length; i++) {
			//console.log(json[i]);
			$rootScope.usersSelect.push(json[i]);
			//console.log("USER " + $rootScope.usersSelect[i].name)
		}
		$scope.userNameSelected = $scope.getUserNameById(userID)
	});
	$scope.getUserNameById = function(id) {
		console.log("getName ", $rootScope.usersSelect.length, $rootScope.usersSelect)
		for (var i = 0; i < $rootScope.usersSelect.length; i++) {
			console.log("getUserName", $rootScope.usersSelect[i].name)
			if ($rootScope.usersSelect[i].user_id == id) {
				return $rootScope.usersSelect[i].name;
			}
		}
		return "";
	}
	$scope.userClick = function() {
		//console.log($scope.userSelected)
		localStorage.setItem("userID", $scope.userSelected.user_id);
		$scope.userNameSelected = $scope.userSelected.name;

		localStorage.setItem("userSelName", $scope.userSelected.name);
		if ($scope.userSelected != "null") {

			serviceHttp.get("/webService/machinesT/byID/" + $scope.userSelected.user_id, function(json) {
				//console.log("click")
				//console.log(json);
				$scope.machineSelected = json;

				serviceHttp.get("/webService/getSamples/samples/" + $scope.machineSelected.machine_id, function(json) {
					//console.log(json);
					var array = [];
					array.push(['Date', 'Use']);
					for (var i = 0; i < json.length; i++) {
						array.push([json[i].time, json[i].val * 1]);
					}

					drawChart();
				})
			});
		}
	}
	if (localStorage.getItem("userID") != "") {

		var userID = localStorage.getItem("userID");
		//console.log(userID);

		//$scope.userNameSelected = localStorage.getItem("userName");

		$scope.userSelected = "null";

		serviceHttp.get("/webService/machinesT/byID/" + userID, function(json) {
			//console.log("click")
			//console.log(json);
			$scope.machineSelected = json;

			serviceHttp.get("/webService/getSamples/samples/" + $scope.machineSelected.machine_id, function(json) {
				//alert("OO")
				console.log(json);
				var array = [];
				array.push(['Date', 'Use']);
				for (var i = 0; i < json.length; i++) {
					array.push([json[i].time, json[i].val * 1]);
				}

				drawChart();
			})
		});
	}

	/////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////
	function drawChart() {

		var chartDataA = [];
		var pieDataA = [];
		var userID = localStorage.getItem("userID");
		var values = [];
		var testVal = [];
		$scope.userSelected = "null";

		serviceHttp.get("/webService/machinesT/byID/" + userID, function(json) {
			console.log(json.user_name);

			//console.length(json.length)

			$scope.machineSelected = json;

			serviceHttp.get("/webService/getSamples/samples/" + $scope.machineSelected.machine_id, function(json) {
				$rootScope.refreshAlerts();
				console.log(json);
				var used = 0;
				var unUsed = 0;
				var failUsed = 0;
				var string = "";
				var lineVar = 0;
				var len30;
				
				if (json.length < 30) {
					len30 = 0;
				} else {
					len30 = json.length - 30;
				}
				

				var previousVal = json[0].val;
				var startDate = new Date(json[0].time);
				var endDate = new Date(json[0].time);

				for (var i = len30; i < json.length; i++) {
					// chartDataA.push({
					// date : new Date(json[i].time),
					// visits : json[i].val * 1
					// });
					if (json[i].val == 1) {
						used++;
					}
					if (json[i].val == 0) {
						unUsed++;
					}
					if (json[i].val == -1) {
						failUsed++;
					}

					switch (json[i].val*1) {
					case 1:
						string = "Used";
						lineVar = 1;
						break;
					case 0:
						string = "Unused";
						lineVar = 0;
						break;
					case -1:
						string = "Used Wrong";
						lineVar = 0;
						break;
					}
					values.push([new Date(json[i].time), lineVar * 1, string])

					if (json[i].val != previousVal) {
						var endDate = new Date(json[i].time);
						testVal.push([string, startDate, endDate]);
						var previousVal = json[i].val;
						var startDate = new Date(json[i].time);

					}

				}
				$scope.timelineData = testVal;
				$rootScope.$broadcast('timelineFinish');
				$scope.line30Data = [{
					"key" : "Ussage",
					"values" : values
				}];
				$rootScope.usedWell30=used;
				$rootScope.unused30=unUsed;
				$rootScope.usedWrong30=failUsed;
				//$rootScope.pie30 = {"used": used, "unUsed": unUsed, "fail": failUsed}
				$rootScope.pieData30 = [{
					key : "Used",
					y : used
				}, {
					key : "Unused",
					y : unUsed
				}, {
					key : "Used Wrong",
					y : failUsed
				}];
				values = [];
				used = 0;
				unUsed = 0;
				failUsed = 0;
				string = "";
				lineVar = 0;
				for (var i = 0; i < json.length; i++) {
					chartDataA.push({
						date : new Date(json[i].time),
						visits : json[i].val * 1
					});
					if (json[i].val == 1) {
						used++;
					}
					if (json[i].val == 0) {
						unUsed++;
					}
					if (json[i].val == -1) {
						failUsed++;
					}

					switch (json[i].val*1) {
					case 1:
						string = "Used";
						lineVar = 1;
						break;
					case 0:
						string = "Unused";
						lineVar = 0;
						break;
					case -1:
						string = "Used Wrong";
						lineVar = 0;
						break;
					}
					values.push([new Date(json[i].time), lineVar * 1, string])
				}

				$scope.lineAllData = [{
					"key" : "Ussage",
					"values" : values
				}];

				//$rootScope.pie30 = {"used": used, "unUsed": unUsed, "fail": failUsed}
				$rootScope.pieDataAll = [{
					key : "Used",
					y : used
				}, {
					key : "Unused",
					y : unUsed
				}, {
					key : "Used Wrong",
					y : failUsed
				}];
				$rootScope.usedWellAll=used;
				$rootScope.unusedAll=unUsed;
				$rootScope.usedWrongAll=failUsed;

				$rootScope.chartData = chartDataA;

			});

		});

	}

});

app.controller('Pie30Ctrl', function($rootScope, $scope, $http, serviceHttp) {

	//console.log($rootScope.pie30)
	console.log("dataReady");

	$scope.xFunction = function() {
		return function(d) {
			return d.key;
		};
	}
	$scope.yFunction = function() {
		return function(d) {
			return d.y;
		};
	}
	console.log("PIE DATA")
	console.log($scope.pieData)
	$scope.toolTipContentFunction = function() {
		return function(key, x, y, e, graph) {
			return '<h3>' + key + ': ' + x + ' times</h3>';
		}
	}
	var colorArray = ['#7CD200', '#DE4940', '#EDEDB2'];
	$scope.colorFunction = function() {
		return function(d, i) {
			return colorArray[i];
		};
	}
	setTimeout(function() {
		$scope.$apply();
	}, 10);

});

app.controller('Line30Ctrl', function($rootScope, $scope, $http, serviceHttp) {
	$scope.variableWidthAll ='width: '+30*30+'px'
	console.log("START")

	drawChartG();

	function drawChartG() {
		var container = document.getElementById('timeline');
		var chart = new google.visualization.Timeline(container);
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn({ type: 'string', id: 'Role' });
		dataTable.addColumn({
			type : 'string',
			id : 'Status'
		});
		dataTable.addColumn({
			type : 'date',
			id : 'Start'
		});
		dataTable.addColumn({
			type : 'date',
			id : 'End'
		});
		var userID = localStorage.getItem("userID");
		console.log(userID)
		serviceHttp.get("/webService/machinesT/byID/" + userID, function(json) {
			$scope.machineSelected = json;
			console.log(json)
			serviceHttp.get("/webService/getSamples/samples/" + $scope.machineSelected.machine_id, function(json) {
				var string = "";
				var prevString ="";
				var lineVar = 0;
				var len30;
				
				if (json.length < 30) {
					len30 = 0;
				} else {
					len30 = json.length - 30;
				}
				
				var testVal = [];
				var previousVal = json[len30].val;
				var startDate = new Date(json[len30].time);
				var endDate = new Date(json[len30].time);
				switch (json[len30].val*1) {
					case 1:
						prevString = "Used";
						lineVar = 1;
						break;
					case 0:
						prevString = "Unused";
						lineVar = 0;
						break;
					case -1:
						prevString = "Used Wrong";
						lineVar = 0;
						break;
					}
				for (var i = len30; i < json.length; i++) {

					switch (json[i].val*1) {
					case 1:
						string = "Used";
						lineVar = 1;
						break;
					case 0:
						string = "Unused";
						lineVar = 0;
						break;
					case -1:
						string = "Used Wrong";
						lineVar = 0;
						break;
					}
					//values.push([new Date(json[i].time), lineVar * 1, string])
					
					if (json[i].val != previousVal) {
						var endDate = new Date(json[i].time);
						testVal.push(["Ussage",prevString, startDate, endDate]);
						var previousVal = json[i].val;
						var startDate = new Date(json[i].time);
						prevString = string;

					}
					
					if (i==json.length*1-1){
						var endDate = new Date(json[i].time);
						testVal.push(["Ussage",string, startDate, endDate]);
					}
					
				}
				$scope.timelineDataA = testVal;
				console.log("AICI")
				console.log($scope.timelineDataA);
				dataTable.addRows($scope.timelineDataA);

				//On one Row
				var options = {
					timeline : {
						
						groupByRowLabel: true
					},
					colors: ['#7CD200', '#DE4940', '#EDEDB2'],
				};

				chart.draw(dataTable, options);
			});
		});

		// dataTable.addRows([
		// [ 'Washington', new Date(1789, 3, 29), new Date(1797, 2, 3) ],
		// [ 'Adams',      new Date(1797, 2, 3),  new Date(1801, 2, 3) ],
		// [ 'Jefferson',  new Date(1801, 2, 3),  new Date(1809, 2, 3) ]]);

	}

});

app.controller('PieAllCtrl', function($rootScope, $scope, $http, serviceHttp) {

	//console.log($rootScope.pie30)
	console.log("dataReady");

	$scope.xFunction = function() {
		return function(d) {
			return d.key;
		};
	}
	$scope.yFunction = function() {
		return function(d) {
			return d.y;
		};
	}

	$scope.toolTipContentFunction = function() {
		return function(key, x, y, e, graph) {
			return '<h3>' + key + ': ' + x + ' times</h3>';
		}
	}
	var colorArray = ['#7CD200', '#DE4940', '#EDEDB2'];
	$scope.colorFunction = function() {
		return function(d, i) {
			return colorArray[i];
		};
	}
	setTimeout(function() {
		$scope.$apply();
	}, 10);

});

app.controller('LineAllCtrl', function($rootScope, $scope, $http, serviceHttp) {
	
	console.log("START")
	$scope.variableWidthAll ='width: '+1600+'px'
	drawChartG();

	function drawChartG() {
		var container = document.getElementById('timeline');
		var chart = new google.visualization.Timeline(container);
		var dataTable = new google.visualization.DataTable();
		dataTable.addColumn({ type: 'string', id: 'Role' });
		dataTable.addColumn({
			type : 'string',
			id : 'Status'
		});
		dataTable.addColumn({
			type : 'date',
			id : 'Start'
		});
		dataTable.addColumn({
			type : 'date',
			id : 'End'
		});
		var userID = localStorage.getItem("userID");
		console.log(userID)
		serviceHttp.get("/webService/machinesT/byID/" + userID, function(json) {
			$scope.machineSelected = json;
			console.log(json)
			serviceHttp.get("/webService/getSamples/samples/" + $scope.machineSelected.machine_id, function(json) {
				var string = "";
				var prevString ="";
				var lineVar = 0;
				var len30;
				console.log("AAAAAAAAAAAAAAAA")
				console.log(json.length-1);
				$scope.variableWidthAll ='width: '+json.length*20+'px'
				len30 = 0;
				
				
				var testVal = [];
				var previousVal = json[len30].val;
				var startDate = new Date(json[len30].time);
				var endDate = new Date(json[len30].time);
				switch (json[len30].val*1) {
					case 1:
						prevString = "Used";
						lineVar = 1;
						break;
					case 0:
						prevString = "Unused";
						lineVar = 0;
						break;
					case -1:
						prevString = "Used Wrong";
						lineVar = 0;
						break;
					}
				for (var i = 0; i < json.length; i++) {

					switch (json[i].val*1) {
					case 1:
						string = "Used";
						lineVar = 1;
						break;
					case 0:
						string = "Unused";
						lineVar = 0;
						break;
					case -1:
						string = "Used Wrong";
						lineVar = 0;
						break;
					}
					//values.push([new Date(json[i].time), lineVar * 1, string])
					
					if (json[i].val != previousVal) {
						var endDate = new Date(json[i].time);
						testVal.push(["Ussage",prevString, startDate, endDate]);
						var previousVal = json[i].val;
						var startDate = new Date(json[i].time);
						prevString = string;

					}
					
					if (i==json.length*1-1){
						var endDate = new Date(json[i].time);
						testVal.push(["Ussage",string, startDate, endDate]);
					}
					
				}
				$scope.timelineDataA = testVal;
				console.log("AICI p2")
				console.log($scope.timelineDataA);
				dataTable.addRows($scope.timelineDataA);

				//On one Row
				var options = {
					timeline : {
						
						groupByRowLabel: true
					},
					colors: ['#7CD200', '#DE4940', '#EDEDB2'],
				};

				chart.draw(dataTable, options);
			});
		});

		// dataTable.addRows([
		// [ 'Washington', new Date(1789, 3, 29), new Date(1797, 2, 3) ],
		// [ 'Adams',      new Date(1797, 2, 3),  new Date(1801, 2, 3) ],
		// [ 'Jefferson',  new Date(1801, 2, 3),  new Date(1809, 2, 3) ]]);

	}

});

app.controller('FullGraph', function($rootScope, $scope, $http, serviceHttp) {

	var chartData = generateChartData();
	var chart = AmCharts.makeChart("chartdiv", {
		"type" : "serial",
		"theme" : "light",
		"pathToImages" : "http://www.amcharts.com/lib/3/images/",
		"dataProvider" : chartData,
		"valueAxes" : [{
			"axisAlpha" : 0.2,
			"dashLength" : 1,
			"position" : "left"
		}],
		"mouseWheelZoomEnabled" : true,
		"graphs" : [{
			"id" : "g1",
			"balloonText" : "[[category]]<br/><b><span style='font-size:14px;'>value: [[value]]</span></b>",
			"bullet" : "round",
			"bulletBorderAlpha" : 1,
			"bulletColor" : "#FFFFFF",
			"hideBulletsCount" : 50,
			"title" : "red line",
			"valueField" : "visits",
			"useLineColorForBulletBorder" : true
		}],
		"chartScrollbar" : {
			"autoGridCount" : true,
			"graph" : "g1",
			"scrollbarHeight" : 40
		},
		"chartCursor" : {
			"cursorPosition" : "mouse"
		},
		"categoryField" : "date",
		"categoryAxis" : {
			"parseDates" : true,
			"axisColor" : "#DADADA",
			"dashLength" : 1,
			"minorGridEnabled" : true
		},
		"exportConfig" : {
			menuRight : '20px',
			menuBottom : '30px',
			menuItems : [{
				icon : 'http://www.amcharts.com/lib/3/images/export.png',
				format : 'png'
			}]
		}
	});
	chart.addListener("rendered", zoomChart);
	zoomChart();
	// this method is called when chart is first inited as we listen for "dataUpdated" event
	function zoomChart() {
		// different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
		chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
	}

	// generate some random data, quite different range
	function generateChartData() {
		var chartData = [];
		var firstDate = new Date();
		firstDate.setDate(firstDate.getDate() - 5);
		chartData = $rootScope.chartData;
		return chartData;

	}

});


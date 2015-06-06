var http        = require('http'),
express         = require('express'),
path            = require('path'),
MongoClient     = require('mongodb').MongoClient,
Server          = require('mongodb').Server,
CollectionDriver= require('./collectionDriver').CollectionDriver,
expressJwt      = require('express-jwt'),
jwt             = require('jsonwebtoken');

var secret = "securedAuth";

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.bodyParser());

// We are going to protect /api routes with JWT
app.use('/webService', expressJwt({secret: "securedAuth"}));

app.use(express.json());
app.use(express.urlencoded());

var mongoHost = 'localHost';
var mongoPort = 27017;
var collectionDriver;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
mongoClient.open(function(err, mongoClient) {
	if (!mongoClient) {
		console.error("Error! Exiting... Must start MongoDB first");
		process.exit(1);
	}
	var db = mongoClient.db("MyDatabase");
	collectionDriver = new CollectionDriver(db);
});

app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', function(req, res) {
// 	res.send('Hello World');
// });

app.get('/webService/:collection', function(req, res) {
	var params = req.params;
	collectionDriver.findAll(params.collection, function(error, objs) {
    if (error) {
      console.log("ERROR")
			res.send(400, error);
		}
		else {
			// if (req.accepts('html')) {
			//     res.render('data',{objects: objs, collection: req.params.collection}); 
			//    } else {
       res.set('Content-Type', 'application/json');
			res.send(200, objs);
			// }
		}
	});
});

// This is just for testing the samples without login
app.get('/:collection', function(req, res) {
  var params = req.params;
  collectionDriver.findAll(params.collection, function(error, objs) {
    if (error) {
      console.log("ERROR")
      res.send(400, error);
    }
    else {
      // if (req.accepts('html')) {
      //     res.render('data',{objects: objs, collection: req.params.collection}); 
      //    } else {
       res.set('Content-Type', 'application/json');
      res.send(200, objs);
      // }
    }
  });
});


app.get('/webService/:collection/:entity', function(req, res) {
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if (entity) {
		collectionDriver.get(collection, entity, function(error, objs) {
			if (error) {
				res.send(400, error);
			} else {
				res.send(200, objs);
			} 
		});
	} else {
		res.send(400, {
			error : 'bad url',
			url : req.url
		});
	}
});

//get Machine by ID (id given by doctor)
app.get('/webService/:collection/byID/:id', function(req, res) {
	var params = req.params;
	var id = params.id;
	var collection = params.collection;
	if (id) {
		//console.log(id);
    //console.log(collection);
		collectionDriver.getMachineByID(collection, id, function(error, objs) {
			if (error) {
				res.send(400, error);
			} else {
				res.send(200, objs);
			} 
		});
	} else {
		res.send(400, {
			error : 'bad url',
			url : req.url
		});
	}
});

//get Machine by ID (id given by doctor)
app.get('/webService/getSamples/:collection/:id', function(req, res) {
  var params = req.params;
  var id = params.id;
  var collection = params.collection;
  if (id) {
    //console.log(id);
    //console.log(collection);
    collectionDriver.getSamplesForId(collection, id, function(error, objs) {
      if (error) {
        res.send(400, error);
      } else {
        res.send(200, objs);
      } 
    });
  } else {
    res.send(400, {
      error : 'bad url',
      url : req.url
    });
  }
});

app.get('/sample/:mach/:val',function(req,res){
  var params = req.params;
  var machine = params.mach;
  var value = params.val;
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var sysdate = day + "-" + month + "-" + year;
  console.log("sample Called: "+machine+", "+value+", "+sysdate);
  var object = {"id_machine": machine, "value": value, "date": sysdate};
  collectionDriver.save("samples", object, function(err, docs) {
    if (err) {
      res.send(400, err);
    } else {
      res.send(201, docs);
    } 
  });

})
app.post('/samplePOST/:mach',function(req,res){
  var content = req.body;
  var params = req.params;
  var machine = params.mach;
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var sysdate = day + "-" + month + "-" + year;
  console.log("samplePOST Called: "+machine+", "+sysdate);
  var object = {"id_machine": machine, "value": content, "date": sysdate};
  collectionDriver.save("samples", object, function(err, docs) {
    if (err) {
      res.send(400, err);
    } else {
      console.log("Error on SamplePOST request");
      res.send(201, docs);
    } 
  });

})



app.post('/webService/:collection', function(req, res) {
  console.log(req.body)
	var object = req.body;
	var collection = req.params.collection;
	collectionDriver.save(collection, object, function(err, docs) {
		if (err) {
			res.send(400, err);
		} else {
			res.send(201, docs);
		} 
	});
});





//login
app.post('/authenticate', function (req, res) {
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401

  var username = req.body.username;
  var password = req.body.password;
  console.log(username,password)
  collectionDriver.getLoginDetails(username, function(err, object){
      console.log(object);
      if (object!=null){
        if (!(username === object.username && password === object.password)) {
          res.send(401, 'Wrong user or password');
          return;
        }
        
        // We are sending the profile inside the token
        var token = jwt.sign(object, secret, { expiresInMinutes: 60*5 });

        res.json({ token: token });
      } else {
        res.send(401, 'Wrong user or password');
        return;
      }
      
  });  
});

//signUp
app.post('/signUp', function(req, res) {
  console.log(req.body)
  var object = req.body;
  var collection = "usersApneea";
  var username = req.body.username;
  collectionDriver.getLoginDetails(username, function(err, object){
    if (object!= null){
      res.send(401, 'Username in use');
      return;
    }
    collectionDriver.save(collection, object, function(err, docs) {
      if (err) {
        res.send(400, err);
      } else {
        res.send(201, docs);
      } 
    });
  });
  
});


app.put('/webService/:collection/:entity', function(req, res) {
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
  console.log("PUT");
  console.log(entity);
  console.log(collection);
  console.log(req.body)
	if (entity) {
		collectionDriver.update(collection, req.body, entity, function(error, objs) {
			if (error) {
				res.send(400, error);
			} else {
				res.send(200, objs);
			} 
		});
	} else {
		var error = {
			"message" : "Cannot PUT a whole collection"
		}
		res.send(400, error);
	}
});

app.delete('/webService/:collection/:entity', function(req, res) {
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if (entity) {
		collectionDriver.delete(collection, entity, function(error, objs) {
      console.log("deleteRequest");
      console.log(error)
			if (error) {
				res.send(400, error);
			} else {
        
				res.send(200, true);
			} 
		});
	} else {
		var error = {
			"message" : "Cannot DELETE a whole collection"
		}
		res.send(400, error);
	}
});

app.delete('/webService/:collection', function(req, res) {
  var params = req.params;
  var collection = params.collection;
  if (collection) {
    collectionDriver.drop(collection, function(error, objs) {
      if (error) {
        res.send(400, error);
      } else {
        
        res.send(200, objs);
      } 
    });
  } else {
    var error = {
      "message" : "Cannot DELETE a whole collection"
    }
    res.send(400, error);
  }
});

app.use(function(req, res) {
	res.render('404', {
		url : req.url
	});
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});







//Time for calculating use of machines for each user
setInterval(calculateUsage, 86400000);
// 1 per day
setTimeout(calculateUsage, 3000);
var usersStat = [];
// user_id
// user_name
// used_right
// used_wrong
// unused
// last_30
// last_7

function calculateUsage() {
  collectionDriver.drop("alertsTST",function(error,objs){
      usersStat = [];
      collectionDriver.findAll("usersT", function(error, users) {
        if (error) {
          console.log("ERROR on usersTST function");
        } else {
          for (var i = 0; i < users.length; i++) {        
            calculateMachine(users[i].user_id,users[i].name);       
          }

          
        }
      });
    })
  }
function calculateMachine(userid,name){
  collectionDriver.getMachineByID("machinesT", userid.toString(), function(error, machine) {
    if (error) {
      console.log("ERROR on machine function");
    } else {

    //console.log(machine,error);
    if(machine){
      //console.log(machine.machine_id);
      collectionDriver.getSamplesForId("samples",machine.machine_id.toString(), function(error, sMachine) {
        if (error) {
          console.log("ERROR on specific machine function");
        } else {
          //console.log(userid);
          //console.log(sMachine);
          var used_right_s = 0;
          var used_wrong_s = 0;
          var unused_s = 0;

          var used_right_l30 = 0;
          var used_wrong_l30 = 0;
          var unused_l30 = 0;

          var used_right_l7 = 0;
          var used_wrong_l7 = 0;
          var unused_l7 = 0;

          var last30_s = 0;
          var last5_s = 0;
          if (sMachine && sMachine.length>0){
            //console.log("ALL: used:"+ used_right_s+" , wrong: "+used_wrong_s+" , unused: "+unused_s);
            for (var i=sMachine.length-1; i>sMachine.length-31;i--){
              switch (sMachine[i].val) {
                case "1":
                  used_right_l30++;
                  break;
                case "0":
                  unused_l30++;
                  break;
                case "-1":
                  used_wrong_l30++;
                  break;
              }
            }
            //console.log("L_30 : used:"+ used_right_l30+" , wrong: "+used_wrong_l30+" , unused: "+unused_l30);
            for (var i=sMachine.length-1; i>sMachine.length-8;i--){
              switch (sMachine[i].val) {
                case "1":
                  used_right_l7++;
                  break;
                case "0":
                  unused_l7++;
                  break;
                case "-1":
                  used_wrong_l7++;
                  break;
              }
            }
            //console.log("L_7 : used:"+ used_right_l7+" , wrong: "+used_wrong_l7+" , unused: "+unused_l7);

          }

          usersStat.push(
            {
              user_id:    userid, 
              user_name:  name, 
              // user_right: used_right_s, 
              // user_wrong: used_wrong_s, 
              // unused:     unused_s,
              last_30:    used_right_l30,
              last_7:     used_right_l7
            });

          if (used_right_l7 == 0){
            console.log("Patient: "+name+", hasn't used the machine for 7 days");
            var string = "Patient: "+name+", hasn't used the machine for 7 days";
            collectionDriver.save("alertsTST", [{"user_id": userid, "name": name, "message": string}], function(err, docs) {
              if (err) {
                console.log("error inserting into collection alertsTST")
              } else {
                //console.log("OK - inserting into collection alertsTST")
              }
            }); 
          } else if (used_right_l7<4){
            console.log("Patient: "+name+", hasn't used the machine only "+used_right_l7+" times in the last 7 days");
            var string = "Patient: "+name+", hasn't used the machine only "+used_right_l7+" times in the last 7 days";
            collectionDriver.save("alertsTST", [{"user_id": userid, "name": name, "message": string}], function(err, docs) {
              if (err) {
                console.log("error inserting into collection alertsTST")
              } else {
                //console.log("OK - inserting into collection alertsTST")
              }
            });
          } else if (used_right_l30 < 15){
            console.log("Patient: "+name+", hasn't used the machine only "+used_right_l30+" times in the last 30 days");
            var string = "Patient: "+name+", hasn't used the machine only "+used_right_l30+" times in the last 30 days";
            collectionDriver.save("alertsTST", [{"user_id": userid, "name": name, "message": string}], function(err, docs) {
              if (err) {
                console.log("error inserting into collection alertsTST")
              } else {
                //console.log("OK - inserting into collection alertsTST")
              }
            });
          }

        }
      });
    }
    
  } 
});
}


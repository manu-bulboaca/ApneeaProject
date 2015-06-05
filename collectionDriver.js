var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

//find all objects for a collection
CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { 
      if( error ) callback(error)
      else {
        the_collection.find().toArray(function(error, results) { 
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find a specific object
CollectionDriver.prototype.get = function(collectionName, id, callback) { 
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); 
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//get Username and Password
CollectionDriver.prototype.getLoginDetails = function(username, callback) { 
    this.getCollection("usersApneea", function(error, the_collection) {
        if (error) callback(error)
        else {
          console.log("getLoginDetails: for usern = "+username);
          the_collection.findOne({'username': username}, function(error,doc) {
              if (error) callback(error)
              else callback(null, doc);
            });
            
        }
    });
}

//getMachineByID
CollectionDriver.prototype.getMachineByID = function(collectionName, id, callback) { 
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
          //console.log("getMachineByID: for id = "+id);
          the_collection.findOne({'user_id':id}, function(error,doc) {
              if (error) callback(error)
              else callback(null, doc);
            });
            
        }
    });
}

//getSamplesForId
CollectionDriver.prototype.getSamplesForId = function(collectionName, id, callback) { 
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
          //console.log("getSamplesForId: for id = "+id);
          the_collection.find({'id_machine':id},{"sort" : [['date', 'asc']]}).toArray(function(error,doc) {
              if (error) callback(error)
              else callback(null, doc);
            });
            
        }
    });
}


//getLastRecord
CollectionDriver.prototype.getLastRecord = function(collectionName, callback) { 
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
          //console.log("getLastRecord: for "+collectionName);
          the_collection.findOne({}, {sort:{$natural:-1}}, function(error,doc) {
              if (error) callback(error)
              else callback(null, doc);
            });
            
        }
    });
}

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) { 
      if( error ) callback(error)
      else {
        obj.created_at = new Date(); 
        the_collection.insert(obj, function() { 
          callback(null, obj);
        });
      }
    });
};

//update a specific object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
	        obj._id = ObjectID(entityId); 
	        obj.updated_at = new Date(); 
            the_collection.save(obj, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}

//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { 
        if (error) callback(error)
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//drop collection
CollectionDriver.prototype.drop = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { 
        if (error) callback(error)
        else {
            the_collection.drop(function(error,doc) { 
              if (error) callback(error)
              else callback(null, doc);
            });
        }
    });
}

exports.CollectionDriver = CollectionDriver;
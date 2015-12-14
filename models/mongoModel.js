var mongoClient = require('mongodb').MongoClient;

var connection_string = '127.0.0.1:27017/headsup';

//mongoDB credentials
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

// Global variable of the connected database
var mongoDB; 

// Use connect method to connect to the MongoDB server
mongoClient.connect('mongodb://'+connection_string, function(err, db) {
  if (err) doError(err);
  console.log("Connected to MongoDB server at: "+connection_string);
  mongoDB = db; // Make reference to db globally available.
});

//********** CRUD Create -> Mongo insert ***************************************
exports.create = function(collection, data, callback) {
  // console.log("Collection: "+collection);
  // console.log("Db: "+mongoDB);

  mongoDB.collection(collection).insertOne(
    data,                     // the object to be inserted
    function(err, status) {   // callback upon completion
      if (err) doError(err);
      var success = (status.result.n == 1 ? true : false);
      callback(success);
    });
}

//********* CRUD Retrieve -> Mongo find ***************************************
exports.retrieve = function(collection, query, callback) {
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
    callback(docs);
  });
}

//********* CRUD Update -> Mongo updateMany ***********************************
exports.update = function(collection, filter, update, callback) {
  mongoDB
    .collection(collection)     // The collection to update
    .updateMany(                // Use updateOne to only update 1 document
      filter,                   // Filter selects which documents to update
      update,                   // The update operation
      {upsert:true},            // If document not found, insert one with this update
                                // Set upsert false (default) to not do insert
      function(err, status) {   // Callback upon error or success
        if (err) doError(err);
        callback('Modified '+ status.modifiedCount 
                 +' and added '+ status.upsertedCount+" documents");
        });
}

//********** CRUD Delete -> Mongo deleteOne or deleteMany **********************
exports.delete = function(collection, selector, callback){
  mongoDB
    .collection(collection)     // The collection to delete
    .removeMany(                
      selector, 
      function(err, status) {   // Callback upon error or success
        if (err) doError(err);
        callback(status.result.n);
        });  
}

var doError = function(e) {
        console.error("ERROR: " + e);
        //throw new Error(e);
    }

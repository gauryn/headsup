var mongoModel = require("../models/mongoModel.js")

exports.init = function(app) {
  // The collection parameter maps directly to the mongoDB collection
  app.put('/:collection', doCreate); // CRUD Create
  app.get('/:collection', doRetrieve); // CRUD Retrieve
  app.post('/:collection', doUpdate); // CRUD Update
  app.delete('/:collection', doDelete);//CRUD Delete
}

//********** CRUD Create *******************************************************
doCreate = function(req, res){
  //check if req.body has something to create
  if (Object.keys(req.body).length == 0) {
    res.send("No create message body found");
    return;
  }
  mongoModel.create ( req.params.collection, 
	                    req.body,
		                  function(result) {
  		                  var success = (result ? "Create successful" : "Create unsuccessful");
                        res.send(req.body);
	  	                  // res.render('message', {title: 'Mongo Demo', obj: success});
		                  });
};

//********** CRUD Retrieve (or Read) *******************************************
doRetrieve = function(req, res){
  mongoModel.retrieve(
    req.params.collection, 
    req.query,
		function(modelData) {
		  if (modelData.length) {
        res.send(modelData);
        //res.render('results',{title: 'Mongo Demo', obj: modelData});
      } else {
        var message = "No documents with "+JSON.stringify(req.query)+ 
                      " in collection "+req.params.collection+" found.";
        res.send(message);
        //res.render('message', {title: 'Mongo Demo', obj: message});
      }
		});
}

//********* CRUD Update *******************************************************
doUpdate = function(req, res){
  // if there is no filter to select documents to update, select all documents
  console.log("Find: "+req.body.find);
  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  console.log("Filter: "+filter);
  console.log("Update without parse: "+req.body.update);
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.send('No Update Operation Defined');
    //res.render('message', {title: 'Mongo Demo', obj: "No update operation defined"});
    return;
  }
  var update = JSON.parse(req.body.update);
  console.log("Update: "+update);
  mongoModel.update(  req.params.collection, filter, update,
		                  function(status) {
                        res.send(status);
              				  //res.render('message',{title: 'Mongo Demo', obj: status});
		                  });
}

//********** CRUD Delete *******************************************************
doDelete = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var selector = req.body.find ? JSON.parse(req.body.find) : {};
  mongoModel.delete(  req.params.collection, selector,
                      function(status) {
                        res.send("Deleted "+status.toString()+" records");
                        //res.render('message',{title: 'Mongo Demo', obj: status});
                      });
}


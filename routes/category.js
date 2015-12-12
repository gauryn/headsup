var c = require('../models/categories.js');

var category = {};

exports.init = function(app) {
  app.get("/category/:name?", getCategory);
  app.post("/category/:name/:cards", postCategory);
}

// Handle the getCategory route
getCategory = function(request, response) {
	var name = request.params.name;
	category = c.get(name);
	if(category.length==undefined){
		//single category selection
		response.send(category);
		//response.render('category', {'category': category});
	}
	else{
		//list all categories
		response.send(category);
	}
}

//Handle the postCategory route [add a new category]
postCategory = function(request, response){
	var name = request.params.name;
	var cards = request.params.cards;
	var addedCat = c.add(name, cards);
	response.send(addedCat);
}

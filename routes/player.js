var p = require('../models/players.js');

var player = "";

exports.init = function(app) {
  app.get("/player", getPlayer);
  app.post("/player/:playerName", postPlayer);
}

// Handle the getPlayer route
getPlayer = function(request, response) {
	player = p.get();
	response.render('player', {'player': player});
}

//Handle the ppstPlayer route [add a new category]
postPlayer = function(request, response){
	var name = request.params.playerName;
	var newPlayer = p.add(name);
	response.send(newPlayer);
}

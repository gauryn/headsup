var s = require('../models/scores.js');

var score = 0;

exports.init = function(app) {
  app.get("/score", getScore);
  app.get("/score/:cardStatus", updateScore);
}

// Handle the getScore route
getScore = function(request, response) {
	score = s.get();
	response.send(score.toString());
}

//Handle the putScore route [update score]
updateScore = function(request, response){
	var status = request.params.cardStatus;
	score = s.update(status);
	response.send(score.toString());
	//response.render('score', {'score': score, 'status': status});
}

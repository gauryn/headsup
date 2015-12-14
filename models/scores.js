var score = {

	scorePass: 0,
	scoreSuccess: 10,
	totalScore: 0,

	//update Score for current player based on pass/ success of card
	update: function(score){
		if(score=='pass'){ this.totalScore+=this.scorePass;}
		else if(score=='success'){this.totalScore+=this.scoreSuccess;}
		return this.totalScore;
	},

	//get current total score
	get: function(){
		return this.totalScore;
	}

}

module.exports = score;
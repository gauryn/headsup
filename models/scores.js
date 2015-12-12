var score = {

	scorePass: 0,
	scoreSuccess: 10,
	totalScore: 0,

	update: function(score){
		if(score=='pass'){ this.totalScore+=this.scorePass;}
		else if(score=='success'){this.totalScore+=this.scoreSuccess;}
		return this.totalScore;
	},

	get: function(){
		return this.totalScore;
	}

}

module.exports = score;
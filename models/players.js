var player = {

	playerName: "",

	//add new player
	add: function(name){
		playerName = name;
		return playerName;
	},

	//get current player
	get: function(){
		return playerName;
	}

}

module.exports = player;
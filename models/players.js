var player = {

	playerName: "",

	add: function(name){
		playerName = name;
		return playerName;
	},

	get: function(){
		return playerName;
	}

}

module.exports = player;
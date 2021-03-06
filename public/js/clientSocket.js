$(function() {});

var socket = io.connect('http://headsup-67328gauryn.rhcloud.com:8000');
//var socket = io.connect(); //for localhost

socket.on('connect', function(){

	//new session: game history
	window.sessionStorage.setItem('gameHistory', []);

	//new player joins game
	socket.on('players', function(data){
		console.log("Num of players: "+data.number);
	})

	// add new player
	$('#newPlayer').on('click tap', function(){
		var url = '/player/'+$('#newPlayerName').val();
		$.post(url, function(data){
			var msg = "Welcome "+data;
			$('#welcomePlayer').text(msg);
			socket.emit('newPlayer', {'playerName': data});
			return false;
		});
		return false;
	});

	// list all categories
	$('#getCategory').on('click tap', function(){
		var url = '/category/';
		$.get(url, function(data){
			var msg = "";
			for(var i=0; i<data.length; i++){
				msg+= (i+1)+". "+data[i].name+"<br>";
			};
			$('#listCategory').html("");
			$('#listCategory').append(msg);
			return false;
		});
		return false;
	});

	// select category
	$('#submitCategory').on('click tap', function(){
		var url = '/category/'+$('#selectCategory').val();
		$.get(url, function(data){
			var msg = "Category: "+data.name;
			$('#gameCategory').text(msg);
			socket.emit('selectCategory', {'category': data});
			//hide submit button
			$('#submitCategory').hide();
			//show game start
			$('#startGameBtn').show();
			return false;
		});
		return false;
	});

	// start game
	$('#startGameBtn').on('click tap', function(){
		socket.emit('startGame');
		//toggle buttons 
		$('#startGameBtn').hide();
		$('#countdownTimer').show();
		$('#cardPass').show();
		$('#cardSuccess').show();
		$('#endGameBtn').show();
		//game score info: update score display
		$('#scoreTracker').html("Score: 0");
		return false;
	});

	// game time info
	socket.on('timeRemaining', function(data){
		var min = data.min < 10 ? '0'+data.min : data.min;
		var sec = data.sec < 10 ? '0'+data.sec : data.sec;
		console.log("Remaining Time: "+min+":"+sec);
		$('#countdownTimer').html("");//clear previous times
		$('#countdownTimer').text("Remaining Time: "+min+":"+sec);
	});

	var index = 0; //initial card index in category

	// display card
	socket.on('cardDisplay', function(data){
		index = data.index;
		var title = data.category.cards[data.index];
		console.log("Card title: "+title);
		$('#cardTitle').html("");//clear old card
		$('#cardTitle').text(title);
	});

	//guess the card
	//desktop version: click. mobile version: tap
	$('#cardPass').on('click tap', function(){
		var status = 'pass';
		emitCardStatus(status);
	});
	$('#cardSuccess').on('click tap', function(){
		var status = 'success';
		emitCardStatus(status);
	});	
	function emitCardStatus(status){
		var url = '/score/'+status;
		console.log("Url: "+url);
		$.get(url, function(data){
			//update scores based on card status
			socket.emit('scoreStatus', {'totalScore': parseInt(data)});
			$('#scoreTracker').html("");
			$('#scoreTracker').text("Score: "+data);
		});
		socket.emit('cardStatus', {'index': index});
		return false;
	}

	//end game button
	$('#endGameBtn').on('click tap', function(){
		socket.emit('endGame');
	})
	
	//end game
	socket.on('gameOver', function(data){

		var msg = "";
		// multi-player mode: another player won ==> game over for all other players
		if( $('#newPlayerName').val() != data.playerName){
			msg+="Another player won. H a h a <br>";
		}
		// multi-player mode: current player won 
		else if ( $('#newPlayerName').val() == data.playerName){
			//session Storage: save game category & Scores for today if won
			var hist = window.sessionStorage.getItem('gameHistory');
			hist+= "Category: "+data.category.name+" | Score: "+data.totalScore+"\n";
			window.sessionStorage.setItem('gameHistory', hist);
		}
		console.log("Game Over");
		//hide pass, got it, card title buttons
		$('#cardPass').hide();
		$('#cardSuccess').hide();
		$('#cardTitle').hide();
		$('#endGameBtn').hide();
		$('#countdownTimer').hide();
		$('#gameOver').show();
		//top Scores updates: find high score for category in db and compare with total score in current game
		var url = "/topScores?category="+data.category.name;
		console.log("Url: "+url);
		$.get(url, function(response){
			//create new entry for category if no high score for given category exists
			if(response.length==0 && data.totalScore>0){
				$.ajax({
				  method: "PUT",
				  url: '/topScores',
				  data: 'category='+data.category.name+'&playerName='+data.playerName+'&score='+data.totalScore,
				  success: function(res){
					console.log("New High Score!");
					msg+= "New High Score<br>";
				  }
				})
			}
			//update DB with high Score for current cateogry if game total > high score in DB
			else if(response[0].score < data.totalScore){
				//update db with topScore
				var query = 'find={"category":"'+data.category.name+'"}&update={"$set":{"score":'+data.totalScore+', "playerName":"'+data.playerName+'"}}';
				$.ajax({
					method: "POST",
					url: '/topScores',
					data: query,
					success: function(res){
						console.log("New High Score for Category: "+data.category.name + "of "+data.totalScore);
						msg+="New High Score!<br>"
					}
				})
			}
			//high score > current game score. Hence, no updates to DB
			else if(response[0].score >= data.totalScore){
				msg+="Didn't beat current high score: "+response[0].score+"<br>";
			}

			//update game over details
			msg+= "Player Name: "+data.playerName+"<br>"+
			      "Category: "+data.category.name+"<br>"+
				  "Number Guessed: "+data.numRight+"<br>"+
				  "Number Missed: "+data.numWrong +"<br>";
			$('#gameOverDetails').html("");//clear old values
			$('#gameOverDetails').append(msg);

		})


	});

});
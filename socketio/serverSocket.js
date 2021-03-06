var timer = require('../models/countdownTimer.js');
var s = require('../models/scores.js');
var http = require('http');
var mr = require('../routes/dbRoutes.js');

exports.init = function(io){

	//number of players
	var currentPlayers = 0;

	//new connection is initiated
	io.sockets.on('connection', function (socket){
		++ currentPlayers; //increase number of players
		//let everyone know about players
		socket.emit('players', {number: currentPlayers});
		socket.broadcast.emit('players', {number: currentPlayers});

		//Game Details
		var category;
		var totalScore = 0;
		var playerName = "";
		var gameOver = false;
		var remainingTime;
		var duration;

		//1. get player name
		socket.on('newPlayer', function(data){
			playerName = data.playerName;
			console.log("Player Name: "+data.playerName);
		});

		//2. select category
		socket.on('selectCategory', function(data){
			category = data.category;
			console.log("Category: "+category.name);
		});

		//3. start game
		//start timer
		socket.on('startGame', function(){
			duration = 300000; //5 minutes for each round
			timer.startTimer(duration);
			//countdown timer
			countdown();
			//first card: 
			var i=0;
			socket.emit('cardDisplay', {'category': category, 'index': i});
		});
		//next cards
		socket.on('cardStatus', function(data){
			var i = data.index;
			if (remainingTime<duration && i<category.cards.length-1){
				//next card
				i++;
				socket.emit('cardDisplay', {'category': category, 'index': i});	
			}
			else{
				//reached end of all cards
				gameOver = true;
			}
		});
		//score tracker
		socket.on('scoreStatus', function(data){
			totalScore=data.totalScore;
			console.log("Total Score on server side: "+totalScore);
		})
		function countdown(){
			remainingTime = timer.getTime();
			//send time info to client
			socket.emit('timeRemaining', {'min': timer.parseTime(remainingTime)[0], 'sec': timer.parseTime(remainingTime)[1]});
			if(remainingTime>duration){gameOver=true;}
			if(gameOver==false){setTimeout(countdown, 1000);}
			else if(gameOver==true){endGame();}
		}

		//4. game over: called by timer
		//send player name, score, remaining time, number of correct/ wrong, time reamining
		//broadcast that to all players and stop all sessions
		socket.on('endGame', function(){
			gameOver = true;
			endGame();
		})

		function endGame(){
			//number of correct/ wrong
			numRight = totalScore/s.scoreSuccess;
			numWrong = category.cards.length - numRight;
			//pass all game details to client for views
			socket.emit('gameOver', {'playerName': playerName, 'totalScore': totalScore, 'numRight': numRight, 'numWrong': numWrong, 'category': category,  'remainingTime': remainingTime});
			socket.broadcast.emit('gameOver', {'playerName': playerName, 'totalScore': totalScore, 'numRight': numRight, 'numWrong': numWrong, 'category': category,  'remainingTime': remainingTime});
		}

		socket.on('disconnect', function(){
			--currentPlayers;
			socket.broadcast.emit('players', { number: currentPlayers});
		});
	})
}
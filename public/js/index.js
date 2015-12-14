$(document).ready(function(){
	// hide start game button initially
	$('#startGameBtn').hide();
	$('#cardPass').hide();
	$('#cardSuccess').hide();
	$('#gameOver').hide();
	$('#endGameBtn').hide();

	// game history for current session
	$('#gameSessionBtn').on('click tap', function(){
		var msg = window.sessionStorage.getItem('gameHistory')
		if(msg == ""){msg="No wins yet";}
		$('#gameSessionDetails').append(msg);
	})
});

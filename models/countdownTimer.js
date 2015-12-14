var timer = {

	start: null, 
	duration: 0, 
	diff: 0,

	//start countdown Timer for given duration
	startTimer: function(dur){
		start = Date.now();
		duration = dur;
		return start;
	},

	//get remaining time 
	getTime: function(){
		var timeElapsed = Date.now()-start;
		diff = (duration - timeElapsed)/1000;
		return diff;
	},

	//get remaining time in the format of mins and secs
	parseTime: function(time){
		var min = Math.floor(time/60);
		var sec = Math.floor(time % 60);
		return [min, sec];
	}
}

module.exports = timer;
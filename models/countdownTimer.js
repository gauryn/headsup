var timer = {

	start: null, 
	duration: 0, 
	diff: 0,

	startTimer: function(dur){
		start = Date.now();
		duration = dur;
		return start;
	},

	getTime: function(){
		var timeElapsed = Date.now()-start;
		diff = (duration - timeElapsed)/1000;
		return diff;
	},

	parseTime: function(time){
		var min = Math.floor(time/60);
		var sec = Math.floor(time % 60);
		return [min, sec];
	}
}

module.exports = timer;
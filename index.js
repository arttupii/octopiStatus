var OctoPrint = require('octo-client');


//OctoPrint.version(function(response) {                                 console.log(response); });
function secToMinHour(sec) {
    var hours = Math.floor(sec/3600);
    (hours >= 1) ? sec = sec - (hours*3600) : hours = '00';
    var min = Math.floor(sec/60);
    (min >= 1) ? sec = sec - (min*60) : min = '00';
    (sec < 1) ? sec='00' : void 0;

    (min.toString().length == 1) ? min = '0'+min : void 0;    
    (sec.toString().length == 1) ? sec = '0'+sec : void 0;    

    return hours+':'+min+":"+sec;
}

var line1 = "";
var line2 = "";
var line3 = "";
var line4 = "";

function jobStatus() {
	return new Promise(function(done){
		OctoPrint.job(function(response){    
			console.log("*********", response)
			console.log("***************");
			var printTime = secToMinHour(response.progress.printTime)||"---";
			var printTimeLeft = secToMinHour(response.progress.printTimeLeft)||"---";
			var state = response.state;
			
			line1 = response.job.file.name;
			line2 = state;
			line3 = printTime + "/" + printTimeLeft;
			done();
		});
	});
}
function printerState() {
	return new Promise(function(done){
		OctoPrint.printerState(function(response){
		  line4 = response.temperature.bed.actual + response.temperature.bed.target+"C" + " " +response.temperature.tool0.actual + response.temperature.tool0.target+"C";
		  done();
		});
	});
}

jobStatus()
.then(printerState)
.then(function(){
	console.info(line1);
	console.info(line2);
	console.info(line3);
	console.info(line4);
	
});
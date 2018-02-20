var OIPJS = require('oip-js');

var PinWizard = require('./PinWizard.js');

var config = require('./config.js');

var UpdatePins = function(){
	var wiz = new PinWizard(OIPJS, config);

	wiz.updateClusterPins(function(overallPins, totalPinned, newPins, unableToPins){
		console.log("Pinned " + totalPinned + "/" + overallPins + " | " + newPins + " new Pins | Unable to pin " + unableToPins);
	}, function(error){
		console.error(error);
	});
}

var PinIntervalMinutes = 30;
const SECONDS = 60
const MILISECONDS = 1000

var PinInterval = setInterval(UpdatePins, PinIntervalMinutes * SECONDS * MILISECONDS);

// Run on startup as well.
UpdatePins();
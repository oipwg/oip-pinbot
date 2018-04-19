var config = require('./config.js');

var OIPJS = require('oip-js').OIPJS({
	artifactFilters: [function(artifact){
		for (var i = 0; i < config.supported_types.length; i++){
			if (artifact.getType() === config.supported_types[i] && artifact.getNetwork() === "IPFS"){
				return true;
			}
		}
		return false;
	}]
});

var PinWizard = require('./PinWizard.js');

var UpdatePins = function(){
	var wiz = new PinWizard(OIPJS, config);

	wiz.updateClusterPins(function(overallPins, totalPinned, newPins, unableToPins){
		console.log("Pinned " + totalPinned + "/" + overallPins + " | " + newPins + " new Pins | Unable to pin " + unableToPins);
	}, function(error){
		// console.error(error);
	});
}

var PinIntervalMinutes = 30;
const SECONDS = 60
const MILISECONDS = 1000

var PinInterval = setInterval(UpdatePins, PinIntervalMinutes * SECONDS * MILISECONDS);

// Run on startup as well.
UpdatePins();
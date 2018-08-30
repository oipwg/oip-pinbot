import PinWizard from './PinWizard'
import config from '../config.json'

var UpdatePins = async () => {
	var wiz = new PinWizard(config);

	try {
		let res = await wiz.updateClusterPins()

		console.log("Pinned " + res.totalPinned + "/" + res.total_locations + " | " + res.newPins + " new Pins | Unable to pin " + res.unableToPin);
	} catch (e) {
		console.log("Unable to update Cluster Pins! \n" + e)
	}
}

var PinIntervalMinutes = config.pin_interval_minutes || 30;

const SECONDS = 60
const MILISECONDS = 1000

var PinInterval = setInterval(UpdatePins, PinIntervalMinutes * SECONDS * MILISECONDS);

// Run on startup as well.
UpdatePins();
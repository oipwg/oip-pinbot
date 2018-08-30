"use strict";

var _PinWizard = _interopRequireDefault(require("./PinWizard"));

var _config = _interopRequireDefault(require("../config.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UpdatePins = async () => {
  var wiz = new _PinWizard.default(_config.default);

  try {
    let res = await wiz.updateClusterPins();
    console.log("Pinned " + res.totalPinned + "/" + res.total_locations + " | " + res.newPins + " new Pins | Unable to pin " + res.unableToPin);
  } catch (e) {
    console.log("Unable to update Cluster Pins! \n" + e);
  }
};

var PinIntervalMinutes = _config.default.pin_interval_minutes || 30;
const SECONDS = 60;
const MILISECONDS = 1000;
var PinInterval = setInterval(UpdatePins, PinIntervalMinutes * SECONDS * MILISECONDS); // Run on startup as well.

UpdatePins();
"use strict";

require("core-js/modules/web.dom.iterable");

var _oipIndex = require("oip-index");

var _ipfsApi = _interopRequireDefault(require("ipfs-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PinWizard {
  constructor(config) {
    if (!config || !config.ipfs || !config.ipfs.host || !config.ipfs.port) throw new Error("IPFS Config Details are required! Please make sure you are setting the config.ipfs variable, the config.ipfs.host, and the config.ipfs.port settings.");
    this.config_ = config;
    this.ipfs_api = (0, _ipfsApi.default)(this.config_.ipfs);
    let index_config;
    if (this.config_.OIPdURL) index_config = {
      OIPdURL: this.config_.OIPdURL
    };
    this.index_ = new _oipIndex.Index(index_config);
  }

  async getAllIPFSLocations() {
    let artifacts;

    try {
      artifacts = await this.index_.getArtifacts(this.config_.type, undefined, undefined, "*");
    } catch (e) {
      throw new Error("Unable to get all Artifacts! \n" + e);
    }

    var IPFSHashes = [];

    for (var artifact of artifacts) {
      var hash = artifact.getLocation();
      if (IPFSHashes.indexOf(hash) === -1) IPFSHashes.push(hash);
    }

    return IPFSHashes;
  }

  async updateClusterPins() {
    let unpinned_locations, locations;

    try {
      let response = await this.getUnpinned();
      unpinned_locations = response.unpinned;
      locations = response.locations;
    } catch (e) {
      throw new Error("Unable to get Unpinned Locations \n" + e);
    }

    var totalPinned = locations.length - unpinned_locations.length,
        newPins = 0,
        unableToPin = 0;
    let pin_promises = [];

    for (var location of unpinned_locations) {
      var prom = this.ipfs_api.pin.add(location); // This will only be called for any rejections AFTER the first one,
      // please take a look at the comment below for more info.

      prom.catch(e => {
        unableToPin++;
      });
      pin_promises.push(prom);
    }

    let promiseResponses = [];

    try {
      promiseResponses = await Promise.all(pin_promises);
    } catch (e) {
      // This will still be called even though we use prom.catch() above.
      // The first promise rejection will be caught here, all other promises
      // that reject AFTER the first, will be caught in the above prom.catch() function.
      // throw new Error("Unable to pin locations \n" + e)
      unableToPin++;
    }

    for (let pin_response of promiseResponses) {
      newPins++;
    }

    return {
      total_locations: locations.length,
      totalPinned: totalPinned + newPins,
      newPins,
      unableToPin
    };
  }

  async getUnpinned() {
    let locations;

    try {
      locations = await this.getAllIPFSLocations();
    } catch (e) {
      throw new Error("Unable to get IPFS Locations \n" + e);
    }

    let pinset;

    try {
      pinset = await this.ipfs_api.pin.ls();
    } catch (e) {
      throw new Error("Unable to get pin list from IPFS server! " + JSON.stringify(this.config_.ipfs) + "\n" + e);
    }

    var pinnedLocs = [];

    for (var pin of pinset) {
      pinnedLocs.push(pin.hash);
    }

    var unpinned = [];

    for (var loc of locations) {
      if (pinnedLocs.indexOf(loc) === -1) unpinned.push(loc);
    }

    return {
      unpinned,
      locations
    };
  }

}

module.exports = PinWizard;
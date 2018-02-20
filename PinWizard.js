module.exports =
class PinWizard {
	constructor(OIPJS, config) {
		this.OIPJS_ = OIPJS
		this.config_ = config
	}

	updateClusterPins(onSuccess, onError) {
		var _this = this;
		this.getAllIPFSLocations(function(locations){
			_this.getUnpinned(locations, function(unpinned){
				var totalPinned = locations.length - unpinned.length, newPins = 0, unableToPin = 0;

				var tryFinish = function(successful){
					if (successful)
						newPins++;
					else
						unableToPin++;

					if (totalPinned + newPins + unableToPin === locations.length)
						onSuccess(locations.length, totalPinned + newPins, newPins, unableToPin);
				}

				for (var loc of unpinned){
					_this.OIPJS_.Network.ipfsAPIPin(loc, function(err, info){
						if (err){
							console.error(err);
							tryFinish(false);
						} else {
							tryFinish(true);
						}
					})
				}

				if (unpinned.length === 0)
					onSuccess(locations.length, totalPinned, newPins, unableToPin);
			}, onError)
		}, onError)
	}

	getUnpinned(locations, onSuccess, onError){
		this.OIPJS_.Network.ipfsClusterAPI.pin.ls(function(err, pinset){
			if (err){
				onError(err);
			} else {
				var pinnedLocs = [];

				for (var pin of pinset){
					pinnedLocs.push(pin.hash);
				}

				var unpinned = [];

				for (var loc of locations){
					if (pinnedLocs.indexOf(loc) === -1)
						unpinned.push(loc);
				}

				onSuccess(unpinned);
			}
		})
	}

	getAllIPFSLocations(onSuccess, onError){
		var _this = this;

		this.OIPJS_.Index.getSupportedArtifacts(function(artifacts){
			var IPFSHashes = [];

			for (var artifact of artifacts){
				// Check if the artifact is the same type as a supported type.
				if (_this.config_.supported_types.indexOf(_this.OIPJS_.Artifact.getType(artifact)) !== -1){
					var hash = _this.OIPJS_.Artifact.getLocation(artifact);

					if (IPFSHashes.indexOf(hash) === -1)
						IPFSHashes.push(hash)
				}
			}

			onSuccess(IPFSHashes)
		}, onError)
	}
}
import PinWizard from '../src/PinWizard'

let config = {
	type: "Video",
	ipfs: {
		host: "ipfs-one.alexandria.io",
		port: 9095,
		protocol: "http"
	}
}

it("Should get all locations", async (done) => {
	let wiz = new PinWizard(config)

	let locations = await wiz.getAllIPFSLocations()

	console.log("Total Locations: " + locations.length)

	expect(locations.length).toBeGreaterThan(1)

	done()
}, 100000)

it("Should get unpinned locations", async (done) => {
	let wiz = new PinWizard(config)

	let res = await wiz.getUnpinned()

	console.log("Total Unpinned: " + res.unpinned.length)

	expect(res.unpinned.length).toBeDefined()

	done()
}, 100000)

it("Should pin unpinned locations", async (done) => {
	let wiz = new PinWizard(config)

	let res = await wiz.updateClusterPins()

	console.log("Total Now Pinned: " + JSON.stringify(res))

	expect(res.totalPinned).toBeGreaterThan(1)

	done()
}, 100000)


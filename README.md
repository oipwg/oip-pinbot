[![](https://travis-ci.org/oipwg/oip-pinbot.svg?branch=master)](https://travis-ci.org/oipwg/oip-pinbot)
[![](https://img.shields.io/npm/v/oip-pinbot.svg)](https://www.npmjs.com/package/oip-pinbot)
# OIP Pinbot
Pinbot is a simple application that will pin the IPFS locations of selected Artifacts to a desired IPFS Cluster. It is configurable to only pin specific Artifact types/subtypes.

## Getting Started
In order to get your own Pinbot node running, please follow the instructions below.

Step 1. Clone the repository to a local folder on your machine using the following command
```bash
git clone https://github.com/oipwg/oip-pinbot
```

Step 2. Update the `config.json` file with your desired config values.

Step 3. Startup the service using
```bash
npm start
```

## Config
There are multiple configuration options available, they are as follows.

`ipfs`: An object that contains information about the IPFS node you wish to connect to.
`ipfs.host`: The Hostname of the IPFS Cluster you wish to connect to (i.e. `gateway.ipfs.io`)
`ipfs.port`: The Port of the IPFS Cluster you wish to connect to (i.e. `9095`)
`ipfs.protocol`: The Protocol over which to request. (i.e. `http` or `https`)

`type`: The Type of Artifacts you wish to Pin. All others will be filtered out. If no type is provided, then PinBot will get all Types of Artifacts.
`subtype`: The Subtype of Artifacts you wish to Pin. All others will be filtered out. If no subtype is provided, then PinBot will get all Subtypes of Artifacts.
`pin_interval_minutes`: The interval (in minutes) that you wish to attempt new pins
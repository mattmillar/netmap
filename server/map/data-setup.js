// Data setup script

// Define data variables

// a host is defined as a pair consisting of
//   * hostid -- an integer
//   * loc    -- a lat-lon pair representing the host's location

// Example definition (will be overwritten)
var hosts = [
	{ hostid: 1, loc: {lat: 37.4225, lon: -122.1653}     },
	{ hostid: 0, loc: {lat: 34.068829, lon: -118.442648} }
];

// links is an array of ARPANET links.  Each link is itself represented as an array of lat-lon pairs---the coordinates of each interface on the link.

// Example definition (will be overwritten)
var links = [
	{
		pointA: {lat: 37.4225, lon: -122.1653},
		pointB: {lat: 34.068829, lon: -118.442648}
	}
];

USE NetworkDB;

-- Hosts {{{

INSERT INTO Hosts (fullname, shortname, lat, lon, description) VALUES (
	"University of California, Los Angeles",
	"UCLA",
	34.068727,
	-118.442630,
	"Second campus in the UC system and first host on the ARPANET, started at 3420 Boelter Hall"
);
INSERT INTO Hosts (fullname, shortname, lat, lon, description) VALUES (
	"Stanford Research Institute",
	"SRI",
	37.456601,
	-122.175307,
	"Established by the trustees of Stanford University, SRI recieved the first ARPANET message (\"LO\")"
);
INSERT INTO Hosts (fullname, shortname, lat, lon) VALUES (
	"University of California, Santa Barbara",
	"UCSB",
	34.414132,
	-119.846508
);
INSERT INTO Hosts (fullname, shortname, lat, lon) VALUES (
	"University of Utah",
	"Utah",
	40.764982,
	-111.848912
);

-- }}}
-- People {{{

INSERT INTO People (name, bio) VALUES (
	"Leonard Kleinrock",
	"Developed a theory of packet networks and played an important role in launching the ARPANET, among other honors"
);

INSERT INTO People (name, bio) VALUES (
	"Charlie Kline",
	"First packets sent by Charley Kline at UCLA as he tried logging into SRI, among other honors"
);

INSERT INTO People (name, bio) VALUES (
	"Vinton Cerf",
	"DARPA & TCP/IP program manager, among other honors"
);

INSERT INTO People (name, bio) VALUES (
	"Jon Postel",
	"Editor of RFC series and administrator of IANA, among other honors"
);

INSERT INTO People (name, bio) VALUES (
	"Steve Crocker",
	"Inventer of the Request for Comment series and auther of the first RFC"
);

-- }}}
-- Networks {{{

INSERT INTO Networks (name, description) VALUES ("ARPANET", "Network for DARPA.  Origin of Internet.");

-- }}}
-- HostAppearances {{{

INSERT INTO HostAppearances (host, network, starttime, endtime) VALUES (
	1, # UCLA
	1, # ARPANET
	'1969-10-29 22:30:00',
	NULL
);

INSERT INTO HostAppearances (host, network, starttime, endtime) VALUES (
	2, # SRI
	1, # ARPANET
	'1969-10-29 22:30:00',
	NULL
);

INSERT INTO HostAppearances (host, network, starttime, endtime) VALUES (
	3, # UCSB
	1, # ARPANET
	'1969-11-01 00:00:00',
	NULL
);

INSERT INTO HostAppearances (host, network, starttime, endtime) VALUES (
	4, # Utah
	1, # ARPANET
	'1969-12-01 00:00:00',
	NULL
);

-- }}}
-- LinkAppearances {{{

INSERT INTO LinkAppearances (hostA, hostB, network, starttime)
VALUES (1, 2, 1, '1969-10-29 22:30:00');

INSERT INTO LinkAppearances (hostA, hostB, network, starttime)
VALUES (1, 3, 1, '1969-11-01 00:00:00');

INSERT INTO LinkAppearances (hostA, hostB, network, starttime)
VALUES (2, 3, 1, '1969-11-01 00:00:00');

INSERT INTO LinkAppearances (hostA, hostB, network, starttime)
VALUES (2, 4, 1, '1969-12-01 00:00:00');

-- }}}

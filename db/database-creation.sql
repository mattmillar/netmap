DROP DATABASE IF EXISTS NetworkDB;
CREATE DATABASE IF NOT EXISTS NetworkDB CHARACTER SET utf8;
USE NetworkDB;


DROP TABLE IF EXISTS Hosts;
CREATE TABLE IF NOT EXISTS Hosts (
	hostid INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
		-- MySQL should automatically create a B-tree for primary keys
	fullname VARCHAR(128) UNIQUE,
	shortname VARCHAR(16),
	lat DECIMAL(9, 6),
	lon DECIMAL(9, 6),
	description TEXT
);

CREATE INDEX HostsFullnameIdx ON Hosts(fullname) USING BTREE; -- for use with ORDER BY statement

DROP TABLE IF EXISTS People;
CREATE TABLE IF NOT EXISTS People (
	personid INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128),
	bio TEXT
);

DROP TABLE IF EXISTS Networks;
CREATE TABLE IF NOT EXISTS Networks (
	networkid INT UNIQUE NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(128),
	description TEXT
);
	
DROP TABLE IF EXISTS HostAppearances;
-- this table represents "appearances" of hosts on the various networks
-- (i.e., thereby allowing support for situations where a host goes online,
-- then disappears for some time, then comes back online, or situations
-- where a host changes networks)
CREATE TABLE IF NOT EXISTS HostAppearances (
	host INT, -- the host that appeared
	network INT, -- the network this host appeared on
	starttime DATETIME,
	starttimedelta INT, -- historical accuracy of the start time (in seconds)
	endtime DATETIME,
	endtimedelta INT, -- historical accuracy of the end time (in seconds)
	FOREIGN KEY (host) REFERENCES Hosts(hostid),
	FOREIGN KEY (network) REFERENCES Networks(networkid)

);

DROP TABLE IF EXISTS LinkAppearances;
-- this table operates under the same idea as the HostAppearances table,
-- but for "appearances" of links (the edges of the network graph)
CREATE TABLE IF NOT EXISTS LinkAppearances (
	hostA INT, -- host on the link
	hostB INT, -- the other host on the link
	network INT, -- the network this link belongs to
	starttime DATETIME,
	starttimedelta INT, -- historical accuracy of the start time (in seconds)
	endtime DATETIME,
	endtimedelta INT, -- historical accuracy of the end time (in seconds)
	FOREIGN KEY (hostA) REFERENCES Hosts(hostid),
	FOREIGN KEY (hostB) REFERENCES Hosts(hostid),
	FOREIGN KEY (network) REFERENCES Networks(networkid)
);

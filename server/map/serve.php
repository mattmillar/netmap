<?php

require_once("db-utils.php");

// error_reporting(E_ERROR | E_PARSE);

// takes a database connection and a mysql-format datetime string
function get_hosts_by_datetime ($db, $datetime) { // {{{
	return try_query($db, 'SELECT DISTINCT Hosts.hostid, Hosts.lat, Hosts.lon, Hosts.shortname, HostAppearances.network FROM Hosts INNER JOIN HostAppearances ON (Hosts.hostid = HostAppearances.host) WHERE starttime <= \'' . $datetime . '\' AND (\'' . $datetime . '\' <= endtime OR endtime IS NULL);');
} // }}}

// given a hostid in string format, query the database for all data about the corresponding host
function get_host_info ($db, $hostid_str) { // {{{
	$arr = try_query($db, 'SELECT * FROM Hosts WHERE hostid = ' . $hostid_str . ';');

	// there WILL be one and only one element in the array that's returned
	// (if there isn't one and only one element, then something has gone horribly
	// wrong with the database)
	return $arr[0];
} // }}}

// takes a database connection and a mysql-format datetime string
function get_links_by_datetime ($db, $datetime) { // {{{
	return try_query($db, 'SELECT DISTINCT AHosts.lat AS latA, AHosts.lon AS lonA, BHosts.lat AS latB, BHosts.lon AS lonB, LinkAppearances.network FROM Hosts AS AHosts INNER JOIN LinkAppearances INNER JOIN Hosts AS BHosts ON (AHosts.hostid = LinkAppearances.hostA AND BHosts.hostid = LinkAppearances.hostB) WHERE starttime <= \'' . $datetime . '\' AND (\'' . $datetime . '\' <= endtime OR endtime IS NULL);');
} // }}}

$db = db_connect();

$to_return = Array();

if ($_GET['query'] === "hosts") {
	$to_return = get_hosts_by_datetime($db, parse_datetime($_GET['datetime']));
} else if ($_GET['query'] === "host-info") {
	$to_return = get_host_info($db, parse_hostid($_GET['hostid']));
} else if ($_GET['query'] === "links") {
	$to_return = get_links_by_datetime($db, parse_datetime($_GET['datetime']));
} else {
	die("You must specify a query.");
}

echo json_encode($to_return);

mysqli_close($db);

?>

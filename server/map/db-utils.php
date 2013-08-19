<?php

// parse an datetime string (assumed to be an HTTP GET parameter)
// in YYYY-MM-DD-HH-MM-SS format,
// determine if it's syntactically valid, and convert it to
// a proper MySQL-compliant ``datetime'' string
function parse_datetime ($datetime) { // {{{
	if (! $datetime) {
		die("Please specify a datetime.");
	}

	if (! preg_match("/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/", $datetime)) {
		die("Invalid datetime format.  Please use YYYY-MM-DD-HH-MM-SS.");
	}
	// target date is sane; can now convert it to MySQL format
	$datetime[10] = " ";
	$datetime[13] = ":";
	$datetime[16] = ":";

	return $datetime;
} // }}}

// parse a hostid string
// determine if it's syntactically valid
function parse_hostid ($hostid_str) { // {{{
	if (! $hostid_str) {
		die("Please specify a hostid.");
	}

	if (! preg_match("/^\d+$/", $hostid_str)) {
		die("Invalid hostid format.  Please use a positive integer.");
	}

	return $hostid_str;
} // }}}

// connect to our database
// return the connection object
function db_connect() { // {{{
	$db_con = mysqli_connect("127.0.0.1", "root", "", "NetworkDB");
	if (mysqli_connect_errno($db_con)) {
		echo "Error: failed to connect to MySQL database: " . mysqli_connect_error();
		die();
	}

	return $db_con;
} // }}}

// attempt to execute a query on a given mysql db connection, returning the
// result if everything went okay and dying otherwise
// this function returns the result as a list of hashes
function try_query($db_con, $query) { // {{{
	$query_result = mysqli_query($db_con, $query);
	if ($query_result == false) {
		die("The following query failed for some reason:<br><pre style=\" margin-left: 2em; white-space: pre-wrap;\">$query</pre>");
	}

	$result_array = Array();
	while ($result_row = mysqli_fetch_array($query_result, MYSQLI_ASSOC)) {
		$result_array[] = $result_row;
	}

	return $result_array;
} // }}}

?>

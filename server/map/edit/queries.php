<?php

require_once("../db-utils.php");

// this function returns a list of hashes
// each hash represents a host (contains the host's fullname and hostid)
// the hosts are ordered alphabetically
function get_host_fullnames ($db) {
	$query = "SELECT hostid, fullname FROM Hosts ORDER BY fullname;";
	return try_query($db, $query);
}

?>

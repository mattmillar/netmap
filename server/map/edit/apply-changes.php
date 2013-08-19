<?php

require_once("../db-utils.php");

/* FIXME
     For some reason, PHP fails to read any data I send over HTTP GET
     so I am using GET even though it's not conventional...
*/

$db = db_connect();

if ($_GET["type"] === "host") {
	$stmt = $db->prepare("UPDATE Hosts SET fullname = ?, shortname = ?, lat = ?, lon = ?, description = ? WHERE hostid = ?");

	$stmt->bind_param('ssddsi', $_GET["fullname"], $_GET["shortname"], $_GET["lat"], $_GET["lon"], stripcslashes($_GET["description"]), $_GET["hostid"]);

	$res = $stmt->execute();
	if ($res == false) {
		die("The following query failed for some reason:<br><pre style=\" margin-left: 2em; white-space: pre-wrap;\">$query</pre>");
	} else {
		echo "OK";
	}
} else {
	die("You must select a type of change to apply.");
}

mysqli_close($db);

?>

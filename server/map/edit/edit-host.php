<?php

require_once("../db-utils.php");
require_once("queries.php");

$db = db_connect();

/*
	This script will do either one of two things depending on what HTTP GET
	variables it is supplied with.

	If it is supplied with a "hostid", it will attempt to find the host with
	the given ID and allow the user to edit that host.

	If it is supplied with a "new-fullname", it will create a new host with
	the given fullname and then allow the user to edit it.
*/

$host = Array();

if ($_GET["new-fullname"] != "") {
	try {
		$db->autocommit(false);
		$new_hostid_arr = try_query($db, "SELECT MAX(hostid) FROM Hosts;");
		$host["hostid"] = $new_hostid_arr[0]["MAX(hostid)"] + 1;

		$stmt = $db->prepare("INSERT INTO Hosts (hostid, fullname) VALUES (?, ?);");
		$stmt->bind_param('is', $host["hostid"], $_GET["new-fullname"]);
		$stmt->execute();
		$db->commit();
		$db->autocommit(true);
	} catch (Exception $e) {
		$db->rollback();
	}
	
	$host["fullname"] = $_GET["new-fullname"];
} else if ($_GET["hostid"] != "") {
	if (! preg_match("/\d+/", $_GET["hostid"])) {
		die("Error: invalid hostid format.");
	}

	$host_arr = try_query($db, "SELECT * FROM Hosts WHERE hostid = " . $_GET["hostid"] . ";");
	$host = $host_arr[0];
}
?>
<!DOCTYPE html>
<html>
<head>
	<title>KIHC Maps Database Editor — Hosts — <?= $host["fullname"] ?></title>
	<style>
		.label {
			font-weight: bold;
			text-align: right;
			vertical-align: top;
		}
	</style>
	<script type="text/javascript" src="../utils.js"></script>
	<script type="text/javascript">
		function applyChanges() {
			var scriptAddress = "apply-changes.php";

			document.getElementById("apply-changes").value = "Applying...";
			document.getElementById("apply-changes").disabled = true;
			document.getElementById("connection-status").innerHTML = "";

			var xmlhttp = new XMLHttpRequest();
			var httpGetData = formatHttpGetStr({
				type: "host",
				hostid: "<?= $host["hostid"] ?>",
				fullname: encodeURI(document.getElementById("fullname").value),
				shortname: encodeURI(document.getElementById("shortname").value),
				lat: encodeURI(document.getElementById("lat").value),
				lon: encodeURI(document.getElementById("lon").value),
				description: encodeURI(document.getElementById("description").value),
			});

			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (xmlhttp.responseText === "OK") {
						document.getElementById("apply-changes").value = "Apply";
						document.getElementById("apply-changes").disabled = false;
						document.getElementById("connection-status").innerHTML = "Done!";
					} else {
						document.getElementById("connection-status").innerHTML = "Error: server returned the following:<br>" + xmlhttp.responseText;
					}
				}
			};
			xmlhttp.open("GET", scriptAddress + "?" + httpGetData, true); // asynch POST
			xmlhttp.send();
		}
	</script>
</head>
<body>
	<form>
		<table>
			<tr><td class="label">Full name:</td><td><input type="text" id="fullname" size="50" maxlength="128" value="<?= $host["fullname"] ?>"></td></tr>
			<tr><td class="label">Short name:</td><td><input type="text" id="shortname" size="10" maxlength="16" value="<?= $host["shortname"] ?>"></td></tr>
			<tr><td class="label">Latitude:</td><td><input type="text" id="lat" size="11" maxlength="17" value="<?= $host["lat"] ?>"></td></tr>
			<tr><td class="label">Longitude:</td><td><input type="text" id="lon" size="11" maxlength="17" value="<?= $host["lon"] ?>"></td></tr>
			<tr>
				<td class="label">Description:</td>
				<td> <textarea id="description" cols="48" rows="6"><?= $host["description"] ?></textarea></td>
			</tr>
		</table>
		<input type="button" id="apply-changes" onclick="applyChanges();" value="Apply">
		<div id="connection-status"></div>
	</form>
</body>
</html>
<?php mysqli_close($db); ?>

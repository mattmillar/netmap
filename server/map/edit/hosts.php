<?php

require_once("../db-utils.php");
require_once("queries.php");

$db = db_connect();

$hosts = get_host_fullnames($db);

?>
<!DOCTYPE html>
<html>
<head>
	<title>KIHC Maps Database Editor — Hosts</title>
</head>
<body>
	<h1>Hosts</h1>
	<table style="margin-left: 2em;">
		<tr><td>
			<form method="GET" action="edit-host.php">
				<input type="text" id="new-fullname" name="new-fullname" size="50" maxlength="128">
				<input type="submit" value="Add a new host">
			</form>
		</td></tr>
		<?php
			foreach ($hosts as $host) {
				echo "<tr><td><a href=\"edit-host.php?hostid=" . $host["hostid"] . "\">" . $host["fullname"] . "</a></td></tr>\n";
			}
		?>
	</table>
</body>
</html>
<?php mysqli_close($db); ?>

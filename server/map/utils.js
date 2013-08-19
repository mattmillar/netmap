// format HTTP GET string out of given hash (not including the '?')
// FIXME does not check characters
function formatHttpGetStr (httpGetHash) {
	var httpGetString = "";
	var hashWasEmpty = true;	
	for (var param in httpGetHash) {
		hashWasEmpty = false;
		httpGetString += param;	
		httpGetString += "=";
		httpGetString += httpGetHash[param];	
		httpGetString += "&";
	}
	if (! hashWasEmpty) {
		httpGetString = httpGetString.slice(0, -1); // remove trailing ampersand
	}

	return httpGetString;
}

// this function queries the server using AJAX GET and calls the specified callback
// when the data arrives (the server's data is assumed to be JSON that will be
// deserialized and passed as an object to the callback)
// FIXME the strings in the hash must be sufficiently "nice" (not contain
// weird characters, etc because they are not currently checked or filtered at all)
// --- i.e., right now this is just meant to take literal strings set by YOU
function queryServer (httpGetHash, callback) {
	// CHANGE ME if need be... this is the address of the script that
	// should be generating the JSON bundle
	var scriptAddress = "serve.php";

	var xmlhttp = new XMLHttpRequest();

	httpGetString = formatHttpGetStr(httpGetHash);

	var fullScriptQuery = scriptAddress + "?" + httpGetString;


	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var json = xmlhttp.responseText;
			var evaledObj;
			try {
				evaledObj = eval("(" + xmlhttp.responseText + ")");
			} catch (e) {
				if (e instanceof SyntaxError) {
					alert("Error: queried server for:\n\t" + fullScriptQuery + "\nand got the following (unparsable) response:\n\t" + xmlhttp.responseText);
				}
			}
			callback(evaledObj);
		}
	};
	xmlhttp.open("GET", fullScriptQuery, true); // asynch GET
	xmlhttp.send();
}

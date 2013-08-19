// Map setup script

function setupMap () { // {{{
	// initialize map
	var map = new OpenLayers.Map('map');
	var base = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'});
	map.addLayer(base);
	
	// setup clustering for the map
	setupClustering(map);

	return map;
} // }}}
function setupClustering (map) { // {{{
	var style = new OpenLayers.Style(
		{
			pointRadius: "${radius}",
			fillColor: "#ffcc66",
			fillOpacity: 0.8,
			strokeColor: "#cc6633",
			strokeWidth: "${width}",
			strokeOpacity: 0.8
		},
		{
			context: {
				width: function(feature) {
					return (feature.cluster) ? 2 : 1;
				},
				radius: function(feature) {
					var pix = 20;
					if(feature.cluster) {
						pix = Math.min(feature.attributes.count, 7) + 2;
					}
					return pix;
				}
			}
		}
	);

	var clusterStrategy = new OpenLayers.Strategy.Cluster();
	clusterStrategy.distance = 10;

	var clusters = new OpenLayers.Layer.Vector("clusters",
		{
			strategies: [clusterStrategy],
			styleMap: new OpenLayers.StyleMap(
				{
					"default": style,
					"select": {
						fillColor: "#8aeeef",
						strokeColor: "#32a8a9"
					}
				}
			)
		}
	);

	map.addLayer(clusters);

	var select = new OpenLayers.Control.SelectFeature(
		clusters, {hover: true}
	);

	map.addControl(select);
	select.activate();
    

} // }}}
function setHosts (map, hosts) { // {{{
	var features = [];
	for (var host_idx = 0; host_idx < hosts.length; host_idx++) {
		features.push(
			new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(hosts[host_idx].lon, hosts[host_idx].lat),
				{hostid: hosts[host_idx].hostid}
			)
		);
	}

	//POPUP
	var style_popup = new OpenLayers.Style(
		{
			pointRadius: "${radius}",
			fillColor: "#ffcc66",
			fillOpacity: 0,
			strokeColor: "#cc6633",
			strokeWidth: "${width}",
			strokeOpacity: 0
		},
		{
			context: {
				width: function(feature) {
					return (feature.cluster) ? 2 : 1;
				},
				radius: function(feature) {
					var pix = 3;
					if(feature.cluster) {
						pix = Math.min(feature.attributes.count, 7) + 2;
					}
					return pix;
				}
			}
		}
	);

	var clusterStrategy = new OpenLayers.Strategy.Cluster();
	clusterStrategy.distance = 10;
    // cluster for popups
    
	var vector = new OpenLayers.Layer.Vector(
		'Points',
		{
			strategies: [clusterStrategy],
			styleMap: new OpenLayers.StyleMap(
				{
					"default": style_popup,
					"select": {
						fillColor: "#8aeeef",
						fillOpacity: 0,
						strokeOpacity: 0,
						strokeColor: "#32a8a9"
					}
				}
			),
			eventListeners: {
				'featureselected': function(evt) {
					var ftr = evt.feature;
					//var hostid = ftr.data.hostid;

					var popup = new OpenLayers.Popup.FramedCloud(
						"popup" + ftr.data.hostid, // popup id string
						OpenLayers.LonLat.fromString(ftr.geometry.toShortString()), // lonlat
						null, // contentSize
						"<div style=\"font-size: 1em; color: #536895;\">Loading...</div>", // contentHTML
						null, // content anchor
						true // closeBox (whether to enable close box)
					);
					ftr.popup = popup;

					queryServer({
						query: "host-info",
						hostid: ftr.data.hostid
					}, function (serverResponse) {
						popup.setContentHTML("<p style=\"font-size: 1.5em; color: #536895;\">" + serverResponse.shortname + "</p><p style=\"font-size: 0.8em; color: #000000;\">" + serverResponse.fullname + "</p><p style=\"font-size: 0.7em; color: #101010;\">" + serverResponse.description + "</p>");
					});

					map.addPopup(popup);
				},
				'featureunselected':function(evt){
					var ftr = evt.features;
					map.removePopup(ftr.popup);
					ftr.popup.destroy();
					ftr.popup = null;
				}
			}
		}
	);

	
	var selector = new OpenLayers.Control.SelectFeature(
		vector,
		{
			click:true,
			autoActivate:true
		}
	); 
    vector.addFeatures(features);
    map.addLayer(vector);
	//map.addLayer([vector]);
	map.addControl(selector);
	// END POPUP


	var clusters = map.getLayersByName("clusters")[0];
	clusters.features = [];
	clusters.addFeatures(features);
	clusters.refresh();

} // }}}
function setLinks (map, links) { // {{{
	// FIXME I don't think this function is actually deleting any old links before adding in new ones
	for (var link_idx = 0; link_idx < links.length; link_idx++) {
		var theLink = new OpenLayers.Layer.PointTrack('TargetNode', {styleFrom: OpenLayers.Layer.PointTrack.TARGET_NODE, visibility: true});

		var pointLayer = new OpenLayers.Layer.Vector('Original');
		var pointLayerFeatures = [];
		pointLayerFeatures.push(
			new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(links[link_idx].lonA, links[link_idx].latA)
			)
		);
		pointLayerFeatures.push(
			new OpenLayers.Feature.Vector(
				new OpenLayers.Geometry.Point(links[link_idx].lonB, links[link_idx].latB)
			)
		);

		pointLayer.addFeatures(pointLayerFeatures);

		theLink.addNodes(pointLayer.features);
		map.addLayers([theLink]);
	}
} // }}}
function setMapData(map, hosts, links) { // {{{
	setHosts(map, hosts);
	setLinks(map, links);
} // }}}

function setBounds (map) { // {{{
	bounds = new OpenLayers.Bounds();
	bounds.extend(new OpenLayers.LonLat(-123, 37.7));
	bounds.extend(new OpenLayers.LonLat(-118, 33.8));
	map.zoomToExtent(bounds);

	bounds2 = new OpenLayers.Bounds();
	bounds2.extend(new OpenLayers.LonLat(-122, 38.7));
	bounds2.extend(new OpenLayers.LonLat(-110, 32.8));
} // }}}

// this function takes a "month index" (which will be the number that increments)
// per the user interface) and computes the returns the corresponding "datetime"
// string (i.e., formatted per our "YYYY-MM-DD-HH-MM-SS" convention for datetimes)
//
// "month indexes" start with 0 as Jan 1969, then 1 would be Feb 1969, 12 would
// be Jan 1970, etc.
function monthNum2DatetimeStr (monthNum) { // {{{
	var year = 1969 + Math.floor(monthNum / 12);
	var month = (monthNum % 12) + 1;
	var monthFormatted = "";

	if (month < 10) {
		monthFormatted += "0";
	}
	monthFormatted += month;

	return year + "-" + monthFormatted + "-01-00-00-00";
} // }}}

var currentMonthNum = 0;
var animationRunning = false;
var animationWindowLoopId = -1;

var updateMap; // this will be the "update map" function

function toggleAnimation () {
	if (animationRunning) {
		document.getElementById("animation-toggle").value = "Go";
		window.clearInterval(animationWindowLoopId);
		animationRunning = false;
	} else {
		document.getElementById("animation-toggle").value = "Stop";
		animationWindowLoopId = window.setInterval(function() {
			if (currentMonthNum >= 200) {
				currentMonthNum = 0;
			} else {
				currentMonthNum++;
			}

			var dateStr = monthNum2DatetimeStr(currentMonthNum);
			document.getElementById("current-date").innerHTML = dateStr;
			updateMap(dateStr);
		}, 500);
		animationRunning = true;
	}
}

function init() {
	var map = setupMap();
	
	updateMap = function (dateStr) {
		queryServer({"query": "hosts", "datetime": dateStr}, function (hosts) {
			setHosts(map, hosts);
		});

		queryServer({"query": "links", "datetime": dateStr}, function (links) {
			setLinks(map, links);
		});
	}


	setBounds(map);
}

//POPUP
function onFeatureSelect(feature) {
            selectedFeature = feature;
            popup = new OpenLayers.Popup.FramedCloud("chicken", 
                feature.geometry.getBounds().getCenterLonLat(),
                null,
                "<div style='font-size:.8em'>Feature: "
                +"<br>Area: " + "</div>",
                                     null, true, onPopupClose);
            feature.popup = popup;
            map.addPopup(popup);
        }
function onFeatureUnselect(feature) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
} 

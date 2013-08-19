// Map setup script

function setupMap () { // {{{
	// initialize map
	var map = new OpenLayers.Map('map');
	var base = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0", {layers: 'basic'});
	map.addLayers([base]);
	
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

	//var refreshStrategy = new OpenLayers.Strategy.Refresh();

	var clusters = new OpenLayers.Layer.Vector("clusters",
		{
			strategies: [clusterStrategy /*, refreshStrategy */],
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

	map.addLayers([clusters]);

	var select = new OpenLayers.Control.SelectFeature(
		clusters, {hover: true}
	);

	map.addControl(select);
	select.activate();

} // }}}
function setHosts (map, hosts) { // {{{
	var features = [];
	for (var host_idx = 0; host_idx < hosts.length; host_idx++) {
		features.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(hosts[host_idx].lon, hosts[host_idx].lat)));
	}

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
		for (var linkiface_idx = 0; linkiface_idx < links[link_idx].length; linkiface_idx++) {
			pointLayerFeatures.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(links[link_idx][linkiface_idx].lon, links[link_idx][linkiface_idx].lat)));
		}
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

function init() {
	var map = setupMap();
	setMapData(map, hosts, links);
	
	hosts.push({lat: 35, lon: -120});
	links.push([{lat: 35, lon: -120}, {lat: 34, lon: -121}]);
	window.setTimeout(function() { setMapData(map, hosts, links); }, 4000);

	setBounds(map);
}

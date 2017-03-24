/**
 * Map. Used Leaflet library work on it.
 *
 * Created by eyp on 22/03/2017.
 */

/**
 * Paint the markers in the map
 *
 * @param markers [] Array of markers
 * @param map Map where the markers will be added.
 */
function paintMarkers(markers, map) {
    markers.forEach(function (marker) {
        marker.mapShape.addTo(map);
    });
}

/**
 * Constructor.
 *
 * @param geoData GeoJSON data.
 * @constructor
 */
var Map = function (geoData) {
    var that = this;
    this.mapData = [];
    this.mapStyle = new MapStyle(MapTheme.STREETS, 0.5, -7, "#ff0033", "#121280", 4);

    geoData.features.forEach(function (feature) {
        that.mapData.push(new Marker(feature, that.mapStyle));
    });
    console.log("There are", that.mapData.length, "records to paint");
    console.log("Geo data sample: ", geoData.features[0]);

    // Init map and main layer
    this.map = L.map("map", {center: [50.8397819, 4.3817422], zoom: this.mapStyle.zoom});
    this.currentLayer = this.buildTileLayer();
    this.map.addLayer(this.currentLayer);
    this.map.on('zoomend', function(event) {
        if (event.target._zoom === event.target._layersMaxZoom) {
            alert("With this map you can't stalk your neighbourgs, don't zoom in more!");
        }
    });
};

Map.prototype.buildTileLayer = function () {
    // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    return L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/" + this.mapStyle.theme + "/tiles/256/{z}/{x}/{y}?access_token=" + mapBoxAccessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 12,
        minZoom: 2,
        id: mapBoxProjectId,
        accessToken: mapBoxAccessToken
    });
};

Map.prototype.changeTheme = function (theme) {
    this.mapStyle.theme = theme;
    this.map.removeLayer(this.currentLayer);
    this.currentLayer = this.buildTileLayer();
    this.map.addLayer(this.currentLayer);
};

/**
 * Paints the markers asynchronously.
 */
Map.prototype.refresh = function () {
    var that = this;

    var size = this.mapData.length;
    var i = 0;
    for (var from = 0; from < size;) {
        var to = from + 500;
        if (to > size) {
            to = size;
        }
        console.log("Painting from", from, "to", to);
        // Paints 500 markers each 150 ms
        var arrayCopy = that.mapData.slice(from, to);
        setTimeout(paintMarkers, 150 * i, arrayCopy, that.map);
        i++;
        from = to;
    }
    console.log("Map complete!")
};

Map.prototype.changeMarkersRadius = function (delta) {
    var that = this;
    this.updateMarkers(function () {
        that.mapStyle.radiusDelta += delta;
        if (that.mapStyle.radiusDelta < -15) {
            that.mapStyle.radiusDelta = -15;
        }
    });
};

Map.prototype.changeMarkersStrokeThickness = function (delta) {
    var that = this;
    this.updateMarkers(function () {
        that.mapStyle.strokeSize += delta;
        if (that.mapStyle.strokeSize < 0) {
            that.mapStyle.strokeSize = 0;
        }
    });
};

Map.prototype.changeMarkersFillColor = function (color) {
    var that = this;
    this.updateMarkers(function () {
        that.mapStyle.fillColor = color;
    });
};

Map.prototype.changeMarkersStrokeColor = function (color) {
    var that = this;
    this.updateMarkers(function () {
        that.mapStyle.strokeColor = color;
    });
};

Map.prototype.updateMarkers = function (updateFunction) {
    updateFunction();
    var that = this;
    this.mapData.forEach(function (marker) {
        marker.mapShape.setStyle(that.mapStyle.buildMarkerStyle(marker.feature));
    });
};

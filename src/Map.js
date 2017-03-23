/**
 * Map. Used Leaflet library work on it.
 *
 * Created by eyp on 22/03/2017.
 */

/**
 * Build the style for the markers that are going to be painted in the map.
 *
 * @param feature Geo JSON data record.
 * @param style Style defined in the map.
 * @returns {{color: (string|*), fillColor: (string|*), fillOpacity: number, radius: *, weight: (number|*)}}
 */
function buildStyle(feature, style) {
    var radius = style.radius + feature.properties.rank_max;
    if (radius < 0) {
        radius = 1;
    }
    return {
        color: style.strokeColor,
        fillColor: style.fillColor,
        fillOpacity: (feature.properties.rank_max / 100) * 7,
        radius: radius,
        weight: style.strokeSize
    };
}

/**
 * Creates the objects that will be used for painting the markers.
 *
 * @param feature Geo JSON data record.
 * @param style Style defined in the map.
 * @returns {{mapShape: null, feature: null}}
 */
function createMapDataFromFeature(feature, style) {
    var dot = {
        mapShape: L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], buildStyle(feature, style)),
        feature: feature
    };
    // Popup label
    dot.mapShape.bindPopup(feature.properties.name + " (" + feature.properties.adm0name + ")<br>Population between " + feature.properties.pop_min + " and " + feature.properties.pop_max + " people<br>Rank: " + feature.properties.rank_max);
    return dot;
}

/**
 * Paint the markers in the map
 *
 * @param markers [] Array of markers
 * @param map Map where the markers will be added.
 */
function paintMarkers(markers, map) {
    markers.forEach(function (dot) {
        dot.mapShape.addTo(map);
    });
}

var Map = function (geoData) {
    var that = this;
    this.mapData = [];
    this.geoData = geoData;
    this.style = {
        theme: MapStyle.STREETS,
        strokeSize: 0.5,
        radius: -7,
        fillColor: "#ff0033",
        strokeColor: "#121280",
        zoom: 4
    };

    geoData.features.forEach(function (feature) {
        that.mapData.push(createMapDataFromFeature(feature, that.style));
    });
    console.log("There are", that.mapData.length, "records to paint");

    // Init map and main layer
    this.map = L.map("map", {center: [50.8397819, 4.3817422], zoom: this.style.zoom});
    this.currentLayer = this.buildTileLayer();
    this.map.addLayer(this.currentLayer);
};

Map.prototype.changeTheme = function(theme) {
    this.style.theme = theme;
    this.map.removeLayer(this.currentLayer);
    this.currentLayer = this.buildTileLayer();
    this.map.addLayer(this.currentLayer);
};

Map.prototype.buildTileLayer = function () {
    // http://{s}.tile.osm.org/{z}/{x}/{y}.png
    return L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/" + this.style.theme + "/tiles/256/{z}/{x}/{y}?access_token=" + mapBoxAccessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 12,
        minZoom: 2,
        id: mapBoxProjectId,
        accessToken: mapBoxAccessToken
    });
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

Map.prototype.changeDotsSize = function (delta) {
    var that = this;
    this.updateMarkers(function () {
        that.style.radius += delta;
        if (that.style.radius < -15) {
            that.style.radius = -15;
        }
    });
};

Map.prototype.changeStrokeSize = function (delta) {
    var that = this;
    this.updateMarkers(function () {
        that.style.strokeSize += delta;
        if (that.style.strokeSize < 0) {
            that.style.strokeSize = 0;
        }
    });
};

Map.prototype.changeDotsBaseColor = function (color) {
    var that = this;
    this.updateMarkers(function () {
        that.style.fillColor = color;
    });
};

Map.prototype.changeStrokeColor = function (color) {
    var that = this;
    this.updateMarkers(function () {
        that.style.strokeColor = color;
    });
};

Map.prototype.updateMarkers = function (updateFunction) {
    updateFunction();
    var that = this;
    this.mapData.forEach(function (dot) {
        dot.mapShape.setStyle(buildStyle(dot.feature, that.style));
    });
};

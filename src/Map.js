/**
 * Leaflet map.
 *
 * Created by eyp on 22/03/2017.
 */

function buildStyle(feature, fillColor, radius, strokeSize, strokeColor) {
    return {
        color: strokeColor,
        fillColor: fillColor,
        fillOpacity: (feature.properties.rank_max / 100) * 7,
        radius: radius * feature.properties.rank_max,
        weight: strokeSize
    };
}

function createMapDataFromFeature(feature, fillColor, radius, strokeSize, strokeColor) {
    var dot = {
        mapShape: null,
        feature: null
    };
    dot.feature = feature;
    dot.mapShape = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], buildStyle(feature, fillColor, radius, strokeSize, strokeColor));
    dot.mapShape.bindPopup(feature.properties.name + " (" + feature.properties.adm0name + ")<br>Population between " + feature.properties.pop_min + " and " + feature.properties.pop_max + " people<br>Rank: " + feature.properties.rank_max);
    return dot;
}

var Map = function (geoData) {
    var that = this;
    this.mapData = [];
    this.mapStyle = MapStyle.STREETS;
    this.strokeSize = 2;
    this.radius = 1000;
    this.fillColor = "#ff0033";
    this.strokeColor = "#ffffff";

    console.log("Painting feature:", geoData.features[0]);
    console.log("Painting feature:", geoData.features[1]);
    console.log("Painting feature:", geoData.features[2]);
    console.log("Painting feature:", geoData.features[3]);
    console.log("Painting feature:", geoData.features[4]);
    geoData.features.forEach(function (feature) {
        that.mapData.push(createMapDataFromFeature(feature, that.fillColor, that.radius, that.strokeSize, that.strokeColor));
    });
    console.log("There are", that.mapData.length, "records to paint");
};

Map.prototype.changeMapStyle = function(mapStyle) {
    this.mapStyle = mapStyle;
    this.changeTileLayer(this.buildTileLayer());
};

function paintDots(dots, that) {
    dots.forEach(function (dot) {
        dot.mapShape.addTo(that.map);
    });
}

Map.prototype.changeTileLayer = function (newLayer) {
    this.map.removeLayer(this.currentLayer);
    this.currentLayer = newLayer;
    this.map.addLayer(this.currentLayer);
};

Map.prototype.buildTileLayer = function () {
    return L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/' + this.mapStyle + '/tiles/256/{z}/{x}/{y}?access_token=' + mapBoxAccessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 12,
        minZoom: 4,
        id: mapBoxProjectId,
        accessToken: mapBoxAccessToken
    });
};

Map.prototype.refresh = function (mapStyle) {
    this.map = L.map('streetMap', {center: [50.8397819, 4.3817422], zoom: 7});
    this.currentLayer = this.buildTileLayer(mapStyle);
    this.map.addLayer(this.currentLayer);

    var size = this.mapData.length;
    var that = this;
    var i = 0;
    for (var from = 0; from < size;) {
        var to = from + 500;
        if (to > size) {
            to = size;
        }
        console.log("Painting from", from, "to", to);
        var arrayCopy = that.mapData.slice(from, to);
        setTimeout(paintDots, 100 * i, arrayCopy, that);
        i++;
        from = to;
    }
    console.log("Map complete!")
};

Map.prototype.changeDotsSize = function (delta) {
    this.radius += delta;
    if (this.radius < 50) {
        this.radius = 50;
    }
    var that = this;
    this.mapData.forEach(function (dot) {
        dot.mapShape.setRadius(that.radius * dot.feature.properties.rank_max);
    });
};

Map.prototype.changeStrokeSize = function (delta) {
    this.strokeSize += delta;
    if (this.strokeSize < 0) {
        this.strokeSize = 0;
    }
    this.refreshDotsStyle();
};

Map.prototype.changeDotsBaseColor = function (color) {
    this.fillColor = color;
    this.refreshDotsStyle();
};

Map.prototype.changeDotsBaseColor = function (color) {
    this.strokeColor = color;
    this.refreshDotsStyle();
};

Map.prototype.refreshDotsStyle = function () {
    var that = this;
    this.mapData.forEach(function (dot) {
        dot.mapShape.setStyle(buildStyle(dot.feature, that.fillColor, that.radius, that.strokeSize, that.strokeColor));
    });
};
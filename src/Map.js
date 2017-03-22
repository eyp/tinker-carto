/**
 * Leaflet map.
 *
 * Created by eyp on 22/03/2017.
 */

function createCircleFromFeature(feature) {
    var circle = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: 500
    });
    circle.bindPopup(feature.properties.name + " (" + feature.properties.adm0name + ")<br>Population between " + feature.properties.pop_min + " and " + feature.properties.pop_max + " people");
    return circle;
}

function createCirclesFromJSONGeoData(geoData) {
    var circles = [];
    geoData.features.forEach(function (feature) {
        circles.push(createCircleFromFeature(feature));
    });
    return circles;
}

var Map = function () {
    this.map = L.map('streetMap', {center: [50.8397819, 4.3817422], zoom: 6});
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + openStreetMapAccessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 12,
        minZoom: 4,
        id: 'immoliste',
        accessToken: openStreetMapAccessToken
    }).addTo(this.map);
};

function paintPoints(circles, that) {
    circles.forEach(function (circle) {
        circle.addTo(that.map);
    });
}

Map.prototype.addGeoData = function (geoData) {
    // console.log("Painting feature:", geoData.features[0]);
    var circles = createCirclesFromJSONGeoData(geoData);
    console.log("There are", circles.length, "circles to paint");

    var size = circles.length;
    // console.log("Circles[0]", circles[0]);
    var that = this;
    var i = 0;
    for (var from = 0; from < size;) {
        var to = from + 500;
        if (to > size) {
            to = size;
        }
        console.log("Painting from", from, "to", to);
        var arrayCopy = circles.slice(from, to);
        setTimeout(paintPoints, 100 * i, arrayCopy, that);
        i++;
        from = to;
    }
    console.log("Map complete!")
};



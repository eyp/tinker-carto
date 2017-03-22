/**
 * Leaflet map.
 *
 * Created by eyp on 22/03/2017.
 */

var Map = function () {
    this.map = L.map('streetMap', {center: [50.8397819, 4.3817422], zoom: 2});
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + openStreetMapAccessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 24,
        id: 'immoliste',
        accessToken: openStreetMapAccessToken
    }).addTo(this.map);
};

Map.prototype.addGeoData = function (geoData) {
    console.log("Painting feature:", geoData.features[0]);
    L.geoJSON(geoData.features[0]).addTo(this.map);
    // TODO Paint data in background or something more asynchronous so the browser is not stalled
    /*
     var layer = L.geoJSON().addTo(map);
     geoData.features.forEach(function (feature) {
     setTimeout(layer.addData(feature), 1);
     });
     */
};
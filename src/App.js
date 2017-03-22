"use strict";

/**
 * Main application class.
 *
 * Created by eyp on 20/03/2017.
 */

(function () {
    var App = function () {
    };

    App.prototype.paintMap = function (geoData) {
        console.log("Preparing map...");
        var myMap = L.map('streetMap', {center: [50.8397819, 4.3817422], zoom: 2});
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + openStreetMapAccessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 24,
            id: 'immoliste',
            accessToken: openStreetMapAccessToken
        }).addTo(myMap);

        console.log("Painting feature:", geoData.features[0]);
        L.geoJSON(geoData.features[0]).addTo(myMap);
/*
        var layer = L.geoJSON().addTo(myMap);
        geoData.features.forEach(function (feature) {
            setTimeout(layer.addData(feature), 1);
        });
*/
    };

    App.prototype.requestComplete = function (event) {
        console.log("CARTO request complete successfully");
        var httpRequest = event.target;
        var geoData = JSON.parse(httpRequest.responseText);
        console.log("Geo data has been loaded and parsed, there are", geoData.features.length, "points");
        this.paintMap(geoData);
    };

    App.prototype.requestError = function (event) {
        var httpRequest = event.target;
        console.log("Error happened on CARTO request: (", httpRequest.status, ") - ", httpRequest.statusText);
    };

    App.prototype.start = function () {
        var cartoClient = new CartoClient();
        cartoClient.getGeoData(this.requestComplete.bind(this), this.requestError.bind(this));
    };

    var app = new App();
    app.start();
})();


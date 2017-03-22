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
        var map = new Map();

        console.log("Painting data...");
        map.addGeoData(geoData);
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


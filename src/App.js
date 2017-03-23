"use strict";

/**
 * Main application class.
 *
 * Created by eyp on 20/03/2017.
 */

var App = function () {
    this.map = null;
};

App.prototype.paintMap = function (geoData) {
    console.log("Preparing map...");
    this.map = new Map(geoData);
    document.getElementById("dotsColor").value = this.map.fillColor;
    document.getElementById("strokeColor").value = this.map.strokeColor;
    console.log("Painting data...");
    this.map.refresh();
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

App.prototype.changeMapStyle = function () {
    this.map.changeMapStyle(document.getElementById("mapStyle").value);
};

App.prototype.incrementDotsSize = function () {
    this.map.changeDotsSize(200);
};

App.prototype.decrementDotsSize = function () {
    this.map.changeDotsSize(-200);
};

App.prototype.incrementStrokeSize = function () {
    this.map.changeStrokeSize(0.5);
};

App.prototype.decrementStrokeSize = function () {
    this.map.changeStrokeSize(-0.5);
};

App.prototype.changeDotsBaseColor = function () {
    this.map.changeDotsBaseColor(document.getElementById("dotsColor").value);
};

App.prototype.changeStrokeColor = function () {
    this.map.changeStrokeColor(document.getElementById("strokeColor").value);
};



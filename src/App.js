"use strict";

/**
 * Main application class.
 *
 * Created by eyp on 20/03/2017.
 */

/**
 * Constructor.
 *
 * @constructor
 */
var App = function () {
    this.map = null;
};

/**
 * Callback that will be executed when the geoData is retrieved.
 *
 * @param event Request event.
 */
App.prototype.requestComplete = function (event) {
    console.log("CARTO request complete successfully");
    var httpRequest = event.target;
    var geoData = JSON.parse(httpRequest.responseText);
    console.log("Geo data has been loaded and parsed, there are", geoData.features.length, "points");
    console.log("Preparing map...");
    this.map = new Map(geoData);
    document.getElementById("dotsColor").value = this.map.mapStyle.fillColor;
    document.getElementById("strokeColor").value = this.map.mapStyle.strokeColor;
    console.log("Painting data...");
    this.map.refresh();
};

App.prototype.requestError = function (event) {
    var httpRequest = event.target;
    console.log("Error happened on CARTO request: (", httpRequest.status, ") - ", httpRequest.statusText);
};

/**
 * Initialize the application.
 */
App.prototype.init = function () {
    var cartoClient = new CartoClient();
    cartoClient.getGeoData(this.requestComplete.bind(this), this.requestError.bind(this));
};

App.prototype.changeTheme = function () {
    this.map.changeTheme(document.getElementById("theme").value);
};

App.prototype.incrementMarkersRadius = function () {
    this.map.changeMarkersRadius(1);
};

App.prototype.decrementMarkersRadius = function () {
    this.map.changeMarkersRadius(-1);
};

App.prototype.incrementMarkersStrokeThickness = function () {
    this.map.changeMarkersStrokeThickness(0.5);
};

App.prototype.decrementMarkersStrokeThickness = function () {
    this.map.changeMarkersStrokeThickness(-0.5);
};

App.prototype.changeMarkersFillColor = function () {
    this.map.changeMarkersFillColor(document.getElementById("dotsColor").value);
};

App.prototype.changeMarkersStrokeColor = function () {
    this.map.changeMarkersStrokeColor(document.getElementById("strokeColor").value);
};



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
    document.getElementById("markersColor").value = this.map.mapStyle.fillColor;
    document.getElementById("strokeColor").value = this.map.mapStyle.strokeColor;
    console.log("Painting data...");
    document.getElementById("messagesPanel").style.visibility = "hidden";
    document.getElementById("mainPanel").style.visibility = "visible";
    this.map.refresh();
};

App.prototype.requestError = function (event) {
    var httpRequest = event.target;
    console.error("Error happened on CARTO request: (", httpRequest.status, ") - ", httpRequest.statusText);
    this.showStatusMessage("Cannot retrieve CARTO Geo JSON data, server error: (", httpRequest.status, ") - ", httpRequest.statusText);
};

App.prototype.showStatusMessage = function (message, type) {
    if (document.getElementById("messagesPanel").style.visibility !== "visible") {
        document.getElementById("messagesPanel").style.visibility = "visible";
    }
    document.getElementById("messagesPanel").innerHTML = "<h3 class='message " + type + "'>" + message + "</h3>";
};

/**
 * Initialize the application.
 */
App.prototype.init = function () {
    if (typeof mapBoxAccessToken === 'undefined' || typeof mapBoxProjectId === 'undefined' || mapBoxAccessToken === undefined || mapBoxProjectId === undefined) {
        console.error("Application is not configured, please rename config-sample.js to config.js and set it up properly.");
        this.showStatusMessage("Application is not configured, please rename config-sample.js to config.js and set it up properly.", StatusMessageType.ERROR);
    } else {
        console.log("Retrieving information from CARTO...");
        this.showStatusMessage("Loading...", StatusMessageType.INFO);
        var cartoClient = new CartoClient();
        cartoClient.getGeoData(this.requestComplete.bind(this), this.requestError.bind(this));
    }
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
    this.map.changeMarkersFillColor(document.getElementById("markersColor").value);
};

App.prototype.changeMarkersStrokeColor = function () {
    this.map.changeMarkersStrokeColor(document.getElementById("strokeColor").value);
};



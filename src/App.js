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
    return {
        map: null,

        /**
         * Callback that will be executed when the geoData is retrieved.
         *
         * @param event Request event.
         */
        requestComplete: function (event) {
            console.info("CARTO request complete successfully");
            var httpRequest = event.target;
            var geoData = JSON.parse(httpRequest.responseText);
            console.info("Geo data has been loaded and parsed, there are", geoData.features.length, "records");
            this.showStatusMessage("Building map...", StatusMessageType.INFO);
            this.map = new Map();
            var that = this;
            this.map.build(geoData, function () {
                document.getElementById("markersColor").value = that.map.style.fillColor;
                document.getElementById("strokeColor").value = that.map.style.strokeColor;
                document.getElementById("messagesPanel").remove();
                document.getElementById("mainPanel").style.visibility = "visible";
            });
        },

        requestError: function (event) {
            var httpRequest = event.target;
            console.error("Error happened on CARTO request: (", httpRequest.status, ") - ", httpRequest.statusText);
            this.showStatusMessage("Cannot retrieve CARTO Geo JSON data, server error: (", httpRequest.status, ") - ", httpRequest.statusText);
        },

        showStatusMessage: function (message, type) {
            if (document.getElementById("messagesPanel").style.visibility !== "visible") {
                document.getElementById("messagesPanel").style.visibility = "visible";
            }
            document.getElementById("messagesPanel").innerHTML = "<h3 class='message " + type + "'>" + message + "</h3>";
        },

        /**
         * Initialize the application.
         */
        init: function () {
            if (typeof mapBoxAccessToken === 'undefined' || mapBoxAccessToken === undefined) {
                console.error("Application is not configured, please rename config-sample.js to config.js and set it up properly.");
                this.showStatusMessage("Application is not configured, please rename config-sample.js to config.js and set it up properly.", StatusMessageType.ERROR);
            } else {
                console.info("Retrieving information from CARTO...");
                this.showStatusMessage("Loading...", StatusMessageType.INFO);
                var cartoClient = new CartoFacade();
                cartoClient.getGeoData(this.requestComplete.bind(this), this.requestError.bind(this));
            }
        },

        changeTheme: function () {
            this.map.changeTheme(document.getElementById("theme").value);
        },

        incrementMarkersRadius: function () {
            console.log("Incrementando tamaño");
            this.map.changeMarkersRadius(1);
        },

        decrementMarkersRadius: function () {
            this.map.changeMarkersRadius(-1);
        },

        incrementMarkersStrokeThickness: function () {
            this.map.changeMarkersStrokeThickness(0.5);
        },

        decrementMarkersStrokeThickness: function () {
            this.map.changeMarkersStrokeThickness(-0.5);
        },

        changeMarkersFillColor: function () {
            this.map.changeMarkersFillColor(document.getElementById("markersColor").value);
        },

        changeMarkersStrokeColor: function () {
            this.map.changeMarkersStrokeColor(document.getElementById("strokeColor").value);
        }
    }
};




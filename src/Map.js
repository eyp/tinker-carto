/**
 * Interactive map.
 *
 * Created by eyp on 22/03/2017.
 */

/**
 * Constructor.
 *
 * @constructor
 */
var Map = function () {
    /**
     * Build the style for the markers that are going to be painted in the map.
     *
     * @param feature Geo JSON data record.
     * @param mapStyle Map's style options.
     * @returns {{color: (string|*), fillColor: (string|*), fillOpacity: number, radius: *, weight: (number|*)}}
     */
    function buildMarkerStyle (feature, mapStyle) {
        var radius = mapStyle.radiusDelta + feature.properties.rank_max;
        if (radius < 0) {
            radius = 1;
        }
        return {
            color: mapStyle.strokeColor,
            fillColor: mapStyle.fillColor,
            fillOpacity: feature.properties.rank_max / 16,
            radius: radius,
            weight: mapStyle.strokeSize
        };
    }

    return {
        hashData: {},
        style: new MapStyle(MapTheme.STREETS, 0.5, -6, "#ff0033", "#121280", 2),

        /**
         * Builds the map with the Geo JSON data received, and show everything.
         *
         * @param geoData GeoJSON data.
         * @param callback Callback that will be called when the map is complete.
         */
        build: function (geoData, callback) {
            console.info("Building map...");
            var that = this;

            // Init map and main layer
            this.map = LeafletFacade.createMap(this.style.zoom);
            this.currentLayer = LeafletFacade.changeTileLayer(this.map, this.style.theme);
            LeafletFacade.onMaxZoom(this.map, function () {
                alert("With this map you can't stalk your neighbourgs, don't zoom in more!")
            });

            var markers = [];
            geoData.features.forEach(function (feature) {
                var marker = LeafletFacade.createMarker(feature, buildMarkerStyle(feature, that.style));
                var key = feature.properties.name.toLowerCase();
                if (!that.hashData.hasOwnProperty(key)) {
                    that.hashData[key] = [];
                }
                that.hashData[key].push(marker);
                markers.push(marker.mapShape);
            });
            console.info("There are", geoData.features.length, "markers to paint");
            console.debug("Geo data sample: ", geoData.features[0]);

            LeafletFacade.createMarkersGroup(this.map, markers);
            console.info("Map complete!");
            callback();
        },

        changeTheme: function (theme) {
            this.style.theme = theme;
            this.currentLayer = LeafletFacade.changeTileLayer(this.map, theme, this.currentLayer);
        },

        changeMarkersRadius: function (radiusDelta) {
            var that = this;
            this.updateMarkers(function () {
                that.style.radiusDelta += radiusDelta;
                if (that.style.radiusDelta < -15) {
                    that.style.radiusDelta = -15;
                }
            });
        },

        changeMarkersStrokeThickness: function (thicknessDelta) {
            var that = this;
            this.updateMarkers(function () {
                that.style.strokeSize += thicknessDelta;
                if (that.style.strokeSize < 0) {
                    that.style.strokeSize = 0;
                }
            });
        },

        changeMarkersFillColor: function (color) {
            var that = this;
            this.updateMarkers(function () {
                that.style.fillColor = color;
            });
        },

        changeMarkersStrokeColor: function (color) {
            var that = this;
            this.updateMarkers(function () {
                that.style.strokeColor = color;
            });
        },

        updateMarkers: function (updateFunction) {
            updateFunction();
            var that = this;
            for (var key in this.hashData) {
                if (this.hashData.hasOwnProperty(key)) {
                    this.hashData[key].forEach(function (marker) {
                        LeafletFacade.setMarkerStyle(marker.mapShape, buildMarkerStyle(marker.feature, that.style));
                    });
                }
            }
        },

        /**
         * Search a city by name. The result is an array of markers.
         *
         * @param name Name of the city to search.
         * @returns {*} Array of markers.
         */
        searchCity: function (name) {
            if (this.hashData.hasOwnProperty(name.toLowerCase())) {
                return this.hashData[name.toLowerCase()];
            }
            return [];
        },

        showMarkerPopup: function (marker) {
            marker.mapShape.openPopup();
        }
    }
};


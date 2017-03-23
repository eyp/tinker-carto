'use strict';

/**
 * Stores the current map mapStyle.
 *
 * Created by eyp on 23/03/2017.
 */

var MapStyle = function (theme, strokeSize, radiusDelta, fillColor, strokeColor, zoom) {
    this.theme = theme;
    this.strokeSize = strokeSize;
    this.radiusDelta = radiusDelta;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.zoom = zoom;
};

/**
 * Build the mapStyle for the markers that are going to be painted in the map.
 *
 * @param feature Geo JSON data record.
 * @param style Style defined in the map.
 * @returns {{color: (string|*), fillColor: (string|*), fillOpacity: number, radius: *, weight: (number|*)}}
 */
MapStyle.prototype.buildMarkerStyle = function (feature) {
    var radius = this.radiusDelta + feature.properties.rank_max;
    if (radius < 0) {
        radius = 1;
    }
    var that = this;
    return {
        color: that.strokeColor,
        fillColor: that.fillColor,
        fillOpacity: (feature.properties.rank_max / 100) * 7,
        radius: radius,
        weight: that.strokeSize
    };
}


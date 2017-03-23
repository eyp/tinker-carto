'use strict';

/**
 * Marker in the map. It contains the geoData, and the shape that is painted in the map.
 *
 * Created by eyp on 23/03/2017.
 */

/**
 * Constructor.
 *
 * @param feature Geo JSON data record.
 * @param mapStyle Style defined in the map.
 * @constructor
 */
var Marker = function (feature, mapStyle) {
    this.mapShape = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], mapStyle.buildMarkerStyle(feature));
    this.feature = feature;
    // Popup label
    var iconUrl = "img/" + feature.properties.adm0_a3.toLowerCase() + ".gif";
    this.mapShape.bindPopup("<img src='" + iconUrl + "'/> " + this.feature.properties.name + ", " + this.feature.properties.adm0name + "<br>Population between " + this.feature.properties.pop_min + " and " + this.feature.properties.pop_max + " people<br>Rank: " + this.feature.properties.rank_max);
};
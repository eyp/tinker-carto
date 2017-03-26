'use strict';

/**
 * Façade to work with Leaftleat lib.
 *
 * Created by eyp on 25/03/2017.
 */

var LeafletFacade = {
    createMap: function (coords, initialZoom) {
        return L.map("map", {center: [coords[0], coords[1]], zoom: initialZoom});
    },

    buildTileLayer: function (theme) {
        // http://{s}.tile.osm.org/{z}/{x}/{y}.png
        return L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/" + theme + "/tiles/256/{z}/{x}/{y}?access_token=" + mapBoxAccessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 10,
            minZoom: 2,
            id: "cartoTest",
            accessToken: mapBoxAccessToken
        });
    },

    createMarker: function (feature, style, popupHtml) {
        var marker = {
            mapShape: L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], style),
            feature: feature
        };
        marker.mapShape.bindPopup(popupHtml);
        return marker;
    },

    createMarkersGroup: function (map, markers) {
        var markersGroup = L.featureGroup(markers);
        markersGroup.addTo(map);
        return markersGroup;
    },

    changeTileLayer: function (map, theme, currentLayer) {
        if (currentLayer) {
            map.removeLayer(currentLayer);
        }
        var newLayer = this.buildTileLayer(theme);
        map.addLayer(newLayer);
        return newLayer;
    },

    setMarkerStyle: function (marker, style) {
        marker.setStyle(style);
    },

    onMaxZoom: function (map, callback) {
        map.on('zoomend', function(event) {
            if (event.target._zoom === event.target._layersMaxZoom) {
                callback();
            }
        });
    },

    openPopup: function (marker) {
        marker.openPopup();
    },

    setMapView: function (map, coords, zoom) {
        map.flyTo([coords[1], coords[0]], zoom);
    }
};

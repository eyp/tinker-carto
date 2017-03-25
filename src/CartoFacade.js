"use strict";
/**
 * Class for calling CARTO API.
 *
 * Created by eyp on 20/03/2017.
 */
const CARTO_GEO_JSON_QUERY = "https://xavijam.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ne_10m_populated_places_simple&format=GeoJSON";

var CartoFacade = function () {
    function makeRequest(file, success, error) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.addEventListener("load", success);
        httpRequest.addEventListener("error", error);
        httpRequest.open("GET", file);
        httpRequest.send(null);
    }

    return {
        getGeoData: function (successCallback, errorCallback) {
            makeRequest(CARTO_GEO_JSON_QUERY, successCallback, errorCallback);
        }
    }
};




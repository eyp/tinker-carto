'use strict';

/**
 * Stores the current map style.
 *
 * Created by eyp on 23/03/2017.
 */

var MapStyle = function (theme, strokeSize, radiusDelta, fillColor, strokeColor, zoom) {
    return {
        theme: theme,
        strokeSize: strokeSize,
        radiusDelta: radiusDelta,
        fillColor: fillColor,
        strokeColor: strokeColor,
        zoom: zoom
    }
};


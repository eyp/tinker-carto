'use strict';

describe("Map", function () {
    var map;

    beforeEach(function () {
        map = new Map();
        var messagesPanel = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(messagesPanel);
    });

    it("should be able to be created", function () {
        expect(map).not.toBe(null);
    });

    it("should be able to be build", function () {
        map.build({
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        adm0_a3: "SPA",
                        name: "Madrid",
                        pop_max: 5000000,
                        rank_max: 13
                    },
                    geometry: {
                        coordinates: [1, 0]
                    }
                }
            ]
        }, function () {});
        expect(map.map).not.toBe(null);
        expect(map.hashData).not.toBe(null);
        expect(map.hashData).not.toBeUndefined();
        expect(map.hashData["madrid"]).not.toBe(null);
        expect(map.hashData["madrid"][0].mapShape).not.toBe(null);
        expect(map.hashData["madrid"][0].mapShape.options).toEqual({ color: '#121280', fillColor: '#ff0033', fillOpacity: 0.8125, radius: 7, weight: 0.5 });
    });
});

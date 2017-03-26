describe("App", function () {
    var app;

    beforeEach(function () {
        app = new App();
        spyOn(XMLHttpRequest.prototype, 'open').and.callThrough();
        spyOn(XMLHttpRequest.prototype, 'send');
        var messagesPanel = document.createElement('div');
        document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(messagesPanel);
    });

    it("should be able to be created", function () {
        expect(app).not.toBe(null);
    });

    it("should call CARTO API properly via AJAX request", function() {
        var cartoFacade = new CartoFacade();
        cartoFacade.getGeoData(function () {}, function () {});
        expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
    });
});

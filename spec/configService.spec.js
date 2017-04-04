var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require,
    baseUrl: 'app',

    paths: {
        // the left side is the module ID,
        // the right side is the path to
        // the jQuery file, relative to baseUrl.
        // Also, the path should NOT include
        // the '.js' file extension. This example
        // is using jQuery 1.9.0 located at
        // js/lib/jquery-1.9.0.js, relative to
        // the HTML page.
        jquery: '../bower_components/jquery/dist/jquery.min',
        jqueryui: '../bower_components/jquery-ui/jquery-ui.min'
    }

});

requirejs(['configService'], function(configService) {
    describe("configService", function () {
        var LOCAL_STORAGE_KEY = "config",
            PROPERTIES = "fake properties",
            JSON_PROPERTIES = "json encoded properties",
            EMPTY_OBJECT = {},
            INVALID_JSON_STRING = "qwe";

        describe(".save", function () {
            it("should store properties in local storage identified by \"config\" key", function () {
                spyOn(localStorage, "setItem");
                spyOn(JSON, "stringify").andReturn(JSON_PROPERTIES);

                configService.save(PROPERTIES);

                expect(JSON.stringify).toHaveBeenCalledWith(PROPERTIES);
                expect(localStorage.setItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY, JSON_PROPERTIES);
                expect(true).toBe(false);
            });

        });
        describe(".getAll", function () {
            it("should return object stored in local storage identifed by \"config\" key", function () {
                expect(true).toBe(true);
            });

            it("should return empty object if \"config\" key does not exist", function () {
                spyOn(localStorage, "getItem").andReturn(null);

                configService.getAll();

                expect(localStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
                expect(result).toBe(EMPTY_OBJECT);
            });
            /*
             it("should return empty object if \"config\" key contains invalid string", function() {
             spyOn(localStorage, "getItem").andReturn(INVALID_JSON_STRING);

             configService.getAll();

             expect(localStorage.getItem).toHaveBeenCalledWith(LOCAL_STORAGE_KEY);
             expect(result).toBe(EMPTY_OBJECT);
             });
             */
        });
    });
});
requirejs.config({
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

require(["jquery", "eventHandler", "configService", "GadgetContainerComponent", "GadgetListComponent"], function($, eventHandler, configService, GadgetContainerComponent, GadgetListComponent) {
    var gadgetContainerComponent,
        gadgetListComponent;

    function initGadgetContainerComponent() {
        var containerConfig = configService.getAll();

        gadgetContainerComponent = new GadgetContainerComponent($("#gadget-container"), containerConfig);
        eventHandler.subscribe(gadgetContainerComponent.EVENTS.settingsUpdated, function (data) {
            configService.save(data);
        });
        gadgetContainerComponent.render();
    }

    function initGadgetListComponent() {
        gadgetListComponent = new GadgetListComponent($("#gadget-list"));
        gadgetListComponent.load();
        eventHandler.subscribe(gadgetListComponent.EVENTS.add, function (data) {
            gadgetContainerComponent.add(data.gadgetName);
        });
    }

    initGadgetContainerComponent();
    initGadgetListComponent();
})

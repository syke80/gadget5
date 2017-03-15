function Main() {
    var eventHandler,
        configService,
        gadgetContainerComponent,
        gadgetListComponent,
        gadgetLoaderService;

    function initServices() {
        eventHandler = new EventHandler();
        configService = new ConfigService();
        gadgetLoaderService = new GadgetLoaderService(eventHandler);
    }

    function initGadgetContainerComponent() {
        var containerConfig = configService.getAll();

        gadgetContainerComponent = new GadgetContainerComponent($("#gadget-container"), eventHandler, gadgetLoaderService, containerConfig);
        eventHandler.subscribe(gadgetContainerComponent.EVENTS.settingsUpdated, function (data) {
            configService.save(data);
        });
        gadgetContainerComponent.render();
    }

    function initGadgetListComponent() {
        gadgetListComponent = new GadgetListComponent($("#gadget-list"), eventHandler);
        gadgetListComponent.load();
        eventHandler.subscribe(gadgetListComponent.EVENTS.add, function (data) {
            gadgetContainerComponent.add(data.gadgetName);
        });
    }

    this.run = function() {
        initServices();
        initGadgetContainerComponent();
        initGadgetListComponent();
    }
}
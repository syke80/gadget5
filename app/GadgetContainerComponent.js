function GadgetContainerComponent($containerElement, eventHandler, gadgetLoaderService, config) {
    var instance = this,
        gadgets = [];

    this.EVENTS = {
        settingsUpdated: "GadgetContainerComponent-settingsUpdated"
    }

    this.eventHandler = eventHandler;

    function getClassByGadgetName(name) {
        var className = name + "Gadget",
            requiredClass = window[className];

        return requiredClass;
    }

    function getGadgetIndex(gadgetInstance) {
        var index;
        for (i in gadgets) {
            if (!!gadgets[i] && gadgets[i].instance === gadgetInstance) {
                index = i;
            }
        }

        return index;
    }

    function onGadgetClose(data, gadgetInstanceToRemove) {
        var indexOfItemToRemove,
            i;

        indexOfItemToRemove = getGadgetIndex(gadgetInstanceToRemove);
        gadgetInstanceToRemove.getContainerElement().remove();
        gadgets[indexOfItemToRemove] = null;
    }

    function onGadgetSettingsUpdated(data, gadgetInstance) {
        var index = getGadgetIndex(gadgetInstance),
            dataToStore = {
                id: index,
                config: {
                    name: gadgets[index].name,
                    coordinates: {
                        x: 1,
                        y: 2
                    },
                    gadgetConfig: gadgetInstance.getConfig()
                }
            }
        eventHandler.trigger(instance.EVENTS.settingsUpdated, dataToStore);
    }

    function renderItem(gadget) {
        var $gadgetElement,
            assetsDirectory;

        if (gadget === null) {
            return;
        }

        $gadgetElement = $("<div class=\"gadget\"></div>");
        gadgetLoaderService.getClassByGadgetName(gadget.name).done(
            function(GadgetClass) {
                assetsDirectory = gadgetLoaderService.getAssetsDirectory(gadget.name);
                gadget.instance = new GadgetClass($gadgetElement, assetsDirectory, eventHandler);
                eventHandler.subscribe(gadget.instance.EVENTS.close, onGadgetClose);
                eventHandler.subscribe(gadget.instance.EVENTS.settingsUpdated, onGadgetSettingsUpdated);
                gadget.instance.render();
                $containerElement.append($gadgetElement);
                $gadgetElement.draggable({
                    snap: true,
                    containment: $containerElement
                });
            }
        );
    }

    function renderAllItems() {
        $containerElement.html("");

        gadgets.forEach( function(gadget) {
            renderItem(gadget);
        })
    }

    function loadGadgetsFromConfig() {
        var i,
            gadget;
        for (i in config) {
            
        }

    }

    this.initialize = function() {
        this.render();
    }

    this.add = function(gadgetName) {
        var newGadget = {
            name: gadgetName,
            instance: null
        }
        gadgets.push(newGadget);
        this.render();
    }

    this.render = function() {
        renderAllItems();
    }

    this.initialize();
}
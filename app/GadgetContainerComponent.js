define(["jquery", "jqueryui", "eventHandler", "gadgetLoaderService"], function($, jQueryUi, eventHandler, gadgetLoaderService) {
    var GadgetContainerComponent = function($containerElement, config) {
        var instance = this,
            gadgetInstances = [];

        this.EVENTS = {
            settingsUpdated: "GadgetContainerComponent-settingsUpdated"
        }

        function onGadgetClose(data, gadgetInstanceToRemove) {
            var indexOfItemToRemove,
                i;

            indexOfItemToRemove = gadgetInstances.indexOf(gadgetInstanceToRemove);
            gadgetInstanceToRemove.getContainerElement().remove();
            gadgetInstances[indexOfItemToRemove] = null;

            triggerUpdatedEvent();
        }

        function getGadgetNameByClassName(className) {
            var gadgetName = className;

                if (className.lastIndexOf("Gadget") !== -1) {
                    gadgetName = className.slice(0, className.lastIndexOf("Gadget"));
                    gadgetName = gadgetName.charAt(0).toLowerCase() + gadgetName.slice(1);
                }

            return gadgetName;
        }

        function getGadgetsCoordinates(gadgetInstance) {
            var element = gadgetInstance.getContainerElement();
            return {
                top: element.css("top"),
                left: element.css("left")
            }
        }

        function triggerUpdatedEvent() {
            // TODO: is it possible to save modified gadget only?
            var gadgetContainerItemConfig,
                gadgetContainerConfig,
                i;

            gadgetContainerConfig = [];
            for (i in gadgetInstances) {
                if (gadgetInstances[i] != null) {
                    gadgetContainerItemConfig = {
                        id: i,
                        name: getGadgetNameByClassName(gadgetInstances[i].constructor.name),
                        coordinates: getGadgetsCoordinates(gadgetInstances[i]),
                        gadgetConfig: gadgetInstances[i].getConfig()
                    }
                    gadgetContainerConfig.push(gadgetContainerItemConfig);
                }
            }

            eventHandler.trigger(instance.EVENTS.settingsUpdated, gadgetContainerConfig);
        }

        function onGadgetSettingsUpdated(data, gadgetInstance) {
            triggerUpdatedEvent();  // TODO: could be called with instance, and could be updated the related data in config
        }

        function renderItem(gadgetContainerConfig) {
            var deferred = new $.Deferred(),
                assetsDirectory,
                gadgetInstance,
                $gadgetElement;

            if (!gadgetContainerConfig || !gadgetContainerConfig.name) {
                throw new Error("Nothing to render");
            }

            $gadgetElement = $("<div class=\"gadget\"></div>");
            $gadgetElement.addClass("gadget--name--" + gadgetContainerConfig.name);
            gadgetLoaderService.getClassByGadgetName(gadgetContainerConfig.name).done(
                function(GadgetClass) {
                    assetsDirectory = gadgetLoaderService.getAssetsDirectory(gadgetContainerConfig.name);
                    gadgetInstance = new GadgetClass($gadgetElement, assetsDirectory, gadgetContainerConfig.gadgetConfig);

                    eventHandler.subscribe(gadgetInstance.EVENTS.close, onGadgetClose);
                    eventHandler.subscribe(gadgetInstance.EVENTS.settingsUpdated, onGadgetSettingsUpdated);

                    gadgetInstance.render();

                    $containerElement.append($gadgetElement);
                    $gadgetElement.draggable({
                        snap: true,
                        containment: "window",
                        stop: function() { onStopDragging() }
                    });

                    deferred.resolve(gadgetInstance, gadgetContainerConfig);
                }
            );

            return deferred;
        }

        function onStopDragging() {
            triggerUpdatedEvent();
        }

        function renderGadgetsInConfig() {
            var i,
                itemConfig;

            for (i in config) {
                itemConfig = config[i];
                renderItem(itemConfig).done(
                    function(gadgetInstance, gadgetContainerConfig) {
                        gadgetInstances.push(gadgetInstance);
                        gadgetInstance.getContainerElement().css(gadgetContainerConfig.coordinates);
                    }
                );
            }
        }

        this.add = function(gadgetName) {
            renderItem({name: gadgetName}).done(
                function(gadgetInstance) {
                    gadgetInstances.push(gadgetInstance);
                    triggerUpdatedEvent();
                }
            );
        }

        this.render = function() {
            renderGadgetsInConfig();
        }
    }

    return GadgetContainerComponent;
})
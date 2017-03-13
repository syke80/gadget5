function GadgetListComponent(containerElement, eventHandler) {
    var instance = this,
        containerElement = containerElement,
        eventHandler = eventHandler;

    this.EVENTS = {
            add: "GadgetListComponent-add"
        };

    var renderList = function(gadgetList) {
        var newItem;

        containerElement.html("");

        gadgetList.forEach( function(gadgetName) {
            newItem = $("<button class=\"gadget-list__item\"><img src=\"gadgets/" + gadgetName + "/icon.png\"></button>");
            newItem.click( function() {
                eventHandler.trigger(instance.EVENTS.add, { gadgetName: gadgetName });
            });
            containerElement.append(newItem);
        });
    }

    this.load = function() {
        $.get({
            url: "./gadgetlist.php",
            context: this
        }).done(
            function(gadgetList) {
                renderList(gadgetList);
            }
        );
    }
}

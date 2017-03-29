define(["GadgetComponent"], function(GadgetComponent) {
    var Dummy1Gadget = function($containerElement, assetsDirectory, config) {
        GadgetComponent.call(this, $containerElement, assetsDirectory, config); // call super constructor.

        this.renderUserPage = function() {
            this.$userPageContainerElement.html("Dummy 1 gadget content");
        }
    }

    Dummy1Gadget.prototype = Object.create(GadgetComponent.prototype);
    Dummy1Gadget.prototype.constructor = Dummy1Gadget;

    return Dummy1Gadget;
})
function Dummy1Gadget($containerElement, assetsDirectory, eventHandler, config) {
    GadgetComponent.call(this, $containerElement, assetsDirectory, eventHandler, config); // call super constructor.

    this.renderUserPage = function($userPageContainerElement) {
        $userPageContainerElement.html("Dummy 1 gadget content");
    }
}

Dummy1Gadget.prototype = Object.create(GadgetComponent.prototype);
Dummy1Gadget.prototype.constructor = Dummy1Gadget;

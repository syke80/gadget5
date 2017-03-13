function Dummy2Gadget($containerElement, assetsDirectory, eventHandler, config) {
    GadgetComponent.call(this, $containerElement, assetsDirectory, eventHandler, config); // call super constructor.

    $.extend(this.defaultConfig, {
        size: {
            width: 3,
            height: 2
        },
        prop1: 3,
        prop2: "qwe",
        prop3: "asd",
        prop4: "zzx",
        prop5: 2,
        prop6: true
    });

    this.config = config || this.defaultConfig;

    this.renderUserPage = function($userPageContainerElement) {
        $userPageContainerElement.load(assetsDirectory + "/gadget.html");
    }

    this.renderSettingsPage = function($settingsPageContainerElement) {
        $settingsPageContainerElement.load(assetsDirectory + "/settings.html");
    }
}

Dummy2Gadget.prototype = Object.create(GadgetComponent.prototype);
Dummy2Gadget.prototype.constructor = Dummy2Gadget;


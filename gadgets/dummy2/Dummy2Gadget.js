define(["GadgetComponent"], function(GadgetComponent) {
    var Dummy2Gadget = function($containerElement, assetsDirectory, config) {
        GadgetComponent.call(this, $containerElement, assetsDirectory, config); // call super constructor.

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
            this.$userPageContainerElement.load(assetsDirectory + "/gadget.html");
        }

        this.renderSettingsPage = function($settingsPageContainerElement) {
            this.$settingsPageContainerElement.load(assetsDirectory + "/settings.html");
        }
    }

    Dummy2Gadget.prototype = Object.create(GadgetComponent.prototype);
    Dummy2Gadget.prototype.constructor = Dummy2Gadget;

    return Dummy2Gadget;
})
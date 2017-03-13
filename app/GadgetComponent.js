function GadgetComponent($containerElement, assetsDirectory, eventHandler, config) {
    var UNIT_SIZE = 95,
        USER_PAGE_CLASS = "gadget--user-page-view",
        SETTINGS_PAGE_CLASS = "gadget--settings-page-view",
        instance = this,
        renderButtons,
        onCloseButtonClick,
        onOpenSettingsPageButtonClick,
        onCloseSettingsPageButtonClick,
        showUserPage,
        showSettingsPage;

    this.EVENTS = GadgetComponent.EVENTS;
    this.config = {};
    this.defaultConfig = {
        size: {
            width: 1,
            height: 1
        }
    };

    renderButtons = function($buttonsContainerElement) {
        var $closeButton,
            $openSettingsPageButton,
            $closeSettingsPageButton;

        $closeButton = $("<button class=\"gadget__button gadget__button--close\">Close gadget</button>");
        $closeButton.click(function () {
            onCloseButtonClick();
        });
        $openSettingsPageButton = $("<button class=\"gadget__button gadget__button--open-settings\">Open settings</button>");
        $openSettingsPageButton.click(function () {
            onOpenSettingsPageButtonClick();
        });
        $closeSettingsPageButton = $("<button class=\"gadget__button gadget__button--close-settings\">Close settings</button>");
        $closeSettingsPageButton.click(function () {
            onCloseSettingsPageButtonClick();
        });
        $buttonsContainerElement.append($openSettingsPageButton, $closeSettingsPageButton, $closeButton);
    }

    onCloseButtonClick = function() {
        eventHandler.trigger(instance.EVENTS.close, {}, instance);
    }

    onOpenSettingsPageButtonClick = function() {
        instance.setDataOnSettingsPage();
        showSettingsPage();
    }

    onCloseSettingsPageButtonClick = function() {
        instance.collectDataFromSettingsPage();
        eventHandler.trigger(instance.EVENTS.settingsUpdated, {}, instance);
        showUserPage();
    }

    showUserPage = function() {
        $containerElement.addClass(USER_PAGE_CLASS).removeClass(SETTINGS_PAGE_CLASS);
    }

    showSettingsPage = function() {
        $containerElement.addClass(SETTINGS_PAGE_CLASS).removeClass(USER_PAGE_CLASS);
    }

    this.initialize = function() {
        this.config = config || this.defaultConfig;
        showUserPage();
        console.log("access static from this", GadgetComponent.staticProp);
    }

    this.getConfig = function() {
        return this.config;
    }

    this.render = function() {
        var $buttonsContainerElement,
            $userPageContainerElement,
            $settingsPageContainerElement;

        $containerElement.width(this.config.size.width * UNIT_SIZE);
        $containerElement.height(this.config.size.height * UNIT_SIZE);

        $buttonsContainerElement = $("<section class=\"gadget__actions\"></section>");
        $userPageContainerElement = $("<section class=\"gadget__user-page\"></section>");
        $settingsPageContainerElement = $("<section class=\"gadget__settings-page\"></section>");

        renderButtons($buttonsContainerElement);
        this.renderUserPage($userPageContainerElement);
        this.renderSettingsPage($settingsPageContainerElement);

        $containerElement.html("");
        $containerElement.append($buttonsContainerElement, $userPageContainerElement, $settingsPageContainerElement);

        showUserPage();
    }

    this.renderUserPage = function($userPageContainerElement) {
        $userPageContainerElement.html("gadget default content");
    }

    this.renderSettingsPage = function($settingsPageContainerElement) {
        $settingsPageContainerElement.html("default settings page");
    }

    this.getContainerElement = function() {
        return $containerElement;
    }

    function updateExistingPropertyInConfig(propertyName, value) {
        if (propertyName in instance.config) {
            instance.config[propertyName] = value;
        }
    }

    this.setDataOnSettingsPage = function() {
        var name,
            value,
            $inputElement;

        $("select, textarea, input[type=text], input:not([type]), input[type=radio], input[type=checkbox]", $containerElement).each( function(index, inputElement) {
            $inputElement = $(inputElement);
            name = $inputElement.attr("name");
            value = instance.config[name];

            if (($inputElement).is(':checkbox')) {
                if (value === null) {
                    value = false;
                }
                $inputElement.prop("checked", value);
            } else if (($inputElement).is(':radio')) {
                if ($inputElement.val() == value) {
                    $inputElement.prop("checked", true);
                } else {
                    $inputElement.prop("checked", false);
                }
            } else {
                $inputElement.val(value);
            }
        });
    }

    this.collectDataFromSettingsPage = function() {
        var name,
            value,
            $inputElement;

        $("select, textarea, input[type=text], input:not([type]), input[type=radio]:checked, input[type=checkbox]", $containerElement).each( function(index, inputElement) {
            $inputElement = $(inputElement);
            name = $inputElement.attr("name");
            if (($inputElement).is(':checkbox')) {
                value = $inputElement.prop("checked") ? true : false;
            } else {
                value = $inputElement.val();
            }

            updateExistingPropertyInConfig(name, value);
        });
    }

    this.initialize();
}

GadgetComponent.EVENTS = {
    close: "GadgetComponent-close",
    settingsUpdated: "GadgetComponent-settingsUpdated",
    userPageLoaded: "GadgetComponent-userPageLoaded",
    settingsPageLoaded: "GadgetComponent-settingsPageLoaded"
}
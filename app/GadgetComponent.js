define(["eventHandler"], function(eventHandler) {

    var GadgetComponent = function($containerElement, assetsDirectory, config) {
        var UNIT_SIZE = 95,
            USER_PAGE_CLASS = "gadget--user-page-view",
            SETTINGS_PAGE_CLASS = "gadget--settings-page-view",
            instance = this;

        this.$buttonsContainerElement = null;
        this.$userPageContainerElement = null;
        this.$settingsPageContainerElement = null;

        this. EVENTS = {
            close: "GadgetComponent-close",
            settingsUpdated: "GadgetComponent-settingsUpdated",
            userPageLoaded: "GadgetComponent-userPageLoaded",
            settingsPageLoaded: "GadgetComponent-settingsPageLoaded"
        };

        this.config = {};

        this.defaultConfig = {
            size: {
                width: 1,
                height: 1
            }
        };

        function updateExistingPropertyInConfig(propertyName, value) {
            if (propertyName in instance.config) {
                instance.config[propertyName] = value;
            }
        }

        function renderButtons() {
            var $buttonsContainerElement = instance.$buttonsContainerElement,
                $closeButton,
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

        function onCloseButtonClick() {
            eventHandler.trigger(instance.EVENTS.close, {}, instance);
        }

        function onOpenSettingsPageButtonClick() {
            instance.setDataOnSettingsPage();
            showSettingsPage();
        }

        function onCloseSettingsPageButtonClick() {
            instance.collectDataFromSettingsPage();
            eventHandler.trigger(instance.EVENTS.settingsUpdated, {}, instance);
            showUserPage();
        }

        function showUserPage() {
            $containerElement.addClass(USER_PAGE_CLASS).removeClass(SETTINGS_PAGE_CLASS);
        }

        function showSettingsPage() {
            $containerElement.addClass(SETTINGS_PAGE_CLASS).removeClass(USER_PAGE_CLASS);
        }

        this.initialize = function() {
            this.config = config || this.defaultConfig;
            showUserPage();
        }

        this.getConfig = function() {
            return this.config;
        }

        this.render = function() {
            $containerElement.width(this.config.size.width * UNIT_SIZE);
            $containerElement.height(this.config.size.height * UNIT_SIZE);

            this.$buttonsContainerElement = $("<section class=\"gadget__actions\"></section>");
            this.$userPageContainerElement = $("<section class=\"gadget__user-page\"></section>");
            this.$settingsPageContainerElement = $("<section class=\"gadget__settings-page\"></section>");

            renderButtons();
            this.renderUserPage();
            this.renderSettingsPage();

            $containerElement.html("");
            $containerElement.append(this.$buttonsContainerElement, this.$userPageContainerElement, this.$settingsPageContainerElement);

            showUserPage();
        }

        this.renderUserPage = function() {
            this.$userPageContainerElement.html("gadget default content");
        }

        this.renderSettingsPage = function($settingsPageContainerElement) {
            this.$settingsPageContainerElement.html("default settings page");
        }

        this.getContainerElement = function() {
            return $containerElement;
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

    return GadgetComponent;
})
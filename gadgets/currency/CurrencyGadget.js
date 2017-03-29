define(["GadgetComponent"], function(GadgetComponent) {
    var CurrencyGadget = function($containerElement, assetsDirectory, config) {
        var instance = this,
            EVENTS = {
                USER_PAGE_LOADED: "1",
                SETTINGS_PAGE_LOADED: "2",
                CURRENCIES_FETCHED: "3",
                CURRENCY_VALUE_TYPED: "4"
            },
            isSettingsPageLoaded = false,
            isCurrenciesFetched = false,
            isUserPageLoaded = false,
            $eventHandler = $(this),
            availableCurrencies = [];

        GadgetComponent.call(this, $containerElement, assetsDirectory, config); // call super constructor.

        $.extend(this.defaultConfig, {
            size: {
                width: 3,
                height: 3
            },
            currencies: []
        });

        this.config = config || this.defaultConfig;

        function attachSettingsPageEvents() {
            var selectedCurrency;
            $("form", this.$settingsPageContainerElement).submit( function(event) {
                event.preventDefault();
                $targetElement = $(event.target);
                selectedCurrency = $("select[name=currency]", $targetElement).val()
                if (!!selectedCurrency) {
                    instance.config.currencies.push(selectedCurrency);
                }
                renderCurrencyListOnSettingsPage();
                renderCurrencyListOnUserPage();
            });
        }

        this.onSettingsPageLoaded = function() {
            attachSettingsPageEvents();
            renderCurrencyListOnSettingsPage();
            renderDynamicElementsIfPossible();
        }

        this.onUserPageLoaded = function() {
            renderCurrencyListOnUserPage();
        }

        $eventHandler.on(EVENTS.SETTINGS_PAGE_LOADED, function() {
            isSettingsPageLoaded = true;
            this.onSettingsPageLoaded();
        });

        $eventHandler.on(EVENTS.CURRENCIES_FETCHED, function() {
            isCurrenciesFetched = true;
        });

        $eventHandler.on(EVENTS.USER_PAGE_LOADED, function() {
            isUserPageLoaded = true;
            this.onUserPageLoaded();
        });

        $eventHandler.on(EVENTS.CURRENCIES_FETCHED, function() {
            renderDynamicElementsIfPossible();
        });

        getAvailableCurrencies();

        this.renderUserPage = function() {
            this.$userPageContainerElement.load(assetsDirectory + "/gadget.html", function() {
                $eventHandler.trigger(EVENTS.USER_PAGE_LOADED);
            });
        }

        this.renderSettingsPage = function() {
            this.$settingsPageContainerElement.load(assetsDirectory + "/settings.html", function() {
                $eventHandler.trigger(EVENTS.SETTINGS_PAGE_LOADED);
            });
        }

        function convertResponseToCurrencies(response) {
            var currencies = [],
                i;

            response = response.Cube.Cube.Cube;

            currencies.push( {
                name: "EUR",
                rate: 1
            });

            for (i in response) {
                currencies.push( {
                    name: response[i]["-currency"],
                    rate: response[i]["-rate"]
                });
            }

            return currencies;
        }

        function getAvailableCurrencies() {
            $.ajax({
                url: "currency-mock.json",
                success: function(data) {
                    availableCurrencies = convertResponseToCurrencies(data);
                    $eventHandler.trigger(EVENTS.CURRENCIES_FETCHED);
                }
            });
            /*
            $.ajax({
                url:  "interface.php",
                type: "GET",
                data: {
                    type:    "xml",
                    cache:   "currency",
                    expires: "3600",
                    url:     "http://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"
                },
                success: function(data) {
                    var currencyList = data["Cube"]["Cube"]["Cube"];
                    var eur = new Array();
                    eur["@attributes"] = new Array();
                    eur["@attributes"]["currency"] = "EUR";
                    eur["@attributes"]["rate"] = "1";
                    currencyList.push(eur);
                    currencyList.sort( function(a,b) {return a["@attributes"]["currency"] > b["@attributes"]["currency"] } );

                    for (i in currencyList) {
                        currencyDB[currencyList[i]["@attributes"]["currency"]] = currencyList[i]["@attributes"]["rate"];
                    }
                    if (callback !== undefined) callback();
                },
                dataType: "json",
            });
            */

        }

        function removeCurrency(index) {
            instance.config.currencies[index] = null;
        }

        function getRate(currencyName) {
            var i;

            for (i in availableCurrencies) {
                if (availableCurrencies[i].name == currencyName) {
                    return availableCurrencies[i].rate;
                }
            }

            return null;
        }

        function updateValue(listenerData, triggerData) {
            if (listenerData.index == triggerData.index) {
                return;
            }
            /*
            listenerData.$item
            listenerData.index
            */
            var valueInEuro = triggerData.currencyName === "EUR" ? triggerData.value : triggerData.value / getRate(triggerData.currencyName),
                valueInRequiredCurrency = valueInEuro * getRate(listenerData.currencyName);
            $("input", listenerData.$item).val(valueInRequiredCurrency);
        }

        function renderCurrencyListOnUserPage() {
            var $currencyListContainer = $(".currencies", instance.$userPageContainerElement),
                currencyName,
                i;

            $currencyListContainer.html("");
            for (i in instance.config.currencies) {
                currencyName = instance.config.currencies[i];
                if (!!currencyName) {
                    $item = $("<li><label>" + currencyName + "<input></label></li>");
                    $item.attr("data-currency", currencyName);
                    $item.keyup({index: i, currencyName: currencyName}, function(event) {
                        var value = $(event.target).val();
                        $eventHandler.trigger(EVENTS.CURRENCY_VALUE_TYPED, {index: event.data.index, currencyName: event.data.currencyName, value: value });
                    });
                    $eventHandler.on(EVENTS.CURRENCY_VALUE_TYPED, {index: i, currencyName: currencyName, $item: $item}, function(event, triggerData) {
                        updateValue(event.data, triggerData);
                    });
                    $("button", $item).click({index: i}, function (event) {
                        removeCurrency(event.data.index);
                        renderCurrencyListOnSettingsPage();
                    });
                    $currencyListContainer.append($item);
                }
            }
        }

        function renderCurrencyListOnSettingsPage() {
            var $currencyListContainer = $(".currencies", instance.$settingsPageContainerElement),
                currencyName,
                i;

            $currencyListContainer.html("");
            for (i in instance.config.currencies) {
                currencyName = instance.config.currencies[i];
                if (!!currencyName) {
                    $item = $("<li>" + currencyName + "<button>Remove</button></li>");
                    $("button", $item).click({index: i}, function (event) {
                        removeCurrency(event.data.index);
                        renderCurrencyListOnUserPage();
                        renderCurrencyListOnSettingsPage();
                    });
                    $currencyListContainer.append($item);
                }
            }
        }

        function renderDynamicElementsIfPossible() {
            if (isSettingsPageLoaded && isCurrenciesFetched) {
                renderDynamicElements();
            }
        }

        function renderDynamicElements() {
            var $currencyDropdownContainer = $("select[name=currency]", this.$settingsPageContainerElement),
                $item,
                i;

            $currencyDropdownContainer.html("");
            for (i in availableCurrencies) {
                $item = $("<option value=\"" + availableCurrencies[i].name + "\">" + availableCurrencies[i].name + "</option>");
                $currencyDropdownContainer.append($item);
            }
        }

    }

    CurrencyGadget.prototype = Object.create(GadgetComponent.prototype);
    CurrencyGadget.prototype.constructor = CurrencyGadget;

    return CurrencyGadget;
})
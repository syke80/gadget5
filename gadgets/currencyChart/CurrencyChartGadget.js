define(["GadgetComponent", "eventHandler"], function(GadgetComponent, appEventHandler) {
    var CurrencyChartGadget = function($containerElement, assetsDirectory, config) {
        var instance = this,
            chartImageSizeMapping = {
                'medium' : 's',
                'large' : 'm'
            },
            sizeMapping = {
                'medium': { width: 3, height: 2 },
                'large': { width: 4, height: 3 }
            };

        GadgetComponent.call(this, $containerElement, assetsDirectory, config); // call super constructor.

        $.extend(this.defaultConfig, {
            currency1: "EUR",
            currency2: "USD",
            range: "1m",
            sizeText: "medium"
        });

        this.config = config || this.defaultConfig;
        setDimensionsInConfig();

        appEventHandler.subscribe(instance.EVENTS.settingsUpdated, function (data, sourceObject) {
            if (sourceObject === instance) {
                onSettingsUpdated();
            }
        });

        function setDimensionsInConfig() {
            instance.config.size = sizeMapping[instance.config.sizeText];
        }

        function onSettingsUpdated() {
            instance.renderUserPage();
            setDimensionsInConfig();
            instance.updateDimensions();
        }

        function downloadCurrentRates() {
            var deferred = $.Deferred(),
                url = "https://query.yahooapis.com/v1/public/yql",
                yqlQuery = "select * from yahoo.finance.xchange where pair in (\"{currency1}{currency2}\")"
                    .replace("{currency1}", instance.config.currency1)
                    .replace("{currency2}", instance.config.currency2),
                getParameters = {
                    q: yqlQuery,
                    format: "json",
                    env: "store://datatables.org/alltableswithkeys",
                    callback: ""
                };

            $.get({
                url: "/gateway/",
                data: {
                    expire: "3600",
                    url: url,
                    getParameters: getParameters
                },
                success: function (data) {
                    deferred.resolve({
                        ask: parseFloat(data.query.results.rate.Ask).toFixed(2),
                        bid: parseFloat(data.query.results.rate.Bid).toFixed(2),
                        rate: parseFloat(data.query.results.rate.Rate).toFixed(2)
                    });
                },
                dataType: "json"
            });

            return deferred;
        }

        function downloadUserPageDynamicContent() {
            var sizeLetter = chartImageSizeMapping[instance.config.sizeText],
                chartUrl = "http://chart.finance.yahoo.com/z?s=" + instance.config.currency1 + instance.config.currency2 + "=X&t=" + instance.config.range + "&l=on&z=" + sizeLetter + "&q=l&c=";

            $("img", instance.$userPageContainerElement).attr("src", chartUrl);
        }

        this.renderUserPage = function() {
            this.$userPageContainerElement.load(assetsDirectory + "/gadget.html", function() {
                downloadUserPageDynamicContent();
                downloadCurrentRates().then( function(rate) {
                    $(".ask", instance.$userPageContainerElement).html(rate.ask);
                    $(".bid", instance.$userPageContainerElement).html(rate.bid);
                    $(".rate", instance.$userPageContainerElement).html(rate.rate);
                });
            });
        }

        this.renderSettingsPage = function() {
            this.$settingsPageContainerElement.load(assetsDirectory + "/settings.html");
        }
    }

    CurrencyChartGadget.prototype = Object.create(GadgetComponent.prototype);
    CurrencyChartGadget.prototype.constructor = CurrencyChartGadget;

    return CurrencyChartGadget;
})
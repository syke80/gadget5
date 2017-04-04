define(["GadgetComponent", "eventHandler"], function(GadgetComponent, appEventHandler) {
    var WeatherGadget = function($containerElement, assetsDirectory, config) {
        var ICONS_URL = "http://icons.wxug.com/i/c/i/",
            CELSIUS_POSTFIX = " &#8451",
            instance = this,
            sizeMapping = {
                'medium': { width: 3, height: 2 },
                'small': { width: 2, height: 2 }
            };

        GadgetComponent.call(this, $containerElement, assetsDirectory, config); // call super constructor.

        $.extend(this.defaultConfig, {
            sizeText: "medium",
            location: "???",
            cityPath: "/q/zmw:00000.3.03453"
        });

        this.config = config || this.defaultConfig;
        setDimensionsInConfig();

        appEventHandler.subscribe(instance.EVENTS.settingsUpdated, function (data, sourceObject) {
            if (sourceObject === instance) {
                onSettingsUpdated();
            }
        });

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

        function convertAutocompleteApiResponseToJqueryAutocompleteObject(apiResponse) {
            var convertedData = [],
                i;

            if (!!apiResponse.RESULTS) {
                for (i in apiResponse.RESULTS) {
                    convertedData.push({
                        label: apiResponse.RESULTS[i].name,
                        value: apiResponse.RESULTS[i].name,
                        cityPath: apiResponse.RESULTS[i].l
                    });
                }
            }

            return convertedData;
        }

        function initializeAutocomplete() {
            $("input[name=location]", instance.$settingsPageContainerElement).autocomplete({
                position: {
                    my: "right top",
                    at: "right bottom"
                },
                appendTo: instance.$settingsPageContainerElement,
                source: function (request, response) {
                    $.get({
                        url: "gateway/",
                        data: {
                            url: "http://autocomplete.wunderground.com/aq",
                            getParameters: {
                                query: request.term
                            }
                        },
                        success: function (data) {
                            response(convertAutocompleteApiResponseToJqueryAutocompleteObject(data));
                        },
                        dataType: "json"
                    });
                },
                select: function (event, ui) {
                    instance.config.cityPath = ui.item.cityPath;
                    //$("input[name=location]", instance.$settingsPageContainerElement).val(ui.item.label);
                }
            });
        }

        function showCurrentWeather(data) {
            $(".current .wind img", instance.$userPageContainerElement)
                .css("transform", "rotate("+data.wind_degrees + "deg)")
                .attr("src", assetsDirectory + "/images/arrow.png");
            $(".current img.icon", instance.$userPageContainerElement).attr("src", ICONS_URL + data.icon + ".gif");
            $(".current .temp", instance.$userPageContainerElement).html(data.temp_c + CELSIUS_POSTFIX);
            $(".current .feelslike", instance.$userPageContainerElement).html(data.feelslike_c + CELSIUS_POSTFIX);
            $(".current .city", instance.$userPageContainerElement).html(data.display_location.city);
            $(".current .state_name", instance.$userPageContainerElement).html(data.display_location.state_name);
            $(".current .wind", instance.$userPageContainerElement).attr("data-degrees", data.wind_degrees + "deg");
            $(".current .wind .value", instance.$userPageContainerElement).html(data.wind_kph + " km/h");
        }

        function renderOneDayForecast(forecast, daytimeForecastText) {
            var dayShortName = daytimeForecastText.title.substr(0, 3),
                html,
                $element;

            html = "<div class=\"day\"><span class=\"high\"></span><span class=\"low\"></span><span class=\"name\"></span><span class=\"name-short\"></span><img class=\"icon\"></div>";
            $element = $(html);
            $(".high", $element).html(forecast.high.celsius + "&deg;");
            $(".low", $element).html(forecast.low.celsius + "&deg;");
            $(".name", $element).html(daytimeForecastText.title);
            $(".name-short", $element).html(dayShortName);
            $(".icon", $element).attr("src", "http://icons.wxug.com/i/c/i/" + forecast["icon"] + ".gif");

            return $element;
        }

        function showForecast(data) {
            var forecasts = data.simpleforecast.forecastday,
                forecastTexts = data.txt_forecast.forecastday,
                forecast,
                $oneDayForecast,
                daytimeForecastText,
                i;

            $(".forecast", instance.$userPageContainerElement).html("");

            for (i in forecasts) {
                forecast = forecasts[i];
                daytimeForecastText = forecastTexts[i*2];
                $oneDayForecast = renderOneDayForecast(forecast, daytimeForecastText);
                $(".forecast", instance.$userPageContainerElement).append($oneDayForecast);
            }
        }

        function showContentOnUserPage(data) {
            if (data.current_observation !== undefined) {
                showCurrentWeather(data.current_observation);
            }
            if (data.forecast !== undefined) {
                showForecast(data.forecast);
            }
        }

        function updateContentOnUserPage() {
            var apiUrl = "http://api.wunderground.com/api/52b0a04ba935dba7/conditions/forecast10day" + instance.config.cityPath + ".json";
            $.get({
                url: "gateway/",
                data: {
                    expires: "3600",
                    url: apiUrl
                },
                success: function (data) {
                    showContentOnUserPage(data);
/*
                    if (info['current_observation'] !== undefined) {
                        $(".current .icon", $obj).attr("src", "http://icons.wxug.com/i/c/i/" + info['current_observation']['icon'] + ".gif");
                        $(".current .temp", $obj).html(info['current_observation']['temp_c'] + " &#8451;");
                        $(".current .feelslike", $obj).html(info['current_observation']['feelslike_c'] + " &#8451;");
                        $(".current .city", $obj).html(info['current_observation']['display_location']['city']);
                        $(".current .state_name", $obj).html(info['current_observation']['display_location']['state_name']);
                        //$(".current .wind img", $obj).rotate(info['current_observation']['wind_degrees']);
                        $(".current .wind", $obj).attr("data-degrees", info['current_observation']['wind_degrees'] + "deg");
                        $(".current .wind .value", $obj).html(info['current_observation']['wind_kph'] + " km/h");
                        var forecast;
                        var line;
                        $(".forecast", $obj).html("");
                        for (i in info['forecast']['simpleforecast']['forecastday']) {
                            forecast = info['forecast']['simpleforecast']['forecastday'][i];
                            txt_day = info['forecast']['txt_forecast']['forecastday'][i * 2];
                            txt_night = info['forecast']['txt_forecast']['forecastday'][i * 2 + 1];
                            line = "<div class=\"day day" + i + "\">";
                            line += "<span class=\"high\">" + forecast["high"]["celsius"] + " &deg;</span>";
                            line += "<span class=\"low\">" + forecast["low"]["celsius"] + " &deg;</span>";
                            line += "<span class=\"name\">" + txt_day["title"] + "</span>";
                            line += "<span class=\"name_short\"><span class=\"bg\"></span>" + txt_day["title"].substr(0, 3) + "</span>";
                            line += "<img class=\"icon\" src=\"http://icons.wxug.com/i/c/i/" + forecast["icon"] + ".gif\" />";
                            line += "</div>";
                            $(".forecast", $obj).append(line);
                        }
                    }
                    */
                }
            });
        }



        this.renderUserPage = function() {
            this.$userPageContainerElement.load(assetsDirectory + "/gadget.html", function() {
                updateContentOnUserPage();
            });
        }

        this.renderSettingsPage = function() {
            this.$settingsPageContainerElement.load(assetsDirectory + "/settings.html", function() {
                initializeAutocomplete();
            });
        }
    }

    WeatherGadget.prototype = Object.create(GadgetComponent.prototype);
    WeatherGadget.prototype.constructor = WeatherGadget;

    return WeatherGadget;
})

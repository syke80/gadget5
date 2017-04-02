define(["eventHandler"], function(eventHandler) {
    var GADGETS_DIRECTORY_RELATIVE = "../gadgets",
        GADGETS_DIRECTORY = "gadgets",
        loadedGadgets = [],
        gadgetLoaderService;

    function getGadgetClassNameFromDirName(dirName) {
        return dirName.charAt(0).toUpperCase() + dirName.slice(1) + "Gadget";
    }

    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function loadCssIfExists(url) {
        $.ajax({
            url: url,
            type: 'HEAD',
            success: function () {
                loadCss(url);
            }
        });
    }

    function isLoaded(name) {
        return loadedGadgets.indexOf(name) !== -1;
    }

    gadgetLoaderService = {
        EVENTS: {
            classLoaded: "GadgetLoaderService-classLoaded"
        },

        getClassByGadgetName: function(name) {
            var deferred = $.Deferred(),
                actualGadgetDirectoryRelative = GADGETS_DIRECTORY_RELATIVE + "/" + name,
                requiredCssFilename =  actualGadgetDirectoryRelative + "/" + "styles.css",
                requiredClassFilename = actualGadgetDirectoryRelative + "/" + getGadgetClassNameFromDirName(name);

            require([requiredClassFilename], function(requiredClass) {
                if (!isLoaded(name)) {
                    loadedGadgets.push(name);
                    loadCssIfExists(requiredCssFilename);
                }
                deferred.resolve(requiredClass);
            });

            return deferred;
        },

        getAssetsDirectory: function(name) {
            return GADGETS_DIRECTORY + "/" + name;
        }
    }

    return gadgetLoaderService;
})
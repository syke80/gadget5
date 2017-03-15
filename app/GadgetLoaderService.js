function GadgetLoaderService(eventHandler) {
    var instance = this,
        GADGETS_DIRECTORY = "gadgets",
        STATUS = {
            loading: 1,
            loaded: 2,
            failed: 3
        },
        loadedGadgets = [];

    this.EVENTS = {
        classLoaded: "GadgetLoaderService-classLoaded"
    }

    function resolvePendingClassRequire(data, sourceObject, sourceData) {
        if (data.name === sourceData.name) {
            sourceData.deferred.resolve();
        }
    }

    function getGadgetClassNameFromDirName(dirName) {
        return dirName.charAt(0).toUpperCase() + dirName.slice(1) + "Gadget";
    }

    function loadClassIfNeeded(name) {
        var deferred = $.Deferred(),
            scriptFilename;

        if (loadedGadgets[name] === STATUS.loaded) {
            deferred.resolve();
        } else if (loadedGadgets[name] === STATUS.loading) {
            eventHandler.subscribe(instance.EVENTS.classLoaded, resolvePendingClassRequire, {
                name: name,
                deferred: deferred
            });
        }
        else {
            loadedGadgets[name] = STATUS.loading;

            scriptFilename = GADGETS_DIRECTORY + "/" + name + "/" + getGadgetClassNameFromDirName(name) + ".js";
            $.getScript(scriptFilename)
                .done(function () {
                    loadedGadgets[name] = STATUS.loaded;
                    eventHandler.trigger(instance.EVENTS.classLoaded, { name: name });
                    deferred.resolve();
                })
                .fail(function () {
                    loadedGadgets[name] = null;
                    loadedGadgets[name] = STATUS.failed;
                    deferred.reject();
                });
        }

        return deferred;
    }

    this.getClassByGadgetName = function(name) {
        var deferred = $.Deferred(),
            requiredClassName,
            requiredClass;

        loadClassIfNeeded(name)
            .done( function() {
                requiredClassName = getGadgetClassNameFromDirName(name);
                requiredClass = window[requiredClassName];
                deferred.resolve(requiredClass);
            })
            .fail( function() {
                deferred.reject();
            });

        return deferred;
    }

    this.getAssetsDirectory = function(name) {
        return GADGETS_DIRECTORY + "/" + name;
    }
}
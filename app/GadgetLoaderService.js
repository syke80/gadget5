function GadgetLoaderService() {
    var GADGETS_DIRECTORY = "gadgets",
        STATUS = {
            loading: 1,
            loaded: 2,
            failed: 3
        },
        loadedGadgets = [],
        loadClassIfNeeded,
        getGadgetClassNameFromDirName;

    getGadgetClassNameFromDirName = function(dirName) {
        return dirName.charAt(0).toUpperCase() + dirName.slice(1) + "Gadget";
    }

    loadClassIfNeeded = function(name) {
        var deferred = $.Deferred(),
            scriptFilename;

        if (!!loadedGadgets[name]) {
            deferred.resolve();
        }
        else {
            loadedGadgets[name] = STATUS.loading;

            scriptFilename = GADGETS_DIRECTORY + "/" + name + "/" + getGadgetClassNameFromDirName(name) + ".js";
            $.getScript(scriptFilename)
                .done(function () {
                    loadedGadgets[name] = STATUS.loaded;
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
            requiredClass;

        loadClassIfNeeded(name)
            .done( function() {
                requiredClass = window[getGadgetClassNameFromDirName(name)];
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
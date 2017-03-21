define(["eventHandler"], function(eventHandler) {
    var GADGETS_DIRECTORY_RELATIVE = "../gadgets",
        GADGETS_DIRECTORY = "gadgets",
        gadgetLoaderService;

    function getGadgetClassNameFromDirName(dirName) {
        return dirName.charAt(0).toUpperCase() + dirName.slice(1) + "Gadget";
    }

    gadgetLoaderService = {
        EVENTS: {
            classLoaded: "GadgetLoaderService-classLoaded"
        },

        getClassByGadgetName: function(name) {
            var deferred = $.Deferred(),
                requiredClassFilename;

            requiredClassFilename = GADGETS_DIRECTORY_RELATIVE + "/" + name + "/" + getGadgetClassNameFromDirName(name);
            require([requiredClassFilename], function(requiredClass) {
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
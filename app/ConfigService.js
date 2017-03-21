define( function() {
    var configService = {
        LOCAL_STORAGE_KEY: "config",

        save: function(properties) {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(properties));
        },

        getAll: function() {
            var serializedConfig = localStorage.getItem(this.LOCAL_STORAGE_KEY) || "{}",
                config =  JSON.parse(serializedConfig);
            return config;
        }
    }

    return configService;
})
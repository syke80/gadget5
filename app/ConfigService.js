function ConfigService() {
/*
    this.save = function(id, properties) {
        var serializedConfig = localStorage.getItem("config") || "{}",
            config =  JSON.parse(serializedConfig);
        config[id] = properties;
        localStorage.setItem("config", JSON.stringify(config));
    }
*/
    this.save = function(properties) {
        localStorage.setItem("config", JSON.stringify(properties));
    }

    this.getAll = function() {
        var serializedConfig = localStorage.getItem("config") || "{}",
            config =  JSON.parse(serializedConfig);
        return config;
    }
}
function ConfigService() {
    this.save = function(id, properties) {
        var serializedConfig = localStorage.getItem("config") || "{}",
            config =  JSON.parse(serializedConfig);
        config[id] = properties;
        localStorage.setItem("config", JSON.stringify(config));
    }

    this.getAll = function(id, properties) {
        var serializedConfig = localStorage.getItem("config") || "{}",
            config =  JSON.parse(serializedConfig);
        config[id] = properties;
        localStorage.setItem("config", JSON.stringify(config));
    }
}
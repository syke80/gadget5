function ConfigService() {
    this.save = function(properties) {
        localStorage.setItem("config", JSON.stringify(properties));
    }

    this.getAll = function() {
        var serializedConfig = localStorage.getItem("config") || "{}",
            config =  JSON.parse(serializedConfig);
        return config;
    }
}
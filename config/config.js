var env = require('./env');

var configFunctions = {
    env: function(variable) {
        var node_env = process.env.NODE_ENV || 'development';
        if (!env[node_env][variable]) {
            throw new Error("config.env: Missing environment variable! " + node_env + " " + variable);
        }
        return env[node_env][variable];
    },
    secure: function(variable) {
        if (!process.env[variable]) {
            throw new Error("config.secure: Missing environment variable! " + variable);
        }
        return process.env[variable];
    }
}

module.exports = configFunctions;
var env = require('./env');

module.exports = function(variable) {
    var node_env = process.env.NODE_ENV || 'development';
    
    if (!env[node_env][variable]) {
        throw new Error("config.js: Missing environment variable! " + node_env + " " + variable);
    }
    return env[node_env][variable];
}
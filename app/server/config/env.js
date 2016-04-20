module.exports = {
    development: {
        db_url: "mongodb://localhost/valiantLocal",
        session_collection: "userSessions"
    },
    production: {
        db_url: "mongodb://caligula:bee7iePahm@ds019628.mlab.com:19628/heroku_fr79ltg7",
        session_collection: "userSessions"    
    }
}
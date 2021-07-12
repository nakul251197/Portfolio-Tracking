const fs = require('fs');

module.exports = {
    development: {
        username: "root",
        password: "",
        database: "portfolio_tracker",
        host: "127.0.0.1",
        dialect: "mysql"
    }, 
    production: {
        connectString: process.env.CLEARDB_DATABASE_URL,
        dialect: "mysql"
    }
};
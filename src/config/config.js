const fs = require('fs');

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        host: process.env.DB_HOST,
        dialect: "mysql",
        connectString: process.env.CLEARDB_DATABASE_URL,
        // dialect: "mysql"
    }, 
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB,
        host: process.env.DB_HOST,
        connectString: process.env.CLEARDB_DATABASE_URL,
        dialect: "mysql"
    }
};
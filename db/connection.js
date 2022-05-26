const mysql = require('mysql2');
const config = require('config');
const user = config.get("server.user");
const pw = config.get("server.password");

const db = mysql.createConnection(
    {
    host: 'localhost',
    user: user,
    password: pw,
    database: 'the_office'
    },

    console.log(`You're successfully connected to The Office Database!`)

);

module.exports = db;
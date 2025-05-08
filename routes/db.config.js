const { config } = require("dotenv");
const sql = require("mysql2");
config()
// const { Pool } = require('pg');

const db = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})



module.exports = db;
const sql = require("mysql2");
const mysql = require('mysql2/promise');
const dotenv = require("dotenv").config();
// const { Pool } = require('pg');

const db = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})



module.exports = db;
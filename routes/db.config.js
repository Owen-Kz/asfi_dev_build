const sql = require("mysql2");
const dotenv = require("dotenv").config();

const db = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})
// Ensure the connection is closed when your application exits
process.on('exit', () => {
    db.end((err) => {
        if (err) {
            console.error('Error closing the connection:', err);
        } else {
            console.log('Connection closed.');
        }
    });
});

const { Pool } = require('pg');
// const dotenv = require("dotenv").config();

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE
  
});

// Rest of your code using the 'pool' for database operations 
module.exports = pool
module.exports = db;

// module.exports = { 
//     pool,
//     db
// }
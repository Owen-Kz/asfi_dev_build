const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;


// Function to execute a query
async function executeQuery(query) {
    const client = new Client({ 
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      });
  try {
    await client.connect()
    .then(() => console.log('Connected to the database on port 2020'))
    .catch(error => console.error('Error connecting to the database', error));

    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    throw new Error('Error executing query: ' + error.message);
  } finally {
    await client.end();
  }
}

module.exports = {
  executeQuery
};

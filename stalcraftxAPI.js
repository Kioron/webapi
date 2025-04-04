const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());

const connection = mysql.createConnection({
    host: 'bqfzsdsupckxhow6d4bz-mysql.services.clever-cloud.com',
    user: 'u61i8q9oyiohckaz',
    password: 'jDp5wcXcdBMhMWwxAcw6',
    database: 'bqfzsdsupckxhow6d4bz'
  });

  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err);
      return;
    }
    console.log('Connected to MySQL database!');
  });

  app.get('/queststable', (req, res) => {
    const { page = 1, limit = 5, search = "", bandit, covenant } = req.query;
    const offset = (page - 1) * limit;
  
    // Base query for fetching quests
    let query = 'SELECT * FROM queststable WHERE 1=1';
    const params = [];
  
    // Apply search filter
    if (search) {
      query += ' AND QuestName LIKE ?';
      params.push(`%${search}%`);
    }
  
    // Apply faction filters
    if (bandit === "true") {
      query += ' AND Faction = "Bandit"';
    }
  
    if (covenant === "true") {
      query += ' AND Faction = "Covenant"';
    }
  
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
  
    // Query to fetch filtered quests
    connection.query(query, params, (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // Query to count total filtered results
        let countQuery = 'SELECT COUNT(*) AS total FROM queststable WHERE 1=1';
        const countParams = [];
  
        // Apply the same filters for the count query
        if (search) {
          countQuery += ' AND QuestName LIKE ?';
          countParams.push(`%${search}%`);
        }
  
        if (bandit === "true") {
          countQuery += ' AND Faction = "Bandit"';
        }
  
        if (covenant === "true") {
          countQuery += ' AND Faction = "Covenant"';
        }
  
        connection.query(countQuery, countParams, (err, countResults) => {
          if (err) {
            res.status(500).send(err);
          } else {
            const total = countResults[0].total;
            res.json({ quests: results, total });
          }
        });
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  module.exports = app;
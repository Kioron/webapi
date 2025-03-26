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
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;
  
    connection.query('SELECT COUNT(*) AS total FROM queststable', (err, countResults) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
  
      const total = countResults[0].total;
  
      connection.query(
        'SELECT * FROM queststable LIMIT ? OFFSET ?',
        [parseInt(limit), parseInt(offset)],
        (err, results) => {
          if (err) {
            res.status(500).send(err);
          } else {
            const hasMore = offset + results.length < total;
            res.json({ quests: results, total, hasMore });
          }
        }
      );
    });
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  module.exports = app;
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    //to refactor into a separate function later
    let query;
    if (req.query.city && req.query.category) {
      query = `SELECT * FROM maps where city = '${req.query.city}' AND category = '${req.query.category}'`;
    } else if (req.query.city) {
      query = `SELECT * FROM maps where city = '${req.query.city}'`;
    } else if (req.query.category) {
      query = `SELECT * FROM maps where category = '${req.query.category}'`;
    } else {
      query = `SELECT * FROM maps`;
    }
    console.log(query);
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    let query = `SELECT * FROM maps WHERE id = ${req.params.id}`;
    console.log(query);
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id/map_points", (req, res) => {
    let query = `SELECT * FROM map_points WHERE map_id = ${req.params.id}`;
    console.log(query);
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;

  };

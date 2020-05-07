const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

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

  router.post("/", (req, res) => {
    if (!req.body.layers) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const layers = req.body.layers
    const mapQuery = `INSERT INTO maps (user_id, city, category) VALUES ($1, $2, $3) RETURNING *;`;
    const mapValues = [1, 'toronto','food'];
    db.query(mapQuery, mapValues)
    .then(dbRes => {
      const mapID = dbRes.rows[0].id
      const mapPointsValues = [];
      let mapPointsQuery = `INSERT INTO map_points (map_id, layers, title) VALUES`;
      let count = 1;
      for(const layer of JSON.parse(layers)) {
        let l = JSON.stringify(layer);
        if (mapPointsValues.length > 0) {
          mapPointsQuery += ',';
        }
        mapPointsQuery += ` ($${count},$${count+1},$${count+2})`
        mapPointsValues.push(mapID, l, 'Title');
        count += 3;
      }
      return db.query(mapPointsQuery, mapPointsValues);
    })
    .then(dbRes => {
      const maps = dbRes.rows;
        res.json({ maps })
    })
    .catch( err => console.log(err))
  });

  return router;
};

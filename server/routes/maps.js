const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM maps;`)
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
    // console.log(req.body.items)
    if (!req.body.items) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    const items = req.body.items
    const mapQuery = `INSERT INTO maps (user_id, city) VALUES ($1, $2) RETURNING *;`;
    const mapValues = [1, 'toronto'];
    db.query(mapQuery, mapValues)
    .then(dbRes => {
      const mapID = dbRes.rows[0].id
      const mapPointsQuery = `INSERT INTO map_points (map_id, item, title) VALUES ($1, $2, $3) RETURNING *;`;
      const mapPointsValues = [mapID, items, 'Title'];
      return db.query(mapPointsQuery, mapPointsValues)
    })
    .then(dbRes => console.log(dbRes))
    .catch( err => console.log(err))
  });

  router.get("/:id/maps/new")

  return router;
};

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
    console.log("hello world")
    console.log(req.body)
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    console.log(req.body)
  });

  router.get("/:id/maps/new")

  return router;
};

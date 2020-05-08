/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db, dbHelpers) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    let query = `SELECT * FROM users WHERE id = ${req.params.id};`;
    console.log(query);
    db.query(query)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:id/favorites", (req, res) => {
    let query = `SELECT * FROM favorites WHERE user_id = ${req.params.id};`;
    console.log(query);
    db.query(query)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/favorites", (req, res) => {
    let query = `INSERT INTO favorites (user_id, map_id) VALUES (${req.body.user_id}, ${req.body.map_id}) RETURNING *;`;
    console.log(query);
    db.query(query)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.delete("/:id/favorites", (req, res) => {
    let query = `DELETE FROM favorites WHERE user_id = ${req.body.user_id} AND map_id = ${req.body.map_id} RETURNING *;`;
    console.log(query);
    db.query(query)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post('/register',  (req, res) => {

    const {email, password, city, name} = req.body;
    dbHelpers.createNewUser(email, password, city, name)
    .then(data => {
      console.log(data)
      console.log(data.rows[0].id)
      req.session.user_id =  data.rows[0].id;
      // $('#login-error').text('').slideUp();
      res.json( {email} );

    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  router.post("/login", (req, res) => {
    const {email , password} = req.body;
    dbHelpers.findUser(email, password)
    .then(id => {
      if (id) {
      req.session.user_id =  id;
      // res.redirect(`/api/users/${id}`);
      res.json( {id, email} );
    } else {
      res.sendStatus(400);
    }})
    .catch(err => {
      console.log(err)
      res.sendStatus(400);
    })
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.sendStatus(200);
    // res.redirect('/urls');
  });


  return router;
};

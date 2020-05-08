const bcrypt = require('bcrypt');

module.exports = (db) => {

  const getUserByEmail = (email) => {
    const query = `SELECT * FROM users WHERE email = '${email}'`
    return db.query(query)

  };

  const findUser = (eml, pass) => {

    const query = `SELECT id, email, password FROM users WHERE email = '${eml}' ` //and password = '${hashedPassword}'`
    return db.query(query)
    .then( dbRes => {
      if(dbRes.rows.length > 0) {
        const  {id,email, password}  = dbRes.rows[0]
        if (email === eml && bcrypt.compareSync(pass, password)) {
        return id;
        }
      }
     return ;
    })
    .catch(err => console.log(err))

  };
  //calls getuserbyemail function to check if email exists
  const createNewUser = (email, password, city, name) => {
    return getUserByEmail(email)
    .then(dbRes => {
      if (dbRes.rows.length === 0) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = 'INSERT INTO users (name, email, password, city, profile_image) values ($1,$2,$3,$4, $5) RETURNING id'
        const values = [name,  email, hashedPassword, city, 'https://i.imgur.com/3GvwNBf.png'];
        return db.query(query, values)

      }

    })

  };

  return {

    getUserByEmail,
    findUser,
    createNewUser
  };

};

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'playero01',
    database: 'iseeyou-db'
  }
});

const app = express();

app.use(bodyParser.json());

app.use(cors());


// ROOT Route
app.get('/', (req, res) => {
  res.send(database.users);
})

// SIGNIN Route
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to get user'))
        } else {
          res.status(400).json('Invalid credentials')
        }
      })
      .catch(err => res.status(400).json('Invalid credentials'))
})

// REGISTER Route
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('Unable to register'))
})

// PROFILE Route

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({
    id: id
  })
  .then(user => {
    user.length ? res.json(user[0]) : res.status(400).json('Not found...')
  })
  .catch(err => res.status(400).json('error getting user'))
//  if (!found) {
//    res.status(400).json('User not found');
//  }
})

// RANK Route

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

const port = 3001;
app.listen(port, () => {
  console.log('App is live on port ' + port);
})


/*

ROOT Route
/ --> res = this is working

SIGNIN Route
/signin --> POST = responds with success or fail

REGISTER Route
/register --> POST = returns user

PROFILE Route
/profile/:userid --> GET = user

RANK Route
/image --> PUT --> updates count in user object

*/

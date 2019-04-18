const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());

app.use(cors());

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'apples',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
}

// ROOT Route
app.get('/', (req, res) => {
  res.send(database.users);
})

// SIGNIN Route
app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
      res.json(database.users[0]);
    } else {
      res.status(400).json('Invalid username or password');
    }
})

// REGISTER Route
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log(hash)
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  })
  res.json(database.users[database.users.length-1])
})

// PROFILE Route

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id ) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) {
    res.status(400).json('User not found');
  }
})

// RANK Route

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id ) {
      found = true;
      user.entries++
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('User not found');
  }
})



// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3001, () => {
  console.log('App is live on port 3001');
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

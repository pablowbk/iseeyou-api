const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'playero01',
    database: 'iseeyou-db'
  }
});

// initiate ExpressJS
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());


// ROOT Route
app.get('/', (req, res) => {
  res.send(database.users);
})

// SIGNIN Route
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })

// REGISTER Route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

// PROFILE Route
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })

// RANK Route
app.put('/image', (req, res) => { image.handleImagePut(req, res, db) })

// API CALL Route
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// start server and set port
app.listen(process.env.PORT || 3001, () => {
  console.log('App is live on port ' + process.env.PORT);
})
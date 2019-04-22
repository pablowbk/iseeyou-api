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


app.get('/', (req, res) => { res.send('It is alive!!!') })  // ROOT Route
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })  // SIGNIN Route
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // REGISTER Route
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) }) // PROFILE Route
app.put('/image', (req, res) => { image.handleImagePut(req, res, db) }) // RANK Route
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) }) // API CALL Route


app.listen(process.env.PORT || 3001, () => {               // start server and set port
  console.log('App is live on port ' + process.env.PORT);
})
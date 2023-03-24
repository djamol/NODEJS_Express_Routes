const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//MongoDB connection
const mongoDB = 'mongodb://localhost:27017/user_todos_posts';
mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//User schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  todos: [
    {
      title: String,
      description: String,
      isCompleted: { type: Boolean, default: false }
    }
  ],
  posts: [
    {
      text: String,
      comments: [
        {
          text: String,
          author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }
      ]
    }
  ]
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, function (err, hashedPassword) {
    if (err) {
      return next(err);
    }
    user.password = hashedPassword;
    next();
  });
});

const UserModel = mongoose.model('User', UserSchema);

//Middleware and utility functions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

//Routes
app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }
const newUser = new UserModel({ name, email, password });
  await newUser.save();

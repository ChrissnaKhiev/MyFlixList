const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/user'); // Create this model in a separate file
require('dotenv').config()

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRETKEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Serialize and Deserialize user (to store user in session)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use LocalStrategy with Passport
passport.use(new LocalStrategy(User.authenticate()));

// Routes
app.get('/', (req, res) => res.send('Hello World!'));

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error registering user');
    }
    passport.authenticate('local')(req, res, () => {
      res.send('User registered successfully');
    });
  });
});

// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
}));

// Dashboard route (authenticated users only)
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.send(`Welcome, ${req.user.username}!`);
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./models/user');
const cors = require('cors');
require("dotenv").config({path: "../.env"}); 

const app = express();

mongoose.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRETKEY, resave: true, saveUninitialized: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use LocalStrategy with Passport
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and Deserialize user (to store user in session)
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get('/', (req, res) => res.send('Hello World!'));

// Register route
app.post('/register', (req, res) => {
  // check watchlist
  const { username, password } = req.body;
  const newUser = new User({ username, watchlist: [] });

  User.register(newUser, password, (err, user) => {
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
  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user.watchlist);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error fetching user data');
    });
});

// Watchlist Route (authenticated users only)
app.post('/add-to-watchlist', isLoggedIn, (req, res) => {
  const { title, year } = req.body;

  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      const newMovie = { title, year }; // Add more fields as needed
      user.watchlist.push(newMovie);

      return user.save();  // Save the updated user document
    })
    .then(() => {
      res.send('Movie added to watchlist successfully');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error adding movie to watchlist');
    });
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

// Add the /profile endpoint
app.get('/profile', isLoggedIn, (req, res) => {
  res.json({
    username: req.user.username,
    email: req.user.email, // Add other user-specific fields as needed
  });
});

// Add the /watchlist endpoint
app.get('/watchlist', isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user.watchlist);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error fetching watchlist');
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

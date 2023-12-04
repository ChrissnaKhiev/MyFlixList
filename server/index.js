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
app.use(express.json());

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
      return res.status(500).send(err.message);
    }
    passport.authenticate('local')(req, res, () => {
      res.status(200).send({ message: 'User registered successfully'});
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

app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); 
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Watchlist Route (authenticated users only)
app.post('/add-to-watchlist', isLoggedIn, (req, res) => {
  const { title, year, genre, poster } = req.body;
  console.log("Request body:", req.body);
  console.log(req.body);

  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      const newMovie = { title, year, genre, poster }; 
      user.watchlist.push(newMovie);

      return user.save();  
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
  console.log('Logout request received');

  req.logout((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Error destroying session:', destroyErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Logout successful');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
});

app.post('/remove-from-watchlist', isLoggedIn, (req, res) => {
  const { movieId } = req.body;

  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Remove the movie from the watchlist
      user.watchlist = user.watchlist.filter(movie => movie._id.toString() !== movieId);

      return user.save();
    })
    .then(() => res.send('Movie removed from watchlist successfully'))
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error removing movie from watchlist');
    });
});


// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send({ error: 'Not authenticated' });
}

// Profile route
app.get('/profile', isLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }

      res.json({
        username: user.username,
        watchlist: user.watchlist
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error fetching user data');
    });
});


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

// Async error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

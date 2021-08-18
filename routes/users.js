const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model (mongoDB schema)
const User = require('../models/User');

// Login page | GET /login
router.get('/login', (req, res) => {
  res.render('login');
});

// Register page | GET /register
router.get('/register', (req, res) => {
  res.render('register');
});

// Register Handle | POST /register
router.post('/register', (req, res) => {
  const {
    name, email, password, password2,
  } = req.body;
  const errors = [];

  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check if passwords match
  if (password !== password2) {
    errors.push({ msg: 'passwords do not match' });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: 'password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    User.findOne({ email }).then((user) => {
      if (user) {
        // User exists
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        // User doesn't exist --> create new User
        const newUser = new User({
          name,
          email,
          password,
        });

        // Hash password
        bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // set password to hash
          newUser.password = hash;
          // save user
          newUser
            .save()
            .then((user) => {
              req.flash('success_msg', 'You are now registered and can log in');
              res.redirect('/users/login');
            })
            .catch((err) => console.log(err));
        }));
      }
    });
  }
});

// Login Handle | POST /login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
});

// Logout handle | POST /logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;

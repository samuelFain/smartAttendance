const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');

// handle /participants endpoints
router.use('/participants', require('./participants'));

// handle /sessions endpoints
router.use('/session', require('./session'));

// handle /attendance_log endpoints
router.use('/attendance_log', require('./attendance_log'));

// handle /statistics endpoints
router.use('/statistics', require('./statistics'));

// About page | GET /about
router.get('/about', (req, res) => {
  res.render('about');
});

// Statistics page | GET /about
router.get('/statistics', (req, res) => {
  res.render('statistics');
});

// Dashboard page | Get /dashboard
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    name: req.user.name,
    userId: req.user.id,
  });
});

module.exports = router;

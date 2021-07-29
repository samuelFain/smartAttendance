const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

// Dashboard page | Get /dashboard
router.get('/', ensureAuthenticated, (req, res) => {
	res.render('dashboard', {
		name: req.user.name,
	});
});

router.get('/session', (req, res) => {
	res.render('session');
});

// About page | GET /about
router.get('/about', (req, res) => {
	res.render('About');
});

// Statistics page | GET /about
router.get('/statistics', (req, res) => {
	res.render('Statistics');
});

// Statistics page | GET /participants
router.get('/participants', (req, res) => {
	res.render('participants');
});

module.exports = router;

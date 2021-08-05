const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

//handle /participants endpoints
router.use('/participants', require('../routes/participants'));

// handle /sessions endpoints
router.use('/session', require('../routes/session'));

//handle /attendance_log endpoints
router.use('/attendance_log', require('../routes/attendance_log'));

// About page | GET /about
router.get('/about', (req, res) => {
	res.render('About');
});

// Statistics page | GET /about
router.get('/statistics', (req, res) => {
	res.render('Statistics');
});

// Dashboard page | Get /dashboard
router.get('/', ensureAuthenticated, (req, res) => {
	res.render('dashboard', {
		name: req.user.name,
		userId: req.user.id,
	});
});

module.exports = router;

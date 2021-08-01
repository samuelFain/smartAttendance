const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureAuthenticated} = require('../config/auth');

//handle /participants endpoints
router.use('/participants' ,require('../routes/participants'));

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

// Attendance log page | GET /attendance_log
router.get('/attendance_log', (req, res) => {
	res.render('attendance_log');
});

// Dashboard page | Get /dashboard
router.get('/', ensureAuthenticated, (req, res) => {
	res.render('dashboard', {
		name: req.user.name,
		userId: req.user.id,
	});
});

module.exports = router;

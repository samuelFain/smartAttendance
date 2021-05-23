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

router.get('/session',  (req, res) => {
	res.render('session')
});



module.exports = router;

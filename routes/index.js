const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// Welcome page | GET /
router.get('/', (req, res) => {
	res.render('welcome');
});

// // Dashboard page | Get /dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) => {
// 	res.render('dashboard', {
// 		name: req.user.name,
// 	});
// });

// webcam demo page | Get /demo
router.get('/demo', (req, res) => {
	res.render('demo');
});

module.exports = router;

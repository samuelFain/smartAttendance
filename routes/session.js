const express = require('express');
const router = express.Router();
// const {createTinyFaceDetector, awaitMediaLoaded} = require('face-api.js');
// const face_api = require('face-script.js');
const Participant = require('../models/Participant');
const User = require('../models/User');
const Session = require('../models/Session');

// create new session in DB | POST /session/create
router.post('/create', (req, res) => {
	// console.log(req);
	console.log(req.session.passport.user);
});

// start new session | GET /session/
router.get('/', (req, res) => {
	res.render('session');
});

module.exports = router;

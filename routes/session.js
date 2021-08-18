const express = require('express');

const router = express.Router();
const Participant = require('../models/Participant');
const User = require('../models/User');
const Session = require('../models/Session');
const Detection = require('../models/Detection');

// FUNCTION: 'create_session' | create new session
async function create_session(user_id, detected_names) {
  try {
    const user = await User.findById(user_id);
    if (user) {
      const new_session = new Session({ user });
      for (let i = 0; i < detected_names.length; i++) {
        const elem = detected_names[i].split(' ');
        // console.log(elem[0], elem[1]);
        const participant = await Participant.findOne({ first_name: elem[0], last_name: elem[1] });
        // console.log(participant);
        if (participant) {
          new_session.participants.push(participant);
        }
      }
      return new_session.save();
    }
  } catch (err) {
    console.log(err.message);
  }
}

// FUNCTION: 'update_successful_detections' | update successful detections in DB
async function update_successful_detections(number_to_add) {
  try {
    const detection = await Detection.findById('61028e82069fce3023aead31');
    const curr_successful = detection.successful;
    if (detection) {
      const new_successful = curr_successful + number_to_add;
      Detection.findOneAndUpdate({}, { successful: new_successful }, { new: true }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
      });
      return detection.successful;
    }
  } catch (err) {
    console.log(err.message);
  }
}

// FUNCTION: 'detected_names_reduction' |  detected names array duplicates reduction
function detected_names_reduction(detected_names) {
  const new_array = [];
  detected_names.forEach((name) => {
    if (!new_array.includes(name)) {
      new_array.push(name);
    }
  });
  return new_array;
}

// create new session in DB | POST /session/create
router.post('/create', (req, res) => {
  const detected_names = detected_names_reduction(req.body);
  const new_session = create_session(req.session.passport.user, detected_names);
  new_session
    .then((ns) => {
      update_successful_detections(ns.participants.length);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// start new session | GET /session/
router.get('/', (req, res) => {
  res.render('session');
});

module.exports = router;

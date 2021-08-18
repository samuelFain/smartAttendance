const express = require('express');

const router = express.Router();
const Participant = require('../models/Participant');
const User = require('../models/User');
const Session = require('../models/Session');

// FUNCTION: 'get_all_participants' | returns array of all participants belong to a specific user
async function get_user_sessions(user_id) {
  const data = [];
  try {
    const user = await User.findById(user_id);
    const sessions = await Session.find({ user: user_id });
    for (let i = 0; i < sessions.length; i++) {
      const curr_participants = [];
      for (let j = 0; j < sessions[i].participants.length; j++) {
        if (user.participants.includes(sessions[i].participants[j])) {
          const participant = await Participant.findById(sessions[i].participants[j]);
          if (participant) {
            curr_participants.push({
              first_name: participant.first_name,
              last_name: participant.last_name,
              id: participant.id,
              obj_id: participant._id,
            });
          }
        }
      }
      data.push({ user, participants: curr_participants, date: sessions[i].date });
    }
    return data;
  } catch (err) {
    console.log(err.message);
  }
}

// Attendance-log page | GET /attendance_log
router.get('/', (req, res) => {
  get_user_sessions(req.user).then((data) => {
    res.render('attendance_log', { user: req.user, sessions: data });
  });
});

module.exports = router;

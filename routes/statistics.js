const express = require('express');

const router = express.Router();
const Participant = require('../models/Participant');
const Session = require('../models/Session');

function sessions_attended(sessions, participant_id) {
  let cnt = 0;
  sessions.forEach((sessions) => {
    if (sessions.participants.includes(participant_id)) {
      cnt++;
    }
  });
  return cnt;
}

async function get_participants_statistics(user) {
  const stats = [];
  try {
    const sessions = await Session.find({ user: user._id });
    if (sessions.length > 0) {
      for (let i = 0; i < user.participants.length; i++) {
        let attended = sessions_attended(sessions, user.participants[i]);
        const percent = `${Math.floor((attended / sessions.length) * 100)}%`;
        attended = `${attended} / ${sessions.length}`;
        // eslint-disable-next-line no-await-in-loop
        const p = await Participant.findById(user.participants[i]);
        stats.push({
          first_name: p.first_name,
          last_name: p.last_name,
          id: p.id,
          attended,
          score: percent,
        });
      }
    }
    return stats;
  } catch (err) {
    console.log(err.message);
  }
}

// statistics page | GET /statistics
router.get('/', (req, res) => {
  const promise = get_participants_statistics(req.user).then((stats) => {
    res.render('statistics', { user: req.user, stats });
  });
});

module.exports = router;

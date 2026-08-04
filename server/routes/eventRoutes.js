const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, admin, createEvent);

module.exports = router;

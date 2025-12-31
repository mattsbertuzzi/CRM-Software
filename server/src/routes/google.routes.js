const express = require('express');
const {verifyToken} = require('../utils/authentication');

// Import controllers
const {oAuthClient, redirectUsers, getAuthToken, addCalendarEvent} = require('../controllers/google.controllers');


const router = express.Router();

// Authenticate users
router.get('/calendar/auth', verifyToken, redirectUsers);

// Get token
router.get('/auth/token', verifyToken, getAuthToken);

// Add calendar event
router.post('/calendar/events/new', verifyToken, addCalendarEvent);

module.exports = router;
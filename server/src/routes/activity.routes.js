const express = require('express');
const {verifyToken} = require('../utils/authentication');

// Import controllers
const {fetchAllActivities, fetchActivitiesForDeals, fetchActivitiesByCustomer, fetchActivitiesByContact, fetchActivitiesByAssignedUser, fetchActivitiesByType,fetchActivityById, createActivity, updateActivityById, deleteActivityById} = require('../controllers/activity.controllers');

const router = express.Router();

// Get all activities
router.get('/', verifyToken, fetchAllActivities);

// Get activities by type
router.get('/type/:type', verifyToken, fetchActivitiesByType);

// Get activities by assigned user
router.get('/assignedUser/:userId', verifyToken, fetchActivitiesByAssignedUser);

// Get activities for contacts
router.get('/forContacts', verifyToken, fetchActivitiesByContact);

// Get activities for customers
router.get('/forCustomers', verifyToken, fetchActivitiesByCustomer);

// Get activities for deals
router.get('/forDeals', verifyToken, fetchActivitiesForDeals);

// Get activity by ID
router.get('/:id', verifyToken, fetchActivityById);

// Create new activity
router.post('/', verifyToken, createActivity);

// Update activity by ID
router.put('/:id', verifyToken, updateActivityById);

// Delete activity by ID
router.delete('/:id', verifyToken, deleteActivityById);

// Add calendar event

module.exports = router;
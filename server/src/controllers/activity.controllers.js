const Activity = require('../models/activity.model');
const User = require('../models/user.model');
const Contact = require('../models/contact.model');
const Customer = require('../models/customer.model');
const Deal = require('../models/deal.model');

// Get all activities
const fetchAllActivities = async (req, res) => {
    const activities = await Activity.find();
    if (!activities) {
        return res.status(404).json({ message: 'No activities found' });
    }
    return res.status(200).json(activities);
};

// Get activity by ID
const fetchActivityById = async (req, res) => {
    const activityId = req.params.id;
    const activity = await Activity.findOne({ id: activityId });
    if (!activity) {
        return res.status(404).json({ message: `Activity not found with ID: ${activityId}` });
    }
    return res.status(200).json(activity);
};

// Get activities by type
const fetchActivitiesByType = async (req, res) => {
    const type = req.params.type;
    const activities = await Activity.find({ type: type });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: `No activities found with type: ${type}` });
    }
    return res.status(200).json(activities);
};

// Get activities by assigned user
const fetchActivitiesByAssignedUser = async (req, res) => {
    const userId = req.params.userId;
    const activities = await Activity.find({ assignedTo: userId });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: `No activities found assigned to user ID: ${userId}` });
    }
    return res.status(200).json(activities);
};

// Get activities for contacts
const fetchActivitiesForContacts = async (req, res) => {
    const activities = await Activity.find({ relatedModel: 'Contact' });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: 'No activities found for contacts' });
    }
    return res.status(200).json(activities);
};

// Get activities for customers
const fetchActivitiesForCustomers = async (req, res) => {
    const activities = await Activity.find({ relatedModel: 'Customer' });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: 'No activities found for customers' });
    }
    return res.status(200).json(activities);
};

// Get activities for deals
const fetchActivitiesForDeals = async (req, res) => {
    const activities = await Activity.find({ relatedModel: 'Deal' });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: 'No activities found for deals' });
    }
    return res.status(200).json(activities);
};

// Get activities by related customer
const fetchActivitiesByCustomer = async (req, res) => {
    const customerId = req.params.customerId;
    const activities = await Activity.find({ relatedModel: 'Customer', relatedTo: customerId });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: `No activities found related to customer ID: ${customerId}` });
    }
    return res.status(200).json(activities);
};

// Get activities by related contact
const fetchActivitiesByContact = async (req, res) => {
    const contactId = req.params.contactId;
    const activities = await Activity.find({ relatedModel: 'Contact', relatedTo: contactId });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: `No activities found related to contact ID: ${contactId}` });
    }
    return res.status(200).json(activities);
};

// Get activities by related deal
const fetchActivitiesByDeal = async (req, res) => {
    const dealId = req.params.dealId;
    const activities = await Activity.find({ relatedModel: 'Deal', relatedTo: dealId });
    if (!activities || activities.length === 0) {
        return res.status(404).json({ message: `No activities found related to deal ID: ${dealId}` });
    }
    return res.status(200).json(activities);
};

// Create new activity
const createActivity = async (req, res) => {
    try {
        // Get required fields
        const {
            type,
            subject,
            date
        } = req.body;
        if (!type || !subject || !date) {
            return res.status(400).json({ 'message': 'New activity cannot be created. Required fields are missing' });
        }
        // Get optional fields
        const {
            description,
            relatedTo,
            relatedModel,
            assignedTo
        } = req.body;
        // Validate relatedModel if relatedTo is provided
        if (relatedTo && !['Deal', 'Customer', 'Contact'].includes(relatedModel)) {
            return res.status(400).json({ 'message': 'Invalid relatedModel. Must be one of: Deal, Customer, Contact' });
        };
        // Fetch related resource to ensure it exists
        if (relatedTo && relatedModel){
            if (relatedModel === 'Deal'){
                const relatedRecord = await Deal.findById(relatedTo);
            };
            if (relatedModel === 'Customer'){
                const relatedRecord = await Customer.findById(relatedTo);
            };
            if (relatedModel === 'Contact'){
                const relatedRecord = await Contact.findById(relatedTo);
            };
        };
        // Validate assignedTo user if provided
        if (assignedTo){
            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser){
                return res.status(400).json({ 'message': `Assigned user not found with ID: ${assignedTo}` });
            };
        }; 

        // Create new resource in DB
        const activity = await Activity.create({
            type: type,
            subject: subject,
            description: description ?? '',
            date: date,
            relatedTo: relatedRecord._id ?? null,
            relatedModel: relatedModel ?? null,
            assignedTo: assignedUser._id ?? null
        });
        // Send server response
        return res.status(201).json({
            'message': 'New activity created',
            'activity': activity
        });
    } catch (error) {
        return res.status(500).json({ 'message': 'Error creating activity', 'error': error.message });
    }
};

// Update activity by ID
const updateActivityById = async (req, res) => {
    try {
        const activityId = req.params.id;
        if (!activityId) {
            return res.status(400).json({ message: 'Activity ID is required for update' });
        };
        const updatedData = req.body;
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'No data provided for update' });
        };
        // Find and update the activity
        const activity = await Activity.Activity.findOneAndUpdate({id: activityId}, updatedData, { new: true });
        if (!activity) {
            return res.status(404).json({ message: `Activity not found with ID: ${activityId}` });
        };
        return res.status(200).json(activity);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating activity', error: error.message });
    };
};

// Delete activity by ID
const deleteActivityById = async (req, res) => {
    const activityId = req.params.id;
    const activity = await Activity.findOneAndDelete({ id: activityId });
    if (!activity) {
        return res.status(404).json({ message: `Activity not found with ID: ${activityId}` });
    };
    return res.status(200).json({ message: `Activity with ID: ${activityId} deleted successfully` });    
};


module.exports = {
    fetchAllActivities,
    fetchActivityById,
    fetchActivitiesByType,
    fetchActivitiesByAssignedUser,
    fetchActivitiesForContacts,
    fetchActivitiesForCustomers,
    fetchActivitiesForDeals,
    fetchActivitiesByCustomer,
    fetchActivitiesByContact,
    fetchActivitiesByDeal,
    createActivity,
    updateActivityById,
    deleteActivityById
};
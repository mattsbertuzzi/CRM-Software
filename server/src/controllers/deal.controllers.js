const Deal = require('../models/deal.model');
const Customer = require('../models/customer.model');
const User = require('../models/user.model');
const { create } = require('../models/contact.model');

// Get all deals
const fetchAllDeals = async (req, res) => {
    const deals = await Deal.find();
    if (!deals) {
        return res.status(404).json({ message: 'No deal found' });
    }
    return res.status(200).json(deals);
};

// Get customer by ID
const fetchDealById = async (req, res) => {
    const dealId = req.params.id;
    const deal = await Deal.findOne({ id: dealId });
    if (!deal) {
        return res.status(404).json({ message: `Deal not found with ID: ${dealId}` });
    }
    return res.status(200).json(deal);
};

// Create new deal
const createDeal = async (req, res) => {
    try {
        // Get required fields
        const {
            title,
            value,
            customer,
            owner
        } = req.body;
        if (!title || !value || !customer || !owner) {
            return res.status(400).json({ 'message': 'New deal cannot be created. Required fields are missing' });
        };
        // Get optional fields
        const {
            stage,
            expectedCloseDate,
        } = req.body;
        // Validate related resources
        const dealOwner = await User.findById(owner);
        if (!dealOwner) {
            return res.status(404).json({ message: `Owner not found with ID: ${owner}` });
        }
        const ownerId = dealOwner._id;
        const refCustomer = await Customer.findById(customer);
        if (!refCustomer) {
            return res.status(404).json({ message: `Customer not found with ID: ${customer}` });
        }
        const customerId = refCustomer._id;
        // Create new resource in DB
        const deal = await Deal.create({
            title: title,
            value: value,
            customer: customerId,
            assignedTo: ownerId,
            stage: stage ?? 'lead',
            expectedCloseDate: expectedCloseDate ?? null
        });
        return res.status(201).json(deal);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating deal', error: error.message });
    };
};

// Update deal by ID
const updateDealById = async (req, res) => {
    try {
        const dealId = req.params.id;
        if (!dealId) {
            return res.status(400).json({ message: 'Deal ID is required for update' });
        };
        const updatedData = req.body;
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'No data provided for update' });
        };
        // Find and update the deal
        const deal = await Deal.findOneAndUpdate({ id: dealId }, updatedData, { new: true });
        if (!deal) {
            return res.status(404).json({ message: `Deal not found with ID: ${dealId}` });
        };
        return res.status(200).json(deal);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating deal', error: error.message });
    };
};

// Delete deal by ID
const deleteDealById = async (req, res) => {
    const dealId = req.params.id;
    const deal = await Deal.findOneAndDelete({ id: dealId });
    if (!deal) {
        return res.status(404).json({ message: `Deal not found with ID: ${dealId}` });
    };
    return res.status(200).json({ message: `Deal with ID: ${dealId} deleted successfully` });
};

// Change deal stage by ID
const changeDealStageById = async (req, res) => {
    try {
        const dealId = req.params.id;
        if (!dealId) {
            return res.status(400).json({ message: 'Deal ID is required to change stage' });
        };
        const { stage } = req.body;
        if (!stage) {
            return res.status(400).json({ message: 'New stage is required to change stage' });
        };
        // Find and update the deal stage
        const deal = await Deal.findOneAndUpdate({ id: dealId }, { stage: stage }, { new: true });
        if (!deal) {
            return res.status(404).json({ message: `Deal not found with ID: ${dealId}` });
        };
        return res.status(200).json(deal);
    } catch (error) {
        return res.status(500).json({ message: 'Error changing deal stage', error: error.message });
    };
};

module.exports = {
    fetchAllDeals,
    fetchDealById,
    updateDealById,
    createDeal,
    deleteDealById,
    changeDealStageById
};





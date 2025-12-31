const Customer = require('../models/customer.model');
const Deal = require('../models/deal.model');
const User = require('../models/user.model');
const Activity = require('../models/activity.model');

// Email sending service import
const { sendEmail } = require('./google.controllers');

// Get all customers
const fetchAllCustomers = async (req, res) => {
    const customers = await Customer.find();
    if (!customers) {
        return res.status(404).json({ message: 'No customers found' });
    }
    return res.status(200).json(customers);
};

// Get customer by ID
const fetchCustomerById = async (req, res) => {
    const customerId = req.params.id;
    const customer = await Customer.findOne({id: customerId});
    if (!customer) {
        return res.status(404).json({ message: `Customer not found with ID: ${customerId}` });
    }
    return res.status(200).json(customer);
}

// Create new contact
const createCustomer = async (req, res) => {
    try {
        // Get required fields
        const {
            firstName,
            lastName,
            email
        } = req.body;
        if (!firstName || !lastName || !email) {
            res.status(400).json({ 'message': 'New customer cannot be created. Required fields are missing' });
        }
        // Get optional fields
        const {
            phone,
            address,
            company,
            position,
            contact,
            deals,
            customerValue
        } = req.body;
        // Create new resource in DB
        const customer = await Customer.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone ?? '',
            address: address ?? '',
            company: company ?? '',
            position: position ?? '',
            contact: contact ?? null,
            deals: deals ?? [],
            customerValue: customerValue ?? 0
        });
        return res.status(201).json(customer);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

// Update customer by ID
const updateCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const updatedData = req.body;
        const customer = await Customer.findOneAndUpdate({id: customerId}, updatedData, { new: true });
        if (!customer) {
            return res.status(404).json({ message: `Customer not found with ID: ${customerId}` });
        }
        return res.status(200).json(customer);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

// Delete customer by ID
const deleteCustomerById = async (req, res) => {
    try {
        const customerId = req.params.id;
        const customer = await Customer.findOneAndDelete({id: customerId});
        if (!customer) {
            return res.status(404).json({ message: `Customer not found with ID: ${customerId}` });
        }
        return res.status(200).json({ message: `Customer with ID: ${customerId} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};

// Create deal from customer
const createDealFromCustomer = async (req, res) => {
    try {
        const customerId = req.params.id;
        const data = req.body;
        // Fetch customer from ID
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: `Customer not found with ID: ${customerId}` });
        }
        // Fetch related user if assignedTo is provided
        if (data.assignedTo) {
            const user = await User.findById(data.assignedTo);
            if (!user) {
                return res.status(404).json({ message: `User not found with ID: ${data.assignedTo}` });
            }
        }
        // Create new deal linked to this customer
        const deal = await Deal.create({
            title: data.title,
            value: data.value,
            stage: data.stage,
            customer: customer._id,
            expectedCloseDate: data.expectedCloseDate ?? null,
            assignedTo: user ? user._id : null
        });
        // Update customer's deals array
        customer.deals.push(deal._id);
        await customer.save();
        return res.status(201).json(deal);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating deal', error: error.message });
    }
};

// Send email to customer
const sendEmailToCustomer = async(req,res) => {
    try {
        const customerId = req.params.id;
        const { subject, text } = req.body;
        const customer = await Customer.findOne({id: customerId});
        if (!customer) {
            return res.status(404).json({ message: `Customer not found with ID: ${customerId}` });
        };
        // Create activity
        const activity = await Activity.create({
            type: 'email',
            subject: subject,
            date: Date.now(),
            relatedModel: 'Customer',
            relatedTo: customer._id
        });
        // Send email
        await sendEmail(customer.email, subject, text);
        return res.status(200).json({ message: 'Email sent successfully to customer' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending email to customer', error: error.message });
    };
};

module.exports = {
    fetchAllCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
    createDealFromCustomer,
    sendEmailToCustomer
};





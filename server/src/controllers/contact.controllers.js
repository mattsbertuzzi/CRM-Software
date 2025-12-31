const Contact = require('../models/contact.model');
const Customer = require('../models/customer.model');
const Activity = require('../models/activity.model');

// Email sending service import
const { sendEmail } = require('./google.controllers');
// Get all contacts
const fetchAllContacts = async (req, res) => {
    const contacts = await Contact.find();
    if (!contacts) {
        return res.status(404).json({ message: 'No contacts found' });
    }
    return res.status(200).json(contacts);
};

// Get one contact by ID
const fetchContactById = async (req, res) => {
    const contactId = req.params.id;
    const contact = await Contact.findOne({id: contactId});
    if (!contact) {
        return res.status(404).json({ message: `Contact not found with ID: ${contactId}` });
    }
    return res.status(200).json(contact);
}

// Create new contact
const createContact = async (req, res) => {
    try {
        // Get required fields
        const {
            firstName,
            lastName,
            email
        } = req.body;
        if (!firstName || !lastName || !email) {
            res.status(400).json({ 'message': 'New contact cannot be created. Required fields are missing' });
        }
        // Get optional fields
        const {
            phone,
            position,
            customer
        } = req.body;
        // Create new resource in DB
        const contact = await Contact.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone ?? '',
            position: position ?? '',
            customer: customer ?? null
        });
        return res.status(201).json(contact);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

// Update contact by ID
const updateContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        const contact = await Contact.findOneAndUpdate({id:contactId}, updatedData, { new: true });
        if (!contact) {
            return res.status(404).json({ message: `Contact not found with ID: ${contactId}` });
        }
        return res.status(200).json(contact);
    } catch (error) {
        return res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

// Delete contact by ID
const deleteContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contact.findOneAndDelete({id: contactId});
        if (!contact) {
            return res.status(404).json({ message: `Contact not found with ID: ${contactId}` });
        }
        return res.status(200).json({ message: `Contact with ID: ${contactId} deleted successfully` });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

// Create customer from contact
const createCustomerFromContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const data = req.body;
        // Fetch contact from ID
        const contact = await Contact.findOne({id: contactId});
        if (!contact) {
            return res.status(404).json({ message: `Contact not found with ID: ${contactId}` });
        }
        // Create new customer using contact data
        const newCustomer = await Customer.create({
            firstName: contact.firstName,
            lastName: contact.lastName,
            company: data.company ?? '',
            contact: contact._id,
            email: contact.email,
            phone: contact.phone ?? '',
            address: data.address ?? ''
        });
        // Update contact to link to new customer
        contact.customer = newCustomer._id;
        await contact.save();
        return res.status(201).json({
            message: 'New customer created from contact',
            customer: newCustomer
        });
    } catch (e) {
        return res.status(500).json({ message: 'Error converting contact into new customer', error: e.message });
    };
};

// Send email to contact
const sendEmailToContact = async(req,res) => {
    try {
        const contactId = req.params.id;
        const { subject, text } = req.body;
        const contact = await Contact.findOne({id: contactId});
        if (!contact) {
            return res.status(404).json({ message: `Contact not found with ID: ${contactId}` });
        };
        // Create activity
        const activity = await Activity.create({
            type: 'email',
            subject: subject,
            date: Date.now(),
            relatedModel: 'Contact',
            relatedTo: contact._id
        });
        // Send email
        await sendEmail(contact.email, subject, text);
        return res.status(200).json({ message: 'Email sent successfully to contact' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending email to contact', error: error.message });
    };
};

module.exports = {
    fetchAllContacts,
    fetchContactById,
    createContact,
    updateContactById,
    deleteContactById,
    createCustomerFromContact,
    sendEmailToContact
};





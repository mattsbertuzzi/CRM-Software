const express = require('express');
const { verifyToken } = require('../utils/authentication');

// Import controllers
const { fetchAllContacts, fetchContactById, createContact, updateContactById, deleteContactById, createCustomerFromContact, sendEmailToContact } = require('../controllers/contact.controllers');

const router = express.Router();

// Get all contacts
router.get('/', verifyToken, fetchAllContacts);

// Get one contact by ID
router.get('/:id', verifyToken, fetchContactById);

// Create new contact
router.post('/', verifyToken, createContact);

// Update contact by ID
router.put('/:id', verifyToken, updateContactById);

// Delete contact by ID
router.delete('/:id', verifyToken, deleteContactById);

// Create customer from contact
router.post('/:id/create-customer', verifyToken, createCustomerFromContact);

// Send email to contact
router.post('/:id/send-email', verifyToken, sendEmailToContact);

module.exports = router;
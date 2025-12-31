const express = require('express');
const {verifyToken} = require('../utils/authentication');

// Import controllers
const {fetchAllCustomers, fetchCustomerById, createCustomer, updateCustomerById, deleteCustomerById, createDealFromCustomer, sendEmailToCustomer} = require('../controllers/customer.controllers');

const router = express.Router();

// Get all customers
router.get('/', verifyToken, fetchAllCustomers);

// Get customer by ID
router.get('/:id', verifyToken, fetchCustomerById);

// Create new customer
router.post('/', verifyToken, createCustomer);

// Update customer by ID
router.put('/:id', verifyToken, updateCustomerById);

// Create new deal from customer ID
router.post('/:id/create-deal', verifyToken, createDealFromCustomer);

// Send email to customer
router.post('/:id/send-email', verifyToken, sendEmailToCustomer);

// Delete customer by ID
router.delete('/:id', verifyToken, deleteCustomerById);


module.exports = router;
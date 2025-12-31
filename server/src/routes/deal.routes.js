const express = require('express');
const {verifyToken} = require('../utils/authentication');

// Import controllers
const {fetchAllDeals, fetchDealById, createDeal, updateDealById, deleteDealById, changeDealStageById} = require('../controllers/deal.controllers');

const router = express.Router();

// Get all deals
router.get('/', verifyToken, fetchAllDeals);

// Get one deal by ID
router.get('/:id', verifyToken, fetchDealById);

// Create new deal
router.post('/', verifyToken, createDeal);

// Update deal by ID
router.put('/:id', verifyToken, updateDealById);

// Change deal stage by ID
router.patch('/:id/change-stage', verifyToken, changeDealStageById);

// Delete deal by ID
router.delete('/:id', verifyToken, deleteDealById);

module.exports = router;
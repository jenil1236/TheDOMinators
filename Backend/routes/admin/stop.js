const express = require("express");
const router = express.Router();
const { getStopsList, createStop, updateStop, deleteStop } = require("../../controllers/admin/stop.js")

// Get all stops
router.get('/', getStopsList);

// Create a stop
router.post('/', createStop);

// Update a stop
router.put('/:id', updateStop);

// Delete a stop
router.delete('/:id', deleteStop);

module.exports = router;
const express = require('express');
const router = express.Router();

// Sample routes for CRM System

// GET all items
router.get('/', (req, res) => {
  res.json({ message: 'Get all items' });
});

// GET single item
router.get('/:id', (req, res) => {
  res.json({ message: 'Get item ' + req.params.id });
});

// POST create item
router.post('/', (req, res) => {
  res.json({ message: 'Item created', data: req.body });
});

// PUT update item
router.put('/:id', (req, res) => {
  res.json({ message: 'Item ' + req.params.id + ' updated' });
});

// DELETE item
router.delete('/:id', (req, res) => {
  res.json({ message: `Item ${req.params.id} deleted` });
});

module.exports = router;
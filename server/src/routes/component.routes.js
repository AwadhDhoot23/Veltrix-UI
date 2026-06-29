const express = require('express');
const router = express.Router();
const {
  getComponents,
  getComponentBySlug,
  createComponent,
  updateComponent,
  deleteComponent,
} = require('../controller/component.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes (anyone can see components)
router.get('/', getComponents);
router.get('/:slug', getComponentBySlug);

// Private routes (requires user validation)
router.post('/', protect, createComponent);
router.put('/:id', protect, updateComponent);
router.delete('/:id', protect, deleteComponent);

module.exports = router;

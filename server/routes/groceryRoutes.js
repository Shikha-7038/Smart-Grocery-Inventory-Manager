// server/routes/groceryRoutes.js
const express = require('express');
const router = express.Router();
const {
  createGroceryItem,
  getGroceryItems,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  updateQuantity,
} = require('../controllers/groceryController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateGroceryItem,
  checkValidation,
} = require('../middleware/validationMiddleware');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .post(validateGroceryItem, checkValidation, createGroceryItem)
  .get(getGroceryItems);

router.route('/:id')
  .get(getGroceryItemById)
  .put(updateGroceryItem)
  .delete(deleteGroceryItem);

router.patch('/:id/quantity', updateQuantity);

module.exports = router;
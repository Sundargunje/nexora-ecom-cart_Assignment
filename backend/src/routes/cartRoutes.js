const express = require('express');
const router = express.Router();
const {
    addItemToCart,
    getCart,
    removeItemFromCart,
    mockCheckout
} = require('../controllers/cartController');

router.get('/', getCart);
router.post('/', addItemToCart);
router.delete('/:id', removeItemFromCart);
router.post('/checkout', mockCheckout);

module.exports = router;

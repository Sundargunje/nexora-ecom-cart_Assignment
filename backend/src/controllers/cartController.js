const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({ productId });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new CartItem({
        productId,
        quantity
      });
      await cartItem.save();
    }

    await exports.getCart(req, res);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('productId');
    const items = cartItems.map(item => ({
      id: item._id,
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity
    }));
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    res.status(200).json({
      items,
      total: parseFloat(total.toFixed(2)),
      count: items.length
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to retrieve cart' });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item successfully removed' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Failed to remove item' });
  }
};

exports.mockCheckout = async (req, res) => {
  try {
    const cartItems = await CartItem.find().populate('productId');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty. Cannot checkout.' });
    }

    const items = cartItems.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity
    }));
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const orderId = 'TXN-' + Date.now();
    const order = new (require('../models/Order'))({
      orderId,
      total: parseFloat(total.toFixed(2)),
      items
    });
    await order.save();

    // Clear the cart
    await CartItem.deleteMany({});

    const receipt = {
      orderId,
      total: parseFloat(total.toFixed(2)),
      date: new Date().toISOString(),
      items
    };

    res.status(200).json(receipt);
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

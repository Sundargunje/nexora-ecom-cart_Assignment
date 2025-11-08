const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB.');

    // Seed mock products if collection is empty
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const mockProducts = [
        { name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation', price: 199.99, image: '/Wireless Headphones.jpg' },
        { name: 'Smart Watch', description: 'Fitness tracking smartwatch with heart rate monitor', price: 299.99, image: '/Smart Watch.jpg' },
        { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand for better ergonomics', price: 79.99, image: '/Laptop Stand.jpg' },
        { name: 'Bluetooth Speaker', description: 'Portable waterproof Bluetooth speaker', price: 149.99, image: '/Bluetooth Speaker.jpg' },
        { name: 'Gaming Mouse', description: 'RGB gaming mouse with programmable buttons', price: 89.99, image: '/Gaming Mouse.jpg' },
        { name: 'USB-C Hub', description: 'Multi-port USB-C hub with HDMI and USB ports', price: 59.99, image: '/USB-C Hub.jpg' },
        { name: 'Wireless Keyboard', description: 'Mechanical wireless keyboard with backlit keys', price: 129.99, image: '/Wireless Keyboard.jpg' },
        { name: 'Phone Case', description: 'Protective phone case with card holder', price: 24.99, image: '/Phone Case.jpg' }
      ];

      await Product.insertMany(mockProducts);
      console.log('Mock products inserted.');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

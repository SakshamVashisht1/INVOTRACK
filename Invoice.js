// models/Invoice.js
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  receiptId: {
    type: String,
    unique: true, // Ensure the receipt ID is unique
    required: true, // Make it mandatory
  },
  customerName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  products: [
    {
      productName: String,
      quantity: Number,
      amount: Number,
      tax: Number,
      total: Number,
    },
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);

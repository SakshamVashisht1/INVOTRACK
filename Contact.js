const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;

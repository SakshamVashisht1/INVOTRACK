const Contact = require("../Models/Contact");

exports.submitContact = async (req, res) => {
  try {
    const { email } = req.body;

    // Basic validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Create new contact entry
    const newContact = new Contact({ email });
    await newContact.save();

    res.status(201).json({ message: 'Contact submitted successfully' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

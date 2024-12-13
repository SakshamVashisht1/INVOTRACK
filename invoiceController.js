// // controllers/invoiceController.js
// const Invoice = require('../Models/Invoice');

// exports.createInvoice = async (req, res) => {
//   try {
//     const { customerName, phoneNumber, emailAddress, address, products, totalAmount } = req.body;
//     const invoice = new Invoice({ customerName, phoneNumber, emailAddress, address, products, totalAmount });
//     await invoice.save();
//     res.status(201).json({ message: 'Invoice created successfully', invoice });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to create invoice', error });
//   }
// };


// // controllers/invoiceController.js


// exports.getInvoices = async (req, res) => {
//   try {
//     const invoices = await Invoice.find(); // Retrieve all invoices from the database
//     res.status(200).json(invoices);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to retrieve invoices', error });
//   }
// };

// exports.deleteInvoice = async (req, res) => {
//   const { id } = req.params; // Extract the invoice ID from the URL parameters

//   try {
//     const deletedInvoice = await Invoice.findByIdAndDelete(id); // Find and delete the invoice by ID

//     if (!deletedInvoice) {
//       return res.status(404).json({ message: 'Invoice not found' });
//     }

//     res.status(200).json({ message: 'Invoice deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete invoice', error: error.message });
//   }
// };

const Invoice = require('../Models/Invoice');

// Function to generate a unique receipt ID
const generateReceiptId = () => {
  const timestamp = Date.now().toString();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `INV-${timestamp}-${randomNum}`;
};

// Create Invoice
exports.createInvoice = async (req, res) => {
  try {
    const { customerName, phoneNumber, email, address, products, totalAmount } = req.body;

    // Generate a unique receipt ID
    const receiptId = generateReceiptId();

    // Create a new invoice
    const invoice = new Invoice({
      receiptId, // Include the generated receipt ID
      customerName,
      phoneNumber,
      email,
      address,
      products,
      totalAmount,
    });

    await invoice.save(); // Save the invoice to the database

    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create invoice', error });
  }
};

// Get All Invoices
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find(); // Retrieve all invoices from the database
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoices', error });
  }
};

// Delete Invoice
exports.deleteInvoice = async (req, res) => {
  const { id } = req.params; // Extract the invoice ID from the URL parameters

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id); // Find and delete the invoice by ID

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete invoice', error: error.message });
  }
};


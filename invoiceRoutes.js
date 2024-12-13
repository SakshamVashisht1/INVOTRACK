const express = require('express');
const router = express.Router();
const invoiceController = require('../Controllers/invoiceController'); // Adjust the path if needed

router.post('/invoice', invoiceController.createInvoice);

// Route to get all invoices
router.get('/invoice', invoiceController.getInvoices);

router.delete('/invoice/:id', invoiceController.deleteInvoice); // Define the delete route

module.exports = router;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthRouter = require('./Routes/AuthRouter');
const ProductRouter = require('./Routes/ProductRouter');
const contactRoutes = require('./Routes/contactRoutes');
const invoiceRoutes = require('./Routes/invoiceRoutes');

dotenv.config();
require('./Models/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Use express.json() instead of bodyParser.json()
app.use(cors());

// Test Route
app.get('/ping', (req, res) => {
    res.send('PING');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/products', ProductRouter);
app.use('/api/contacts', contactRoutes); // Mount contact routes under /api/contacts
app.use('/api/invoices', invoiceRoutes); // Mount invoice routes under /api/invoices

// Server Listening
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});

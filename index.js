const express = require('express');
const cors = require('cors');
const authRouter = require('./Routes/AuthRouter');
const invoiceRoutes = require('./Routes/invoiceRoutes');
require('dotenv').config();
require('./Models/db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

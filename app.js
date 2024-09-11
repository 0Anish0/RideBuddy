require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./config/db');

const Register = require('./routes/register');
const Login = require('./routes/login');
const OfferRide = require('./routes/offerRide');
const BookRide = require('./routes/bookRide');
const Wallet = require('./routes/wallet');
const Vehical = require('./routes/vehicle');
const Emergency = require('./routes/emergencyContacts');
const Verification = require('./routes/verification');
const Message = require('./routes/message');
const Prompt = require('./routes/prompt');
const Intrest = require('./routes/intrest');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());

// Routes
app.use('/api', Register);
app.use('/api', Login);
app.use('/api', OfferRide);
app.use('/api', BookRide);
app.use('/api', Wallet);
app.use('/api', Vehical);
app.use('/api', Emergency);
app.use('/api', Verification);
app.use('/api', Message);
// app.use('/api', Intrest);
app.use('/api', Prompt);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
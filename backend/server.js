const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and handle CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Client_details', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for user data
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Define a schema for adoption data
const adoptionSchema = new mongoose.Schema({
  petName: String,
  name: String,
  address: String,
  email: String,
  phone: String,
  reasons: String
});
const Adoption = mongoose.model('Adoption', adoptionSchema);

// Handle POST request from adoption form
app.post('/submit-adoption', (req, res) => {
  const { petName, name, address, email, phone, reasons } = req.body;

  // Save the form data to MongoDB
  const adoption = new Adoption({
    petName,
    name,
    address,
    email,
    phone,
    reasons
  });

  adoption.save()
    .then(() => {
      console.log('Form data saved successfully!');
      res.json({ message: 'Form submitted successfully!' });
    })
    .catch((err) => {
      console.error('Error saving form data:', err);
      res.status(500).json({ error: 'Error saving form data' });
    });
});

// Handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });

  newUser.save()
    .then(() => {
      console.log('User registered successfully!');
      res.json({ message: 'User registered successfully!' });
    })
    .catch((err) => {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Error registering user' });
    });
});

// Handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username, password })
    .then(user => {
      if (user) {
        console.log('Login successful!');
        res.json({ message: 'Login successful!' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    })
    .catch((err) => {
      console.error('Error logging in:', err);
      res.status(500).json({ error: 'Error logging in' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

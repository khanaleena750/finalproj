const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const { body } = require('express-validator');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Set a cookie to indicate that the user is logged in
    res.cookie('loggedIn', true, { httpOnly: true });

    return res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Logout route
app.post('/logout', (req, res) => {
  // Clear the loggedIn cookie to log the user out
  res.clearCookie('loggedIn');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Signup route
app.post('/signup', async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;

  try {
    // Check if the email or username already exists in the database
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Set a cookie to indicate that the user is logged in
    res.cookie('loggedIn', true, { httpOnly: true });

    // Return a success message
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Serve static files 
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

// Serve the index.html page for all requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loginandsignup', {
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
}, { collection: 'validation' });

const User = mongoose.model('User', userSchema);




// Admin schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { collection: 'admin' });

const Admin = mongoose.model('Admin', adminSchema);




// Admin dashboard schema
const adminDashboardSchema = new mongoose.Schema({
  userCount: { type: Number, required: true },
  systemStatus: { type: String, required: true },
  // Add more fields as needed
});

const AdminDashboard = mongoose.model('AdminDashboard', adminDashboardSchema);

// Middleware to ensure only admins can access admin routes
const adminAuthMiddleware = (req, res, next) => {
  const adminLoggedIn = req.cookies.adminLoggedIn;

  if (!adminLoggedIn) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  next();
};




// Admin routes

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the provided username and password match the admin credentials
    if (username === 'admin123' && password === 'admin123') {
      // Set a cookie to indicate that the admin is logged in
      res.cookie('adminLoggedIn', true, { httpOnly: true });
      return res.json({ success: true, message: 'Admin logged in successfully' });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/admin/dashboard', adminAuthMiddleware, async (req, res) => {
  try {
    // Implement admin dashboard logic here
    const adminDashboardData = await AdminDashboard.find(); // Example: Fetch data from AdminDashboard collection
    res.json({ success: true, data: adminDashboardData });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/admin/logout', (req, res) => {
  res.clearCookie('adminLoggedIn');
  res.json({ success: true, message: 'Admin logged out successfully' });
});


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


// Define a schema for survey data
const surveySchema = new mongoose.Schema({
  questionNumber: Number,
  panelName: String,
  question: String,
  answer: String,
});

const newSurveySchema = new mongoose.Schema({
  username: String,
  surveyData: [surveySchema],
});

// Create a model based on the schema
const Survey = mongoose.model('Survey', newSurveySchema);


// Handle POST request to /surveyForm// Handle POST request to /surveyForm
// Handle POST request to /surveyForm
app.post('/surveyForm', async (req, res) => {
  let appendedData = [];
  try {
    // Loop through each question and save it to the database
    for (const key in req.body) {
      const { panelName, question, answer } = req.body[key];
      appendedData.push({ panelName, question, answer: answer[`question_${key}`] });
    }

    const username = "user";

    await Survey.create({ username, surveyData: appendedData }); // Corrected line

    // Return a success message
    res.status(200).json({ success: true, message: 'Survey data saved successfully' });
  } catch (error) {
    console.error("Error while saving survey data:", error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});




// Serve static files for index.html
app.use('/images', express.static(path.join(__dirname, '..', 'images')));
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')));

// Serve static files for admin.html
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'html', 'admin.html'));
});

app.use('/admin/css', express.static(path.join(__dirname, '..', 'admin', 'css')));
app.use('/admin/js', express.static(path.join(__dirname, '..', 'admin', 'js')));

// Serve admin.html if admin is logged in
app.get('*', (req, res) => {
  if (req.cookies.adminLoggedIn) {
    res.redirect('/admin.html');
  } else {
    res.sendFile(path.join(__dirname, '..', 'html', 'index.html'));
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

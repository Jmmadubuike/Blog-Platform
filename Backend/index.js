const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
// Use a more specific route for comments
app.use('/api/posts/:postId/comments', commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const agentRoutes = require('./routes/agentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const deploymentRoutes = require('./routes/deploymentRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/agents', agentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deployment', deploymentRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Axiom API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
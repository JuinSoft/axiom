const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: String, // Wallet address
    required: true,
  },
  configuration: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'deployed', 'inactive'],
    default: 'draft',
  },
  deploymentDetails: {
    network: {
      type: String,
      enum: ['mainnet', 'testnet', 'devnet'],
    },
    contractAddress: String,
    deploymentDate: Date,
    lastActive: Date,
    transactions: {
      type: Number,
      default: 0,
    },
  },
  marketplace: {
    isListed: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
    category: {
      type: String,
      enum: ['finance', 'analytics', 'trading', 'social', 'utility', 'other'],
    },
    downloads: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
AgentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Agent', AgentSchema); 